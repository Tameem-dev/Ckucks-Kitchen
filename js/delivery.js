document.addEventListener('DOMContentLoaded', function() {

    // ===================================
    // READ ORDER OPTION FROM CHECKOUT
    // ===================================
    const orderSummary = JSON.parse(localStorage.getItem('orderSummary')) || {};
    const isPickup = orderSummary.deliveryOption === 'Pickup';

    const deliveryMode = document.getElementById('deliveryMode');
    const pickupMode   = document.getElementById('pickupMode');
    const pageTitle    = document.getElementById('pageTitle');

    if (isPickup) {
        // Show pickup view, hide delivery view
        deliveryMode.style.display = 'none';
        pickupMode.style.display   = 'block';
        pageTitle.textContent = 'Pickup Details';
    } else {
        // Show delivery view (default)
        deliveryMode.style.display = 'block';
        pickupMode.style.display   = 'none';
        pageTitle.textContent = 'Delivery Details';
    }

    // ===================================
    // DELIVERY TIME OPTIONS
    // ===================================
    const asapOption          = document.getElementById('asapOption');
    const scheduleOption      = document.getElementById('scheduleOption');
    const scheduledTimePicker = document.getElementById('scheduledTimePicker');
    const deliveryDate        = document.getElementById('deliveryDate');
    const deliveryTime        = document.getElementById('deliveryTime');

    const today = new Date().toISOString().split('T')[0];
    if (deliveryDate) {
        deliveryDate.min   = today;
        deliveryDate.value = today;
    }
    if (deliveryTime) {
        deliveryTime.value = '12:00';
    }

    if (asapOption) {
        asapOption.addEventListener('click', function() {
            asapOption.classList.add('active');
            scheduleOption.classList.remove('active');
            scheduledTimePicker.style.display = 'none';
        });
    }

    if (scheduleOption) {
        scheduleOption.addEventListener('click', function() {
            scheduleOption.classList.add('active');
            asapOption.classList.remove('active');
            scheduledTimePicker.style.display = 'flex';
        });
    }

    // ===================================
    // DELIVERY INSTRUCTIONS CHARACTER COUNT
    // ===================================
    const instructionsTextarea = document.getElementById('deliveryInstructions');
    const instructionCount     = document.getElementById('instructionCount');

    if (instructionsTextarea) {
        instructionsTextarea.addEventListener('input', function() {
            const count = this.value.length;
            if (count >= 200) this.value = this.value.slice(0, 200);
            instructionCount.textContent = `${Math.min(count, 200)}/200`;
            instructionCount.style.color =
                count >= 200 ? '#ef4444' : count > 180 ? '#f59e0b' : '#6b7280';
        });
    }

    // ===================================
    // CHANGE ADDRESS MODAL (Delivery only)
    // ===================================
    const changeAddressBtn = document.getElementById('changeAddressBtn');

    if (changeAddressBtn) {
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
                    const street    = document.getElementById('swal-street').value;
                    const city      = document.getElementById('swal-city').value;
                    const apartment = document.getElementById('swal-apartment').value;
                    const state     = document.getElementById('swal-state').value;
                    if (!street || !city || !state) {
                        Swal.showValidationMessage('Please fill in all required fields');
                        return false;
                    }
                    return { street, city, apartment, state };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const { street, city, apartment, state } = result.value;
                    document.getElementById('addressLine1').innerHTML =
                        `<strong>Home:</strong> ${street}, ${city}, ${state}`;
                    document.getElementById('addressLine2').textContent =
                        apartment || 'No apartment specified';

                    Swal.fire({
                        icon: 'success',
                        title: 'Address Updated',
                        text: 'Your delivery address has been updated.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        });
    }

    // ===================================
    // CHANGE CONTACT MODAL (both modes)
    // ===================================
    function attachContactModal(btnId) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.addEventListener('click', function() {
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
                    // Update whichever contact-phone is visible
                    document.querySelectorAll('.contact-phone').forEach(el => {
                        el.innerHTML = `<i class="ph ph-phone"></i> ${result.value.phone}`;
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Contact Updated',
                        text: 'Your contact number has been updated.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                }
            });
        });
    }

    attachContactModal('changeContactBtn');
    attachContactModal('changeContactBtnPickup');

    // ===================================
    // SAVE & CONTINUE
    // ===================================
    const saveBtn = document.getElementById('saveBtn');

    saveBtn.addEventListener('click', function() {
        const currentUser = localStorage.getItem('chuksKitchenCurrentUser');

        if (!currentUser) {
            Swal.fire({
                icon: 'warning',
                title: 'Please Login',
                text: 'You need to login to continue.',
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

        let deliveryDetails = {};

        if (isPickup) {
            // Pickup — save restaurant address
            deliveryDetails = {
                type: 'Pickup',
                address: {
                    full: '123 Taste Blvd, Victoria Island, Lagos, Nigeria',
                    formatted: 'Chuks Kitchen — 123 Taste Blvd, Victoria Island, Lagos'
                },
                deliveryMethod: 'Pickup',
                deliveryTime: '20–30 minutes after confirmation',
                instructions: '',
                contact: document.querySelector('#pickupMode .contact-phone').textContent.trim()
            };
        } else {
            // Delivery — save user address
            const addressLine1 = document.getElementById('addressLine1').innerText.replace('Home:', '').trim();
            const addressLine2 = document.getElementById('addressLine2').textContent.trim();
            const deliveryMethod = asapOption.classList.contains('active') ? 'ASAP' : 'Scheduled';
            let deliveryTimeText = '30-45 minutes';
            if (scheduleOption.classList.contains('active') && deliveryDate && deliveryTime) {
                deliveryTimeText = `${deliveryDate.value} at ${deliveryTime.value}`;
            }

            deliveryDetails = {
                type: 'Delivery',
                address: {
                    full: addressLine1,
                    apartment: addressLine2 !== 'No apartment specified' ? addressLine2 : '',
                    formatted: `${addressLine1}, ${addressLine2}`
                },
                deliveryMethod,
                deliveryTime: deliveryTimeText,
                instructions: instructionsTextarea ? instructionsTextarea.value : '',
                contact: document.querySelector('#deliveryMode .contact-phone').textContent.trim()
            };
        }

        localStorage.setItem('deliveryDetails', JSON.stringify(deliveryDetails));

        Swal.fire({
            icon: 'success',
            title: isPickup ? 'Pickup Confirmed!' : 'Delivery Details Saved!',
            text: 'Proceeding to payment...',
            timer: 2000,
            showConfirmButton: false
        }).then(() => {
            window.location.href = 'payment.html';
        });
    });

    // ===================================
    // LOGIN BUTTON
    // ===================================
    const currentUser = JSON.parse(localStorage.getItem('chuksKitchenCurrentUser'));
    const loginBtns   = [document.getElementById('loginBtn'), document.getElementById('loginBtnMobile')];

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
    // SCROLL TO TOP
    // ===================================
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    }
});