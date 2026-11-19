/**
 * Schutz vor dem Einschluss (einschluss.ts): die Nische im Clubraum nach der Szene mit Victor,
 * und über alle Karten des Spiels: Kein Ankunftsfeld und kein Startfeld gilt als Einschluss.
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ankunftsort } from "./ankunft";
import type { Sperrangabe, Tiledkarte } from "./begehbar";
import { ausEinschluss, NISCHE_HOECHSTENS } from "./einschluss";
import { ohneFigurenNachBedingung } from "../regeln/figurbedingung";

const KACHEL = 16;
/** Der Lauf über alle Karten und Fassungen braucht einige Sekunden. */
const ZEITGRENZE_MS = 60000;
const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);

function lies<T>(pfad: string): T {
  return JSON.parse(readFileSync(new URL(pfad, INHALTE), "utf8")) as T;
}

interface Ort {
  readonly kennung: string;
  readonly karten: readonly {
    readonly kennung: string;
    readonly datei: string;
    readonly zustaende?: Readonly<Record<string, string>>;
  }[];
  readonly figuren: readonly { readonly kennung: string; readonly wenn?: string }[];
  readonly ausloeser: readonly {
    readonly name: string;
    readonly art: string;
    readonly karte?: string;
  }[];
}

const orte = lies<{ orte: Ort[] }>("orte.json").orte;
const moebel: Record<string, Sperrangabe> = {};
for (const datei of readdirSync(new URL("moebel/", INHALTE))) {
  if (!datei.endsWith(".json")) continue;
  Object.assign(moebel, lies<{ moebel: Record<string, Sperrangabe> }>(`moebel/${datei}`).moebel);
}

/** Namen der Übergänge einer Karte, wie useWeltladen.ts sie der Szene gibt. */
function uebergaenge(ort: Ort, karte: string): string[] {
  return ort.ausloeser
    .filter((a) => a.art === "uebergang" && (!a.karte || a.karte === karte))
    .map((a) => a.name);
}

describe("Schutz vor dem Einschluss", () => {
  const maple = orte.find((o) => o.kennung === "mapleFalls") as Ort;
  const namen = uebergaenge(maple, "mapleFalls.clubraum");
  // Victor und sein Vater stehen nur während der Szene im Raum.
  const fassung = (datei: string) =>
    ohneFigurenNachBedingung(
      lies<Tiledkarte>(datei),
      (name) => maple.figuren.find((f) => f.kennung === `mapleFalls.${name}`)?.wenn,
      { victorGesehen: true, nadelMapleFalls: 1 },
    );

  it("holt den Helden aus der Nische neben Coach Delgado (Fassung mit dem Pult)", () => {
    const karte = fassung("karten/maple-falls-clubraum-bildschirm.json");
    const feld = ausEinschluss(karte, moebel, namen, { x: 16, y: 4 }, KACHEL);
    expect(feld).not.toBeNull();
    // Das neue Feld liegt nah an der alten Stelle, und von dort geht es weiter.
    const neu = feld as { x: number; y: number };
    expect(Math.abs(neu.x - 16) + Math.abs(neu.y - 4)).toBeLessThanOrEqual(3);
    // Nicht die Kachel unter dem Regal (17, 4): Dort stünde der Held halb im Möbel und käme
    // von dort wieder in die Nische (Befund im Browser, 18.11.2026).
    expect(neu).not.toEqual({ x: 17, y: 4 });
    expect(ausEinschluss(karte, moebel, namen, neu, KACHEL)).toBeNull();
  });

  it("lässt den Helden in Ruhe, wo er hinauskommt", () => {
    const pokal = fassung("karten/maple-falls-clubraum-pokal.json");
    // Vor der Szene ist rechts neben dem Coach noch offen.
    expect(ausEinschluss(pokal, moebel, namen, { x: 16, y: 4 }, KACHEL)).toBeNull();
    const bildschirm = fassung("karten/maple-falls-clubraum-bildschirm.json");
    expect(ausEinschluss(bildschirm, moebel, namen, { x: 15, y: 6 }, KACHEL)).toBeNull();
    expect(ausEinschluss(bildschirm, moebel, namen, { x: 13, y: 13 }, KACHEL)).toBeNull();
  });

  it("ein Feld dicht am Möbel, auf dem der Körper nicht mittig passt, ist kein Einschluss", () => {
    // Vor dem Kunden im Bergladen (8, 9): Die Physik schiebt den Helden dort selbst frei; das
    // Wegrücken nahm vier Oberflächentests das Gespräch (Gate, 19.11.2026).
    const summit = orte.find((o) => o.kennung === "summitCity") as Ort;
    const karte = lies<Tiledkarte>("karten/summit-city-bergladen.json");
    const tueren = uebergaenge(summit, "summitCity.bergladen");
    expect(ausEinschluss(karte, moebel, tueren, { x: 8, y: 9 }, KACHEL)).toBeNull();
  });

  it("rührt Karten ohne Übergang nicht an", () => {
    const karte = fassung("karten/maple-falls-clubraum-bildschirm.json");
    expect(ausEinschluss(karte, moebel, [], { x: 16, y: 4 }, KACHEL)).toBeNull();
  });

  it("die Grenze der Nische ist klein gegen jeden gewollten Bereich", () => {
    expect(NISCHE_HOECHSTENS).toBeLessThan(40);
  });

  it(
    "kein Ankunftsfeld und kein Startfeld irgendeiner Karte gilt als Einschluss",
    () => {
      const befunde: string[] = [];
      for (const ort of orte) {
        for (const k of ort.karten) {
          const namenHier = uebergaenge(ort, k.kennung);
          for (const datei of [k.datei, ...Object.values(k.zustaende ?? {})]) {
            const karte = lies<Tiledkarte>(datei);
            for (const name of [...namenHier, "start"]) {
              const an = ankunftsort(karte, moebel, name, KACHEL);
              if (!an) continue;
              const feld = ausEinschluss(karte, moebel, namenHier, an, KACHEL);
              if (feld)
                befunde.push(`${datei} ${name}: (${an.x}, ${an.y}) → (${feld.x}, ${feld.y})`);
            }
          }
        }
      }
      expect(befunde).toEqual([]);
    },
    ZEITGRENZE_MS,
  );
});
