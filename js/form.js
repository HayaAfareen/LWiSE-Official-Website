/* ============================================================
   LWiSE — Form Submission Script
   Submits to Google Apps Script Web App URL
   which stores data in Google Sheets.
   ============================================================

   SETUP INSTRUCTIONS:
   1. Open the Google Apps Script in scripts/Code.gs
   2. Deploy it as a Web App (share with "Anyone")
   3. Copy the deployment URL and paste it below as SCRIPT_URL
   ============================================================ */

// ── CONFIG — REPLACE THIS WITH YOUR DEPLOYED APPS SCRIPT URL
const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE';

// ── MEMBERSHIP FORM
const membershipForm = document.getElementById('membershipForm');
const formSuccess    = document.getElementById('formSuccess');
const submitBtn      = document.getElementById('submitBtn');

if (membershipForm) {
  membershipForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const required = membershipForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--rose)';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    // Consent check
    const consent = document.getElementById('consent');
    if (consent && !consent.checked) {
      consent.parentElement.style.color = 'var(--rose)';
      valid = false;
    }

    if (!valid) {
      showToast('Please fill in all required fields. ✦', 'error');
      return;
    }

    // Collect STEM fields checkboxes
    const stemFieldsChecked = Array.from(
      membershipForm.querySelectorAll('input[name="stemFields"]:checked')
    ).map(cb => cb.value).join(', ');

    // Build payload
    const data = {
      type:         'membership',
      timestamp:    new Date().toISOString(),
      firstName:    membershipForm.firstName.value.trim(),
      lastName:     membershipForm.lastName.value.trim(),
      fullName:     `${membershipForm.firstName.value.trim()} ${membershipForm.lastName.value.trim()}`,
      email:        membershipForm.email.value.trim(),
      phone:        membershipForm.phone.value.trim(),
      memberType:   membershipForm.memberType.value,
      institution:  membershipForm.institution.value.trim(),
      department:   membershipForm.department.value,
      major:        membershipForm.major.value.trim(),
      yearOfStudy:  membershipForm.yearOfStudy.value,
      stemFields:   stemFieldsChecked,
      lwiseInterest: membershipForm.lwiseInterest.value,
      howHeard:     membershipForm.howHeard.value,
      bio:          membershipForm.bio.value.trim(),
    };

    // Submit
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    try {
      if (!SCRIPT_URL || SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE') {
        // Dev mode — save locally for testing
        saveLocally(data);
        showFormSuccess();
        return;
      }

      const resp = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      // no-cors means we can't read the response, but if no error thrown, it worked
      showFormSuccess();
    } catch (err) {
      console.error('Form submission error:', err);
      // Fallback: save locally
      saveLocally(data);
      showFormSuccess();
      showToast('Saved locally (Google Sheets not configured yet).', 'success');
    }
  });
}

function showFormSuccess() {
  membershipForm.style.display = 'none';
  formSuccess.classList.add('show');
  submitBtn.textContent = 'Join LWiSE ✦';
  submitBtn.disabled = false;
  window.scrollTo({ top: document.getElementById('member-form').offsetTop - 80, behavior: 'smooth' });
  showToast('Welcome to LWiSE! 🎉');
}

// ── LOCAL STORAGE FALLBACK
function saveLocally(data) {
  const existing = JSON.parse(localStorage.getItem('lwise_members') || '[]');
  existing.push(data);
  localStorage.setItem('lwise_members', JSON.stringify(existing));
  console.log('Member saved locally:', data);
}

// ── COLLABORATION FORM
const collabForm    = document.getElementById('collabForm');
const collabSuccess = document.getElementById('collabSuccess');

if (collabForm) {
  collabForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const required = collabForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) { field.style.borderColor = 'var(--rose)'; valid = false; }
      else field.style.borderColor = '';
    });
    if (!valid) { showToast('Please fill in all required fields.', 'error'); return; }

    const data = {
      type:        'collaboration',
      timestamp:   new Date().toISOString(),
      name:        collabForm.name.value.trim(),
      org:         collabForm.org.value.trim(),
      email:       collabForm.email.value.trim(),
      collabType:  collabForm.collabType.value,
      message:     collabForm.message.value.trim(),
    };

    const btn = collabForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      if (!SCRIPT_URL || SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE') {
        saveLocally(data);
      } else {
        await fetch(SCRIPT_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      collabForm.style.display = 'none';
      collabSuccess.classList.add('show');
      showToast('Thank you! We'll be in touch. ✦');
    } catch (err) {
      saveLocally(data);
      collabForm.style.display = 'none';
      collabSuccess.classList.add('show');
    } finally {
      btn.textContent = 'Send Inquiry ✦';
      btn.disabled = false;
    }
  });
}
