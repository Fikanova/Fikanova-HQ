/**
 * Fikanova Homepage App
 * Combines: Theme Toggle, Mobile Menu, Portfolio Tabs, Scroll Reveal, Dynamic Navigation
 */

import { Client, Databases, Query } from "https://cdn.jsdelivr.net/npm/appwrite@16.0.0/+esm";

// =============================================================================
// APPWRITE CONFIGURATION
// =============================================================================
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6936df5800371a655e8e');

const databases = new Databases(client);
const DB_ID = '693703ef001133c62d78';
const SERVICES_COL = 'Services';

// =============================================================================
// MENU STRUCTURE
// =============================================================================
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

// =============================================================================
// THEME TOGGLE
// =============================================================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function updateThemeIcon() {
    if (!themeToggle) return;
    const isLight = body.classList.contains('theme-light');
    themeToggle.innerHTML = `<i class="fas ${isLight ? 'fa-sun' : 'fa-moon'}"></i>`;
}

function toggleTheme() {
    body.classList.toggle('theme-light');
    localStorage.setItem('theme', body.classList.contains('theme-light') ? 'light' : 'dark');
    updateThemeIcon();
    if (navigator.vibrate) navigator.vibrate(10);
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('theme-light');
}
updateThemeIcon();
if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

// =============================================================================
// MOBILE MENU
// =============================================================================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const submenuToggles = document.querySelectorAll('.submenu-toggle');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        if (navigator.vibrate) navigator.vibrate([10, 5, 10]);
    });
}

submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const submenu = toggle.nextElementSibling;
        if (submenu && submenu.classList.contains('submenu')) {
            submenu.classList.toggle('active');
            toggle.classList.toggle('active');
            if (navigator.vibrate) navigator.vibrate(5);
        }
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.mobile-menu') && !e.target.closest('.hamburger')) {
        if (!e.target.closest('.submenu-toggle') && mobileMenu && hamburger) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// =============================================================================
// PORTFOLIO TABS
// =============================================================================
window.switchTab = function (tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.portfolio-tab-content').forEach(c => c.classList.remove('active'));
    const tabEl = document.getElementById(tab + '-tab');
    if (tabEl) tabEl.classList.add('active');
    if (navigator.vibrate) navigator.vibrate(10);
};

// =============================================================================
// SCROLL REVEAL
// =============================================================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

// =============================================================================
// SMOOTH SCROLL
// =============================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (mobileMenu && hamburger) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// =============================================================================
// HAPTIC FEEDBACK
// =============================================================================
document.querySelectorAll('.btn, .service-card, .portfolio-card, .tab-btn').forEach(el => {
    el.addEventListener('click', () => {
        if (navigator.vibrate) navigator.vibrate(10);
    });
});

// =============================================================================
// DYNAMIC NAVIGATION MENU
// =============================================================================
async function initMenu() {
    renderStaticMenus();
    try {
        const response = await databases.listDocuments(DB_ID, SERVICES_COL, [Query.limit(100)]);
        renderSolutionsMenu(response.documents);
    } catch (error) {
        console.warn("Menu Fetch Error:", error);
        renderSolutionsFallback();
    }
}

function renderStaticMenus() {
    const companyContainer = document.getElementById('nav-company-container');
    if (companyContainer) companyContainer.innerHTML = buildSimpleDropdown(menuStructure.company.label, menuStructure.company.links);

    const workContainer = document.getElementById('nav-work-container');
    if (workContainer) workContainer.innerHTML = buildSimpleDropdown(menuStructure.work.label, menuStructure.work.links);
}

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
console.log("Fikanova App Loaded");
