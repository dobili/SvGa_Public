/**
 * Gedächtnisstellung (Partieform der Runde 6, Seilschaft auf Weg 6; docs/spiel/15, Abschnitt 4,
 * Punkt 5): Eine Stellung steht kurz da, dann baut der Leser sie aus dem Gedächtnis nach.
 *
 * Rolle im Gesamtbild: Reine Logik für oberwelt/Gedaechtnisstellung.tsx (getestet in
 * gedaechtnis.test.ts). Verglichen wird nur die Figurenstellung (erstes Feld der FEN); wer am Zug
 * ist, zählt nicht.
 * Beispiel: Soll „6k1/5pp1/8/8/8/8/5PP1/3R2K1“, Ist ohne den Turm → 6 von 7 richtig, nicht bestanden.
 */

/** Ergebnis des Vergleichs: richtig gesetzte Steine, falsche oder überzählige, Steine im Soll. */
export interface Gedaechtnisergebnis {
  readonly richtig: number;
  readonly falsch: number;
  readonly gesamt: number;
  readonly bestanden: boolean;
}

const BRETTBREITE = 8;

/** Feld → Stein („e1“ → „K“) aus dem ersten Feld einer FEN. */
function steineVon(fen: string): Map<number, string> {
  const steine = new Map<number, string>();
  const reihen = (fen.split(" ")[0] ?? "").split("/");
  reihen.forEach((reihe, r) => {
    let spalte = 0;
    for (const zeichen of reihe) {
      const leer = Number(zeichen);
      if (Number.isInteger(leer) && leer > 0) {
        spalte += leer;
        continue;
      }
      steine.set(r * BRETTBREITE + spalte, zeichen);
      spalte += 1;
    }
  });
  return steine;
}

/**
 * Vergleicht die aufgebaute Stellung mit der gezeigten. Bestanden: alle Steine richtig, keiner
 * zu viel.
 */
export function vergleicheStellung(soll: string, ist: string): Gedaechtnisergebnis {
  const a = steineVon(soll);
  const b = steineVon(ist);
  let richtig = 0;
  for (const [feld, stein] of a) if (b.get(feld) === stein) richtig += 1;
  let falsch = 0;
  for (const [feld, stein] of b) if (a.get(feld) !== stein) falsch += 1;
  return { richtig, falsch, gesamt: a.size, bestanden: richtig === a.size && falsch === 0 };
}
