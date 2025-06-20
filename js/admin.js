// Admin Management

let adminProducts = [];
let adminOrders = [];
let filteredAdminProducts = [];
let filteredAdminOrders = [];

// Initialize admin dashboard
async function initAdminDashboard() {
    if (!isAdmin()) return;
    
    try {
        showLoading();
        
        // Load dashboard data
        const [stats, recentOrders] = await Promise.all([
            getDashboardStats(),
            getRecentOrders(5)
        ]);
        
        // Update stats
        updateDashboardStats(stats);
        
        // Update recent orders
        updateRecentOrders(recentOrders);
        
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        showToast('Failed to load dashboard data', 'error');
    } finally {
        hideLoading();
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    const statsProducts = document.getElementById('stats-products');
    const statsOrders = document.getElementById('stats-orders');
    const statsCustomers = document.getElementById('stats-customers');
    const statsRevenue = document.getElementById('stats-revenue');
    
    if (statsProducts) statsProducts.textContent = stats.totalProducts;
    if (statsOrders) statsOrders.textContent = stats.totalOrders;
    if (statsCustomers) statsCustomers.textContent = stats.totalCustomers;
    if (statsRevenue) statsRevenue.textContent = formatCurrency(stats.totalRevenue);
}

// Update recent orders
function updateRecentOrders(orders) {
    const recentOrdersContainer = document.getElementById('recent-orders');
    if (!recentOrdersContainer) return;
    
    if (orders.length === 0) {
        recentOrdersContainer.innerHTML = `
            <div class="text-center py-8">
                <i data-lucide="shopping-cart" class="w-16 h-16 text-dark-300 mx-auto mb-4"></i>
                <p class="text-dark-400">No recent orders</p>
            </div>
        `;
    } else {
        recentOrdersContainer.innerHTML = `
            <div class="space-y-4">
                ${orders.map(order => `
                    <div class="flex items-center justify-between p-4 bg-dark-200 rounded-2xl">
                        <div>
                            <h4 class="text-white font-medium">
                                Order #${order.id.slice(-8)}
                            </h4>
                            <p class="text-dark-400 text-sm">
                                Customer: ${order.customer_name}
                            </p>
                            <p class="text-dark-400 text-sm">
                                ${formatDate(order.created_at)}
                            </p>
                        </div>
                        <div class="text-right">
                            <p class="text-white font-semibold">
                                ${formatCurrency(order.total_amount)}
                            </p>
                            <span class="status-badge ${getStatusClass(order.status)}">
                                ${order.status}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Initialize Lucide icons
    lucide.createIcons();
}

// Initialize admin products
async function initAdminProducts() {
    if (!isAdmin()) return;
    
    try {
        showLoading();
        adminProducts = await getProducts();
        filteredAdminProducts = [...adminProducts];
        renderAdminProducts();
    } catch (error) {
        console.error('Error loading admin products:', error);
        showToast('Failed to load products', 'error');
    } finally {
        hideLoading();
    }
}

// Render admin products table
function renderAdminProducts() {
    const tableBody = document.getElementById('admin-products-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = filteredAdminProducts.map(product => `
        <tr class="border-b border-dark-300 hover:bg-dark-200 transition-colors duration-300">
            <td class="py-4 px-6">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        <img src="${product.image_url}" alt="${product.name}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h3 class="text-white font-medium">${product.name}</h3>
                        <p class="text-dark-400 text-sm line-clamp-1">${product.description}</p>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6">
                <span class="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                    ${product.category}
                </span>
            </td>
            <td class="py-4 px-6">
                <span class="text-white font-semibold">${formatCurrency(product.price)}</span>
            </td>
            <td class="py-4 px-6">
                <span class="px-3 py-1 rounded-full text-sm ${getStockClass(product.stock_quantity)}">
                    ${product.stock_quantity}
                </span>
            </td>
            <td class="py-4 px-6">
                <div class="flex items-center space-x-2">
                    <button onclick="editProduct('${product.id}')" 
                            class="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-300">
                        <i data-lucide="edit-2" class="w-4 h-4"></i>
                    </button>
                    <button onclick="deleteProductConfirm('${product.id}')" 
                            class="p-2 text-red-400 hover:text-red-300 transition-colors duration-300">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // Initialize Lucide icons
    lucide.createIcons();
}

// Get stock status class
function getStockClass(quantity) {
    if (quantity > 10) return 'stock-high';
    if (quantity > 0) return 'stock-medium';
    return 'stock-low';
}

// Filter admin products
function filterAdminProducts() {
    const searchTerm = document.getElementById('admin-product-search')?.value.toLowerCase() || '';
    
    filteredAdminProducts = adminProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    renderAdminProducts();
}

// Open add product modal
function openAddProductModal() {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const submitText = document.getElementById('product-submit-text');
    const form = document.getElementById('product-form');
    
    if (modal && title && submitText && form) {
        title.textContent = 'Add New Product';
        submitText.textContent = 'Add Product';
        form.reset();
        document.getElementById('product-id').value = '';
        modal.classList.add('active');
    }
}

// Edit product
function editProduct(productId) {
    const product = adminProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('product-modal-title');
    const submitText = document.getElementById('product-submit-text');
    
    if (modal && title && submitText) {
        title.textContent = 'Edit Product';
        submitText.textContent = 'Update Product';
        
        // Fill form with product data
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-image').value = product.image_url;
        document.getElementById('product-stock').value = product.stock_quantity;
        
        modal.classList.add('active');
    }
}

// Delete product confirmation
function deleteProductConfirm(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        deleteProductById(productId);
    }
}

// Delete product by ID
async function deleteProductById(productId) {
    try {
        showLoading();
        await deleteProduct(productId);
        showToast('Product deleted successfully!');
        await initAdminProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
    } finally {
        hideLoading();
    }
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Handle product form submission
document.addEventListener('DOMContentLoaded', function() {
    const productForm = document.getElementById('product-form');
    if (productForm) {
        productForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const productId = document.getElementById('product-id').value;
            const productData = {
                name: document.getElementById('product-name').value,
                description: document.getElementById('product-description').value,
                price: parseFloat(document.getElementById('product-price').value),
                category: document.getElementById('product-category').value,
                image_url: document.getElementById('product-image').value,
                stock_quantity: parseInt(document.getElementById('product-stock').value)
            };
            
            try {
                showLoading();
                
                if (productId) {
                    await updateProduct(productId, productData);
                    showToast('Product updated successfully!');
                } else {
                    await createProduct(productData);
                    showToast('Product added successfully!');
                }
                
                closeProductModal();
                await initAdminProducts();
                
                // Refresh products for customer view
                await initProducts();
                
            } catch (error) {
                console.error('Error saving product:', error);
                showToast('Failed to save product', 'error');
            } finally {
                hideLoading();
            }
        });
    }
});

// Initialize admin orders
async function initAdminOrders() {
    if (!isAdmin()) return;
    
    try {
        showLoading();
        adminOrders = await getOrders();
        filteredAdminOrders = [...adminOrders];
        renderAdminOrders();
    } catch (error) {
        console.error('Error loading admin orders:', error);
        showToast('Failed to load orders', 'error');
    } finally {
        hideLoading();
    }
}

// Render admin orders table
function renderAdminOrders() {
    const tableBody = document.getElementById('admin-orders-table');
    if (!tableBody) return;
    
    tableBody.innerHTML = filteredAdminOrders.map(order => `
        <tr class="border-b border-dark-300 hover:bg-dark-200 transition-colors duration-300">
            <td class="py-4 px-6">
                <span class="text-white font-mono">#${order.id.slice(-8)}</span>
            </td>
            <td class="py-4 px-6">
                <div>
                    <p class="text-white font-medium">Customer ${order.customer_id.slice(-4)}</p>
                    <p class="text-dark-400 text-sm">customer@example.com</p>
                </div>
            </td>
            <td class="py-4 px-6">
                <span class="text-white">${formatDate(order.created_at)}</span>
            </td>
            <td class="py-4 px-6">
                <span class="text-white font-semibold">${formatCurrency(order.total_amount)}</span>
            </td>
            <td class="py-4 px-6">
                <select onchange="updateOrderStatus('${order.id}', this.value)" 
                        class="px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-primary-500 ${getStatusClass(order.status)}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td class="py-4 px-6">
                <button onclick="viewOrderDetails('${order.id}')" 
                        class="text-primary-400 hover:text-primary-300 transition-colors duration-300">
                    <i data-lucide="eye" class="w-5 h-5"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Initialize Lucide icons
    lucide.createIcons();
}

// Filter admin orders
function filterAdminOrders() {
    const searchTerm = document.getElementById('admin-order-search')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('admin-order-status-filter')?.value || 'all';
    
    filteredAdminOrders = adminOrders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm) ||
                             order.customer_id.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });
    
    renderAdminOrders();
}

// Update order status
async function updateOrderStatus(orderId, status) {
    try {
        await updateOrder(orderId, { status });
        showToast('Order status updated successfully!');
        await initAdminOrders();
    } catch (error) {
        console.error('Error updating order status:', error);
        showToast('Failed to update order status', 'error');
    }
}

// View order details
function viewOrderDetails(orderId) {
    const order = adminOrders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('order-modal');
    const title = document.getElementById('order-modal-title');
    const content = document.getElementById('order-details-content');
    
    if (modal && title && content) {
        title.textContent = `Order Details #${order.id.slice(-8)}`;
        
        content.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div class="space-y-4">
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-2">Customer Information</h3>
                        <div class="bg-dark-200 rounded-2xl p-4">
                            <p class="text-white font-medium">Customer ${order.customer_id.slice(-4)}</p>
                            <p class="text-dark-400">customer@example.com</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <h3 class="text-lg font-semibold text-white mb-2">Order Information</h3>
                        <div class="bg-dark-200 rounded-2xl p-4 space-y-2">
                            <div class="flex justify-between">
                                <span class="text-dark-400">Order Date:</span>
                                <span class="text-white">${formatDate(order.created_at)}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-dark-400">Status:</span>
                                <span class="status-badge ${getStatusClass(order.status)}">${order.status}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-dark-400">Total Amount:</span>
                                <span class="text-white font-semibold">${formatCurrency(order.total_amount)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h3 class="text-lg font-semibold text-white mb-4">Order Items</h3>
                <div class="space-y-3">
                    ${order.items ? order.items.map(item => `
                        <div class="bg-dark-200 rounded-2xl p-4 flex items-center space-x-4">
                            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                <img src="${getProductImage(item.product_id)}" 
                                     alt="${getProductName(item.product_id)}" 
                                     class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1">
                                <h4 class="text-white font-medium">${getProductName(item.product_id)}</h4>
                                <p class="text-dark-400 text-sm">
                                    ${formatCurrency(item.price)} × ${item.quantity}
                                </p>
                            </div>
                            <div class="text-right">
                                <p class="text-white font-semibold">
                                    ${formatCurrency(item.price * item.quantity)}
                                </p>
                            </div>
                        </div>
                    `).join('') : '<p class="text-dark-400">No items found</p>'}
                </div>
            </div>
        `;
        
        modal.classList.add('active');
    }
}

// Close order modal
function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Debounced filter functions
const debouncedFilterAdminProducts = debounce(filterAdminProducts, 300);
const debouncedFilterAdminOrders = debounce(filterAdminOrders, 300);

// Initialize admin functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for admin search
    const adminProductSearch = document.getElementById('admin-product-search');
    if (adminProductSearch) {
        adminProductSearch.addEventListener('input', debouncedFilterAdminProducts);
    }
    
    const adminOrderSearch = document.getElementById('admin-order-search');
    if (adminOrderSearch) {
        adminOrderSearch.addEventListener('input', debouncedFilterAdminOrders);
    }
});