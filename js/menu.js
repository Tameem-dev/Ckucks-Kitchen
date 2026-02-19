document.addEventListener('DOMContentLoaded', () => {
    
    // Navigate to item details page with item data
    function navigateToItemDetails(card) {
        // Get the image source from the img tag inside the card
        const imgElement = card.querySelector('img');
        const imageSrc = imgElement ? imgElement.src : '';
        
        // Get all item data from data attributes
        const itemData = {
            id: card.dataset.itemId,
            name: card.dataset.itemName,
            price: card.dataset.itemPrice,
            image: imageSrc,
            description: card.dataset.itemDescription,
            category: card.dataset.itemCategory || 'Popular'
        };
        
        // Store item data in sessionStorage for the details page
        sessionStorage.setItem('selectedItem', JSON.stringify(itemData));
        
        // Navigate to item details page
        window.location.href = 'item-details.html';
    }
    
    // Plus icon click handler
    window.quickAddToCart = function(button) {
        event.stopPropagation();
        const card = button.closest('.food-card');
        navigateToItemDetails(card);
    };
    
    // Food card click handler
    const foodCards = document.querySelectorAll('.food-card');
    
    foodCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.closest('.btn-add')) {
                return;
            }
            navigateToItemDetails(this);
        });
    });
    
    // ===================================
    // SIDEBAR DROPDOWN FUNCTIONALITY
    // ===================================
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const categoryBox = document.getElementById('categoryBox');
    const categoryItems = document.querySelectorAll('.category-list li');

    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', () => {
            categoryBox.classList.toggle('active');
        });
    }

    // Get all section elements
    const popularSection = document.getElementById('popular-section');
    const jollofSection = document.getElementById('jollof-section');
    const swallowSection = document.getElementById('swallow-section');
    const grillsSection = document.getElementById('grills-section');
    const beveragesSection = document.getElementById('beverages-section');
    const dessertsSection = document.getElementById('desserts-section');

    // Hide all sections function
    function hideAllSections() {
        popularSection.style.display = 'none';
        jollofSection.style.display = 'none';
        swallowSection.style.display = 'none';
        grillsSection.style.display = 'none';
        beveragesSection.style.display = 'none';
        dessertsSection.style.display = 'none';
    }

    // Show only the selected section
    function showSection(category) {
        hideAllSections();
        
        switch(category) {
            case 'Popular':
                popularSection.style.display = 'block';
                break;
            case 'Jollof Rice & Entrees':
                jollofSection.style.display = 'block';
                break;
            case 'Swallow & Soups':
                swallowSection.style.display = 'block';
                break;
            case 'Grills & Sides':
                grillsSection.style.display = 'block';
                break;
            case 'Beverages':
                beveragesSection.style.display = 'block';
                break;
            case 'Desserts':
                dessertsSection.style.display = 'block';
                break;
            default:
                // If category doesn't match, show all default sections
                popularSection.style.display = 'block';
                jollofSection.style.display = 'block';
                swallowSection.style.display = 'block';
        }
    }

    // Handle category selection
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Update active class
            categoryItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            
            // Update dropdown header text
            dropdownTrigger.querySelector('span').textContent = item.textContent;
            
            // Close dropdown
            categoryBox.classList.remove('active');
            
            // Show the selected category section
            showSection(item.textContent);
        });
    });

    // ===================================
    // HANDLE CATEGORY FROM HOMEPAGE
    // ===================================
    const targetCategory = sessionStorage.getItem('targetCategory');
    if (targetCategory) {
        // Find and click the matching category
        categoryItems.forEach(item => {
            if (item.textContent === targetCategory) {
                // Trigger the click on the category
                setTimeout(() => {
                    item.click();
                }, 100);
            }
        });
        // Clear the stored category
        sessionStorage.removeItem('targetCategory');
    }

    // ===================================
    // HANDLE SEARCH FROM HOMEPAGE
    // ===================================
    const searchTerm = sessionStorage.getItem('searchTerm');
    if (searchTerm) {
        // You can implement search filtering here
        console.log('Searching for:', searchTerm);
        
        // Optional: Show search results notification
        Swal.fire({
            icon: 'info',
            title: 'Search Results',
            text: `Showing results for "${searchTerm}"`,
            confirmButtonColor: '#ff7d29',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Clear the stored search term
        sessionStorage.removeItem('searchTerm');
    }

    // Initialize with Popular selected and default sections visible
    // By default, Popular, Jollof, and Swallow sections are visible
    // Others are hidden
    
    // ===================================
    // SCROLL TO TOP BUTTON
    // ===================================
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===================================
    // LOGIN BUTTON FUNCTIONALITY
    // ===================================
    const currentUser = JSON.parse(localStorage.getItem('chuksKitchenCurrentUser'));
    const loginBtns = [document.getElementById('loginBtn'), document.getElementById('loginBtnMobile')];
    
    loginBtns.forEach(btn => {
        if (btn) {
            btn.textContent = currentUser ? 'Logout' : 'Login';
            
            btn.addEventListener('click', () => {
                if (currentUser) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Logout?',
                        text: 'Are you sure you want to logout?',
                        showCancelButton: true,
                        confirmButtonColor: '#ff7d29',
                        confirmButtonText: 'Yes, logout'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.removeItem('chuksKitchenCurrentUser');
                            window.location.href = 'login.html';
                        }
                    });
                } else {
                    window.location.href = 'login.html';
                }
            });
        }
    });

    // ===================================
    // UPDATE CART COUNT IN NAVIGATION
    // ===================================
    function getCart() {
        const cart = localStorage.getItem('chuksKitchenCart');
        return cart ? JSON.parse(cart) : [];
    }
    
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