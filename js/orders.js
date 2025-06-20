// Orders Management

let allOrders = [];

// Initialize orders
async function initOrders() {
    if (!currentUser) return;
    
    try {
        showLoading();
        allOrders = await getOrders(currentUser.uid);
        renderOrders();
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Failed to load orders', 'error');
    } finally {
        hideLoading();
    }
}

// Render orders
function renderOrders() {
    const noOrders = document.getElementById('no-orders');
    const ordersList = document.getElementById('orders-list');
    
    if (!noOrders || !ordersList) return;
    
    if (allOrders.length === 0) {
        noOrders.style.display = 'block';
        ordersList.style.display = 'none';
        return;
    }
    
    noOrders.style.display = 'none';
    ordersList.style.display = 'block';
    
    ordersList.innerHTML = allOrders.map(order => `
        <div class="card">
            <div class="flex items-center justify-between mb-4">
                <div>
                    <h3 class="text-lg font-semibold text-white">
                        Order #${order.id.slice(-8)}
                    </h3>
                    <p class="text-dark-400">
                        ${formatDate(order.created_at)}
                    </p>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="status-badge ${getStatusClass(order.status)}">
                        <div class="flex items-center space-x-2">
                            ${getStatusIcon(order.status)}
                            <span class="capitalize">${order.status}</span>
                        </div>
                    </span>
                    <button onclick="toggleOrderDetails('${order.id}')" 
                            class="text-primary-400 hover:text-primary-300 transition-colors duration-300">
                        <i data-lucide="eye" class="w-5 h-5"></i>
                    </button>
                </div>
            </div>

            <div class="flex items-center justify-between">
                <div>
                    <p class="text-dark-400">
                        ${order.items ? order.items.length : 0} items
                    </p>
                </div>
                <div class="text-right">
                    <p class="text-2xl font-bold text-primary-400">
                        ${formatCurrency(order.total_amount)}
                    </p>
                </div>
            </div>

            <!-- Order Details (Initially Hidden) -->
            <div id="order-details-${order.id}" class="mt-6 pt-6 border-t border-dark-300" style="display: none;">
                <h4 class="text-white font-semibold mb-4">Order Items</h4>
                <div class="space-y-3">
                    ${order.items ? order.items.map(item => `
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                <img src="${getProductImage(item.product_id)}" 
                                     alt="${getProductName(item.product_id)}" 
                                     class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1">
                                <h5 class="text-white font-medium">
                                    ${getProductName(item.product_id)}
                                </h5>
                                <p class="text-dark-400 text-sm">
                                    Quantity: ${item.quantity} × ${formatCurrency(item.price)}
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-white font-semibold">
                                    ${formatCurrency(item.quantity * item.price)}
                                </p>
                            </div>
                        </div>
                    `).join('') : '<p class="text-dark-400">No items found</p>'}
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize Lucide icons
    lucide.createIcons();
}

// Toggle order details
function toggleOrderDetails(orderId) {
    const detailsElement = document.getElementById(`order-details-${orderId}`);
    if (detailsElement) {
        if (detailsElement.style.display === 'none') {
            detailsElement.style.display = 'block';
        } else {
            detailsElement.style.display = 'none';
        }
    }
}

// Get status icon
function getStatusIcon(status) {
    switch (status) {
        case 'pending':
            return '<i data-lucide="clock" class="w-5 h-5 text-yellow-400"></i>';
        case 'confirmed':
            return '<i data-lucide="package" class="w-5 h-5 text-blue-400"></i>';
        case 'delivered':
            return '<i data-lucide="check-circle" class="w-5 h-5 text-green-400"></i>';
        case 'cancelled':
            return '<i data-lucide="x-circle" class="w-5 h-5 text-red-400"></i>';
        default:
            return '<i data-lucide="clock" class="w-5 h-5 text-gray-400"></i>';
    }
}

// Get status CSS class
function getStatusClass(status) {
    switch (status) {
        case 'pending':
            return 'status-pending';
        case 'confirmed':
            return 'status-confirmed';
        case 'delivered':
            return 'status-delivered';
        case 'cancelled':
            return 'status-cancelled';
        default:
            return 'status-pending';
    }
}

// Get product name by ID
function getProductName(productId) {
    const product = allProducts.find(p => p.id === productId);
    return product ? product.name : 'Unknown Product';
}

// Get product image by ID
function getProductImage(productId) {
    const product = allProducts.find(p => p.id === productId);
    return product ? product.image_url : '/placeholder.jpg';
}

// Initialize orders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize orders if on orders page and user is logged in
    if (document.getElementById('orders-page') && currentUser) {
        initOrders();
    }
});