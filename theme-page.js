const THEME_COLORS = {
  landschappen: '#4CAF50',
  levende_natuur: '#26A69A',
  belgische_geschiedenis: '#E53935',
  monsterlijke_groene_groei: '#8BC34A',
  veilig_onderweg: '#FB8C00',
  sparen: '#FBC02D',
  werkwoordstijden: '#1E88E5',
  wiskunde: '#8E24AA',
  fictie_en_nonfictie: '#3949AB',
  schatten: '#00897B',
  communiceren: '#42A5F5',
  mechanica: '#546E7A'
};

const SHARED_OVUR = [
  'Lees de opdracht en markeer de kernwoorden.',
  'Kies je aanpak en verzamel de juiste hulpmiddelen.',
  'Werk doelgericht stap voor stap.',
  'Evalueer wat goed ging en wat je volgende stap is.'
];

const THEME_CONFIG = {
  hoofdthema1: {
    title: 'Hoofdthema 1 – Landschappen',
    key: 'landschappen',
    goals: [
      { id: 'thema1unit1', title: 'Doel 1 · Landschappen herkennen', href: 'thema1unit1.html', themes: ['landschappen'] },
      { id: 'thema1unit2', title: 'Doel 2 · Kaart van Europa lezen', href: 'thema1unit2.html', themes: ['landschappen', 'belgische_geschiedenis'] },
      { id: 'thema1unit3', title: 'Doel 3 · Landschappen vergelijken', href: 'thema1unit3.html', themes: ['landschappen'] },
      { id: 'thema1unit4', title: 'Doel 4 · Mens en landschap', href: 'thema1unit4.html', themes: ['landschappen'] },
      { id: 'thema1unit5', title: 'Doel 5 · Toepassen in context', href: 'thema1unit5.html', themes: ['landschappen'] }
    ]
  },
  hoofdthema2: {
    title: 'Hoofdthema 2 – Levende natuur',
    key: 'levende_natuur',
    goals: [
      { id: 'thema2unit1', title: 'Doel 1 · Levende natuur observeren', href: 'thema2unit1.html', themes: ['levende_natuur'] },
      { id: 'thema2unit2', title: 'Doel 2 · Levenskenmerken toepassen', href: 'thema2unit2.html', themes: ['levende_natuur'] }
    ]
  },
  hoofdthema3: {
    title: 'Hoofdthema 3 – Belgische geschiedenis',
    key: 'belgische_geschiedenis',
    goals: [
      { id: 'thema9unit1', title: 'Doel 1 · Napoleon en gelijke regels', href: 'thema9unit1.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit2', title: 'Doel 2 · Vrijheden en grondrechten', href: 'thema9unit2.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit3', title: 'Doel 3 · Eerste treinrit en modernisering', href: 'thema9unit3.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit4', title: 'Doel 4 · Emilie Claeys en sociale rechten', href: 'thema9unit4.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit5', title: 'Doel 5 · Dossinkazerne in context', href: 'thema9unit5.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit6', title: 'Doel 6 · Euro en Europa vandaag', href: 'thema9unit6.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit7', title: 'Doel 7 · Brabantse Omwenteling', href: 'thema9unit7.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit8', title: 'Doel 8 · Belgische Revolutie', href: 'thema9unit8.html', themes: ['belgische_geschiedenis', 'landschappen'] }
    ]
  },
  hoofdthema4: {
    title: 'Hoofdthema 4 – Monsterlijke groene groei',
    key: 'monsterlijke_groene_groei',
    goals: [
      { id: 'monsterunit1', title: 'Doel 1 · Wat hebben planten nodig?', href: 'monsterunit1.html', themes: ['monsterlijke_groene_groei'] },
      { id: 'monsterunit2', title: 'Doel 2 · Fotosynthese begrijpen', href: 'monsterunit2.html', themes: ['monsterlijke_groene_groei'] },
      { id: 'monsterunit3', title: 'Doel 3 · Waarom planten belangrijk zijn', href: 'thema4unit3.html', themes: ['monsterlijke_groene_groei', 'levende_natuur'] }
    ]
  },
  hoofdthema5: {
    title: 'Hoofdthema 5 – Veilig onderweg',
    key: 'veilig_onderweg',
    goals: [
      { id: 'veiligonderweg_unit1', title: 'Doel 1 · Onderweg herkennen', href: 'veiligonderweg_unit1.html', themes: ['veilig_onderweg'] },
      { id: 'veiligonderweg_unit7', title: 'Doel 7 · Openbaar vervoer', href: 'veiligonderweg_unit7.html', themes: ['veilig_onderweg', 'communiceren'] }
    ]
  },
  hoofdthema6: {
    title: 'Hoofdthema 6 – Sparen',
    key: 'sparen',
    goals: [
      { id: 'thema11unit1', title: 'Doel 1 · Inkomsten en uitgaven', href: 'thema11unit1.html', themes: ['sparen'] },
      { id: 'factuur_begrijpen_shared', title: 'Doel 2 · Factuur begrijpen', href: 'thema5unit2.html', themes: ['sparen', 'fictie_en_nonfictie'] }
    ]
  },
  hoofdthema7: {
    title: 'Hoofdthema 7 – Veiligheid en preventie',
    key: 'veilig_onderweg',
    goals: [
      { id: 'noodgeval_start', title: 'Doel 1 · Noodsituaties herkennen', href: 'hoofdthema7.html', themes: ['veilig_onderweg'] },
      { id: 'noodgeval_communicatie', title: 'Doel 2 · Correct communiceren bij nood', href: 'thema7unit2.html', themes: ['veilig_onderweg', 'communiceren'] }
    ]
  },
  hoofdthema8: {
    title: 'Hoofdthema 8 – Mechanica & Lassen',
    key: 'mechanica',
    goals: [
      { id: 'mechanica8doel1', title: 'Doel 1 · Start mechanica', href: 'mechanica8doel1.html', themes: ['mechanica'] },
      { id: 'mechanica8doel2', title: 'Doel 2 · Verbindingstechnieken', href: 'mechanica8doel2.html', themes: ['mechanica'] },
      { id: 'mechanica8doel3', title: 'Doel 3 · Meten en controleren', href: 'mechanica8doel3.html', themes: ['mechanica', 'wiskunde'] },
      { id: 'mechanica8doel4', title: 'Doel 4 · Materiaal verwerken', href: 'mechanica8doel4.html', themes: ['mechanica'] },
      { id: 'mechanica8doel5', title: 'Doel 5 · Veilig werken', href: 'mechanica8doel5.html', themes: ['mechanica', 'veilig_onderweg'] },
      { id: 'mechanica8doel6', title: 'Doel 6 · Montage toepassen', href: 'mechanica8doel6.html', themes: ['mechanica'] },
      { id: 'mechanica8doel7', title: 'Doel 7 · Afwerken', href: 'mechanica8doel7.html', themes: ['mechanica'] },
      { id: 'mechanica8doel8', title: 'Doel 8 · Eindcontrole', href: 'mechanica8doel8.html', themes: ['mechanica'] }
    ]
  },
  oefenthema1: {
    title: 'Oefenthema 1 – Werkwoordstijden',
    key: 'werkwoordstijden',
    goals: [
      { id: 'thema3_1', title: 'Doel 1 · Tegenwoordige tijd', href: 'thema3_1.html', themes: ['werkwoordstijden'] },
      { id: 'thema3_2', title: 'Doel 2 · Verleden tijd', href: 'thema3_2.html', themes: ['werkwoordstijden'] },
      { id: 'thema3_all_unit1', title: 'Doel 3 · Gemengde oefening', href: 'thema3_all_unit1.html', themes: ['werkwoordstijden'] }
    ]
  },
  oefenthema2: {
    title: 'Oefenthema 2 – Wiskunde',
    key: 'wiskunde',
    goals: [
      { id: 'thema4unit1', title: 'Doel 1 · Basis omtrek', href: 'thema4unit1.html', themes: ['wiskunde'] },
      { id: 'thema4unit2', title: 'Doel 2 · Basis oppervlakte', href: 'thema4unit2.html', themes: ['wiskunde'] },
      { id: 'thema4unit3', title: 'Doel 3 · Driehoeken', href: 'thema4unit3.html', themes: ['wiskunde'] },
      { id: 'thema4unit4', title: 'Doel 4 · Samengestelde figuren', href: 'thema4unit4.html', themes: ['wiskunde'] },
      { id: 'thema4unit5', title: 'Doel 5 · Cirkels', href: 'thema4unit5.html', themes: ['wiskunde'] },
      { id: 'thema4unit6', title: 'Doel 6 · Contextopgaven', href: 'thema4unit6.html', themes: ['wiskunde'] },
      { id: 'thema4unit7', title: 'Doel 7 · Polygonen', href: 'thema4unit7.html', themes: ['wiskunde'] },
      { id: 'thema4unit8', title: 'Doel 8 · Rooster-oppervlakte', href: 'thema4unit8.html', themes: ['wiskunde'] },
      { id: 'thema4unit9', title: 'Doel 9 · Vermenigvuldigen', href: 'thema4unit9.html', themes: ['wiskunde'] },
      { id: 'thema4unit11', title: 'Doel 10 · Breuken', href: 'thema4unit11.html', themes: ['wiskunde'] },
      { id: 'thema4unit12', title: 'Doel 11 · Procenten', href: 'thema4unit12.html', themes: ['wiskunde', 'sparen'] },
      { id: 'thema4unit10', title: 'Doel 12 · Toets en herhaling', href: 'thema4unit10.html', themes: ['wiskunde'] }
    ]
  },
  oefenthema3: {
    title: 'Oefenthema 3 – Fictie en non-fictie',
    key: 'fictie_en_nonfictie',
    goals: [
      { id: 'thema5unit1', title: 'Doel 1 · Fictie of non-fictie herkennen', href: 'thema5unit1.html', themes: ['fictie_en_nonfictie'] },
      { id: 'thema5unit2', title: 'Doel 2 · Doel van de schrijver', href: 'thema5unit2.html', themes: ['fictie_en_nonfictie', 'sparen'] },
      { id: 'thema5unit3', title: 'Doel 3 · Tekstsoorten vergelijken', href: 'thema5unit3.html', themes: ['fictie_en_nonfictie'] }
    ]
  },
  oefenthema4: {
    title: 'Oefenthema 4 – Schatten',
    key: 'schatten',
    goals: [
      { id: 'thema6unit1', title: 'Doel 1 · Getallen slim afronden', href: 'thema6unit1.html', themes: ['schatten', 'wiskunde'] },
      { id: 'thema6unit2', title: 'Doel 2 · Schatten bij plus en min', href: 'thema6unit2.html', themes: ['schatten'] },
      { id: 'thema6unit3', title: 'Doel 3 · Schatten bij keer en delen', href: 'thema6unit3.html', themes: ['schatten'] }
    ]
  },
  oefenthema5: {
    title: 'Oefenthema 5 – Communiceren',
    key: 'communiceren',
    goals: [
      { id: 'thema7unit1', title: 'Doel 1 · Communicatiemodel herkennen', href: 'thema7unit1.html', themes: ['communiceren'] },
      { id: 'thema7unit2', title: 'Doel 2 · Formeel en beleefd formuleren', href: 'thema7unit2.html', themes: ['communiceren'] },
      { id: 'thema7unit3', title: 'Doel 3 · Duidelijke berichten maken', href: 'thema7unit3.html', themes: ['communiceren'] }
    ]
  },
  oefenthema6: {
    title: 'Oefenthema 6 – Actualiteit',
    key: 'fictie_en_nonfictie',
    goals: [
      { id: 'thema8unit1', title: 'Doel 1 · Nieuws analyseren', href: 'thema8unit1.html', themes: ['fictie_en_nonfictie'] },
      { id: 'thema8unit2', title: 'Doel 2 · Bronnen vergelijken', href: 'thema8unit2.html', themes: ['fictie_en_nonfictie'] },
      { id: 'thema8unit3', title: 'Doel 3 · Reflecteren op actualiteit', href: 'thema8unit3.html', themes: ['fictie_en_nonfictie', 'communiceren'] }
    ]
  }
};

function softColor(hex) {
  return `color-mix(in srgb, ${hex} 16%, white)`;
}

function getStoredProgress() {
  return JSON.parse(localStorage.getItem('pavProgressV2') || '{}');
}

function setStoredProgress(progress) {
  localStorage.setItem('pavProgressV2', JSON.stringify(progress));
}

function getGoalStatus(goals) {
  const progress = getStoredProgress();
  return goals.map((goal, index) => {
    if (progress[goal.id]) return 'completed';
    if (index === 0 || progress[goals[index - 1].id]) return 'active';
    return 'locked';
  });
}

function renderThemePage(themeId) {
  const config = THEME_CONFIG[themeId];
  if (!config) return;

  const color = THEME_COLORS[config.key] || '#4CAF50';
  document.documentElement.style.setProperty('--theme-color', color);
  document.documentElement.style.setProperty('--theme-soft', softColor(color));
  document.getElementById('themeTitle').textContent = config.title;
  document.title = `${config.title} | PAV`;

  const metro = document.getElementById('metroLine');
  const overview = document.getElementById('goalsOverview');
  const assignment = document.getElementById('assignmentView');
  const ovur = document.getElementById('ovurGrid');

  function renderGoal(goal, status) {
    assignment.innerHTML = `
      <h3>${goal.title}</h3>
      <p>Werk aan dit doel via de opdracht en duid daarna je voortgang aan.</p>
      <p><a class="goal-action" href="${goal.href}" style="text-decoration:none;display:inline-block;">Open opdracht</a></p>
      <button class="complete-btn" id="completeGoalBtn" ${status === 'locked' ? 'disabled' : ''}>Doel voltooien</button>
    `;

    const ovurItems = goal.ovur || SHARED_OVUR;
    ovur.innerHTML = ['Oriënteren', 'Voorbereiden', 'Uitvoeren', 'Reflecteren']
      .map((title, i) => `<article class="ovur-block"><strong>${title}</strong><div>${ovurItems[i]}</div></article>`)
      .join('');

    const completeBtn = document.getElementById('completeGoalBtn');
    if (!completeBtn) return;
    completeBtn.addEventListener('click', () => {
      const progress = getStoredProgress();
      progress[goal.id] = true;
      setStoredProgress(progress);
      draw(goal.id, goal.id);
    });
  }

  function draw(selectedGoalId = config.goals[0].id, pulseGoalId = null) {
    const statuses = getGoalStatus(config.goals);
    const completed = statuses.filter((s) => s === 'completed').length;
    const pct = Math.round((completed / config.goals.length) * 100);

    document.getElementById('progressPercent').textContent = `${pct}%`;
    document.getElementById('progressFill').style.width = `${pct}%`;

    metro.innerHTML = '';
    overview.innerHTML = '';

    config.goals.forEach((goal, index) => {
      const status = statuses[index];
      const stop = document.createElement('button');
      stop.className = `stop ${status}${pulseGoalId === goal.id ? ' just-completed' : ''}`;
      stop.disabled = status === 'locked';
      stop.innerHTML = `
        <div class="stop-head"><span class="node"></span><span class="connector"></span></div>
        <div class="stop-content">
          <div class="stop-title">${goal.title}</div>
          <div class="stop-labels">${goal.themes.map((themeKey) => `<span class="stop-label">${themeKey.replaceAll('_', ' ')}</span>`).join('')}</div>
        </div>
      `;
      stop.addEventListener('click', () => renderGoal(goal, status));
      metro.appendChild(stop);

      const card = document.createElement('article');
      card.className = 'goal-card';
      card.innerHTML = `<div><strong>${goal.title}</strong><span>Status: ${status}</span></div>`;
      const action = document.createElement('button');
      action.className = 'goal-action';
      action.disabled = status === 'locked';
      action.textContent = status === 'completed' ? 'Herbekijk' : 'Open';
      action.addEventListener('click', () => renderGoal(goal, status));
      card.appendChild(action);
      overview.appendChild(card);
    });

    const selectedIndex = Math.max(0, config.goals.findIndex((goal) => goal.id === selectedGoalId));
    renderGoal(config.goals[selectedIndex], statuses[selectedIndex]);
  }

  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  renderThemePage(document.body.dataset.themeId);
});
