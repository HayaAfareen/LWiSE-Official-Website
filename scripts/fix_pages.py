import os, re

base = r'C:\Users\28100441\Desktop\Lwise website'

NEW_NAV_LOGO = '''<a href="index.html" class="nav__logo">
      <img src="assets/images/lwise-logo.png" alt="LWiSE" class="nav__logo-img">
      <span class="nav__logo-text">LWiSE</span>
    </a>'''

NEW_FOOTER_LOGO = '''<div class="footer-logo">
          <img src="assets/images/lwise-logo.png" alt="LWiSE" class="footer-logo-img">
          <span class="footer-logo-text">LWiSE</span>
        </div>'''

pages = ['events.html', 'members.html', 'research.html', 'opportunities.html']

for p in pages:
    path = os.path.join(base, p)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace nav logo (old gem version)
    content = re.sub(
        r'<a href="index\.html" class="nav__logo"><span class="nav__logo-gem"></span>LWiSE</a>',
        NEW_NAV_LOGO,
        content
    )

    # Replace footer logo text
    content = content.replace('<div class="footer-logo">LWiSE ✦</div>', NEW_FOOTER_LOGO)

    # Replace favicon
    content = re.sub(
        r'<link rel="icon" href="data:image/svg\+xml[^"]*">',
        '<link rel="icon" href="assets/images/lwise-logo.png">',
        content
    )

    # Fix mantra
    content = content.replace('EXPLORE · RESEARCH · CONNECT · LEAD', 'LUMS · LAHORE · PAKISTAN')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {p}')

print('Done')
