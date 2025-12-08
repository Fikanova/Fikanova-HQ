// =============================================================================
// Fikanova Main.js - Service & Page Content Loader
// Uses Global Appwrite Object (loaded in <head>)
// =============================================================================

// 1. Initialize Appwrite (Using Global Object)
const client = new Appwrite.Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6936df5800371a655e8e');

const db = new Appwrite.Databases(client);
const Query = Appwrite.Query;
const DB_ID = '693703ef001133c62d78';

// 2. NAV BUILDER
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
                        <a href="page.html?p=about-us" class="block px-4 py-2 hover:bg-gray-50">About Us</a>
                        <a href="page.html?p=our-story" class="block px-4 py-2 hover:bg-gray-50">Our Story</a>
                        <a href="page.html?p=impact" class="block px-4 py-2 hover:bg-gray-50">Impact</a>
                    </div>
                </div>
                <!-- Work -->
                <div class="group relative py-4">
                    <button class="font-medium hover:text-blue-600">Work ▾</button>
                    <div class="absolute left-0 mt-4 w-48 bg-white shadow-xl rounded-lg py-2 hidden group-hover:block border">
                        <a href="page.html?p=portfolio" class="block px-4 py-2 hover:bg-gray-50">Portfolio</a>
                        <a href="page.html?p=case-studies" class="block px-4 py-2 hover:bg-gray-50">Case Studies</a>
                        <a href="page.html?p=resources" class="block px-4 py-2 hover:bg-gray-50">Resources</a>
                        <a href="page.html?p=newsletter" class="block px-4 py-2 hover:bg-gray-50">Newsletter</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>`;

    const ph = document.getElementById('nav-placeholder');
    if (ph) {
        ph.innerHTML = navHTML;
        fetchServicesMenu();
    }
}

// 3. FETCH MENU CONTENT
async function fetchServicesMenu() {
    try {
        const res = await db.listDocuments(DB_ID, 'Services', [Query.limit(100)]);
        const cats = ['Development', 'Marketing', 'AI and Tech'];
        let html = '';

        cats.forEach(c => {
            html += `<div><h4 class="font-bold text-blue-900 mb-2 text-xs uppercase">${c}</h4><ul class="space-y-1">`;

            const categoryServices = res.documents.filter(d => d.category === c);

            if (categoryServices.length > 0) {
                categoryServices.forEach(s => {
                    html += `<li><a href="service.html?s=${s.slug}" class="text-sm text-gray-600 hover:text-blue-600">${s.title}</a></li>`;
                });
            } else {
                html += `<li><span class="text-xs text-gray-400">No services yet</span></li>`;
            }
            html += `</ul></div>`;
        });

        const container = document.getElementById('nav-solutions');
        if (container) container.innerHTML = html;
    } catch (e) {
        console.error("Menu Error:", e);
        const container = document.getElementById('nav-solutions');
        if (container) container.innerHTML = `<div class="col-span-3 text-red-500 text-sm">Error loading menu. Check Console.</div>`;
    }
}

// 4. PAGE CONTENT LOADER
async function loadPageContent() {
    const params = new URLSearchParams(window.location.search);
    const serviceSlug = params.get('s');
    const pageSlug = params.get('p');
    const path = window.location.pathname;

    if (path.includes('service.html') && serviceSlug) {
        // Service page
        try {
            const res = await db.listDocuments(DB_ID, 'Services', [Query.equal('slug', serviceSlug)]);

            if (res.documents.length) {
                const data = res.documents[0];
                const titleEl = document.getElementById('page-title');
                const contentEl = document.getElementById('page-content');
                const subEl = document.getElementById('page-subtitle');

                if (titleEl) titleEl.innerText = data.title;
                if (subEl && data.short_description) subEl.innerText = data.short_description;
                if (contentEl) contentEl.innerHTML = data.full_body_markdown || data.short_description;

                // Tally Form Embed
                const formId = data.tally_form_id || 'w7e8K1';
                const tallyContainer = document.getElementById('tally-container');
                if (tallyContainer) {
                    tallyContainer.innerHTML = `<iframe src="https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&service=${serviceSlug}" width="100%" height="400" frameborder="0"></iframe>`;
                }
            } else {
                document.body.innerHTML = "<h1 class='text-center mt-10'>404: Service Not Found</h1>";
            }
        } catch (e) {
            console.error("Service Load Error:", e);
        }
    } else if (path.includes('page.html') && pageSlug) {
        // Generic page
        try {
            const res = await db.listDocuments(DB_ID, 'Pages', [Query.equal('slug', pageSlug)]);

            if (res.documents.length) {
                const data = res.documents[0];
                const titleEl = document.getElementById('page-title');
                const contentEl = document.getElementById('page-content');

                if (titleEl) titleEl.innerText = data.title;
                if (contentEl) contentEl.innerHTML = data.content_markdown;

                // Hide tally container on pages
                const tally = document.getElementById('tally-container');
                if (tally) tally.style.display = 'none';
            } else {
                document.body.innerHTML = "<h1 class='text-center mt-10'>404: Page Not Found</h1>";
            }
        } catch (e) {
            console.error("Page Load Error:", e);
        }
    }
}

// Execute
loadNav();
loadPageContent();
console.log("Main.js Loaded");
