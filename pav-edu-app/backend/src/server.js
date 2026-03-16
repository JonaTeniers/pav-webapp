import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get('/api/themes', (_req, res) => {
  const themes = db.prepare('SELECT * FROM Themes ORDER BY id').all();
  res.json(themes);
});

app.get('/api/student/:userId/dashboard', (req, res) => {
  const { userId } = req.params;

  const activeThemes = db.prepare(`
    SELECT t.id, t.titel, t.kleur,
      ROUND(100.0 * SUM(CASE WHEN p.voltooid = 1 THEN 1 ELSE 0 END) / COUNT(a.id), 0) AS percentage
    FROM Themes t
    JOIN Assignments a ON a.theme_id = t.id
    LEFT JOIN Progress p ON p.assignment_id = a.id AND p.user_id = ?
    GROUP BY t.id
    ORDER BY t.id
  `).all(userId);

  const latestAssignment = db.prepare(`
    SELECT a.id, a.titel, th.titel AS thema, a.vraag
    FROM Assignments a
    LEFT JOIN Progress p ON p.assignment_id = a.id AND p.user_id = ?
    JOIN Themes th ON th.id = a.theme_id
    ORDER BY p.voltooid ASC, a.id ASC
    LIMIT 1
  `).get(userId);

  const badges = db.prepare(`
    SELECT b.naam, b.beschrijving
    FROM UserBadges ub
    JOIN Badges b ON b.id = ub.badge_id
    WHERE ub.user_id = ?
  `).all(userId);

  res.json({ activeThemes, latestAssignment, badges });
});

app.get('/api/teacher/dashboard', (_req, res) => {
  const students = db.prepare(`
    SELECT u.id, u.naam,
      ROUND(100.0 * SUM(CASE WHEN p.voltooid = 1 THEN 1 ELSE 0 END) / COUNT(a.id), 0) AS voortgang,
      SUM(CASE WHEN p.voltooid = 1 THEN 1 ELSE 0 END) AS afgerondeOpdrachten
    FROM Users u
    JOIN Progress p ON p.user_id = u.id
    JOIN Assignments a ON a.id = p.assignment_id
    WHERE u.rol = 'leerling'
    GROUP BY u.id
    ORDER BY u.naam
  `).all();

  const average = students.length
    ? Math.round(students.reduce((acc, student) => acc + student.voortgang, 0) / students.length)
    : 0;

  const riskStudents = students.filter((student) => student.voortgang < 50);

  res.json({ students, average, riskStudents });
});

app.post('/api/reflections', (req, res) => {
  const { user_id, assignment_id, antwoord1, antwoord2, antwoord3 } = req.body;
  db.prepare(`
    INSERT INTO Reflections (user_id, assignment_id, antwoord1, antwoord2, antwoord3)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, assignment_id)
    DO UPDATE SET antwoord1 = excluded.antwoord1, antwoord2 = excluded.antwoord2, antwoord3 = excluded.antwoord3
  `).run(user_id, assignment_id, antwoord1, antwoord2, antwoord3);

  res.status(201).json({ ok: true });
});

app.get('/api/reflections/:userId', (req, res) => {
  const { userId } = req.params;
  const reflections = db.prepare(`
    SELECT r.assignment_id, a.titel AS opdracht, r.antwoord1, r.antwoord2, r.antwoord3
    FROM Reflections r
    JOIN Assignments a ON a.id = r.assignment_id
    WHERE r.user_id = ?
  `).all(userId);

  res.json(reflections);
});

app.listen(PORT, () => {
  console.log(`PAV backend running on http://localhost:${PORT}`);
});
