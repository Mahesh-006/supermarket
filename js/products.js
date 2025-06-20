// Products Management

let allProducts = [];
let filteredProducts = [];
let currentViewMode = 'grid';

// Initialize products
async function initProducts() {
    try {
        showLoading();
        allProducts = await getProducts();
        filteredProducts = [...allProducts];
        renderProducts();
        renderFeaturedProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
    } finally {
        hideLoading();
    }
}

// Render products
function renderProducts() {
    const container = document.getElementById('products-container');
    const noProducts = document.getElementById('no-products');
    
    if (!container) return;
    
    if (filteredProducts.length === 0) {
        container.style.display = 'none';
        if (noProducts) noProducts.style.display = 'block';
        return;
    }
    
    container.style.display = currentViewMode === 'grid' ? 'grid' : 'block';
    if (noProducts) noProducts.style.display = 'none';
    
    // Update container classes based on view mode
    if (currentViewMode === 'grid') {
        container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    } else {
        container.className = 'space-y-4';
    }
    
    container.innerHTML = filteredProducts.map(product => {
        const isListView = currentViewMode === 'list';
        return `
            <div class="card hover-lift ${isListView ? 'flex items-center' : ''}">
                <div class="${isListView ? 'w-32 h-32 flex-shrink-0 mr-6 mb-0' : 'h-48 mb-4'} rounded-2xl overflow-hidden">
                    <img src="${product.image_url}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-2">${product.name}</h3>
                    <p class="text-dark-400 mb-4 line-clamp-2">${product.description}</p>
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl font-bold text-primary-400">${formatCurrency(product.price)}</span>
                        <div class="flex items-center space-x-1">
                            <i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-current"></i>
                            <span class="text-dark-400">4.8</span>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-dark-400">
                            Stock: ${product.stock_quantity}
                        </span>
                        <button onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})" 
                                ${product.stock_quantity === 0 ? 'disabled' : ''}
                                class="btn-primary flex items-center space-x-2 ${product.stock_quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}">
                            <i data-lucide="shopping-cart" class="w-4 h-4"></i>
                            <span>Add to Cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Initialize Lucide icons
    lucide.createIcons();
}

// Render featured products on home page
function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const featuredProducts = allProducts.slice(0, 6);
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="card hover-lift">
            <div class="h-48 mb-4 rounded-2xl overflow-hidden">
                <img src="${product.image_url}" alt="${product.name}" class="w-full h-full object-cover">
            </div>
            <h3 class="text-lg font-semibold text-white mb-2">${product.name}</h3>
            <p class="text-dark-400 mb-4 line-clamp-2">${product.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-2xl font-bold text-primary-400">${formatCurrency(product.price)}</span>
                <div class="flex items-center space-x-1">
                    <i data-lucide="star" class="w-4 h-4 text-yellow-400 fill-current"></i>
                    <span class="text-dark-400">4.8</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Initialize Lucide icons
    lucide.createIcons();
}

// Filter products
function filterProducts() {
    const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    const sortFilter = document.getElementById('sort-filter')?.value || 'name';
    
    // Filter by search term and category
    filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort products
    filteredProducts.sort((a, b) => {
        switch (sortFilter) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'newest':
                return new Date(b.created_at) - new Date(a.created_at);
            default:
                return 0;
        }
    });
    
    renderProducts();
}

// Set view mode
function setViewMode(mode) {
    currentViewMode = mode;
    
    // Update button states
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    
    if (gridBtn && listBtn) {
        if (mode === 'grid') {
            gridBtn.className = 'p-2 rounded-xl transition-colors duration-300 bg-primary-500 text-white';
            listBtn.className = 'p-2 rounded-xl transition-colors duration-300 text-dark-400';
        } else {
            gridBtn.className = 'p-2 rounded-xl transition-colors duration-300 text-dark-400';
            listBtn.className = 'p-2 rounded-xl transition-colors duration-300 bg-primary-500 text-white';
        }
    }
    
    renderProducts();
}

// Filter products by category (from home page)
function filterProductsByCategory(category) {
    showPage('products');
    
    // Wait for page to load, then set filter
    setTimeout(() => {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = category;
            filterProducts();
        }
    }, 100);
}

// Debounced filter function
const debouncedFilter = debounce(filterProducts, 300);

// Initialize products when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for product search
    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        productSearch.addEventListener('input', debouncedFilter);
    }
    
    // Initialize products if on products page
    if (document.getElementById('products-page')) {
        initProducts();
    }
});