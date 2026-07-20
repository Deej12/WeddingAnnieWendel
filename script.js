// COUNTDOWN TIMER
const weddingDate = new Date("October 28, 2026 14:00:00").getTime();

const countdown = setInterval(() => {

    const now = new Date().getTime();

    const difference = weddingDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (difference % (1000 * 60)) / 1000
    );

    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds; 

// WEDDING DAY
if(difference < 0) {
    clearInterval(countdown); 
    // launch confetti and show celebration message
    launchConfetti();
    document.querySelector(".countdown-container").innerHTML = 
    "<h3 style='font-family: \"Cormorant Garamond\", serif; font-size: 2rem; color: var(--accent);'>The Wedding Celebration Has Begun! 💕</h3>";
}

}, 1000);

// RSVP FORM LOGIC
const attendanceOptions = 
document.querySelectorAll('input[name="attendance"]');

const dietaryField = 
document.getElementById("dietaryField"); 

attendanceOptions.forEach(option => {

    option.addEventListener("change", () => {

        if(option.value === "accept" && option.checked) {

            dietaryField.classList.remove("hidden");

        } else if(option.value === "decline" && option.checked) {
            
            dietaryField.classList.add("hidden");
        }

    });

});

// FORM SUBMISSION

const form = document.getElementById("rsvpForm");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const confirmation = document.getElementById("confirmationMessage");

    confirmation.innerHTML = `✓ Thank you, ${name}! Your RSVP has been received and a confirmation email will be sent to ${email}.`;

    form.reset();

    dietaryField.classList.add("hidden");

    // Scroll to confirmation message
    confirmation.scrollIntoView({ behavior: 'smooth' });

});


    // SCROLL REVEAL ANIMATIONS
    function initScrollReveal(){
        const reveals = document.querySelectorAll('.reveal');
        if(!('IntersectionObserver' in window)){
            reveals.forEach(r => r.classList.add('in-view'));
            return;
        }

        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.15});

        reveals.forEach(r => obs.observe(r));
    }

    // HERO PARALLAX (subtle)
    function initHeroParallax(){
        const hero = document.querySelector('.hero');
        if(!hero) return;
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.backgroundPosition = 'center ' + (scrolled * 0.25) + 'px';
        }, {passive:true});
    }

    // SIMPLE CONFETTI (DOM-based)
    function launchConfetti(){
        const colors = ['#c4a574','#9d8563','#f1d99b','#b9a17f','#f6ead8'];
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const count = 40;
        for(let i=0;i<count;i++){
            const node = document.createElement('div');
            node.className = 'confetti';
            const size = Math.random() * 10 + 6;
            node.style.width = size + 'px';
            node.style.height = (size + 6) + 'px';
            node.style.left = Math.random() * 100 + '%';
            node.style.background = colors[Math.floor(Math.random()*colors.length)];
            node.style.top = (-Math.random()*20) + 'vh';
            node.style.opacity = (0.7 + Math.random()*0.3).toString();
            node.style.animationDuration = (3 + Math.random()*2) + 's';
            node.style.transform = 'rotate(' + (Math.random()*360) + 'deg)';
            container.appendChild(node);
        }

        // remove after animation
        setTimeout(() => {
            container.remove();
        }, 4500);
    }

    function tryPlayBackgroundAudio(){
        const audio = document.getElementById('bg-audio');
        if(!audio) return;
        const createFallbackButton = () => {
            if (document.getElementById('audio-fallback')) return;
            const btn = document.createElement('button');
            btn.id = 'audio-fallback';
            btn.className = 'audio-fallback';
            btn.type = 'button';
            btn.textContent = 'Play Music';

            btn.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play().catch(() => {});
                } else {
                    audio.pause();
                }
            });

            audio.addEventListener('play', () => {
                btn.textContent = 'Pause Music';
                btn.classList.add('playing');
            });

            audio.addEventListener('pause', () => {
                btn.textContent = 'Play Music';
                btn.classList.remove('playing');
            });

            document.body.appendChild(btn);
        };

        // Try to play immediately; if blocked show fallback button
        audio.play().catch(() => {
            createFallbackButton();
        });

        // If autoplay was prevented but user interacts, start playback and hide fallback
        const resumePlayback = () => {
            audio.play().catch(() => {});
        };

        document.addEventListener('click', resumePlayback, { once: true });
        document.addEventListener('keydown', resumePlayback, { once: true });

        // If still paused after a short delay, show fallback
        setTimeout(() => {
            if (audio.paused) createFallbackButton();
        }, 700);
    }

function initMobileNav(){
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if(!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('active');
    });
}

window.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initHeroParallax();
    tryPlayBackgroundAudio();
    initMobileNav();
});


