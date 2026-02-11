/**
 * score-form.js
 *
 * Dit script werkt samen met firebase.js en doet 2 dingen:
 * 1) Laat een leerling inloggen (email + wachtwoord)
 * 2) Leest een score-formulier uit en schrijft de data naar Firestore collectie `scores`
 *
 * Verwachte HTML-ids:
 * - Login formulier: #loginForm
 *   - input email: #email
 *   - input wachtwoord: #password
 * - Score formulier: #scoreForm
 *   - input naam: #naam
 *   - input klas: #klas
 *   - input thema: #thema
 *   - input score: #score
 * - Optionele statusmelding: #status
 */

(function () {
  /**
   * Kleine helper om statusberichten in de UI te tonen.
   */
  function setStatus(tekst, isError) {
    const statusEl = document.getElementById("status");
    if (!statusEl) return;

    statusEl.textContent = tekst;
    statusEl.style.color = isError ? "#b00020" : "#006400";
  }

  /**
   * Deze functie laat de leerling inloggen met email/wachtwoord.
   */
  async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value;

    if (!email || !password) {
      setStatus("Vul zowel e-mail als wachtwoord in.", true);
      return;
    }

    try {
      // Firebase Auth: inloggen met email + wachtwoord.
      const credential = await window.auth.signInWithEmailAndPassword(email, password);
      const loggedInEmail = credential?.user?.email || email;

      // Extra beveiliging: blokkeer leerkrachtaccounts op de leerlingpagina.
      if (window.isTeacherEmail && window.isTeacherEmail(loggedInEmail)) {
        await window.auth.signOut();
        setStatus("Leerkrachtaccounts horen thuis in de leerkrachtomgeving.", true);
        return;
      }

      setStatus("Inloggen gelukt. Je kan nu je score opslaan.", false);
    } catch (error) {
      console.error("Login fout:", error);
      setStatus("Inloggen mislukt. Controleer je gegevens.", true);
    }
  }

  /**
   * Deze functie leest het formulier uit en schrijft de data naar Firestore.
   */
  async function handleScoreSubmit(event) {
    event.preventDefault();

    // Stap 1: controleer of de leerling ingelogd is.
    const user = window.auth.currentUser;
    if (!user) {
      setStatus("Je moet eerst inloggen voor je kan starten.", true);
      return;
    }

    // Extra beveiliging: leerkrachtaccount mag niet opslaan als leerling.
    if (window.isTeacherEmail && window.isTeacherEmail(user.email)) {
      setStatus("Gebruik als leerkracht de leerkrachtomgeving, niet de leerlingomgeving.", true);
      return;
    }

    // Stap 2: lees de formuliervelden uit.
    const naam = document.getElementById("naam")?.value?.trim();
    const klas = document.getElementById("klas")?.value?.trim();
    const thema = document.getElementById("thema")?.value?.trim();
    const score = Number(document.getElementById("score")?.value);

    // Stap 3: basisvalidatie op verplichte velden.
    if (!naam || !klas || !thema || Number.isNaN(score)) {
      setStatus("Vul naam, klas, thema en score correct in.", true);
      return;
    }

    // Stap 4: bouw het document op dat naar Firestore gaat.
    const scoreData = {
      naam,
      klas,
      thema,
      score,
      leerlingUid: user.uid,
      leerlingEmail: user.email || null,
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      // Stap 5: schrijf naar collectie `scores` in Firestore.
      await window.db.collection("scores").add(scoreData);

      // Stap 6: feedback tonen en formulier resetten.
      setStatus("Score opgeslagen in Firestore.", false);
      event.target.reset();
    } catch (error) {
      console.error("Opslaan fout:", error);
      setStatus("Opslaan mislukt. Probeer opnieuw.", true);
    }
  }

  /**
   * Koppel event listeners zodra Firebase klaar is.
   */
  async function initScoreForm() {
    try {
      // Wacht op firebase.js (app + firestore + auth).
      await window.firebaseReady;

      const loginForm = document.getElementById("loginForm");
      const scoreForm = document.getElementById("scoreForm");

      if (!loginForm) {
        console.warn("#loginForm niet gevonden.");
      } else {
        loginForm.addEventListener("submit", handleLogin);
      }

      if (!scoreForm) {
        console.warn("#scoreForm niet gevonden.");
      } else {
        scoreForm.addEventListener("submit", handleScoreSubmit);
      }

      // Optionele status bij auth-wijziging (vb. na refresh nog ingelogd).
      window.auth.onAuthStateChanged((user) => {
        if (user && !(window.isTeacherEmail && window.isTeacherEmail(user.email))) {
          setStatus(`Ingelogd als ${user.email}.`, false);
          return;
        }

        if (user) {
          setStatus("Leerkracht gedetecteerd op leerlingpagina. Log in als leerling.", true);
          return;
        }

        setStatus("Niet ingelogd. Log eerst in om scores op te slaan.", true);
      });
    } catch (error) {
      console.error("Init fout score-form:", error);
      setStatus("Kon score-module niet initialiseren.", true);
    }
  }

  initScoreForm();
})();
