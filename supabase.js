/**
 * π∞ Pi Challenge - Supabase Backend Integration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://supabase.com and create a free account
 * 2. Create a new project
 * 3. Go to SQL Editor and run the schema.sql file
 * 4. Go to Settings > API and copy your URL and anon key
 * 5. Replace the values below
 */

// =============================================
// CONFIGURATION - Replace with your Supabase credentials
// =============================================
const SUPABASE_URL = 'YOUR_SUPABASE_URL'; // e.g., 'https://xxxxx.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'; // e.g., 'eyJhbGc...'

// =============================================
// Supabase Client
// =============================================
class SupabaseClient {
    constructor() {
        this.url = SUPABASE_URL;
        this.key = SUPABASE_ANON_KEY;
        this.accessToken = null;
        this.user = null;
        this.profile = null;
        this.isConfigured = this.url !== 'YOUR_SUPABASE_URL';
        
        if (this.isConfigured) {
            this.init();
        } else {
            console.warn('Supabase not configured. Running in offline mode.');
        }
    }
    
    async init() {
        // Check for existing session
        const savedSession = localStorage.getItem('supabase_session');
        if (savedSession) {
            try {
                const session = JSON.parse(savedSession);
                if (session.expires_at > Date.now() / 1000) {
                    this.accessToken = session.access_token;
                    this.user = session.user;
                    await this.loadProfile();
                } else {
                    // Try to refresh
                    await this.refreshSession(session.refresh_token);
                }
            } catch (e) {
                console.error('Session restore failed:', e);
                localStorage.removeItem('supabase_session');
            }
        }
    }
    
    // =============================================
    // HTTP Helpers
    // =============================================
    
    async fetch(endpoint, options = {}) {
        const headers = {
            'apikey': this.key,
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        
        const response = await fetch(`${this.url}${endpoint}`, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || error.error_description || 'Request failed');
        }
        
        return response.json();
    }
    
    async rpc(functionName, params = {}) {
        return this.fetch(`/rest/v1/rpc/${functionName}`, {
            method: 'POST',
            body: JSON.stringify(params)
        });
    }
    
    // =============================================
    // Authentication
    // =============================================
    
    async signUp(email, password, username) {
        const data = await this.fetch('/auth/v1/signup', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                data: { username }
            })
        });
        
        if (data.access_token) {
            this.saveSession(data);
            await this.loadProfile();
        }
        
        return data;
    }
    
    async signIn(email, password) {
        const data = await this.fetch('/auth/v1/token?grant_type=password', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (data.access_token) {
            this.saveSession(data);
            await this.loadProfile();
        }
        
        return data;
    }
    
    async signInWithProvider(provider) {
        // OAuth flow - opens popup
        const redirectUrl = window.location.origin;
        window.location.href = `${this.url}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectUrl}`;
    }
    
    async signOut() {
        if (this.accessToken) {
            try {
                await this.fetch('/auth/v1/logout', { method: 'POST' });
            } catch (e) {
                console.error('Logout error:', e);
            }
        }
        
        this.accessToken = null;
        this.user = null;
        this.profile = null;
        localStorage.removeItem('supabase_session');
    }
    
    async refreshSession(refreshToken) {
        try {
            const data = await this.fetch('/auth/v1/token?grant_type=refresh_token', {
                method: 'POST',
                body: JSON.stringify({ refresh_token: refreshToken })
            });
            
            if (data.access_token) {
                this.saveSession(data);
                await this.loadProfile();
            }
            
            return data;
        } catch (e) {
            console.error('Session refresh failed:', e);
            this.signOut();
            throw e;
        }
    }
    
    saveSession(data) {
        this.accessToken = data.access_token;
        this.user = data.user;
        
        localStorage.setItem('supabase_session', JSON.stringify({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at || (Date.now() / 1000 + data.expires_in),
            user: data.user
        }));
    }
    
    isAuthenticated() {
        return !!this.accessToken && !!this.user;
    }
    
    // =============================================
    // Profile
    // =============================================
    
    async loadProfile() {
        if (!this.user) return null;
        
        const data = await this.fetch(`/rest/v1/profiles?id=eq.${this.user.id}&select=*`, {
            headers: { 'Accept': 'application/vnd.pgrst.object+json' }
        });
        
        this.profile = data;
        return data;
    }
    
    async updateProfile(updates) {
        if (!this.user) throw new Error('Not authenticated');
        
        await this.fetch(`/rest/v1/profiles?id=eq.${this.user.id}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
            headers: { 'Prefer': 'return=minimal' }
        });
        
        // Reload profile
        return this.loadProfile();
    }
    
    async checkUsername(username) {
        const data = await this.fetch(`/rest/v1/profiles?username=eq.${username}&select=id`);
        return data.length === 0; // true if available
    }
    
    // =============================================
    // Game Actions
    // =============================================
    
    async useLife() {
        if (!this.isAuthenticated()) {
            // Offline mode - use localStorage
            return { success: true, lives: this.getOfflineLives() - 1 };
        }
        
        return this.rpc('use_life');
    }
    
    async addLives(amount, source = 'purchase') {
        if (!this.isAuthenticated()) {
            return { success: true, lives: this.getOfflineLives() + amount };
        }
        
        const result = await this.rpc('add_lives', { p_amount: amount, p_source: source });
        await this.loadProfile();
        return result;
    }
    
    async startGameSession() {
        if (!this.isAuthenticated()) {
            return { id: 'offline_' + Date.now() };
        }
        
        const data = await this.fetch('/rest/v1/game_sessions', {
            method: 'POST',
            body: JSON.stringify({
                user_id: this.user.id,
                started_at: new Date().toISOString()
            }),
            headers: { 
                'Prefer': 'return=representation',
                'Accept': 'application/vnd.pgrst.object+json'
            }
        });
        
        return data;
    }
    
    async submitScore(sessionId, scoreData) {
        if (!this.isAuthenticated() || sessionId.startsWith('offline_')) {
            // Offline mode - save to localStorage
            this.saveOfflineScore(scoreData);
            return { success: true, is_valid: true, offline: true };
        }
        
        return this.rpc('submit_game_score', {
            p_session_id: sessionId,
            p_digits: scoreData.digits,
            p_time_ms: scoreData.timeMs,
            p_suspicion_score: scoreData.suspicionScore,
            p_avg_input_time: scoreData.avgInputTime,
            p_input_variance: scoreData.inputVariance
        });
    }
    
    // =============================================
    // Leaderboards
    // =============================================
    
    async getSpeedLeaderboard(milestone, limit = 100) {
        if (!this.isConfigured) {
            return this.getOfflineLeaderboard('speed', milestone);
        }
        
        const data = await this.fetch(
            `/rest/v1/speed_records?digit_milestone=eq.${milestone}&select=*&order=time_ms.asc&limit=${limit}`
        );
        
        return data;
    }
    
    async getEnduranceLeaderboard(limit = 100) {
        if (!this.isConfigured) {
            return this.getOfflineLeaderboard('endurance');
        }
        
        // Get best score per user
        const data = await this.fetch(
            `/rest/v1/leaderboard_endurance?select=*&order=max_digits.desc&limit=${limit}`
        );
        
        return data;
    }
    
    async getUserRank(userId, type = 'endurance') {
        if (!this.isConfigured) return null;
        
        // This would need a custom RPC function for accurate ranking
        // Simplified version - count users with higher scores
        const profile = await this.fetch(
            `/rest/v1/profiles?id=eq.${userId}&select=best_digits`,
            { headers: { 'Accept': 'application/vnd.pgrst.object+json' } }
        );
        
        const higher = await this.fetch(
            `/rest/v1/profiles?best_digits=gt.${profile.best_digits}&select=id`
        );
        
        return higher.length + 1;
    }
    
    // =============================================
    // Offline Mode Helpers
    // =============================================
    
    getOfflineLives() {
        const saved = localStorage.getItem('piGameLives');
        return saved !== null ? parseInt(saved) : 3;
    }
    
    setOfflineLives(lives) {
        localStorage.setItem('piGameLives', lives);
    }
    
    saveOfflineScore(scoreData) {
        // Save to localStorage leaderboard
        const endurance = JSON.parse(localStorage.getItem('piGame_enduranceLeaderboard') || '[]');
        const name = localStorage.getItem('piGameName') || 'You';
        
        endurance.push({
            name,
            username: name,
            max_digits: scoreData.digits,
            time_ms: scoreData.timeMs,
            created_at: new Date().toISOString()
        });
        
        endurance.sort((a, b) => b.max_digits - a.max_digits);
        localStorage.setItem('piGame_enduranceLeaderboard', JSON.stringify(endurance.slice(0, 100)));
        
        // Speed records
        const milestones = [10, 20, 50, 100, 200, 500, 1000];
        const speedData = JSON.parse(localStorage.getItem('piGame_speedLeaderboard') || '{}');
        
        milestones.forEach(milestone => {
            if (scoreData.digits >= milestone) {
                const key = `speed_${milestone}`;
                if (!speedData[key]) speedData[key] = [];
                
                const existing = speedData[key].findIndex(r => r.name === name);
                if (existing >= 0) {
                    if (speedData[key][existing].time_ms > scoreData.timeMs) {
                        speedData[key][existing].time_ms = scoreData.timeMs;
                    }
                } else {
                    speedData[key].push({
                        name,
                        username: name,
                        time_ms: scoreData.timeMs,
                        created_at: new Date().toISOString()
                    });
                }
                
                speedData[key].sort((a, b) => a.time_ms - b.time_ms);
            }
        });
        
        localStorage.setItem('piGame_speedLeaderboard', JSON.stringify(speedData));
    }
    
    getOfflineLeaderboard(type, milestone = null) {
        if (type === 'endurance') {
            return JSON.parse(localStorage.getItem('piGame_enduranceLeaderboard') || '[]');
        } else {
            const data = JSON.parse(localStorage.getItem('piGame_speedLeaderboard') || '{}');
            return data[`speed_${milestone}`] || [];
        }
    }
}

// =============================================
// Auth UI Component
// =============================================
class AuthUI {
    constructor(supabase, onAuthChange) {
        this.supabase = supabase;
        this.onAuthChange = onAuthChange;
        this.modal = null;
        this.createModal();
    }
    
    createModal() {
        // Create auth modal HTML
        const modalHtml = `
            <div class="modal" id="authModal">
                <div class="modal-content auth-modal">
                    <button class="modal-close" id="closeAuth">×</button>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">Sign In</button>
                        <button class="auth-tab" data-tab="signup">Sign Up</button>
                    </div>
                    
                    <!-- Login Form -->
                    <form class="auth-form active" id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" required placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" required placeholder="••••••••">
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Sign In</button>
                        <div class="auth-error" id="loginError"></div>
                    </form>
                    
                    <!-- Signup Form -->
                    <form class="auth-form" id="signupForm">
                        <div class="form-group">
                            <label for="signupUsername">Username</label>
                            <input type="text" id="signupUsername" required placeholder="pi_master" 
                                   pattern="[a-zA-Z0-9_]+" maxlength="20" minlength="3">
                            <span class="form-hint">3-20 characters, letters/numbers/underscore only</span>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">Email</label>
                            <input type="email" id="signupEmail" required placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">Password</label>
                            <input type="password" id="signupPassword" required placeholder="••••••••" minlength="6">
                        </div>
                        <button type="submit" class="btn btn-primary btn-full">Create Account</button>
                        <div class="auth-error" id="signupError"></div>
                    </form>
                    
                    <div class="auth-divider">
                        <span>or continue with</span>
                    </div>
                    
                    <div class="social-auth">
                        <button class="btn btn-social btn-google" id="googleAuth">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Google
                        </button>
                        <button class="btn btn-social btn-discord" id="discordAuth">
                            <svg viewBox="0 0 24 24" width="20" height="20">
                                <path fill="currentColor" d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                            Discord
                        </button>
                    </div>
                    
                    <p class="auth-note">
                        Play as guest? <a href="#" id="playAsGuest">Continue without account</a>
                    </p>
                </div>
            </div>
        `;
        
        // Append to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.modal = document.getElementById('authModal');
        
        // Bind events
        this.bindEvents();
    }
    
    bindEvents() {
        // Close button
        document.getElementById('closeAuth').addEventListener('click', () => this.close());
        
        // Tab switching
        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
        
        // Login form
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
        
        // Signup form
        document.getElementById('signupForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSignup();
        });
        
        // Social auth
        document.getElementById('googleAuth').addEventListener('click', () => {
            this.supabase.signInWithProvider('google');
        });
        
        document.getElementById('discordAuth').addEventListener('click', () => {
            this.supabase.signInWithProvider('discord');
        });
        
        // Play as guest
        document.getElementById('playAsGuest').addEventListener('click', (e) => {
            e.preventDefault();
            this.close();
        });
        
        // Username availability check
        let usernameTimeout;
        document.getElementById('signupUsername').addEventListener('input', (e) => {
            clearTimeout(usernameTimeout);
            usernameTimeout = setTimeout(() => this.checkUsername(e.target.value), 500);
        });
    }
    
    switchTab(tab) {
        document.querySelectorAll('.auth-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        document.getElementById('loginForm').classList.toggle('active', tab === 'login');
        document.getElementById('signupForm').classList.toggle('active', tab === 'signup');
    }
    
    async handleLogin() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorEl = document.getElementById('loginError');
        
        try {
            errorEl.textContent = '';
            await this.supabase.signIn(email, password);
            this.close();
            this.onAuthChange(true);
        } catch (e) {
            errorEl.textContent = e.message;
        }
    }
    
    async handleSignup() {
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const errorEl = document.getElementById('signupError');
        
        try {
            errorEl.textContent = '';
            
            // Check username availability
            const available = await this.supabase.checkUsername(username);
            if (!available) {
                errorEl.textContent = 'Username already taken';
                return;
            }
            
            await this.supabase.signUp(email, password, username);
            this.close();
            this.onAuthChange(true);
        } catch (e) {
            errorEl.textContent = e.message;
        }
    }
    
    async checkUsername(username) {
        if (username.length < 3) return;
        
        const available = await this.supabase.checkUsername(username);
        const input = document.getElementById('signupUsername');
        input.style.borderColor = available ? 'var(--success)' : 'var(--error)';
    }
    
    open() {
        this.modal.classList.add('active');
    }
    
    close() {
        this.modal.classList.remove('active');
    }
}

// Export for use in app.js
window.SupabaseClient = SupabaseClient;
window.AuthUI = AuthUI;



