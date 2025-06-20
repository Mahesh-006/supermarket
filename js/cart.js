// Shopping Cart Management

let cart = [];

// Initialize cart
function initCart() {
    const storedCart = getLocalStorage(STORAGE_KEYS.cart, []);
    cart = storedCart;
    updateCartUI();
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast('Quantity updated in cart!');
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image_url: product.image_url
        });
        showToast('Added to cart!');
    }
    
    saveCart();
    updateCartUI();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast('Removed from cart!');
}

// Update item quantity
function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = quantity;
        saveCart();
        updateCartUI();
    }
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    showToast('Cart cleared!');
}

// Get total price
function getTotalPrice() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get total items count
function getTotalItems() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Save cart to localStorage
function saveCart() {
    setLocalStorage(STORAGE_KEYS.cart, cart);
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItemsCount = document.getElementById('cart-items-count');
    const totalItems = getTotalItems();
    
    // Update cart count badge
    if (cartCount) {
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'flex';
        } else {
            cartCount.style.display = 'none';
        }
    }
    
    // Update cart page
    if (cartItemsCount) {
        cartItemsCount.textContent = `${totalItems} items in your cart`;
    }
    
    updateCartPage();
}

// Update cart page content
function updateCartPage() {
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    const cartItems = document.getElementById('cart-items');
    
    if (!emptyCart || !cartContent || !cartItems) return;
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
    } else {
        emptyCart.style.display = 'none';
        cartContent.style.display = 'grid';
        
        // Render cart items
        cartItems.innerHTML = cart.map(item => `
            <div class="card">
                <div class="flex items-center space-x-4">
                    <div class="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src="${item.image_url}" alt="${item.name}" class="w-full h-full object-cover">
                    </div>
                    
                    <div class="flex-1">
                        <h3 class="text-lg font-semibold text-white mb-1">${item.name}</h3>
                        <p class="text-primary-400 font-bold">${formatCurrency(item.price)}</p>
                    </div>

                    <div class="flex items-center space-x-3">
                        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" 
                                class="w-8 h-8 rounded-full bg-dark-200 flex items-center justify-center text-white hover:bg-dark-300 transition-colors duration-300">
                            <i data-lucide="minus" class="w-4 h-4"></i>
                        </button>
                        
                        <span class="text-white font-semibold w-8 text-center">${item.quantity}</span>
                        
                        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" 
                                class="w-8 h-8 rounded-full bg-dark-200 flex items-center justify-center text-white hover:bg-dark-300 transition-colors duration-300">
                            <i data-lucide="plus" class="w-4 h-4"></i>
                        </button>
                    </div>

                    <div class="text-right">
                        <p class="text-lg font-semibold text-white">
                            ${formatCurrency(item.price * item.quantity)}
                        </p>
                        <button onclick="removeFromCart('${item.id}')" 
                                class="text-red-400 hover:text-red-300 transition-colors duration-300 mt-1">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Update order summary
        updateOrderSummary();
        
        // Initialize Lucide icons
        lucide.createIcons();
    }
}

// Update order summary
function updateOrderSummary() {
    const summaryItemsCount = document.getElementById('summary-items-count');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTax = document.getElementById('summary-tax');
    const summaryTotal = document.getElementById('summary-total');
    
    const totalItems = getTotalItems();
    const subtotal = getTotalPrice();
    const deliveryFee = APP_CONFIG.deliveryFee;
    const tax = subtotal * APP_CONFIG.taxRate;
    const total = subtotal + deliveryFee + tax;
    
    if (summaryItemsCount) summaryItemsCount.textContent = totalItems;
    if (summarySubtotal) summarySubtotal.textContent = formatCurrency(subtotal);
    if (summaryTax) summaryTax.textContent = formatCurrency(tax);
    if (summaryTotal) summaryTotal.textContent = formatCurrency(total);
}

// Checkout function
async function checkout() {
    if (!currentUser) {
        showToast('Please login to checkout', 'error');
        showPage('login');
        return;
    }
    
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    try {
        showLoading();
        
        const subtotal = getTotalPrice();
        const deliveryFee = APP_CONFIG.deliveryFee;
        const tax = subtotal * APP_CONFIG.taxRate;
        const total = subtotal + deliveryFee + tax;
        
        // Create order
        const orderData = {
            customer_id: currentUser.uid,
            total_amount: total,
            items: cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };
        
        const order = await createOrder(orderData);
        
        // Clear cart
        clearCart();
        
        showToast('Order placed successfully!');
        showPage('orders');
        
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Failed to place order', 'error');
    } finally {
        hideLoading();
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCart();
});