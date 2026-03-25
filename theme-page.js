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
      { id: 'thema1unit5', title: 'Doel 5 · Toepassen in context', href: 'thema1unit5.html', themes: ['landschappen'] },
      { id: 'landschap_d6', title: 'Doel 6 · Verdieping landschap', development: true, themes: ['landschappen'] },
      { id: 'landschap_d7', title: 'Doel 7 · Landschap en klimaat', development: true, themes: ['landschappen'] },
      { id: 'landschap_d8', title: 'Doel 8 · Kaartvaardigheid extra', development: true, themes: ['landschappen'] },
      { id: 'landschap_d9', title: 'Doel 9 · Infrastructuur analyseren', development: true, themes: ['landschappen'] },
      { id: 'landschap_d10', title: 'Doel 10 · Menselijke impact', development: true, themes: ['landschappen'] },
      { id: 'landschap_d11', title: 'Doel 11 · Oefenreeks', development: true, themes: ['landschappen'] },
      { id: 'landschap_d12', title: 'Doel 12 · Eindreflectie', development: true, themes: ['landschappen'] }
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
      { id: 'thema9unit1', title: 'Napoleon en gelijke regels', href: 'thema9unit1.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit2', title: 'Vrijheden en grondrechten', href: 'thema9unit2.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit3', title: 'Eerste treinrit en modernisering', href: 'thema9unit3.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit4', title: 'Emilie Claeys en sociale rechten', href: 'thema9unit4.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit5', title: 'Dossinkazerne: herinneren en begrijpen', href: 'thema9unit5.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit6', title: 'De euro en Europa vandaag', href: 'thema9unit6.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit7', title: 'Brabantse Omwenteling en Boerenkrijg', href: 'thema9unit7.html', themes: ['belgische_geschiedenis'] },
      { id: 'thema9unit8', title: 'Belgische Revolutie: oorzaken en gevolgen', href: 'thema9unit8.html', themes: ['belgische_geschiedenis', 'landschappen'] },
      { id: 'belg_d9', title: 'Doel 9 · Synthese Belgische geschiedenis', development: true, themes: ['belgische_geschiedenis'] }
    ]
  },
  hoofdthema4: {
    title: 'Hoofdthema 4 – Monsterlijke groene groei',
    key: 'monsterlijke_groene_groei',
    goals: [
      { id: 'monsterunit1', title: 'Doel 1 · Wat hebben planten nodig?', href: 'monsterunit1.html', themes: ['monsterlijke_groene_groei'] },
      { id: 'monsterunit2', title: 'Doel 2 · Fotosynthese begrijpen', href: 'monsterunit2.html', themes: ['monsterlijke_groene_groei'] },
      { id: 'monsterunit3_alt', title: 'Doel 3 · Waarom planten belangrijk zijn', href: 'thema4unit3.html', themes: ['monsterlijke_groene_groei', 'levende_natuur'] }
    ]
  },
  hoofdthema5: {
    title: 'Hoofdthema 5 – Veilig onderweg',
    key: 'veilig_onderweg',
    goals: [
      { id: 'veiligonderweg_unit1', title: 'Doel 1 · Onderweg herkennen', href: 'veiligonderweg_unit1.html', themes: ['veilig_onderweg'] },
      { id: 'veiligonderweg_unit2', title: 'Doel 2 · Verkeerssituaties inschatten', development: true, themes: ['veilig_onderweg'] },
      { id: 'veiligonderweg_unit3', title: 'Doel 3 · Veilige keuzes maken', development: true, themes: ['veilig_onderweg'] },
      { id: 'veiligonderweg_unit4', title: 'Doel 4 · Signalen juist lezen', development: true, themes: ['veilig_onderweg'] },
      { id: 'veiligonderweg_unit5', title: 'Doel 5 · Gedrag onderweg', development: true, themes: ['veilig_onderweg'] },
      { id: 'veiligonderweg_unit6', title: 'Doel 6 · Route voorbereiden', development: true, themes: ['veilig_onderweg'] },
      { id: 'veiligonderweg_unit7', title: 'Doel 7 · Openbaar vervoer', href: 'veiligonderweg_unit7.html', themes: ['veilig_onderweg', 'communiceren'] }
    ]
  },
  hoofdthema6: {
    title: 'Hoofdthema 6 – Sparen',
    key: 'sparen',
    goals: [
      { id: 'thema11unit1', title: 'Doel 1 · Inkomsten en uitgaven', href: 'thema11unit1.html', themes: ['sparen'] },
      { id: 'thema11_overzicht', title: 'Doel 2 · Spaarkeuzes in context', href: 'thema11.html', themes: ['sparen'] },
      { id: 'factuur_begrijpen_shared', title: 'Doel 3 · Factuur begrijpen', href: 'thema5unit2.html', themes: ['sparen', 'fictie_en_nonfictie'] }
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
    goals: Array.from({ length: 8 }, (_, i) => ({
      id: `mechanica8doel${i + 1}`,
      title: `Doel ${i + 1} · Mechanica`,
      href: `mechanica8doel${i + 1}.html`,
      themes: i === 2 ? ['mechanica', 'wiskunde'] : ['mechanica']
    }))
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
      { id: 'thema4unit1', title: 'Basis omtrek', href: 'thema4unit1.html', themes: ['wiskunde'] },
      { id: 'thema4unit2', title: 'Basis oppervlakte', href: 'thema4unit2.html', themes: ['wiskunde'] },
      { id: 'thema4unit3', title: 'Driehoeken', href: 'thema4unit3.html', themes: ['wiskunde'] },
      { id: 'thema4unit4', title: 'Samengestelde figuren', href: 'thema4unit4.html', themes: ['wiskunde'] },
      { id: 'thema4unit5', title: 'Cirkels', href: 'thema4unit5.html', themes: ['wiskunde'] },
      { id: 'thema4unit6', title: 'Omtrek en oppervlakte in context', href: 'thema4unit6.html', themes: ['wiskunde'] },
      { id: 'thema4unit7', title: 'Omtrek van polygonen', href: 'thema4unit7.html', themes: ['wiskunde'] },
      { id: 'thema4unit8', title: 'Oppervlakte met rooster', href: 'thema4unit8.html', themes: ['wiskunde'] },
      { id: 'thema4unit9', title: 'Vermenigvuldigingsstrategieën', href: 'thema4unit9.html', themes: ['wiskunde'] },
      { id: 'thema4unit11', title: 'Breuken: basis en bewerkingen', href: 'thema4unit11.html', themes: ['wiskunde'] },
      { id: 'thema4unit12', title: 'Procenten in context', href: 'thema4unit12.html', themes: ['wiskunde', 'sparen'] },
      { id: 'thema4unit10', title: 'Toets en herhaling', href: 'thema4unit10.html', themes: ['wiskunde'] }
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
    goals: [1,2,3].map((n) => ({
      id: `thema6unit${n}`,
      title: `Doel ${n} · Schatten`,
      href: `thema6unit${n}.html`,
      themes: n === 1 ? ['schatten', 'wiskunde'] : ['schatten']
    }))
  },
  oefenthema5: {
    title: 'Oefenthema 5 – Communiceren',
    key: 'communiceren',
    goals: [1,2,3].map((n) => ({
      id: `thema7unit${n}`,
      title: `Doel ${n} · Communiceren`,
      href: `thema7unit${n}.html`,
      themes: ['communiceren']
    }))
  },
  oefenthema6: {
    title: 'Oefenthema 6 – Actualiteit',
    key: 'fictie_en_nonfictie',
    goals: [1,2,3].map((n) => ({
      id: `thema8unit${n}`,
      title: `Doel ${n} · Actualiteit`,
      href: `thema8unit${n}.html`,
      themes: n === 3 ? ['fictie_en_nonfictie', 'communiceren'] : ['fictie_en_nonfictie']
    }))
  }
};

function softColor(hex) {
  return `color-mix(in srgb, ${hex} 16%, white)`;
}

function getProgressStorageKey() {
  try {
    const raw = localStorage.getItem('pavo_leerling_profiel');
    const profile = raw ? JSON.parse(raw) : null;
    if (profile?.voornaam && profile?.klas) {
      return `pavProgressV2_${String(profile.voornaam).toLowerCase()}_${String(profile.klas).toLowerCase()}`;
    }
  } catch (error) {
    console.warn('Kon leerlingprofiel niet lezen voor voortgangssleutel.', error);
  }
  return 'pavProgressV2';
}

function getStoredProgress() {
  return JSON.parse(localStorage.getItem(getProgressStorageKey()) || '{}');
}

function setStoredProgress(progress) {
  localStorage.setItem(getProgressStorageKey(), JSON.stringify(progress));
}

function getGoalStatus(goals) {
  const progress = getStoredProgress();
  return goals.map((goal, index) => {
    if (goal.development) return 'development';
    if (progress[goal.id]) return 'completed';
    if (index === 0 || progress[goals[index - 1].id] || goals[index - 1].development) return 'active';
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
    const canOpen = Boolean(goal.href && !goal.development);
    assignment.innerHTML = `
      <h3>${goal.title}</h3>
      <p>${goal.development ? 'Dit doel staat klaar in de leerlijn en wordt binnenkort toegevoegd.' : 'Werk aan dit doel via de opdracht en duid daarna je voortgang aan.'}</p>
      <p>${canOpen ? `<a class="goal-action" href="${goal.href}" style="text-decoration:none;display:inline-block;">Open opdracht</a>` : '<button class="goal-action" disabled>Binnenkort beschikbaar</button>'}</p>
      <button class="complete-btn" id="completeGoalBtn" ${status === 'locked' || goal.development ? 'disabled' : ''}>Doel voltooien</button>
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
    const playableGoals = statuses.filter((s) => s !== 'development').length || 1;
    const completed = statuses.filter((s) => s === 'completed').length;
    const pct = Math.round((completed / playableGoals) * 100);

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
      card.innerHTML = `<div><strong>${goal.title}</strong><span class="${status === 'development' ? 'status-dev' : ''}">Status: ${status === 'development' ? 'in ontwikkeling' : status}</span></div>`;
      const action = document.createElement('button');
      action.className = 'goal-action';
      action.disabled = status === 'locked';
      action.textContent = status === 'development' ? 'Bekijk' : status === 'completed' ? 'Herbekijk' : 'Open';
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
