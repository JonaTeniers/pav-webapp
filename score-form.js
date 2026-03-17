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



  function inferThemaUnitFromPath() {
    const page = window.location.pathname.toLowerCase();
    const thema = page.match(/thema\d+/);
    const unit = page.match(/unit\d+/);
    return {
      thema: thema ? thema[0] : null,
      unit: unit ? unit[0] : null
    };
  }


  function saveScoreLocal(payload) {
    let all = [];
    try {
      all = JSON.parse(localStorage.getItem('pavo_scores_local') || '[]');
    } catch {
      all = [];
    }
    all.unshift(payload);
    localStorage.setItem('pavo_scores_local', JSON.stringify(all.slice(0, 500)));
  }

  function saveReflectionLocal(payload) {
    let all = [];
    try {
      all = JSON.parse(localStorage.getItem('pavo_score_reflections') || '[]');
    } catch {
      all = [];
    }
    all.unshift(payload);
    localStorage.setItem('pavo_score_reflections', JSON.stringify(all));
  }

  async function saveReflectionBoth(payload) {
    saveReflectionLocal(payload);
    if (!window.db) return;
    try {
      await window.db.collection('score_reflections').add({
        ...payload,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.warn('Opslaan reflectie in Firestore mislukt; lokaal bewaard.', error);
    }
  }

  function renderPostScoreReflection(scoreValue) {
    if (document.getElementById('postScoreReflectionForm')) return;

    const formHost = document.getElementById('scoreForm');
    const host = (formHost && formHost.parentElement) || document.body;
    const box = document.createElement('section');
    box.style.marginTop = '12px';
    box.innerHTML = `
      <h3>Reflectievragen na opdracht</h3>
      <form id="postScoreReflectionForm" style="display:grid;gap:8px;">
        <label>Wat heb je geleerd?<textarea id="postReflect1" required></textarea></label>
        <label>Wat vond je moeilijk?<textarea id="postReflect2" required></textarea></label>
        <label>Wat zou je volgende keer anders doen?<textarea id="postReflect3" required></textarea></label>
        <button type="submit">Reflectie opslaan</button>
      </form>
      <p id="postReflectStatus"></p>
    `;
    host.appendChild(box);

    const postForm = document.getElementById('postScoreReflectionForm');
    if (!postForm) return;

    postForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const profile = getProfile();
      if (!profile || !profile.voornaam || !profile.klas) return;
      const inferred = inferThemaUnitFromPath();
      const payload = {
        naam: profile.voornaam,
        klas: profile.klas,
        thema: inferred.thema,
        unit: inferred.unit,
        score: scoreValue,
        bronPagina: window.location.pathname,
        antwoord1: ((document.getElementById('postReflect1') || {}).value || '').trim(),
        antwoord2: ((document.getElementById('postReflect2') || {}).value || '').trim(),
        antwoord3: ((document.getElementById('postReflect3') || {}).value || '' ).trim()
      };
      if (!payload.antwoord1 || !payload.antwoord2 || !payload.antwoord3) return;
      await saveReflectionBoth(payload);
      const status = document.getElementById('postReflectStatus');
      if (status) status.textContent = '✅ Reflectie opgeslagen voor leerkracht.';
      event.target.reset();
    });
  }

  async function handleScoreSubmit(e) {
    e.preventDefault();

    const profile = getProfile();
    if (!profile || !profile.voornaam || !profile.klas) {
      setStatus("Log eerst in via de startpagina.", true);
      return;
    }

    const scoreInput = document.getElementById('score');
    const scoreValue = Number(scoreInput ? scoreInput.value : NaN);
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

    saveScoreLocal({
      ...data,
      createdAt: new Date().toISOString()
    });

    try {
      if (window.db) {
        await window.db.collection('scores').add(data);
        setStatus("Score opgeslagen ✔", false);
      } else {
        setStatus("Offline opgeslagen op dit toestel.", true);
      }
      e.target.reset();
      renderPostScoreReflection(scoreValue);
    } catch (err) {
      console.error(err);
      setStatus("Online opslaan mislukt, lokaal bewaard.", true);
      e.target.reset();
      renderPostScoreReflection(scoreValue);
    }
  }

  async function init() {
    try {
      await window.firebaseReady;
    } catch (error) {
      console.warn('Firebase niet beschikbaar in score-form, lokale opslag blijft werken.', error);
    }

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
