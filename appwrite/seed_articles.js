#!/usr/bin/env node
/**
 * Seed Articles to Appwrite
 * Run with: node appwrite/seed_articles.js
 * 
 * Requires environment variables:
 * - VITE_APPWRITE_ENDPOINT or uses default Frankfurt endpoint
 * - VITE_APPWRITE_PROJECT_ID or uses default project
 * - VITE_APPWRITE_API_KEY (required - get from Appwrite Console)
 */

const { Client, Databases, ID, Query } = require('node-appwrite');
require('dotenv').config();

// Configuration
const ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID || '6936df5800371a655e8e';
const API_KEY = process.env.VITE_APPWRITE_API_KEY;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID || '693703ef001133c62d78';
const ARTICLES_COLLECTION_ID = 'Articles';

if (!API_KEY) {
    console.error('❌ VITE_APPWRITE_API_KEY is required');
    console.log('Get your API key from: https://fra.cloud.appwrite.io/console/project-' + PROJECT_ID + '/settings/keys');
    process.exit(1);
}

// Initialize Appwrite
const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

// Sample articles - AI, Automation, and Business Strategy focused
const articles = [
    {
        title: 'Building AI Agents That Actually Work',
        slug: 'building-ai-agents-that-work',
        excerpt: 'Most AI agent projects fail. Here\'s the architectural pattern that separates succeeding teams from struggling ones—and why multi-agent orchestration is the key.',
        content: `# Building AI Agents That Actually Work

The promise of AI agents is compelling: autonomous software that can reason, plan, and execute complex tasks. But the reality? Most agent projects fail.

## Why Agents Fail

After building dozens of agent systems for clients, I've identified three critical failure patterns:

### 1. The Monolith Trap
Teams try to build one "super agent" that does everything. This never scales. Instead, use a **multi-agent architecture** where specialized agents collaborate.

### 2. No Human-in-the-Loop
Fully autonomous agents sound great until they send an invoice to the wrong client. Build approval checkpoints for state-changing actions.

### 3. Memory Amnesia
Agents without proper memory can't learn from past interactions. Implement short-term (session), medium-term (recent context), and long-term (knowledge base) memory.

## The Pattern That Works

\`\`\`
CEO Orchestrator
├── CMO Agent (Marketing)
│   ├── Content Agent
│   └── Analytics Agent
├── CFO Agent (Finance)
│   ├── Invoicing Agent
│   └── Reporting Agent
└── CTO Agent (Technical)
    ├── DevOps Agent
    └── Security Agent
\`\`\`

This hierarchical pattern mirrors human organizations for a reason—it works.

## Getting Started

1. Start with ONE well-defined use case
2. Build your orchestrator first
3. Add specialized agents incrementally
4. Always log decisions for debugging

The future belongs to companies that figure this out first.`,
        tags: 'AI, Agents, Automation, Architecture',
        author: 'Nyaenya Moseti',
        published_at: new Date('2024-12-20T10:00:00Z').toISOString()
    },
    {
        title: 'The Model Context Protocol (MCP) Explained',
        slug: 'mcp-protocol-explained',
        excerpt: 'Anthropic\'s new standard for connecting AI assistants to external tools and data. What it means for your stack and why it matters.',
        content: `# The Model Context Protocol (MCP) Explained

Anthropic just released something that could change how we build AI applications: the Model Context Protocol.

## What is MCP?

MCP is an open standard that defines how AI assistants connect to external data sources and tools. Think of it as a "USB for AI"—a universal interface that lets any AI model work with any data source.

## Why This Matters

Before MCP, every integration was custom. Want your AI to access Google Drive? Write a custom connector. Need Slack integration? Another custom connector. The result: fragmented, hard-to-maintain systems.

MCP changes this with:
- **Standardized protocols** for resource access
- **Built-in security** with permission scopes
- **Tool definitions** that any MCP-compatible AI can use

## Key Components

### Resources
Data sources your AI can access:
\`\`\`json
{
  "uri": "file:///path/to/document.pdf",
  "mimeType": "application/pdf",
  "name": "Q4 Report"
}
\`\`\`

### Tools
Actions your AI can perform:
\`\`\`json
{
  "name": "send_email",
  "description": "Send an email to a recipient",
  "inputSchema": { ... }
}
\`\`\`

### Prompts
Pre-built templates for common tasks.

## What to Do Now

1. Watch the MCP ecosystem—it's growing fast
2. Build new integrations using MCP from day one
3. Consider migrating existing connectors

This is the infrastructure layer that will power the next generation of AI applications.`,
        tags: 'Anthropic, MCP, Open Source, AI Infrastructure',
        author: 'Nyaenya Moseti',
        published_at: new Date('2024-12-18T09:00:00Z').toISOString()
    },
    {
        title: 'n8n vs Make vs Zapier: The Honest Comparison',
        slug: 'n8n-vs-make-vs-zapier',
        excerpt: 'After building 100+ automations, here\'s which tool wins for different use cases—and why self-hosting matters more than you think.',
        content: `# n8n vs Make vs Zapier: The Honest Comparison

I've built over 100 automations across all three platforms. Here's what I've learned.

## The Quick Answer

- **Zapier**: Best for non-technical users, simple automations
- **Make**: Best balance of power and usability
- **n8n**: Best for developers, complex workflows, and enterprises

## Zapier: The Gateway Drug

**Pros:**
- Intuitive interface anyone can use
- Largest app ecosystem (5,000+ integrations)
- Reliable and well-documented

**Cons:**
- Gets expensive fast ($750/mo for 50,000 tasks)
- Limited logic capabilities
- No self-hosting option

**Best for:** Marketing teams, simple CRM automations

## Make (formerly Integromat): The Sweet Spot

**Pros:**
- Visual workflow builder is excellent
- Better pricing than Zapier
- More complex logic supported

**Cons:**
- Learning curve is real
- Some integrations are buggy
- Still no self-hosting

**Best for:** Operations teams, moderate complexity

## n8n: The Developer's Choice

**Pros:**
- Self-hostable (own your data)
- Completely free tier is generous
- Can write custom code anywhere
- AI nodes built-in

**Cons:**
- Requires technical knowledge
- Fewer pre-built integrations
- You manage the infrastructure

**Best for:** Technical teams, AI workflows, data-sensitive industries

## My Recommendation

Start with Make for quick wins. Move to n8n when you need:
- Custom code in your workflows
- AI/LLM integrations
- Data residency requirements
- Cost control at scale

The self-hosting advantage of n8n becomes massive when you're running thousands of workflows.`,
        tags: 'Automation, Tools, Open Source, n8n, Make, Zapier',
        author: 'Nyaenya Moseti',
        published_at: new Date('2024-12-15T08:00:00Z').toISOString()
    },
    {
        title: 'Why SMEs Can\'t Wait on AI Adoption',
        slug: 'why-smes-need-ai-now',
        excerpt: 'The competitive window is closing. Here\'s the minimum viable AI stack every small business needs in 2025.',
        content: `# Why SMEs Can't Wait on AI Adoption

There's a dangerous narrative going around: "AI is for big companies. Small businesses should wait."

This is exactly backwards.

## The Window is Closing

Right now, AI tools are accessible and affordable. But the companies adopting today are building competitive moats that will be impossible to overcome in 2-3 years.

Consider:
- Customer service agents that never sleep
- Automated content creation at scale
- Intelligent document processing
- Predictive analytics on limited data

These aren't future tech. They're available now, often for under $100/month.

## The Minimum Viable AI Stack

### 1. Customer Communication
**Tool:** WhatsApp Business + AI chatbot
**Cost:** ~$50/month
**ROI:** Handle 70% of inquiries automatically

### 2. Content Creation
**Tool:** AI writing assistant + human editor
**Cost:** ~$30/month
**ROI:** 5x content output

### 3. Document Processing
**Tool:** AI-powered inbox/document parser
**Cost:** ~$50/month
**ROI:** Save 10+ hours/week

### 4. Decision Support
**Tool:** AI analytics on your existing data
**Cost:** ~$100/month
**ROI:** Better decisions, fewer surprises

**Total: ~$230/month for a complete AI transformation.**

## The Real Cost of Waiting

While you wait:
- Competitors are automating
- Customer expectations are rising
- Talent is going to AI-forward companies
- The learning curve is getting steeper

## Start This Week

1. Pick ONE bottleneck in your business
2. Find an AI tool that addresses it
3. Run a 30-day pilot
4. Measure everything

The best time to start was last year. The second best time is now.`,
        tags: 'AI, Business, Strategy, SME',
        author: 'Nyaenya Moseti',
        published_at: new Date('2024-12-12T07:00:00Z').toISOString()
    },
    {
        title: 'Using Gemini 2.0 Flash in Production',
        slug: 'gemini-flash-for-production',
        excerpt: 'Google\'s new model is fast and cheap. Here\'s how we\'re using it for real-time customer support automation.',
        content: `# Using Gemini 2.0 Flash in Production

Google's Gemini 2.0 Flash has become our go-to model for production workloads. Here's why and how we use it.

## Why Flash?

### Speed
Response times under 500ms for most queries. This matters for:
- Real-time chat
- Live transcription
- Instant classification

### Cost
At $0.075 per million input tokens, it's 10x cheaper than GPT-4. For high-volume applications, this is game-changing.

### Quality
On our benchmarks, Flash performs within 5% of GPT-4 Turbo for most business tasks.

## Our Production Setup

### Multi-Model Architecture
\`\`\`
Incoming Request
    │
    ▼
Task Classifier (Flash)
    │
    ├── Simple Query → Flash (fast, cheap)
    ├── Complex Analysis → Pro (accurate)
    └── Creative Content → GPT-4 (quality)
\`\`\`

### Why This Works
- 80% of requests go to Flash
- Only complex cases use expensive models
- Average cost dropped 70%

## Real Results

**Customer Support Bot:**
- Response time: 380ms average
- Resolution rate: 73% without human
- Cost: $0.002 per conversation

**Document Classification:**
- Accuracy: 94.2%
- Throughput: 1000 docs/minute
- Cost: $0.0001 per document

## Implementation Tips

1. **Always set temperature low (0.1-0.3)** for consistent outputs
2. **Use structured outputs** with JSON mode
3. **Implement fallbacks** to other models
4. **Cache common responses** to reduce costs further

## The Bottom Line

Gemini Flash isn't the smartest model. But for production systems where speed and cost matter, it's currently unbeatable.`,
        tags: 'AI, Gemini, Google, Automation, Production',
        author: 'Nyaenya Moseti',
        published_at: new Date('2024-12-10T06:00:00Z').toISOString()
    },
    {
        title: 'Building an Autonomous Content Pipeline',
        slug: 'autonomous-content-pipeline',
        excerpt: 'How we use AI agents to research, draft, and publish content with human-in-the-loop quality control.',
        content: `# Building an Autonomous Content Pipeline

We publish 20+ pieces of content per week. Here's the agent system that makes it possible.

## The Architecture

### Agent 1: Research Scout
**Role:** Find trending topics and gather source material
**Tools:** Web search, social listening, competitor monitoring
**Output:** Research briefs with sources

### Agent 2: Content Strategist
**Role:** Decide what to write and in what format
**Tools:** Calendar, analytics, keyword research
**Output:** Content assignments

### Agent 3: Draft Writer
**Role:** Create initial drafts from research
**Tools:** LLM with brand voice training
**Output:** First drafts (70% complete)

### Agent 4: Editor
**Role:** Polish drafts, check facts, add links
**Tools:** Grammar check, fact verification, SEO optimization
**Output:** Publication-ready content

### Human: Final Approval
**Role:** Quality control gate
**Time:** 5-10 minutes per piece
**Decision:** Publish, revise, or reject

## The Human-in-the-Loop

Critical point: **no content publishes without human approval.**

The agents get us to 90% done. Humans provide:
- Brand judgment calls
- Factual verification
- Tone adjustments
- Final accountability

## Results After 6 Months

| Metric | Before | After |
|--------|--------|-------|
| Weekly posts | 4 | 22 |
| Time per post | 4 hours | 45 min |
| Quality score | 7.2 | 7.8 |
| Team size | 3 | 1 |

## The Tech Stack

- **Orchestration:** n8n (self-hosted)
- **LLM:** Gemini Flash + GPT-4 (for complex pieces)
- **Storage:** Appwrite
- **Publishing:** Direct API to CMS
- **Monitoring:** Custom dashboard

## Getting Started

1. Start with ONE content type
2. Build the research → draft flow first
3. Add human approval at every step initially
4. Gradually automate as confidence grows

The goal isn't to remove humans. It's to multiply their impact.`,
        tags: 'Agents, Content, Automation, Workflow',
        author: 'Nyaenya Moseti',
        published_at: new Date('2024-12-08T05:00:00Z').toISOString()
    }
];

async function seedArticles() {
    console.log('🌱 Seeding articles to Appwrite...\n');
    console.log(`   Endpoint: ${ENDPOINT}`);
    console.log(`   Project: ${PROJECT_ID}`);
    console.log(`   Database: ${DATABASE_ID}`);
    console.log(`   Collection: ${ARTICLES_COLLECTION_ID}\n`);

    let created = 0;
    let skipped = 0;

    for (const article of articles) {
        try {
            // Check if article with this slug already exists
            const existing = await databases.listDocuments(
                DATABASE_ID,
                ARTICLES_COLLECTION_ID,
                [Query.equal('slug', article.slug)]
            );

            if (existing.documents.length > 0) {
                console.log(`⏭️  Skipped: "${article.title}" (already exists)`);
                skipped++;
                continue;
            }

            // Create the article
            await databases.createDocument(
                DATABASE_ID,
                ARTICLES_COLLECTION_ID,
                ID.unique(),
                article
            );

            console.log(`✅ Created: "${article.title}"`);
            created++;
        } catch (error) {
            console.error(`❌ Failed: "${article.title}"`);
            console.error(`   Error: ${error.message}`);
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${articles.length}`);
}

seedArticles().catch(console.error);
