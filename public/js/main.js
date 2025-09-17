// Modern Blog JavaScript - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initForms();
    initAnimations();
    initTooltips();
    initModals();
    
    console.log('Modern Blog initialized successfully!');
});

// Navbar functionality
function initNavbar() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Enhanced form functionality
function initForms() {
    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        autoResize(textarea);
        textarea.addEventListener('input', function() {
            autoResize(this);
        });
    });
    
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
    
    // Character counters
    const inputs = document.querySelectorAll('input[maxlength], textarea[maxlength]');
    inputs.forEach(input => {
        addCharacterCounter(input);
    });
    
    // Tag input functionality
    const tagInputs = document.querySelectorAll('input[name=\"tags\"]');
    tagInputs.forEach(input => {
        initTagInput(input);
    });
}

// Auto-resize textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(textarea.scrollHeight, 100) + 'px';
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const emailFields = form.querySelectorAll('input[type=\"email\"]');
    emailFields.forEach(field => {
        if (field.value && !isValidEmail(field.value)) {
            showFieldError(field, 'Please enter a valid email address');
            isValid = false;
        }
    });
    
    // Password validation
    const passwordFields = form.querySelectorAll('input[type=\"password\"]');
    passwordFields.forEach(field => {
        if (field.value && field.value.length < 6) {
            showFieldError(field, 'Password must be at least 6 characters long');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error-color)';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = 'var(--spacing-xs)';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = 'var(--error-color)';
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Character counter
function addCharacterCounter(input) {
    const maxLength = parseInt(input.getAttribute('maxlength'));
    if (!maxLength) return;
    
    const counter = document.createElement('small');
    counter.className = 'character-counter';
    counter.style.display = 'block';
    counter.style.textAlign = 'right';
    counter.style.marginTop = 'var(--spacing-xs)';
    counter.style.color = 'var(--gray-500)';
    counter.style.fontSize = '0.875rem';
    
    function updateCounter() {
        const remaining = maxLength - input.value.length;
        counter.textContent = `${remaining} characters remaining`;
        counter.style.color = remaining < 20 ? 'var(--error-color)' : 'var(--gray-500)';
    }
    
    input.addEventListener('input', updateCounter);
    input.parentNode.appendChild(counter);
    updateCounter();
}

// Tag input functionality
function initTagInput(input) {
    input.addEventListener('input', function() {
        const value = this.value;
        if (value.includes(',')) {
            const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
            this.value = tags.join(', ');
        }
    });
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = this.value.trim();
            if (value && !value.endsWith(',')) {
                this.value = value + ', ';
            }
        }
    });
}

// Animation initialization
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.article-card, .my-article-card, .form-container');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^=\"#\"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
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

// Tooltip functionality
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--gray-900);
        color: white;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius);
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--transition-fast);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
    tooltip.style.top = (rect.top - tooltipRect.height - 5) + 'px';
    
    requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
    });
    
    e.target._tooltip = tooltip;
}

function hideTooltip(e) {
    const tooltip = e.target._tooltip;
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 150);
        delete e.target._tooltip;
    }
}

// Modal functionality
function initModals() {
    // Delete confirmation modals
    const deleteButtons = document.querySelectorAll('.btn-danger[onclick*=\"confirm\"]');
    deleteButtons.forEach(button => {
        button.onclick = null; // Remove inline onclick
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showDeleteModal(this);
        });
    });
}

function showDeleteModal(button) {
    const form = button.closest('form');
    const itemType = button.textContent.includes('Article') ? 'article' : 'item';
    
    const modal = createModal({
        title: `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`,
        message: `Are you sure you want to delete this ${itemType}? This action cannot be undone.`,
        confirmText: 'Delete',
        confirmClass: 'btn-danger',
        onConfirm: () => {
            if (form) {
                form.submit();
            }
        }
    });
    
    document.body.appendChild(modal);
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
    });
}

function createModal({ title, message, confirmText = 'OK', cancelText = 'Cancel', confirmClass = 'btn-primary', onConfirm, onCancel }) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        opacity: 0;
        transition: opacity var(--transition-normal);
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-xl);
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: var(--shadow-xl);
    `;
    
    modalContent.innerHTML = `
        <h3 style=\"margin-bottom: var(--spacing-md); color: var(--gray-900);\">${title}</h3>
        <p style=\"margin-bottom: var(--spacing-xl); color: var(--gray-700);\">${message}</p>
        <div style=\"display: flex; gap: var(--spacing-md); justify-content: center;\">
            <button class=\"btn btn-secondary modal-cancel\">${cancelText}</button>
            <button class=\"btn ${confirmClass} modal-confirm\">${confirmText}</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    
    // Event listeners
    const cancelBtn = modalContent.querySelector('.modal-cancel');
    const confirmBtn = modalContent.querySelector('.modal-confirm');
    
    function closeModal() {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
    
    cancelBtn.addEventListener('click', () => {
        closeModal();
        if (onCancel) onCancel();
    });
    
    confirmBtn.addEventListener('click', () => {
        closeModal();
        if (onConfirm) onConfirm();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    return modal;
}

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Search functionality with debouncing
function initSearch() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        const debouncedSearch = debounce(() => {
            // Auto-submit search form after user stops typing
            const form = input.closest('form');
            if (form) {
                form.submit();
            }
        }, 500);
        
        input.addEventListener('input', debouncedSearch);
    });
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initSearch);

// Loading states for forms
function initLoadingStates() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitBtn = this.querySelector('button[type=\"submit\"]');
            if (submitBtn) {
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i> Loading...';
                submitBtn.disabled = true;
                
                // Reset after 10 seconds (in case form submission fails)
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 10000);
            }
        });
    });
}

// Initialize loading states
document.addEventListener('DOMContentLoaded', initLoadingStates);

// Article reading progress indicator
function initReadingProgress() {
    const articleContent = document.querySelector('.article-body');
    if (!articleContent) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 80px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
        z-index: 1000;
        transition: width 0.3s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    const updateProgress = throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    }, 100);
    
    window.addEventListener('scroll', updateProgress);
}

// Initialize reading progress
document.addEventListener('DOMContentLoaded', initReadingProgress);

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        return new Promise((resolve, reject) => {
            if (document.execCommand('copy')) {
                resolve();
            } else {
                reject();
            }
            document.body.removeChild(textArea);
        });
    }
}

// Global functions for inline event handlers
window.shareOnTwitter = function() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
};

window.shareOnFacebook = function() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
};

window.shareOnLinkedIn = function() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
};

window.copyToClipboard = function() {
    copyToClipboard(window.location.href)
        .then(() => {
            // Show success message
            const message = document.createElement('div');
            message.className = 'copy-success';
            message.textContent = 'Link copied to clipboard!';
            message.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--success-color);
                color: white;
                padding: var(--spacing-sm) var(--spacing-md);
                border-radius: var(--border-radius);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
            `;
            
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    if (message.parentNode) {
                        message.parentNode.removeChild(message);
                    }
                }, 300);
            }, 2000);
        })
        .catch(() => {
            alert('Failed to copy link to clipboard');
        });
};