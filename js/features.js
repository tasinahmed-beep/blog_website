// Enhanced Features JavaScript

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initComments();
    initLazyLoading();
    initReadingTime();
    initTableOfContents();
    initShareButtons();
    initPagination();
    enhanceAccessibility();
});

// Global Search
function initSearch() {
    const searchButton = document.createElement('button');
    searchButton.className = 'search-button';
    searchButton.setAttribute('aria-label', 'Search');
    searchButton.innerHTML = '🔍';
    document.querySelector('header .container').appendChild(searchButton);

    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <div class="search-header">
                <input type="search" class="search-input" placeholder="Search articles..." aria-label="Search articles">
            </div>
            <div class="search-results"></div>
        </div>
    `;
    document.body.appendChild(searchOverlay);

    const searchInput = searchOverlay.querySelector('.search-input');
    const resultsContainer = searchOverlay.querySelector('.search-results');

    searchButton.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.toLowerCase();
            // Implement your search logic here
            // For now, we'll just show a placeholder
            resultsContainer.innerHTML = `
                <div class="search-result">
                    <h4>Sample Result</h4>
                    <p class="search-result-meta">This is a placeholder for the search functionality.</p>
                </div>
            `;
        }, 300);
    });
}

// Comments System
function initComments() {
    const articleContent = document.querySelector('.post-content');
    if (!articleContent) return;

    const commentsSection = document.createElement('section');
    commentsSection.className = 'comments-section';
    commentsSection.innerHTML = `
        <h3>Discussion</h3>
        <div class="comments-list"></div>
        <form class="comment-form">
            <div class="form-group">
                <label for="comment">Add to the discussion</label>
                <textarea id="comment" name="comment" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Post Comment</button>
        </form>
    `;
    articleContent.appendChild(commentsSection);

    // Load comments from localStorage for demo
    loadComments();

    const commentForm = commentsSection.querySelector('.comment-form');
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textarea = e.target.querySelector('textarea');
        const comment = textarea.value.trim();
        
        if (comment) {
            addComment({
                author: 'Guest User',
                date: new Date().toISOString(),
                content: comment
            });
            textarea.value = '';
            showNotification('Comment posted successfully!', 'success');
        }
    });
}

function loadComments() {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList) return;

    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <div class="comment-avatar"></div>
                <div class="comment-meta">
                    <div class="comment-author">${comment.author}</div>
                    <div class="comment-date">${new Date(comment.date).toLocaleDateString()}</div>
                </div>
            </div>
            <div class="comment-content">${comment.content}</div>
        </div>
    `).join('');
}

function addComment(comment) {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.unshift(comment);
    localStorage.setItem('comments', JSON.stringify(comments));
    loadComments();
}

// Lazy Loading Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.classList.add('lazy-image');
        imageObserver.observe(img);
    });
}

// Reading Time Estimation
function initReadingTime() {
    const article = document.querySelector('.post-content');
    if (!article) return;

    const text = article.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

    const meta = document.querySelector('.post-meta');
    if (meta) {
        const readingTimeSpan = document.createElement('span');
        readingTimeSpan.className = 'reading-time';
        readingTimeSpan.innerHTML = `${readingTime} min read`;
        meta.appendChild(readingTimeSpan);
    }
}

// Table of Contents
function initTableOfContents() {
    const article = document.querySelector('.post-content');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3');
    if (headings.length < 3) return; // Only show ToC if there are enough headings

    const toc = document.createElement('nav');
    toc.className = 'toc';
    toc.innerHTML = '<h4>Table of Contents</h4><ul class="toc-list"></ul>';

    const tocList = toc.querySelector('.toc-list');
    headings.forEach((heading, index) => {
        const link = document.createElement('a');
        const id = `heading-${index}`;
        heading.id = id;
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        
        const li = document.createElement('li');
        li.appendChild(link);
        tocList.appendChild(li);
    });

    article.insertBefore(toc, article.querySelector('.post-body'));
}

// Social Share Buttons
function initShareButtons() {
    const article = document.querySelector('.post-content');
    if (!article) return;

    const shareButtons = document.createElement('div');
    shareButtons.className = 'share-buttons';
    
    const title = document.title;
    const url = window.location.href;

    shareButtons.innerHTML = `
        <button class="share-button share-twitter" aria-label="Share on Twitter">
            Share on Twitter
        </button>
        <button class="share-button share-facebook" aria-label="Share on Facebook">
            Share on Facebook
        </button>
        <button class="share-button share-linkedin" aria-label="Share on LinkedIn">
            Share on LinkedIn
        </button>
    `;

    shareButtons.addEventListener('click', (e) => {
        if (!e.target.matches('.share-button')) return;

        let shareUrl;
        if (e.target.classList.contains('share-twitter')) {
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        } else if (e.target.classList.contains('share-facebook')) {
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        } else if (e.target.classList.contains('share-linkedin')) {
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    });

    const postMeta = article.querySelector('.post-meta');
    if (postMeta) {
        postMeta.parentNode.insertBefore(shareButtons, postMeta.nextSibling);
    }
}

// Pagination
function initPagination() {
    const postsGrid = document.querySelector('.posts-grid');
    if (!postsGrid) return;

    const posts = Array.from(postsGrid.children);
    const postsPerPage = 6;
    const pageCount = Math.ceil(posts.length / postsPerPage);

    if (pageCount <= 1) return;

    const pagination = document.createElement('div');
    pagination.className = 'pagination';

    for (let i = 1; i <= pageCount; i++) {
        const button = document.createElement('button');
        button.className = 'pagination-button';
        button.textContent = i;
        if (i === 1) button.classList.add('active');
        pagination.appendChild(button);
    }

    postsGrid.parentNode.appendChild(pagination);

    pagination.addEventListener('click', (e) => {
        if (!e.target.matches('.pagination-button')) return;

        const page = parseInt(e.target.textContent);
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;

        posts.forEach((post, index) => {
            post.style.display = (index >= start && index < end) ? '' : 'none';
        });

        pagination.querySelectorAll('.pagination-button').forEach(btn => {
            btn.classList.toggle('active', btn === e.target);
        });
    });

    // Show first page
    posts.forEach((post, index) => {
        post.style.display = index < postsPerPage ? '' : 'none';
    });
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ARIA labels
    document.querySelectorAll('button:not([aria-label])').forEach(button => {
        if (button.textContent.trim()) {
            button.setAttribute('aria-label', button.textContent.trim());
        }
    });

    // Ensure all interactive elements are focusable
    document.querySelectorAll('a[href], button, input, textarea, select')
        .forEach(el => {
            if (getComputedStyle(el).display !== 'none') {
                el.tabIndex = el.tabIndex || 0;
            }
        });
}