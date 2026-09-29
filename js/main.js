/* LWiSE — Main JS v2 */

// ── NAV SCROLL
const Nav = document.getElementById('Nav');
if (Nav) window.addEventListener('scroll', () => Nav.classList.toggle('scrolled', window.scrollY > 50));

// ── MOBILE NAV
const NavHam  = document.getElementById('NavHam');
const NavMob  = document.getElementById('NavMob');
const NavClose= document.getElementById('NavClose');
if (NavHam)  NavHam.addEventListener('click', () => NavMob.classList.add('open'));
if (NavClose) NavClose.addEventListener('click', () => NavMob.classList.remove('open'));
if (NavMob)  NavMob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => NavMob.classList.remove('open')));

// ── SCROLL REVEAL
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.up').forEach(el => revObs.observe(el));

// ── COUNTER ANIMATION
function runCounter(el) {
  const target = parseInt(el.dataset.t || el.dataset.target || '0');
  const dur = 1600;
  const start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      runCounter(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));

// ── SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ── TOAST
window.showToast = function(msg, type = 'success') {
  let t = document.getElementById('lwise-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'lwise-toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = `<span>${type === 'success' ? '✓' : '✕'}</span> ${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4200);
};

// ── EVENT / OPP FILTER
window.initFilter = function(btnSel, cardAttr) {
  const btns  = document.querySelectorAll(btnSel);
  const cards = document.querySelectorAll(`[${cardAttr}]`);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const cat = btn.dataset.filter;
      cards.forEach(c => {
        c.style.display = (cat === 'all' || c.getAttribute(cardAttr) === cat) ? '' : 'none';
      });
    });
  });
};

// ── MEMBER SEARCH
window.initMemberSearch = function() {
  const input = document.getElementById('memberSearch');
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    let n = 0;
    document.querySelectorAll('.mem-card').forEach(c => {
      const show = !q || c.textContent.toLowerCase().includes(q);
      c.style.display = show ? '' : 'none';
      if (show) n++;
    });
    const el = document.getElementById('memCount');
    if (el) el.textContent = `${n} member${n !== 1 ? 's' : ''}`;
  });
};
