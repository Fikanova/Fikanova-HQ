      // Mobile menu functionality - CRITICAL FIXES
        const hamburger = document.getElementById('hamburger');
        const mobileNav = document.getElementById('mobileNav');
        const menuBackdrop = document.getElementById('menuBackdrop');

        // Toggle menu function
        function toggleMenu() {
            const isOpen = mobileNav.classList.contains('active');
            
            if (isOpen) {
                // Close menu
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                menuBackdrop.classList.remove('active');
                document.body.classList.remove('menu-open');
            } else {
                // Open menu
                hamburger.classList.add('active');
                mobileNav.classList.add('active');
                menuBackdrop.classList.add('active');
                document.body.classList.add('menu-open');
            }
        }

        // Hamburger click - should both open AND close
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Backdrop click - close menu
        menuBackdrop.addEventListener('click', function() {
            if (mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Close menu when clicking any link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (mobileNav.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });

        // Prevent clicks inside mobile nav from bubbling
        mobileNav.addEventListener('click', function(e) {
            e.stopPropagation();
        });


        // Mobile navigation is now simple - no mega menus needed in mobile
        // All navigation links work directly

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
                if (mobileNav.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });

        // Header scroll effect
        const header = document.getElementById('header');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Active nav link highlighting
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('section[id]');

        function updateActiveNav() {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveNav);

        // Portfolio tabs functionality
        const tabBtns = document.querySelectorAll('.tab-btn');
        
        function showCompletedProjects() {
            return `
                <div class="project-card fade-in" data-category="completed">
                    <div class="project-content">
                        <h3>Opal Suites</h3>
                        <p>Real estate website</p>
                        <a href="https://opalsuites.co.ke/" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="project-card fade-in" data-category="completed">
                    <div class="project-content">
                        <h3>ETCO Kenya</h3>
                        <p>NGO website for education and community outreach</p>
                        <a href="https://www.etco-kenya.org/" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="project-card fade-in" data-category="completed">
                    <div class="project-content">
                        <h3>Jenga365</h3>
                        <p>Mentorship platform</p>
                        <a href="https://jenga365.com/" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="project-card fade-in" data-category="completed">
                    <div class="project-content">
                        <h3>Botpress Chatbot</h3>
                        <p>AI-powered chatbot for customer engagement</p>
                        <a href="https://cdn.botpress.cloud/webchat/v3.3/shareable.html?configUrl=https://files.bpcontent.cloud/2025/04/19/22/20250419221035-5MC8KQXA.json" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
        }
        
        function showOngoingProjects() {
            return `
                <div class="project-card ongoing fade-in" data-category="ongoing">
                    <div class="project-content">
                        <div class="project-status in-progress">In Progress</div>
                        <h3>Fikanova AI Platform</h3>
                        <p>Workflow automation and AI agents integration</p>
                        <a href="https://www.fikanova.co.ke/" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="project-card ongoing fade-in" data-category="ongoing">
                    <div class="project-content">
                        <div class="project-status in-progress">In Progress</div>
                        <h3>Mobile App Development</h3>
                        <p>Cross-platform app with real-time tracking</p>
                        <a href="https://www.fikanova.co.ke/" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
                <div class="project-card ongoing fade-in" data-category="ongoing">
                    <div class="project-content">
                        <div class="project-status in-progress">In Progress</div>
                        <h3>Data Analytics Dashboard</h3>
                        <p>AI-powered insights for sports data</p>
                        <a href="https://www.fikanova.co.ke/" target="_blank" class="project-link">View Project <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `;
        }
        
        function switchTab(targetTab) {
            const portfolioGrid = document.getElementById('portfolioGrid');
            
            // Add fade out effect
            portfolioGrid.classList.add('fade-out');
            
            setTimeout(() => {
                // Update content based on active tab
                if (targetTab === 'ongoing') {
                    portfolioGrid.innerHTML = showOngoingProjects();
                } else {
                    portfolioGrid.innerHTML = showCompletedProjects();
                }
                
                // Remove fade out and trigger fade in
                portfolioGrid.classList.remove('fade-out');
                
                // Re-observe new elements for scroll animations
                const newElements = portfolioGrid.querySelectorAll('.fade-in');
                newElements.forEach(el => {
                    observer.observe(el);
                    // Trigger animation immediately if in viewport
                    const elementTop = el.getBoundingClientRect().top;
                    if (elementTop < window.innerHeight - 150) {
                        setTimeout(() => el.classList.add('visible'), 100);
                    }
                });
            }, 200);
        }

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Update active tab
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Switch content with fade transition
                switchTab(targetTab);
            });
        });

        // Enhanced animated counters for impact section
        function animateCounter(element, target, duration = 2000) {
            let start = 0;
            const startTime = performance.now();
            
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                
                start = Math.floor(target * easeOutCubic);
                element.textContent = start;
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            }
            
            requestAnimationFrame(updateCounter);
        }

        // Parallax effect for hero section
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.setProperty('--scroll', yPos + 'px');
            });
        }

        // Enhanced scroll animations with stagger
        function handleScrollAnimations() {
            const elements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
            
            elements.forEach((element, index) => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, index * 100); // Stagger delay
                }
            });
        }

        // Mouse trail effect (subtle)
        function createMouseTrail() {
            const trail = [];
            const maxTrailLength = 10;
            
            document.addEventListener('mousemove', (e) => {
                trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
                
                if (trail.length > maxTrailLength) {
                    trail.shift();
                }
                
                updateTrail();
            });
            
            function updateTrail() {
                const trailContainer = document.querySelector('.mouse-trail') || createTrailContainer();
                trailContainer.innerHTML = '';
                
                trail.forEach((point, index) => {
                    const trailDot = document.createElement('div');
                    trailDot.className = 'trail-dot';
                    trailDot.style.cssText = `
                        position: fixed;
                        left: ${point.x}px;
                        top: ${point.y}px;
                        width: ${6 - index * 0.5}px;
                        height: ${6 - index * 0.5}px;
                        background: rgba(77, 138, 255, ${0.8 - index * 0.08});
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 9999;
                        transform: translate(-50%, -50%);
                        transition: opacity 0.2s ease;
                    `;
                    trailContainer.appendChild(trailDot);
                });
            }
            
            function createTrailContainer() {
                const container = document.createElement('div');
                container.className = 'mouse-trail';
                container.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 9999;
                `;
                document.body.appendChild(container);
                return container;
            }
        }

        // Typing effect for hero title
        function typeWriterEffect() {
            const heroTitle = document.querySelector('.hero h1');
            const text = heroTitle.textContent;
            heroTitle.textContent = '';
            heroTitle.style.borderRight = '3px solid var(--accent-blue)';
            
            let index = 0;
            function typeChar() {
                if (index < text.length) {
                    heroTitle.textContent += text.charAt(index);
                    index++;
                    setTimeout(typeChar, 100);
                } else {
                    setTimeout(() => {
                        heroTitle.style.borderRight = 'none';
                    }, 1000);
                }
            }
            
            setTimeout(typeChar, 500);
        }

        // Loading animation
        function showLoadingAnimation() {
            const loader = document.createElement('div');
            loader.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--bg-primary);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000;
                    transition: opacity 0.5s ease;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        border: 3px solid rgba(77, 138, 255, 0.3);
                        border-top: 3px solid var(--accent-blue);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    "></div>
                </div>
            `;
            document.body.appendChild(loader);
            
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(loader);
                }, 500);
            }, 1500);
        }

        // Enhanced Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add stagger delay for multiple elements
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                        
                        // Add glow animation to certain elements
                        if (entry.target.classList.contains('service-card') || 
                            entry.target.classList.contains('origin-card')) {
                            entry.target.classList.add('glow-animation');
                        }
                    }, index * 150);
                    
                    // Animate counters when impact section is visible
                    if (entry.target.closest('#impact')) {
                        setTimeout(() => {
                            const projectsCount = document.getElementById('projectsCount');
                            const clientsCount = document.getElementById('clientsCount');
                            const yearFounded = document.getElementById('yearFounded');
                            
                            if (projectsCount && !projectsCount.classList.contains('animated')) {
                                projectsCount.classList.add('animated');
                                const target1 = parseInt(projectsCount.getAttribute('data-target'));
                                animateCounter(projectsCount, target1, 2000);
                            }
                            if (clientsCount && !clientsCount.classList.contains('animated')) {
                                clientsCount.classList.add('animated');
                                const target2 = parseInt(clientsCount.getAttribute('data-target'));
                                animateCounter(clientsCount, target2, 2000);
                            }
                            if (yearFounded && !yearFounded.classList.contains('animated')) {
                                yearFounded.classList.add('animated');
                                const target3 = parseInt(yearFounded.getAttribute('data-target'));
                                animateCounter(yearFounded, target3, 1500);
                            }
                        }, 500);
                    }
                    
                    // Trigger special animations for hero elements
                    if (entry.target.classList.contains('hero')) {
                        typeWriterEffect();
                    }
                }
            });
        }, observerOptions);

        // Observe all fade-in elements and sections
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        document.querySelectorAll('section').forEach(el => observer.observe(el));

        // Newsletter form submission
        const newsletterForm = document.getElementById('newsletterForm');
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            
            // Simulate form submission
            alert(`Thank you for subscribing with email: ${email}. You'll receive updates about our latest innovations!`);
            e.target.reset();
        });

        // Handle all contact CTAs
        document.querySelectorAll('a[href="#contact"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Simulate contact form modal or redirect
                alert('Contact form would open here. For now, please reach out via our social media channels or email us directly!');
            });
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href === '#contact') {
                    return; // Let the contact handler deal with this
                }
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Close mobile menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Initial load animations with enhanced effects
        window.addEventListener('load', () => {
            // Show loading animation
            showLoadingAnimation();
            
            // Trigger initial animations after loading
            setTimeout(() => {
                updateActiveNav();
                handleScrollAnimations();
                
                // Initialize mouse trail (optional - can be disabled for performance)
                if (window.innerWidth > 768) {
                    createMouseTrail();
                }
                
                // Add parallax effect
                updateParallax();
            }, 1500);
        });

        // Enhanced scroll event with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            updateActiveNav();
            updateParallax();
            
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleScrollAnimations();
                    scrollTimeout = null;
                }, 10);
            }
        });

        // Add smooth cursor following effect to interactive elements
        document.querySelectorAll('.btn, .service-card, .origin-card, .project-card').forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            });
        });

        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add CSS for ripple animation
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
        // Performance optimization: Disable animations on low-performance devices
        function detectPerformance() {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            const isLowPerformance = connection && (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
            
            if (isLowPerformance) {
                document.documentElement.style.setProperty('--duration-fast', '0.1s');
                document.documentElement.style.setProperty('--duration-normal', '0.2s');
                
                // Disable mouse trail on low performance
                document.body.classList.add('low-performance');
            }
        }

        // Initialize performance detection
        detectPerformance();

        // Add keyboard navigation enhancements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });

        // Add CSS for keyboard navigation
        const keyboardStyle = document.createElement('style');
        keyboardStyle.textContent = `
            .using-keyboard *:focus {
                outline: 2px solid var(--accent-blue) !important;
                outline-offset: 2px !important;
            }
            
            .low-performance .mouse-trail {
                display: none !important;
            }
            
            .low-performance * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
        `;
        document.head.appendChild(keyboardStyle);

        // Mega menu enhanced interactions
        const megaMenuItems = document.querySelectorAll('.nav-item-with-mega');
        let megaMenuTimeout;

        megaMenuItems.forEach(item => {
            const megaMenu = item.querySelector('.mega-menu');
            
            // Show mega menu on hover with slight delay
            item.addEventListener('mouseenter', () => {
                clearTimeout(megaMenuTimeout);
                megaMenu.style.display = 'block';
                setTimeout(() => {
                    megaMenu.style.opacity = '1';
                    megaMenu.style.visibility = 'visible';
                    megaMenu.style.transform = 'translateX(-50%) translateY(0)';
                }, 10);
            });

            // Hide mega menu on mouse leave with delay
            item.addEventListener('mouseleave', () => {
                megaMenuTimeout = setTimeout(() => {
                    megaMenu.style.opacity = '0';
                    megaMenu.style.visibility = 'hidden';
                    megaMenu.style.transform = 'translateX(-50%) translateY(-10px)';
                    setTimeout(() => {
                        megaMenu.style.display = 'none';
                    }, 300);
                }, 100);
            });

            // Keep mega menu open when hovering over it
            megaMenu.addEventListener('mouseenter', () => {
                clearTimeout(megaMenuTimeout);
            });

            megaMenu.addEventListener('mouseleave', () => {
                megaMenuTimeout = setTimeout(() => {
                    megaMenu.style.opacity = '0';
                    megaMenu.style.visibility = 'hidden';
                    megaMenu.style.transform = 'translateX(-50%) translateY(-10px)';
                    setTimeout(() => {
                        megaMenu.style.display = 'none';
                    }, 300);
                }, 100);
            });
        });

        // Close mega menus when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-item-with-mega')) {
                document.querySelectorAll('.mega-menu').forEach(menu => {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateX(-50%) translateY(-10px)';
                    setTimeout(() => {
                        menu.style.display = 'none';
                    }, 300);
                });
            }
        });

        // Enhanced keyboard navigation for mega menus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close all mega menus on Escape
                document.querySelectorAll('.mega-menu').forEach(menu => {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateX(-50%) translateY(-10px)';
                });
                
                // Also close mobile menu if open
                if (mobileNav.classList.contains('active')) {
                    closeMobileMenu();
                }
            }
        });

        // Enhanced scroll behavior for floating social icons
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const socialFloat = document.querySelector('.social-float');
            const currentScrollY = window.scrollY;
            
            if (window.innerWidth <= 768) {
                // On mobile, hide/show social icons based on scroll direction
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    // Scrolling down
                    socialFloat.style.transform = 'translateY(100px)';
                    socialFloat.style.opacity = '0.7';
                } else {
                    // Scrolling up
                    socialFloat.style.transform = 'translateY(0)';
                    socialFloat.style.opacity = '1';
                }
            }
            
            lastScrollY = currentScrollY;
        });

        // Add stagger animation to floating social icons
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach((icon, index) => {
            icon.style.animationDelay = `${1.2 + (index * 0.1)}s`;
        });

        // Add loading state for mega menu items
        document.querySelectorAll('.mega-item').forEach(item => {
            item.addEventListener('click', (e) => {
                // Add loading state if needed
                item.style.opacity = '0.7';
                setTimeout(() => {
                    item.style.opacity = '1';
                }, 300);
            });
        });