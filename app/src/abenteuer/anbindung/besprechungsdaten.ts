/**
 * Die Einzelheiten der Momente einer Partiebesprechung aus der ausgewerteten Partie: Zugtext,
 * besserer Zug, Motiv, Folge, Eröffnungsname, dazu die Pfeile am Brett.
 *
 * Rolle im Gesamtbild: reine Rechnung zwischen dem gespeicherten Eintrag (speicher/partieeintrag.ts:
 * Werte, beste Züge, Hauptvarianten) und den Sätzen (anbindung/besprechungstexte.ts). Wird einmal
 * je Besprechung gerechnet (useBesprechung.ts), nur für die gewählten Momente.
 * Abhängigkeiten: anbindung/besprechungsmotiv.ts, spiel/erklaerung.ts, spiel/zuege.ts,
 * schach/notation.ts, schach/theorienamen.ts, ui/komponenten/auswertung/sprung.ts, spiel/auswertung.ts.
 */
import type { Markierung } from "../../analyse/werkzeug";
import { sprache } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import type { Theoriequellen } from "../../schach/theorie";
import { theorienamen } from "../../schach/theorienamen";
import { widerlegungAus } from "../../spiel/erklaerung";
import { stellungen } from "../../spiel/partie";
import { fenNach, uciZuSan } from "../../spiel/zuege";
import type { Partieeintrag } from "../../speicher/partien";
import { zugtext } from "../../ui/komponenten/auswertung/sprung";
import type { Besprechungsmoment } from "../regeln/besprechungsmomente";
import { momentmotiv, type Motivgrundlage } from "./besprechungsmotiv";
import type { Momentangaben } from "./besprechungstexte";

/** So viele Halbzüge der besseren Fortsetzung nennt Ambrose ab Stufe 3. */
const FOLGE_HALBZUEGE = 2;
/** UCI: zwei Zeichen Startfeld, zwei Zeichen Zielfeld. */
const FELDLAENGE = 2;

/** Kategorien, bei denen der bessere Zug an der Stelle nach dem Zug liegt (Antwort des Helden). */
const NACH_DEM_ZUG: ReadonlySet<string> = new Set(["gegnerfehler"]);
/** Kategorien, deren Folge die Widerlegung durch den Gegner ist (nach dem eigenen Zug). */
const FOLGE_DES_GEGNERS: ReadonlySet<string> = new Set(["fehler", "patzer", "ungenau"]);

/** Ein Zug in UCI als SAN in der Sprache der App, oder null. */
function sanDeutsch(fen: string, uci: string | undefined): string | null {
  const san = uci ? uciZuSan(fen, uci) : null;
  return san ? sanInSprache(san, sprache()) : null;
}

/** Eine Zugfolge in UCI ab einer Stellung als Text („Sxe5 Dh5“), höchstens `anzahl` Halbzüge. */
export function folgetext(fen: string, folge: readonly string[], anzahl: number): string | null {
  const teile: string[] = [];
  let stand = fen;
  for (const uci of folge.slice(0, anzahl)) {
    const san = uciZuSan(stand, uci);
    if (!san) break;
    teile.push(sanInSprache(san, sprache()));
    stand = naechsteFen(stand, uci) ?? "";
    if (!stand) break;
  }
  return teile.length > 0 ? teile.join(" ") : null;
}

/** Stellung nach einem UCI-Zug (über SAN, damit die Rochade stimmt). */
function naechsteFen(fen: string, uci: string): string | null {
  const san = uciZuSan(fen, uci);
  return san ? fenNach(fen, san) : null;
}

/** Die Grundlage der Motiverkennung aus dem Eintrag. */
export function motivgrundlage(
  eintrag: Partieeintrag,
  verluste: readonly number[],
): Motivgrundlage {
  return {
    fens: stellungen(eintrag.partie),
    sans: eintrag.partie.zuege.map((z) => z.san),
    beste: eintrag.beste,
    varianten: eintrag.varianten,
    verluste,
  };
}

/** Der Name der Eröffnung nach dem Zug am Index, oder null. */
function eroeffnungsname(
  quellen: Theoriequellen | null,
  g: Motivgrundlage,
  index: number,
): string | null {
  if (!quellen) return null;
  const auskunft = theorienamen(quellen, g.fens.slice(0, index + 2), g.sans.slice(0, index + 1));
  return auskunft.namen[0]?.name ?? null;
}

/**
 * Die Einzelheiten eines Moments.
 * Beispiel: Fehler bei 7. Lc4 (Index 12), beste d4, Widerlegung Sxe5 Dh5 → zug „7. Lc4“, besser
 * „d4“, folge „Sxe5 Dh5“.
 * Sonderfall: Ist der beste Zug der gespielte, gibt es keinen besseren (null).
 */
export function momentangaben(
  eintrag: Partieeintrag,
  g: Motivgrundlage,
  moment: Besprechungsmoment,
  quellen: Theoriequellen | null,
): Momentangaben {
  const i = moment.index;
  const stelle = NACH_DEM_ZUG.has(moment.kategorie) ? i + 1 : i;
  const bester = eintrag.beste[stelle];
  const gespielt =
    stelle === i && bester !== undefined && uciZuSan(g.fens[i] ?? "", bester) === g.sans[i];
  const folgeStelle = FOLGE_DES_GEGNERS.has(moment.kategorie) ? i + 1 : stelle;
  const folge = widerlegungAus(eintrag.beste[folgeStelle], eintrag.varianten[folgeStelle]);
  return {
    moment,
    zug: zugtext(eintrag.partie, i),
    besser: gespielt ? null : sanDeutsch(g.fens[stelle] ?? "", bester),
    motiv: momentmotiv(g, moment),
    folge: folgetext(g.fens[folgeStelle] ?? "", folge, FOLGE_HALBZUEGE),
    eroeffnung: moment.kategorie === "theorie" ? eroeffnungsname(quellen, g, i) : null,
  };
}

/**
 * Der goldene Pfeil am Brett eines Moments: der bessere Zug (bei Fehlern aus der Stellung vor dem
 * Zug, beim Fehler des Gegners die Antwort des Helden); leer ohne besseren Zug (Theorie, der Held
 * hat den besten Zug gespielt).
 */
export function momentpfeile(eintrag: Partieeintrag, angaben: Momentangaben): Markierung[] {
  const moment = angaben.moment;
  const stelle = NACH_DEM_ZUG.has(moment.kategorie) ? moment.index + 1 : moment.index;
  const uci = eintrag.beste[stelle] ?? "";
  if (angaben.besser === null || moment.kategorie === "theorie" || uci.length < 2 * FELDLAENGE) {
    return [];
  }
  const von = uci.slice(0, FELDLAENGE);
  const nach = uci.slice(FELDLAENGE, 2 * FELDLAENGE);
  return [{ typ: "pfeil", farbe: "gold", von, nach }];
}
