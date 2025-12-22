const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { Client, Databases } = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.DATABASE_ID || '693703ef001133c62d78';
const COLLECTION_ID = 'Lead_Intakes';

console.log('🔧 Config:', { ENDPOINT, PROJECT_ID: PROJECT_ID ? '✓ set' : '✗ missing', API_KEY: API_KEY ? '✓ set' : '✗ missing' });

if (!API_KEY || !PROJECT_ID) {
    console.error("❌ ERROR: Missing APPWRITE_API_KEY or APPWRITE_PROJECT_ID in .env file");
    process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

// New attributes to add to leads_intake
const newAttributes = [
    { key: 'linkedin_url', type: 'url', required: false },
    { key: 'x_url', type: 'url', required: false },
    { key: 'instagram_url', type: 'url', required: false },
    { key: 'audit_status', type: 'string', size: 32, required: false, default: 'pending' }
];

async function updateCollection() {
    console.log("🚀 Adding new attributes to Lead_Intakes collection...\n");

    for (const attr of newAttributes) {
        try {
            if (attr.type === 'url') {
                await databases.createUrlAttribute(DATABASE_ID, COLLECTION_ID, attr.key, attr.required);
                console.log(`✅ Added: ${attr.key} (URL)`);
            }
            if (attr.type === 'string') {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    COLLECTION_ID,
                    attr.key,
                    attr.size,
                    attr.required,
                    attr.default || null  // Default value
                );
                console.log(`✅ Added: ${attr.key} (String, default: "${attr.default || 'null'}")`);
            }
            // Wait for attribute to be indexed
            await new Promise(r => setTimeout(r, 500));
        } catch (e) {
            if (e.code === 409) {
                console.log(`ℹ️  Attribute ${attr.key} already exists`);
            } else {
                console.error(`❌ Failed to add ${attr.key}:`, e.message);
            }
        }
    }

    console.log("\n✨ Done! Lead_Intakes collection updated.");
}

updateCollection();
