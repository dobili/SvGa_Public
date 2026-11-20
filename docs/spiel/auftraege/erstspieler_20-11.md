# Erstspieler-Durchgang, erste 30 bis 45 Minuten (20.11.2026)

Auftrag des Haupt-Chats: Einleitung, Dachboden, Ambroses erstes Auftreten, erste Lektion, erster
Abend, nächster Morgen, erster Gang durch Maple Falls mit den Augen eines neuen Spielers prüfen.
Grundlage: Lesefassung (Startwert 1) und ein Spieler-Durchlauf im Chromium (Hochformat, etwa vier
Minuten Spielzeit bis Akt 1 im Wohnzimmer und Zimmer) mit Bildschirmfotos.

## Fragen je Stelle

| Stelle | Weiß ich, was als Nächstes kommt? | Zu früh, zu spät, doppelt? | Zu lang vor der ersten Eingabe? |
| --- | --- | --- | --- |
| Einleitung vor dem Haus | ja, Mama und Kartons | – | knapp, gut |
| Wohnzimmer, Ankunft | ja, Karton tragen | Sofa und Rauschen doppelt zur Einleitung (behoben) | sechs Zeilen bis zur ersten Wahl, jetzt vier |
| Zimmer, Dachboden | ja, Zielhinweis führt | – | gut |
| Ambrose, erstes Auftreten | ja | – | lang, aber das ist die Szene |
| Erste Lektion | ja | – | gut |
| Erster Abend, Pizza | ja | – | gut |
| Nacht auf dem Dachboden | Ende offen | der Morgen fehlte, draußen hieß es plötzlich „Guten Morgen“ (behoben) | – |
| Morgen, Weg zur Schule | jetzt: Mama nennt Schule, Coach und Schachteam, die Quest das Ziel | Raum 12 sagt erst Juno, nicht doppelt | – |

## Im Text behoben

1. `maple-falls-dachboden.ink`, Ende der ersten Nacht: Zwei Zeilen erzählen jetzt den Morgen
   („Am Morgen steht Mama schon in der Tür …“, `#licht:tag`) und nennen das nächste Ziel („Die
   Schule ist die Straße runter. Frag nach Coach Delgado und dem Schachteam, ja?“). Vorher endete die Nacht ohne
   Übergang, und es lief keine Quest, die das Ziel nannte.
2. `maple-falls-wohnzimmer.ink`, Ankunft: Zwei Erzählzeilen zu einer zusammengezogen, die Zeile über
   das ferne Rauschen gestrichen (Mama sagt gleich danach „Hörst du das? Der Wasserfall.“). Weniger
   Text vor der ersten Wahl.

## Für Code und Oberfläche (umgesetzt am 20.11.2026, Auftrag des Haupt-Chats)

1. **Hinweise zur Steuerung** (`app/src/abenteuer/oberwelt/steuerhinweise.ts`, `Steuerhinweis.tsx`,
   `steuerhinweis.css`, Texte `hinweis.*` in `texte/de.json`): je eine Zeile, einmal, oben in der
   Mitte unter dem Ortsschild. Steuerkreuz sobald die Welt zum ersten Mal frei ist, Aktionsknopf
   bei seinem ersten Erscheinen, Tagebuch mit dem Pfeil nach der ersten Meldung „Neu im Tagebuch“,
   danach einmal das Menü. Tippen schließt die Zeile, ebenso der erste Gebrauch des Elements oder
   neun Sekunden. Gemerkt in den Dialogvariablen `hinweisSteuerkreuz`, `hinweisAktion`,
   `hinweisTagebuch`, `hinweisMenue`. In Erinnerungen keine Hinweise zu Tagebuch und Menü.
2. **Tagebuchknopf pulsiert** dreimal golden, solange der Tagebuch-Hinweis steht; bei
   `prefers-reduced-motion` ein fester goldener Rand.
3. **Keine Lücke ohne Ziel:** Die Quest „Ein Abend im neuen Haus“ hat zwei neue Schritte: „Schlafen
   gehen“ (Ziel: Brett auf dem Schreibtisch im Zimmer, erledigt mit `erste_nacht`) und „Am Morgen
   zur Schule“ (Ziel: Coach Delgado im Clubraum, erledigt mit `coach_erstes_treffen`). Damit
   `naechsterschritt` beide Übergänge findet, nennt das Ende des ersten Abends das Zimmer und Mama am
   Morgen Coach Delgado.
4. **Pizzakarton:** kein Spielfehler. Die Ansprechprobe (jetzt auch für Gegenstände mit Dialog und
   mit Schließen von Dialogen, die beim Betreten aufgehen) erreicht ihn ab einem Stand nach dem
   ersten Abend mit Aktionsknopf und Dialog. Der Fund kam vom Planer des Durchlaufs, der die Kachel
   16,7 (Stuhl rechts vom Tisch) für frei hält, dort stehen bleibt und den zweiten Versuch als
   „ohneAktion“ meldet. Keine Szene geändert.
5. **Planer:** offen. Ursache wie in Punkt 4 (Kachel 16,7 im Planer frei, im Spiel gesperrt); nicht
   schnell zu beheben, ohne die Sperrrechnung des Planers an die des Spiels anzugleichen.

## Prüfungen

Gate wie üblich (Übersetzung, Sprache, Besuchszähler, nächster Schritt, Erzählzeit, ruff, pytest,
`npm run pruefen`, Rückmeldung, Gesamtsimulation Startwert 1 bis 3, Ambrose danach).
