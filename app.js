/**
 * π∞ - The Infinite Pi Challenge
 * Game Logic with Anti-Cheat Protection
 * 
 * Supports:
 * - 100,000 digits offline (from pi-digits.js)
 * - Unlimited digits via API when online (pi-digits-manager.js)
 * - Fallback to hardcoded 10,000 digits if files not loaded
 */

// Fallback: 10,000 digits of Pi if pi-digits.js not loaded
const PI_DIGITS_FALLBACK = '1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632788659361533818279682303019520353018529689957736225994138912497217752834791315155748572424541506959508295331168617278558890750983817546374649393192550604009277016711390098488240128583616035637076601047101819429555961989467678374494482553797747268471040475346462080466842590694912933136770289891521047521620569660240580381501935112533824300355876402474964732639141992726042699227967823547816360093417216412199245863150302861829745557067498385054945885869269956909272107975093029553211653449872027559602364806654991198818347977535663698074265425278625518184175746728909777727938000816470600161452491921732172147723501414419735685481613611573525521334757418494684385233239073941433345477624168625189835694855620992192221842725502542568876717904946016534668049886272327917860857843838279679766814541009538837863609506800642251252051173929848960841284886269456042419652850222106611863067442786220391949450471237137869609563643719172874677646575739624138908658326459958133904780275900994657640789512694683983525957098258226205224894077267194782684826014769909026401363944374553050682034962524517493996514314298091906592509372216964615157098583874105978859597729754989301617539284681382686838689427741559918559252459539594310499725246808459872736446958486538367362226260991246080512438843904512441365497627807977156914359977001296160894416948685558484063534220722258284886481584560285060168427394522674676788952521385225499546667278239864565961163548862305774564980355936345681743241125150760694794510965960940252288797108931456691368672287489405601015033086179286809208747609178249385890097149096759852613655497818931297848216829989487226588048575640142704775551323796414515237462343645428584447952658678210511413547357395231134271661021359695362314429524849371871101457654035902799344037420073105785390621983874478084784896833214457138687519435064302184531910484810053706146806749192781911979399520614196634287544406437451237181921799983910159195618146751426912397489409071864942319615679452080951465502252316038819301420937621378559566389377870830390697920773467221825625996615014215030680384477345492026054146659252014974428507325186660021324340881907104863317346496514539057962685610055081066587969981635747363840525714591028970641401109712062804390397595156771577004203378699360072305587631763594218731251471205329281918261861258673215791984148488291644706095752706957220917567116722910981690915280173506712748583222871835209353965725121083579151369882091444210067510334671103141267111369908658516398315019701651511685171437657618351556508849099898599823873455283316355076479185358932261854896321329330898570642046752590709154814165498594616371802709819943099244889575712828905923233260972997120844335732654893823911932597463667305836041428138830320382490375898524374417029132765618093773444030707469211201913020330380197621101100449293215160842444859637669838952286847831235526582131449576857262433441893039686426243410773226978028073189154411010446823252716201052652272111660396665573092547110557853763466820653109896526918620564769312570586356620185581007293606598764861179104533488503461136576867532494416680396265797877185560845529654126654085306143444318586769751456614068007002378776591344017127494704205622305389945613140711270004078547332699390814546646458807972708266830634328587856983052358089330657574067954571637752542021149557615814002501262285941302164715509792592309907965473761255176567513575178296664547791745011299614890304639947132962107340437518957359614589019389713111790429782856475032031986915140287080859904801094121472213179476477726224142548545403321571853061422881375850430633217518297986622371721591607716692547487389866549494501146540628433663937900397692656721463853067360965712091807638327166416274888800786925602902284721040317211860820419000422966171196377921337575114959501566049631862947265473642523081770367515906735023507283540567040386743513622224771589150495309844489333096340878076932599397805419341447377441842631298608099888687413260472156951623965864573021631598193195167353812974167729478672422924654366800980676928238280689964004824354037014163149658979409243237896907069779422362508221688957383798623001593776471651228935786015881617557829735233446042815126272037343146531977774160319906655418763979293344195215413418994854234895170298183264162385159';

class PiGame {
    constructor() {
        // Game state
        this.currentDigitIndex = 0;
        this.mistakes = 0;
        this.maxMistakes = 3;
        this.isPlaying = false;
        this.startTime = null;
        this.timerInterval = null;
        this.enteredDigits = [];
        
        // Layout state
        const savedLayout = localStorage.getItem('piGameLayout');
        // If saved layout is 'minimal', default to 'classic' since minimal mode is removed
        this.currentLayout = (savedLayout === 'minimal') ? 'classic' : (savedLayout || 'classic');
        this.revealGridSize = 50; // Number of cells visible in reveal mode
        
        // Anti-cheat state
        this.lastInputTime = 0;
        this.inputTimings = [];
        this.mouseMovements = 0;
        this.touchEvents = 0;
        this.suspicionScore = 0;
        this.isTrustedInput = false;
        this.lastKeySource = null;
        this.devModeActive = false; // Flag to disable anti-cheat in dev mode
        
        // Player data (from localStorage)
        this.lives = this.loadLives();
        this.playerName = localStorage.getItem('piGameName') || '';
        this.bestScore = parseInt(localStorage.getItem('piGameBest')) || 0;
        this.totalAttempts = parseInt(localStorage.getItem('piGameAttempts')) || 0;
        
        // Session tracking - separate highest for each mode
        this.sessionHighestDigits = {
            classic: 0,
            reveal: 0,
            training: 0
        };
        
        // Initialize Supabase client for global leaderboards
        this.supabase = null;
        if (typeof SupabaseClient !== 'undefined') {
            this.supabase = new SupabaseClient();
        }
        
        // Initialize Ad Manager (after DOM is ready)
        this.adManager = null;
        if (typeof AdManager !== 'undefined') {
            // Wait for DOM to be fully ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.adManager = new AdManager();
                });
            } else {
                this.adManager = new AdManager();
            }
        }
        
        // Leaderboards (will be loaded asynchronously from Supabase if available)
        this.speedLeaderboard = { all: [] };
        this.enduranceLeaderboard = [];
        this.trainingSpeedLeaderboard = { all: [] };
        this.trainingEnduranceLeaderboard = [];
        
        // Initialize Pi Digits Manager (100k offline + unlimited online)
        this.initPiDigits();
        
        // Initialize
        this.initElements();
        this.initEventListeners();
        this.initLayoutSelector();
        this.initAntiCheat();
        this.updateUI();
        this.updateDigitCounterDisplay(); // Initialize counter displays
        
        // Load leaderboards (async - from Supabase if available, else localStorage)
        this.loadAllLeaderboards();
    }
    
    // ========================================
    // Pi Digits Management
    // ========================================
    
    initPiDigits() {
        // Try to use PiDigitsManager (100k offline + API)
        if (typeof PiDigitsManager !== 'undefined') {
            window.piDigits = new PiDigitsManager();
            console.log('✓ PiDigitsManager loaded:', window.piDigits.getTotalAvailable().toLocaleString(), 'digits available');
        } 
        // Fallback to PI_OFFLINE_DIGITS if available (100k from pi-digits.js)
        else if (typeof PI_OFFLINE_DIGITS !== 'undefined') {
            console.log('✓ Offline Pi digits loaded:', PI_OFFLINE_DIGITS.length.toLocaleString(), 'digits');
        }
        // Final fallback to hardcoded 10k
        else {
            console.log('⚠ Using fallback Pi digits:', PI_DIGITS_FALLBACK.length.toLocaleString(), 'digits');
        }
    }
    
    getDigit(index) {
        // Priority 1: PiDigitsManager (supports 100k offline + unlimited via API)
        if (window.piDigits) {
            const digit = window.piDigits.getDigit(index);
            
            // Prefetch more digits if we're approaching the limit
            window.piDigits.prefetchIfNeeded(index);
            
            return digit;
        }
        
        // Priority 2: PI_OFFLINE_DIGITS from pi-digits.js (100k)
        if (typeof PI_OFFLINE_DIGITS !== 'undefined' && index < PI_OFFLINE_DIGITS.length) {
            return PI_OFFLINE_DIGITS[index];
        }
        
        // Priority 3: Fallback hardcoded digits (10k)
        if (index < PI_DIGITS_FALLBACK.length) {
            return PI_DIGITS_FALLBACK[index];
        }
        
        return null;
    }
    
    getTotalDigitsAvailable() {
        if (window.piDigits) {
            return window.piDigits.getTotalAvailable();
        }
        if (typeof PI_OFFLINE_DIGITS !== 'undefined') {
            return PI_OFFLINE_DIGITS.length;
        }
        return PI_DIGITS_FALLBACK.length;
    }
    
    // ========================================
    // Initialization
    // ========================================
    
    initElements() {
        // Screens
        this.screens = {
            start: document.getElementById('startScreen'),
            game: document.getElementById('gameScreen'),
            gameOver: document.getElementById('gameOverScreen'),
            leaderboard: document.getElementById('leaderboardScreen')
        };
        
        // Game elements
        this.elements = {
            livesCount: document.getElementById('livesCount'),
            bestDigits: document.getElementById('bestDigits'),
            totalAttempts: document.getElementById('totalAttempts'),
            digitCounter: document.getElementById('digitCounter'),
            highestCounter: document.getElementById('highestCounter'),
            timer: document.getElementById('timer'),
            digitsContainer: document.getElementById('digitsContainer'),
            currentDigit: document.getElementById('currentDigit'),
            strikes: [
                document.getElementById('strike1'),
                document.getElementById('strike2'),
                document.getElementById('strike3')
            ],
            gameControls: document.getElementById('gameControls'),
            
            // Layout displays
            layoutClassic: document.getElementById('layoutClassic'),
            layoutReveal: document.getElementById('layoutReveal'),
            layoutTraining: document.getElementById('layoutTraining'),
            revealGrid: document.getElementById('revealGrid'),
            revealDigitNum: document.getElementById('revealDigitNum'),
            revealCurrentCell: document.getElementById('revealCurrentCell'),
            trainingGrid: document.getElementById('trainingGrid'),
            
            // Game over
            gameOverTitle: document.getElementById('gameOverTitle'),
            finalDigits: document.getElementById('finalDigits'),
            finalTime: document.getElementById('finalTime'),
            achievements: document.getElementById('achievements'),
            noLivesWarning: document.getElementById('noLivesWarning'),
            
            // Leaderboard
            speedList: document.getElementById('speedList'),
            enduranceList: document.getElementById('enduranceList'),
            digitFilter: document.getElementById('digitFilter'),
            trainingSpeedList: document.getElementById('trainingSpeedList'),
            trainingEnduranceList: document.getElementById('trainingEnduranceList'),
            trainingDigitFilter: document.getElementById('trainingDigitFilter')
        };
        
        // Modals
        this.modals = {
            shop: document.getElementById('shopModal'),
            name: document.getElementById('nameModal')
        };
    }
    
    initEventListeners() {
        // Music toggle
        this.initMusic();
        
        // Start button
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        
        // Note: Digit input is now only via keyboard (numpad removed)
        
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;
            
            this.isTrustedInput = e.isTrusted;
            this.lastKeySource = 'keyboard';
            
            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                this.handleDigitInput(e.key);
            } else if (e.key === 'Escape') {
                this.quitGame();
            }
        });
        
        // Quit and save buttons
        document.getElementById('quitBtn').addEventListener('click', () => this.quitGame());
        document.getElementById('saveBtn').addEventListener('click', () => this.saveAndQuit());
        
        // Home buttons
        document.getElementById('homeBtn').addEventListener('click', () => this.goHome());
        document.getElementById('homeFromGameOver').addEventListener('click', () => this.showScreen('start'));
        
        // Game over buttons
        document.getElementById('retryBtn').addEventListener('click', () => this.retryGame());
        document.getElementById('leaderboardBtn').addEventListener('click', () => this.showScreen('leaderboard'));
        document.getElementById('watchAdBtn').addEventListener('click', () => this.watchAd());
        document.getElementById('buyLivesBtn2').addEventListener('click', () => this.openShop());
        
        // Leaderboard
        document.getElementById('backBtn').addEventListener('click', () => this.showScreen('start'));
        document.querySelectorAll('.leaderboard-tabs .tab').forEach(tab => {
            tab.addEventListener('click', () => this.switchLeaderboardTab(tab.dataset.tab));
        });
        this.elements.digitFilter.addEventListener('change', () => this.renderSpeedLeaderboard());
        if (this.elements.trainingDigitFilter) {
            this.elements.trainingDigitFilter.addEventListener('change', () => this.renderTrainingSpeedLeaderboard());
        }
        
        // Training leaderboard tabs
        document.querySelectorAll('.training-tabs .training-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const trainingTab = tab.dataset.trainingTab;
                document.querySelectorAll('.training-tabs .training-tab').forEach(t => {
                    t.classList.toggle('active', t === tab);
                });
                document.getElementById('trainingSpeedPanel').classList.toggle('active', trainingTab === 'trainingSpeed');
                document.getElementById('trainingEndurancePanel').classList.toggle('active', trainingTab === 'trainingEndurance');
                
                if (trainingTab === 'trainingSpeed') {
                    this.renderTrainingSpeedLeaderboard();
                } else {
                    this.renderTrainingEnduranceLeaderboard();
                }
            });
        });
        
        // Shop
        document.getElementById('buyLivesBtn').addEventListener('click', () => this.openShop());
        document.getElementById('closeShop').addEventListener('click', () => this.closeShop());
        document.querySelectorAll('.shop-item').forEach(item => {
            item.addEventListener('click', () => this.handleShopPurchase(item));
        });
        
        // Name modal
        document.getElementById('saveName').addEventListener('click', () => this.saveScore());
        document.getElementById('skipName').addEventListener('click', () => this.skipSaveScore());
        
        // Footer
        document.getElementById('footerLeaderboard').addEventListener('click', () => this.showScreen('leaderboard'));
    }
    
    // ========================================
    // Layout System
    // ========================================
    
    initLayoutSelector() {
        // Set initial active state
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.layout === this.currentLayout);
            btn.addEventListener('click', () => this.setLayout(btn.dataset.layout));
        });
    }
    
    setLayout(layout) {
        // Prevent setting minimal mode (removed feature)
        if (layout === 'minimal') {
            layout = 'classic';
        }
        this.currentLayout = layout;
        localStorage.setItem('piGameLayout', layout);
        
        // Update button states
        document.querySelectorAll('.layout-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.layout === layout);
        });
        
        // Update active layout display if in game
        if (this.isPlaying) {
            this.updateLayoutDisplay();
            // Update counter display to show correct highest for new mode
            this.updateDigitCounterDisplay();
        }
    }
    
    updateLayoutDisplay() {
        // Hide all layouts
        this.elements.layoutClassic?.classList.remove('active');
        this.elements.layoutReveal?.classList.remove('active');
        this.elements.layoutTraining?.classList.remove('active');
        
        // Show current layout
        switch (this.currentLayout) {
            case 'reveal':
                this.elements.layoutReveal?.classList.add('active');
                break;
            case 'training':
                this.elements.layoutTraining?.classList.add('active');
                break;
            default:
                this.elements.layoutClassic?.classList.add('active');
        }
    }
    
    initRevealGrid() {
        if (!this.elements.revealGrid) return;
        
        // Clear and create grid cells
        this.elements.revealGrid.innerHTML = '';
        
        for (let i = 0; i < this.revealGridSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'reveal-cell';
            cell.dataset.index = i;
            if (i === 0) cell.classList.add('current');
            this.elements.revealGrid.appendChild(cell);
        }
    }
    
    updateRevealGrid(index, digit, isCorrect) {
        if (!this.elements.revealGrid) return;
        
        const cells = this.elements.revealGrid.querySelectorAll('.reveal-cell');
        
        // Check if we need to add more cells
        if (index >= cells.length) {
            // Add more cells
            const startIndex = cells.length;
            for (let i = startIndex; i < index + this.revealGridSize; i++) {
                const cell = document.createElement('div');
                cell.className = 'reveal-cell';
                cell.dataset.index = i;
                this.elements.revealGrid.appendChild(cell);
            }
        }
        
        const allCells = this.elements.revealGrid.querySelectorAll('.reveal-cell');
        
        // Update current cell
        allCells.forEach((cell, i) => {
            cell.classList.remove('current', 'wrong');
            
            if (i < index) {
                // Already revealed
                cell.classList.add('revealed');
                cell.textContent = this.enteredDigits[i] || '';
            } else if (i === index) {
                if (isCorrect) {
                    cell.classList.add('revealed');
                    cell.textContent = digit;
                } else {
                    cell.classList.add('wrong');
                    setTimeout(() => {
                        cell.classList.remove('wrong');
                        cell.classList.add('current');
                    }, 400);
                }
            } else if (i === index + 1 && isCorrect) {
                cell.classList.add('current');
            }
        });
        
        // Update digit number display
        if (this.elements.revealDigitNum) {
            this.elements.revealDigitNum.textContent = index + 1;
        }
        
        // Auto-scroll to show current cell
        const currentCell = this.elements.revealGrid.querySelector('.current');
        if (currentCell) {
            currentCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    initTrainingGrid() {
        if (!this.elements.trainingGrid) return;
        
        // Clear grid
        this.elements.trainingGrid.innerHTML = '';
        
        // Create 2 rows of 10 digits each (20 digits total)
        for (let row = 0; row < 2; row++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'training-row';
            rowElement.dataset.rowIndex = row;
            
            for (let col = 0; col < 10; col++) {
                const digitIndex = row * 10 + col;
                const digit = this.getDigit(digitIndex);
                
                if (digit === null) break; // No more digits available
                
                const digitElement = document.createElement('div');
                digitElement.className = 'training-digit waiting';
                digitElement.dataset.index = digitIndex;
                digitElement.textContent = digit;
                
                // First digit is current
                if (digitIndex === 0) {
                    digitElement.classList.remove('waiting');
                    digitElement.classList.add('current');
                }
                
                rowElement.appendChild(digitElement);
            }
            
            this.elements.trainingGrid.appendChild(rowElement);
        }
    }
    
    updateTrainingGrid(index, isCorrect) {
        if (!this.elements.trainingGrid) return;
        
        const allDigits = this.elements.trainingGrid.querySelectorAll('.training-digit');
        
        // Update all digits based on their state
        allDigits.forEach(digitEl => {
            const digitIndex = parseInt(digitEl.dataset.index);
            
            digitEl.classList.remove('current', 'waiting', 'entered', 'wrong');
            
            if (digitIndex < index) {
                // Already entered - darker color
                digitEl.classList.add('entered');
            } else if (digitIndex === index) {
                // Current digit
                if (isCorrect) {
                    digitEl.classList.add('entered');
                } else {
                    digitEl.classList.add('wrong');
                    // Reset to current after animation
                    setTimeout(() => {
                        digitEl.classList.remove('wrong');
                        digitEl.classList.add('current');
                    }, 400);
                }
            } else {
                // Waiting to be entered - lighter color
                digitEl.classList.add('waiting');
                
                // Next digit becomes current
                if (digitIndex === index + 1 && isCorrect) {
                    digitEl.classList.remove('waiting');
                    digitEl.classList.add('current');
                }
            }
        });
        
        // When any row is complete (every 10 digits), remove first row and add new row
        if (isCorrect && (index + 1) % 10 === 0) {
            const firstRow = this.elements.trainingGrid.querySelector('.training-row[data-row-index="0"]');
            if (firstRow) {
                // Remove the completed first row
                firstRow.remove();
                
                // Shift remaining rows up (second row becomes first row)
                const allRows = this.elements.trainingGrid.querySelectorAll('.training-row');
                allRows.forEach((row, i) => {
                    row.dataset.rowIndex = i.toString();
                });
                
                // Find the highest digit index to determine what the new row should be
                let maxDisplayedIndex = -1;
                this.elements.trainingGrid.querySelectorAll('.training-digit').forEach(digitEl => {
                    const digitIndex = parseInt(digitEl.dataset.index);
                    if (digitIndex > maxDisplayedIndex) {
                        maxDisplayedIndex = digitIndex;
                    }
                });
                
                // Add new row at the end with the next 10 digits
                const newRowStartIndex = maxDisplayedIndex + 1;
                const newRowIndex = allRows.length;
                const newRow = document.createElement('div');
                newRow.className = 'training-row';
                newRow.dataset.rowIndex = newRowIndex.toString();
                
                for (let col = 0; col < 10; col++) {
                    const digitIndex = newRowStartIndex + col;
                    const digit = this.getDigit(digitIndex);
                    
                    if (digit === null) break;
                    
                    const digitElement = document.createElement('div');
                    digitElement.className = 'training-digit waiting';
                    digitElement.dataset.index = digitIndex;
                    digitElement.textContent = digit;
                    
                    newRow.appendChild(digitElement);
                }
                
                this.elements.trainingGrid.appendChild(newRow);
                
                // Re-highlight the current digit after row operations
                const currentDigitEl = this.elements.trainingGrid.querySelector(`.training-digit[data-index="${index + 1}"]`);
                if (currentDigitEl) {
                    currentDigitEl.classList.remove('waiting', 'entered', 'wrong');
                    currentDigitEl.classList.add('current');
                }
            }
        }
    }
    
    // ========================================
    // Anti-Cheat System
    // ========================================
    
    initAntiCheat() {
        // Disable paste
        document.addEventListener('paste', (e) => {
            e.preventDefault();
            this.suspicionScore += 10;
            console.warn('Paste attempt blocked');
        });
        
        // Disable context menu during game
        document.addEventListener('contextmenu', (e) => {
            if (this.isPlaying) {
                e.preventDefault();
            }
        });
        
        // Track mouse movements (humans move mouse, bots don't)
        document.addEventListener('mousemove', () => {
            this.mouseMovements++;
        });
        
        // Detect automation tools
        this.detectAutomation();
        
        // Block common automation methods
        this.blockAutomation();
    }
    
    detectAutomation() {
        // Check for webdriver (Selenium, Puppeteer, etc.)
        if (navigator.webdriver) {
            this.suspicionScore += 100;
            console.warn('WebDriver detected');
        }
        
        // Check for headless browser indicators
        if (!navigator.languages || navigator.languages.length === 0) {
            this.suspicionScore += 20;
        }
        
        // Check for phantom.js
        if (window.callPhantom || window._phantom) {
            this.suspicionScore += 100;
        }
        
        // Check for nightmare.js
        if (window.__nightmare) {
            this.suspicionScore += 100;
        }
        
        // Chrome headless detection
        if (/HeadlessChrome/.test(navigator.userAgent)) {
            this.suspicionScore += 100;
        }
    }
    
    blockAutomation() {
        // Override dispatchEvent to detect programmatic events
        const originalDispatchEvent = EventTarget.prototype.dispatchEvent;
        const self = this;
        
        EventTarget.prototype.dispatchEvent = function(event) {
            if (event.type === 'click' || event.type === 'keydown') {
                if (!event.isTrusted) {
                    self.suspicionScore += 5;
                    console.warn('Synthetic event detected');
                }
            }
            return originalDispatchEvent.call(this, event);
        };
    }
    
    validateInput() {
        // Skip anti-cheat validation in dev mode
        if (this.devModeActive) {
            this.lastInputTime = Date.now();
            return true;
        }
        
        const now = Date.now();
        const timeSinceLastInput = now - this.lastInputTime;
        
        // Check 1: Input too fast (< 50ms is superhuman)
        if (this.lastInputTime > 0 && timeSinceLastInput < 50) {
            this.suspicionScore += 3;
            console.warn('Input too fast:', timeSinceLastInput + 'ms');
            return false; // Reject the input
        }
        
        // Check 2: Input source validation
        if (!this.isTrustedInput) {
            this.suspicionScore += 10;
            console.warn('Untrusted input detected');
            return false;
        }
        
        // Track timing for variance analysis
        if (this.lastInputTime > 0) {
            this.inputTimings.push(timeSinceLastInput);
        }
        
        // Check 3: Timing variance (bots are too consistent)
        if (this.inputTimings.length >= 20) {
            const variance = this.calculateVariance(this.inputTimings.slice(-20));
            if (variance < 100) { // Very low variance = likely bot
                this.suspicionScore += 5;
                console.warn('Suspicious timing variance:', variance);
            }
        }
        
        // Check 4: No mouse/touch activity (possible bot)
        if (this.currentDigitIndex > 50 && this.mouseMovements < 10 && this.touchEvents < 10) {
            this.suspicionScore += 2;
        }
        
        this.lastInputTime = now;
        return true;
    }
    
    calculateVariance(arr) {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        const squareDiffs = arr.map(value => Math.pow(value - mean, 2));
        return squareDiffs.reduce((a, b) => a + b, 0) / arr.length;
    }
    
    isSuspicious() {
        return this.suspicionScore >= 50;
    }
    
    getAntiCheatData() {
        return {
            suspicionScore: this.suspicionScore,
            avgInputTime: this.inputTimings.length > 0 
                ? this.inputTimings.reduce((a, b) => a + b, 0) / this.inputTimings.length 
                : 0,
            inputVariance: this.inputTimings.length >= 10 
                ? this.calculateVariance(this.inputTimings) 
                : null,
            mouseMovements: this.mouseMovements,
            touchEvents: this.touchEvents,
            inputCount: this.inputTimings.length
        };
    }
    
    // ========================================
    // Game Logic
    // ========================================
    
    startGame() {
        // In training mode, skip life checks and deduction
        if (this.currentLayout !== 'training') {
            if (this.lives <= 0) {
                this.openShop();
                return;
            }
            
            // Deduct life (only in non-training modes)
            this.lives--;
            this.saveLives();
            
            // Update attempts (only in non-training modes)
            this.totalAttempts++;
            localStorage.setItem('piGameAttempts', this.totalAttempts);
        }
        
        // Reset game state
        this.currentDigitIndex = 0;
        this.mistakes = 0;
        this.enteredDigits = [];
        this.isPlaying = true;
        
        // Reset anti-cheat
        this.lastInputTime = 0;
        this.inputTimings = [];
        this.mouseMovements = 0;
        this.touchEvents = 0;
        this.suspicionScore = 0;
        
        // Reset UI
        this.elements.digitsContainer.innerHTML = '<span class="cursor blink"></span>';
        this.elements.currentDigit.textContent = '?';
        this.elements.digitCounter.textContent = '0'; // Reset current counter display
        // Keep highest counter showing session highest (don't reset it)
        this.updateDigitCounterDisplay(); // Update both counters
        this.elements.strikes.forEach(s => {
            s.textContent = '○';
            s.classList.remove('active');
        });
        
        // Initialize layout
        this.updateLayoutDisplay();
        this.initRevealGrid();
        // Only initialize training grid if in training mode
        if (this.currentLayout === 'training') {
            this.initTrainingGrid();
        } else {
            // Clear training grid if not in training mode
            if (this.elements.trainingGrid) {
                this.elements.trainingGrid.innerHTML = '';
            }
        }
        if (this.elements.revealCurrentCell) {
            this.elements.revealCurrentCell.textContent = '?';
        }
        
        // Start timer
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => this.updateTimer(), 100);
        
        // Show game screen
        this.showScreen('game');
        this.updateUI();
    }
    
    handleDigitInput(digit) {
        if (!this.isPlaying) return;
        
        // Anti-cheat validation
        if (!this.validateInput()) {
            // Input rejected - visual feedback could be added here if needed
            return;
        }
        
        const expectedDigit = this.getDigit(this.currentDigitIndex);
        
        if (digit === expectedDigit) {
            // Correct!
            this.handleCorrectDigit(digit);
        } else {
            // Wrong!
            this.handleWrongDigit(digit, expectedDigit);
        }
    }
    
    handleCorrectDigit(digit) {
        // Update state first
        this.enteredDigits.push(digit);
        const prevIndex = this.currentDigitIndex;
        this.currentDigitIndex++;
        
        // Update session highest for current mode if needed
        const currentMode = this.currentLayout === 'training' ? 'training' : (this.currentLayout === 'reveal' ? 'reveal' : 'classic');
        if (this.currentDigitIndex > this.sessionHighestDigits[currentMode]) {
            this.sessionHighestDigits[currentMode] = this.currentDigitIndex;
        }
        
        // Update counter display
        this.updateDigitCounterDisplay();
        
        // Update based on current layout
        switch (this.currentLayout) {
            case 'reveal':
                this.updateRevealGrid(prevIndex, digit, true);
                if (this.elements.revealCurrentCell) {
                    this.elements.revealCurrentCell.textContent = '?';
                }
                break;
                
            case 'training':
                this.updateTrainingGrid(prevIndex, true);
                break;
                
            default: // classic
                // Add digit to display
                const cursor = this.elements.digitsContainer.querySelector('.cursor');
                const digitSpan = document.createElement('span');
                digitSpan.className = 'digit correct new';
                digitSpan.textContent = digit;
                this.elements.digitsContainer.insertBefore(digitSpan, cursor);
                
                // Remove animation class after it plays
                setTimeout(() => digitSpan.classList.remove('new'), 300);
                
                // Visual feedback
                this.elements.digitsContainer.classList.add('flash-correct');
                setTimeout(() => this.elements.digitsContainer.classList.remove('flash-correct'), 300);
                
                // Auto-scroll to bottom
                this.elements.digitsContainer.scrollTop = this.elements.digitsContainer.scrollHeight;
        }
        
        // Check milestones
        this.checkMilestone();
    }
    
    handleWrongDigit(digit, expected) {
        this.mistakes++;
        
        // Update strikes (only show in non-training modes)
        if (this.currentLayout !== 'training') {
            this.elements.strikes[this.mistakes - 1].textContent = '●';
            this.elements.strikes[this.mistakes - 1].classList.add('active');
        }
        
        // Update based on current layout
        switch (this.currentLayout) {
            case 'reveal':
                this.updateRevealGrid(this.currentDigitIndex, digit, false);
                if (this.elements.revealCurrentCell) {
                    this.elements.revealCurrentCell.textContent = expected;
                    this.elements.revealCurrentCell.style.color = 'var(--error)';
                    setTimeout(() => {
                        this.elements.revealCurrentCell.textContent = '?';
                        this.elements.revealCurrentCell.style.color = '';
                    }, 1000);
                }
                break;
                
            case 'training':
                this.updateTrainingGrid(this.currentDigitIndex, false);
                break;
                
            default: // classic
                // Show wrong digit briefly
                const cursor = this.elements.digitsContainer.querySelector('.cursor');
                const digitSpan = document.createElement('span');
                digitSpan.className = 'digit wrong';
                digitSpan.textContent = digit;
                this.elements.digitsContainer.insertBefore(digitSpan, cursor);
                
                // Show correct digit hint
                this.elements.currentDigit.textContent = expected;
                setTimeout(() => {
                    this.elements.currentDigit.textContent = '?';
                }, 1000);
                
                // Visual feedback
                this.elements.digitsContainer.classList.add('flash-wrong');
                setTimeout(() => {
                    this.elements.digitsContainer.classList.remove('flash-wrong');
                    // Remove wrong digit
                    digitSpan.remove();
                }, 300);
        }
        
        // Check game over (skip in training mode - unlimited mistakes)
        if (this.currentLayout !== 'training' && this.mistakes >= this.maxMistakes) {
            this.endGame(false);
        }
    }
    
    checkMilestone() {
        // Record speed for all digit counts (not just milestones)
        // This will be called when the game ends, recording the final digit count
        // For real-time recording, we could call this on every digit, but that might be too frequent
    }
    
    updateTimer() {
        if (!this.isPlaying) return;
        const elapsed = (Date.now() - this.startTime) / 1000;
        this.elements.timer.textContent = elapsed.toFixed(2) + 's';
    }
    
    endGame(voluntary = false) {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        
        const finalTime = (Date.now() - this.startTime) / 1000;
        const finalDigits = this.currentDigitIndex;
        
        // Update session highest for current mode
        const currentMode = this.currentLayout === 'training' ? 'training' : (this.currentLayout === 'reveal' ? 'reveal' : 'classic');
        if (finalDigits > this.sessionHighestDigits[currentMode]) {
            this.sessionHighestDigits[currentMode] = finalDigits;
        }
        
        // Check for new best
        const isNewBest = finalDigits > this.bestScore;
        if (isNewBest) {
            this.bestScore = finalDigits;
            localStorage.setItem('piGameBest', this.bestScore);
        }
        
        // Update game over screen
        this.elements.finalDigits.textContent = finalDigits;
        this.elements.finalTime.textContent = finalTime.toFixed(2) + 's';
        
        if (isNewBest && finalDigits > 0) {
            this.elements.gameOverTitle.textContent = '🎉 New Personal Best!';
            this.elements.gameOverTitle.classList.add('new-record');
        } else {
            this.elements.gameOverTitle.textContent = voluntary ? 'Progress Saved' : 'Game Over';
            this.elements.gameOverTitle.classList.remove('new-record');
        }
        
        // Show achievements
        this.showAchievements(finalDigits, finalTime);
        
        // Update lives warning
        if (this.lives <= 0) {
            this.elements.noLivesWarning.classList.add('visible');
            document.getElementById('retryBtn').style.display = 'none';
        } else {
            this.elements.noLivesWarning.classList.remove('visible');
            document.getElementById('retryBtn').style.display = 'block';
        }
        
        // Check if score is leaderboard-worthy
        this.pendingScore = {
            digits: finalDigits,
            time: finalTime,
            antiCheat: this.getAntiCheatData()
        };
        
        // Show game over screen, then prompt for name if score > 0
        this.showScreen('gameOver');
        
        if (finalDigits > 0) {
            setTimeout(() => this.promptForName(), 500);
        }
        
        this.updateUI();
    }
    
    showAchievements(digits, time) {
        const achievements = [];
        
        if (digits >= 10) achievements.push('🔟 Double Digits');
        if (digits >= 50) achievements.push('🌟 Half Century');
        if (digits >= 100) achievements.push('💯 Century Club');
        if (digits >= 314) achievements.push('🥧 Pi Master');
        if (digits >= 1000) achievements.push('🚀 Thousand Club');
        
        if (digits >= 10 && time / digits < 0.5) achievements.push('⚡ Speed Demon');
        if (this.mistakes === 0 && digits >= 20) achievements.push('✨ Flawless');
        
        this.elements.achievements.innerHTML = achievements
            .map(a => `<span class="achievement">${a}</span>`)
            .join('');
    }
    
    quitGame() {
        if (confirm('Quit current game? Your progress will be lost.')) {
            this.endGame(true);
        }
    }
    
    saveAndQuit() {
        this.endGame(true);
    }
    
    goHome() {
        if (this.isPlaying) {
            if (confirm('Go back to home? Your current progress will be lost.')) {
                this.isPlaying = false;
                clearInterval(this.timerInterval);
                this.showScreen('start');
            }
        } else {
            this.showScreen('start');
        }
    }
    
    retryGame() {
        this.startGame();
    }
    
    // ========================================
    // Leaderboard System
    // ========================================
    
    promptForName() {
        const nameInput = document.getElementById('playerName');
        nameInput.value = this.playerName;
        this.modals.name.classList.add('active');
        nameInput.focus();
    }
    
    async saveScore() {
        const nameInput = document.getElementById('playerName');
        const name = nameInput.value.trim() || 'Anonymous';
        
        this.playerName = name;
        localStorage.setItem('piGameName', name);
        
        if (this.pendingScore) {
            const isTraining = this.currentLayout === 'training';
            
            // Save to Supabase if configured (for global leaderboards)
            if (this.supabase && this.supabase.isConfigured && !isTraining) {
                try {
                    // Create or get session
                    const session = await this.supabase.startGameSession();
                    
                    // Submit score to Supabase (works for both authenticated and anonymous users)
                    const result = await this.supabase.submitScore(session.id, {
                        digits: this.pendingScore.digits,
                        timeMs: this.pendingScore.time * 1000,
                        time: this.pendingScore.time,
                        suspicionScore: this.pendingScore.antiCheat?.suspicionScore || 0,
                        avgInputTime: this.pendingScore.antiCheat?.avgInputTime || 0,
                        inputVariance: this.pendingScore.antiCheat?.inputVariance || null
                    }, name);
                    
                    if (result.success && result.is_valid) {
                        console.log('✓ Score saved to global leaderboard');
                        // Reload leaderboards to show updated data
                        await this.loadAllLeaderboards();
                        // Refresh leaderboard display if it's currently shown
                        if (this.screens.leaderboard.classList.contains('active')) {
                            this.renderSpeedLeaderboard();
                            this.renderEnduranceLeaderboard();
                        }
                    } else {
                        // Show error to user
                        const errorMsg = result.error || 'Failed to save to global leaderboard';
                        console.error('Failed to save score:', errorMsg);
                        alert('⚠️ Could not save to global leaderboard:\n' + errorMsg + '\n\nScore saved locally instead.');
                    }
                } catch (error) {
                    console.error('Failed to save to Supabase:', error);
                    const errorMsg = error.message || 'Database error. Make sure you\'ve run the database schema setup.';
                    alert('⚠️ Error saving to leaderboard:\n' + errorMsg + '\n\nScore saved locally instead.\n\nSee SETUP_GLOBAL_LEADERBOARDS.md for setup instructions.');
                    // Fall through to save locally
                }
            }
            
            // Always save locally as backup
            if (isTraining) {
                // Save to training leaderboards (local only)
                this.addToTrainingEnduranceLeaderboard({
                    name,
                    digits: this.pendingScore.digits,
                    time: this.pendingScore.time,
                    date: new Date().toISOString()
                });
                
                if (this.pendingScore.digits > 0) {
                    this.recordTrainingSpeedScore(this.pendingScore.digits, this.pendingScore.time);
                }
            } else {
                // Save to regular leaderboards (local backup)
                this.addToEnduranceLeaderboard({
                    name,
                    digits: this.pendingScore.digits,
                    time: this.pendingScore.time,
                    date: new Date().toISOString()
                });
                
                if (this.pendingScore.digits > 0) {
                    this.recordSpeedScore(this.pendingScore.digits, this.pendingScore.time);
                }
            }
        }
        
        this.modals.name.classList.remove('active');
    }
    
    skipSaveScore() {
        this.modals.name.classList.remove('active');
    }
    
    recordSpeedScore(digits, time) {
        if (this.isSuspicious()) return;
        
        const name = this.playerName || 'Anonymous';
        
        // Store all speed records in a flat array with digit count
        if (!this.speedLeaderboard.all) {
            this.speedLeaderboard.all = [];
        }
        
        // Filter out any training records that might have been saved before
        this.speedLeaderboard.all = this.speedLeaderboard.all.filter(r => r.mode !== 'training');
        
        // Add the record with actual digit count
        this.speedLeaderboard.all.push({
            name,
            digits,
            time,
            date: new Date().toISOString()
        });
        
        // Sort by digits (descending), then by time (ascending)
        this.speedLeaderboard.all.sort((a, b) => {
            if (a.digits !== b.digits) {
                return b.digits - a.digits;
            }
            return a.time - b.time;
        });
        
        // Keep top 200 records
        this.speedLeaderboard.all = this.speedLeaderboard.all.slice(0, 200);
        
        this.saveLeaderboard('speed', this.speedLeaderboard);
    }
    
    addToEnduranceLeaderboard(entry) {
        // Filter out any training records that might have been saved before
        this.enduranceLeaderboard = this.enduranceLeaderboard.filter(r => r.mode !== 'training');
        
        // Add all records, even if worse than existing ones
        this.enduranceLeaderboard.push(entry);
        
        // Sort by digits and keep top 200
        this.enduranceLeaderboard.sort((a, b) => b.digits - a.digits);
        this.enduranceLeaderboard = this.enduranceLeaderboard.slice(0, 200);
        
        this.saveLeaderboard('endurance', this.enduranceLeaderboard);
    }
    
    addToTrainingEnduranceLeaderboard(entry) {
        // Add all records, even if worse than existing ones
        this.trainingEnduranceLeaderboard.push(entry);
        
        // Sort by digits and keep top 200
        this.trainingEnduranceLeaderboard.sort((a, b) => b.digits - a.digits);
        this.trainingEnduranceLeaderboard = this.trainingEnduranceLeaderboard.slice(0, 200);
        
        this.saveLeaderboard('trainingEndurance', this.trainingEnduranceLeaderboard);
    }
    
    recordTrainingSpeedScore(digits, time) {
        if (this.isSuspicious()) return;
        
        const name = this.playerName || 'Anonymous';
        
        // Store all speed records in a flat array with digit count
        if (!this.trainingSpeedLeaderboard.all) {
            this.trainingSpeedLeaderboard.all = [];
        }
        
        // Add the record with actual digit count
        this.trainingSpeedLeaderboard.all.push({
            name,
            digits,
            time,
            date: new Date().toISOString()
        });
        
        // Sort by digits (descending), then by time (ascending)
        this.trainingSpeedLeaderboard.all.sort((a, b) => {
            if (a.digits !== b.digits) {
                return b.digits - a.digits;
            }
            return a.time - b.time;
        });
        
        // Keep top 200 records
        this.trainingSpeedLeaderboard.all = this.trainingSpeedLeaderboard.all.slice(0, 200);
        
        this.saveLeaderboard('trainingSpeed', this.trainingSpeedLeaderboard);
    }
    
    async loadAllLeaderboards() {
        // Load from Supabase if configured, otherwise from localStorage
        if (this.supabase && this.supabase.isConfigured) {
            try {
                // Load endurance leaderboard from Supabase
                const enduranceData = await this.supabase.getEnduranceLeaderboard(200);
                console.log(`Loaded ${enduranceData.length} endurance records from Supabase`);
                this.enduranceLeaderboard = enduranceData.map(record => ({
                    name: record.username || record.name,
                    digits: record.max_digits || record.digits,
                    time: (record.time_ms || record.time) / 1000,
                    date: record.created_at || record.date
                }));
                console.log(`✓ Processed ${this.enduranceLeaderboard.length} endurance records`);
                
                // Load speed leaderboard from Supabase (all records, not just milestones)
                // Get all speed records, ordered by digit count
                const speedData = await this.supabase.getAllSpeedRecords();
                const allSpeedRecords = (speedData || []).map(record => ({
                    name: record.username || record.name,
                    digits: record.digit_milestone,
                    time: (record.time_ms || record.time) / 1000,
                    date: record.created_at || record.date
                }));
                this.speedLeaderboard = { all: allSpeedRecords };
                console.log(`✓ Loaded ${allSpeedRecords.length} speed records from Supabase`);
                
                console.log('✓ Loaded leaderboards from Supabase');
            } catch (error) {
                console.error('Failed to load from Supabase, using localStorage:', error);
                this.loadLeaderboardsFromLocalStorage();
            }
        } else {
            this.loadLeaderboardsFromLocalStorage();
        }
    }
    
    loadLeaderboardsFromLocalStorage() {
        // Fallback to localStorage
        this.speedLeaderboard = this.loadLeaderboard('speed');
        this.enduranceLeaderboard = this.loadLeaderboard('endurance');
        this.trainingSpeedLeaderboard = this.loadLeaderboard('trainingSpeed');
        this.trainingEnduranceLeaderboard = this.loadLeaderboard('trainingEndurance');
    }
    
    loadLeaderboard(type) {
        try {
            const data = localStorage.getItem(`piGame_${type}Leaderboard`);
            if (!data) {
                if (type === 'speed' || type === 'trainingSpeed') {
                    return { all: [] };
                }
                return [];
            }
            
            const parsed = JSON.parse(data);
            
            // Migrate old speed leaderboard format to new format
            if ((type === 'speed' || type === 'trainingSpeed') && !parsed.all) {
                // Convert old format (speed_10, speed_20, etc.) to new format
                const allRecords = [];
                Object.keys(parsed).forEach(key => {
                    if (key.startsWith('speed_')) {
                        const digits = parseInt(key.replace('speed_', ''));
                        const records = parsed[key] || [];
                        records.forEach(record => {
                            allRecords.push({
                                name: record.name,
                                digits: digits,
                                time: record.time,
                                date: record.date || new Date().toISOString()
                            });
                        });
                    }
                });
                return { all: allRecords };
            }
            
            // Filter out training records from main leaderboards on load
            if (type === 'endurance' && Array.isArray(parsed)) {
                return parsed.filter(r => r.mode !== 'training');
            }
            if (type === 'speed' && parsed.all) {
                parsed.all = parsed.all.filter(r => r.mode !== 'training');
            }
            
            return parsed;
        } catch {
            if (type === 'speed' || type === 'trainingSpeed') {
                return { all: [] };
            }
            return [];
        }
    }
    
    async saveLeaderboard(type, data) {
        // Always save to localStorage as backup
        localStorage.setItem(`piGame_${type}Leaderboard`, JSON.stringify(data));
        
        // If Supabase is configured, also save to global leaderboard
        if (this.supabase && this.supabase.isConfigured && type !== 'trainingSpeed' && type !== 'trainingEndurance') {
            // Note: Global leaderboards are updated via saveScore method
            // This method is kept for localStorage backup
        }
    }
    
    switchLeaderboardTab(tab) {
        document.querySelectorAll('.leaderboard-tabs .tab').forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });
        
        document.getElementById('speedLeaderboard').classList.toggle('active', tab === 'speed');
        document.getElementById('enduranceLeaderboard').classList.toggle('active', tab === 'endurance');
        document.getElementById('trainingLeaderboard').classList.toggle('active', tab === 'training');
        
        if (tab === 'speed') {
            this.renderSpeedLeaderboard();
        } else if (tab === 'endurance') {
            this.renderEnduranceLeaderboard();
        } else if (tab === 'training') {
            this.renderTrainingLeaderboard();
        }
    }
    
    renderSpeedLeaderboard() {
        const range = this.elements.digitFilter.value;
        const allRecords = this.speedLeaderboard.all || [];
        
        // Parse range (e.g., "10-19", "20-49", "50-99", "100+")
        let minDigits, maxDigits;
        if (range === '100+') {
            minDigits = 100;
            maxDigits = Infinity;
        } else {
            [minDigits, maxDigits] = range.split('-').map(Number);
        }
        
        // Filter records in the selected range
        const filteredRecords = allRecords.filter(r => r.digits >= minDigits && r.digits <= maxDigits);
        
        if (filteredRecords.length === 0) {
            this.elements.speedList.innerHTML = `
                <div class="empty-leaderboard">
                    <p>No records yet for ${range} digits!</p>
                    <p>Be the first to set a time.</p>
                </div>
            `;
            return;
        }
        
        // Group by actual digit count
        const grouped = {};
        filteredRecords.forEach(record => {
            if (!grouped[record.digits]) {
                grouped[record.digits] = [];
            }
            grouped[record.digits].push(record);
        });
        
        // Sort groups by digit count (descending), and within each group by time (ascending)
        const digitGroups = Object.keys(grouped)
            .map(Number)
            .sort((a, b) => b - a)
            .map(digits => ({
                digits,
                records: grouped[digits].sort((a, b) => a.time - b.time)
            }));
        
        // Render grouped records
        let html = '';
        digitGroups.forEach(group => {
            html += `<div class="speed-group-header">${group.digits} digits</div>`;
            group.records.forEach((record, index) => {
                const rank = index + 1;
                const rankClass = rank % 2 === 1 ? 'odd' : 'even';
                const isYou = record.name === this.playerName;
                
                html += `
                    <div class="leaderboard-entry ${isYou ? 'highlight' : ''}">
                        <span class="entry-rank ${rankClass}">${rank}</span>
                        <div class="entry-info">
                            <span class="entry-name">${this.escapeHtml(record.name)}${isYou ? ' (You)' : ''}</span>
                            <span class="entry-date">${this.formatDate(record.date)}</span>
                        </div>
                        <div class="entry-time">${Number(record.time).toFixed(2)}s</div>
                    </div>
                `;
            });
        });
        
        this.elements.speedList.innerHTML = html;
    }
    
    renderEnduranceLeaderboard() {
        if (this.enduranceLeaderboard.length === 0) {
            this.elements.enduranceList.innerHTML = `
                <div class="empty-leaderboard">
                    <p>No records yet!</p>
                    <p>Start memorizing π to claim the top spot.</p>
                </div>
            `;
            return;
        }
        
        this.elements.enduranceList.innerHTML = this.enduranceLeaderboard.map((record, index) => {
            const rank = index + 1;
            const rankClass = rank % 2 === 1 ? 'odd' : 'even';
            const isYou = record.name === this.playerName;
            
            return `
                <div class="leaderboard-entry ${isYou ? 'highlight' : ''}">
                    <span class="entry-rank ${rankClass}">${rank}</span>
                    <div class="entry-info">
                        <span class="entry-name">${this.escapeHtml(record.name)}${isYou ? ' (You)' : ''}</span>
                        <span class="entry-date">${this.formatDate(record.date)}</span>
                    </div>
                    <div class="entry-score">${record.digits} digits</div>
                </div>
            `;
        }).join('');
    }
    
    renderTrainingLeaderboard() {
        // Show training speed by default
        document.querySelectorAll('.training-tabs .training-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.trainingTab === 'trainingSpeed');
        });
        document.getElementById('trainingSpeedPanel').classList.add('active');
        document.getElementById('trainingEndurancePanel').classList.remove('active');
        this.renderTrainingSpeedLeaderboard();
    }
    
    renderTrainingSpeedLeaderboard() {
        const range = this.elements.trainingDigitFilter.value;
        const allRecords = this.trainingSpeedLeaderboard.all || [];
        
        // Parse range (e.g., "10-19", "20-49", "50-99", "100+")
        let minDigits, maxDigits;
        if (range === '100+') {
            minDigits = 100;
            maxDigits = Infinity;
        } else {
            [minDigits, maxDigits] = range.split('-').map(Number);
        }
        
        // Filter records in the selected range
        const filteredRecords = allRecords.filter(r => r.digits >= minDigits && r.digits <= maxDigits);
        
        if (filteredRecords.length === 0) {
            this.elements.trainingSpeedList.innerHTML = `
                <div class="empty-leaderboard">
                    <p>No records yet for ${range} digits!</p>
                    <p>Be the first to set a time.</p>
                </div>
            `;
            return;
        }
        
        // Group by actual digit count
        const grouped = {};
        filteredRecords.forEach(record => {
            if (!grouped[record.digits]) {
                grouped[record.digits] = [];
            }
            grouped[record.digits].push(record);
        });
        
        // Sort groups by digit count (descending), and within each group by time (ascending)
        const digitGroups = Object.keys(grouped)
            .map(Number)
            .sort((a, b) => b - a)
            .map(digits => ({
                digits,
                records: grouped[digits].sort((a, b) => a.time - b.time)
            }));
        
        // Render grouped records
        let html = '';
        digitGroups.forEach(group => {
            html += `<div class="speed-group-header">${group.digits} digits</div>`;
            group.records.forEach((record, index) => {
                const rank = index + 1;
                const rankClass = rank % 2 === 1 ? 'odd' : 'even';
                const isYou = record.name === this.playerName;
                
                html += `
                    <div class="leaderboard-entry ${isYou ? 'highlight' : ''}">
                        <span class="entry-rank ${rankClass}">${rank}</span>
                        <div class="entry-info">
                            <span class="entry-name">${this.escapeHtml(record.name)}${isYou ? ' (You)' : ''}</span>
                            <span class="entry-date">${this.formatDate(record.date)}</span>
                        </div>
                        <div class="entry-time">${Number(record.time).toFixed(2)}s</div>
                    </div>
                `;
            });
        });
        
        this.elements.trainingSpeedList.innerHTML = html;
    }
    
    renderTrainingEnduranceLeaderboard() {
        if (this.trainingEnduranceLeaderboard.length === 0) {
            this.elements.trainingEnduranceList.innerHTML = `
                <div class="empty-leaderboard">
                    <p>No records yet!</p>
                    <p>Start training to claim the top spot.</p>
                </div>
            `;
            return;
        }
        
        this.elements.trainingEnduranceList.innerHTML = this.trainingEnduranceLeaderboard.map((record, index) => {
            const rank = index + 1;
            const rankClass = rank % 2 === 1 ? 'odd' : 'even';
            const isYou = record.name === this.playerName;
            
            return `
                <div class="leaderboard-entry ${isYou ? 'highlight' : ''}">
                    <span class="entry-rank ${rankClass}">${rank}</span>
                    <div class="entry-info">
                        <span class="entry-name">${this.escapeHtml(record.name)}${isYou ? ' (You)' : ''}</span>
                        <span class="entry-date">${this.formatDate(record.date)}</span>
                    </div>
                    <div class="entry-score">${record.digits} digits</div>
                </div>
            `;
        }).join('');
    }
    
    // ========================================
    // Lives & Shop System
    // ========================================
    
    loadLives() {
        const savedLives = localStorage.getItem('piGameLives');
        const lastRegenTime = localStorage.getItem('piGameLastRegen');
        
        let lives = savedLives !== null ? parseInt(savedLives) : 5;
        
        // Regenerate lives (1 per hour, max 5)
        if (lastRegenTime) {
            const hoursPassed = (Date.now() - parseInt(lastRegenTime)) / (1000 * 60 * 60);
            const livesToAdd = Math.floor(hoursPassed);
            if (livesToAdd > 0 && lives < 5) {
                lives = Math.min(5, lives + livesToAdd);
                localStorage.setItem('piGameLastRegen', Date.now());
            }
        } else {
            localStorage.setItem('piGameLastRegen', Date.now());
        }
        
        return lives;
    }
    
    saveLives() {
        localStorage.setItem('piGameLives', this.lives);
        localStorage.setItem('piGameLastRegen', Date.now());
    }
    
    addLives(amount) {
        this.lives += amount;
        this.saveLives();
        this.updateUI();
    }
    
    openShop() {
        this.modals.shop.classList.add('active');
    }
    
    closeShop() {
        this.modals.shop.classList.remove('active');
    }
    
    handleShopPurchase(item) {
        const lives = item.dataset.lives;
        const action = item.dataset.action;
        const price = item.dataset.price;
        
        if (action === 'ad') {
            this.watchAd();
        } else if (lives === 'unlimited') {
            // Premium subscription - would integrate with payment provider
            alert('Premium subscription coming soon! This would connect to Stripe or app store billing.');
        } else {
            // One-time purchase - would integrate with payment provider
            alert(`Purchase ${lives} lives for $${price}\n\nThis would connect to Stripe or app store billing.`);
            // For demo, give the lives
            // this.addLives(parseInt(lives));
        }
        
        this.closeShop();
    }
    
    async watchAd() {
        if (!this.adManager) {
            // Fallback if ad manager not loaded
            alert('📺 Ad system not available');
            return;
        }
        
        try {
            // Load rewarded ad if not already loaded
            if (!this.adManager.rewardedAd) {
                const loaded = await this.adManager.loadRewardedAd();
                if (!loaded) {
                    // Use placeholder if ad failed to load
                    console.log('Using placeholder ad');
                }
            }
            
            // Show the rewarded ad
            const result = await this.adManager.showRewardedAd();
            
            if (result.success) {
                // Reward the player
                const livesEarned = result.reward?.lives || 5;
                this.addLives(livesEarned);
                
                // Show success message
                const message = document.createElement('div');
                message.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.95);
                    border: 2px solid #00f5d4;
                    border-radius: 12px;
                    padding: 30px;
                    z-index: 10001;
                    text-align: center;
                    color: #00f5d4;
                    font-family: Arial, sans-serif;
                `;
                message.innerHTML = `
                    <h2 style="margin: 0 0 15px 0;">🎉 Reward Earned!</h2>
                    <p style="font-size: 24px; margin: 0;">+${livesEarned} Lives ❤️</p>
                `;
                document.body.appendChild(message);
                
                setTimeout(() => {
                    message.remove();
                }, 2000);
            } else {
                console.log('Ad was closed without reward');
            }
        } catch (error) {
            console.error('Error showing ad:', error);
            alert('Failed to show ad. Please try again.');
        }
    }
    
    // ========================================
    // UI Helpers
    // ========================================
    
    async showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
        
        // Render leaderboards when showing that screen
        if (screenName === 'leaderboard') {
            // Reload leaderboards to get latest global data
            await this.loadAllLeaderboards();
            this.renderSpeedLeaderboard();
            this.renderEnduranceLeaderboard();
        }
    }
    
    updateUI() {
        this.elements.livesCount.textContent = this.lives;
        this.elements.bestDigits.textContent = this.bestScore;
        this.elements.totalAttempts.textContent = this.totalAttempts;
        this.updateDigitCounterDisplay();
    }
    
    updateDigitCounterDisplay() {
        // Update current counter
        if (this.elements.digitCounter) {
            this.elements.digitCounter.textContent = this.currentDigitIndex.toString();
        }
        
        // Update highest counter based on current mode
        if (this.elements.highestCounter) {
            const currentMode = this.currentLayout === 'training' ? 'training' : (this.currentLayout === 'reveal' ? 'reveal' : 'classic');
            this.elements.highestCounter.textContent = this.sessionHighestDigits[currentMode].toString();
        }
    }
    
    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ========================================
    // Background Music
    // ========================================
    
    initMusic() {
        this.backgroundMusic = document.getElementById('backgroundMusic');
        this.musicToggle = document.getElementById('musicToggle');
        this.isMusicPlaying = localStorage.getItem('piGameMusic') !== 'false'; // Default to true
        
        // Set initial volume (30% for background music)
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3;
        }
        
        // Load saved music state
        if (this.isMusicPlaying && this.backgroundMusic) {
            // Try to play (may require user interaction first)
            this.backgroundMusic.play().catch(() => {
                // Autoplay blocked - will start on first user interaction
                console.log('Music autoplay blocked, will start on user interaction');
            });
        }
        
        // Toggle button
        if (this.musicToggle) {
            this.musicToggle.addEventListener('click', () => this.toggleMusic());
            this.updateMusicButton();
        }
        
        // Start music on first user interaction (if not already playing)
        const startMusicOnInteraction = () => {
            if (this.isMusicPlaying && this.backgroundMusic && this.backgroundMusic.paused) {
                this.backgroundMusic.play().catch(() => {});
            }
            // Remove listeners after first interaction
            document.removeEventListener('click', startMusicOnInteraction);
            document.removeEventListener('keydown', startMusicOnInteraction);
        };
        
        document.addEventListener('click', startMusicOnInteraction, { once: true });
        document.addEventListener('keydown', startMusicOnInteraction, { once: true });
    }
    
    toggleMusic() {
        if (!this.backgroundMusic) return;
        
        this.isMusicPlaying = !this.isMusicPlaying;
        localStorage.setItem('piGameMusic', this.isMusicPlaying.toString());
        
        if (this.isMusicPlaying) {
            this.backgroundMusic.play().catch(() => {
                console.log('Failed to play music');
            });
        } else {
            this.backgroundMusic.pause();
        }
        
        this.updateMusicButton();
    }
    
    updateMusicButton() {
        if (this.musicToggle) {
            this.musicToggle.textContent = this.isMusicPlaying ? '🎵' : '🔇';
            this.musicToggle.classList.toggle('muted', !this.isMusicPlaying);
        }
    }
}

// ========================================
// Initialize Game
// ========================================

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    window.game = new PiGame();
});

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}

