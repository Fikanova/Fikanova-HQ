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
