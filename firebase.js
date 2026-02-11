/**
 * firebase.js
 *
 * Doel:
 * - Laadt de Firebase SDK's via CDN (geschikt voor statische sites zoals GitHub Pages)
 * - Initialiseert Firebase met jouw configuratie
 * - Maakt Firestore + Auth beschikbaar
 *
 * Gebruik in je HTML:
 * <script>
 *   // Optioneel: overschrijf hier je config voordat firebase.js wordt geladen
 *   window.FIREBASE_CONFIG = {
 *     apiKey: "...",
 *     authDomain: "...",
 *     projectId: "...",
 *     storageBucket: "...",
 *     messagingSenderId: "...",
 *     appId: "..."
 *   };
 *
 *   // Optioneel: lijst van leerkracht-mailadressen (kleine/hoofdletters maakt niet uit)
 *   window.TEACHER_EMAILS = ["leerkracht@school.be"];
 * </script>
 * <script src="./firebase.js"></script>
 */

(function () {
  /**
   * Vervang deze waarden met jouw Firebase-projectgegevens.
   * Tip: je kunt deze ook vanuit HTML zetten via window.FIREBASE_CONFIG.
   */
  const defaultFirebaseConfig = {
    apiKey: "JOUW_API_KEY",
    authDomain: "jouw-project-id.firebaseapp.com",
    projectId: "jouw-project-id",
    storageBucket: "jouw-project-id.firebasestorage.app",
    messagingSenderId: "JOUW_MESSAGING_SENDER_ID",
    appId: "JOUW_APP_ID"
  };

  /**
   * Optionele fallback-lijst voor leerkrachten.
   * Voor productie: bij voorkeur invullen via window.TEACHER_EMAILS in HTML.
   */
  const defaultTeacherEmails = [];

  /**
   * Gebruik config uit window.FIREBASE_CONFIG als die bestaat,
   * anders val terug op de default hierboven.
   */
  const firebaseConfig = window.FIREBASE_CONFIG || defaultFirebaseConfig;

  /**
   * Gebruik externe teacher-lijst of fallback.
   */
  const teacherEmails = (window.TEACHER_EMAILS || defaultTeacherEmails)
    .filter(Boolean)
    .map((email) => String(email).toLowerCase());

  /**
   * Hulpfunctie: controleer of een e-mail een leerkrachtaccount is.
   */
  function isTeacherEmail(email) {
    return teacherEmails.includes(String(email || '').toLowerCase());
  }

  /**
   * Hulpfunctie om een script-tag dynamisch te laden.
   * Retourneert een Promise zodat we kunnen wachten tot laden klaar is.
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Kon script niet laden: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Initialisatie-flow:
   * 1) Firebase App SDK laden
   * 2) Firestore SDK laden
   * 3) Auth SDK laden
   * 4) Firebase initialiseren
   * 5) Firestore + Auth instantie aanmaken
   */
  async function initFirebase() {
    // Als Firebase al geladen is, initialiseer direct zonder opnieuw scripts te laden.
    if (!window.firebase) {
      await loadScript("https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore-compat.js");
      await loadScript("https://www.gstatic.com/firebasejs/10.13.2/firebase-auth-compat.js");
    }

    // Voorkom dubbele initialisatie bij herhaald laden van hetzelfde script.
    const app = window.firebase.apps.length
      ? window.firebase.app()
      : window.firebase.initializeApp(firebaseConfig);

    const db = window.firebase.firestore(app);
    const auth = window.firebase.auth(app);

    // Maak app + db + auth + rolhulpjes globaal beschikbaar voor je andere scripts.
    window.firebaseApp = app;
    window.db = db;
    window.auth = auth;
    window.teacherEmails = teacherEmails;
    window.isTeacherEmail = isTeacherEmail;

    console.info("Firebase is geïnitialiseerd (Firestore + Auth). ");

    return { app, db, auth };
  }

  /**
   * Exporteer een Promise zodat andere scripts (bijv. score-form.js)
   * netjes kunnen wachten op Firebase.
   */
  window.firebaseReady = initFirebase();

  // Start de initialisatie en log een duidelijke fout als er iets misgaat.
  window.firebaseReady.catch((error) => {
    console.error("Fout bij Firebase-initialisatie:", error);
  });
})();
