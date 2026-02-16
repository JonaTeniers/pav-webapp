/**
 * leerling-dashboard.js
 *
 * Doel:
 * - Leerling logt in met voornaam + klas (zonder Firebase auth)
 * - Toont per thema of het al gespeeld is
 * - Als thema gespeeld is: toon unit 1 t.e.m. laatste unit met score/status
 * - Als thema nog niet gespeeld is: toon "Nog niet gespeeld (Start spelen)"
 */

(function () {
  const STORAGE_KEY = 'pavo_leerling_profiel';

  // Thema-overzicht op basis van huidige webapp-structuur.
  const THEMAS = [
    { id: 1, naam: 'Thema 1', maxUnit: 12, startLink: 'hoofdthema1.html' },
    { id: 2, naam: 'Thema 2', maxUnit: 2, startLink: 'hoofdthema2.html' },
    { id: 3, naam: 'Thema 3', maxUnit: 3, startLink: 'oefenthema1.html' },
    { id: 4, naam: 'Thema 4', maxUnit: 10, startLink: 'oefenthema2.html' },
    { id: 5, naam: 'Thema 5', maxUnit: 3, startLink: 'oefenthema3.html' },
    { id: 6, naam: 'Thema 6', maxUnit: 3, startLink: 'oefenthema4.html' },
    { id: 7, naam: 'Thema 7', maxUnit: 3, startLink: 'oefenthema5.html' },
    { id: 8, naam: 'Thema 8', maxUnit: 3, startLink: 'oefenthema6.html' },
    { id: 9, naam: 'Thema 9', maxUnit: 8, startLink: 'hoofdthema3.html' }
  ];

  function setStatus(text, isError) {
    const el = document.getElementById('status');
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? '#b00020' : '#166534';
  }

  function escapeHtml(value) {
    return String(value ?? '-')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function formatDate(timestampValue) {
    if (!timestampValue) return '-';
    const date = typeof timestampValue.toDate === 'function' ? timestampValue.toDate() : new Date(timestampValue);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('nl-BE', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  }

  function getStoredProfile() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Kon profiel niet lezen:', error);
      return null;
    }
  }

  function saveProfile(profile) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  function extractNumbers(item) {
    const bron = String(item.bronPagina || '');
    const bronStorageKey = String(item.bronStorageKey || '');
    const themaText = String(item.thema || '');
    const unitText = String(item.unit || '');

    const themaMatch = themaText.match(/thema\s*(\d+)/i)
      || bron.match(/thema(\d+)/i)
      || bronStorageKey.match(/thema(\d+)/i);
    const unitMatch = unitText.match(/unit\s*(\d+)/i)
      || bron.match(/unit(\d+)/i)
      || bronStorageKey.match(/unit(\d+)/i);

    return {
      themaNummer: themaMatch ? Number(themaMatch[1]) : null,
      unitNummer: unitMatch ? Number(unitMatch[1]) : null
    };
  }

  function timestampToMs(ts) {
    if (!ts) return 0;
    if (typeof ts.toDate === 'function') return ts.toDate().getTime();
    const date = new Date(ts);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }

  // Bouw rijen: per thema tonen wat gespeeld is, met unit-detail.
  function buildRows(items) {
    const rows = [];

    THEMAS.forEach((thema) => {
      const itemsForTheme = items
        .filter((item) => item.themaNummer === thema.id)
        .sort((a, b) => timestampToMs(b.createdAt) - timestampToMs(a.createdAt));

      // Thema nog nooit gespeeld.
      if (!itemsForTheme.length) {
        rows.push({
          thema: thema.naam,
          unit: '-',
          score: '-',
          wanneer: '-',
          status: `Nog niet gespeeld (<a href="${thema.startLink}">Start spelen</a>)`
        });
        return;
      }

      // Thema zonder unit-structuur (Thema 1).
      if (thema.maxUnit === 0) {
        const latest = itemsForTheme[0];
        rows.push({
          thema: thema.naam,
          unit: '-',
          score: latest.score ?? '-',
          wanneer: formatDate(latest.createdAt),
          status: 'Gespeeld'
        });
        return;
      }

      // Thema met units: toon unit 1 t.e.m. laatste unit.
      for (let unit = 1; unit <= thema.maxUnit; unit += 1) {
        const itemsForUnit = itemsForTheme
          .filter((item) => item.unitNummer === unit)
          .sort((a, b) => timestampToMs(b.createdAt) - timestampToMs(a.createdAt));

        if (!itemsForUnit.length) {
          rows.push({
            thema: thema.naam,
            unit: `Unit ${unit}`,
            score: '-',
            wanneer: '-',
            status: `Nog niet gespeeld (<a href="thema${thema.id}unit${unit}.html">Start spelen</a>)`
          });
          continue;
        }

        const latest = itemsForUnit[0];
        rows.push({
          thema: thema.naam,
          unit: `Unit ${unit}`,
          score: latest.score ?? '-',
          wanneer: formatDate(latest.createdAt),
          status: 'Gespeeld'
        });
      }
    });

    return rows;
  }


  function renderTotalScore(items) {
    const totalEl = document.getElementById('studentTotalScore');
    if (!totalEl) return;

    const total = items.reduce((sum, item) => {
      const value = Number(item.score);
      return sum + (Number.isNaN(value) ? 0 : value);
    }, 0);

    totalEl.innerHTML = `<strong>Totaalscore:</strong> ${total} XP`;
  }

  function renderRows(items) {
    const tbody = document.getElementById('studentScoresTableBody');
    if (!tbody) return;

    const rows = buildRows(items);

    tbody.innerHTML = rows.map((row) => `
      <tr>
        <td>${escapeHtml(row.thema)}</td>
        <td>${escapeHtml(row.unit)}</td>
        <td>${escapeHtml(row.score)}</td>
        <td>${escapeHtml(row.wanneer)}</td>
        <td>${row.status}</td>
      </tr>
    `).join('');
  }

  async function loadStudentScores(profile) {
    setStatus('Resultaten laden...', false);

    const snapshot = await window.db
      .collection('scores')
      .where('naam', '==', profile.voornaam)
      .where('klas', '==', profile.klas)
      .get();

    const items = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .map((item) => ({ ...item, ...extractNumbers(item) }));

    renderRows(items);
    renderTotalScore(items);
    setStatus(`${items.length} opgeslagen resultaat/resultaten gevonden.`, false);
  }

  function showActiveProfile(profile) {
    const el = document.getElementById('activeProfile');
    if (!el) return;
    if (!profile) {
      el.textContent = '';
      return;
    }

    el.textContent = `Ingelogd als ${profile.voornaam} (${profile.klas})`;
  }

  async function handleLogin(event) {
    event.preventDefault();

    const voornaam = document.getElementById('viewVoornaam')?.value?.trim();
    const klas = document.getElementById('viewKlas')?.value?.trim();

    if (!voornaam || !klas) {
      setStatus('Vul voornaam en klas in.', true);
      return;
    }

    const profile = { voornaam, klas, loggedInAt: new Date().toISOString() };
    saveProfile(profile);
    showActiveProfile(profile);

    try {
      await loadStudentScores(profile);
    } catch (error) {
      console.error('Fout bij laden leerlingresultaten:', error);
      setStatus('Kon resultaten niet laden.', true);
    }
  }

  async function init() {
    try {
      await window.firebaseReady;

      const form = document.getElementById('studentViewLoginForm');
      if (form) form.addEventListener('submit', handleLogin);

      const stored = getStoredProfile();
      showActiveProfile(stored);

      if (stored) {
        document.getElementById('viewVoornaam').value = stored.voornaam || '';
        document.getElementById('viewKlas').value = stored.klas || '';
        await loadStudentScores(stored);
      }
    } catch (error) {
      console.error('Init-fout leerling-dashboard:', error);
      setStatus('Kon dashboard niet opstarten.', true);
    }
  }

  init();
})();
