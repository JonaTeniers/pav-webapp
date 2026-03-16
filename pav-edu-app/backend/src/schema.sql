CREATE TABLE IF NOT EXISTS Users (
  id INTEGER PRIMARY KEY,
  naam TEXT NOT NULL,
  rol TEXT NOT NULL CHECK (rol IN ('leerling', 'leerkracht')),
  klas TEXT
);

CREATE TABLE IF NOT EXISTS Themes (
  id INTEGER PRIMARY KEY,
  titel TEXT NOT NULL,
  beschrijving TEXT NOT NULL,
  kleur TEXT NOT NULL,
  icon TEXT NOT NULL,
  afbeelding TEXT
);

CREATE TABLE IF NOT EXISTS Assignments (
  id INTEGER PRIMARY KEY,
  theme_id INTEGER NOT NULL,
  titel TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('quiz', 'scenario')),
  vraag TEXT NOT NULL,
  FOREIGN KEY(theme_id) REFERENCES Themes(id)
);

CREATE TABLE IF NOT EXISTS Progress (
  user_id INTEGER NOT NULL,
  assignment_id INTEGER NOT NULL,
  score INTEGER DEFAULT 0,
  voltooid INTEGER DEFAULT 0,
  PRIMARY KEY(user_id, assignment_id),
  FOREIGN KEY(user_id) REFERENCES Users(id),
  FOREIGN KEY(assignment_id) REFERENCES Assignments(id)
);

CREATE TABLE IF NOT EXISTS Reflections (
  user_id INTEGER NOT NULL,
  assignment_id INTEGER NOT NULL,
  antwoord1 TEXT,
  antwoord2 TEXT,
  antwoord3 TEXT,
  PRIMARY KEY(user_id, assignment_id),
  FOREIGN KEY(user_id) REFERENCES Users(id),
  FOREIGN KEY(assignment_id) REFERENCES Assignments(id)
);

CREATE TABLE IF NOT EXISTS Badges (
  id INTEGER PRIMARY KEY,
  naam TEXT NOT NULL,
  beschrijving TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS UserBadges (
  user_id INTEGER NOT NULL,
  badge_id INTEGER NOT NULL,
  PRIMARY KEY(user_id, badge_id),
  FOREIGN KEY(user_id) REFERENCES Users(id),
  FOREIGN KEY(badge_id) REFERENCES Badges(id)
);
