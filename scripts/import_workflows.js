const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const N8N_BASE_URL = process.env.N8N_BASE_URL || 'https://n8n-production-e313.up.railway.app';
const N8N_API_KEY = process.env.N8N_API_KEY;
const AGENTS_DIR = path.join(__dirname, '../agents');

if (!N8N_API_KEY) {
    console.error('❌ Error: N8N_API_KEY environment variable is required.');
    console.log('Usage: N8N_API_KEY=your_key node scripts/import_workflows.js');
    process.exit(1);
}

// Utility to recursively find JSON files
function findWorkflowFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            findWorkflowFiles(filePath, fileList);
        } else if (file.endsWith('.json')) {
            // Basic validation check - read file content
            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                if (content.nodes && Array.isArray(content.nodes)) {
                    fileList.push(filePath);
                }
            } catch (e) {
                // Ignore non-JSON or invalid files
            }
        }
    });
    return fileList;
}

// Check if fetch is available (Node 18+), else polyfill with https
const fetchRequest = async (url, method, body = null) => {
    // If global fetch exists, use it
    if (typeof fetch !== 'undefined') {
        const headers = {
            'X-N8N-API-KEY': N8N_API_KEY,
            'Content-Type': 'application/json'
        };
        const options = {
            method,
            headers
        };
        if (body) options.body = JSON.stringify(body);
        
        const response = await fetch(url, options);
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`API Error ${response.status}: ${text}`);
        }
        return response.json();
    } else {
        // Fallback for older Node versions (Manual HTTPS)
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || 443,
                path: urlObj.pathname + urlObj.search,
                method: method,
                headers: {
                    'X-N8N-API-KEY': N8N_API_KEY,
                    'Content-Type': 'application/json'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            resolve(JSON.parse(data));
                        } catch (e) {
                            resolve({}); // Handle empty response
                        }
                    } else {
                        reject(new Error(`API Error ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('error', reject);
            if (body) req.write(JSON.stringify(body));
            req.end();
        });
    }
};

async function main() {
    console.log(`🚀 Starting bulk import to ${N8N_BASE_URL}...`);
    
    try {
        // 1. Get existing workflows to map names to IDs
        console.log('🔍 Fetching existing workflows...');
        const existingWorkflowsRaw = await fetchRequest(`${N8N_BASE_URL}/api/v1/workflows`, 'GET');
        const existingWorkflows = existingWorkflowsRaw.data || [];
        
        const workflowMap = new Map();
        existingWorkflows.forEach(w => workflowMap.set(w.name, w.id));
        console.log(`✅ Found ${existingWorkflows.length} existing workflows.`);

        // 2. Find local files
        const localFiles = findWorkflowFiles(AGENTS_DIR);
        console.log(`📂 Found ${localFiles.length} workflow files in ${AGENTS_DIR}`);

        // 3. Import each file
        for (const filePath of localFiles) {
            const workflowData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const name = workflowData.name || path.basename(filePath, '.json');
            
            // Validate: remove invalid static 'id' fields from nodes if they conflict? 
            // n8n import usually handles this, but API doesn't like workflow ID in body if POSTing
            // We usually post the whole body.
            
            if (workflowMap.has(name)) {
                // UPDATE
                const id = workflowMap.get(name);
                console.log(`🔄 Updating: ${name} (${id})`);
                await fetchRequest(`${N8N_BASE_URL}/api/v1/workflows/${id}`, 'PUT', workflowData);
            } else {
                // CREATE
                console.log(`✨ Creating: ${name}`);
                await fetchRequest(`${N8N_BASE_URL}/api/v1/workflows`, 'POST', workflowData);
            }
        }
        
        console.log('🎉 Bulk import complete!');
        
    } catch (error) {
        console.error('❌ Import failed:', error.message);
        process.exit(1);
    }
}

main();
