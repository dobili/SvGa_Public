# Wegsperren S15 bis S17: Stärke gemessen (18.11.2026)

Auftrag des Hauptchats: die Versätze E + 260, 380, 560 der drei Sperren (`32_Wegsperren.md`)
gegen Leser in Lesestärke prüfen, den Befund „Zoe schlägt die Dame nicht zurück“ aus dem
Browsertest klären und die Versätze danach einstellen. Ziel des Autors: Wer in Lesestärke spielt,
öffnet meist im ersten oder zweiten Versuch, aber nicht geschenkt.

## Messweg

`app/src/abenteuer/wegsperren.messung.ts` (kein Test der Prüfkette, Aufruf im Dateikopf und in
`CLAUDE.md`). Je Partie:

- **Gegner wie in der App:** Profil aus `gegner.json`, Stärke über `regeln/gegnerstaerke.ts`
  (A = E, nicht abgelenkt), Einstellung über `anbindung/partiestart.ts` mit Maia, Profil der
  Zugwahl wie `profilDerPartie` in `ui/komponenten/partie/botzug.ts`, Stufe je Phase höchstens
  eine Stufe je Zug weiter.
- **Leser:** vorgefertigte Bots der App mit gemessener Stärke nahe E, mit Maia, im Wechsel
  (800: Mara 783, Leyla 797, Holger 871; 1200: Frau Demir 1151, Frau Romero 1187, Katrin 1232;
  1600: Herr Vogel 1538, Günter 1600, Herr Kühn 1723). Ohne Karten, ohne Zurücknehmen.
- **Format und Wertung wie in der App:** Startstellung der Begegnung, 10, 12 oder 15 eigene Züge
  und die Antwort des Gegners, dann Stockfish 19 lite, Tiefe 12 (`regeln/kurzform.ts`).
- **Feste Saat je Partie:** Derselbe Lauf ergibt dieselben Partien (an fünf Partien nachgeprüft).

Spalten: „offen im 1.“ ist Sieg oder Remis; „bis 2.“ und „Notausgang“ (drei Niederlagen in Folge)
sind aus der Niederlagenquote gerechnet, als wären die Versuche unabhängig. Bei 30 Partien schwankt
eine Quote um etwa ±9 Prozentpunkte, bei 60 um etwa ±6.

## Vorher (Stand `82108d35`), je 30 Partien

| Sperre | E    | Gegner: Stufen, Häufigkeit | Sieg | Remis | Niederlage | offen im 1. | bis 2. | Notausgang |
| ------ | ---- | -------------------------- | ---- | ----- | ---------- | ----------- | ------ | ---------- |
| S15    | 800  | 4/4/4, 1,37                | 18   | 3     | 9          | 70 %        | 91 %   | 3 %        |
| S15    | 1200 | 5/5/5, 1,09                | 14   | 6     | 10         | 67 %        | 89 %   | 4 %        |
| S15    | 1600 | 6/6/6, 0,87                | 8    | 6     | 16         | 47 %        | 72 %   | 15 %       |
| S16    | 800  | 4/4/4, 1,05                | 19   | 4     | 7          | 77 %        | 95 %   | 1 %        |
| S16    | 1200 | 5/5/5, 0,84                | 15   | 4     | 11         | 63 %        | 87 %   | 5 %        |
| S16    | 1600 | 7/7/7, 1,31                | 15   | 9     | 6          | 80 %        | 96 %   | 1 %        |
| S17    | 800  | 5/5/4, 1,37                | 23   | 4     | 3          | 90 %        | 99 %   | 0 %        |
| S17    | 1200 | 6/6/5, 1,09                | 18   | 8     | 4          | 87 %        | 98 %   | 0 %        |
| S17    | 1600 | 7/7/6, 0,87                | 21   | 7     | 2          | 93 %        | 100 %  | 0 %        |

S17 war geschenkt, und zwar aus dem falschen Grund (nächster Abschnitt).

## Befund: Zoe schlägt die Dame nicht zurück

**Ursache (belegt): ein Fehler im Zugweg, nicht das Profil.** Maia-2 ist ohne die ersten zehn
Halbzüge einer Partie trainiert; `engine/maia.ts` ließ Maia deshalb erst ab Halbzug 10 mitrechnen
und las den Halbzug aus der Zugnummer der FEN. Eine Partie aus einer Abbildung beginnt aber mit
Zugnummer 1. In Abbildung 8.2 (Springerendspiel mit Damen) spielte Zoe also ihre ersten fünf Züge
ohne Maia. Ohne Maia wählt das Wahlmodell allein, und wenn es nur einen vernünftigen Zug gibt,
summieren sich die vielen schlechten Kandidaten.

Nachgestellt an der Stellung nach 1. Dxd7 (`6k1/pp1Q1ppp/1n6/8/4N3/2P5/PP3PPP/6K1 b - - 0 1`,
Kandidaten der Engine in Tiefe 10, Wahrscheinlichkeit von 1… Sxd7 bei mittlerer Tagesform):

| Stufe (Wertung) | ohne Maia | mit Maia |
| --------------- | --------- | -------- |
| 3 (900)         | 52 %      | 92 %     |
| 4 (1200)        | 62 %      | 99 %     |
| 5 (1500)        | 81 %      | 99,8 %   |
| 6 (1800)        | 88 %      | 99,9 %   |

Der Browsertest lief mit E = 600, also Stufe 4: Zoe ließ die Dame in etwa einem Drittel der
Partien stehen, und die meisten anderen Züge erlauben Dd8 oder De8 matt. In der Messung „vorher“ kam es in 10
von 90 Partien vor (5, 3 und 2 bei E = 800, 1200, 1600), fünfmal mit Matt im nächsten Zug. Dazu
gab Zoe in 10 von 90 Partien mit 2… g5 sofort einen Bauern her. Fehlerart `falscherAbtausch`,
der Phasenversatz und die Maia-Mischung selbst sind nicht die Ursache.

**Behoben:** `vorMaiaBereich` in `engine/maia.ts`. Vor Halbzug 10 schweigt Maia nur noch, wenn
die Stellung mindestens 28 Steine hat (eine echte Eröffnung). Test in `engine/maia.test.ts`. Nach
der Änderung: 0 von 360 Partien ohne Rückschlagen, 0 mit 2… g5. Die Änderung gilt für alle Partien
aus einer Stellung mit weniger als 28 Steinen, auch in der App und für die Endspiele von Sol, dem
Schiffskoch, der Kreidenacht und das vierte Simultanbrett. Stellungen mit 28 und mehr Steinen und
Zugnummer unter 6 (etwa Rosas Duell, Abbildung 1.41) spielen weiter zehn Halbzüge ohne Maia.

Nur die Behebung, Versätze unverändert, S17 je 30 Partien: Sieg/Remis/Niederlage 16/7/7, 16/11/3,
21/9/0 (offen im 1. Versuch 77 %, 90 %, 100 %). S15 und S16 ändern sich durch die Behebung nicht
(ihre Startstellungen haben Halbzug 10 und 8 und je 30 Steine).

## Empfehlung, umgesetzt

- **S15 (Benji, E + 260) und S16 (Imani, E + 380): unverändert.** Im ersten Versuch offen in 52 bis
  82 %, bis zum zweiten in 77 bis 97 %. Probe S15 mit E + 200 (je 30 Partien, E = 1200 und 1600):
  60 % und 60 % im ersten Versuch, also kein Unterschied, der über dem Rauschen liegt.
- **S17 (Zoe, E + 560): Phasenversatz „Endspiel −1“ entfernt** (`gegner.json`). Die Begegnung
  ist ein Endspiel; mit dem Versatz spielte Zoe durchweg eine Stufe unter E + 560. Der Versatz
  selbst bleibt (er liegt 80 unter Clubchef Ward).

## Nachher, je 60 Partien

S17: 60 neue Partien mit der neuen `gegner.json`. S15 und S16: die 30 Partien von oben (gleicher
Stand, gleiche Partien) und 30 weitere.

| Sperre | E    | Gegner: Stufen, Häufigkeit | Sieg | Remis | Niederlage | offen im 1. | bis 2. | Notausgang |
| ------ | ---- | -------------------------- | ---- | ----- | ---------- | ----------- | ------ | ---------- |
| S15    | 800  | 4/4/4, 1,37                | 35   | 8     | 17         | 72 %        | 92 %   | 2 %        |
| S15    | 1200 | 5/5/5, 1,09                | 27   | 14    | 19         | 68 %        | 90 %   | 3 %        |
| S15    | 1600 | 6/6/6, 0,87                | 17   | 14    | 29         | 52 %        | 77 %   | 11 %       |
| S16    | 800  | 4/4/4, 1,05                | 39   | 4     | 17         | 72 %        | 92 %   | 2 %        |
| S16    | 1200 | 5/5/5, 0,84                | 35   | 7     | 18         | 70 %        | 91 %   | 3 %        |
| S16    | 1600 | 7/7/7, 1,31                | 29   | 20    | 11         | 82 %        | 97 %   | 1 %        |
| S17    | 800  | 5/5/5, 1,37                | 26   | 22    | 12         | 80 %        | 96 %   | 1 %        |
| S17    | 1200 | 6/6/6, 1,09                | 25   | 24    | 11         | 82 %        | 97 %   | 1 %        |
| S17    | 1600 | 7/7/7, 0,87                | 43   | 16    | 1          | 98 %        | 100 %  | 0 %        |

## Entscheidung, umgesetzt (18.11.2026): S17 öffnet nur mit Sieg

Mit „Sieg oder Remis öffnet“ war S17 fast immer offen (Tabelle oben, 80 bis 98 % im ersten
Versuch). Das lag am Format, nicht am Versatz: {held} beginnt mit etwa +3, und schon das Remis
(über −1,5) öffnete; ein höherer Versatz läge über Clubchef Ward. Entschieden und gebaut: An S17
öffnet nur noch der Sieg („Endspiel gewinnen“ heißt so). Ein Remis zählt als Fehlversuch wie die
Niederlage, und der dritte Fehlversuch öffnet weiter (Notausgang). S15 und S16 sind unverändert.
Wo es steckt: `inhalte/abenteuer/dialoge/de/weg-desert-summit.ink` (Knoten `testteam_gitter`,
`testteam_gitter_fehlversuch`), Satz `erzaehlung.testteamGitter.remis`; Tests in
`app/src/abenteuer/dialog/wegsperre-s17.test.ts` und `app/tests/e2e/abenteuer-wegsperre-partie.spec.ts`.

Erwartete Quoten für S17 mit der neuen Regel, **gerechnet aus den 60 Partien je Zelle der Tabelle
„Nachher“, nicht neu gemessen** (die Regel ändert keine Partie, nur ihre Wertung am Übergang; ein
neuer Lauf mit derselben Saat ergäbe dieselben Partien):

| E    | Sieg von 60 | offen im 1. | bis 2. | Notausgang (drei Fehlversuche) |
| ---- | ----------- | ----------- | ------ | ------------------------------ |
| 800  | 26          | 43 %        | 68 %   | 18 %                           |
| 1200 | 25          | 42 %        | 66 %   | 20 %                           |
| 1600 | 43          | 72 %        | 92 %   | 2 %                            |

„Bis 2.“ und „Notausgang“ wie oben gerechnet, als wären die Versuche unabhängig; bei 60 Partien
schwankt eine Quote um etwa ±6 Prozentpunkte. Bei E = 800 und 1200 käme demnach etwa jeder Fünfte
erst über den Notausgang durch. Das ist mehr als an S15 und S16 (1 bis 11 %) und der Punkt, den ein
Spieltest mit echten Lesern zuerst prüfen sollte. Stellschraube dafür wäre der Versatz von Zoe.

## Was bleibt

1. **S17 ist jetzt die strengste Sperre** (voriger Abschnitt); gegen echte Leser ist das ungeprüft.
2. **Die Stufen sind grob (je 300 Elo).** Derselbe Versatz trifft je nach E die Mitte oder den
   Rand einer Stufe: Imani ist bei E = 1600 Stufe 7 mit Häufigkeit 1,31 und damit leichter (82 %)
   als bei E = 1200 mit Stufe 5 und 0,84 (70 %). Ein Versatz lässt sich deshalb nur auf etwa eine
   halbe Stufe genau einstellen.
3. **Benji und Imani patzen bei E = 800 grob** (Stufe 4): in 23 und 22 von 60 Partien mindestens
   ein Zug mit fünf Bauern Verlust, meist „Drohung ignoriert“, auch eine eingestellte Dame. Zu
   Benji, der „alles schlägt“, passt das; hier nur festgehalten.
4. **Nicht gemessen:** echte Leser, die Karten des Lesers (sie machen jede Sperre leichter),
   E unter 800 und über 1600, Zustände (abgelenkt) und der zweite Durchlauf (+300). Die Bots der
   Lesestärke kennen das Thema der Stellung nicht besser als andere Stellungen; ein Leser, der das
   Kapitel gerade gelesen hat, schon.
