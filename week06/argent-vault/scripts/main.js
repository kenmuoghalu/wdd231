// Main JavaScript file with ES Modules
import { loadTopics, loadTips } from './modules/dataService.js';
import { initModal, showModal } from './modules/uiHelper.js';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize responsive navigation
    initNavigation();
    
    // Initialize modal
    initModal();
    
    // Load dynamic content
    loadDynamicContent();
    
    // Handle newsletter form
    initNewsletterForm();
    
    // Initialize tips functionality
    initTips();
    
    // Set active navigation based on current page
    setActiveNav();
    
    // Initialize theme preference
    initTheme();
});

// Responsive Navigation
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const mainNav = document.querySelector('.main-nav');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger to X
            const spans = this.querySelectorAll('span');
            if (mainNav.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.header-container') && 
                mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                hamburger.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// Load Dynamic Content
async function loadDynamicContent() {
    try {
        // Load topics if container exists
        const topicsContainer = document.getElementById('topicsContainer');
        if (topicsContainer) {
            const topics = await loadTopics();
            displayTopics(topics);
        }
        
        // Load tips if container exists
        const tipsContainer = document.getElementById('tipsDisplay');
        if (tipsContainer) {
            const tips = await loadTips();
            displayTips(tips);
        }
    } catch (error) {
        console.error('Error loading content:', error);
        showError('Failed to load content. Please try again later.');
    }
}

// Display Topics using template literals
function displayTopics(topics) {
    const container = document.getElementById('topicsContainer');
    if (!container) return;
    
    container.innerHTML = topics.map(topic => `
        <article class="content-card">
            <img src="images/${topic.icon}" alt="${topic.title}" width="80" height="80">
            <h3>${topic.title}</h3>
            <p>${topic.description}</p>
            <div class="topic-meta">
                <span class="difficulty ${topic.difficulty}">${topic.difficulty}</span>
                <span class="time">${topic.time} min read</span>
            </div>
        </article>
    `).join('');
}

// Display Tips
function displayTips(tips) {
    const container = document.getElementById('tipsDisplay');
    if (!container) return;
    
    container.innerHTML = tips.map(tip => `
        <div class="tip-item">
            <h4>${tip.title}</h4>
            <p>${tip.content}</p>
            <small>Category: ${tip.category}</small>
        </div>
    `).join('');
}

// Newsletter Form Handler
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!validateNewsletterForm(data)) {
            return;
        }
        
        // Save to localStorage
        saveNewsletterSubscription(data);
        
        // Redirect to form action page with data
        const params = new URLSearchParams(data).toString();
        window.location.href = `form-action.html?${params}`;
    });
}

// Form Validation
function validateNewsletterForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!data.interest) {
        errors.push('Please select an interest');
    }
    
    if (errors.length > 0) {
        showError(errors.join('<br>'));
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Save to localStorage
function saveNewsletterSubscription(data) {
    try {
        // Get existing subscriptions
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        
        // Add new subscription
        subscriptions.push({
            ...data,
            date: new Date().toISOString(),
            id: Date.now()
        });
        
        // Save back to localStorage
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        
        // Limit to last 50 subscriptions
        if (subscriptions.length > 50) {
            localStorage.setItem('newsletterSubscriptions', 
                JSON.stringify(subscriptions.slice(-50)));
        }
        
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

// Tips Functionality
function initTips() {
    const tipsBtn = document.getElementById('showTipsBtn');
    if (!tipsBtn) return;
    
    tipsBtn.addEventListener('click', function() {
        const modalContent = document.getElementById('modalTipsContent');
        if (!modalContent) return;
        
        // Load tips for modal
        loadTips().then(tips => {
            modalContent.innerHTML = tips.map(tip => `
                <div class="modal-tip-item">
                    <h4>${tip.title}</h4>
                    <p>${tip.content}</p>
                    <small><strong>Action:</strong> ${tip.action}</small>
                </div>
            `).join('');
            
            // Show modal
            showModal('budgetTipsModal');
        }).catch(error => {
            console.error('Error loading tips:', error);
            modalContent.innerHTML = '<p class="error">Failed to load tips. Please try again.</p>';
        });
    });
}

// Set Active Navigation
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Theme Management
function initTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // Watch for system theme changes
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });
}

// Error Display
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background-color: #f8d7da;
        color: #721c24;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 4px;
        border: 1px solid #f5c6cb;
    `;
    errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
    
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.prepend(errorDiv);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Export for module use
export { initNavigation, validateNewsletterForm, saveNewsletterSubscription };