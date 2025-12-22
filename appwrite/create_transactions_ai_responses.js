/**
 * Create Transactions and AI_Responses collections in Appwrite
 * 
 * Run with: node appwrite/create_transactions_ai_responses.js
 */

const { Client, Databases, ID, Permission, Role } = require('node-appwrite');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Initialize Appwrite client
const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = process.env.DATABASE_ID;

async function createTransactionsCollection() {
    const COLLECTION_ID = 'transactions';

    console.log('Creating Transactions collection...');

    try {
        // Create the collection
        await databases.createCollection(
            DATABASE_ID,
            COLLECTION_ID,
            'Transactions',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );
        console.log('✅ Transactions collection created');

        // Add attributes
        const attributes = [
            // Transaction identification
            { name: 'transaction_id', type: 'string', size: 100, required: true },
            { name: 'merchant_request_id', type: 'string', size: 100, required: false },
            { name: 'checkout_request_id', type: 'string', size: 100, required: false },

            // Payment details
            { name: 'amount', type: 'float', required: true },
            { name: 'currency', type: 'string', size: 10, required: false, default: 'KES' },
            { name: 'payment_method', type: 'string', size: 50, required: true }, // mpesa, card, bank

            // M-Pesa specific
            { name: 'mpesa_receipt', type: 'string', size: 50, required: false },
            { name: 'phone_number', type: 'string', size: 20, required: false },
            { name: 'account_reference', type: 'string', size: 100, required: false },

            // Status tracking
            { name: 'status', type: 'string', size: 20, required: true }, // pending, completed, failed, refunded
            { name: 'status_message', type: 'string', size: 500, required: false },

            // Linked entities
            { name: 'lead_id', type: 'string', size: 50, required: false },
            { name: 'user_id', type: 'string', size: 50, required: false },
            { name: 'invoice_id', type: 'string', size: 50, required: false },

            // Description
            { name: 'description', type: 'string', size: 500, required: false },
            { name: 'category', type: 'string', size: 50, required: false }, // service, product, retainer

            // Timestamps
            { name: 'initiated_at', type: 'string', size: 50, required: true },
            { name: 'completed_at', type: 'string', size: 50, required: false },

            // Metadata (JSON string for flexibility)
            { name: 'metadata', type: 'string', size: 5000, required: false }
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        COLLECTION_ID,
                        attr.name,
                        attr.size,
                        attr.required,
                        attr.default || null
                    );
                } else if (attr.type === 'float') {
                    await databases.createFloatAttribute(
                        DATABASE_ID,
                        COLLECTION_ID,
                        attr.name,
                        attr.required
                    );
                }
                console.log(`  ✓ Added attribute: ${attr.name}`);
            } catch (err) {
                console.log(`  ⚠ Attribute ${attr.name}: ${err.message}`);
            }
        }

        // Create indexes for common queries
        console.log('Creating indexes...');
        await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_status', 'key', ['status']);
        await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_payment_method', 'key', ['payment_method']);
        await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_lead_id', 'key', ['lead_id']);
        console.log('  ✓ Indexes created');

    } catch (error) {
        if (error.code === 409) {
            console.log('⚠ Transactions collection already exists');
        } else {
            throw error;
        }
    }
}

async function createAIResponsesCollection() {
    const COLLECTION_ID = 'ai_responses';

    console.log('\nCreating AI_Responses collection...');

    try {
        // Create the collection
        await databases.createCollection(
            DATABASE_ID,
            COLLECTION_ID,
            'AI_Responses',
            [
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users())
            ]
        );
        console.log('✅ AI_Responses collection created');

        // Add attributes
        const attributes = [
            // Source identification
            { name: 'agent_name', type: 'string', size: 100, required: true }, // CEO, CMO, CFO, etc.
            { name: 'workflow_id', type: 'string', size: 100, required: false },
            { name: 'workflow_name', type: 'string', size: 200, required: false },

            // Request context
            { name: 'input_message', type: 'string', size: 5000, required: false },
            { name: 'input_type', type: 'string', size: 50, required: false }, // whatsapp, webhook, dashboard
            { name: 'sender_id', type: 'string', size: 100, required: false },

            // AI Response
            { name: 'response_text', type: 'string', size: 10000, required: true },
            { name: 'model_used', type: 'string', size: 100, required: false }, // gemini-2.0-flash, gpt-4, etc.
            { name: 'tokens_used', type: 'integer', required: false },

            // Classification & Routing
            { name: 'intent_detected', type: 'string', size: 100, required: false },
            { name: 'confidence_score', type: 'float', required: false },
            { name: 'routed_to', type: 'string', size: 100, required: false },

            // Approval tracking (HITL)
            { name: 'requires_approval', type: 'boolean', required: false },
            { name: 'approval_status', type: 'string', size: 20, required: false }, // pending, approved, rejected
            { name: 'approved_by', type: 'string', size: 100, required: false },
            { name: 'approved_at', type: 'string', size: 50, required: false },

            // Performance metrics
            { name: 'response_time_ms', type: 'integer', required: false },
            { name: 'was_helpful', type: 'boolean', required: false }, // user feedback

            // Timestamps
            { name: 'created_at', type: 'string', size: 50, required: true },

            // Error tracking
            { name: 'error_message', type: 'string', size: 1000, required: false },
            { name: 'retry_count', type: 'integer', required: false }
        ];

        for (const attr of attributes) {
            try {
                if (attr.type === 'string') {
                    await databases.createStringAttribute(
                        DATABASE_ID,
                        COLLECTION_ID,
                        attr.name,
                        attr.size,
                        attr.required
                    );
                } else if (attr.type === 'float') {
                    await databases.createFloatAttribute(
                        DATABASE_ID,
                        COLLECTION_ID,
                        attr.name,
                        attr.required
                    );
                } else if (attr.type === 'integer') {
                    await databases.createIntegerAttribute(
                        DATABASE_ID,
                        COLLECTION_ID,
                        attr.name,
                        attr.required
                    );
                } else if (attr.type === 'boolean') {
                    await databases.createBooleanAttribute(
                        DATABASE_ID,
                        COLLECTION_ID,
                        attr.name,
                        attr.required
                    );
                }
                console.log(`  ✓ Added attribute: ${attr.name}`);
            } catch (err) {
                console.log(`  ⚠ Attribute ${attr.name}: ${err.message}`);
            }
        }

        // Create indexes for common queries
        console.log('Creating indexes...');
        await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_agent', 'key', ['agent_name']);
        await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_intent', 'key', ['intent_detected']);
        await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'idx_approval', 'key', ['approval_status']);
        console.log('  ✓ Indexes created');

    } catch (error) {
        if (error.code === 409) {
            console.log('⚠ AI_Responses collection already exists');
        } else {
            throw error;
        }
    }
}

async function main() {
    console.log('='.repeat(50));
    console.log('Creating Transactions & AI_Responses Collections');
    console.log('='.repeat(50));
    console.log(`Endpoint: ${process.env.APPWRITE_ENDPOINT}`);
    console.log(`Project: ${process.env.APPWRITE_PROJECT_ID}`);
    console.log(`Database: ${DATABASE_ID}`);
    console.log('='.repeat(50));

    try {
        await createTransactionsCollection();
        await createAIResponsesCollection();

        console.log('\n' + '='.repeat(50));
        console.log('✅ All collections created successfully!');
        console.log('='.repeat(50));
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
