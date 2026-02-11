/**
 * score-form.js
 *
 * Doel:
 * - Leerling moet eerst "inloggen" via voornaam + klas (localStorage profiel)
 * - Gegevens opslaan in Firestore collectie `scores`
 * - Thema/unit + timestamp meegeven zodat leerling en leerkracht opvolging hebben
 */

(function () {
  const PROFILE_KEY = 'pavo_leerling_profiel';

  function setStatus(tekst, isError) {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;

    statusEl.textContent = tekst;
    statusEl.style.color = isError ? '#b00020' : '#006400';
  }

  function getStudentProfile() {
    try {
      const raw = window.localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Kon leerlingprofiel niet lezen:', error);
      return null;
    }
  }

  function getSessionId() {
    const storageKey = 'pavo_leerling_sessie_id';
    const existing = window.localStorage.getItem(storageKey);
    if (existing) return existing;

    const newId = `sessie_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem(storageKey, newId);
    return newId;
  }

  function inferThemaUnitFromPage() {
    const page = window.location.pathname;
    const themaMatch = page.match(/thema\d+/i);
    const unitMatch = page.match(/unit\d+/i);

    return {
      thema: themaMatch ? themaMatch[0] : null,
      unit: unitMatch ? unitMatch[0] : null
    };
  }

  async function handleScoreSubmit(event) {
    event.preventDefault();

    // Eerst controleren of leerlingprofiel bestaat (verplicht voor starten/opslaan).
    const profile = getStudentProfile();
    if (!profile?.voornaam || !profile?.klas) {
      setStatus('Log eerst in op de startpagina met voornaam + klas.', true);
      return;
    }

    // Optionele velden uit pagina lezen indien aanwezig.
    const themaValue = document.getElementById('thema')?.value?.trim();
    const unitValue = document.getElementById('unit')?.value?.trim();
    const scoreRaw = document.getElementById('score')?.value;
    const scoreNumber = Number(scoreRaw);

    const inferred = inferThemaUnitFromPage();

    const scoreData = {
      naam: profile.voornaam,
      klas: profile.klas,
      thema: themaValue || inferred.thema || null,
      unit: unitValue || inferred.unit || null,
      ...(scoreRaw !== undefined && scoreRaw !== '' && !Number.isNaN(scoreNumber) ? { score: scoreNumber } : {}),
      bronPagina: window.location.pathname,
      sessieId: getSessionId(),
      leerlingAuthType: 'naam-klas-loginzone',
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await window.db.collection('scores').add(scoreData);
      setStatus('Resultaat opgeslagen.', false);
      event.target.reset();
    } catch (error) {
      console.error('Opslaan fout:', error);
      setStatus('Opslaan mislukt. Probeer opnieuw.', true);
    }
  }

  async function initScoreForm() {
    try {
      await window.firebaseReady;

      const scoreForm = document.getElementById('scoreForm');
      if (!scoreForm) {
        console.warn('#scoreForm niet gevonden.');
        return;
      }

      scoreForm.addEventListener('submit', handleScoreSubmit);

      const profile = getStudentProfile();
      if (!profile?.voornaam || !profile?.klas) {
        setStatus('Niet ingelogd. Ga eerst naar de startpagina en log in met voornaam + klas.', true);
      } else {
        setStatus(`Ingelogd als ${profile.voornaam} (${profile.klas}).`, false);
      }
    } catch (error) {
      console.error('Init fout score-form:', error);
      setStatus('Kon score-module niet initialiseren.', true);
    }
  }

  initScoreForm();
})();
