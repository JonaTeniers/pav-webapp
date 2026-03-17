/**
 * leerling-dashboard.js
 *
 * Uitbreiding op bestaande module:
 * - centrale startpagina met opdrachten, doelen, reflecties, voortgang en feedback
 * - reflecties bewaren in portfolio + firestore
 * - project- en vaardigheidsopvolging zonder bestaande scoreflow te verwijderen
 */

(function () {
  const STORAGE_KEY = 'pavo_leerling_profiel';
  const REFLECTION_STORAGE_KEY = 'pavo_reflecties';
  const PROJECT_STORAGE_KEY = 'pavo_projecten';
  const COLLAB_STORAGE_KEY = 'pavo_samenwerking';

  const THEMAS = [
    { id: 1, naam: 'Thema 1', maxUnit: 12, startLink: 'hoofdthema1.html' },
    { id: 2, naam: 'Thema 2', maxUnit: 2, startLink: 'hoofdthema2.html' },
    { id: 3, naam: 'Thema 3', maxUnit: 3, startLink: 'oefenthema1.html' },
    { id: 4, naam: 'Thema 4', maxUnit: 10, startLink: 'oefenthema2.html' },
    { id: 5, naam: 'Thema 5', maxUnit: 3, startLink: 'oefenthema3.html' },
    { id: 6, naam: 'Thema 6', maxUnit: 3, startLink: 'oefenthema4.html' },
    { id: 7, naam: 'Thema 7', maxUnit: 3, startLink: 'oefenthema5.html' },
    { id: 8, naam: 'Thema 8', maxUnit: 3, startLink: 'oefenthema6.html' },
    { id: 9, naam: 'Thema 9', maxUnit: 8, startLink: 'hoofdthema3.html' }
  ];

  const DEFAULT_SKILLS = [
    { naam: 'Plannen', waarde: 0 },
    { naam: 'Samenwerken', waarde: 0 },
    { naam: 'Communiceren', waarde: 0 },
    { naam: 'Probleemoplossend denken', waarde: 0 },
    { naam: 'Kritisch denken', waarde: 0 }
  ];

  function setStatus(text, isError) {
    const el = document.getElementById('status');
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? '#b00020' : '#334155';
  }

  function escapeHtml(value) {
    return String(value ?? '-')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(timestampValue) {
    if (!timestampValue) return '-';
    const date = typeof timestampValue.toDate === 'function' ? timestampValue.toDate() : new Date(timestampValue);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('nl-BE', { dateStyle: 'short', timeStyle: 'short' }).format(date);
  }

  function timestampToMs(ts) {
    if (!ts) return 0;
    if (typeof ts.toDate === 'function') return ts.toDate().getTime();
    const date = new Date(ts);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }

  function getStoredJson(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      console.error(`Kon localStorage key ${key} niet lezen`, error);
      return fallback;
    }
  }

  function setStoredJson(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  function getStoredProfile() {
    return getStoredJson(STORAGE_KEY, null);
  }

  function getRole() {
    return String(window.localStorage.getItem('role') || '').toLowerCase();
  }

  function ensureStudentAccess() {
    const role = getRole();
    const profile = getStoredProfile();

    if (role === 'teacher') {
      window.location.href = 'leerkracht-dashboard.html';
      return false;
    }

    if (role !== 'student' || !profile?.voornaam || !profile?.klas) {
      window.location.href = 'login.html';
      return false;
    }

    return true;
  }


  function getLocalScores(profile) {
    const all = getStoredJson('pavo_scores_local', []);
    return all
      .filter((item) => item.naam === profile.voornaam && item.klas === profile.klas)
      .map((item) => ({ ...item, ...extractNumbers(item) }));
  }

  function saveProfile(profile) {
    setStoredJson(STORAGE_KEY, profile);
  }

  function extractNumbers(item) {
    const bron = String(item.bronPagina || '');
    const bronStorageKey = String(item.bronStorageKey || '');
    const themaText = String(item.thema || '');
    const unitText = String(item.unit || '');

    const themaMatch = themaText.match(/thema\s*(\d+)/i)
      || bron.match(/thema(\d+)/i)
      || bronStorageKey.match(/thema(\d+)/i);
    const unitMatch = unitText.match(/unit\s*(\d+)/i)
      || bron.match(/unit(\d+)/i)
      || bronStorageKey.match(/unit(\d+)/i);

    return {
      themaNummer: themaMatch ? Number(themaMatch[1]) : null,
      unitNummer: unitMatch ? Number(unitMatch[1]) : null
    };
  }

  function buildRows(items) {
    const rows = [];

    THEMAS.forEach((thema) => {
      const itemsForTheme = items
        .filter((item) => item.themaNummer === thema.id)
        .sort((a, b) => timestampToMs(b.createdAt) - timestampToMs(a.createdAt));

      if (!itemsForTheme.length) {
        rows.push({
          thema: thema.naam,
          unit: '-',
          score: '-',
          wanneer: '-',
          status: `Nog niet gespeeld (<a href="${thema.startLink}">Start spelen</a>)`
        });
        return;
      }

      for (let unit = 1; unit <= thema.maxUnit; unit += 1) {
        const itemsForUnit = itemsForTheme
          .filter((item) => item.unitNummer === unit)
          .sort((a, b) => timestampToMs(b.createdAt) - timestampToMs(a.createdAt));

        if (!itemsForUnit.length) {
          rows.push({
            thema: thema.naam,
            unit: `Unit ${unit}`,
            score: '-',
            wanneer: '-',
            status: `Nog niet gespeeld (<a href="thema${thema.id}unit${unit}.html">Start spelen</a>)`
          });
          continue;
        }

        const latest = itemsForUnit[0];
        rows.push({
          thema: thema.naam,
          unit: `Unit ${unit}`,
          score: latest.score ?? '-',
          wanneer: formatDate(latest.createdAt),
          status: '<span class="pill">Gespeeld</span>'
        });
      }
    });

    return rows;
  }

  function renderRows(items) {
    const tbody = document.getElementById('studentScoresTableBody');
    if (!tbody) return;

    const rows = buildRows(items);
    tbody.innerHTML = rows.map((row) => `
      <tr>
        <td>${escapeHtml(row.thema)}</td>
        <td>${escapeHtml(row.unit)}</td>
        <td>${escapeHtml(row.score)}</td>
        <td>${escapeHtml(row.wanneer)}</td>
        <td>${row.status}</td>
      </tr>
    `).join('');

    document.getElementById('countAssignments').textContent = String(rows.filter((row) => row.score !== '-').length);
    document.getElementById('portfolioAssignments').textContent = `${rows.filter((row) => row.score !== '-').length} opgeslagen`;
  }

  function renderTotalScore(items) {
    const total = items.reduce((sum, item) => {
      const value = Number(item.score);
      return sum + (Number.isNaN(value) ? 0 : value);
    }, 0);

    const el = document.getElementById('studentTotalScore');
    if (el) el.textContent = `${total} XP`;
  }

  function renderWeekOverview(items) {
    const host = document.getElementById('weekOverview');
    if (!host) return;

    const days = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
    const counts = new Array(7).fill(0);

    items.forEach((item) => {
      const date = typeof item.createdAt?.toDate === 'function' ? item.createdAt.toDate() : new Date(item.createdAt);
      if (Number.isNaN(date.getTime())) return;
      const idx = (date.getDay() + 6) % 7;
      counts[idx] += 1;
    });

    host.innerHTML = days.map((day, index) => `
      <div class="day">
        <strong>${day}</strong>
        <div>${counts[index]} activiteit(en)</div>
      </div>
    `).join('');

    document.getElementById('countGoals').textContent = String(Math.min(5, counts.reduce((a, b) => a + (b > 0 ? 1 : 0), 0)));
  }

  function renderSkills(scores, profile) {
    const container = document.getElementById('skillsContainer');
    if (!container) return;

    const avgScore = scores.length
      ? scores.reduce((sum, scoreItem) => sum + (Number(scoreItem.score) || 0), 0) / scores.length
      : 0;

    const base = Math.max(15, Math.min(100, Math.round(avgScore)));
    const derivedSkills = DEFAULT_SKILLS.map((skill, index) => ({
      naam: skill.naam,
      waarde: Math.max(5, Math.min(100, base - 8 + index * 4))
    }));

    const localSkills = getStoredJson(`pavo_skills_${profile.voornaam}_${profile.klas}`, null);
    const finalSkills = Array.isArray(localSkills) && localSkills.length ? localSkills : derivedSkills;

    container.innerHTML = finalSkills.map((skill) => `
      <div style="margin-bottom:10px;">
        <div style="display:flex;justify-content:space-between;gap:8px;"><strong>${escapeHtml(skill.naam)}</strong><span>${skill.waarde}%</span></div>
        <div class="progress-wrap"><div class="progress-bar" style="width:${Math.max(0, Math.min(100, Number(skill.waarde) || 0))}%;"></div></div>
      </div>
    `).join('');

    document.getElementById('portfolioSkills').textContent = `${finalSkills.length} bijgehouden`;
  }

  function getLocalReflections(profile) {
    const all = getStoredJson(REFLECTION_STORAGE_KEY, []);
    return all.filter((item) => item.voornaam === profile.voornaam && item.klas === profile.klas);
  }

  function renderReflections(reflections) {
    const host = document.getElementById('reflectionList');
    if (!host) return;

    if (!reflections.length) {
      host.innerHTML = '<p class="muted">Nog geen reflecties bewaard.</p>';
      return;
    }

    host.innerHTML = reflections.slice(0, 4).map((reflection) => `
      <div class="feedback-item">
        <strong>${escapeHtml(formatDate(reflection.createdAt || reflection.datum))}</strong>
        <div><strong>Geleerd:</strong> ${escapeHtml(reflection.learned)}</div>
        <div><strong>Moeilijk:</strong> ${escapeHtml(reflection.difficult)}</div>
        <div><strong>Volgende keer:</strong> ${escapeHtml(reflection.nextTime)}</div>
        <div><strong>Samenwerking:</strong> ${escapeHtml(reflection.teamwork)}</div>
      </div>
    `).join('');

    document.getElementById('countReflections').textContent = String(reflections.length);
    document.getElementById('portfolioReflections').textContent = `${reflections.length} opgeslagen`;
  }

  function buildDefaultProjects(profile) {
    return [
      {
        titel: 'Maandbudget berekenen',
        beschrijving: 'Werk met je groep een realistisch budget uit voor een studentenkamer.',
        leerdoelen: ['Budgetteren', 'Kritisch denken'],
        taken: ['Inkomsten oplijsten', 'Vaste kosten berekenen', 'Besparingen voorstellen'],
        deadline: 'Vrijdag',
        groepsleden: [profile.voornaam, 'Teamlid 1', 'Teamlid 2'],
        feedback: 'Gebruik duidelijke tabellen en motiveer je keuzes.'
      },
      {
        titel: 'Sollicitatiebrief schrijven',
        beschrijving: 'Schrijf een sollicitatiebrief en geef peer-feedback in duo.',
        leerdoelen: ['Communiceren', 'Plannen'],
        taken: ['Vacature kiezen', 'Brief schrijven', 'Feedbackronde doen'],
        deadline: 'Volgende week dinsdag',
        groepsleden: [profile.voornaam, 'Feedbackbuddy'],
        feedback: 'Focus op een overtuigende en correcte opbouw.'
      }
    ];
  }

  function renderProjects(profile) {
    const host = document.getElementById('projectContainer');
    if (!host) return;

    const key = `${PROJECT_STORAGE_KEY}_${profile.voornaam}_${profile.klas}`;
    const projects = getStoredJson(key, buildDefaultProjects(profile));
    if (!window.localStorage.getItem(key)) setStoredJson(key, projects);

    host.innerHTML = projects.map((project) => `
      <div class="project-item">
        <strong>${escapeHtml(project.titel)}</strong>
        <p>${escapeHtml(project.beschrijving)}</p>
        <p><strong>Leerdoelen:</strong> ${escapeHtml((project.leerdoelen || []).join(', '))}</p>
        <p><strong>Taken:</strong> ${escapeHtml((project.taken || []).join(' • '))}</p>
        <p><strong>Deadline:</strong> ${escapeHtml(project.deadline)}</p>
        <p><strong>Groepsleden:</strong> ${escapeHtml((project.groepsleden || []).join(', '))}</p>
        <p><strong>Feedback leerkracht:</strong> ${escapeHtml(project.feedback)}</p>
      </div>
    `).join('');

    document.getElementById('portfolioProjects').textContent = `${projects.length} opgeslagen`;
  }

  function getCollaborationItems(profile) {
    const all = getStoredJson(COLLAB_STORAGE_KEY, []);
    return all.filter((item) => item.voornaam === profile.voornaam && item.klas === profile.klas);
  }

  function renderCollaboration(profile) {
    const host = document.getElementById('collaborationList');
    if (!host) return;

    const items = getCollaborationItems(profile);
    if (!items.length) {
      host.innerHTML = '<p>Nog geen samenwerking opgeslagen.</p>';
      return;
    }

    host.innerHTML = items.slice(0, 4).map((item) => `
      <div class="feedback-item">
        <strong>Taakverdeling</strong>
        <p style="margin:4px 0;">${escapeHtml(item.taak)}</p>
        <strong>Discussie</strong>
        <p style="margin:4px 0;">${escapeHtml(item.reacties)}</p>
        <small class="muted">${escapeHtml(formatDate(item.datum))}</small>
      </div>
    `).join('');
  }

  function renderFeedback(feedbackItems) {
    const host = document.getElementById('feedbackContainer');
    if (!host) return;

    if (!feedbackItems.length) {
      host.innerHTML = '<p>Geen feedback gevonden. Vraag na je volgende opdracht om feedback.</p>';
      document.getElementById('countFeedback').textContent = '0';
      return;
    }

    host.innerHTML = feedbackItems.slice(0, 4).map((item) => `
      <div class="feedback-item">
        <strong>${escapeHtml(item.titel || 'Feedback')}</strong>
        <p style="margin:6px 0;">${escapeHtml(item.tekst || item.feedback || '')}</p>
        <small class="muted">${escapeHtml(formatDate(item.createdAt))}</small>
      </div>
    `).join('');

    document.getElementById('countFeedback').textContent = String(feedbackItems.length);
  }

  async function loadStudentFeedback(profile) {
    try {
      const snapshot = await window.db
        .collection('feedback')
        .where('naam', '==', profile.voornaam)
        .where('klas', '==', profile.klas)
        .limit(20)
        .get();

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.warn('Kon feedbackcollectie niet laden, fallback op lokale data.', error);
      return getStoredJson(`pavo_feedback_${profile.voornaam}_${profile.klas}`, []);
    }
  }

  async function loadStudentScores(profile) {
    setStatus('Dashboard laden...', false);

    let items = [];
    let hadRemoteError = false;

    if (!window.db) {
      items = getLocalScores(profile);
      renderRows(items);
      renderTotalScore(items);
      renderWeekOverview(items);
      renderSkills(items, profile);
      renderFeedback([]);
      renderProjects(profile);
      renderReflections(getLocalReflections(profile));
      renderCollaboration(profile);
      setStatus('Offline modus: lokale resultaten geladen.', true);
      return;
    }

    try {
      const snapshot = await window.db
        .collection('scores')
        .where('naam', '==', profile.voornaam)
        .where('klas', '==', profile.klas)
        .get();

      items = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .map((item) => ({ ...item, ...extractNumbers(item) }));
    } catch (error) {
      console.warn('Kon Firestore scores niet laden, fallback op lokaal.', error);
      items = getLocalScores(profile);
      hadRemoteError = true;
      setStatus('Scores geladen zonder Firestore (controleer rechten/verbinding).', true);
    }

    renderRows(items);
    renderTotalScore(items);
    renderWeekOverview(items);
    renderSkills(items, profile);

    const feedbackItems = await loadStudentFeedback(profile);
    renderFeedback(feedbackItems);
    renderProjects(profile);
    renderReflections(getLocalReflections(profile));
    renderCollaboration(profile);

    if (!hadRemoteError) {
      setStatus(`${items.length} resultaten geladen.`, false);
    }
  }


  function showActiveProfile(profile) {
    const el = document.getElementById('activeProfile');
    if (!el) return;
    if (!profile) {
      el.textContent = '';
      return;
    }

    el.textContent = `Ingelogd als ${profile.voornaam} (${profile.klas})`;
  }

  async function handleLogin(event) {
    event.preventDefault();

    const voornaam = document.getElementById('viewVoornaam')?.value?.trim();
    const klas = document.getElementById('viewKlas')?.value?.trim();

    if (!voornaam || !klas) {
      setStatus('Vul voornaam en klas in.', true);
      return;
    }

    const profile = { voornaam, klas, loggedInAt: new Date().toISOString() };
    saveProfile(profile);
    window.localStorage.setItem('role', 'student');
    showActiveProfile(profile);

    try {
      await loadStudentScores(profile);
    } catch (error) {
      console.error('Fout bij laden leerlingdashboard:', error);
      setStatus('Kon dashboard niet volledig laden.', true);
    }
  }

  async function handleReflectionSubmit(event) {
    event.preventDefault();
    const profile = getStoredProfile();
    if (!profile) {
      setStatus('Log eerst in om een reflectie op te slaan.', true);
      return;
    }

    const reflection = {
      voornaam: profile.voornaam,
      klas: profile.klas,
      learned: document.getElementById('reflectLearned').value.trim(),
      difficult: document.getElementById('reflectDifficult').value.trim(),
      nextTime: document.getElementById('reflectNextTime').value.trim(),
      teamwork: document.getElementById('reflectTeamwork').value.trim(),
      datum: new Date().toISOString()
    };

    if (!reflection.learned || !reflection.difficult || !reflection.nextTime || !reflection.teamwork) {
      setStatus('Vul alle reflectievragen in.', true);
      return;
    }

    const all = getStoredJson(REFLECTION_STORAGE_KEY, []);
    all.unshift(reflection);
    setStoredJson(REFLECTION_STORAGE_KEY, all);

    try {
      await window.db.collection('portfolio_reflecties').add({
        ...reflection,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.warn('Firestore opslag reflectie mislukt; lokaal opgeslagen.', error);
    }

    event.target.reset();
    renderReflections(getLocalReflections(profile));
    setStatus('Reflectie opgeslagen in je leerlingportfolio.', false);
  }

  function handleCollaborationSubmit(event) {
    event.preventDefault();
    const profile = getStoredProfile();
    if (!profile) {
      setStatus('Log eerst in om samenwerking op te slaan.', true);
      return;
    }

    const taak = document.getElementById('collabTask').value.trim();
    const reacties = document.getElementById('collabComment').value.trim();
    if (!taak || !reacties) {
      setStatus('Vul taakverdeling en discussie in.', true);
      return;
    }

    const all = getStoredJson(COLLAB_STORAGE_KEY, []);
    all.unshift({
      voornaam: profile.voornaam,
      klas: profile.klas,
      taak,
      reacties,
      datum: new Date().toISOString()
    });
    setStoredJson(COLLAB_STORAGE_KEY, all);
    event.target.reset();
    renderCollaboration(profile);
    setStatus('Samenwerkingsnotitie opgeslagen.', false);
  }

  function initWeekOverviewSkeleton() {
    const host = document.getElementById('weekOverview');
    if (!host) return;
    host.innerHTML = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
      .map((day) => `<div class="day"><strong>${day}</strong><div>0 activiteit(en)</div></div>`)
      .join('');
  }

  async function init() {
    if (!ensureStudentAccess()) return;

    initWeekOverviewSkeleton();

    const form = document.getElementById('studentViewLoginForm');
    if (form) form.addEventListener('submit', handleLogin);

    const reflectionForm = document.getElementById('reflectionForm');
    if (reflectionForm) reflectionForm.addEventListener('submit', handleReflectionSubmit);

    const collaborationForm = document.getElementById('collaborationForm');
    if (collaborationForm) collaborationForm.addEventListener('submit', handleCollaborationSubmit);

    try {
      await window.firebaseReady;
    } catch (error) {
      console.warn('Firebase niet volledig beschikbaar, ga verder in lokale modus.', error);
      setStatus('Dashboard gestart in lokale modus.', true);
    }

    const stored = getStoredProfile();
    showActiveProfile(stored);

    if (stored) {
      document.getElementById('viewVoornaam').value = stored.voornaam || '';
      document.getElementById('viewKlas').value = stored.klas || '';
      try {
        await loadStudentScores(stored);
      } catch (error) {
        console.error('Fout bij laden leerlingdashboard:', error);
        setStatus('Kon scores niet laden.', true);
      }
    }
  }


  init();
})();
