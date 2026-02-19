document.addEventListener('DOMContentLoaded', function() {
    
    function getCart() {
        const cart = localStorage.getItem('chuksKitchenCart');
        return cart ? JSON.parse(cart) : [];
    }
    
    function saveCart(cart) {
        localStorage.setItem('chuksKitchenCart', JSON.stringify(cart));
    }
    
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const checkoutButtonContainer = document.getElementById('checkoutButtonContainer');
    const cartItemCount = document.getElementById('cartItemCount');
    const proceedToCheckoutBtn = document.getElementById('proceedToCheckoutBtn');
    
    function renderCart() {
        const cart = getCart();
        
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        cartItemCount.textContent = totalItems;
        
        if (cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            emptyCartMessage.style.display = 'block';
            if (checkoutButtonContainer) {
                checkoutButtonContainer.style.display = 'none';
            }
            return;
        } else {
            cartItemsContainer.style.display = 'flex';
            emptyCartMessage.style.display = 'none';
            if (checkoutButtonContainer) {
                checkoutButtonContainer.style.display = 'block';
            }
        }
        
        cartItemsContainer.innerHTML = cart.map((item, index) => {
            const itemTotal = (item.totalPrice || item.price) * (item.quantity || 1);
            
            // Build options text
            let optionsText = '';
            const options = [];
            
            if (item.protein && item.protein !== 'Fried Chicken') {
                options.push(item.protein);
            }
            
            if (item.sides && item.sides.length > 0) {
                const formattedSides = item.sides.map(side => 
                    side.toLowerCase().replace('fried ', '').replace('extra ', '')
                );
                options.push(...formattedSides);
            }
            
            if (options.length > 0) {
                if (options.length === 1) {
                    optionsText = `with ${options[0]}`;
                } else if (options.length === 2) {
                    optionsText = `with ${options[0]} and ${options[1]}`;
                } else {
                    const lastOption = options.pop();
                    optionsText = `with ${options.join(', ')} and ${lastOption}`;
                }
                optionsText = optionsText.charAt(0).toUpperCase() + optionsText.slice(1);
            }
            
            return `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        ${optionsText ? `<div class="cart-item-options">${optionsText}</div>` : ''}
                        <div class="cart-item-price">₦${(item.totalPrice || item.price).toLocaleString()}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">−</button>
                        <span class="quantity-value">${item.quantity || 1}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    </div>
                    <div class="cart-item-total">₦${itemTotal.toLocaleString()}</div>
                    <button class="delete-btn" onclick="removeItem(${index})" title="Remove item">
                        <i class="ph ph-x"></i>
                    </button>
                </div>
            `;
        }).join('');
    }
    
    window.updateQuantity = function(index, change) {
        let cart = getCart();
        
        if (cart[index]) {
            const newQuantity = (cart[index].quantity || 1) + change;
            
            if (newQuantity <= 0) {
                removeItem(index);
                return;
            }
            
            cart[index].quantity = newQuantity;
            saveCart(cart);
            renderCart();
        }
    };
    
    window.removeItem = function(index) {
        Swal.fire({
            title: 'Remove Item?',
            text: 'Are you sure you want to remove this item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, remove it'
        }).then((result) => {
            if (result.isConfirmed) {
                let cart = getCart();
                cart.splice(index, 1);
                saveCart(cart);
                renderCart();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Removed!',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    };
    
    // ===================================
    // PROCEED TO CHECKOUT FUNCTIONALITY
    // ===================================
    
    if (proceedToCheckoutBtn) {
        proceedToCheckoutBtn.addEventListener('click', function() {
            const cart = getCart();
            
            if (cart.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Empty Cart',
                    text: 'Your cart is empty. Add some items first!',
                    confirmButtonColor: '#ff7d29'
                });
                return;
            }
            
            // Check if user is logged in
            const currentUser = localStorage.getItem('chuksKitchenCurrentUser');
            
            if (!currentUser) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please Login',
                    text: 'You need to login to proceed to checkout',
                    confirmButtonColor: '#ff7d29',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Login',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Save current page to redirect back after login
                        sessionStorage.setItem('loginRedirect', 'cart.html');
                        window.location.href = 'login.html';
                    }
                });
                return;
            }
            
            // Navigate to checkout page
            window.location.href = 'checkout.html';
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
                            window.location.reload();
                        }
                    });
                } else {
                    window.location.href = 'login.html';
                }
            });
        }
    });
    
    renderCart();
});

// ===================================
// SCROLL TO TOP BUTTON FUNCTIONALITY
// ===================================

const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Check initial scroll position
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
}