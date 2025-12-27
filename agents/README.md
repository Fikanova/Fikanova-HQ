# Fikanova OS v4.0 - Multi-LLM Agentic Architecture

Production-ready agent system with multi-LLM routing, progressive disclosure skills, and hybrid API integration.

## 📁 Architecture

```
                        APPWRITE (5 Functions)
┌─────────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  whatsapp-   │  │  multi-llm-  │  │   daraja-    │              │
│  │   bridge     │  │   engine     │  │  payments    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│  ┌──────────────┐  ┌──────────────┐                                │
│  │  github-     │  │    cron-     │                                │
│  │   tools      │  │  monitors    │                                │
│  └──────────────┘  └──────────────┘                                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                        N8N (Railway)
┌─────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │     CEO Agent → CMO / CFO / CTO / CIO / CimpO               │   │
│  │          │                                                   │   │
│  │          ▼                                                   │   │
│  │   Multi-LLM Engine (Grok → ChatGPT → Claude → Gemini)       │   │
│  │          │                                                   │   │
│  │          ▼                                                   │   │
│  │   Skills Layer (Progressive Disclosure)                      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

1. **Deploy Appwrite functions**:
   ```bash
   appwrite deploy function
   ```

2. **Import n8n workflows**:
   ```bash
   # Import in this order:
   1. L3_skills (with progressive disclosure)
   2. L2_functional workflows
   3. L1_c_suite orchestrators
   4. fikanova_master_orchestrator.json
   ```

3. **Configure API keys** (see `.env.example`):
   - Google Gemini API
   - OpenAI API (ChatGPT, DALL-E)
   - Anthropic Claude API
   - xAI Grok API
   - Appwrite, HubSpot, Google Sheets

4. **Activate workflows**

## 🔀 Multi-LLM Engine (Cost Arbitrage)

Routes tasks to the optimal LLM based on capability and cost:

| Task | Primary Engine | Fallback Chain | Cost/1K |
|------|---------------|----------------|---------|
| X posts/threads | **Grok** | → Claude → Gemini | $0.002 |
| LinkedIn/newsletters | **ChatGPT** | → Claude → Gemini | $0.005 |
| PRDs, code, security | **Claude** | → Gemini | $0.003 |
| Summaries, Q&A | **Gemini** | → Gemini Nano | $0.00035 |
| Spellcheck | **Gemini Nano** | (cheapest) | $0.0001 |

**Features:**
- 🔄 Automatic fallback when model unavailable
- 🛡️ Circuit breaker (3 failures → cooldown)
- 💰 Cost tracking to `Engine_Usage` collection
- 🔌 Add new engines without code changes

**Files:**
- [`functions/multi-llm-engine/main.py`](functions/multi-llm-engine/main.py) - Appwrite function
- [`agents/core/agent_engine_wrapper.js`](agents/core/agent_engine_wrapper.js) - JS wrapper

## 📦 Skills (Progressive Disclosure)

Skills load in two stages to save tokens:
1. **Metadata** (~100 tokens) - triggers, engine preference
2. **Instructions** (on match) - full prompt

| Skill | Triggers | Engine | Output |
|-------|----------|--------|--------|
| `prd_generator` | "prd", "product spec" | Claude | Markdown → Drive |
| `sheng_nlp` | Kenyan slang | Gemini | JSON intent |
| `brand_guidelines` | "style check" | ChatGPT | Revised content |
| `ledger_skill` | "expense", "revenue" | Gemini | JSON → Sheets |

**Files:**
```
L3_skills/
├── prd_generator/
│   ├── metadata.json        # ~100 tokens
│   └── instructions.md      # <5k tokens
├── sheng_nlp/
├── brand_guidelines/
└── ledger_skill/
```

**Loader:** [`agents/core/skill_loader.js`](agents/core/skill_loader.js)

## 🔌 Integration Wrapper (Hybrid MCP + API)

Tries MCP first, falls back to direct API:

| Service | MCP Available? | Direct API |
|---------|----------------|------------|
| M-Pesa Daraja | ❌ No | ✅ Full |
| Appwrite | ⚠️ Community | ✅ Full |
| WhatsApp | ❌ No | ✅ Full |
| Sozuri SMS | ❌ No | ✅ Full |
| Google Sheets | ✅ Official | ✅ Fallback |
| HubSpot | ⚠️ Community | ✅ Fallback |

**File:** [`agents/core/integration_wrapper.js`](agents/core/integration_wrapper.js)

## 📂 File Structure

```
agents/
├── fikanova_master_orchestrator.json   # Central Nervous System
├── core/                               # CORE UTILITIES
│   ├── agent_engine_wrapper.js         # Multi-LLM routing (JS)
│   ├── integration_wrapper.js          # Hybrid API wrapper
│   └── skill_loader.js                 # Progressive disclosure
│
├── L1_c_suite/                         # LAYER 1: STRATEGIC
│   ├── ceo/orchestrator.json           # Intent → Route
│   ├── cmo/orchestrator.json           # Growth
│   ├── cfo/orchestrator.json           # Wealth
│   ├── cto/orchestrator.json           # Build
│   ├── cio/orchestrator.json           # Knowledge
│   └── cimpo/orchestrator.json         # Governance
│
├── L2_functional/                      # LAYER 2: SUB-AGENTS
│   ├── marketing_lead/                 # Content (CMO)
│   ├── editor/                         # Tone (CMO)
│   ├── head_of_accounts/               # Ledger (CFO)
│   ├── dev_agent/                      # Code (CTO)
│   ├── security_agent/                 # Audits (CTO)
│   ├── librarian/                      # Docs (CIO)
│   └── audit_agent/                    # Compliance (CimpO)
│
├── L3_skills/                          # LAYER 3: SKILLS
│   ├── prd_generator/                  # PRD generation
│   │   ├── metadata.json
│   │   └── instructions.md
│   ├── sheng_nlp/                      # Kenyan slang
│   ├── brand_guidelines/               # Style enforcement
│   └── ledger_skill/                   # Financial entries
│
└── L3_specialists/                     # LAYER 3: SPECIALISTS
    ├── kra_bot.json                    # eTIMS invoicing
    ├── expense_tracker.json            # Expense logging
    └── morning_briefer.json            # Daily digest

functions/
├── whatsapp-bridge/                    # WhatsApp in/out
├── multi-llm-engine/                   # LLM routing (NEW)
├── daraja-payments/                    # M-Pesa + KRA
├── github-tools/                       # Repo ops
└── cron-monitors/                      # Scheduled jobs
```

## 🗄️ Database Collections

| Collection | Purpose |
|------------|---------|
| `Engine_Usage` | LLM cost tracking per request |
| `Engine_Status` | Circuit breaker state |
| `Communications` | WhatsApp messages |
| `Expenses` | Financial entries |
| `Runway_Snapshots` | Burn rate history |

## 🛡️ Human-in-the-Loop (HITL)

State-changing actions require WhatsApp approval:
- Publishing content (CMO)
- M-Pesa transactions > 50k KES (CFO)
- Code deployments (CTO)
- Personnel expenses (CFO)

## 🔮 Future Roadmap

| Phase | Focus | When |
|-------|-------|------|
| ✅ Now | Multi-LLM engine + n8n | Done |
| 🔄 Next | Skills restructure | Q1 2025 |
| 📅 Later | Google ADK migration | Q2 2025 |
| 📅 Future | OpenAI SDK for client-facing | Q3 2025 |

## 📅 Updated
2024-12-23 (v4.0)

