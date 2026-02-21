// View References
const views = {
    landing: document.getElementById('landing-view'),
    rejection1: document.getElementById('rejection-stage-1'),
    rejection2: document.getElementById('rejection-stage-2'),
    sad: document.getElementById('sad-view'),
    success: document.getElementById('success-view'),
    goodbye: document.getElementById('goodbye-view')
};

// Button References
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const yesBtn1 = document.getElementById('yes-btn-1');
const stillNoBtn = document.getElementById('still-no-btn');
const yesBtn2 = document.getElementById('yes-btn-2');
const finalNoBtn = document.getElementById('final-no-btn');
const kiddingYesBtn = document.getElementById('kidding-yes-btn');
const finalGoodbyeBtn = document.getElementById('final-goodbye-btn');

/**
 * Smoothly transition between views with fade effect
 */
function showView(viewName) {
    const currentView = document.querySelector('.view.active');
    
    if (currentView) {
        // Fade out current view
        currentView.style.animation = 'gentleFadeOut 0.5s ease forwards';
        
        setTimeout(() => {
            currentView.classList.remove('active');
            currentView.style.animation = '';
            
            // Fade in new view
            if (views[viewName]) {
                views[viewName].classList.add('active');
                
                // Start confetti animation for success view
                if (viewName === 'success') {
                    setTimeout(startConfetti, 400);
                }
            }
        }, 500);
    } else {
        // Initial view load
        if (views[viewName]) {
            views[viewName].classList.add('active');
        }
    }
}

// Add fade out animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes gentleFadeOut {
        to {
            opacity: 0;
            transform: translateY(-10px);
        }
    }
`;
document.head.appendChild(style);

/**
 * Handle successful acceptance
 */
function handleSuccess() {
    showView('success');
}

/**
 * Handle final rejection
 */
function handleSadView() {
    showView('sad');
}

/**
 * Handle final goodbye
 */
function handleGoodbye() {
    showView('goodbye');
}

// Landing View - Initial question
yesBtn.addEventListener('click', handleSuccess);
noBtn.addEventListener('click', () => {
    showView('rejection1');
});

// Rejection Stage 1 - First attempt to convince
yesBtn1.addEventListener('click', handleSuccess);
stillNoBtn.addEventListener('click', () => {
    showView('rejection2');
});

// Rejection Stage 2 - Final attempt with promises
yesBtn2.addEventListener('click', handleSuccess);
finalNoBtn.addEventListener('click', handleSadView);

// Sad View - Last chance
kiddingYesBtn.addEventListener('click', handleSuccess);
// Add the event listener for the tiny NO button
finalGoodbyeBtn.addEventListener('click', handleGoodbye);

/**
 * Create subtle confetti animation for success view
 */
function startConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Confetti configuration
    const particles = [];
    const particleCount = 80;
    const colors = ['#FEC5BB', '#DED6CE', '#E5989B', '#F5EBE0', '#B5838D'];
    
    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: Math.random() * 1.5 + 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 6 + 4,
            angle: Math.random() * 360,
            rotation: (Math.random() - 0.5) * 0.02,
            opacity: 1
        });
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            // Update physics
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.angle += particle.rotation;
            particle.vy += 0.03; // Gentle gravity
            
            // Fade out near bottom
            if (particle.y > canvas.height * 0.8) {
                particle.opacity = Math.max(0, particle.opacity - 0.015);
            }
            
            // Draw particle
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.angle);
            ctx.globalAlpha = particle.opacity;
            ctx.fillStyle = particle.color;
            ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 2);
            ctx.restore();
            
            // Remove faded particles
            if (particle.opacity <= 0 || particle.y > canvas.height) {
                particles.splice(index, 1);
            }
        });
        
        // Continue animation while particles exist
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            // Clean up
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

// Handle window resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    showView('landing');
});
