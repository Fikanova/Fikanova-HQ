"""
Multi-LLM Engine - Appwrite Function
Fikanova OS v4.0

Features:
- Task-specific model routing (Grok for X, ChatGPT for LinkedIn, etc.)
- Automatic fallback when model unavailable or out of credits
- Cost tracking to Engine_Usage collection
- Circuit breaker pattern for reliability
"""
import os
import json
import time
from datetime import datetime
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID

# Environment
APPWRITE_ENDPOINT = os.environ.get('APPWRITE_ENDPOINT', 'https://fra.cloud.appwrite.io/v1')
APPWRITE_PROJECT_ID = os.environ.get('APPWRITE_PROJECT_ID')
APPWRITE_API_KEY = os.environ.get('APPWRITE_API_KEY')
DATABASE_ID = os.environ.get('DATABASE_ID', '693703ef001133c62d78')

# LLM API Keys
XAI_API_KEY = os.environ.get('XAI_API_KEY', '')
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')
GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY', '')
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY', '')

# Engine definitions with cost metadata
ENGINES = {
    # === Premium Engines ===
    'grok': {
        'name': 'Grok (xAI)',
        'url': 'https://api.x.ai/v1/chat/completions',
        'key': XAI_API_KEY,
        'model': 'grok-2',
        'cost_per_1k': 0.002,
        'best_for': ['x_post', 'x_thread', 'twitter', 'meme', 'edgy'],
        'fallback': 'mistral',
        'type': 'openai'
    },
    'chatgpt': {
        'name': 'ChatGPT (OpenAI)',
        'url': 'https://api.openai.com/v1/chat/completions',
        'key': OPENAI_API_KEY,
        'model': 'gpt-4o',
        'cost_per_1k': 0.005,
        'best_for': ['linkedin', 'newsletter', 'professional', 'formal'],
        'fallback': 'qwen',
        'type': 'openai'
    },
    'claude': {
        'name': 'Claude (Anthropic)',
        'url': 'https://api.anthropic.com/v1/messages',
        'key': ANTHROPIC_API_KEY,
        'model': 'claude-3-5-sonnet-20241022',
        'cost_per_1k': 0.003,
        'best_for': ['prd', 'code', 'security', 'analysis', 'long_form'],
        'fallback': 'deepseek',
        'type': 'anthropic'
    },
    'gemini': {
        'name': 'Gemini (Google)',
        'url': f'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GOOGLE_API_KEY}',
        'key': GOOGLE_API_KEY,
        'model': 'gemini-2.0-flash',
        'cost_per_1k': 0.00035,
        'best_for': ['general', 'summary', 'qa'],
        'fallback': 'qwen',
        'type': 'gemini'
    },
    
    # === OpenRouter Models (FREE or very cheap) ===
    'qwen': {
        'name': 'Qwen 2.5 (OpenRouter)',
        'url': 'https://openrouter.ai/api/v1/chat/completions',
        'key': OPENROUTER_API_KEY,
        'model': 'qwen/qwen-2.5-72b-instruct:free',
        'cost_per_1k': 0.0,  # FREE tier
        'best_for': ['simple', 'translation', 'summary'],
        'fallback': 'mistral',
        'type': 'openrouter'
    },
    'mistral': {
        'name': 'Mistral Large (OpenRouter)',
        'url': 'https://openrouter.ai/api/v1/chat/completions',
        'key': OPENROUTER_API_KEY,
        'model': 'mistralai/mistral-large-2411',
        'cost_per_1k': 0.002,
        'best_for': ['reasoning', 'multilingual', 'european'],
        'fallback': 'gemini',
        'type': 'openrouter'
    },
    'deepseek': {
        'name': 'DeepSeek V3 (OpenRouter)',
        'url': 'https://openrouter.ai/api/v1/chat/completions',
        'key': OPENROUTER_API_KEY,
        'model': 'deepseek/deepseek-chat',
        'cost_per_1k': 0.00014,  # VERY cheap
        'best_for': ['code', 'math', 'reasoning', 'chinese'],
        'fallback': 'qwen',
        'type': 'openrouter'
    },
    'llama': {
        'name': 'Llama 3.3 70B (OpenRouter)',
        'url': 'https://openrouter.ai/api/v1/chat/completions',
        'key': OPENROUTER_API_KEY,
        'model': 'meta-llama/llama-3.3-70b-instruct:free',
        'cost_per_1k': 0.0,  # FREE tier
        'best_for': ['general', 'chat', 'instruction'],
        'fallback': 'qwen',
        'type': 'openrouter'
    },
    'gemma': {
        'name': 'Gemma 2 27B (OpenRouter)',
        'url': 'https://openrouter.ai/api/v1/chat/completions',
        'key': OPENROUTER_API_KEY,
        'model': 'google/gemma-2-27b-it:free',
        'cost_per_1k': 0.0,  # FREE 
        'best_for': ['simple', 'formatting', 'spelling'],
        'fallback': None,
        'type': 'openrouter'
    }
}

# Task-to-engine routing (cost-optimized)
ROUTING = {
    # Premium tasks → Premium engines
    'x_post': 'grok',
    'x_thread': 'grok',
    'twitter': 'grok',
    'linkedin': 'chatgpt',
    'linkedin_newsletter': 'chatgpt',
    'newsletter': 'chatgpt',
    
    # Code/Analysis → Claude or DeepSeek (cheap)
    'prd': 'claude',
    'code': 'deepseek',       # DeepSeek is great for code + cheap
    'security_audit': 'claude',
    'analysis': 'claude',
    
    # General tasks → Free/Cheap models
    'blog': 'qwen',           # Qwen is free
    'summary': 'llama',       # Llama is free
    'qa': 'gemini',
    'general': 'gemini',
    'simple': 'gemma',        # Gemma is free
    
    # Formatting → Cheapest
    'spelling': 'gemma',
    'formatting': 'gemma',
    'translation': 'qwen',
    
    'default': 'gemini'
}

# In-memory circuit breaker state (reset on cold start)
engine_status = {engine_id: {'failures': 0, 'last_error': None} for engine_id in ENGINES}


def is_engine_available(engine_id: str) -> bool:
    """Check if an engine is available (has key and not circuit-broken)."""
    engine = ENGINES.get(engine_id)
    if not engine:
        return False
    
    # Check if API key is configured
    if not engine['key']:
        return False
    
    # Circuit breaker: 3 failures = disabled for this invocation
    if engine_status[engine_id]['failures'] >= 3:
        return False
    
    return True


def select_engine(task_type: str) -> tuple:
    """Select the best available engine for the task type."""
    preferred_id = ROUTING.get(task_type, ROUTING['default'])
    
    # Try preferred engine
    if is_engine_available(preferred_id):
        return preferred_id, ENGINES[preferred_id], False
    
    # Walk fallback chain
    current_id = preferred_id
    visited = set()
    
    while current_id and current_id not in visited:
        visited.add(current_id)
        engine = ENGINES.get(current_id)
        if not engine:
            break
        
        fallback_id = engine.get('fallback')
        if fallback_id and is_engine_available(fallback_id):
            return fallback_id, ENGINES[fallback_id], True
        
        current_id = fallback_id
    
    # Emergency: find any available engine
    for engine_id, engine in ENGINES.items():
        if is_engine_available(engine_id):
            return engine_id, engine, True
    
    return None, None, False


def call_openai_compatible(engine: dict, prompt: str, context) -> dict:
    """Call OpenAI-compatible API (OpenAI, Grok)."""
    import urllib.request
    import urllib.error
    
    payload = json.dumps({
        'model': engine['model'],
        'messages': [{'role': 'user', 'content': prompt}],
        'max_tokens': 2000
    }).encode()
    
    headers = {
        'Authorization': f"Bearer {engine['key']}",
        'Content-Type': 'application/json'
    }
    
    req = urllib.request.Request(engine['url'], data=payload, headers=headers)
    response = urllib.request.urlopen(req, timeout=30)
    data = json.loads(response.read().decode())
    
    return {
        'text': data['choices'][0]['message']['content'],
        'usage': data.get('usage', {}),
        'tokens': data.get('usage', {}).get('total_tokens', 0)
    }


def call_anthropic(engine: dict, prompt: str, context) -> dict:
    """Call Anthropic Claude API."""
    import urllib.request
    
    payload = json.dumps({
        'model': engine['model'],
        'max_tokens': 2000,
        'messages': [{'role': 'user', 'content': prompt}]
    }).encode()
    
    headers = {
        'x-api-key': engine['key'],
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
    }
    
    req = urllib.request.Request(engine['url'], data=payload, headers=headers)
    response = urllib.request.urlopen(req, timeout=30)
    data = json.loads(response.read().decode())
    
    input_tokens = data.get('usage', {}).get('input_tokens', 0)
    output_tokens = data.get('usage', {}).get('output_tokens', 0)
    
    return {
        'text': data['content'][0]['text'],
        'usage': data.get('usage', {}),
        'tokens': input_tokens + output_tokens
    }


def call_gemini(engine: dict, prompt: str, context) -> dict:
    """Call Google Gemini API."""
    import urllib.request
    
    payload = json.dumps({
        'contents': [{'parts': [{'text': prompt}]}]
    }).encode()
    
    headers = {'Content-Type': 'application/json'}
    
    req = urllib.request.Request(engine['url'], data=payload, headers=headers)
    response = urllib.request.urlopen(req, timeout=30)
    data = json.loads(response.read().decode())
    
    usage = data.get('usageMetadata', {})
    tokens = usage.get('totalTokenCount', 0)
    
    return {
        'text': data['candidates'][0]['content']['parts'][0]['text'],
        'usage': usage,
        'tokens': tokens
    }


def call_openrouter(engine: dict, prompt: str, context) -> dict:
    """Call OpenRouter API (Qwen, Mistral, DeepSeek, Llama, Gemma)."""
    import urllib.request
    
    payload = json.dumps({
        'model': engine['model'],
        'messages': [{'role': 'user', 'content': prompt}],
        'max_tokens': 2000
    }).encode()
    
    headers = {
        'Authorization': f"Bearer {engine['key']}",
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://fikanova.com',
        'X-Title': 'Fikanova OS'
    }
    
    req = urllib.request.Request(engine['url'], data=payload, headers=headers)
    response = urllib.request.urlopen(req, timeout=60)
    data = json.loads(response.read().decode())
    
    return {
        'text': data['choices'][0]['message']['content'],
        'usage': data.get('usage', {}),
        'tokens': data.get('usage', {}).get('total_tokens', 0)
    }


def call_engine(engine_id: str, engine: dict, prompt: str, context) -> dict:
    """Route to the appropriate API caller based on engine type."""
    engine_type = engine.get('type', 'openai')
    
    if engine_type == 'openai':
        return call_openai_compatible(engine, prompt, context)
    elif engine_type == 'anthropic':
        return call_anthropic(engine, prompt, context)
    elif engine_type == 'gemini':
        return call_gemini(engine, prompt, context)
    elif engine_type == 'openrouter':
        return call_openrouter(engine, prompt, context)
    else:
        raise ValueError(f"Unknown engine type: {engine_type}")


def log_usage(databases: Databases, engine_id: str, engine: dict, result: dict, 
              task_type: str, latency_ms: int, fallback_used: bool, context):
    """Log usage to Engine_Usage collection."""
    try:
        tokens = result.get('tokens', 0)
        cost = (tokens / 1000) * engine.get('cost_per_1k', 0)
        
        databases.create_document(
            database_id=DATABASE_ID,
            collection_id='Engine_Usage',
            document_id=ID.unique(),
            data={
                'engine': engine_id,
                'model': engine['model'],
                'task_type': task_type,
                'tokens_used': tokens,
                'cost_usd': cost,
                'latency_ms': latency_ms,
                'fallback_used': fallback_used,
                'created_at': datetime.utcnow().isoformat()
            }
        )
    except Exception as e:
        context.log(f"Failed to log usage: {e}")


def main(context):
    """
    Appwrite Function Entry Point
    
    Request body:
    {
        "task_type": "x_post|linkedin|prd|code|summary|etc",
        "prompt": "Your prompt here",
        "engine": "optional - force specific engine"
    }
    """
    try:
        # Parse request
        req = context.req
        body = req.body if hasattr(req, 'body') else '{}'
        
        if isinstance(body, str):
            data = json.loads(body) if body else {}
        else:
            data = body or {}
        
        task_type = data.get('task_type', 'default')
        prompt = data.get('prompt', '')
        force_engine = data.get('engine')
        
        if not prompt:
            return context.res.json({'error': 'Missing prompt'}, 400)
        
        # Initialize Appwrite
        client = Client()
        client.set_endpoint(APPWRITE_ENDPOINT)
        client.set_project(APPWRITE_PROJECT_ID)
        client.set_key(APPWRITE_API_KEY)
        databases = Databases(client)
        
        # Select engine
        if force_engine and is_engine_available(force_engine):
            engine_id = force_engine
            engine = ENGINES[force_engine]
            fallback_used = False
        else:
            engine_id, engine, fallback_used = select_engine(task_type)
        
        if not engine_id:
            return context.res.json({'error': 'No LLM engines available'}, 503)
        
        context.log(f"Using engine: {engine['name']} for task: {task_type}")
        if fallback_used:
            context.log("(fallback from preferred engine)")
        
        # Call engine with retry
        max_retries = 3
        last_error = None
        
        for attempt in range(max_retries):
            try:
                start_time = time.time()
                result = call_engine(engine_id, engine, prompt, context)
                latency_ms = int((time.time() - start_time) * 1000)
                
                # Reset failure count on success
                engine_status[engine_id]['failures'] = 0
                
                # Log usage
                log_usage(databases, engine_id, engine, result, task_type, 
                         latency_ms, fallback_used, context)
                
                return context.res.json({
                    'success': True,
                    'engine': engine_id,
                    'model': engine['model'],
                    'text': result['text'],
                    'tokens': result.get('tokens', 0),
                    'cost_usd': (result.get('tokens', 0) / 1000) * engine.get('cost_per_1k', 0),
                    'latency_ms': latency_ms,
                    'fallback_used': fallback_used
                })
                
            except Exception as e:
                last_error = str(e)
                engine_status[engine_id]['failures'] += 1
                engine_status[engine_id]['last_error'] = last_error
                context.log(f"Engine {engine_id} failed (attempt {attempt + 1}): {last_error}")
                
                # Try fallback on failure
                if attempt < max_retries - 1:
                    fallback_id = engine.get('fallback')
                    if fallback_id and is_engine_available(fallback_id):
                        engine_id = fallback_id
                        engine = ENGINES[fallback_id]
                        fallback_used = True
                        context.log(f"Falling back to: {engine['name']}")
        
        return context.res.json({
            'error': f'All engines failed: {last_error}',
            'last_engine': engine_id
        }, 500)
        
    except Exception as e:
        context.log(f"Error in multi-llm-engine: {str(e)}")
        return context.res.json({'error': str(e)}, 500)
