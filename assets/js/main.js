/**
 * NexGenAiTech - Main JavaScript
 * SEO Optimized, Performance Focused
 */

// Document Ready with Performance Optimization
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize all components
    initNavigation();
    initContactDropdown();
    initBackToTop();
    initSmoothScroll();
    initAnimations();
    initLazyLoading();
    initServicePageFeatures();
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            console.log('Page loaded in', loadTime, 'ms');
        });
    }
});

// Navigation Initialization
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');
    
    if (!mobileMenuBtn) return;
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Close sidebar
    function closeSidebar() {
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    sidebarClose?.addEventListener('click', closeSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);
    
    // Close on link click
    document.querySelectorAll('.mobile-sidebar a').forEach(link => {
        link.addEventListener('click', closeSidebar);
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Contact Dropdown
function initContactDropdown() {
    const contactToggle = document.getElementById('contactToggle');
    const contactDropdown = document.getElementById('contactDropdownMenu');
    
    if (!contactToggle) return;
    
    contactToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        contactDropdown.classList.toggle('active');
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!contactToggle.contains(e.target) && !contactDropdown.contains(e.target)) {
            contactDropdown.classList.remove('active');
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            contactDropdown.classList.remove('active');
        }
    });
}

// Back to Top Button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Intersection Observer for Animations
function initAnimations() {
    // Only run if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
        return;
    }
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.service-card, .value-card, .industry-card, .timeline-step'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Lazy Loading Implementation
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.classList.add('lazy');
        });
    } else {
        // Fallback to Intersection Observer
        const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
        
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const lazyImage = entry.target;
                        lazyImage.src = lazyImage.dataset.src;
                        lazyImage.classList.remove('lazy');
                        lazyImageObserver.unobserve(lazyImage);
                    }
                });
            });
            
            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        }
    }
}

// Service Page Specific Features
function initServicePageFeatures() {
    // Code Copy Functionality
    document.querySelectorAll('.code-snippet').forEach(snippet => {
        const copyButton = document.createElement('button');
        copyButton.className = 'btn-copy-code';
        copyButton.innerHTML = '<i class="far fa-copy"></i> Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        copyButton.addEventListener('click', function() {
            const code = snippet.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => {
                    copyButton.innerHTML = '<i class="far fa-copy"></i> Copy';
                }, 2000);
            });
        });
        
        snippet.style.position = 'relative';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '10px';
        copyButton.style.right = '10px';
        copyButton.style.fontSize = '0.8rem';
        copyButton.style.padding = '4px 8px';
        
        snippet.appendChild(copyButton);
    });
    
    // Service Filter
    const serviceFilter = document.getElementById('serviceFilter');
    if (serviceFilter) {
        serviceFilter.addEventListener('input', function(e) {
            const filterValue = e.target.value.toLowerCase();
            const serviceCards = document.querySelectorAll('.service-detail-card');
            
            serviceCards.forEach(card => {
                const serviceName = card.querySelector('h2').textContent.toLowerCase();
                const serviceDesc = card.textContent.toLowerCase();
                
                if (serviceName.includes(filterValue) || serviceDesc.includes(filterValue)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Error Tracking
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
});

// Performance Monitoring
if ('performance' in window) {
    // Report page load performance
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfEntries = performance.getEntriesByType('navigation');
            if (perfEntries.length > 0) {
                const navEntry = perfEntries[0];
                console.table({
                    'DNS Lookup': navEntry.domainLookupEnd - navEntry.domainLookupStart,
                    'TCP Connection': navEntry.connectEnd - navEntry.connectStart,
                    'Request Time': navEntry.responseEnd - navEntry.requestStart,
                    'DOM Complete': navEntry.domComplete,
                    'Page Load': navEntry.loadEventEnd - navEntry.loadEventStart
                });
            }
        }, 0);
    });
}

// Service Worker Registration (Progressive Web App)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Network Status Detection
window.addEventListener('online', function() {
    console.log('You are now online');
    // You could show a notification here
});

window.addEventListener('offline', function() {
    console.log('You are now offline');
    // You could show an offline notification here
});
