// Enhanced Interactions

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initProgressBar();
    initImageZoom();
    initCodeHighlight();
    initTableSort();
    initInfiniteScroll();
    initKeyboardNavigation();
    initCopyButtons();
    initTooltips();
    initMediumZoomImages();
    initAutoComplete();
});

// Smooth Scroll with Intersection Observer
function initSmoothScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Progress Bar
function initProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.transform = `scaleX(${scrolled / 100})`;
    });
}

// Image Zoom
function initImageZoom() {
    document.querySelectorAll('.post-content img').forEach(img => {
        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'image-zoom-overlay';
            
            const image = new Image();
            image.src = img.src;
            image.className = 'zoomed-image';
            
            overlay.appendChild(image);
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                overlay.remove();
            });
        });
    });
}

// Code Highlighting
function initCodeHighlight() {
    document.querySelectorAll('pre code').forEach(block => {
        const language = block.className.match(/language-([a-z]+)/)?.[1] || 'plaintext';
        block.parentElement.dataset.language = language;
        
        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        block.parentElement.appendChild(copyButton);
        
        copyButton.addEventListener('click', async () => {
            await navigator.clipboard.writeText(block.textContent);
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        });
    });
}

// Table Sorting
function initTableSort() {
    document.querySelectorAll('table').forEach(table => {
        table.querySelectorAll('th').forEach(th => {
            th.style.cursor = 'pointer';
            th.addEventListener('click', () => {
                const index = Array.from(th.parentElement.children).indexOf(th);
                sortTable(table, index);
            });
        });
    });
}

function sortTable(table, column) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isNumeric = rows.every(row => !isNaN(row.children[column].textContent.trim()));
    
    rows.sort((a, b) => {
        const aValue = a.children[column].textContent.trim();
        const bValue = b.children[column].textContent.trim();
        
        if (isNumeric) {
            return parseFloat(aValue) - parseFloat(bValue);
        }
        return aValue.localeCompare(bValue);
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

// Infinite Scroll
function initInfiniteScroll() {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) return;

    const loadMoreThreshold = 300; // pixels from bottom
    let isLoading = false;

    window.addEventListener('scroll', () => {
        if (isLoading) return;

        const distanceToBottom = document.documentElement.scrollHeight - 
            (window.scrollY + window.innerHeight);

        if (distanceToBottom < loadMoreThreshold) {
            loadMorePosts();
        }
    });

    async function loadMorePosts() {
        isLoading = true;
        // Simulate loading more posts
        await new Promise(resolve => setTimeout(resolve, 1000));
        isLoading = false;
    }
}

// Keyboard Navigation
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Arrow keys for post navigation
        if (e.key === 'ArrowLeft') {
            const prevLink = document.querySelector('.post-navigation .btn:first-child');
            if (prevLink) prevLink.click();
        }
        if (e.key === 'ArrowRight') {
            const nextLink = document.querySelector('.post-navigation .btn:last-child');
            if (nextLink) nextLink.click();
        }

        // Search shortcut (Ctrl + K)
        if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const searchButton = document.querySelector('.search-button');
            if (searchButton) searchButton.click();
        }
    });
}

// Copy Buttons
function initCopyButtons() {
    document.querySelectorAll('.copy-content').forEach(element => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<span>Copy</span>';
        element.appendChild(copyButton);

        copyButton.addEventListener('click', async () => {
            const content = element.querySelector('code')?.textContent || element.textContent;
            await navigator.clipboard.writeText(content);
            
            copyButton.innerHTML = '<span>Copied!</span>';
            setTimeout(() => {
                copyButton.innerHTML = '<span>Copy</span>';
            }, 2000);
        });
    });
}

// Tooltips
function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.dataset.tooltip;
            
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2}px`;
            tooltip.style.top = `${rect.top - 8}px`;
            
            document.body.appendChild(tooltip);
            requestAnimationFrame(() => tooltip.classList.add('visible'));
        });

        element.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.classList.remove('visible');
                tooltip.addEventListener('transitionend', () => tooltip.remove());
            }
        });
    });
}

// Image Zoom using Medium-style zoom
function initMediumZoomImages() {
    document.querySelectorAll('.post-content img').forEach(img => {
        img.style.cursor = 'zoom-in';
        
        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'medium-zoom-overlay';
            
            const clone = img.cloneNode();
            clone.className = 'medium-zoom-image';
            
            overlay.appendChild(clone);
            document.body.appendChild(overlay);
            
            requestAnimationFrame(() => {
                overlay.classList.add('active');
                clone.classList.add('active');
            });
            
            overlay.addEventListener('click', () => {
                overlay.classList.remove('active');
                clone.classList.remove('active');
                
                overlay.addEventListener('transitionend', () => {
                    overlay.remove();
                }, { once: true });
            });
        });
    });
}

// Search Autocomplete
function initAutoComplete() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;

    let timeoutId;
    const minChars = 2;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        const query = e.target.value.trim();

        if (query.length >= minChars) {
            timeoutId = setTimeout(() => {
                fetchSearchSuggestions(query);
            }, 300);
        }
    });

    async function fetchSearchSuggestions(query) {
        // Simulate API call for suggestions
        const suggestions = [
            'AI Development',
            'Machine Learning',
            'Neural Networks',
            'Deep Learning',
            'Natural Language Processing'
        ].filter(s => s.toLowerCase().includes(query.toLowerCase()));

        displaySuggestions(suggestions);
    }

    function displaySuggestions(suggestions) {
        let suggestionsContainer = document.querySelector('.search-suggestions');
        
        if (!suggestionsContainer) {
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            searchInput.parentNode.appendChild(suggestionsContainer);
        }

        suggestionsContainer.innerHTML = suggestions
            .map(s => `<div class="search-suggestion">${s}</div>`)
            .join('');

        suggestionsContainer.querySelectorAll('.search-suggestion').forEach(suggestion => {
            suggestion.addEventListener('click', () => {
                searchInput.value = suggestion.textContent;
                suggestionsContainer.innerHTML = '';
            });
        });
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}