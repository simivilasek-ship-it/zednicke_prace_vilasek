

// Coverflow Class
class PhotoCoverflow {
    constructor() {
        this.items = document.querySelectorAll('.coverflow-item');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentIndex = 4; // Start with middle item
        this.totalItems = this.items.length;
        this.isPlaying = false;
        this.autoPlayInterval = null;
        this.autoPlaySpeed = 4000;

        this.init();
    }

    init() {
        this.updateCoverflow();
        this.bindEvents();
    }

    bindEvents() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.prev());
        document.getElementById('nextBtn').addEventListener('click', () => this.next());
        document.getElementById('playPauseBtn').addEventListener('click', () => this.toggleAutoPlay());

        // Indicator clicks
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goTo(index));
        });

        // Item clicks
        this.items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (index === this.currentIndex) {
                    // If clicking the center item, you could open a modal or link
                    console.log('Center item clicked');
                } else {
                    this.goTo(index);
                }
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
            if (e.key === ' ') {
                e.preventDefault();
                this.toggleAutoPlay();
            }
        });

        // Touch/swipe support
        let startX = 0;
        let startY = 0;

        const container = document.getElementById('coverflowContainer');

        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, {
            passive: true
        });

        container.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }

            startX = 0;
            startY = 0;
        }, {
            passive: true
        });

        // Handle window resize (both width and height)
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.updateCoverflow();
            }, 100);
        });
    }

    updateCoverflow() {
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        const viewportHeight = window.innerHeight;

        // Dynamic spacing based on viewport height and width
        let baseSpacing = 220;

        // Adjust spacing based on viewport height
        if (viewportHeight > 900) {
            baseSpacing = 250;
        } else if (viewportHeight < 768) {
            baseSpacing = 180;
        }

        // Further adjust for mobile
        if (isSmallMobile) {
            baseSpacing = Math.min(baseSpacing * 0.7, 140);
        } else if (isMobile) {
            baseSpacing = Math.min(baseSpacing * 0.8, 170);
        }

        this.items.forEach((item, index) => {
            let offset = index - this.currentIndex;

            // Handle looping
            if (offset > this.totalItems / 2) {
                offset -= this.totalItems;
            } else if (offset < -this.totalItems / 2) {
                offset += this.totalItems;
            }

            let translateX = offset * baseSpacing;
            let translateZ = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;

            if (offset === 0) {
                // Center item
                translateZ = 100;
                scale = 1.1;
            } else if (Math.abs(offset) === 1) {
                translateZ = 0;
                rotateY = offset * -40;
                scale = 0.85;
                opacity = 0.7;
            } else if (Math.abs(offset) === 2) {
                translateZ = -100;
                rotateY = offset * -50;
                scale = 0.7;
                opacity = 0.5;
            } else if (Math.abs(offset) === 3) {
                translateZ = -150;
                rotateY = offset * -60;
                scale = 0.6;
                opacity = 0.3;
            } else {
                translateZ = -200;
                rotateY = offset * -70;
                scale = 0.5;
                opacity = 0.2;
            }

            item.style.transform = `
                        translate(-50%, -50%) 
                        translateX(${translateX}px) 
                        translateZ(${translateZ}px) 
                        rotateY(${rotateY}deg) 
                        scale(${scale})
                    `;
            item.style.opacity = opacity;
            item.style.zIndex = this.totalItems - Math.abs(offset);
        });

        // Update indicators
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    toggleAutoPlay() {
        const playPauseBtn = document.getElementById('playPauseBtn');

        if (this.isPlaying) {
            this.stopAutoPlay();
            playPauseBtn.innerHTML = '▶';
            playPauseBtn.classList.remove('playing');
        } else {
            this.startAutoPlay();
            playPauseBtn.innerHTML = '❚❚';
            playPauseBtn.classList.add('playing');
        }
    }

    startAutoPlay() {
        this.isPlaying = true;
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlaySpeed);
    }

    stopAutoPlay() {
        this.isPlaying = false;
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.updateCoverflow();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this.updateCoverflow();
    }

    goTo(index) {
        this.currentIndex = index;
        this.updateCoverflow();
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Coverflow - commented out since coverflow removed
    // new PhotoCoverflow();

    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 1000);

    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // ─── Mobilní carousel pro sekci Realizace ─────────────────────────
    (function initRealizaceCarousel() {
        const carousel = document.getElementById('demo');
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const slides = carousel.querySelectorAll('.carousel-item');
        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        const prevBtn = carousel.querySelector('.carousel-control-prev');
        const nextBtn = carousel.querySelector('.carousel-control-next');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        let autoplayTimer = null;
        let startX = 0;
        let isDragging = false;
        let dragStartX = 0;

        const AUTOPLAY_MS = 4000;

        // Přejde na slide s indexem
        function goTo(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            currentIndex = index;

            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            track.classList.remove('dragging');

            indicators.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function move(direction) {
            goTo(currentIndex + direction);
            resetAutoplay();
        }

        // ─── Autoplay ───────────────────────────────────────────────
        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(() => goTo(currentIndex + 1), AUTOPLAY_MS);
        }

        function stopAutoplay() {
            if (autoplayTimer) { clearInterval(autoplayTimer);
                autoplayTimer = null; }
        }

        function resetAutoplay() { stopAutoplay();
            startAutoplay(); }

        // ─── Události ───────────────────────────────────────────────
        if (prevBtn) prevBtn.addEventListener('click', () => move(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => move(1));

        indicators.forEach(dot => {
            dot.addEventListener('click', () => {
                goTo(parseInt(dot.dataset.slide));
                resetAutoplay();
            });
        });

        // ─── Drag / Swipe ──────────────────────────────────────────
        function onDragStart(clientX) {
            isDragging = true;
            dragStartX = clientX;
            startX = clientX;
            track.classList.add('dragging');
            stopAutoplay();
        }

        function onDragMove(clientX) {
            if (!isDragging) return;
            const diff = clientX - dragStartX;
            const pct = (diff / track.clientWidth) * 100;
            track.style.transform = `translateX(calc(-${currentIndex * 100}% + ${pct}px))`;
        }

        function onDragEnd(clientX) {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - clientX;
            track.classList.remove('dragging');

            if (Math.abs(diff) > 50) {
                goTo(currentIndex + (diff > 0 ? 1 : -1));
            } else {
                goTo(currentIndex);
            }
            startAutoplay();
        }

        // Dotyk
        track.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchmove', e => onDragMove(e.touches[0].clientX), { passive: true });
        track.addEventListener('touchend', e => onDragEnd(e.changedTouches[0].clientX), { passive: true });

        // Myš (pro testování na desktopu)
        track.addEventListener('mousedown', e => { onDragStart(e.clientX);
            e.preventDefault(); });
        document.addEventListener('mousemove', e => { if (isDragging) onDragMove(e.clientX); });
        document.addEventListener('mouseup', e => { if (isDragging) onDragEnd(e.clientX); });

        // ─── Resize ─────────────────────────────────────────────────
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth >= 768) {
                    stopAutoplay();
                    track.style.transform = '';
                } else {
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;
                }
            }, 150);
        });

        // Inicializace
        goTo(0);
        startAutoplay();
    })();

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active menu highlighting on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ─── Kontaktní formulář ────────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('formName').value.trim();
            const phone = document.getElementById('formPhone').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !phone) {
                [document.getElementById('formName'), document.getElementById('formPhone')].forEach(el => {
                    if (!el.value.trim()) el.style.borderColor = '#c0392b';
                });
                return;
            }

            const subject = encodeURIComponent('Poptávka – ' + name);
            const body = encodeURIComponent(
                'Jméno: ' + name + '\n' +
                'Telefon / e-mail: ' + phone + '\n\n' +
                'Projekt:\n' + (message || '(nevyplněno)')
            );
            window.location.href = 'mailto:vilasekmichael@seznam.cz?subject=' + subject + '&body=' + body;

            const btn = contactForm.querySelector('.form-submit');
            const orig = btn.textContent;
            btn.textContent = 'Odesláno ✓';
            btn.style.background = '#2d7a3a';
            contactForm.reset();
            setTimeout(() => {
                btn.textContent = orig;
                btn.style.background = '';
            }, 4000);
        });

        contactForm.querySelectorAll('.form-input').forEach(el => {
            el.addEventListener('input', () => { el.style.borderColor = ''; });
        });
    }

    // ─── Lightbox ─────────────────────────────────────────────────
    (function initLightbox() {
        const lb = document.getElementById('lightbox');
        if (!lb) return;
        const lbImg = document.getElementById('lightboxImg');
        const lbCounter = document.getElementById('lightboxCounter');
        const lbClose = document.getElementById('lightboxClose');
        const lbPrev = document.getElementById('lightboxPrev');
        const lbNext = document.getElementById('lightboxNext');

        const sources = [
            { src: 'images/20181126_142730-min.jpg', alt: 'Zateplení domu' },
            { src: 'images/Copilot_20260429_202255.png', alt: 'Fasáda' },
            { src: 'images/Gemini_Generated_Image_nkyvfinkyvfinkyv.png', alt: 'Rekonstrukce' },
            { src: 'images/Copilot_20260429_191603.png', alt: 'Zednické práce' },
            { src: 'images/ChatGPT Image 29. 4. 2026 19_14_39.png', alt: 'Oprava fasády' },
            { src: 'images/ChatGPT Image 29. 4. 2026 19_11_48.png', alt: 'Izolace' },
            { src: 'images/Copilot_20260429_191103.png', alt: 'Rekonstrukce interiéru' },
            { src: 'images/ChatGPT Image 29. 4. 2026 19_19_53.png', alt: 'Naše práce' },
        ];

        let current = 0;

        function show(index) {
            current = (index + sources.length) % sources.length;
            lbImg.style.opacity = '0';
            setTimeout(() => {
                lbImg.src = sources[current].src;
                lbImg.alt = sources[current].alt;
                lbCounter.textContent = (current + 1) + ' / ' + sources.length;
                lbImg.style.opacity = '1';
            }, 150);
        }

        function open(index) {
            show(index);
            lb.style.display = 'flex';
            requestAnimationFrame(() => { lb.style.opacity = '1'; });
            document.body.style.overflow = 'hidden';
        }

        function close() {
            lb.style.opacity = '0';
            setTimeout(() => { lb.style.display = 'none'; }, 300);
            document.body.style.overflow = '';
        }

        lbClose.addEventListener('click', close);
        lbPrev.addEventListener('click', () => show(current - 1));
        lbNext.addEventListener('click', () => show(current + 1));
        lb.addEventListener('click', e => { if (e.target === lb) close(); });

        document.addEventListener('keydown', e => {
            if (lb.style.display !== 'flex') return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(current - 1);
            if (e.key === 'ArrowRight') show(current + 1);
        });

        let lbTouchX = 0;
        lb.addEventListener('touchstart', e => { lbTouchX = e.touches[0].clientX; }, { passive: true });
        lb.addEventListener('touchend', e => {
            const diff = lbTouchX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? show(current + 1) : show(current - 1);
        }, { passive: true });

        document.querySelectorAll('.carousel-item').forEach((item, i) => {
            item.addEventListener('click', () => open(i));
        });

        document.querySelectorAll('.gallery-item').forEach((item, i) => {
            item.addEventListener('click', () => open(i));
        });
    })();

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Check on load
});