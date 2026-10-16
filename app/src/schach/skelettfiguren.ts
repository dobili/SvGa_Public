/**
 * Leitfrage 4 des Skelett-Röntgens: Figuren. Stellungstyp, gute und schlechte Läufer, Zielfelder
 * für Springer und Türme, Tauschfrage.
 *
 * Rolle im Gesamtbild: Baustein für k5-figuren, k6-wo (Zentrum offen oder geschlossen) und k6-lap
 * (wohin eine Figur gehört). Pflichtenheft 6.3: „Stellungstyp (offen, halboffen, geschlossen,
 * beweglich), guter und schlechter Läufer nach Zahl der eigenen Bauern auf seiner Feldfarbe,
 * Zielfelder für Springer und Türme.“ Pflichtenheft 6.6: Stellungstyp und Schlechter Läufer.
 * Abhängigkeiten: bauernprofil.ts, bauernschwaechen.ts, skelettfelder.ts, chessops.
 * Buchbezug: Kapitel 5, „Leitfrage 4: Figuren“ (Abb. 5.35 bis 5.43).
 */
import type { Board } from "chessops/board";
import type { Color, Square } from "chessops/types";
import { squareFile, squareRank } from "chessops/util";
import type { Figurenstand } from "./angriffskarte";
import { eigeneReihe, feldAusEigener, vonHinten, type Bauernprofil } from "./bauernprofil";
import type { Bauernschwaechen } from "./bauernschwaechen";
import type { Felderbefund } from "./skelettfelder";
import { gegner } from "./stellung";

/** Die Zentrumslinien d und e. */
const ZENTRUMSLINIEN: readonly number[] = [3, 4];
/** Die Reihen 4 und 5 (Index 3 und 4): Dort steht ein bewegliches Duo (d4/e4, d5/e5). */
const DUOREIHEN: readonly number[] = [3, 4];

/** Stellungstyp nach Pflichtenheft 6.6; „gemischt“, wenn keine der vier Regeln greift. */
export type Stellungstyp = "offen" | "geschlossen" | "beweglich" | "halboffen" | "gemischt";

export interface Stellungstypbefund {
  readonly typ: Stellungstyp;
  /** Verkeilte Bauernpaare auf der d- und e-Linie (eigener Bauer, gegnerischer davor). */
  readonly verkeilt: readonly { readonly weiss: Square; readonly schwarz: Square }[];
  /** Die Seite mit einem Bauernduo im Zentrum, oder null. */
  readonly duo: { readonly farbe: Color; readonly felder: readonly Square[] } | null;
  /** Zentrumslinien ohne Bauern beider Seiten. */
  readonly offeneLinien: readonly number[];
  /** Zentrumslinien, auf denen nur eine Seite Bauern hat, mit dieser Seite. */
  readonly halboffen: readonly { readonly linie: number; readonly ohneBauern: Color }[];
}

/** Ein Läufer mit der Zahl der festgelegten eigenen Bauern auf seiner Feldfarbe. */
export interface Laeuferbefund {
  readonly laeufer: Figurenstand;
  readonly feldfarbe: "hell" | "dunkel";
  /** Festgelegte eigene Bauern auf seiner Farbe und auf der anderen. */
  readonly aufSeinerFarbe: readonly Square[];
  readonly aufAndererFarbe: readonly Square[];
  readonly wertung: "gut" | "schlecht" | "neutral";
  /** Hinter der eigenen Kette eingesperrt: beide Felder schräg vor ihm tragen eigene Bauern. */
  readonly passiv: boolean;
  /**
   * Steht vor der eigenen Kette: nicht passiv und auf keiner Reihe hinter den festgelegten
   * eigenen Bauern seiner Farbe (Abb. 5.40: „Der Läufer f4 steht vor der Pyramide c3–d4–e3“).
   * Ein solcher Läufer ist nur „schlecht nach der Farbe, aber aktiv“.
   */
  readonly vorDerKette: boolean;
}

/** Zielfelder und Tauschfrage einer Seite. */
export interface Figurenbefund {
  readonly farbe: Color;
  readonly laeufer: readonly Laeuferbefund[];
  /** Felder für Springer: sichere Felder und Springerfelder aus Leitfrage 1. */
  readonly springerfelder: readonly Square[];
  /** Linien für Türme: offene und (für diese Seite) halboffene Linien. */
  readonly turmlinien: readonly {
    readonly linie: number;
    readonly offen: boolean;
    readonly ziel: Square | null;
  }[];
  /** Tauschfrage: eigene und gegnerische Bauernschwächen (wer die Schwäche hat, behält Figuren). */
  readonly eigeneSchwaechen: readonly Square[];
  readonly gegnerSchwaechen: readonly Square[];
}

function istHell(feld: Square): boolean {
  return (squareFile(feld) + squareRank(feld)) % 2 === 1;
}

/**
 * Bestimmt den Stellungstyp.
 *
 * Regel: Pflichtenheft 6.6: „Geschlossen: verkeilte Bauernpaare auf der d- und e-Linie. Halboffen:
 * eine Zentrumslinie halboffen. Offen: kein Bauer mehr auf der d- und e-Linie. Beweglich: ein
 * eigenes Bauernduo im Zentrum.“ Präzisierung am Buch: Offen auch mit einem einzelnen Bauern im
 * Zentrum, dem Isolani (Kapitel 6, Abb. 6.3: „Offenes Zentrum … der Isolani“; Abb. 11.43:
 * „Offene Stellung“). Reihenfolge der App: offen, geschlossen (beide Linien verkeilt), beweglich,
 * halboffen, sonst gemischt (eine verkeilte Linie neben einer mit zwei beweglichen Bauern).
 * Beispiele: Abb. 5.35 geschlossen, 5.36 halboffen, 5.37 offen, 5.38 beweglich.
 */
export function stellungstyp(brett: Board): Stellungstypbefund {
  const verkeilt: { weiss: Square; schwarz: Square }[] = [];
  const offeneLinien: number[] = [];
  const halboffen: { linie: number; ohneBauern: Color }[] = [];
  for (const linie of ZENTRUMSLINIEN) {
    const weisse = [...brett.pawn.intersect(brett.white)].filter((f) => squareFile(f) === linie);
    const schwarze = [...brett.pawn.intersect(brett.black)].filter((f) => squareFile(f) === linie);
    if (weisse.length === 0 && schwarze.length === 0) offeneLinien.push(linie);
    else if (weisse.length === 0) halboffen.push({ linie, ohneBauern: "white" });
    else if (schwarze.length === 0) halboffen.push({ linie, ohneBauern: "black" });
    for (const weiss of weisse) {
      const davor = feldAusEigener(linie, eigeneReihe(weiss, "white") + 1, "white");
      if (davor !== null && schwarze.includes(davor)) verkeilt.push({ weiss, schwarz: davor });
    }
  }
  const duo = duoImZentrum(brett);
  // Offen: Auf keiner Zentrumslinie stehen Bauern beider Seiten (Abb. 5.37 ohne Bauern, Abb. 6.3
  // und 11.43 mit einem Isolani, Abb. 5.17). Erst danach entscheiden Verkeilung, Duo und
  // halboffene Linie.
  const beideSeiten = ZENTRUMSLINIEN.length - offeneLinien.length - halboffen.length;
  const typ: Stellungstyp =
    beideSeiten === 0
      ? "offen"
      : verkeilt.length === ZENTRUMSLINIEN.length
        ? "geschlossen"
        : duo
          ? "beweglich"
          : halboffen.length > 0
            ? "halboffen"
            : "gemischt";
  return { typ, verkeilt, duo, offeneLinien, halboffen };
}

/** Ein Bauernduo d/e auf derselben Reihe 4 oder 5, das noch nicht verkeilt ist. */
function duoImZentrum(brett: Board): Stellungstypbefund["duo"] {
  for (const farbe of ["white", "black"] as const) {
    for (const reihe of DUOREIHEN) {
      const felder = ZENTRUMSLINIEN.map((linie) => feldAusEigener(linie, reihe, farbe));
      const bauern = felder.flatMap((f) => (f !== null ? [f] : []));
      const alle = bauern.every(
        (f) => brett.get(f)?.role === "pawn" && brett.get(f)?.color === farbe,
      );
      const frei = bauern.every((f) => {
        const davor = feldAusEigener(squareFile(f), reihe + 1, farbe);
        return davor !== null && brett.get(davor) === undefined;
      });
      if (bauern.length === ZENTRUMSLINIEN.length && alle && frei) return { farbe, felder: bauern };
    }
  }
  return null;
}

/**
 * Festgelegte Bauern (Pflichtenheft 6.6): verkeilt (gegnerischer Bauer direkt davor), Glied einer
 * Kette, isoliert oder rückständig. Ein Bauer, dem nur eine eigene Figur im Weg steht, ist nicht
 * festgelegt (Abb. 11.43: der Isolani d5 macht den Läufer c8 schlecht, nicht der Bauer f7).
 */
function festgelegte(
  brett: Board,
  farbe: Color,
  profil: Bauernprofil,
  schwaechen: Bauernschwaechen,
): Square[] {
  const fest = new Set([
    ...profil.ketten.flatMap((k) => k.glieder),
    ...schwaechen.isolani,
    ...schwaechen.rueckstaendige,
  ]);
  const feind = gegner(farbe);
  return profil.bauern.filter((b) => {
    const davor = feldAusEigener(squareFile(b), eigeneReihe(b, farbe) + 1, farbe);
    const verkeilt =
      davor !== null && brett.get(davor)?.role === "pawn" && brett.get(davor)?.color === feind;
    return fest.has(b) || verkeilt;
  });
}

/** Ob ein Strahl vom Läufer schräg nach vorn als Erstes auf einen eigenen Bauern trifft. */
function endetAnEigenemBauern(brett: Board, von: Square, seite: -1 | 1, farbe: Color): boolean {
  let linie = squareFile(von) + seite;
  let reihe = eigeneReihe(von, farbe) + 1;
  while (linie >= 0 && linie < 8 && reihe < 8) {
    const feld = feldAusEigener(linie, reihe, farbe);
    const figur = feld === null ? undefined : brett.get(feld);
    if (figur) return figur.role === "pawn" && figur.color === farbe;
    linie += seite;
    reihe += 1;
  }
  return false;
}

/**
 * Gute und schlechte Läufer einer Seite.
 *
 * Regel: Pflichtenheft 6.6, „Schlechter Läufer: Mehr eigene, festgelegte Bauern auf seiner
 * Feldfarbe als auf der anderen. Zusätzlich ‚passiv‘, wenn er hinter der eigenen Kette steht.“
 * Passiv heißt: Beide Diagonalen schräg nach vorn enden an einem eigenen Bauern (Abb. 5.24: der
 * Läufer c8 hinter b7 und e6; der Läufer c1 kommt über c1–h6 heraus). Vor der Kette steht er, wenn
 * keiner der festgelegten Bauern seiner Farbe weiter vorn steht als er (Kapitel 5: „Entscheidend
 * ist also nicht nur die Farbe, sondern auch, auf welcher Seite der eigenen Bauern der Läufer
 * steht“; Abb. 5.40: Läufer f4 vor der Pyramide).
 * Beispiel: Abb. 5.43 (London): Läufer d3 gut (d4 dunkel), Läufer d7 schlecht (d5 hell).
 */
function laeuferVon(
  brett: Board,
  farbe: Color,
  profil: Bauernprofil,
  schwaechen: Bauernschwaechen,
): Laeuferbefund[] {
  const fest = festgelegte(brett, farbe, profil, schwaechen);
  const befunde: Laeuferbefund[] = [];
  for (const feld of brett.bishop.intersect(brett[farbe])) {
    const hell = istHell(feld);
    const aufSeinerFarbe = fest.filter((b) => istHell(b) === hell);
    const aufAndererFarbe = fest.filter((b) => istHell(b) !== hell);
    const wertung =
      aufSeinerFarbe.length > aufAndererFarbe.length
        ? "schlecht"
        : aufSeinerFarbe.length < aufAndererFarbe.length
          ? "gut"
          : "neutral";
    const passiv = ([-1, 1] as const).every((seite) =>
      endetAnEigenemBauern(brett, feld, seite, farbe),
    );
    const reihe = eigeneReihe(feld, farbe);
    const vorDerKette =
      !passiv &&
      aufSeinerFarbe.length > 0 &&
      aufSeinerFarbe.every((b) => eigeneReihe(b, farbe) <= reihe);
    befunde.push({
      laeufer: { feld, figur: { role: "bishop", color: farbe } },
      feldfarbe: hell ? "hell" : "dunkel",
      aufSeinerFarbe,
      aufAndererFarbe,
      wertung,
      passiv,
      vorDerKette,
    });
  }
  return befunde;
}

/** Turmlinien: offene und halboffene Linien, mit dem gegnerischen Bauern davor als Ziel. */
function turmlinienVon(profil: Bauernprofil, gegnerprofil: Bauernprofil) {
  const offen = profil.offeneLinien.map((linie) => ({ linie, offen: true, ziel: null }));
  const halb = profil.halboffeneLinien.map((linie) => ({
    linie,
    offen: false,
    ziel: gegnerprofil.jeLinie[linie]?.[0] ?? null,
  }));
  return [...offen, ...halb];
}

/** Die Arten der Bauernschwächen, in der Reihenfolge der Tabelle in Kapitel 5. */
export type Schwaeche = "doppel" | "rueck" | "isolani" | "haengend" | "basis" | "ungesund";

/** Ein schwacher Bauer mit seiner Art, wie die Tabelle in Kapitel 5 sie nennt. */
export interface SchwacherBauer {
  readonly feld: Square;
  readonly art: Schwaeche;
}

/**
 * Alle schwachen Bauern einer Seite mit ihrer Art, von hinten nach vorn geordnet.
 *
 * Regel: Kapitel 5, Tabelle „Die Bauernschwächen im Deckungstest“: Doppelbauer, rückständiger
 * Bauer, Isolani, hängende Bauern, Kettenbasis ohne Stütze; dazu jeder Bauer, der den
 * Deckungstest nicht besteht. Hat ein Bauer mehrere Arten, zählt die genauere: Doppelbauer,
 * Isolani, Kettenbasis ohne Stütze (auch wenn sie rückständig ist, Abb. 5.26: d4), rückständig,
 * hängend. Beispiel: Abb. 5.22: a7 Isolani, c5 und d5 hängend.
 */
export function schwacheMitArt(s: Bauernschwaechen, p: Bauernprofil): SchwacherBauer[] {
  const arten = new Map<Square, Schwaeche>();
  const setze = (feld: Square, art: Schwaeche) => {
    if (!arten.has(feld)) arten.set(feld, art);
  };
  for (const linie of s.doppelbauern) for (const feld of linie) setze(feld, "doppel");
  for (const feld of s.isolani) setze(feld, "isolani");
  for (const kette of p.ketten) {
    if (kette.stuetzen.length === 0) for (const feld of kette.basis) setze(feld, "basis");
  }
  for (const feld of s.rueckstaendige) setze(feld, "rueck");
  for (const [a, b] of s.haengende) {
    setze(a, "haengend");
    setze(b, "haengend");
  }
  for (const test of s.deckungstest) if (!test.gesund) setze(test.feld, "ungesund");
  return vonHinten([...arten.keys()], s.farbe).map((feld) => {
    const art = arten.get(feld) ?? "ungesund";
    return { feld, art };
  });
}

/** Alle schwachen Bauern einer Seite (nur die Felder), von hinten nach vorn. */
export function schwacheBauern(s: Bauernschwaechen, p: Bauernprofil): Square[] {
  return schwacheMitArt(s, p).map((b) => b.feld);
}

/**
 * Die Antwort auf Leitfrage 4 für eine Seite.
 *
 * Eingaben: Brett, Farbe, Bauernprofile und Bauernschwächen beider Seiten, Felderbefund der
 * Seite (für die Springerfelder). Ausgabe: Figurenbefund.
 * Beispiel: Abb. 5.44 (Vorstoßvariante): Weiß Läufer e2 gut (d4, e5 dunkel), Schwarz Läufer d7
 * schlecht (d5, e6 hell); Turmlinie c offen für beide.
 */
export function figurenbefund(
  brett: Board,
  farbe: Color,
  profile: { readonly eigen: Bauernprofil; readonly gegner: Bauernprofil },
  schwaechen: { readonly eigen: Bauernschwaechen; readonly gegner: Bauernschwaechen },
  felder: Felderbefund,
): Figurenbefund {
  return {
    farbe,
    laeufer: laeuferVon(brett, farbe, profile.eigen, schwaechen.eigen),
    springerfelder: [
      ...felder.sichere.map((s) => s.feld),
      ...felder.springerfelder.map((s) => s.feld),
    ],
    turmlinien: turmlinienVon(profile.eigen, profile.gegner),
    eigeneSchwaechen: schwacheBauern(schwaechen.eigen, profile.eigen),
    gegnerSchwaechen: schwacheBauern(schwaechen.gegner, profile.gegner),
  };
}

/** Die Gegenfarbe, damit Werkzeuge nur dieses Modul brauchen. */
export { gegner };
