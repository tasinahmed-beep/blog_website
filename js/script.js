// Blog Website JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initContactForm();
    initNewsletterForm();
    initScrollEffects();
    initMobileMenu();
});

// Navigation functionality
function initNavigation() {
    const currentLocation = window.location.pathname;

    // Update active navigation based on current page
    const navLinks = document.querySelectorAll('.top-nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentLocation.split('/').pop() ||
            (currentLocation.includes(href) && href !== '../index.html')) {
            link.classList.add('active');
        }
    });

    // Add smooth scrolling to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Sending message...', 'info');

            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            }, 1500);
        });
    }
}

// Newsletter form functionality
function initNewsletterForm() {
    const newsletterButton = document.querySelector('#newsletter-email + .btn');
    const newsletterEmail = document.getElementById('newsletter-email');

    if (newsletterButton && newsletterEmail) {
        newsletterButton.addEventListener('click', function() {
            const email = newsletterEmail.value;

            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate newsletter signup
            showNotification('Subscribing...', 'info');

            setTimeout(() => {
                showNotification('Successfully subscribed to the newsletter!', 'success');
                newsletterEmail.value = '';
            }, 1000);
        });
    }
}

// Scroll effects and animations
function initScrollEffects() {
    // Add scroll effect to header
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Add fade-in animation for cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and post cards
    document.querySelectorAll('.content-card, .post-card, .about-card, .contact-method, .additional-method').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    // Add mobile menu toggle if needed
    const nav = document.querySelector('.top-nav');
    const navLinks = document.querySelector('.top-nav ul');

    // Create mobile menu button
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'mobile-menu-button';
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.style.display = 'none';

    if (nav) {
        nav.insertBefore(mobileMenuButton, navLinks);

        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
        });
    }

    // Show mobile menu button on small screens
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobileMenuButton.style.display = 'block';
            navLinks.classList.add('mobile-nav');
        } else {
            mobileMenuButton.style.display = 'none';
            navLinks.classList.remove('mobile-open', 'mobile-nav');
        }
    }

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    // Add close button styles
    const closeButton = notification.querySelector('.notification-close');
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    `;

    // Add close functionality
    closeButton.addEventListener('click', function() {
        notification.remove();
    });

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationColor(type) {
    const colors = {
        'success': '#28a745',
        'error': '#dc3545',
        'info': '#17a2b8',
        'warning': '#ffc107'
    };
    return colors[type] || colors.info;
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .mobile-nav {
        display: none !important;
    }

    .mobile-nav.mobile-open {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        padding: 1rem;
    }

    .mobile-menu-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
    }

    @media (max-width: 768px) {
        .hero-buttons {
            flex-direction: column;
            align-items: center;
        }

        .newsletter-signup {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);