// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScript);
} else {
    initScript();
}

function initScript() {
    'use strict';
    // =============================================================================
    // THEME TOGGLE (Dark mode is default, toggle to light)
    // =============================================================================
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    function toggleTheme() {
        body.classList.toggle('theme-light');
        const isLight = body.classList.contains('theme-light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        if (navigator.vibrate) navigator.vibrate(10);
    }

    // Load saved theme (dark is default)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('theme-light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

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
            if (!e.target.closest('.submenu-toggle')) {
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        }
    });

    // =============================================================================
    // PORTFOLIO TABS
    // =============================================================================
    function switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        document.querySelectorAll('.portfolio-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tab + '-tab').classList.add('active');

        if (navigator.vibrate) navigator.vibrate(10);
    }

    // Expose switchTab globally for onclick handlers
    window.switchTab = switchTab;

    // =============================================================================
    // SCROLL REVEAL ANIMATION
    // =============================================================================
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '50px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });

    // =============================================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // =============================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            }
        });
    });

    // =============================================================================
    // HAPTIC FEEDBACK ON INTERACTIONS
    // =============================================================================
    document.querySelectorAll('.btn, .service-card, .portfolio-card, .tab-btn').forEach(el => {
        el.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(10);
        });
    });
    // =============================================================================
    // RETURN TO TOP BUTTON
    // =============================================================================
    const returnToTop = document.getElementById('return-to-top');

    if (returnToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                returnToTop.classList.add('visible');
            } else {
                returnToTop.classList.remove('visible');
            }
        });

        returnToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            if (navigator.vibrate) navigator.vibrate(10);
        });
    }

} // End initScript
