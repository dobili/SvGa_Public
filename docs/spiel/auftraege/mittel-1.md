# Auftrag mittel-1: Kartentexte und Ambroses Erklärungen

**Stand:** offen (Haupt-Chat, 08.11.2026, elfter Auftrag)

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

(vom Helfer auszufüllen)

## Letzter Auftrag (erledigt, zur Nachlese)

**Zweig:** dein fester Sitzungszweig, Basis `claude/friendly-shannon-y8bf90` (vorher hereinholen)
**Darf ändern:** `inhalte/abenteuer/texte/de.json` (nur neue Schlüssel), `docs/spiel/auftraege/mittel-1.md`
**Prüfung vor dem Push:** pytest `test_abenteuer.py`, Prettier

## Ziel

Die Zeitkarten werden Sprüche des Helden (Straßenschach-Kultur): „Großes Maul“ (provoziert, der
Gegner spielt zu schnell), „Grübelfalle“ (sät Zweifel, der Gegner grübelt und verliert Zeit),
„Kühler Kopf“ (der Held bleibt ruhig, mehr Zeit). Die Technik baut der Haupt-Chat mit Schritt 13;
du lieferst die Texte.

## Vorgaben

1. Je Karte **acht Sprüche** des Helden: `spruch.grossesMaul.1` … `.8`, `spruch.gruebelfalle.1` …
   `.8`, `spruch.kuehlerKopf.1` … `.8` (beim kühlen Kopf innere Sätze, keine Rede). Frech, nie
   beleidigend: nur über die Partie oder das eigene Können, nichts über Aussehen, Herkunft, Familie;
   geschlechtsneutral; kurz (eine Zeile).
2. Je Straßengegner aus Akt 1 und 2 (Jo, Nia, Rosa, Slick, Harlan und wer sonst `rolle: strasse`
   hat) **zwei Konter**: `spruch.konter.<gegner>.1`, `.2` (ihre Antwort auf einen Spruch) und ein
   Vorschlag im Bericht, wer immun ist („Spar dir das.“) und warum (passend zum Steckbrief).
3. Ambroses Satz beim ersten Spruch: `spruch.ambrose.ersterSpruch` („Am Brett eines Clubs schweigt
   man. Im Park redet man.“ oder besser).
4. Namen der Karten: `karte.grossesMaul.name`, `karte.gruebelfalle.name`, `karte.kuehlerKopf.name`
   und je ein `….spruch` (ein Satz Erklärung wie bei den anderen Karten).

## Bericht

**Fertig:** 45 neue Schlüssel am Ende von `texte/de.json`: drei Kartennamen mit Erklärung
(`karte.grossesMaul`, `karte.gruebelfalle`, `karte.kuehlerKopf`, je `.name` und `.spruch`), je
acht Sprüche (`spruch.grossesMaul.1–8`, `spruch.gruebelfalle.1–8`, `spruch.kuehlerKopf.1–8`, beim
kühlen Kopf innere Sätze), `spruch.ambrose.ersterSpruch` und je zwei Konter für sieben Gegner
(`spruch.konter.<name>.1–2` mit dem Namensteil der Gegnerkennung: `skaterJo`, `nia`, `rosa`,
`schaffner`, `harlan`, `gus`, `slick`). Prüfungen: pytest `test_abenteuer.py` (11), Prettier.

**Regeln, nach denen ich geschrieben habe:** Jeder Spruch ist ein Satz über die Partie oder das
eigene Können, nie über den Menschen (kein Aussehen, keine Herkunft, keine Familie; einen Satz mit
„Oma“ habe ich deshalb ersetzt); geschlechtsneutral (keine Anrede mit Geschlecht, „Spar dir
das, Kleines“ aus dem Entwurf in 10 habe ich bewusst nicht übernommen, weil es von oben herab
klingt); eine Zeile, höchstens zwei kurze Sätze. Die Grübelfalle fragt nur nach Stellungen
(„Hast du den Läufer gesehen?“), damit sie zugleich eine echte Denkfrage aus dem Buch ist
(Kapitel 1: Was hängt, wer greift an, wer verteidigt). Ambroses erster Satz ergänzt die Vorgabe um
die Grenze: „… aber sprich über die Partie, nie über den Menschen.“

**Konter und Vorschlag zur Immunität** (passend zum Steckbrief, zweiter Konter ist jeweils
der Satz, wenn die Karte nicht wirkt):

| Gegner     | Stil (Steckbrief)              | Vorschlag                                            | Warum                                                                                                                    |
| ---------- | ------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Jo         | Angreiferin, Taktikerin        | nicht immun                                          | Skaterin im Park, Sprüche gehören dazu; sie redet zurück                                                                 |
| Nia        | Angreiferin, Fleck Rückzug     | nicht immun                                          | hitzig und schnell; „Großes Maul“ passt genau zu ihr                                                                     |
| Rosa       | Verteidigerin                  | **immun**                                            | Anglerin, die warten kann („Der Fisch merkt, wenn du zappelst“)                                                          |
| Mr. Quinn  | Taktiker                       | nicht immun                                          | er hat nur zwölf Minuten Pause; Zeitdruck trifft ihn                                                                     |
| Mr. Harlan | Positionsspieler, langsam      | **immun gegen Großes Maul**, nicht gegen Grübelfalle | er hat keine Eile, aber grübelt gern: die Falle wirkt doppelt, ein schöner Lehrmoment für die Zeitklasse (Szene 31)      |
| Gus        | Vereinfacher                   | nicht immun                                          | Pause ist knapp, er redet gern; „hab alles schon gehört“ als Witz, Karte wirkt trotzdem                                  |
| Slick      | Angreifer, Taktiker (Clubchef) | nicht immun                                          | lebt von der Eile (Ambrose in Szene 36); Sprüche nur außerhalb des Clubkampfs (S2), etwa bei der Revanche auf der Treppe |

Damit sind zwei von sieben ganz oder teilweise immun; Vorbereitung lohnt sich (Steckbriefzeile
„lässt sich nicht aus der Ruhe bringen“ für Rosa und Harlan), ohne dass die Karten oft
verschwendet sind. Technisch braucht es dafür ein Feld je Gegner (etwa `immunGegen: ["grossesMaul"]`
im Gegnerprofil); das ist für mich gesperrt.

**Offene Fragen:** keine.
