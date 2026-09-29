/* LWiSE — Form JS v2
   Google Sheets ID: 19gik8ISnFIyHxvZQLUjECQUeLr8Wv2e86sfhIH_hTfI
   Replace SCRIPT_URL after deploying Apps Script as Web App.
*/

const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE';

// ── MEMBERSHIP FORM
const memberForm = document.getElementById('memberForm');
const fSuccess   = document.getElementById('fSuccess');
const submitBtn  = document.getElementById('submitBtn');

if (memberForm) {
  memberForm.addEventListener('submit', async e => {
    e.preventDefault();

    // validate required fields
    let ok = true;
    memberForm.querySelectorAll('[required]').forEach(f => {
      if (f.type === 'checkbox' ? !f.checked : !f.value.trim()) {
        f.style.outlineColor = 'var(--pink-deep)';
        ok = false;
      } else {
        f.style.outlineColor = '';
      }
    });
    if (!ok) { showToast('Please fill in all required fields.', 'error'); return; }

    const stemFields = [...memberForm.querySelectorAll('input[name="stemFields"]:checked')]
      .map(cb => cb.value).join(', ');

    const data = {
      type:          'membership',
      timestamp:     new Date().toISOString(),
      firstName:     memberForm.fFirst.value.trim(),
      lastName:      memberForm.fLast.value.trim(),
      fullName:      `${memberForm.fFirst.value.trim()} ${memberForm.fLast.value.trim()}`,
      email:         memberForm.fEmail.value.trim(),
      phone:         memberForm.fPhone.value.trim(),
      memberType:    memberForm.fMemberType.value,
      institution:   memberForm.fInst.value.trim(),
      department:    memberForm.fDept.value,
      major:         memberForm.fMajor.value.trim(),
      yearOfStudy:   memberForm.fYear.value,
      stemFields,
      lwiseInterest: memberForm.fInterest.value,
      howHeard:      memberForm.fHeard.value,
      bio:           memberForm.fBio.value.trim(),
    };

    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    try {
      if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_GOOGLE')) {
        saveLocal(data);
      } else {
        await fetch(SCRIPT_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data) });
      }
      memberForm.style.display = 'none';
      fSuccess.classList.add('show');
      showToast('Welcome to LWiSE! 🎉');
    } catch(err) {
      saveLocal(data);
      memberForm.style.display = 'none';
      fSuccess.classList.add('show');
    } finally {
      submitBtn.textContent = 'Join LWiSE ✦';
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
      if (!f.value.trim()) { f.style.outlineColor='var(--pink-deep)'; ok=false; }
      else f.style.outlineColor='';
    });
    if (!ok) { showToast('Please fill in all required fields.','error'); return; }

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
      if (!SCRIPT_URL || SCRIPT_URL.includes('YOUR_GOOGLE')) saveLocal(data);
      else await fetch(SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      collabForm.style.display='none'; cSuccess.classList.add('show');
      showToast('Inquiry sent! We\'ll be in touch. ✦');
    } catch(err) {
      saveLocal(data); collabForm.style.display='none'; cSuccess.classList.add('show');
    } finally {
      btn.textContent='Send Inquiry ✦'; btn.disabled=false;
    }
  });
}

function saveLocal(data) {
  const arr = JSON.parse(localStorage.getItem('lwise_members') || '[]');
  arr.push(data);
  localStorage.setItem('lwise_members', JSON.stringify(arr));
}
