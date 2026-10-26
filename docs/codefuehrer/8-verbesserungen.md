# Verbesserungen für später

Was bei der Durchsicht des Codes am 26.10.2026 aufgefallen ist (Wunsch des Autors: als To-do für
später notieren). Nichts davon ist ein Fehler, den Leser bemerken; es geht um Ordnung, Lesbarkeit
und Wartung. Erledigtes wird hier gestrichen und in `docs/ENTSCHEIDUNGEN.md` festgehalten.

Aufwand: **klein** (unter einer Stunde), **mittel** (ein Arbeitspaket), **groß** (mehrere Sitzungen).

## Regeln aus CLAUDE.md, die der Code gerade nicht ganz einhält

- [ ] **Zwei Dateien über 400 Zeilen** (Regel 4): `spiel/genauigkeit.ts` (413) und
      `ui/komponenten/GegnerWahl.tsx` (407). Je einen Teil in eine eigene Datei auslagern. Weitere
      13 Dateien liegen knapp darunter (360 bis 400 Zeilen). Ausgenommen sind die erzeugten
      Tabellen `engine/maia-zuege-daten.ts` und `spiel/elomodell-daten.ts`. Aufwand: klein.
- [ ] **Die Hülle kennt die Bildschirme.** `app/src/README.md` sagt „kein Modul kennt `ui/`“, aber
      `app/App.tsx` bindet alle Bildschirme ein. Das ist für die Hülle nötig. Entweder `App.tsx`
      nach `ui/` verschieben oder die Regel im README genauer fassen („außer der Hülle“).
      Aufwand: klein.
- [ ] **114 exportierte Werte ohne Kommentar**, meist Zahlen und Tabellen (etwa Grenzwerte). Die
      Funktionen und Bausteine haben seit 26.10.2026 alle einen; die Werte nachziehen.
      `node skripte/konzeptkarte.mjs` listet sie. Aufwand: mittel.
- [ ] **Erzeugte Dateien ohne deutschen Dateikopf:** `daten/generiert/*` und
      `ui/brett/figurenpfade.generiert.ts`. Die Erzeuger (`skripte/erzeuge-typen.mjs` und der
      Figurenpfad-Erzeuger) sollen einen kurzen Kopf mitschreiben. Aufwand: klein.

## Ordnung im Code

- [ ] **`ui/komponenten/` hat 173 Dateien in einem Ordner.** Unterordner nach Themen (etwa
      `gegner/`, `partie/`, `auswertung/`, `profil/`, `hinweise/`, `werkzeugkarten/`) machen ihn
      übersichtlicher, auch in der Konzeptkarte. Viele Importe ändern sich dabei, das Verhalten
      nicht. Aufwand: mittel.
- [ ] **Code der Messläufe liegt zwischen dem Code der App.** `engine/botkandidaten*.ts`,
      `engine/botarchiv.ts`, `engine/botmessnamen.ts`, `engine/botmessung-hilfen.ts`,
      `engine/eloleiter.ts` und `spiel/eichungsrechnung.ts` braucht nur die Messung, nicht die App.
      Ein eigener Ordner (etwa `engine/messung/`) trennt beides sichtbar. Aufwand: klein bis mittel.
- [ ] **18 Paare von Dateien benutzen sich gegenseitig**, vor allem `engine/fehlerart.ts` mit
      seinen sieben Teildateien, dazu `speicher/partien.ts` ↔ `spiel/wertung.ts` und
      `engine/botstaerke.ts` ↔ `engine/gruppe.ts`. Das funktioniert, macht den Weg durch den Code
      aber schwerer zu verfolgen. Gemeinsame Typen in eine eigene Datei legen. Aufwand: mittel.
- [ ] **Doppelter Code beim Kontext der Zugwahl:** `kontextVon` steht fast gleich in
      `engine/zugwahl.ts` und `engine/gruppenwahl.ts`. Eine gemeinsame Funktion verhindert, dass
      eine Änderung nur an einer Stelle landet (geprüft: im Moment verhalten sich beide richtig).
      Aufwand: klein.

## Lesbarkeit der Kommentare

- [ ] **Versionsgeschichte in den Dateiköpfen.** 255 Dateiköpfe erzählen, seit welcher Version
      was gilt („seit 0.2.117 …, bis 0.2.143 …“). Das macht sie lang und für Außenstehende schwer
      lesbar. Die Köpfe auf den heutigen Stand kürzen, die Geschichte steht ohnehin in
      `docs/ENTSCHEIDUNGEN.md`. Aufwand: groß (schrittweise je Ordner möglich).
- [ ] **Ungenutzte Texte finden.** Am 26.10.2026 lagen 13 Texte in `de.json`, die kein Code mehr
      aufrief. Ein Test, der solche Schlüssel meldet, verhindert, dass sich wieder welche sammeln.
      Aufwand: klein.

## Prüfungen (CI)

- [ ] **Zeitgrenze für den Schritt „Browser“.** In der Nacht zum 26.10.2026 hing dieser Schritt in
      GitHub Actions 21 Minuten, bevor ein Test lief. Mit einer Zeitgrenze (etwa 5 Minuten) bricht
      er von selbst ab, und ein Neustart geht schneller. Datei: `.github/workflows/pruefen.yml`.
      Aufwand: klein.

## Messungen, die noch offen sind

- [ ] **Blitz mit Maia, Stufe 7:** Die Korrektur −240 liegt zwischen zwei Messungen, ist selbst
      aber nicht gemessen. Eine Prüfmessung (`skripte/pruefe-anker.sh blitz 7 maia4 mit`)
      bestätigt sie. Aufwand: klein (Rechenzeit eines Mess-Chats).
- [ ] **Blitz ohne Maia, Stufe 8:** einziger Ausreißer der Zeitklassenprüfung (+291 gegenüber der
      Erwartung, alle anderen Stufen im Rauschen). Eine zweite Messung klärt, ob das Zufall war.
      Aufwand: klein.

---

Zurück zur [Übersicht](README.md) · Diese Seite bearbeiten: auf GitHub oben rechts das Stift-Symbol.
