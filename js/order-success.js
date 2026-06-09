document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // GET ORDER DATA FROM LOCALSTORAGE
    // ===================================
    
    // Get the last order from localStorage
    const lastOrder = JSON.parse(localStorage.getItem('lastOrder'));
    const orderNumberElement = document.getElementById('orderNumber');
    
    if (lastOrder && lastOrder.orderId) {
        orderNumberElement.textContent = lastOrder.orderId;
    } else {
        // Generate a random order number if none exists
        const randomOrder = 'CK-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        orderNumberElement.textContent = randomOrder;
    }
    
    // ===================================
    // TRACK ORDER BUTTON
    // ===================================
    
    const trackOrderBtn = document.getElementById('trackOrderBtn');
    
    if (trackOrderBtn) {
        trackOrderBtn.addEventListener('click', function() {
            // Show loading animation
            this.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                Swal.fire({
                    icon: 'info',
                    title: 'Order Tracking',
                    html: `
                        <div style="text-align: left;">
                            <p><strong>Order #${orderNumberElement.textContent}</strong></p>
                            <p>Status: <span style="color: #10b981; font-weight: 600;">Out for Delivery</span></p>
                            <p>Estimated delivery: 30-45 minutes</p>
                            <p style="margin-top: 10px;">Your rider is on the way!</p>
                        </div>
                    `,
                    confirmButtonColor: '#ff7d29'
                });
                
                this.innerHTML = '<i class="ph ph-map-trifold"></i> Track Order';
                this.disabled = false;
            }, 1500);
        });
    }
    
    // ===================================
    // GENERATE RECEIPT BUTTON
    // ===================================
    
    const generateReceiptBtn = document.getElementById('generateReceiptBtn');
    
    if (generateReceiptBtn) {
        generateReceiptBtn.addEventListener('click', function() {
            // Show loading animation
            this.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Generating...';
            this.disabled = true;
            
            setTimeout(() => {
                // Get order details
                const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || {};
                const deliveryDetails = JSON.parse(localStorage.getItem('deliveryDetails')) || {};
                const cart = JSON.parse(localStorage.getItem('chuksKitchenCart')) || [];
                
                // Calculate totals
                const subtotal = cart.reduce((sum, item) => {
                    return sum + ((item.totalPrice || item.price) * (item.quantity || 1));
                }, 0);
                
                // Create receipt HTML
                const receiptHTML = `
                    <div style="text-align: left; max-height: 400px; overflow-y: auto; padding: 10px;">
                        <h3 style="color: #ff7d29; margin-bottom: 15px;">Chuks Kitchen</h3>
                        <p><strong>Order #${orderNumberElement.textContent}</strong></p>
                        <p>Date: ${new Date().toLocaleDateString()}</p>
                        
                        <hr style="margin: 15px 0;">
                        
                        <h4 style="margin-bottom: 10px;">Items:</h4>
                        ${cart.map(item => `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span>${item.quantity || 1}x ${item.name}</span>
                                <span>₦${((item.totalPrice || item.price) * (item.quantity || 1)).toLocaleString()}</span>
                            </div>
                        `).join('')}
                        
                        <hr style="margin: 15px 0;">
                        
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Subtotal:</span>
                            <span>₦${subtotal.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Delivery:</span>
                            <span>${orderSummary.deliveryFee || '₦500'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Service Fee:</span>
                            <span>${orderSummary.serviceFee || '₦200'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-top: 10px; color: #ff7d29;">
                            <span>Total:</span>
                            <span>${orderSummary.total || '₦9,900'}</span>
                        </div>
                        
                        <hr style="margin: 15px 0;">
                        
                        <h4 style="margin-bottom: 10px;">Delivery Details:</h4>
                        <p>${deliveryDetails.address ? deliveryDetails.address.formatted : '123 Main Street, Victoria Island, Lagos'}</p>
                        <p>${deliveryDetails.deliveryMethod || 'Delivery'}: ${deliveryDetails.deliveryTime || '30-45 minutes'}</p>
                    </div>
                `;
                
                Swal.fire({
                    title: 'Order Receipt',
                    html: receiptHTML,
                    icon: 'info',
                    confirmButtonColor: '#ff7d29',
                    confirmButtonText: 'Download Receipt',
                    showCancelButton: true,
                    cancelButtonText: 'Close'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Receipt Generated!',
                            text: 'Your receipt has been downloaded.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        
                        // In a real app, you would trigger a PDF download here
                        console.log('Receipt downloaded');
                    }
                });
                
                this.innerHTML = '<i class="ph ph-file-text"></i> Generate Receipt';
                this.disabled = false;
            }, 1500);
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