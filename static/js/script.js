/**
 * NexaFlow Digital Agency - Frontend Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --------------------------------------------------------
    // Loader
    // --------------------------------------------------------
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            initGSAPAnimations();
        }, 500);
    }, 1500);

    // --------------------------------------------------------
    // Scroll Progress & Navbar
    // --------------------------------------------------------
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
        
        // Navbar Scrolled State
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --------------------------------------------------------
    // Mobile Menu
    // --------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-btn');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // --------------------------------------------------------
    // GSAP Animations
    // --------------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    function initGSAPAnimations() {
        // Hero entrance
        gsap.to('.fade-up', {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        });

        // Services
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                delay: i * 0.1
            });
        });

        // Timeline items
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 80%",
                },
                x: -50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });
        
        // Portfolio items
        gsap.utils.toArray('.portfolio-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                },
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                delay: i * 0.1
            });
        });
    }

    // Interactive Card Lighting Effect (Glassmorphism glow on hover)
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --------------------------------------------------------
    // Counter Animation
    // --------------------------------------------------------
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    function startCounters() {
        if (hasCounted) return;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
        hasCounted = true;
    }

    // Trigger counter when stats section is visible
    if (document.querySelector('.stats-container')) {
        ScrollTrigger.create({
            trigger: ".stats-container",
            start: "top 80%",
            onEnter: startCounters
        });
    }

    // --------------------------------------------------------
    // Testimonials Carousel
    // --------------------------------------------------------
    const track = document.getElementById('testimonialTrack');
    const cardsTestimonial = document.querySelectorAll('.testimonial-card');
    const btnPrev = document.getElementById('prevTestimonial');
    const btnNext = document.getElementById('nextTestimonial');
    let currentIndex = 0;

    function updateCarousel() {
        if (!track) return;
        cardsTestimonial.forEach((c, i) => {
            c.classList.remove('active');
            if (i === currentIndex) c.classList.add('active');
        });
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (track && btnNext && btnPrev) {
        btnNext.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cardsTestimonial.length;
            updateCarousel();
        });

        btnPrev.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cardsTestimonial.length) % cardsTestimonial.length;
            updateCarousel();
        });
        // Init first item
        updateCarousel();
    }

    // --------------------------------------------------------
    // Contact Form Submission (via Web3Forms)
    // --------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            btnText.classList.add('hidden');
            spinner.classList.remove('hidden');
            submitBtn.disabled = true;
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            // Web3Forms payload
            const web3FormData = {
                access_key: "25e7de58-5bd8-4786-bdd1-569b9a3f1dc2",
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value,
                subject: "🚀 New Project Inquiry — NexaFlow"
            };

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(web3FormData)
                });
                
                const data = await response.json();
                
                formStatus.style.display = 'block';
                if (response.status === 200 || data.success) {
                    formStatus.textContent = "Thank you! Your message has been sent successfully. 🚀";
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    formStatus.textContent = data.message || 'An error occurred. Please try again.';
                    formStatus.classList.add('error');
                }
            } catch (error) {
                formStatus.style.display = 'block';
                formStatus.textContent = 'Network error. Please check your connection and try again.';
                formStatus.classList.add('error');
            } finally {
                // Restore button state
                btnText.classList.remove('hidden');
                spinner.classList.add('hidden');
                submitBtn.disabled = false;
            }
        });
    }



});
