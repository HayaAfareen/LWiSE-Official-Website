/* LWiSE — Members Directory JS v2
   Sheets ID: 19gik8ISnFIyHxvZQLUjECQUeLr8Wv2e86sfhIH_hTfI
*/

const SCRIPT_URL_M = 'https://script.google.com/macros/s/AKfycbzJeivr4ETpUNvCFa1hdV4XyOAEdTGroy-Nsr6oe9QN3V9HYd4wUk7Tu-_xv-PqtslR/exec';

const memGrid = document.getElementById('memGrid');
const noMems  = document.getElementById('noMems');
const memCount= document.getElementById('memCount');

async function loadMembers() {
  let members = [];

  if (SCRIPT_URL_M && !SCRIPT_URL_M.includes('YOUR_GOOGLE')) {
    try {
      const r = await fetch(`${SCRIPT_URL_M}?action=members`);
      const d = await r.json();
      if (Array.isArray(d)) members = d.filter(m => m['Full Name'] || m.fullName);
    } catch(e) { console.warn('Sheets unavailable, falling back to localStorage'); }
  }

  if (members.length === 0) {
    const local = JSON.parse(localStorage.getItem('lwise_members') || '[]');
    members = local
      .filter(m => m.type === 'membership')
      .map(m => ({
        'Full Name':      m.fullName || `${m.firstName||''} ${m.lastName||''}`.trim(),
        'Department':     m.department || '',
        'Major':          m.major || '',
        'Year of Study':  m.yearOfStudy || '',
        'STEM Fields':    m.stemFields || '',
        'Member Type':    m.memberType || '',
      }));
  }

  render(members);
}

const grads = [
  'linear-gradient(135deg,#F5E6A3,#F2B5C5)',
  'linear-gradient(135deg,#F2B5C5,#F5E6A3)',
  'linear-gradient(135deg,#EDD96A,#F2B5C5)',
  'linear-gradient(135deg,#F2B5C5,#EDD96A)',
  'linear-gradient(135deg,#F5E6A3,#D8C8F0)',
];

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function render(members) {
  memGrid.innerHTML = '';
  if (!members.length) { noMems.style.display='block'; memCount.textContent='0 members'; return; }
  noMems.style.display='none';
  memCount.textContent=`${members.length} member${members.length!==1?'s':''} · 2026–27`;

  members.forEach((m, i) => {
    const name   = m['Full Name'] || m.fullName || 'Member';
    const dept   = m['Department'] || '';
    const major  = m['Major'] || '';
    const year   = m['Year of Study'] || '';
    const fields = m['STEM Fields'] || '';
    const type   = m['Member Type'] || '';
    const init   = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || '?';
    const g      = grads[i % grads.length];

    const fChips = fields ? fields.split(',').slice(0,2).map(f=>`<span class="chip chip-pink" style="font-size:0.65rem;">${esc(f.trim())}</span>`).join('') : '';
    const typeChip = type ? `<span class="chip chip-butter" style="font-size:0.65rem;">${esc(type)}</span>` : '';

    const card = document.createElement('div');
    card.className = 'mem-card up';
    card.innerHTML = `
      <div class="mem-card__av" style="background:${g}">${init}</div>
      <div style="flex:1;min-width:0;">
        <div class="mem-card__name">${esc(name)}</div>
        ${major ? `<div class="mem-card__dept">${esc(major)}</div>` : ''}
        ${(dept||year) ? `<div class="mem-card__year">${[dept,year].filter(Boolean).map(esc).join(' · ')}</div>` : ''}
        <div class="mem-card__chips">${typeChip}${fChips}</div>
      </div>`;
    memGrid.appendChild(card);
  });

  // re-observe new cards
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
  }, {threshold:0.1});
  document.querySelectorAll('.mem-card.up').forEach(c => obs.observe(c));

  initMemberSearch();
}

loadMembers();
