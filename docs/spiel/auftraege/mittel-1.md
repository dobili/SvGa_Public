# Auftrag mittel-1: Kartentexte und Ambroses Erklärungen

**Stand:** fertig (Helfer mittel-1, 08.11.2026, elfter Auftrag)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel, bestehende nur bei den
Karten aus `docs/spiel/11_Karten_und_Gegenstaende.md` verbessern), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** `python -m pytest pipeline/tests/test_abenteuer.py`, im Ordner `app/`
`npm run pruefen` (die Texte sind dort typgeprüft)

## Ziel

Seit heute gibt es 16 neue Karten (`inhalte/abenteuer/karten.json`, Wirkungen in
`docs/spiel/11_Karten_und_Gegenstaende.md` und `ENTSCHEIDUNGEN.md`, Abschnitt „Weitere Karten“).
Die Karten brauchen Texte, die Kindern und Einsteigern erklären, welche Frage des Buches sie lehren.

## Vorgaben

1. Je Karte in `karten.json` (alle 27) ein Schlüssel `karte.<kennung>.erklaerung`: zwei bis drei
   kurze Sätze von Ambrose, was die Karte zeigt und welche Frage man sich ohne Karte selbst stellen
   sollte, mit Buchbezug („Kapitel 1, Zählen von Angreifern und Verteidigern“). Keine Buchzitate über
   eine kurze Wendung hinaus (das Repository ist öffentlich).
2. Die vorhandenen Sätze `karte.<kennung>.spruch` der 16 neuen Karten prüfen und verbessern (ein Satz,
   Ambroses Ton: ruhig, etwas altmodisch, nie belehrend).
3. Die Sprüche `spruch.schmeichelei.1`–`.8` und `spruch.ablenkung.1`–`.8` prüfen und verbessern (frech,
   nie beleidigend, geschlechtsneutral, eine Zeile, Regeln wie im zehnten Auftrag).
4. Für jede Lernkarte (Feld `kapitel`) einen eigenen Satz `karte.<kennung>.geschenkt`, den Ambrose
   sagt, wenn der Leser die Karte durch das Buch bekommt (Beispiel für Abzählen: „Du hast im Buch
   gezählt. Jetzt zählst du im Park.“).

## Bericht

**Fertig** (`inhalte/abenteuer/texte/de.json`, 38 neue Schlüssel, 32 Werte verbessert):

1. **`karte.<kennung>.erklaerung` für alle 27 Karten.** Aufbau je Karte: was ich (Ambrose) zeige,
   welche Frage man sich ohne Karte selbst stellt, Buchbezug nur mit Kapitel und Abschnitt (etwa
   „Kapitel 1, Zählen von Angreifern und Verteidigern (Abschnitt 1.4)“, „Kapitel 6, Abschnitt 6.3,
   die erste der drei Planfragen“). Keine Buchzitate; Abschnittstitel nur als Fundstelle.
   Zuordnung: Denkroutine 12.1 (Fingerzeig, Flüstern, Was droht?), Partieanalyse 12.2 (Zweite
   Chance, Mentor-Zug, Sanduhr, Waage, Remisangebot), Zeitmanagement 12.5 (die drei Sprüche,
   Auszeit), Kopf und Konzentration 12.6 (Schmeichelei, Ablenkung, Kühler Kopf), Faktoren 3.2
   (Bauernvorgabe, Faktorenwaage), Vorteil verwerten 6.8 (Springervorgabe), dazu die Werkzeuge
   der Kapitel 1, 2, 4 bis 9 und 11 für die Lernkarten.
2. **`karte.<kennung>.spruch` der 16 neuen Karten** neu als ein Satz in Ambroses Ton, ohne
   Technik und ohne „Die Karte …“ (das steht jetzt in der Erklärung). Beispiele: Abzählen „Erst
   zählen, dann schlagen. Das gilt seit jeher.“, Planfinder „Wer nicht weiß, wo er spielt, spielt
   überall ein wenig und nirgends gut.“, Was droht? „Wer diese Frage vergisst, erfährt die Antwort
   zu spät.“
3. **Sprüche Schmeichelei und Ablenkung** geprüft: „der Beste“ und „ein echter Meister“ waren
   nicht geschlechtsneutral (jetzt „die Nummer eins im ganzen Park“, „so spielt man sonst nur im
   Fernsehen“); „Dein Schnürsenkel ist offen“ ersetzt durch „Da drüben steht einer mit Pizza“,
   weil Sprüche nicht über den Menschen gehen sollen (Regel aus dem zehnten Auftrag). Die übrigen
   blieben fast unverändert.
4. **`karte.<kennung>.geschenkt` für die elf Lernkarten** (Feld `kapitel`: Gefahrenradar,
   Abzählen, Zielkompass, Faktorenwaage, Bauernkompass, Planfinder, Taktikspürnase,
   Endspielkompass, Turmregel, Phasenblick, Was droht?), je ein Satz, der das Buch lobt, ohne
   zu belehren (Abzählen wie vorgeschlagen: „Du hast im Buch gezählt. Jetzt zählst du im Park.“).

**Hinweis:** `roentgenblick` hat in `karten.json` kein Feld `kapitel`, obwohl die Karte zu
Kapitel 1 gehört (Werkzeug `k1-roentgen`). Wenn sie eine Lernkarte sein soll, braucht sie
`kapitel: 1` und dann einen Satz `karte.roentgenblick.geschenkt` (Vorschlag: „Im Buch hast du
durch die Figuren hindurchgesehen. Jetzt siehst du es auch im Park.“).

Prüfungen: pytest `test_abenteuer.py` (11), Prettier, `npm run pruefen` (2402 Tests).

**Offene Fragen:** keine.
