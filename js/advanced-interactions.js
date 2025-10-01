// Advanced Interactive Features

document.addEventListener('DOMContentLoaded', () => {
    initParticleBackground();
    initMagneticButtons();
    initSplitTextReveal();
    initSpotlightEffect();
    initParallaxScrolling();
    initCardStack();
    initPathAnimation();
    init3DCards();
    initTypingEffect();
    initAudioFeedback();
});

// Particle Background
function initParticleBackground() {
    const container = document.createElement('div');
    container.className = 'particle-background';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.width = Math.random() * 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        particle.style.animationDelay = Math.random() * 20 + 's';
        container.appendChild(particle);
    }
}

// Magnetic Buttons
function initMagneticButtons() {
    document.querySelectorAll('.magnetic-button').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// Split Text Reveal
function initSplitTextReveal() {
    document.querySelectorAll('.split-reveal').forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        [...text].forEach(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char;
            element.appendChild(span);
        });

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(element);
    });
}

// Spotlight Effect
function initSpotlightEffect() {
    document.querySelectorAll('.spotlight').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            element.style.setProperty('--x', x + 'px');
            element.style.setProperty('--y', y + 'px');
        });
    });
}

// Parallax Scrolling
function initParallaxScrolling() {
    const parallaxElements = document.querySelectorAll('.parallax');
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                parallaxElements.forEach(element => {
                    const speed = element.dataset.speed || 0.5;
                    const rect = element.getBoundingClientRect();
                    const scrolled = window.pageYOffset;
                    
                    const yPos = -(scrolled * speed);
                    element.style.setProperty('--scroll-y', yPos + 'px');
                });
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Interactive Card Stack
function initCardStack() {
    document.querySelectorAll('.card-stack').forEach(stack => {
        const cards = stack.querySelectorAll('.card-stack-item');
        let currentIndex = 0;

        stack.addEventListener('click', () => {
            cards[currentIndex].style.transform = 'translateX(100%) rotateY(-30deg)';
            currentIndex = (currentIndex + 1) % cards.length;
            cards[currentIndex].style.transform = 'translateX(0) rotateY(0)';
        });
    });
}

// SVG Path Animation
function initPathAnimation() {
    document.querySelectorAll('.path-animation path').forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
    });
}

// 3D Cards
function init3DCards() {
    document.querySelectorAll('.card-3d').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

// Typing Effect
function initTypingEffect() {
    document.querySelectorAll('.typing').forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, Math.random() * 100 + 50);
            }
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(element);
    });
}

// Audio Feedback
function initAudioFeedback() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function playSound(frequency, duration = 0.1) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
        oscillator.stop(audioContext.currentTime + duration);
    }

    // Add subtle audio feedback to interactive elements
    document.querySelectorAll('button, .card-3d, .magnetic-button').forEach(element => {
        element.addEventListener('click', () => playSound(440));
        element.addEventListener('mouseenter', () => playSound(660, 0.05));
    });
}

// Liquid Button Effect
document.querySelectorAll('.liquid-button').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        button.style.setProperty('--x', x + 'px');
        button.style.setProperty('--y', y + 'px');
    });
});