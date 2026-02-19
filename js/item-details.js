document.addEventListener('DOMContentLoaded', function() {
    // Get the selected item from sessionStorage
    const selectedItem = JSON.parse(sessionStorage.getItem('selectedItem'));
    
    if (!selectedItem) {
        window.location.href = 'menu.html';
        return;
    }
    
    // Update page with selected item data
    document.querySelector('.item-title').textContent = selectedItem.name;
    document.querySelector('.item-price').innerHTML = `₦${parseInt(selectedItem.price).toLocaleString()}`;
    document.querySelector('.item-description').textContent = selectedItem.description;
    
    const itemImage = document.querySelector('.item-image img');
    if (itemImage) {
        itemImage.src = selectedItem.image;
        itemImage.alt = selectedItem.name;
    }
    
    // Price calculation
    const basePriceValue = parseInt(selectedItem.price);
    const addToCartBtn = document.getElementById('addToCartBtn');
    const proteinInputs = document.querySelectorAll('input[name="protein"]');
    const sideInputs = document.querySelectorAll('input[type="checkbox"]');
    const instructionsTextarea = document.getElementById('instructions');
    
    const proteinPrices = { 'chicken': 500, 'fish': 700, 'beef': 700 };
    const sidePrices = { 'plantain': 700, 'coleslaw': 500, 'pepper-sauce': 300 };
    const proteinNames = { 'chicken': 'Fried Chicken', 'fish': 'Grilled Fish', 'beef': 'Beef' };
    const sideNames = { 'plantain': 'Fried Plantain', 'coleslaw': 'Coleslaw', 'pepper-sauce': 'Extra Pepper Sauce' };
    
    function calculateTotal() {
        let total = basePriceValue;
        
        const selectedProtein = document.querySelector('input[name="protein"]:checked');
        if (selectedProtein && selectedProtein.id !== 'chicken') {
            total += proteinPrices[selectedProtein.id];
        }
        
        sideInputs.forEach(input => {
            if (input.checked) {
                total += sidePrices[input.id];
            }
        });
        
        return total;
    }
    
    function updateButtonPrice() {
        const total = calculateTotal();
        const formattedTotal = `₦${total.toLocaleString()}`;
        document.querySelector('.item-price').innerHTML = formattedTotal;
        addToCartBtn.innerHTML = `<i class="ph ph-shopping-cart"></i> Add to Cart - ${formattedTotal}`;
    }
    
    proteinInputs.forEach(input => input.addEventListener('change', updateButtonPrice));
    sideInputs.forEach(input => input.addEventListener('change', updateButtonPrice));
    
    // Cart functions
    function getCart() {
        const cart = localStorage.getItem('chuksKitchenCart');
        return cart ? JSON.parse(cart) : [];
    }
    
    function saveCart(cart) {
        localStorage.setItem('chuksKitchenCart', JSON.stringify(cart));
    }
    
    function getSelectedOptions() {
        const selectedProtein = document.querySelector('input[name="protein"]:checked');
        let proteinText = 'Fried Chicken';
        let proteinPrice = 0;
        
        if (selectedProtein && selectedProtein.id !== 'chicken') {
            proteinText = proteinNames[selectedProtein.id];
            proteinPrice = proteinPrices[selectedProtein.id];
        }
        
        const sides = [];
        let sidesPrices = 0;
        
        sideInputs.forEach(input => {
            if (input.checked) {
                sides.push(sideNames[input.id]);
                sidesPrices += sidePrices[input.id];
            }
        });
        
        return {
            protein: proteinText,
            proteinPrice: proteinPrice,
            sides: sides,
            sidesPrices: sidesPrices,
            instructions: instructionsTextarea.value.trim()
        };
    }
    
    // Add to cart button click
    addToCartBtn.addEventListener('click', function() {
        const currentUser = localStorage.getItem('chuksKitchenCurrentUser');
        
        if (!currentUser) {
            Swal.fire({
                icon: 'warning',
                title: 'Please Login',
                text: 'You need to login to add items to cart!',
                confirmButtonColor: '#ff7d29',
                showCancelButton: true,
                confirmButtonText: 'Go to Login'
            }).then((result) => {
                if (result.isConfirmed) {
                    sessionStorage.setItem('loginRedirect', 'item-details.html');
                    window.location.href = 'login.html';
                }
            });
            return;
        }
        
        const options = getSelectedOptions();
        const totalPrice = calculateTotal();
        
        const cartItem = {
            id: selectedItem.id + '-' + Date.now(),
            name: selectedItem.name,
            basePrice: basePriceValue,
            protein: options.protein,
            sides: options.sides,
            totalPrice: totalPrice,
            price: totalPrice,
            instructions: options.instructions,
            quantity: 1,
            image: selectedItem.image
        };
        
        let cart = getCart();
        
        const existingItemIndex = cart.findIndex(item => 
            item.name === cartItem.name && 
            item.protein === cartItem.protein && 
            JSON.stringify(item.sides) === JSON.stringify(cartItem.sides)
        );
        
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }
        
        saveCart(cart);
        
        // Go to cart page
        window.location.href = 'cart.html';
    });
    
    // Set default protein
    document.getElementById('chicken').checked = true;
    updateButtonPrice();
    
    // Login button functionality
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