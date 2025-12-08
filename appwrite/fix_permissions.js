const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Client, Databases, Permission, Role } = require('node-appwrite');

const ENDPOINT = process.env.APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = '693703ef001133c62d78';

if (!API_KEY || !PROJECT_ID) {
    console.err("Missing Keys"); process.exit(1);
}

console.log(`Endpoint: ${ENDPOINT}`);
console.log(`Project: ${PROJECT_ID}`);
const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
const databases = new Databases(client);

const collections = ['Services', 'Pages', 'Clients', 'CaseStudies', 'Impact_Metrics'];

async function fix() {
    console.log("🔧 Fixing Permissions...");
    for (const id of collections) {
        try {
            await databases.updateCollection(DATABASE_ID, id, id, [Permission.read(Role.any())]);
            console.log(`✅ Updated ${id} permissions`);
        } catch (e) {
            console.error(`❌ Failed ${id}: ${e.message}`);
        }
    }
}
fix();
