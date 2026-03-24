(function () {

  function applyUnitThemeRefresh() {
    if (document.getElementById('unitThemeRefresh')) return;

    const style = document.createElement('style');
    style.id = 'unitThemeRefresh';
    style.textContent = `
      body {
        min-height: 100vh;
        background: linear-gradient(135deg, #cfe9ff 0%, #7bb6f0 100%) !important;
        position: relative;
        overflow-x: hidden;
      }

      body::before,
      body::after {
        content: "";
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
      }

      body::before {
        width: 520px;
        height: 520px;
        background: rgba(255,255,255,0.24);
        top: -170px;
        left: -170px;
        filter: blur(40px);
      }

      body::after {
        width: 420px;
        height: 420px;
        background: rgba(0, 90, 170, 0.22);
        right: -130px;
        bottom: -130px;
        filter: blur(34px);
      }

      header, main {
        position: relative;
        z-index: 1;
      }

      header {
        background: linear-gradient(120deg, #0f4a7a, #2d7fbd) !important;
        color: #fff;
        border-bottom-left-radius: 18px;
        border-bottom-right-radius: 18px;
        box-shadow: 0 8px 22px rgba(9, 43, 73, 0.28);
      }

      main {
        width: min(1120px, 95%);
        margin: 1.2rem auto 2rem;
      }

      .question-box,
      .card {
        background: rgba(255,255,255,0.95) !important;
        border: 1px solid #c8ddf0;
        box-shadow: 0 8px 18px rgba(10, 47, 78, 0.12);
        border-radius: 16px;
      }

      #quizBox,
      #endScreen {
        max-width: 980px;
        margin: 1rem auto;
        padding: 1.6rem;
      }

      #quizBox > h2 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }

      h1, h2, h3 {
        color: #0f3f67;
      }

      header h1,
      header h2,
      header h3,
      header p {
        color: #fff !important;
      }

      button {
        border: none;
        border-radius: 999px;
        background: linear-gradient(90deg, #0f6a9d, #1883b8) !important;
        color: #fff;
        font-weight: 800;
        box-shadow: 0 3px 10px rgba(9, 52, 84, 0.2);
      }

      button:hover {
        background: linear-gradient(90deg, #0d5d8b, #156f9c) !important;
      }

      .helper {
        color: #365c75;
      }

      .all-question-list {
        display: grid;
        gap: 0.8rem;
      }

      .question-item {
        border: 1px solid #c8ddf0;
        border-radius: 10px;
        padding: 1rem;
        background: #f4f8fc;
      }

      .question-item h3 {
        margin: 0 0 0.3rem;
        font-size: 1.03rem;
      }

      .q-meta {
        display: inline-block;
        font-size: 0.82rem;
        color: #0f4a7a;
        font-weight: 800;
        margin-bottom: 0.4rem;
      }

      .question-item .feedback {
        margin-top: 0.45rem;
      }

      .smart-support {
        border-left: 6px solid #e57373;
      }

      .smart-growth {
        border-left: 6px solid #ffb74d;
      }

      .smart-challenge {
        border-left: 6px solid #4db6ac;
      }

      .question-item label {
        display: block;
        padding: 0.4rem 0.2rem;
      }

      .question-item img,
      .question-box img,
      .card img {
        width: min(100%, 420px);
        max-height: 260px;
        object-fit: contain;
        display: block;
        margin: 0.65rem auto;
        border: 1px solid #c8ddf0;
        border-radius: 10px;
        padding: 8px;
        background: #f8fbff;
      }

      .nav-buttons {
        gap: 0.55rem;
      }
    `;
    document.head.appendChild(style);
  }

  function harmonizeGoalLabels() {
    document.querySelectorAll('header h1, header p').forEach((el) => {
      el.textContent = el.textContent.replace(/\bUnit\b/g, 'Doel');
    });

    document.querySelectorAll('h1').forEach((el) => {
      const cleaned = el.textContent
        .replace(/thema\s*\d+\s*[-–]\s*/i, '')
        .replace(/\bunit\b/gi, 'Doel')
        .trim();
      if (cleaned) el.textContent = cleaned;
    });
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function inferDoneKey(filename) {
    const themed = filename.match(/^thema(\d+)unit(\d+)\.html$/i);
    if (themed) return `thema${themed[1]}unit${themed[2]}_done`;

    const veilig = filename.match(/^veiligonderweg_unit(\d+)\.html$/i);
    if (veilig) return `thema5unit${veilig[1]}_done`;

    return null;
  }



  const PROFILE_KEY = 'pavo_leerling_profiel';
  const REFLECTIONS_KEY = 'pavo_score_reflections';

  function getStudentProfile() {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function inferThemaUnitFromPath() {
    const page = window.location.pathname.toLowerCase();
    const thema = page.match(/thema\d+/);
    const unit = page.match(/unit\d+/);
    return {
      thema: thema ? thema[0] : null,
      unit: unit ? unit[0] : null
    };
  }

  function disableUnitUntilLogin() {
    const profile = getStudentProfile();
    if (profile?.voornaam && profile?.klas) return true;

    const quizBox = document.getElementById('quizBox') || document.querySelector('main');
    if (quizBox && !document.getElementById('loginRequiredBox')) {
      const info = document.createElement('div');
      info.id = 'loginRequiredBox';
      info.className = 'feedback error';
      info.style.marginBottom = '0.8rem';
      info.textContent = 'Log eerst in als leerling (voornaam + klas) via het leerlingdashboard om dit doel te spelen en score op te slaan.';
      quizBox.prepend(info);
    }

    document.querySelectorAll('input, textarea, select, button').forEach((el) => {
      if (el.closest('.nav-buttons')) return;
      el.disabled = true;
    });
    return false;
  }

  function saveReflectionLocal(payload) {
    let all = [];
    try {
      all = JSON.parse(localStorage.getItem(REFLECTIONS_KEY) || '[]');
    } catch {
      all = [];
    }
    all.unshift(payload);
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(all));
  }

  async function saveReflectionBoth(payload) {
    saveReflectionLocal(payload);
    if (!window.db) return;
    try {
      await window.db.collection('score_reflections').add({
        ...payload,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.warn('Opslaan score_reflections in Firestore mislukt, lokaal bewaard.', error);
    }
  }

  function renderReflectionAfterScore(container, context) {
    if (!container || document.getElementById('postScoreReflectionForm')) return;

    const box = document.createElement('section');
    box.className = 'question-item';
    box.innerHTML = `
      <h3>Reflectie direct na je score</h3>
      <p class="helper">Deze reflectie hoort bij dit doel en wordt zichtbaar voor de leerkracht.</p>
      <form id="postScoreReflectionForm" style="display:grid;gap:8px;">
        <label>Wat heb je geleerd?<textarea id="postReflect1" required></textarea></label>
        <label>Wat vond je moeilijk?<textarea id="postReflect2" required></textarea></label>
        <label>Wat zou je volgende keer anders doen?<textarea id="postReflect3" required></textarea></label>
        <button type="submit">Reflectie opslaan</button>
      </form>
      <div id="postReflectionStatus" class="feedback"></div>
    `;
    container.appendChild(box);

    document.getElementById('postScoreReflectionForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const profile = getStudentProfile();
      if (!profile?.voornaam || !profile?.klas) return;

      const payload = {
        naam: profile.voornaam,
        klas: profile.klas,
        thema: context.thema,
        unit: context.unit,
        score: context.score,
        bronPagina: window.location.pathname,
        antwoord1: document.getElementById('postReflect1')?.value?.trim() || '',
        antwoord2: document.getElementById('postReflect2')?.value?.trim() || '',
        antwoord3: document.getElementById('postReflect3')?.value?.trim() || ''
      };

      if (!payload.antwoord1 || !payload.antwoord2 || !payload.antwoord3) return;

      await saveReflectionBoth(payload);
      const status = document.getElementById('postReflectionStatus');
      if (status) {
        status.textContent = '✅ Reflectie opgeslagen voor leerkracht.';
        status.className = 'feedback success';
      }
      event.target.reset();
    });
  }

  function buildSmartAdvice(context) {
    const maxScore = Math.max(1, Number(context?.maxScore) || 1);
    const score = Math.max(0, Number(context?.score) || 0);
    const ratio = score / maxScore;

    if (ratio < 0.5) {
      return {
        level: 'support',
        title: '🧭 Slim leeradvies: eerst je basis versterken',
        text: 'Dit doel lijkt nog moeilijk. Werk stap voor stap: herbekijk de theorie, maak het doel opnieuw en bespreek fouten met je leerkracht.',
        actionLabel: '🔁 Herstart dit doel',
        badge: 'Basisversterking'
      };
    }

    if (ratio < 0.8) {
      return {
        level: 'growth',
        title: '📈 Slim leeradvies: opbouw en verdieping',
        text: 'Je bent goed op weg. Oefen nog gericht op je foutjes en probeer daarna een extra oefening in hetzelfde thema.',
        actionLabel: '🎯 Oefen dit doel opnieuw',
        badge: 'Gerichte groei'
      };
    }

    return {
      level: 'challenge',
      title: '🚀 Slim leeradvies: klaar voor extra uitdaging',
      text: 'Sterk gewerkt! Je beheerst dit doel goed. Ga nu verder met extra oefeningen of met het volgende doel in dit thema.',
      actionLabel: '➡️ Ga naar extra oefenkansen',
      badge: 'Uitdaging'
    };
  }

  function renderSmartDifferentiation(container, context) {
    if (!container || document.getElementById('smartDifferentiationBox')) return;

    const advice = buildSmartAdvice(context);
    const scoreText = `${context.score}/${context.maxScore} XP`;
    const retryLink = window.location.pathname.split('/').pop() || 'index.html';
    const nextLink = context.nextUnitFile || context.themeFile || retryLink;
    const primaryLink = advice.level === 'challenge' ? nextLink : retryLink;

    const box = document.createElement('section');
    box.id = 'smartDifferentiationBox';
    box.className = `question-item smart-${advice.level}`;
    box.innerHTML = `
      <h3>${advice.title}</h3>
      <p class="helper"><strong>Niveau:</strong> ${advice.badge} · <strong>Score:</strong> ${scoreText}</p>
      <p>${advice.text}</p>
      <div class="nav-buttons">
        <a href="${primaryLink}"><button type="button">${advice.actionLabel}</button></a>
        <a href="${context.themeFile || retryLink}"><button type="button">📚 Terug naar thema-overzicht</button></a>
      </div>
    `;
    container.appendChild(box);
  }

  function isCorrectAnswer(question, value) {
    if (question.type === 'mc') {
      return Number(value) === Number(question.correctIndex);
    }

    if (question.type === 'drag') {
      return normalize(value) === normalize(question.correctValue);
    }

    if (question.type === 'open') {
      const input = normalize(value);
      if (!input) return false;
      return (question.accepted || []).some((answer) => {
        const expected = normalize(answer);
        return input.includes(expected) || expected.includes(input);
      });
    }

    if (question.type === 'rewrite') {
      return normalize(value).length >= 25;
    }

    return false;
  }

  function getMcOptions(question) {
    if (!Array.isArray(question?.options)) return [];
    if (Array.isArray(question._shuffledOptions)) return question._shuffledOptions;

    const shuffled = question.options.map((text, originalIndex) => ({ text, originalIndex }));
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    question._shuffledOptions = shuffled;
    return shuffled;
  }

  function collectQuestionsFromExistingFlow() {
    const qCountEl = document.getElementById('qCount');
    const qTypeEl = document.getElementById('qType');
    const qTextEl = document.getElementById('questionText');
    const answerForm = document.getElementById('answerForm');
    if (!qCountEl || !qTextEl || !answerForm || typeof window.nextQuestion !== 'function') return [];

    const match = (qCountEl.textContent || '').match(/van\s+(\d+)/i);
    const total = match ? Number(match[1]) : 0;
    if (!total) return [];

    const snapshots = [];
    for (let i = 0; i < total; i++) {
      snapshots.push({
        typeLabel: (qTypeEl?.textContent || '').trim(),
        question: (qTextEl?.textContent || '').trim(),
        answerHtml: answerForm.innerHTML
      });
      if (i < total - 1) window.nextQuestion();
    }

    const endScreen = document.getElementById('endScreen');
    if (endScreen) endScreen.classList.add('hidden');
    const reflectieBox = document.getElementById('reflectieBox');
    if (reflectieBox) reflectieBox.classList.remove('hidden');

    return snapshots;
  }

  function buildAllQuestionsView() {
    const quizBox = document.getElementById('quizBox');
    if (!quizBox) return;

    const filename = window.location.pathname.split('/').pop() || '';
    const storageKey = filename.replace(/\.html$/i, '');
    const doneKey = inferDoneKey(filename);
    let totalScore = 0;

    const hasQuestionArray = Array.isArray(window.questions) && window.questions.length;
    const fallbackQuestions = hasQuestionArray ? [] : collectQuestionsFromExistingFlow();
    const renderQuestions = hasQuestionArray ? window.questions : fallbackQuestions;
    if (!renderQuestions.length) return;

    quizBox.innerHTML = `
      <h2>Opdrachten van dit doel</h2>
      <p class="helper">Alles staat op één pagina. Werk opdracht per opdracht af en klik daarna op <strong>Rond opdracht af</strong>.</p>
      <div id="allQuestionsList" class="all-question-list"></div>
      <div class="nav-buttons" style="margin-top:1rem;">
        <button id="finishAllBtn" type="button">Rond opdracht af</button>
      </div>
      <div class="feedback" id="allQuestionsFeedback"></div>
    `;

    const list = document.getElementById('allQuestionsList');

    renderQuestions.forEach((q, index) => {
      const item = document.createElement('article');
      item.className = 'question-item';
      item.dataset.index = String(index);

      let inputHtml = '';
      if (!hasQuestionArray) {
        inputHtml = q.answerHtml || `<input class="text-input" type="text" name="q-${index}" placeholder="Typ je antwoord...">`;
      } else if (q.type === 'mc') {
        inputHtml = getMcOptions(q)
          .map((opt) => `<label><input type="radio" name="q-${index}" value="${opt.originalIndex}"> ${opt.text}</label>`)
          .join('');
      } else if (q.type === 'drag') {
        const options = ['Kies...', ...(q.options || [])];
        inputHtml = `<select class="select-input" name="q-${index}">${options.map((opt) => `<option value="${opt}">${opt}</option>`).join('')}</select>`;
      } else if (q.type === 'rewrite') {
        const subject = q.mailSubject ? `<p><strong>Onderwerp:</strong> ${q.mailSubject}</p>` : '';
        const body = Array.isArray(q.mailBody) ? `<div class="fragment"><strong>Te herschrijven mail:</strong><p>${q.mailBody.join('<br>')}</p></div>` : '';
        inputHtml = `${subject}${body}<textarea name="q-${index}" class="text-input" placeholder="Schrijf je herwerkte versie hier..."></textarea>`;
      } else {
        inputHtml = `<input class="text-input" type="text" name="q-${index}" placeholder="Typ je antwoord...">`;
      }

      item.innerHTML = `
        <span class="q-meta">Vraag ${index + 1} · ${q.typeLabel || q.type || 'Opdracht'}</span>
        <h3>${q.question || 'Opdracht'}</h3>
        <div class="answer-wrap">${inputHtml}</div>
        ${hasQuestionArray ? '<button type="button" class="check-one-btn">Controleer</button>' : ''}
        <div class="feedback"></div>
      `;

      list.appendChild(item);
    });

    if (hasQuestionArray) list.addEventListener('click', (event) => {
      const button = event.target.closest('.check-one-btn');
      if (!button) return;

      const item = button.closest('.question-item');
      if (!item) return;

      const index = Number(item.dataset.index);
      const q = renderQuestions[index];
      const feedback = item.querySelector('.feedback');

      let value = '';
      if (q.type === 'mc') {
        value = item.querySelector(`input[name="q-${index}"]:checked`)?.value ?? '';
      } else if (q.type === 'drag') {
        const selected = item.querySelector(`select[name="q-${index}"]`);
        value = selected?.value === 'Kies...' ? '' : selected?.value;
      } else {
        value = item.querySelector(`[name="q-${index}"]`)?.value ?? '';
      }

      const correct = isCorrectAnswer(q, value);
      item.dataset.correct = correct ? '1' : '0';

      if (!value) {
        feedback.textContent = '⚠️ Vul eerst een antwoord in.';
        feedback.className = 'feedback error';
        return;
      }

      if (correct) {
        feedback.textContent = '✅ Juist!';
        feedback.className = 'feedback success';
      } else {
        feedback.textContent = '❌ Nog niet juist. Probeer opnieuw.';
        feedback.className = 'feedback error';
      }
    });

    document.getElementById('finishAllBtn')?.addEventListener('click', () => {
      totalScore = 0;
      const items = Array.from(list.querySelectorAll('.question-item'));
      const maxScore = renderQuestions.length * 3;
      const checked = hasQuestionArray
        ? items.filter((item) => item.dataset.correct === '1').length
        : items.length;

      if (hasQuestionArray) {
        items.forEach((item) => {
          if (item.dataset.correct === '1') totalScore += 3;
        });
      }

      localStorage.setItem(storageKey, String(totalScore));
      if (doneKey) localStorage.setItem(doneKey, 'true');

      if (window.pavoSyncScore) {
        window.pavoSyncScore(storageKey, totalScore);
      }

      const summary = document.getElementById('allQuestionsFeedback');
      summary.textContent = hasQuestionArray
        ? `Je scoorde ${totalScore} XP (${checked}/${renderQuestions.length} juist).`
        : `Opdrachten opgeslagen. Je kan verder met reflectie en afronding.`;
      summary.className = 'feedback success';

      const inferred = inferThemaUnitFromPath();
      const navContext = parseUnitContext() || {};
      renderReflectionAfterScore(summary.parentElement, {
        thema: inferred.thema,
        unit: inferred.unit,
        score: totalScore
      });
      renderSmartDifferentiation(summary.parentElement, {
        score: totalScore,
        maxScore,
        themeFile: navContext.themeFile,
        nextUnitFile: navContext.nextUnitFile
      });

      const xp = document.getElementById('xpScore');
      if (xp) xp.textContent = String(totalScore);
      const endScreen = document.getElementById('endScreen');
      if (endScreen) endScreen.classList.remove('hidden');
    });
  }

  function findThemeBackLink() {
    const links = Array.from(document.querySelectorAll('a[href]'));
    const withLabel = links.find((link) => /terug naar thema/i.test(link.textContent || ''));
    if (withLabel) return withLabel.getAttribute('href');

    const backLink = document.querySelector('.back-link[href]');
    if (backLink) return backLink.getAttribute('href');

    return null;
  }

  function inferNextUnitFile(filename) {
    const patterns = [
      /^(thema\d+unit)(\d+)(\.html)$/i,
      /^(thema\d+_\d+_unit)(\d+)(\.html)$/i,
      /^(veiligonderweg_unit)(\d+)(\.html)$/i,
      /^(monsterunit)(\d+)(\.html)$/i
    ];

    for (const pattern of patterns) {
      const match = filename.match(pattern);
      if (!match) continue;
      const nextNumber = Number(match[2]) + 1;
      return `${match[1]}${nextNumber}${match[3]}`;
    }

    return null;
  }

  function parseUnitContext() {
    const filename = window.location.pathname.split('/').pop() || '';

    const themed = filename.match(/^thema(\d+)unit(\d+)\.html$/i);
    const legacyThemed = filename.match(/^thema(\d+)_\d+_unit(\d+)\.html$/i);
    const veilig = filename.match(/^veiligonderweg_unit(\d+)\.html$/i);

    const unitNumber = themed
      ? Number(themed[2])
      : legacyThemed
      ? Number(legacyThemed[2])
      : veilig
      ? Number(veilig[1])
      : null;

    const themeBackLink = findThemeBackLink();
    const nextUnitFile = inferNextUnitFile(filename);

    if (!themeBackLink) return null;

    return {
      unitNumber,
      themeFile: themeBackLink,
      nextUnitFile
    };
  }

  function createButtonLink(href, label) {
    const link = document.createElement('a');
    link.href = href;

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;

    link.appendChild(button);
    return link;
  }

  async function pageExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  async function setupUnitNavigation() {
    const endScreen = document.getElementById('endScreen');
    const navContainer = endScreen?.querySelector('.nav-buttons');
    if (!navContainer) return;

    const context = parseUnitContext();
    if (!context) return;

    navContainer.innerHTML = '';

    // TERUG NAAR THEMA
    navContainer.appendChild(
      createButtonLink(
        context.themeFile,
        '← Terug naar thema'
      )
    );

    if (!context.nextUnitFile) return;

    const hasNext = await pageExists(context.nextUnitFile);

    if (hasNext) {
      navContainer.appendChild(
        createButtonLink(context.nextUnitFile, '→ Volgend doel')
      );
    }
  }

  function setupAllInOneUnitMode() {
    applyUnitThemeRefresh();
    harmonizeGoalLabels();
    const canPlay = disableUnitUntilLogin();
    if (!canPlay) return;
    buildAllQuestionsView();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupUnitNavigation);
    window.addEventListener('load', setupAllInOneUnitMode);
  } else {
    setupUnitNavigation();
    window.addEventListener('load', setupAllInOneUnitMode);
  }

})();
