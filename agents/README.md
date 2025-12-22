# Fikanova OS v3.0 - Agentic C-Suite

Production-ready n8n workflow system implementing a 3-layer AI agency.

## 📁 Architecture

```
fikanova_master_orchestrator.json    ← Central Nervous System
├── L1: CEO Router (Gemini 2.0)
├── L2: C-Suite Managers (CMO/CFO/CTO/CIO/CimpO)
└── L3: Skills & Specialists
```

## 🚀 Quick Start

1. **Import to n8n** (Railway):
   ```bash
   # Import in this order:
   1. L3_skills/*.json (PRD Generator, Sheng NLP, Ledger)
   2. fikanova_master_orchestrator.json
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
├── fikanova_master_orchestrator.json   # Main 3-layer workflow
├── .env.n8n.example                    # Environment template
├── L1_c_suite/
│   ├── ceo/orchestrator.json           # CEO router (legacy, use master)
│   └── cimpo/cimp_engine.json          # CIMP learning engine
├── L2_functional/
│   └── head_of_content/manager.json    # Content pipeline
├── L3_skills/                          # Modular skills (new)
│   ├── skill_prd_generator.json        # Tally → PRD Markdown
│   ├── skill_sheng_nlp.json            # Sheng → formal intent
│   └── skill_google_sheets_ledger.json # Transaction logging
└── L3_specialists/                     # Domain specialists
    ├── editor_agent.json               # Brand voice refinement
    ├── kra_bot.json                    # eTIMS invoicing
    ├── expense_tracker.json            # Expense logging
    ├── runway_calc.json                # Burn rate calculator
    ├── case_study_writer.json          # Case study drafts
    ├── social_poster.json              # LinkedIn/X posts
    ├── newsletter_bot.json             # Email campaigns
    └── morning_briefer.json            # Daily digest
```

## 🔌 Integrations

| Service | Purpose |
|---------|---------|
| Gemini 2.0 Flash | Intent classification, content generation |
| Appwrite | Database, articles, agent_logs |
| HubSpot | CRM, email campaigns, blog |
| Google Sheets | Central Ledger |
| M-Pesa Daraja | STK Push payments |
| HumanLayer.dev | WhatsApp HITL approvals |

## 🛡️ Human-in-the-Loop (HITL)

All state-changing actions require approval:
- Publishing content
- Sending emails
- M-Pesa transactions
- External API calls

Approvals route via HumanLayer → WhatsApp.

## 📊 Learning & ESG

- **CIMP Engine**: Logs edit diffs to improve agent prompts
- **ESG Reporter**: Monthly compliance reports for fundraising

## 📅 Updated
2024-12-22 (v3.0)
