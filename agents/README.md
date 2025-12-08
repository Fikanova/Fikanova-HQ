# Fikanova Digital Workforce 🤖

This directory contains the n8n workflow exports for your AI-powered Agency.

## 👑 Human Supervisor (You)
The ultimate decision maker overseeing all agent operations.

---

## 📁 Agent Structure

### 🚀 Product Lead Agent
Manages sales pipeline, client intake, and project scoping.
* `product_lead/main_orchestrator.json` - Main agent workflow
* `product_lead/sub_recon_bot.json` - Scrapes client sites (Crawl4AI/CrewAI)
* `product_lead/sub_intake_bot.json` - Classifies Tally leads
* `product_lead/sub_quotation_bot.json` - Generates PDF Quotes

---

### 📢 Marketing Lead Agent
Manages marketing operations, content creation, and growth.
* `marketing_lead/main_orchestrator.json` - Main agent workflow
* `marketing_lead/sub_case_study_bot.json` - Auto-writes stories from finished deals
* `marketing_lead/sub_social_poster.json` - Posts "Impact" wins to LinkedIn
* `marketing_lead/sub_newsletter_bot.json` - Emails the subscriber list

---

### 💰 CFO Agent
Manages financial operations, expense tracking, and tax compliance.
* `cfo/main_orchestrator.json` - Main agent workflow
* `cfo/sub_expense_bot.json` - WhatsApp to Sheets expense tracking
* `cfo/sub_runway_bot.json` - Calculates runway and alerts on low cash
* `cfo/sub_kra_tax_bot.json` - Calculates VAT/TOT for eTIMS

---

### 💻 CTO Agent
Manages technical health monitoring and development operations.
* `cto/main_orchestrator.json` - Main agent workflow
* `cto/sub_impact_bot.json` - Checks PageSpeed/SEO metrics
* `cto/sub_uptime_bot.json` - Pings client sites for uptime
* `cto/sub_repo_watcher.json` - Logs git commits

---

### 🧠 CIO Agent
Manages operational intelligence and daily briefings.
* `cio/main_orchestrator.json` - Main agent workflow
* `cio/sub_morning_brief.json` - 7 AM WhatsApp Summary
* `cio/sub_meeting_prep.json` - Context before calls

---

## 📊 Summary

| Agent | Sub-Agents | Status |
|-------|-----------|--------|
| 🚀 Product Lead | 3 | Placeholder |
| 📢 Marketing Lead | 3 | Placeholder |
| 💰 CFO | 3 | Placeholder |
| 💻 CTO | 3 | Placeholder |
| 🧠 CIO | 2 | Placeholder |
| **Total** | **14** | - |

---

## 🚀 How to Use

1. **Import** these JSON files into your self-hosted n8n instance
2. **Configure** credentials for each service (HubSpot, WhatsApp, Google Sheets, etc.)
3. **Connect** sub-agents to main agents using n8n's "Execute Workflow" node
4. **Test** each workflow individually before enabling triggers
5. **Monitor** via n8n's execution logs

## 🔧 File Format

Each agent JSON file contains:
- `name` - Human-readable agent name
- `emoji` - Visual identifier
- `description` - What the agent does
- `status` - Development status (placeholder/active/testing)
- `tools` - Required integrations
- `triggers` - What activates the agent
- `inputs` - Expected input data (sub-agents only)
- `outputs` - What the agent produces (sub-agents only)
- `nodes` - n8n workflow nodes (populated when implemented)

## 📅 Updated
2024-12-09
