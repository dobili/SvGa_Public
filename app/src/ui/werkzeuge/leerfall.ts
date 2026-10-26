/**
 * Leerfälle der Werkzeugkarten (Rückfrage U12, Entscheidung D1 vom 15.10.2026): Greift ein
 * Werkzeug in einer Stellung nicht, zeigt die Karte statt leerer Befunde einen einzigen Satz:
 * wann das Werkzeug gilt und warum hier nicht.
 *
 * Rolle im Gesamtbild: Schicht zwischen den Werkzeugen (analyse/, Fables Bereich, unverändert)
 * und der Karte (ui/komponenten/werkzeugkarten/Werkzeugkarte.tsx). Sie bekommt das fertige Ergebnis und die
 * Stellung und ersetzt es, wenn das Werkzeug nicht greift. Dazu entfernt sie bei allen Werkzeugen
 * den Satz, der als Befund und als Fazit doppelt stand (Planbilanz, Elementarmatt, Quadrat …).
 * Die Phase folgt derselben Regel wie das Werkzeug „Phase“ (Glossar an Buchstellungen, S17).
 * Bedingungen so gewählt, dass keine Bilanztabelle des Buches verdeckt wird: Die Zielbilanz steht
 * im Buch auch im Mittelspiel (Kapitel 2), die Faktorenbilanz auch im Endspiel (Abb. 3.24).
 * Abhängigkeiten: schach/phase.ts, schach/drohungen.ts, analyse/stellungsprofil.ts und
 * analyse/texte.ts (nur aufgerufen), chessops, i18n.
 */
import { makeSan } from "chessops/san";
import type { Werkzeugergebnis } from "../../analyse/werkzeug";
import { profil } from "../../analyse/stellungsprofil";
import { farbname } from "../../analyse/texte";
import { t, type Textschluessel } from "../../i18n/sprache";
import { phase, type Phase, type Phasenregel } from "../../schach/phase";
import type { Stellung } from "../../schach/stellung";
import { legaleZuege } from "../../schach/drohungen";

/** Was die Leerfall-Prüfung über die Stellung wissen muss. */
export interface Leerfallkontext {
  readonly stellung: Stellung;
  readonly regel: Phasenregel;
}

/** Faul berechnete Angaben zur Stellung, damit die Phase nur gerechnet wird, wenn nötig. */
interface Lage {
  readonly stellung: Stellung;
  readonly phase: () => Phase | null;
}

/** Grund, warum ein Werkzeug hier nicht greift, oder null, wenn es greift. */
type Pruefung = (lage: Lage, ergebnis: Werkzeugergebnis) => string | null;

const OHNE_STUFEN: Werkzeugergebnis["stufen"] = [[], [], []];

/** Stehen Bauern am Brett? */
function mitBauern(s: Stellung): boolean {
  return !s.brett.pawn.isEmpty();
}

/** Steht außer Königen und Bauern noch eine Figur am Brett? */
function mitFiguren(s: Stellung): boolean {
  return !s.brett.occupied.diff(s.brett.pawn).diff(s.brett.king).isEmpty();
}

/** Grund „es ist {Phase}“, wenn die Phase eine der genannten ist. */
function inPhase(lage: Lage, phasen: readonly Phase[]): string | null {
  const p = lage.phase();
  return p !== null && phasen.includes(p)
    ? t("leerfall.grund.phase", { phase: t(`phase.name.${p}`) })
    : null;
}

/** Hat die Seite am Zug ein Schach oder einen Schlag? */
function schachOderSchlag(s: Stellung): boolean {
  const regeln = s.regeln;
  if (!regeln) return false;
  return legaleZuege(regeln).some((zug) => /[x+#]/.test(makeSan(regeln, zug)));
}

/** Kein Bauer, oder nicht nur Könige und Bauern: Grund für die Bauernendspiel-Werkzeuge. */
function keinBauernendspiel(lage: Lage, braucheBauern: boolean): string | null {
  if (mitFiguren(lage.stellung)) return t("leerfall.grund.figuren");
  if (braucheBauern && !mitBauern(lage.stellung)) return t("leerfall.grund.keineBauern");
  return null;
}

/**
 * Die Bedingungen je Werkzeug (U12). Regel jeweils nach dem Kapitel des Werkzeugs; die Sätze
 * stehen in de.json unter leerfall.<Werkzeug>.
 */
const PRUEFUNGEN: Readonly<Record<string, Pruefung>> = {
  // Kapitel 1: Die goldene Angriffsregel gilt dem Angriff auf den König, nicht im Endspiel.
  "k1-angriffsregel": (lage) => inPhase(lage, ["endspiel"]),
  // Kapitel 1: Die Todsünden gelten, solange die Eröffnungsziele nicht erreicht sind.
  "k1-todsuenden": (lage) => inPhase(lage, ["mittelspiel", "endspiel"]),
  // Kapitel 2: Die Zielbilanz steht im Buch auch im Mittelspiel, nicht im Endspiel.
  "k2-zielbilanz": (lage) => inPhase(lage, ["endspiel"]),
  // Kapitel 3: In der Eröffnung (Gambits) und im Endspiel (Abb. 3.24) immer; im Mittelspiel nur,
  // wenn ein Faktor vorn liegt, sonst helfen die Planfragen mehr.
  "k3-faktorenbilanz": (lage, e) =>
    e.fazit === t("faktoren.fazit.gleich") && inPhase(lage, ["mittelspiel"])
      ? t("leerfall.grund.faktorenGleich")
      : null,
  // Kapitel 5: Das Skelett sind die Bauern.
  "k5-felder": (lage) => (mitBauern(lage.stellung) ? null : t("leerfall.grund.keineBauern")),
  "k5-bauern": (lage) => (mitBauern(lage.stellung) ? null : t("leerfall.grund.keineBauern")),
  "k5-richtung": (lage) => (mitBauern(lage.stellung) ? null : t("leerfall.grund.keineBauern")),
  "k5-figuren": (lage) => {
    if (!mitBauern(lage.stellung)) return t("leerfall.grund.keineBauern");
    return mitFiguren(lage.stellung) ? null : t("leerfall.grund.keineFiguren");
  },
  // Kapitel 7, Schritt 3: Ruhe gibt es nur zu prüfen, wo etwas in der Luft liegt.
  "k7-ruhe": (lage, e) =>
    e.fazit === t("ruhe.fazit") && !schachOderSchlag(lage.stellung)
      ? t("leerfall.grund.ruhig", { farbe: farbname(lage.stellung.amZug) })
      : null,
  // Kapitel 7, Schritt 1: ohne Signal kein Befund.
  "k7-warnsignale": (_lage, e) =>
    e.fazit === t("warnsignale.fazitSieben", { kennungen: t("warnsignale.keine") })
      ? t("leerfall.grund.keinSignal")
      : null,
  // Kapitel 8: die sechs Regeln im Endspiel und auf dem Weg dorthin, nicht in der Eröffnung.
  "k8-regeln": (lage) => inPhase(lage, ["eroeffnung"]),
  // Kapitel 8: Opposition, Schlüsselfelder und Quadrat gelten im Bauernendspiel.
  "k8-opposition": (lage) => keinBauernendspiel(lage, false),
  "k8-schluesselfelder": (lage) => keinBauernendspiel(lage, true),
  "k8-quadrat": (lage) => keinBauernendspiel(lage, true),
};

/**
 * Werkzeuge mit Leerfall nach U12 (für Tests und Dokumentation). Das Turmendspiel (k9-turmbegriffe)
 * hat seine Leerfall-Sätze schon im Werkzeug; hier fällt nur der doppelte Satz weg.
 */
export const WERKZEUGE_MIT_LEERFALL: readonly string[] = Object.keys(PRUEFUNGEN);

/**
 * Entfernt den Satz, der als Befund und als Fazit doppelt steht; leere Befunde fallen weg.
 * Beispiel: Planbilanz im Schach: Befund „Schwarz steht im Schach …“ und Fazit gleich → nur
 * das Fazit.
 */
export function ohneDoppeltenSatz(e: Werkzeugergebnis): Werkzeugergebnis {
  const befunde = e.befunde
    .filter((b) => b.titel !== e.fazit)
    .map((b) => ({ ...b, zeilen: b.zeilen.filter((z) => z !== e.fazit) }))
    .filter((b) => b.zeilen.length > 0 || b.waage !== undefined || b.sprung !== undefined);
  if (befunde.length === e.befunde.length && befunde.every((b, i) => b === e.befunde[i])) return e;
  const kennungen = new Set(befunde.map((b) => b.kennung));
  const behalte = (stufe: readonly string[]) => stufe.filter((k) => kennungen.has(k));
  const [eins, zwei, drei] = e.stufen;
  return { ...e, befunde, stufen: [behalte(eins), behalte(zwei), behalte(drei)] };
}

/**
 * Das Ergebnis für die Karte: im Leerfall nur der Satz „{gilt} Hier nicht: {grund}“, sonst das
 * Ergebnis ohne doppelten Satz.
 *
 * Warum: Eine volle Karte mit „keine“ in jeder Zeile sagt dem Leser nicht, dass das Werkzeug hier
 * nicht greift (Wunsch des Autors, D1).
 * Beispiel: Abb. 8.2 (Damen am Brett), Opposition → „Die Opposition gilt im Bauernendspiel …
 * Hier nicht: Es stehen noch Figuren außer Königen und Bauern am Brett.“
 * Sonderfall: Lehrbilder ohne Regeln (ohne König) behalten ihr Ergebnis.
 */
export function mitLeerfall(e: Werkzeugergebnis, kontext: Leerfallkontext): Werkzeugergebnis {
  const pruefe = PRUEFUNGEN[e.werkzeug];
  const { stellung, regel } = kontext;
  if (!pruefe || !stellung.regeln) return ohneDoppeltenSatz(e);
  let gemerkt: Phase | null | undefined;
  const lage: Lage = {
    stellung,
    phase: () => {
      if (gemerkt === undefined) {
        const p = profil(stellung);
        gemerkt = phase(stellung, p.angriffskarte, p.drohungen, regel).phase;
      }
      return gemerkt;
    },
  };
  const grund = pruefe(lage, e);
  if (grund === null) return ohneDoppeltenSatz(e);
  const gilt = t(`leerfall.${e.werkzeug}` as Textschluessel);
  return {
    ...e,
    befunde: [],
    markierungen: [],
    stufen: OHNE_STUFEN,
    fazit: t("leerfall.satz", { gilt, grund }),
  };
}
