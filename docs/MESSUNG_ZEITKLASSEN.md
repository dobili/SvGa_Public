# Messung je Zeitklasse in zehn Chats (24.10.2026, Stand 0.2.128)

Blitz (3+2) und Klassisch (30+20) werden je Gruppe in einem eigenen Chat gemessen; der
Koordinierungschat wertet alle Ordner zusammen aus. Jeder Chat braucht etwa 45 Minuten je
Zeitklasse und trifft keine Entscheidungen.

Seit 0.2.128 spielen alle Messpartien mit dem Praxisbuch (Bots und Ankerstufen eröffnen wie
Menschen ihrer Stärke, wie in der App). Die Gruppen kommen aus `skripte/gruppen-bots.mjs`, das
seit 0.2.128 alle gemessenen Zahlen richtig liest (vorher landeten viele Bots in falschen
Gruppen). Grundlage ist der Stand von `main` ab 0.2.128; der Zweig `menschliche-bots` ist dann
gleich `main`.

## Prompt für einen Gruppen-Chat (Opus, Gruppe eintragen)

```
Repository dobili/SvGa_Public, Zweig menschliche-bots. Bitte nur ausführen, nichts anderes ändern:

cd app && npm ci && skripte/messe-zeitklasse.sh blitz 3 && git checkout menschliche-bots && skripte/messe-zeitklasse.sh klassisch 3

Das Skript lädt die native Engine, spielt die Anker der Nm-Stufe 3 (40 Partien mit Uhr), bewertet
sie in Tiefe 18 (vier Läufe), lässt die Bots der Gruppe 3 gegen die zwei nächsten Nm-Stufen spielen
und committet die Rohdaten nach messdaten/<zeitklasse>/gruppe-3/ auf die Zweige
messung-blitz-3 und messung-klassisch-3. Es endet mit „FERTIG: …“. Bricht es ab, den Fehler
melden und nichts von Hand nachbauen. Melde am Ende nur: fertig, oder den Fehler.
```

Gruppen 1 bis 10; Gruppe 10 misst zusätzlich die reinen Spitzenstufen (im Skript enthalten).

## Auswertung im Koordinierungschat

1. Alle Zweige zusammenlegen (seit 0.2.130 ein Skript, im Ordner app/):
   `skripte/sammle-zeitklasse.sh blitz ../buch/arbeit/zeitklassen/blitz` (holt die Zweige, legt
   `anker-sN`, `neu-gruppeN` und die Bewertungen als `bewertet-N-k.jsonl` zusammen; fehlt ein
   `fertig.txt`, bricht es ab). Ein drittes Argument wählt Gruppen („1 2 3“).
2. `BOTELO_ORDNER=<ordner> BOTELO_TEMPO=blitz BOTELO_AUSGABE=botstaerke-daten-blitz.ts npx vitest run
   --config vitest.messung.config.ts src/engine/botstaerke.messung.ts` (im Ordner app/); für
   Klassisch `BOTELO_TEMPO=classical`.
3. Datei nach `app/src/engine/` kopieren und mit Prettier formatieren; `engine/botstaerke-zeitklassen.ts`
   bindet sie ein, `engine/botstaerke.ts` wählt die Zahl nach der Zeitklasse. Für Blitz und
   Klassisch schreibt der Messlauf nur die gemessenen Zahlen, Bots unter ihrer Kennung, ab 400.

Erfahrungen der ersten Messung (25.10.2026): Ein Lauf braucht 20 bis 35 Minuten je Zeitklasse.
Eine Ankerpartie mit mehreren Damen gegen den König brachte die Tiefe-18-Bewertung nicht zum
Ende; dann den hängenden Lauf beenden und die übrigen Partien ohne diese bewerten
(`skripte/eichung-rechnen.mjs --ordner <kopie> --quellen stufen`, `stufen.jsonl` ohne die Partie).

## Seit 0.2.131: Umrechnung statt eigener Messung

Die App misst Blitz und Klassisch nicht mehr eigens, sondern rechnet die Schnellschach-Zahl um wie
bei einem Menschen dieser Stärke (`engine/zeitklassenabstand.ts`, Herleitung in
`docs/ENTSCHEIDUNGEN.md`, „Bots als ein Mensch mit drei Wertungen“). Die Gruppen-Chats oben dienen
nur noch einer Prüfung: Der Messlauf schreibt dann eine Prüfdatei, die sich mit der Umrechnung
vergleichen lässt. Neu erzeugen lässt sich die Tabelle lokal mit
`buch/arbeit/wertungsvergleich/` (`sammle.py`, `profile2.py`, `profile3.py`, `tabelle.py`).

