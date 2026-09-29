# LWiSE Website

**LUMS Women in Science and Engineering**

A full static website for LWiSE, deployable via GitHub Pages.

---

## Quick Deploy to GitHub Pages

```bash
# 1. Create a new GitHub repo (e.g. lwise-website)
# 2. In this folder:
git init
git add .
git commit -m "Initial LWiSE website"
git remote add origin https://github.com/YOUR_USERNAME/lwise-website.git
git push -u origin main

# 3. On GitHub: Settings → Pages → Source: Deploy from branch → main → / (root)
# Your site will be live at: https://YOUR_USERNAME.github.io/lwise-website/
```

---

## Google Sheets Form Pipeline Setup

The membership form on `join.html` submits data to a Google Apps Script, which saves it to a Google Sheet and also serves the data back to the members directory page.

### Steps

**1. Create a Google Sheet**
- Go to sheets.google.com → New spreadsheet
- Name it "LWiSE Members 2026–27"
- Copy the spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

**2. Set up the Apps Script**
- Go to script.google.com → New project
- Name it "LWiSE Form Handler"
- Delete the default code and paste the contents of `scripts/Code.gs`
- Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Sheet ID

**3. Deploy as Web App**
- Click Deploy → New Deployment
- Type: Web App
- Execute as: Me
- Who has access: Anyone
- Click Deploy → Copy the Web App URL

**4. Add the URL to the website**
- Open `js/form.js` — replace `YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE` with your URL
- Open `js/members.js` — replace `YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE` with your URL
- Commit and push

**5. Test**
- Fill out the join form → check your Google Sheet — the row should appear
- Visit `/members.html` — it should display the member

---

## File Structure

```
lwise-website/
├── index.html          Homepage
├── join.html           Membership form + collaboration form
├── members.html        Members directory (auto-populated)
├── team.html           Leadership & directorate
├── events.html         Event archive with filters
├── research.html       Research, competition, publications, resources
├── opportunities.html  Opportunity hub with category filters
├── css/
│   └── style.css       Full design system
├── js/
│   ├── main.js         Nav, scroll reveal, counters, Y2K effects
│   ├── form.js         Form submission to Google Sheets
│   └── members.js      Members directory display
├── scripts/
│   └── Code.gs         Google Apps Script (deploy separately)
└── assets/
    └── images/         Add real LWiSE photos here
```

---

## Adding Your Own Photos

Replace the emoji placeholders with real LWiSE photos:

- In `index.html`, the `about__visual-card--main` div contains a placeholder `🔬` — replace with `<img src="assets/images/YOUR_PHOTO.jpg" class="about__visual-img" alt="...">`
- Event cards support an `<img>` tag inside — add real event photography
- Team cards: replace the initial letter inside `.team-card__avatar` with `<img>`

---

## Updating Social Links

Search for `href="#"` in the footer of each page and replace with your actual Instagram and LinkedIn URLs.

---

## Color Palette

| Name | Hex | Use |
|------|-----|-----|
| Soft Cream | `#FFF9F2` | Background (60%) |
| LWiSE Blush | `#F6C9D4` | Cards, sections (20%) |
| Deep Plum | `#4A3158` | Headings, nav, CTAs (8%) |
| Buttercream | `#F8E8A8` | Highlights, accents (5%) |
| Lilac | `#C9B8E8` | Secondary accent (4%) |
| Rose | `#D98FA5` | Hovers, labels (3%) |

---

## 2026–27 Leadership

- President: Haya Afareen
- Treasurer: Areej Butt
- General Secretary: Shiza Ahsan

Update director names in `team.html` once confirmed.
