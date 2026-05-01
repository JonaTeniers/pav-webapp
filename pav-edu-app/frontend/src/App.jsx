import { useState } from 'react';

const stats = [
  { label: 'In', value: 0, icon: '📖', tone: 'mint' },
  { label: 'Voltooid', value: 0, icon: '🏆', tone: 'sage' },
  { label: 'Actief', value: 0, icon: '📈', tone: 'aqua' },
  { label: 'Uren geleerd', value: 0, icon: '🕒', tone: 'lavender' }
];

const courses = [
  { title: 'Landschappen', level: 'beginner', category: 'ONTWIKKELING', description: "Werk met kaarten, vergelijk foto's en bouw van observatie naar analyse.", time: '3 u', lessons: '12 lessen', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1400' },
  { title: 'Levende natuur', level: 'beginner', category: 'ONTWIKKELING', description: 'Ontdek ecosystemen en leer de kenmerken van levende organismen.', time: '2 u', lessons: '2 modules', image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1400' },
  { title: 'Belgische geschiedenis', level: 'Gemiddeld', category: 'ONTWIKKELING', description: 'Verken belangrijke momenten van Napoleon tot de euro.', time: '4 u', lessons: '9 lessen', image: 'https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?w=1400' }
];

const lessons = [
  'Les 1: Wat is een landschap?',
  'Les 2: Kaarten lezen',
  'Les 3: Reliëf en hoogte',
  'Les 4: Rivieren en watersystemen',
  'Les 5: Klimaat en weer in België'
];

export default function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <div className="logo">
            <div className="logo-icon">🎓</div>
            <div>
              <strong>PAVO</strong>
              <span>LEEROMGEVING</span>
            </div>
          </div>

          <nav className="menu">
            {['dashboard', 'themas', 'cursussen', 'voortgang', 'leerlingen'].map((item) => (
              <button
                key={item}
                className={page === item ? 'active' : ''}
                onClick={() => setPage(item)}
                type="button"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <button className="logout" type="button">Uitloggen</button>
      </aside>

      <main className="main">
        {page === 'dashboard' && (
          <>
            <h1>Goedenavond, <span>Jona</span></h1>
            <p className="subtitle">Klaar om verder te leren? Hier is je overzicht.</p>
            <section className="stats-grid">
              {stats.map((s) => (
                <article className="stat" key={s.label}>
                  <div>
                    <p>{s.label}</p>
                    <strong>{s.value}</strong>
                  </div>
                  <span className={`stat-icon ${s.tone}`}>{s.icon}</span>
                </article>
              ))}
            </section>
            <h2>Beschikbare artikelen</h2>
            <section className="courses-grid">
              {courses.map((course) => (
                <article className="course-card" key={course.title}>
                  <img src={course.image} alt={course.title} />
                  <div className="badge">{course.level}</div>
                  <div className="course-content">
                    <small>{course.category}</small>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="meta">⏱ {course.time} · 📖 {course.lessons}</div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {page === 'cursussen' && (
          <>
            <h1>Cursussen</h1>
            <p className="subtitle">Ontdek en begin met leren</p>
            <div className="toolbar">
              <input placeholder="Zoek cursussen..." />
              <select><option>Alle</option></select>
              <select><option>Alle</option></select>
            </div>
            <section className="courses-grid">
              {courses.map((course) => (
                <article className="course-card" key={course.title}>
                  <img src={course.image} alt={course.title} />
                  <div className="badge">{course.level}</div>
                  <div className="course-content">
                    <small>{course.category}</small>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="meta">⏱ {course.time} · 📖 {course.lessons}</div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}

        {page === 'themas' && (
          <section className="lesson-view">
            <div className="hero">
              <div>
                <div className="badge">ontwikkeling</div>
                <h1>Landschappen</h1>
                <p>Werk met kaarten, vergelijk foto's en bouw van observatie naar analyse.</p>
              </div>
              <button type="button">Begin cursus</button>
            </div>
            <div className="lesson-grid">
              <article className="lesson-list">
                <h3>Lessen (12)</h3>
                {lessons.map((lesson, i) => (
                  <button key={lesson} className={i === 0 ? 'active' : ''} type="button">{lesson}</button>
                ))}
              </article>
              <article className="lesson-content">
                <h3>Les 1 van 12</h3>
                <h2>Les 1: Wat is een landschap?</h2>
                <p>In deze les ontdek je wat een landschap is en welke elementen erin voorkomen.</p>
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
