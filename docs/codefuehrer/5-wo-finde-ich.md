# Wo finde ich …?

Alle Pfade ohne Ordnerangabe liegen unter `app/src/`.

| Frage | Datei(en) |
| --- | --- |
| Einen Text der App ändern | `i18n/de.json` (und `en.json` mit demselben Schlüssel); den Schlüssel findest du, indem du den Text dort suchst |
| Wie stark ist Bot X? | `engine/botstaerke-daten.ts` (ohne Maia), `engine/botstaerke-maia-daten.ts` (mit Maia) |
| Name, Stil und Charakter eines Bots | `engine/gegnerliste1.ts`, `engine/gegnerliste2.ts`, Spaß-Bots in `engine/gegnerliste0.ts` |
| In welcher Stufe steht ein Bot? | `engine/botgruppen-daten.ts` |
| Die zehn Stufen und ihre Namen | `engine/stufen.ts` |
| Welcher Bot wird unter „Schnell eine Partie“ vorgeschlagen? | `ui/komponenten/spielstart/vorschlag.ts` |
| Die Unterseiten von „Spielen“ | `ui/komponenten/spielstart/spielseiten.tsx`, Seiten in `spielstart/seiten/` |
| Eine Regel eines Werkzeugs | `analyse/k<Kapitel>-<name>.ts`, die Rechnung meist in `schach/` |
| Ab wann ist ein Zug „?“ oder „??“? | `spiel/auswertung.ts` (Grenzen 0,5 / 1,2 / 3 Bauern) |
| Wie wird die Spielstärke geschätzt? | `spiel/genauigkeit.ts`, `spiel/elomodell.ts` |
| Welche Momente zeigt die Zeitleiste der Auswertung? | `ui/komponenten/auswertung/momente.ts` |
| Die Startwahl beim ersten Start | `tour/TourAngebot.tsx`, die zwei Wege in `tour/starttouren.ts` |
| Die Schritte einer Tour | `tour/touren.ts` und `tour/starttouren.ts`, Texte unter `tour.*` in `de.json` |
| Die Startkarte eines Trainers | `ui/trainer/startkarte/trainerstarts.ts` (Beispielstellung), `einstellung.ts` (Zeilen) |
| Die Trainer und ihre Kapitel | `training/trainer.ts` |
| Wie viele Erfahrungspunkte gibt es wofür, und die Stufen | `ui/komponenten/fortschritt/erfahrung.ts` |
| Welche Abzeichen gibt es? | `ui/komponenten/fortschritt/abzeichen.ts` und die Teillisten `abzeichen-*.ts` |
| Wann wird ein Ring voll (Orden)? | `ui/komponenten/fortschritt/ringrechnung.ts` |
| Das Bild eines Ordens oder Abzeichens | `ui/komponenten/ordenkunst/entwuerfe.ts` und `nachtabzeichen-*.ts` |
| Stationen, Landschaften und Nebenaufgaben des Lernpfads | `ui/komponenten/lernpfad/lernpfad.ts`, `landschaften.ts`, `nebenaufgaben.ts` |
| Vorschläge der Karte „Heute“ | `training/vorschlagsarten.ts` (Arten und Reihenfolge), `training/naechsterSchritt.ts` |
| Wochenziel, Aufträge, eigene Ziele | `training/wochenziel.ts`, `training/auftragsarten.ts`, `training/zielarten.ts` |
| Rekorde, Rivalen, Extras, Fundstücke | `training/rekordarten.ts`, `training/rivalen.ts`, `training/extras.ts`, `training/fundstuecke.ts` (Texte in `inhalte/de/fundstuecke.json`) |
| Bronze, Silber, Gold je Thema | `training/meisterschaft.ts` |
| Abschnitte des Monatsrückblicks | `ui/komponenten/rueckblick/rueckblickabschnitte.ts` |
| Die Karten oben im Buch und im Profil | `ui/komponenten/start/startkarten.ts`, `ui/komponenten/profilkarten/profilkarten.ts` |
| Einen neuen Bildschirm ohne Umbau einhängen | `app/zusatzansichten.ts` |
| Die Unterseiten der Einstellungen | `ui/komponenten/einstellungen/einstellungsseiten.ts` |
| Farben und Aussehen | `ui/stil/*.css` |
| Was ist auf dem Gerät gespeichert? | `speicher/format.ts` (der Aufbau der Daten), `speicher/gamifizierung.ts` (die Felder der Belohnungen) |
| Die Daten einer Abbildung | `app/public/daten/de/a1/kapNN.json` (von der Pipeline erzeugt, NN = Kapitel 00 bis 12) |
| Was das Wiki im Dashboard zeigt | `pipeline/wiki.py` |

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
