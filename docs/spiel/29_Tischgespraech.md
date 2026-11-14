# 29 Tischgespräch: Porträts und Sprechblasen am Brett

Stand 14.11.2026. Wunsch des Autors: Auch beim Schach (Partie, Rätsel, Werkzeug) sieht man, mit
wem man es zu tun hat. Porträts mit Stimmung, Sprechblasen über und unter dem Brett, und die
Figuren sagen ab und zu etwas zur Stellung oder zur Antwort, je nach Charakter: necken, Mut
machen, trocken kommentieren. Alles hier gilt nach Regel 9 als umgesetzt, Widerspruch genügt.

## 1. Was es schon gibt

- **Kopf der Spielhülle:** Porträt des Gegners oder dessen, der die Aufgaben stellt, mit Name und
  Ort (`anbindung/Huelle.tsx`).
- **Partiemomente:** Feste Zeilen einer Begegnung aus `begegnungen.json` (`momente`), über dem
  Brett, mit Porträt, ohne die Partie anzuhalten (`anbindung/Momentzeile.tsx`,
  `regeln/partiemomente.ts`).
- **Sprüche der Kartenleiste:** Der Held sagt einen Spruch, der Gegner kontert
  (`anbindung/spruchkarte.ts`).

Was fehlt: eine Stimme für die vielen Partien und Rätsel ohne geschriebenen Moment, und eine feste
Ordnung, wer wo spricht.

## 2. Wer wo spricht

```
┌──────────────────────────────────────┐
│ [Porträt] Skater Jo · Hauptstraße    │  Kopf (bleibt)
│  ╭───────────────────────────────╮   │
│  │ „Mutig. Mal sehen, ob's hält.“│◀──│  Blase des Gegners, Porträt in Stimmung
│  ╰───────────────────────────────╯   │
│  ┌────────────────────────────────┐  │
│  │             Brett              │  │
│  └────────────────────────────────┘  │
│  ╭───────────────────────────────╮   │
│──▶│ Ambrose: „Zähl erst nach.“   │   │  Blase unten: Ambrose (als Geist) oder der Held
│  ╰───────────────────────────────╯   │
│  Kartenleiste · Status · Aufgeben    │
└──────────────────────────────────────┘
```

- **Oben:** wer gegenübersitzt oder die Aufgabe stellt. Die Blase zeigt das Porträt in der
  Stimmung der Zeile; der Kopf der Hülle wechselt mit.
- **Unten:** Ambrose (halb durchsichtig wie in der Welt) oder der Held selbst, wenn er einen Spruch
  spielt.
- **Nie blockierend:** Die Blase legt sich nicht aufs Brett, das Brett bleibt bedienbar, die Engine
  rechnet weiter. Sie verschwindet nach einer Lesedauer (wie die Partiemomente) oder auf Tipp.
- Geschriebene Momente und Sprüche gehen immer vor; das Tischgespräch füllt nur die Lücken.

## 3. Wann jemand spricht

**Ereignisse der Partie** (aus dem Verlauf, ohne Engine-Bewertung):

| Ereignis                      | Auslöser                                                 |
| ----------------------------- | -------------------------------------------------------- |
| `beginn`                      | erster Halbzug des Gegners                               |
| `schlaegtFigur`               | der Gegner schlägt eine Leichtfigur oder mehr            |
| `verliertFigur`               | der Held schlägt eine Leichtfigur oder mehr              |
| `schach`                      | der Held gibt Schach                                     |
| `gibtSchach`                  | der Gegner gibt Schach                                   |
| `rochade`                     | der Held rochiert                                        |
| `umwandlung`                  | eine Seite wandelt um                                    |
| `vorne`                       | der Held liegt erstmals mit drei Bauerneinheiten vorn    |
| `hinten`                      | der Held liegt erstmals mit drei Bauerneinheiten zurück  |
| `zeitnot`                     | die Uhr des Helden fällt unter 30 Sekunden (nur mit Uhr) |
| `sieg`, `remis`, `niederlage` | Ende der Partie, auf der Ergebnisseite der Hülle         |

**Ereignisse der Rätsel:** `richtig`, `falsch`, `hinweis` (Ambrose gefragt), `serie` (drei
richtig hintereinander), `letzte` (vor der letzten Aufgabe der Runde).

**Häufigkeit:** Je Ereignis spricht jemand mit Wahrscheinlichkeit 35 Prozent; danach mindestens vier
Halbzüge Pause; höchstens sechs Zeilen je Partie. Bei Rätseln höchstens eine Zeile je Aufgabe.
Ende der Partie und `hinten` sprechen immer. Der Zufall ist je Partie fest (Kennung der Partie als
Startwert), damit Neuladen nichts ändert.

**Wer antwortet:** Der Gegner spricht zu seinen Ereignissen. Ambrose spricht unten nur zu
`hinten`, `zeitnot`, `falsch` (zweites Mal in Folge) und `hinweis`, und nie, wenn er im Kapitel
fehlt (`regeln/abwesenheit.ts`). Ambrose verrät nie einen Zug; er erinnert an Werkzeuge des Spiels
(„Zähl die Angreifer.“, „Was droht er?“).

## 4. Charakter

Jeder Gegner bekommt in `gegner.json` ein `temperament`. Ohne Angabe folgt es aus der Rolle.

| Temperament   | So spricht er                               | Vorgabe für                 |
| ------------- | ------------------------------------------- | --------------------------- |
| `frech`       | neckt, nie gemein, gibt Fehler gern zu      | Straßengegner, Jugendliche  |
| `herzlich`    | macht Mut, freut sich mit                   | Clubmitglieder, Kinder      |
| `trocken`     | knapp, sachlich, ein leises Lob             | Clubchefs, Trainer          |
| `ehrgeizig`   | will gewinnen, ärgert sich hörbar über sich | Rivalen, Turnierspieler     |
| `kuehl`       | gleichmäßig, ohne Gefühl, rechnet laut      | Konzern, Victor (bis Akt 4) |
| `verschmitzt` | Rätselsteller, Andeutungen, Fragen          | Ambrose, Lehrer             |

Leitsatz 5 gilt: Kein Spott, wenn der Held verliert oder ein Rätsel nicht schafft. `frech` neckt
während der Partie und beim ersten falschen Versuch, am Ende ist auch er fair.

## 5. Texte

- Allgemeine Zeilen je Temperament und Ereignis in `inhalte/abenteuer/texte/de.json` unter
  `tisch.<temperament>.<ereignis>.<n>` (drei bis fünf je Fall, gezogen ohne Wiederholung in einer
  Partie), dazu die Stimmung des Porträts unter `tisch.<temperament>.<ereignis>.stimmung`.
- Eigene Zeilen einer Figur gehen vor: `tisch.figur.<kennung>.<ereignis>.<n>`. So bekommen die
  wichtigen Figuren (Skater Jo, Slick, Big Joe, Mira, Victor) ihre eigene Stimme, ohne dass jede
  Begegnung Momente schreiben muss.
- Ambroses Zeilen: `tisch.ambrose.<ereignis>.<n>`.
- Texte, die der Autor absegnen soll, gelten nach Regel 9 vorerst als abgesegnet.

## 6. Karten sprechen (Wunsch des Autors, 14.11.2026)

Jede Karte, die in der Partie gespielt wird, kommt mit einer Sprechblase, nie stumm:

- **Schutzengel:** Ambrose hält den Zug in der Blase unten auf. Je Grund (`halt`, `haengt`,
  `koenig`, `matt`) mindestens sechs Zeilen statt einer, gezogen ohne Wiederholung in einer
  Partie; Stimmung des Porträts `ueberrascht` oder `ernst`.
- **Sprüche (Großes Maul, Schmeichelei, Ablenkung, Grübelfalle, Kühler Kopf):** Der Held spricht
  unten, der Gegner antwortet oben. Je Karte mindestens fünfzehn Zeilen. Der Gegner kontert passend
  zu seinem Temperament (`spruch.konter.<temperament>.<n>`, je Temperament mindestens fünf) oder mit
  eigenen Zeilen der Figur. Ein immuner Gegner hat eigene Abwehrzeilen, auch passend zum
  Temperament.
- **Werkzeug- und Zeitkarten (Lupe, Drohung, Waage, Limo …):** eine kurze Zeile des Helden oder
  Ambroses zur Wirkung, mindestens vier Varianten je Karte.
- Wie im Tischgespräch: kein Spott bei Niederlage, Zufall fest je Partie.

## 7. Kartenfächer (Wunsch des Autors, 14.11.2026)

Die Karten der Partie sind keine Textknöpfe mehr, sondern Karten:

- Unten unter dem Brett ein Fächer der Karten des Decks, waagerecht zum Durchwischen, jede Karte
  hochkant (3:4) mit Motiv, Name darunter, Rand in der Farbe der Stufe (leicht Grün, mittel Blau,
  stark Gold), im Pixelrahmen des Spiels.
- Antippen hebt die Karte groß heraus: Motiv, Name, Spruch der Karte, Ambroses Erklärung, Knopf
  „Ausspielen“ (oder ausgegraut mit Grund, warum sie gerade nicht geht). Ausspielen löst die
  Sprechblase der Karte aus (Abschnitt 6).
- Gespielte Verbrauchskarten liegen umgedreht (Rückseite), dauerhafte Karten tragen einen Glanz,
  solange sie wirken.
- Dieselbe Darstellung in der Deckwahl vor der Partie.
- Motive: `karten/<kennung>.webp` im Paket (Feld `bild` in `karten.json`), gemalt von Gemini
  nach `auftraege/gemini_prompts_9_karten.md`; ohne Bild eine gezeichnete Karte mit Muster.

**Gebaut (14.11.2026), Widerspruch genügt:**

- **Karte:** `anbindung/Spielkarte.tsx`, Stil in `spielkarte.css`. Hochkant 3:4, 78 Pixel breit,
  Motiv oben, Name darunter; Rand in der Stufenfarbe (leicht `#5e9c6e`, mittel `#5b86c4`, stark
  Gold), pixelig abgesetzt mit harten Ecken und Navy-Kante. Ohne Motiv im Paket ist die Karte
  gezeichnet: Rautenmuster auf der Stufenfarbe und ein Schachsymbol je Wirkung (Springer für
  Fingerzeig und Sprüche, Läufer für Werkzeuge und Waage, Turm für Gefahrenradar und Was droht?,
  König für Schutzengel und Remis …). Die Rückseite (`karten/rueckseite.webp`) ist ohne Bild ein
  goldenes Gitter auf Navy.
- **Fächer:** `anbindung/Kartenfaecher.tsx` (Liste, waagerecht, Scroll-Snap, nie breiter als die
  Spalte; das Brett behält auf 390 Pixeln seine volle Breite) und `anbindung/Partiefaecher.tsx`
  (Fächer der Partie in der Kartenleiste, `KartenleisteAnzeige.tsx`).
- **Zustand und Grund** je Karte in `regeln/kartenzustand.ts` (Tests in
  `regeln/kartenzustand.test.ts`): spielbar (hell), gesperrt (gedämpft, aber antippbar), wirkt
  (dauerhafte Karte, gespielt in dieser Stellung: Glanz, mit `prefers-reduced-motion` ein ruhiger
  Schein), gespielt (dauerhaft, einmal je Partie: gedämpft), verbraucht (umgedreht). Die Gründe
  folgen `kartenSpielbar` und `passtZurPartie`, je Fall ein Satz unter `faecher.grund.*` in
  `texte/de.json` („Eine Karte je Zug. Zieh erst.“, „Erst nach deinem ersten Zug.“, „Zeitkarten
  wirken nur in Partien mit Uhr.“ …).
- **Herausgehobene Karte:** `anbindung/Kartenblick.tsx`, über dem Brett mit abgedunkeltem Grund:
  Motiv, Name, Spruch, Ambroses Erklärung, Grund in einer Zeile, „Ausspielen“ (aus, wenn sie
  nicht geht) und „Zurück“; Zurück-Taste, Escape und Tipp daneben schließen. „Ausspielen“ ist der
  frühere Kartenknopf samt Sprechblasen.
- **Deckwahl:** dieselbe Karte im selben Fächer (`oberwelt/Deckwahl.tsx`); Antippen nimmt die
  Karte ins Deck (Haken, goldener Grund) oder heraus, volle oder gesperrte Karten sind gedämpft.
- **Vorleser:** Jede Karte ist ein Knopf mit Name und Zustand („Fingerzeig, spielbar“, „Waage,
  verbraucht“, in der Deckwahl „im Deck“).
- **Sprechblase unten:** Auf 390 × 844 liegt sie über dem Fuß, nicht über dem Fächer; die Hülle
  hat unten Platz für sie, damit man auf kleineren Handys den Fächer darüber schieben kann.
- Testkennungen bleiben `abenteuer-karte-<kennung>` und `abenteuer-deckkarte-<kennung>`, neu
  `abenteuer-karte-gross`, `-ausspielen`, `-zurueck`, `-grund`; der Zustand steht in
  `data-ansicht` (hell, gedaempft, glanz, rueckseite).

Offen: die gemalten Motive und die Rückseite (Gemini), danach ein Blick, ob 78 Pixel für die
Motive reichen.

## 8. Stimmungen der Dialoge (14.11.2026)

Jede Sprechzeile der Ink-Dialoge (`inhalte/abenteuer/dialoge/de/`), deren Inhalt eine Färbung
trägt, hat jetzt eine `#stimmung`, damit das Porträt das passende Gesicht zeigt. Ergänzt wurden
1.620 Zeilen, nur mit den sechs Fassungen, ohne neue Wörter in `portraetblatt.json`:

| Gesicht      | neu ergänzt | mit den 499 älteren Marken |
| ------------ | ----------: | -------------------------: |
| laechelt     |         798 |                        980 |
| nachdenklich |         518 |                        638 |
| bitter       |         115 |                        162 |
| lacht        |          99 |                        191 |
| ueberrascht  |          90 |                        107 |
| neutral      |           – |      41 (`jung` und `alt`) |

- Ohne Marke, also neutral, bleiben 119 Sprechzeilen: Auskünfte, Ansagen der Turnierleiterin,
  Regelerklärungen, Grüße ohne Färbung. Der Erzähler hat kein Porträt und keine Marken.
- Victor ist bis Akt 3 kühl (bitter, nachdenklich) und wird ab Summit City und der Capital Arena
  heller; Ambrose ist meist verschmitzt (lächelt), in den Erinnerungen an 1858 und 1866 bitter
  oder nachdenklich.
- Bestehende Marken sind unverändert, Text und Ablauf ebenso.
- Offen: In `erinnerung-london.ink` tragen vier Zeilen des jungen Ambrose kein `#stimmung:jung`
  („Und ich bin hier, um Klavierholz zu kaufen.“, „Jetzt. Halt. Schau hin.“, „Er hat einen Turm
  weniger …“, „Noch nicht, {held}. …“). Sie bleiben vorerst ohne Marke; eine Stimmung würde das
  Gesicht des alten Ambrose zeigen. Gehört `jung` dazu, zeigt die Zeile das junge Gesicht, aber
  ohne Ausdruck, weil je Zeile nur eine `#stimmung` gilt.

## 7. Stand der Umsetzung (14.11.2026)

Gebaut, Widerspruch genügt:

- **Gemeinsame Sprechblase** in zwei Lagen (`anbindung/Tischblase.tsx`, Warteschlange und Vorrang
  in `anbindung/tischblasen.ts`, Kontext in `anbindung/tischkontext.ts`, Stil in `huelle.css`).
  Oben fest über dem Kopf, unten fest über dem Fuß, nie auf dem Brett; Lesedauer oder Tipp. Der
  Kopf der Hülle zeigt die Stimmung der oberen Zeile. Geschriebenes (Momente, Sprüche, Karten,
  Schutzengel, Ende der Partie) verdrängt das Tischgespräch in beiden Lagen.
- Momentzeile, Schutzengelzeile und die Sprüche der Kartenleiste sprechen jetzt in die Blase; die
  Kartenleiste zeigt nur noch, was eine Karte herausfand (`anbindung/kartenstimme.ts`). Ohne Hülle
  (Partie-Bildschirm der App) steht alles wie früher in der Leiste.
- **Regeln** (`regeln/tischereignisse.ts`, `regeln/tischgespraech.ts`, Tests in
  `regeln/tischgespraech.test.ts`): Ereignisse aus dem Verlauf, 35 Prozent, vier Halbzüge Pause,
  höchstens sechs Zeilen, `hinten` und Ende immer, fester Zufall aus der Kennung der Partie, Zeilen
  ohne Wiederholung. Rätsel: höchstens eine Zeile je Aufgabe, Serie immer, Ambrose beim Hinweis und
  beim zweiten Fehler in Folge.
- **Anbindung:** `anbindung/Tischgespraech.tsx` (Partie, Zeitnot, Ende, Schmeichelei vor der
  Partie), `anbindung/useRaetselgespraech.ts` (Aufgabenrunde und Erinnerung), Hinweis über
  `HinweisKontext` in `ui/trainer/imSpiel.ts` („Ambrose fragen“ in Taktik- und Endspielaufgaben).
  Ambrose fehlt im Tiefpunkt und im Finale (`schutzengelGesperrt`) und unten, wenn er selbst stellt.
- **Temperament** in `gegner.json` und Schema (optional), gesetzt für Ambrose, Jo, Victor (kühl,
  im Finale ehrgeizig), Slick, Big Joe, Mira, Mama und einige weitere; sonst die Vorgabe der Rolle.
- **Texte** in `inhalte/abenteuer/texte/de.json`: `tisch.<temperament>.<ereignis>.<n>` (drei bis
  fünf je Fall, Stimmung unter `.stimmung`), eigene Zeilen für Jo, Slick, Big Joe, Mira, Victor
  (`tisch.figur.<name>.…`, Victor im Finale `tisch.figur.capitalArena.victor.…`), Ambrose
  (`tisch.ambrose.…`), Sprüche je 16, `spruch.konter.<temperament>` je 6, `spruch.immun.<temperament>`
  je 3, Schutzengel je Grund 7, `karte.<kennung>.zeile.<n>` je 4 für alle 30 Karten in der Partie.

Offen: Rätselzeilen für die fünf Figuren selbst (sie sprechen in Rätseln mit ihrem Temperament),
Zeilen für die Vorgabekarten und die Farbwahl, und ob die untere Blase auf kleinen Handys die
Kartenleiste zu lange verdeckt (Tipp blendet sie aus).
