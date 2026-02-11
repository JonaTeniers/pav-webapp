/**
 * firebase.js
 *
 * Verwachting:
 * - De Firebase SDK-tags staan in HTML vóór dit bestand:
 *   <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
 *   <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
 *   <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
 *   <script src="firebase.js"></script>
 */

(function () {
  /**
   * Standaardconfig voor jouw Firebase-project.
   * Kan overschreven worden via window.FIREBASE_CONFIG in HTML.
   */
  const defaultFirebaseConfig = {
    apiKey: "AIzaSyBDMQauk2ZHfbGl6p99CDNEA1cl1rF8OUs",
    authDomain: "pavowebapp.firebaseapp.com",
    projectId: "pavowebapp",
    storageBucket: "pavowebapp.firebasestorage.app",
    messagingSenderId: "886245311147",
    appId: "1:886245311147:web:2ca222c1e1c766e2adedee"
  };

  /**
   * Optionele leerkracht-whitelist.
   */
  const defaultTeacherEmails = [];

  const firebaseConfig = window.FIREBASE_CONFIG || defaultFirebaseConfig;
  const teacherEmails = (window.TEACHER_EMAILS || defaultTeacherEmails)
    .filter(Boolean)
    .map((email) => String(email).toLowerCase());

  function isTeacherEmail(email) {
    return teacherEmails.includes(String(email || '').toLowerCase());
  }

  /**
   * Controleer of Firebase via script-tags beschikbaar is.
   */
  if (!window.firebase) {
    console.error('Firebase SDK ontbreekt. Voeg eerst de 10.8.0 script-tags toe in je HTML vóór firebase.js.');
    window.firebaseReady = Promise.reject(new Error('Firebase SDK niet gevonden'));
    return;
  }

  // Firebase initialiseren
  const app = window.firebase.apps.length
    ? window.firebase.app()
    : window.firebase.initializeApp(firebaseConfig);
  const auth = window.firebase.auth();
  const db = window.firebase.firestore();

  // Exporteer voor gebruik in andere JS-bestanden
  window.firebaseApp = app;
  window.auth = auth;
  window.db = db;
  window.teacherEmails = teacherEmails;
  window.isTeacherEmail = isTeacherEmail;

  // Houd dezelfde API aan voor bestaande scripts die op firebaseReady wachten.
  window.firebaseReady = Promise.resolve({ app, auth, db });
})();
