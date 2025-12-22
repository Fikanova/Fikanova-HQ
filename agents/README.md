# Fikanova OS v3.0 - Agentic C-Suite

Production-ready n8n workflow system implementing a 3-layer AI agency.

## 📁 Architecture

```
                    ┌─────────────────────────────┐
                    │     CEO Agent (Router)      │  ← LAYER 1
                    │   Intent: Gemini 2.0 Flash  │
                    └──────────────┬──────────────┘
                                   │
        ┌──────────┬───────────┬───┴───┬───────────┬──────────┐
        ▼          ▼           ▼       ▼           ▼          ▼
    ┌──────┐  ┌──────┐    ┌──────┐ ┌──────┐   ┌──────┐   ┌──────┐
    │ CMO  │  │ CFO  │    │ CTO  │ │ CIO  │   │CimpO │   │      │  ← LAYER 2
    │Growth│  │Wealth│    │Build │ │Know  │   │Gov   │   │      │
    └──┬───┘  └──┬───┘    └──┬───┘ └──┬───┘   └──┬───┘   └──────┘
       │         │           │        │          │
       ▼         ▼           ▼        ▼          ▼
┌─────────────┐ ┌────┐  ┌────────┐ ┌────────┐ ┌───────┐
│Marketing    │ │Acct│  │Dev     │ │Librarian││Audit  │  ← SUB-AGENTS
│Lead, Editor │ │    │  │Security│ │        │ │       │
└─────────────┘ └────┘  └────────┘ └────────┘ └───────┘
                                   
                    ┌─────────────────────────────┐
                    │      L3 SPECIALIST SKILLS   │  ← LAYER 3
                    │  PRD Gen | Sheng NLP | etc  │
                    └─────────────────────────────┘
```

## 🚀 Quick Start

1. **Import to n8n** (Railway):
   ```bash
   # Import in this order:
   1. L2_functional/**/workflow.json (Sub-agents)
   2. L3_skills/*.json (Skills)
   3. L1_c_suite/**/orchestrator.json (C-Suite)
   4. fikanova_master_orchestrator.json (Master)
   ```

2. **Configure credentials**:
   - Google Gemini API
   - Appwrite API
   - HubSpot API
   - Google Sheets OAuth2
   - HumanLayer (HITL)

3. **Set environment variables** (see `.env.n8n.example`)

4. **Activate workflows**

## 📂 File Structure

```
agents/
├── fikanova_master_orchestrator.json   # Central Nervous System
├── .env.n8n.example                    # Environment template
│
├── L1_c_suite/                         # LAYER 1: STRATEGIC
│   ├── ceo/orchestrator.json           # Intent → Route to C-Suite
│   ├── cmo/orchestrator.json           # Growth/Marketing
│   ├── cfo/orchestrator.json           # Wealth/Finance
│   ├── cto/orchestrator.json           # Build/Tech
│   ├── cio/orchestrator.json           # Knowledge/Data
│   └── cimpo/orchestrator.json         # Governance/Compliance
│
├── L2_functional/                      # LAYER 2: SUB-AGENTS
│   ├── marketing_lead/workflow.json    # Content creation (CMO)
│   ├── editor/workflow.json            # Tone refinement (CMO)
│   ├── head_of_accounts/manager.json   # Ledgering (CFO)
│   ├── dev_agent/workflow.json         # Code execution (CTO)
│   ├── security_agent/workflow.json    # Trust audits (CTO)
│   ├── librarian/workflow.json         # Documentation (CIO)
│   └── audit_agent/workflow.json       # Compliance (CimpO)
│
├── L3_skills/                          # LAYER 3: MODULAR SKILLS
│   ├── skill_prd_generator.json        # Tally → PRD Markdown
│   ├── skill_sheng_nlp.json            # Sheng → Formal Intent
│   └── skill_google_sheets_ledger.json # Transaction Logging
│
├── L3_specialists/                     # LAYER 3: DOMAIN SPECIALISTS
│   ├── kra_bot.json                    # eTIMS invoicing
│   ├── expense_tracker.json            # Expense logging
│   ├── runway_calc.json                # Burn rate calculator
│   ├── case_study_writer.json          # Case study drafts
│   ├── social_poster.json              # LinkedIn/X posts
│   ├── newsletter_bot.json             # Email campaigns
│   └── morning_briefer.json            # Daily digest
│
└── prompts/                            # System prompts
    ├── cmo/Style_Guide.v1.md           # CMO Editor style guide
    └── system_prompt.md                # PRD generator prompt
```

## 🔌 Integrations

| Service | Purpose | Used By |
|---------|---------|---------|
| Gemini 2.0 Flash | Intent classification | All agents |
| Appwrite | Database, articles, logs | CIO, Librarian |
| HubSpot | CRM, email, blog | CMO, Marketing |
| Google Sheets | Central Ledger | CFO, Accounts |
| M-Pesa Daraja | STK Push | CFO |
| GitHub API | Code management | CTO, Dev |
| HumanLayer.dev | HITL approvals | All state-changing |

## 🛡️ Human-in-the-Loop (HITL)

All state-changing actions require approval via HumanLayer → WhatsApp:
- Publishing content (CMO)
- Sending emails (CMO)
- M-Pesa transactions (CFO)
- Code deployments (CTO)

## 🔄 Core Workflow Logic

1. **Dual-Write Pipeline**: CMO approval → HubSpot (Newsletter) + Appwrite (Blog)
2. **CFO Ledger Loop**: HubSpot "Deal Won" → skill_google_sheets_ledger
3. **Error Routing**: All agents → CimpO on error → Appwrite agent_logs

## 📅 Updated
2024-12-22 (v3.0)
