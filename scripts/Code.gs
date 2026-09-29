/**
 * LWiSE — Google Apps Script
 *
 * SETUP:
 * 1. Go to script.google.com → New project
 * 2. Paste this entire file
 * 3. Edit SPREADSHEET_ID below (get it from your Google Sheet URL)
 * 4. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL
 * 6. Paste it in js/form.js as SCRIPT_URL
 */

// ── REPLACE WITH YOUR GOOGLE SHEET ID ────────────────────
// Sheet URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// ── Sheet tab names
const MEMBERS_SHEET = 'Members';
const COLLAB_SHEET  = 'Collaborations';

// ── doPost — receives form submissions from the website
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.type === 'membership') {
      saveMember(ss, data);
    } else if (data.type === 'collaboration') {
      saveCollab(ss, data);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── doGet — returns member list as JSON (for website display)
function doGet(e) {
  try {
    const action = e.parameter.action || 'members';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === 'members') {
      const sheet = getOrCreateSheet(ss, MEMBERS_SHEET, MEMBER_HEADERS);
      const rows  = sheet.getDataRange().getValues();
      if (rows.length <= 1) {
        return jsonResponse([]);
      }
      const headers = rows[0];
      const members = rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = row[i]; });
        return obj;
      });
      return jsonResponse(members);
    }

    return jsonResponse({ status: 'ok' });

  } catch (err) {
    return jsonResponse({ error: err.toString() });
  }
}

// ── MEMBER HEADERS
const MEMBER_HEADERS = [
  'Timestamp', 'Full Name', 'First Name', 'Last Name',
  'Email', 'Phone', 'Member Type',
  'Institution', 'Department', 'Major', 'Year of Study',
  'STEM Fields', 'LWiSE Interest', 'How Heard', 'Bio'
];

function saveMember(ss, data) {
  const sheet = getOrCreateSheet(ss, MEMBERS_SHEET, MEMBER_HEADERS);
  sheet.appendRow([
    data.timestamp    || new Date().toISOString(),
    data.fullName     || '',
    data.firstName    || '',
    data.lastName     || '',
    data.email        || '',
    data.phone        || '',
    data.memberType   || '',
    data.institution  || '',
    data.department   || '',
    data.major        || '',
    data.yearOfStudy  || '',
    data.stemFields   || '',
    data.lwiseInterest|| '',
    data.howHeard     || '',
    data.bio          || '',
  ]);
}

// ── COLLAB HEADERS
const COLLAB_HEADERS = [
  'Timestamp', 'Name', 'Organization', 'Email', 'Collaboration Type', 'Message'
];

function saveCollab(ss, data) {
  const sheet = getOrCreateSheet(ss, COLLAB_SHEET, COLLAB_HEADERS);
  sheet.appendRow([
    data.timestamp  || new Date().toISOString(),
    data.name       || '',
    data.org        || '',
    data.email      || '',
    data.collabType || '',
    data.message    || '',
  ]);
}

// ── Helpers
function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    // Style header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#4A3158');
    headerRange.setFontColor('#FFF9F2');
    headerRange.setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
