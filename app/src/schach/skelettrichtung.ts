/**
 * Leitfrage 3 des Skelett-Röntgens: Richtung. Ketten mit Basis und Richtung, Raum, Mehrheit und
 * Minderheit je Flügel, Hebel und Spannung.
 *
 * Rolle im Gesamtbild: Baustein für k5-richtung und k6-wo („Spiele dort, wohin deine Kette
 * zeigt“). Pflichtenheft 6.3: „Bauernketten mit Basis und Richtung, Raum je Seite, Mehrheit oder
 * Minderheit je Flügel, Hebel gegen die gegnerische Basis.“
 * Abhängigkeiten: bauernprofil.ts, chessops.
 * Buchbezug: Kapitel 5, „Leitfrage 3: Richtung“ (Abb. 5.24 bis 5.34).
 */
import { attacks } from "chessops/attacks";
import type { Board } from "chessops/board";
import { SquareSet } from "chessops/squareSet";
import type { Color, Square } from "chessops/types";
import { squareFile } from "chessops/util";
import {
  eigeneReihe,
  feldAusEigener,
  fluegelbauern,
  type Bauernkette,
  type Bauernprofil,
} from "./bauernprofil";
import { gegner } from "./stellung";

export type Fluegel = "damen" | "koenigs";

/** Linien a bis d gehören zum Damenflügel, e bis h zum Königsflügel. */
const ERSTE_KOENIGSLINIE = 4;
/** Die Zentrumslinien d und e. */
const ZENTRUMSLINIEN: readonly number[] = [3, 4];
const DAMENFLUEGEL: readonly number[] = [0, 1, 2, 3];
const KOENIGSFLUEGEL: readonly number[] = [4, 5, 6, 7];
/** Ab dieser eigenen Reihe (Index) steht ein Bauer in der gegnerischen Hälfte. */
const GEGNERISCHE_HAELFTE_AB = 4;
/** Bauern auf ihrer Startreihe (Index) dürfen zwei Felder ziehen. */
const STARTREIHE = 1;

/** Eine Kette mit der Richtung, in die sie zeigt (von der Basis zur Spitze). */
export interface Kettenrichtung {
  readonly kette: Bauernkette;
  /** null, wenn Basis und Spitze auf derselben Linie liegen (kommt bei Ketten nicht vor). */
  readonly zeigtNach: Fluegel | null;
}

/** Raum einer Seite: vorgerückte Bauern und die Felder, die sie dem Gegner nehmen. */
export interface Raum {
  /** Eigene Bauern in der gegnerischen Hälfte (ab der eigenen 5. Reihe). */
  readonly vorgerueckt: readonly Square[];
  /** Felder in der gegnerischen Hälfte, die eigene Bauern angreifen. */
  readonly genommen: readonly Square[];
  /** Davon je Flügel. */
  readonly jeFluegel: Readonly<Record<Fluegel, number>>;
}

/** Zahlenverhältnis der Bauern auf einem Flügel. */
export interface Fluegelverhaeltnis {
  readonly fluegel: Fluegel;
  readonly eigene: number;
  readonly gegnerische: number;
}

/** Ein Hebel: ein Bauernzug, nach dem der Bauer einen gegnerischen Bauern angreift. */
export interface Hebel {
  readonly von: Square;
  readonly nach: Square;
  /** Wie viele Bauernzüge bis dorthin: 1, oder 2 beim Vorstoß der Minderheit (b2–b4–b5). */
  readonly zuege: 1 | 2;
  /** Gegnerische Bauern, die er dann angreift. */
  readonly trifft: readonly Square[];
  /** Trifft er die Basis einer gegnerischen Kette? */
  readonly gegenBasis: boolean;
  /** Frei: Der Weg ist leer. Sonst steht eine eigene Figur im Weg (Abb. 6.20: Sf6 vor f5). */
  readonly frei: boolean;
  /** Die eigene Figur, die zuerst im Weg steht, sonst null. */
  readonly imWeg: Square | null;
}

/** Die Antwort auf Leitfrage 3 für eine Seite. */
export interface Richtungsbefund {
  readonly farbe: Color;
  readonly ketten: readonly Kettenrichtung[];
  readonly raum: Raum;
  readonly mehrheiten: readonly Fluegelverhaeltnis[];
  readonly minderheiten: readonly Fluegelverhaeltnis[];
  /** Bauern auf der d- und e-Linie beider Seiten (Abb. 6.5: „Mehrheit im Zentrum“). */
  readonly zentrum: { readonly eigene: number; readonly gegnerische: number };
  readonly hebel: readonly Hebel[];
  /** Paare eigener und gegnerischer Bauern, die einander schlagen könnten (Abb. 5.28). */
  readonly spannung: readonly { readonly eigen: Square; readonly gegnerisch: Square }[];
}

function fluegelVon(feld: Square): Fluegel {
  return squareFile(feld) < ERSTE_KOENIGSLINIE ? "damen" : "koenigs";
}

/** Richtung einer Kette: Pfeil von der Basis zur Spitze (Kapitel 5, Checkliste Leitfrage 3). */
function richtungVon(kette: Bauernkette): Kettenrichtung {
  const basis = kette.basis[0];
  if (basis === undefined || squareFile(basis) === squareFile(kette.spitze)) {
    return { kette, zeigtNach: null };
  }
  return { kette, zeigtNach: squareFile(kette.spitze) > squareFile(basis) ? "koenigs" : "damen" };
}

/** Raum: vorgerückte Bauern und die Felder in der gegnerischen Hälfte, die sie angreifen. */
function raumVon(brett: Board, farbe: Color): Raum {
  const bauern = [...brett.pawn.intersect(brett[farbe])];
  let genommen = SquareSet.empty();
  for (const bauer of bauern) {
    genommen = genommen.union(attacks({ role: "pawn", color: farbe }, bauer, SquareSet.empty()));
  }
  // Felder mit eigenen Figuren nimmt man dem Gegner nicht erst weg (Abb. 5.26: e5 nimmt d6 und f6).
  const inGegnerhaelfte = [...genommen.diff(brett[farbe])].filter(
    (f) => eigeneReihe(f, farbe) >= GEGNERISCHE_HAELFTE_AB,
  );
  return {
    vorgerueckt: bauern.filter((b) => eigeneReihe(b, farbe) >= GEGNERISCHE_HAELFTE_AB),
    genommen: inGegnerhaelfte,
    jeFluegel: {
      damen: inGegnerhaelfte.filter((f) => fluegelVon(f) === "damen").length,
      koenigs: inGegnerhaelfte.filter((f) => fluegelVon(f) === "koenigs").length,
    },
  };
}

/** Bauern je Flügel beider Seiten; Mehrheit, wenn mehr, Minderheit, wenn weniger (aber > 0). */
function verhaeltnisse(
  eigen: Bauernprofil,
  gegnerprofil: Bauernprofil,
): { mehrheiten: Fluegelverhaeltnis[]; minderheiten: Fluegelverhaeltnis[] } {
  const zaehle = (profil: Bauernprofil, andere: Bauernprofil, fluegel: Fluegel) =>
    fluegelbauern(
      fluegel === "damen" ? DAMENFLUEGEL : KOENIGSFLUEGEL,
      profil.jeLinie,
      andere.jeLinie,
      profil.farbe,
    ).length;
  const mehrheiten: Fluegelverhaeltnis[] = [];
  const minderheiten: Fluegelverhaeltnis[] = [];
  for (const fluegel of ["damen", "koenigs"] as const) {
    const eigene = zaehle(eigen, gegnerprofil, fluegel);
    const gegnerische = zaehle(gegnerprofil, eigen, fluegel);
    if (eigene > gegnerische) mehrheiten.push({ fluegel, eigene, gegnerische });
    if (eigene > 0 && eigene < gegnerische) minderheiten.push({ fluegel, eigene, gegnerische });
  }
  return { mehrheiten, minderheiten };
}

/** Die Felder, die ein Bauer in höchstens zwei Zügen erreicht, mit der Zahl der Züge. */
interface Vorstoss {
  readonly nach: Square;
  readonly zuege: 1 | 2;
  readonly imWeg: Square | null;
}

/**
 * Die Felder, die ein Bauer in einem oder zwei Zügen erreichen kann. Ein gegnerischer Stein
 * sperrt den Weg; eine eigene Figur nicht, sie muss nur Platz machen (Abb. 6.20: Sf6 vor f5).
 */
function vorstoesse(brett: Board, von: Square, farbe: Color): Vorstoss[] {
  const feind = gegner(farbe);
  const reihe = eigeneReihe(von, farbe);
  const felder: Vorstoss[] = [];
  let imWeg: Square | null = null;
  // Vom Startfeld sind zwei Felder ein Zug (Doppelschritt), das dritte der zweite Zug.
  const einZug = reihe === STARTREIHE ? 2 : 1;
  for (let schritt = 1; schritt <= einZug + 1; schritt += 1) {
    const nach = feldAusEigener(squareFile(von), reihe + schritt, farbe);
    if (nach === null || brett.get(nach)?.color === feind) break;
    if (imWeg === null && brett.get(nach) !== undefined) imWeg = nach;
    felder.push({ nach, zuege: schritt <= einZug ? 1 : 2, imWeg });
  }
  return felder;
}

/**
 * Hebel: Bauernzüge, nach denen der Bauer einen gegnerischen Bauern angreift; auch in zwei
 * Zügen (Abb. 5.32: der Minderheitsangriff b2–b4 und b4–b5 gegen c6). Steht eine eigene Figur
 * auf dem Zielfeld, ist der Hebel nur vorzubereiten (Abb. 6.20: „Der Springer f6 muss dem
 * f-Bauern Platz machen“). Je Bauer zählt der erste Hebel auf seinem Weg.
 */
function hebelVon(brett: Board, farbe: Color, basen: ReadonlySet<Square>): Hebel[] {
  const feind = gegner(farbe);
  const gegnerbauern = brett.pawn.intersect(brett[feind]);
  const hebel: Hebel[] = [];
  for (const von of brett.pawn.intersect(brett[farbe])) {
    for (const { nach, zuege, imWeg } of vorstoesse(brett, von, farbe)) {
      const trifft = [
        ...attacks({ role: "pawn", color: farbe }, nach, SquareSet.empty()).intersect(gegnerbauern),
      ];
      if (trifft.length === 0) continue;
      hebel.push({
        von,
        nach,
        zuege,
        trifft,
        gegenBasis: trifft.some((b) => basen.has(b)),
        frei: imWeg === null,
        imWeg,
      });
      break;
    }
  }
  return hebel;
}

/** Bauern auf der d- und e-Linie je Seite. */
function zentrumsbauern(profil: Bauernprofil): number {
  return ZENTRUMSLINIEN.reduce((summe, linie) => summe + (profil.jeLinie[linie]?.length ?? 0), 0);
}

/** Eigene und gegnerische Bauern, die einander schlagen könnten (Spannung, Abb. 5.28). */
function spannungVon(brett: Board, farbe: Color): { eigen: Square; gegnerisch: Square }[] {
  const feind = gegner(farbe);
  const paare: { eigen: Square; gegnerisch: Square }[] = [];
  for (const eigen of brett.pawn.intersect(brett[farbe])) {
    const ziele = attacks({ role: "pawn", color: farbe }, eigen, SquareSet.empty());
    for (const gegnerisch of ziele.intersect(brett.pawn.intersect(brett[feind]))) {
      paare.push({ eigen, gegnerisch });
    }
  }
  return paare;
}

/**
 * Die Antwort auf Leitfrage 3 für eine Seite.
 *
 * Eingaben: Brett, Farbe, Bauernprofile beider Seiten. Ausgabe: Richtungsbefund.
 * Beispiel: Abb. 5.26 (Vorstoßvariante), Weiß: Kette d4–e5 zeigt zum Königsflügel, Raum dort
 * (e5 nimmt d6 und f6). Schwarz: Kette e6–d5 zeigt zum Damenflügel. Abb. 5.32 (Carlsbad),
 * Weiß: Minderheit am Damenflügel (2 gegen 3), Hebel b2–b4 … Abb. 6.20: Hebel c4–c5 gegen die
 * Basis d6, ...f5 gegen die Basis e4 (nicht frei: Springer f6).
 */
export function richtungsbefund(
  brett: Board,
  farbe: Color,
  profile: { readonly eigen: Bauernprofil; readonly gegner: Bauernprofil },
): Richtungsbefund {
  const basen = new Set(profile.gegner.ketten.flatMap((k) => k.basis));
  const { mehrheiten, minderheiten } = verhaeltnisse(profile.eigen, profile.gegner);
  return {
    farbe,
    ketten: profile.eigen.ketten.map(richtungVon),
    raum: raumVon(brett, farbe),
    mehrheiten,
    minderheiten,
    zentrum: {
      eigene: zentrumsbauern(profile.eigen),
      gegnerische: zentrumsbauern(profile.gegner),
    },
    hebel: hebelVon(brett, farbe, basen),
    spannung: spannungVon(brett, farbe),
  };
}

/** Der Flügel eines Feldes (a bis d Damenflügel, e bis h Königsflügel), für Texte und Tests. */
export { fluegelVon };
