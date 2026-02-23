(function () {
  const PROFILE_KEY = 'pavo_leerling_profiel';

  const CARD_CONFIG = {
    hoofdthema1: { key: 'thema1', totalGoals: 5 },
    hoofdthema2: { key: 'thema2', totalGoals: 2 },
    hoofdthema3: { key: 'thema9', totalGoals: 8 },
    hoofdthema4: { key: 'thema11', totalGoals: 2 },
    hoofdthema5: { key: 'thema5', totalGoals: 7 },
    hoofdthema6: { key: 'thema12', totalGoals: 1 }
  };

  function getProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (error) {
      console.error('Kon profiel niet lezen:', error);
    }

    const legacyName = localStorage.getItem('studentName');
    const legacyClass = localStorage.getItem('studentClass');
    if (legacyName && legacyClass) {
      return { voornaam: legacyName, klas: legacyClass };
    }

    return null;
  }

  function parseUnitNumber(item) {
    const unitMatch = String(item.unit || '').match(/unit\s*(\d+)/i)
      || String(item.bronPagina || '').match(/unit[_]?(\d+)/i)
      || String(item.bronStorageKey || '').match(/unit[_]?(\d+)/i);

    return unitMatch ? Number(unitMatch[1]) : null;
  }

  function parseThemeKey(item) {
    const raw = String(item.thema || '').toLowerCase().trim();
    if (raw) {
      const normalized = raw.replace(/\s+/g, '');
      const directMatch = normalized.match(/thema\d+/i);
      if (directMatch) return directMatch[0].toLowerCase();
    }

    const fromPage = String(item.bronPagina || '').match(/thema(\d+)/i)
      || String(item.bronStorageKey || '').match(/thema(\d+)/i);

    if (fromPage) return `thema${fromPage[1]}`;

    if (/veiligonderweg/i.test(String(item.bronPagina || '')) || /veiligonderweg/i.test(String(item.bronStorageKey || ''))) {
      return 'thema5';
    }

    if (/monsterunit/i.test(String(item.bronPagina || '')) || /monsterunit/i.test(String(item.bronStorageKey || ''))) {
      return 'thema11';
    }

    return null;
  }

  function updateCardProgress(cardId, percent, played, totalGoals) {
    const card = document.querySelector(`a.thema-card[href="${cardId}.html"]`);
    if (!card) return;

    const fill = card.querySelector('.progress-fill');
    const text = card.querySelector('.progress-text');
    if (fill) fill.style.width = `${percent}%`;
    if (text) text.textContent = `${percent}% voltooid (${played}/${totalGoals} doelen)`;
  }

  async function loadProgressFromScores(profile) {
    await window.firebaseReady;

    const snapshot = await window.db
      .collection('scores')
      .where('naam', '==', profile.voornaam)
      .where('klas', '==', profile.klas)
      .get();

    const grouped = new Map();

    snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .forEach((item) => {
        const themeKey = parseThemeKey(item);
        const unitNumber = parseUnitNumber(item);
        if (!themeKey || !unitNumber) return;

        if (!grouped.has(themeKey)) grouped.set(themeKey, new Set());
        grouped.get(themeKey).add(unitNumber);
      });

    Object.entries(CARD_CONFIG).forEach(([cardId, config]) => {
      const played = grouped.get(config.key)?.size || 0;
      const percent = Math.min(100, Math.round((played / config.totalGoals) * 100));
      updateCardProgress(cardId, percent, played, config.totalGoals);
    });
  }

  async function init() {
    const profile = getProfile();
    if (!profile?.voornaam || !profile?.klas || !window.db || !window.firebaseReady) return;

    try {
      await loadProgressFromScores(profile);
    } catch (error) {
      console.error('Kon voortgang niet laden:', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
