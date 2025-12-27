/**
 * Integration Usage Examples
 * 
 * Shows how to use the hybrid MCP + Direct API approach
 */

const { executeIntegration, INTEGRATIONS } = require('./integration_wrapper');

// === Example 1: M-Pesa STK Push ===
async function initiatePayment(phone, amount, reference) {
    try {
        const result = await executeIntegration('daraja', 'stk_push', {
            phone: phone.replace(/^0/, '254'), // Convert 0xxx to 254xxx
            amount,
            reference,
            description: `Payment for ${reference}`
        });

        console.log(`[M-Pesa] STK Push sent to ${phone}`);
        console.log(`[M-Pesa] CheckoutRequestID: ${result.CheckoutRequestID}`);

        return result;
    } catch (error) {
        console.error(`[M-Pesa] Failed: ${error.message}`);
        throw error;
    }
}

// === Example 2: Save to Appwrite ===
async function logTransaction(transaction) {
    const result = await executeIntegration('appwrite', 'create_document', {
        databaseId: process.env.DATABASE_ID,
        collectionId: 'transactions',
        data: {
            type: transaction.type,
            amount: transaction.amount,
            phone: transaction.phone,
            status: 'pending',
            createdAt: new Date().toISOString()
        }
    });

    console.log(`[Appwrite] Transaction logged: ${result.$id}`);
    return result;
}

// === Example 3: Send WhatsApp Message ===
async function sendWhatsAppNotification(to, message) {
    const result = await executeIntegration('whatsapp', 'send_message', {
        to: to.replace(/^0/, '254'),
        message
    });

    console.log(`[WhatsApp] Message sent to ${to}`);
    return result;
}

// === Example 4: SMS Fallback ===
async function sendNotification(phone, message) {
    // Try WhatsApp first, fallback to SMS
    try {
        return await sendWhatsAppNotification(phone, message);
    } catch (error) {
        console.log('[Notification] WhatsApp failed, trying SMS...');
        return await executeIntegration('sozuri', 'send_sms', {
            to: phone.replace(/^0/, '254'),
            message
        });
    }
}

// === Example 5: Full Payment Flow ===
async function processPayment(customerPhone, amount, productName) {
    console.log(`\n=== Processing Payment ===`);
    console.log(`Customer: ${customerPhone}`);
    console.log(`Amount: KES ${amount}`);
    console.log(`Product: ${productName}\n`);

    // 1. Log the pending transaction
    const txn = await logTransaction({
        type: 'sale',
        amount,
        phone: customerPhone
    });

    // 2. Initiate M-Pesa payment
    const mpesa = await initiatePayment(customerPhone, amount, productName);

    // 3. Notify customer
    await sendNotification(
        customerPhone,
        `Payment request for KES ${amount} sent. Check your phone to complete.`
    );

    return { transactionId: txn.$id, mpesaRef: mpesa.CheckoutRequestID };
}

// === Show available integrations ===
function showIntegrations() {
    console.log('\n=== Available Integrations ===\n');

    Object.entries(INTEGRATIONS).forEach(([id, config]) => {
        const mcpStatus = config.mcpServer ? `MCP: ${config.mcpServer}` : 'No MCP';
        const apiStatus = config.directApi ? '✅ Direct API' : '❌ No API';
        console.log(`${config.name} (${id})`);
        console.log(`  ${mcpStatus}`);
        console.log(`  ${apiStatus}`);
        console.log();
    });
}

// Run demo
if (require.main === module) {
    showIntegrations();
}

module.exports = {
    initiatePayment,
    logTransaction,
    sendWhatsAppNotification,
    sendNotification,
    processPayment
};
