/**
 * score-form.js
 *
 * Doel:
 * - Leerlingen hoeven NIET meer in te loggen.
 * - Leerlingen vullen enkel naam + klas in (thema/score mag optioneel mee).
 * - Elke inzending wordt opgeslagen in Firestore collectie `scores` met timestamp.
 * - We bewaren ook waar de inzending gebeurde (pagina + sessie-id) zodat je als leerkracht kan zien vanwaar het kwam.
 *
 * Verwachte HTML-ids:
 * - Score formulier: #scoreForm
 *   - input naam: #naam (verplicht)
 *   - input klas: #klas (verplicht)
 *   - input thema: #thema (optioneel)
 *   - input score: #score (optioneel)
 * - Optionele statusmelding: #status
 */

(function () {
  /**
   * Kleine helper om statusberichten in de UI te tonen.
   */
  function setStatus(tekst, isError) {
    const statusEl = document.getElementById('status');
    if (!statusEl) return;

    statusEl.textContent = tekst;
    statusEl.style.color = isError ? '#b00020' : '#006400';
  }

  /**
   * Maak (of hergebruik) een eenvoudige sessie-id per browser.
   * Zo kan je in Firestore zien welke inzendingen uit dezelfde browsersessie komen.
   */
  function getSessionId() {
    const storageKey = 'pavo_leerling_sessie_id';
    const existing = window.localStorage.getItem(storageKey);
    if (existing) return existing;

    const newId = `sessie_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem(storageKey, newId);
    return newId;
  }

  /**
   * Lees het scoreformulier uit en schrijf de data naar Firestore.
   */
  async function handleScoreSubmit(event) {
    event.preventDefault();

    // Stap 1: lees de verplichte velden uit.
    const naam = document.getElementById('naam')?.value?.trim();
    const klas = document.getElementById('klas')?.value?.trim();

    // Stap 2: lees optionele velden uit (indien aanwezig op de pagina).
    const themaValue = document.getElementById('thema')?.value?.trim();
    const scoreRaw = document.getElementById('score')?.value;
    const scoreNumber = Number(scoreRaw);

    // Stap 3: valideer enkel naam + klas (zoals gevraagd).
    if (!naam || !klas) {
      setStatus('Vul minstens naam en klas in.', true);
      return;
    }

    // Stap 4: bouw het Firestore-document op.
    const scoreData = {
      naam,
      klas,
      // Thema/score worden enkel opgeslagen als ze effectief ingevuld zijn.
      ...(themaValue ? { thema: themaValue } : {}),
      ...(scoreRaw !== undefined && scoreRaw !== '' && !Number.isNaN(scoreNumber) ? { score: scoreNumber } : {}),

      // Handig voor leerkrachtinzichten: vanwaar kwam de inzending?
      bronPagina: window.location.pathname,
      sessieId: getSessionId(),

      // Type van inzending expliciet zetten (geen auth-login nodig voor leerlingen).
      leerlingAuthType: 'naam-klas-zonder-login',

      // Server timestamp zodat volgorde/datum betrouwbaar is.
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      // Stap 5: schrijf naar collectie `scores` in Firestore.
      await window.db.collection('scores').add(scoreData);

      // Stap 6: feedback tonen en formulier resetten.
      setStatus('Gegevens opgeslagen in Firestore.', false);
      event.target.reset();
    } catch (error) {
      console.error('Opslaan fout:', error);
      setStatus('Opslaan mislukt. Probeer opnieuw.', true);
    }
  }

  /**
   * Koppel event listeners zodra Firebase klaar is.
   */
  async function initScoreForm() {
    try {
      await window.firebaseReady;

      const scoreForm = document.getElementById('scoreForm');
      if (!scoreForm) {
        console.warn('#scoreForm niet gevonden.');
        return;
      }

      scoreForm.addEventListener('submit', handleScoreSubmit);
      setStatus('Vul naam en klas in en klik op opslaan.', false);
    } catch (error) {
      console.error('Init fout score-form:', error);
      setStatus('Kon score-module niet initialiseren.', true);
    }
  }

  initScoreForm();
})();
