/**
 * π∞ Pi Challenge - Ad Integration
 * 
 * Supports:
 * - Google AdSense (Web)
 * - Google AdMob (Mobile via Capacitor)
 * - Placeholder mode for development
 */

class AdManager {
    constructor() {
        this.isMobile = this.detectMobile();
        this.adMobInitialized = false;
        this.bannerAd = null;
        this.rewardedAd = null;
        this.adUnitIds = {
              // Replace with your actual ad unit IDs
              banner: {
                 web: {
                     publisherId: 'pub-7515048306007823', // AdSense publisher ID (as shown in your account)
                     slotId: null // Ad unit slot ID (create an ad unit in AdSense to get this)
                 },
                 // Google's public TEST ad units. Replace with your real AdMob units before release
                 // and set adMobTesting = false.
                 android: 'ca-app-pub-3940256099942544/6300978111',
                 ios: 'ca-app-pub-3940256099942544/2934735716'
              },
            rewarded: {
                android: 'ca-app-pub-3940256099942544/5224354917',
                ios: 'ca-app-pub-3940256099942544/1712485313'
            }
        };
        
        // Check if we're in a Capacitor app
        this.isCapacitor = typeof Capacitor !== 'undefined';
        this.isNative = this.isCapacitor && Capacitor.isNativePlatform();
        this.adMobTesting = true; // set to false for the release build
        
        // Initialize based on platform
        if (this.isNative) {
            this.initAdMob();
        } else {
            this.initAdSense();
        }
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // ========================================
    // AdMob (Mobile - Capacitor)
    // ========================================
    // The plugin is reached through Capacitor.Plugins (no bundler, so no ES import).

    get adMob() {
        return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AdMob;
    }

    get platform() {
        return window.Capacitor.getPlatform() === 'ios' ? 'ios' : 'android';
    }

    async initAdMob() {
        const AdMob = this.adMob;
        if (!AdMob) {
            console.warn('AdMob plugin not available, using placeholder');
            this.initPlaceholder();
            return;
        }

        try {
            await AdMob.initialize({
                initializeForTesting: this.adMobTesting
            });
            // iOS 14+ ATT prompt (no-op elsewhere); ads still load if the user declines
            try { await AdMob.requestTrackingAuthorization(); } catch (e) { /* ignore */ }

            this.adMobInitialized = true;
            console.log('✓ AdMob initialized');
            this.showBannerAd();
            this.loadRewardedAd();
        } catch (error) {
            console.warn('AdMob init failed, using placeholder:', error);
            this.initPlaceholder();
        }
    }

    async showBannerAd() {
        if (this.isNative && this.adMobInitialized) {
            try {
                await this.adMob.showBanner({
                    adId: this.adUnitIds.banner[this.platform],
                    adSize: 'ADAPTIVE_BANNER',
                    position: 'BOTTOM_CENTER',
                    margin: 0,
                    isTesting: this.adMobTesting
                });
                console.log('✓ Banner ad shown');
            } catch (error) {
                console.error('Failed to show banner ad:', error);
            }
        } else {
            this.showPlaceholderBanner();
        }
    }

    async hideBannerAd() {
        if (this.isNative && this.adMobInitialized) {
            try {
                await this.adMob.hideBanner();
            } catch (error) {
                console.error('Failed to hide banner ad:', error);
            }
        }
    }

    async loadRewardedAd() {
        if (this.isNative && this.adMobInitialized) {
            try {
                await this.adMob.prepareRewardVideoAd({
                    adId: this.adUnitIds.rewarded[this.platform],
                    isTesting: this.adMobTesting
                });
                this.rewardedAd = true;
                console.log('✓ Rewarded ad loaded');
                return true;
            } catch (error) {
                console.error('Failed to load rewarded ad:', error);
                this.rewardedAd = null;
                return false;
            }
        }
        return false;
    }

    async showRewardedAd() {
        if (!(this.isNative && this.adMobInitialized && this.rewardedAd)) {
            // Web / not ready: placeholder flow
            if (this.isNative) return { success: false, reason: 'not_ready' };
            return new Promise(resolve => this.showPlaceholderRewardedAd(resolve));
        }

        const AdMob = this.adMob;
        return new Promise(async (resolve) => {
            let rewarded = false;
            const handles = [];
            const finish = (result) => {
                handles.forEach(h => h.remove());
                this.rewardedAd = null;
                this.loadRewardedAd(); // preload the next one
                resolve(result);
            };

            handles.push(await AdMob.addListener('onRewardedVideoAdReward', () => { rewarded = true; }));
            handles.push(await AdMob.addListener('onRewardedVideoAdDismissed', () => {
                finish(rewarded ? { success: true, reward: { lives: 5 } } : { success: false, reason: 'closed' });
            }));
            handles.push(await AdMob.addListener('onRewardedVideoAdFailedToShow', () => {
                finish({ success: false, reason: 'failed' });
            }));

            try {
                await AdMob.showRewardVideoAd();
            } catch (error) {
                finish({ success: false, reason: 'failed' });
            }
        });
    }

    // ========================================
    // AdSense (Web)
    // ========================================
    
    initAdSense() {
        // Check if AdSense script is already loaded
        if (document.getElementById('adsense-script')) return;
        
        // Get publisher ID (support both old string format and new object format)
        const bannerConfig = this.adUnitIds.banner.web;
        let publisherId, slotId;
        
        if (typeof bannerConfig === 'string') {
            // Old format: just publisher ID
            publisherId = bannerConfig;
            slotId = null;
        } else {
            // New format: object with publisherId and slotId
            publisherId = bannerConfig.publisherId;
            slotId = bannerConfig.slotId;
        }
        
        if (!publisherId || publisherId.includes('XXXXXXXXXXXXXXXX')) {
            console.log('AdSense not configured, using placeholder');
            this.initPlaceholder();
            return;
        }
        
        // AdSense requires 'ca-pub-' prefix in the URL even if account shows 'pub-'
        const clientId = publisherId.startsWith('ca-pub-') ? publisherId : `ca-${publisherId}`;
        
        // Ensure banner container is visible
        const bannerContainer = document.getElementById('bannerAd');
        if (bannerContainer) {
            bannerContainer.style.display = 'flex'; // Make sure it's visible
        }
        
        // Load AdSense script
        const script = document.createElement('script');
        script.id = 'adsense-script';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
        
        // Store slot ID for later use
        this.adsenseSlotId = slotId;
        
        // Show banner ad after script loads and DOM is ready
        script.onload = () => {
            // Wait for DOM to be fully ready and container to be visible
            const initAd = () => {
                // Double-check container is visible
                if (bannerContainer) {
                    bannerContainer.style.display = 'flex';
                }
                setTimeout(() => this.showAdSenseBanner(), 300);
            };
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initAd);
            } else {
                initAd();
            }
        };
        
        script.onerror = () => {
            console.error('Failed to load AdSense script');
            this.initPlaceholder();
        };
    }
    
    showAdSenseBanner() {
        const bannerContainer = document.getElementById('bannerAd');
        if (!bannerContainer) {
            console.warn('Banner ad container not found');
            return;
        }
        
        // Ensure container is visible
        bannerContainer.style.display = 'flex';
        
        // Wait for container to be visible and have dimensions
        let attempts = 0;
        const maxAttempts = 20; // Max 2 seconds
        
        const checkContainer = () => {
            attempts++;
            const rect = bannerContainer.getBoundingClientRect();
            
            // Check if container has dimensions
            if (rect.width === 0 || rect.height === 0) {
                if (attempts < maxAttempts) {
                    // Container not ready yet, try again
                    setTimeout(checkContainer, 100);
                    return;
                } else {
                    console.warn('Banner container still has zero dimensions after waiting');
                    // Force dimensions
                    bannerContainer.style.width = '100%';
                    bannerContainer.style.minHeight = '32px';
                }
            }
            
            // Clear placeholder
            let container = bannerContainer.querySelector('.banner-ad-placeholder');
            if (!container) {
                // Create container if it doesn't exist
                container = document.createElement('div');
                container.className = 'banner-ad-content';
                bannerContainer.appendChild(container);
            } else {
                container.innerHTML = '';
            }
            
            container.style.width = '100%';
            container.style.minHeight = '32px';
            container.style.maxHeight = '32px';
            container.style.display = 'block';
            
            // Get publisher ID and slot ID
            const bannerConfig = this.adUnitIds.banner.web;
            let publisherId, slotId;
            
            if (typeof bannerConfig === 'string') {
                publisherId = bannerConfig;
                slotId = this.adsenseSlotId || null;
            } else {
                publisherId = bannerConfig.publisherId;
                slotId = bannerConfig.slotId || this.adsenseSlotId || null;
            }
            
            // AdSense requires 'ca-pub-' prefix even if account shows 'pub-'
            const clientId = publisherId.startsWith('ca-pub-') 
                ? publisherId 
                : `ca-${publisherId}`;
            
            // Create AdSense ad
            const adDiv = document.createElement('ins');
            adDiv.className = 'adsbygoogle';
            adDiv.style.display = 'block';
            adDiv.style.width = '100%';
            adDiv.style.minHeight = '32px';
            adDiv.style.maxHeight = '32px';
            adDiv.style.overflow = 'hidden';
            adDiv.setAttribute('data-ad-client', clientId);
            
            if (slotId) {
                // Use specific ad unit with slot ID (recommended)
                adDiv.setAttribute('data-ad-slot', slotId);
                adDiv.setAttribute('data-ad-format', 'horizontal');
                adDiv.setAttribute('data-ad-layout', 'in-article');
                adDiv.setAttribute('data-full-width-responsive', 'true');
                console.log('Using AdSense ad unit with slot ID:', slotId);
            } else {
                // Use responsive format without slot ID (works with Auto Ads)
                // This will work once Auto Ads are enabled in AdSense
                adDiv.setAttribute('data-ad-format', 'horizontal');
                adDiv.setAttribute('data-full-width-responsive', 'true');
                console.log('Using Auto Ads format. Make sure Auto Ads are enabled in your AdSense account.');
                console.log('Note: Ads may not show until your site is approved by AdSense.');
            }
            
            container.appendChild(adDiv);
            
            // Wait a bit more to ensure container is fully rendered
            setTimeout(() => {
                // Push ad to AdSense
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    console.log('✓ AdSense banner ad request sent');
                    
                    // Check if ad loaded after a delay
                    setTimeout(() => {
                        const adElement = container.querySelector('.adsbygoogle');
                        if (adElement && adElement.offsetHeight === 0) {
                            console.warn('AdSense ad may not have loaded. This could be because:');
                            console.warn('1. Your site is not yet approved by AdSense');
                            console.warn('2. You need to create an ad unit and add the slot ID');
                            console.warn('3. AdSense needs time to crawl your site');
                        }
                    }, 2000);
                } catch (error) {
                    console.error('Failed to load AdSense ad:', error);
                    this.showPlaceholderBanner();
                }
            }, 300);
        };
        
        // Start checking
        checkContainer();
    }
    
    // ========================================
    // Placeholder Mode (Development)
    // ========================================
    
    initPlaceholder() {
        console.log('📺 Ad system in placeholder mode (development)');
        this.showPlaceholderBanner();
    }
    
    showPlaceholderBanner() {
        const bannerContainer = document.getElementById('bannerAd');
        if (!bannerContainer) return;
        
        const placeholder = bannerContainer.querySelector('.banner-ad-placeholder');
        if (placeholder) {
            placeholder.innerHTML = '<span class="banner-ad-text">Advertisement</span>';
            placeholder.style.cursor = 'default';
        }
    }
    
    showPlaceholderRewardedAd(callback) {
        // Simulate watching an ad
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: Arial, sans-serif;
        `;
        
        modal.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2 style="color: #00f5d4; margin-bottom: 20px;">📺 Ad Placeholder</h2>
                <p style="margin-bottom: 30px;">In production, this would show a real rewarded video ad.</p>
                <div style="width: 320px; height: 240px; background: #1a1a3a; border: 2px solid #00f5d4; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                    <span style="font-size: 48px;">📺</span>
                </div>
                <p style="color: #888; margin-bottom: 20px;">Simulating 5 second ad...</p>
                <button id="skipAdBtn" style="padding: 10px 20px; background: #00f5d4; color: #0a0a1a; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    Skip (Dev Mode)
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        let timeLeft = 5;
        const skipBtn = document.getElementById('skipAdBtn');
        const updateText = () => {
            const textEl = modal.querySelector('p:last-of-type');
            if (textEl && timeLeft > 0) {
                textEl.textContent = `Simulating ${timeLeft} second ad...`;
                timeLeft--;
            } else if (timeLeft === 0) {
                modal.remove();
                callback({ success: true, reward: { lives: 5 } });
            }
        };
        
        // Auto-complete after 5 seconds
        const interval = setInterval(() => {
            updateText();
            if (timeLeft < 0) {
                clearInterval(interval);
            }
        }, 1000);
        
        // Allow skip in dev mode
        skipBtn.addEventListener('click', () => {
            clearInterval(interval);
            modal.remove();
            callback({ success: true, reward: { lives: 5 } });
        });
    }
}

// Export for use in app.js
window.AdManager = AdManager;
