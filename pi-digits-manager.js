/**
 * π∞ Pi Digits Manager
 * 
 * Handles Pi digit retrieval with:
 * - 100,000 digits available offline
 * - Unlimited digits via API when online
 * - Smart caching and prefetching
 */

class PiDigitsManager {
    constructor() {
        // Offline digits (loaded from pi-digits.js)
        this.offlineDigits = typeof PI_OFFLINE_DIGITS !== 'undefined' ? PI_OFFLINE_DIGITS : '';
        this.offlineLimit = this.offlineDigits.length;
        
        // Online/cached digits beyond offline limit
        this.extendedDigits = '';
        this.totalAvailable = this.offlineLimit;
        
        // API configuration
        this.apiUrl = 'https://api.pi.delivery/v1/pi';
        this.fetchChunkSize = 10000; // Fetch 10k digits at a time
        this.prefetchThreshold = 1000; // Start prefetching when within 1000 of limit
        
        // State
        this.isFetching = false;
        this.fetchPromise = null;
        this.isOnline = navigator.onLine;
        this.hasApiError = false;
        
        // Listen for online/offline events
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.hasApiError = false;
        });
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
        
        // Load any cached extended digits from localStorage
        this.loadCachedDigits();
        
        console.log(`PiDigitsManager initialized: ${this.offlineLimit.toLocaleString()} offline digits`);
    }
    
    /**
     * Get a digit at a specific index (0-based, after decimal)
     * Returns null if digit not available
     */
    getDigit(index) {
        // Check offline digits first
        if (index < this.offlineLimit) {
            return this.offlineDigits[index];
        }
        
        // Check extended digits
        const extendedIndex = index - this.offlineLimit;
        if (extendedIndex < this.extendedDigits.length) {
            return this.extendedDigits[extendedIndex];
        }
        
        return null;
    }
    
    /**
     * Check if a digit is available
     */
    hasDigit(index) {
        return index < this.totalAvailable;
    }
    
    /**
     * Get total available digits
     */
    getTotalAvailable() {
        return this.totalAvailable;
    }
    
    /**
     * Check if we're near the limit and should prefetch
     */
    shouldPrefetch(currentIndex) {
        return (
            this.isOnline && 
            !this.hasApiError &&
            !this.isFetching &&
            currentIndex >= this.totalAvailable - this.prefetchThreshold
        );
    }
    
    /**
     * Prefetch more digits if approaching limit
     */
    async prefetchIfNeeded(currentIndex) {
        if (this.shouldPrefetch(currentIndex)) {
            await this.fetchMoreDigits();
        }
    }
    
    /**
     * Fetch more digits from API
     */
    async fetchMoreDigits() {
        if (this.isFetching || !this.isOnline || this.hasApiError) {
            return this.fetchPromise;
        }
        
        this.isFetching = true;
        const startIndex = this.totalAvailable;
        
        console.log(`Fetching digits ${startIndex.toLocaleString()} - ${(startIndex + this.fetchChunkSize).toLocaleString()}...`);
        
        this.fetchPromise = (async () => {
            try {
                const response = await fetch(
                    `${this.apiUrl}?start=${startIndex}&numberOfDigits=${this.fetchChunkSize}`,
                    { 
                        timeout: 10000,
                        headers: { 'Accept': 'application/json' }
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.content) {
                    this.extendedDigits += data.content;
                    this.totalAvailable = this.offlineLimit + this.extendedDigits.length;
                    this.cacheDigits();
                    
                    console.log(`✓ Fetched! Total available: ${this.totalAvailable.toLocaleString()} digits`);
                }
                
            } catch (error) {
                console.error('Failed to fetch Pi digits:', error);
                this.hasApiError = true;
                
                // Retry after 30 seconds
                setTimeout(() => {
                    this.hasApiError = false;
                }, 30000);
            } finally {
                this.isFetching = false;
            }
        })();
        
        return this.fetchPromise;
    }
    
    /**
     * Force fetch digits up to a specific index
     */
    async ensureDigitsUpTo(index) {
        while (index >= this.totalAvailable && this.isOnline && !this.hasApiError) {
            await this.fetchMoreDigits();
            
            // Safety: break if we couldn't fetch
            if (index >= this.totalAvailable) {
                await new Promise(r => setTimeout(r, 1000));
                if (index >= this.totalAvailable) break;
            }
        }
        
        return this.hasDigit(index);
    }
    
    /**
     * Cache extended digits to localStorage
     */
    cacheDigits() {
        try {
            // Only cache up to 1MB to avoid localStorage limits
            const maxCache = 1000000;
            const toCache = this.extendedDigits.slice(0, maxCache);
            localStorage.setItem('piExtendedDigits', toCache);
            localStorage.setItem('piExtendedDigitsLength', toCache.length.toString());
        } catch (e) {
            console.warn('Could not cache digits:', e);
        }
    }
    
    /**
     * Load cached digits from localStorage
     */
    loadCachedDigits() {
        try {
            const cached = localStorage.getItem('piExtendedDigits');
            if (cached) {
                this.extendedDigits = cached;
                this.totalAvailable = this.offlineLimit + this.extendedDigits.length;
                console.log(`Loaded ${this.extendedDigits.length.toLocaleString()} cached extended digits`);
            }
        } catch (e) {
            console.warn('Could not load cached digits:', e);
        }
    }
    
    /**
     * Clear cached digits
     */
    clearCache() {
        this.extendedDigits = '';
        this.totalAvailable = this.offlineLimit;
        localStorage.removeItem('piExtendedDigits');
        localStorage.removeItem('piExtendedDigitsLength');
    }
    
    /**
     * Get status info
     */
    getStatus() {
        return {
            offlineDigits: this.offlineLimit,
            extendedDigits: this.extendedDigits.length,
            totalAvailable: this.totalAvailable,
            isOnline: this.isOnline,
            isFetching: this.isFetching,
            hasApiError: this.hasApiError
        };
    }
}

// Export for use
window.PiDigitsManager = PiDigitsManager;



