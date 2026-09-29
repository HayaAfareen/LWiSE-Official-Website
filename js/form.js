/* LWiSE — Form JS v3
   Google Sheets ID: 19gik8ISnFIyHxvZQLUjECQUeLr8Wv2e86sfhIH_hTfI
*/

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzJeivr4ETpUNvCFa1hdV4XyOAEdTGroy-Nsr6oe9QN3V9HYd4wUk7Tu-_xv-PqtslR/exec';

// ── MEMBERSHIP FORM
const memberForm = document.getElementById('memberForm');
const fSuccess   = document.getElementById('fSuccess');
const submitBtn  = document.getElementById('submitBtn');

if (memberForm) {
  memberForm.addEventListener('submit', async e => {
    e.preventDefault();

    let ok = true;
    memberForm.querySelectorAll('[required]').forEach(f => {
      const invalid = f.type === 'checkbox' ? !f.checked : !f.value.trim();
      f.style.outlineColor = invalid ? 'var(--pink-deep)' : '';
      if (invalid) ok = false;
    });
    if (!ok) { showToast('Please fill in all required fields.', 'error'); return; }

    const data = {
      type:       'membership',
      timestamp:  new Date().toISOString(),
      firstName:  memberForm.fFirst.value.trim(),
      lastName:   memberForm.fLast.value.trim(),
      fullName:   `${memberForm.fFirst.value.trim()} ${memberForm.fLast.value.trim()}`,
      email:      memberForm.fEmail.value.trim(),
      instagram:  memberForm.fInstagram.value.trim(),
      position:   memberForm.fPosition.value,
      department: memberForm.fDept.value,
      major:      memberForm.fMajor.value.trim(),
    };

    submitBtn.textContent = 'Registering…';
    submitBtn.disabled = true;

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      saveLocal(data);
      memberForm.style.display = 'none';
      fSuccess.classList.add('show');
      showToast('Registered successfully.');
    } catch(err) {
      saveLocal(data);
      memberForm.style.display = 'none';
      fSuccess.classList.add('show');
    } finally {
      submitBtn.textContent = 'Register';
      submitBtn.disabled = false;
    }
  });
}

// ── COLLAB FORM
const collabForm = document.getElementById('collabForm');
const cSuccess   = document.getElementById('cSuccess');

if (collabForm) {
  collabForm.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    collabForm.querySelectorAll('[required]').forEach(f => {
      if (!f.value.trim()) { f.style.outlineColor = 'var(--pink-deep)'; ok = false; }
      else f.style.outlineColor = '';
    });
    if (!ok) { showToast('Please fill in all required fields.', 'error'); return; }

    const data = {
      type:       'collaboration',
      timestamp:  new Date().toISOString(),
      name:       collabForm.querySelector('[name="name"]').value.trim(),
      org:        collabForm.querySelector('[name="org"]').value.trim(),
      email:      collabForm.querySelector('[name="email"]').value.trim(),
      collabType: collabForm.querySelector('[name="collabType"]').value,
      message:    collabForm.querySelector('[name="message"]').value.trim(),
    };

    const btn = collabForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…'; btn.disabled = true;

    try {
      await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      collabForm.style.display = 'none'; cSuccess.classList.add('show');
      showToast('Inquiry sent. We\'ll be in touch.');
    } catch(err) {
      collabForm.style.display = 'none'; cSuccess.classList.add('show');
    } finally {
      btn.textContent = 'Send Inquiry'; btn.disabled = false;
    }
  });
}

function saveLocal(data) {
  const arr = JSON.parse(localStorage.getItem('lwise_members') || '[]');
  const exists = arr.some(m => m.email === data.email && m.type === data.type);
  if (!exists) { arr.push(data); localStorage.setItem('lwise_members', JSON.stringify(arr)); }
}
