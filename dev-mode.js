/**
 * π∞ Developer/Testing Mode
 * 
 * Activate: 
 *   - URL: Add ?dev=true to URL (e.g., http://localhost:8080?dev=true)
 *   - Keyboard: Press Ctrl+Shift+D during gameplay
 * 
 * Features:
 *   - Auto-play: Automatically enter correct digits
 *   - Speed control: Adjust auto-play speed
 *   - Jump to digit: Skip to any digit count
 *   - Unlimited lives in dev mode
 *   - Debug panel with stats
 */

class DevMode {
    constructor(game) {
        this.game = game;
        this.isEnabled = false;
        this.isAutoPlaying = false;
        this.autoPlaySpeed = 50; // ms between digits
        this.autoPlayInterval = null;
        this.debugPanel = null;
        
        // Check URL for dev mode
        const params = new URLSearchParams(window.location.search);
        if (params.get('dev') === 'true') {
            this.enable();
        }
        
        // Keyboard shortcut: Ctrl+Shift+D
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    toggle() {
        if (this.isEnabled) {
            this.disable();
        } else {
            this.enable();
        }
    }
    
    enable() {
        this.isEnabled = true;
        this.game.lives = 999; // Unlimited lives
        this.game.devModeActive = true; // Disable anti-cheat
        this.game.updateUI();
        this.createDebugPanel();
        console.log('🔧 Dev Mode ENABLED');
        console.log('Controls:');
        console.log('  [A] Toggle Auto-play');
        console.log('  [+/-] Adjust speed');
        console.log('  [J] Jump to digit');
        console.log('  [R] Reset game');
        console.log('  [L] Add 100 to leaderboard');
        console.log('  [Ctrl+Shift+D] Toggle Dev Mode');
    }
    
    disable() {
        this.isEnabled = false;
        this.stopAutoPlay();
        this.removeDebugPanel();
        this.game.lives = this.game.loadLives();
        this.game.devModeActive = false; // Re-enable anti-cheat
        this.game.updateUI();
        console.log('🔧 Dev Mode DISABLED');
    }
    
    createDebugPanel() {
        if (this.debugPanel) return;
        
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'devPanel';
        this.debugPanelCollapsed = false;
        this.debugPanel.innerHTML = `
            <style>
                #devPanel {
                    position: fixed;
                    top: 80px;
                    right: 0;
                    width: 300px;
                    max-height: calc(100vh - 100px);
                    background: rgba(0, 0, 0, 0.95);
                    border: 2px solid #00f5d4;
                    border-right: none;
                    border-radius: 12px 0 0 12px;
                    padding: 15px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 12px;
                    color: #fff;
                    z-index: 9999;
                    box-shadow: -4px 0 30px rgba(0, 245, 212, 0.3);
                    transition: transform 0.3s ease;
                    overflow-y: auto;
                }
                #devPanel.collapsed {
                    transform: translateX(calc(100% - 50px));
                }
                #devPanel .dev-toggle {
                    position: absolute;
                    left: -30px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 30px;
                    height: 60px;
                    background: rgba(0, 0, 0, 0.95);
                    border: 2px solid #00f5d4;
                    border-right: none;
                    border-radius: 8px 0 0 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #00f5d4;
                    font-size: 18px;
                    transition: all 0.2s;
                }
                #devPanel .dev-toggle:hover {
                    background: rgba(0, 245, 212, 0.1);
                }
                #devPanel.collapsed .dev-toggle {
                    border-radius: 8px 0 0 8px;
                }
                #devPanel h3 {
                    margin: 0 0 10px 0;
                    color: #00f5d4;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                #devPanel .dev-badge {
                    background: #ff5757;
                    color: #fff;
                    padding: 2px 8px;
                    border-radius: 4px;
                    font-size: 10px;
                }
                #devPanel .dev-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #333;
                }
                #devPanel .dev-label {
                    color: #888;
                }
                #devPanel .dev-value {
                    color: #00f5d4;
                    font-weight: bold;
                }
                #devPanel .dev-controls {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-top: 10px;
                }
                #devPanel button {
                    padding: 8px 12px;
                    font-family: inherit;
                    font-size: 11px;
                    border: 1px solid #444;
                    border-radius: 6px;
                    background: #1a1a3a;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: 100%;
                    text-align: left;
                }
                #devPanel button:hover {
                    background: #2d2d5a;
                    border-color: #00f5d4;
                }
                #devPanel button.active {
                    background: #00f5d4;
                    color: #000;
                    border-color: #00f5d4;
                }
                #devPanel button.danger {
                    background: #5a1a1a;
                    border-color: #ff5757;
                }
                #devPanel button.danger:hover {
                    background: #7a2a2a;
                    border-color: #ff7777;
                }
                #devPanel input[type="range"] {
                    width: 100%;
                    margin: 10px 0;
                }
                #devPanel .speed-display {
                    text-align: center;
                    color: #00f5d4;
                    margin-bottom: 5px;
                }
                @media (max-width: 768px) {
                    #devPanel {
                        width: 250px;
                    }
                }
            </style>
            <div class="dev-toggle" id="devToggle">◀</div>
            <h3>
                🔧 Dev Mode
                <span class="dev-badge">TESTING</span>
            </h3>
            <div class="dev-row">
                <span class="dev-label">Current Digit:</span>
                <span class="dev-value" id="devDigit">0</span>
            </div>
            <div class="dev-row">
                <span class="dev-label">Time:</span>
                <span class="dev-value" id="devTime">0.00s</span>
            </div>
            <div class="dev-row">
                <span class="dev-label">Avg Input:</span>
                <span class="dev-value" id="devAvgInput">0ms</span>
            </div>
            <div class="dev-row">
                <span class="dev-label">Suspicion Score:</span>
                <span class="dev-value" id="devSuspicion">0</span>
            </div>
            <div class="dev-row">
                <span class="dev-label">Pi Available:</span>
                <span class="dev-value" id="devPiAvailable">-</span>
            </div>
            <div class="speed-display">Speed: <span id="devSpeedValue">50</span>ms/digit</div>
            <input type="range" id="devSpeed" min="1" max="500" value="50">
            <div class="dev-controls">
                <button id="devAutoPlay">▶ Auto-Play</button>
                <button id="devJump">⏭ Jump To...</button>
                <button id="devReset">🔄 Reset</button>
                <button id="devFakeScore">📊 Add Fake Scores</button>
                <button id="devClearData">🗑 Clear All Data</button>
                <button id="devClearLeaderboard" class="danger">🗑 Clear Leaderboard (Password)</button>
            </div>
        `;
        
        document.body.appendChild(this.debugPanel);
        this.bindDebugEvents();
        this.startDebugUpdate();
        
        // Toggle panel collapse
        const toggleBtn = document.getElementById('devToggle');
        toggleBtn.addEventListener('click', () => {
            this.togglePanel();
        });
    }
    
    togglePanel() {
        this.debugPanelCollapsed = !this.debugPanelCollapsed;
        if (this.debugPanelCollapsed) {
            this.debugPanel.classList.add('collapsed');
            document.getElementById('devToggle').textContent = '▶';
        } else {
            this.debugPanel.classList.remove('collapsed');
            document.getElementById('devToggle').textContent = '◀';
        }
    }
    
    bindDebugEvents() {
        // Speed slider
        const speedSlider = document.getElementById('devSpeed');
        const speedValue = document.getElementById('devSpeedValue');
        speedSlider.addEventListener('input', (e) => {
            this.autoPlaySpeed = parseInt(e.target.value);
            speedValue.textContent = this.autoPlaySpeed;
            if (this.isAutoPlaying) {
                this.stopAutoPlay();
                this.startAutoPlay();
            }
        });
        
        // Auto-play button
        document.getElementById('devAutoPlay').addEventListener('click', () => {
            if (this.isAutoPlaying) {
                this.stopAutoPlay();
            } else {
                this.startAutoPlay();
            }
        });
        
        // Jump button
        document.getElementById('devJump').addEventListener('click', () => {
            this.jumpToDigit();
        });
        
        // Reset button
        document.getElementById('devReset').addEventListener('click', () => {
            this.stopAutoPlay();
            this.game.showScreen('start');
            this.game.isPlaying = false;
            clearInterval(this.game.timerInterval);
        });
        
        // Fake scores button
        document.getElementById('devFakeScore').addEventListener('click', () => {
            this.addFakeLeaderboardEntries();
        });
        
        // Clear data button
        document.getElementById('devClearData').addEventListener('click', () => {
            if (confirm('Clear all game data? (leaderboards, stats, cache)')) {
                localStorage.clear();
                location.reload();
            }
        });
        
        // Clear leaderboards button with password
        const clearLeaderboardBtn = document.getElementById('devClearLeaderboard');
        if (clearLeaderboardBtn) {
            clearLeaderboardBtn.addEventListener('click', () => {
                this.promptClearLeaderboards();
            });
        }
        
        // Keyboard shortcuts during dev mode
        document.addEventListener('keydown', (e) => {
            if (!this.isEnabled || !this.game.isPlaying) return;
            
            if (e.key === 'a' || e.key === 'A') {
                document.getElementById('devAutoPlay').click();
            } else if (e.key === 'j' || e.key === 'J') {
                this.jumpToDigit();
            } else if (e.key === '+' || e.key === '=') {
                speedSlider.value = Math.max(1, parseInt(speedSlider.value) - 10);
                speedSlider.dispatchEvent(new Event('input'));
            } else if (e.key === '-' || e.key === '_') {
                speedSlider.value = Math.min(500, parseInt(speedSlider.value) + 10);
                speedSlider.dispatchEvent(new Event('input'));
            }
        });
    }
    
    startDebugUpdate() {
        this.debugUpdateInterval = setInterval(() => {
            if (!this.debugPanel) return;
            
            document.getElementById('devDigit').textContent = 
                this.game.currentDigitIndex.toLocaleString();
            
            if (this.game.startTime) {
                const elapsed = (Date.now() - this.game.startTime) / 1000;
                document.getElementById('devTime').textContent = elapsed.toFixed(2) + 's';
            }
            
            const avgInput = this.game.inputTimings.length > 0
                ? (this.game.inputTimings.reduce((a, b) => a + b, 0) / this.game.inputTimings.length).toFixed(0)
                : 0;
            document.getElementById('devAvgInput').textContent = avgInput + 'ms';
            
            document.getElementById('devSuspicion').textContent = this.game.suspicionScore;
            
            // Pi digits available
            if (window.piDigits) {
                const status = window.piDigits.getStatus();
                document.getElementById('devPiAvailable').textContent = 
                    `${status.totalAvailable.toLocaleString()} (${status.isOnline ? 'online' : 'offline'})`;
            } else {
                document.getElementById('devPiAvailable').textContent = 
                    (typeof PI_DIGITS_FALLBACK !== 'undefined' ? PI_DIGITS_FALLBACK.length : 0).toLocaleString() + ' (fallback)';
            }
        }, 100);
    }
    
    removeDebugPanel() {
        clearInterval(this.debugUpdateInterval);
        if (this.debugPanel) {
            this.debugPanel.remove();
            this.debugPanel = null;
        }
    }
    
    startAutoPlay() {
        if (!this.game.isPlaying) {
            // Start a new game first
            this.game.startGame();
        }
        
        this.isAutoPlaying = true;
        document.getElementById('devAutoPlay').textContent = '⏸ Pause';
        document.getElementById('devAutoPlay').classList.add('active');
        
        // Disable anti-cheat for auto-play
        this.game.suspicionScore = 0;
        
        this.autoPlayInterval = setInterval(() => {
            if (!this.game.isPlaying) {
                this.stopAutoPlay();
                return;
            }
            
            // Get the correct next digit
            const nextDigit = this.getNextCorrectDigit();
            if (nextDigit !== null) {
                // Bypass anti-cheat for testing
                this.game.isTrustedInput = true;
                // Add some randomness to timing to avoid variance warnings
                const randomDelay = Math.random() * 20 - 10; // -10 to +10ms variation
                this.game.lastInputTime = Date.now() - (100 + randomDelay);
                // Reset suspicion score to prevent false positives
                this.game.suspicionScore = 0;
                this.game.handleDigitInput(nextDigit);
            } else {
                // No more digits available
                console.log('Reached end of available Pi digits');
                this.stopAutoPlay();
            }
        }, this.autoPlaySpeed);
    }
    
    stopAutoPlay() {
        this.isAutoPlaying = false;
        clearInterval(this.autoPlayInterval);
        
        const btn = document.getElementById('devAutoPlay');
        if (btn) {
            btn.textContent = '▶ Auto-Play';
            btn.classList.remove('active');
        }
    }
    
    getNextCorrectDigit() {
        const index = this.game.currentDigitIndex;
        
        // Try PiDigitsManager first
        if (window.piDigits && window.piDigits.hasDigit(index)) {
            return window.piDigits.getDigit(index);
        }
        
        // Fall back to hardcoded PI_DIGITS_FALLBACK
        if (typeof PI_DIGITS_FALLBACK !== 'undefined' && index < PI_DIGITS_FALLBACK.length) {
            return PI_DIGITS_FALLBACK[index];
        }
        
        return null;
    }
    
    jumpToDigit() {
        const target = prompt('Jump to digit number:', '1000');
        if (!target) return;
        
        const targetDigit = parseInt(target);
        if (isNaN(targetDigit) || targetDigit < 0) {
            alert('Invalid digit number');
            return;
        }
        
        // Stop current auto-play
        this.stopAutoPlay();
        
        // Reset game state but don't deduct life
        this.game.currentDigitIndex = 0;
        this.game.mistakes = 0;
        this.game.enteredDigits = [];
        this.game.isPlaying = true;
        this.game.startTime = Date.now();
        this.game.inputTimings = [];
        this.game.suspicionScore = 0;
        
        // Reset strikes display
        this.game.elements.strikes.forEach(s => {
            s.textContent = '○';
            s.classList.remove('active');
        });
        
        // Start timer if not running
        if (!this.game.timerInterval) {
            this.game.timerInterval = setInterval(() => this.game.updateTimer(), 100);
        }
        
        // Fast-forward to target digit
        console.log(`Jumping to digit ${targetDigit.toLocaleString()}...`);
        
        // Clear display
        this.game.elements.digitsContainer.innerHTML = '';
        
        // Add digits in batches for performance
        const batchSize = 1000;
        let current = 0;
        
        const addBatch = () => {
            const end = Math.min(current + batchSize, targetDigit);
            let html = '';
            
            for (let i = current; i < end; i++) {
                const digit = this.getNextCorrectDigit();
                if (digit === null) {
                    console.log(`Only ${i} digits available`);
                    this.game.currentDigitIndex = i;
                    finalize();
                    return;
                }
                
                this.game.currentDigitIndex = i + 1;
                this.game.enteredDigits.push(digit);
                html += `<span class="digit correct">${digit}</span>`;
            }
            
            this.game.elements.digitsContainer.innerHTML += html;
            current = end;
            
            if (current < targetDigit) {
                // Schedule next batch
                setTimeout(addBatch, 0);
            } else {
                finalize();
            }
        };
        
        const finalize = () => {
            // Add cursor
            this.game.elements.digitsContainer.innerHTML += '<span class="cursor blink"></span>';
            
            // Update counter
            this.game.elements.digitCounter.textContent = this.game.currentDigitIndex;
            
            // Scroll to bottom
            this.game.elements.digitsContainer.scrollTop = 
                this.game.elements.digitsContainer.scrollHeight;
            
            // Adjust start time to simulate realistic play
            const simulatedTime = this.game.currentDigitIndex * 150; // 150ms per digit average
            this.game.startTime = Date.now() - simulatedTime;
            
            console.log(`✓ Jumped to digit ${this.game.currentDigitIndex.toLocaleString()}`);
            
            // Show game screen
            this.game.showScreen('game');
        };
        
        // Show game screen and start
        this.game.showScreen('game');
        addBatch();
    }
    
    async addFakeLeaderboardEntries() {
        const names = [
            'PiMaster3000', 'CircleGuru', 'InfiniteMemory', 'DigitKing',
            'MathWizard', 'PiReciter', 'NumberNinja', 'MemoryChamp',
            'BrainiacPi', 'DigitalDreamer', 'PiPioneer', 'MathGenius'
        ];
        
        {
        const endurance = [];
        for (let i = 0; i < 20; i++) {
            endurance.push({
                name: names[i % names.length] + (i > 11 ? i : ''),
                    digits: Math.floor(Math.random() * 5000) + 100,
                    time: (Math.floor(Math.random() * 300000) + 10000) / 1000,
                    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        }
            endurance.sort((a, b) => b.digits - a.digits);
        localStorage.setItem('piGame_enduranceLeaderboard', JSON.stringify(endurance));
        
            // Add speed entries (new format with all array)
            const allSpeedRecords = [];
            [10, 20, 50, 100, 200, 500].forEach(milestone => {
            for (let i = 0; i < 10; i++) {
                    allSpeedRecords.push({
                    name: names[i % names.length],
                        digits: milestone,
                        time: ((milestone * 100) + Math.random() * milestone * 50) / 1000,
                        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
                });
            }
            });
            allSpeedRecords.sort((a, b) => {
                if (a.digits !== b.digits) return b.digits - a.digits;
                return a.time - b.time;
            });
            
            this.game.speedLeaderboard = { all: allSpeedRecords };
        this.game.enduranceLeaderboard = endurance;
            localStorage.setItem('piGame_speedLeaderboard', JSON.stringify(this.game.speedLeaderboard));
        
            alert('✓ Added fake leaderboard entries to localStorage!\nGo to Leaderboard to see them.');
        }
        
        // Refresh leaderboard display if it's currently shown
        if (this.game.screens.leaderboard.classList.contains('active')) {
            this.game.renderSpeedLeaderboard();
            this.game.renderEnduranceLeaderboard();
        }
    }
    
    promptClearLeaderboards() {
        // Password protection
        const password = prompt('Enter password to clear leaderboards:');
        if (!password) {
            return; // User cancelled
        }
        
        // Default password is "dev123" - change this to your preferred password
        const correctPassword = 'pidev123';
        
        if (password !== correctPassword) {
            alert('❌ Incorrect password. Leaderboard data was NOT cleared.');
            return;
        }
        
        // Password correct, proceed with clearing
        this.clearLeaderboards();
    }
    
    clearLeaderboards() {
        if (!confirm('Clear all saved records?\n\nContinue?')) {
            return;
        }
        
        localStorage.removeItem('piGame_enduranceLeaderboard');
        localStorage.removeItem('piGame_speedLeaderboard');
        
        this.game.enduranceLeaderboard = [];
        this.game.speedLeaderboard = { all: [] };
        
        alert('✓ Cleared records!\n\nReloading page...');
        location.reload();
    }
}

// Auto-initialize when game is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for game to initialize
    const checkGame = setInterval(() => {
        if (window.game) {
            clearInterval(checkGame);
            window.devMode = new DevMode(window.game);
        }
    }, 100);
});

