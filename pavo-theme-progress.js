(function () {
  function isUnitCompleted(themeId, unitNumber) {
    const keys = [
      `thema${themeId}unit${unitNumber}`,
      `xp_thema${themeId}_unit${unitNumber}`,
      `thema${themeId}_unit${unitNumber}_done`
    ];

    if (themeId === 1) {
      keys.push(`xp_unit${unitNumber}`);
      keys.push(`unit${unitNumber}_done`);
    }

    return keys.some((key) => {
      const value = window.localStorage.getItem(key);
      if (value === null) return false;
      if (value === 'true') return true;
      const numberValue = Number(value);
      return !Number.isNaN(numberValue) && numberValue > 0;
    });
  }

  function updateThemeUnits() {
    const themeContainer = document.querySelector('[data-theme-id]') || document.querySelector('main');
    if (!themeContainer) return;

    const themeId = Number(themeContainer.dataset.themeId || document.getElementById('themeTotalScore')?.dataset?.themeId);
    if (!themeId) return;

    const unitCards = [...document.querySelectorAll('.unit-card')]
      .filter((card) => card.querySelector('button'));

    unitCards.forEach((card, index) => {
      if (!card.dataset.unit) card.dataset.unit = String(index + 1);
    });

    unitCards.sort((a, b) => Number(a.dataset.unit) - Number(b.dataset.unit));

    unitCards.forEach((card) => {
      const unitNumber = Number(card.dataset.unit);
      const statusEl = card.querySelector('.status');
      const buttonEl = card.querySelector('button');
      const isDevelopment = card.dataset.development === 'true';

      if (!unitNumber || !statusEl || !buttonEl) return;

      if (isDevelopment) {
        statusEl.textContent = '🆕 In ontwikkeling';
        statusEl.className = 'status locked';
        buttonEl.disabled = true;
        return;
      }

      const unlocked = unitNumber === 1 || isUnitCompleted(themeId, unitNumber - 1);
      if (unlocked) {
        statusEl.textContent = isUnitCompleted(themeId, unitNumber) ? '✅ Gespeeld' : 'Beschikbaar';
        statusEl.className = 'status ready';
        buttonEl.disabled = false;
        const linkEl = card.querySelector('a');
        if (linkEl && linkEl.dataset.lockedHref) {
          linkEl.href = linkEl.dataset.lockedHref;
          delete linkEl.dataset.lockedHref;
        }
      } else {
        statusEl.textContent = '🔒 Vergrendeld';
        statusEl.className = 'status locked';
        buttonEl.disabled = true;
        const linkEl = card.querySelector('a[href]');
        if (linkEl && !linkEl.dataset.lockedHref) {
          linkEl.dataset.lockedHref = linkEl.getAttribute('href') || '';
          linkEl.removeAttribute('href');
        }
      }
    });
  }

  window.addEventListener('DOMContentLoaded', updateThemeUnits);
})();
