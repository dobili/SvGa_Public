# Auftrag mittel-1: Sprüche für die Zeitkarten und Konter der Straßengegner

**Stand:** offen (Haupt-Chat, 08.11.2026, zehnter Auftrag, klein; Grundlage
`docs/spiel/10_Sprueche_Schauplaetze_Varianten.md`, Abschnitt 1)
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

(vom Helfer auszufüllen)
