require('dotenv').config({ path: '../.env' });
const { Client, Databases, ID } = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.VITE_APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '693703ef001133c62d78';

const sampleArticle = {
    title: "Google's \"Deep Think\" Era: How Gemini 3 is Redefining the Agentic Frontier",
    slug: "gemini-3-deep-think-agentic-frontier",
    excerpt: "Just weeks after the tech world was shaken by the launch of GPT-5, Google has responded with a powerhouse ecosystem: Gemini 3. With Deep Think reasoning and Google Antigravity, this marks a fundamental shift toward autonomous agency.",
    author: "The Termite Stack",
    tags: "AI, Gemini, Google, Agentic AI, Deep Think",
    published_at: new Date("2025-12-21T00:00:00.000Z").toISOString(),
    content: `Just weeks after the tech world was shaken by the launch of GPT-5, Google has responded with a powerhouse ecosystem: Gemini 3. While previous versions focused on speed and multimodal "vision," Gemini 3 marks a fundamental shift toward **autonomous agency** and **structured reasoning**.

With the release of Gemini 3 Flash this past Wednesday (December 17), Google has officially replaced the 2.5 series as the default engine across Search and the Gemini app. Here is why this release is being called the "Deep Think" era.

## 1. Reasoning Without the Fluff: The "Deep Think" Mode

The standout feature of Gemini 3 Pro is its **Deep Think** capability. Unlike traditional LLMs that "guess" the next word in real-time, Deep Think allows the model to pause, verify its logic, and iterate internally before outputting a result.

On the "Humanity's Last Exam" benchmark—a notoriously difficult test suite designed to thwart AI memorization—Gemini 3 Pro achieved a staggering **93.8%**, outperforming current frontier models in complex scientific reasoning.

## 2. From Chatbots to Agents: Google Antigravity

Perhaps the most significant move for developers is the launch of **Google Antigravity**, an agentic development platform built on Gemini 3.

- **Vibe Coding**: Google is leaning into "vibe coding," allowing users to dictate stream-of-consciousness ideas and watch as Gemini 3 builds, debugs, and deploys full-stack app prototypes in real-time.

- **Memory Hierarchy**: A new architecture allows agents to manage their own context windows, meaning they can run long-term projects without "forgetting" instructions from three weeks ago.

## 3. Generative UI: The Death of the Static Link

For everyday users, the most visible change is **Generative UI**. When searching for complex tasks—like "Plan a 5-day photography tour of Tokyo"—Gemini 3 no longer just returns text. It generates an interactive dashboard with real-time maps, booking widgets, and drag-and-drop itinerary modules. This makes the AI feel less like a search engine and more like a personal concierge.

## 4. Flash Intelligence: Faster, Cheaper, Smarter

The mid-December launch of **Gemini 3 Flash** is the "price-to-performance" king. Google claims it outperforms the old flagship (Gemini 2.5 Pro) while being 3x faster and significantly cheaper for developers. By introducing "Thinking Levels" (Minimal, Low, Medium, High), Google is giving users granular control over their API costs—letting the AI "think" harder only when the task demands it.

## The Verdict

Gemini 3 isn't just an incremental update; it's a strategic pivot toward **Agentic Workflows**. By combining "Deep Think" reasoning with the sheer speed of the Flash series, Google is betting that the future of AI isn't just talking—it's *doing*.`
};

async function seedArticle() {
    console.log("📝 Adding sample article to Pulse...");

    try {
        const doc = await databases.createDocument(
            DATABASE_ID,
            'Articles',
            ID.unique(),
            sampleArticle
        );
        console.log("✅ Article created successfully!");
        console.log(`   Title: ${doc.title}`);
        console.log(`   Slug: ${doc.slug}`);
        console.log(`   ID: ${doc.$id}`);
    } catch (error) {
        console.error("❌ Error creating article:", error.message);
    }
}

seedArticle();
