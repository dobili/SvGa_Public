/**
 * Spielstand zu Beginn eines Akts für den Spieler-Durchlauf: rechnet den Stand der
 * Gesamtsimulation (pipeline/abenteuer/aktstand.cjs) in einen Spielstand der App um.
 *
 * Warum: Das ganze Spiel dauert mit echten Eingaben viele Stunden. Akt 2, 3 und 4 dürfen deshalb
 * zusätzlich je von ihrem Beginn an gespielt werden, mit einem Stand, den die Logik der Simulation
 * erspielt hat (Erweiterung des Auftrags, 18.11.2026). Kein Wert wird hier erfunden: Quests,
 * Variablen, Besitz, Karten, Münzen und besuchte Orte kommen aus der Simulation; Akt und Szene
 * folgen aus den erledigten Questschritten (wie regeln/quests.ts die Wirkung „szene“ anwendet),
 * die Position ist der Start oder die Ankunft an einem Übergang der Karte der Simulation.
 * Grenzen: Funde, Steckbriefe, Partienprotokoll und Wertung kennt die Simulation nicht; sie
 * bleiben wie bei einem neuen Spiel. Messungen aus so einem Stand heißen im Bericht „ab
 * simuliertem Aktbeginn“.
 * Abhängigkeiten: regeln/spielstand.ts (leerer Stand), oberwelt/ankunft.ts, welt.ts.
 * Beispiel: standAus(daten, simulation zu Akt 4) → Akt 4, Position vor einem Ausgang der Karte.
 */
import { readFileSync } from "node:fs";
import { ankunftsort } from "../../src/abenteuer/oberwelt/ankunft";
import type { Tiledkarte } from "../../src/abenteuer/oberwelt/begehbar";
import { kartenfassung } from "../../src/abenteuer/oberwelt/kartenfassung";
import { leererAbenteuerstand } from "../../src/abenteuer/regeln/spielstand";
import type { Nadelstufe } from "../../src/abenteuer/schnittstelle/partie";
import type { Abenteuerstand } from "../../src/abenteuer/schnittstelle/spielstand";
import { KACHEL, findeKarte, lies, regelFuer, type Spieldaten } from "./welt";

/** Der Stand der Gesamtsimulation, wie aktstand.cjs ihn schreibt. */
interface Simulationsstand {
  readonly akt: number;
  readonly vars: Readonly<Record<string, number | string | boolean>>;
  readonly besitz: readonly string[];
  readonly karten: Readonly<Record<string, number>>;
  readonly muenzen: number;
  readonly staende: readonly { readonly k: string; readonly i: number; readonly fertig: boolean }[];
  readonly karte: string;
  readonly besucht: readonly string[];
  readonly runden: Readonly<Record<string, number>>;
}

/** Nadelstufe je Wert der Variablen `nadel<Ort>` (regeln/dialogvariablen.ts). */
const NADEL: Readonly<Record<number, Nadelstufe>> = { 1: "bronze", 2: "silber", 3: "gold" };
/** Fester Zeitpunkt des Stands; die Reihenfolge der Quests zählt in Sekunden weiter. */
const BEGINN = Date.parse("2026-11-18T08:00:00.000Z");
const MS_JE_SEKUNDE = 1000;

/** Akt und Szene aus den erledigten Questschritten (letzte Wirkung „szene“ im höchsten Akt). */
function handlungAus(sim: Simulationsstand): { akt: number; szene: string } {
  let handlung = { akt: sim.akt, szene: `akt${sim.akt}.beginn` };
  let bester = 0;
  const quests = lies<{ quests: Questwirkungen[] }>("quests.json").quests;
  for (const s of sim.staende) {
    const quest = quests.find((q) => q.kennung === s.k);
    const fertig = (quest?.schritte ?? []).slice(0, s.fertig ? undefined : s.i);
    for (const schritt of fertig) {
      for (const w of schritt.wirkungen ?? []) {
        if (w.art !== "szene" || w.akt === undefined || w.szene === undefined) continue;
        if (w.akt >= bester && w.akt <= sim.akt) {
          bester = w.akt;
          handlung = { akt: w.akt, szene: w.szene };
        }
      }
    }
  }
  return handlung;
}

/** Wirkungen der Questschritte, so weit hier gebraucht. */
interface Questwirkungen {
  readonly kennung: string;
  readonly schritte: readonly {
    readonly wirkungen?: readonly { art: string; akt?: number; szene?: string }[];
  }[];
}

/** Ein Feld auf der Karte, an dem der Held stehen kann: der Start, sonst vor einem Übergang. */
function feldAuf(daten: Spieldaten, kennung: string, variablen: Record<string, unknown>) {
  const fund = findeKarte(daten, kennung);
  if (!fund) throw new Error(`Karte ${kennung} der Simulation fehlt in orte.json`);
  const karte = lies<Tiledkarte>(kartenfassung(fund.karte, variablen).datei);
  const namen = karte.layers.flatMap((e) => (e.objects ?? []).map((o) => o.name ?? ""));
  const tueren = namen.filter((n) => regelFuer(fund.ort, kennung, n)?.art === "uebergang");
  for (const name of [...tueren, "start"]) {
    const an = ankunftsort(karte, daten.moebel, name, KACHEL);
    if (an) return { x: an.x, y: an.y, richtung: an.richtung };
  }
  throw new Error(`Auf ${kennung} gibt es weder Übergang noch Start`);
}

/**
 * Der Spielstand der App zum Stand der Simulation in `datei`.
 * Sonderfall: Clubs entstehen aus den Variablen `nadel<Ort>` der Orte mit Club.
 */
export function standAus(daten: Spieldaten, datei: string): Abenteuerstand {
  const sim = JSON.parse(readFileSync(datei, "utf8")) as Simulationsstand;
  const zeit = (i: number) => new Date(BEGINN + i * MS_JE_SEKUNDE).toISOString();
  const leer = leererAbenteuerstand(new Date(BEGINN), "Kim", null, false);
  // Der Name des Helden steht im Stand, nicht in den Variablen.
  const variablen = Object.fromEntries(
    Object.entries(sim.vars).filter(([name]) => name !== "held"),
  );
  const gross = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const clubs = daten.orte.flatMap((ort) => {
    const nadel = NADEL[Number(variablen[`nadel${gross(ort.kennung)}`] ?? 0)];
    return nadel ? [{ kennung: ort.kennung, nadel, aufgabenreihe: true, versuche: 1 }] : [];
  });
  return {
    ...leer,
    handlung: { ...leer.handlung, ...handlungAus(sim) },
    position: { karte: sim.karte, ...feldAuf(daten, sim.karte, variablen) },
    clubs,
    quests: sim.staende.map((s, i) => ({
      kennung: s.k,
      schritt: s.i,
      erledigt: s.fertig,
      angenommen: zeit(i),
      erledigtAm: s.fertig ? zeit(i) : null,
    })),
    karten: Object.entries(sim.karten)
      .filter(([, anzahl]) => anzahl > 0)
      .map(([kennung, anzahl]) => ({ kennung, anzahl, erhalten: zeit(0) })),
    muenzen: sim.muenzen,
    gegenstaende: [...sim.besitz],
    besuchteOrte: [...sim.besucht],
    runden: Object.keys(sim.runden).map((kennung) => ({
      kennung,
      bestanden: true,
      versuche: sim.runden[kennung] ?? 1,
      punkte: 1,
      moeglich: 1,
    })),
    dialogvariablen: variablen,
  };
}
