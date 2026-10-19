/**
 * Strukturerkenner (Kapitel 5): starke Felder und schwache Bauern im Skelett finden, den
 * passenden Plan wählen (drei Schritte in der Reihenfolge der Leitfragen, W5).
 *
 * Rolle im Gesamtbild: Trainer „struktur“ (Pflichtenheft 7, AP 13). Die Aufgaben stammen aus
 * inhalte/de/trainer/struktur.json (Fable): Abbildungen des Buches mit Struktur, Seite am Zug,
 * Plan-Schlüssel und den Merkmalen des Skeletts (isolierte, doppelte, rückständige Bauern).
 * Die Plan-Sätze stehen in i18n/de.json. Falsche Antworten kommen nur aus anderen
 * Strukturfamilien, damit kein ebenfalls passender Plan als falsch gilt (etwa „Kette an der
 * Basis angreifen“ neben „auf dem Flügel der Kette spielen“). Reine Funktionen.
 * Abhängigkeiten: training/zufall.ts, schach/bauernprofil.ts (Löcher).
 * Buchbezug: Kapitel 5, „Skelett-Röntgen“ (Felder, Bauern, Richtung, Figuren).
 */
import type { Color } from "chessops/types";
import type { Strukturaufgabe } from "../daten/trainerdaten";
import { bauernprofil, eigeneReihe } from "../schach/bauernprofil";
import { feldname, gegner, stellungAusFen } from "../schach/stellung";
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
/** Die 5. und 6. Reihe aus Sicht der Seite am Zug (Index ab 0), wie die Checkliste zur Leitfrage 1. */
const STARKE_REIHEN: readonly number[] = [4, 5];
/** Mehr starke Felder fragt der Schritt nicht ab (Lehrbilder mit wenigen Bauern): Er entfällt. */
export const HOECHSTENS_STARKE_FELDER = 4;

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
 * Die starken Felder der Seite am Zug: Felder auf ihrer 5. und 6. Reihe, die kein gegnerischer
 * Bauer mehr angreifen kann (Löcher des Gegners), ohne Bauern darauf. Allein aus dem Skelett.
 *
 * Warum: Leitfrage 1 kommt zuerst, weil man Felder sonst übersieht („da dort zumeist gar nichts
 * steht“). Regel: Kapitel 5, Checkliste zur Leitfrage 1: „Gehe die Felder in der gegnerischen
 * Hälfte durch, vor allem auf der 5. und 6. Reihe (von dir aus gezählt), und frage bei jedem:
 * Kann ein gegnerischer Bauer es je wieder angreifen? Wenn nein, ist es ein Loch und damit ein
 * starkes Feld für dich.“
 * Ausgabe: Felder in Kurzform, sortiert; null, wenn es mehr als vier sind (der Schritt entfällt).
 * Beispiel: Abb. 5.8 (Najdorf, Weiß am Zug) → b6 und d5.
 */
export function starkeFelder(aufgabe: Strukturaufgabe): string[] | null {
  const gelesen = stellungAusFen(aufgabe.fen);
  if (!gelesen.ok) return null;
  const brett = gelesen.wert.brett;
  const seite: Color = aufgabe.seite === "w" ? "white" : "black";
  const felder = bauernprofil(brett, gegner(seite))
    .loecher.filter((f) => STARKE_REIHEN.includes(eigeneReihe(f, seite)))
    .filter((f) => brett.get(f)?.role !== "pawn")
    .map(feldname)
    .sort();
  return felder.length > HOECHSTENS_STARKE_FELDER ? null : felder;
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
  const abstand = (a: Strukturaufgabe) => (stufe === null ? 0 : Math.abs(a.schwierigkeit - stufe));
  return mische(aufgaben, zufall)
    .sort((a, b) => abstand(a) - abstand(b))
    .slice(0, anzahl)
    .sort((a, b) => a.schwierigkeit - b.schwierigkeit);
}
