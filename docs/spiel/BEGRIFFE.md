# Begriffe des Spiels

Wörter, die im Code, in den Daten und in den Unterlagen des Schach-Abenteuers immer dasselbe
bedeuten. Kennungen stehen in Klammern.

## Welt

- **Ort** (`mapleFalls`): eine Stadt oder ein Schauplatz mit Club, Karten und Figuren
  (`inhalte/abenteuer/orte.json`).
- **Karte** (`mapleFalls.dachboden`): ein begehbarer Ausschnitt eines Ortes, eine Tiled-Karte in
  `inhalte/abenteuer/karten/`. Nicht zu verwechseln mit der Hilfskarte.
- **Szene** (Karte): die Beschreibung einer Karte in `inhalte/abenteuer/szenen/<datei>.json`
  (Raum, Wände, Möbel, Auslöser, Figuren). Sie ist die einzige Quelle; die Tiled-Karte baut der
  Kartenbauer daraus.
- **Szene** (Handlung, `akt1.ambroseErwacht`): ein Schritt der Geschichte aus der Story-Bibel,
  im Spielstand als `handlung.szene`. Welche Bedeutung gemeint ist, sagt der Zusammenhang.
- **Auslöser**: ein Bereich der Karte (Objektebene „ausloeser“), der beim Betreten oder mit dem
  Aktionsknopf etwas tut: Dialog, Übergang, Ansehen, Laden.
- **Übergang**: ein Auslöser, der auf eine andere Karte führt (Tür, Treppe, Weg). Er hat ein Ziel
  (Karte und Auslöser) und eine Art; `wenn` kann ihn an eine Bedingung binden. Das Übergangsbild
  zeigt Tür, Treppe oder Durchgang auf beiden Seiten.
- **Ankunft**: das erste freie Feld vor dem Ziel-Übergang, mit Blick vom Durchgang weg.
- **Zustand einer Karte** (`zustaende` in `orte.json`): eine andere Fassung derselben Karte, die
  gilt, sobald eine Bedingung erfüllt ist (Musikhaus erst Ruine, dann Clubraum; Winter).
- **Fassung**: die Ausprägung, die gerade gilt, bei Karten (Zustand), bei Porträts
  (`#stimmung:jung` zeigt die Fassung „jung“) und bei Möbeln (Varianten im Katalog).
- **Möbel**: Gegenstand aus dem Katalog (`inhalte/abenteuer/moebel/`), auf der Karte als Objekt
  mit Form, Zuschnitt und Kollision.
- **Figur**: eine Person der Handlung mit Porträt, Dialogknoten und oft einem Gegnerprofil
  (`mapleFalls.coachDelgado`). **Geist**: eine Figur mit `geist: true` (Ambrose), durchsichtig
  und schwebend.
- **Statist**: eine Nebenfigur ohne Handlung, die nur einen Satz sagt (Sprechblase), oft mit einer
  Antwort Ambroses; manche zeigen eine **Vorführung** (ein brillanter Zug auf kleinem Brett).
- **Tier**: Belebung der Karte ohne Text; Scharen bewegen sich im Sichtbereich.
- **Tönung**: Licht über der Karte (Nebel, Abend, Nacht, Sepia, Dunkel mit Laterne).

## Handlung und Fortschritt

- **Akt**: einer der vier Teile der Geschichte, dazu das Post-Game als Akt 5.
- **Quest** (`mapleFalls.dasBrett`): Haupt- oder Nebenaufgabe als Folge von Schritten; jeder
  Schritt wartet auf ein Ereignis (Dialog, Partie, Aufgaben, Ort) und hat Wirkungen.
- **Begegnung** (`mapleFalls.ersteLektion`): eine angesetzte Partie gegen einen Gegner, mit
  Bedenkzeit, Lektion und Partiemomenten (`begegnungen.json`).
- **Aufgabenrunde**: Buchübungen und Motivaufgaben im Rundenrahmen, bestanden ab 70 Prozent.
- **Dialogvariable**: eine Ink-Variable, die über Dialoge hinweg gilt; die Hülle setzt einige aus
  Ergebnissen (`ersteLektionBesprochen`, `tiefpunktGesehen`).
- **Bedingung** (`wenn`): ein Ausdruck über Dialogvariablen und Besitz, der Übergänge, Zustände
  und Figuren freischaltet.
- **Kipppunkt**: die letzte Stellung einer verlorenen Partie, die noch nicht gekippt war; dort
  setzt der Wiedereinstieg an.

## Sammeln und Belohnung

- **Nadel** (Clubnadel): Bronze, Silber oder Gold für den Clubkampf gegen einen Clubchef, je nach
  Ausgang und Stufe der gespielten Hilfskarten (Regelwerk R17 bis R21). Es zählt die beste Nadel je Club; acht Nadeln öffnen die
  Landesmeisterschaft, die Punkte entscheiden die Liga.
- **Hilfskarte** (Karte im Deck): ein Joker für die Partie, dauerhaft oder zum Verbrauch, mit
  Stufe und Zeitpunkt (vorher, während, nachher). Das **Deck** sind die Karten, die der Held in eine
  Partie mitnimmt. **Spruch** und **Zeitkarte** sind besondere Hilfskarten.
- **Fund**: ein Gegenstand, den der Held in der Welt entdeckt (`funde.json`); Funde stehen auf der
  Fensterbank im Zimmer des Helden.
- **Finch-Jagd**: die Sammelkarte mit 16 weißen Buchsbaumfiguren, unter jeder ein eingebranntes
  Feld.
- **Münzen**: reine Spielwährung für die Läden, ohne Echtgeld.
- **Steckbrief**: Zeilen über einen Gegner, die das Spiel nach und nach freischaltet.
- **Abenteuerwertung**: eigene Wertung des Spiels, die mit der App-Wertung mitgeht und die Stärke
  der Gegner bestimmt.

## Technik

- **Zusatzpaket**: alles, was die App erst auf Wunsch lädt (Programm, Daten, Karten, Dialoge,
  Grafik), mit Verzeichnis und Prüfsummen; Ton je Akt als eigenes Nachladepaket.
- **Spielhülle**: der Rahmen für Partie und Aufgabenrunde im Aussehen des Spiels.
- **Tischgespräch**: Sprechblasen am Brett, oben der Gegner, unten Ambrose oder der Held.
- **Brettstil**: Brett und Figuren im Pixelstil je Ort und Lage.
- **Tag** (Ink): Marke am Zeilenende (`#sprecher:ambrose`, `#musik:kennung`, `#licht:abend`), die
  Anzeige, Ton und Bühne steuert.
- **Gesamtsimulation**: ein Spieler im Programm, der das ganze Spiel durchläuft und Sackgassen
  meldet; die **Lesefassung** schreibt dabei die Geschichte als Lesetext mit.
