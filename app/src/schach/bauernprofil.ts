/**
 * Bauernprofil: Bauern je Linie, Inseln, Ketten mit Basis, Duos, offene und halboffene Linien,
 * Löcher und starke Felder, Mehrheiten mit Kandidat.
 *
 * Rolle im Gesamtbild: Baustein „Bauernprofil“ des Stellungsprofils (Konzept 7.2), Grundlage der
 * Zielbilanz (Kapitel 2), des Skelett-Röntgens (Kapitel 5) und der Endspielregeln (Kapitel 8).
 * Die Bauernschwächen (Doppelbauern, Isolani, rückständig, Freibauer, Deckungstest) stehen in
 * bauernschwaechen.ts.
 * Abhängigkeiten: chessops, stellung.ts.
 * Buchbezug: Kapitel 5, Leitfragen 1 bis 3; Glossar (Bauerninseln, Bauernkette, Bauernduo,
 * Offene Linie, Halboffene Linie, Loch, Starkes Feld, Bauernmehrheit, Kandidat).
 */
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { squareFile, squareFromCoords, squareRank } from "chessops/util";
import { gegner } from "./stellung";

/** Anzahl der Linien und Reihen. */
const LINIEN = 8;
const REIHEN = 8;
/** Die Zentrumslinien d und e (Glossar „Bauernduo“: etwa d4 und e4). */
const ZENTRUMSLINIEN: readonly number[] = [3, 4];
/** Damenflügel a bis d, Königsflügel e bis h (Kapitel 5, Berliner Endspiel: „vier gegen drei“). */
const DAMENFLUEGEL: readonly number[] = [0, 1, 2, 3];
const KOENIGSFLUEGEL: readonly number[] = [4, 5, 6, 7];
/** Löcher werden auf den eigenen Reihen 3 bis 6 gesucht (Abb. 5.6: h6; Abb. 5.8: d5). */
const LOCHREIHEN_VON = 2;
const LOCHREIHEN_BIS = 5;
/**
 * Starke Felder liegen auf der 4. bis 6. Reihe aus eigener Sicht (Festlegung des Autors, P3,
 * 23.10.2026: „Feld in der gegnerischen Hälfte (4.–6. Reihe), das der Gegner nicht mehr mit
 * Bauern angreifen kann“; Abb. 11.43: d4 und c5 sind sichere Felder für Weiß).
 */
const STARKE_REIHEN_VON = 3;
const STARKE_REIHEN_BIS = 5;

/** Eine Bauernkette: Glieder von der Basis zur Spitze, dazu die Stützen von außerhalb. */
export interface Bauernkette {
  readonly glieder: readonly Square[];
  /** Die hintersten Glieder, die kein Bauer der Kette deckt. */
  readonly basis: readonly Square[];
  /** Das vorderste Glied. */
  readonly spitze: Square;
  /** Eigene Bauern außerhalb der Kette, die die Basis decken (Abb. 5.25: c3 vor 6... cxd4). */
  readonly stuetzen: readonly Square[];
}

/** Eine Bauernmehrheit auf einem Flügel. */
export interface Mehrheit {
  readonly fluegel: "damen" | "koenigs";
  readonly eigene: number;
  readonly gegnerische: number;
  /** Der Bauer, vor dem auf seiner Linie kein gegnerischer Bauer steht (Kandidatenregel). */
  readonly kandidat: Square | null;
}

/** Das Bauernprofil einer Farbe. */
export interface Bauernprofil {
  readonly farbe: Color;
  readonly bauern: readonly Square[];
  /** Je Linie a bis h die eigenen Bauern, von hinten nach vorn. */
  readonly jeLinie: readonly (readonly Square[])[];
  /** Bauerninseln als Gruppen von Linien (0 = a). */
  readonly inseln: readonly (readonly number[])[];
  readonly ketten: readonly Bauernkette[];
  /** Zwei eigene Bauern nebeneinander; `imZentrum` für d- und e-Bauern (Glossar). */
  readonly duos: readonly {
    readonly felder: readonly [Square, Square];
    readonly imZentrum: boolean;
  }[];
  /** Linien ohne Bauern beider Farben. */
  readonly offeneLinien: readonly number[];
  /** Linien, auf denen nur noch gegnerische Bauern stehen: halboffen für diese Farbe. */
  readonly halboffeneLinien: readonly number[];
  /**
   * Löcher: Felder, die kein eigener Bauer je wieder kontrollieren kann (schwache Felder im
   * Sinne des Oberbegriffs; eigene Reihen 3 bis 6). Für den Gegner Nistplätze seiner Figuren.
   */
  readonly loecher: readonly Square[];
  /** Löcher des Gegners auf der eigenen 4. bis 6. Reihe: starke Felder. */
  readonly starkeFelder: readonly Square[];
  readonly mehrheiten: readonly Mehrheit[];
}

/** Reihe aus Sicht der Farbe: 0 ist die eigene Grundreihe. */
export function eigeneReihe(feld: Square, farbe: Color): number {
  return farbe === "white" ? squareRank(feld) : REIHEN - 1 - squareRank(feld);
}

/**
 * Ordnet Felder wie das Buch sie nennt: von der eigenen Grundreihe nach vorn, dann von a nach h
 * (Abb. 5.15: „die Doppelbauern c7 und c6“, Abb. 5.34: „a7“ vor „c6“).
 */
export function vonHinten(felder: readonly Square[], farbe: Color): Square[] {
  return [...felder].sort(
    (a, b) => eigeneReihe(a, farbe) - eigeneReihe(b, farbe) || squareFile(a) - squareFile(b),
  );
}

/** Feld aus Linie und eigener Reihe, oder null außerhalb des Bretts. */
export function feldAusEigener(linie: number, reihe: number, farbe: Color): Square | null {
  const echteReihe = farbe === "white" ? reihe : REIHEN - 1 - reihe;
  return squareFromCoords(linie, echteReihe) ?? null;
}

/** Bauern einer Farbe je Linie, von hinten nach vorn sortiert. */
export function bauernJeLinie(brett: Board, farbe: Color): Square[][] {
  const linien: Square[][] = Array.from({ length: LINIEN }, () => []);
  for (const feld of brett.pawn.intersect(brett[farbe])) {
    linien[squareFile(feld)]?.push(feld);
  }
  for (const linie of linien) {
    linie.sort((a, b) => eigeneReihe(a, farbe) - eigeneReihe(b, farbe));
  }
  return linien;
}

/** Zusammenhängende Gruppen von Linien mit eigenen Bauern (Glossar „Bauerninseln“). */
function inselnAus(jeLinie: readonly (readonly Square[])[]): number[][] {
  const inseln: number[][] = [];
  let aktuelle: number[] = [];
  jeLinie.forEach((bauern, linie) => {
    if (bauern.length > 0) {
      aktuelle.push(linie);
    } else if (aktuelle.length > 0) {
      inseln.push(aktuelle);
      aktuelle = [];
    }
  });
  if (aktuelle.length > 0) inseln.push(aktuelle);
  return inseln;
}

/** Die beiden Felder, die ein Bauer der Farbe von diesem Feld aus deckt. */
export function gedeckteFelder(feld: Square, farbe: Color): Square[] {
  const reihe = eigeneReihe(feld, farbe) + 1;
  return [-1, 1].flatMap((seite) => {
    const ziel = feldAusEigener(squareFile(feld) + seite, reihe, farbe);
    return ziel === null ? [] : [ziel];
  });
}

/** Ob ein eigener Bauer das Feld jetzt deckt. */
export function vonBauerGedeckt(brett: Board, feld: Square, farbe: Color): boolean {
  const reihe = eigeneReihe(feld, farbe) - 1;
  return [-1, 1].some((seite) => {
    const hinten = feldAusEigener(squareFile(feld) + seite, reihe, farbe);
    return hinten !== null && brett.pawn.intersect(brett[farbe]).has(hinten);
  });
}

/** Ob dem Bauern ein gegnerischer Bauer direkt gegenübersteht (er ist blockiert). */
function blockiert(brett: Board, feld: Square, farbe: Color): boolean {
  const vorn = feldAusEigener(squareFile(feld), eigeneReihe(feld, farbe) + 1, farbe);
  return vorn !== null && brett.pawn.intersect(brett[gegner(farbe)]).has(vorn);
}

/**
 * Bauernketten: blockierte Bauern, die schräg hintereinander stehen und einander decken.
 *
 * Regel: Kapitel 5, „Bauernketten und ihre Basis“: Nachbarn, die keinem gegnerischen Bauern
 * fest gegenüberstehen, gehören nicht zur Kette; sie stützen die Basis nur von außen.
 * Beispiel: Französische Vorstoßvariante: weiße Kette d4–e5 (Basis d4, Spitze e5, Stütze c3),
 * schwarze Kette e6–d5 (Basis e6, Spitze d5, Stütze f7).
 */
function kettenAus(brett: Board, bauern: readonly Square[], farbe: Color): Bauernkette[] {
  const glieder = new Set(bauern.filter((feld) => blockiert(brett, feld, farbe)));
  const besucht = new Set<Square>();
  const ketten: Bauernkette[] = [];
  for (const start of glieder) {
    if (besucht.has(start)) continue;
    const kette: Square[] = [];
    const offen = [start];
    while (offen.length > 0) {
      const feld = offen.pop();
      if (feld === undefined || besucht.has(feld)) continue;
      besucht.add(feld);
      kette.push(feld);
      const nachbarn = [...gedeckteFelder(feld, farbe), ...deckerVon(feld, farbe)];
      offen.push(...nachbarn.filter((n) => glieder.has(n) && !besucht.has(n)));
    }
    if (kette.length < 2) continue;
    kette.sort((a, b) => eigeneReihe(a, farbe) - eigeneReihe(b, farbe));
    const basis = kette.filter((feld) => !deckerVon(feld, farbe).some((d) => glieder.has(d)));
    const stuetzen = basis.flatMap((feld) =>
      deckerVon(feld, farbe).filter((d) => bauern.includes(d) && !glieder.has(d)),
    );
    const spitze = kette[kette.length - 1];
    // Verzweigt sich die Kette (zwei Basen wie d6–e5–f6 oder zwei Spitzen wie d5–e4–f5), liest
    // man sie von Linie zu Linie; nach Reihen sortiert stünde „d6–f6–e5“ da (Befund aus P4,
    // Abb. 6.11).
    const verzweigt = new Set(kette.map((feld) => eigeneReihe(feld, farbe))).size < kette.length;
    if (verzweigt) kette.sort((a, b) => squareFile(a) - squareFile(b));
    if (spitze !== undefined) ketten.push({ glieder: kette, basis, spitze, stuetzen });
  }
  return ketten;
}

/** Die beiden Felder, von denen aus ein eigener Bauer dieses Feld decken würde. */
function deckerVon(feld: Square, farbe: Color): Square[] {
  const reihe = eigeneReihe(feld, farbe) - 1;
  return [-1, 1].flatMap((seite) => {
    const hinten = feldAusEigener(squareFile(feld) + seite, reihe, farbe);
    return hinten === null ? [] : [hinten];
  });
}

/** Zwei eigene Bauern nebeneinander auf derselben Reihe (Glossar „Bauernduo“). */
function duosAus(
  bauern: readonly Square[],
): { felder: readonly [Square, Square]; imZentrum: boolean }[] {
  const menge = new Set(bauern);
  return bauern.flatMap((feld) => {
    const rechts = squareFromCoords(squareFile(feld) + 1, squareRank(feld));
    if (rechts === undefined || !menge.has(rechts)) return [];
    const imZentrum =
      ZENTRUMSLINIEN.includes(squareFile(feld)) && ZENTRUMSLINIEN.includes(squareFile(rechts));
    return [{ felder: [feld, rechts] as const, imZentrum }];
  });
}

/**
 * Löcher: Felder, die kein eigener Bauer je wieder kontrollieren kann.
 *
 * Regel: Kapitel 5, Leitfrage 1, und Festlegung des Autors (P3, 23.10.2026): Ein Bauernloch ist
 * ein Feld (meist 3. bis 5. Reihe aus eigener Sicht), das nie wieder von eigenen Bauern
 * kontrolliert werden kann: Auf den beiden Nachbarlinien steht kein eigener Bauer mehr hinter
 * ihm (Abb. 5.6: Nach ...g6 kann kein schwarzer Bauer h6 mehr decken; f6 deckt noch e7).
 * Geprüft werden die eigenen Reihen 3 bis 6; k5-felder nennt davon die Reihen 3 bis 5.
 */
function loecherAus(jeLinie: readonly (readonly Square[])[], farbe: Color): Square[] {
  const loecher: Square[] = [];
  for (let reihe = LOCHREIHEN_VON; reihe <= LOCHREIHEN_BIS; reihe += 1) {
    for (let linie = 0; linie < LINIEN; linie += 1) {
      const kannDecken = [linie - 1, linie + 1].some((nachbar) =>
        (jeLinie[nachbar] ?? []).some((bauer) => eigeneReihe(bauer, farbe) < reihe),
      );
      const feld = feldAusEigener(linie, reihe, farbe);
      if (!kannDecken && feld !== null) loecher.push(feld);
    }
  }
  return loecher;
}

/** Mehrheit auf einem Flügel mit Kandidat (Kapitel 5, „Bauernmehrheiten“). */
/**
 * Die Bauern einer Seite, die auf einem Flügel mitzählen.
 *
 * Regel der App, am Buch geeicht: Die Flügel sind a bis d und e bis h (Abb. 5.29, 5.30:
 * „Weiß hat am Königsflügel vier Bauern gegen drei“, der Bauer e5 zählt mit). Ein Bauer auf der
 * d- oder e-Linie zählt aber nicht, wenn ihm ein gegnerischer Bauer direkt gegenübersteht
 * (Abb. 5.32, Carlsbad: „Minderheit am Damenflügel (2 gegen 3)“ ohne d4 und d5) oder wenn er
 * ein Freibauer ist (Abb. 11.43: „Mehrheit am Damenflügel (a2 und b2 gegen a6)“ ohne d5).
 */
export function fluegelbauern(
  linien: readonly number[],
  eigene: readonly (readonly Square[])[],
  gegnerische: readonly (readonly Square[])[],
  farbe: Color,
): Square[] {
  const gegnerBauern = gegnerische.flat();
  return linien
    .flatMap((linie) => eigene[linie] ?? [])
    .filter((bauer) => {
      if (!ZENTRUMSLINIEN.includes(squareFile(bauer))) return true;
      const reihe = eigeneReihe(bauer, farbe);
      const verkeilt = (gegnerische[squareFile(bauer)] ?? []).some(
        (g) => eigeneReihe(g, farbe) === reihe + 1,
      );
      const frei = !gegnerBauern.some(
        (g) => Math.abs(squareFile(g) - squareFile(bauer)) <= 1 && eigeneReihe(g, farbe) > reihe,
      );
      return !verkeilt && !frei;
    });
}

function mehrheitAuf(
  fluegel: "damen" | "koenigs",
  linien: readonly number[],
  eigene: readonly (readonly Square[])[],
  gegnerische: readonly (readonly Square[])[],
  farbe: Color,
): Mehrheit | null {
  const anzahlEigene = fluegelbauern(linien, eigene, gegnerische, farbe).length;
  const anzahlGegner = fluegelbauern(linien, gegnerische, eigene, gegner(farbe)).length;
  if (anzahlEigene <= anzahlGegner) return null;
  const kandidat =
    linien
      .filter((linie) => (eigene[linie]?.length ?? 0) > 0)
      .map((linie) => {
        const vorderster = eigene[linie]?.[eigene[linie].length - 1];
        if (vorderster === undefined) return null;
        const frei = !(gegnerische[linie] ?? []).some(
          (gegnerBauer) => eigeneReihe(gegnerBauer, farbe) > eigeneReihe(vorderster, farbe),
        );
        return frei ? vorderster : null;
      })
      .find((feld) => feld !== null) ?? null;
  return { fluegel, eigene: anzahlEigene, gegnerische: anzahlGegner, kandidat };
}

/**
 * Das Bauernprofil einer Farbe.
 *
 * Eingaben: Brett, Farbe. Ausgabe: siehe Bauernprofil.
 * Beispiel: Abb. 5.17 (Isolani d4): Weiß hat drei Inseln (a–b, d, f–h), Schwarz zwei.
 * Abb. 5.8 (Najdorf nach 8... O-O): Das Loch d5 ist für Weiß ein starkes Feld.
 */
export function bauernprofil(brett: Board, farbe: Color): Bauernprofil {
  const jeLinie = bauernJeLinie(brett, farbe);
  const gegnerische = bauernJeLinie(brett, gegner(farbe));
  const bauern = jeLinie.flat();
  const linienMitEigenen = (linie: readonly Square[]) => linie.length > 0;
  const loecher = loecherAus(jeLinie, farbe);
  const loecherGegner = loecherAus(gegnerische, gegner(farbe));
  const starkeFelder = loecherGegner.filter((feld) => {
    const reihe = eigeneReihe(feld, farbe);
    return reihe >= STARKE_REIHEN_VON && reihe <= STARKE_REIHEN_BIS;
  });
  const mehrheiten = [
    mehrheitAuf("damen", DAMENFLUEGEL, jeLinie, gegnerische, farbe),
    mehrheitAuf("koenigs", KOENIGSFLUEGEL, jeLinie, gegnerische, farbe),
  ].flatMap((m) => (m ? [m] : []));
  return {
    farbe,
    bauern,
    jeLinie,
    inseln: inselnAus(jeLinie),
    ketten: kettenAus(brett, bauern, farbe),
    duos: duosAus(bauern),
    offeneLinien: jeLinie.flatMap((linie, index) =>
      !linienMitEigenen(linie) && !linienMitEigenen(gegnerische[index] ?? []) ? [index] : [],
    ),
    halboffeneLinien: jeLinie.flatMap((linie, index) =>
      !linienMitEigenen(linie) && linienMitEigenen(gegnerische[index] ?? []) ? [index] : [],
    ),
    loecher,
    starkeFelder,
    mehrheiten,
  };
}
