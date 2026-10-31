/**
 * Abzeichen zu Kapiteln, die auf dem Lernpfad sonst keine eigene Herausforderung aus dem Spiel
 * hätten (Wunsch des Autors, 31.10.2026: Nebenaufgaben auf der Karte „Dein Weg durchs Buch“).
 * Eigene Teilliste von ABZEICHEN wie die Pakete der Gamifizierung.
 *
 * Rolle im Gesamtbild: Beide Bedingungen rechnen nur mit gespeicherten Partien (die letzten 50,
 * speicher/partien.ts), ohne neues Speicherfeld. Wie bei „Erstes Matt“ bleibt ein einmal gefeiertes
 * Abzeichen verdient, auch wenn die Partie später aus der Liste fällt (abzeichenstand.ts).
 * - „Kurzer Prozess“ (Regel: Kapitel 4, Das Fallenkabinett: Fallen enden oft nach wenigen Zügen
 *   mit Matt): Sieg durch Matt aus der Grundstellung in höchstens 15 eigenen Zügen.
 * - „Neue Dame“ (Regel: Kapitel 8, Endspiel-Fundament: der Freibauer will zur Dame werden): in
 *   einer beendeten Partie einen eigenen Bauern umgewandelt.
 * Abhängigkeiten: abzeichen.ts (Typ), erfahrung.ts (eigene Partie, Sieg), spiel/partie.ts (Typ),
 * lucide-react (Zeichen).
 */
import { Crown, Zap } from "lucide-react";
import type { Partie } from "../../../spiel/partie";
import type { Abzeichenangabe } from "./abzeichen";
import { gewonnen, istEigenePartie } from "./erfahrung";

/** Grundstellung (Figuren und Zugrecht); nur aus ihr zählt ein kurzer Sieg. */
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w";
/** Höchstens so viele eigene Züge für „Kurzer Prozess“. */
export const KURZER_PROZESS_ZUEGE = 15;
/** Ein Zug, eigener und gegnerischer, sind zwei Halbzüge. */
const HALBZUEGE_JE_ZUG = 2;
/** In der Notation (SAN) steht eine Umwandlung als „=“, etwa „e8=Q“. */
const UMWANDLUNG = "=";

/** Aus der Grundstellung in höchstens 15 eigenen Zügen durch Matt gewonnen? */
export function kurzerProzess(partie: Partie): boolean {
  return (
    istEigenePartie(partie) &&
    gewonnen(partie) &&
    partie.ende?.art === "matt" &&
    partie.einstellung.startFen.startsWith(GRUNDSTELLUNG) &&
    partie.zuege.length <= KURZER_PROZESS_ZUEGE * HALBZUEGE_JE_ZUG
  );
}

/** Hat der Leser in dieser beendeten Partie einen Bauern umgewandelt? */
export function eigeneUmwandlung(partie: Partie): boolean {
  return (
    istEigenePartie(partie) &&
    partie.zuege.some((z) => z.von === "leser" && z.san.includes(UMWANDLUNG))
  );
}

/** Die Abzeichen zu Kapiteln in der Reihenfolge des Gitters. */
export const KAPITEL_ABZEICHEN: readonly Abzeichenangabe[] = [
  {
    kennung: "kurzerProzess",
    symbol: Zap,
    erfuellt: (g) => g.daten.spiel.partien.some((e) => kurzerProzess(e.partie)),
  },
  {
    kennung: "umwandlung",
    symbol: Crown,
    erfuellt: (g) => g.daten.spiel.partien.some((e) => eigeneUmwandlung(e.partie)),
  },
];
