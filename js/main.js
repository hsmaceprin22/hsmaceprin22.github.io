/* =====================================================
   H-SMA-CE - Main JavaScript
   Complete version with mobile menu fix
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    
    /* =====================================================
       MOBILE MENU - Fixed Version
       ===================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const navClose = document.getElementById('navClose');
    const body = document.body;
    
    // Funzione per aprire il menu
    function openMenu() {
        if (navLinks) navLinks.classList.add('active');
        if (hamburger) hamburger.classList.add('active');
        body.classList.add('menu-open');
        
        // Nascondi tour avatar
        const tourAvatar = document.querySelector('.tour-avatar-container');
        if (tourAvatar) {
            tourAvatar.classList.add('menu-open');
        }
    }
    
    // Funzione per chiudere il menu
    function closeMenu() {
        if (navLinks) navLinks.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        body.classList.remove('menu-open');
        
        // Mostra tour avatar
        const tourAvatar = document.querySelector('.tour-avatar-container');
        if (tourAvatar) {
            tourAvatar.classList.remove('menu-open');
        }
    }
    
    // Click su hamburger
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            if (navLinks && navLinks.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    // Click sulla X
    if (navClose) {
        navClose.addEventListener('click', function(e) {
            e.stopPropagation();
            closeMenu();
        });
    }
    
    // Click su un link del menu
    if (navLinks) {
        const menuLinks = navLinks.querySelectorAll('a:not(.dropdown-toggle)');
        menuLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
    }
    
    // Click fuori dal menu
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && 
                !hamburger.contains(e.target) && 
                (!navClose || !navClose.contains(e.target))) {
                closeMenu();
            }
        }
    });
    
    // ESC key chiude il menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Resize - chiudi menu se si allarga lo schermo
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && navLinks && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    /* =====================================================
       NAVBAR SCROLL EFFECT
       ===================================================== */
    const navbar = document.getElementById('navbar');
    
    function handleNavbarScroll() {
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Check on load
    
    /* =====================================================
       HERO SLIDESHOW
       ===================================================== */
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroIndicators = document.querySelectorAll('.slide-indicator');
    let heroCurrentSlide = 0;
    let heroInterval;
    
    function showHeroSlide(index) {
        if (heroSlides.length === 0) return;
        
        heroSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (heroIndicators[i]) {
                heroIndicators[i].classList.remove('active');
            }
        });
        
        heroCurrentSlide = index;
        if (heroCurrentSlide >= heroSlides.length) heroCurrentSlide = 0;
        if (heroCurrentSlide < 0) heroCurrentSlide = heroSlides.length - 1;
        
        heroSlides[heroCurrentSlide].classList.add('active');
        if (heroIndicators[heroCurrentSlide]) {
            heroIndicators[heroCurrentSlide].classList.add('active');
        }
    }
    
    function nextHeroSlide() {
        showHeroSlide(heroCurrentSlide + 1);
    }
    
    function startHeroSlideshow() {
        if (heroSlides.length > 1) {
            heroInterval = setInterval(nextHeroSlide, 5000);
        }
    }
    
    function stopHeroSlideshow() {
        if (heroInterval) {
            clearInterval(heroInterval);
        }
    }
    
    // Indicator clicks
    heroIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopHeroSlideshow();
            showHeroSlide(index);
            startHeroSlideshow();
        });
    });
    
    startHeroSlideshow();
    
    /* =====================================================
       TAURASI SLIDESHOW
       ===================================================== */
    const taurasiSlides = document.querySelectorAll('.taurasi-slide');
    const taurasiIndicators = document.querySelectorAll('.taurasi-indicator');
    let taurasiCurrentSlide = 0;
    let taurasiInterval;
    
    function showTaurasiSlide(index) {
        if (taurasiSlides.length === 0) return;
        
        taurasiSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (taurasiIndicators[i]) {
                taurasiIndicators[i].classList.remove('active');
            }
        });
        
        taurasiCurrentSlide = index;
        if (taurasiCurrentSlide >= taurasiSlides.length) taurasiCurrentSlide = 0;
        if (taurasiCurrentSlide < 0) taurasiCurrentSlide = taurasiSlides.length - 1;
        
        taurasiSlides[taurasiCurrentSlide].classList.add('active');
        if (taurasiIndicators[taurasiCurrentSlide]) {
            taurasiIndicators[taurasiCurrentSlide].classList.add('active');
        }
    }
    
    function nextTaurasiSlide() {
        showTaurasiSlide(taurasiCurrentSlide + 1);
    }
    
    function startTaurasiSlideshow() {
        if (taurasiSlides.length > 1) {
            taurasiInterval = setInterval(nextTaurasiSlide, 4000);
        }
    }
    
    function stopTaurasiSlideshow() {
        if (taurasiInterval) {
            clearInterval(taurasiInterval);
        }
    }
    
    // Indicator clicks
    taurasiIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopTaurasiSlideshow();
            showTaurasiSlide(index);
            startTaurasiSlideshow();
        });
    });
    
    startTaurasiSlideshow();
    
    /* =====================================================
       SMOOTH SCROLL FOR ANCHOR LINKS
       ===================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const navHeight = navbar ? navbar.offsetHeight : 80;
                const topBarHeight = document.querySelector('.top-logo-bar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - topBarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    /* =====================================================
       FADE IN ANIMATIONS ON SCROLL
       ===================================================== */
    const fadeElements = document.querySelectorAll('.fade-in');
    
    function checkFadeIn() {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkFadeIn);
    checkFadeIn(); // Check on load
    
    /* =====================================================
       LIGHTBOX
       ===================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    // Open lightbox
    document.querySelectorAll('.gallery-item img, [data-lightbox]').forEach(img => {
        img.addEventListener('click', function() {
            if (lightbox && lightboxImg) {
                // Reset image to prevent showing previous image while loading
                lightboxImg.style.opacity = '0';
                lightboxImg.src = '';

                // Use full resolution image if available, otherwise use src
                const newSrc = this.dataset.full || this.src;
                lightboxImg.onload = function() {
                    lightboxImg.style.opacity = '1';
                };
                lightboxImg.src = newSrc;
                lightbox.classList.add('active');
                body.style.overflow = 'hidden';
            }
        });
    });

    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            body.style.overflow = '';
            // Reset image when closing
            if (lightboxImg) {
                lightboxImg.src = '';
                lightboxImg.style.opacity = '0';
            }
        }
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    /* =====================================================
       DETAIL MODALS (Publications, Conferences)
       ===================================================== */
    const detailModals = document.querySelectorAll('.detail-modal');
    const clickableCards = document.querySelectorAll('.clickable-card[data-modal]');
    
    // Open modal
    clickableCards.forEach(card => {
        card.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    detailModals.forEach(modal => {
        const closeBtn = modal.querySelector('.detail-modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
                body.style.overflow = '';
            });
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
                body.style.overflow = '';
            }
        });
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            detailModals.forEach(modal => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    body.style.overflow = '';
                }
            });
        }
    });
    
    /* =====================================================
       DROPDOWN MENU TOUCH SUPPORT
       ===================================================== */
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        
        if (toggle) {
            toggle.addEventListener('click', function(e) {
                // On mobile, prevent navigation and toggle dropdown
                if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    dropdown.classList.toggle('open');
                }
            });
        }
    });
    
    /* =====================================================
       ACTIVE NAV LINK HIGHLIGHT
       ===================================================== */
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    /* =====================================================
       FORM VALIDATION (if contact form exists)
       ===================================================== */
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const name = this.querySelector('[name="name"]');
            const email = this.querySelector('[name="email"]');
            const message = this.querySelector('[name="message"]');
            
            let isValid = true;
            
            if (name && !name.value.trim()) {
                isValid = false;
                name.classList.add('error');
            } else if (name) {
                name.classList.remove('error');
            }
            
            if (email && (!email.value.trim() || !isValidEmail(email.value))) {
                isValid = false;
                email.classList.add('error');
            } else if (email) {
                email.classList.remove('error');
            }
            
            if (message && !message.value.trim()) {
                isValid = false;
                message.classList.add('error');
            } else if (message) {
                message.classList.remove('error');
            }
            
            if (isValid) {
                // Form is valid - you can submit here
                console.log('Form is valid');
                // this.submit();
            }
        });
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    /* =====================================================
       BACK TO TOP BUTTON (if exists)
       ===================================================== */
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    /* =====================================================
       PRINT FUNCTIONALITY (if exists)
       ===================================================== */
    const printButtons = document.querySelectorAll('[data-print]');
    
    printButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            window.print();
        });
    });
    
    /* =====================================================
       EXTERNAL LINKS - Open in new tab
       ===================================================== */
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.hostname.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
});

/* =====================================================
   UTILITY FUNCTIONS
   ===================================================== */

// Debounce function for performance
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

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };

}