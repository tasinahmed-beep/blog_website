// Blog Website JavaScript Functionality

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initContactForm();
    initNewsletterForm();
    initScrollEffects();
    initMobileMenu();
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
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isScrollingDown = scrollTop > lastScrollTop;

            if (scrollTop > 160 && isScrollingDown) {
                header.style.transform = 'translateY(-110%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollTop = Math.max(scrollTop, 0);
        });
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
    const nav = document.querySelector('.top-nav');
    if (!nav) {
        return;
    }

    const navList = nav.querySelector('ul');
    if (!navList) {
        return;
    }

    let mobileMenuButton = nav.querySelector('.mobile-menu-button');

    if (!mobileMenuButton) {
        mobileMenuButton = document.createElement('button');
        mobileMenuButton.className = 'mobile-menu-button';
        mobileMenuButton.setAttribute('aria-label', 'Toggle navigation');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.innerHTML = '&#9776;';
        nav.insertBefore(mobileMenuButton, navList);
    }

    const closeMenu = () => {
        navList.classList.remove('mobile-open');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
    };

    mobileMenuButton.addEventListener('click', () => {
        const willOpen = !navList.classList.contains('mobile-open');
        navList.classList.toggle('mobile-open', willOpen);
        mobileMenuButton.setAttribute('aria-expanded', String(willOpen));
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
            mobileMenuButton.style.display = 'none';
        } else {
            mobileMenuButton.style.display = 'inline-flex';
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 768) {
            return;
        }

        if (!nav.contains(event.target)) {
            closeMenu();
        }
    });
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



