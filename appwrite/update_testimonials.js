require('dotenv').config({
    path: '../.env'
});
const { Client, Databases } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.VITE_APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '693703ef001133c62d78';
const COLLECTION_ID = 'Testimonials';

async function updateTestimonialsCollection() {
    console.log("🔧 Updating Testimonials Collection...");

    try {
        // Try to create the collection first (will fail if exists)
        try {
            await databases.createCollection(DATABASE_ID, COLLECTION_ID, 'Testimonials');
            console.log("✅ Testimonials collection created.");
        } catch (e) {
            if (e.code === 409) {
                console.log("ℹ️  Testimonials collection already exists.");
            } else {
                throw e;
            }
        }

        // Define attributes to add
        const attributes = [
            { key: 'client_name', size: 255, required: true },
            { key: 'quote', size: 2000, required: true },
            { key: 'role', size: 255, required: true },
            { key: 'date', size: 50, required: true }
        ];

        // Add string attributes
        for (const attr of attributes) {
            try {
                await databases.createStringAttribute(
                    DATABASE_ID,
                    COLLECTION_ID,
                    attr.key,
                    attr.size,
                    attr.required
                );
                console.log(`✅ Added attribute: ${attr.key}`);
            } catch (e) {
                if (e.code === 409) {
                    console.log(`ℹ️  Attribute already exists: ${attr.key}`);
                } else {
                    console.error(`❌ Error adding ${attr.key}:`, e.message);
                }
            }
        }

        // Add rating as integer attribute
        try {
            await databases.createIntegerAttribute(
                DATABASE_ID,
                COLLECTION_ID,
                'rating',
                true,  // required
                1,     // min
                5      // max
            );
            console.log("✅ Added attribute: rating");
        } catch (e) {
            if (e.code === 409) {
                console.log("ℹ️  Attribute already exists: rating");
            } else {
                console.error("❌ Error adding rating:", e.message);
            }
        }

        console.log("🎉 Testimonials collection update complete!");

    } catch (e) {
        console.error("❌ Error:", e.message);
    }
}

updateTestimonialsCollection();
