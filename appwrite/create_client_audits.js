const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { Client, Databases, Permission, Role } = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT || process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || process.env.VITE_APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.DATABASE_ID || '693703ef001133c62d78';

console.log('🔧 Config:', { ENDPOINT, PROJECT_ID: PROJECT_ID ? '✓ set' : '✗ missing', API_KEY: API_KEY ? '✓ set' : '✗ missing' });

if (!API_KEY || !PROJECT_ID) {
    console.error("❌ ERROR: Missing APPWRITE_API_KEY or APPWRITE_PROJECT_ID in .env file");
    process.exit(1);
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

// Client_Audits collection attributes
const attributes = [
    { key: 'lead_id', type: 'string', size: 64, required: true },
    { key: 'contact_name', type: 'string', size: 128, required: true },
    { key: 'suggested_vibe', type: 'string', size: 64, required: true },
    { key: 'vibe_reasoning', type: 'string', size: 500, required: false },
    { key: 'marketing_gaps', type: 'string', size: 2000, required: true },
    { key: 'web_integrations', type: 'string', size: 2000, required: true },
    { key: 'platform_activity', type: 'string', size: 2000, required: false },
    { key: 'priority_actions', type: 'string', size: 1000, required: false },
    { key: 'audit_score', type: 'integer', required: false },
    { key: 'audited_at', type: 'datetime', required: true },
    { key: 'audited_by', type: 'string', size: 64, required: true }
];

async function createCollection() {
    console.log("🚀 Creating Client_Audits collection...\n");

    // Create collection
    try {
        await databases.createCollection(
            DATABASE_ID,
            'Client_Audits',
            'Client_Audits',
            [Permission.read(Role.any())]
        );
        console.log('✅ Collection Client_Audits created');
    } catch (e) {
        if (e.code === 409) {
            console.log('ℹ️  Collection Client_Audits already exists');
        } else {
            console.error('❌ Failed to create collection:', e.message);
            return;
        }
    }

    // Add attributes
    for (const attr of attributes) {
        try {
            if (attr.type === 'string') {
                await databases.createStringAttribute(DATABASE_ID, 'Client_Audits', attr.key, attr.size, attr.required);
                console.log(`✅ Added: ${attr.key} (String, size: ${attr.size})`);
            }
            if (attr.type === 'integer') {
                await databases.createIntegerAttribute(DATABASE_ID, 'Client_Audits', attr.key, attr.required);
                console.log(`✅ Added: ${attr.key} (Integer)`);
            }
            if (attr.type === 'datetime') {
                await databases.createDatetimeAttribute(DATABASE_ID, 'Client_Audits', attr.key, attr.required);
                console.log(`✅ Added: ${attr.key} (Datetime)`);
            }
            await new Promise(r => setTimeout(r, 500));
        } catch (e) {
            if (e.code === 409) {
                console.log(`ℹ️  Attribute ${attr.key} already exists`);
            } else {
                console.error(`❌ Failed to add ${attr.key}:`, e.message);
            }
        }
    }

    console.log("\n✨ Done! Client_Audits collection ready.");
}

createCollection();
