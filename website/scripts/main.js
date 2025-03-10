// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 99.99,
        originalPrice: 129.99,
        image: "https://via.placeholder.com/250",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        originalPrice: 249.99,
        image: "https://via.placeholder.com/250",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 79.99,
        originalPrice: 99.99,
        image: "https://via.placeholder.com/250",
        category: "Sports"
    },
    // Add more products as needed
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.querySelector('.cart-count');
const SHIPPING_COST = 10.00;

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = count;
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        saveCart();
        showNotification('Product added to cart!');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
        renderCart();
    }
}

function calculateCartTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? SHIPPING_COST : 0;
    const total = subtotal + shipping;

    return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: total.toFixed(2)
    };
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="continue-shopping-btn" onclick="window.location.href='index.html'">Start Shopping</button>
            </div>
        `;
        updateCartSummary({ subtotal: '0.00', shipping: '0.00', total: '0.00' });
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Unit Price: $${item.price}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" value="${item.quantity}" min="1" 
                    onchange="updateQuantity(${item.id}, parseInt(this.value))">
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    updateCartSummary(calculateCartTotal());
}

function updateCartSummary({ subtotal, shipping, total }) {
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal}`;
    if (shippingEl) shippingEl.textContent = `$${shipping}`;
    if (totalEl) totalEl.textContent = `$${total}`;
}

// Product grid functionality
function createProductCard(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="product-price">
                <span class="current-price">$${product.price}</span>
                <span class="original-price">$${product.originalPrice}</span>
                <span class="discount">${discount}% OFF</span>
            </div>
            <button onclick="addToCart(${product.id})" class="add-to-cart-btn">Add to Cart</button>
        </div>
    `;
}

// Initialize product grid
function initializeProductGrid() {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
    }
}

// Price range filter functionality
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');

if (priceRange && priceValue) {
    priceRange.addEventListener('input', (e) => {
        const value = e.target.value;
        priceValue.textContent = value;
        filterProducts();
    });
}

function filterProducts() {
    const maxPrice = parseFloat(priceRange.value);
    const filteredProducts = products.filter(product => product.price <= maxPrice);
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    }
}

// Product details page functionality
function changeImage(src) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.src = src;
    }
}

function incrementQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }
}

function decrementQuantity() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput && parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Checkout functionality
function handleCheckout() {
    // Add your checkout logic here
    alert('Proceeding to checkout...');
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initializeProductGrid();
    updateCartCount();
    renderCart();

    // Add checkout button event listener
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}); 