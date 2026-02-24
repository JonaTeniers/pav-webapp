(function () {
  function getStudentProfile() {
    try {
      const raw = window.localStorage.getItem('pavo_leerling_profiel');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (error) {
      console.error('Kon leerlingprofiel niet lezen:', error);
    }

    const legacyClass = window.localStorage.getItem('studentClass');
    const legacyName = window.localStorage.getItem('studentName');
    if (legacyClass || legacyName) {
      return { voornaam: legacyName || '', klas: legacyClass || '' };
    }

    return null;
  }

  function normalizeKlas(klas) {
    return String(klas || '').toLowerCase().replace(/\s+/g, '');
  }

  function setRestrictionState(card, unlocked) {
    if (!card.dataset.originalHref) {
      card.dataset.originalHref = card.getAttribute('href') || '#';
    }

    if (unlocked) {
      card.classList.remove('thema-card-locked');
      card.setAttribute('href', card.dataset.originalHref);
      card.removeAttribute('aria-disabled');
      return;
    }

    card.classList.add('thema-card-locked');
    card.setAttribute('href', '#');
    card.setAttribute('aria-disabled', 'true');
  }

  function initRestrictedThemes() {
    const restrictedCards = document.querySelectorAll('.thema-card[data-allowed-classes]');
    if (!restrictedCards.length) return;

    const profile = getStudentProfile();
    const klas = normalizeKlas(profile?.klas);

    restrictedCards.forEach((card) => {
      const allowedClasses = String(card.dataset.allowedClasses || '')
        .split(',')
        .map((entry) => normalizeKlas(entry))
        .filter(Boolean);

      const unlocked = !!klas && allowedClasses.includes(klas);
      setRestrictionState(card, unlocked);

      card.addEventListener('click', (event) => {
        if (!card.classList.contains('thema-card-locked')) return;

        event.preventDefault();
        const status = document.getElementById('themeAccessStatus');
        if (status) {
          status.textContent = 'Thema mechanica is enkel beschikbaar voor klas 3mech en 4mech.';
        }
      });
    });
  }

  initRestrictedThemes();
})();
