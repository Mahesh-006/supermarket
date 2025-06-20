// Database Management (Mock Implementation)

// Mock database storage
let mockDatabase = {
    products: [],
    orders: [],
    profiles: []
};

// Initialize mock database with sample data
function initDatabase() {
    // Load data from localStorage or use default data
    const storedProducts = getLocalStorage('mock_products');
    const storedOrders = getLocalStorage('mock_orders');
    const storedProfiles = getLocalStorage('mock_profiles');
    
    if (storedProducts) {
        mockDatabase.products = storedProducts;
    } else {
        // Initialize with sample products
        mockDatabase.products = [
            {
                id: '1',
                name: 'Fresh Organic Apples',
                description: 'Crisp and sweet organic apples, perfect for snacking or baking.',
                price: 4.99,
                category: 'Fresh Produce',
                image_url: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=800',
                stock_quantity: 50,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Whole Milk',
                description: 'Fresh whole milk from local farms, rich in calcium and vitamins.',
                price: 3.49,
                category: 'Dairy',
                image_url: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=800',
                stock_quantity: 30,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: '3',
                name: 'Artisan Bread',
                description: 'Freshly baked artisan bread with a crispy crust and soft interior.',
                price: 5.99,
                category: 'Bakery',
                image_url: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg?auto=compress&cs=tinysrgb&w=800',
                stock_quantity: 20,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: '4',
                name: 'Orange Juice',
                description: '100% pure orange juice, no added sugar or preservatives.',
                price: 4.29,
                category: 'Beverages',
                image_url: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=800',
                stock_quantity: 25,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: '5',
                name: 'Pasta',
                description: 'Premium durum wheat pasta, perfect for any Italian dish.',
                price: 2.99,
                category: 'Pantry',
                image_url: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800',
                stock_quantity: 40,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                id: '6',
                name: 'Fresh Salmon',
                description: 'Wild-caught Atlantic salmon, rich in omega-3 fatty acids.',
                price: 12.99,
                category: 'Meat & Seafood',
                image_url: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800',
                stock_quantity: 15,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
        saveDatabase();
    }
    
    if (storedOrders) {
        mockDatabase.orders = storedOrders;
    }
    
    if (storedProfiles) {
        mockDatabase.profiles = storedProfiles;
    }
}

// Save database to localStorage
function saveDatabase() {
    setLocalStorage('mock_products', mockDatabase.products);
    setLocalStorage('mock_orders', mockDatabase.orders);
    setLocalStorage('mock_profiles', mockDatabase.profiles);
}

// Products CRUD operations
async function getProducts() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...mockDatabase.products]);
        }, 100);
    });
}

async function getProduct(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const product = mockDatabase.products.find(p => p.id === id);
            resolve(product);
        }, 100);
    });
}

async function createProduct(productData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const newProduct = {
                    id: generateId(),
                    ...productData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                mockDatabase.products.push(newProduct);
                saveDatabase();
                resolve(newProduct);
            } catch (error) {
                reject(error);
            }
        }, 100);
    });
}

async function updateProduct(id, productData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const index = mockDatabase.products.findIndex(p => p.id === id);
                if (index === -1) {
                    reject(new Error('Product not found'));
                    return;
                }
                
                mockDatabase.products[index] = {
                    ...mockDatabase.products[index],
                    ...productData,
                    updated_at: new Date().toISOString()
                };
                
                saveDatabase();
                resolve(mockDatabase.products[index]);
            } catch (error) {
                reject(error);
            }
        }, 100);
    });
}

async function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const index = mockDatabase.products.findIndex(p => p.id === id);
                if (index === -1) {
                    reject(new Error('Product not found'));
                    return;
                }
                
                mockDatabase.products.splice(index, 1);
                saveDatabase();
                resolve(true);
            } catch (error) {
                reject(error);
            }
        }, 100);
    });
}

// Orders CRUD operations
async function getOrders(customerId = null) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let orders = [...mockDatabase.orders];
            if (customerId) {
                orders = orders.filter(o => o.customer_id === customerId);
            }
            resolve(orders);
        }, 100);
    });
}

async function getOrder(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const order = mockDatabase.orders.find(o => o.id === id);
            resolve(order);
        }, 100);
    });
}

async function createOrder(orderData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const newOrder = {
                    id: generateId(),
                    ...orderData,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                mockDatabase.orders.push(newOrder);
                saveDatabase();
                resolve(newOrder);
            } catch (error) {
                reject(error);
            }
        }, 100);
    });
}

async function updateOrder(id, orderData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const index = mockDatabase.orders.findIndex(o => o.id === id);
                if (index === -1) {
                    reject(new Error('Order not found'));
                    return;
                }
                
                mockDatabase.orders[index] = {
                    ...mockDatabase.orders[index],
                    ...orderData,
                    updated_at: new Date().toISOString()
                };
                
                saveDatabase();
                resolve(mockDatabase.orders[index]);
            } catch (error) {
                reject(error);
            }
        }, 100);
    });
}

async function deleteOrder(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const index = mockDatabase.orders.findIndex(o => o.id === id);
                if (index === -1) {
                    reject(new Error('Order not found'));
                    return;
                }
                
                mockDatabase.orders.splice(index, 1);
                saveDatabase();
                resolve(true);
            } catch (error) {
                reject(error);
            }
        }, 100);
    });
}

// Get dashboard statistics
async function getDashboardStats() {
    return new Promise((resolve) => {
        setTimeout(() => {
            const totalProducts = mockDatabase.products.length;
            const totalOrders = mockDatabase.orders.length;
            const totalCustomers = mockDatabase.profiles.filter(p => p.role === 'customer').length;
            const totalRevenue = mockDatabase.orders.reduce((sum, order) => sum + order.total_amount, 0);
            
            resolve({
                totalProducts,
                totalOrders,
                totalCustomers,
                totalRevenue
            });
        }, 100);
    });
}

// Get recent orders for dashboard
async function getRecentOrders(limit = 5) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const recentOrders = mockDatabase.orders
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, limit)
                .map(order => ({
                    ...order,
                    customer_name: 'Customer ' + order.customer_id.slice(-4)
                }));
            
            resolve(recentOrders);
        }, 100);
    });
}

// Initialize database when script loads
if (typeof window !== 'undefined') {
    initDatabase();
}