(function () {
    'use strict';
    // =============================================================================
    // Fikanova Main.js - Enhanced Service & Page Content Loader
    // Uses Global Appwrite Object (loaded in <head>)
    // =============================================================================

    console.log("Main.js Loading...");

    // 1. Initialize Appwrite (Using Global Object) - Use different names to avoid conflicts
    const mainClient = new Appwrite.Client()
        .setEndpoint('https://fra.cloud.appwrite.io/v1')
        .setProject('6936df5800371a655e8e');

    const mainDb = new Appwrite.Databases(mainClient);
    const MainQuery = Appwrite.Query;
    const MAIN_DB_ID = '693703ef001133c62d78';

    // Collection Names
    const COLLECTIONS = {
        SERVICES: 'Services',
        PAGES: 'Pages',
        CLIENTS: 'Clients',
        IMPACT_METRICS: 'ImpactMetrics',
        TESTIMONIALS: 'Testimonials',
        CASE_STUDIES: 'CaseStudies'
    };

    console.log("Appwrite initialized for main.js");

    // =============================================================================
    // UTILITY: Simple Markdown to HTML Parser
    // =============================================================================
    function parseMarkdown(markdown) {
        if (!markdown) return '';

        return markdown
            // Headers
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
            // Line breaks to paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
    }

    // =============================================================================
    // UTILITY: Show Loading State
    // =============================================================================
    function showLoading(elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            el.innerHTML = `
            <div class="loading-skeleton" style="height: 24px; width: 60%; margin-bottom: 16px;"></div>
            <div class="loading-skeleton" style="height: 16px; width: 100%; margin-bottom: 8px;"></div>
            <div class="loading-skeleton" style="height: 16px; width: 90%; margin-bottom: 8px;"></div>
            <div class="loading-skeleton" style="height: 16px; width: 80%;"></div>
        `;
        }
    }

    // =============================================================================
    // UTILITY: Show Error State
    // =============================================================================
    function showError(title, message) {
        const contentEl = document.getElementById('page-content');
        const titleEl = document.getElementById('page-title');

        if (titleEl) titleEl.innerText = title;
        if (contentEl) {
            contentEl.innerHTML = `
            <div class="glass-card" style="text-align: center; padding: 60px;">
                <div style="width: 64px; height: 64px; background: linear-gradient(135deg, var(--primary), var(--accent-purple)); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 24px; color: white;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 style="margin-bottom: 16px;">${title}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 24px;">${message}</p>
                <a href="/" class="btn btn-primary">
                    <i class="fas fa-home"></i> Go Home
                </a>
            </div>
        `;
        }
    }

    // =============================================================================
    // SERVICE PAGE LOADER
    // =============================================================================
    async function loadServicePage(slug) {
        console.log("Loading service:", slug);
        showLoading('page-content');

        try {
            const res = await mainDb.listDocuments(MAIN_DB_ID, COLLECTIONS.SERVICES, [MainQuery.equal('slug', slug)]);
            console.log("Service response:", res);

            if (res.documents.length) {
                const service = res.documents[0];
                renderServicePage(service);
            } else {
                showError('Service Not Found', 'The service you\'re looking for doesn\'t exist or has been moved.');
            }
        } catch (e) {
            console.error("Service Load Error:", e);
            showError('Error Loading Service', 'There was a problem loading this service. Please try again later. Error: ' + e.message);
        }
    }

    function renderServicePage(service) {
        console.log("Rendering service:", service.title);

        const titleEl = document.getElementById('page-title');
        const subtitleEl = document.getElementById('page-subtitle');
        const contentEl = document.getElementById('page-content');
        const tallyContainer = document.getElementById('tally-container');

        // Set title and subtitle
        if (titleEl) titleEl.innerText = service.title;
        if (subtitleEl && service.short_description) {
            subtitleEl.innerText = service.short_description;
            subtitleEl.style.display = 'block';
        }

        // Build rich content
        let html = '';

        // Service description card
        html += `
        <div class="service-description-card">
            <h3>${service.title}</h3>
            <div class="page-article">
                <p>${parseMarkdown(service.full_body_markdown || service.short_description)}</p>
            </div>
        </div>
    `;

        // Category badge
        if (service.category) {
            html += `
            <div style="margin-top: 24px;">
                <span class="portfolio-tag">${service.category}</span>
            </div>
        `;
        }

        // Price estimate if available
        if (service.price_estimate) {
            html += `
            <div class="glass-card" style="margin-top: 32px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, var(--primary), var(--accent-purple)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: white;">
                        <i class="fas fa-tag"></i>
                    </div>
                    <div>
                        <h4 style="margin-bottom: 4px; color: var(--text-primary);">Investment</h4>
                        <p style="font-size: 24px; font-weight: 700; background: linear-gradient(135deg, var(--primary), var(--accent-green)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                            ${service.price_estimate}
                        </p>
                    </div>
                </div>
            </div>
        `;
        }

        // CTA Section
        html += `
        <div class="content-cta" style="margin-top: 40px;">
            <h3>Ready to Get Started?</h3>
            <p>Let's discuss how ${service.title} can help your business grow.</p>
            <div class="cta-buttons">
                <a href="mailto:info@fikanova.co.ke?subject=Inquiry: ${encodeURIComponent(service.title)}" class="btn btn-primary">
                    <i class="fas fa-envelope"></i> Contact Us
                </a>
                <a href="/#services" class="btn btn-secondary">
                    View All Services
                </a>
            </div>
        </div>
    `;

        if (contentEl) contentEl.innerHTML = html;

        // Tally Form Embed
        if (tallyContainer) {
            const formId = service.tally_form_id || 'w7e8K1';
            tallyContainer.innerHTML = `
            <div class="sidebar-card" style="background: var(--dark-card); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 24px;">
                <h4 style="margin-bottom: 16px; color: var(--text-primary);">Get a Quote</h4>
                <iframe src="https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&service=${service.slug}" 
                    width="100%" height="400" frameborder="0" style="border-radius: 8px;">
                </iframe>
            </div>
        `;
        }
    }

    // =============================================================================
    // GENERIC PAGE LOADER
    // =============================================================================
    async function loadGenericPage(slug) {
        console.log("Loading page:", slug);
        showLoading('page-content');

        try {
            const res = await mainDb.listDocuments(MAIN_DB_ID, COLLECTIONS.PAGES, [MainQuery.equal('slug', slug)]);
            console.log("Page response:", res);

            if (res.documents.length) {
                const page = res.documents[0];
                renderGenericPage(page);
            } else {
                showError('Page Not Found', 'The page you\'re looking for doesn\'t exist or has been moved.');
            }
        } catch (e) {
            console.error("Page Load Error:", e);
            showError('Error Loading Page', 'There was a problem loading this page. Please try again later. Error: ' + e.message);
        }
    }

    function renderGenericPage(page) {
        console.log("Rendering page:", page.title);

        const titleEl = document.getElementById('page-title');
        const subtitleEl = document.getElementById('page-subtitle');
        const contentEl = document.getElementById('page-content');
        const tallyContainer = document.getElementById('tally-container');

        // Set title
        if (titleEl) titleEl.innerText = page.title;

        // Hide tally on pages
        if (tallyContainer) tallyContainer.style.display = 'none';

        // Build content with hero image if available
        let html = '';

        if (page.hero_image && !page.hero_image.includes('placeholder')) {
            html += `
            <div style="margin-bottom: 32px; border-radius: 16px; overflow: hidden; border: 1px solid var(--border-subtle);">
                <img src="${page.hero_image}" alt="${page.title}" 
                    style="width: 100%; height: 300px; object-fit: cover;">
            </div>
        `;
        }

        // Meta description as subtitle
        if (page.meta_description) {
            html += `
            <p style="font-size: 18px; color: var(--text-secondary); margin-bottom: 32px; font-style: italic;">
                ${page.meta_description}
            </p>
        `;
        }

        // Page content
        html += `
        <div class="page-article">
            <p>${parseMarkdown(page.content_markdown)}</p>
        </div>
    `;

        // Contact CTA
        html += `
        <div class="content-cta" style="margin-top: 40px;">
            <h3>Want to Learn More?</h3>
            <p>Get in touch with our team to discuss how we can help.</p>
            <div class="cta-buttons">
                <a href="/#contact" class="btn btn-primary">
                    <i class="fas fa-arrow-right"></i> Contact Us
                </a>
            </div>
        </div>
    `;

        if (contentEl) contentEl.innerHTML = html;
    }

    // =============================================================================
    // MAIN CONTENT LOADER
    // =============================================================================
    async function loadPageContent() {
        const params = new URLSearchParams(window.location.search);
        const serviceSlug = params.get('s');
        const pageSlug = params.get('p');
        const path = window.location.pathname;
        const href = window.location.href;

        console.log("Full URL:", href);
        console.log("Path:", path, "Service slug:", serviceSlug, "Page slug:", pageSlug);

        // Check for service page (handles both /service.html and /service)
        if ((path.includes('service') || href.includes('service')) && serviceSlug) {
            console.log("Detected service page, loading:", serviceSlug);
            await loadServicePage(serviceSlug);
        }
        // Check for generic page (handles both /page.html and /page)
        else if ((path.includes('page') || href.includes('page.html')) && pageSlug) {
            console.log("Detected generic page, loading:", pageSlug);
            await loadGenericPage(pageSlug);
        } else {
            console.log("No dynamic content to load on this page. Path:", path, "URL:", href);
        }
    }

    // =============================================================================
    // EXECUTE
    // =============================================================================
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadPageContent);
    } else {
        loadPageContent();
    }

    console.log("Main.js Loaded - Enhanced Content Rendering Active");

})(); // End IIFE
