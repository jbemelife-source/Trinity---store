// ==================== PRODUCT DATA ====================
const products = [
    { id: 1, name: 'Premium Straight Hair', category: 'straight', price: 25000, description: 'Luxurious straight hair extensions for a sleek, elegant look.' },
    { id: 2, name: 'Silky Wave Collection', category: 'wave', price: 28000, description: 'Beautiful wavy hair with a natural, flowing appearance.' },
    { id: 3, name: 'Classic Lace Front', category: 'lace', price: 35000, description: 'Natural-looking lace front wig for seamless blending.' },
    { id: 4, name: 'Bouncy Curly', category: 'curly', price: 32000, description: 'Voluminous curly hair for a bold, glamorous style.' },
    { id: 5, name: 'Volume Booster', category: 'volume', price: 22000, description: 'Add instant volume and thickness to your natural hair.' },
    { id: 6, name: 'Starlet Collection', category: 'star', price: 45000, description: 'Red carpet quality, celebrity-inspired styling.' },
    { id: 7, name: 'Romantic Heart', category: 'heart', price: 29000, description: 'Soft, romantic waves perfect for special occasions.' },
    { id: 8, name: 'Royal Princess', category: 'princess', price: 50000, description: 'Premium, majestic styling fit for royalty.' },
    { id: 9, name: 'Straight Luxury', category: 'straight', price: 26000, description: 'Ultra-smooth straight hair with natural shine.' },
    { id: 10, name: 'Wavy Dreams', category: 'wave', price: 27000, description: 'Soft waves with a dreamy, romantic finish.' },
    { id: 11, name: 'Lace Perfection', category: 'lace', price: 36000, description: 'Invisible lace for undetectable, natural hairline.' },
    { id: 12, name: 'Curly Goddess', category: 'curly', price: 33000, description: 'Goddess curls for confident, powerful beauty.' }
];

// ==================== STATE MANAGEMENT ====================
let cart = [];
let currentFilter = 'all';
let currentSort = 'default';
let minPriceFilter = 0;
let maxPriceFilter = 100000;

// ==================== DOM ELEMENTS ====================
const pageLoader = document.getElementById('pageLoader');
const cartModal = document.getElementById('cartModal');
const cartIconBtn = document.getElementById('cartIconBtn');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartCountText = document.getElementById('cartCountText');
const productGrid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const minPrice = document.getElementById('minPrice');
const maxPrice = document.getElementById('maxPrice');
const shopNowBtn = document.getElementById('shopNowBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

const welcomeModal = document.getElementById('welcomeModal');
const welcomeCloseBtn = document.getElementById('welcomeCloseBtn');
const welcomeStartBtn = document.getElementById('welcomeStartBtn');

const successModal = document.getElementById('successModal');
const successCloseBtn = document.getElementById('successCloseBtn');

const quickViewOverlay = document.getElementById('quickViewOverlay');
const quickViewClose = document.getElementById('quickViewClose');
const quickViewBody = document.getElementById('quickViewBody');

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // Hide loader after page loads
    setTimeout(() => {
        pageLoader.classList.add('hidden');
    }, 2000);

    // Show welcome modal
    welcomeModal.classList.add('active');

    // Initialize products
    displayProducts(products);

    // Initialize filter carousel
    initializeFilterCarousel();

    // Attach event listeners
    attachEventListeners();

    // Load cart from localStorage
    loadCartFromStorage();
});

// ==================== FILTER CAROUSEL ====================
function initializeFilterCarousel() {
    const filterButtons = document.getElementById('filterButtons');
    const leftButton = document.querySelector('.filter-nav-btn.left');
    const rightButton = document.querySelector('.filter-nav-btn.right');
    const step = 220;

    if (!filterButtons || !leftButton || !rightButton) return;

    function updateNavState() {
        leftButton.disabled = filterButtons.scrollLeft <= 0;
        rightButton.disabled = filterButtons.scrollLeft + filterButtons.clientWidth >= filterButtons.scrollWidth - 1;
    }

    leftButton.addEventListener('click', function () {
        filterButtons.scrollBy({ left: -step, behavior: 'smooth' });
    });

    rightButton.addEventListener('click', function () {
        filterButtons.scrollBy({ left: step, behavior: 'smooth' });
    });

    filterButtons.addEventListener('scroll', function () {
        window.requestAnimationFrame(updateNavState);
    });

    updateNavState();
}

// ==================== EVENT LISTENERS ====================
function attachEventListeners() {
    // Cart icon click
    cartIconBtn.addEventListener('click', openCart);

    // Close cart
    closeCartBtn.addEventListener('click', closeCart);

    // Checkout
    checkoutBtn.addEventListener('click', checkout);

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            applyFiltersAndSort();
        });
    });

    // Search input
    searchInput.addEventListener('input', applyFiltersAndSort);

    // Sort select
    sortSelect.addEventListener('change', function () {
        currentSort = this.value;
        applyFiltersAndSort();
    });

    // Price filters
    minPrice.addEventListener('change', function () {
        minPriceFilter = parseFloat(this.value) || 0;
        applyFiltersAndSort();
    });

    maxPrice.addEventListener('change', function () {
        maxPriceFilter = parseFloat(this.value) || 100000;
        applyFiltersAndSort();
    });

    // Shop now button
    shopNowBtn.addEventListener('click', function () {
        document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });

    // Welcome modal
    welcomeCloseBtn.addEventListener('click', closeWelcomeModal);
    welcomeStartBtn.addEventListener('click', closeWelcomeModal);

    // Success modal
    successCloseBtn.addEventListener('click', closeSuccessModal);

    // Quick view close
    quickViewClose.addEventListener('click', closeQuickView);
    quickViewOverlay.addEventListener('click', function (e) {
        if (e.target === quickViewOverlay) closeQuickView();
    });
}

// ==================== PRODUCT DISPLAY ====================
function displayProducts(productsToDisplay) {
    productGrid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = '<p class="no-products" style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found matching your criteria.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <div class="image-placeholder">Hair Product</div>
                <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <p class="product-price">₦${product.price.toLocaleString()}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;

        productGrid.appendChild(productCard);

        // Attach add to cart listener
        productCard.querySelector('.add-to-cart-btn').addEventListener('click', function () {
            addToCart(product.id);
        });

        // Attach quick view listener
        productCard.querySelector('.quick-view-btn').addEventListener('click', function () {
            openQuickView(product.id);
        });
    });
}

// ==================== FILTERING & SORTING ====================
function applyFiltersAndSort() {
    let filtered = products.filter(product => {
        const matchesFilter = currentFilter === 'all' || product.category === currentFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesPrice = product.price >= minPriceFilter && product.price <= maxPriceFilter;
        return matchesFilter && matchesSearch && matchesPrice;
    });

    // Sort
    switch (currentSort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break;
    }

    displayProducts(filtered);
}

// ==================== CART FUNCTIONS ====================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    saveCartToStorage();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        updateCart();
        saveCartToStorage();
    }
}

function updateCart() {
    // Update cart items display
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="padding: 1rem; text-align: center; color: #999;">Your cart is empty</p>';
        cartTotal.textContent = 'Total: ₦0';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">₦${item.price.toLocaleString()}</p>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn minus-btn" data-id="${item.id}">−</button>
                <input type="number" class="qty-input" value="${item.quantity}" data-id="${item.id}" min="1">
                <button class="qty-btn plus-btn" data-id="${item.id}">+</button>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
            <p class="cart-item-total">₦${itemTotal.toLocaleString()}</p>
        `;

        cartItems.appendChild(cartItem);

        // Quantity controls
        cartItem.querySelector('.minus-btn').addEventListener('click', function () {
            updateCartQuantity(item.id, item.quantity - 1);
        });

        cartItem.querySelector('.plus-btn').addEventListener('click', function () {
            updateCartQuantity(item.id, item.quantity + 1);
        });

        cartItem.querySelector('.qty-input').addEventListener('change', function () {
            updateCartQuantity(item.id, parseInt(this.value) || 1);
        });

        cartItem.querySelector('.remove-btn').addEventListener('click', function () {
            removeFromCart(item.id);
        });
    });

    // Update total
    cartTotal.textContent = `Total: ₦${total.toLocaleString()}`;

    // Update cart count badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountText.textContent = totalItems;
}

function openCart() {
    cartModal.classList.add('active');
}

function closeCart() {
    cartModal.classList.remove('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartSummary = cart.map(item => `${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`).join('\n');
    const message = `Hello Trinity Hair!\n\n*New Order*\n\n${cartSummary}\n\n*Total: ₦${total.toLocaleString()}*\n\nPlease confirm availability and delivery details.`;

    const whatsappUrl = `https://wa.me/2349160660773?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    closeCart();
    cart = [];
    updateCart();
    saveCartToStorage();
    showSuccessModal();
}

// ==================== MODAL FUNCTIONS ====================
function closeWelcomeModal() {
    welcomeModal.classList.remove('active');
}

function showSuccessModal() {
    successModal.classList.add('active');
}

function closeSuccessModal() {
    successModal.classList.remove('active');
}

function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    quickViewBody.innerHTML = `
        <div class="quick-view-product">
            <div class="quick-view-image">
                <div class="image-placeholder-large">Hair Product</div>
            </div>
            <div class="quick-view-details">
                <h2>${product.name}</h2>
                <p class="quick-view-category">Category: ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                <p class="quick-view-description">${product.description}</p>
                <p class="quick-view-price">₦${product.price.toLocaleString()}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

    quickViewBody.querySelector('.add-to-cart-btn').addEventListener('click', function () {
        addToCart(product.id);
        closeQuickView();
    });

    quickViewOverlay.classList.add('active');
    quickViewOverlay.setAttribute('aria-hidden', 'false');
}

function closeQuickView() {
    quickViewOverlay.classList.remove('active');
    quickViewOverlay.setAttribute('aria-hidden', 'true');
}

// ==================== LOCAL STORAGE ====================
function saveCartToStorage() {
    localStorage.setItem('trinityCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const stored = localStorage.getItem('trinityCart');
    if (stored) {
        cart = JSON.parse(stored);
        updateCart();
    }
}
