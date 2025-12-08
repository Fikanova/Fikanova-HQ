import { Client, Databases, Query } from "https://cdn.jsdelivr.net/npm/appwrite@14.0.0";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_PROJECT_ID'); // REPLACE THIS

const db = new Databases(client);
const DB_ID = 'Fikanova_DB';

// 1. NAV BUILDER
function loadNav() {
    const navHTML = `
    <nav class="bg-white shadow sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
            <a href="index.html" class="font-bold text-2xl text-blue-600">Fikanova</a>
            <div class="hidden md:flex space-x-8">
                <!-- Solutions -->
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Solutions ▾</button>
                    <div class="absolute left-0 mt-4 w-[600px] bg-white shadow-xl rounded-lg p-6 hidden group-hover:grid grid-cols-3 gap-4 border" id="nav-solutions">Loading...</div>
                </div>
                <!-- Company -->
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Company ▾</button>
                    <div class="absolute left-0 mt-4 w-48 bg-white shadow-xl rounded-lg py-2 hidden group-hover:block border">
                        <a href="page.html?s=about-us" class="block px-4 py-2 hover:bg-gray-50">About Us</a>
                        <a href="page.html?s=our-story" class="block px-4 py-2 hover:bg-gray-50">Our Story</a>
                        <a href="impact.html" class="block px-4 py-2 hover:bg-gray-50">Impact</a>
                    </div>
                </div>
                <!-- Work -->
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Work ▾</button>
                    <div class="absolute left-0 mt-4 w-48 bg-white shadow-xl rounded-lg py-2 hidden group-hover:block border">
                        <a href="portfolio.html" class="block px-4 py-2 hover:bg-gray-50">Portfolio</a>
                        <a href="portfolio.html" class="block px-4 py-2 hover:bg-gray-50">Case Studies</a>
                        <a href="resources.html" class="block px-4 py-2 hover:bg-gray-50">Resources</a>
                        <a href="newsletter.html" class="block px-4 py-2 hover:bg-gray-50">Newsletter</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;
    const placeholder = document.getElementById('nav-placeholder');
    if(placeholder) {
        placeholder.innerHTML = navHTML;
        fetchServicesMenu();
    }
}

// 2. FETCH MENU CONTENT
async function fetchServicesMenu() {
    try {
        const res = await db.listDocuments(DB_ID, 'Services', [Query.limit(100)]);
        const cats = ['Development', 'Marketing', 'AI and Tech'];
        let html = '';
        cats.forEach(c => {
            html += `<div><h4 class="font-bold text-blue-900 mb-2 text-xs uppercase">${c}</h4><ul class="space-y-1">`;
            res.documents.filter(d => d.category === c).forEach(s => {
                html += `<li><a href="service.html?s=${s.slug}" class="text-sm text-gray-600 hover:text-blue-600">${s.title}</a></li>`;
            });
            html += `</ul></div>`;
        });
        const container = document.getElementById('nav-solutions');
        if(container) container.innerHTML = html;
    } catch(e) {}
}

// 3. PAGE CONTENT LOADER
async function loadPageContent() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('s');
    const path = window.location.pathname;
    
    // Service & Page Loading
    if ((path.includes('service.html') || path.includes('page.html')) && slug) {
        const col = path.includes('service.html') ? 'Services' : 'Pages';
        const res = await db.listDocuments(DB_ID, col, [Query.equal('slug', slug)]);
        if (res.documents.length) {
            const data = res.documents[0];
            document.getElementById('page-title').innerText = data.title;
            const sub = document.getElementById('page-subtitle');
            if(sub) sub.innerText = data.short_description || "";
            document.getElementById('page-content').innerHTML = data.full_body_markdown || data.content_markdown;
            
            const formContainer = document.getElementById('tally-container');
            if(formContainer && col === 'Services') {
                const formId = data.tally_form_id || 'w7e8K1';
                formContainer.innerHTML = `<iframe src="https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&service=${slug}" width="100%" height="400" frameborder="0"></iframe>`;
            } else if (formContainer) {
                formContainer.parentElement.style.display = 'none'; // Hide on static pages
            }
        }
    }
}

loadNav();
loadPageContent();
