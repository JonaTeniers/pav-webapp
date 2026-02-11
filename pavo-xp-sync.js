(function () {
  const PROFILE_KEY = 'pavo_leerling_profiel';

  function getProfile() {
    try {
      const raw = window.localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Kon profiel niet lezen:', error);
      return null;
    }
  }

  function inferFromPath() {
    const path = window.location.pathname || '';
    const themaUnitMatch = path.match(/thema(\d+)unit(\d+)/i);
    if (themaUnitMatch) {
      return {
        thema: `thema${themaUnitMatch[1]}`,
        unit: `unit${themaUnitMatch[2]}`
      };
    }

    const unitOnlyMatch = path.match(/unit(\d+)/i);
    if (unitOnlyMatch) {
      return {
        thema: null,
        unit: `unit${unitOnlyMatch[1]}`
      };
    }

    return { thema: null, unit: null };
  }

  function inferFromStorageKey(storageKey) {
    const key = String(storageKey || '');

    const compactMatch = key.match(/thema(\d+)unit(\d+)/i);
    if (compactMatch) {
      return {
        thema: `thema${compactMatch[1]}`,
        unit: `unit${compactMatch[2]}`
      };
    }

    const underscoredMatch = key.match(/thema(\d+)_unit(\d+)/i);
    if (underscoredMatch) {
      return {
        thema: `thema${underscoredMatch[1]}`,
        unit: `unit${underscoredMatch[2]}`
      };
    }

    return { thema: null, unit: null };
  }

  async function syncScore(storageKey, score) {
    const numericScore = Number(score);
    if (Number.isNaN(numericScore)) return;

    const profile = getProfile();
    const voornaam = String(profile?.voornaam || '').trim();
    const klas = String(profile?.klas || '').trim();
    if (!voornaam || !klas) return;

    if (!window.db || !window.firebase || !window.firebase.firestore) return;

    const dedupeKey = `pavo_synced_${storageKey}_${voornaam}_${klas}`;
    const lastSynced = Number(window.localStorage.getItem(dedupeKey));
    if (!Number.isNaN(lastSynced) && lastSynced === numericScore) return;

    const inferredFromKey = inferFromStorageKey(storageKey);
    const inferredFromPath = inferFromPath();

    const inferred = {
      thema: inferredFromKey.thema || inferredFromPath.thema,
      unit: inferredFromKey.unit || inferredFromPath.unit
    };

    const payload = {
      naam: voornaam,
      klas,
      thema: inferred.thema,
      unit: inferred.unit,
      score: numericScore,
      bronPagina: window.location.pathname,
      bronStorageKey: storageKey,
      leerlingAuthType: 'naam-klas-loginzone',
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await window.db.collection('scores').add(payload);
      window.localStorage.setItem(dedupeKey, String(numericScore));
    } catch (error) {
      console.error('Kon XP-score niet synchroniseren:', error);
    }
  }

  function renderThemeTotal() {
    const card = document.getElementById('themeTotalScore');
    if (!card) return;

    const themeId = Number(card.dataset.themeId);
    if (!themeId) return;

    let total = 0;
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i) || '';
      if (!key.startsWith(`thema${themeId}unit`) && !key.startsWith(`xp_thema${themeId}_unit`)) {
        continue;
      }
      const value = Number(window.localStorage.getItem(key));
      if (!Number.isNaN(value)) total += value;
    }

    card.textContent = `💡 ${total} XP`;
  }

  window.pavoSyncScore = syncScore;
  window.addEventListener('DOMContentLoaded', renderThemeTotal);
})();
