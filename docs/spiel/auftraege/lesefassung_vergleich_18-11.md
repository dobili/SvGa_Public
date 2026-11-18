# Lesefassung 18.11.2026 gegen 17.11.2026, Wirtschaft mit dem Testteam

Auftrag des Hauptchats (18.11.2026): Lesefassung auf dem aktuellen Stand neu erzeugen (Wegsperren,
Testteam, Dialogprüfung, S17 nur mit Sieg), mit der vorigen Fassung vergleichen, Funde beheben;
danach Wirtschaft und Chaos prüfen, weil die Nebenquest „Das Testteam“ 40 Münzen mehr bringt.

Neue Fassung: `lesefassung_18-11.md` (`node pipeline/abenteuer/lesefassung.cjs --ziel … --akte`,
Startwert 1), vorige: `lesefassung_17-11.md`.

## Umfang

| Teil             | Dialoge 17.11. | Dialoge 18.11. | Wörter 17.11. | Wörter 18.11. |
| ---------------- | -------------: | -------------: | ------------: | ------------: |
| Akt 1            |            248 |            252 |         11164 |         11412 |
| Akt 2            |            254 |            255 |         10758 |         11148 |
| Akt 3            |            282 |            289 |         12914 |         13136 |
| Akt 4            |            374 |            371 |         16061 |         16070 |
| Nach dem Abspann |             35 |             58 |          1226 |          1734 |
| Gesamt           |           1193 |           1225 |         52123 |         53500 |

Ungelesene Knoten: 112 von 1135 (vorher 102 von 1100); dazugekommen sind vor allem die Niederlagen-
und Notausgangsknoten der Wegsperren (`testteam_wald_niederlage`, `testteam_wald_genug`), die der
Leser der Lesefassung nie sieht, weil er jede Partie gewinnt.

## Vergleich (ohne verschobene Zeilen)

Verglichen wurde Zeile für Zeile ohne Dialognummern; Zeilen, die nur an anderer Stelle stehen
(wechselnde Alltagssätze, andere Reihenfolge beim Wiederkommen), zählen nicht. Übrig bleiben 222
neue und 108 weggefallene Zeilen. Fast alle gehören zu gewollten Umbauten:

- **Testteam (S15 bis S17, neu):** Zedernwald (Benji, Vorteil 10 Züge), Glasbrücke (Imani, fremde
  Eröffnung), Viehgitter (Zoe, Endspiel, S17 nur mit Sieg), Capital Arena (Wiedersehen). Die Kette
  ist geschlossen: Datenpunkte, „Variante 31“ ohne Imanis Namen, Westen weg, Protokolle bei Dr. Lin.
- **Ironwood-Auftakt (Spieltest 2):** Juno bringt die Nachricht in Riverton, Mama sagt zu Hause am
  Küchentisch Nein (statt am Telefon in Ironwood), Fahrt mit Rad und Zug am Kanal entlang.
- **Dialogprüfung:** Erzählte Rede in Anführungszeichen ist jetzt Sprecherrede (Marian Shaw,
  Imogen Rourke, Kapitän Castellano, Henrik Dahl); Formate der kurzen Partien in den Ankündigungen
  (Dime, Mr. Ruiz, Sol, Mags); Reihenfolge in Port Delacroix (erst Miss Odile, dann Remy und Lou).
- **Kleinere Textänderungen:** Buchsbaum statt hellem Holz bei den Finch-Figuren, Slick unter der
  Steinbrücke, Kettering als Anwohner von Cedar Creek, Ironwood-Kantine wird ausgeräumt.

Verloren gegangen ist keine Szene: Alle weggefallenen Zeilen stehen umformuliert noch da (geprüft
für Mags, Sol, Ezra, Abe Lindgren, Drachenfest, Autofahrt mit Mama, Mo und Dime).

## Funde und was geändert wurde

1. **Zeitfolge: Dr. Lins Kündigung zu früh.** Am Viehgitter (Weg Desert Springs → Summit City)
   sagte Imani: „In Silicon Bay hat eine gekündigt, Dr. Lin.“ Erst viel später, an der Raststätte
   in Crossroads, bringt Nova die Kündigung als Neuigkeit („Dr. Lin hat angerufen … Sie hat
   gekündigt.“). Der Weg zum Gitter liegt immer davor. Jetzt: „In Silicon Bay gibt es eine, die
   zuhört. Dr. Lin. Der bringen wir unsere Protokolle.“ Das bereitet Novas „Sie hat die Berichte
   gefunden“ vor (`weg-desert-summit.ink`, `testteam_gitter_offen`).
2. **Doppelt: Nachfragen zu Varianten wiederholten den ganzen Auftakt.** „Erklär mir das
   Königsrennen noch einmal“ (Earl), „… das Atomschach …“ (Bell) und „… das Entenschach …“ (Ray)
   führten zurück in den ersten Auftritt: Ambrose sagte wieder „Ich habe das Gefühl, du wirst es
   brauchen“, die Fahrer rannten wieder los, Bell zeichnete wieder ins Sinter. In der Lesefassung
   stand das drei Mal. Jetzt ist die Regel ein Tunnel: Beim Nachfragen kommen nur die Regelsätze,
   Ambrose und die Vorführung nur beim ersten Mal (`weg-desert-summit.ink`,
   `weg-summit-crossroads.ink`; Kira in `hochebene.ink` machte es schon so).

Nicht geändert (schon am 17.11. so, kein neuer Bruch):

- Kim fährt bei der ersten Ankunft in Cedar Creek mit dem Bus zurück („Nach Maple Falls fahren“ ist
  die erste Antwort), der nächste Dialog spielt aber wieder in Cedar Creek. Das ist die Wahl des
  Lesers in der Lesefassung, nicht der Ablauf im Spiel.
- Earl spricht beim K-Fund und beim Funkturnier, bevor er sich vorstellt: Die Reihenfolge der Dinge
  am Diner ist frei; sein Auftakt hängt an mehreren Wegen (Gutachten M2.4).

Romanbefunde: keine.

## Wirtschaft mit dem Testteam

Die Nebenquest „Das Testteam“ bringt je Schritt 10 Münzen, zusammen 40. Auswertung
`node pipeline/abenteuer/gesamtsimulation.cjs --wirtschaft --startwerte 1,2,3,4`:

| Ziel (docs/spiel/11, Abschnitt 7 und 10)                 | Ergebnis                                                 |
| -------------------------------------------------------- | -------------------------------------------------------- |
| Sparsamer Spieler mindestens Silber (95 % der Läufe)     | ja (Port Delacroix Gold)                                 |
| Vor jedem Clubkampf eine leichte Karte im Besitz/kaufbar | ja                                                       |
| Rest des sparsamen Spielers am Ende höchstens 400        | ja: 315 bis 390 (vorher 320 bis 350, Startwerte 1 und 2) |
| Dauerhafte Karten, die er nie kaufen konnte              | 0                                                        |
| Starke Karten erst ab Akt 3                              | ja                                                       |
| Waren in Akt 4, die der Verschwender nicht kaufen konnte | 5 (Ziel mehr als 0)                                      |
| Münzen des Verschwenders bei Beginn von Akt 2            | 5 bis 15                                                 |

Alle Ziele bleiben erfüllt, deshalb keine Anpassung an Preisen oder Belohnungen. Der Rand ist
knapp: Mit dem obersten Startwert bleiben 10 Münzen bis zur Grenze. Kommt noch eine belohnte
Nebenquest dazu, wäre die kleinste Anpassung, die Testteam-Schritte auf 5 Münzen zu setzen
(−20), statt Ladenpreise zu ändern.

## Chaos-Simulation

`node pipeline/abenteuer/gesamtsimulation.cjs --chaos --startwerte 1-60 --sekunden 2400`

**Fund (schon vor dem 18.11. so, nicht durch das Testteam): „Sternennacht am Steg“ blieb offen.**
Die Nebenquest begann bei Maes Einladung (`cedar-creek-bibliothek.mae_einladung`) und endete erst
mit der Sternennacht. Wer am Steg „Ich bin zu müde. Ein andermal.“ wählt oder bei Mrs. Okafor
„Ich geh schlafen.“, verbringt die Nacht im Lesesaal; danach kommt das Angebot nie wieder, und die
Quest stand für immer offen im Tagebuch. Die gründliche Simulation sieht das nicht, weil sie nie
ablehnt; der Chaos-Spieler fand es in drei von zwanzig Läufen (Startwerte 10, 13, 20).

Geändert (Empfehlung, gleich umgesetzt, Widerspruch genügt): Die Quest beginnt jetzt mit dem
Dazusetzen (`cedar-creek-aussen.sterne`) und endet am Schluss der Nacht (neuer Knoten
`sterne_ende`, Text unverändert). Wer ablehnt, hat keine Quest; wer bleibt, findet sie danach als
erledigt im Tagebuch. Mrs. Okafors Müdigkeit kommt wie bisher aus dem Ink (`setzeZustand`) und der
Quest. Schritttext jetzt: „Mit Mae, Dex und Juno am Steg Sternschnuppen zählen.“ Die Erinnerung an
die Einladung tragen weiter Mrs. Okafor („Heute Abend schauen die Kinder am Steg nach den
Sternen“) und das Teleskop am Steg.

Ergebnis nach dem Umbau: Startwert 10 (Cedar Creek, 300 Chaos-Schritte) läuft durch; im neuen Lauf
über die Startwerte 1 bis 60 42 Läufe im Zeitbudget von 2400 s, keine Sackgasse. Gesamtsimulation mit den Startwerten
1 bis 3: Abspann jeweils erreicht; `ambrose-danach`: 0 Funde.
