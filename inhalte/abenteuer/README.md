# `inhalte/abenteuer/` – Daten des Schach-Abenteuers

Hier liegen die Inhalte des Spiels, die ins öffentliche Repository dürfen: Verzeichnisse der
Gegner, Karten, Quests und Orte, die Spieltexte, die Dialoge und die Tiled-Karten. Grafik, Musik
und Porträts liegen im privaten Repository (Entscheidung A10) und kommen beim Build dazu.
Verträge: `schemas/abenteuer-*.schema.json`; die App erzeugt ihre Typen daraus
(`app/skripte/erzeuge-typen.mjs`), die Pipeline prüft die Beispiele (`pipeline/tests/test_abenteuer.py`).
Hintergrund: `docs/spiel/04_Architektur.md`, Abschnitt 2 und 9.

| Datei              | Schema             | Inhalt                                                                                                                                     |
| ------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `gegner.json`      | `abenteuer-gegner` | Gegnerprofile: Rolle, Zielstärke (fest, relativ zur aktuellen oder zur Eingangswertung), Fehlergewichte, Stil, Eröffnung, Steckbriefzeilen |
| `karten.json`      | `abenteuer-karten` | Hilfskarten mit Stufe, Art (dauerhaft, verbrauch), Wirkung, Zeitpunkt                                                                      |
| `quests.json`      | `abenteuer-quests` | Quests als Schrittfolgen: Ereignis (dialog, partie, aufgaben, ort) und Wirkungen (karte, steckbrief, zustand, szene, fragment)             |
| `orte.json`        | `abenteuer-orte`   | Orte mit Tiled-Karten, Figuren (Sprite, Dialogknoten, Gegner), Bedeutung der Auslöser, Club mit Buchkapiteln und Aufgabenreihe             |
| `texte/de.json`    | `abenteuer-texte`  | Oberflächentexte des Spiels, flache Schlüssel `bereich.name.feld`, Platzhalter `{name}`                                                    |
| `dialoge/de/*.ink` | –                  | Dialoge in Ink, eine Datei je Ort oder Szene                                                                                               |
| `karten/*.json`    | –                  | Tiled-Karten (JSON, orthogonal, 16 px)                                                                                                     |

## Kennungen

- Orte: `mapleFalls` (Kleinbuchstabe, dann CamelCase). Karten und Figuren: `ort.name`
  (`mapleFalls.dachboden`, `mapleFalls.coachDelgado`). Gegner heißen wie ihre Figur.
- Quests und Begegnungen: `ort.name` (`mapleFalls.dasBrett`, `mapleFalls.ersteLektion`).
- Dialogknoten: `datei.knoten` mit der Ink-Datei ohne Endung (`maple-falls-dachboden.ambrose_erwacht`).
- Textschlüssel: `bereich.name.feld` (`figur.ambrose.name`, `karte.fingerzeig.spruch`).

## Ink-Dialoge (`dialoge/<sprache>/<datei>.ink`)

- Knoten `=== name ===` sind die Einsprungpunkte; Quests warten auf „datei.knoten“.
- Tags am Zeilenende steuern die Anzeige: `#sprecher:ambrose` (Porträt und Name),
  `#stimmung:streng` (Porträtvariante), `#klang:knarren` (Geräusch), `#pause`.
- Externe Funktionen (`EXTERNAL`) führt die React-Hülle aus und schreibt in den Spielstand:
  `gibKarte(kennung)`, `setzeSzene(kennung)`, `beginnePartie(begegnung)`, `beginneAufgaben(runde)`,
  `setzeZustand(gegner, faktor, grund)`, `schalteSteckbrief(gegner, zeile)`.
- Globale `VAR` liegen im Spielstand (`dialogvariablen`) und überleben Szenen; `held` ist der Name
  des Helden.
- Beim Build übersetzt der JavaScript-Compiler von inkjs jede Datei nach JSON ins Zusatzpaket
  (Gruppe `dialoge`). Die Ink-Quelle bleibt die Wahrheit; JSON wird nie von Hand bearbeitet.
- Beispiel: `dialoge/de/maple-falls-dachboden.ink` (Fund des Bretts, Ambrose erwacht, erste Karte,
  Übergang in die erste Partie).

## Aufgabenrunden (`runden.json`)

- Eine Runde (Ink: `beginneAufgaben("ort.runde")`) nennt Steller (Figur), Buchübungen (`ueb:…`,
  Teilmenge von `club.aufgaben.buchuebungen` des Ortes), Themen der Trainer (`haengend`, `matt1`,
  `mattbilder`, Motive wie `doppelangriff`) und `reihe` (gehört zur Aufgabenreihe vor dem
  Clubkampf). Die Zahl der Motivaufgaben folgt dem Zeitbudget des Clubs (Regelwerk R30), außer die
  Runde nennt `anzahl` (Rätsel, Erinnerungen).
- Buchübungen müssen als Aufgaben des Taktiktrainers vorliegen (Lösungszug); Zählübungen und
  Mattführungen fallen derzeit heraus.
- Quests warten mit `{ "art": "aufgaben", "runde": "ort.runde" }` auf die bestandene Runde.

## Tiled-Karten (`karten/<ort>-<karte>.json`)

- Orthogonal, 16-px-Kacheln, JSON-Export von Tiled 1.11 (Claude schreibt die Dateien direkt; der
  Autor kann sie in Tiled öffnen).
- Ebenen in fester Reihenfolge: `boden` (Kachelebene), `waende` (Kachelebene, über dem Boden),
  `objekte` (Kachelebene, über den Figuren, wenn `properties.ueberFiguren` gesetzt ist),
  `ausloeser` (Objektebene).
- Kollision steht am Kachelsatz: Kacheln mit der Eigenschaft `kollision = true` sind nicht begehbar.
- Möbel und Schmuck (gekaufte Grafik): Objekte mit `type = "moebel"` in der Ebene `ausloeser`,
  Name = Schlüssel in `moebel.json` (Pfad im privaten Register, Breite, Höhe, `kollision`), `x`/`y`
  = linke obere Ecke in Pixeln auf dem Kachelraster. Mit `kollision` ist alles außer der obersten
  Kachelreihe gesperrt; ein Möbel darf keinen Auslöser und keine Figur zustellen (Test).
- Objekte der Ebene `ausloeser` haben `type = "ausloeser"` und einen Namen, der in `orte.json`
  unter `ausloeser` erklärt wird (`start`, `uebergang`, `dialog`, `gegenstand`). Ein Objekt
  `start` mit `richtung` ist der Standardeinstieg. Übergänge (`ziel.karte`, `ziel.ausloeser`)
  gelten je Ort; heißt der Rückweg gleich (Tür „schule“ auf beiden Karten), bekommt der zweite
  Eintrag in `orte.json` das Feld `karte` und geht auf dieser Karte vor. Zwischen Orten reist man
  nicht über Übergänge, sondern über einen Dialog (Bus) mit `~ reise("ort.karte", "ausloeser")`,
  oder zu Fuß über einen Weg: ein Ort mit `art: "weg"` (Nummer 0, ohne Club), dessen Übergänge in
  die Nachbarstädte führen dürfen (docs/spiel/08, W1; Beispiel `wegMapleCedar`).
- Ein Übergang kann `dialog` haben (läuft vor dem Wechsel: Abschied, Ankunft) und `wenn` (eine
  Dialogvariable; ist sie nicht wahr, läuft nur der Dialog, der Held bleibt). Beispiel: Park,
  `landstrasse` mit `wenn: aufbruchGesehen`.
- Figuren stehen nicht in der Tiled-Datei, sondern als Objekte mit dem Namen der Figur in der
  Ebene `ausloeser` (später: `type = "figur"`), damit `orte.json` die Wahrheit über Dialog und
  Gegner bleibt.
- Kachelsätze sind eingebettet (kein `.tsx`), Bildpfad relativ zum Paketordner. Im Prototyp:
  `grafik/platzhalter.png` (CC0), 4 × 4 Kacheln. Gekaufte Grafik (LimeZu) liegt nur lokal unter
  `app/inhalte-privat/abenteuer/grafik/` (gleiche Dateinamen); der Paketbau nimmt sie, wenn sie da
  ist, sonst zeichnet er die Platzhalter.
- Beispiel: `karten/maple-falls-dachboden.json` (12 × 10, Auslöser `start`, `brett`, `treppe`),
  erzeugt mit einem kleinen Skript; die Kacheln 1–8 sind Boden, Wand, Kiste, Teppich, Brett,
  Treppe, Lampe, Fenster.
