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

    const veilig = normalizedKey.match(/veiligonderweg[_]?unit(\d+)/i);
    if (veilig) {
      return { thema: 'thema5', unit: `unit${veilig[1]}` };
    }

    const monster = normalizedKey.match(/monster[_]?unit(\d+)/i);
    if (monster) {
      return { thema: 'thema11', unit: `unit${monster[1]}` };
    }

    return { thema: null, unit: null };
  }

  window.pavoSyncScore = async function (key, score) {
    await window.firebaseReady;

    const profile = getProfile();
    if (!profile) {
      console.warn('Geen leerlingprofiel gevonden.');
      return;
    }

    const inferred = inferThemaUnit(key);

    const data = {
      naam: profile.naam,
      klas: profile.klas,
      thema: inferred.thema,
      unit: inferred.unit,
      score: Number(score) || 0,
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
