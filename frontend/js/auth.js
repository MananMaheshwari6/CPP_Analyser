// Handle authentication-related functionality
class AuthManager {
    constructor() {
        this.user = null;
        this.isAuthenticated = false;
        // Only need logout button logic
        this.init();
    }

    // Initialize auth state
    async init() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                this.user = JSON.parse(storedUser);
                this.isAuthenticated = true;
                this.updateUI();
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        await this.checkAuthStatus();
    }

    // Check authentication status with server
    async checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const userData = await response.json();
                this.user = userData;
                this.isAuthenticated = true;
                localStorage.setItem('user', JSON.stringify({
                    id: userData._id,
                    username: userData.username
                }));
            } else {
                this.user = null;
                this.isAuthenticated = false;
                localStorage.removeItem('user');
            }
            this.updateUI();
        } catch (error) {
            this.isAuthenticated = false;
            this.user = null;
            this.updateUI();
        }
    }

    // Logout function
    async logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            this.user = null;
            this.isAuthenticated = false;
            localStorage.removeItem('user');
            this.updateUI();
            window.location.href = 'register.html';
        } catch (error) {}
    }

    // Update UI based on authentication state
    updateUI() {
        document.dispatchEvent(new CustomEvent('authStateChanged', {
            detail: { isAuthenticated: this.isAuthenticated, user: this.user }
        }));
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.authManager.logout();
        });
    }
});
