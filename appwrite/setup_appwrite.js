const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = '693703ef001133c62d78';

if (!API_KEY || !PROJECT_ID) {
    console.error("❌ ERROR: Missing API Keys in .env file.");
    process.exit(1);
}

// SCHEMA DEFINITION
const collections = [
    {
        name: 'Services', id: 'Services', attributes: [
            { key: 'title', type: 'string', size: 128, required: true },
            { key: 'slug', type: 'string', size: 64, required: true },
            { key: 'category', type: 'string', size: 64, required: true },
            { key: 'short_description', type: 'string', size: 256, required: true },
            { key: 'full_body_markdown', type: 'string', size: 5000, required: false },
            { key: 'tally_form_id', type: 'string', size: 64, required: false },
            { key: 'price_estimate', type: 'string', size: 64, required: false }
        ]
    },
    {
        name: 'Pages', id: 'Pages', attributes: [
            { key: 'title', type: 'string', size: 128, required: true },
            { key: 'slug', type: 'string', size: 64, required: true },
            { key: 'content_markdown', type: 'string', size: 5000, required: true },
            { key: 'hero_image', type: 'url', required: false },
            { key: 'meta_description', type: 'string', size: 160, required: false }
        ]
    },
    {
        name: 'Clients', id: 'Clients', attributes: [
            { key: 'name', type: 'string', size: 128, required: true },
            { key: 'logo_url', type: 'url', required: true },
            { key: 'website_url', type: 'url', required: false },
            { key: 'status', type: 'string', size: 64, required: true }
        ]
    },
    {
        name: 'CaseStudies', id: 'CaseStudies', attributes: [
            { key: 'title', type: 'string', size: 256, required: true },
            { key: 'client_name', type: 'string', size: 128, required: true },
            { key: 'summary_result', type: 'string', size: 256, required: true },
            { key: 'full_story_markdown', type: 'string', size: 5000, required: true },
            { key: 'service_category', type: 'string', size: 64, required: true }
        ]
    },
    {
        name: 'Impact_Metrics', id: 'Impact_Metrics', attributes: [
            { key: 'client_reference', type: 'string', size: 128, required: true },
            { key: 'metric_label', type: 'string', size: 64, required: true },
            { key: 'metric_value', type: 'string', size: 64, required: true }
        ]
    }
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
    { title: "About Us", slug: "about-us", hero_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200", content_markdown: "## The Fikanova Mission\nWe simplify operations for SMEs using AI Agents and cutting-edge technology.", meta_description: "About Fikanova - Your technology partner." },
    { title: "Our Story", slug: "our-story", hero_image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200", content_markdown: "## From Lima Labs to Automation\nA journey of optimizing time, wealth, and knowledge for African businesses.", meta_description: "The founding story of Fikanova." },
    { title: "Impact", slug: "impact", hero_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200", content_markdown: "## Our Impact\nMeasuring success through client outcomes and community growth.", meta_description: "Fikanova's impact on businesses." },
    { title: "Portfolio", slug: "portfolio", hero_image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200", content_markdown: "## Our Work\nExplore projects we've delivered for clients across industries.", meta_description: "Fikanova project portfolio." },
    { title: "Case Studies", slug: "case-studies", hero_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200", content_markdown: "## Case Studies\nDeep dives into how we solved complex challenges.", meta_description: "Fikanova case studies." },
    { title: "Resources", slug: "resources", hero_image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200", content_markdown: "## Resources\nGuides, templates, and tools to help your business grow.", meta_description: "Free resources from Fikanova." },
    { title: "Newsletter", slug: "newsletter", hero_image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200", content_markdown: "## Stay Updated\nSubscribe to our newsletter for the latest insights on AI and technology.", meta_description: "Fikanova newsletter signup." }
];

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

async function setup() {
    console.log("🚀 Starting DB Setup...");

    // 1. Create Database
    try {
        await databases.create(DATABASE_ID, DATABASE_ID);
        console.log('✅ DB Created');
    } catch (e) {
        if (e.code === 409) console.log('ℹ️ DB Exists');
        else console.error('❌ DB Creation Failed:', e.message);
    }

    // 2. Create Collections & Attributes
    for (const col of collections) {
        try {
            await databases.createCollection(DATABASE_ID, col.id, col.name, [Permission.read(Role.any())]);
            console.log(`✅ Collection ${col.name} Created`);
        } catch (e) {
            if (e.code === 409) console.log(`ℹ️ Collection ${col.name} Exists`);
            else console.error(`❌ Collection ${col.name} Failed:`, e.message);
        }

        for (const attr of col.attributes) {
            try {
                if (attr.type === 'string') await databases.createStringAttribute(DATABASE_ID, col.id, attr.key, attr.size, attr.required);
                if (attr.type === 'url') await databases.createUrlAttribute(DATABASE_ID, col.id, attr.key, attr.required);
                await new Promise(r => setTimeout(r, 200));
            } catch (e) {
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
    } catch (e) {
        console.error("❌ Document Seeding Failed. CHECK API SCOPES (documents.read, documents.write):", e.message);
    }
}
setup();
