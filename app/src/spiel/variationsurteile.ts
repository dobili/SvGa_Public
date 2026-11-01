/**
 * Zugarten in einer Variante: je Zug des Baums dieselbe Klasse wie in der Auswertung einer Partie.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 3 (Entscheidung f = A des Autors, 1.11.2026). Die
 * Partieauswertung urteilt über eine lineare Zugfolge (spiel/auswertung.ts, zeilenurteile); ein
 * Variantenbaum hat an jedem Knoten genau einen Weg zur Startstellung. Für einen Zug genügen der
 * Wert vor und nach dem Zug, der beste Zug und der Abstand zum zweitbesten der Stellung davor, dazu
 * der Verlust des gegnerischen Zuges davor („verpasst“, „stark“) und ob die Theorie bis hierher
 * reicht. Deshalb rechnet diese Datei je Knoten ein Fenster aus höchstens zwei Zügen (Großeltern,
 * Eltern, Knoten) mit genau denselben Regeln, auch Q12-3 (der beste Zug der Engine bekommt nie
 * „?!“, „?“ oder „??“). Die Theoriezüge erkennt schach/theorie.ts wie in der Partie (Kette ab der
 * Startstellung). Ohne besten Zug der Stellung davor (etwa nur „[%eval]“ aus einer fremden PGN)
 * gibt es kein Urteil, damit Q12-3 nie verletzt wird. Reine Funktionen.
 * Abhängigkeiten: spiel/auswertung.ts, schach/theorie.ts, schach/theorienamen.ts,
 * training/variationswerte.ts.
 */
import type { Pfad } from "../schach/variationsbaum";
import { theorieJeZug, type Theoriequellen } from "../schach/theorie";
import { gambitJeZug } from "../schach/theorienamen";
import type { Knotendaten, Variation } from "../training/variationen";
import { baumstellungen, HUNDERTSTEL, type Baumstellung } from "../training/variationswerte";
import { zeilenurteile, type Zugurteil } from "./auswertung";

/** Schlüssel eines Pfades in den Ergebnissen („e4 e5 Nf3“; Startstellung: „“). */
export function pfadSchluessel(pfad: Pfad): string {
  return pfad.join(" ");
}

/** Je Zug: liegt er in der Theorie, ist die Partie danach in einem Gambit? */
interface Theoriemerkmal {
  readonly theorie: boolean;
  readonly gambit: boolean;
}

/**
 * Theorie und Gambit je Zug, gerechnet je Blatt für die ganze Linie ab der Startstellung (beide
 * Fragen hängen nur vom Weg dorthin ab; gemeinsame Anfänge bekommen dasselbe Ergebnis).
 */
function theoriemerkmale(
  stellungen: readonly Baumstellung[],
  quellen: Theoriequellen | null,
): Map<string, Theoriemerkmal> {
  const merkmale = new Map<string, Theoriemerkmal>();
  if (!quellen) return merkmale;
  const fenJe = new Map(stellungen.map((s) => [pfadSchluessel(s.pfad), s.fen]));
  const blaetter = stellungen.filter((s) => s.pfad.length > 0 && !hatKinder(s.daten));
  for (const blatt of blaetter) {
    const fens = blatt.pfad.map((_, i) => fenJe.get(pfadSchluessel(blatt.pfad.slice(0, i))) ?? "");
    fens.push(blatt.fen);
    const theorie = theorieJeZug(quellen, fens, blatt.pfad);
    const gambits = gambitJeZug(quellen, fens, blatt.pfad);
    blatt.pfad.forEach((_, i) => {
      const schluessel = pfadSchluessel(blatt.pfad.slice(0, i + 1));
      if (!merkmale.has(schluessel)) {
        merkmale.set(schluessel, { theorie: theorie[i] === true, gambit: gambits[i] === true });
      }
    });
  }
  return merkmale;
}

/** Hat ein Knoten Fortsetzungen? (Die Startstellung hat keinen Knoten und zählt nie als Blatt.) */
function hatKinder(daten: Knotendaten): boolean {
  return "weiter" in daten && Array.isArray(daten.weiter) && daten.weiter.length > 0;
}

/** Werte in Bauern, wie zeilenurteile sie erwartet. */
function inBauern(hundertstel: number | undefined): number {
  return (hundertstel ?? 0) / HUNDERTSTEL;
}

/** Was das Urteil über einen Knoten braucht: er, seine Eltern, wenn vorhanden die Großeltern. */
interface Fenster {
  readonly knoten: Baumstellung;
  readonly eltern: Baumstellung;
  readonly grosseltern: Baumstellung | null;
  /** War der Zug zu den Eltern ein Theoriezug (Kette)? Beim ersten Zug true. */
  readonly kette: boolean;
}

/** Ein Fenster aus Stellungen: Großeltern nur, wenn sie Wert und besten Zug haben. */
function urteilImFenster(f: Fenster, merkmale: Map<string, Theoriemerkmal>): Zugurteil | null {
  const { knoten, eltern } = f;
  if (eltern.daten.w === undefined || !eltern.daten.b || knoten.daten.w === undefined) return null;
  const hier = merkmale.get(pfadSchluessel(knoten.pfad));
  const gp = f.grosseltern;
  const mitGp = gp !== null && gp.daten.w !== undefined && !!gp.daten.b;
  const reihe = mitGp ? [gp, eltern, knoten] : [eltern, knoten];
  const sans = reihe.slice(1).map((s) => s.pfad.at(-1) ?? "");
  const vorne = reihe.slice(0, -1);
  const urteile = zeilenurteile(
    reihe.map((s) => s.fen),
    sans,
    reihe.map((s) => inBauern(s.daten.w)),
    {
      beste: vorne.map((s) => s.daten.b ?? ""),
      abstaende: vorne.map((s) => inBauern(s.daten.a)),
      // Im Fenster mit Großeltern steht der Zug zu den Eltern vorn; seine Klasse „Theoriezug“
      // ergibt sich dort wieder genau dann, wenn sie es in der ganzen Linie war (siehe Dateikopf).
      theorie: mitGp ? [f.kette, hier?.theorie === true] : [f.kette && hier?.theorie === true],
      gambits: mitGp
        ? [merkmale.get(pfadSchluessel(eltern.pfad))?.gambit === true, hier?.gambit === true]
        : [hier?.gambit === true],
    },
  );
  return urteile.at(-1) ?? null;
}

/**
 * Das Urteil über jeden bewerteten Zug des Baums.
 *
 * Eingaben: Variante mit Werten (training/variationswerte.ts), Theoriequellen (null: keine
 * Theoriezüge). Ausgabe: je Pfad (pfadSchluessel) das Urteil; Züge ohne Werte fehlen.
 * Beispiel: Grundstellung, 1. e4 (bester Zug) e5 2. Dh5 (verliert 0,6) → 2. Dh5 „ungenau“ (?!).
 * Sonderfall: Ein Zug in einer Stellung ohne besten Zug (nur „[%eval]“) bekommt kein Urteil.
 */
export function urteileImBaum(
  v: Variation,
  quellen: Theoriequellen | null,
): Map<string, Zugurteil> {
  const stellungen = baumstellungen(v);
  const merkmale = theoriemerkmale(stellungen, quellen);
  const je = new Map(stellungen.map((s) => [pfadSchluessel(s.pfad), s]));
  const urteile = new Map<string, Zugurteil>();
  for (const knoten of stellungen) {
    if (knoten.pfad.length === 0) continue;
    const elternPfad = knoten.pfad.slice(0, -1);
    const eltern = je.get(pfadSchluessel(elternPfad));
    if (!eltern) continue;
    const grosseltern =
      elternPfad.length > 0 ? (je.get(pfadSchluessel(elternPfad.slice(0, -1))) ?? null) : null;
    const elternUrteil = urteile.get(pfadSchluessel(elternPfad));
    const kette = elternPfad.length === 0 || elternUrteil?.klasse === "buch";
    const urteil = urteilImFenster({ knoten, eltern, grosseltern, kette }, merkmale);
    if (urteil) urteile.set(pfadSchluessel(knoten.pfad), urteil);
  }
  return urteile;
}
