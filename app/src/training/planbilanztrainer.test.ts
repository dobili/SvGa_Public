/** Tests der Planbilanz-Übung (Kapitel 6): Planfragen, LAP, Wettrennen an Buchstellungen. */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import { lapaufgabe, planaufgaben, rennaufgabe } from "./planbilanztrainer";
import { festerZufall } from "./zufall";

const KAPITELZAHL = 13;
const stellungen = buchstellungenAus(Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)));

describe("Planbilanz-Übung", () => {
  it("Planfragen: drei Fragen je Stellung, die richtige Antwort steht zur Wahl", () => {
    const aufgaben = planaufgaben(stellungen, festerZufall(3));
    expect(aufgaben.length).toBeGreaterThan(10);
    for (const a of aufgaben) {
      for (const f of a.fragen) {
        expect(f.antworten[f.richtig], `${a.nummer} ${f.frage}`).toBeDefined();
        expect(new Set(f.antworten).size).toBe(f.antworten.length);
      }
    }
    expect(aufgaben.some((a) => a.buchbilanz)).toBe(true);
    expect(aufgaben.flatMap((a) => a.fragen).some((f) => f.antworten[f.richtig]?.startsWith("Noch offen"))).toBe(false);
  });

  it("LAP: genug Stellungen, Figur und Zielfeld als Feldnamen", () => {
    const aufgaben = stellungen.flatMap((b) => lapaufgabe(b) ?? []);
    expect(aufgaben.length).toBeGreaterThan(10);
    expect(aufgaben.every((a) => /^[a-h][1-8]$/.test(a.figur))).toBe(true);
  });

  it("Wettrennen: Abb. 6.6 Weiß 2, Schwarz 3", () => {
    const b = stellungen.find((s) => s.nummer === "6.6");
    if (!b) throw new Error("6.6 fehlt");
    expect(rennaufgabe(b)?.zuege).toEqual({ white: 2, black: 3 });
    expect(stellungen.flatMap((s) => rennaufgabe(s) ?? []).length).toBeGreaterThan(3);
  });
});
