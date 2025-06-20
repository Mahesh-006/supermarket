// Authentication Management

let currentUser = null;
let userProfile = null;

// Initialize authentication
function initAuth() {
    // Check for stored user data
    const storedUser = getLocalStorage(STORAGE_KEYS.user);
    if (storedUser) {
        currentUser = storedUser;
        userProfile = storedUser.profile;
        updateUIForAuthenticatedUser();
    }
}

// Login function
async function login(email, password) {
    try {
        showLoading();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we'll use mock authentication
        // In a real app, this would make an API call to your backend
        const mockUsers = [
            {
                id: '1',
                email: 'admin@supermart.com',
                password: 'admin123',
                profile: {
                    id: '1',
                    email: 'admin@supermart.com',
                    full_name: 'Admin User',
                    role: 'admin'
                }
            },
            {
                id: '2',
                email: 'customer@supermart.com',
                password: 'customer123',
                profile: {
                    id: '2',
                    email: 'customer@supermart.com',
                    full_name: 'John Doe',
                    role: 'customer'
                }
            }
        ];
        
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        // Set current user
        currentUser = { uid: user.id, email: user.email };
        userProfile = user.profile;
        
        // Store user data
        setLocalStorage(STORAGE_KEYS.user, {
            uid: user.id,
            email: user.email,
            profile: user.profile
        });
        
        // Update UI
        updateUIForAuthenticatedUser();
        
        showToast('Login successful!');
        showPage('home');
        
    } catch (error) {
        console.error('Login error:', error);
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Signup function
async function signup(email, password, fullName, role) {
    try {
        showLoading();
        
        // Validate input
        if (!isValidEmail(email)) {
            throw new Error('Please enter a valid email address');
        }
        
        if (!isValidPassword(password)) {
            throw new Error('Password must be at least 6 characters long');
        }
        
        if (!fullName.trim()) {
            throw new Error('Please enter your full name');
        }
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate new user ID
        const userId = generateId();
        
        // Create user profile
        const newUserProfile = {
            id: userId,
            email: email,
            full_name: fullName,
            role: role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Set current user
        currentUser = { uid: userId, email: email };
        userProfile = newUserProfile;
        
        // Store user data
        setLocalStorage(STORAGE_KEYS.user, {
            uid: userId,
            email: email,
            profile: newUserProfile
        });
        
        // Update UI
        updateUIForAuthenticatedUser();
        
        showToast('Account created successfully!');
        showPage('home');
        
    } catch (error) {
        console.error('Signup error:', error);
        showToast(error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Logout function
async function logout() {
    try {
        // Clear user data
        currentUser = null;
        userProfile = null;
        
        // Remove from storage
        removeLocalStorage(STORAGE_KEYS.user);
        
        // Clear cart
        clearCart();
        
        // Update UI
        updateUIForUnauthenticatedUser();
        
        showToast('Logged out successfully!');
        showPage('home');
        
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out', 'error');
    }
}

// Check if user is admin
function isAdmin() {
    return userProfile && userProfile.role === 'admin';
}

// Check if user is customer
function isCustomer() {
    return userProfile && userProfile.role === 'customer';
}

// Update UI for authenticated user
function updateUIForAuthenticatedUser() {
    // Hide auth buttons
    const authButtons = document.getElementById('auth-buttons');
    const mobileAuth = document.getElementById('mobile-auth');
    if (authButtons) authButtons.style.display = 'none';
    if (mobileAuth) mobileAuth.style.display = 'none';
    
    // Show user info
    const userInfo = document.getElementById('user-info');
    const mobileUserInfo = document.getElementById('mobile-user-info');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (userInfo) userInfo.style.display = 'flex';
    if (mobileUserInfo) mobileUserInfo.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'block';
    
    // Update user name and role
    const userName = document.getElementById('user-name');
    const userRole = document.getElementById('user-role');
    const mobileUserName = document.getElementById('mobile-user-name');
    const mobileUserRole = document.getElementById('mobile-user-role');
    const adminName = document.getElementById('admin-name');
    
    if (userName) userName.textContent = userProfile.full_name;
    if (userRole) userRole.textContent = userProfile.role;
    if (mobileUserName) mobileUserName.textContent = userProfile.full_name;
    if (mobileUserRole) mobileUserRole.textContent = userProfile.role;
    if (adminName) adminName.textContent = userProfile.full_name;
    
    // Show/hide role-specific elements
    const customerElements = document.querySelectorAll('.customer-only');
    const adminElements = document.querySelectorAll('.admin-only');
    
    if (isAdmin()) {
        customerElements.forEach(el => el.style.display = 'none');
        adminElements.forEach(el => el.style.display = 'block');
    } else if (isCustomer()) {
        customerElements.forEach(el => el.style.display = 'block');
        adminElements.forEach(el => el.style.display = 'none');
    }
    
    // Update hero actions
    const heroActions = document.getElementById('hero-actions');
    const ctaButtons = document.getElementById('cta-buttons');
    
    if (heroActions) {
        if (isAdmin()) {
            heroActions.innerHTML = `
                <button onclick="showPage('admin-dashboard')" class="btn-primary flex items-center justify-center">
                    Go to Dashboard <i data-lucide="arrow-right" class="ml-2 w-5 h-5"></i>
                </button>
            `;
        } else {
            heroActions.innerHTML = `
                <button onclick="showPage('products')" class="btn-primary flex items-center justify-center">
                    Shop Now <i data-lucide="shopping-bag" class="ml-2 w-5 h-5"></i>
                </button>
            `;
        }
        lucide.createIcons();
    }
    
    if (ctaButtons) {
        ctaButtons.style.display = 'none';
    }
}

// Update UI for unauthenticated user
function updateUIForUnauthenticatedUser() {
    // Show auth buttons
    const authButtons = document.getElementById('auth-buttons');
    const mobileAuth = document.getElementById('mobile-auth');
    if (authButtons) authButtons.style.display = 'block';
    if (mobileAuth) mobileAuth.style.display = 'block';
    
    // Hide user info
    const userInfo = document.getElementById('user-info');
    const mobileUserInfo = document.getElementById('mobile-user-info');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (userInfo) userInfo.style.display = 'none';
    if (mobileUserInfo) mobileUserInfo.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    // Hide role-specific elements
    const customerElements = document.querySelectorAll('.customer-only');
    const adminElements = document.querySelectorAll('.admin-only');
    
    customerElements.forEach(el => el.style.display = 'none');
    adminElements.forEach(el => el.style.display = 'none');
    
    // Update hero actions
    const heroActions = document.getElementById('hero-actions');
    const ctaButtons = document.getElementById('cta-buttons');
    
    if (heroActions) {
        heroActions.innerHTML = `
            <button onclick="showPage('signup')" class="btn-primary flex items-center justify-center">
                Get Started <i data-lucide="arrow-right" class="ml-2 w-5 h-5"></i>
            </button>
            <button onclick="showPage('login')" class="btn-secondary flex items-center justify-center">
                Sign In
            </button>
        `;
        lucide.createIcons();
    }
    
    if (ctaButtons) {
        ctaButtons.style.display = 'flex';
    }
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    
    lucide.createIcons();
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            await login(email, password);
        });
    }
    
    // Handle signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('signup-fullname').value;
            const email = document.getElementById('signup-email').value;
            const role = document.getElementById('signup-role').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            
            if (password !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }
            
            await signup(email, password, fullName, role);
        });
    }
});