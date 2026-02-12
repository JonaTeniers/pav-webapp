(function () {

  function parseUnitContext() {
    const filename = window.location.pathname.split('/').pop() || '';

    // VERPLICHT formaat: themaXunitY.html
    const match = filename.match(/^thema(\d+)unit(\d+)\.html$/i);
    if (!match) return null;

    const themeNumber = Number(match[1]);
    const unitNumber = Number(match[2]);

    return {
      themeNumber,
      unitNumber,
      themeFile: `thema${themeNumber}.html`,
      nextUnitFile: `thema${themeNumber}unit${unitNumber + 1}.html`
    };
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
      return response.ok;
    } catch {
      return false;
    }
  }

  async function setupUnitNavigation() {
    const endScreen = document.getElementById('endScreen');
    const navContainer = endScreen?.querySelector('.nav-buttons');
    if (!navContainer) return;

    const context = parseUnitContext();
    if (!context) return;

    navContainer.innerHTML = '';

    // TERUG NAAR THEMA
    navContainer.appendChild(
      createButtonLink(
        context.themeFile,
        `← Terug naar Thema ${context.themeNumber}`
      )
    );

    // VOLGENDE UNIT (alleen als bestand bestaat)
    const hasNext = await pageExists(context.nextUnitFile);

    if (hasNext) {
      navContainer.appendChild(
        createButtonLink(context.nextUnitFile, '→ Volgende unit')
      );
    } else {
      // IN AANBOUW
      const buildingMessage = document.createElement('p');
      buildingMessage.textContent = 'Deze unit is PAVO nog aan het bouwen.';
      buildingMessage.style.fontWeight = '700';
      buildingMessage.style.marginTop = '1rem';
      buildingMessage.style.textAlign = 'center';

      const buildingImage = document.createElement('img');
      buildingImage.src = 'img/images/pavobouwmascotte.png';
      buildingImage.alt = 'PAVO mascotte werkt aan de volgende unit';
      buildingImage.style.maxWidth = '120px';
      buildingImage.style.display = 'block';
      buildingImage.style.margin = '0.5rem auto 0';

      navContainer.appendChild(buildingMessage);
      navContainer.appendChild(buildingImage);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupUnitNavigation);
  } else {
    setupUnitNavigation();
  }

})();
