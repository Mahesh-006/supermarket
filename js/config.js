// Firebase Configuration
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Supabase Configuration
const supabaseUrl = 'your-supabase-url';
const supabaseAnonKey = 'your-supabase-anon-key';

// Initialize Supabase client
let supabase;
if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
}

// App Configuration
const APP_CONFIG = {
    name: 'SuperMart',
    version: '1.0.0',
    apiUrl: 'https://api.supermart.com',
    deliveryFee: 5.99,
    taxRate: 0.08,
    currency: 'USD',
    currencySymbol: '$'
};

// Local Storage Keys
const STORAGE_KEYS = {
    user: 'supermart_user',
    cart: 'supermart_cart',
    products: 'supermart_products',
    orders: 'supermart_orders',
    theme: 'supermart_theme'
};

// API Endpoints (for future use)
const API_ENDPOINTS = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        profile: '/auth/profile'
    },
    products: {
        list: '/products',
        create: '/products',
        update: '/products/:id',
        delete: '/products/:id'
    },
    orders: {
        list: '/orders',
        create: '/orders',
        update: '/orders/:id',
        delete: '/orders/:id'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        firebaseConfig,
        supabaseUrl,
        supabaseAnonKey,
        APP_CONFIG,
        STORAGE_KEYS,
        API_ENDPOINTS
    };
}