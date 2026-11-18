# Codeführer: Dialog und Ink

Alle Gespräche des Spiels sind Ink-Geschichten. Die Quellen liegen in
`inhalte/abenteuer/dialoge/de/*.ink`, eine Datei je Ort oder Szene; der Paketbau übersetzt sie
mit dem Compiler von inkjs nach JSON. Der Code liegt in `app/src/abenteuer/dialog/`.

## Ablauf eines Dialogs

1. Ein Auslöser oder eine Figur nennt einen Knoten `datei.knoten`
   (`maple-falls-dachboden.ambrose_erwacht`).
2. **`dialogdatei.ts`** lädt die übersetzte Datei aus dem Zusatzpaket (ohne Phaser).
3. **`geschichte.ts`** spielt die Geschichte Schritt für Schritt: Zeilen mit Tags, Auswahl,
   Variablen aus dem Spielstand und die **externen Funktionen** (`Wirkungen`): `gibKarte`,
   `gibFund`, `setzeSzene`, `setzeZustand`, `schalteSteckbrief`, `beginnePartie`,
   `beginneAufgaben`, `beginneGedaechtnis`, `oeffneLaden`, `reise`, `zahle`,
   `schreibeTagebuch`, `zeigeFensterbank`, `zeigeAbspann`.
4. **`Dialog.tsx`** zeigt Zeile, Sprecher, Porträt und Auswahl; `dialogtakt.ts` hält `#pause`,
   `useDialogfokus.ts` sorgt für Tastatur und Vorleser.
5. **`oberwelt/dialogwirkungen.ts`** setzt die Wirkungen um: Fund, Karte, Szene, Zustand,
   Steckbrief und Bezahlen sofort, Partie, Runde, Laden und Reise nach dem Dialog.
6. **`stillesende.ts`** fragt an einem Übergang mit Dialog vorab, ob der Knoten überhaupt etwas
   sagt. Endet er ohne Zeile, Auswahl und Wirkung (offene Wegsperre), wechselt
   `oberwelt/useDialogende.ts` die Karte gleich, ohne ein leeres Fenster zu öffnen.

## Tags

Die Tags am Zeilenende steuern Sprecher (`#sprecher:`), Porträtfassung (`#stimmung:`), Pausen,
Musik und Geräusche (`#musik:`, `#geraeusch:`, `#klang:`), Licht und Figuren (`#licht:`,
`#figur:`), Teilchen, Erinnerung im Sepia-Rahmen und Großbilder (`#bild:`). Die vollständige Liste
steht in `inhalte/abenteuer/README.md`, Abschnitt „Ink-Dialoge“.

## Porträts

`Portraet.tsx` zeigt das Bild des Sprechers. `portraetpfad.ts` bildet den Dateinamen,
`portraetblatt.ts` schneidet die Fassung aus dem Porträtblatt (3 × 2 Felder à 64 Pixel, Zuordnung in
`inhalte/abenteuer/portraetblatt.json`), `useGeistsprecher.ts` zeigt Geister halb durchsichtig.

## Variablen über Dialoge hinweg

Die App beginnt jeden Dialog neu. Was über Dialoge hinweg gelten soll, ist eine Ink-`VAR`, die im
Spielstand gespeichert wird (`Figurenstand.dialogvariablen`). Besuchszähler früherer Dialoge
gelten nicht; das prüft `python -m pipeline.abenteuer.inkbesuche`. Einige Variablen setzt die Hülle
selbst aus Ergebnissen (`regeln/dialogvariablen.ts`).

## Prüfen

- `python -m pipeline.abenteuer.sprache`: Zeichen, Anrede, Namen der Spieltexte.
- `node pipeline/abenteuer/gesamtsimulation.cjs --startwert 1`: jeder Knoten erreichbar, keine
  Sackgasse.
