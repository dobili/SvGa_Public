/**
 * Abspielen der Folge in der Partiebesprechung („Soll ich es dir zeigen?“, 26.11.2026): Takt,
 * Stellung nach den gezeigten Halbzügen und die Züge als Text.
 *
 * Rolle im Gesamtbild: Logik von anbindung/Zeigefolge.tsx und Besprechung.tsx; die Folge kommt
 * aus anbindung/besprechungsfolge.ts. Bei reduzierter Bewegung (oder ausgeschalteter
 * Zuganimation) steht sofort die Schlussstellung da.
 * Abhängigkeiten: anbindung/besprechungsfolge.ts (Typ), ui/brett/useZuganimation.ts.
 */
import { useEffect, useState } from "react";
import { zuganimationAn } from "../../ui/brett/useZuganimation";
import type { Zeigefolge } from "./besprechungsfolge";

/** So lange steht jeder Halbzug, bevor der nächste kommt (ms). */
const HALBZUG_MS = 900;

/** Was das Brett beim Zeigen braucht: Stellung und hervorgehobener letzter Zug. */
export interface Zeigeansicht {
  readonly fen: string;
  readonly letzter: { readonly von: string; readonly nach: string } | null;
}

/**
 * Zahl der schon gezeigten Halbzüge; zählt nach dem Start im Takt hoch bis zum Ende der Folge.
 * Beispiel: Folge mit drei Halbzügen → 0, nach 0,9 s 1, dann 2, dann 3 (bleibt stehen).
 */
export function useAbspielen(folge: Zeigefolge | null): number {
  const anzahl = folge?.schritte.length ?? 0;
  const [bewegt] = useState(zuganimationAn);
  // Der Stand gehört zu einer Folge: Eine neue Folge beginnt bei 0, ohne Rücksetzen im Effekt.
  const [stand, setzeStand] = useState<{ folge: Zeigefolge | null; n: number }>({
    folge: null,
    n: 0,
  });
  useEffect(() => {
    if (!folge || !bewegt) return;
    let n = 0;
    const takt = window.setInterval(() => {
      n += 1;
      setzeStand({ folge, n });
      if (n >= anzahl) window.clearInterval(takt);
    }, HALBZUG_MS);
    return () => window.clearInterval(takt);
  }, [folge, anzahl, bewegt]);
  if (!bewegt) return anzahl;
  return stand.folge === folge ? stand.n : 0;
}

/** Stellung und letzter Zug nach `gezeigt` Halbzügen der Folge. */
export function zeigeansicht(folge: Zeigefolge, gezeigt: number): Zeigeansicht {
  const schritt = gezeigt > 0 ? folge.schritte[gezeigt - 1] : undefined;
  return schritt
    ? { fen: schritt.fen, letzter: { von: schritt.von, nach: schritt.nach } }
    : { fen: folge.start, letzter: null };
}

/** Die Züge bis hierher als Text („g6 Df3“). */
export function gezeigteZuege(folge: Zeigefolge, gezeigt: number): string {
  return folge.schritte
    .slice(0, gezeigt)
    .map((s) => s.zug)
    .join(" ");
}
