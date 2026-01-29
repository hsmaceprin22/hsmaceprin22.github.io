/* =====================================================
   H-SMA-CE TOUR GUIDE SYSTEM
   Version: 1.1
   ===================================================== */

(function() {
    'use strict';

    // =====================================================
    // CONFIGURATION
    // =====================================================
    const CONFIG = {
        storageKey: 'hsmace_tour_completed',
        welcomeDelay: 2500, // ms before showing welcome bubble
        extraMargin: 40,    // px extra margin below navbar
        animationDuration: 500
    };

    // =====================================================
    // TOUR STEPS DEFINITION
    // =====================================================
    // Steps can be configured per-page by setting window.TOUR_STEPS before this script loads
    // Falls back to empty array if not defined (tour won't start automatically)
    const TOUR_STEPS = window.TOUR_STEPS || [];

    // =====================================================
    // STATE
    // =====================================================
    let state = {
        currentStep: 0,
        isActive: false,
        character: Math.random() > 0.5 ? 'man' : 'woman',
        isSpeaking: false
    };

    // =====================================================
    // DOM ELEMENTS (created dynamically)
    // =====================================================
    let elements = {};

    // =====================================================
    // CHARACTER SVG TEMPLATES
    // =====================================================
    const getCharacterSVG = (gender, isWaving, isSpeaking) => {
        const skinColor = gender === 'man' ? '#F3C5A8' : '#F7D7C4';
        const hairColor = gender === 'man' ? '#2D2D2D' : '#3E2723';
        const jacketColor = gender === 'man' ? '#1E293B' : '#C62828';
        const shirtColor = '#FFFFFF';
        
        const waveClass = isWaving ? 'arm-wave' : '';
        const talkClass = isSpeaking ? 'mouth-talk' : '';
        
        // Arm paths
        const leftArmWaving = `<path d="M75 205 Q45 215 35 145" stroke="${jacketColor}" stroke-width="24" stroke-linecap="round" />
            <circle cx="35" cy="135" r="13" fill="${skinColor}" />`;
        const leftArmDown = `<path d="M75 205 Q45 225 45 290" stroke="${jacketColor}" stroke-width="24" stroke-linecap="round" />
            <circle cx="45" cy="295" r="13" fill="${skinColor}" />`;
        
        // Mouth paths - speaking mouth is an ellipse that scales from center
        const mouthSpeaking = `<ellipse cx="120" cy="150" rx="8" ry="4" fill="#551A1A" class="${talkClass}" />`;
        const mouthSmiling = `<path d="M110 150 Q120 158 130 150" stroke="#444" stroke-width="2" stroke-linecap="round" />`;
        
        // Gender-specific elements
        const manHair = `
            <path d="M78 110 V90 C78 62 90 52 120 52 C150 52 162 62 162 90 V110" fill="${hairColor}" />
            <path d="M78 95 C78 70 90 60 120 58 C140 58 162 70 162 100 L162 90 C162 62 140 52 120 52 C90 52 78 62 78 95" fill="${hairColor}" />
            <path d="M78 100 L78 135 L84 125 Z" fill="${hairColor}" />
            <path d="M162 100 L162 135 L156 125 Z" fill="${hairColor}" />`;
        
        const womanHair = `
            <path d="M75 120 C75 80 85 70 120 70 C155 70 165 80 165 120" fill="${hairColor}" />
            <path d="M120 70 C100 70 70 80 65 130 L60 200 L85 200 L85 140 C85 100 110 90 120 70" fill="${hairColor}" />
            <path d="M120 70 C140 70 170 80 175 130 L180 200 L155 200 L155 140 C155 100 130 90 120 70" fill="${hairColor}" />`;
        
        const womanBackHair = `<path d="M70 120 Q60 180 50 240 Q120 270 190 240 Q180 180 170 120" fill="${hairColor}" />`;
        
        const manTorso = `
            <path d="M70 340 L70 210 C70 180 170 180 170 210 L170 340 Z" fill="${shirtColor}" />
            <path d="M70 340 L70 210 C70 185 105 185 105 210 L105 340 L70 340 Z" fill="${jacketColor}" />
            <path d="M170 340 L170 210 C170 185 135 185 135 210 L135 340 L170 340 Z" fill="${jacketColor}" />
            <path d="M70 210 L105 280 L105 210 Z" fill="${jacketColor}" />
            <path d="M170 210 L135 280 L135 210 Z" fill="${jacketColor}" />`;
        
        const womanTorso = `
            <path d="M75 340 L75 210 C75 185 165 185 165 210 L165 340 Z" fill="${jacketColor}" />
            <path d="M75 210 Q120 235 165 210" fill="${jacketColor}" />
            <path d="M75 210 Q120 235 165 210" stroke="black" stroke-opacity="0.1" stroke-width="1" fill="none"/>`;
        
        const manHead = `<path d="M82 110 C82 80 95 60 120 60 C145 60 158 80 158 110 V135 Q158 165 120 165 Q82 165 82 135 Z" fill="${skinColor}" />`;
        const womanHead = `<ellipse cx="120" cy="122" rx="42" ry="48" fill="${skinColor}" />`;
        
        const manEyebrows = `
            <path d="M100 115 Q106 113 112 115" stroke="#1E293B" stroke-width="2" stroke-linecap="round" />
            <path d="M128 115 Q134 113 140 115" stroke="#1E293B" stroke-width="2" stroke-linecap="round" />`;
        const womanEyebrows = `
            <path d="M100 114 Q106 110 112 114" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" />
            <path d="M128 114 Q134 110 140 114" stroke="#1E293B" stroke-width="1.5" stroke-linecap="round" />`;

        return `
        <svg viewBox="0 0 240 340" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Ground Shadow -->
            <ellipse cx="120" cy="330" rx="50" ry="4" fill="black" fill-opacity="0.05" />
            
            ${gender === 'woman' ? womanBackHair : ''}
            
            <!-- Right Arm (Static) -->
            <g>
                <path d="M165 205 Q195 225 195 290" stroke="${jacketColor}" stroke-width="24" stroke-linecap="round" />
                <circle cx="195" cy="295" r="13" fill="${skinColor}" />
            </g>
            
            <!-- Left Arm (Animated) -->
            <g class="${waveClass}" style="transform-origin: 65px 215px;">
                ${isWaving ? leftArmWaving : leftArmDown}
            </g>
            
            <!-- Torso -->
            ${gender === 'man' ? manTorso : womanTorso}
            
            <!-- Neck -->
            <path d="M105 190 L105 165 L135 165 L135 190 Z" fill="${skinColor}" />
            <rect x="105" y="180" width="30" height="15" fill="black" fill-opacity="0.05" />
            
            <!-- Head -->
            ${gender === 'man' ? manHead : womanHead}
            
            <!-- Ears -->
            <circle cx="76" cy="125" r="5" fill="${skinColor}" />
            <circle cx="164" cy="125" r="5" fill="${skinColor}" />
            
            <!-- Eyes -->
            <ellipse cx="106" cy="125" rx="4" ry="5" fill="#1E293B" />
            <ellipse cx="134" cy="125" rx="4" ry="5" fill="#1E293B" />
            
            <!-- Eyebrows -->
            ${gender === 'man' ? manEyebrows : womanEyebrows}
            
            <!-- Mouth -->
            ${isSpeaking ? mouthSpeaking : mouthSmiling}
            
            <!-- Hair -->
            ${gender === 'man' ? manHair : womanHair}
        </svg>`;
    };

    // =====================================================
    // ARROW SVG
    // =====================================================
    const ARROW_SVG = `
        <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 30 L40 30" stroke="#c9a227" stroke-width="4" stroke-linecap="round"/>
            <path d="M30 20 L42 30 L30 40" stroke="#c9a227" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;

    // =====================================================
    // INITIALIZATION
    // =====================================================
    function init() {
        // Don't initialize if no steps defined for this page
        if (TOUR_STEPS.length === 0) {
            console.log('Tour Guide: No steps defined for this page');
            return;
        }
        
        createElements();
        bindEvents();
        
        // Check if first visit
        if (!localStorage.getItem(CONFIG.storageKey)) {
            setTimeout(showWelcome, CONFIG.welcomeDelay);
        }
        
        // Update character appearance
        updateCharacter();
    }

    function createElements() {
        // Main container
        const container = document.createElement('div');
        container.className = 'tour-avatar-container';
        container.innerHTML = `
            <div class="tour-welcome-bubble" id="tourWelcome">
                <div class="tour-welcome-text">
                    <strong>Ciao!</strong> 👋<br>
                    Welcome to the H-SMA-CE website. Would you like a quick tour?
                </div>
                <div class="tour-welcome-buttons">
                    <button class="tour-btn tour-btn-primary" id="tourStart">
                        Yes, show me!
                    </button>
                    <button class="tour-btn tour-btn-secondary" id="tourDismiss">
                        No thanks
                    </button>
                </div>
            </div>
            <div class="tour-floating-controls" id="tourFloating">
                <div class="tour-floating-info">
                    <div class="tour-floating-title" id="tourFloatingTitle"></div>
                    <div class="tour-floating-content" id="tourFloatingContent"></div>
                    <div class="tour-floating-step" id="tourFloatingStep"></div>
                </div>
                <div class="tour-floating-nav">
                    <button class="tour-btn tour-btn-secondary" id="tourFloatingPrev">← Back</button>
                    <button class="tour-btn tour-btn-skip" id="tourFloatingSkip">Skip</button>
                    <button class="tour-btn tour-btn-primary" id="tourFloatingNext">Next →</button>
                </div>
            </div>
            <div class="tour-avatar idle" id="tourAvatar" tabindex="0" role="button" aria-label="Tour guide - click to start tour">
                ${getCharacterSVG(state.character, true, false)}
            </div>
        `;
        document.body.appendChild(container);

        // Overlay
        const overlay = document.createElement('div');
        overlay.className = 'tour-overlay';
        overlay.id = 'tourOverlay';
        overlay.innerHTML = `<div class="tour-spotlight" id="tourSpotlight"></div>`;
        document.body.appendChild(overlay);

        // Tooltip (for navbar step only)
        const tooltip = document.createElement('div');
        tooltip.className = 'tour-tooltip';
        tooltip.id = 'tourTooltip';
        tooltip.innerHTML = `
            <div class="tour-tooltip-header">
                <span class="tour-tooltip-step" id="tourStepNumber">1/6</span>
                <h3 class="tour-tooltip-title" id="tourTitle">Welcome</h3>
            </div>
            <div class="tour-tooltip-body">
                <div class="tour-tooltip-content" id="tourContent"></div>
                <div class="tour-tooltip-nav">
                    <button class="tour-btn tour-btn-prev" id="tourPrev">← Back</button>
                    <button class="tour-btn tour-btn-skip" id="tourSkip">Skip tour</button>
                    <button class="tour-btn tour-btn-next" id="tourNext">Next →</button>
                </div>
            </div>
            <div class="tour-progress" id="tourProgress"></div>
        `;
        document.body.appendChild(tooltip);

        // Arrow
        const arrow = document.createElement('div');
        arrow.className = 'tour-arrow';
        arrow.id = 'tourArrow';
        arrow.innerHTML = ARROW_SVG;
        document.body.appendChild(arrow);

        // Store references
        elements = {
            container,
            avatar: document.getElementById('tourAvatar'),
            welcome: document.getElementById('tourWelcome'),
            floating: document.getElementById('tourFloating'),
            floatingTitle: document.getElementById('tourFloatingTitle'),
            floatingContent: document.getElementById('tourFloatingContent'),
            floatingStep: document.getElementById('tourFloatingStep'),
            floatingPrev: document.getElementById('tourFloatingPrev'),
            floatingNext: document.getElementById('tourFloatingNext'),
            floatingSkip: document.getElementById('tourFloatingSkip'),
            overlay: document.getElementById('tourOverlay'),
            spotlight: document.getElementById('tourSpotlight'),
            tooltip: document.getElementById('tourTooltip'),
            arrow: document.getElementById('tourArrow'),
            stepNumber: document.getElementById('tourStepNumber'),
            title: document.getElementById('tourTitle'),
            content: document.getElementById('tourContent'),
            progress: document.getElementById('tourProgress'),
            prevBtn: document.getElementById('tourPrev'),
            nextBtn: document.getElementById('tourNext'),
            skipBtn: document.getElementById('tourSkip'),
            startBtn: document.getElementById('tourStart'),
            dismissBtn: document.getElementById('tourDismiss')
        };

        // Create progress dots
        TOUR_STEPS.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.className = 'tour-progress-dot';
            dot.dataset.step = i;
            elements.progress.appendChild(dot);
        });
    }

    function bindEvents() {
        // Avatar click
        elements.avatar.addEventListener('click', handleAvatarClick);
        elements.avatar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAvatarClick();
            }
        });

        // Welcome buttons
        elements.startBtn.addEventListener('click', startTour);
        elements.dismissBtn.addEventListener('click', dismissWelcome);

        // Navigation buttons (tooltip)
        elements.prevBtn.addEventListener('click', prevStep);
        elements.nextBtn.addEventListener('click', nextStep);
        elements.skipBtn.addEventListener('click', endTour);

        // Navigation buttons (floating)
        elements.floatingPrev.addEventListener('click', prevStep);
        elements.floatingNext.addEventListener('click', nextStep);
        elements.floatingSkip.addEventListener('click', endTour);

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.isActive) {
                endTour();
            }
        });

        // Overlay click (outside spotlight)
        elements.overlay.addEventListener('click', (e) => {
            if (e.target === elements.overlay) {
                endTour();
            }
        });

        // Window resize
        window.addEventListener('resize', debounce(() => {
            if (state.isActive) {
                updateStepPosition();
            }
        }, 200));

        // Hide avatar when hamburger menu is open (mobile)
        setupHamburgerListener();
    }

    // =====================================================
    // HAMBURGER MENU DETECTION
    // =====================================================
    function setupHamburgerListener() {
        const hamburger = document.querySelector('#hamburger, .hamburger');
        const navLinks = document.querySelector('#navLinks, .nav-links');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                // Piccolo delay per permettere alla classe di essere aggiunta/rimossa
                setTimeout(() => {
                    checkMenuState();
                }, 50);
            });
        }

        // Anche quando si clicca su un link del menu
        if (navLinks) {
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(() => {
                        checkMenuState();
                    }, 50);
                });
            });
        }

        // Observer per rilevare cambiamenti di classe sul nav
        if (navLinks) {
            const observer = new MutationObserver(() => {
                checkMenuState();
            });
            observer.observe(navLinks, { attributes: true, attributeFilter: ['class'] });
        }
    }

    function checkMenuState() {
        const navLinks = document.querySelector('#navLinks, .nav-links');
        const isMobile = window.innerWidth <= 768;
        
        if (!isMobile || !navLinks) {
            elements.container.classList.remove('menu-open');
            return;
        }

        // Controlla se il menu è aperto (cerca classi comuni)
        const isMenuOpen = navLinks.classList.contains('active') || 
                          navLinks.classList.contains('open') ||
                          navLinks.classList.contains('show') ||
                          navLinks.classList.contains('visible');
        
        if (isMenuOpen) {
            elements.container.classList.add('menu-open');
        } else {
            elements.container.classList.remove('menu-open');
        }
    }

    // =====================================================
    // WELCOME BUBBLE
    // =====================================================
    function showWelcome() {
        elements.welcome.classList.add('visible');
    }

    function dismissWelcome() {
        elements.welcome.classList.remove('visible');
        localStorage.setItem(CONFIG.storageKey, 'dismissed');
    }

    function handleAvatarClick() {
        if (state.isActive) {
            // If tour is active, clicking avatar ends it
            endTour();
            return;
        }
        
        if (elements.welcome.classList.contains('visible')) {
            // If welcome is showing, start tour
            startTour();
        } else {
            // Show welcome bubble again
            showWelcome();
        }
    }

    // =====================================================
    // TOUR CONTROL
    // =====================================================
    function startTour() {
        // Reset state completely
        state.currentStep = 0;
        state.isActive = true;
        
        elements.welcome.classList.remove('visible');
        elements.container.classList.add('tour-active');
        elements.overlay.classList.add('active');
        elements.avatar.classList.remove('idle');
        
        // Start speaking animation
        setSpeaking(true);
        
        // First scroll to top of page, then show first step
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Wait for scroll to complete before showing first step
        setTimeout(() => {
            showStep(0);
        }, 600);
        
        localStorage.setItem(CONFIG.storageKey, 'completed');
    }

    function endTour() {
        state.isActive = false;
        state.currentStep = 0;
        
        elements.container.classList.remove('tour-active');
        elements.overlay.classList.remove('active');
        elements.tooltip.classList.remove('visible');
        elements.floating.classList.remove('visible');
        elements.arrow.classList.remove('visible');
        elements.avatar.classList.add('idle');
        
        setSpeaking(false);
        updateCharacter();
        
        // Reset scroll position
        document.body.style.overflow = '';
    }

    function nextStep() {
        if (state.currentStep < TOUR_STEPS.length - 1) {
            showStep(state.currentStep + 1);
        } else {
            endTour();
        }
    }

    function prevStep() {
        if (state.currentStep > 0) {
            showStep(state.currentStep - 1);
        }
    }

    function showStep(stepIndex) {
        state.currentStep = stepIndex;
        const step = TOUR_STEPS[stepIndex];
        
        // Determine actual target - handle mobile hamburger menu
        let targetSelector = step.target;
        const isMobile = window.innerWidth <= 768;
        
        // If targeting navbar on mobile, switch to hamburger
        if ((targetSelector === '#navLinks' || targetSelector === '.nav-links') && isMobile) {
            targetSelector = '#hamburger, .hamburger';
        }
        
        const target = document.querySelector(targetSelector);
        
        if (!target) {
            console.warn(`Tour target not found: ${targetSelector}`);
            nextStep();
            return;
        }

        // Update floating controls content
        elements.floatingTitle.textContent = step.title;
        elements.floatingContent.innerHTML = step.content;
        elements.floatingStep.textContent = `Step ${stepIndex + 1} of ${TOUR_STEPS.length}`;

        // Update navigation buttons visibility
        elements.floatingPrev.style.display = stepIndex === 0 ? 'none' : 'inline-flex';
        
        const isLastStep = stepIndex === TOUR_STEPS.length - 1;
        
        if (isLastStep) {
            elements.floatingNext.textContent = 'Finish ✓';
            elements.floatingNext.classList.remove('tour-btn-primary');
            elements.floatingNext.classList.add('tour-btn-finish');
        } else {
            elements.floatingNext.textContent = 'Next →';
            elements.floatingNext.classList.remove('tour-btn-finish');
            elements.floatingNext.classList.add('tour-btn-primary');
        }

        // Always show floating controls
        elements.floating.classList.add('visible');
        elements.tooltip.classList.remove('visible');

        // Show/hide arrow based on step configuration
        if (step.showArrow) {
            elements.arrow.classList.add('visible');
        } else {
            elements.arrow.classList.remove('visible');
        }

        // Scroll to target then update positions
        scrollToTarget(target, () => {
            updateStepPosition();
        });
    }

    function updateStepPosition() {
        const step = TOUR_STEPS[state.currentStep];
        
        // Determine actual target - handle mobile hamburger menu
        let targetSelector = step.target;
        const isMobile = window.innerWidth <= 768;
        
        if ((targetSelector === '#navLinks' || targetSelector === '.nav-links') && isMobile) {
            targetSelector = '#hamburger, .hamburger';
        }
        
        const target = document.querySelector(targetSelector);
        
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const padding = 10;

        // Position spotlight
        elements.spotlight.style.top = `${rect.top - padding}px`;
        elements.spotlight.style.left = `${rect.left - padding}px`;
        elements.spotlight.style.width = `${rect.width + padding * 2}px`;
        elements.spotlight.style.height = `${rect.height + padding * 2}px`;

        // Position arrow only if it should be visible
        if (step.showArrow) {
            positionArrow(rect);
        }
    }

    function positionTooltip(targetRect, position) {
        const tooltip = elements.tooltip;
        const tooltipRect = tooltip.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 20;
        const minDistanceFromTarget = 80;

        let top, left;

        // On mobile, always position at bottom of screen
        if (viewportWidth < 768) {
            tooltip.style.bottom = '20px';
            tooltip.style.top = 'auto';
            tooltip.style.left = '20px';
            tooltip.style.right = '20px';
            return;
        }

        // Calculate available space
        const spaceAbove = targetRect.top;
        const spaceBelow = viewportHeight - targetRect.bottom;
        const tooltipHeight = tooltipRect.height || 200;

        // Determine best vertical position
        if (spaceBelow >= tooltipHeight + minDistanceFromTarget) {
            top = targetRect.bottom + minDistanceFromTarget;
        } else if (spaceAbove >= tooltipHeight + minDistanceFromTarget) {
            top = targetRect.top - tooltipHeight - minDistanceFromTarget;
        } else {
            top = viewportHeight - tooltipHeight - margin;
        }

        top = Math.max(margin, Math.min(top, viewportHeight - tooltipHeight - margin));

        // Horizontal centering
        left = (viewportWidth - tooltipRect.width) / 2;
        left = Math.max(margin, Math.min(left, viewportWidth - tooltipRect.width - margin));

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.bottom = 'auto';
        tooltip.style.right = 'auto';
    }

    function positionArrow(targetRect) {
        const arrow = elements.arrow;
        const arrowSize = 60;

        arrow.classList.remove('arrow-down', 'arrow-up', 'arrow-left', 'arrow-right');

        // Always point the arrow TO the target content
        // Position arrow above the target, pointing down to it
        const arrowTop = targetRect.top - arrowSize - 15;
        const arrowLeft = targetRect.left + targetRect.width / 2 - arrowSize / 2;

        if (arrowTop > 60) {
            // Arrow above target, pointing down
            arrow.classList.add('arrow-down');
            arrow.style.top = `${arrowTop}px`;
            arrow.style.left = `${arrowLeft}px`;
        } else {
            // Not enough space above, put arrow below pointing up
            arrow.classList.add('arrow-up');
            arrow.style.top = `${targetRect.bottom + 15}px`;
            arrow.style.left = `${arrowLeft}px`;
        }

        arrow.classList.add('visible');
    }

    // =====================================================
    // CHARACTER UPDATES
    // =====================================================
    function updateCharacter() {
        elements.avatar.innerHTML = getCharacterSVG(
            state.character,
            !state.isActive, // Wave when not active
            state.isSpeaking
        );
    }

    function setSpeaking(speaking) {
        state.isSpeaking = speaking;
        updateCharacter();
    }

    // =====================================================
    // UTILITIES
    // =====================================================
    function scrollToTarget(target, callback) {
        const rect = target.getBoundingClientRect();
        
        // Calcola l'altezza della navbar dinamicamente
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;
        
        // Margine extra per respirare
        const totalOffset = navbarHeight + CONFIG.extraMargin;
        
        const absoluteTop = window.pageYOffset + rect.top;
        const scrollTarget = Math.max(0, absoluteTop - totalOffset);

        window.scrollTo({
            top: scrollTarget,
            behavior: 'smooth'
        });

        // Wait for scroll to complete
        setTimeout(callback, CONFIG.animationDuration);
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // =====================================================
    // PUBLIC API
    // =====================================================
    window.HSMACETour = {
        start: startTour,
        end: endTour,
        reset: () => {
            localStorage.removeItem(CONFIG.storageKey);
            location.reload();
        },
        goToStep: showStep
    };

    // =====================================================
    // AUTO-INIT
    // =====================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();