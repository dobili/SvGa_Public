/**
 * Erklärung eines Fehlzuges im Rückblick: welche Drohung, welche hängende Figur, welche Taktik,
 * dazu die Markierungen am Brett.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38: „Bei der Auswertung
 * möchte ich wissen, welche Drohung, Taktik, hängende Figur es gab, mit Feldmarkierung.“ Die
 * Regeln sind dieselben, mit denen die Engine ihre absichtlichen Fehler einordnet
 * (engine/fehlerart.ts, Kapitel 1, 4 und 7); so urteilen Fehlersuche und Rückblick gleich. Die
 * Rechnung läuft erst, wenn der Leser die Stellung nachspielt (nur eine Stellung, ohne Engine).
 * Abhängigkeiten: engine/fehlerart.ts, analyse/texte.ts, schach/, i18n.
 */
import { makeSquare } from "chessops/util";
import { figurenname, figurImWenfall, schlagtext, zugtext } from "../analyse/texte";
import type { Markierung } from "../analyse/werkzeug";
import { fehlerbefundIn, lageVon, type Fehlerbefund, type Taktikbefund } from "../engine/fehlerart";
import { t } from "../i18n/sprache";
import { feldname } from "../schach/stellung";
import { regelstellung, uciZuSan } from "./zuege";

export interface Zugerklaerung {
  /** Ein Satz, etwa „lässt die Drohung Dxe5+ stehen (gewinnt den Bauern)“. */
  readonly text: string;
  readonly marken: readonly Markierung[];
}

/** UCI: zwei Zeichen Startfeld, zwei Zeichen Zielfeld. */
const FELDLAENGE = 2;

/** Roter Pfeil für einen Zug in UCI. */
function pfeil(uci: string): Markierung {
  return {
    typ: "pfeil",
    farbe: "rot",
    von: uci.slice(0, FELDLAENGE),
    nach: uci.slice(FELDLAENGE, 2 * FELDLAENGE),
  };
}

/** Ein Zug der Engine (UCI) in der Sprache des Buches, in der Stellung nach dem Fehlzug. */
function antworttext(danachFen: string, antwort: string): string {
  const san = antwort ? uciZuSan(danachFen, antwort) : null;
  return san ? zugtext(san) : "";
}

/** Die übersehene Taktik als Satz mit Markierungen. */
function taktik(befund: Taktikbefund, danachFen: string, antwort: string): Zugerklaerung {
  if (befund.art === "gabel") {
    const { gabel } = befund;
    return {
      text: t("erklaerung.gabel", {
        figur: figurenname(gabel.figur),
        feld: feldname(gabel.feld),
        ziele: gabel.ziele.map(feldname).join(", "),
      }),
      marken: [
        { typ: "pfeil", farbe: "rot", von: feldname(gabel.figur.feld), nach: feldname(gabel.feld) },
        ...gabel.ziele.map((z): Markierung => ({ typ: "feld", farbe: "rot", feld: feldname(z) })),
      ],
    };
  }
  if (befund.art === "linie") {
    const { linie } = befund;
    return {
      text: t("erklaerung.linie", {
        art: t(`erklaerung.linie.${linie.art}`),
        von: figurenname(linie.von),
        hinten: figurenname(linie.hinten),
      }),
      marken: [
        {
          typ: "pfeil",
          farbe: "rot",
          von: feldname(linie.von.feld),
          nach: feldname(linie.hinten.feld),
        },
      ],
    };
  }
  const zug = antworttext(danachFen, antwort);
  return {
    text: t("erklaerung.motiv", { motiv: t(`motiv.name.${befund.motiv}`), zug }),
    marken: antwort ? [pfeil(antwort)] : [],
  };
}

/** Die Figur auf einem Feld der Stellung nach dem Zug, als „Springer f6“. */
function figurAuf(danachFen: string, feld: number): string {
  const figur = regelstellung(danachFen)?.board.get(feld);
  return figur ? figurenname({ feld, figur }) : feldname(feld);
}

/** Der Satz und die Markierungen zu einem Befund. */
function erklaerungZu(
  befund: Fehlerbefund,
  danachFen: string,
  antwort: string,
): Zugerklaerung | null {
  const { drohung } = befund;
  if (befund.art === "drohungIgnoriert" && drohung) {
    const zug = zugtext(drohung.zug.san);
    const text =
      drohung.art === "matt"
        ? t("erklaerung.mattdrohung", { zug })
        : t("erklaerung.drohung", { zug, gewinn: schlagtext(drohung.zug) });
    const nach = feldname(drohung.zug.nach);
    return {
      text,
      marken: [
        { typ: "pfeil", farbe: "rot", von: feldname(drohung.zug.von), nach },
        { typ: "feld", farbe: "rot", feld: nach },
      ],
    };
  }
  if (befund.art === "figurHaengen" && befund.haengt !== null) {
    return {
      text: t("erklaerung.haengt", { figur: figurAuf(danachFen, befund.haengt) }),
      marken: [{ typ: "feld", farbe: "rot", feld: makeSquare(befund.haengt), text: "W1" }],
    };
  }
  if (befund.art === "taktikUebersehen" && befund.taktik) {
    return taktik(befund.taktik, danachFen, antwort);
  }
  if (befund.art === "schlagreflex") {
    const zug = antworttext(danachFen, antwort);
    return {
      text: zug ? t("erklaerung.schlagreflex", { zug }) : t("erklaerung.schlagreflexOhne"),
      marken: antwort ? [pfeil(antwort)] : [],
    };
  }
  if (befund.art === "verfruehteDame") return { text: t("erklaerung.dame"), marken: [] };
  if (befund.art === "koenigMitte") return { text: t("erklaerung.koenig"), marken: [] };
  return null;
}

/**
 * Erklärt einen Zug mit Zeichen: Fehlerart nach den Regeln des Buches, in Worten und am Brett.
 *
 * Eingaben: Stellung vor dem Zug (FEN), Stellung danach (FEN), der Zug (UCI), die beste Antwort
 * der Engine in der Stellung danach (UCI, darf leer sein), der Verlust in Bauerneinheiten.
 * Ausgabe: Satz und Markierungen, oder null, wenn keine Regel passt („ungenau“).
 * Beispiel: Abb. 1.13 nach 2. Dh5: 2... Sf6?? → „lässt die Drohung Dxe5+ stehen (gewinnt den
 * Bauern)“, roter Pfeil h5–e5, rotes Feld e5.
 * Sonderfall: Eine unlesbare Stellung oder ein unmöglicher Zug ergibt null.
 */
export function erklaereZug(
  vorherFen: string,
  danachFen: string,
  uci: string,
  antwort: string,
  verlust: number,
): Zugerklaerung | null {
  const lage = lageVon(vorherFen);
  if (!lage) return null;
  const befund = fehlerbefundIn(lage, uci, antwort ? [antwort] : [], verlust);
  return erklaerungZu(befund, danachFen, antwort);
}

/** Die Fehlerart in Worten, wie das Buch sie nennt („eine Drohung ignoriert“), für Tests und PGN. */
export function fehlerartText(vorherFen: string, uci: string, antwort: string): string | null {
  const lage = lageVon(vorherFen);
  if (!lage) return null;
  const befund = fehlerbefundIn(lage, uci, antwort ? [antwort] : [], null);
  return befund.art === "ungenau" ? null : t(`fehlerart.${befund.art}`);
}

/** Wenfall-Name einer Figur, falls der Rückblick die geschlagene Figur nennen will. */
export { figurImWenfall };
