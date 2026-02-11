/**
 * teacher-dashboard.js
 *
 * Doel:
 * - Haalt alle score-documenten op uit Firestore collectie `scores`
 * - Toont de resultaten in een tabel
 * - Laat filteren op klas
 *
 * Vereist:
 * - firebase.js moet eerst geladen zijn (levert window.firebaseReady + window.db + window.auth)
 */

(function () {
  // Houd alle ingeladen score-documenten lokaal bij voor snel filteren zonder extra Firestore-calls.
  let allScores = [];

  /**
   * Toon een statusbericht op de pagina.
   */
  function setStatus(message, isError) {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.style.color = isError ? '#b00020' : '#166534';
  }

  /**
   * Zet een Firestore Timestamp (of datumwaarde) om naar leesbare lokale datum/tijd.
   */
  function formatDate(timestampValue) {
    if (!timestampValue) return '-';

    // Firestore Timestamp heeft meestal een toDate()-functie.
    const date = typeof timestampValue.toDate === 'function'
      ? timestampValue.toDate()
      : new Date(timestampValue);

    if (Number.isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('nl-BE', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date);
  }

  /**
   * Teken de tabelrijen op basis van data en geselecteerde klas-filter.
   */
  function renderTable(selectedKlas) {
    const tbody = document.getElementById('scoresTableBody');
    if (!tbody) return;

    // Filter op klas als er een specifieke klas gekozen werd.
    const filtered = selectedKlas
      ? allScores.filter((item) => item.klas === selectedKlas)
      : allScores;

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="5">Geen resultaten gevonden.</td></tr>';
      return;
    }

    tbody.innerHTML = filtered.map((item) => {
      return `
        <tr>
          <td>${item.naam || '-'}</td>
          <td>${item.klas || '-'}</td>
          <td>${item.thema || '-'}</td>
          <td>${item.score ?? '-'}</td>
          <td>${formatDate(item.createdAt)}</td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Vul de klas-filter met unieke klassen die in de data voorkomen.
   */
  function populateClassFilter() {
    const klasFilter = document.getElementById('klasFilter');
    if (!klasFilter) return;

    // Haal unieke klaswaarden op en sorteer alfabetisch.
    const uniqueClasses = [...new Set(allScores.map((item) => item.klas).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'nl-BE'));

    klasFilter.innerHTML = '<option value="">Alle klassen</option>';

    uniqueClasses.forEach((klas) => {
      const option = document.createElement('option');
      option.value = klas;
      option.textContent = klas;
      klasFilter.appendChild(option);
    });
  }

  /**
   * Lees alle score-documenten uit Firestore collectie `scores`.
   */
  async function loadScores() {
    setStatus('Scores worden geladen...', false);

    // Sorteer op recentste score eerst. Dit werkt goed zodra createdAt overal aanwezig is.
    const snapshot = await window.db
      .collection('scores')
      .orderBy('createdAt', 'desc')
      .get();

    allScores = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    populateClassFilter();
    renderTable('');
    setStatus(`Klaar. ${allScores.length} score(s) geladen.`, false);
  }

  /**
   * Start de dashboardlogica nadat Firebase klaar is.
   */
  async function initDashboard() {
    try {
      // Wacht tot firebase.js de SDK en verbindingen klaar heeft gezet.
      await window.firebaseReady;

      const klasFilter = document.getElementById('klasFilter');
      const refreshButton = document.getElementById('refreshButton');

      // Re-render wanneer de leerkracht een klas kiest in de filter.
      if (klasFilter) {
        klasFilter.addEventListener('change', (event) => {
          renderTable(event.target.value);
        });
      }

      // Laat manueel herladen toe.
      if (refreshButton) {
        refreshButton.addEventListener('click', loadScores);
      }

      // Controleer of er iemand is ingelogd (leerkracht-flow).
      window.auth.onAuthStateChanged(async (user) => {
        if (!user) {
          setStatus('Je bent niet ingelogd. Log in als leerkracht om scores te bekijken.', true);
          return;
        }

        // Hier kan je later rollencheck toevoegen (bv. via custom claims) voor echte leerkrachtbeveiliging.
        await loadScores();
      });
    } catch (error) {
      console.error('Fout bij dashboard-initialisatie:', error);
      setStatus('Dashboard kon niet worden opgestart.', true);
    }
  }

  initDashboard();
})();
