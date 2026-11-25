/**
 * Die Ursache eines Fehlers des Helden mit Figur und Feld (Wunsch des Autors, 26.11.2026; Entwurf
 * docs/spiel/auftraege/partiebesprechung_25-11.md, Abschnitt 11, Punkte 1 und 2): Statt „Danach
 * hatte dein Gegner eine Gabel“ sagt Ambrose, welcher Springer auf welches Feld konnte, welche
 * Figur hing oder was gedroht war, und was es gekostet hat.
 *
 * Rolle im Gesamtbild: Brücke zwischen dem Fehlerbefund der App (engine/fehlerart.ts,
 * fehlerbefundIn, über anbindung/besprechungsmotiv.ts) und den Sätzen
 * (anbindung/besprechungstexte.ts). Liefert eine Satzgruppe und ihre Werte (Figuren schon als
 * Wörter der Spieltexte, Felder, Züge in der Sprache des Spiels). Nur, was der Befund trägt:
 * fehlt eine Einzelheit (kein Feld, keine Figur), gibt es keinen Satz.
 * Regel: Kapitel 1 (Drohungen, hängende Figuren), Kapitel 4 (W1, W2), Kapitel 7 (Gabel, Fesselung,
 * Spieß, Abzug).
 * Abhängigkeiten: anbindung/besprechungsmotiv.ts, anbindung/besprechungsmaterial.ts,
 * engine/fehlerart.ts (Typen), spiel/zuege.ts, schach/notation.ts, texte/texte.ts.
 */
import type { Color, Role, Square } from "chessops/types";
import { makeSquare } from "chessops/util";
import type { Fehlerbefund } from "../../engine/fehlerart";
import { sprache } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { FIGURENWERT } from "../../schach/stellung";
import { regelstellung, sanZuUci } from "../../spiel/zuege";
import type { Begriff } from "../regeln/besprechung";
import type { Besprechungsmoment } from "../regeln/besprechungsmomente";
import { tSpiel } from "../texte/texte";
import { materialfolge, type Materialfolge } from "./besprechungsmaterial";
import { besteFolge, fehlerbefundAn, type Motivgrundlage } from "./besprechungsmotiv";

/** Eine Ursache: Satzgruppe, Werte für die Platzhalter, Begriff für die Wahl mit oder ohne Fachwort. */
export interface Ursache {
  readonly gruppe: string;
  readonly werte: Readonly<Record<string, string>>;
  /** Kennt der Held diesen Begriff, nimmt der Satz das Fachwort (Gruppe mit `.wort`). */
  readonly begriff: Begriff | null;
  /** Die bedrohte oder hängende Figur, wenn die Ursache eine nennt (Abgleich mit dem Material). */
  readonly rolle?: Role;
}

/** Wortformen einer Figur in den Spieltexten (besprechung.figur.<rolle>.<form>). */
type Form = "dein" | "deinen" | "gegnerisch" | "den";

/** Fehlerarten, die ohne Einzelheiten einen eigenen Satz haben (Satz mit dem gespielten Zug). */
const ARTEN_MIT_ZUG: ReadonlySet<string> = new Set([
  "schlagreflex",
  "falscherAbtausch",
  "bauernraub",
  "verfruehteDame",
  "koenigMitte",
  "tempoverlust",
  "koenigsschild",
  "koenigPassiv",
  "bauernvorstoss",
  "pattGesetzt",
  "schlagVerpasst",
  "bauernzugOhneNot",
  "koenigszugOhneNot",
]);

/** Kategorien, bei denen der Held einen Fehler gemacht hat. */
const FEHLERKATEGORIEN: ReadonlySet<string> = new Set(["fehler", "patzer", "ungenau"]);
/** Kategorien mit einer Chance für den Helden. */
const CHANCEKATEGORIEN: ReadonlySet<string> = new Set(["verpasst", "gegnerfehler"]);

/** Eine Figur als Wort der Spieltexte („dein Läufer“, „den Springer“). */
export function figurwort(rolle: Role | "zweiBauern", form: Form): string {
  return tSpiel(`besprechung.figur.${rolle}.${form}`);
}

/** Die Figur auf einem Feld der Stellung, oder null. */
function rolleAuf(fen: string, feld: Square): Role | null {
  return regelstellung(fen)?.board.get(feld)?.role ?? null;
}

/** Ein Zug der App (SAN, englisch) in der Sprache des Spiels. */
function zugtextVon(san: string): string {
  return sanInSprache(san, sprache());
}

/** Hängende Figur oder Bauer: welche, auf welchem Feld (Stellung nach dem Zug). */
function haengtUrsache(befund: Fehlerbefund, nachher: string): Ursache | null {
  const feld = befund.haengt;
  const rolle = feld === null ? null : rolleAuf(nachher, feld);
  if (feld === null || !rolle) return null;
  return {
    gruppe: "haengt",
    werte: { figur: figurwort(rolle, "dein"), feld: makeSquare(feld) },
    begriff: "haengend",
    rolle,
  };
}

/** Stehengebliebene Drohung: Matt oder der Schlag mit Ziel und Feld. */
function drohungUrsache(befund: Fehlerbefund): Ursache | null {
  const drohung = befund.drohung;
  if (!drohung) return null;
  const zug = zugtextVon(drohung.zug.san);
  if (drohung.art === "matt")
    return { gruppe: "drohungMatt", werte: { drohung: zug }, begriff: "matt" };
  const ziel = figurwort(drohung.zug.geschlagen, "deinen");
  const werte = { drohung: zug, ziel, feld: makeSquare(drohung.zug.nach) };
  return { gruppe: "drohung", werte, begriff: "haengend", rolle: drohung.zug.geschlagen };
}

/**
 * Übersehene Taktik: Gabel mit Figur und Feld; Fesselung und Spieß mit der vorderen Figur und der
 * dahinter, nur wenn beide dem Helden gehören. Abzug und andere Linien sagen nichts Eigenes (die
 * Lage der Figuren ist dort nicht eindeutig zu beschreiben); dann bleibt der Satz zum Begriff.
 */
function taktikUrsache(befund: Fehlerbefund, held: Color): Ursache | null {
  const taktik = befund.taktik;
  if (!taktik || taktik.art === "motiv") return null;
  if (taktik.art === "gabel") {
    const { figur, feld } = taktik.gabel;
    if (figur.figur.color === held) return null;
    const werte = {
      gegnerfigur: figurwort(figur.figur.role, "gegnerisch"),
      feld: makeSquare(feld),
    };
    return { gruppe: "gabel", werte, begriff: "gabel" };
  }
  const { art, vorn, hinten } = taktik.linie;
  if (art !== "fesselung" && art !== "spiess") return null;
  if (vorn.figur.color !== held || hinten.figur.color !== held) return null;
  const werte = {
    figur: figurwort(vorn.figur.role, "dein"),
    feld: makeSquare(vorn.feld),
    hinten: figurwort(hinten.figur.role, "deinen"),
  };
  return { gruppe: art, werte, begriff: art };
}

/** Die Ursache eines Befunds, oder null. */
function ursacheAus(
  befund: Fehlerbefund,
  nachher: string,
  zug: string,
  held: Color,
): Ursache | null {
  switch (befund.art) {
    case "figurHaengen":
    case "bauerEingestellt":
      return haengtUrsache(befund, nachher);
    case "drohungIgnoriert":
      return drohungUrsache(befund);
    case "taktikUebersehen":
      return taktikUrsache(befund, held);
    default:
      return ARTEN_MIT_ZUG.has(befund.art)
        ? { gruppe: befund.art, werte: { zug }, begriff: null }
        : null;
  }
}

/**
 * Die Ursache eines Fehlers des Helden (Fehler, Patzer, ungenau), oder null.
 * Beispiel: 3... Sf6?? im Schäfermatt → Gruppe „drohungMatt“ mit { drohung: "Dxf7#" }; ein Zug,
 * nach dem der Läufer c4 ungedeckt hängt → „haengt“ mit { figur: "dein Läufer", feld: "c4" }.
 */
export function ursacheVon(
  g: Motivgrundlage,
  moment: Besprechungsmoment,
  zug: string,
): Ursache | null {
  if (!FEHLERKATEGORIEN.has(moment.kategorie)) return null;
  const befund = fehlerbefundAn(g, moment.index);
  const held = regelstellung(g.fens[moment.index] ?? "")?.turn;
  if (!befund || !held) return null;
  return ursacheAus(befund, g.fens[moment.index + 1] ?? "", zug, held);
}

/**
 * Passen Ursache und Material zusammen? Nennt die Ursache eine Figur (hängt, bedroht) und kostet
 * der Fehler eine andere, schwerere, war die genannte Ursache nicht der Grund (Messlauf
 * 26.11.2026: „exd4 gedroht gegen den Bauern“, verloren ging aber der Turm durch eine Gabel). Dann
 * entfällt der Satz zur Ursache; der zum Material bleibt.
 * Beispiel: Ursache „haengt“ Läufer, Material Läufer → passt; Ursache Bauer, Material Turm → nicht.
 */
export function ursachePasst(ursache: Ursache | null, material: Materialfolge | null): boolean {
  if (!ursache?.rolle || material?.art !== "figur" || material.richtung !== "verlust") return true;
  if (material.rolle === "zweiBauern") return ursache.rolle === "pawn";
  return FIGURENWERT[material.rolle] <= FIGURENWERT[ursache.rolle];
}

/**
 * Was der Fehler kostet oder die Chance gebracht hätte, als Figur (besprechungsmaterial.ts).
 * Fehler: der gespielte Zug und die Widerlegung danach, aus Sicht des Helden „verlust“. Verpasste
 * Chance: die beste Folge an dieser Stelle; Fehler des Gegners: die beste Antwort danach, beide
 * „gewinn“. Andere Kategorien → null.
 */
export function materialVon(g: Motivgrundlage, moment: Besprechungsmoment): Materialfolge | null {
  const i = moment.index;
  const fen = g.fens[i] ?? "";
  const seite = regelstellung(fen)?.turn;
  if (!seite) return null;
  if (moment.kategorie === "fehler" || moment.kategorie === "patzer") {
    const gespielt = sanZuUci(fen, g.sans[i] ?? "");
    if (!gespielt) return null;
    return materialfolge(fen, [gespielt, ...besteFolge(g, i + 1)], seite, "verlust");
  }
  if (!CHANCEKATEGORIEN.has(moment.kategorie)) return null;
  const stelle = moment.kategorie === "gegnerfehler" ? i + 1 : i;
  const held =
    moment.kategorie === "gegnerfehler" ? (seite === "white" ? "black" : "white") : seite;
  const folge = materialfolge(g.fens[stelle] ?? "", besteFolge(g, stelle), held, "gewinn");
  // Beim Fehler des Gegners hat der Held die Antwort oft gespielt: Satz ohne „hättest“ (antwort).
  return folge && moment.kategorie === "gegnerfehler" ? { ...folge, antwort: true } : folge;
}
