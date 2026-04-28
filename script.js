// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Sync Lenis with GSAP ScrollTrigger
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Custom Cursor Implementation
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (window.innerWidth > 768) {
    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor move
        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0,
            ease: "none"
        });
    });

    // Animate follower loop
    gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        gsap.set(cursorFollower, {
            x: followerX,
            y: followerY
        });
    });

    // Cursor hover effects on links and buttons
    const hoverElements = document.querySelectorAll('a, .btn');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(cursorFollower, {
                scale: 1.5,
                background: 'rgba(255,77,77,0.1)',
                border: '1px solid rgba(255,77,77,0.5)',
                duration: 0.3
            });
            cursor.style.display = 'none';
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(cursorFollower, {
                scale: 1,
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                duration: 0.3
            });
            cursor.style.display = 'block';
        });
    });
}

// Simple Intro Hero Animation
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.fromTo(".navbar", 
    { y: -20, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1, delay: 0.2 }
)
.fromTo([".hero-text-left", ".hero-text-right"], 
    { y: 100, opacity: 0, rotationX: -50, transformPerspective: 1000, transformOrigin: "bottom" }, 
    { y: (i, el) => el.classList.contains('hero-text-left') ? -60 : 60, opacity: 1, rotationX: 0, duration: 1.5, stagger: 0.1 },
    "-=0.6"
)
.fromTo(".hero-bottom",
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1 },
    "-=0.8"
);

// Simple Scroll Animation for Hero
const heroScrollTl = gsap.timeline({
    scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
    }
});

heroScrollTl.to(".hero-text-left", { y: -100, opacity: 0 }, 0)
.to(".hero-text-right", { y: 150, opacity: 0 }, 0)
.to(".hero-bottom", { y: 50, opacity: 0 }, 0);

// Scroll Trigger Animations For Sections
const sections = gsap.utils.toArray('section.about, section.work, section.contact');

sections.forEach(section => {
    
    // Simple Reveal Section Titles
    const title = section.querySelector('.section-title');
    if (title) {
        gsap.fromTo(title,
            { y: 50, opacity: 0, rotationX: -30, transformPerspective: 1000 },
            {
                scrollTrigger: { trigger: section, start: "top 85%" },
                y: 0, opacity: 1, rotationX: 0, duration: 1.2, ease: "power3.out"
            }
        );
    }

    // Simple Reveal Paragraphs and generic text
    const texts = section.querySelectorAll('.reveal-text');
    if (texts.length > 0) {
        gsap.fromTo(texts,
            { y: 40, opacity: 0, rotationX: -20, transformPerspective: 1000 },
            {
                scrollTrigger: { trigger: section, start: "top 80%" },
                y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.1, ease: "power3.out"
            }
        );
    }
});

// Simple Work Stack Reveal
const projectCards = gsap.utils.toArray('.stacked-project-card');
if (projectCards.length > 0) {
    projectCards.forEach((card, index) => {
        gsap.fromTo(card,
            { y: 80, opacity: 0, scale: 0.95, transformPerspective: 1500 },
            {
                scrollTrigger: { trigger: card, start: "top 85%" },
                y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out"
            }
        );
    });
}

// 3D Tilt Effect for Project Cards
if (window.innerWidth > 768) {
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -4; // Max 4 deg rotation for big cards
            const rotateY = ((x - centerX) / centerX) * 4;
            
            gsap.to(card, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1500,
                ease: "power2.out",
                duration: 0.5
            });
            
            // Parallax effect on background image
            const img = card.querySelector('.stacked-project-bg img');
            if (img) {
                gsap.to(img, {
                    x: (x - centerX) * 0.02,
                    y: (y - centerY) * 0.02,
                    ease: "power2.out",
                    duration: 0.5
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotationX: 0,
                rotationY: 0,
                ease: "power2.out",
                duration: 0.5
            });
            
            const img = card.querySelector('.stacked-project-bg img');
            if (img) {
                gsap.to(img, {
                    x: 0,
                    y: 0,
                    ease: "power2.out",
                    duration: 0.5
                });
            }
        });
    });
}

// Simple Skills Reveal
const skills = gsap.utils.toArray('.skills-list .reveal-item');
if (skills.length > 0) {
    gsap.fromTo(skills,
        { y: 30, opacity: 0, scale: 0.9, rotationX: -20, transformPerspective: 1000 },
        {
            scrollTrigger: { trigger: ".skills-list", start: "top 90%" },
            y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.8, stagger: 0.05, ease: "back.out(1.7)"
        }
    );
}

// Magnetic Buttons
if (window.innerWidth > 768) {
    const magneticButtons = document.querySelectorAll('.btn, .social-icon');
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.4,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            });
        });
    });
}

// Navigation active state on scroll
const scrollLinks = document.querySelectorAll('.nav-link');
scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        lenis.scrollTo(targetElement, {
            offset: -100, // Account for fixed navbar
            duration: 1.5
        });
    });
});
