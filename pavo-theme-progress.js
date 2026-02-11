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
    const themeContainer = document.querySelector('[data-theme-id]');
    if (!themeContainer) return;

    const themeId = Number(themeContainer.dataset.themeId);
    if (!themeId) return;

    const unitCards = [...document.querySelectorAll('.unit-card[data-unit]')]
      .sort((a, b) => Number(a.dataset.unit) - Number(b.dataset.unit));

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
      } else {
        statusEl.textContent = '🔒 Vergrendeld';
        statusEl.className = 'status locked';
        buttonEl.disabled = true;
      }
    });
  }

  window.addEventListener('DOMContentLoaded', updateThemeUnits);
})();
