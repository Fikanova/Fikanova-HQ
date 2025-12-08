#!/bin/bash

# Fikanova v5.0 Master Build Script
# Architecture: Human Supervisor -> n8n (LangChain) -> Appwrite Functions (CrewAI) -> Storefront

echo "🚀 Starting Fikanova v5.0 Construction..."

# --- 1. Create Directory Structure ---
echo "📂 Creating Directories..."
mkdir -p appwrite
mkdir -p assets/js assets/css
mkdir -p functions/kra-invoice      # Node.js
mkdir -p functions/crewai-recon     # Python
mkdir -p functions/impact-monitor   # Python

# Agent Departments
mkdir -p agents/product_lead
mkdir -p agents/marketing_lead
mkdir -p agents/cfo
mkdir -p agents/cto
mkdir -p agents/cio

# --- 2. The Warehouse (Appwrite Setup Script) ---
echo "🗄️ Generating Appwrite Schema & Seed Data..."

cat <<'EOF' > appwrite/setup_appwrite.js
const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

// --- CONFIGURATION (REPLACE THESE) ---
const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6936df5800371a655e8e'; 
const API_KEY = 'standard_b85cc0aa853c87265645a865e7f18e5227c98f5b2c469b42ecfa628d23049451f79af13697fa6b6db905fdf6d8c9ffe2121d6e07d1b81ab032264271e0886c1f7987d5ecb89d32b5087695223a86c6d4d3cfa2ca0e6d76c71545c484b8eb35a11ece29951997ac248421c523edfd4fde30d350937bd4a2a473e1ffefe6ff779e';       
const DATABASE_ID = '6936e65f0004d492d17c';

// --- SCHEMA DEFINITION ---
const collections = [
    {
        name: 'Services',
        id: 'Services',
        attributes: [
            { key: 'title', type: 'string', size: 128, required: true },
            { key: 'slug', type: 'string', size: 64, required: true },
            { key: 'category', type: 'string', size: 64, required: true }, // Dev, Mkt, AI
            { key: 'short_description', type: 'string', size: 256, required: true },
            { key: 'full_body_markdown', type: 'string', size: 5000, required: false },
            { key: 'tally_form_id', type: 'string', size: 64, required: false },
            { key: 'price_estimate', type: 'string', size: 64, required: false }
        ]
    },
    {
        name: 'Pages',
        id: 'Pages',
        attributes: [
            { key: 'title', type: 'string', size: 128, required: true },
            { key: 'slug', type: 'string', size: 64, required: true },
            { key: 'content_markdown', type: 'string', size: 5000, required: true },
            { key: 'hero_image', type: 'url', required: false },
            { key: 'meta_description', type: 'string', size: 160, required: false }
        ]
    },
    {
        name: 'Clients',
        id: 'Clients',
        attributes: [
            { key: 'name', type: 'string', size: 128, required: true },
            { key: 'logo_url', type: 'url', required: true },
            { key: 'website_url', type: 'url', required: false },
            { key: 'status', type: 'string', size: 64, required: true }
        ]
    },
    {
        name: 'CaseStudies',
        id: 'CaseStudies',
        attributes: [
            { key: 'title', type: 'string', size: 256, required: true },
            { key: 'client_name', type: 'string', size: 128, required: true },
            { key: 'summary_result', type: 'string', size: 256, required: true },
            { key: 'full_story_markdown', type: 'string', size: 5000, required: true },
            { key: 'service_category', type: 'string', size: 64, required: true }
        ]
    },
    {
        name: 'Impact_Metrics',
        id: 'Impact_Metrics',
        attributes: [
            { key: 'client_reference', type: 'string', size: 128, required: true },
            { key: 'metric_label', type: 'string', size: 64, required: true },
            { key: 'metric_value', type: 'string', size: 64, required: true }
        ]
    }
];

// --- SEED DATA ---
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

// --- EXECUTION ---
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

async function setup() {
    try {
        console.log("🚀 Starting Fikanova DB Setup...");
        try { await databases.create(DATABASE_ID, DATABASE_ID); } catch (e) {}

        for (const col of collections) {
            try { await databases.createCollection(DATABASE_ID, col.id, col.name, [Permission.read(Role.any())]); } catch (e) {}
            for (const attr of col.attributes) {
                try {
                    if (attr.type === 'string') await databases.createStringAttribute(DATABASE_ID, col.id, attr.key, attr.size, attr.required);
                    if (attr.type === 'url') await databases.createUrlAttribute(DATABASE_ID, col.id, attr.key, attr.required);
                    await new Promise(r => setTimeout(r, 200));
                } catch (e) {}
            }
        }
        
        console.log("⏳ Waiting for indexing...");
        await new Promise(r => setTimeout(r, 3000));

        // Seed Data (Idempotent)
        const svc = await databases.listDocuments(DATABASE_ID, 'Services');
        if (svc.total === 0) { for (const s of seedServices) await databases.createDocument(DATABASE_ID, 'Services', ID.unique(), s); }
        const pg = await databases.listDocuments(DATABASE_ID, 'Pages');
        if (pg.total === 0) { for (const p of seedPages) await databases.createDocument(DATABASE_ID, 'Pages', ID.unique(), p); }

        console.log("🎉 Warehouse Setup Complete.");
    } catch (e) { console.error(e); }
}
setup();
EOF

# --- 3. The Workforce (Real n8n/LangChain JSONs) ---
echo "🤖 Generating Agent Workforce..."

# 3.1 Product Lead Agent (Main Orchestrator)
cat <<'EOF' > agents/product_lead/main_orchestrator.json
{
  "name": "Product Lead Agent",
  "nodes": [
    {
      "parameters": { "httpMethod": "POST", "path": "tally-webhook", "responseMode": "lastNode" },
      "name": "Tally Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [100, 300]
    },
    {
      "parameters": {
        "text": "Analyze this lead: {{$json.body}}. 1. Classify Value. 2. Draft Quote Structure.",
        "options": {}
      },
      "name": "Gemini Brain",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "typeVersion": 1,
      "position": [300, 300]
    },
    {
      "parameters": { "operation": "create", "name": "={{$json.client_name}}", "dealStage": "new", "amount": "={{$json.budget}}" },
      "name": "HubSpot CRM",
      "type": "n8n-nodes-base.hubspot",
      "typeVersion": 1,
      "position": [500, 300]
    }
  ],
  "connections": {
    "Tally Trigger": { "main": [[{ "node": "Gemini Brain", "type": "main", "index": 0 }]] },
    "Gemini Brain": { "main": [[{ "node": "HubSpot CRM", "type": "main", "index": 0 }]] }
  }
}
EOF

# 3.2 Full Sub-Agent Roster (Placeholders for complex logic)
# Product Team
echo '{"name": "Recon Bot (Crawl4AI)", "nodes": []}' > agents/product_lead/sub_recon_bot.json
echo '{"name": "Intake Processor", "nodes": []}' > agents/product_lead/sub_intake_bot.json
echo '{"name": "Quotation Generator", "nodes": []}' > agents/product_lead/sub_quotation_bot.json

# Marketing Team
echo '{"name": "Marketing Orchestrator", "nodes": []}' > agents/marketing_lead/main_orchestrator.json
echo '{"name": "Case Study Writer", "nodes": []}' > agents/marketing_lead/sub_case_study_bot.json
echo '{"name": "Social Poster", "nodes": []}' > agents/marketing_lead/sub_social_poster.json
echo '{"name": "Newsletter Manager", "nodes": []}' > agents/marketing_lead/sub_newsletter_bot.json

# CFO Team
echo '{"name": "CFO Orchestrator", "nodes": []}' > agents/cfo/main_orchestrator.json
echo '{"name": "Expense Tracker", "nodes": []}' > agents/cfo/sub_expense_bot.json
echo '{"name": "Runway Calculator", "nodes": []}' > agents/cfo/sub_runway_bot.json
echo '{"name": "KRA Tax Bot", "nodes": []}' > agents/cfo/sub_kra_tax_bot.json

# CTO Team
echo '{"name": "CTO Orchestrator", "nodes": []}' > agents/cto/main_orchestrator.json
echo '{"name": "Impact Monitor", "nodes": []}' > agents/cto/sub_impact_bot.json
echo '{"name": "Uptime Monitor", "nodes": []}' > agents/cto/sub_uptime_bot.json
echo '{"name": "Repo Watcher", "nodes": []}' > agents/cto/sub_repo_watcher.json

# CIO Team
echo '{"name": "CIO Orchestrator", "nodes": []}' > agents/cio/main_orchestrator.json
echo '{"name": "Morning Brief", "nodes": []}' > agents/cio/sub_morning_brief.json
echo '{"name": "Meeting Prep", "nodes": []}' > agents/cio/sub_meeting_prep.json

# --- 4. The Backend Functions (KRA & CrewAI) ---
echo "🧠 Generating Cloud Functions..."

# 4.1 KRA Invoice (Node.js)
cat <<'EOF' > functions/kra-invoice/main.js
module.exports = async function ({ req, res }) {
    if (req.method === "POST") {
        const { amount, type } = JSON.parse(req.body);
        let taxRate = 0.16;
        if (type === "TOT") taxRate = 0.03;
        const tax = amount * taxRate;
        return res.json({ net: amount, tax: tax, gross: amount + tax });
    }
    return res.json({ error: "Post method required" });
};
EOF
echo '{"name": "kra-invoice","runtime": "node-18.0","entrypoint": "main.js"}' > functions/kra-invoice/appwrite.json

# 4.2 Recon Bot (Python/CrewAI)
cat <<'EOF' > functions/crewai-recon/main.py
# This is the Specialist Agent Logic
def main(context):
    try:
        url = context.req.body.get('url')
        # Placeholder for CrewAI execution logic
        # In production, this would initialize a CrewAI Agent to scrape the URL
        return context.res.json({"status": "success", "analysis": f"Analyzed {url}"})
    except Exception as e:
        return context.res.json({"error": str(e)})
EOF
echo "crewai" > functions/crewai-recon/requirements.txt
echo '{"name": "crewai-recon","runtime": "python-3.9","entrypoint": "main.py"}' > functions/crewai-recon/appwrite.json

# --- 5. The Storefront Templates ---
echo "📄 Generating HTML Templates..."

# 5.1 Service Template (Dynamic)
cat <<EOF > service.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fikanova Service</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/appwrite@14.0.0"></script>
</head>
<body class="bg-gray-50 font-sans">
    <div id="nav-placeholder"></div>
    <header class="bg-blue-900 text-white py-20 text-center">
        <h1 id="page-title" class="text-4xl font-bold">Loading...</h1>
        <p id="page-subtitle" class="text-xl text-blue-200 mt-2"></p>
    </header>
    <main class="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <article id="page-content" class="md:col-span-2 prose max-w-none text-gray-700"></article>
        <aside class="md:col-span-1">
            <div class="bg-white p-6 rounded shadow sticky top-4">
                <h3 class="font-bold text-lg mb-2">Get a Quote</h3>
                <div id="tally-container"></div>
            </div>
        </aside>
    </main>
    <script type="module" src="assets/js/main.js"></script>
</body>
</html>
EOF

cp service.html page.html
echo "<h1>Portfolio Grid</h1>" > portfolio.html
echo "<h1>Impact Dashboard</h1>" > impact.html
echo "<h1>Newsletter</h1>" > newsletter.html
echo "<h1>Resources</h1>" > resources.html

# --- 6. The Frontend Logic (Menu & Content) ---
echo "🧠 Generating Frontend Logic..."

cat <<'EOF' > assets/js/main.js
import { Client, Databases, Query } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_PROJECT_ID'); // REPLACE THIS

const db = new Databases(client);
const DB_ID = 'Fikanova_DB';

// 1. NAV BUILDER
function loadNav() {
    const navHTML = `
    <nav class="bg-white shadow sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <a href="index.html" class="font-bold text-2xl text-blue-600">Fikanova</a>
            <div class="hidden md:flex space-x-8">
                <!-- Solutions -->
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Solutions ▾</button>
                    <div class="absolute left-0 mt-4 w-[600px] bg-white shadow-xl rounded-lg p-6 hidden group-hover:grid grid-cols-3 gap-4 border" id="nav-solutions">Loading...</div>
                </div>
                <!-- Company -->
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Company ▾</button>
                    <div class="absolute left-0 mt-4 w-48 bg-white shadow-xl rounded-lg py-2 hidden group-hover:block border">
                        <a href="page.html?s=about-us" class="block px-4 py-2 hover:bg-gray-50">About Us</a>
                        <a href="page.html?s=our-story" class="block px-4 py-2 hover:bg-gray-50">Our Story</a>
                        <a href="impact.html" class="block px-4 py-2 hover:bg-gray-50">Impact</a>
                    </div>
                </div>
                <!-- Work -->
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Work ▾</button>
                    <div class="absolute left-0 mt-4 w-48 bg-white shadow-xl rounded-lg py-2 hidden group-hover:block border">
                        <a href="portfolio.html" class="block px-4 py-2 hover:bg-gray-50">Portfolio</a>
                        <a href="portfolio.html" class="block px-4 py-2 hover:bg-gray-50">Case Studies</a>
                        <a href="resources.html" class="block px-4 py-2 hover:bg-gray-50">Resources</a>
                        <a href="newsletter.html" class="block px-4 py-2 hover:bg-gray-50">Newsletter</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;
    const placeholder = document.getElementById('nav-placeholder');
    if(placeholder) {
        placeholder.innerHTML = navHTML;
        fetchServicesMenu();
    }
}

// 2. FETCH MENU CONTENT
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
        const container = document.getElementById('nav-solutions');
        if(container) container.innerHTML = html;
    } catch(e) {}
}

// 3. PAGE CONTENT LOADER
async function loadPageContent() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('s');
    const path = window.location.pathname;
    
    // Service & Page Loading
    if ((path.includes('service.html') || path.includes('page.html')) && slug) {
        const col = path.includes('service.html') ? 'Services' : 'Pages';
        const res = await db.listDocuments(DB_ID, col, [Query.equal('slug', slug)]);
        if (res.documents.length) {
            const data = res.documents[0];
            document.getElementById('page-title').innerText = data.title;
            const sub = document.getElementById('page-subtitle');
            if(sub) sub.innerText = data.short_description || "";
            document.getElementById('page-content').innerHTML = data.full_body_markdown || data.content_markdown;
            
            const formContainer = document.getElementById('tally-container');
            if(formContainer && col === 'Services') {
                const formId = data.tally_form_id || 'w7e8K1';
                formContainer.innerHTML = `<iframe src="https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&service=${slug}" width="100%" height="400" frameborder="0"></iframe>`;
            } else if (formContainer) {
                formContainer.parentElement.style.display = 'none'; // Hide on static pages
            }
        }
    }
}

loadNav();
loadPageContent();
EOF

echo "✅ Fikanova v5.0 Construction Complete."