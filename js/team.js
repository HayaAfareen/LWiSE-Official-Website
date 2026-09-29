/* LWiSE — Team JS v1
   Loads 2026-27 members from Google Sheets (via Apps Script doGet?action=members)
   and renders them in the team grid on team.html.
   Falls back to localStorage if Sheets is unavailable.
*/

const TEAM_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJeivr4ETpUNvCFa1hdV4XyOAEdTGroy-Nsr6oe9QN3V9HYd4wUk7Tu-_xv-PqtslR/exec';

const teamGrid  = document.getElementById('teamGrid');
const teamEmpty = document.getElementById('teamEmpty');
const teamCount = document.getElementById('teamCount');

async function loadTeam() {
  if (!teamGrid) return;

  let members = [];

  // Try Sheets first
  try {
    const r = await fetch(`${TEAM_SCRIPT_URL}?action=members`);
    const d = await r.json();
    if (Array.isArray(d) && d.length) {
      members = d.filter(m => m['Full Name'] || m.fullName);
    }
  } catch(e) {
    console.warn('Sheets unavailable, falling back to localStorage');
  }

  // Fallback: localStorage
  if (!members.length) {
    const local = JSON.parse(localStorage.getItem('lwise_members') || '[]');
    members = local
      .filter(m => m.type === 'membership')
      .map(m => ({
        'Full Name':  m.fullName || `${m.firstName || ''} ${m.lastName || ''}`.trim(),
        'Email':      m.email || '',
        'Instagram':  m.instagram || '',
        'Position':   m.position || '',
        'Department': m.department || '',
        'Major':      m.major || '',
      }));
  }

  renderTeam(members);
}

const gradients = [
  'linear-gradient(135deg,#F5E6A3,#F2B5C5)',
  'linear-gradient(135deg,#F2B5C5,#F5E6A3)',
  'linear-gradient(135deg,#EDD96A,#F2B5C5)',
  'linear-gradient(135deg,#F2B5C5,#EDD96A)',
  'linear-gradient(135deg,#F5E6A3,#D8C8F0)',
  'linear-gradient(135deg,#D8C8F0,#F5E6A3)',
];

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

function renderTeam(members) {
  teamGrid.innerHTML = '';

  if (!members.length) {
    if (teamEmpty) teamEmpty.style.display = 'block';
    if (teamCount) teamCount.textContent = '';
    return;
  }

  if (teamEmpty) teamEmpty.style.display = 'none';
  if (teamCount) teamCount.textContent = `${members.length} member${members.length !== 1 ? 's' : ''} · 2026–27`;

  members.forEach((m, i) => {
    const name   = esc(m['Full Name'] || m.fullName || 'Member');
    const email  = m['Email'] || m.email || '';
    const pos    = esc(m['Position'] || m.position || '');
    const dept   = esc(m['Department'] || m.department || '');
    const init   = name.replace(/&amp;/g,'').replace(/&[^;]+;/g,'').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || '?';
    const grad   = gradients[i % gradients.length];

    const card = document.createElement('div');
    card.className = 'team-card up';
    card.innerHTML = `
      <div class="team-card__av" style="background:${grad}">${init}</div>
      <div class="team-card__body">
        <div class="team-card__name">${name}</div>
        ${pos   ? `<div class="team-card__role">${pos}</div>` : ''}
        ${dept  ? `<div class="team-card__dept">${dept}</div>` : ''}
        ${email ? `<div class="team-card__email"><a href="mailto:${esc(email)}">${esc(email)}</a></div>` : ''}
      </div>`;
    teamGrid.appendChild(card);
  });

  // Observe for scroll-reveal
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  teamGrid.querySelectorAll('.team-card.up').forEach(c => obs.observe(c));
}

loadTeam();
