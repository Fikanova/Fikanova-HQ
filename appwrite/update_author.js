require('dotenv').config({ path: '../.env' });
const { Client, Databases, Query } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.VITE_APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '693703ef001133c62d78';

async function updateArticleAuthor() {
    console.log("📝 Updating article author...");

    try {
        // Find the article by slug
        const response = await databases.listDocuments(
            DATABASE_ID,
            'Articles',
            [Query.equal('slug', 'gemini-3-deep-think-agentic-frontier')]
        );

        if (response.documents.length > 0) {
            const article = response.documents[0];

            // Update the author
            await databases.updateDocument(
                DATABASE_ID,
                'Articles',
                article.$id,
                { author: 'Nyaenya Moseti' }
            );

            console.log("✅ Author updated to: Nyaenya Moseti");
            console.log(`   Article: ${article.title}`);
        } else {
            console.log("❌ Article not found");
        }
    } catch (error) {
        console.error("❌ Error updating article:", error.message);
    }
}

updateArticleAuthor();
