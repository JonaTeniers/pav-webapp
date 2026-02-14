/**
 * score-form.js
 *
 * Doel:
 * - Leerling moet eerst "inloggen" via voornaam + klas (startpagina)
 * - Score + metadata opslaan in Firestore collectie `scores`
 * - Thema, unit en timestamp correct registreren
 */

(function () {

  /* ===============================
     STATUS MELDING
  =============================== */
  function setStatus(tekst, isError = false) {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;

    statusEl.textContent = tekst;
    statusEl.style.color = isError ? '#b00020' : '#166534';
  }

  /* ===============================
     LEERLING PROFIEL (UNIFORM)
     -> zelfde als index.html
  =============================== */
  function getStudentProfile() {
    const voornaam = localStorage.getItem("studentName");
    const klas = localStorage.getItem("studentClass");

    if (!voornaam || !klas) return null;
    return { voornaam, klas };
  }

  /* ===============================
     UNIEKE SESSIE-ID
  =============================== */
  function getSessionId() {
    const key = 'pavo_leerling_sessie_id';
    let id = localStorage.getItem(key);

    if (!id) {
      id = `sessie_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(key, id);
    }
    return id;
  }

  /* ===============================
     THEMA & UNIT AUTOMATISCH
     (uit URL)
  =============================== */
  function inferThemaUnitFromPage() {
    const path = window.location.pathname.toLowerCase();

    const themaMatch = path.match(/thema\d+/);
    const unitMatch = path.match(/unit\d+/);

    return {
      thema: themaMatch ? themaMatch[0] : null,
      unit: unitMatch ? unitMatch[0] : null
    };
  }

  /* ===============================
     SCORE OPSLAAN
  =============================== */
async function handleScoreSubmit(event) {
  event.preventDefault();

  const profile = getStudentProfile();
  if (!profile) {
    setStatus('Niet ingelogd. Ga eerst naar de startpagina.', true);
    return;
  }

  const scoreInput = document.getElementById('score');
  const scoreValue = scoreInput ? Number(scoreInput.value) : null;

  if (scoreInput && Number.isNaN(scoreValue)) {
    setStatus('Score is geen geldig getal.', true);
    return;
  }

  const inferred = inferThemaUnitFromPage();

  try {
    await window.db.collection('scores').add({
      naam: profile.voornaam,
      klas: profile.klas,
      thema: inferred.thema,
      unit: inferred.unit,
      score: scoreValue ?? null,
      bronPagina: window.location.pathname,
      sessieId: getSessionId(),
      leerlingAuthType: 'naam-klas',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    setStatus('✅ Resultaat succesvol opgeslagen.', false);
    event.target.reset();

  } catch (error) {
    console.error('FIRESTORE ERROR:', error);
    setStatus('❌ Opslaan mislukt. Kijk in console (F12).', true);
  }
}


  /* ===============================
     INITIALISATIE
  =============================== */
  async function initScoreForm() {
    try {
      await window.firebaseReady;

      const form = document.getElementById('scoreForm');
      if (!form) {
        console.warn('scoreForm niet gevonden op deze pagina.');
        return;
      }

      form.addEventListener('submit', handleScoreSubmit);

      const profile = getStudentProfile();
      if (profile) {
        setStatus(`Ingelogd als ${profile.voornaam} (${profile.klas}).`, false);
      } else {
        setStatus(
          'Niet ingelogd. Ga eerst naar de startpagina.',
          true
        );
      }
    } catch (error) {
      console.error('Initialisatie fout:', error);
      setStatus('Score-module kon niet worden gestart.', true);
    }
  }

  initScoreForm();

})();
