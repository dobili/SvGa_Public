# Codepflege im Abenteuer nach Regel 4 (Auftrag 20.11.2026)

Bereich: `app/src/abenteuer`, `app/tests/durchlauf`, `pipeline/abenteuer`. Alles ohne
Verhaltensänderung. Ausgelassen sind die Baustellen anderer Sitzungen:

- `app/src/abenteuer/oberwelt/` und `app/tests/durchlauf/` (mittel-3);
- `pipeline/abenteuer/figurenort` (mittel-4).

Diese Stellen stehen unten als offen.

## Dauerprüfung (neu)

- `app/src/abenteuer/codepflege.test.ts` (läuft in `npm run pruefen`): keine TypeScript-Datei in
  `src/abenteuer` und `tests/durchlauf` über 400 Zeilen, kein `any`.
- `pipeline/tests/test_abenteuer_codepflege.py`: keine Python-, `.cjs`- oder `.mjs`-Datei in
  `pipeline/abenteuer` über 400 Zeilen, kein `typing.Any`.
- `any` in TypeScript verbietet ESLint ohnehin (`no-explicit-any`). Die Prüfung nennt zusätzlich
  Datei und Zeile.
- Einzige Ausnahme mit Grund: `oberwelt/Oberwelt.tsx` (404 Zeilen), Baustelle von mittel-3.
- Die Prüfung hat beim Nachtragen der Docstrings sofort angeschlagen: `kartenbild.py` kam auf 401
  Zeilen. Ich habe es auf 400 zurückgeführt.

## Bestandsaufnahme und Stand

| Punkt | gefunden | behoben | offen |
| --- | --- | --- | --- |
| Dateien über 400 Zeilen | 3 | 2 (`paketlader.ts` 420 → 342, `gesamtsimulation-regeln.cjs` 421 → 297) | `Oberwelt.tsx` 404 (mittel-3) |
| `any` | 0 | – | – |
| verschluckte Fehler (App) | 11 | 4 gemeldet oder begründet | `oberwelt/moebel.ts` (mittel-3); 6 sind gewollte Rückfälle mit Kommentar |
| verschluckte Fehler (`tests/durchlauf`) | 18 `.catch(() => undefined)` | – | alle (mittel-3); fast alle Warten auf Elemente, die fehlen dürfen |
| verschluckte Fehler (Python) | 0 | – | – |
| Dateien ohne Kopf | 2 Tests in `oberwelt/` | – | `ankunft.test.ts`, `eingabepause.test.ts` (mittel-3) |
| öffentliche Funktionen ohne Kommentar (TS) | 25 | 14 | 10 Komponenten in `oberwelt/` und `tests/durchlauf/fenster.ts` (mittel-3) |
| öffentliche Funktionen ohne Docstring (Python) | 50 | 50 | – |
| Funktionen über 40 Zeilen (TS) | 71 | 2 (`abenteuerstandAus` 79, `standNachPartie` 72) | 57 (siehe unten) |
| Funktionen über 40 Zeilen (Python) | 20 | 1 (`ladeWelt` in der Gesamtsimulation) | 19 (siehe unten) |
| nackte Zahlen (TS, grob gezählt) | 354 | – | siehe unten |

### Aufgeteilt

- **`paket/paketlader.ts`**
  - Adressen und Cache-Namen sind nach `paketadresse.ts` umgezogen.
  - Das geprüfte Laden einer Datei samt Übernahme aus der alten Fassung steht jetzt in
    `dateiladen.ts`.
- **`gesamtsimulation-regeln.cjs`**
  - Das Laden der Welt steht jetzt in `gesamtsimulation-welt.cjs`. `ladeWelt` ist dabei in drei
    Teile unter 40 Zeilen zerlegt: Daten, Ink, Objekte der Karten.
  - Die geladene Welt ist byte-gleich zur alten (geprüft per Vergleich). Gesamtsimulation und
    Chaoslauf sind grün (`ABENTEUER_SIMULATION=1`).
- **`regeln/spielstand.ts`, `abenteuerstandAus`:** Die Wertung der laufenden Partie, die
  Listenfelder und die Aufgabenfelder sind jetzt eigene Hilfen.
- **`regeln/rueckweg.ts`, `standNachPartie`:** Münzen (`verdienteMuenzen`) und Abenteuerwertung
  (`gewerteterStand`) sind herausgezogen.

### Verschluckte Fehler

- **Jetzt mit Warnung in der Konsole:**
  - `Abenteuerkarte` (Paketzustand);
  - `KartenleisteAnzeige` (Spieldaten);
  - `useSchutzengel` (Vorrechnen).
- **Gewollte Rückfälle mit Kommentar:**
  - Porträt ohne SVG;
  - Dialog noch nicht übersetzt;
  - unbekannte Ink-Variable;
  - fehlende Tondatei;
  - Paket ohne Netz;
  - Porträtblatt-Aufbau;
  - `paketdateiAlsAdresseOderNull`.

## Offen (für später oder für die jeweilige Sitzung)

### Lange Funktionen (TS), außerhalb von `oberwelt/`

Fast alles sind React-Komponenten. Aufteilen heißt dort Teilkomponenten oder Hooks; das ist
größer und braucht die Oberflächentests.

- Über 100 Zeilen:
  - `KartenleisteAnzeige` (193);
  - `AbenteuerAnsicht` (176);
  - `Dialog` (163);
  - `AufgabenAnsicht`: `Runde` (137) und `AufgabenAnsicht` (120);
  - `PartieHuelle`: `Spielfeld` (116).
- 60 bis 99 Zeilen:
  - `Kartenblick` (83);
  - `AbenteuerAnsicht`: `Spielmenue` (72) und `Startkarte` (70);
  - `useAppdienste` (66);
  - `ErinnerungsRunde` (64);
  - `Partiefaecher` (63);
  - `rundenaufgaben` (63).
- Darunter: rund 15 weitere zwischen 41 und 59 Zeilen.

Reine Rechenfunktionen darunter, die sich wie die zwei oben leicht teilen lassen:

- `regeln/quests.ts`: `wendeWirkungAn` (52) und `werteEreignisAus` (41);
- `partiestart.ts`: `partieeinstellungAus` (50);
- `kipppunkt.ts`: `sucheKipppunkt` (41).

In `oberwelt/` (mittel-3) liegen die längsten:

- `Oberwelt` (338);
- `Deckwahl` (221);
- `Tagebuch` (136);
- `useDialogende` (128);
- `usePartiestart` (111).

### Lange Funktionen (Python)

- `kartentiled.tiled` (121);
- `kartenbild.hintergrund` (91);
- `kartenregeln.pruefe_regeln` (86);
- `kartenbau.platziere` (82);
- `editorrueck.main` (70);
- `kartenbau.baue` (67);
- 13 weitere zwischen 41 und 53 Zeilen.

### Nackte Zahlen

Gezählt habe ich grob: jede Zahl außer 0, 1, 2, −1, 100 und 1000, die nicht in einer Konstante,
einem Typ oder einem Index steht.

- Die meisten Funde sind Datentabellen mit sprechenden Schlüsseln:
  - Tonmotive in `ton/motive.ts` (Stufe, Dauer, Lautstärke je Motiv);
  - Feldgeometrie in `brett/feldstruktur.ts`;
  - Winter- und Bewegungstabellen in `oberwelt/` (mittel-3).
- Diese Tabellen lasse ich als Daten stehen.
- Echte nackte Zahlen in Rechnungen stehen vereinzelt in `regeln/aufgaben.ts` (11),
  `regeln/zeithinweis.ts` (9) und `brett/kontrast.ts` (8). Das ist der nächste sinnvolle Schritt.

Werkzeug der Bestandsaufnahme: ein Skript auf Basis des TypeScript-Compilers und von Pythons
`ast`. Es lag nur in meinem Arbeitsordner und ist nicht im Repository. Die Zahlen oben stammen von
dort.
