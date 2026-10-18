/**
 * Erklärung eines Fehlzuges im Rückblick: welche Drohung, welche hängende Figur, welche Taktik,
 * dazu die Markierungen am Brett.
 *
 * Rolle im Gesamtbild: Rückmeldung des Autors zum Nachtest von 0.2.38: „Bei der Auswertung
 * möchte ich wissen, welche Drohung, Taktik, hängende Figur es gab, mit Feldmarkierung.“ Die
 * Regeln sind dieselben, mit denen die Engine ihre absichtlichen Fehler einordnet
 * (engine/fehlerart.ts, Kapitel 1, 4 und 7); so urteilen Fehlersuche und Rückblick gleich. Die
 * Rechnung läuft erst, wenn der Leser die Stellung nachspielt (nur eine Stellung, ohne Engine).
 * Seit 0.2.85 (Rückmeldung des Autors zu 10. Tab1?? in einer Partie gegen Mia) kennt der
 * Rückblick auch den ausgelassenen Schlag: Der beste Zug nahm eine Figur, der gespielte nicht;
 * hatte der Gegner gerade auf diesem Feld geschlagen, heißt es „schlägt nicht zurück“.
 * Abhängigkeiten: engine/fehlerart.ts, analyse/texte.ts, schach/, i18n.
 */
import { makeSquare, parseSquare } from "chessops/util";
import { figurenname, figurImWenfall, schlagtext, zugtext } from "../analyse/texte";
import type { Markierung } from "../analyse/werkzeug";
import { fehlerbefundIn, lageVon, type Fehlerbefund, type Taktikbefund } from "../engine/fehlerart";
import { t, type Textschluessel } from "../i18n/sprache";
import { feldname } from "../schach/stellung";
import { regelstellung, uciZuSan } from "./zuege";

export interface Zugerklaerung {
  /** Ein Satz, etwa „lässt die Drohung Dxe5+ stehen (gewinnt den Bauern)“. */
  readonly text: string;
  readonly marken: readonly Markierung[];
}

/** UCI: zwei Zeichen Startfeld, zwei Zeichen Zielfeld. */
const FELDLAENGE = 2;
/** Die Sätze der Fehlerarten je Phase (0.2.40); Arten ohne Eintrag haben eigene Sätze oder keinen. */
const PHASENTEXT: Readonly<Partial<Record<Fehlerbefund["art"], Textschluessel>>> = {
  tempoverlust: "erklaerung.tempoverlust",
  bauernraub: "erklaerung.bauernraub",
  koenigsschild: "erklaerung.koenigsschild",
  falscherAbtausch: "erklaerung.falscherAbtausch",
  koenigPassiv: "erklaerung.koenigPassiv",
  bauernvorstoss: "erklaerung.bauernvorstoss",
  pattGesetzt: "erklaerung.pattGesetzt",
};
/** Fehlerarten je Phase, bei denen das Zielfeld des Zuges rot markiert wird. */
const MIT_ZIELFELD: ReadonlySet<Fehlerbefund["art"]> = new Set([
  "koenigsschild",
  "bauernraub",
  "bauernvorstoss",
]);

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
  uci: string,
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
  const schluessel = PHASENTEXT[befund.art];
  if (!schluessel) return null;
  // Die Fehlerarten je Phase (0.2.40): ein Satz, bei Zügen einer Figur ihr Zielfeld rot.
  const zielfeld = uci.slice(FELDLAENGE, 2 * FELDLAENGE);
  return {
    text: t(schluessel),
    marken: MIT_ZIELFELD.has(befund.art) ? [{ typ: "feld", farbe: "rot", feld: zielfeld }] : [],
  };
}

/** Ab diesem Verlust (Zeichen „?“) lohnt der Satz zum ausgelassenen Schlag. */
const SCHLAG_AB_VERLUST = 1.2;

/**
 * Der ausgelassene Schlag (seit 0.2.85): Der beste Zug schlug eine Figur, der gespielte schlägt
 * sie nicht. Hatte der Gegner zuletzt auf diesem Feld geschlagen, fehlt der Rückschlag.
 * Regel: Kapitel 1, Abtausch (wer schlägt, rechnet mit dem Rückschlag; ohne ihn fehlt Material).
 * Beispiel: 9... Sxf4 10. Tab1?? statt exf4 → „schlägt nicht zurück: exf4 nahm den Springer f4
 * …“, rotes Feld f4.
 */
function ausgelassenerSchlag(
  vorherFen: string,
  uci: string,
  bester: string | null,
  vorigerSan: string | null,
): Zugerklaerung | null {
  const ziel = bester?.slice(FELDLAENGE, 2 * FELDLAENGE) ?? "";
  const feld = parseSquare(ziel);
  if (!bester || feld === undefined || uci === bester) return null;
  const stellung = regelstellung(vorherFen);
  const figur = stellung?.board.get(feld);
  if (!stellung || !figur || figur.color === stellung.turn || figur.role === "king") return null;
  if (uci.slice(FELDLAENGE, 2 * FELDLAENGE) === ziel) return null;
  const schlag = uciZuSan(vorherFen, bester);
  if (!schlag) return null;
  const rueckschlag = vorigerSan?.includes("x") && vorigerSan.replace(/[+#]/g, "").endsWith(ziel);
  const werte = { zug: zugtext(schlag), figur: `${figurImWenfall(figur.role)} ${ziel}` };
  return {
    text: t(rueckschlag ? "erklaerung.keinRueckschlag" : "erklaerung.schlagAusgelassen", werte),
    marken: [{ typ: "feld", farbe: "rot", feld: ziel }],
  };
}

/**
 * Erklärt einen Zug mit Zeichen: Fehlerart nach den Regeln des Buches, in Worten und am Brett.
 *
 * Eingaben: Stellung vor dem Zug (FEN), Stellung danach (FEN), der Zug (UCI), die beste Antwort
 * der Engine in der Stellung danach (UCI, darf leer sein), der Verlust in Bauerneinheiten, der
 * beste Zug der Engine vor dem Zug (UCI, für „passiver König“ und den ausgelassenen Schlag), der
 * Zug des Gegners davor in SAN (für „schlägt nicht zurück“, seit 0.2.85).
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
  bester: string | null = null,
  vorigerSan: string | null = null,
): Zugerklaerung | null {
  const lage = lageVon(vorherFen);
  if (!lage) return null;
  const schlag =
    verlust >= SCHLAG_AB_VERLUST ? ausgelassenerSchlag(vorherFen, uci, bester, vorigerSan) : null;
  // Der fehlende Rückschlag ist der Kern des Fehlers; ein anderer Schlag nur, wenn sonst nichts passt.
  if (schlag && vorigerSan?.includes("x")) return schlag;
  const befund = fehlerbefundIn(lage, uci, antwort ? [antwort] : [], verlust, bester);
  return erklaerungZu(befund, danachFen, antwort, uci) ?? schlag;
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
