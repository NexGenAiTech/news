/**
 * Contact Form Handler with Google Apps Script Integration
 */

class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.submitText = document.getElementById('submitText');
        this.submitSpinner = document.getElementById('submitSpinner');
        this.successMessage = document.getElementById('successMessage');
        this.sendAnotherBtn = document.getElementById('sendAnother');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        if (this.sendAnotherBtn) {
            this.sendAnotherBtn.addEventListener('click', this.resetForm.bind(this));
        }
        
        // Pre-fill form from URL parameters
        this.prefillFromURL();
    }
    
    prefillFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Service parameter
        const serviceParam = urlParams.get('service');
        if (serviceParam) {
            const serviceSelect = document.getElementById('service');
            if (serviceSelect) {
                const normalizedParam = serviceParam.toLowerCase().replace(/-/g, ' ');
                const options = Array.from(serviceSelect.options);
                const matchingOption = options.find(option => 
                    option.value.toLowerCase().includes(normalizedParam) ||
                    option.text.toLowerCase().includes(normalizedParam)
                );
                
                if (matchingOption) {
                    serviceSelect.value = matchingOption.value;
                }
            }
        }
        
        // Other parameters
        ['name', 'email', 'phone', 'company'].forEach(field => {
            const value = urlParams.get(field);
            if (value) {
                const input = document.getElementById(field);
                if (input) input.value = decodeURIComponent(value);
            }
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate form
        if (!this.validateForm()) {
            return;
        }
        
        // Disable submit button
        this.setLoadingState(true);
        
        // Prepare form data
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Add metadata
        data.timestamp = new Date().toISOString();
        data.source = 'NexGenAiTech Website';
        data.pageURL = window.location.href;
        data.userAgent = navigator.userAgent;
        data.referrer = document.referrer;
        
        try {
            // Send to Google Apps Script
            await this.sendToGoogleAppsScript(data);
            
            // Show success message
            this.showSuccess();
            
            // Send to email (optional)
            await this.sendEmailNotification(data);
            
            // Track conversion
            this.trackConversion(data);
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showError('Failed to send message. Please try again or contact us directly.');
        } finally {
            this.setLoadingState(false);
        }
    }
    
    validateForm() {
        const requiredFields = this.form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
                
                // Show error message
                const errorSpan = field.nextElementSibling?.classList?.contains('error-message') 
                    ? field.nextElementSibling 
                    : this.createErrorMessage(field);
                errorSpan.textContent = 'This field is required';
            } else {
                field.classList.remove('error');
                
                // Remove error message
                const errorSpan = field.nextElementSibling;
                if (errorSpan?.classList?.contains('error-message')) {
                    errorSpan.remove();
                }
            }
        });
        
        // Validate email format
        const emailField = document.getElementById('email');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                emailField.classList.add('error');
                this.showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        return isValid;
    }
    
    createErrorMessage(field) {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.style.color = 'var(--error-color)';
        errorSpan.style.fontSize = '0.85rem';
        errorSpan.style.marginTop = '4px';
        errorSpan.style.display = 'block';
        field.parentNode.insertBefore(errorSpan, field.nextSibling);
        return errorSpan;
    }
    
    showFieldError(field, message) {
        let errorSpan = field.nextElementSibling?.classList?.contains('error-message') 
            ? field.nextElementSibling 
            : this.createErrorMessage(field);
        errorSpan.textContent = message;
    }
    
    async sendToGoogleAppsScript(data) {
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxb1RwbEM6Z46wm4LypQd1btaQDoxi35DYb9AOHsV_6f3hWRBHIqi7ybEPffRkvshva3w/exec';
        
        const response = await fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Note: no-cors mode doesn't allow reading response
        return response;
    }
    
    async sendEmailNotification(data) {
        // Alternative: Send email via EmailJS or similar service
        const emailData = {
            service_id: 'YOUR_SERVICE_ID',
            template_id: 'YOUR_TEMPLATE_ID',
            user_id: 'YOUR_USER_ID',
            template_params: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                service: data.service,
                message: data.message,
                budget: data.budget,
                timeline: data.timeline,
                company: data.company
            }
        };
        
        try {
            await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });
        } catch (error) {
            console.log('Email notification optional:', error);
            // Don't fail form submission if email fails
        }
    }
    
    trackConversion(data) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                'send_to': 'AW-123456789/AbC-D_efG-h',
                'value': 1.0,
                'currency': 'INR',
                'transaction_id': Date.now().toString()
            });
        }
        
        // Facebook Pixel tracking
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_name: data.service,
                content_category: 'Contact Form'
            });
        }
    }
    
    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitText.style.display = 'none';
            this.submitSpinner.style.display = 'block';
            this.submitBtn.disabled = true;
            this.submitBtn.style.opacity = '0.7';
            this.submitBtn.style.cursor = 'not-allowed';
        } else {
            this.submitText.style.display = 'block';
            this.submitSpinner.style.display = 'none';
            this.submitBtn.disabled = false;
            this.submitBtn.style.opacity = '1';
            this.submitBtn.style.cursor = 'pointer';
        }
    }
    
    showSuccess() {
        // Show success message
        this.successMessage.style.display = 'block';
        this.form.style.display = 'none';
        
        // Scroll to success message
        setTimeout(() => {
            this.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
        
        // Clear form data
        this.form.reset();
        
        // Update URL without form parameters
        history.replaceState({}, document.title, window.location.pathname);
    }
    
    showError(message) {
        // Create error alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'error-alert';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button class="close-alert">&times;</button>
        `;
        
        alertDiv.style.cssText = `
            background: rgba(244, 67, 54, 0.1);
            border: 1px solid var(--error-color);
            color: var(--error-color);
            padding: 12px 16px;
            border-radius: var(--radius-sm);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideDown 0.3s ease;
        `;
        
        const closeBtn = alertDiv.querySelector('.close-alert');
        closeBtn.style.cssText = `
            margin-left: auto;
            background: none;
            border: none;
            color: inherit;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0 4px;
        `;
        
        closeBtn.addEventListener('click', () => alertDiv.remove());
        
        // Insert before form
        this.form.parentNode.insertBefore(alertDiv, this.form);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    resetForm() {
        this.successMessage.style.display = 'none';
        this.form.style.display = 'block';
        this.form.reset();
        
        // Scroll to form
        setTimeout(() => {
            this.form.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
}

// Initialize form handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ContactFormHandler();
});

// Form Analytics
document.addEventListener('formSubmit', function(e) {
    // Custom event for form analytics
    console.log('Form submitted:', e.detail);
});
