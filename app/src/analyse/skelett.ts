/**
 * Gemeinsame Zugänge der Skelett-Werkzeuge (Kapitel 5) zu den Bausteinen und Textbausteine.
 *
 * Rolle im Gesamtbild: k5-felder, k5-bauern, k5-richtung, k5-figuren und k6-wo stellen dieselben
 * Fragen an dasselbe Skelett; hier stehen die Aufrufe mit beiden Seiten, die Namen von Linien
 * und Flügeln, wie das Buch sie schreibt, und die Bausteine, aus denen k5-richtung (Fazit) und
 * planlage.ts (Lage 5) wählen: gesunde Mehrheit, Zielschwäche, Minderheitsangriff oder
 * Gegenspiel (Entscheidungen des Autors zu C1.9 und C1.14).
 * Abhängigkeiten: analyse/stellungsprofil.ts, schach/skelett*.ts, schach/bauernprofil.ts, i18n.
 */
import type { Color, Square } from "chessops/types";
import { t } from "../i18n/sprache";
import { squareFile } from "chessops/util";
import { vonBauerGedeckt, type Mehrheit } from "../schach/bauernprofil";
import { felderbefund, feldVor, type Felderbefund } from "../schach/skelettfelder";
import {
  figurenbefund,
  schwacheMitArt,
  type Figurenbefund,
  type Schwaeche,
} from "../schach/skelettfiguren";
import {
  fluegelVon,
  richtungsbefund,
  type Fluegel,
  type Richtungsbefund,
} from "../schach/skelettrichtung";
import { feldname, gegner } from "../schach/stellung";
import type { Stellungsprofil } from "./stellungsprofil";
import { aufzaehlung } from "./texte";

const LINIENBUCHSTABEN = "abcdefgh";
/**
 * So viele eigene Bauern braucht ein Minderheitsangriff mindestens: Mit einem einzigen Bauern
 * gibt es keinen Angriff, der eine Schwäche erzeugt (Abb. 11.43, Schwarz mit a6 allein: „Keine
 * Mehrheit, kein Hebel.“).
 */
const MINDERHEIT_MINDESTENS = 2;
/**
 * Welche Art gegnerischer Schwäche das Fazit bei gleicher Lage zuerst nennt: die Arten der
 * Tabelle in Kapitel 5, der Isolani vorn (Abb. 5.17: „Schwarz blockiert d5 … gegen den
 * Isolani“), zuletzt ein Bauer, der nur den Deckungstest nicht besteht.
 */
const SCHWAECHE_VORRANG: readonly Schwaeche[] = [
  "isolani",
  "rueck",
  "haengend",
  "doppel",
  "basis",
  "ungesund",
];

/** Name einer Linie wie im Buch: „c-Linie“. */
export function linienname(linie: number): string {
  return t("skelett.linie", { linie: LINIENBUCHSTABEN.charAt(linie) });
}

/** Name eines Flügels: „Damenflügel“ oder „Königsflügel“. */
export function fluegelname(fluegel: Fluegel): string {
  return t(`skelett.fluegel.${fluegel}`);
}

/** Felder als Aufzählung: „d5, e4 und f5“. */
export function felderText(felder: readonly Square[]): string {
  return aufzaehlung(felder.map(feldname));
}

/** Die Antwort auf Leitfrage 1 für eine Seite, aus dem Profil. */
export function felderFuer(p: Stellungsprofil, farbe: Color): Felderbefund {
  return felderbefund(
    p.stellung,
    farbe,
    { eigen: p.bauernprofil(farbe), gegner: p.bauernprofil(gegner(farbe)) },
    p.koenigsumgebung(farbe),
  );
}

/** Die Antwort auf Leitfrage 3 für eine Seite, aus dem Profil. */
export function richtungFuer(p: Stellungsprofil, farbe: Color): Richtungsbefund {
  return richtungsbefund(p.stellung.brett, farbe, {
    eigen: p.bauernprofil(farbe),
    gegner: p.bauernprofil(gegner(farbe)),
  });
}

/** Die Antwort auf Leitfrage 4 für eine Seite, aus dem Profil. */
export function figurenFuer(p: Stellungsprofil, farbe: Color): Figurenbefund {
  const feind = gegner(farbe);
  return figurenbefund(
    p.stellung.brett,
    farbe,
    { eigen: p.bauernprofil(farbe), gegner: p.bauernprofil(feind) },
    { eigen: p.bauernschwaechen(farbe), gegner: p.bauernschwaechen(feind) },
    felderFuer(p, farbe),
  );
}

/** Eine Mehrheit mit Kandidat. */
export type GesundeMehrheit = Mehrheit & { readonly kandidat: Square };

/** Gesund heißt eine Mehrheit, wenn sie einen Kandidaten hat, also einen Freibauern bilden kann. */
function gesund(m: Mehrheit | undefined): m is GesundeMehrheit {
  return m !== undefined && m.kandidat !== null;
}

/**
 * Die gesunde eigene Mehrheit, mit der die Seite spielt: Sie hat einen Kandidaten, und keine
 * gegnerische Mehrheit hat einen.
 *
 * Regel: Kapitel 5, „Bauernmehrheiten“, Berliner Endspiel (Abb. 5.30: „Gold: der Kandidat e5 und
 * der Plan f2–f5 mit e5–e6“; die schwarze Mehrheit am Damenflügel bildet wegen der Doppelbauern
 * keinen Freibauern). Eingaben: Profil, Farbe. Ausgabe: die Mehrheit oder null.
 * Sonderfall: Hat der Gegner keine Mehrheit, genügt der eigene Kandidat (Abb. 11.43: b2).
 */
export function gesundeMehrheit(p: Stellungsprofil, farbe: Color): GesundeMehrheit | null {
  if (p.bauernprofil(gegner(farbe)).mehrheiten.some(gesund)) return null;
  return p.bauernprofil(farbe).mehrheiten.find(gesund) ?? null;
}

/** Eine gegnerische Bauernschwäche, die als Ziel taugt, wenn sie fixiert ist (Abb. 6.10: c6). */
export interface Zielschwaeche {
  readonly feld: Square;
  readonly art: Schwaeche;
  readonly fixiert: boolean;
  /** Das Feld davor ist besetzt (der Bauer kann nicht vorrücken). */
  readonly besetzt: boolean;
  /** Der eigene Bauer, der das Feld davor bewacht, oder null. */
  readonly bewacher: Square | null;
  /** Die Linie ist für die angreifende Seite halboffen: ein Ziel für die Türme (Kapitel 5). */
  readonly halboffen: boolean;
}

/**
 * Schwache gegnerische Bauern; fixiert, wenn das Feld davor besetzt ist oder ein eigener Bauer es
 * bewacht, das der Gegner nicht mit einem Bauern decken kann (Kapitel 6, Lage 5; Abb. 6.10: c6,
 * „das Feld c5, das der Bauer d4 bewacht“).
 */
export function zielschwaechen(p: Stellungsprofil, farbe: Color): Zielschwaeche[] {
  const feind = gegner(farbe);
  const { brett } = p.stellung;
  const halboffene = p.bauernprofil(farbe).halboffeneLinien;
  return schwacheMitArt(p.bauernschwaechen(feind), p.bauernprofil(feind)).map(({ feld, art }) => {
    const halboffen = halboffene.includes(squareFile(feld));
    const davor = feldVor(feld, feind);
    if (davor === null)
      return { feld, art, fixiert: true, besetzt: true, bewacher: null, halboffen };
    const bewacher = [...brett.pawn.intersect(brett[farbe])].find((b) =>
      p.angriffskarte.angreiferVon(davor, farbe).some((a) => a.feld === b),
    );
    const besetzt = brett.occupied.has(davor);
    const fixiert = besetzt || (bewacher !== undefined && !vonBauerGedeckt(brett, davor, feind));
    return {
      feld,
      art,
      fixiert,
      besetzt,
      bewacher: besetzt ? null : (bewacher ?? null),
      halboffen,
    };
  });
}

/** Rang einer Zielschwäche fürs Fazit: halboffen und fixiert vor halboffen vor fixiert, dann die Art. */
function zielrang(z: Zielschwaeche): number {
  const lage = (z.halboffen ? 0 : 2) + (z.fixiert ? 0 : 1);
  return lage * SCHWAECHE_VORRANG.length + SCHWAECHE_VORRANG.indexOf(z.art);
}

/**
 * Die gegnerische Bauernschwäche, gegen die die Seite spielt: nur eine, die fixiert ist oder auf
 * einer für die Seite halboffenen Linie steht (Kapitel 6, Lage 5; Kapitel 5, Türme auf
 * halboffene Linien). Den hinteren von zwei Doppelbauern überspringt die App, Ziel ist der
 * vordere. Beispiele: Abb. 5.17, Schwarz: der Isolani d4; Abb. 6.10, Weiß: der rückständige
 * Bauer c6 (nicht der Isolani a7, den Weiß weder fixiert noch über eine halboffene Linie angreift).
 */
export function zielschwaeche(p: Stellungsprofil, farbe: Color): Zielschwaeche | null {
  const brett = p.stellung.brett;
  const feind = gegner(farbe);
  const kandidaten = zielschwaechen(p, farbe).filter((z) => {
    const davor = feldVor(z.feld, feind);
    const eigenerBauerDavor =
      davor !== null && brett.get(davor)?.role === "pawn" && brett.get(davor)?.color === feind;
    return (z.fixiert || z.halboffen) && !eigenerBauerDavor;
  });
  return kandidaten.sort((a, b) => zielrang(a) - zielrang(b))[0] ?? null;
}

/** Der Plan einer Minderheit: Angriff mit den Bauern oder, vor dem eigenen König, Gegenspiel mit Figuren. */
export interface Minderheitsplan {
  readonly art: "angriff" | "gegenspiel";
  readonly fluegel: Fluegel;
}

/**
 * Wo die Minderheit angreift, oder wo sie wegen des eigenen Königs Figuren schickt.
 *
 * Regel: Kapitel 5, Carlsbad-Struktur (Abb. 5.32 bis 5.34): Der Minderheitsangriff erzeugt eine
 * Schwäche in einer gesunden gegnerischen Mehrheit. Präzisierungen der App (Entscheidung des
 * Autors zu C1.9 und C1.14): mindestens zwei eigene Bauern, die gegnerische Mehrheit dort hat
 * einen Kandidaten, ein eigener Bauer dort hat einen Hebel; steht der eigene König auf diesem
 * Flügel, schiebt man die Bauern vor ihm nicht vor: „Gegenspiel kommt mit Figuren am
 * Königsflügel“ (Abb. 5.32, Schwarz).
 * Eingaben: Profil, Farbe, Richtungsbefund der Farbe. Ausgabe: Plan oder null.
 * Beispiel: Abb. 6.8, Weiß: Angriff am Damenflügel (b2–b4–b5); Schwarz: Gegenspiel am
 * Königsflügel. Sonderfall: Lehrbilder ohne König kennen kein Gegenspiel.
 */
export function minderheitsplan(
  p: Stellungsprofil,
  farbe: Color,
  r: Richtungsbefund,
): Minderheitsplan | null {
  const gegnerMehrheiten = p.bauernprofil(gegner(farbe)).mehrheiten;
  const koenig = p.stellung.brett.kingOf(farbe);
  for (const m of r.minderheiten) {
    if (m.eigene < MINDERHEIT_MINDESTENS) continue;
    if (!gesund(gegnerMehrheiten.find((g) => g.fluegel === m.fluegel))) continue;
    if (!r.hebel.some((h) => fluegelVon(h.von) === m.fluegel)) continue;
    const vorDemKoenig = koenig !== undefined && fluegelVon(koenig) === m.fluegel;
    return { art: vorDemKoenig ? "gegenspiel" : "angriff", fluegel: m.fluegel };
  }
  return null;
}
