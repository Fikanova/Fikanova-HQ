#!/bin/bash

# Fikanova v5.3 Master Build Script (Debug Edition)
# Includes detailed error logging for Appwrite setup to fix 401 errors.

echo "🚀 Starting Fikanova v5.3 Construction..."

# --- 1. Create Directory Structure ---
mkdir -p appwrite assets/js assets/css functions/kra-invoice functions/crewai-recon functions/impact-monitor
mkdir -p agents/product_lead agents/marketing_lead agents/cfo agents/cto agents/cio

# --- 2. Security Files ---
cat <<EOF > .gitignore
.env
node_modules/
__pycache__/
.DS_Store
EOF

cat <<EOF > .env.example
APPWRITE_ENDPOINT=
APPWRITE_PROJECT_ID=
APPWRITE_API_KEY=
EOF

# --- 3. The Warehouse (Secure Appwrite Setup with Logging) ---
echo "🗄️ Generating Secure Appwrite Schema..."

cat <<'EOF' > appwrite/setup_appwrite.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = 'Fikanova_DB';

if (!API_KEY || !PROJECT_ID) {
    console.error("❌ ERROR: Missing API Keys in .env file.");
    process.exit(1);
}

// SCHEMA DEFINITION
const collections = [
    { name: 'Services', id: 'Services', attributes: [
        { key: 'title', type: 'string', size: 128, required: true },
        { key: 'slug', type: 'string', size: 64, required: true },
        { key: 'category', type: 'string', size: 64, required: true },
        { key: 'short_description', type: 'string', size: 256, required: true },
        { key: 'full_body_markdown', type: 'string', size: 5000, required: false },
        { key: 'tally_form_id', type: 'string', size: 64, required: false },
        { key: 'price_estimate', type: 'string', size: 64, required: false }
    ]},
    { name: 'Pages', id: 'Pages', attributes: [
        { key: 'title', type: 'string', size: 128, required: true },
        { key: 'slug', type: 'string', size: 64, required: true },
        { key: 'content_markdown', type: 'string', size: 5000, required: true },
        { key: 'hero_image', type: 'url', required: false },
        { key: 'meta_description', type: 'string', size: 160, required: false }
    ]},
    { name: 'Clients', id: 'Clients', attributes: [
        { key: 'name', type: 'string', size: 128, required: true },
        { key: 'logo_url', type: 'url', required: true },
        { key: 'website_url', type: 'url', required: false },
        { key: 'status', type: 'string', size: 64, required: true }
    ]},
    { name: 'CaseStudies', id: 'CaseStudies', attributes: [
        { key: 'title', type: 'string', size: 256, required: true },
        { key: 'client_name', type: 'string', size: 128, required: true },
        { key: 'summary_result', type: 'string', size: 256, required: true },
        { key: 'full_story_markdown', type: 'string', size: 5000, required: true },
        { key: 'service_category', type: 'string', size: 64, required: true }
    ]},
    { name: 'Impact_Metrics', id: 'Impact_Metrics', attributes: [
        { key: 'client_reference', type: 'string', size: 128, required: true },
        { key: 'metric_label', type: 'string', size: 64, required: true },
        { key: 'metric_value', type: 'string', size: 64, required: true }
    ]}
];

// SEED DATA
const seedServices = [
    { title: "Web Development", slug: "web-development", category: "Development", short_description: "High-performance websites.", price_estimate: "Starts at KES 35,000", full_body_markdown: "## Fast. Secure. Scalable." },
    { title: "Mobile App Development", slug: "mobile-app-development", category: "Development", short_description: "Native Android & iOS apps.", price_estimate: "Starts at KES 80,000", full_body_markdown: "## Your Business in Their Pocket." },
    { title: "Custom Software", slug: "custom-software", category: "Development", short_description: "Internal tools.", price_estimate: "Custom Quote", full_body_markdown: "## Tailored Solutions." },
    { title: "SEO Optimization", slug: "seo-optimization", category: "Marketing", short_description: "Rank #1 on Google.", price_estimate: "Retainer: KES 15,000/mo", full_body_markdown: "## Be Seen." },
    { title: "Social Media Marketing", slug: "social-media-marketing", category: "Marketing", short_description: "Automated content.", price_estimate: "Retainer: KES 20,000/mo", full_body_markdown: "## Growth on Autopilot." },
    { title: "Content Strategy", slug: "content-strategy", category: "Marketing", short_description: "Brand Storytelling.", price_estimate: "Starts at KES 10,000", full_body_markdown: "## Tell Your Story." },
    { title: "Chatbot Integration", slug: "chatbot-integration", category: "AI and Tech", short_description: "24/7 WhatsApp Support.", price_estimate: "Starts at KES 25,000", full_body_markdown: "## Never Miss a Lead." },
    { title: "AI Automation", slug: "ai-automation", category: "AI and Tech", short_description: "Digital Employees.", price_estimate: "Custom Quote", full_body_markdown: "## Work Smarter." },
    { title: "Tech Consultation", slug: "tech-consultation", category: "AI and Tech", short_description: "Digital Strategy.", price_estimate: "Hourly Rate", full_body_markdown: "## Expert Advice." }
];

const seedPages = [
    { title: "About Us", slug: "about-us", hero_image: "https://via.placeholder.com/1200x400", content_markdown: "## The Fikanova Mission\nWe simplify operations for SMEs using AI Agents.", meta_description: "About Fikanova." },
    { title: "Our Story", slug: "our-story", hero_image: "https://via.placeholder.com/1200x400", content_markdown: "## From Lima Labs to Automation\nA journey of optimizing time, wealth, and knowledge.", meta_description: "The founding story." }
];

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

async function setup() {
    console.log("🚀 Starting DB Setup...");
    
    // 1. Create Database
    try { 
        await databases.create(DATABASE_ID, DATABASE_ID); 
        console.log('✅ DB Created');
    } catch(e) {
        if (e.code === 409) console.log('ℹ️ DB Exists');
        else console.error('❌ DB Creation Failed:', e.message);
    }

    // 2. Create Collections & Attributes
    for (const col of collections) {
        try { 
            await databases.createCollection(DATABASE_ID, col.id, col.name, [Permission.read(Role.any())]); 
            console.log(`✅ Collection ${col.name} Created`);
        } catch(e) {
            if (e.code === 409) console.log(`ℹ️ Collection ${col.name} Exists`);
            else console.error(`❌ Collection ${col.name} Failed:`, e.message);
        }

        for (const attr of col.attributes) {
            try {
                if (attr.type === 'string') await databases.createStringAttribute(DATABASE_ID, col.id, attr.key, attr.size, attr.required);
                if (attr.type === 'url') await databases.createUrlAttribute(DATABASE_ID, col.id, attr.key, attr.required);
                await new Promise(r => setTimeout(r, 200));
            } catch(e) {
                // Ignore attribute exists errors
            }
        }
    }
    
    console.log("⏳ Indexing (3s)...");
    await new Promise(r => setTimeout(r, 3000));

    // 3. Seed Data (Documents)
    try {
        const svc = await databases.listDocuments(DATABASE_ID, 'Services');
        if (svc.total === 0) { 
            console.log("🌱 Seeding Services...");
            for (const s of seedServices) await databases.createDocument(DATABASE_ID, 'Services', ID.unique(), s); 
        } else {
            console.log("ℹ️ Services already seeded.");
        }

        const pg = await databases.listDocuments(DATABASE_ID, 'Pages');
        if (pg.total === 0) { 
            console.log("🌱 Seeding Pages...");
            for (const p of seedPages) await databases.createDocument(DATABASE_ID, 'Pages', ID.unique(), p); 
        } else {
            console.log("ℹ️ Pages already seeded.");
        }
        
        console.log("�� Database Ready.");
    } catch(e) {
        console.error("❌ Document Seeding Failed. CHECK API SCOPES (documents.read, documents.write):", e.message);
    }
}
setup();
EOF

# --- 4. The Workforce (Agents) ---
echo "🤖 Generating Agent Workflows..."
# Product Lead
cat <<'EOF' > agents/product_lead/main_orchestrator.json
{
  "name": "Product Lead Agent",
  "nodes": [
    { "name": "Tally Trigger", "type": "n8n-nodes-base.webhook", "position": [100, 300] },
    { "name": "Gemini Brain", "type": "@n8n/n8n-nodes-langchain.agent", "position": [300, 300] },
    { "name": "HubSpot CRM", "type": "n8n-nodes-base.hubspot", "position": [500, 300] }
  ]
}
EOF
echo '{"name": "Recon Bot", "nodes": []}' > agents/product_lead/sub_recon_bot.json
echo '{"name": "Quotation Generator", "nodes": []}' > agents/product_lead/sub_quotation_bot.json
echo '{"name": "Intake Processor", "nodes": []}' > agents/product_lead/sub_intake_bot.json

# Marketing Lead
echo '{"name": "Marketing Orchestrator", "nodes": []}' > agents/marketing_lead/main_orchestrator.json
echo '{"name": "Case Study Writer", "nodes": []}' > agents/marketing_lead/sub_case_study_bot.json
echo '{"name": "Social Poster", "nodes": []}' > agents/marketing_lead/sub_social_poster.json
echo '{"name": "Newsletter Manager", "nodes": []}' > agents/marketing_lead/sub_newsletter_bot.json

# CFO
echo '{"name": "CFO Orchestrator", "nodes": []}' > agents/cfo/main_orchestrator.json
echo '{"name": "KRA Tax Bot", "nodes": []}' > agents/cfo/sub_kra_tax_bot.json
echo '{"name": "Expense Tracker", "nodes": []}' > agents/cfo/sub_expense_bot.json
echo '{"name": "Runway Calculator", "nodes": []}' > agents/cfo/sub_runway_bot.json

# CTO
echo '{"name": "CTO Orchestrator", "nodes": []}' > agents/cto/main_orchestrator.json
echo '{"name": "Impact Monitor", "nodes": []}' > agents/cto/sub_impact_bot.json
echo '{"name": "Uptime Monitor", "nodes": []}' > agents/cto/sub_uptime_bot.json
echo '{"name": "Repo Watcher", "nodes": []}' > agents/cto/sub_repo_watcher.json

# CIO
echo '{"name": "CIO Orchestrator", "nodes": []}' > agents/cio/main_orchestrator.json
echo '{"name": "Morning Brief", "nodes": []}' > agents/cio/sub_morning_brief.json
echo '{"name": "Meeting Prep", "nodes": []}' > agents/cio/sub_meeting_prep.json

# --- 5. Backend Functions ---
echo "🧠 Generating Cloud Functions..."
cat <<'EOF' > functions/kra-invoice/main.js
module.exports = async function ({ req, res }) {
    if (req.method === "POST") {
        const { amount, type } = JSON.parse(req.body);
        let taxRate = 0.16;
        if (type === "TOT") taxRate = 0.03;
        return res.json({ net: amount, tax: amount * taxRate, gross: amount * (1 + taxRate) });
    }
    return res.json({ error: "Post method required" });
};
EOF
echo '{"name": "kra-invoice","runtime": "node-18.0","entrypoint": "main.js"}' > functions/kra-invoice/appwrite.json

cat <<'EOF' > functions/crewai-recon/main.py
def main(context):
    url = context.req.body.get('url')
    return context.res.json({"status": "analyzed", "url": url})
EOF
echo "crewai" > functions/crewai-recon/requirements.txt
echo '{"name": "crewai-recon","runtime": "python-3.9","entrypoint": "main.py"}' > functions/crewai-recon/appwrite.json

# --- 6. Storefront Templates ---
echo "📄 Generating Storefront..."
cat <<EOF > service.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Fikanova Service</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/appwrite@14.0.0"></script>
</head>
<body class="bg-gray-50 font-sans">
    <div id="nav-placeholder"></div>
    <header class="bg-blue-900 text-white py-20 text-center">
        <h1 id="page-title" class="text-4xl font-bold">Loading...</h1>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <article id="page-content" class="md:col-span-2 prose max-w-none text-gray-700"></article>
        <aside class="md:col-span-1">
            <div id="tally-container"></div>
        </aside>
    </main>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>
EOF

cp service.html page.html
echo "<h1>Portfolio</h1>" > portfolio.html
echo "<h1>Impact</h1>" > impact.html
echo "<h1>Newsletter</h1>" > newsletter.html
echo "<h1>Resources</h1>" > resources.html

# --- 7. Frontend Logic ---
echo "🧠 Generating JS Logic..."
cat <<'EOF' > assets/js/main.js
import { Client, Databases, Query } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0";

const client = new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject('YOUR_PROJECT_ID'); // UPDATE THIS
const db = new Databases(client);
const DB_ID = 'Fikanova_DB';

function loadNav() {
    const navHTML = `
    <nav class="bg-white shadow sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <a href="index.html" class="font-bold text-2xl text-blue-600">Fikanova</a>
            <div class="hidden md:flex space-x-8">
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Solutions ▾</button>
                    <div class="absolute left-0 mt-4 w-[600px] bg-white shadow-xl rounded-lg p-6 hidden group-hover:grid grid-cols-3 gap-4 border" id="nav-solutions">Loading...</div>
                </div>
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Company ▾</button>
                    <div class="absolute left-0 mt-4 w-48 bg-white shadow-xl rounded-lg py-2 hidden group-hover:block border">
                        <a href="page.html?s=about-us" class="block px-4 py-2 hover:bg-gray-50">About Us</a>
                        <a href="page.html?s=our-story" class="block px-4 py-2 hover:bg-gray-50">Our Story</a>
                        <a href="impact.html" class="block px-4 py-2 hover:bg-gray-50">Impact</a>
                    </div>
                </div>
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Work ▾</button>
                    <div class="absolute left-0 mt-4 w-48 bg-white shadow-xl rounded-lg py-2 hidden group-hover:block border">
                        <a href="portfolio.html" class="block px-4 py-2 hover:bg-gray-50">Portfolio</a>
                        <a href="portfolio.html" class="block px-4 py-2 hover:bg-gray-50">Case Studies</a>
                        <a href="resources.html" class="block px-4 py-2 hover:bg-gray-50">Resources</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;
    const ph = document.getElementById('nav-placeholder');
    if(ph) { ph.innerHTML = navHTML; fetchServicesMenu(); }
}

async function fetchServicesMenu() {
    try {
        const res = await db.listDocuments(DB_ID, 'Services', [Query.limit(100)]);
        const cats = ['Development', 'Marketing', 'AI and Tech'];
        let html = '';
        cats.forEach(c => {
            html += `<div><h4 class="font-bold text-blue-900 mb-2 text-xs uppercase">${c}</h4><ul class="space-y-1">`;
            res.documents.filter(d => d.category === c).forEach(s => {
                html += `<li><a href="service.html?s=${s.slug}" class="text-sm text-gray-600 hover:text-blue-600">${s.title}</a></li>`;
            });
            html += `</ul></div>`;
        });
        document.getElementById('nav-solutions').innerHTML = html;
    } catch(e) {}
}

async function loadPageContent() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('s');
    if ((location.pathname.includes('service.html') || location.pathname.includes('page.html')) && slug) {
        const col = location.pathname.includes('service.html') ? 'Services' : 'Pages';
        const res = await db.listDocuments(DB_ID, col, [Query.equal('slug', slug)]);
        if (res.documents.length) {
            const data = res.documents[0];
            document.getElementById('page-title').innerText = data.title;
            document.getElementById('page-content').innerHTML = data.full_body_markdown || data.content_markdown;
            if(col === 'Services') {
                const formId = data.tally_form_id || 'w7e8K1';
                document.getElementById('tally-container').innerHTML = `<iframe src="https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&service=${slug}" width="100%" height="400" frameborder="0"></iframe>`;
            }
        }
    }
}

loadNav();
loadPageContent();
EOF

echo "✅ Fikanova v5.3 Construction Complete."
