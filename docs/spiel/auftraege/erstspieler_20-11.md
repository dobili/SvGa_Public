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
| Morgen, Weg zur Schule | jetzt: Mama nennt die Schule und das Schachteam | Raum 12 sagt erst Juno, nicht doppelt | – |

## Im Text behoben

1. `maple-falls-dachboden.ink`, Ende der ersten Nacht: Zwei Zeilen erzählen jetzt den Morgen
   („Am Morgen steht Mama schon in der Tür …“, `#licht:tag`) und nennen das nächste Ziel („Die
   Schule ist die Straße runter. Und frag nach dem Schachteam, ja?“). Vorher endete die Nacht ohne
   Übergang, und es lief keine Quest, die das Ziel nannte.
2. `maple-falls-wohnzimmer.ink`, Ankunft: Zwei Erzählzeilen zu einer zusammengezogen, die Zeile über
   das ferne Rauschen gestrichen (Mama sagt gleich danach „Hörst du das? Der Wasserfall.“). Weniger
   Text vor der ersten Wahl.

## Für Code und Oberfläche (Liste an den Haupt-Chat)

1. **Steuerung wird nirgends erklärt.** Steuerkreuz, Aktionsknopf, Tagebuch mit dem Pfeil-Symbol und
   Menü erscheinen ohne Hinweis. Vorschlag: beim ersten Betreten des Wohnzimmers kurze Einblendungen
   nacheinander, je eine beim ersten Gebrauch („Mit dem Steuerkreuz gehen“, „Vor einem Ding: Knopf A“).
2. **Erste Meldung „Neu im Tagebuch“** ist die natürliche Stelle, auf das Tagebuch und seinen Pfeil
   (Zielhinweis) zu zeigen: den Knopf einmal aufleuchten lassen.
3. **Lücken ohne laufende Quest:** zwischen erstem Abend und Nacht und zwischen Nacht und Coach ist
   der Zielhinweis leer. Der Text führt jetzt (Haustür, Mamas Morgenzeile), besser wäre ein kleiner
   Questschritt „Zur Schule“ bis zum Treffen mit dem Coach.
4. **Pizzakarton ohne Aktionsknopf:** Der Durchlauf meldet `ohneAktion` an
   `mapleFalls.wohnzimmer.tischPizzakarton` (Auslöser bei x 240, y 112 in den Karten `-tisch` und
   `-ausgepackt`). Er liegt offenbar auf der Tischkachel; der Held steht davor und bekommt keinen
   Knopf. Prüfen, ob der Auslöser an den Tischrand gehört oder der Durchlauf die Kartenstände nicht
   beachtet (die Grundkarte hat den Auslöser nicht, `orte.json` nennt ihn ohne Bedingung).
5. **Durchlauf-Skript:** Der Planer bleibt im Wohnzimmer mehrmals an stehenden Figuren hängen
   („aufgehalten vor 2,4 (steht), plane um“, ebenso 16,7 und 7,10) und kehrt zum Fenster als
   Ausgang zurück. Kein Spielfehler, kostet aber Messzeit.

## Prüfungen

Gate wie üblich (Übersetzung, Sprache, Besuchszähler, nächster Schritt, Erzählzeit, ruff, pytest,
`npm run pruefen`, Rückmeldung, Gesamtsimulation Startwert 1 bis 3, Ambrose danach).
