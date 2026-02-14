(function () {

  function getProfile() {
    const naam = localStorage.getItem("studentName");
    const klas = localStorage.getItem("studentClass");

    if (!naam || !klas) return null;

    return { naam, klas };
  }

  function inferThemaUnit(key) {
    const match = key.match(/(thema\d+)unit(\d+)/i);
    if (!match) return { thema: null, unit: null };

    return {
      thema: match[1],
      unit: "unit" + match[2]
    };
  }

  window.pavoSyncScore = async function (key, score) {

    await window.firebaseReady;

    const profile = getProfile();
    if (!profile) {
      console.warn("Geen leerlingprofiel gevonden.");
      return;
    }

    const inferred = inferThemaUnit(key);

    const data = {
      naam: profile.naam,
      klas: profile.klas,
      thema: inferred.thema,
      unit: inferred.unit,
      score: score,
      bronPagina: window.location.pathname,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await window.db.collection("scores").add(data);
      console.log("Score opgeslagen in Firestore:", data);
    } catch (err) {
      console.error("Firestore write error:", err);
    }
  };

})();

