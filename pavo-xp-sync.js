(function () {
  const PROFILE_KEY = 'pavo_leerling_profiel';

  function getProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (parsed?.voornaam && parsed?.klas) {
        return { naam: parsed.voornaam, klas: parsed.klas };
      }
    } catch (error) {
      console.error('Kon profiel niet lezen:', error);
    }

    const legacyName = localStorage.getItem('studentName');
    const legacyClass = localStorage.getItem('studentClass');
    if (legacyName && legacyClass) {
      return { naam: legacyName, klas: legacyClass };
    }

    return null;
  }

  function inferThemaUnit(key) {
    const normalizedKey = String(key || '').toLowerCase();

    const themed = normalizedKey.match(/thema(\d+)[_]?unit(\d+)/i);
    if (themed) {
      return {
        thema: `thema${themed[1]}`,
        unit: `unit${themed[2]}`
      };
    }

    const landschappen = normalizedKey.match(/(?:xp_)?landschappen[_]?unit(\d+)/i);
    if (landschappen) {
      return { thema: 'thema1', unit: `unit${landschappen[1]}` };
    }

    const veilig = normalizedKey.match(/veiligonderweg[_]?unit(\d+)/i);
    if (veilig) {
      return { thema: 'thema5', unit: `unit${veilig[1]}` };
    }

    const monster = normalizedKey.match(/monster[_]?unit(\d+)/i);
    if (monster) {
      return { thema: 'thema11', unit: `unit${monster[1]}` };
    }

    const mechanica = normalizedKey.match(/mechanica(\d+)doel(\d+)/i);
    if (mechanica) {
      return { thema: `thema${mechanica[1]}`, unit: `unit${mechanica[2]}` };
    }

    return { thema: null, unit: null };
  }

  function parseScoreValue(rawScore) {
    const scoreValue = Number(rawScore);
    if (!Number.isFinite(scoreValue)) return null;
    return scoreValue;
  }

  window.pavoSyncScore = async function (key, score) {
    await window.firebaseReady;

    const profile = getProfile();
    if (!profile) {
      console.warn('Geen leerlingprofiel gevonden. Firestore score wordt overgeslagen.');
      return;
    }

    const scoreValue = parseScoreValue(score);
    if (scoreValue === null) {
      console.info('Niet-numerieke score gedetecteerd, niet opgeslagen in scores:', key);
      return;
    }

    const inferred = inferThemaUnit(key);

    const data = {
      naam: profile.naam,
      klas: profile.klas,
      thema: inferred.thema,
      unit: inferred.unit,
      score: scoreValue,
      bronPagina: window.location.pathname,
      bronStorageKey: key,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await window.db.collection('scores').add(data);
      console.log('Score opgeslagen in Firestore:', data);
    } catch (err) {
      console.error('Firestore write error:', err);
    }
  };
})();
