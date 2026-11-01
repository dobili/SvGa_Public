# Schach von Grund auf – Companion-App

Begleit-App zum Buch „Schach von Grund auf – Ein Handbuch für Einsteiger und leicht Fortgeschrittene“.

Die App wird als Progressive Web App unter schach-von-grund-auf.com bereitgestellt.
Der Programmcode steht unter der GNU General Public License, Version 3 oder (nach Wahl) jeder
späteren Version (`GPL-3.0-or-later`, siehe `LICENSE`). Bausteine anderer Urheber (Stockfish,
Figurensätze, Schriften, Lichess-Daten und weitere) stehen unter ihren eigenen Lizenzen: Übersicht
in `docs/LIZENZEN.md`, in der App unter Einstellungen › Lizenzen.
Die Inhalte des Buches (Texte, Diagramme, Abbildungen) sind davon ausgenommen: alle Rechte vorbehalten.

## Wegweiser

| Ordner | Inhalt |
|---|---|
| `app/` | Die App (TypeScript, React, Vite, PWA); Einstieg `app/src/README.md` |
| `pipeline/` | Python-Pipeline: Buchquellen lesen, prüfen, Daten bauen; Einstieg `pipeline/README.md` |
| `schemas/` | JSON-Schemas: Vertrag zwischen Pipeline und App |
| `docs/` | Architektur, Entscheidungen, Fortschritt, Testanleitung, Cloudflare, Lizenzen |

Arbeitsregeln und Befehle: `CLAUDE.md`. Aktueller Stand: `docs/FORTSCHRITT.md`.
