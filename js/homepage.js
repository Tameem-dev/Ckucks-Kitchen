document.addEventListener('DOMContentLoaded', () => {
    
    // ===================================
    // 1. CHECK USER LOGIN STATUS
    // ===================================
    const currentUser = JSON.parse(localStorage.getItem('chuksKitchenCurrentUser'));
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnMobile = document.getElementById('loginBtnMobile');
    const menuToggle = document.getElementById('menu-toggle');

    // Function to handle login or logout clicks
    const handleLoginClick = () => {
        if (currentUser) {
            handleLogout();
        } else {
            window.location.href = 'login.html';
        }
    };

    // Attach listeners to both desktop and mobile login buttons
    if (loginBtn) loginBtn.addEventListener('click', handleLoginClick);
    if (loginBtnMobile) loginBtnMobile.addEventListener('click', handleLoginClick);

    // Show welcome message only on first visit (if logged in)
    if (currentUser) {
        const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            Swal.fire({
                icon: 'success',
                title: `Welcome back! 🎉`,
                text: 'Ready to order some delicious Nigerian food?',
                confirmButtonColor: '#ff7d29',
                confirmButtonText: 'Let\'s Go!',
                timer: 3000,
                timerProgressBar: true
            });
            sessionStorage.setItem('hasSeenWelcome', 'true');
        }
    }

    // ===================================
    // 2. LOGOUT FUNCTION
    // ===================================
    function handleLogout() {
        Swal.fire({
            icon: 'warning',
            title: 'Logout?',
            text: 'Are you sure you want to logout?',
            showCancelButton: true,
            confirmButtonColor: '#ff7d29',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('chuksKitchenCurrentUser');
                sessionStorage.removeItem('hasSeenWelcome');
                
                Swal.fire({
                    icon: 'success',
                    title: 'Logged Out!',
                    text: 'See you soon! 👋',
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    window.location.href = 'login.html';
                });
            }
        });
    }

    // ===================================
    // 3. CART MANAGEMENT FUNCTIONS
    // ===================================
    
    // Get cart from localStorage
    function getCart() {
        const cart = localStorage.getItem('chuksKitchenCart');
        return cart ? JSON.parse(cart) : [];
    }
    
    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('chuksKitchenCart', JSON.stringify(cart));
    }
    
    // Navigate to item details page
    function goToItemDetails(itemData) {
        sessionStorage.setItem('selectedItem', JSON.stringify(itemData));
        window.location.href = 'item-details.html';
    }

    // ===================================
    // 4. ADD TO CART FUNCTIONALITY
    // ===================================
    const addButtons = document.querySelectorAll('.btn-add');

    addButtons.forEach((btn) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const foodCard = this.closest('.food-card');
            const foodName = foodCard.querySelector('h3').textContent;
            const foodPriceText = foodCard.querySelector('.price').textContent;
            const foodDescription = foodCard.querySelector('p').textContent;
            const foodImage = foodCard.querySelector('img').src;
            
            // Extract price (remove ₦ and commas)
            const foodPrice = parseInt(foodPriceText.replace(/[₦,]/g, ''));

            if (!currentUser) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please Login',
                    text: 'You need to login to add items to cart!',
                    confirmButtonColor: '#ff7d29',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Login',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'login.html';
                    }
                });
                return;
            }

            // Create item data for details page
            const itemData = {
                id: 'homepage-' + Date.now(),
                name: foodName,
                price: foodPrice,
                image: foodImage,
                description: foodDescription
            };
            
            // Go to item details page
            goToItemDetails(itemData);
        });
    });

    // ===================================
    // 5. POPULAR CATEGORIES CLICK HANDLER
    // ===================================
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            
            // Map category names to menu sections
            let targetSection = '';
            if (categoryName.includes('Jollof')) {
                targetSection = 'Jollof Rice & Entrees';
            } else if (categoryName.includes('Swallow')) {
                targetSection = 'Swallow & Soups';
            } else if (categoryName.includes('Grills')) {
                targetSection = 'Grills & Sides';
            } else if (categoryName.includes('Sweet Treats')) {
                targetSection = 'Desserts';
            }
            
            // Store the target category in sessionStorage
            sessionStorage.setItem('targetCategory', targetSection);
            
            // Navigate to menu page
            window.location.href = 'menu.html';
        });
    });

    // ===================================
    // 6. SEARCH FUNCTIONALITY
    // ===================================
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    // Store search term for menu page
                    sessionStorage.setItem('searchTerm', searchTerm);
                    window.location.href = 'menu.html';
                }
            }
        });
    }

    // ===================================
    // 7. HERO BUTTONS
    // ===================================
    const heroButtons = document.querySelectorAll('.btn-hero');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'menu.html';
        });
    });

    // ===================================
    // 8. UI HELPERS (Scroll to Top & Navbar)
    // ===================================
    const scrollTopBtn = document.getElementById('scrollTop');
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        // Scroll Top Button Logic
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.opacity = '0';
            setTimeout(() => { if (window.scrollY <= 300) scrollTopBtn.style.display = 'none'; }, 300);
        }

        // Navbar Shadow Logic
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===================================
    // 9. MOBILE MENU AUTO-CLOSE
    // ===================================
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle) menuToggle.checked = false;
        });
    });

    // ===================================
    // 10. UPDATE CART COUNT IN NAVIGATION
    // ===================================
    function updateCartCount() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Add cart badge to My Orders link
        const myOrdersLink = document.querySelector('a[href="cart.html"]');
        if (myOrdersLink) {
            // Remove existing badge
            const existingBadge = myOrdersLink.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Add new badge if there are items
            if (totalItems > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.style.cssText = `
                    background: #ff7d29;
                    color: white;
                    font-size: 0.7rem;
                    padding: 0.2rem 0.5rem;
                    border-radius: 1rem;
                    margin-left: 0.5rem;
                `;
                badge.textContent = totalItems;
                myOrdersLink.appendChild(badge);
            }
        }
    }
    
    // Update cart count on page load
    updateCartCount();
});