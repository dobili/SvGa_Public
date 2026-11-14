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
