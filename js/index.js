// js/index.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("Chuks Kitchen Loaded!");

    // Close mobile menu when a link is clicked
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(menuToggle) menuToggle.checked = false;
        });
    });

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== NEW: Link buttons with Sign In =====
    
    // Check if user is logged in (you can implement actual auth later)
    function isUserLoggedIn() {
        // Check for user session/token in localStorage
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Redirect to login page or show login modal
    function requireLogin(action) {
        if (isUserLoggedIn()) {
            // User is logged in, proceed with action
            if (action === 'order') {
                window.location.href = 'order.html';
            } else if (action === 'learn') {
                window.location.href = 'about.html';
            }
        } else {
            // User is not logged in, redirect to login page
            // Store the intended action to redirect after login
            localStorage.setItem('redirectAfterLogin', action);
            window.location.href = 'login.html';
        }
    }

    // Start Order Button
    const startOrderBtn = document.getElementById('startOrderBtn');
    if (startOrderBtn) {
        startOrderBtn.addEventListener('click', () => {
            requireLogin('order');
        });
    }

    // Learn More Button
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            requireLogin('learn');
        });
    }

    // Sign In Button - Already has href to login.html
    // But we can add functionality to check if already logged in
    const signInBtn = document.getElementById('signInBtn');
    if (signInBtn) {
        signInBtn.addEventListener('click', (e) => {
            if (isUserLoggedIn()) {
                e.preventDefault();
                // If already logged in, redirect to dashboard instead
                window.location.href = 'dashboard.html';
            }
            // Otherwise, let the href="login.html" work normally
        });
    }

    // Optional: Add a function to handle login page redirect after successful login
    // This would be called from your login page after authentication
    window.handleSuccessfulLogin = function() {
        localStorage.setItem('isLoggedIn', 'true');
        const redirectAction = localStorage.getItem('redirectAfterLogin');
        if (redirectAction === 'order') {
            window.location.href = 'order.html';
        } else if (redirectAction === 'learn') {
            window.location.href = 'about.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        localStorage.removeItem('redirectAfterLogin');
    };

    // Optional: Logout function
    window.handleLogout = function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('redirectAfterLogin');
        window.location.href = 'index.html';
    };
});