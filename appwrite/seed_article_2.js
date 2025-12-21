require('dotenv').config({ path: '../.env' });
const { Client, Databases, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.VITE_APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '693703ef001133c62d78';

const secondArticle = {
    title: "Standardizing Agency: Decoding the Open-Source Shift by Anthropic and GitHub",
    slug: "standardizing-agency-anthropic-github-open-source",
    excerpt: "The AI industry is undergoing its most significant structural shift since the introduction of the Transformer. The recent decision by Anthropic and GitHub to open-source Agent Skills—built on the Model Context Protocol (MCP)—is the catalyst that will define the enterprise AI landscape in 2026.",
    author: "Nyaenya Moseti",
    tags: "AI, Open Source, Anthropic, GitHub, MCP, Agents",
    published_at: new Date("2025-12-21T12:00:00.000Z").toISOString(),
    content: `The AI industry is undergoing its most significant structural shift since the introduction of the Transformer. As we close out 2025, the focus has moved from "Model Capabilities" (what an AI *knows*) to "Agentic Competence" (what an AI can *do*).

The recent decision by Anthropic and GitHub to open-source Agent Skills—built on the **Model Context Protocol (MCP)**—is the catalyst that will define the enterprise AI landscape in 2026.

## The Problem: The "Black Box" of Agency

Until recently, autonomous agents were difficult to deploy in professional environments because their "tools" were non-standardized. If a developer wanted an AI to perform a specific task—such as auditing a codebase or managing a cloud deployment—they had to write bespoke "functions" that were often restricted to a single model provider.

This created two major hurdles:

- **Vendor Lock-in**: Skills built for one model wouldn't work on another.
- **Security Opaque-ness**: It was difficult for security teams to see exactly how an agent was interacting with sensitive data.

## The Solution: Modular Agent Skills

By open-sourcing Agent Skills, Anthropic and GitHub have introduced a "Universal Language" for AI actions.

A "Skill" is now defined as a modular, auditable package containing:

1. **Structured Definitions**: Clear instructions that tell the model when and how to use a specific tool.
2. **Operational Bounds**: Parameters that limit what the agent can do, ensuring it doesn't execute unauthorized commands.
3. **Portability**: Because they follow the Model Context Protocol (MCP), these skills can be used across different models (Claude, Gemini 3, or open-source Llama models) without rewriting code.

## GitHub's Integration: The "Marketplace of Logic"

GitHub's role in this release is pivotal. By integrating these skills into GitHub Copilot and the GitHub CLI, they have turned every repository into a potential "training ground" for agents.

Developers can now share \`.skills\` directories just as they share \`.json\` configuration files. This creates a **global library of verified, open-source logic**.

For the African tech ecosystem, this is a massive "Leapfrog" opportunity—allowing local developers to implement world-class automation workflows without needing to build the underlying infrastructure from scratch.

## The Strategic Impact: Trust and Governance

From a Product Marketing and Security perspective, the open-sourcing of skills is a move toward **Transparency**.

For organizations like Macaw Security that are building "Trust Layers," these standardized skills provide a clear surface area for auditing. When skills are open-source and modular, security protocols can be "wrapped" around them.

We can now verify that an agent's "Database Query Skill" cannot be used for "Data Deletion" because the skill's code itself is visible and restricted.

## Conclusion: Looking Toward 2026

The release of Gemini 3 earlier this month gave us more "raw intelligence," but the Anthropic/GitHub open-source movement has given us the **architecture** to use that intelligence safely and at scale.

In 2026, the most successful companies won't be those with the largest models, but those who effectively manage and secure their library of **Agentic Skills**.`
};

async function seedSecondArticle() {
    console.log("📝 Adding second article to The Termite Stack...");

    try {
        const doc = await databases.createDocument(
            DATABASE_ID,
            'Articles',
            ID.unique(),
            secondArticle
        );
        console.log("✅ Article created successfully!");
        console.log(`   Title: ${doc.title}`);
        console.log(`   Slug: ${doc.slug}`);
        console.log(`   ID: ${doc.$id}`);
    } catch (error) {
        console.error("❌ Error creating article:", error.message);
    }
}

seedSecondArticle();
