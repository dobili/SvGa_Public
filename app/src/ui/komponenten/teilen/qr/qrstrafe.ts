/**
 * Strafpunkte einer Modulmatrix (ISO/IEC 18004, Abschnitt 7.8.3): Damit wählt qrcode.ts unter den
 * acht Masken die, die sich am besten scannen lässt.
 *
 * Rolle im Gesamtbild: Vier Regeln: lange Läufe gleicher Farbe, 2 × 2-Blöcke, Muster, die wie ein
 * Suchmuster aussehen (1:1:3:1:1 mit hellem Rand), und ein Ungleichgewicht von Hell und Dunkel.
 * Die Zählung der Suchmuster folgt Nayuki (MIT), die dieselbe Auslegung wie die gängigen
 * Erzeuger nutzt; so stimmt die gewählte Maske mit ihnen überein (Test gegen Referenzmatrizen).
 * Abhängigkeiten: keine.
 */

/** Gewichte der vier Regeln (Norm: N1 bis N4). */
const STRAFE_LAUF = 3;
const STRAFE_BLOCK = 3;
const STRAFE_SUCHMUSTER = 40;
const STRAFE_BALANCE = 10;
/** Ab dieser Lauflänge zählt Regel 1. */
const LAUF_AB = 5;
/** Die letzten sieben Lauflängen (genug für 1:1:3:1:1 mit Rand auf beiden Seiten). */
const VERLAUFSLAENGE = 7;
/** Breite des hellen Randes, der vor und hinter einem Suchmuster stehen muss (×Modulbreite). */
const RAND_VIELFACHES = 4;
/** Mittlerer Teil des Suchmusters ist dreimal so breit. */
const MITTE_VIELFACHES = 3;
/** Schritt der Balance in Prozent (je 5 % Abweichung von 50 % eine Stufe). */
const PROZENT = 100;
const BALANCE_SCHRITT = 5;
const HALB = 50;

/** Zählt Suchmuster-ähnliche Folgen in den letzten Läufen (0, 1 oder 2). */
function suchmusterImVerlauf(verlauf: readonly number[]): number {
  const [vorn = 0, a = 0, b = 0, c = 0, d = 0, e = 0, hinten = 0] = verlauf;
  const kern = a > 0 && b === a && c === a * MITTE_VIELFACHES && d === a && e === a;
  return (
    (kern && vorn >= a * RAND_VIELFACHES && hinten >= a ? 1 : 0) +
    (kern && hinten >= a * RAND_VIELFACHES && vorn >= a ? 1 : 0)
  );
}

/** Trägt einen abgeschlossenen Lauf vorn in den Verlauf ein; der erste zählt den Rand mit. */
function merkeLauf(verlauf: number[], laenge: number, kante: number): void {
  verlauf.pop();
  verlauf.unshift(verlauf[0] === 0 ? laenge + kante : laenge);
}

/** Strafpunkte der Regeln 1 und 3 für eine Zeile oder Spalte. */
function linienstrafe(linie: readonly boolean[]): number {
  const kante = linie.length;
  const verlauf = new Array<number>(VERLAUFSLAENGE).fill(0);
  let farbe = false;
  let lauf = 0;
  let strafe = 0;
  for (const dunkel of linie) {
    if (dunkel === farbe) {
      lauf++;
      if (lauf === LAUF_AB) strafe += STRAFE_LAUF;
      else if (lauf > LAUF_AB) strafe++;
      continue;
    }
    merkeLauf(verlauf, lauf, kante);
    if (!farbe) strafe += suchmusterImVerlauf(verlauf) * STRAFE_SUCHMUSTER;
    farbe = dunkel;
    lauf = 1;
  }
  // Abschluss: Ein dunkler Lauf am Ende wird beendet, dann folgt der helle Rand.
  if (farbe) {
    merkeLauf(verlauf, lauf, kante);
    lauf = 0;
  }
  merkeLauf(verlauf, lauf + kante, kante);
  return strafe + suchmusterImVerlauf(verlauf) * STRAFE_SUCHMUSTER;
}

/** Regel 2: jeder 2 × 2-Block einer Farbe. */
function blockstrafe(dunkel: readonly (readonly boolean[])[]): number {
  let strafe = 0;
  for (let y = 0; y + 1 < dunkel.length; y++) {
    const oben = dunkel[y] ?? [];
    const unten = dunkel[y + 1] ?? [];
    for (let x = 0; x + 1 < oben.length; x++) {
      const farbe = oben[x];
      if (farbe === oben[x + 1] && farbe === unten[x] && farbe === unten[x + 1]) {
        strafe += STRAFE_BLOCK;
      }
    }
  }
  return strafe;
}

/** Regel 4: je volle 5 % Abweichung des dunklen Anteils von 50 %. */
function balancestrafe(dunkel: readonly (readonly boolean[])[]): number {
  const gesamt = dunkel.length * dunkel.length;
  const dunkle = dunkel.reduce((summe, zeile) => summe + zeile.filter(Boolean).length, 0);
  const stufen =
    Math.ceil(Math.abs(dunkle * PROZENT - gesamt * HALB) / (gesamt * BALANCE_SCHRITT)) - 1;
  return Math.max(0, stufen) * STRAFE_BALANCE;
}

/**
 * Strafpunkte einer fertig maskierten Matrix; kleiner ist besser.
 * Eingabe: Zeilen der Matrix, dunkel = true. Ausgabe: Summe der vier Regeln.
 */
export function strafpunkte(dunkel: readonly (readonly boolean[])[]): number {
  const spalten = dunkel.map((_, x) => dunkel.map((zeile) => zeile[x] ?? false));
  const linien = [...dunkel, ...spalten].reduce((summe, linie) => summe + linienstrafe(linie), 0);
  return linien + blockstrafe(dunkel) + balancestrafe(dunkel);
}
