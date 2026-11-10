# Prüfbericht Dialoge, Runde 10 (mittel-2, 10.11.2026)

Auftrag: `docs/spiel/auftraege/runde10_dialoge.md`. Entscheidung dazu: `docs/spiel/ENTSCHEIDUNGEN.md`,
„Dialoge: glaubwürdig, keine Buchverweise“. Maßstab für Teil 2: `docs/spiel/05_Story_Bibel.md`,
Abschnitt 5 (Sprechweisen), und die Lage der Szene.

## Teil 1: Buchverweise

Entfernt wurden alle Verweise auf das Buch: Kapitel, Abschnitte, Nummern wie „1.4“, „im Buch“,
„nachlesen“, „Handbuch“, „Lektion“ und der Platzhalter `{kapitel}`.

| Stelle                                      | Geändert                                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------------- |
| `inhalte/abenteuer/texte/de.json`           | 80 Texte: 39 Kartenerklärungen, 12 Lernkartentexte, 1 Questschritt, 28 Fundtexte |
| Ink-Dialoge                                 | 52 Zeilen in 23 Dateien                                                          |
| `app/src/i18n` (`abenteuer.*`, `imSpiel.*`) | nichts gefunden                                                                  |
| `app/src/abenteuer`                         | `oberwelt/kern.ts` übergibt der Lernkarten-Meldung kein Kapitel mehr             |

Die Datenfelder `kapitel` in Karten, Aufgaben und Begegnungen sind unverändert.

**Prüfung:** `pipeline/tests/test_abenteuer_buchverweise.py` liest die Spieltexte, die gesprochenen
Zeilen aller Ink-Dateien und die Abenteuertexte der App (de und en). Einzige Ausnahme ist
`abspann.mitwirkende.buch` (der Abspann nennt das Buch als Quelle).

**Schnitzeljagd:** Die Entscheidung nennt Seiten aus „Ambroses altem Buch“. Im Spiel gehören die
dreizehn Seiten zum Manuskript des Wanderers (Quest „Die verlorenen Seiten“, Geschenk nach dem
Finale). Die Quest blieb, wie sie ist; die Funde nennen aber kein Kapitel und keinen Titel mehr:
„Lose Seite (Bahndamm)“, Text „Eine lose Seite voller Schachdiagramme, gefunden …“. Der Wanderer
spricht von „dreizehn Seiten“, sein Geschenk heißt „Das Buch des Wanderers“. Soll es Ambroses Buch
werden, ist das ein Umbau der Quest und ein eigener Auftrag.

## Teil 2: Glaubwürdigkeit

Gelesen wurden alle 68 Ink-Dateien (2687 gesprochene oder erzählte Zeilen) und die 321
Statistensätze. Knoten, Variablen, Aufrufe und Schlüssel sind unverändert; Länge und Sinn der
Aufgaben blieben.

| Ort                                      | Zeilen | geändert |
| ---------------------------------------- | -----: | -------: |
| Maple Falls                              |    295 |       35 |
| Weg Maple–Cedar und Kürbishof            |     78 |        7 |
| Cedar Creek                              |    257 |        2 |
| Weg Cedar–Riverton                       |     52 |        3 |
| Riverton, Erinnerung London              |    219 |        0 |
| Weg Riverton–Ironwood, Lockport          |    112 |        3 |
| Ironwood, Steinbruch                     |    208 |        6 |
| Weg Ironwood–Silicon                     |     53 |        6 |
| Silicon Bay, Pelikaninsel                |    171 |       11 |
| Weg Silicon–Delacroix                    |     49 |        2 |
| Port Delacroix, Bayou                    |    215 |        5 |
| Weg Delacroix–Desert, Sternwarte         |     71 |        4 |
| Desert Springs                           |     93 |        0 |
| Weg Desert–Summit, Hochebene             |    122 |        4 |
| Summit City                              |    150 |        3 |
| Weg Summit–Crossroads                    |     52 |        7 |
| Crossroads, Jahrmarkt                    |     84 |        0 |
| Weg Crossroads–Pinewood, Pinewood Camp   |     77 |        4 |
| Weg Pinewood–Ghost, Ghost Town, Goldmine |    136 |        1 |
| Weg Ghost–Capital                        |     50 |        7 |
| Capital Arena                            |    143 |        4 |
| **Summe**                                |   2687 |      114 |

Die Zahl „geändert“ zählt Teil 1 und Teil 2 zusammen (Zeilen laut `git diff`).

**Befund:** Außerhalb des Dachbodens passen die Dialoge schon gut zu den Figuren; die Sprechweisen
der Story-Bibel sind eingehalten. Umgeschrieben wurde deshalb vor allem der Anfang. Sonst gab es
fünf wiederkehrende Fehler:

1. Ambrose doziert oder erklärt die Bedienung (Dachboden, Schach960 im Musikhaus).
2. Ambrose siezt plötzlich („Ihre Mutter“, „Ihr erster Sieg“): sieben Stellen, jetzt du-Form.
3. Eine Figur weiß etwas, das sie nicht wissen kann (Ambrose kennt den Drechsler in Cedar Creek;
   Ray Castillo antwortet auf einen Satz von Ambrose, den er nicht hört).
4. Erzähltext steht unter dem Namen einer Figur („Nova dreht sich um und geht schnell“ als Novas
   Satz): neun Stellen.
5. Anrede mit Geschlecht („die Richtige“, „das, das die Tafel gelöst hat“).

## Zehn Beispiele

1. Dachboden, Ambrose erwacht. Vorher: „Ambrose Whitlock, zu Diensten. New Orleans, 1858. Ich habe
   gegen Männer gespielt, deren Namen du in Büchern findest.“ Jetzt: „Ein Kind. Bei allen Heiligen,
   ein Kind hält meinen König. Wie lange habe ich in dieser Kiste gelegen?“
2. Dachboden, vor der ersten Partie. Vorher: „Wir fangen vorne an. Nicht mit Tricks. Mit der einen
   Frage, die jeder Zug beantworten muss: Was hängt?“ Jetzt: „Stell ihn zurück. Sachte. Sag mir nur
   eines: Spielt man noch, dort draußen?“
3. Dachboden, nach der Partie. Vorher: „Wer mehr wissen will: Kapitel 1, Abschnitt 1.4. Ein Buch,
   das ich gern geschrieben hätte.“ Jetzt: „Ich habe das an einem verlorenen Turm gelernt, vor einem
   vollen Kaffeehaus. Du lernst es billiger.“
4. Dachboden, der Fingerzeig. Vorher: „Einmal je Partie darfst du ihn spielen. Er geht nicht
   verloren.“ Jetzt: „Einmal in jeder Partie darfst du mich so fragen. Morgen wieder, und übermorgen
   auch.“
5. Maple Falls, Lily. Vorher (Erzähler): „Der Springer zieht zwei Felder geradeaus und eins zur
   Seite. Wie ein L.“ Jetzt: „Du setzt den Springer auf ihr Brett und fährst mit dem Finger: zwei
   Felder geradeaus, eins zur Seite. Wie ein L.“
6. Kartentext Gefahrenradar. Vorher: „… Was hängt bei mir? Kapitel 4, Abschnitt 4.2, die goldene
   Verteidigungsregel gegen Fallen.“ Jetzt endet der Text bei „Was hängt bei mir?“.
7. Lernkarte. Vorher: „Für Kapitel {kapitel} im Buch: die Karte ‚{karte}‘. Du hast im Buch gezählt.
   Jetzt zählst du im Park.“ Jetzt: „Ambrose reicht dir eine neue Karte: ‚{karte}‘. Du hast das
   Zählen geübt. Jetzt zählst du im Park.“
8. Raststätte, Kowalczyk. Vorher: „Das steht in Kapitel 1, Abschnitt 1.2. Die Dame zu früh, das ist
   eine Todsünde.“ Jetzt: „Die Dame zu früh, das ist eine Todsünde. Ich hab's ihm erst geglaubt, als
   meine weg war.“
9. Musikhaus, Schach960. Vorher erklärte Ambrose die Regeln und sagte: „Zum Rochieren tippst du am
   Brett erst den König an …“. Jetzt erklärt Mabel („Wir nennen es Schach960 …“, „Zum Rochieren
   fasst du erst den König an …“), und Ambrose staunt weiter („Jetzt lerne ich es eben.“).
10. Silicon Bay, Victor. Vorher: „Sieh sie dir an. Mit deiner App, nicht mit unserer.“ Jetzt: „Sieh
    sie dir an. Mit deinem eigenen Kopf, nicht mit unserem Programm.“

## Offen

- **Schnitzeljagd:** Wanderer oder Ambrose (siehe oben). Entscheidung des Autors.
- **Karten als Gegenstand der Welt:** Läden verkaufen „Karten“, Turnierleiterin und Clubchefs sagen
  „ohne Karten“. Das blieb, weil die Karten in der Welt als Schachkarten vorkommen. Ambroses eigene
  Karten sind jetzt als Versprechen formuliert („Nenn es Mentor-Zug“). Soll niemand außer Ambrose
  von Karten reden, wären etwa 15 Sätze und die Ladentexte zu ändern.
- **Variantentisch in der Raststätte:** „Kommt bald an den Tisch.“ und „Das geht schon.“ sind
  Platzhalter für Spielformen, die noch nicht gebaut sind. Sie verschwinden mit den Formen.
- **Odette Finch und Rosalind Kettering** sprechen als Erzähltext in Anführungszeichen (ohne
  Porträt). Das ist glaubwürdig, aber uneinheitlich; mit Porträts könnten sie eigene Sprecherinnen
  werden.
- **Greta an der Hütte** sieht Ambrose („Der Geist da spielt doch, oder?“). Das ist die einzige
  Figur außer dem Helden, die ihn bemerkt (Ward ahnt ihn nur). Blieb, weil die Blindpartie darauf
  aufbaut.
- **Statisten:** Viele Sätze sind kleine Geschichtsstunden („Wusstest du, dass …“). Sie passen zu
  den Figuren (Rentner, Lehrer, Försterin) und blieben. Wem das zu lehrhaft ist: Es betrifft etwa
  40 der 321 Sätze.
- **Questtexte, Steckbriefe, Vorführungen** (rund 550 Texte) wurden nur mit Suchmustern geprüft
  (Buchverweise, Anrede, Bedienwörter), nicht Satz für Satz gelesen.
- **Englisch:** `inhalte/abenteuer/texte` hat nur `de.json`; für eine Übersetzung gilt der Test
  ebenfalls.
