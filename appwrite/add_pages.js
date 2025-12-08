const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Client, Databases, ID, Query } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const db = new Databases(client);
const DB_ID = '693703ef001133c62d78';

const missingPages = [
    { title: "Impact", slug: "impact", hero_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200", content_markdown: "## Our Impact\nMeasuring success through client outcomes and community growth.", meta_description: "Fikanova's impact on businesses." },
    { title: "Portfolio", slug: "portfolio", hero_image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1200", content_markdown: "## Our Work\nExplore projects we've delivered for clients across industries.", meta_description: "Fikanova project portfolio." },
    { title: "Case Studies", slug: "case-studies", hero_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200", content_markdown: "## Case Studies\nDeep dives into how we solved complex challenges.", meta_description: "Fikanova case studies." },
    { title: "Resources", slug: "resources", hero_image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1200", content_markdown: "## Resources\nGuides, templates, and tools to help your business grow.", meta_description: "Free resources from Fikanova." },
    { title: "Newsletter", slug: "newsletter", hero_image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=1200", content_markdown: "## Stay Updated\nSubscribe to our newsletter for the latest insights on AI and technology.", meta_description: "Fikanova newsletter signup." }
];

async function addMissingPages() {
    console.log("🔧 Adding missing pages...");
    for (const page of missingPages) {
        try {
            // Check if exists
            const existing = await db.listDocuments(DB_ID, 'Pages', [Query.equal('slug', page.slug)]);
            if (existing.total === 0) {
                await db.createDocument(DB_ID, 'Pages', ID.unique(), page);
                console.log(`✅ Added: ${page.title}`);
            } else {
                console.log(`ℹ️ Exists: ${page.title}`);
            }
        } catch (e) {
            console.error(`❌ Failed: ${page.title}`, e.message);
        }
    }
    console.log("✅ Done.");
}
addMissingPages();
