/** Tests von „Falle oder Köder“ an allen Aufgaben aus inhalte/de/trainer/falle.json. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Fallendaten } from "../daten/trainerdaten";
import { fenNachZuegen } from "../schach/weiterspielen";
import {
  fallenrunde,
  pruefeEntscheidung,
  widerlegungszug,
  wirkungDerWiderlegung,
} from "./fallentrainer";
import { festerZufall } from "./zufall";

const DATEI = new URL("../../../inhalte/de/trainer/falle.json", import.meta.url);
const daten = JSON.parse(readFileSync(DATEI, "utf8")) as Fallendaten;
const RUNDE = 8;

function aufgabe(id: string) {
  const a = daten.aufgaben.find((x) => x.id === id);
  if (!a) throw new Error(`${id} fehlt`);
  return a;
}

describe("Falle oder Köder", () => {
  it("jedes Angebot ist der erste Zug der Fortsetzung und in der Stellung spielbar", () => {
    const kaputt = daten.aufgaben.filter(
      (a) => a.fortsetzung[0] !== a.angebot || fenNachZuegen(a.fen, a.fortsetzung) === null,
    );
    expect(kaputt.map((a) => a.id)).toEqual([]);
  });

  it("jeder Köder-Zug führt von der Stellung davor zur Aufgabenstellung", () => {
    const kaputt = daten.aufgaben.filter(
      (a) => fenNachZuegen(a.fenVorher, [a.vorzug]) !== a.fen,
    );
    expect(kaputt.map((a) => a.id)).toEqual([]);
  });

  it("jede Falle lässt den Leser klar schlechter stehen als vor dem Nehmen (R50)", () => {
    const { falleAbVerlust, falleSchlechterAb, geschenkBisVerlust } = daten.massstab;
    for (const a of daten.aufgaben) {
      if (a.antwort === "falle") {
        expect(a.wertVorher - a.wertNachher, a.id).toBeGreaterThanOrEqual(falleAbVerlust);
        expect(a.wertNachher, a.id).toBeLessThanOrEqual(-falleSchlechterAb);
      } else {
        expect(a.wertVorher - a.wertNachher, a.id).toBeLessThanOrEqual(geschenkBisVerlust);
      }
    }
  });

  it("Klammerfalle (Abb. 4.2): nicht nehmen ist richtig, der Köder-Zug ist axb5", () => {
    const klammer = aufgabe("falle-b-4.2");
    expect(pruefeEntscheidung(klammer, false)).toBe(true);
    expect(pruefeEntscheidung(klammer, true)).toBe(false);
    expect(klammer.vorzug).toBe("axb5");
    expect(widerlegungszug(klammer)).toBe("Qf3");
  });

  it("Légal-Falle (Abb. 4.17): die Widerlegung endet matt", () => {
    expect(wirkungDerWiderlegung(aufgabe("falle-b-4.17"))).toBe("matt");
  });

  it("eine Runde mischt Fallen und Geschenke nahe an der Stufe", () => {
    const runde = fallenrunde(daten.aufgaben, 2, RUNDE, festerZufall(3));
    expect(runde).toHaveLength(RUNDE);
    expect(runde.filter((a) => a.antwort === "falle")).toHaveLength(RUNDE / 2);
    expect(runde.every((a) => Math.abs(a.schwierigkeit - 2) <= 1)).toBe(true);
  });
});
