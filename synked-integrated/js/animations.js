/* === ANIMATIONS.JS === */

// ─── PAGE TRANSITION OVERLAY ───────────────────────────────────────────────
const overlay = document.createElement('div');
overlay.id = 'page-overlay';
overlay.style.cssText = `
  position: fixed; inset: 0; z-index: 9999;
  background: #125842;
  transform: translateY(100%);
  pointer-events: none;
`;
document.body.appendChild(overlay);

// Curtain up on load
window.addEventListener('DOMContentLoaded', () => {
  overlay.style.transition = 'none';
  overlay.style.transform = 'translateY(0%)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.transition = 'transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)';
      overlay.style.transform = 'translateY(-100%)';
    });
  });
});

// Curtain down on link click → then navigate
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('http')) return;
  e.preventDefault();
  overlay.style.transition = 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)';
  overlay.style.transform = 'translateY(0%)';
  setTimeout(() => { window.location.href = href; }, 650);
});

// ─── NAV SCROLL BEHAVIOUR ──────────────────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ─── HAMBURGER ─────────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── INTERSECTION OBSERVER — REVEAL ────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-scroll-reveal]').forEach((el, i) => {
  const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-scroll-reveal'));
  el.style.transitionDelay = `${siblings.indexOf(el) * 0.12}s`;
  revealObserver.observe(el);
});

// ─── SPLIT TEXT REVEAL ─────────────────────────────────────────────────────
// Wraps each word in a span for staggered animation
function splitTextReveal(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const text = el.innerText;
    el.innerHTML = text.split(' ').map((w, i) =>
      `<span class="word-wrap"><span class="word" style="transition-delay:${0.05 + i * 0.04}s">${w}</span></span>`
    ).join(' ');
  });
}

// ─── MAGNETIC BUTTONS ──────────────────────────────────────────────────────
function initMagnetic() {
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  });
}
initMagnetic();

// ─── FLOATING PARTICLES ────────────────────────────────────────────────────
function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const delay = Math.random() * 8;
    const duration = 6 + Math.random() * 8;
    const x = Math.random() * 100;
    p.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${Math.random() > 0.5 ? 'rgba(18,88,66,0.18)' : 'rgba(127,140,67,0.2)'};
      left: ${x}%; bottom: -10px;
      animation: floatUp ${duration}s ease-in ${delay}s infinite;
      pointer-events: none;
      z-index: 1;
    `;
    hero.appendChild(p);
  }
}
initParticles();

// ─── COUNTER ANIMATION ─────────────────────────────────────────────────────
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.innerText);
  const isPercent = el.innerText.includes('%');
  const prefix = el.dataset.prefix || '';
  let start = 0;
  const duration = 1800;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.innerText = prefix + (isPercent
      ? (start + (target - start) * ease).toFixed(1) + '%'
      : Math.round(start + (target - start) * ease));
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => {
  el.dataset.target = parseFloat(el.innerText);
  counterObserver.observe(el);
});

// ─── PARALLAX BLOBS ────────────────────────────────────────────────────────
const blobs = document.querySelectorAll('.watercolor, .ph-blob');
if (blobs.length) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    blobs.forEach((b, i) => {
      const speed = [0.25, 0.12, 0.18][i % 3];
      b.style.transform = `translateY(${sy * speed}px)`;
    });
  }, { passive: true });
}

// ─── CURSOR GLOW ───────────────────────────────────────────────────────────
if (window.innerWidth > 1024) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 500px; height: 500px;
    pointer-events: none; z-index: 0; border-radius: 50%;
    background: radial-gradient(circle, rgba(18,88,66,0.055) 0%, transparent 65%);
    transform: translate(-50%,-50%); top: -250px; left: -250px;
    transition: opacity 0.4s;
  `;
  document.body.appendChild(glow);
  let gx = -250, gy = -250, tx = -250, ty = -250;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
  (function animGlow() {
    gx += (tx - gx) * 0.07;
    gy += (ty - gy) * 0.07;
    glow.style.left = gx + 'px';
    glow.style.top  = gy + 'px';
    requestAnimationFrame(animGlow);
  })();
}

// ─── TILT CARDS ────────────────────────────────────────────────────────────
document.querySelectorAll('.service-card, .why-item, .team-card, .pricing-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
  });
});

// ─── INDUSTRY PILLS ────────────────────────────────────────────────────────
document.querySelectorAll('.industry-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.industry-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  });
});

// ─── TYPING CURSOR IN HERO EYEBROW ─────────────────────────────────────────
const eyebrow = document.querySelector('.hero-eyebrow');
if (eyebrow) {
  const original = eyebrow.innerText;
  eyebrow.innerText = '';
  let i = 0;
  setTimeout(() => {
    const type = setInterval(() => {
      eyebrow.innerText = original.slice(0, ++i);
      if (i >= original.length) clearInterval(type);
    }, 45);
  }, 900);
}

// ─── SERVICE CARD ACTIVE STATE ON SCROLL ───────────────────────────────────
const serviceCards = document.querySelectorAll('.service-card');
if (serviceCards.length) {
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
    });
  }, { threshold: 0.6 });
  serviceCards.forEach(c => cardObserver.observe(c));
}

console.log('%cSynked.ai', 'color:#125842;font-family:serif;font-size:2rem;font-weight:300');
console.log('%csynk Your Business with AI', 'color:#7F8C43;font-size:0.9rem');
