/**
 * LWiSE — Google Apps Script v2
 *
 * SETUP:
 * 1. Go to script.google.com → New project
 * 2. Paste this entire file
 * 3. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the Web App URL into js/form.js (SCRIPT_URL) and js/team.js (TEAM_SCRIPT_URL)
 */

const SPREADSHEET_ID = '19gik8ISnFIyHxvZQLUjECQUeLr8Wv2e86sfhIH_hTfI';
const MEMBERS_SHEET  = 'Members';
const COLLAB_SHEET   = 'Collaborations';

// ── doPost — receives form submissions
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (data.type === 'membership')    saveMember(ss, data);
    else if (data.type === 'collaboration') saveCollab(ss, data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── doGet — returns data as JSON
function doGet(e) {
  try {
    const action = (e.parameter && e.parameter.action) || 'members';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    if (action === 'members') {
      const sheet = getOrCreateSheet(ss, MEMBERS_SHEET, MEMBER_HEADERS);
      const rows  = sheet.getDataRange().getValues();
      if (rows.length <= 1) return jsonResponse([]);
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

// ── MEMBER HEADERS (updated for simplified form)
const MEMBER_HEADERS = [
  'Timestamp', 'Full Name', 'First Name', 'Last Name',
  'Email', 'Instagram', 'Position', 'Department', 'Major'
];

function saveMember(ss, data) {
  const sheet = getOrCreateSheet(ss, MEMBERS_SHEET, MEMBER_HEADERS);
  sheet.appendRow([
    data.timestamp  || new Date().toISOString(),
    data.fullName   || '',
    data.firstName  || '',
    data.lastName   || '',
    data.email      || '',
    data.instagram  || '',
    data.position   || '',
    data.department || '',
    data.major      || '',
  ]);
}

// ── COLLAB HEADERS
const COLLAB_HEADERS = ['Timestamp', 'Name', 'Organization', 'Email', 'Collaboration Type', 'Message'];

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
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#F5E6A3');
    headerRange.setFontColor('#1A1118');
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
