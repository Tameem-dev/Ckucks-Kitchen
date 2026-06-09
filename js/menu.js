document.addEventListener('DOMContentLoaded', () => {
    
    // Navigate to item details page with item data
    function navigateToItemDetails(card) {
        const imgElement = card.querySelector('img');
        const imageSrc = imgElement ? imgElement.src : '';
        
        const itemData = {
            id: card.dataset.itemId,
            name: card.dataset.itemName,
            price: card.dataset.itemPrice,
            image: imageSrc,
            description: card.dataset.itemDescription,
            category: card.dataset.itemCategory || 'Popular'
        };
        
        sessionStorage.setItem('selectedItem', JSON.stringify(itemData));
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
    const dropdownHeaderSpan = dropdownTrigger.querySelector('span');

    // Toggle dropdown on click
    if (dropdownTrigger) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            categoryBox.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!categoryBox.contains(e.target)) {
            categoryBox.classList.remove('active');
        }
    });

    // Category filter function - SHOWS/HIDES SECTIONS
    // Category filter function - SHOWS/HIDES SECTIONS
function filterByCategory(category, categoryName) {
    const allSections = document.querySelectorAll('.menu-section');
    let visibleCount = 0;
    
    allSections.forEach(section => {
        const sectionCategory = section.dataset.sectionCategory;
        
        if (category === 'popular') {
            // Show ONLY the Popular section
            if (sectionCategory === 'popular') {
                section.style.display = 'block';
                const cards = section.querySelectorAll('.food-card');
                visibleCount += cards.length;
            } else {
                section.style.display = 'none';
            }
        } else if (sectionCategory === category) {
            // Show only matching section
            section.style.display = 'block';
            const cards = section.querySelectorAll('.food-card');
            visibleCount += cards.length;
        } else {
            // Hide non-matching sections
            section.style.display = 'none';
        }
    });
    
    // Show SweetAlert notification
    Swal.fire({
        icon: 'success',
        title: `${categoryName || 'Category'} Selected`,
        text: `Showing ${visibleCount} item(s)`,
        confirmButtonColor: '#ff7d29',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
    });
}

    // Handle category selection
    categoryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Update active class
            categoryItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');
            
            // Get the selected category name and value
            const selectedCategoryName = item.textContent;
            const categoryValue = item.dataset.category;
            
            // Update dropdown header text to show selected category
            dropdownHeaderSpan.textContent = selectedCategoryName;
            
            // Close dropdown after selection
            categoryBox.classList.remove('active');
            
            // Filter the food sections
            filterByCategory(categoryValue, selectedCategoryName);
        });
    });

    // ===================================
    // HANDLE SEARCH FROM HOMEPAGE
    // ===================================
    const searchTerm = sessionStorage.getItem('searchTerm');
    if (searchTerm) {
        console.log('Searching for:', searchTerm);
        
        // Show all sections first
        const allSections = document.querySelectorAll('.menu-section');
        allSections.forEach(section => {
            section.style.display = 'block';
        });
        
        const foodCards = document.querySelectorAll('.food-card');
        let foundItems = 0;
        
        foodCards.forEach(card => {
            const itemName = card.dataset.itemName?.toLowerCase() || '';
            const itemDesc = card.dataset.itemDescription?.toLowerCase() || '';
            const searchLower = searchTerm.toLowerCase();
            
            if (itemName.includes(searchLower) || itemDesc.includes(searchLower)) {
                card.style.display = 'block';
                foundItems++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Hide empty sections
        allSections.forEach(section => {
            const visibleCards = section.querySelectorAll('.food-card[style*="display: block"]');
            const allCards = section.querySelectorAll('.food-card');
            
            // If no visible cards found in this section, hide it
            if (visibleCards.length === 0 && allCards.length > 0) {
                section.style.display = 'none';
            }
        });
        
        Swal.fire({
            icon: foundItems > 0 ? 'info' : 'warning',
            title: 'Search Results',
            text: foundItems > 0 ? `Found ${foundItems} item(s) matching "${searchTerm}"` : `No items found matching "${searchTerm}"`,
            confirmButtonColor: '#ff7d29',
            timer: 2000,
            showConfirmButton: false
        });
        
        sessionStorage.removeItem('searchTerm');
    }
    
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
        
        const myOrdersLink = document.querySelector('a[href="cart.html"]');
        if (myOrdersLink) {
            const existingBadge = myOrdersLink.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
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
    
    updateCartCount();
});