/* ============================================================
   LWiSE — Members Directory JS
   Loads members from Google Sheets API or localStorage fallback
   ============================================================ */

// ── CONFIG — use same Apps Script URL as form.js
// This reads from localStorage first (dev mode), then from Sheets
const SCRIPT_URL_MEMBERS = 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE';

const grid      = document.getElementById('membersGrid');
const noMembers = document.getElementById('noMembers');
const countEl   = document.getElementById('membersCount');

async function loadMembers() {
  let members = [];

  // 1. Try Google Sheets first
  if (SCRIPT_URL_MEMBERS && SCRIPT_URL_MEMBERS !== 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE') {
    try {
      const resp = await fetch(`${SCRIPT_URL_MEMBERS}?action=members`);
      const data = await resp.json();
      if (Array.isArray(data)) {
        members = data.filter(m => m['Full Name'] || m.fullName);
      }
    } catch (err) {
      console.warn('Could not load from Sheets, falling back to localStorage:', err);
    }
  }

  // 2. Fallback: localStorage (for testing without Sheets)
  if (members.length === 0) {
    const local = JSON.parse(localStorage.getItem('lwise_members') || '[]');
    // normalize both formats
    members = local.map(m => ({
      'Full Name':      m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim(),
      'Department':     m.department || '',
      'Major':          m.major || '',
      'Year of Study':  m.yearOfStudy || '',
      'STEM Fields':    m.stemFields || '',
      'LWiSE Interest': m.lwiseInterest || '',
      'Member Type':    m.memberType || '',
    }));
  }

  renderMembers(members);
}

function renderMembers(members) {
  grid.innerHTML = '';

  if (members.length === 0) {
    noMembers.style.display = 'block';
    countEl.textContent = '0 members';
    return;
  }

  noMembers.style.display = 'none';
  countEl.textContent = `${members.length} member${members.length !== 1 ? 's' : ''} · 2026–27`;

  members.forEach((m, i) => {
    const name   = m['Full Name'] || m.fullName || 'Anonymous';
    const dept   = m['Department'] || m.department || '';
    const major  = m['Major'] || m.major || '';
    const year   = m['Year of Study'] || m.yearOfStudy || '';
    const fields = m['STEM Fields'] || m.stemFields || '';
    const type   = m['Member Type'] || m.memberType || '';

    // Initials for avatar
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    // Pick a gradient based on index
    const gradients = [
      'linear-gradient(135deg,#F6C9D4,#C9B8E8)',
      'linear-gradient(135deg,#F8E8A8,#F6C9D4)',
      'linear-gradient(135deg,#C9B8E8,#B9C9B0)',
      'linear-gradient(135deg,#F6C9D4,#F8E8A8)',
      'linear-gradient(135deg,#D98FA5,#C9B8E8)',
    ];
    const grad = gradients[i % gradients.length];

    const card = document.createElement('div');
    card.className = 'member-card fade-up';
    card.innerHTML = `
      <div class="member-card__avatar" style="background:${grad}">${initials}</div>
      <div class="member-card__info">
        <div class="member-card__name">${escHtml(name)}</div>
        ${major ? `<div class="member-card__dept">${escHtml(major)}</div>` : ''}
        ${dept || year ? `<div class="member-card__year">${[dept, year].filter(Boolean).map(escHtml).join(' · ')}</div>` : ''}
        <div class="member-card__badges" style="margin-top:0.4rem;">
          ${type ? `<span class="y2k-badge y2k-badge--blush">${escHtml(type)}</span>` : ''}
          ${fields ? fields.split(',').slice(0,2).map(f => `<span class="y2k-badge y2k-badge--lilac">${escHtml(f.trim())}</span>`).join('') : ''}
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // Re-initialize scroll reveal for new cards
  document.querySelectorAll('.fade-up').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });

  // Initialize search
  initMemberSearch();
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// Boot
loadMembers();
