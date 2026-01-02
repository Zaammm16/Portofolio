document.addEventListener('DOMContentLoaded', () => {
    initNeuralNetwork();
    initTypingEffect();
    initSmoothScroll();
    initFormHandler();
});

/**
 * 1. NEURAL NETWORK CANVAS ANIMATION
 */
function initNeuralNetwork() {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    
    // Config
    const particleCount = 60;
    const connectionDistance = 150;
    const mouseDistance = 200;
    
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = '#64ffda';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;
                    this.x -= forceDirectionX * force * 1.5;
                    this.y -= forceDirectionY * force * 1.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    let opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = 'rgba(100, 255, 218,' + opacity * 0.2 + ')';
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}

/**
 * 2. TYPING EFFECT (CONTACT SECTION)
 */
function initTypingEffect() {
    const textToType = "Initiating connection... Channel open. Awaiting user input.";
    const typingElement = document.getElementById('typing-text');
    const contactSection = document.getElementById('contact');
    
    if (!typingElement || !contactSection) return;

    let charIndex = 0;
    let hasStarted = false;

    function typeWriter() {
        if (charIndex < textToType.length) {
            typingElement.innerHTML += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, Math.random() * 50 + 30);
        }
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasStarted) {
                hasStarted = true;
                typeWriter();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(contactSection);
}

/**
 * 3. SMOOTH SCROLL
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

/**
 * 4. FORM HANDLING
 */
function initFormHandler() {
    const form = document.getElementById('terminal-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.querySelector('.pulse-btn');
        const btnContent = document.querySelector('.btn-content');
        const originalText = btnContent.innerText;
        const outputLog = document.getElementById('output-log');

        // Loading State
        btnContent.innerText = "SENDING...";
        btn.style.borderColor = "#ffbd2e"; 
        btn.style.color = "#ffbd2e";
        btn.style.animation = "none";

        // Simulate Network Request
        setTimeout(() => {
            // Success State
            btnContent.innerText = "SENT";
            btn.style.borderColor = "#27c93f";
            btn.style.color = "#27c93f";
            
            outputLog.style.display = "block";
            form.reset();

            // Reset after delay
            setTimeout(() => {
                btnContent.innerText = originalText;
                btn.style.borderColor = ""; // Revert to CSS default
                btn.style.color = "";
                btn.style.animation = ""; 
                outputLog.style.display = "none";
            }, 4000);
        }, 1500);
    });
}