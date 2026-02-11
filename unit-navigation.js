(function () {
  function getThemeFromPage() {
    const headingText = document.querySelector('h1')?.textContent || document.title || '';
    const themeMatch = headingText.match(/thema\s*(\d+)/i);
    return themeMatch ? Number(themeMatch[1]) : null;
  }

  function parseUnitContext() {
    const filename = window.location.pathname.split('/').pop() || '';

    const themedMatch = filename.match(/^thema(\d+)unit(\d+)\.html$/i);
    if (themedMatch) {
      const themeNumber = Number(themedMatch[1]);
      const unitNumber = Number(themedMatch[2]);
      return {
        themeNumber,
        unitNumber,
        themeFile: `thema${themeNumber}.html`,
        nextCandidates: [`thema${themeNumber}unit${unitNumber + 1}.html`]
      };
    }

    const unitMatch = filename.match(/^unit(\d+)\.html$/i);
    if (unitMatch) {
      const unitNumber = Number(unitMatch[1]);
      const themeNumber = getThemeFromPage();
      return {
        themeNumber,
        unitNumber,
        themeFile: themeNumber ? `thema${themeNumber}.html` : 'index.html',
        nextCandidates: [
          ...(themeNumber ? [`thema${themeNumber}unit${unitNumber + 1}.html`] : []),
          `unit${unitNumber + 1}.html`
        ]
      };
    }

    return null;
  }

  function createButtonLink(href, label) {
    const link = document.createElement('a');
    link.href = href;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;

    link.appendChild(button);
    return link;
  }

  async function pageExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) return true;
      if (response.status !== 405) return false;
    } catch (error) {
      // Ga verder met GET-fallback.
    }

    try {
      const response = await fetch(url, { method: 'GET' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async function setupUnitNavigation() {
    const endScreen = document.getElementById('endScreen');
    const navContainer = endScreen?.querySelector('.nav-buttons');
    if (!navContainer) return;

    const context = parseUnitContext();
    if (!context) return;

    const existingLinks = [...navContainer.querySelectorAll('a[href]')].map((link) => link.getAttribute('href'));
    const existingThemeLink = existingLinks.find((href) => /^thema\d+\.html$/i.test(href || ''));
    const existingNextLink = existingLinks.find((href) => /unit\d+\.html$/i.test(href || ''));

    const themeFile = existingThemeLink || context.themeFile;
    const themeNumberMatch = String(themeFile).match(/thema(\d+)\.html/i);
    const themeNumber = themeNumberMatch ? Number(themeNumberMatch[1]) : context.themeNumber;

    const nextCandidates = [...new Set([
      ...(existingNextLink ? [existingNextLink] : []),
      ...(context.nextCandidates || [])
    ])];

    navContainer.innerHTML = '';
    navContainer.appendChild(createButtonLink(themeFile, `← Terug naar Thema ${themeNumber ?? ''}`.trim()));

    for (const nextFile of nextCandidates) {
      const hasNextUnit = await pageExists(nextFile);
      if (hasNextUnit) {
        navContainer.appendChild(createButtonLink(nextFile, '→ Volgende unit'));
        return;
      }
    }

    const buildingMessage = document.createElement('p');
    buildingMessage.textContent = 'Deze unit is PAVO nog aan het bouwen.';
    buildingMessage.style.fontWeight = '700';
    buildingMessage.style.marginTop = '1rem';

    const buildingImage = document.createElement('img');
    buildingImage.src = 'img/pavomascotte.png';
    buildingImage.alt = 'PAVO mascotte werkt aan de volgende unit';
    buildingImage.style.maxWidth = '120px';
    buildingImage.style.display = 'block';
    buildingImage.style.margin = '0.5rem auto 0';

    navContainer.appendChild(buildingMessage);
    navContainer.appendChild(buildingImage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupUnitNavigation().catch(console.error);
    });
  } else {
    setupUnitNavigation().catch(console.error);
  }
})();
