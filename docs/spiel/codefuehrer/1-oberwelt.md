# Codeführer: Oberwelt

Die Oberwelt ist die begehbare Welt: eine Phaser-Szene mit Tiled-Karte, dem Held, Figuren,
Statisten und Tieren, eingebettet in einen React-Rahmen. Der Code liegt in
`app/src/abenteuer/oberwelt/`.

## Der Weg durch den Code

1. **`Oberwelt.tsx`** ist der React-Rahmen: Steuerkreuz, Kopfleiste, Dialogfenster, Tagebuch,
   Meldungen, Ergebniskarten und der Rückweg aus Partie und Aufgabenrunde. Die Logik steckt in
   Hooks (`useWeltladen`, `usePartiestart`, `useAufgabenrunde`, `useDialogende`, `useBuehne`,
   `useZielhinweis`).
2. **`kern.ts`** hält den gemeinsamen Kern dieser Hooks: Spielstand, geladene Welt, das laufende
   Phaser-Spiel, Meldungen, Questereignisse, Kartenwechsel und Tönung. Meldungen, die in einem
   offenen Dialog entstehen („Neu im Tagebuch …“, Funde), warten in **`meldungsstau.ts`** und
   erscheinen nach dem Dialog der Reihe nach.
3. **`weltdaten.ts`** lädt für eine Karte des Spielstands Spieldaten, Karte und Bilder und deutet
   die Tiled-Objekte über `orte.json` (Auslöser, Figuren, Aktionen, Sprechblasen).
4. **`oberweltspiel.ts`** startet und beendet das Phaser-Spiel; **`szene.ts`** ist die Szene
   selbst (Karte, Held, Kollision, Auslöser), ihre Typen stehen in `szenentypen.ts`.

## Bewegung und Kollision

- `begehbar.ts` (Kacheln), `feinsperren.ts` (Viertelkacheln von 4 × 4 Pixeln), `sperrkarte.ts`
  und `mittenkacheln.ts` sagen, wo der Held stehen darf. Alles reine Logik ohne Phaser, deshalb
  in Vitest prüfbar.
- `laufhilfe.ts` rückt den Held seitlich um Ecken, `tippschritt.ts` macht aus kurzem Antippen
  genau einen Schritt, `eingabepause.ts` sperrt die Eingabe kurz nach einem Kartenwechsel.
- `ausloeserebene.ts` findet den Auslöser, den der Held trifft; `ankunft.ts` setzt ihn nach einem
  Übergang auf das erste freie Feld vor dem Durchgang.

## Kamera und Bild

- `kamera.ts`, `kameraregie.ts`, `kameravoraus.ts`, `kamerafuehrung.ts`: Grenzen am Kartenrand,
  Versatz neben den Bedienelementen, vorausschauende Kamera.
- `weltmassstab.ts`: Maßstab auf dem Bildschirm (Karte dreifach, Figuren zweifach).
- `toenung.ts` und `toenungsschicht.ts`, `teilchen.ts` und `teilchenbahn.ts`, `schneefall.ts`,
  `winter.ts`: Licht, Teilchen und Winter ohne eigene Schneebilder.

## Figuren, Möbel, Belebung

- `figurenaufstellung.ts`, `figurbilder.ts`, `figurbogen.ts`, `figurensitz.ts`, `sitzplatz.ts`,
  `sitzrichtung.ts`, `sitzumriss.ts`, `geistfigur.ts`, `figurblende.ts`: Figuren stehen, sitzen,
  schweben und blenden ein oder aus. Eine Figur sperrt genau ihre Fußkachel
  (`legeFestkoerperAufKachel` in `figurbilder.ts`), nicht die Kachel, in die ihr Kopf ragt.
  Sitzende (Figuren und Statisten) sperren dazu ihren Sitzpunkt (`sitzsperre` in `sitzplatz.ts`),
  weil ihr Bild aufs Sitzmöbel rückt und der Held sonst in ihnen stünde. Die Rechnung ohne Phaser
  (`begehbar.ts`, `sitzkacheln`) und die Pipeline (`figurensperre.py`) nehmen dafür die Kachel über
  einer Sitzenden auf einem Sitzmöbel als gesperrt (eher eine Kachel zu viel: Wie weit das Bild
  rückt, hängt von den Bildern ab).
- `moebel.ts`, `moebelform.ts`, `moebelzuschnitt.ts`: Möbel aus dem Katalog mit Drehung,
  Spiegelung, Maßstab und Zuschnitt aus dem Karteneditor.
- `belebung.ts`, `belebungsbewegung.ts`, `belebungsschicht.ts`, `tiere.ts`: Statisten und Tiere,
  einfache Schritte ohne Physik, nur im Sichtbereich. Ihre Sperrfläche hält den Helden auf und
  geht nur aus, solange er in ihr steckt (`sperreAn`: Überlappung mit dem 12 Pixel breiten Körper
  des Helden). Bis zum 18.11.2026 ging sie zwei Pixel vor dem Anstoßen aus, und der Held lief
  geradeaus durch jeden Statisten; `figurensperre.py` prüft seitdem, dass feste Statisten keinen
  Auslöser und keine Figur abschneiden.
- `ausloeserebene.ts`: Der Auslöser, auf dem der Held ankommt, schweigt, bis er ihn verlässt oder
  dort eine Drittelsekunde stillstand und dann in den Durchgang geht (`RUHEBILDER`). So reagiert
  ein gesperrter Übergang wieder, wenn der Held nach einer Partie auf ihm steht (Wegsperren).

## Zustände und Fassungen

`kartenfassung.ts` wählt die Fassung einer Karte nach ihren Zuständen (`zustaende` in
`orte.json`); die Bedingungen rechnet `regeln/bedingung.ts`.

## Fenster über der Welt

`Tagebuch.tsx` (Quests, Karten, Nadeln, „Was jetzt?“ aus `wasjetzt.ts`), `Laden.tsx`,
`Reisen.tsx` (Monatskarte), `Deckwahl.tsx`, `Ergebniskarten.tsx`, `Fensterbank.tsx`,
`Vorfuehrung.tsx`, `Gedaechtnisstellung.tsx`, `Abspann.tsx`, `Orientierung.tsx`
(Zielhinweis, Ortsschild, erste Erklärungen).

## Prüfen

Reine Regeln haben Vitest-Tests neben sich (`*.test.ts`). Die Oberfläche prüfen die
Playwright-Tests in `app/tests/e2e/` mit Namen `abenteuer-*`.
