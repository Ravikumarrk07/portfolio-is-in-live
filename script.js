document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLER
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    function setTheme(theme) {
        if (theme === 'light') {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('theme', 'dark');
        }
    }

    // ==========================================================================
    // MOBILE NAV MENU TOGGLE
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        const isOpen = navMenu.classList.contains('open');
        mobileToggle.innerHTML = isOpen 
            ? '<i class="fa-solid fa-xmark"></i>' 
            : '<i class="fa-solid fa-bars-staggered"></i>';
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            mobileToggle.innerHTML = '<i class="fa-solid fa-bars-staggered"></i>';
        });
    });

    // ==========================================================================
    // HEADER SCROLL STATE
    // ==========================================================================
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // TYPEWRITER ANIMATION (HERO)
    // ==========================================================================
    const words = [
        "Python Full Stack Trainee",
        "Django Backend Developer",
        "React Frontend Enthusiast",
        "Computer Science Student"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpan = document.getElementById('typing-text');
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingSpan.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // speed up deleting
        } else {
            typingSpan.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // normal writing speed
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // wait at the end of the word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    if (typingSpan) {
        type();
    }

    // ==========================================================================
    // ACTIVE NAV LINKS ON SCROLL (IntersectionObserver)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    const navObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // triggers when section covers middle of screen
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => navObserver.observe(section));

    // ==========================================================================
    // SCROLL REVEAL (IntersectionObserver for fading in sections/cards)
    // ==========================================================================
    const revealItems = document.querySelectorAll(
        '.edu-card, .skill-category-card, .experience-card, .project-card, .contact-method-card, .contact-form-panel'
    );

    // Initial styles for animations (could also be in CSS, but doing here keeps layout intact if JS fails)
    revealItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    const revealObserverOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Remove inline style override after transition completes so CSS 3D styles can function
                setTimeout(() => {
                    entry.target.style.opacity = '';
                    entry.target.style.transform = '';
                    entry.target.style.transition = '';
                }, 800);
                observer.unobserve(entry.target); // trigger once
            }
        });
    }, revealObserverOptions);

    revealItems.forEach(item => revealObserver.observe(item));

    // ==========================================================================
    // CONTACT FORM HANDLING
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simple client-side check
            if (!name || !email || !subject || !message) {
                showStatus('Please fill in all fields.', 'error');
                return;
            }

            // Simulate form submission
            showStatus('Sending message...', 'info');
            
            setTimeout(() => {
                showStatus(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
                contactForm.reset();
            }, 1500);
        });
    }

    function showStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
        
        if (type === 'success') {
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 5000);
        }
    }

    // ==========================================================================
    // 3D CARD TILT INTERACTIVE EFFECT
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.edu-card, .skill-category-card, .project-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            
            // Mouse position relative to the card's top-left corner
            const mouseX = e.clientX - cardRect.left;
            const mouseY = e.clientY - cardRect.top;
            
            // Normalize values to range -0.5 to 0.5
            const xPercent = (mouseX / cardWidth) - 0.5;
            const yPercent = (mouseY / cardHeight) - 0.5;
            
            // Calculate tilt angle (max 12 degrees)
            const maxTilt = 12;
            const tiltX = (yPercent * maxTilt).toFixed(2); // rotation around X axis (vertical mouse movement tilts on X)
            const tiltY = (-xPercent * maxTilt).toFixed(2); // rotation around Y axis (horizontal mouse movement tilts on Y)
            
            // Apply CSS variables to card
            card.style.setProperty('--rx', `${tiltX}deg`);
            card.style.setProperty('--ry', `${tiltY}deg`);
        });

        // Reset tilt on mouseleave
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    });

    // ==========================================================================
    // 3D PARALLAX BACKGROUND MOUSE EFFECT
    // ==========================================================================
    const parallaxWrappers = document.querySelectorAll('.parallax-wrapper');

    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Offset from screen center normalized
        const wX = (window.innerWidth / 2 - mouseX) / (window.innerWidth / 2);
        const wY = (window.innerHeight / 2 - mouseY) / (window.innerHeight / 2);
        
        parallaxWrappers.forEach((wrapper, index) => {
            // Different intensities for 3D depth layering
            const factor = (index + 1) * 15; // 15px, 30px, 45px max movement
            const moveX = (wX * factor).toFixed(2);
            const moveY = (wY * factor).toFixed(2);
            
            wrapper.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });
});
