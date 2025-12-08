Fikanova-HQ

This is the monorepo for Fikanova, an AI-first digital agency operating on the "Human-AI Supervisor" model.

🏗 Architecture

This repository contains the entire business logic, divided into three layers:

1. 🏪 The Storefront (Root)

Tech: HTML5, CSS3, Vanilla JS.

Hosting: GitHub Pages.

Files: index.html, script.js, style.css.

Dynamic Content: Powered by Appwrite Cloud (fetching Services, Portfolio, and Impact metrics).

2. 🗄️ The Warehouse (/appwrite)

Contains the database schemas and seed data for the "Headless CMS".

Collections: Services, Clients, CaseStudies, Impact_Metrics.

3. 🤖 The Workforce (/agents)

Contains JSON exports of the n8n workflows that run the business.

Product Lead: Automated Sales & Quoting.

Marketing Lead: Automated Socials & Case Studies.

CFO Agent: Expense Tracking & KRA Compliance.

4. 🧠 Backend Logic (/functions)

Serverless functions deployed to Appwrite Cloud for tasks like:

KRA eTIMS invoice formatting.

Google PageSpeed API fetching.

🛠 Setup & Installation

Frontend: Just open index.html or view live at fikanova.co.ke.

Appwrite: Import appwrite/schema.json to your Appwrite Console.

Agents: Import agents/*.json into your self-hosted n8n instance.

© 2025 Fikanova. Enterprise Tech on a Startup Budget.