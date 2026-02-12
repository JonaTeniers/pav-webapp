/*
 * teacher-dashboard.js
 *
 * Doel:
 * - Enkel leerkrachten toelaten
 * - Scores ophalen uit Firestore
 * - Filteren per klas
 * - Totaal XP berekenen
 */

(function () {

  let allScores = [];

  function setStatus(message, isError) {
    const el = document.getElementById("status");
    if (!el) return;
    el.textContent = message;
    el.style.color = isError ? "#b00020" : "#166534";
  }

  function escapeHtml(value) {
    return String(value ?? "-")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatDate(ts) {
    if (!ts) return "-";
    const d = typeof ts.toDate === "function" ? ts.toDate() : new Date(ts);
    if (isNaN(d.getTime())) return "-";

    return new Intl.DateTimeFormat("nl-BE", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(d);
  }

  function extractThemaUnit(text) {
    const m =
      String(text || "").match(/thema\s*(\d+).*unit\s*(\d+)/i) ||
      String(text || "").match(/thema(\d+)_unit(\d+)/i);

    if (!m) return {};
    return { thema: `thema${m[1]}`, unit: `unit${m[2]}` };
  }

  function normalize(item) {
    const a = extractThemaUnit(item.bronStorageKey);
    const b = extractThemaUnit(item.bronPagina);

    return {
      ...item,
      thema: item.thema || a.thema || b.thema || "-",
      unit: item.unit || a.unit || b.unit || "-"
    };
  }

  function showDashboard() {
    document.getElementById("dashboardPanel").style.display = "block";
    document.getElementById("authCard").style.display = "none";
  }

  function showLogin() {
    document.getElementById("dashboardPanel").style.display = "none";
    document.getElementById("authCard").style.display = "block";
  }

  function populateClassFilter() {
    const sel = document.getElementById("klasFilter");
    sel.innerHTML = `<option value="">Alle klassen</option>`;

    [...new Set(allScores.map(s => s.klas).filter(Boolean))]
      .sort()
      .forEach(k => {
        const o = document.createElement("option");
        o.value = k;
        o.textContent = k;
        sel.appendChild(o);
      });
  }

  function renderTotals(klas) {
    const el = document.getElementById("teacherTotals");
    const list = klas ? allScores.filter(s => s.klas === klas) : allScores;
    const total = list.reduce((t, s) => t + Number(s.score || 0), 0);

    el.innerHTML = `<strong>Totaal ${klas || "alle klassen"}:</strong> ${total} XP`;
  }

  function renderTable(klas) {
    const body = document.getElementById("scoresTableBody");

    const list = klas ? allScores.filter(s => s.klas === klas) : allScores;

    if (!list.length) {
      body.innerHTML = `<tr><td colspan="7">Geen resultaten</td></tr>`;
      renderTotals(klas);
      return;
    }

    body.innerHTML = list.map(s => `
      <tr>
        <td>${escapeHtml(s.naam)}</td>
        <td>${escapeHtml(s.klas)}</td>
        <td>${escapeHtml(s.thema)}</td>
        <td>${escapeHtml(s.unit)}</td>
        <td>${escapeHtml(s.score)}</td>
        <td>${escapeHtml(formatDate(s.createdAt))}</td>
        <td>${escapeHtml(s.bronPagina || "-")}</td>
      </tr>
    `).join("");

    renderTotals(klas);
  }

  async function loadScores() {
    setStatus("Scores laden...", false);

    const snap = await window.db.collection("scores").get();
    allScores = snap.docs.map(d => normalize({ id: d.id, ...d.data() }));

    populateClassFilter();
    renderTable("");
    setStatus(`${allScores.length} scores geladen.`, false);
  }

  async function handleLogin(e) {
    e.preventDefault();

    const email = teacherEmail.value.trim();
    const pass = teacherPassword.value;

    if (!window.isTeacherEmail(email)) {
      setStatus("Geen leerkrachtaccount.", true);
      return;
    }

    try {
      await window.auth.signInWithEmailAndPassword(email, pass);
    } catch {
      setStatus("Login mislukt.", true);
    }
  }

  async function handleLogout() {
    await window.auth.signOut();
  }

  async function handleAuth(user) {
    if (!user) {
      showLogin();
      setStatus("Niet ingelogd.", true);
      return;
    }

    if (!window.isTeacherEmail(user.email)) {
      await window.auth.signOut();
      showLogin();
      setStatus("Geen leerkracht.", true);
      return;
    }

    showDashboard();
    setStatus(`Ingelogd als ${user.email}`, false);
    loadScores();
  }

  async function init() {
    await window.firebaseReady;

    teacherLoginForm.addEventListener("submit", handleLogin);
    teacherLogoutButton.addEventListener("click", handleLogout);
    klasFilter.addEventListener("change", e => renderTable(e.target.value));

    window.auth.onAuthStateChanged(handleAuth);
  }

  init();
})();

