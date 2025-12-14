(function () {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDynamicMenu);
    } else {
        initDynamicMenu();
    }

    function initDynamicMenu() {
        console.log("Dynamic Menu Script Loaded");

        // --- COMPLETE MENU STRUCTURE ---
        const menuStructure = {
            solutions: {
                label: 'Solutions',
                categories: {
                    'Development': [
                        { label: 'Web Development', url: '/service/web-development' },
                        { label: 'Mobile App Development', url: '/service/mobile-app-development' },
                        { label: 'Custom Software', url: '/service/custom-software' }
                    ],
                    'Marketing': [
                        { label: 'SEO Optimization', url: '/service/seo-optimization' },
                        { label: 'Social Media Marketing', url: '/service/social-media-marketing' },
                        { label: 'Content Strategy', url: '/service/content-strategy' }
                    ],
                    'AI and Tech': [
                        { label: 'Chatbot Integration', url: '/service/chatbot-integration' },
                        { label: 'AI Automation', url: '/service/ai-automation' },
                        { label: 'Tech Consultation', url: '/service/tech-consultation' }
                    ]
                }
            },
            company: {
                label: 'Company',
                links: [
                    { label: 'About Us', url: '/page/about-us' },
                    { label: 'Our Story', url: '/page/our-story' },
                    { label: 'Impact', url: '/impact' },
                    { label: 'Contact Us', url: '/contact' }
                ]
            },
            work: {
                label: 'Work',
                links: [
                    { label: 'Portfolio', url: '/portfolio' },
                    { label: 'Case Studies', url: '/page/case-studies' },
                    { label: 'Resources', url: '/resources' },
                    { label: 'Newsletter', url: '/newsletter' }
                ]
            }
        };

        // --- HELPER: Build Simple Dropdowns (Company, Work) ---
        function buildSimpleDropdown(label, links) {
            let html = `<span class="nav-link">${label} <i class="fas fa-chevron-down" style="font-size:0.75rem;"></i></span>`;
            html += `<div class="mega-menu" style="min-width: 250px; grid-template-columns: 1fr;"><div class="mega-menu-group">`;
            links.forEach(link => {
                html += `<a href="${link.url}">${link.label}</a>`;
            });
            html += `</div></div>`;
            return html;
        }

        // --- HELPER: Build Solutions Mega Menu (3-column with categories) ---
        function buildSolutionsMegaMenu() {
            let html = `<span class="nav-link">${menuStructure.solutions.label} <i class="fas fa-chevron-down" style="font-size:0.75rem;"></i></span>`;
            html += `<div class="mega-menu">`;

            Object.entries(menuStructure.solutions.categories).forEach(([category, services]) => {
                html += `<div class="mega-menu-group"><h4>${category}</h4>`;
                services.forEach(service => {
                    html += `<a href="${service.url}">${service.label}</a>`;
                });
                html += `</div>`;
            });

            html += `</div>`;
            return html;
        }

        // --- Render Static Menus (Company, Work) - Desktop ---
        function renderStaticMenus() {
            const solutionsContainer = document.getElementById('nav-solutions-container');
            if (solutionsContainer) {
                solutionsContainer.innerHTML = buildSolutionsMegaMenu();
            }

            const companyContainer = document.getElementById('nav-company-container');
            if (companyContainer) {
                companyContainer.innerHTML = buildSimpleDropdown(menuStructure.company.label, menuStructure.company.links);
            }

            const workContainer = document.getElementById('nav-work-container');
            if (workContainer) {
                workContainer.innerHTML = buildSimpleDropdown(menuStructure.work.label, menuStructure.work.links);
            }
        }

        // --- Render Mobile Solutions Menu ---
        function renderMobileSolutionsMenu() {
            const container = document.getElementById('mobile-solutions-menu');
            if (!container) return;

            let html = '';
            Object.entries(menuStructure.solutions.categories).forEach(([category, services]) => {
                html += `<div class="mobile-category">`;
                html += `<strong style="font-size:0.75rem; color:var(--text-tertiary); text-transform:uppercase; display:block; margin:10px 0 5px;">${category}</strong>`;
                services.forEach(service => {
                    html += `<a href="${service.url}" class="menu-item">${service.label}</a>`;
                });
                html += `</div>`;
            });
            container.innerHTML = html;
        }

        // =====================================================
        // RENDER ALL MENUS
        // =====================================================
        renderStaticMenus();
        renderMobileSolutionsMenu();
        console.log("All menus rendered (Solutions, Company, Work)");

    } // End initDynamicMenu

})(); // End IIFE
