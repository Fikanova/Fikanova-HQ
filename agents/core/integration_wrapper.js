/**
 * Fikanova Integration Wrapper
 * 
 * Hybrid MCP + Direct API approach:
 * - Tries MCP server first (if available)
 * - Falls back to direct API calls
 * - Works without MCP at all
 */

// Integration definitions with MCP and API fallback
const INTEGRATIONS = {
    // === M-Pesa Daraja (No public MCP - use direct API) ===
    daraja: {
        name: 'M-Pesa Daraja',
        mcpServer: null, // No MCP available
        directApi: {
            baseUrl: 'https://api.safaricom.co.ke',
            sandboxUrl: 'https://sandbox.safaricom.co.ke',
            authEndpoint: '/oauth/v1/generate?grant_type=client_credentials',
            requiredEnv: ['MPESA_CONSUMER_KEY', 'MPESA_CONSUMER_SECRET', 'MPESA_SHORTCODE', 'MPESA_PASSKEY']
        }
    },

    // === Appwrite (Has community MCP) ===
    appwrite: {
        name: 'Appwrite',
        mcpServer: 'appwrite-mcp', // npm: @anthropic/mcp-server-appwrite (community)
        mcpConfig: {
            endpoint: process.env.APPWRITE_ENDPOINT,
            projectId: process.env.APPWRITE_PROJECT_ID,
            apiKey: process.env.APPWRITE_API_KEY
        },
        directApi: {
            baseUrl: process.env.APPWRITE_ENDPOINT,
            requiredEnv: ['APPWRITE_ENDPOINT', 'APPWRITE_PROJECT_ID', 'APPWRITE_API_KEY']
        }
    },

    // === Google Sheets (Has official MCP) ===
    googleSheets: {
        name: 'Google Sheets',
        mcpServer: 'gdrive-mcp', // npm: @anthropic/mcp-server-gdrive
        directApi: {
            baseUrl: 'https://sheets.googleapis.com/v4',
            requiredEnv: ['GOOGLE_SHEETS_LEDGER_ID'] // OAuth handled separately
        }
    },

    // === HubSpot (Has community MCP) ===
    hubspot: {
        name: 'HubSpot',
        mcpServer: 'hubspot-mcp',
        directApi: {
            baseUrl: 'https://api.hubapi.com',
            requiredEnv: ['HUBSPOT_API_KEY']
        }
    },

    // === WhatsApp/Meta (No MCP - use direct API) ===
    whatsapp: {
        name: 'WhatsApp Cloud API',
        mcpServer: null,
        directApi: {
            baseUrl: 'https://graph.facebook.com/v18.0',
            requiredEnv: ['WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_ACCESS_TOKEN']
        }
    },

    // === Sozuri SMS (No MCP - use direct API) ===
    sozuri: {
        name: 'Sozuri SMS',
        mcpServer: null,
        directApi: {
            baseUrl: 'https://api.sozuri.net',
            requiredEnv: ['SOZURI_API_KEY']
        }
    },

    // === GitHub (Has official MCP) ===
    github: {
        name: 'GitHub',
        mcpServer: 'github-mcp', // npm: @anthropic/mcp-server-github
        directApi: {
            baseUrl: 'https://api.github.com',
            requiredEnv: ['GITHUB_TOKEN']
        }
    },

    // === Notion (Has official MCP) ===
    notion: {
        name: 'Notion',
        mcpServer: 'notion-mcp', // npm: @anthropic/mcp-server-notion or @notionhq/mcp
        mcpConfig: {
            apiKey: process.env.NOTION_API_KEY
        },
        directApi: {
            baseUrl: 'https://api.notion.com/v1',
            headers: {
                'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28'
            },
            requiredEnv: ['NOTION_API_KEY']
        }
    },

    // === Zoho Mail (No MCP - use direct API) ===
    zohoMail: {
        name: 'Zoho Mail',
        mcpServer: null,
        directApi: {
            baseUrl: 'https://mail.zoho.com/api',
            requiredEnv: ['ZOHO_MAIL_CLIENT_ID', 'ZOHO_MAIL_CLIENT_SECRET', 'ZOHO_MAIL_REFRESH_TOKEN']
        }
    },

    // === Gmail (Has official MCP) ===
    gmail: {
        name: 'Gmail',
        mcpServer: 'gmail-mcp', // Part of Google workspace MCP
        directApi: {
            baseUrl: 'https://gmail.googleapis.com/gmail/v1',
            requiredEnv: [] // OAuth handled by n8n credentials
        }
    }
};

// MCP connection status
const mcpStatus = new Map();

/**
 * Check if MCP server is available
 */
async function isMcpAvailable(integrationId) {
    const integration = INTEGRATIONS[integrationId];
    if (!integration?.mcpServer) return false;

    const status = mcpStatus.get(integrationId);

    // Check cache (valid for 1 minute)
    if (status?.lastCheck && Date.now() - status.lastCheck < 60000) {
        return status.available;
    }

    // Try to connect to MCP server
    try {
        // In production, use actual MCP client
        // const { Client } = require('@modelcontextprotocol/sdk/client');
        // await client.connect(integration.mcpServer);

        mcpStatus.set(integrationId, { available: true, lastCheck: Date.now() });
        return true;
    } catch (error) {
        console.log(`[MCP] ${integration.mcpServer} unavailable, using direct API`);
        mcpStatus.set(integrationId, { available: false, lastCheck: Date.now() });
        return false;
    }
}

/**
 * Check if direct API can be used
 */
function canUseDirectApi(integrationId) {
    const integration = INTEGRATIONS[integrationId];
    if (!integration?.directApi) return false;

    // Check all required env vars are present
    const missing = integration.directApi.requiredEnv.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.log(`[API] ${integrationId} missing env vars: ${missing.join(', ')}`);
        return false;
    }
    return true;
}

/**
 * Execute an integration call with MCP→API fallback
 */
async function executeIntegration(integrationId, operation, params = {}) {
    const integration = INTEGRATIONS[integrationId];
    if (!integration) {
        throw new Error(`Unknown integration: ${integrationId}`);
    }

    // Strategy 1: Try MCP first
    if (await isMcpAvailable(integrationId)) {
        try {
            console.log(`[${integrationId}] Using MCP server: ${integration.mcpServer}`);
            return await executeMcp(integration, operation, params);
        } catch (error) {
            console.log(`[${integrationId}] MCP failed, falling back to API: ${error.message}`);
        }
    }

    // Strategy 2: Direct API fallback
    if (canUseDirectApi(integrationId)) {
        console.log(`[${integrationId}] Using direct API`);
        return await executeDirectApi(integrationId, operation, params);
    }

    throw new Error(`${integrationId}: Neither MCP nor direct API available`);
}

/**
 * Execute via MCP server (placeholder - implement with actual MCP SDK)
 */
async function executeMcp(integration, operation, params) {
    // In production:
    // const { Client } = require('@modelcontextprotocol/sdk/client');
    // const client = new Client();
    // await client.connect(integration.mcpServer);
    // return await client.callTool(operation, params);

    throw new Error('MCP not implemented - use direct API');
}

/**
 * Execute via direct API
 */
async function executeDirectApi(integrationId, operation, params) {
    switch (integrationId) {
        case 'daraja':
            return await darajaApi(operation, params);
        case 'appwrite':
            return await appwriteApi(operation, params);
        case 'whatsapp':
            return await whatsappApi(operation, params);
        case 'sozuri':
            return await sozuriApi(operation, params);
        default:
            throw new Error(`Direct API not implemented for: ${integrationId}`);
    }
}

// === DARAJA (M-PESA) API ===
let darajaToken = null;
let darajaTokenExpiry = 0;

async function getDarajaToken() {
    if (darajaToken && Date.now() < darajaTokenExpiry) {
        return darajaToken;
    }

    const env = process.env.MPESA_ENVIRONMENT === 'production' ? 'api' : 'sandbox';
    const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await fetch(
        `https://${env}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`,
        {
            headers: { 'Authorization': `Basic ${auth}` }
        }
    );

    if (!response.ok) throw new Error('Daraja auth failed');

    const data = await response.json();
    darajaToken = data.access_token;
    darajaTokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 min buffer

    return darajaToken;
}

async function darajaApi(operation, params) {
    const token = await getDarajaToken();
    const env = process.env.MPESA_ENVIRONMENT === 'production' ? 'api' : 'sandbox';
    const baseUrl = `https://${env}.safaricom.co.ke`;

    switch (operation) {
        case 'stk_push': {
            const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
            const password = Buffer.from(
                `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
            ).toString('base64');

            const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    BusinessShortCode: process.env.MPESA_SHORTCODE,
                    Password: password,
                    Timestamp: timestamp,
                    TransactionType: 'CustomerPayBillOnline',
                    Amount: params.amount,
                    PartyA: params.phone,
                    PartyB: process.env.MPESA_SHORTCODE,
                    PhoneNumber: params.phone,
                    CallBackURL: process.env.MPESA_CALLBACK_URL,
                    AccountReference: params.reference || 'Fikanova',
                    TransactionDesc: params.description || 'Payment'
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.errorMessage || 'STK Push failed');
            }

            return await response.json();
        }

        case 'query_status': {
            const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
            const password = Buffer.from(
                `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
            ).toString('base64');

            const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    BusinessShortCode: process.env.MPESA_SHORTCODE,
                    Password: password,
                    Timestamp: timestamp,
                    CheckoutRequestID: params.checkoutRequestId
                })
            });

            return await response.json();
        }

        default:
            throw new Error(`Unknown Daraja operation: ${operation}`);
    }
}

// === APPWRITE API ===
async function appwriteApi(operation, params) {
    const baseUrl = process.env.APPWRITE_ENDPOINT;
    const headers = {
        'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
        'X-Appwrite-Key': process.env.APPWRITE_API_KEY,
        'Content-Type': 'application/json'
    };

    switch (operation) {
        case 'create_document': {
            const response = await fetch(
                `${baseUrl}/databases/${params.databaseId}/collections/${params.collectionId}/documents`,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        documentId: params.documentId || 'unique()',
                        data: params.data
                    })
                }
            );
            return await response.json();
        }

        case 'list_documents': {
            const url = new URL(
                `${baseUrl}/databases/${params.databaseId}/collections/${params.collectionId}/documents`
            );
            if (params.queries) {
                params.queries.forEach(q => url.searchParams.append('queries[]', q));
            }
            const response = await fetch(url, { headers });
            return await response.json();
        }

        default:
            throw new Error(`Unknown Appwrite operation: ${operation}`);
    }
}

// === WHATSAPP API ===
async function whatsappApi(operation, params) {
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    switch (operation) {
        case 'send_message': {
            const response = await fetch(
                `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        messaging_product: 'whatsapp',
                        to: params.to,
                        type: 'text',
                        text: { body: params.message }
                    })
                }
            );
            return await response.json();
        }

        default:
            throw new Error(`Unknown WhatsApp operation: ${operation}`);
    }
}

// === SOZURI SMS API ===
async function sozuriApi(operation, params) {
    switch (operation) {
        case 'send_sms': {
            const response = await fetch('https://api.sozuri.net/v1/messaging/sms/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.SOZURI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: process.env.SOZURI_SENDER_ID || 'FIKANOVA',
                    to: params.to,
                    message: params.message
                })
            });
            return await response.json();
        }

        default:
            throw new Error(`Unknown Sozuri operation: ${operation}`);
    }
}

// === NOTION API ===
async function notionApi(operation, params) {
    const headers = {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
    };

    switch (operation) {
        case 'create_page': {
            const response = await fetch('https://api.notion.com/v1/pages', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    parent: { database_id: params.databaseId },
                    properties: params.properties,
                    children: params.children || []
                })
            });
            return await response.json();
        }

        case 'query_database': {
            const response = await fetch(`https://api.notion.com/v1/databases/${params.databaseId}/query`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    filter: params.filter || undefined,
                    sorts: params.sorts || undefined
                })
            });
            return await response.json();
        }

        case 'get_page': {
            const response = await fetch(`https://api.notion.com/v1/pages/${params.pageId}`, {
                headers
            });
            return await response.json();
        }

        case 'update_page': {
            const response = await fetch(`https://api.notion.com/v1/pages/${params.pageId}`, {
                method: 'PATCH',
                headers,
                body: JSON.stringify({
                    properties: params.properties
                })
            });
            return await response.json();
        }

        default:
            throw new Error(`Unknown Notion operation: ${operation}`);
    }
}

// === Exports ===
module.exports = {
    INTEGRATIONS,
    executeIntegration,
    isMcpAvailable,
    canUseDirectApi,
    // Direct API access if needed
    darajaApi,
    appwriteApi,
    whatsappApi,
    sozuriApi,
    notionApi
};
