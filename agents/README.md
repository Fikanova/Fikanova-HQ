# Fikanova Digital Workforce 🤖

This directory contains the n8n workflow exports for your Agency.

## 📁 Structure
* **Product Lead/**: Sales & Scoping
    * `sub_recon_bot.json`: Scrapes client sites (Crawl4AI).
    * `sub_quotation_bot.json`: Generates PDF Quotes.
* **Marketing Lead/**: Growth
    * `sub_case_study_bot.json`: Turns finished projects into Portfolio items.
* **CFO/**: Finance
    * `sub_kra_tax_bot.json`: Prepares eTIMS data.
* **CTO/**: Tech Health
    * `sub_impact_bot.json`: Updates website tickers (PageSpeed).
* **CIO/**: Ops
    * `sub_morning_brief.json`: WhatsApp daily summary.

## 🚀 How to Use
Import these files into your self-hosted n8n instance. Use the "Execute Workflow" node in n8n to connect a Main Agent to its Sub-Agents.
