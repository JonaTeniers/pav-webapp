/**
 * firebase.js
 *
 * Werking:
 * - Probeert eerst Firebase SDK te gebruiken die al via HTML script-tags geladen is.
 * - Als die ontbreekt, laadt dit bestand automatisch de compat SDK's bij.
 * - Initialiseert Firebase en exporteert `window.auth`, `window.db`, `window.firebaseReady`.
 */

(function () {
  const defaultFirebaseConfig = {
    apiKey: "AIzaSyBDMQauk2ZHfbGl6p99CDNEA1cl1rF8OUs",
    authDomain: "pavowebapp.firebaseapp.com",
    projectId: "pavowebapp",
    storageBucket: "pavowebapp.firebasestorage.app",
    messagingSenderId: "886245311147",
    appId: "1:886245311147:web:2ca222c1e1c766e2adedee"
  };

  // Standaard whitelist met opgegeven leerkrachtaccount.
  const defaultTeacherEmails = ["jona@pavo.be"];

  const firebaseConfig = window.FIREBASE_CONFIG || defaultFirebaseConfig;
  const teacherEmails = (window.TEACHER_EMAILS || defaultTeacherEmails)
    .filter(Boolean)
    .map((email) => String(email).toLowerCase());

  function isTeacherEmail(email) {
    return teacherEmails.includes(String(email || '').toLowerCase());
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Kon Firebase SDK niet laden: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function ensureFirebaseSdk() {
    if (window.firebase) return;

    await loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js');
  }

  async function initFirebase() {
    await ensureFirebaseSdk();

    const app = window.firebase.apps.length
      ? window.firebase.app()
      : window.firebase.initializeApp(firebaseConfig);

    const auth = window.firebase.auth();
    const db = window.firebase.firestore();

    window.firebaseApp = app;
    window.auth = auth;
    window.db = db;
    window.teacherEmails = teacherEmails;
    window.isTeacherEmail = isTeacherEmail;

    return { app, auth, db };
  }

  window.firebaseReady = initFirebase().catch((error) => {
    console.error('Fout bij Firebase-initialisatie:', error);
    throw error;
  });
})();
