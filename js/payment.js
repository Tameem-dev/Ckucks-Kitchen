document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // LOAD ORDER DATA
    // ===================================
    
    // Get order summary from localStorage
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary'));
    const cart = JSON.parse(localStorage.getItem('chuksKitchenCart')) || [];
    
    // Update pay amount
    const payAmountSpan = document.getElementById('payAmount');
    if (orderSummary && orderSummary.total) {
        payAmountSpan.textContent = orderSummary.total;
    } else if (cart.length > 0) {
        // Calculate total from cart if order summary not found
        const subtotal = cart.reduce((sum, item) => {
            return sum + ((item.totalPrice || item.price) * (item.quantity || 1));
        }, 0);
        const total = subtotal + 500 + 200; // delivery + service fee
        payAmountSpan.textContent = `₦${total.toLocaleString()}`;
    }
    
    // ===================================
    // PAYMENT METHOD TOGGLE
    // ===================================
    
    const cardOption = document.getElementById('cardOption');
    const bankOption = document.getElementById('bankOption');
    const transferOption = document.getElementById('transferOption');
    
    const cardDetails = document.getElementById('cardDetails');
    const bankDetails = document.getElementById('bankDetails');
    const transferDetails = document.getElementById('transferDetails');
    
    // Card number input
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    const saveCard = document.getElementById('saveCard');
    const bankSelect = document.getElementById('bankSelect');
    
    // Toggle payment sections
    function togglePaymentSections(method) {
        cardDetails.style.display = 'none';
        bankDetails.style.display = 'none';
        transferDetails.style.display = 'none';
        
        if (method === 'card') {
            cardDetails.style.display = 'block';
        } else if (method === 'bank') {
            bankDetails.style.display = 'block';
        } else if (method === 'transfer') {
            transferDetails.style.display = 'block';
        }
    }
    
    // Add event listeners to radio buttons
    if (cardOption) {
        cardOption.addEventListener('change', function() {
            if (this.checked) {
                togglePaymentSections('card');
            }
        });
    }
    
    if (bankOption) {
        bankOption.addEventListener('change', function() {
            if (this.checked) {
                togglePaymentSections('bank');
            }
        });
    }
    
    if (transferOption) {
        transferOption.addEventListener('change', function() {
            if (this.checked) {
                togglePaymentSections('transfer');
            }
        });
    }
    
    // ===================================
    // INPUT FORMATTING
    // ===================================
    
    // Format card number with spaces every 4 digits
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = this.value.replace(/\s/g, '');
            if (value.length > 16) {
                value = value.slice(0, 16);
            }
            
            // Add space after every 4 digits
            let formatted = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            
            this.value = formatted;
        });
    }
    
    // Format expiry date (MM/YY)
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = this.value.replace(/\//g, '');
            if (value.length > 4) {
                value = value.slice(0, 4);
            }
            
            if (value.length >= 3) {
                this.value = value.slice(0, 2) + '/' + value.slice(2);
            } else {
                this.value = value;
            }
            
            // Validate month (01-12)
            if (value.length >= 2) {
                const month = parseInt(value.slice(0, 2));
                if (month < 1 || month > 12) {
                    this.style.borderColor = '#ef4444';
                } else {
                    this.style.borderColor = '#e5e7eb';
                }
            }
        });
    }
    
    // Only allow numbers for CVV
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            if (this.value.length > 3) {
                this.value = this.value.slice(0, 3);
            }
        });
    }
    
    // ===================================
    // VALIDATION FUNCTIONS
    // ===================================
    
    function validateCardPayment() {
        const cardNum = cardNumber.value.replace(/\s/g, '');
        const expiry = expiryDate.value;
        const cvvVal = cvv.value;
        
        if (cardNum.length !== 16) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Card',
                text: 'Please enter a valid 16-digit card number',
                confirmButtonColor: '#ff7d29'
            });
            return false;
        }
        
        if (!expiry || expiry.length !== 5) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Expiry',
                text: 'Please enter a valid expiry date (MM/YY)',
                confirmButtonColor: '#ff7d29'
            });
            return false;
        }
        
        if (!cvvVal || cvvVal.length !== 3) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid CVV',
                text: 'Please enter a valid 3-digit CVV',
                confirmButtonColor: '#ff7d29'
            });
            return false;
        }
        
        return true;
    }
    
    function validateBankPayment() {
        if (!bankSelect || !bankSelect.value) {
            Swal.fire({
                icon: 'error',
                title: 'Bank Required',
                text: 'Please select a bank to continue',
                confirmButtonColor: '#ff7d29'
            });
            return false;
        }
        return true;
    }
    
    // ===================================
    // GENERATE ORDER CONFIRMATION
    // ===================================
    
    function generateOrderConfirmation() {
        const orderId = 'CK-' + Date.now().toString().slice(-8) + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const date = new Date();
        const deliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails')) || {};
        
        return {
            orderId: orderId,
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString(),
            items: cart,
            orderSummary: orderSummary,
            deliveryDetails: deliveryDetails,
            paymentMethod: cardOption.checked ? 'Card' : (bankOption.checked ? 'Bank' : 'Transfer'),
            saveCard: saveCard ? saveCard.checked : false,
            status: 'Confirmed',
            totalAmount: payAmountSpan.textContent
        };
    }
    
    // ===================================
    // PAY BUTTON CLICK HANDLER - UPDATED
    // ===================================
    
    const payBtn = document.getElementById('payBtn');
    
    if (payBtn) {
        payBtn.addEventListener('click', function() {
            // Check if user is logged in
            const currentUser = localStorage.getItem('chuksKitchenCurrentUser');
            
            if (!currentUser) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Please Login',
                    text: 'You need to login to complete payment',
                    confirmButtonColor: '#ff7d29',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Login'
                }).then((result) => {
                    if (result.isConfirmed) {
                        sessionStorage.setItem('loginRedirect', 'payment.html');
                        window.location.href = 'login.html';
                    }
                });
                return;
            }
            
            // Check if cart is empty
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
            
            // Validate based on payment method
            let isValid = false;
            let paymentMethod = '';
            
            if (cardOption && cardOption.checked) {
                isValid = validateCardPayment();
                paymentMethod = 'Card';
            } else if (bankOption && bankOption.checked) {
                isValid = validateBankPayment();
                paymentMethod = 'Bank';
            } else if (transferOption && transferOption.checked) {
                isValid = true; // Transfer doesn't need validation
                paymentMethod = 'Transfer';
            }
            
            if (!isValid) return;
            
            // Show processing animation
            const originalText = payBtn.innerHTML;
            payBtn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Processing Payment...';
            payBtn.disabled = true;
            
            // Generate order confirmation
            const orderConfirmation = generateOrderConfirmation();
            localStorage.setItem('lastOrder', JSON.stringify(orderConfirmation));
            
            // Simulate payment processing (3 seconds)
            setTimeout(() => {
                // Clear cart and order data after successful payment
                localStorage.removeItem('chuksKitchenCart');
                localStorage.removeItem('orderSummary');
                localStorage.removeItem('deliveryDetails');
                
                // Redirect to order success page
                window.location.href = 'order-success.html';
            }, 3000);
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