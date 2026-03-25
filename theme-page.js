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

const THEME_CONFIG = {
  hoofdthema1: { title: 'Landschappen', key: 'landschappen', goals: [
    { id: 'land-1', title: 'Landschappen herkennen', content: 'Bekijk foto\'s en benoem het landschap.', href: 'thema1unit1.html', ovur: ['Wat zie je?', 'Welke kenmerken zoek je?', 'Vergelijk minstens 2 foto\'s.', 'Wat ging goed?'], themes: ['landschappen'] },
    { id: 'land-2', title: 'Kaart Europa lezen', content: 'Werk met kaartlegende en schaal.', href: 'thema1unit2.html', ovur: ['Wat is je opdracht?', 'Kies hulpmiddelen.', 'Duid landen en reliëf aan.', 'Wat heb je bijgeleerd?'], themes: ['landschappen', 'belgische_geschiedenis'] },
    { id: 'land-3', title: 'Mens en omgeving', content: 'Leg invloed van mens op landschap uit.', href: 'thema1unit3.html', ovur: ['Wat verandert?', 'Maak een stappenplan.', 'Geef 2 voorbeelden.', 'Welke oorzaak-gevolg zie je?'], themes: ['landschappen'] }
  ] },
  hoofdthema2: { title: 'Levende natuur', key: 'levende_natuur', goals: [
    { id: 'nat-1', title: 'Levende en niet-levende factoren', content: 'Observeer ecosystemen.', href: 'thema2unit2.html', ovur: ['Wat observeer je?', 'Welke factoren noteer je?', 'Maak een schema.', 'Wat verraste je?'], themes: ['levende_natuur'] },
    { id: 'nat-2', title: 'Voedselketen opbouwen', content: 'Koppel producent, consument en reducent.', href: 'thema4unit1.html', ovur: ['Wat is je startorganisme?', 'Welke schakels heb je nodig?', 'Teken je keten.', 'Waar zat je fout?'], themes: ['levende_natuur'] },
    { id: 'nat-3', title: 'Duurzame keuzes', content: 'Verbind natuurzorg met dagelijks gedrag.', href: 'thema4unit2.html', ovur: ['Welke keuze maak je?', 'Bepaal criteria.', 'Motiveer je keuze.', 'Wat pas je toe?'], themes: ['levende_natuur', 'monsterlijke_groene_groei'] }
  ] },
  hoofdthema3: { title: 'Belgische geschiedenis', key: 'belgische_geschiedenis', goals: [
    { id: 'bg-1', title: 'Historische bronnen lezen', content: 'Vergelijk beeld- en tekstbronnen.', href: 'thema3_1.html', ovur: ['Welke bron?', 'Welke info zoek je?', 'Vergelijk bronnen.', 'Wat is betrouwbaar?'], themes: ['belgische_geschiedenis'] },
    { id: 'bg-2', title: 'Tijdlijn bouwen', content: 'Plaats gebeurtenissen in volgorde.', href: 'thema3_2.html', ovur: ['Welke periode?', 'Kies sleutelmomenten.', 'Maak je tijdlijn.', 'Welke verbanden zie je?'], themes: ['belgische_geschiedenis'] },
    { id: 'bg-3', title: 'Kaart Europa in context', content: 'Koppel grenzen en gebeurtenissen.', href: 'thema3_1_unit2.html', ovur: ['Wat wil je aantonen?', 'Welke kaarten heb je nodig?', 'Leg evolutie uit.', 'Wat begrijp je nu beter?'], themes: ['landschappen', 'belgische_geschiedenis'] }
  ] },
  hoofdthema4: { title: 'Monsterlijke groene groei', key: 'monsterlijke_groene_groei', goals: [
    { id: 'mg-1', title: 'Groene groei begrijpen', content: 'Leg impact op klimaat uit.', href: 'monsterunit1.html', ovur: ['Wat betekent groei?', 'Zoek impactfactoren.', 'Maak een conclusie.', 'Wat kan jij doen?'], themes: ['monsterlijke_groene_groei'] },
    { id: 'mg-2', title: 'Ecologische voetafdruk', content: 'Bereken je voetafdruk.', href: 'monsterunit2.html', ovur: ['Welke data heb je?', 'Kies rekenschema.', 'Bereken en vergelijk.', 'Welke actie neem je?'], themes: ['monsterlijke_groene_groei'] },
    { id: 'mg-3', title: 'Duurzame oplossingen', content: 'Ontwerp een mini-campagne.', href: 'thema4unit3.html', ovur: ['Wie is doelgroep?', 'Plan je campagne.', 'Werk boodschap uit.', 'Wat was effect?'], themes: ['monsterlijke_groene_groei', 'communiceren'] }
  ] },
  hoofdthema5: { title: 'Veilig onderweg', key: 'veilig_onderweg', goals: [
    { id: 'vo-1', title: 'Verkeerstekens herkennen', content: 'Koppel borden aan situaties.', href: 'veiligonderweg_unit1.html', ovur: ['Wat zie je?', 'Welke regels gelden?', 'Los cases op.', 'Waar twijfelde je?'], themes: ['veilig_onderweg'] },
    { id: 'vo-2', title: 'Risico\'s inschatten', content: 'Kies veilig gedrag in het verkeer.', href: 'thema5unit1.html', ovur: ['Waar is risico?', 'Maak een checklist.', 'Kies veilig alternatief.', 'Wat neem je mee?'], themes: ['veilig_onderweg'] },
    { id: 'vo-3', title: 'Route plannen', content: 'Plan veilige schoolroute.', href: 'veiligonderweg_unit7.html', ovur: ['Wat is doel?', 'Verzamel info.', 'Werk route uit.', 'Hoe verbeter je route?'], themes: ['veilig_onderweg', 'schatten'] }
  ] },
  hoofdthema6: { title: 'Sparen', key: 'sparen', goals: [
    { id: 'sp-1', title: 'Inkomsten en uitgaven', content: 'Maak een budgetoverzicht.', href: 'thema6unit3.html', ovur: ['Wat komt binnen?', 'Wat noteer je?', 'Bereken saldo.', 'Wat pas je aan?'], themes: ['sparen'] },
    { id: 'sp-2', title: 'Factuur begrijpen', content: 'Lees posten en BTW correct.', href: 'thema5unit2.html', ovur: ['Wat staat op factuur?', 'Welke termen ken je?', 'Controleer totaal.', 'Welke fout vond je?'], themes: ['sparen', 'fictie_en_nonfictie'] },
    { id: 'sp-3', title: 'Spaardoel plannen', content: 'Stel realistisch spaardoel op.', href: 'thema5unit3.html', ovur: ['Wat wil je sparen?', 'Bereken per week.', 'Volg je plan.', 'Wat werkte?'], themes: ['sparen'] }
  ] },
  hoofdthema7: { title: 'Werkwoordstijden', key: 'werkwoordstijden', goals: [
    { id: 'ww-1', title: 'Tegenwoordige tijd', content: 'Gebruik de juiste persoonsvorm.', href: 'thema7unit1.html', ovur: ['Welke tijd?', 'Zoek onderwerp.', 'Vul correct aan.', 'Welke regels onthoud je?'], themes: ['werkwoordstijden'] },
    { id: 'ww-2', title: 'Verleden tijd', content: 'Pas d/t-regels toe.', href: 'thema7unit2.html', ovur: ['Waarop let je?', 'Kies stam.', 'Controleer eindletter.', 'Waar ging het fout?'], themes: ['werkwoordstijden'] },
    { id: 'ww-3', title: 'Mix in context', content: 'Schrijf korte tekst met correcte tijden.', href: 'thema7unit3.html', ovur: ['Wat schrijf je?', 'Maak schrijfkader.', 'Herschrijf tekst.', 'Wat verbeterde je?'], themes: ['werkwoordstijden', 'communiceren'] }
  ] },
  hoofdthema8: { title: 'Wiskunde', key: 'wiskunde', goals: [
    { id: 'wis-1', title: 'Getallen en bewerkingen', content: 'Werk met procenten en verhoudingen.', href: 'thema8unit1.html', ovur: ['Wat wordt gevraagd?', 'Kies formule.', 'Los stap voor stap op.', 'Controleer je uitkomst.'], themes: ['wiskunde'] },
    { id: 'wis-2', title: 'Tabellen en grafieken', content: 'Lees en maak grafieken.', href: 'thema8unit2.html', ovur: ['Welke data?', 'Kies grafiektype.', 'Teken en interpreteer.', 'Welke conclusie trek je?'], themes: ['wiskunde'] },
    { id: 'wis-3', title: 'Schatten en afronden', content: 'Schat realistische resultaten.', href: 'thema8unit3.html', ovur: ['Wat moet je schatten?', 'Kies afronding.', 'Vergelijk met exact.', 'Was je schatting bruikbaar?'], themes: ['wiskunde', 'schatten'] }
  ] },
  oefenthema1: { title: 'Fictie en non-fictie', key: 'fictie_en_nonfictie', goals: [
    { id: 'fn-1', title: 'Tekstsoorten onderscheiden', content: 'Herken tekstdoel en kenmerken.', href: 'thema9unit1.html', ovur: ['Wat is tekstdoel?', 'Zoek signaalwoorden.', 'Classificeer tekst.', 'Wat helpt je volgende keer?'], themes: ['fictie_en_nonfictie'] },
    { id: 'fn-2', title: 'Informatie uit tekst halen', content: 'Werk met kernwoorden en samenvatting.', href: 'thema9unit2.html', ovur: ['Wat zoek je?', 'Markeer kernwoorden.', 'Vat samen.', 'Wat liet je weg?'], themes: ['fictie_en_nonfictie'] },
    { id: 'fn-3', title: 'Factuur begrijpen', content: 'Lees administratieve teksten correct.', href: 'thema9unit4.html', ovur: ['Welke info is belangrijk?', 'Plan je leesstrategie.', 'Controleer bedragen.', 'Welke termen zijn nieuw?'], themes: ['fictie_en_nonfictie', 'sparen'] }
  ] },
  oefenthema2: { title: 'Schatten', key: 'schatten', goals: [
    { id: 'sch-1', title: 'Afstanden schatten', content: 'Maak inschattingen met referentiepunten.', href: 'thema9unit5.html', ovur: ['Wat schat je?', 'Kies referentie.', 'Voer schatting uit.', 'Hoe dicht zat je?'], themes: ['schatten'] },
    { id: 'sch-2', title: 'Tijd schatten', content: 'Schat duur van taken.', href: 'thema9unit6.html', ovur: ['Welke taak?', 'Plan je aanpak.', 'Meet werkelijke tijd.', 'Hoe verbeter je?'], themes: ['schatten'] },
    { id: 'sch-3', title: 'Schatten in verkeer', content: 'Koppel snelheid en veiligheid.', href: 'thema9unit7.html', ovur: ['Welke situatie?', 'Kies variabelen.', 'Bereken/schat.', 'Wat betekent dit?'], themes: ['schatten', 'veilig_onderweg'] }
  ] },
  oefenthema3: { title: 'Communiceren', key: 'communiceren', goals: [
    { id: 'com-1', title: 'Actief luisteren', content: 'Gebruik luisterstrategieën.', href: 'thema9unit8.html', ovur: ['Wie spreekt?', 'Welke vragen stel je?', 'Vat samen.', 'Wat deed je goed?'], themes: ['communiceren'] },
    { id: 'com-2', title: 'Duidelijk spreken', content: 'Breng boodschap gestructureerd.', href: 'thema11unit1.html', ovur: ['Wat wil je zeggen?', 'Maak kernpunten.', 'Presenteer duidelijk.', 'Wat wil je oefenen?'], themes: ['communiceren'] },
    { id: 'com-3', title: 'Samenwerken', content: 'Communiceer in teamopdracht.', href: 'thema11.html', ovur: ['Wat is teamdoel?', 'Verdeel rollen.', 'Werk samen.', 'Hoe liep de samenwerking?'], themes: ['communiceren', 'mechanica'] }
  ] },
  oefenthema4: { title: 'Mechanica', key: 'mechanica', goals: [
    { id: 'mech-1', title: 'Basis gereedschappen', content: 'Kies correct gereedschap per taak.', href: 'mechanica8doel1.html', ovur: ['Welke taak?', 'Welk gereedschap past?', 'Voer veilig uit.', 'Wat ging efficiënt?'], themes: ['mechanica'] },
    { id: 'mech-2', title: 'Montage en verbindingen', content: 'Gebruik bouten en moeren juist.', href: 'mechanica8doel2.html', ovur: ['Welke verbinding?', 'Kies materiaal.', 'Monteer stap voor stap.', 'Wat kan beter?'], themes: ['mechanica'] },
    { id: 'mech-3', title: 'Elektrische basis', content: 'Begrijp eenvoudige stroomkringen.', href: 'mechanica8doel3.html', ovur: ['Wat meet je?', 'Kies componenten.', 'Bouw kring.', 'Welke fout vond je?'], themes: ['mechanica', 'wiskunde'] }
  ] },
  oefenthema5: { title: 'Verdieping communicatie', key: 'communiceren', goals: [
    { id: 'comx-1', title: 'Formeel schrijven', content: 'Schrijf korte e-mail of bericht.', href: 'mechanica8doel4.html', ovur: ['Voor wie schrijf je?', 'Maak structuur.', 'Schrijf en herlees.', 'Welke feedback kreeg je?'], themes: ['communiceren'] },
    { id: 'comx-2', title: 'Argumenteren', content: 'Onderbouw je mening met voorbeelden.', href: 'mechanica8doel5.html', ovur: ['Wat is je standpunt?', 'Zoek argumenten.', 'Presenteer helder.', 'Welke tegenargumenten zijn sterk?'], themes: ['communiceren', 'fictie_en_nonfictie'] },
    { id: 'comx-3', title: 'Feedback geven', content: 'Geef opbouwende peer-feedback.', href: 'mechanica8doel6.html', ovur: ['Wat beoordeel je?', 'Gebruik criteria.', 'Formuleer feedback.', 'Wat leerde je?'], themes: ['communiceren'] }
  ] },
  oefenthema6: { title: 'Verdieping mechanica', key: 'mechanica', goals: [
    { id: 'm2-1', title: 'Plooien en meten', content: 'Werk nauwkeurig met maatvoering.', href: 'mechanica8doel7.html', ovur: ['Wat is maat?', 'Controleer materiaal.', 'Voer bewerking uit.', 'Waar week je af?'], themes: ['mechanica', 'sparen'] },
    { id: 'm2-2', title: 'Veilig werken', content: 'Pas veiligheidsregels consequent toe.', href: 'mechanica8doel8.html', ovur: ['Welke risico\'s?', 'Kies PBM.', 'Werk volgens stappen.', 'Hoe hou je dit vol?'], themes: ['mechanica', 'veilig_onderweg'] },
    { id: 'm2-3', title: 'Eindopdracht', content: 'Combineer vaardigheden in mini-project.', href: 'unit.html', ovur: ['Wat is je plan?', 'Verdeel werk.', 'Voer project uit.', 'Wat neem je mee naar volgende opdracht?'], themes: ['mechanica', 'communiceren'] }
  ] }
};

function cssSoftColor(hex) {
  return `${hex}22`;
}

function getGoalStatus(themeId, goals) {
  const data = JSON.parse(localStorage.getItem('pavProgressV2') || '{}');
  return goals.map((goal, index) => {
    const done = Boolean(data[goal.id]);
    if (done) return 'completed';
    const previousDone = index === 0 || Boolean(data[goals[index - 1].id]);
    return previousDone ? 'active' : 'locked';
  });
}

function renderThemePage(themeId) {
  const config = THEME_CONFIG[themeId];
  if (!config) return;

  const color = THEME_COLORS[config.key] || '#4CAF50';
  document.documentElement.style.setProperty('--theme-color', color);
  document.documentElement.style.setProperty('--theme-soft', cssSoftColor(color));

  document.getElementById('themeTitle').textContent = config.title;

  const metro = document.getElementById('metroLine');
  const overview = document.getElementById('goalsOverview');
  const assignment = document.getElementById('assignmentView');

  function draw(selectedGoalId = config.goals[0].id, pulseGoalId = null) {
    const statuses = getGoalStatus(themeId, config.goals);
    const doneCount = statuses.filter((s) => s === 'completed').length;
    const progress = Math.round((doneCount / config.goals.length) * 100);
    document.getElementById('progressPercent').textContent = `${progress}%`;
    document.getElementById('progressFill').style.width = `${progress}%`;

    metro.innerHTML = '';
    overview.innerHTML = '';

    config.goals.forEach((goal, index) => {
      const status = statuses[index];
      const stop = document.createElement('button');
      stop.className = `stop ${status}${pulseGoalId === goal.id ? ' just-completed' : ''}`;
      stop.disabled = status === 'locked';
      stop.innerHTML = `
        <div class="stop-head">
          <span class="node"></span>
          <span class="connector"></span>
        </div>
        <div class="stop-content">
          <div class="stop-title">${goal.title}</div>
          <div class="stop-labels">${goal.themes.length > 1 ? goal.themes.map((t) => `<span class="stop-label">${t.replaceAll('_', ' ')}</span>`).join('') : '<span class="stop-label">1 thema</span>'}</div>
        </div>`;
      stop.addEventListener('click', () => showGoal(goal));
      metro.appendChild(stop);

      const card = document.createElement('div');
      card.className = 'goal-card';
      card.innerHTML = `<div><strong>${goal.title}</strong><span>Status: ${status}</span></div>`;
      const action = document.createElement('button');
      action.className = 'goal-action';
      action.textContent = status === 'completed' ? 'Herbekijk' : 'Open';
      action.disabled = status === 'locked';
      action.addEventListener('click', () => showGoal(goal));
      card.appendChild(action);
      overview.appendChild(card);
    });

    const selected = config.goals.find((g) => g.id === selectedGoalId) || config.goals[0];
    showGoal(selected, false);
  }

  function showGoal(goal, redraw = true) {
    assignment.innerHTML = `
      <h3>${goal.title}</h3>
      <p>${goal.content}</p>
      <p><strong>Opdracht:</strong> klik op de knop hieronder om naar de oefening te gaan.</p>
      <p><a class="goal-action" href="${goal.href}" style="text-decoration:none;display:inline-block;">Open opdracht</a></p>
      <button class="complete-btn" id="completeGoalBtn">Doel voltooien</button>
    `;
    const blocks = ['Oriënteren', 'Voorbereiden', 'Uitvoeren', 'Reflecteren'];
    document.getElementById('ovurGrid').innerHTML = blocks
      .map((title, i) => `<article class="ovur-block"><strong>${title}</strong><div>${goal.ovur[i]}</div></article>`)
      .join('');

    document.getElementById('completeGoalBtn').addEventListener('click', () => {
      const data = JSON.parse(localStorage.getItem('pavProgressV2') || '{}');
      data[goal.id] = true;
      localStorage.setItem('pavProgressV2', JSON.stringify(data));
      draw(goal.id, goal.id);
    });

    if (redraw) draw(goal.id);
  }

  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  const themeId = document.body.dataset.themeId;
  renderThemePage(themeId);
});
