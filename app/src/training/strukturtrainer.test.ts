/** Tests des Strukturerkenners an allen Aufgaben aus inhalte/de/trainer/struktur.json. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Strukturdaten } from "../daten/trainerdaten";
import de from "../i18n/de.json";
import {
  FELDARTEN,
  feldarten,
  feldartfrage,
  PLAENE_ZUR_WAHL,
  planwahl,
  schwacheBauern,
  starkeFelder,
  starkeFelderMitArt,
  strukturrunde,
} from "./strukturtrainer";
import { festerZufall } from "./zufall";

const DATEI = new URL("../../../inhalte/de/trainer/struktur.json", import.meta.url);
const daten = JSON.parse(readFileSync(DATEI, "utf8")) as Strukturdaten;
const texte: Record<string, string> = de;

describe("Strukturerkenner", () => {
  it("jeder Plan und jede Struktur hat einen Satz in de.json", () => {
    const fehlend = daten.aufgaben.flatMap((a) =>
      [`struktur.plan.${a.plan}`, `struktur.art.${a.struktur}`].filter((k) => !texte[k]),
    );
    expect([...new Set(fehlend)]).toEqual([]);
  });

  it("Abb. 5.16: a3 isoliert, c3 und c4 doppelt", () => {
    const aufgabe = daten.aufgaben.find((a) => a.id === "struktur-b-5.16");
    if (!aufgabe) throw new Error("struktur-b-5.16 fehlt");
    expect(schwacheBauern(aufgabe)).toEqual(["a3", "c3", "c4"]);
  });

  const aufgabe = (id: string) => {
    const a = daten.aufgaben.find((x) => x.id === id);
    if (!a) throw new Error(`${id} fehlt`);
    return a;
  };

  // W5: Leitfrage 1 zuerst; seit P3/R49 die 4. bis 6. Reihe wie das Werkzeug „Felder“.
  it("starke Felder: Abb. 5.8 d5 als Vorposten und b6, Abb. 5.3 keine", () => {
    const najdorf = starkeFelderMitArt(aufgabe("struktur-b-5.8"));
    expect(najdorf?.map((f) => f.feld)).toContain("d5");
    expect(najdorf?.find((f) => f.feld === "d5")?.vorposten).toBe(true);
    expect(starkeFelder(aufgabe("struktur-b-5.8"))).toContain("b6");
    expect(starkeFelder(aufgabe("struktur-b-5.3"))).toEqual([]);
  });

  it("R49: Feldarten aus Sicht der Seite am Zug, Abb. 5.8: d5 Vorposten, d6 rückständig", () => {
    const funde = feldarten(aufgabe("struktur-b-5.8"));
    expect(funde).toContainEqual({ feld: "d5", art: "vorposten" });
    expect(funde).toContainEqual({ feld: "d6", art: "rueckstaendigerBauer" });
    const frage = feldartfrage(aufgabe("struktur-b-5.8"), festerZufall(2));
    expect(frage?.optionen).toEqual(FELDARTEN);
    expect(funde.map((f) => f.art)).toContain(frage?.richtig);
    // Jede Aufgabe hat lesbare Felder, und die meisten eine Feldart-Frage.
    const mitFrage = daten.aufgaben.filter((a) => feldartfrage(a, festerZufall(1)) !== null);
    expect(mitFrage.length).toBeGreaterThan(daten.aufgaben.length / 2);
  });

  it("R49: Stellungen aus den Partien des Buches sind dabei", () => {
    const partien = daten.aufgaben.filter((a) => a.herkunft.quelle === "buch" && a.herkunft.beispiel);
    expect(partien.length).toBeGreaterThan(10);
  });

  it("die Wahl enthält den richtigen Plan und keinen aus derselben Familie", () => {
    for (const aufgabe of daten.aufgaben) {
      const wahl = planwahl(aufgabe, festerZufall(4));
      expect(wahl).toHaveLength(PLAENE_ZUR_WAHL);
      expect(wahl).toContain(aufgabe.plan);
      if (aufgabe.plan === "kettenbasisAngreifen") expect(wahl).not.toContain("fluegelDerKette");
    }
  });

  it("eine Runde hat acht Aufgaben nahe an der Stufe", () => {
    const runde = strukturrunde(daten.aufgaben, 3, 8, festerZufall(5));
    expect(runde).toHaveLength(8);
    expect(runde.every((a) => Math.abs(a.schwierigkeit - 3) <= 1)).toBe(true);
  });
});
