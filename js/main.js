/* ============================================================
   LWiSE — Main JS
   Y2K effects, scroll reveal, counters, nav, etc.
   ============================================================ */

// ── NAV SCROLL
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── MOBILE NAV
const hamburger = document.getElementById('navHamburger');
const mobileNav = document.getElementById('navMobile');
const closeBtn  = document.getElementById('navClose');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => mobileNav.classList.add('open'));
  if (closeBtn) closeBtn.addEventListener('click', () => mobileNav.classList.remove('open'));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
}

// ── Y2K FLOATING STARS
const starsContainer = document.getElementById('y2kStars');
if (starsContainer) {
  const starColors = ['#F8E8A8','#F6C9D4','#C9B8E8','#FFF9F2','#D98FA5'];
  for (let i = 0; i < 18; i++) {
    const star = document.createElement('div');
    star.className = 'y2k-star';
    const size = 4 + Math.random() * 8;
    star.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${starColors[Math.floor(Math.random() * starColors.length)]};
      animation-duration: ${8 + Math.random() * 15}s;
      animation-delay: ${Math.random() * 10}s;
    `;
    starsContainer.appendChild(star);
  }
}

// ── CURSOR SPARKLES (Y2K)
(function() {
  const colors = ['#F8E8A8','#F6C9D4','#C9B8E8','#D98FA5','#4A3158'];
  let last = 0;
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - last < 60) return;
    last = now;
    const s = document.createElement('div');
    s.style.cssText = `
      position:fixed;left:${e.clientX}px;top:${e.clientY}px;
      width:6px;height:6px;border-radius:50%;pointer-events:none;z-index:9999;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      transform:translate(-50%,-50%);
      animation:sparkleOut 0.6s ease forwards;
    `;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 650);
  });
  if (!document.getElementById('sparkleStyle')) {
    const st = document.createElement('style');
    st.id = 'sparkleStyle';
    st.textContent = `@keyframes sparkleOut{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(0) translateY(-20px)}}`;
    document.head.appendChild(st);
  }
})();

// ── SCROLL REVEAL
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// ── COUNTER ANIMATION
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 1800;
  const start = performance.now();
  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── TOAST NOTIFICATION
window.showToast = function(message, type = 'success') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span>${message}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
};

// ── EVENT FILTER (used on events.html)
window.initEventFilter = function() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('[data-category]');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
};

// ── MEMBERS SEARCH (used on members.html)
window.initMemberSearch = function() {
  const input = document.getElementById('memberSearch');
  const cards = document.querySelectorAll('.member-card');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    let count = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const show = !q || text.includes(q);
      card.style.display = show ? '' : 'none';
      if (show) count++;
    });
    const countEl = document.getElementById('membersCount');
    if (countEl) countEl.textContent = `${count} member${count !== 1 ? 's' : ''}`;
  });
};
