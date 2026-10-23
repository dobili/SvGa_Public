/**
 * Zuganimation, Logik: welche Figuren gleiten, ob die Animation an ist, Verzug der Uhr.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (R37, 23.10.2026), wie bei chess.com: Die gezogene
 * Figur gleitet vom Start- zum Zielfeld, mit kurzer, verblassender Spur (Zeichnung in
 * Zuganimation.tsx). Brett.tsx merkt sich hier die vorige Stellung; kommt genau ein Zug dazu
 * (eigener Tipp, Zug des Bots, ein Schritt vor in der Zugleiste), gleiten die bewegten Figuren.
 * Bei der Rochade gleitet der Turm mit, eine geschlagene Figur verblasst unter der ankommenden.
 * Nach Ziehen per Wischen gibt es keine Animation (die Figur liegt schon dort), ebenso nicht beim
 * Zurückblättern, bei Sprüngen und bei „Bewegung reduzieren“ des Geräts. Abschaltbar in den
 * Einstellungen (Merker „zuganimation“ auf dem Gerät, wie das Wischen). Die Uhr läuft während
 * der Animation nicht: animationsverzugMs() sagt der Partie, um wie viel später die Uhr der
 * Gegenseite anläuft.
 * Abhängigkeiten: app/merker.ts, React.
 */
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { liesMerker } from "../../app/merker";

/** Name des Merkers auf dem Gerät; Wert „aus“ schaltet die Animation ab. */
export const MERKER_ZUGANIMATION = "zuganimation";
/** Dauer des Gleitens (ms); kurz genug, dass schnelle Spieler nicht warten. */
export const ZUG_ANIMATION_MS = 220;
/** Die Spur: Durchsicht der Nachbilder hinter der Figur, das erste ist das deutlichste. */
export const SPUR_DURCHSICHT = [0.32, 0.18, 0.08] as const;
/** Abstand der Nachbilder in der Zeit (ms). */
export const SPUR_ABSTAND_MS = 22;

/** Eine Figur, die von einem Feld zum anderen gleitet; dazu die Figur, die sie schlägt. */
export interface Bewegung {
  readonly zeichen: string;
  readonly von: string;
  readonly nach: string;
  readonly geschlagen: string | null;
}

/** Ist die Zuganimation auf diesem Gerät an? Voreinstellung: an, außer bei reduzierter Bewegung. */
export function zuganimationAn(): boolean {
  if (liesMerker(MERKER_ZUGANIMATION) === "aus") return false;
  const reduziert =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return !reduziert;
}

/**
 * Um so viele Millisekunden startet die Uhr der Gegenseite nach einem Zug später.
 * Beispiel: Animation an → 220; aus → 0 (die Uhr läuft sofort wie bis 0.2.117).
 */
export function animationsverzugMs(): number {
  return zuganimationAn() ? ZUG_ANIMATION_MS : 0;
}

/**
 * Welche Figuren zwischen zwei Stellungen gleiten.
 *
 * Eingaben: Figuren vorher und nachher (Feld → FEN-Zeichen), Start- und Zielfeld des letzten
 * Zuges der neuen Stellung. Ausgabe: die Bewegungen oder eine leere Liste, wenn die neue
 * Stellung nicht durch genau diesen einen Zug entstanden ist (Zurückblättern, Sprung).
 * Beispiel: Grundstellung nach 1. e4 → [{ P, e2 → e4 }]; nach 0-0 → König e1 → g1 und Turm
 * h1 → f1. Sonderfälle: Umwandlung gleitet als neue Figur; der en passant geschlagene Bauer
 * verschwindet einfach.
 */
export function bewegungen(
  vorher: ReadonlyMap<string, string>,
  nachher: ReadonlyMap<string, string>,
  zug: { von: string; nach: string },
): Bewegung[] {
  const zeichen = nachher.get(zug.nach);
  if (!zeichen || !vorher.has(zug.von) || nachher.has(zug.von)) return [];
  const geschlagen = vorher.get(zug.nach) ?? null;
  const ergebnis: Bewegung[] = [{ zeichen, von: zug.von, nach: zug.nach, geschlagen }];
  const geaendert = (karte: ReadonlyMap<string, string>, andere: ReadonlyMap<string, string>) =>
    [...karte].filter(([f, z]) => f !== zug.von && f !== zug.nach && andere.get(f) !== z);
  const erschienen = geaendert(nachher, vorher);
  const verschwunden = geaendert(vorher, nachher);
  const turm = zeichen === "K" ? "R" : zeichen === "k" ? "r" : null;
  const [neu] = erschienen;
  const quelle = verschwunden.find(([, z]) => z === turm);
  // Rochade: genau ein Turm der eigenen Farbe zieht mit.
  if (neu && neu[1] === turm && quelle && erschienen.length === 1 && verschwunden.length === 1) {
    return [...ergebnis, { zeichen: neu[1], von: quelle[0], nach: neu[0], geschlagen: null }];
  }
  // En passant: Nur der geschlagene Bauer verschwindet zusätzlich.
  const enPassant = verschwunden.length === 1 && zeichen.toLowerCase() === "p";
  return erschienen.length === 0 && (verschwunden.length === 0 || enPassant) ? ergebnis : [];
}

/**
 * Merkt sich die vorige Stellung und liefert die Bewegungen, solange sie gleiten.
 *
 * Eingaben: Stellung und ihre Figuren, letzter Zug, ob animiert werden darf.
 * Ausgabe: die laufenden Bewegungen (leer, wenn nichts gleitet) und merkeGewischt: Brett.tsx
 * meldet damit das Startfeld eines per Wischen abgelegten Zuges, der dann nicht gleitet.
 * Beispiel: Bot spielt 1... e5 → [{ p, e7 → e5 }] für 220 ms, dann [].
 */
export function useZuganimation(
  fen: string,
  figuren: ReadonlyMap<string, string>,
  letzterZug: { von: string; nach: string } | null,
  an: boolean,
): { laufend: readonly Bewegung[]; merkeGewischt: (von: string) => void } {
  const vorherRef = useRef<{ fen: string; figuren: ReadonlyMap<string, string> } | null>(null);
  const gewischtRef = useRef<string | null>(null);
  const [laufend, setzeLaufend] = useState<readonly Bewegung[]>([]);
  useLayoutEffect(() => {
    const alt = vorherRef.current;
    vorherRef.current = { fen, figuren };
    if (!alt || alt.fen === fen) return;
    const vonHand = letzterZug !== null && letzterZug.von === gewischtRef.current;
    gewischtRef.current = null;
    const neu = an && letzterZug && !vonHand ? bewegungen(alt.figuren, figuren, letzterZug) : [];
    setzeLaufend(neu);
    if (neu.length === 0) return;
    const ende = setTimeout(() => setzeLaufend([]), ZUG_ANIMATION_MS + SPUR_ABSTAND_MS * 4);
    return () => clearTimeout(ende);
    // Nur bei einer neuen Stellung; die Figurenkarte entsteht bei jedem Zeichnen neu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen]);
  const merkeGewischt = useCallback((von: string) => {
    gewischtRef.current = von;
  }, []);
  return { laufend, merkeGewischt };
}
