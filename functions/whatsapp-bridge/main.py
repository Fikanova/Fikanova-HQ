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
                # Return the challenge as plain text
                return context.res.send(hub_challenge, 200, {'Content-Type': 'text/plain'})
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
            # === OUTBOUND: Send WhatsApp via Sozuri ===
            # Called by agents to send responses
            to_phone = data.get('to_phone', '')
            message = data.get('message', '')
            agent_source = data.get('agent_source', 'CEO')
            
            if not to_phone or not message:
                return context.res.json({'error': 'Missing to_phone or message'}, 400)
            
            # Store outbound in Communications
            doc = databases.create_document(
                database_id=DATABASE_ID,
                collection_id='Communications',
                document_id=ID.unique(),
                data={
                    'direction': 'outbound',
                    'channel': 'whatsapp',
                    'from_phone': '',  # Our system number
                    'to_agent': agent_source,
                    'message': message[:2000],
                    'status': 'pending',
                    'metadata': json.dumps({'to_phone': to_phone}),
                    'created_at': datetime.utcnow().isoformat()
                }
            )
            
            # TODO: Integrate actual Sozuri send API
            # For now, mark as pending for n8n to handle
            
            return context.res.json({
                'status': 'queued',
                'communication_id': doc['$id']
            })
    
    except Exception as e:
        context.log(f"Error in whatsapp-bridge: {str(e)}")
        return context.res.json({'error': str(e)}, 500)
