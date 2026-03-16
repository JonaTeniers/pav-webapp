import { useMemo, useState } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const themes = [
  {
    id: 1,
    title: 'Budget & Geld',
    description: 'Leer plannen, sparen en slimme financiële keuzes maken.',
    color: '#4CAF50',
    icon: '💶',
    image: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800',
    scenario: 'Je hebt €100 budget. Wat koop je?'
  },
  {
    id: 2,
    title: 'Winkelen',
    description: 'Vergelijk prijzen en maak bewuste keuzes als consument.',
    color: '#2196F3',
    icon: '🛍️',
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
    scenario: 'Welke winkel geeft de beste deal bij 2+1 gratis?'
  },
  {
    id: 3,
    title: 'Wonen',
    description: 'Begrijp huur, energie en praktisch zelfstandig wonen.',
    color: '#FF9800',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800',
    scenario: 'Hoe verdeel je huur, water en internet in je budget?'
  },
  {
    id: 4,
    title: 'Transport',
    description: 'Ontdek veilige en duurzame manieren van verplaatsen.',
    color: '#F44336',
    icon: '🚌',
    image: 'https://images.unsplash.com/photo-1494412574643-ff42f89fcb66?w=800',
    scenario: 'Wat is de goedkoopste route naar school deze week?'
  },
  {
    id: 5,
    title: 'Technologie',
    description: 'Gebruik technologie slim, veilig en verantwoord.',
    color: '#9C27B0',
    icon: '💻',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    scenario: 'Welke wachtwoorden zijn sterk en waarom?'
  }
];

const studentProgress = [
  { themeId: 1, percentage: 80 },
  { themeId: 2, percentage: 55 },
  { themeId: 3, percentage: 40 },
  { themeId: 4, percentage: 20 },
  { themeId: 5, percentage: 60 }
];

const students = [
  { name: 'Amina Janssens', progress: 78, completed: 11 },
  { name: 'Youssef El Amrani', progress: 46, completed: 6 },
  { name: 'Lotte Peeters', progress: 89, completed: 13 },
  { name: 'Noah Vermeulen', progress: 34, completed: 4 }
];

const assignments = [
  { id: 1, type: 'meerkeuze', title: 'Budgetkeuze', question: 'Wat is de slimste keuze binnen €100?' },
  { id: 2, type: 'berekening', title: 'Korting', question: 'Een product kost €60 met 25% korting. Eindprijs?' },
  { id: 3, type: 'scenario', title: 'Maandplanning', question: 'Je spaart voor een fiets. Hoe plan je je uitgaven?' }
];

const badges = ['Budget Expert', 'Slimme Spaarder', 'Planning Master'];

function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [reflection, setReflection] = useState({
    antwoord1: '',
    antwoord2: '',
    antwoord3: ''
  });

  const averageProgress = useMemo(
    () => Math.round(students.reduce((sum, student) => sum + student.progress, 0) / students.length),
    []
  );

  const studentsAtRisk = students.filter((student) => student.progress < 50);

  const teacherBarData = {
    labels: students.map((student) => student.name.split(' ')[0]),
    datasets: [
      {
        label: 'Voortgang %',
        data: students.map((student) => student.progress),
        backgroundColor: '#2F4858',
        borderRadius: 10
      }
    ]
  };

  const teacherDoughnutData = {
    labels: ['Gemiddelde klasvoortgang', 'Nog te doen'],
    datasets: [
      {
        data: [averageProgress, 100 - averageProgress],
        backgroundColor: ['#88A7B8', '#E8EEF2'],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="app-shell">
      <header className="top-header">
        <h1>PAV Leren</h1>
        <p>Zelfstandig leren met duidelijke structuur en thema's.</p>
      </header>

      <main className="content-area">
        {activePage === 'home' && (
          <section>
            <h2>Homepage · Thema's</h2>
            <div className="card-grid">
              {themes.map((theme) => (
                <article className="theme-card" key={theme.id}>
                  <img src={theme.image} alt={theme.title} />
                  <div className="theme-card-body">
                    <h3>
                      <span>{theme.icon}</span> {theme.title}
                    </h3>
                    <p>{theme.description}</p>
                    <button
                      type="button"
                      style={{ backgroundColor: theme.color }}
                      onClick={() => {
                        setSelectedTheme(theme);
                        setActivePage('themas');
                      }}
                    >
                      Start thema
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePage === 'progress' && (
          <section>
            <h2>Leerling dashboard</h2>
            <div className="panel-grid">
              <article className="panel">
                <h3>Actieve thema's & voortgang</h3>
                {studentProgress.map((item) => {
                  const theme = themes.find((t) => t.id === item.themeId);
                  return (
                    <div className="progress-row" key={item.themeId}>
                      <div className="progress-title">{theme.title}</div>
                      <div className="bar-wrap">
                        <div className="bar-fill" style={{ width: `${item.percentage}%`, background: theme.color }} />
                      </div>
                      <strong>{item.percentage}%</strong>
                    </div>
                  );
                })}
              </article>

              <article className="panel">
                <h3>Ga verder waar je was</h3>
                <p><strong>Laatste opdracht:</strong> Korting berekenen</p>
                <button type="button">Verdergaan</button>
                <h3>Behaalde badges</h3>
                <ul>
                  {badges.map((badge) => (
                    <li key={badge}>🏅 {badge}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        )}

        {activePage === 'results' && (
          <section className="teacher-central">
            <h2>Leerkracht dashboard (centrale achtergrond)</h2>
            <div className="panel-grid">
              <article className="panel">
                <h3>Klasoverzicht</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Leerling</th>
                      <th>Voortgang</th>
                      <th>Afgeronde opdrachten</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.name}>
                        <td>{student.name}</td>
                        <td>{student.progress}%</td>
                        <td>{student.completed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>

              <article className="panel chart-panel">
                <h3>Gemiddelde klasvoortgang: {averageProgress}%</h3>
                <div className="chart-wrap">
                  <Doughnut data={teacherDoughnutData} />
                </div>
                <div className="chart-wrap">
                  <Bar data={teacherBarData} />
                </div>
                <h4>Leerlingen onder 50%</h4>
                <ul>
                  {studentsAtRisk.map((student) => (
                    <li key={student.name}>{student.name} · {student.progress}%</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>
        )}

        {activePage === 'themas' && (
          <section>
            <h2>{selectedTheme.icon} {selectedTheme.title}</h2>
            <div className="panel-grid">
              <article className="panel">
                <h3>Uitleg van het thema</h3>
                <p>{selectedTheme.description}</p>
                <h4>Praktisch scenario</h4>
                <p>{selectedTheme.scenario}</p>
              </article>
              <article className="panel">
                <h3>Opdrachten</h3>
                {assignments.map((assignment) => (
                  <div className="assignment" key={assignment.id}>
                    <small>{assignment.type}</small>
                    <p><strong>{assignment.title}</strong></p>
                    <p>{assignment.question}</p>
                    <button type="button">Opdracht afronden</button>
                  </div>
                ))}
              </article>
            </div>
            <article className="panel reflection-panel">
              <h3>Reflectievragen (na opdracht)</h3>
              <label>
                Wat heb je geleerd?
                <textarea
                  value={reflection.antwoord1}
                  onChange={(event) => setReflection({ ...reflection, antwoord1: event.target.value })}
                />
              </label>
              <label>
                Wat vond je moeilijk?
                <textarea
                  value={reflection.antwoord2}
                  onChange={(event) => setReflection({ ...reflection, antwoord2: event.target.value })}
                />
              </label>
              <label>
                Wat zou je volgende keer anders doen?
                <textarea
                  value={reflection.antwoord3}
                  onChange={(event) => setReflection({ ...reflection, antwoord3: event.target.value })}
                />
              </label>
              <button type="button">Reflectie opslaan voor leerkracht</button>
            </article>
          </section>
        )}

        {activePage === 'profile' && (
          <section>
            <h2>Profiel</h2>
            <article className="panel">
              <p>Naam: Amina Janssens</p>
              <p>Klas: 4A</p>
              <p>Rol: Leerling</p>
            </article>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        <button type="button" onClick={() => setActivePage('home')}>Home</button>
        <button type="button" onClick={() => setActivePage('themas')}>Thema's</button>
        <button type="button" onClick={() => setActivePage('progress')}>Mijn voortgang</button>
        <button type="button" onClick={() => setActivePage('results')}>Resultaten</button>
        <button type="button" onClick={() => setActivePage('profile')}>Profiel</button>
      </nav>
    </div>
  );
}

export default App;
