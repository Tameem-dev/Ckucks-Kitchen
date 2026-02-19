document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // DELIVERY TIME OPTIONS
    // ===================================
    
    const asapOption = document.getElementById('asapOption');
    const scheduleOption = document.getElementById('scheduleOption');
    const scheduledTimePicker = document.getElementById('scheduledTimePicker');
    const deliveryDate = document.getElementById('deliveryDate');
    const deliveryTime = document.getElementById('deliveryTime');
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    if (deliveryDate) {
        deliveryDate.min = today;
        deliveryDate.value = today;
    }
    
    // Set default time
    if (deliveryTime) {
        deliveryTime.value = '12:00';
    }
    
    // Handle ASAP option click
    asapOption.addEventListener('click', function() {
        asapOption.classList.add('active');
        scheduleOption.classList.remove('active');
        scheduledTimePicker.style.display = 'none';
    });
    
    // Handle Schedule option click
    scheduleOption.addEventListener('click', function() {
        scheduleOption.classList.add('active');
        asapOption.classList.remove('active');
        scheduledTimePicker.style.display = 'flex';
    });
    
    // ===================================
    // DELIVERY INSTRUCTIONS CHARACTER COUNT
    // ===================================
    
    const instructionsTextarea = document.getElementById('deliveryInstructions');
    const instructionCount = document.getElementById('instructionCount');
    
    if (instructionsTextarea) {
        instructionsTextarea.addEventListener('input', function() {
            const count = this.value.length;
            instructionCount.textContent = `${count}/200`;
            
            if (count > 180) {
                instructionCount.style.color = '#f59e0b';
            } else {
                instructionCount.style.color = '#6b7280';
            }
            
            if (count >= 200) {
                instructionCount.style.color = '#ef4444';
                this.value = this.value.slice(0, 200);
            }
        });
    }
    
    // ===================================
    // CHANGE ADDRESS MODAL
    // ===================================
    
    const changeAddressBtn = document.getElementById('changeAddressBtn');
    
    changeAddressBtn.addEventListener('click', function() {
        Swal.fire({
            title: 'Change Delivery Address',
            html: `
                <div style="text-align: left;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Street Address</label>
                        <input id="swal-street" class="swal2-input" value="123 Main Street" placeholder="Street address">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">City/Area</label>
                        <input id="swal-city" class="swal2-input" value="Victoria Island" placeholder="City/Area">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Apartment/Suite (Optional)</label>
                        <input id="swal-apartment" class="swal2-input" value="Apt 4B, Opposite Mega Plaza" placeholder="Apartment/Suite">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">State</label>
                        <input id="swal-state" class="swal2-input" value="Lagos" placeholder="State">
                    </div>
                </div>
            `,
            confirmButtonText: 'Save Address',
            confirmButtonColor: '#ff7d29',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const street = document.getElementById('swal-street').value;
                const city = document.getElementById('swal-city').value;
                const apartment = document.getElementById('swal-apartment').value;
                const state = document.getElementById('swal-state').value;
                
                if (!street || !city || !state) {
                    Swal.showValidationMessage('Please fill in all required fields');
                    return false;
                }
                
                return { street, city, apartment, state };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { street, city, apartment, state } = result.value;
                
                // Update address display
                const addressLines = document.querySelectorAll('.address-line');
                addressLines[0].innerHTML = `<strong>Home:</strong> ${street}, ${city}, ${state}`;
                addressLines[1].textContent = apartment || 'No apartment specified';
                
                Swal.fire({
                    icon: 'success',
                    title: 'Address Updated',
                    text: 'Your delivery address has been updated',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });
    
    // ===================================
    // CHANGE CONTACT MODAL
    // ===================================
    
    const changeContactBtn = document.getElementById('changeContactBtn');
    
    changeContactBtn.addEventListener('click', function() {
        Swal.fire({
            title: 'Change Contact Number',
            html: `
                <div style="text-align: left;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Phone Number</label>
                        <input id="swal-phone" class="swal2-input" value="+234 801 234 5678" placeholder="Phone number">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 500;">Alternative Phone (Optional)</label>
                        <input id="swal-alt-phone" class="swal2-input" placeholder="Alternative number">
                    </div>
                </div>
            `,
            confirmButtonText: 'Save Number',
            confirmButtonColor: '#ff7d29',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const phone = document.getElementById('swal-phone').value;
                
                if (!phone) {
                    Swal.showValidationMessage('Please enter a phone number');
                    return false;
                }
                
                return { phone };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { phone } = result.value;
                
                // Update contact display
                const contactPhone = document.querySelector('.contact-phone');
                contactPhone.innerHTML = `<i class="ph ph-phone"></i> ${phone}`;
                
                Swal.fire({
                    icon: 'success',
                    title: 'Contact Updated',
                    text: 'Your contact number has been updated',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });
    });
    
    // ===================================
    // SAVE & CONTINUE BUTTON
    // ===================================
    
    const saveBtn = document.getElementById('saveBtn');
    
    saveBtn.addEventListener('click', function() {
        // Check if user is logged in
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
                    sessionStorage.setItem('loginRedirect', 'delivery.html');
                    window.location.href = 'login.html';
                }
            });
            return;
        }
        
        // Get all delivery details
        const addressLine1 = document.querySelector('.address-line').innerHTML.replace('<strong>Home:</strong>', '').trim();
        const addressLine2 = document.querySelectorAll('.address-line')[1].textContent;
        const deliveryMethod = asapOption.classList.contains('active') ? 'ASAP' : 'Scheduled';
        const deliveryInstructions = instructionsTextarea.value;
        const contactPhone = document.querySelector('.contact-phone').textContent.trim();
        
        let deliveryTimeText = '30-45 minutes';
        if (scheduleOption.classList.contains('active') && deliveryDate && deliveryTime) {
            deliveryTimeText = `${deliveryDate.value} at ${deliveryTime.value}`;
        }
        
        // Save delivery details to localStorage
        const deliveryDetails = {
            address: {
                full: addressLine1,
                apartment: addressLine2 !== 'No apartment specified' ? addressLine2 : '',
                formatted: `${addressLine1}, ${addressLine2}`
            },
            deliveryMethod: deliveryMethod,
            deliveryTime: deliveryTimeText,
            instructions: deliveryInstructions,
            contact: contactPhone
        };
        
        localStorage.setItem('deliveryDetails', JSON.stringify(deliveryDetails));
        
        // Show success and redirect
        Swal.fire({
            icon: 'success',
            title: 'Delivery Details Saved!',
            text: 'Proceeding to payment...',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            // Redirect to payment page (you can change this to your next page)
            window.location.href = 'payment.html';
        });
    });
    
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