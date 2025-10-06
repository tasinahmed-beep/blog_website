const THEME_STORAGE_KEY = 'ai-pulse-theme';

// Blog Website JavaScript Functionality

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initContactForm();
    initNewsletterForm();
    initScrollEffects();
    initMobileMenu();
    initThemeToggle();
    initPostFilters();
    initBackToTop();
    initReadingProgress();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.top-nav a');
    if (!navLinks.length) {
        return;
    }

    const normalizePath = (path) => {
        if (!path) {
            return '/';
        }

        let cleaned = path.replace(/\\/g, '/');

        const protocolIndex = cleaned.indexOf('://');
        if (protocolIndex > -1) {
            cleaned = cleaned.substring(cleaned.indexOf('/', protocolIndex + 3));
        }

        cleaned = cleaned.replace(/index\.html$/i, '/');
        cleaned = cleaned.replace(/\/{2,}/g, '/');

        if (!cleaned.startsWith('/')) {
            cleaned = '/' + cleaned;
        }

        if (cleaned.length > 1 && cleaned.endsWith('/')) {
            cleaned = cleaned.slice(0, -1);
        }

        return cleaned || '/';
    };

    const currentPath = normalizePath(window.location.pathname || '/');

    navLinks.forEach((link) => {
        link.classList.remove('active');

        const targetUrl = new URL(link.getAttribute('href'), window.location.href);
        const targetPath = normalizePath(targetUrl.pathname);

        const isActive = (
            currentPath === targetPath ||
            (currentPath.startsWith('/posts/latest') && targetPath.includes('/pages/latest-posts')) ||
            (currentPath.startsWith('/posts/popular') && targetPath.includes('/pages/popular-posts')) ||
            (currentPath === '/' && targetPath === '/')
        );

        if (isActive) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();
            const destination = document.querySelector(anchor.getAttribute('href'));
            if (destination) {
                destination.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const subject = document.getElementById('subject')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Enter a valid email address.', 'error');
            return;
        }

        showNotification('Sending your message...', 'info');

        setTimeout(() => {
            showNotification('Thanks! Your message is on its way.', 'success');
            contactForm.reset();
        }, 1200);
    });
}

function initNewsletterForm() {
    const emailInput = document.getElementById('newsletter-email');
    if (!emailInput) {
        return;
    }

    const actionButton = emailInput.nextElementSibling;
    if (!actionButton || !actionButton.classList.contains('btn')) {
        return;
    }

    actionButton.addEventListener('click', () => {
        const email = emailInput.value.trim();

        if (!email) {
            showNotification('Please add your email address.', 'error');
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('That email address looks off. Try again?', 'error');
            emailInput.focus();
            return;
        }

        showNotification('Subscribing you to the AI newsletter...', 'info');

        setTimeout(() => {
            showNotification('You are subscribed! Expect fresh AI insights soon.', 'success');
            emailInput.value = '';
        }, 900);
    });
}

function initScrollEffects() {
    const header = document.querySelector('header');
    const navList = document.querySelector('.top-nav ul');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isScrollingDown = scrollTop > lastScrollTop;
            const menuOpen = navList && navList.classList.contains('mobile-open');

            if (scrollTop > 160 && isScrollingDown && !menuOpen) {
                header.style.transform = 'translateY(-110%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollTop = Math.max(scrollTop, 0);
        }, { passive: true });
    }

    if (!('IntersectionObserver' in window)) {
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    });

    const revealTargets = document.querySelectorAll('.content-card, .post-card, .about-card, .contact-method, .additional-method, .post-content .container');
    revealTargets.forEach((element) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(24px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

function initMobileMenu() {
    const header = document.querySelector('header');
    if (!header) {
        return;
    }

    const nav = document.querySelector('.top-nav');
    const navList = nav ? nav.querySelector('ul') : null;
    if (!navList) {
        return;
    }

    // Find button in header container, not inside nav
    let mobileMenuButton = document.querySelector('.mobile-menu-button');

    if (!mobileMenuButton) {
        return;
    }

    const closeMenu = () => {
        navList.classList.remove('mobile-open');
        mobileMenuButton.classList.remove('active');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    const openMenu = () => {
        navList.classList.add('mobile-open');
        mobileMenuButton.classList.add('active');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    };

    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const willOpen = !navList.classList.contains('mobile-open');
        if (willOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    navList.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    const handleResize = () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 768) {
            return;
        }

        if (!header.contains(event.target)) {
            closeMenu();
        }
    });
}

function initThemeToggle() {
    const headerContainer = document.querySelector('header .container');
    if (!headerContainer) {
        return;
    }

    let toggle = headerContainer.querySelector('.theme-toggle');
    if (!toggle) {
        toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Toggle color theme');
        headerContainer.appendChild(toggle);
    }

    const applyTheme = (theme, persist = true) => {
        document.body.dataset.theme = theme;
        toggle.innerHTML = theme === 'light' ? '☀️' : '🌙';
        toggle.setAttribute('aria-pressed', theme === 'light');
        if (persist) {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        }
    };

    const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
    applyTheme(initialTheme, Boolean(savedTheme));

    toggle.addEventListener('click', () => {
        const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme, true);
    });

    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (event) => {
            if (!localStorage.getItem(THEME_STORAGE_KEY)) {
                applyTheme(event.matches ? 'light' : 'dark', false);
            }
        });
    }
}

function initPostFilters() {
    const toolbars = document.querySelectorAll('.posts-toolbar');
    if (!toolbars.length) {
        return;
    }

    toolbars.forEach((toolbar) => {
        const targetSelector = toolbar.dataset.filterTarget;
        const grid = targetSelector ? document.querySelector(targetSelector) : toolbar.nextElementSibling;
        if (!grid) {
            return;
        }

        const cards = Array.from(grid.querySelectorAll('.post-card'));
        if (!cards.length) {
            return;
        }

        const chips = Array.from(toolbar.querySelectorAll('.filter-chip'));
        const searchInput = toolbar.querySelector('input[type="search"]');
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No posts match your filters yet. Try a different category or keyword.';
        emptyState.style.display = 'none';
        grid.parentElement.appendChild(emptyState);

        let activeCategory = toolbar.querySelector('.filter-chip.active')?.dataset.filter || 'all';
        let currentQuery = '';

        const applyFilters = () => {
            const normalizedQuery = currentQuery.trim().toLowerCase();
            let visibleCount = 0;

            cards.forEach((card) => {
                const cardCategory = (card.dataset.category || '').toLowerCase();
                const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
                const matchesQuery = !normalizedQuery || card.textContent.toLowerCase().includes(normalizedQuery);
                const isVisible = matchesCategory && matchesQuery;
                card.style.display = isVisible ? '' : 'none';
                if (isVisible) {
                    visibleCount += 1;
                }
            });

            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        };

        chips.forEach((chip) => {
            chip.addEventListener('click', () => {
                chips.forEach((c) => c.classList.remove('active'));
                chip.classList.add('active');
                activeCategory = chip.dataset.filter || 'all';
                applyFilters();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', (event) => {
                currentQuery = event.target.value;
                applyFilters();
            });
        }

        applyFilters();
    });
}

function initBackToTop() {
    let button = document.getElementById('backToTop');
    if (!button) {
        button = document.createElement('button');
        button.id = 'backToTop';
        button.type = 'button';
        button.setAttribute('aria-label', 'Back to top');
        button.innerHTML = '↑';
        document.body.appendChild(button);
    }

    const toggleVisibility = () => {
        if ((window.pageYOffset || document.documentElement.scrollTop) > 600) {
            button.classList.add('show');
        } else {
            button.classList.remove('show');
        }
    };

    button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();
}

function initReadingProgress() {
    const article = document.querySelector('.post-content');
    if (!article) {
        return;
    }

    let bar = document.getElementById('reading-progress');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'reading-progress';
        document.body.appendChild(bar);
    }

    const updateProgress = () => {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const viewportHeight = window.innerHeight;
        const distance = Math.max(1, articleHeight - viewportHeight);

        if (scrollPosition <= articleTop) {
            bar.style.width = '0%';
            return;
        }

        const progress = Math.min(1, Math.max(0, (scrollPosition - articleTop) / distance));
        bar.style.width = `${(progress * 100).toFixed(2)}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const container = document.createElement('div');
    container.className = `notification notification-${type}`;
    container.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Dismiss notification">&times;</button>
    `;

    document.body.appendChild(container);

    requestAnimationFrame(() => {
        container.classList.add('is-visible');
    });

    const close = () => {
        container.classList.remove('is-visible');
        container.addEventListener('transitionend', () => container.remove(), { once: true });
    };

    container.querySelector('.notification-close').addEventListener('click', close);
    setTimeout(close, 5000);
}


