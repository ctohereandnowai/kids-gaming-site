// Main application object
const KidsGamingSite = {
    // Data storage
    data: {
        branding: null,
        theme: null,
        games: null
    },
    
    // Initialize the application
    async init() {
        console.log('🎮 Initializing Kids Gaming Site...');
        
        try {
            // Load all data files
            await this.loadData();
            
            // Apply branding and theme
            this.applyBranding();
            this.applyTheme();
            
            // Populate content
            this.populateGames();
            this.initCountdown();
            this.setupEventListeners();
            
            console.log('✅ Site initialized successfully!');
        } catch (error) {
            console.error('❌ Error initializing site:', error);
            this.showErrorMessage('Failed to load site data. Please refresh the page.');
        }
    },
    
    // Load JSON data files
    async loadData() {
        console.log('📦 Loading data files...');
        
        try {
            const [brandingResponse, themeResponse, gamesResponse] = await Promise.all([
                fetch('./data/branding.json'),
                fetch('./data/theme.json'),
                fetch('./data/games.json')
            ]);
            
            this.data.branding = await brandingResponse.json();
            this.data.theme = await themeResponse.json();
            this.data.games = await gamesResponse.json();
            
            console.log('📦 Data loaded:', this.data);
        } catch (error) {
            console.error('Failed to load data files:', error);
            throw error;
        }
    },
    
    // Apply branding from branding.json
    applyBranding() {
        console.log('🎨 Applying branding...');
        
        const { branding } = this.data;
        if (!branding || !branding.brand) return;
        
        const brand = branding.brand;
        
        // Update favicon
        const favicon = document.getElementById('favicon');
        if (favicon && brand.logo && brand.logo.favicon) {
            favicon.href = brand.logo.favicon;
        }
        
        // Update logo
        const logo = document.getElementById('site-logo');
        if (logo && brand.logo && brand.logo.title) {
            logo.src = brand.logo.title;
            logo.alt = `${brand.organizationName} Logo`;
        }
        
        // Update organization name
        const orgName = document.getElementById('org-name');
        if (orgName && brand.organizationName) {
            orgName.textContent = brand.organizationName;
        }
        
        // Update slogan
        const slogan = document.getElementById('hero-slogan');
        if (slogan && brand.slogan) {
            slogan.textContent = brand.slogan;
        }
        
        // Update contact information
        this.updateContactInfo(brand);
        
        // Update social media links
        this.updateSocialLinks(brand.socialMedia);
    },
    
    // Update contact information
    updateContactInfo(brand) {
        const email = document.getElementById('contact-email');
        const phone = document.getElementById('contact-phone');
        
        if (email && brand.email) {
            email.textContent = brand.email;
            email.href = `mailto:${brand.email}`;
        }
        
        if (phone && brand.mobile) {
            phone.textContent = brand.mobile;
        }
    },
    
    // Update social media links
    updateSocialLinks(socialMedia) {
        const socialContainer = document.getElementById('social-links');
        if (!socialContainer || !socialMedia) return;
        
        socialContainer.innerHTML = '';
        
        const socialPlatforms = [
            { key: 'linkedin', icon: 'in', name: 'LinkedIn' },
            { key: 'instagram', icon: 'ig', name: 'Instagram' },
            { key: 'github', icon: 'gh', name: 'GitHub' },
            { key: 'x', icon: 'x', name: 'X (Twitter)' },
            { key: 'youtube', icon: 'yt', name: 'YouTube' }
        ];
        
        socialPlatforms.forEach(platform => {
            if (socialMedia[platform.key]) {
                const link = document.createElement('a');
                link.href = socialMedia[platform.key];
                link.className = 'social-link';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.title = `Visit our ${platform.name}`;
                link.textContent = platform.icon;
                link.setAttribute('aria-label', `Visit our ${platform.name} page`);
                
                socialContainer.appendChild(link);
            }
        });
    },
    
    // Apply theme from theme.json
    applyTheme() {
        console.log('🎨 Applying theme...');
        
        const { theme } = this.data;
        if (!theme) return;
        
        const root = document.documentElement;
        
        // Apply colors
        if (theme.colors) {
            Object.entries(theme.colors).forEach(([key, value]) => {
                root.style.setProperty(`--${key}`, value);
            });
        }
        
        // Apply font
        if (theme.font) {
            root.style.setProperty('--font-family', theme.font);
        }
        
        // TODO: Student exercise - Add support for dark/light mode toggle
        // TODO: Student exercise - Add custom CSS properties for spacing and shadows
    },
    
    // Populate games from games.json
    populateGames() {
        console.log('🎮 Populating games...');
        
        const { games } = this.data;
        if (!games || !games.games) return;
        
        // Update site title and tagline
        const title = document.getElementById('site-title');
        const heroTitle = document.getElementById('hero-title');
        
        if (title && games.title) {
            title.textContent = games.title;
            document.title = games.title;
        }
        
        if (heroTitle && games.tagline) {
            heroTitle.textContent = games.tagline;
        }
        
        // Populate games grid
        const gamesGrid = document.getElementById('games-grid');
        if (!gamesGrid) return;
        
        gamesGrid.innerHTML = '';
        
        games.games.forEach(game => {
            const gameCard = this.createGameCard(game);
            gamesGrid.appendChild(gameCard);
        });
    },
    
    // Create a game card element
    createGameCard(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.setAttribute('role', 'gridcell');
        card.setAttribute('tabindex', '0');
        
        card.innerHTML = `
            <img src="${game.thumb || 'https://via.placeholder.com/300x200?text=Game+Image'}" 
                 alt="${game.name} thumbnail" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=Game+Image'">
            <h3>${game.name}</h3>
            <p>${game.description}</p>
            <span class="difficulty-badge">${game.difficulty || 'Easy'}</span>
        `;
        
        // Add click/enter event listener
        const handleActivation = () => {
            if (game.url) {
                window.open(game.url, '_blank', 'noopener,noreferrer');
            } else {
                console.log(`🎮 Starting game: ${game.name}`);
                // TODO: Student exercise - Add game launch functionality
            }
        };
        
        card.addEventListener('click', handleActivation);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleActivation();
            }
        });
        
        return card;
    },
    
    // Initialize countdown timer
    initCountdown() {
        console.log('⏰ Initializing countdown...');
        
        const { games } = this.data;
        if (!games || !games.countdownTarget) return;
        
        const targetDate = new Date(games.countdownTarget);
        
        const updateCountdown = () => {
            const now = new Date();
            const timeDiff = targetDate - now;
            
            if (timeDiff <= 0) {
                this.showCountdownExpired();
                return;
            }
            
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            this.updateCountdownDisplay(days, hours, minutes, seconds);
        };
        
        // Update immediately and then every second
        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    },
    
    // Update countdown display
    updateCountdownDisplay(days, hours, minutes, seconds) {
        const elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        if (elements.days) elements.days.textContent = String(days).padStart(2, '0');
        if (elements.hours) elements.hours.textContent = String(hours).padStart(2, '0');
        if (elements.minutes) elements.minutes.textContent = String(minutes).padStart(2, '0');
        if (elements.seconds) elements.seconds.textContent = String(seconds).padStart(2, '0');
    },
    
    // Show countdown expired message
    showCountdownExpired() {
        const countdownTimer = document.getElementById('countdown-timer');
        if (countdownTimer) {
            countdownTimer.innerHTML = '<h3 style="color: var(--primary);">🎉 New Game Released!</h3>';
        }
        
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
    },
    
    // Setup event listeners
    setupEventListeners() {
        console.log('🎧 Setting up event listeners...');
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // TODO: Student exercise - Add search functionality for games
        // TODO: Student exercise - Add filter by difficulty functionality
        // TODO: Student exercise - Add keyboard navigation for game cards
    },
    
    // Show error message to user
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4757;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            max-width: 300px;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    KidsGamingSite.init();
});

// Handle page visibility changes (for countdown timer optimization)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && KidsGamingSite.countdownInterval) {
        // Refresh countdown when page becomes visible
        console.log('🔄 Page visible - refreshing countdown...');
    }
});

// Export for potential testing (if in module environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KidsGamingSite;
}

// TODO: Student exercise - Add game search functionality
// TODO: Student exercise - Add favorite games feature with localStorage
// TODO: Student exercise - Add game rating system
// TODO: Student exercise - Add responsive image loading for better performance
