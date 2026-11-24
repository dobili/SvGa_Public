# Blickprobe: Ambrose als Begleiter im Spiel (24.11.2026)

Auftrag des Hauptchats (24.11.2026, abends): jeden der 126 Blickpunkte aus
`inhalte/abenteuer/ambrose_blickpunkte.json` im Spiel ablaufen; prüfen, ob er im Vorbeigehen
auslöst, der Geist neben dem Helden steht (`data-begleiter`), das Ding im Bild gut zu sehen ist und
er nicht doppelt kommt. Dazu ein Gespräch, in dem Ambrose dazwischenredet („nur du hörst ihn“,
`#gedanke`), hoch und quer. Befunde beheben (Feld oder Radius), sonst melden.

## Aufruf

```bash
node pipeline/abenteuer/blickstaende.cjs --ziel STAENDE        # ein Stand der Simulation je Blickpunkt
(cd app && npm run build)                                      # mit ABENTEUER_PRIVAT
(cd app && BLICK_STAENDE=STAENDE BLICK_FOTOS=FOTOS BLICK_TEIL=1/3 [BLICK_FORMAT=quer] \
  CHROMIUM_PFAD=… npx playwright test --config playwright.durchlauf.config.ts blickprobe)
(cd app && PROBE_STAND=STAENDE/blick_mapleFalls_aussen_veranda.json PROBE_KARTE=mapleFalls.aussen \
  PROBE_DING=calloway PROBE_VARIABLEN='{"nadelMapleFalls":1,"callowayGetroffen":true}' \
  GESPRAECH_FOTOS=FOTOS [PROBE_FORMAT=quer] CHROMIUM_PFAD=… \
  npx playwright test --config playwright.durchlauf.config.ts gespraechsprobe)
```

`blickstaende.cjs` nimmt den Stand in dem Augenblick, in dem die Simulation die Karte betritt und
der Punkt fällig ist (nach dem Eingangsdialog, vor dem Abspielen). Die Blickprobe startet je Punkt
einen frischen Browser, stellt den Helden einige Schritte außerhalb des Radius und lässt ihn mit dem
Steuerkreuz auf die Mitte der Stelle zugehen. Andere Punkte derselben Karte gelten als gesehen.

## Ergebnis

Alle 126 Blickpunkte lösen im Vorbeigehen aus, hoch und quer:

- Der Geist steht auf einem Nachbarfeld des Helden.
- Alle Antworten sind Gedanken.
- Nach dem Gespräch ist der Geist weg, und `<knoten>_gesehen` ist gesetzt.
- Der Punkt kommt nicht noch einmal, auch nicht nach der Pause von 30 Sekunden (33 s gewartet, im
  Radius).

Die Gesprächsprobe bei Mrs. Calloway (`calloway_b`, „Leute, die verlieren können“) zeigt Ambroses
Zeile hoch und quer kursiv mit „· nur du hörst ihn“. Der Geist steht dabei neben dem Helden
(Held 3,31, Geist 3,32). `#gedanke` gibt es nur in `ambrose-blick.ink`; im Spiel geprüft bei allen
126 Blickpunkten.

Zwei Stellen kennt die Simulation nicht mit wachem Ambrose:

- `bayou.steg` betritt sie nie.
- `capitalArena.ubahnhof` betritt sie erst nach dem Abschied.

Dort nahm die Probe den Stand eines anderen Punkts. Im Spiel lösen beide aus.

## Behoben (Feld oder Radius in ambrose_blickpunkte.json)

Das Hochformat zeigt etwa 9 Felder in der Breite. Das Dialogfenster deckt hoch das untere
Drittel bis die untere Hälfte, quer die rechte Hälfte.

| Blickpunkt                                        | Befund                                                                                   | Korrektur          |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------ |
| Felsbogen (wegDelacroixDesert.felsbogen)          | Der Bogen stand 8 Felder seitlich, nicht im Bild                                         | Feld 81,24 → 93,22 |
| Kuppeln (capitalArena.aussen)                     | Die Arena lag 9 Felder höher, im Bild nur der Brunnen                                    | Feld 39,43 → 39,37 |
| Hochhaus (capitalArena.aussen)                    | Vom Haus sah man nur den Fuß                                                             | Feld 20,33 → 24,25 |
| Zypressen (bayou.steg)                            | Die Zypressen standen auf einer anderen Insel; die Mitte lag in einer Tasche ohne Zugang | Feld 29,27 → 45,30 |
| Kartons (mapleFalls.wohnzimmer)                   | Mitte unter dem Dialog (Kiste unten in der Küche)                                        | Feld 12,10 → 13,5  |
| Lebendschach (wegCrossroadsPinewood.riesenbaeume) | Mitte unter dem Dialog; vom Weg aus nie im Radius                                        | Feld 13,87 → 17,90 |
| Spielautomat (crossroads.raststaette)             | Quer unter dem Dialog (3 Felder rechts vom Helden)                                       | Radius 3 → 2       |

Für das Radio im Waschsalon blieb es bei Radius 3: Mit Radius 2 erreicht der Held kein Feld. Bei
Radius 3 liegt es nach der Nachprobe nicht mehr unter dem Dialog. `pipeline.abenteuer.blickpunkte`:
0 Befunde.

Alle Korrekturen sind hoch und quer nachgeprobt: Sie lösen aus und liegen nicht unter dem Dialog.
Bogen, Arena-Treppe, Fassade, Zypresse und Kartons sind im Bild zu sehen.

## Gemeldet (nicht in der JSON lösbar)

1. **Lastwagen in Maple Falls** (`blick_mapleFalls_aussen_lastwagen`): Der LKW (`fz11LkwRechts`)
   steht nur mit `nicht ankunftGesehen` auf der Karte. Ambrose spricht erst nach der ersten Lektion,
   also lange danach. Die Stelle zeigt nie einen Lastwagen, aber Ambrose sagt „Zehn Räder habe ich
   gezählt“. Vorschlag: Knoten und Eintrag auf eine Karte mit Lastwagen legen (etwa
   `fz12LastwagenHinten` an der Bergstraße) oder den Text auf eine Erinnerung umschreiben.
2. **Sterne an der Sternwarte** (`blick_sternwarte_felsnase_sterne`): „So viele Sterne“. Der Punkt
   löst zu jeder Tageszeit aus (Probe um 8 Uhr). Bedingungen kennen die Uhr nicht
   (regeln/bedingung.ts). Vorschlag: `wann` mit Tageszeit ermöglichen oder einen Satz für den Tag.
3. **Aktionsknopf setzt die Ankunftsruhe zurück** (regeln/blickpunkte.ts, `blicktakt`): Die Ruhe
   beginnt neu, sobald ein Aktionsknopf erscheint, und braucht dann wieder 1,5 Sekunden ohne Knopf.
   In möblierten Räumen läuft der Held an vielen Dingen mit „Ansehen“ vorbei. Im Kinderzimmer
   (Fenster) kam der Punkt deshalb von Westen nie, von Osten sofort. Vorschlag: Der Aktionsknopf hält
   nur an (nicht frei), setzt die Ruhe aber nicht zurück; die Ruhe gilt nur nach Kartenwechsel und
   Fenster.
4. **Geist unter dem Helden verdeckt ihn** (regeln/begleiter.ts, `begleiterfelder`): Schaut der Held
   nach links oder rechts, ist „seitlich“ oben oder unten. Der Geist steht dann direkt unter dem
   Helden und verdeckt dessen Beine (Calloway, Foto hoch und quer). Vorschlag: bei Blick links oder
   rechts zuerst schräg hinten, dann oben, unten zuletzt.
5. **„nur du hörst ihn“ bricht quer um** (Dialog.tsx, `.abenteuer-dialog-fluestern`): In der
   schmalen Spalte steht „Ambrose · nur / du hörst ihn“. Vorschlag: `white-space: nowrap` am Zusatz,
   damit er als Ganzes in die nächste Zeile geht.
6. **Halfpipe im Park** (mapleFalls.park, `mf12HalfpipeHolz` auf 17,22): Der Held betritt die Kacheln
   der Halfpipe. Sie wird über ihn und den Geist gezeichnet, beim Skater-Blickpunkt sieht man nur die
   Köpfe. Kartenbefund (Kollision oder Ebene).
7. **Treidelpfad und Luftboot quer:** Das Ding liegt teils unter dem Dialog oder am Bildrand. Es
   bleibt erkennbar, deshalb nicht geändert.

Für den lokalen Bau: `app/inhalte-privat/quelle` zeigte hier auf einen alten Stand des Grafikpakets
(749 statt 1280 eigene Bilder). Möbel ohne Bild werden dann zu braunen Platzhaltern. Die erste
Fotorunde war dadurch wertlos. Der Verweis zeigt jetzt auf das aktuelle Paket. Die Möbelbögen nimmt
der Paketbau immer von dort, nicht aus `ABENTEUER_PRIVAT`.

Fotos und Ergebnisse liegen nur lokal (Paketbilder).
