<!--
  Begriffsliste der englischen Fassung (seit 0.2.103). Grundlage für en.json; die eigenen Begriffe
  des Buches sind vorläufig, bis der Autor sein englisches Buch schreibt (Rückfrage EN1). Absichtlich
  auf Englisch, weil sie Übersetzern als Vorgabe dient.
-->
# Terminology for the English version of the app "Schach von Grund auf"

Use these English terms consistently. Book-coined terms are provisional (the author will write the
English book later and may rename them centrally), so always use exactly the form given here.

## Style
- Address the reader as "you", friendly and plain, short sentences, like the German "du".
- British/American: use American spelling (color, center, favor), but chess terms as below.
- Keep every placeholder in curly braces exactly as in German (`{feld}`, `{zug}`, `{farbe}` ...),
  same names, same count. You may move them within the sentence.
- Keep Markdown, line breaks (`\n`), symbols, emojis, arrows, "!!", "?!", "(W1)" etc.
- Numbers written in the German text with a decimal comma ("0,2", "1,5") become "0.2", "1.5".
  "%" stays. Times "5 + 3" stay.
- Figure references: "Abb. 1.26" → "Fig. 1.26"; "Kapitel 3" → "Chapter 3"; "Übung 4" → "Exercise 4";
  "S. 12" → "p. 12".

## Notation (important)
German piece letters in moves become English letters: K→K, D→Q, T→R, L→B, S→N; pawns have no letter.
Examples: "Lf4" → "Bf4", "Dxd5" → "Qxd5", "Sf3" → "Nf3", "Txe8+" → "Rxe8+", "0-0" stays, "e4" stays,
"5... Db6" → "5... Qb6". Also in running text: "der Läufer auf f4" → "the bishop on f4".
In the German text "x" or ":" for captures → use "x". Square names (e4, h7) stay.
Do NOT change letters that are not moves (e.g. "W1" warning sign labels, "F1" check questions,
"B6" author question ids, "LAP").

## Pieces and colors
Bauer pawn · Springer knight · Läufer bishop · Turm rook · Dame queen · König king · Figur piece
(Leichtfigur minor piece, Schwerfigur major piece) · Weiß White · Schwarz Black (capitalized as
player names) · am Zug to move · Zug move · Halbzug half-move / ply

## General chess terms
Schach check · Matt checkmate / mate · Patt stalemate · Remis draw · Aufgeben resign ·
Rücknahme takeback · Rochade castling (kurze/lange: kingside/queenside) · Umwandlung promotion ·
en passant · Fesselung pin · Spieß skewer · Gabel fork · Abzug(sschach) discovered attack (check) ·
Doppelangriff double attack · Zwischenzug intermezzo (in-between move) · Grundreihe back rank ·
Beseitigung der Verteidigung removing the defender · Hinlenkung decoy · Ablenkung deflection ·
Opfer sacrifice · Freibauer passed pawn · Isolani isolated pawn (isolani) · Doppelbauer doubled pawn ·
rückständiger Bauer backward pawn · Bauernkette pawn chain · Bauernschild pawn shield ·
Minderheitsangriff minority attack · Vorposten outpost · schwaches Feld / Loch weak square / hole ·
Läuferpaar bishop pair · Linie file · Reihe rank · Diagonale diagonal · offene/halboffene Linie
open/half-open file · Flügel wing · Königsflügel kingside · Damenflügel queenside · Zentrum center ·
Entwicklung development · Tempo tempo · Zugzwang zugzwang · Opposition opposition ·
Regel des Quadrats rule of the square · Schlüsselfelder key squares · Elementarmatt basic mates ·
Philidor-Stellung Philidor position · Lucena-Stellung Lucena position · Vancura-Stellung Vancura
position · kurze/lange Seite short/long side · abgeschnitten cut off · hängende Figur hanging piece ·
gedeckt defended · ungedeckt undefended · Angreifer attackers · Verteidiger defenders ·
Abtausch exchange (trade) · Qualität the exchange (rook for minor) · Material material ·
Bauerneinheit pawn (as unit: "+1.5" = 1.5 pawns) · Eröffnung opening · Mittelspiel middlegame ·
Endspiel endgame · Studie study · Stellung position · Variante line / variation · Hauptvariante
main line · Kandidaten(züge) candidate moves · Drohung threat · Plan plan · Engine engine ·
Bewertung evaluation · Gewinnchance winning chance · Genauigkeit accuracy · Spielstärke playing
strength · Wertung rating · Elo Elo · Stufe level · Bot bot · Gegner opponent · Bedenkzeit time
control / thinking time · Uhr clock · Zuschlag increment · Partie game

## Move classes (as on chess.com)
Brillant Brilliant (!!) · Stark Great (!) · Bester Zug Best move · Sehr gut Excellent · Gut Good ·
Buchzug Book move · Ungenauigkeit Inaccuracy (?!) · Fehler Mistake (?) · Verpasst Miss ·
Patzer Blunder (??)

## Book-coined tools and terms (provisional English names)
Zählen Counting · Feld zählen count square · Angriffsregel / Goldene Angriffsregel Attack rule /
Golden attack rule · Todsünden Deadly sins · Schach-Röntgen-Regel Chess X-ray rule · Röntgen X-ray ·
Zielbilanz Goal balance · Faktorenbilanz Factor balance · Planbilanz Plan balance ·
Falle oder Köder? Trap or bait? · Fallencheck trap check · Falle? Trap? ·
Prüffragen Check questions (F1 Warum-Frage → F1 Why question; F2 Zwei Antworten weiter → F2 Two
replies ahead; F3 Fesselungs-Check → F3 Pin check) · Warnsignale warning signs (W1–W7) ·
Leitfrage guiding question (1 Squares, 2 Pawns, 3 Direction, 4 Pieces) · Vorher Before ·
Wo? Where? · Gegner? Opponent? · LAP (am wenigsten aktive Figur) LAP (least active piece) ·
Erzwingende Züge Forcing moves · Motiv Motif · Ruhe Quiet (quiet position = "ruhige Stellung") ·
Die sechs goldenen Endspielregeln the six golden endgame rules · Turmbegriffe rook endgame terms ·
Erkennungsbild recognition pattern · Endspiel-Vertiefung endgame deep dive · Phase Phase ·
Erfassen Assess · Sicherheitsblick Safety check · Denkroutine Thinking routine ·
Gesamt-Checkliste Master checklist · Steckbrief profile · Werkzeug tool · Werkzeugkasten toolbox ·
Bündel bundle · Skelett(-Ansicht) skeleton (view)

## App areas and trainers
Buch Book · Training Training · Spielen Play · Nachschlagen Reference · Einstellungen Settings ·
Glossar Glossary · Abbildung figure (Abb. Fig.) · Zugfolge move sequence · Übung exercise ·
Lösung solution · Hinweis hint · Trainer trainer · Zähltrainer Counting trainer · Koordinaten,
Notation, Gangarten Coordinates, notation, piece moves · Taktiktrainer Tactics trainer ·
Endspieltrainer Endgame trainer · Kurzübungen quick drills · Strukturerkenner Structure spotter ·
Repertoire-Trainer Repertoire trainer · Abweichungsmodus Deviation mode · Studien lösen Solve
studies · Zug erraten Guess the move · 30-Minuten-Plan 30-minute plan · Fehlerdatenbank Mistake
log · Denkroutine-Trainer Thinking routine trainer · Lernsammlung Study collection ·
Wiederholung review (spaced repetition) · Rückblick Review (after the game) · Auswertung Analysis ·
Datensicherung backup · Sicherung einspielen restore backup · Erst selbst denken Think first ·
Absichtliche Fehler deliberate mistakes · Blinde Flecken blind spots · Zum Spaß For fun ·
Vorgefertigte Bots Ready-made bots · Eigene Gegner Custom opponents · Ruhige Ansicht Calm view ·
Brett drehen flip board · Koordinaten coordinates · Figurensatz piece set · Nachtmodus dark mode

## Book title
"Schach von Grund auf" stays German (title of the book; the English title is not yet decided).
