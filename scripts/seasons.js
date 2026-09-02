(function() {
    'use strict';

    function initScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;

        function updateProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            progressBar.style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    function initScrollAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            document.querySelectorAll('.animate-on-scroll, .season-content, .season-image-wrapper, .trailer-header, .trailer-video-wrapper').forEach(el => {
                el.classList.add('animate-in');
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .season-content, .season-image-wrapper, .trailer-header, .trailer-video-wrapper'
        );

        animatedElements.forEach(el => observer.observe(el));
    }

    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        let lastScroll = 0;
        const threshold = 100;

        function handleScroll() {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScroll > lastScroll && currentScroll > threshold) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        }

        header.style.transition = 'transform 0.3s ease';
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    function initDropdown() {
        const dropdowns = document.querySelectorAll('.dropdown');

        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');

            if (!toggle || !menu) return;

            let timeoutId;

            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(timeoutId);
            });

            dropdown.addEventListener('mouseleave', () => {
                timeoutId = setTimeout(() => {
                    // Menu stays open via CSS hover
                }, 100);
            });

            // Keyboard support
            toggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menu.style.opacity = menu.style.opacity === '1' ? '0' : '1';
                    menu.style.visibility = menu.style.visibility === 'visible' ? 'hidden' : 'visible';
                    menu.style.transform = menu.style.transform === 'translateY(0)' ? 'translateY(-0.5rem)' : 'translateY(0)';
                }
            });

            // Close on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-0.5rem)';
                }
            });
        });
    }

    function initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const menuPanel = document.querySelector('.mobile-menu-panel');
        const menuOverlay = document.querySelector('.mobile-menu-overlay');
        const menuClose = document.querySelector('.mobile-menu-close');

        if (!menuBtn || !menuPanel || !menuOverlay || !menuClose) return;

        function openMenu() {
            menuPanel.classList.add('open');
            menuOverlay.classList.add('open');
            menuBtn.setAttribute('aria-expanded', 'true');
            document.body.classList.add('menu-open');
            // Close any open mobile dropdowns
            closeAllMobileDropdowns();
        }

        function closeMenu() {
            menuPanel.classList.remove('open');
            menuOverlay.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
        }

        function toggleMenu() {
            if (menuPanel.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        menuBtn.addEventListener('click', toggleMenu);
        menuClose.addEventListener('click', closeMenu);
        menuOverlay.addEventListener('click', closeMenu);

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menuPanel.classList.contains('open')) {
                closeMenu();
            }
        });

        // Close menu when clicking a nav link (but not dropdown toggle)
        const navLinks = menuPanel.querySelectorAll('.mobile-nav-link:not(.mobile-dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Mobile dropdown toggles
        const mobileDropdownToggles = menuPanel.querySelectorAll('.mobile-dropdown-toggle');
        mobileDropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = toggle.closest('.mobile-dropdown');
                const menu = dropdown?.querySelector('.mobile-dropdown-menu');
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

                // Close all other mobile dropdowns
                closeAllMobileDropdowns();

                if (!isExpanded && menu) {
                    toggle.setAttribute('aria-expanded', 'true');
                    menu.classList.add('open');
                }
            });
        });

        // Close mobile dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-dropdown')) {
                closeAllMobileDropdowns();
            }
        });

        function closeAllMobileDropdowns() {
            document.querySelectorAll('.mobile-dropdown-toggle[aria-expanded="true"]').forEach(toggle => {
                toggle.setAttribute('aria-expanded', 'false');
                const menu = toggle.closest('.mobile-dropdown')?.querySelector('.mobile-dropdown-menu');
                if (menu) menu.classList.remove('open');
            });
        }

        // Handle resize - close menu if window becomes desktop size
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth >= 768 && menuPanel.classList.contains('open')) {
                    closeMenu();
                }
            }, 100);
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function init() {
        initScrollProgress();
        initScrollAnimations();
        initHeaderScroll();
        initDropdown();
        initMobileMenu();
        initSmoothScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();