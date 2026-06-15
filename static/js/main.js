// =====================================================
// SUYASH MAGDUM PORTFOLIO — MAIN JS
// =====================================================

// Custom Cursor
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  if (cursorTrail) {
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor scale on interactive elements
document.querySelectorAll('a, button, .project-card, .info-card, .skill-tag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
    if (cursorTrail) cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    if (cursorTrail) cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Smooth active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observerOptions = { threshold: 0.3 };
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, observerOptions);
sections.forEach(s => sectionObserver.observe(s));

// Stat counter animation
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 50);
  });
}

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Add reveal class to key elements
const revealElements = [
  '.project-card', '.skill-category', '.info-card',
  '.dash-card', '.contact-item', '.proficiency-bars',
  '.about-text', '.about-cards'
];
revealElements.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${i * 0.08}s`;
    revealObserver.observe(el);
  });
});

// Skill bar animation
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bar-fill').forEach(bar => {
        const w = bar.dataset.width;
        setTimeout(() => { bar.style.width = w + '%'; }, 200);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const profBars = document.querySelector('.proficiency-bars');
if (profBars) barObserver.observe(profBars);

// Hero counter
const heroObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    animateCounters();
    heroObserver.disconnect();
  }
}, { threshold: 0.5 });
const heroSection = document.getElementById('hero');
if (heroSection) heroObserver.observe(heroSection);

// Mobile menu
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinksEl.style.display = navLinksEl.style.display === 'flex' ? 'none' : 'flex';
    navLinksEl.style.flexDirection = 'column';
    navLinksEl.style.position = 'absolute';
    navLinksEl.style.top = '70px';
    navLinksEl.style.left = '0';
    navLinksEl.style.right = '0';
    navLinksEl.style.background = 'rgba(5,11,24,0.98)';
    navLinksEl.style.padding = '2rem';
    navLinksEl.style.gap = '1.5rem';
    navLinksEl.style.borderBottom = '1px solid rgba(99,102,241,0.2)';
  });
}

// Contact form
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    const btnText = btn.querySelector('.btn-text');
    btnText.textContent = 'Sending...';
    btn.disabled = true;

    const formData = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        contactForm.reset();
        formSuccess.style.display = 'block';
        setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
      } else {
        alert('Oops! Something went wrong. Please try again.');
      }
    } catch (err) {
      // Fallback for static demo
      contactForm.reset();
      formSuccess.style.display = 'block';
      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    }
    btnText.textContent = 'Send Message';
    btn.disabled = false;
  });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      if (navLinksEl && window.innerWidth <= 768) {
        navLinksEl.style.display = 'none';
      }
    }
  });
});

// Typing effect in hero sub
const heroSub = document.querySelector('.hero-sub');
if (heroSub) {
  const texts = [
    'Data Scientist · AI Engineer · Insight Architect',
    'ML Model Builder · Dashboard Creator · Python Dev',
    'Turning Raw Data → Real Decisions'
  ];
  let ti = 0, ci = 0, deleting = false;
  function type() {
    const current = texts[ti];
    if (!deleting) {
      heroSub.textContent = current.substring(0, ci + 1);
      ci++;
      if (ci === current.length) {
        deleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      heroSub.textContent = current.substring(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        ti = (ti + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 1500);
}

// Particle background in hero
function createParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.style.cssText = `
      position: absolute;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      background: rgba(0, 245, 160, ${Math.random() * 0.3 + 0.1});
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      animation: particleFloat ${Math.random() * 10 + 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * -10}s;
      pointer-events: none;
      z-index: 1;
    `;
    hero.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFloat {
      0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
      25% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(1.5); opacity: 0.8; }
      75% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) scale(0.5); opacity: 0.2; }
    }
  `;
  document.head.appendChild(style);
}
createParticles();

console.log('%c🚀 Suyash Magdum Portfolio', 'color: #00F5A0; font-size: 18px; font-weight: bold;');
console.log('%cData Scientist | AI Engineer', 'color: #6366F1; font-size: 12px;');
