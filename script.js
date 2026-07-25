// ============================================
// THE SHADOW BROTHERHOOD - Enhanced Script
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypewriter();
    initScrollReveal();
    initFormHandler();
    initEasterEggs();
    initParallax();
});

// ============================================
// 1. SMOOTH NAVIGATION WITH TRANSITIONS
// ============================================

function initNavigation() {
    const navButtons = document.querySelectorAll('.bandit-nav button');
    const sections = document.querySelectorAll('.bandit-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Smooth section transition
            const currentSection = document.querySelector('.bandit-section.active');
            const targetSection = document.getElementById(targetId);
            
            if (currentSection && currentSection !== targetSection) {
                currentSection.style.opacity = '0';
                currentSection.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    currentSection.classList.remove('active');
                    currentSection.style.opacity = '';
                    currentSection.style.transform = '';
                    
                    targetSection.classList.add('active');
                    targetSection.style.opacity = '0';
                    targetSection.style.transform = 'translateY(20px)';
                    
                    // Trigger reflow
                    void targetSection.offsetWidth;
                    
                    targetSection.style.transition = 'all 0.5s ease';
                    targetSection.style.opacity = '1';
                    targetSection.style.transform = 'translateY(0)';
                }, 300);
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ============================================
// 2. TYPEWRITER EFFECT FOR HEADER
// ============================================

function initTypewriter() {
    const subtitle = document.querySelector('.subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.borderRight = '2px solid var(--gold)';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        subtitle.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
            subtitle.style.borderRight = 'none';
            subtitle.style.animation = 'blink 1s infinite';
        }
    }, 50);
}

// ============================================
// 3. SCROLL REVEAL ANIMATIONS
// ============================================

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.bandit-card, .member-card, .code-list li').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// ============================================
// 4. ENHANCED FORM WITH WANTED POSTER GENERATOR
// ============================================

function initFormHandler() {
    const form = document.getElementById('joinForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Validate with shake animation
        if (!validateForm(form)) return;
        
        // Gather data
        const formData = new FormData(form);
        const recruit = {
            name: formData.get('name'),
            skill: formData.get('skill'),
            experience: formData.get('experience'),
            motive: formData.get('motive'),
            contact: formData.get('contact')
        };
        
        // Save to localStorage
        localStorage.setItem('banditRecruit', JSON.stringify(recruit));
        
        // Hide form with animation
        form.style.transition = 'all 0.5s ease';
        form.style.opacity = '0';
        form.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            form.style.display = 'none';
            generateWantedPoster(recruit);
            fireConfetti();
        }, 500);
    });
    
    // Load saved data if exists
    const saved = localStorage.getItem('banditRecruit');
    if (saved) {
        const recruit = JSON.parse(saved);
        console.log('Welcome back, ' + recruit.name);
    }
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.animation = 'shake 0.5s ease';
            field.style.borderColor = 'var(--blood)';
            
            setTimeout(() => {
                field.style.animation = '';
                field.style.borderColor = '';
            }, 500);
        }
    });
    
    return isValid;
}

function generateWantedPoster(recruit) {
    const successDiv = document.getElementById('successMessage');
    
    // Calculate bounty based on experience
    const bounties = {
        'none': '50 Gold Pieces',
        'petty': '200 Gold Pieces',
        'amateur': '500 Gold Pieces',
        'seasoned': '2,000 Gold Pieces',
        'notorious': '10,000 Gold Pieces'
    };
    
    const bounty = bounties[recruit.experience] || 'Priceless';
    
    // Create personalized poster
    const posterHTML = `
        <div style="background: #e8dcc0; border: 4px solid var(--ink); padding: 2rem; margin: 2rem auto; max-width: 500px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.4); animation: stampIn 0.6s ease;">
            <div style="font-family: 'Rye', serif; font-size: 3rem; color: var(--blood); border-bottom: 3px solid var(--ink); padding-bottom: 0.5rem; margin-bottom: 1rem;">WANTED</div>
            <div style="font-size: 5rem; margin: 1rem 0;">🎭</div>
            <div style="font-family: 'Rye', serif; font-size: 2rem; color: var(--ink); margin: 1rem 0;">${recruit.name}</div>
            <div style="font-family: 'Rye', serif; font-size: 1.5rem; color: var(--gold); margin: 1rem 0;">REWARD: ${bounty}</div>
            <div style="border: 2px dashed var(--ink); padding: 1rem; margin: 1rem 0; background: rgba(255,255,255,0.3); font-style: italic;">
                <strong>WANTED FOR:</strong><br>
                ${getCrimeDescription(recruit.skill)}<br><br>
                <strong>EXPERIENCE LEVEL:</strong> ${formatExperience(recruit.experience)}<br>
                <strong>KNOWN ASSOCIATE OF:</strong> The Shadow Brotherhood
            </div>
            <div style="font-family: 'Special Elite', cursive; margin-top: 1rem; font-size: 0.9rem;">
                Approach with caution. Highly dangerous.<br>
                Last seen applying for membership.
            </div>
            <div class="stamp" style="margin-top: 1rem;">INITIATED</div>
        </div>
        <div style="text-align: center; margin-top: 1rem;">
            <button onclick="location.reload()" style="font-family: 'Cinzel', serif; background: var(--wood); color: var(--parchment); border: 2px solid var(--gold); padding: 0.8rem 2rem; cursor: pointer; font-size: 1rem;">↺ Submit Another Application</button>
        </div>
    `;
    
    successDiv.innerHTML = posterHTML;
    successDiv.classList.add('show');
}

function getCrimeDescription(skill) {
    const crimes = {
        'stealth': 'Sneaking into restricted areas and leaving without a trace',
        'combat': 'Armed mischief and sword-related shenanigans',
        'locks': 'Unauthorized entry into locked premises',
        'disguise': 'Identity fraud and impersonation of nobility',
        'cooking': 'Poisoning with delicious baked goods',
        'bard': 'Crimes against music and public disturbance',
        'other': 'Various unspecified acts of mischief'
    };
    return crimes[skill] || 'General tomfoolery';
}

function formatExperience(exp) {
    const levels = {
        'none': 'Fresh Meat',
        'petty': 'Street Urchin',
        'amateur': 'Small-Time Crook',
        'seasoned': 'Professional Scoundrel',
        'notorious': 'Legendary Outlaw'
    };
    return levels[exp] || 'Mysterious';
}

// ============================================
// 5. CONFETTI EFFECT
// ============================================

function fireConfetti() {
    const colors = ['#b8860b', '#8b0000', '#2c1810', '#f4e4bc', '#5d4037'];
    const container = document.querySelector('.bandit-container');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.zIndex = '1000';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.pointerEvents = 'none';
        
        container.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fill: 'forwards'
        }).onfinish = () => confetti.remove();
    }
}

// ============================================
// 6. PARALLAX EFFECT ON HEADER
// ============================================

function initParallax() {
    const header = document.querySelector('.bandit-header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        header.style.backgroundPositionY = `${scrolled * 0.5}px`;
    });
}

// ============================================
// 7. EASTER EGGS
// ============================================

function initEasterEggs() {
    // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    let konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateSecretMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    // Click the seal 5 times for a surprise
    const seal = document.querySelector('.seal');
    let sealClicks = 0;
    if (seal) {
        seal.addEventListener('click', () => {
            sealClicks++;
            seal.style.transform = `scale(${1 + sealClicks * 0.2}) rotate(${sealClicks * 15}deg)`;
            if (sealClicks >= 5) {
                alert('🎭 You found the secret! The password for the hideout is: "CHEESE WHEEL"');
                sealClicks = 0;
                seal.style.transform = '';
            }
        });
    }
}

function activateSecretMode() {
    document.body.style.filter = 'hue-rotate(180deg)';
    const title = document.querySelector('.bandit-header h1');
    if (title) {
        title.textContent = '⚔ THE GOLDEN LEGION ⚔';
        title.style.color = '#00ff00';
    }
    setTimeout(() => {
        document.body.style.filter = '';
        if (title) {
            title.textContent = '⚔ The Shadow Brotherhood ⚔';
            title.style.color = '';
        }
    }, 3000);
}

// ============================================
// 8. UTILITY FUNCTIONS
// ============================================

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
`;
document.head.appendChild(style);
