"""
WhatsApp Bridge - Bidirectional CEO Command Router
Handles Sozuri webhook → Appwrite → n8n workflow routing
"""
import os
import json
import hmac
import hashlib
from datetime import datetime
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID

# Environment
APPWRITE_ENDPOINT = os.environ.get('APPWRITE_ENDPOINT', 'https://fra.cloud.appwrite.io/v1')
APPWRITE_PROJECT_ID = os.environ.get('APPWRITE_PROJECT_ID')
APPWRITE_API_KEY = os.environ.get('APPWRITE_API_KEY')
DATABASE_ID = os.environ.get('DATABASE_ID', '693703ef001133c62d78')
SOZURI_WEBHOOK_SECRET = os.environ.get('SOZURI_WEBHOOK_SECRET', '')
N8N_CEO_WEBHOOK_URL = os.environ.get('N8N_CEO_WEBHOOK_URL', '')
WHATSAPP_WEBHOOK_VERIFY_TOKEN = os.environ.get('WHATSAPP_WEBHOOK_VERIFY_TOKEN', '')

# WhatsApp Cloud API for outbound messaging
WHATSAPP_PHONE_NUMBER_ID = os.environ.get('WHATSAPP_PHONE_NUMBER_ID', '')
WHATSAPP_ACCESS_TOKEN = os.environ.get('WHATSAPP_ACCESS_TOKEN', '')
FOUNDER_PHONE = os.environ.get('FOUNDER_PHONE', '')

# C-Suite routing keywords
AGENT_ROUTING = {
    'CEO': ['status', 'report', 'overview', 'brief', 'summary'],
    'CFO': ['finance', 'runway', 'expense', 'revenue', 'cost', 'budget', 'money', 'kra', 'tax'],
    'CTO': ['tech', 'code', 'deploy', 'system', 'api', 'bug', 'feature', 'build'],
    'CMO': ['marketing', 'content', 'social', 'post', 'newsletter', 'brand', 'edgy', 'draft'],
    'CIO': ['data', 'knowledge', 'security', 'audit', 'access'],
    'CimpO': ['esg', 'compliance', 'learning', 'improvement', 'metrics']
}


def classify_agent(message: str) -> str:
    """Route message to appropriate C-Suite agent based on keywords."""
    message_lower = message.lower()
    
    for agent, keywords in AGENT_ROUTING.items():
        if any(kw in message_lower for kw in keywords):
            return agent
    
    # Default to CEO for general/unclear messages
    return 'CEO'


def verify_sozuri_signature(payload: str, signature: str) -> bool:
    """Verify Sozuri webhook signature for security."""
    if not SOZURI_WEBHOOK_SECRET:
        return True  # Skip verification in dev
    
    expected = hmac.new(
        SOZURI_WEBHOOK_SECRET.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected, signature)


def send_whatsapp_message(to_phone: str, message: str, context) -> dict:
    """
    Send WhatsApp message via Meta Cloud API.
    Used for sending notifications to founder.
    """
    import urllib.request
    import urllib.error
    
    if not WHATSAPP_PHONE_NUMBER_ID or not WHATSAPP_ACCESS_TOKEN:
        context.log("WhatsApp Cloud API not configured")
        return {'success': False, 'error': 'WhatsApp not configured'}
    
    # Remove + from phone number if present
    phone = to_phone.replace('+', '')
    
    api_url = f"https://graph.facebook.com/v18.0/{WHATSAPP_PHONE_NUMBER_ID}/messages"
    
    payload = json.dumps({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phone,
        "type": "text",
        "text": {
            "preview_url": False,
            "body": message[:4096]  # WhatsApp limit
        }
    }).encode()
    
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {WHATSAPP_ACCESS_TOKEN}'
    }
    
    try:
        req = urllib.request.Request(api_url, data=payload, headers=headers)
        response = urllib.request.urlopen(req, timeout=10)
        result = json.loads(response.read().decode())
        context.log(f"WhatsApp sent successfully: {result}")
        return {'success': True, 'message_id': result.get('messages', [{}])[0].get('id')}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        context.log(f"WhatsApp send error: {error_body}")
        return {'success': False, 'error': error_body}
    except Exception as e:
        context.log(f"WhatsApp send exception: {str(e)}")
        return {'success': False, 'error': str(e)}


def main(context):
    """
    Appwrite Function Entry Point
    
    Handles:
    1. Meta Webhook Verification (GET request)
    2. Inbound: Sozuri/Meta webhook → classify → store in Communications → trigger n8n
    3. Outbound: API call to send WhatsApp message (for agent responses)
    """
    try:
        req = context.req
        
        # === META WEBHOOK VERIFICATION (GET request) ===
        # Meta sends: GET /?hub.mode=subscribe&hub.verify_token=XXX&hub.challenge=YYY
        if req.method == 'GET':
            # Get query parameters
            query = req.query if hasattr(req, 'query') else {}
            
            hub_mode = query.get('hub.mode', '')
            hub_verify_token = query.get('hub.verify_token', '')
            hub_challenge = query.get('hub.challenge', '')
            
            context.log(f"Webhook verification: mode={hub_mode}, challenge={hub_challenge}")
            
            if hub_mode == 'subscribe' and hub_verify_token == WHATSAPP_WEBHOOK_VERIFY_TOKEN:
                context.log("Webhook verified successfully!")
                # Meta requires exactly the challenge value as response body with 200 status
                # Using body parameter to set raw response content
                return context.res.text(str(hub_challenge), 200)
            else:
                context.log(f"Verification failed: token mismatch or invalid mode")
                return context.res.json({'error': 'Verification failed'}, 403)
        
        # === POST REQUESTS (Inbound/Outbound messages) ===
        # Initialize Appwrite
        client = Client()
        client.set_endpoint(APPWRITE_ENDPOINT)
        client.set_project(APPWRITE_PROJECT_ID)
        client.set_key(APPWRITE_API_KEY)
        databases = Databases(client)
        
        # Parse request body
        body = req.body if hasattr(req, 'body') else '{}'
        
        if isinstance(body, str):
            data = json.loads(body) if body else {}
        else:
            data = body or {}
        
        # Check if this is inbound (webhook) or outbound (API call)
        direction = data.get('direction', 'inbound')
        
        if direction == 'inbound':
            # === INBOUND: Sozuri Webhook ===
            # Verify signature (production)
            signature = req.headers.get('x-sozuri-signature', '')
            if not verify_sozuri_signature(json.dumps(data), signature):
                return context.res.json({'error': 'Invalid signature'}, 401)
            
            # Extract message details from Sozuri payload
            # Sozuri format: { "from": "+254...", "body": "message text", ... }
            from_phone = data.get('from', data.get('From', ''))
            message = data.get('body', data.get('Body', data.get('message', '')))
            
            if not message:
                return context.res.json({'error': 'No message content'}, 400)
            
            # Classify which agent should handle this
            target_agent = classify_agent(message)
            
            # Store in Communications collection
            doc = databases.create_document(
                database_id=DATABASE_ID,
                collection_id='Communications',
                document_id=ID.unique(),
                data={
                    'direction': 'inbound',
                    'channel': 'whatsapp',
                    'from_phone': from_phone,
                    'to_agent': target_agent,
                    'message': message[:2000],  # Truncate to field limit
                    'status': 'pending',
                    'metadata': json.dumps({
                        'raw_payload': data,
                        'classified_by': 'keyword_router'
                    }),
                    'created_at': datetime.utcnow().isoformat()
                }
            )
            
            # Trigger n8n CEO workflow (if configured)
            # The CEO agent will then route to sub-agents as needed
            if N8N_CEO_WEBHOOK_URL:
                import urllib.request
                n8n_payload = json.dumps({
                    'communication_id': doc['$id'],
                    'from_phone': from_phone,
                    'message': message,
                    'target_agent': target_agent
                }).encode()
                
                n8n_req = urllib.request.Request(
                    N8N_CEO_WEBHOOK_URL,
                    data=n8n_payload,
                    headers={'Content-Type': 'application/json'}
                )
                urllib.request.urlopen(n8n_req, timeout=10)
            
            return context.res.json({
                'status': 'received',
                'communication_id': doc['$id'],
                'routed_to': target_agent
            })
        
        else:
            # === OUTBOUND: Send WhatsApp via Meta Cloud API ===
            # Called by n8n agents to send notifications to founder
            to_phone = data.get('to_phone', FOUNDER_PHONE)  # Default to founder
            message = data.get('message', '')
            agent_source = data.get('agent_source', 'CEO')
            notification_type = data.get('type', 'notification')  # brief, approval, alert, metric
            
            if not message:
                return context.res.json({'error': 'Missing message'}, 400)
            
            if not to_phone:
                return context.res.json({'error': 'No recipient phone (set FOUNDER_PHONE)'}, 400)
            
            # Format message with agent prefix
            formatted_message = f"🤖 *{agent_source} Agent*\n\n{message}"
            
            # Send via Meta Cloud API
            send_result = send_whatsapp_message(to_phone, formatted_message, context)
            
            # Store outbound in Communications
            doc = databases.create_document(
                database_id=DATABASE_ID,
                collection_id='Communications',
                document_id=ID.unique(),
                data={
                    'direction': 'outbound',
                    'channel': 'whatsapp',
                    'from_phone': WHATSAPP_PHONE_NUMBER_ID,
                    'to_agent': agent_source,
                    'message': message[:2000],
                    'status': 'sent' if send_result.get('success') else 'failed',
                    'metadata': json.dumps({
                        'to_phone': to_phone,
                        'type': notification_type,
                        'send_result': send_result
                    }),
                    'created_at': datetime.utcnow().isoformat()
                }
            )
            
            return context.res.json({
                'status': 'sent' if send_result.get('success') else 'failed',
                'communication_id': doc['$id'],
                'send_result': send_result
            })
    
    except Exception as e:
        context.log(f"Error in whatsapp-bridge: {str(e)}")
        return context.res.json({'error': str(e)}, 500)
