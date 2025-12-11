/* ===================================
   NATIONAL TELEPROMPTER - MAIN JS
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // Navigation scroll effect
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements
    const animatedElements = document.querySelectorAll(
        '.state-card, .service-card, .testimonial, .why-point, .coverage-state, .contact-info, .contact-form-wrapper'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });

    // Network map node interactions
    const networkNodes = document.querySelectorAll('.network-nodes .node');
    const stateCards = document.querySelectorAll('.state-card');

    networkNodes.forEach(node => {
        node.addEventListener('mouseenter', () => {
            const state = node.dataset.state;
            highlightState(state);
        });

        node.addEventListener('mouseleave', () => {
            clearHighlights();
        });

        node.addEventListener('click', () => {
            const state = node.dataset.state;
            scrollToStateCard(state);
        });
    });

    function highlightState(state) {
        stateCards.forEach(card => {
            if (card.dataset.state === state) {
                card.style.borderColor = 'var(--accent-primary)';
                card.style.transform = 'translateY(-4px)';
            }
        });
    }

    function clearHighlights() {
        stateCards.forEach(card => {
            if (!card.classList.contains('active')) {
                card.style.borderColor = '';
            }
            card.style.transform = '';
        });
    }

    function scrollToStateCard(state) {
        const targetCard = document.querySelector(`.state-card[data-state="${state}"]`);
        if (targetCard) {
            const navHeight = nav.offsetHeight;
            const targetPosition = targetCard.getBoundingClientRect().top + window.pageYOffset - navHeight - 40;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // State card hover effects
    stateCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const state = card.dataset.state;
            const node = document.querySelector(`.node[data-state="${state}"]`);
            if (node) {
                node.querySelector('.node-ring').style.opacity = '1';
                node.querySelector('.node-ring').style.stroke = 'var(--accent-primary)';
            }
        });

        card.addEventListener('mouseleave', () => {
            const state = card.dataset.state;
            const node = document.querySelector(`.node[data-state="${state}"]`);
            if (node && !node.classList.contains('active')) {
                node.querySelector('.node-ring').style.opacity = '';
                node.querySelector('.node-ring').style.stroke = '';
            }
        });
    });

    // Animated counter for stats
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };
        
        updateCounter();
    };

    // Trigger stat animation when visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const count = stat.dataset.count;
                    if (count) {
                        animateCounter(stat, parseInt(count));
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    // Network diagram animation
    const diagramNodes = document.querySelectorAll('.diagram-node');
    
    diagramNodes.forEach((node, index) => {
        node.style.animationDelay = `${index * 0.1}s`;
        
        // Pulse animation
        setInterval(() => {
            node.style.boxShadow = '0 0 20px var(--accent-glow)';
            setTimeout(() => {
                node.style.boxShadow = '';
            }, 500);
        }, 3000 + (index * 500));
    });

    // Client logo track - pause on hover
    const logoTrack = document.querySelector('.logo-track');
    if (logoTrack) {
        logoTrack.addEventListener('mouseenter', () => {
            logoTrack.style.animationPlayState = 'paused';
        });
        logoTrack.addEventListener('mouseleave', () => {
            logoTrack.style.animationPlayState = 'running';
        });
    }

    // Form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalContent = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // For demo - show success state
            setTimeout(() => {
                submitBtn.innerHTML = '<span>Request Submitted!</span>';
                submitBtn.style.background = 'var(--accent-green)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '';
                    submitBtn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }

    // Parallax effect for network map
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const networkMap = document.querySelector('.network-map');
                
                if (networkMap && scrolled < window.innerHeight) {
                    const yOffset = scrolled * 0.3;
                    const opacity = Math.max(0.2, 0.5 - (scrolled / window.innerHeight) * 0.4);
                    networkMap.style.transform = `translate(-50%, calc(-50% + ${yOffset}px))`;
                    networkMap.style.opacity = opacity;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // Add cursor glow effect (desktop only)
    const addCursorGlow = () => {
        const glow = document.createElement('div');
        glow.className = 'cursor-glow';
        glow.style.cssText = `
            position: fixed;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(glow);

        let cursorX = 0, cursorY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        const animateGlow = () => {
            glowX += (cursorX - glowX) * 0.08;
            glowY += (cursorY - glowY) * 0.08;
            glow.style.left = glowX + 'px';
            glow.style.top = glowY + 'px';
            requestAnimationFrame(animateGlow);
        };
        animateGlow();
    };

    if (window.innerWidth > 1024) {
        addCursorGlow();
    }

    // Connection line animation enhancement
    const connectionLines = document.querySelectorAll('.connection-line');
    connectionLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.5}s`;
    });

    // Data packet animation timing
    const dataPackets = document.querySelectorAll('.data-packet');
    dataPackets.forEach((packet, index) => {
        const duration = 3 + (index * 1.5);
        const motions = packet.querySelectorAll('animateMotion');
        motions.forEach(motion => {
            motion.setAttribute('dur', `${duration}s`);
        });
    });

    console.log('National Teleprompter Network - Site Initialized');
    console.log('Active Markets: Florida');
    console.log('Coming Soon: Ohio, Georgia, Pennsylvania, New York');
});
