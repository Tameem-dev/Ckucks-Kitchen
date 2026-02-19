document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // GET CART DATA
    // ===================================
    
    function getCart() {
        const cart = localStorage.getItem('chuksKitchenCart');
        return cart ? JSON.parse(cart) : [];
    }
    
    // ===================================
    // UPDATE PRICES FROM CART
    // ===================================
    
    // Store original prices for reset
    let originalSubtotal = 0;
    let originalDeliveryFee = 500;
    const serviceFee = 200;
    const tax = 0;
    
    function updatePrices() {
        const cart = getCart();
        
        // Calculate subtotal from cart
        originalSubtotal = cart.reduce((sum, item) => {
            return sum + ((item.totalPrice || item.price) * (item.quantity || 1));
        }, 0);
        
        // Get current delivery fee (might be changed by promo)
        const deliveryFeeText = document.getElementById('deliveryFee').textContent;
        const currentDeliveryFee = parseInt(deliveryFeeText.replace(/[₦,]/g, '')) || originalDeliveryFee;
        
        const total = originalSubtotal + currentDeliveryFee + serviceFee + tax;
        
        // Update display
        document.getElementById('subtotal').textContent = `₦${originalSubtotal.toLocaleString()}`;
        document.getElementById('deliveryFee').textContent = `₦${currentDeliveryFee.toLocaleString()}`;
        document.getElementById('serviceFee').textContent = `₦${serviceFee.toLocaleString()}`;
        document.getElementById('tax').textContent = `₦${tax}`;
        document.getElementById('totalAmount').textContent = `₦${total.toLocaleString()}`;
        
        return { subtotal: originalSubtotal, deliveryFee: currentDeliveryFee, serviceFee, tax, total };
    }
    
    // ===================================
    // GENERATE ORDER ID
    // ===================================
    
    function generateOrderId() {
        const date = new Date();
        const random = Math.floor(Math.random() * 1000);
        return `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}-${random}`;
    }
    
    // ===================================
    // PROMO CODE FUNCTIONALITY
    // ===================================
    
    const promoInput = document.getElementById('promoCode');
    const applyPromoBtn = document.getElementById('applyPromo');
    
    // Valid promo codes with their effects
    const validPromos = {
        'WELCOME10': { type: 'percentage', value: 0.10, message: '10% discount applied!' },
        'FIRSTORDER': { type: 'percentage', value: 0.15, message: '15% discount applied!' },
        'SAVE20': { type: 'percentage', value: 0.20, message: '20% discount applied!' },
        'FREEDELIVERY': { type: 'delivery', value: 'free', message: 'Free delivery applied!' },
        'FLAT500': { type: 'flat', value: 500, message: '₦500 flat discount applied!' }
    };
    
    let appliedPromo = null;
    let discountedSubtotal = 0;
    
    // Function to calculate and update totals
    function updateTotals() {
        const deliveryFeeElem = document.getElementById('deliveryFee');
        const subtotalElem = document.getElementById('subtotal');
        const totalElem = document.getElementById('totalAmount');
        
        let currentSubtotal = originalSubtotal;
        let currentDeliveryFee = originalDeliveryFee;
        
        // Apply promo if exists
        if (appliedPromo) {
            const promo = validPromos[appliedPromo];
            
            if (promo.type === 'percentage') {
                // Percentage discount on subtotal
                discountedSubtotal = originalSubtotal * (1 - promo.value);
                currentSubtotal = discountedSubtotal;
            } else if (promo.type === 'flat') {
                // Flat discount on subtotal
                discountedSubtotal = Math.max(0, originalSubtotal - promo.value);
                currentSubtotal = discountedSubtotal;
            } else if (promo.type === 'delivery') {
                // Free delivery
                currentDeliveryFee = 0;
            }
        }
        
        // Calculate total
        const total = currentSubtotal + currentDeliveryFee + serviceFee + tax;
        
        // Update displays
        subtotalElem.textContent = `₦${currentSubtotal.toLocaleString()}`;
        deliveryFeeElem.textContent = `₦${currentDeliveryFee.toLocaleString()}`;
        totalElem.textContent = `₦${total.toLocaleString()}`;
    }
    
    // Reset to original prices
    function resetPrices() {
        appliedPromo = null;
        discountedSubtotal = 0;
        document.getElementById('subtotal').textContent = `₦${originalSubtotal.toLocaleString()}`;
        document.getElementById('deliveryFee').textContent = `₦${originalDeliveryFee.toLocaleString()}`;
        
        const total = originalSubtotal + originalDeliveryFee + serviceFee + tax;
        document.getElementById('totalAmount').textContent = `₦${total.toLocaleString()}`;
        
        // Re-enable promo input
        promoInput.disabled = false;
        applyPromoBtn.disabled = false;
        applyPromoBtn.textContent = 'Apply';
        applyPromoBtn.style.background = 'var(--primary-orange)';
    }
    
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', function() {
            const promoCode = promoInput.value.trim().toUpperCase();
            
            if (!promoCode) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Empty Code',
                    text: 'Please enter a promo code',
                    confirmButtonColor: '#ff7d29'
                });
                return;
            }
            
            // Check if promo code is valid
            if (validPromos[promoCode]) {
                // If there's already an applied promo, ask if they want to replace it
                if (appliedPromo) {
                    Swal.fire({
                        icon: 'question',
                        title: 'Replace Promo?',
                        text: `You already have ${appliedPromo} applied. Do you want to replace it?`,
                        showCancelButton: true,
                        confirmButtonColor: '#ff7d29',
                        confirmButtonText: 'Yes, replace',
                        cancelButtonText: 'No'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            appliedPromo = promoCode;
                            updateTotals();
                            
                            Swal.fire({
                                icon: 'success',
                                title: 'Promo Applied!',
                                text: validPromos[promoCode].message,
                                confirmButtonColor: '#ff7d29'
                            });
                        }
                    });
                } else {
                    appliedPromo = promoCode;
                    updateTotals();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Promo Applied!',
                        text: validPromos[promoCode].message,
                        confirmButtonColor: '#ff7d29'
                    });
                    
                    // Disable input after successful apply
                    promoInput.disabled = true;
                    applyPromoBtn.disabled = true;
                    applyPromoBtn.textContent = 'Applied ✓';
                    applyPromoBtn.style.background = '#10b981';
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Code',
                    text: 'The promo code you entered is invalid',
                    confirmButtonColor: '#ff7d29'
                });
            }
        });
    }
    
    // ===================================
    // DELIVERY OPTIONS
    // ===================================
    
    const deliveryBtn = document.getElementById('deliveryBtn');
    const pickupBtn = document.getElementById('pickupBtn');
    
    if (deliveryBtn && pickupBtn) {
        deliveryBtn.addEventListener('click', function() {
            deliveryBtn.classList.add('active');
            pickupBtn.classList.remove('active');
            
            // Reset delivery fee to original if no free delivery promo
            if (!appliedPromo || appliedPromo !== 'FREEDELIVERY') {
                originalDeliveryFee = 500;
                updateTotals();
            } else {
                // Keep delivery fee at 0
                updateTotals();
            }
        });
        
        pickupBtn.addEventListener('click', function() {
            pickupBtn.classList.add('active');
            deliveryBtn.classList.remove('active');
            
            // Remove delivery fee for pickup
            originalDeliveryFee = 0;
            updateTotals();
        });
    }
    
    // ===================================
    // SPECIAL INSTRUCTIONS
    // ===================================
    
    const instructionsTextarea = document.getElementById('specialInstructions');
    
    if (instructionsTextarea) {
        // Character counter
        const counterDiv = document.createElement('div');
        counterDiv.className = 'character-counter';
        counterDiv.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: #9ca3af;
            margin-top: 0.25rem;
        `;
        instructionsTextarea.parentNode.appendChild(counterDiv);
        
        function updateCharacterCount() {
            const count = instructionsTextarea.value.length;
            counterDiv.textContent = `${count}/200 characters`;
            
            if (count > 180) {
                counterDiv.style.color = '#f59e0b';
            } else {
                counterDiv.style.color = '#9ca3af';
            }
            
            if (count >= 200) {
                counterDiv.style.color = '#ef4444';
            }
        }
        
        instructionsTextarea.addEventListener('input', function() {
            if (this.value.length > 200) {
                this.value = this.value.slice(0, 200);
            }
            updateCharacterCount();
        });
        
        updateCharacterCount();
    }
    
    // ===================================
    // SAVE ORDER SUMMARY TO LOCALSTORAGE
    // ===================================
    
    function saveOrderSummary() {
        const orderSummary = {
            subtotal: document.getElementById('subtotal').textContent,
            originalSubtotal: `₦${originalSubtotal.toLocaleString()}`,
            deliveryFee: document.getElementById('deliveryFee').textContent,
            serviceFee: document.getElementById('serviceFee').textContent,
            tax: document.getElementById('tax').textContent,
            total: document.getElementById('totalAmount').textContent,
            deliveryOption: deliveryBtn && deliveryBtn.classList.contains('active') ? 'Delivery' : 'Pickup',
            instructions: instructionsTextarea ? instructionsTextarea.value : '',
            promoCode: promoInput ? promoInput.value : '',
            appliedPromo: appliedPromo,
            discount: appliedPromo ? validPromos[appliedPromo].message : null
        };
        
        localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
        return orderSummary;
    }
    
    // ===================================
    // PROCEED TO DELIVERY PAGE
    // ===================================
    
    const proceedBtn = document.getElementById('proceedBtn');
    
    if (proceedBtn) {
        proceedBtn.addEventListener('click', function() {
            const cart = getCart();
            
            if (cart.length === 0) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Empty Cart',
                    text: 'Your cart is empty. Add some items first!',
                    confirmButtonColor: '#ff7d29'
                }).then(() => {
                    window.location.href = 'menu.html';
                });
                return;
            }
            
            const currentUser = localStorage.getItem('chuksKitchenCurrentUser');
            
            if (!currentUser) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please Login',
                    text: 'You need to login to continue',
                    confirmButtonColor: '#ff7d29',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Login'
                }).then((result) => {
                    if (result.isConfirmed) {
                        sessionStorage.setItem('loginRedirect', 'checkout.html');
                        window.location.href = 'login.html';
                    }
                });
                return;
            }
            
            // Save order summary before proceeding
            saveOrderSummary();
            
            // Navigate to delivery details page
            window.location.href = 'delivery.html';
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
    
    // ===================================
    // SCROLL TO TOP BUTTON FUNCTIONALITY
    // ===================================
    
    const scrollTopBtn = document.getElementById('scrollTop');
    
    if (scrollTopBtn) {
        // Fix the scroll button position
        scrollTopBtn.style.position = 'fixed';
        scrollTopBtn.style.bottom = '30px';
        scrollTopBtn.style.right = '30px';
        scrollTopBtn.style.display = 'none';
        
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
        }
    }
    
    // ===================================
    // INITIALIZE
    // ===================================
    
    // Update prices from cart
    updatePrices();
    
    // Fix scroll button in CSS
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top {
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            z-index: 9999 !important;
        }
    `;
    document.head.appendChild(style);
});