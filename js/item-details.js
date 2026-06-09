document.addEventListener('DOMContentLoaded', function() {
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

    // ===================================
    // SMART SECTION VISIBILITY
    // ===================================
    const proteinCategories = ['entrees', 'swallow'];
    const sidesCategories = ['entrees', 'grills'];
    const itemCategory = (selectedItem.category || '').toLowerCase();

    const proteinSection = document.getElementById('proteinSection');
    const sidesSection = document.getElementById('sidesSection');

    if (proteinCategories.includes(itemCategory)) {
        proteinSection.style.display = 'block';
    }
    if (sidesCategories.includes(itemCategory)) {
        sidesSection.style.display = 'block';
    }

    // ===================================
    // PER-ITEM ALLERGEN DATA
    // ===================================
    const allergenMap = {
        // ENTREES
        'jollof-chicken':    ['Gluten', 'Soy', 'Eggs'],
        'jollof-fish':       ['Fish', 'Gluten', 'Soy'],
        'fried-rice':        ['Gluten', 'Soy', 'Eggs'],
        'ofada-rice':        ['Gluten', 'Soy'],
        'white-rice':        ['Gluten', 'Soy'],
        'coconut-rice':      ['Gluten', 'Soy', 'Tree Nuts'],
        'basmati-rice':      ['Gluten', 'Soy'],
        'macaroni':          ['Gluten', 'Dairy', 'Eggs'],
        'indomie':           ['Gluten', 'Soy', 'Eggs'],
        'porridge':          ['Gluten', 'Soy'],
        'yam-egg-sauce':     ['Eggs', 'Soy'],
        'ewa-agoyin':        ['Gluten', 'Soy'],
        'jollof-spagetti':   ['Gluten', 'Soy', 'Eggs'],

        // SWALLOW & SOUPS
        'eba-egusi':         ['Gluten', 'Tree Nuts', 'Fish'],
        'eba-egusi-beef':    ['Gluten', 'Tree Nuts'],
        'pounded-yam':       ['Shellfish', 'Fish', 'Gluten'],
        'amala':             ['Gluten', 'Soy'],
        'fufu':              ['Fish', 'Shellfish', 'Gluten'],
        'eba-bitter-leaf':   ['Gluten', 'Fish'],
        'eba-efo-riro':      ['Gluten', 'Fish', 'Shellfish'],
        'ogbono-pounded-yam':['Tree Nuts', 'Fish', 'Gluten'],
        'pounded-yam-afang': ['Shellfish', 'Fish', 'Gluten'],
        'fufu-egusi':        ['Gluten', 'Tree Nuts', 'Fish'],
        'fufu-oha':          ['Gluten', 'Fish'],

        // GRILLS & SIDES
        'grilled-chicken':   ['Gluten', 'Soy', 'Mustard'],
        'suya':              ['Peanuts', 'Gluten', 'Soy'],
        'spicy-tilapia':     ['Fish', 'Gluten'],
        'shawarma':          ['Gluten', 'Dairy', 'Eggs', 'Mustard'],
        'chicken':           ['Gluten', 'Soy'],
        'eggs-plantain':     ['Eggs', 'Soy'],
        'kilishi':           ['Peanuts', 'Gluten', 'Soy'],
        'chicken-chips':     ['Gluten', 'Soy', 'Eggs'],

        // BEVERAGES
        'zobo':              ['None known'],
        'kunu':              ['Gluten'],
        'wine':              ['Sulphites'],
        'coco-drink':        ['None known'],

        // DESSERTS
        'puff-puff':         ['Gluten', 'Dairy', 'Eggs'],
        'milky-doughnut':    ['Gluten', 'Dairy', 'Eggs'],
        'chin-chin':         ['Gluten', 'Dairy', 'Eggs', 'Nuts'],
        'doughnut':          ['Gluten', 'Dairy', 'Eggs'],
        'cup-cake':          ['Gluten', 'Dairy', 'Eggs', 'Nuts'],
        'cake':              ['Gluten', 'Dairy', 'Eggs', 'Nuts'],
    };

    const allergenIcons = {
        'Gluten':     'ph-bread',
        'Dairy':      'ph-cow',
        'Eggs':       'ph-egg',
        'Soy':        'ph-plant',
        'Shellfish':  'ph-shrimp',
        'Fish':       'ph-fish',
        'Nuts':       'ph-nut',
        'Tree Nuts':  'ph-nut',
        'Peanuts':    'ph-nut',
        'Mustard':    'ph-pepper',
        'Sulphites':  'ph-wine',
        'None known': 'ph-check-circle'
    };

    const allergenToggle = document.getElementById('allergenToggle');
    const allergenPanel  = document.getElementById('allergenPanel');
    const allergenTags   = document.getElementById('allergenTags');

    const itemId = selectedItem.id || '';
    const itemAllergens = allergenMap[itemId] || ['Please ask staff for allergen information'];

    allergenTags.innerHTML = itemAllergens.map(a => `
        <span class="allergen-tag ${a === 'None known' ? 'allergen-safe' : ''}">
            <i class="ph ${allergenIcons[a] || 'ph-warning'}"></i> ${a}
        </span>
    `).join('');

    allergenToggle.addEventListener('click', function () {
        const isOpen = allergenPanel.classList.toggle('open');
        allergenToggle.setAttribute('aria-expanded', isOpen);
    });

    // ===================================
    // PRICE CALCULATION
    // ===================================
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
        if (selectedProtein) {
            total += proteinPrices[selectedProtein.id] || 0;
        }
        sideInputs.forEach(input => {
            if (input.checked) total += sidePrices[input.id] || 0;
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
    
    // ===================================
    // CART FUNCTIONS
    // ===================================
    function getCart() {
        const cart = localStorage.getItem('chuksKitchenCart');
        return cart ? JSON.parse(cart) : [];
    }
    
    function saveCart(cart) {
        localStorage.setItem('chuksKitchenCart', JSON.stringify(cart));
    }
    
    function getSelectedOptions() {
        const selectedProtein = document.querySelector('input[name="protein"]:checked');
        let proteinText = null;
        let proteinPrice = 0;
        if (selectedProtein) {
            proteinText = proteinNames[selectedProtein.id] || null;
            proteinPrice = proteinPrices[selectedProtein.id] || 0;
        }
        const sides = [];
        let sidesPrices = 0;
        sideInputs.forEach(input => {
            if (input.checked) {
                sides.push(sideNames[input.id]);
                sidesPrices += sidePrices[input.id] || 0;
            }
        });
        return { protein: proteinText, proteinPrice, sides, sidesPrices, instructions: instructionsTextarea.value.trim() };
    }
    
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
            totalPrice,
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
        window.location.href = 'cart.html';
    });
    
    updateButtonPrice();
    
    // ===================================
    // LOGIN BUTTON
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