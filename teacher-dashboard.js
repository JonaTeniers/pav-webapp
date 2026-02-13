/**
 * teacher-dashboard.js
 * Veilige versie – blijft nooit hangen op "Scores laden..."
 */

(function () {
  let allScores = [];

  function setStatus(message, isError = false) {
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

  function formatDate(value) {
    if (!value) return "-";
    try {
      const d =
        typeof value.toDate === "function"
          ? value.toDate()
          : new Date(value);
      return isNaN(d.getTime())
        ? "-"
        : new Intl.DateTimeFormat("nl-BE", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(d);
    } catch {
      return "-";
    }
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
    const select = document.getElementById("klasFilter");
    select.innerHTML = `<option value="">Alle klassen</option>`;

    [...new Set(allScores.map(s => s.klas).filter(Boolean))]
      .sort()
      .forEach(klas => {
        const o = document.createElement("option");
        o.value = klas;
        o.textContent = klas;
        select.appendChild(o);
      });
  }

  function renderTable(klas = "") {
    const tbody = document.getElementById("scoresTableBody");
    const data = klas
      ? allScores.filter(s => s.klas === klas)
      : allScores;

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="7">Geen resultaten.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr>
        <td>${escapeHtml(item.naam)}</td>
        <td>${escapeHtml(item.klas)}</td>
        <td>${escapeHtml(item.thema)}</td>
        <td>${escapeHtml(item.unit)}</td>
        <td>${escapeHtml(item.score)}</td>
        <td>${escapeHtml(formatDate(item.createdAt))}</td>
        <td>${escapeHtml(item.bronPagina || "-")}</td>
      </tr>
    `).join("");
  }

  async function loadScores() {
    setStatus("Scores worden geladen…");

    let docs = [];

    try {
      // 🔒 VEILIGE QUERY – kan niet blokkeren
      const snapshot = await window.db
        .collection("scores")
        .limit(500)
        .get();

      docs = snapshot.docs;
    } catch (err) {
      console.error("Firestore fout:", err);
      setStatus("Fout bij laden van scores.", true);
      return;
    }

    allScores = docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    populateClassFilter();
    renderTable("");
    setStatus(`Klaar. ${allScores.length} score(s) geladen.`);
  }

  async function handleLogin(e) {
    e.preventDefault();

    const email = teacherEmail.value.trim();
    const pw = teacherPassword.value;

    if (!window.isTeacherEmail(email)) {
      setStatus("Geen leerkrachtaccount.", true);
      return;
    }

    try {
      await window.auth.signInWithEmailAndPassword(email, pw);
    } catch {
      setStatus("Inloggen mislukt.", true);
    }
  }

  async function handleLogout() {
    await window.auth.signOut();
    setStatus("Uitgelogd.");
  }

  async function init() {
    await window.firebaseReady;

    teacherLoginForm.addEventListener("submit", handleLogin);
    teacherLogoutButton.addEventListener("click", handleLogout);
    klasFilter.addEventListener("change", e => renderTable(e.target.value));
    refreshButton.addEventListener("click", loadScores);

    window.auth.onAuthStateChanged(user => {
      if (!user) {
        showLogin();
        setStatus("Niet ingelogd.");
        return;
      }

      if (!window.isTeacherEmail(user.email)) {
        setStatus("Geen leerkrachtaccount.", true);
        window.auth.signOut();
        return;
      }

      showDashboard();
      setStatus(`Ingelogd als ${user.email}`);
      loadScores();
    });
  }

  init();
})();


