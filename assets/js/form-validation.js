/**
 * ProCool AC Services - Form Validation
 * Handles contact form validation and submission
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validation for all forms with 'needs-validation' class
    const forms = document.querySelectorAll('.needs-validation');
    
    // Form submission handler
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopPropagation();
            
            // Validate form
            if (form.checkValidity()) {
                // If valid, process form submission
                submitForm(form);
            } else {
                // If invalid, show validation errors
                form.classList.add('was-validated');
                
                // Scroll to first invalid field
                const invalidField = form.querySelector(':invalid');
                if (invalidField) {
                    invalidField.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    invalidField.focus();
                }
            }
        }, false);
    });

    // Phone number formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        input.addEventListener('keydown', function(e) {
            // Allow: backspace, delete, tab, escape, enter
            if ([46, 8, 9, 27, 13].includes(e.keyCode) || 
                // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                (e.keyCode === 65 && e.ctrlKey === true) || 
                (e.keyCode === 67 && e.ctrlKey === true) || 
                (e.keyCode === 86 && e.ctrlKey === true) || 
                (e.keyCode === 88 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                return;
            }
            
            // Ensure it's a number and stop the keypress if not
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
    });

    // Form submission function
    function submitForm(form) {
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Sending...
        `;
        
        // Simulate form submission (replace with actual AJAX call)
        setTimeout(() => {
            // This would be replaced with actual fetch/AJAX call
            // fetch('your-form-handler.php', {
            //     method: 'POST',
            //     body: formData
            // })
            // .then(response => response.json())
            // .then(data => {
            //     showFormFeedback(form, true, 'Thank you! We will contact you shortly.');
            // })
            // .catch(error => {
            //     showFormFeedback(form, false, 'An error occurred. Please try again later.');
            // });
            
            // For demo purposes - remove this timeout in production
            const isSuccess = Math.random() > 0.2; // 80% success rate for demo
            if (isSuccess) {
                showFormFeedback(form, true, 'Thank you! We will contact you shortly.');
                form.reset();
                form.classList.remove('was-validated');
            } else {
                showFormFeedback(form, false, 'An error occurred. Please try again later.');
            }
            
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }, 1500);
    }

    // Show form feedback message
    function showFormFeedback(form, isSuccess, message) {
        // Remove any existing alerts
        const existingAlert = form.querySelector('.form-feedback');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${isSuccess ? 'alert-success' : 'alert-danger'} form-feedback mt-4`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} me-3"></i>
                <div>${message}</div>
            </div>
        `;
        
        // Insert alert
        const formActions = form.querySelector('.form-actions') || form;
        formActions.parentNode.insertBefore(alertDiv, formActions.nextSibling);
        
        // Scroll to feedback
        setTimeout(() => {
            alertDiv.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }, 5000);
    }

    // Format phone number as (XXX) XXX-XXXX
    function formatPhoneNumber(input) {
        // Remove all non-digit characters
        let phoneNumber = input.value.replace(/\D/g, '');
        
        // Trim to 10 digits
        phoneNumber = phoneNumber.substring(0, 10);
        
        // Format based on length
        if (phoneNumber.length > 6) {
            phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (phoneNumber.length > 3) {
            phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})/, '($1) $2-');
        } else if (phoneNumber.length > 0) {
            phoneNumber = phoneNumber.replace(/(\d{3})/, '($1) ');
        }
        
        // Update input value
        input.value = phoneNumber;
    }

    // Service type change handler
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const emergencyNotice = document.getElementById('emergency-notice');
            if (this.value === 'emergency' && emergencyNotice) {
                emergencyNotice.style.display = 'block';
            } else if (emergencyNotice) {
                emergencyNotice.style.display = 'none';
            }
        });
    }
});
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (this.checkValidity()) {
        // Form is valid, collect data
        const formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        // Send to your backend
        fetch('your-backend-endpoint.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Message sent successfully!');
            this.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error sending your message.');
        });
    } else {
        // Form is invalid, show validation messages
        e.stopPropagation();
        this.classList.add('was-validated');
    }
});
