/**
 * Symbole der Auswertung: je Zeile der Tabellen ein Symbol, je Zugklasse eine farbige Marke wie
 * bei chess.com, und eine kleine Figur in der Farbe der Seite.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026 abends): In den Tabellen der Auswertung soll
 * man eine Zeile am Symbol wiedererkennen, ohne den Text zu lesen; bei den groben Patzern soll
 * eine farbige Figur sagen, welche Seite den Patzer gemacht hat. Die Symbole sind Schmuck
 * (aria-hidden); der Text daneben bleibt, damit Bildschirmleser alles vorlesen.
 * Abhängigkeiten: lucide-react, spiel/auswertung.ts (Zugklasse), spiel/phasen.ts, spiel/taktik.ts.
 */
import type { Color } from "chessops/types";
import { BookOpen, Check, ChessPawn, Star, ThumbsUp, X, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { Zugklasse } from "../../spiel/auswertung";

const ZEILENSYMBOL_GROESSE = 16;
const MARKENSYMBOL_GROESSE = 12;
const FIGUR_GROESSE = 16;

/** Name einer Zeile mit Symbol davor. */
export function Zeilenname({ Symbol, kinder }: { Symbol: LucideIcon; kinder: ReactNode }) {
  return (
    <span className="zeilenname">
      <Symbol size={ZEILENSYMBOL_GROESSE} aria-hidden="true" className="zeilensymbol" />
      <span>{kinder}</span>
    </span>
  );
}

/** Je Klasse ein Zeichen oder ein Symbol, wie bei chess.com. */
const KLASSENZEICHEN: Readonly<Record<Zugklasse, string | LucideIcon>> = {
  brillant: "!!",
  stark: "!",
  bester: Star,
  sehrGut: ThumbsUp,
  gut: Check,
  buch: BookOpen,
  ungenau: "?!",
  fehler: "?",
  verpasst: X,
  patzer: "??",
};

/** Runde farbige Marke einer Zugklasse. Beispiel: „??“ weiß auf Rot für einen Patzer. */
export function Klassenmarke({ klasse }: { klasse: Zugklasse }) {
  const zeichen = KLASSENZEICHEN[klasse];
  return (
    <span className={`klassenmarke klassenmarke-${klasse}`} aria-hidden="true">
      {typeof zeichen === "string" ? (
        zeichen
      ) : (
        <ZeichenSymbol Symbol={zeichen} groesse={MARKENSYMBOL_GROESSE} />
      )}
    </span>
  );
}

function ZeichenSymbol({ Symbol, groesse }: { Symbol: LucideIcon; groesse: number }) {
  return <Symbol size={groesse} strokeWidth={3} />;
}

/** Kleiner Bauer in der Farbe der Seite auf einem Plättchen derselben Farbe (spiel.css, R53). */
export function Seitenfigur({ farbe }: { farbe: Color }) {
  return (
    <ChessPawn
      size={FIGUR_GROESSE}
      aria-hidden="true"
      className={`seitenfigur seitenfigur-${farbe}`}
    />
  );
}
