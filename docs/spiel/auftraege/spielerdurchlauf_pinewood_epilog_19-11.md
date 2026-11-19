# Spieler-Durchlauf Pinewood Camp und Epilog (19.11.2026)

Auftrag: Pinewood Camp und den Epilog nach dem Abspann im Browser nur mit Spielereingaben spielen.
Fables Durchlauf vom 18.11.2026 (`spielerdurchlauf_18-11.md`) hatte beide ausgelassen, weil beide
Läufe mit Darlenes Schlüssel die Alte Minenstraße nahmen. Jeden Fund beheben, mit Test, die
Spielzeit messen und nachtragen.

## 1. Stände und Aufruf

Die Stände kommen aus der Gesamtsimulation. `aktstand.cjs` kann dafür jetzt auch an einer Variable
anhalten statt an einem Aktbeginn:

```bash
node pipeline/abenteuer/aktstand.cjs --bis novaBitteGehoert --ziel vor_pinewood.json   # Crossroads, Akt 4
node pipeline/abenteuer/aktstand.cjs --bis finaleBesprochen --ziel vor_abschied.json   # vor dem Abschied
```

Neue Schalter des Spieler-Durchlaufs (`app/tests/durchlauf/`):

| Variable              | Wirkung                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `DURCHLAUF_OHNE`      | Kommagetrennte Dinge `ort.karte.name`, die der Planer nie ansteuert (etwa den Fernbus)   |
| `DURCHLAUF_BIS_ORT`   | Lauf endet, sobald der Ort besucht ist (nach dem Ende des laufenden Dialogs)             |
| `DURCHLAUF_BIS_QUEST` | Lauf endet, sobald die Quest erledigt ist; der Lauf spielt dafür über den Abspann hinaus |

Pinewood: Stand `vor_pinewood.json`,
`DURCHLAUF_OHNE=crossroads.aussen.viehgatter,crossroads.aussen.fernbus` (sonst nimmt der Planer die
Abkürzung über die Minenstraße oder den Bus nach Cedar Creek), `DURCHLAUF_BIS_ORT=ghostTown`.
Epilog: Stand `vor_abschied.json`, `DURCHLAUF_BIS_QUEST=mapleFalls.epilog`. Beide im Hochformat.

## 2. Gespielt

**Pinewood Camp**, von Crossroads bis Ghost Town, etwa 23 Minuten Laufzeit: Hütten, Riesenbäume
(Stille und Ankunft im Camp am Übergang), Lagerfeuer und Steg, Kiosk, die Leute im Camp; Rangerin
Hollis dreimal geschlagen (Zweite Chance erhalten); Canyonrand mit Tafel 3 von 3, Finch und
Juniper; Staubstraße mit Tankstelle, Spur und Seite 11; Greifarm Z-1 mit Matt geschlagen; Ghost
Town erreicht. Der Planer blieb dreimal vor stehenden Figuren hängen (Hütten 46,14; Camp 42,31;
Staubstraße 23 bis 26,13) und fand jedes Mal einen anderen Weg; für einen Spieler ist dort genug
Platz.

**Epilog**, von vor dem Abschied bis zum Ende: Abschied, Abspann, Dachboden, Zimmer, Epilog mit
Lily, letzte Zeile „Was hängt?“.

## 3. Messung und Spielzeit

| Strecke  | Akt                          | Kacheln | Laufen (min) | Kartenwechsel | Dialogzeilen | Wörter | Partien | Halbzüge (eigene) | Runden (Aufgaben) |
| -------- | ---------------------------- | ------- | ------------ | ------------- | ------------ | ------ | ------- | ----------------- | ----------------- |
| Pinewood | 4, Crossroads bis Ghost Town | 1173    | 5,6          | 11            | 165          | 2798   | 4       | 88 (44)           | 1 (3)             |
| Epilog   | 4, Abschied und Abspann      | 85      | 0,4          | 3             | 35           | 549    | 0       | 0                 | 0                 |
| Epilog   | 5, Epilog                    | 0       | 0,0          | 0             | 26           | 408    | 0       | 0                 | 0                 |

| Strecke           | Spieler   | Lesen | Laufen | Partien | Aufgaben | Summe (min) |
| ----------------- | --------- | ----- | ------ | ------- | -------- | ----------- |
| Pinewood          | zügig     | 17,3  | 5,6    | 11,0    | 2,3      | 36,1        |
| Pinewood          | gründlich | 26,8  | 8,4    | 11,0    | 4,5      | 50,7        |
| Epilog, nur Akt 5 | zügig     | 2,5   | 0      | 0       | 0        | 2,5         |
| Epilog, nur Akt 5 | gründlich | 3,9   | 0      | 0       | 0        | 3,9         |

Abschied und Abspann stecken schon in Strecke A von Akt 4. Eingerechnet in
`spielerdurchlauf_18-11.md`: Akt 4 jetzt 234 Minuten zügig und 306 gründlich, Akt 5 3 und 4,
das ganze Spiel 771 und 1080 Minuten (knapp 13 und 18 Stunden).

## 4. Spielfunde (behoben)

1. **Nach Crossroads nennt niemand das Pinewood Camp.** Die Hauptquest des Camps beginnt erst an
   den Hütten, der Zielhinweis hat davor nichts zu zeigen, und Darlene nennt nur die Minenstraße.
   Wer den Schlüssel nicht nimmt, weiß nicht, wohin. Behoben: In `ankunft_crossroads`
   (crossroads-aussen.ink) sagt Juno nach Mamas Zeile, dass Mae und Dex im Pinewood Camp sind, den
   Fernwanderweg hoch. Test: `test_crossroads_nennt_das_camp`
   (pipeline/tests/test_abenteuer_naechsterschritt.py).
2. **Letzte Zeile des Epilogs zeigte den Rohschlüssel „figur.held.name“ als Sprecher.** Der Held
   hat keinen Namen in texte/de.json (er ist geschlechtsneutral und namenlos). Behoben: „Was
   hängt?“ steht als Erzählzeile in Anführungszeichen (maple-falls-dachboden.ink). Test:
   `pipeline/tests/test_abenteuer_sprecher.py` verlangt für jeden Sprecher außer dem Erzähler einen
   Namen `figur.X.name`.

## 5. Fehler des Durchlauf-Skripts (notiert, teils behoben)

- **Früher Halt beim Epilog:** Die Quest gilt beim Start des Dialogs als erledigt; der Lauf hielt
  nach der ersten Zeile an. Behoben: Die Haltebedingungen prüfen erst nach dem Ende des Dialogs.
- **„Noch eine.“ bei Hollis:** Der Lauf spielte über zwanzig Partien, weil die Signatur der Frage
  nach jeder Partie neu beginnt. Behoben (`WIEDERHOLUNG` in fenster.ts): Eine Antwort wie „Noch
  eine“, „Noch einmal“ oder „Revanche“ wird nach dem ersten Mal wie ein Aufschub behandelt.
- **Umsehen wählt den Fernbus:** Beim Umsehen in Crossroads steuerte der Planer den Fernbus an.
  Umgangen mit `DURCHLAUF_OHNE`.
- **Gesperrte Antwort während einer Pause:** „Den Zettel einstecken“ steht etwa elfmal im
  Protokoll, weil der Knopf während `#pause:3` gesperrt ist und das Skript es erneut versucht.
  Kein Spielfehler.

## 6. Beobachtungen

- Zu Beginn eines Laufs ab simuliertem Stand erscheint „Deine ersten Münzen!“. Das liegt am Stand
  (die Meldung ist nicht als gesehen vermerkt), nicht am Spiel.
- Stehende Figuren an den drei oben genannten Stellen kosten den Planer Umwege, einen Spieler nicht.

## 7. Prüfungen

inkuebersetzung 0 Fehler, sprache 0, inkbesuche 0, naechsterschritt (ok 74, fehlt 0), erzaehlzeit
(25 Kandidaten, 0 offen), ruff sauber, pytest grün, `npm run pruefen` 3079 Tests grün,
rueckmeldung.cjs 0 Funde, Gesamtsimulation mit Startwert 1 bis 3 bis zum Abspann ohne Meldungen.
