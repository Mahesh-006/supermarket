// Main Application Logic

let currentPage = 'home';

// Initialize the application
function initApp() {
    // Initialize authentication
    initAuth();
    
    // Initialize database
    initDatabase();
    
    // Initialize cart
    initCart();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Show initial page
    showPage('home');
    
    // Initialize products if needed
    if (allProducts.length === 0) {
        initProducts();
    }
}

// Show page function
function showPage(pageName) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageName;
        
        // Initialize page-specific functionality
        initPageFunctionality(pageName);
        
        // Close mobile menu if open
        closeMobileMenu();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Initialize page-specific functionality
async function initPageFunctionality(pageName) {
    switch (pageName) {
        case 'products':
            if (allProducts.length === 0) {
                await initProducts();
            }
            break;
        case 'cart':
            updateCartPage();
            break;
        case 'orders':
            if (currentUser && isCustomer()) {
                await initOrders();
            }
            break;
        case 'admin-dashboard':
            if (currentUser && isAdmin()) {
                await initAdminDashboard();
            }
            break;
        case 'admin-products':
            if (currentUser && isAdmin()) {
                await initAdminProducts();
            }
            break;
        case 'admin-orders':
            if (currentUser && isAdmin()) {
                await initAdminOrders();
            }
            break;
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (mobileMenu && menuBtn) {
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
        } else {
            mobileMenu.classList.add('hidden');
            menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        }
        
        // Reinitialize Lucide icons
        lucide.createIcons();
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (mobileMenu && menuBtn) {
        mobileMenu.classList.add('hidden');
        menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        lucide.createIcons();
    }
}

// Handle window resize
function handleResize() {
    const deviceType = getDeviceType();
    
    // Close mobile menu on desktop
    if (deviceType === 'desktop') {
        closeMobileMenu();
    }
}

// Handle scroll events
function handleScroll() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(15, 15, 35, 0.95)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
    }
}

// Handle keyboard events
function handleKeyboard(event) {
    // Close modals on Escape key
    if (event.key === 'Escape') {
        closeProductModal();
        closeOrderModal();
    }
    
    // Quick navigation shortcuts
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'h':
                event.preventDefault();
                showPage('home');
                break;
            case 'p':
                event.preventDefault();
                if (currentUser && isCustomer()) {
                    showPage('products');
                }
                break;
            case 'c':
                event.preventDefault();
                if (currentUser && isCustomer()) {
                    showPage('cart');
                }
                break;
            case 'd':
                event.preventDefault();
                if (currentUser && isAdmin()) {
                    showPage('admin-dashboard');
                }
                break;
        }
    }
}

// Handle click outside modals
function handleClickOutside(event) {
    const productModal = document.getElementById('product-modal');
    const orderModal = document.getElementById('order-modal');
    
    if (productModal && productModal.classList.contains('active')) {
        if (event.target === productModal) {
            closeProductModal();
        }
    }
    
    if (orderModal && orderModal.classList.contains('active')) {
        if (event.target === orderModal) {
            closeOrderModal();
        }
    }
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('Application error:', event.error);
    showToast('An unexpected error occurred', 'error');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An unexpected error occurred', 'error');
    event.preventDefault();
});

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker registration would go here
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    
    // Add event listeners
    window.addEventListener('resize', throttle(handleResize, 250));
    window.addEventListener('scroll', throttle(handleScroll, 100));
    document.addEventListener('keydown', handleKeyboard);
    document.addEventListener('click', handleClickOutside);
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(event) {
        if (event.state && event.state.page) {
            showPage(event.state.page);
        }
    });
    
    // Set initial browser history state
    history.replaceState({ page: currentPage }, '', window.location.href);
});

// Update browser history when changing pages
function updateHistory(pageName) {
    const title = `${APP_CONFIG.name} - ${capitalize(pageName.replace('-', ' '))}`;
    document.title = title;
    history.pushState({ page: pageName }, title, `#${pageName}`);
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Refresh data when page becomes visible
        if (currentUser) {
            updateCartUI();
            
            if (currentPage === 'orders' && isCustomer()) {
                initOrders();
            } else if (currentPage.startsWith('admin-') && isAdmin()) {
                initPageFunctionality(currentPage);
            }
        }
    }
});

// Periodic data refresh (every 5 minutes)
setInterval(function() {
    if (document.visibilityState === 'visible' && currentUser) {
        // Refresh cart data
        updateCartUI();
        
        // Refresh current page data
        if (currentPage === 'products') {
            initProducts();
        } else if (currentPage === 'orders' && isCustomer()) {
            initOrders();
        } else if (currentPage.startsWith('admin-') && isAdmin()) {
            initPageFunctionality(currentPage);
        }
    }
}, 5 * 60 * 1000); // 5 minutes

// Export main functions for global access
window.showPage = showPage;
window.toggleMobileMenu = toggleMobileMenu;
window.login = login;
window.signup = signup;
window.logout = logout;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.checkout = checkout;
window.filterProducts = filterProducts;
window.setViewMode = setViewMode;
window.filterProductsByCategory = filterProductsByCategory;
window.togglePassword = togglePassword;
window.toggleOrderDetails = toggleOrderDetails;
window.openAddProductModal = openAddProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProductConfirm = deleteProductConfirm;
window.filterAdminProducts = filterAdminProducts;
window.filterAdminOrders = filterAdminOrders;
window.updateOrderStatus = updateOrderStatus;
window.viewOrderDetails = viewOrderDetails;
window.closeOrderModal = closeOrderModal;