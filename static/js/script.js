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
    ScrollTrigger.create({
        trigger: ".stats-container",
        start: "top 80%",
        onEnter: startCounters
    });

    // --------------------------------------------------------
    // Testimonials Carousel
    // --------------------------------------------------------
    const track = document.getElementById('testimonialTrack');
    const cardsTestimonial = document.querySelectorAll('.testimonial-card');
    const btnPrev = document.getElementById('prevTestimonial');
    const btnNext = document.getElementById('nextTestimonial');
    let currentIndex = 0;

    function updateCarousel() {
        cardsTestimonial.forEach((c, i) => {
            c.classList.remove('active');
            if (i === currentIndex) c.classList.add('active');
        });
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    if (btnNext && btnPrev) {
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
    // Contact Form Submission
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

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    formStatus.textContent = data.message;
                    formStatus.classList.add('success');
                    contactForm.reset();
                } else {
                    formStatus.textContent = data.error || 'An error occurred. Please try again.';
                    formStatus.classList.add('error');
                }
            } catch (error) {
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

    // --------------------------------------------------------
    // Chatbot Logic
    // --------------------------------------------------------
    const chatToggle = document.getElementById('chatbotToggle');
    const chatWindow = document.getElementById('chatbotWindow');
    const chatClose = document.getElementById('chatbotClose');
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    let chatHistory = []; // Optional: keep history if backend needs it later

    // Toggle Chat Window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.remove('hidden');
        chatToggle.style.transform = 'scale(0)';
        setTimeout(() => chatInput.focus(), 300);
    });

    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
        chatToggle.style.transform = 'scale(1)';
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-msg`;
        
        // Format text (simple markdown support for bold & newlines)
        let formattedText = text.replace(/\n/g, '<br>');
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        msgDiv.innerHTML = `<div class="msg-bubble">${formattedText}</div>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const indicator = document.createElement('div');
        indicator.id = id;
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatBody.appendChild(indicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    async function handleChatSubmit() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user message
        appendMessage('user', text);
        chatInput.value = '';
        chatHistory.push({ role: 'user', content: text });

        // Show bot typing...
        const typingId = showTypingIndicator();

        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: chatHistory })
            });
            
            const data = await response.json();
            
            removeTypingIndicator(typingId);
            
            if (data.reply) {
                appendMessage('bot', data.reply);
                chatHistory.push({ role: 'bot', content: data.reply });
            } else {
                appendMessage('bot', "I'm having trouble connecting right now. Please try again later.");
            }
        } catch (err) {
            removeTypingIndicator(typingId);
            appendMessage('bot', "Sorry, I am currently offline. Please use the contact form to reach us.");
        }
    }

    chatSend.addEventListener('click', handleChatSubmit);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleChatSubmit();
        }
    });

});
