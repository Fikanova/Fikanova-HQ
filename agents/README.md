# Fikanova v10.0 Digital Workforce 🤖

AI-powered agency with hierarchical agent architecture.

## 📁 Structure

### L1: C-Suite (Strategic Orchestrators)
| Agent | Role | Delegates To |
|-------|------|--------------|
| CEO | Command routing via WhatsApp + Gemini | CFO/CTO |
| CFO | Finance operations | Head of Accounts |
| CTO | Tech operations | Head of Product |
| CMO | Growth operations | Head of Content |
| CIO | Daily operations (7AM trigger) | Head of Ops |
| CimpO | Governance/Audit | Head of ESG |

### L2: Functional Leads (Managers)
| Manager | Specialists |
|---------|-------------|
| Head of Product | Recon Bot, Quote Gen |
| Head of Accounts | KRA Bot, Expense Tracker, Runway Calc, ClampO |
| Head of Content | Case Study Writer, Social Poster, Newsletter Bot |
| Head of Ops | Morning Briefer, Meeting Prep |
| Head of ESG | Partner Sync, ESG Reporter |

### L3: Specialists (Doers)
12 specialist agents handling specific tasks via n8n workflows.

## 🚀 Deployment
1. Import JSONs into n8n: **L3 → L2 → L1** order
2. Configure credentials for each service
3. Update workflow IDs in parent agents

## 📅 Updated
2024-12-13 (v10.0)
