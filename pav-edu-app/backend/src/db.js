import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';

const dbPath = path.resolve(process.cwd(), 'pav-edu-app/backend/pav.db');
const schemaPath = path.resolve(process.cwd(), 'pav-edu-app/backend/src/schema.sql');

const db = new Database(dbPath);
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

const countUsers = db.prepare('SELECT COUNT(*) AS count FROM Users').get().count;

if (countUsers === 0) {
  db.exec(`
    INSERT INTO Users (id, naam, rol, klas) VALUES
      (1, 'Amina Janssens', 'leerling', '4A'),
      (2, 'Youssef El Amrani', 'leerling', '4A'),
      (3, 'Lotte Peeters', 'leerling', '4A'),
      (4, 'Mevrouw De Smet', 'leerkracht', '4A');

    INSERT INTO Themes (id, titel, beschrijving, kleur, icon, afbeelding) VALUES
      (1, 'Budget & Geld', 'Leer plannen, sparen en slimme keuzes maken met je budget.', '#4CAF50', '💶', 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=800'),
      (2, 'Winkelen', 'Vergelijk prijzen en ontdek je rechten als consument.', '#2196F3', '🛍️', 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800'),
      (3, 'Wonen', 'Inzicht in huur, energie en slim wonen op eigen tempo.', '#FF9800', '🏠', 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800'),
      (4, 'Transport', 'Kies veilige en duurzame verplaatsingen.', '#F44336', '🚌', 'https://images.unsplash.com/photo-1494412574643-ff42f89fcb66?w=800'),
      (5, 'Technologie', 'Gebruik digitale tools verantwoord en zelfstandig.', '#9C27B0', '💻', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800');

    INSERT INTO Assignments (id, theme_id, titel, type, vraag) VALUES
      (1, 1, 'Weekbudget plannen', 'scenario', 'Je hebt €100 budget. Wat koop je en wat spaar je?'),
      (2, 1, 'Korting berekenen', 'quiz', 'Een jas kost €75 met 20% korting. Wat betaal je?'),
      (3, 2, 'Slim vergelijken', 'quiz', 'Welke winkel heeft de beste prijs/kwaliteit?'),
      (4, 3, 'Huur en kosten', 'scenario', 'Hoe verdeel je huur, energie en internet in een maandbudget?'),
      (5, 4, 'Reisplanner', 'scenario', 'Welke route is het snelst en goedkoopst voor school?'),
      (6, 5, 'Veilig online', 'quiz', 'Welke stappen neem je om je account te beveiligen?');

    INSERT INTO Progress (user_id, assignment_id, score, voltooid) VALUES
      (1, 1, 90, 1), (1, 2, 75, 1), (1, 3, 65, 1), (1, 4, 0, 0), (1, 5, 0, 0), (1, 6, 0, 0),
      (2, 1, 55, 1), (2, 2, 45, 1), (2, 3, 0, 0), (2, 4, 0, 0), (2, 5, 0, 0), (2, 6, 0, 0),
      (3, 1, 100, 1), (3, 2, 95, 1), (3, 3, 80, 1), (3, 4, 70, 1), (3, 5, 65, 1), (3, 6, 0, 0);

    INSERT INTO Badges (id, naam, beschrijving) VALUES
      (1, 'Budget Expert', 'Thema Budget volledig afgerond.'),
      (2, 'Slimme Spaarder', 'Meerdere budgetopdrachten correct opgelost.'),
      (3, 'Planning Master', 'Constante voortgang over meerdere thema''s.');

    INSERT INTO UserBadges (user_id, badge_id) VALUES
      (1, 2),
      (3, 1),
      (3, 3);

    INSERT INTO Reflections (user_id, assignment_id, antwoord1, antwoord2, antwoord3) VALUES
      (1, 2, 'Ik heb geleerd korting sneller te berekenen.', 'De percentages omzetten was lastig.', 'Volgende keer schrijf ik de formule eerst op.');
  `);
}

export default db;
