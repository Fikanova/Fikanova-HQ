# WhatsApp Command Routing Logic

This document maps how WhatsApp text commands are routed to specific C-Suite agents.

## Architecture Overview

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  WhatsApp   │────▶│  Sozuri Webhook  │────▶│  whatsapp-bridge    │
│  (Sozuri)   │     │                  │     │  Appwrite Function  │
└─────────────┘     └──────────────────┘     └──────────┬──────────┘
                                                        │
                                                        ▼
                                             ┌──────────────────────┐
                                             │  Keyword Classifier  │
                                             └──────────┬───────────┘
                                                        │
                    ┌───────────────────────────────────┼───────────────────────────────────┐
                    ▼                   ▼               ▼               ▼                   ▼
              ┌─────────┐         ┌─────────┐     ┌─────────┐     ┌─────────┐         ┌─────────┐
              │   CEO   │         │   CFO   │     │   CTO   │     │   CMO   │         │  CimpO  │
              │  Agent  │         │  Agent  │     │  Agent  │     │  Agent  │         │  Agent  │
              └─────────┘         └─────────┘     └─────────┘     └─────────┘         └─────────┘
```

## Routing Keywords

| Agent | Keywords | Example Commands |
|-------|----------|------------------|
| **CEO** | status, report, overview, brief, summary | "Give me a status report" |
| **CFO** | finance, runway, expense, revenue, cost, budget, money, kra, tax | "How much runway do we have?" |
| **CTO** | tech, code, deploy, system, api, bug, feature, build | "Deploy the latest build" |
| **CMO** | marketing, content, social, post, newsletter, brand, edgy, draft | "Make it more edgy for X" |
| **CIO** | data, knowledge, security, audit, access | "Run security audit" |
| **CimpO** | esg, compliance, learning, improvement, metrics | "Show ESG metrics this month" |

## Special Commands

| Command | Action |
|---------|--------|
| "Approved" / "Approve" | Marks current pending draft as approved |
| "Rejected" / "Reject" | Returns draft to editor with feedback |
| "@agent" (e.g., @CMO) | Force route to specific agent |

## Response Flow

1. Agent processes command
2. Response stored in `Communications` collection (direction: outbound)
3. n8n workflow sends response via Sozuri
4. Response delivered to user's WhatsApp

## Environment Variables

```bash
SOZURI_WEBHOOK_SECRET=xxx    # Webhook signature verification
SOZURI_API_KEY=xxx           # Outbound message sending
N8N_CEO_WEBHOOK_URL=xxx      # n8n CEO workflow trigger
```

## Data Flow

All communications stored in Appwrite `Communications` collection:
- `direction`: 'inbound' | 'outbound'
- `channel`: 'whatsapp' | 'dashboard'
- `to_agent`: CEO, CFO, CTO, CMO, CIO, CimpO
- `status`: 'pending' | 'processed' | 'failed'

## HumanLayer.dev - Mobile Terminal

For state-changing actions, the system routes through HumanLayer for WhatsApp approval:

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────┐
│  Agent wants │────▶│  HumanLayer.dev │────▶│  WhatsApp    │
│  to publish  │     │  Approval API   │     │  Notification│
└──────────────┘     └─────────────────┘     └──────┬───────┘
                                                    │
                                                    ▼
                                             ┌──────────────┐
                                             │  Supervisor  │
                                             │  APPROVE/    │
                                             │  REJECT      │
                                             └──────┬───────┘
                                                    │
                                                    ▼
                                             ┌──────────────┐
                                             │  Callback    │
                                             │  Webhook     │
                                             └──────────────┘
```

### HITL-Required Actions

| Action Type | Example | Requires Approval |
|-------------|---------|-------------------|
| Publish content | Blog post, tweet | ✅ Yes |
| Send email | Newsletter blast | ✅ Yes |
| Make payment | M-Pesa STK Push | ✅ Yes |
| Update database | Delete records | ✅ Yes |
| Read data | Query articles | ❌ No |
| Generate draft | Create PRD | ❌ No |

### Approval Message Format

```
🔔 Approval Required

Action: publish_blog
Title: "How We Built Our AI Workforce"
Platform: HubSpot + Appwrite

Reply APPROVE or REJECT
```

### Environment Variables (HumanLayer)

```bash
HUMANLAYER_API_KEY=xxx       # HumanLayer API key
FOUNDER_PHONE=+254xxxxxxxx   # Supervisor WhatsApp number
```

