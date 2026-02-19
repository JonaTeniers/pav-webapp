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

      .question-box,
      .card {
        background: rgba(255,255,255,0.95) !important;
        border: 1px solid #c8ddf0;
      }

      .all-question-list {
        display: grid;
        gap: 0.8rem;
      }

      .question-item {
        border: 1px solid #c8ddf0;
        border-radius: 10px;
        padding: 0.8rem;
        background: #f6fbff;
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
    `;
    document.head.appendChild(style);
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
        inputHtml = (q.options || []).map((opt, i) => `<label><input type="radio" name="q-${index}" value="${i}"> ${opt}</label>`).join('');
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

      const xp = document.getElementById('xpScore');
      if (xp) xp.textContent = String(totalScore);
      const endScreen = document.getElementById('endScreen');
      if (endScreen) endScreen.classList.remove('hidden');
    });
  }

  function parseUnitContext() {
    const filename = window.location.pathname.split('/').pop() || '';

    // VERPLICHT formaat: themaXunitY.html
    const match = filename.match(/^thema(\d+)unit(\d+)\.html$/i);
    if (!match) return null;

    const themeNumber = Number(match[1]);
    const unitNumber = Number(match[2]);

    return {
      themeNumber,
      unitNumber,
      themeFile: `thema${themeNumber}.html`,
      nextUnitFile: `thema${themeNumber}unit${unitNumber + 1}.html`
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
        `← Terug naar Thema ${context.themeNumber}`
      )
    );

    // VOLGENDE UNIT (alleen als bestand bestaat)
    const hasNext = await pageExists(context.nextUnitFile);

    if (hasNext) {
      navContainer.appendChild(
        createButtonLink(context.nextUnitFile, '→ Volgende unit')
      );
    } else {
      // IN AANBOUW
      const buildingMessage = document.createElement('p');
      buildingMessage.textContent = 'Deze unit is PAVO nog aan het bouwen.';
      buildingMessage.style.fontWeight = '700';
      buildingMessage.style.marginTop = '1rem';
      buildingMessage.style.textAlign = 'center';

      const buildingImage = document.createElement('img');
      buildingImage.src = 'img/images/pavobouwmascotte.png';
      buildingImage.alt = 'PAVO mascotte werkt aan de volgende unit';
      buildingImage.style.maxWidth = '120px';
      buildingImage.style.display = 'block';
      buildingImage.style.margin = '0.5rem auto 0';

      navContainer.appendChild(buildingMessage);
      navContainer.appendChild(buildingImage);
    }
  }

  function setupAllInOneUnitMode() {
    applyUnitThemeRefresh();
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
