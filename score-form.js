(function () {

  const PROFILE_KEY = 'pavo_leerling_profiel';

  function setStatus(text, isError) {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.style.color = isError ? 'red' : 'green';
  }

  function getProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function inferThemaUnit() {
    const page = window.location.pathname.toLowerCase();
    const thema = page.match(/thema\d+/);
    const unit = page.match(/unit\d+/);

    return {
      thema: thema ? thema[0] : null,
      unit: unit ? unit[0] : null
    };
  }

  async function handleScoreSubmit(e) {
    e.preventDefault();

    if (!window.db) {
      setStatus("Firebase niet geladen.", true);
      return;
    }

    const profile = getProfile();
    if (!profile?.voornaam || !profile?.klas) {
      setStatus("Log eerst in via de startpagina.", true);
      return;
    }

    const scoreValue = Number(document.getElementById('score')?.value);
    if (Number.isNaN(scoreValue)) {
      setStatus("Ongeldige score.", true);
      return;
    }

    const inferred = inferThemaUnit();

    const data = {
      naam: profile.voornaam,
      klas: profile.klas,
      thema: inferred.thema,
      unit: inferred.unit,
      score: scoreValue,
      bronPagina: window.location.pathname,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await window.db.collection('scores').add(data);
      setStatus("Score opgeslagen ✔", false);
      e.target.reset();
    } catch (err) {
      console.error(err);
      setStatus("Opslaan mislukt.", true);
    }
  }

  async function init() {
    await window.firebaseReady;

    const form = document.getElementById('scoreForm');
    if (!form) return;

    form.addEventListener('submit', handleScoreSubmit);

    const profile = getProfile();
    if (profile) {
      setStatus(`Ingelogd als ${profile.voornaam} (${profile.klas})`, false);
    } else {
      setStatus("Niet ingelogd.", true);
    }
  }

  init();

})();
