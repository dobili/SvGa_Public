/**
 * Erkennungsbilder mit Läufer: Läuferendspiele (gleich- und ungleichfarbig, falscher Läufer),
 * Läufer gegen Springer und Turm gegen Läufer.
 *
 * Rolle im Gesamtbild: Teil von erkennungsbilder.ts (Baustein für k9-erkennungsbilder), seit
 * 16.10.2026 eigene Datei, damit beide unter 400 Zeilen bleiben.
 * Abhängigkeiten: chessops, bauernschwaechen.ts, koenigsweg.ts, stellung.ts.
 * Buchbezug: Kapitel 9, „Ungleichfarbige Läufer: Das Festungsremis“ (Abb. 9.35 bis 9.37),
 * „Gleichfarbige Läufer“ (Abb. 9.38), „Der falsche Läufer“ (Abb. 9.41), „Läufer gegen Springer“
 * (Abb. 9.42), Turm gegen Läufer (Abb. 9.43, 9.44).
 */
import type { Color, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { bauernschwaechen } from "./bauernschwaechen";
import type { Bildfeld, Erkennungsbild, Merkmal } from "./erkennungsbilder";
import { koenigsabstand } from "./koenigsweg";
import { gegner, type Stellung } from "./stellung";

const LETZTE = 7;
const LINIE_A = 0;
const LINIE_H = 7;
const DAMENFLUEGEL_BIS = 3;
/**
 * Ab so vielen Linien Abstand heißen zwei Freibauern „getrennt“ (C1.26, Entscheidung des Autors
 * vom 16.10.2026; Abb. 9.37: b5 und g5).
 */
const GETRENNT_AB_LINIEN = 3;

/** Farbe eines Feldes: true für hell. */
function hell(feld: Square): boolean {
  return (squareFile(feld) + squareRank(feld)) % 2 === 1;
}

/**
 * Zwei getrennte Freibauern einer Seite (mindestens drei Linien Abstand), sonst null.
 *
 * Regel: Kapitel 9, „Getrennte Freibauern mit mehreren Linien Abstand gewinnen hingegen zumeist
 * (Abb. 9.37), da König und Läufer nicht an beiden Flügeln zugleich blockieren können.“
 */
function getrennteFreibauern(stellung: Stellung): readonly [Square, Square] | null {
  for (const farbe of ["white", "black"] as const) {
    const frei = bauernschwaechen(stellung.brett, farbe).freibauern.map((f) => f.feld);
    for (const a of frei) {
      const b = frei.find((x) => squareFile(x) - squareFile(a) >= GETRENNT_AB_LINIEN);
      if (b !== undefined) return [a, b];
    }
  }
  return null;
}

/**
 * Merkmale bei ungleichfarbigen Läufern: getrennte Freibauern meist gewonnen, nahe oder
 * verbundene Festungsremis möglich, dazu die Regel des Buches (C1.26).
 */
function ungleichfarbig(stellung: Stellung): { merkmale: Merkmal[]; felder: Bildfeld[] } {
  const getrennt = getrennteFreibauern(stellung);
  const zaehlen: Merkmal = { kennung: "laeufer.zaehlen", werte: {} };
  if (!getrennt)
    return { merkmale: [{ kennung: "laeufer.ungleich", werte: {} }, zaehlen], felder: [] };
  const [bauer, partner] = getrennt;
  return {
    merkmale: [{ kennung: "laeufer.ungleichGetrennt", werte: { bauer, partner } }, zaehlen],
    felder: [
      { feld: bauer, farbe: "gold" },
      { feld: partner, farbe: "gold" },
    ],
  };
}

/** Falscher Läufer: Randbauern einer Seite, deren Umwandlungsfeld der Läufer nicht erreicht. */
function falscherLaeufer(stellung: Stellung, farbe: Color): { m: Merkmal; f: Bildfeld } | null {
  const laeufer = stellung.brett[farbe].intersect(stellung.brett.bishop).first();
  const bauern = [...stellung.brett[farbe].intersect(stellung.brett.pawn)];
  if (laeufer === undefined || bauern.length === 0) return null;
  const randlinie = squareFile(bauern[0] as Square);
  const nurRand = bauern.every((b) => squareFile(b) === randlinie);
  if (!nurRand || (randlinie !== LINIE_A && randlinie !== LINIE_H)) return null;
  const ecke = (farbe === "white" ? LETZTE * 8 : 0) + randlinie;
  if (hell(ecke) === hell(laeufer)) return null;
  const koenig = stellung.brett.kingOf(gegner(farbe));
  const erreicht = koenig !== undefined && koenigsabstand(koenig, ecke) <= 1;
  return {
    m: {
      kennung: erreicht ? "laeufer.falsch" : "laeufer.falschFern",
      werte: { ecke },
      standard: erreicht,
    },
    f: { feld: ecke, farbe: erreicht ? "rot" : "gold" },
  };
}

/**
 * Läuferendspiele: gleich- oder ungleichfarbig, falscher Läufer.
 *
 * Beispiel: Abb. 9.35 (ungleichfarbig, ein Mehrbauer): Festungsremis möglich. Abb. 9.37 (zwei
 * getrennte Mehrbauern b5 und g5): meist gewonnen. Abb. 9.41: falscher Läufer, remis.
 */
export function laeuferendspiel(stellung: Stellung): Erkennungsbild {
  const merkmale: Merkmal[] = [];
  const felder: Bildfeld[] = [];
  const weiss = stellung.brett.white.intersect(stellung.brett.bishop).first();
  const schwarz = stellung.brett.black.intersect(stellung.brett.bishop).first();
  if (weiss !== undefined && schwarz !== undefined) {
    if (hell(weiss) === hell(schwarz)) merkmale.push({ kennung: "laeufer.gleich", werte: {} });
    else {
      const ungleich = ungleichfarbig(stellung);
      merkmale.push(...ungleich.merkmale);
      felder.push(...ungleich.felder);
    }
  }
  for (const farbe of ["white", "black"] as const) {
    const falsch = falscherLaeufer(stellung, farbe);
    if (!falsch) continue;
    merkmale.push(falsch.m);
    felder.push(falsch.f);
  }
  return {
    bild: "laeufer",
    art: merkmale.some((m) => m.standard) ? "E" : "N",
    seite: stellung.amZug,
    merkmale,
    felder,
  };
}

/** Auf welchen Flügeln stehen Bauern? */
function fluegel(stellung: Stellung): "beide" | "einer" | "keine" {
  let damen = false;
  let koenigs = false;
  for (const feld of stellung.brett.pawn) {
    if (squareFile(feld) <= DAMENFLUEGEL_BIS) damen = true;
    else koenigs = true;
  }
  return damen && koenigs ? "beide" : damen || koenigs ? "einer" : "keine";
}

/** Läufer gegen Springer: Bauern auf beiden Flügeln oder nur auf einem (Abb. 9.42). */
export function laeuferGegenSpringer(stellung: Stellung): Erkennungsbild {
  return {
    bild: "laeuferGegenSpringer",
    art: "E",
    seite: stellung.amZug,
    merkmale: [{ kennung: `laeuferGegenSpringer.${fluegel(stellung)}`, werte: {} }],
    felder: [],
  };
}

/** Turm gegen Läufer: In welcher Ecke steht der König der Läuferseite (Abb. 9.43, 9.44)? */
export function turmGegenLaeufer(stellung: Stellung, laeuferseite: Color): Erkennungsbild {
  const koenig = stellung.brett.kingOf(laeuferseite);
  const laeufer = stellung.brett[laeuferseite].intersect(stellung.brett.bishop).first();
  const ecken: Square[] = [0, LINIE_H, LETZTE * 8, LETZTE * 8 + LINIE_H];
  if (koenig === undefined || laeufer === undefined)
    return { bild: "turmGegenLaeufer", art: "N", seite: laeuferseite, merkmale: [], felder: [] };
  const naechste = ecken.reduce((a, b) =>
    koenigsabstand(koenig, b) < koenigsabstand(koenig, a) ? b : a,
  );
  const richtig = hell(naechste) !== hell(laeufer);
  const drin = koenigsabstand(koenig, naechste) <= 1;
  return {
    bild: "turmGegenLaeufer",
    art: drin ? "E" : "N",
    seite: laeuferseite,
    merkmale: [
      {
        kennung: richtig ? "turmGegenLaeufer.richtig" : "turmGegenLaeufer.falsch",
        werte: { ecke: naechste },
        standard: drin,
      },
    ],
    felder: [{ feld: naechste, farbe: richtig ? "gold" : "rot" }],
  };
}
