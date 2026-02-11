/**
 * leerling-dashboard.js
 *
 * Doel:
 * - Leerling logt in met voornaam + klas (zonder Firebase auth)
 * - Haalt resultaten uit Firestore collectie `scores`
 * - Toont thema, unit, score en datum
 */

(function () {
  const STORAGE_KEY = 'pavo_leerling_profiel';

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

  function renderRows(items) {
    const tbody = document.getElementById('studentScoresTableBody');
    if (!tbody) return;

    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="4">Geen resultaten gevonden voor deze leerling.</td></tr>';
      return;
    }

    tbody.innerHTML = items.map((item) => `
      <tr>
        <td>${escapeHtml(item.thema || '-')}</td>
        <td>${escapeHtml(item.unit || '-')}</td>
        <td>${escapeHtml(item.score ?? '-')}</td>
        <td>${escapeHtml(formatDate(item.createdAt))}</td>
      </tr>
    `).join('');
  }

  function deriveThemaUnit(item) {
    const bron = String(item.bronPagina || '');
    const themaMatch = bron.match(/thema\d+/i);
    const unitMatch = bron.match(/unit\d+/i);

    return {
      ...item,
      thema: item.thema || (themaMatch ? themaMatch[0] : '-'),
      unit: item.unit || (unitMatch ? unitMatch[0] : '-')
    };
  }

  async function loadStudentScores(profile) {
    setStatus('Resultaten laden...', false);

    // Query op voornaam + klas zodat leerling enkel eigen resultaten ziet.
    const snapshot = await window.db
      .collection('scores')
      .where('naam', '==', profile.voornaam)
      .where('klas', '==', profile.klas)
      .get();

    const items = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .map(deriveThemaUnit)
      .sort((a, b) => {
        const aDate = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
        const bDate = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
        return bDate - aDate;
      });

    renderRows(items);
    setStatus(`${items.length} resultaat/resultaten geladen.`, false);
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
