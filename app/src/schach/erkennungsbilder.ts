/**
 * Erkennungsbilder der Endspiel-Vertiefung: Welches Bild der Rückblick-Tabelle von Kapitel 9
 * steht auf dem Brett, und welche Merkmale des Buches treffen zu?
 *
 * Rolle im Gesamtbild: Baustein für k9-erkennungsbilder. Pflichtenheft 6.3, Kapitel 9:
 * „Erkennungsbilder Philidor, Lucena, Vancura: E bei Standardnähe, sonst N“.
 * Abhängigkeiten: chessops, turmendspiel.ts, laeuferbilder.ts (Bilder mit Läufer),
 * bauernprofil.ts, koenigsweg.ts, stellung.ts.
 * Buchbezug: Kapitel 9, „Rückblick: die Erkennungsbilder“ (Tabelle mit Bild, Erkennungsfrage und
 * Plan), Philidor (Abb. 9.3, 9.4), kurze Seite (9.5), Lucena (9.8), Vancura (9.15), Turm gegen
 * Bauer (9.18 bis 9.22), Mehrbauern (9.23 bis 9.27), Dame gegen Bauer (9.28 bis 9.33), Läufer
 * und Springer (9.35 bis 9.42), Turm gegen Läufer (9.43, 9.44).
 */
import type { Color, Role, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import { eigeneReihe } from "./bauernprofil";
import { bauernschwaechen } from "./bauernschwaechen";
import { koenigsabstand } from "./koenigsweg";
import { gegner, type Stellung } from "./stellung";
import { laeuferendspiel, laeuferGegenSpringer, turmGegenLaeufer } from "./laeuferbilder";
import {
  philidorMoeglich,
  philidorTurmRichtig,
  SCHACHDISTANZ_LINIEN,
  turmlage,
  vorDemBauern,
  type Turmlage,
} from "./turmendspiel";

/** Die Bilder der Tabelle des Buches. */
export type Bildname =
  | "philidor"
  | "kurzeSeite"
  | "lucena"
  | "vancura"
  | "turmGegenBauer"
  | "mehrbauern"
  | "dameGegenBauer"
  | "dameGegenDame"
  | "laeufer"
  | "springer"
  | "laeuferGegenSpringer"
  | "turmGegenLaeufer";

/** Ein Merkmal des Bildes mit Textschlüssel-Endung und Werten. */
export interface Merkmal {
  readonly kennung: string;
  readonly werte: Readonly<Record<string, string | number>>;
  /** Trifft die Standardstellung des Buches zu (E), oder nur das Bild (N)? */
  readonly standard?: boolean;
}

/** Ein Feld zum Markieren: gold gut, rot Gefahr, grau Linie. */
export interface Bildfeld {
  readonly feld: Square;
  readonly farbe: "gold" | "rot" | "grau";
}

/** Ein erkanntes Bild. */
export interface Erkennungsbild {
  readonly bild: Bildname;
  /** E, wenn die Standardstellung des Buches erreicht ist, sonst N. */
  readonly art: "E" | "N";
  /** Die Seite, der der Plan des Buches gilt. */
  readonly seite: Color;
  readonly merkmale: readonly Merkmal[];
  readonly felder: readonly Bildfeld[];
}

/** Figuren einer Seite außer dem König, gezählt je Rolle. */
type Zaehlung = Readonly<Record<Role, number>>;

function zaehle(stellung: Stellung, farbe: Color): Zaehlung {
  const z: Record<Role, number> = { pawn: 0, knight: 0, bishop: 0, rook: 0, queen: 0, king: 0 };
  for (const feld of stellung.brett[farbe]) {
    const figur = stellung.brett.get(feld);
    if (figur) z[figur.role] += 1;
  }
  return z;
}

/** Hat die Seite genau diese Figuren (außer König)? */
function genau(z: Zaehlung, soll: Partial<Record<Role, number>>): boolean {
  return (["pawn", "knight", "bishop", "rook", "queen"] as const).every(
    (rolle) => z[rolle] === (soll[rolle] ?? 0),
  );
}

const LETZTE = 7;
const SIEBTE = 6;
const SECHSTE = 5;
const LINIE_A = 0;
const LINIE_H = 7;
const LAEUFERLINIEN: readonly number[] = [2, 5];

/** Turm und Bauer gegen Turm: Lucena, Philidor, Vancura oder kurze Seite. */
function turmUndBauer(lage: Turmlage): Erkennungsbild {
  const { angreifer, bauer, koenigAngreifer, koenigVerteidiger, turmAngreifer, turmVerteidiger } =
    lage;
  const verteidiger = gegner(angreifer);
  const reihe = eigeneReihe(bauer, angreifer);
  const randbauer = squareFile(bauer) === LINIE_A || squareFile(bauer) === LINIE_H;
  if (
    reihe === SIEBTE &&
    koenigAngreifer === lage.umwandlungsfeld &&
    !vorDemBauern(koenigVerteidiger, bauer, angreifer)
  ) {
    const linien = Math.abs(squareFile(koenigVerteidiger) - squareFile(bauer));
    const standard = lage.abschneiden !== null && lage.abschneiden.richtung === "linie";
    return {
      bild: "lucena",
      art: standard ? "E" : "N",
      seite: angreifer,
      merkmale: [{ kennung: "lucena.lage", werte: { linien }, standard }],
      felder: [{ feld: koenigAngreifer, farbe: "rot" }],
    };
  }
  if (
    randbauer &&
    reihe >= SECHSTE &&
    turmAngreifer !== null &&
    vorDemBauern(turmAngreifer, bauer, angreifer)
  ) {
    const seitlich = turmVerteidiger !== null && squareRank(turmVerteidiger) === squareRank(bauer);
    const wartefelder = squareFile(bauer) === LINIE_A ? ["g", "h"] : ["a", "b"];
    const koenigRichtig =
      wartefelder.includes("abcdefgh"[squareFile(koenigVerteidiger)] ?? "") &&
      eigeneReihe(koenigVerteidiger, angreifer) === SIEBTE;
    return {
      bild: "vancura",
      art: seitlich && koenigRichtig ? "E" : "N",
      seite: verteidiger,
      merkmale: [
        { kennung: "vancura.turm", werte: {}, standard: seitlich },
        {
          kennung: "vancura.koenig",
          werte: { felder: wartefelder.map((l) => `${l}7`).join("/") },
          standard: koenigRichtig,
        },
      ],
      felder: [{ feld: bauer, farbe: "rot" }],
    };
  }
  // Philidor nur, solange der angreifende König nicht schon vor dem Bauern steht (Übung 9.46).
  if (philidorMoeglich(lage)) {
    const sperrreihe = reihe + 1;
    const standard = philidorTurmRichtig(lage);
    return {
      bild: "philidor",
      art: standard ? "E" : "N",
      seite: verteidiger,
      merkmale: [
        {
          kennung: reihe < SECHSTE ? "philidor.sperren" : "philidor.hinten",
          werte: { reihe: reihe < SECHSTE ? sperrreihe + 1 : reihe + 1 },
          standard,
        },
      ],
      felder: [{ feld: koenigVerteidiger, farbe: "grau" }],
    };
  }
  const { seiten, schachdistanz } = lage;
  const koenigKurz = seiten.koenigAuf === "kurz" || seiten.koenigAuf === "gleich";
  const turmLang = seiten.turmAuf === "lang" || seiten.turmAuf === "gleich";
  const reicht = schachdistanz?.reicht ?? false;
  return {
    bild: "kurzeSeite",
    art: koenigKurz && turmLang && reicht ? "E" : "N",
    seite: verteidiger,
    merkmale: [
      { kennung: "kurzeSeite.koenig", werte: {}, standard: koenigKurz },
      {
        kennung: "kurzeSeite.turm",
        werte: { linien: schachdistanz?.linien ?? 0, soll: SCHACHDISTANZ_LINIEN },
        standard: turmLang && reicht,
      },
    ],
    felder: [{ feld: koenigVerteidiger, farbe: koenigKurz ? "gold" : "rot" }],
  };
}

/** Turm gegen Bauer: abgeschnitten, Rennen der Könige, Unterverwandlung. */
function turmGegenBauer(stellung: Stellung, lage: Turmlage): Erkennungsbild {
  const merkmale: Merkmal[] = [];
  const bauern = [...stellung.brett[lage.angreifer].intersect(stellung.brett.pawn)];
  if (
    bauern.length === 2 &&
    Math.abs(squareFile(bauern[0] as Square) - squareFile(bauern[1] as Square)) === 1 &&
    bauern.every((b) => eigeneReihe(b, lage.angreifer) >= SECHSTE)
  ) {
    merkmale.push({ kennung: "turmGegenBauer.zweiVerbundene", werte: {} });
  }
  const schritte = LETZTE - eigeneReihe(lage.bauer, lage.angreifer);
  const abstandAngreifer = koenigsabstand(lage.koenigAngreifer, lage.bauer);
  const abstandVerteidiger = koenigsabstand(lage.koenigVerteidiger, lage.umwandlungsfeld);
  return {
    bild: "turmGegenBauer",
    art: "N",
    seite: gegner(lage.angreifer),
    merkmale: [
      ...merkmale,
      {
        kennung: lage.abschneiden ? "turmGegenBauer.abgeschnitten" : "turmGegenBauer.frei",
        werte: { dazwischen: lage.abschneiden?.dazwischen ?? 0 },
      },
      {
        kennung: "turmGegenBauer.rennen",
        werte: { schritte, angreifer: abstandAngreifer, verteidiger: abstandVerteidiger },
      },
    ],
    felder: [{ feld: lage.bauer, farbe: "rot" }],
  };
}

/** Turmendspiel mit mehreren Bauern: Turm hinter dem Freibauern? */
function mehrbauern(stellung: Stellung): Erkennungsbild {
  const merkmale: Merkmal[] = [];
  const felder: Bildfeld[] = [];
  for (const farbe of ["white", "black"] as const) {
    for (const frei of bauernschwaechen(stellung.brett, farbe).freibauern) {
      for (const turm of stellung.brett.rook) {
        const eigener = stellung.brett.get(turm)?.color === farbe;
        if (squareFile(turm) !== squareFile(frei.feld)) continue;
        const hinter = eigeneReihe(turm, farbe) < eigeneReihe(frei.feld, farbe);
        if (!hinter) continue;
        merkmale.push({
          kennung: eigener ? "mehrbauern.hinterEigen" : "mehrbauern.hinterFremd",
          werte: { turm: turm, bauer: frei.feld },
        });
        felder.push({ feld: turm, farbe: eigener ? "gold" : "rot" });
      }
    }
  }
  if (merkmale.length === 0) merkmale.push({ kennung: "mehrbauern.keiner", werte: {} });
  return { bild: "mehrbauern", art: "N", seite: stellung.amZug, merkmale, felder };
}

/** Dame gegen Bauer: Läufer- oder Randbauer, droht Patt nach dem Schlag? */
function dameGegenBauer(stellung: Stellung, dame: Color): Erkennungsbild {
  const bauer = stellung.brett[gegner(dame)].intersect(stellung.brett.pawn).first();
  if (bauer === undefined)
    return { bild: "dameGegenBauer", art: "N", seite: dame, merkmale: [], felder: [] };
  const linie = squareFile(bauer);
  const remisbauer = LAEUFERLINIEN.includes(linie) || linie === LINIE_A || linie === LINIE_H;
  const art = LAEUFERLINIEN.includes(linie)
    ? "laeufer"
    : linie === LINIE_A || linie === LINIE_H
      ? "rand"
      : "mitte";
  const merkmale: Merkmal[] = [{ kennung: `dameGegenBauer.${art}`, werte: { bauer } }];
  const regeln = stellung.regeln;
  if (regeln && stellung.amZug === dame) {
    const damenfeld = stellung.brett[dame].intersect(stellung.brett.queen).first();
    if (damenfeld !== undefined && regeln.dests(damenfeld).has(bauer)) {
      const danach = regeln.clone();
      danach.play({ from: damenfeld, to: bauer });
      merkmale.push({
        kennung: danach.isStalemate()
          ? "dameGegenBauer.pattNachSchlag"
          : "dameGegenBauer.schlagGeht",
        werte: { bauer },
      });
    }
  }
  return {
    bild: "dameGegenBauer",
    art: "E",
    seite: dame,
    merkmale,
    felder: [{ feld: bauer, farbe: remisbauer ? "rot" : "gold" }],
  };
}

/**
 * Erkennt das Bild der Tabelle, von oben nach unten, bis eines passt.
 *
 * Eingabe: Stellung, bevorzugte Seite (für die Wahl des Angreifers bei Turmendspielen).
 * Ausgabe: das Bild mit Merkmalen oder null, wenn keines passt (kein Endspiel der Tabelle).
 * Beispiel: Abb. 9.3 → Philidor (E), Abb. 9.8 → Lucena (E), Abb. 9.15 → Vancura (E),
 * Abb. 9.31 → Dame gegen Läuferbauer, Abb. 9.43 → Turm gegen Läufer, richtige Ecke.
 */
export function erkennungsbild(stellung: Stellung, bevorzugt: Color): Erkennungsbild | null {
  const w = zaehle(stellung, "white");
  const s = zaehle(stellung, "black");
  const turmUndBauerGegenTurm =
    (genau(w, { rook: 1, pawn: 1 }) && genau(s, { rook: 1 })) ||
    (genau(s, { rook: 1, pawn: 1 }) && genau(w, { rook: 1 }));
  const nurBauern = (z: Zaehlung) => genau(z, { pawn: z.pawn }) && z.pawn >= 1 && z.pawn <= 2;
  const turmGegenBauerAllein =
    (genau(w, { rook: 1 }) && nurBauern(s)) || (genau(s, { rook: 1 }) && nurBauern(w));
  const lage = turmlage(stellung, bevorzugt);
  if (turmUndBauerGegenTurm && lage) return turmUndBauer(lage);
  if (turmGegenBauerAllein && lage) return turmGegenBauer(stellung, lage);
  if (
    w.rook === 1 &&
    s.rook === 1 &&
    w.queen + s.queen + w.bishop + s.bishop + w.knight + s.knight === 0 &&
    w.pawn + s.pawn > 0
  ) {
    return mehrbauern(stellung);
  }
  if (genau(w, { queen: 1 }) && genau(s, { pawn: 1 })) return dameGegenBauer(stellung, "white");
  if (genau(s, { queen: 1 }) && genau(w, { pawn: 1 })) return dameGegenBauer(stellung, "black");
  if (
    w.queen === 1 &&
    s.queen === 1 &&
    w.rook + s.rook + w.bishop + s.bishop + w.knight + s.knight === 0
  ) {
    return {
      bild: "dameGegenDame",
      art: "N",
      seite: stellung.amZug,
      merkmale: [],
      felder: [],
    };
  }
  if (genau(w, { rook: 1 }) && genau(s, { bishop: 1 })) return turmGegenLaeufer(stellung, "black");
  if (genau(s, { rook: 1 }) && genau(w, { bishop: 1 })) return turmGegenLaeufer(stellung, "white");
  const leicht = w.rook + s.rook + w.queen + s.queen === 0;
  if (leicht && w.bishop === 1 && s.bishop === 1 && w.knight + s.knight === 0)
    return laeuferendspiel(stellung);
  if (
    leicht &&
    ((w.bishop === 1 && s.knight === 1) || (w.knight === 1 && s.bishop === 1)) &&
    w.bishop + s.bishop === 1
  ) {
    return laeuferGegenSpringer(stellung);
  }
  if (leicht && w.bishop + s.bishop <= 1 && w.knight + s.knight >= 1 && w.bishop + s.bishop === 0) {
    return {
      bild: "springer",
      art: "N",
      seite: stellung.amZug,
      merkmale: [{ kennung: "springer.tempi", werte: {} }],
      felder: [],
    };
  }
  if (leicht && w.bishop + s.bishop >= 1 && w.knight + s.knight === 0)
    return laeuferendspiel(stellung);
  return null;
}
