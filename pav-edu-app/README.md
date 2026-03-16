# PAV Educatieve Webapp (React + Node + SQLite)

Deze map bevat een complete basisstructuur voor een mobiele, visuele en eenvoudige PAV-webapp.

## Stack
- **Frontend:** React (Vite) + Chart.js
- **Backend:** Node.js + Express
- **Database:** SQLite (better-sqlite3)

## Structuur
- `frontend/`
  - `src/App.jsx`: homepage, leerlingdashboard, leerkrachtdashboard, thema's, opdrachten, reflectie, badges
  - `src/styles.css`: minimalistische Scandinavische styling + mobiele bottom navigation
- `backend/`
  - `src/schema.sql`: alle gevraagde tabellen
  - `src/db.js`: database-initialisatie + seeddata
  - `src/server.js`: API-endpoints voor thema's, dashboards en reflectie

## Gevraagde onderdelen gedekt
1. Homepage met themakaarten, beeld, titel, beschrijving en knop “Start thema”.
2. Leerling dashboard met actieve thema's, voortgangsbalken, laatste opdracht en badges.
3. Leerkracht dashboard met tabel, gemiddelde klasvoortgang en leerlingen onder 50%.
4. Thema modules met uitleg, opdrachten, interactieve vragen en scenario's.
5. Opdrachttypes: meerkeuze, berekening, scenario.
6. Reflectievragen met opslag via API.
7. Badge-systeem met voorbeelden en toekenning in data.
8. Thema kleuren/iconen volgens opgegeven kleurmapping.
9. Mobiele bottom navigation (Home, Thema's, Mijn voortgang, Resultaten, Profiel).
10. Volledige databasestructuur volgens je tabelspec.
11. Leerkrachtdashboard als visueel centrale achtergrond in de resultatenweergave.

## Snel starten
### Backend
```bash
cd pav-edu-app/backend
npm install
npm start
```

### Frontend
```bash
cd pav-edu-app/frontend
npm install
npm run dev
```

Open daarna: `http://localhost:5173`
