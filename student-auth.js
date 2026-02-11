/**
 * student-auth.js
 *
 * Doel:
 * - Eenvoudige leerling-login met enkel voornaam + klas (zonder Firebase Auth)
 * - Sessie bewaren in localStorage
 * - Thema-links blokkeren totdat een leerling is ingelogd
 */

(function () {
  const STORAGE_KEY = 'pavo_leerling_profiel';

  function setStatus(text, isError) {
    const statusEl = document.getElementById('studentAuthStatus');
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.style.color = isError ? '#b00020' : '#166534';
  }

  function getStudentProfile() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.error('Kon leerlingprofiel niet lezen:', error);
      return null;
    }
  }

  function saveStudentProfile(profile) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }

  function clearStudentProfile() {
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function updateUi(profile) {
    const welcomeEl = document.getElementById('studentWelcome');
    const logoutBtn = document.getElementById('studentLogoutButton');

    if (profile) {
      if (welcomeEl) {
        welcomeEl.textContent = `Ingelogd als ${profile.voornaam} (${profile.klas})`;
      }
      if (logoutBtn) {
        logoutBtn.style.display = 'inline-block';
      }
      setStatus('Je bent ingelogd. Je kan nu een thema starten.', false);
      return;
    }

    if (welcomeEl) {
      welcomeEl.textContent = 'Niet ingelogd';
    }
    if (logoutBtn) {
      logoutBtn.style.display = 'none';
    }
    setStatus('Log eerst in met voornaam en klas om een thema te starten.', true);
  }

  function handleLogin(event) {
    event.preventDefault();

    const voornaam = document.getElementById('studentVoornaam')?.value?.trim();
    const klas = document.getElementById('studentKlas')?.value?.trim();

    if (!voornaam || !klas) {
      setStatus('Vul zowel voornaam als klas in.', true);
      return;
    }

    saveStudentProfile({ voornaam, klas, loggedInAt: new Date().toISOString() });
    updateUi({ voornaam, klas });
  }

  function handleLogout() {
    clearStudentProfile();
    updateUi(null);
  }

  function protectThemeLinks() {
    const links = document.querySelectorAll('.thema-card a');

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        const profile = getStudentProfile();
        if (profile) return;

        event.preventDefault();
        setStatus('Je moet eerst inloggen (voornaam + klas) voor je kan starten.', true);
      });
    });
  }

  function init() {
    const form = document.getElementById('studentLoginForm');
    const logoutBtn = document.getElementById('studentLogoutButton');

    if (form) form.addEventListener('submit', handleLogin);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    protectThemeLinks();
    updateUi(getStudentProfile());
  }

  window.getStudentProfile = getStudentProfile;
  init();
})();
