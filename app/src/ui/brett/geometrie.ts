/**
 * Geometrie des Brettes: Felder in Bildpunkte umrechnen, Pfeile berechnen.
 *
 * Rolle im Gesamtbild: Reine Rechenfunktionen für Brett.tsx, ohne React, damit sie testbar sind.
 * Abhängigkeiten: masse.ts.
 */
import { FELD, PFEIL } from "./masse";

/** Ein Punkt in Einheiten des Brettes (0 bis 8000), y nach unten. */
export interface Punkt {
  readonly x: number;
  readonly y: number;
}

const LINIEN = "abcdefgh";

/**
 * Linke obere Ecke eines Feldes.
 *
 * Eingaben: Feldname wie „d4“, ob das Brett aus Sicht von Schwarz gezeigt wird.
 * Ausgabe: Punkt oder null bei ungültigem Feld.
 * Beispiel: „a8“ normal → (0, 0); „d4“ normal → (3000, 4000).
 */
export function feldEcke(feld: string, gedreht: boolean): Punkt | null {
  const linie = LINIEN.indexOf(feld.charAt(0));
  const reihe = Number(feld.charAt(1));
  if (linie < 0 || !Number.isInteger(reihe) || reihe < 1 || reihe > 8 || feld.length !== 2) {
    return null;
  }
  const spalte = gedreht ? 7 - linie : linie;
  const zeile = gedreht ? reihe - 1 : 8 - reihe;
  return { x: spalte * FELD, y: zeile * FELD };
}

/** Mittelpunkt eines Feldes. */
export function feldMitte(feld: string, gedreht: boolean): Punkt | null {
  const ecke = feldEcke(feld, gedreht);
  return ecke ? { x: ecke.x + FELD / 2, y: ecke.y + FELD / 2 } : null;
}

/** Alle 64 Felder von a8 bis h1 in Leserichtung (bei gedrehtem Brett von h1 bis a8). */
export function alleFelder(gedreht: boolean): string[] {
  const felder: string[] = [];
  for (let zeile = 0; zeile < 8; zeile += 1) {
    for (let spalte = 0; spalte < 8; spalte += 1) {
      const linie = gedreht ? 7 - spalte : spalte;
      const reihe = gedreht ? zeile + 1 : 8 - zeile;
      felder.push(`${LINIEN.charAt(linie)}${reihe}`);
    }
  }
  return felder;
}

/** Geometrie eines Pfeils: Schaft als Linie, Spitze als Dreieck. */
export interface Pfeilform {
  readonly schaftVon: Punkt;
  readonly schaftBis: Punkt;
  readonly spitze: readonly [Punkt, Punkt, Punkt];
}

/**
 * Berechnet einen geraden Pfeil von Feldmitte zu Feldmitte wie „straightmove“ im Buch.
 *
 * Warum: Der Schaft endet vor der Spitze, damit gestrichelte und gepunktete Linien nicht in die
 * Spitze hineinragen.
 * Eingaben: Start- und Zielfeld, Drehung, seitlicher Versatz quer zur Richtung (versatz.ts;
 * 0 für Pfeile, die keinen anderen überdecken). Ausgabe: Pfeilform oder null.
 * Beispiel: Abb. 1.26, Pfeil b6–d4 (Dame über c5 hinweg), leicht neben c5–d4 versetzt.
 */
export function pfeilform(
  von: string,
  nach: string,
  gedreht: boolean,
  versatz = 0,
): Pfeilform | null {
  const a = feldMitte(von, gedreht);
  const b = feldMitte(nach, gedreht);
  if (!a || !b || (a.x === b.x && a.y === b.y)) {
    return null;
  }
  const laenge = Math.hypot(b.x - a.x, b.y - a.y);
  const richtung = { x: (b.x - a.x) / laenge, y: (b.y - a.y) / laenge };
  const quer = { x: -richtung.y, y: richtung.x };
  const punktAuf = (abstand: number, seitlich = 0): Punkt => ({
    x: a.x + richtung.x * abstand + quer.x * (seitlich + versatz),
    y: a.y + richtung.y * abstand + quer.y * (seitlich + versatz),
  });
  const spitzeBasis = laenge - PFEIL.spitzeLaenge;
  return {
    schaftVon: punktAuf(PFEIL.verkuerzungStart),
    schaftBis: punktAuf(spitzeBasis),
    spitze: [
      punktAuf(laenge),
      punktAuf(spitzeBasis, PFEIL.spitzeHalbeBreite),
      punktAuf(spitzeBasis, -PFEIL.spitzeHalbeBreite),
    ],
  };
}

/** Liest den Stellungsteil der FEN in eine Zuordnung Feld → FEN-Buchstabe. */
export function figurenAusFen(fen: string): Map<string, string> {
  const figuren = new Map<string, string>();
  const zeilen = (fen.split(" ")[0] ?? "").split("/");
  zeilen.forEach((zeile, index) => {
    let linie = 0;
    for (const zeichen of zeile) {
      const leer = Number(zeichen);
      if (Number.isInteger(leer) && leer > 0) {
        linie += leer;
        continue;
      }
      figuren.set(`${"abcdefgh".charAt(linie)}${8 - index}`, zeichen);
      linie += 1;
    }
  });
  return figuren;
}
