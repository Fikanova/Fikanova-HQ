console.log("Dynamic Menu Script Loaded");

// --- CONFIGURATION (Using Global Appwrite Object) ---
const client = new Appwrite.Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6936df5800371a655e8e');

const databases = new Appwrite.Databases(client);
const Query = Appwrite.Query;
const DB_ID = '693703ef001133c62d78';
const SERVICES_COL = 'Services';

// --- MENU STRUCTURE DEFINITION ---
const menuStructure = {
    solutions: {
        label: 'Solutions',
        categories: ['Development', 'Marketing', 'AI and Tech']
    },
    company: {
        label: 'Company',
        links: [
            { label: 'About Us', url: '/page.html?p=about-us' },
            { label: 'Our Story', url: '/page.html?p=our-story' },
            { label: 'Impact', url: '/page.html?p=impact' }
        ]
    },
    work: {
        label: 'Work',
        links: [
            { label: 'Portfolio', url: '/page.html?p=portfolio' },
            { label: 'Case Studies', url: '/page.html?p=case-studies' },
            { label: 'Resources', url: '/page.html?p=resources' },
            { label: 'Newsletter', url: '/page.html?p=newsletter' }
        ]
    }
};

// --- MAIN FUNCTION ---
async function initMenu() {
    // Render static menus immediately (Company, Work - both desktop and mobile)
    renderStaticMenus();

    try {
        const response = await databases.listDocuments(DB_ID, SERVICES_COL, [Query.limit(100)]);
        renderSolutionsMenu(response.documents);
        renderMobileSolutionsMenu(response.documents);
    } catch (error) {
        console.warn("Menu Fetch Error:", error);
        renderSolutionsFallback();
        renderMobileSolutionsFallback();
    }
}

// --- Render Static Menus (Company, Work) - Desktop ---
function renderStaticMenus() {
    const companyContainer = document.getElementById('nav-company-container');
    if (companyContainer) companyContainer.innerHTML = buildSimpleDropdown(menuStructure.company.label, menuStructure.company.links);

    const workContainer = document.getElementById('nav-work-container');
    if (workContainer) workContainer.innerHTML = buildSimpleDropdown(menuStructure.work.label, menuStructure.work.links);
}

// --- Render Dynamic Solutions Menu - Desktop ---
function renderSolutionsMenu(services) {
    const container = document.getElementById('nav-solutions-container');
    if (!container) return;

    let html = `<span class="nav-link">${menuStructure.solutions.label} <i class="fas fa-chevron-down" style="font-size:0.75rem;"></i></span><div class="mega-menu">`;

    menuStructure.solutions.categories.forEach(category => {
        const categoryServices = services.filter(s => s.category === category);
        html += `<div class="mega-menu-group"><h4>${category}</h4>`;
        if (categoryServices.length > 0) {
            categoryServices.forEach(service => {
                html += `<a href="/service.html?s=${service.slug}">${service.title}</a>`;
            });
        } else {
            html += `<span style="font-size:0.8rem; color:var(--text-tertiary);">Coming soon</span>`;
        }
        html += `</div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
}

// --- Render Dynamic Solutions Menu - Mobile ---
function renderMobileSolutionsMenu(services) {
    const container = document.getElementById('mobile-solutions-menu');
    if (!container) return;

    let html = '';
    menuStructure.solutions.categories.forEach(category => {
        const categoryServices = services.filter(s => s.category === category);
        html += `<div class="mobile-category"><strong style="font-size:0.75rem; color:var(--text-tertiary); text-transform:uppercase; display:block; margin:10px 0 5px;">${category}</strong>`;
        if (categoryServices.length > 0) {
            categoryServices.forEach(service => {
                html += `<a href="/service.html?s=${service.slug}" class="menu-item">${service.title}</a>`;
            });
        } else {
            html += `<span class="menu-item" style="color:var(--text-tertiary);">Coming soon</span>`;
        }
        html += `</div>`;
    });
    container.innerHTML = html;
}

// --- Fallback for Solutions if fetch fails - Desktop ---
function renderSolutionsFallback() {
    const container = document.getElementById('nav-solutions-container');
    if (!container) return;

    let html = `<span class="nav-link">${menuStructure.solutions.label} <i class="fas fa-chevron-down" style="font-size:0.75rem;"></i></span><div class="mega-menu">`;
    menuStructure.solutions.categories.forEach(cat => {
        html += `<div class="mega-menu-group"><h4>${cat}</h4><span style="font-size:0.8rem; color:var(--text-tertiary);">Loading...</span></div>`;
    });
    html += `</div>`;
    container.innerHTML = html;
}

// --- Fallback for Solutions if fetch fails - Mobile ---
function renderMobileSolutionsFallback() {
    const container = document.getElementById('mobile-solutions-menu');
    if (!container) return;

    let html = '';
    menuStructure.solutions.categories.forEach(cat => {
        html += `<span class="menu-item" style="color:var(--text-tertiary);">${cat}: Loading...</span>`;
    });
    container.innerHTML = html;
}

// --- HELPER: Build Simple Dropdowns (Desktop) ---
function buildSimpleDropdown(label, links) {
    let html = `<span class="nav-link">${label} <i class="fas fa-chevron-down" style="font-size:0.75rem;"></i></span>`;
    html += `<div class="mega-menu" style="min-width: 250px; grid-template-columns: 1fr;"><div class="mega-menu-group">`;
    links.forEach(link => {
        html += `<a href="${link.url}">${link.label}</a>`;
    });
    html += `</div></div>`;
    return html;
}

// Initialize menu on load
initMenu();
