/**
 * teacher-dashboard.js
 *
 * Doel:
 * - Laat enkel leerkrachten inloggen op het dashboard
 * - Haalt alle score-documenten op uit Firestore collectie `scores`
 * - Toont de resultaten in een tabel
 * - Laat filteren op klas
 *
 * Vereist:
 * - firebase.js moet eerst geladen zijn (levert window.firebaseReady + window.db + window.auth)
 * - window.TEACHER_EMAILS bevat de toegelaten leerkracht-mailadressen
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
   * Escape HTML-tekens zodat tabelinhoud veilig weergegeven wordt.
   */
  function escapeHtml(value) {
    return String(value ?? '-')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
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


  function extractThemaUnit(source) {
    const text = String(source || '');
    const match = text.match(/thema\s*(\d+)\s*[_-]?\s*unit\s*(\d+)/i)
      || text.match(/thema(\d+)unit(\d+)/i)
      || text.match(/thema(\d+)_unit(\d+)/i)
      || text.match(/thema(\d+).*unit(\d+)/i);

    if (!match) return { thema: null, unit: null };
    return { thema: `thema${match[1]}`, unit: `unit${match[2]}` };
  }

  function normalizeScoreItem(item) {
    const inferredFromStorage = extractThemaUnit(item.bronStorageKey);
    const inferredFromPage = extractThemaUnit(item.bronPagina);

    return {
      ...item,
      thema: item.thema || inferredFromStorage.thema || inferredFromPage.thema,
      unit: item.unit || inferredFromStorage.unit || inferredFromPage.unit
    };
  }

  async function backfillMissingThemaUnit() {
    setStatus('Ontbrekende thema/unit-velden bijwerken...', false);

    const candidates = allScores.filter((item) => {
      const hasThema = String(item.thema || '').trim();
      const hasUnit = String(item.unit || '').trim();
      if (hasThema && hasUnit) return false;

      const inferredFromStorage = extractThemaUnit(item.bronStorageKey);
      const inferredFromPage = extractThemaUnit(item.bronPagina);
      return Boolean(inferredFromStorage.thema || inferredFromPage.thema);
    });

    if (!candidates.length) {
      setStatus('Geen ontbrekende thema/unit-velden gevonden.', false);
      return;
    }

    let updated = 0;
    for (const item of candidates) {
      const inferredFromStorage = extractThemaUnit(item.bronStorageKey);
      const inferredFromPage = extractThemaUnit(item.bronPagina);

      const thema = item.thema || inferredFromStorage.thema || inferredFromPage.thema;
      const unit = item.unit || inferredFromStorage.unit || inferredFromPage.unit;

      if (!thema && !unit) continue;

      await window.db.collection('scores').doc(item.id).set({
        ...(thema ? { thema } : {}),
        ...(unit ? { unit } : {})
      }, { merge: true });
      updated += 1;
    }

    setStatus(`${updated} score(s) bijgewerkt met thema/unit.`, false);
    await loadScores();
  }

  /**
   * Zet dashboard zichtbaar en loginblok verborgen.
   */
  function showDashboard() {
    const dashboardPanel = document.getElementById('dashboardPanel');
    const authCard = document.getElementById('authCard');
    if (dashboardPanel) dashboardPanel.style.display = 'block';
    if (authCard) authCard.style.display = 'none';
  }

  /**
   * Zet loginblok zichtbaar en dashboard verborgen.
   */
  function showLogin() {
    const dashboardPanel = document.getElementById('dashboardPanel');
    const authCard = document.getElementById('authCard');
    if (dashboardPanel) dashboardPanel.style.display = 'none';
    if (authCard) authCard.style.display = 'block';
  }

  /**
   * Teken de tabelrijen op basis van data en geselecteerde klas-filter.
   */

  function renderTotalScore(selectedKlas) {
    const totalsEl = document.getElementById('teacherTotals');
    if (!totalsEl) return;

    const filtered = selectedKlas
      ? allScores.filter((item) => item.klas === selectedKlas)
      : allScores;

    const totalXp = filtered.reduce((sum, item) => {
      const score = Number(item.score);
      return sum + (Number.isNaN(score) ? 0 : score);
    }, 0);

    totalsEl.innerHTML = `<strong>Totaal ${selectedKlas ? `(${escapeHtml(selectedKlas)})` : 'alle klassen'}:</strong> ${totalXp} XP`;
  }

  function renderTable(selectedKlas) {
    const tbody = document.getElementById('scoresTableBody');
    if (!tbody) return;

    // Filter op klas als er een specifieke klas gekozen werd.
    const filtered = selectedKlas
      ? allScores.filter((item) => item.klas === selectedKlas)
      : allScores;

    if (!filtered.length) {
      tbody.innerHTML = '<tr><td colspan="6">Geen resultaten gevonden.</td></tr>';
      renderTotalScore(selectedKlas);
      return;
    }

    tbody.innerHTML = filtered.map((item) => {
      return `
        <tr>
          <td>${escapeHtml(item.naam)}</td>
          <td>${escapeHtml(item.klas)}</td>
          <td>${escapeHtml(item.thema)}</td>
          <td>${escapeHtml(item.unit)}</td>
          <td>${escapeHtml(item.score)}</td>
          <td>${escapeHtml(formatDate(item.createdAt))}</td>
          <td>${escapeHtml(item.bronPagina || item.leerlingAuthType || '-')}</td>
        </tr>
      `;
    }).join('');
    renderTotalScore(selectedKlas);
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

    // Sorteer op recentste score eerst.
    const snapshot = await window.db
      .collection('scores')
      .orderBy('createdAt', 'desc')
      .get();

    allScores = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .map(normalizeScoreItem);

    populateClassFilter();
    renderTable('');
    setStatus(`Klaar. ${allScores.length} score(s) geladen.`, false);
  }

  /**
   * Login-handler voor het leerkrachtformulier.
   */
  async function handleTeacherLogin(event) {
    event.preventDefault();

    const email = document.getElementById('teacherEmail')?.value?.trim();
    const password = document.getElementById('teacherPassword')?.value;

    if (!email || !password) {
      setStatus('Vul e-mail en wachtwoord in.', true);
      return;
    }

    if (!(window.isTeacherEmail && window.isTeacherEmail(email))) {
      setStatus('Dit account staat niet in de leerkrachtlijst.', true);
      return;
    }

    try {
      await window.auth.signInWithEmailAndPassword(email, password);
      // Verdere checks en data laden gebeuren centraal in onAuthStateChanged.
    } catch (error) {
      console.error('Loginfout leerkracht:', error);
      setStatus('Inloggen als leerkracht mislukt.', true);
    }
  }

  /**
   * Uitlog-handler voor leerkracht.
   */
  async function handleTeacherLogout() {
    try {
      await window.auth.signOut();
      setStatus('Uitgelogd.', false);
    } catch (error) {
      console.error('Uitlogfout:', error);
      setStatus('Uitloggen is mislukt.', true);
    }
  }

  /**
   * Bepaal wat er moet gebeuren als auth-status verandert.
   */
  async function handleAuthState(user) {
    if (!user) {
      showLogin();
      setStatus('Niet ingelogd. Log in als leerkracht om scores te bekijken.', true);
      return;
    }

    if (!(window.isTeacherEmail && window.isTeacherEmail(user.email))) {
      setStatus('Dit account is geen leerkrachtaccount. Gebruik leerlingomgeving.', true);
      await window.auth.signOut();
      showLogin();
      return;
    }

    showDashboard();
    setStatus(`Ingelogd als leerkracht: ${user.email}.`, false);
    await loadScores();
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
      const backfillButton = document.getElementById('backfillButton');
      const teacherLoginForm = document.getElementById('teacherLoginForm');
      const teacherLogoutButton = document.getElementById('teacherLogoutButton');

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
      if (backfillButton) {
        backfillButton.addEventListener('click', () => {
          backfillMissingThemaUnit().catch((error) => {
            console.error('Backfill fout:', error);
            setStatus('Kon thema/unit niet bijwerken.', true);
          });
        });
      }

      // Login/uitlog knoppen koppelen.
      if (teacherLoginForm) {
        teacherLoginForm.addEventListener('submit', handleTeacherLogin);
      }
      if (teacherLogoutButton) {
        teacherLogoutButton.addEventListener('click', handleTeacherLogout);
      }

      // Controleer auth-status en enforce leerkracht-only toegang.
      window.auth.onAuthStateChanged((user) => {
        handleAuthState(user).catch((error) => {
          console.error('Auth-state fout:', error);
          setStatus('Fout bij controleren van loginstatus.', true);
        });
      });
    } catch (error) {
      console.error('Fout bij dashboard-initialisatie:', error);
      setStatus('Dashboard kon niet worden opgestart.', true);
    }
  }

  initDashboard();
})();
