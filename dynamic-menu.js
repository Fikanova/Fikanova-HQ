console.log("Dynamic Menu Script Loaded");
import { Client, Databases, Query } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0";

// --- CONFIGURATION ---
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_PROJECT_ID'); // Replace with your actual Project ID

const databases = new Databases(client);
const DB_ID = 'Fikanova_DB';
const SERVICES_COL = 'Services';

// --- MENU STRUCTURE DEFINITION ---
const menuStructure = {
    solutions: {
        id: 'menu-solutions',
        label: 'Solutions',
        categories: ['Development', 'Marketing', 'AI & Tech'] // Updated to match existing site categories
    },
    company: {
        id: 'menu-company',
        label: 'Company',
        links: [
            { label: 'About Us', url: '#about' }, // Updated URLs to match existing anchors
            { label: 'Our Story', url: '#story' },
            { label: 'Impact', url: '#impact' }
        ]
    },
    work: {
        id: 'menu-work',
        label: 'Work',
        links: [
            { label: 'Portfolio', url: '#portfolio' },
            { label: 'Case Studies', url: '#case' },
            { label: 'Resources', url: '#resources' }
        ]
    }
};

// --- MAIN FUNCTION ---
async function initMenu() {
    // Render static parts immediately
    renderStaticMenus();

    try {
        // 1. Fetch Dynamic Services from Appwrite
        // Note: This will fail without a valid Project ID, but we want the static menus to work anyway.
        const response = await databases.listDocuments(DB_ID, SERVICES_COL, [
            Query.limit(100) // Fetch all services
        ]);
        const services = response.documents;

        // 2. Build L1: Solutions (Complex Dropdown)
        renderSolutionsMenu(services);

    } catch (error) {
        console.warn("Menu Fetch Error (Solutions menu may be incomplete):", error);
        // Fallback or empty state for Solutions if fetch fails
        renderSolutionsFallback();
    }
}

function renderStaticMenus() {
    try {
        // 3. Build L1: Company (Simple Dropdown)
        const companyHTML = buildSimpleDropdown(menuStructure.company.label, menuStructure.company.links);
        const companyContainer = document.getElementById('nav-company-container');
        if (companyContainer) companyContainer.innerHTML = companyHTML;

        // 4. Build L1: Work (Simple Dropdown)
        const workHTML = buildSimpleDropdown(menuStructure.work.label, menuStructure.work.links);
        const workContainer = document.getElementById('nav-work-container');
        if (workContainer) workContainer.innerHTML = workHTML;
    } catch (e) {
        console.error("Error rendering static menus:", e);
    }
}

function renderSolutionsMenu(services) {
    const container = document.getElementById('nav-solutions-container');
    if (!container) return;

    let html = `
        <span class="nav-link">${menuStructure.solutions.label} <i class="fas fa-chevron-down" style="font-size:0.75rem;"></i></span>
        <div class="mega-menu">
    `;

    // Existing design uses 3 columns: Development, Marketing, AI & Tech
    // We will map over our defined categories
    menuStructure.solutions.categories.forEach(category => {
        // Filter services for this category
        // The service object from Appwrite needs a 'category' field matching these strings
        const categoryServices = services.filter(s => s.category === category);

        html += `<div class="mega-menu-group">`;
        html += `<h4>${category}</h4>`;

        if (categoryServices.length > 0) {
            categoryServices.forEach(service => {
                html += `<a href="/service.html?s=${service.slug}">${service.title}</a>`;
            });
        } else {
            // Fallback if no services found (or for demo purposes if DB is empty)
            html += `<span style="font-size:0.8rem; color:var(--text-tertiary);">No services loaded</span>`;
        }

        html += `</div>`;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function renderSolutionsFallback() {
    const container = document.getElementById('nav-solutions-container');
    if (!container) return;

    // Render just the link without the dropdown if data fails, or keep it empty?
    // Better: Render the structure but maybe with hardcoded items (or just empty) so layout doesn't break.
    // For now, let's render the header so it looks like a menu item, but with an error/empty message or just the static structure from before?
    // Prioritizing user request to use "dynamic" code. If fetch fails, we just don't show the dropdown content or show a basic one.

    // Replicating original static structure as fallback would be ideal but complex to hardcode here. 
    // Let's just render the label so nature of the menu is preserved.
    container.innerHTML = `
        <span class="nav-link">${menuStructure.solutions.label} <i class="fas fa-chevron-down" style="font-size:0.75rem;"></i></span>
        <div class="mega-menu">
            <div class="mega-menu-group"><h4>Data unavailable</h4></div>
        </div>
    `;
}

// --- HELPER: Build Simple Dropdowns (Company/Work) ---
function buildSimpleDropdown(label, links) {
    let html = `
        <span class="nav-link">${label} <i class="fas fa-chevron-down" style="font-size:0.75rem;"></i></span>
        <div class="mega-menu" style="min-width: 250px; grid-template-columns: 1fr;">
            <div class="mega-menu-group">
    `;

    links.forEach(link => {
        html += `<a href="${link.url}">${link.label}</a>`;
    });

    html += `
            </div>
        </div>
    `;
    return html;
}

// Run immediately
initMenu();
