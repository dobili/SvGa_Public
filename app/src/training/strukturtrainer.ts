/**
 * Strukturerkenner (Kapitel 5): schwache Bauern im Skelett finden, den passenden Plan wählen.
 *
 * Rolle im Gesamtbild: Trainer „struktur“ (Pflichtenheft 7, AP 13). Die Aufgaben stammen aus
 * inhalte/de/trainer/struktur.json (Fable): Abbildungen des Buches mit Struktur, Seite am Zug,
 * Plan-Schlüssel und den Merkmalen des Skeletts (isolierte, doppelte, rückständige Bauern).
 * Die Plan-Sätze stehen in i18n/de.json. Falsche Antworten kommen nur aus anderen
 * Strukturfamilien, damit kein ebenfalls passender Plan als falsch gilt (etwa „Kette an der
 * Basis angreifen“ neben „auf dem Flügel der Kette spielen“). Reine Funktionen.
 * Abhängigkeiten: training/zufall.ts.
 * Buchbezug: Kapitel 5, „Skelett-Röntgen“ (Felder, Bauern, Richtung, Figuren).
 */
import type { Strukturaufgabe } from "../daten/trainerdaten";
import { mische, type Zufall } from "./zufall";

export type Plan = Strukturaufgabe["plan"];

/** Pläne, die zur selben Struktur gehören und deshalb gemeinsam gelten können. */
const FAMILIEN: readonly (readonly Plan[])[] = [
  ["kettenbasisAngreifen", "fluegelDerKette"],
  ["doppelbauerAngreifen", "doppelbauerAufloesen"],
  ["isolaniBlockieren", "isolaniVorstossen"],
  ["haengendeAngreifen", "haengendeVorstossen"],
  ["mehrheitVorstossen", "minderheitsangriff"],
  ["vorpostenBesetzen", "lochVermeiden", "luftlochSchaffen"],
  ["stellungOeffnen", "stellungSchliessen", "raumNutzen"],
  ["schlechtenLaeuferTauschen", "gutenLaeuferBehalten", "springerStattLaeufer"],
];
/** So viele Plan-Sätze stehen zur Wahl. */
export const PLAENE_ZUR_WAHL = 3;

function familieVon(plan: Plan): readonly Plan[] {
  return FAMILIEN.find((f) => f.includes(plan)) ?? [plan];
}

/**
 * Die schwachen Bauern beider Seiten: isoliert, doppelt oder rückständig (Kapitel 5, Bauern).
 *
 * Beispiel: Abb. 5.16 → a3 (isoliert), c3 und c4 (Doppelbauer).
 */
export function schwacheBauern(aufgabe: Strukturaufgabe): string[] {
  const m = aufgabe.merkmale;
  return [...new Set([...m.isolierte, ...m.doppelte, ...m.rueckstaendige])].sort();
}

/**
 * Die Plan-Sätze zur Wahl: der richtige und zwei aus anderen Strukturfamilien, gemischt.
 *
 * Beispiel: Isolani blockieren, dazu etwa „Mit der Mehrheit vorstoßen“ und „Die Stellung öffnen“.
 */
export function planwahl(aufgabe: Strukturaufgabe, zufall: Zufall): Plan[] {
  const eigene = familieVon(aufgabe.plan);
  const fremde = FAMILIEN.flat().filter((p) => !eigene.includes(p));
  const falsche = mische(fremde, zufall).slice(0, PLAENE_ZUR_WAHL - 1);
  return mische([aufgabe.plan, ...falsche], zufall);
}

/** Eine Runde, leichteste zuerst; mit gewählter Stufe die Aufgaben nahe daran. */
export function strukturrunde(
  aufgaben: readonly Strukturaufgabe[],
  stufe: number | null,
  anzahl: number,
  zufall: Zufall,
): Strukturaufgabe[] {
  const abstand = (a: Strukturaufgabe) =>
    stufe === null ? 0 : Math.abs(a.schwierigkeit - stufe);
  return mische(aufgaben, zufall)
    .sort((a, b) => abstand(a) - abstand(b))
    .slice(0, anzahl)
    .sort((a, b) => a.schwierigkeit - b.schwierigkeit);
}
