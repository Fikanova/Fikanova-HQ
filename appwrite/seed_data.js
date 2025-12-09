require('dotenv').config({
    path: '../.env'
});
const { Client, Databases, ID, Permission, Role
} = require('node-appwrite');

const client = new Client()
    .setEndpoint(process.env.VITE_APPWRITE_ENDPOINT)
    .setProject(process.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(process.env.VITE_APPWRITE_API_KEY);

const databases = new Databases(client);
const DATABASE_ID = '693703ef001133c62d78';

// 1. SERVICES (Aligned with Full Menu L1-L3)
const services = [
    // L2: Development
    {
        title: "Web Development",
        slug: "web-development",
        category: "Development",
        short_description: "Stunning, responsive websites that captivate your audience and drive results.",
        price_estimate: "Starts at KES 35,000",
        full_body_markdown: "## Modern Design Principles\nWe build high-performance websites using Next.js and Appwrite, ensuring speed and SEO ranking."
    },
    {
        title: "Mobile App Development",
        slug: "mobile-app-development",
        category: "Development",
        short_description: "Native Android & iOS apps connecting you directly to customers.",
        price_estimate: "Starts at KES 80,000",
        full_body_markdown: "## Your Business in Their Pocket\nRobust mobile applications for booking, loyalty, or internal tools using React Native."
    },
    {
        title: "Custom Software",
        slug: "custom-software",
        category: "Development",
        short_description: "Tailored internal tools, dashboards, and SaaS platforms.",
        price_estimate: "Custom Quote",
        full_body_markdown: "## Tailored Solutions\nFrom FinTech aggregators to inventory systems, we code what off-the-shelf software can't do."
    },
    // L2: Marketing
    {
        title: "SEO Optimization",
        slug: "seo-optimization",
        category: "Marketing",
        short_description: "Boost your online visibility and reach the right customers at the right time.",
        price_estimate: "Retainer: KES 15,000/mo",
        full_body_markdown: "## Data-Driven Strategies\nTechnical audits, keyword strategy, and content optimization to rank #1."
    },
    {
        title: "Social Media Marketing",
        slug: "social-media-marketing",
        category: "Marketing",
        short_description: "Automated content calendars and engagement strategies.",
        price_estimate: "Retainer: KES 20,000/mo",
        full_body_markdown: "## Growth on Autopilot\nWe use AI Agents to schedule, format, and publish content across LinkedIn and X."
    },
    {
        title: "Content Strategy",
        slug: "content-strategy",
        category: "Marketing",
        short_description: "Brand storytelling that converts visitors into loyal clients.",
        price_estimate: "Starts at KES 10,000",
        full_body_markdown: "## Tell Your Story\nBlogs, newsletters, and case studies written to establish authority in your niche."
    },
    // L2: AI and Tech
    {
        title: "Chatbot Integration",
        slug: "chatbot-integration",
        category: "AI and Tech",
        short_description: "Intelligent customer engagement that works 24/7 on WhatsApp & Web.",
        price_estimate: "Starts at KES 25,000",
        full_body_markdown: "## Never Miss a Lead\nAI-powered support that handles inquiries instantly and syncs with your CRM."
    },
    {
        title: "AI Automation",
        slug: "ai-automation",
        category: "AI and Tech",
        short_description: "Replace manual data entry with intelligent workflow agents.",
        price_estimate: "Custom Quote",
        full_body_markdown: "## Work Smarter\nAutomate invoicing, lead capture, and reporting using n8n and Python scripts."
    },
    {
        title: "Tech Consultation",
        slug: "tech-consultation",
        category: "AI and Tech",
        short_description: "Expert solutions tailored to your business challenges and growth objectives.",
        price_estimate: "Hourly Rate",
        full_body_markdown: "## Strategic Guidance\nDigital transformation roadmaps for SMEs looking to scale efficiently."
    }
];

// 2. PORTFOLIO (Updated with Ongoing Projects)
const clients = [
    // Completed
    {
        name: "Opal Suites",
        status: "Completed",
        website_url: "https://opalsuites.co.ke/",
        logo_url: "https://via.placeholder.com/100?text=OS",
        service_provided: "Web Development"
    },
    {
        name: "ETCO Kenya",
        status: "Completed",
        website_url: "https://etco-kenya.org",
        logo_url: "https://via.placeholder.com/100?text=ETCO",
        service_provided: "Web Design"
    },
    {
        name: "Jenga365",
        status: "Completed",
        website_url: "https://jenga365.com",
        logo_url: "https://via.placeholder.com/100?text=J365",
        service_provided: "Platform"
    },
    // Ongoing
    {
        name: "Nondescripts RFC",
        status: "Ongoing",
        website_url: "https://nondies.co.ke",
        logo_url: "https://via.placeholder.com/100?text=Nondies",
        service_provided: "E-commerce"
    },
    {
        name: "Midesa",
        status: "Ongoing",
        website_url: "https://www.fikanova.co.ke/",
        logo_url: "https://via.placeholder.com/100?text=Midesa",
        service_provided: "FinTech"
    },
    {
        name: "Analytics Dashboard",
        status: "Ongoing",
        website_url: "https://www.fikanova.co.ke/",
        logo_url: "https://via.placeholder.com/100?text=Data",
        service_provided: "Dashboard"
    }
];

// 3. TESTIMONIALS
const testimonials = [
    {
        client_name: "Opal Suites Team",
        quote: "Fikanova delivered exactly what we needed for our real estate platform. Professional, responsive, and delivered on time.",
        role: "Real Estate Platform",
        rating: 5,
        date: "2025-10-15"
    },
    {
        client_name: "Tech Startup Client",
        quote: "The chatbot integration has transformed our customer service. Available 24/7 and handles inquiries flawlessly.",
        role: "AI Implementation",
        rating: 5,
        date: "2025-11-02"
    },
    {
        client_name: "Jenga365",
        quote: "Working with Fikanova felt like having a dedicated tech partner. Exceptional attention to detail and innovative solutions.",
        role: "Mentorship Platform",
        rating: 5,
        date: "2025-11-28"
    }
];

// 4. IMPACT METRICS
const metrics = [
    {
        client_reference: "Global", metric_label: "Projects Completed", metric_value: "10+"
    },
    {
        client_reference: "Global", metric_label: "Happy Clients", metric_value: "8+"
    },
    {
        client_reference: "Global", metric_label: "Year Founded", metric_value: "2025"
    }
];

async function seed() {
    console.log("🌱 Seeding Custom Content...");

    // Helper to seed a collection
    const seedCollection = async (collectionName, data) => {
        try {
            console.log(`Processing ${collectionName
                }...`);
            // In a real scenario, you might check for duplicates first
            for (const item of data) {
                await databases.createDocument(DATABASE_ID, collectionName, ID.unique(), item);
            }
            console.log(`✅ ${collectionName
                } seeded.`);
        } catch (e) {
            console.error(`❌ Error seeding ${collectionName
                }:`, e.message);
        }
    };

    await seedCollection('Services', services);
    await seedCollection('Clients', clients);
    await seedCollection('Testimonials', testimonials);
    await seedCollection('Impact_Metrics', metrics);

    console.log("🎉 All Content Uploaded.");
}
seed();