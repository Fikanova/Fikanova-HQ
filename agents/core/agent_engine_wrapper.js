/**
 * Fikanova Multi-LLM Engine Wrapper
 * 
 * Features:
 * - Task-specific model routing (Grok for X, ChatGPT for LinkedIn, etc.)
 * - Automatic fallback when model unavailable or out of credits
 * - Cost optimization with CimpO arbitrage logic
 */

// Engine definitions with cost and capability metadata
const ENGINES = {
    // === Text Models ===
    grok: {
        name: 'Grok (xAI)',
        sdk: 'xai-sdk',
        model: 'grok-2',
        costPer1kTokens: 0.002,
        bestFor: ['x_posts', 'x_threads', 'twitter', 'memes', 'edgy_content'],
        priority: 1,
        fallbackTo: 'claude'
    },
    chatgpt: {
        name: 'ChatGPT (OpenAI)',
        sdk: 'openai',
        model: 'gpt-4o',
        costPer1kTokens: 0.005,
        bestFor: ['linkedin', 'newsletter', 'professional', 'formal_writing'],
        priority: 1,
        fallbackTo: 'claude'
    },
    claude: {
        name: 'Claude (Anthropic)',
        sdk: '@anthropic-ai/sdk',
        model: 'claude-3-5-sonnet-20241022',
        costPer1kTokens: 0.003,
        bestFor: ['code', 'prd', 'security_audit', 'long_form', 'analysis'],
        priority: 2,
        fallbackTo: 'gemini'
    },
    gemini: {
        name: 'Gemini (Google)',
        sdk: '@google/generative-ai',
        model: 'gemini-2.0-flash',
        costPer1kTokens: 0.00035,
        bestFor: ['general', 'summaries', 'qa', 'multimodal'],
        priority: 3,
        fallbackTo: 'gemini_nano'
    },
    gemini_nano: {
        name: 'Gemini Nano (Google)',
        sdk: '@google/generative-ai',
        model: 'gemini-1.5-flash-8b',
        costPer1kTokens: 0.0001,
        bestFor: ['spelling', 'formatting', 'simple_tasks'],
        priority: 4,
        fallbackTo: null // Last resort
    },

    // === Specialized Models ===
    dalle3: {
        name: 'DALL-E 3 (OpenAI)',
        sdk: 'openai',
        model: 'dall-e-3',
        type: 'image',
        costPerImage: 0.04,
        bestFor: ['image_generation', 'marketing_visuals'],
        fallbackTo: 'gemini_imagen'
    },
    gemini_video: {
        name: 'Gemini Video (Google)',
        sdk: '@google/generative-ai',
        model: 'gemini-2.0-flash',
        type: 'video',
        costPerMinute: 0.001,
        bestFor: ['video_analysis', 'youtube'],
        fallbackTo: null
    },
    whisper: {
        name: 'Whisper (OpenAI)',
        sdk: 'openai',
        model: 'whisper-1',
        type: 'audio',
        costPerMinute: 0.006,
        bestFor: ['transcription', 'voice'],
        fallbackTo: 'gemini'
    }
};

// Task-to-engine routing rules
const ROUTING_RULES = {
    // Social Media
    'x_post': 'grok',
    'x_thread': 'grok',
    'twitter': 'grok',
    'linkedin_post': 'chatgpt',
    'linkedin_newsletter': 'chatgpt',

    // Content Creation
    'blog': 'chatgpt',
    'newsletter': 'chatgpt',
    'case_study': 'claude',
    'prd': 'claude',

    // Technical
    'code': 'claude',
    'security_audit': 'claude',
    'code_review': 'claude',

    // Operations
    'summary': 'gemini',
    'qa': 'gemini',
    'spelling': 'gemini_nano',
    'formatting': 'gemini_nano',

    // Multimodal
    'image': 'dalle3',
    'video_analysis': 'gemini_video',
    'transcription': 'whisper',

    // Default
    'default': 'gemini'
};

// Credit/availability tracking (would be persisted in production)
const engineStatus = new Map();

/**
 * Initialize engine status tracking
 */
function initializeEngineStatus() {
    Object.keys(ENGINES).forEach(engineId => {
        engineStatus.set(engineId, {
            available: true,
            creditsRemaining: null, // null = unknown/unlimited
            lastError: null,
            lastSuccess: null,
            consecutiveFailures: 0
        });
    });
}

/**
 * Check if an engine is available
 */
function isEngineAvailable(engineId) {
    const status = engineStatus.get(engineId);
    if (!status) return false;

    // Unavailable if credits depleted
    if (status.creditsRemaining !== null && status.creditsRemaining <= 0) {
        return false;
    }

    // Unavailable if too many consecutive failures (circuit breaker)
    if (status.consecutiveFailures >= 3) {
        // Reset after 5 minutes
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        if (status.lastError && status.lastError > fiveMinutesAgo) {
            return false;
        }
        // Reset circuit breaker
        status.consecutiveFailures = 0;
    }

    return status.available;
}

/**
 * Get the best engine for a task with fallback chain
 */
function selectEngine(taskType, options = {}) {
    const preferredEngineId = ROUTING_RULES[taskType] || ROUTING_RULES['default'];

    // Try preferred engine first
    if (isEngineAvailable(preferredEngineId)) {
        return { engineId: preferredEngineId, engine: ENGINES[preferredEngineId] };
    }

    // Walk the fallback chain
    let currentEngineId = preferredEngineId;
    const visited = new Set();

    while (currentEngineId && !visited.has(currentEngineId)) {
        visited.add(currentEngineId);
        const engine = ENGINES[currentEngineId];

        if (!engine) break;

        const fallbackId = engine.fallbackTo;
        if (fallbackId && isEngineAvailable(fallbackId)) {
            console.log(`[Engine] Fallback: ${preferredEngineId} → ${fallbackId}`);
            return { engineId: fallbackId, engine: ENGINES[fallbackId], fallback: true };
        }

        currentEngineId = fallbackId;
    }

    // Emergency: find any available engine
    for (const [engineId, engine] of Object.entries(ENGINES)) {
        if (engine.type && engine.type !== 'text') continue; // Skip specialized models
        if (isEngineAvailable(engineId)) {
            console.log(`[Engine] Emergency fallback to: ${engineId}`);
            return { engineId, engine, emergency: true };
        }
    }

    throw new Error('No LLM engines available');
}

/**
 * Mark an engine as failed (for circuit breaker)
 */
function markEngineFailed(engineId, error) {
    const status = engineStatus.get(engineId);
    if (status) {
        status.consecutiveFailures++;
        status.lastError = Date.now();

        // Check for credit-related errors
        const errorMsg = error?.message?.toLowerCase() || '';
        if (errorMsg.includes('quota') || errorMsg.includes('credit') || errorMsg.includes('billing')) {
            status.creditsRemaining = 0;
            console.log(`[Engine] ${engineId} credits depleted`);
        }
    }
}

/**
 * Mark an engine as successful (reset circuit breaker)
 */
function markEngineSuccess(engineId) {
    const status = engineStatus.get(engineId);
    if (status) {
        status.consecutiveFailures = 0;
        status.lastSuccess = Date.now();
        status.available = true;
    }
}

/**
 * Execute a task with automatic engine selection and fallback
 */
async function executeWithEngine(taskType, prompt, options = {}) {
    const maxRetries = options.maxRetries || 3;
    let lastError = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        const { engineId, engine, fallback, emergency } = selectEngine(taskType, options);

        console.log(`[Engine] Attempt ${attempt + 1}: Using ${engine.name} for "${taskType}"`);
        if (fallback) console.log(`[Engine] (fallback from preferred engine)`);
        if (emergency) console.log(`[Engine] (emergency - all preferred unavailable)`);

        try {
            const result = await callEngine(engineId, engine, prompt, options);
            markEngineSuccess(engineId);

            return {
                success: true,
                engine: engineId,
                model: engine.model,
                result,
                cost: calculateCost(engine, result),
                fallback: fallback || false,
                emergency: emergency || false
            };
        } catch (error) {
            lastError = error;
            markEngineFailed(engineId, error);
            console.error(`[Engine] ${engineId} failed:`, error.message);

            // Continue to next attempt (will trigger fallback)
            continue;
        }
    }

    throw new Error(`All engines failed after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

/**
 * Call a specific engine's SDK
 */
async function callEngine(engineId, engine, prompt, options) {
    switch (engine.sdk) {
        case 'openai':
            return await callOpenAI(engine, prompt, options);
        case '@anthropic-ai/sdk':
            return await callClaude(engine, prompt, options);
        case '@google/generative-ai':
            return await callGemini(engine, prompt, options);
        case 'xai-sdk':
            return await callGrok(engine, prompt, options);
        default:
            throw new Error(`Unknown SDK: ${engine.sdk}`);
    }
}

// === SDK Implementations ===

async function callOpenAI(engine, prompt, options) {
    // In production, use actual OpenAI SDK
    // const OpenAI = require('openai');
    // const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Placeholder - replace with actual SDK call
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: engine.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: options.maxTokens || 2000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return {
        text: data.choices[0].message.content,
        usage: data.usage
    };
}

async function callClaude(engine, prompt, options) {
    if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY not configured');
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: engine.model,
            max_tokens: options.maxTokens || 2000,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Anthropic API error');
    }

    const data = await response.json();
    return {
        text: data.content[0].text,
        usage: data.usage
    };
}

async function callGemini(engine, prompt, options) {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY not configured');
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${engine.model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Gemini API error');
    }

    const data = await response.json();
    return {
        text: data.candidates[0].content.parts[0].text,
        usage: data.usageMetadata
    };
}

async function callGrok(engine, prompt, options) {
    if (!process.env.XAI_API_KEY) {
        throw new Error('XAI_API_KEY not configured');
    }

    // Grok uses OpenAI-compatible API
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.XAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: engine.model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: options.maxTokens || 2000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'xAI API error');
    }

    const data = await response.json();
    return {
        text: data.choices[0].message.content,
        usage: data.usage
    };
}

/**
 * Calculate cost for a request
 */
function calculateCost(engine, result) {
    if (engine.type === 'image') {
        return engine.costPerImage;
    }

    const tokens = result.usage?.total_tokens ||
        result.usage?.input_tokens + result.usage?.output_tokens ||
        0;

    return (tokens / 1000) * (engine.costPer1kTokens || 0);
}

// Initialize on load
initializeEngineStatus();

// === Exports ===
module.exports = {
    ENGINES,
    ROUTING_RULES,
    executeWithEngine,
    selectEngine,
    isEngineAvailable,
    markEngineFailed,
    markEngineSuccess,
    initializeEngineStatus
};
