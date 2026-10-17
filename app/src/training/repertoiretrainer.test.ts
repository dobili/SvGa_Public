/** Tests des Repertoire-Trainers (AP 13) an den Zugfolgen aus Kapitel 2. */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import {
  anfang,
  eroeffnungenAus,
  gegnerAmZug,
  HOECHSTENS_HALBZUEGE,
  istBuchzug,
  MINDESTENS_HALBZUEGE,
  mitAntwort,
  repertoirerunde,
  varianten,
} from "./repertoiretrainer";

const eroeffnungen = eroeffnungenAus(ladeKapitel(2));

describe("Repertoire-Trainer", () => {
  it("die Eröffnungen sind die Abschnitte mit Steckbrief, ohne Übungen", () => {
    const titel = eroeffnungen.map((e) => e.titel);
    expect(titel[0]).toBe("Die Spanische Partie (Ruy Lopez)");
    expect(titel.some((x) => x.startsWith("Übung"))).toBe(false);
    expect(titel.some((x) => x.includes("1. d4"))).toBe(true);
    expect(eroeffnungen.length).toBeGreaterThanOrEqual(12);
  });

  it("jede Eröffnung hat mindestens eine regelgerechte Variante passender Länge", () => {
    for (const e of eroeffnungen) {
      const v = varianten(e.beispiel);
      expect(v.length, e.titel).toBeGreaterThan(0);
      for (const linie of v) {
        expect(linie.length).toBeGreaterThanOrEqual(MINDESTENS_HALBZUEGE);
        expect(linie.length).toBeLessThanOrEqual(HOECHSTENS_HALBZUEGE);
      }
    }
  });

  it("Spanisch: als Weiß beginnt der Leser, als Schwarz steht 1. e4 schon da", () => {
    const spanisch = eroeffnungen[0];
    if (!spanisch) throw new Error("Spanisch fehlt");
    const [weiss] = repertoirerunde(spanisch, "white", 8);
    const [schwarz] = repertoirerunde(spanisch, "black", 8);
    if (!weiss || !schwarz) throw new Error("keine Variante");
    expect(weiss.linie.slice(0, 5)).toEqual(["e4", "e5", "Nf3", "Nc6", "Bb5"]);
    expect(anfang(weiss)).toEqual([]);
    expect(anfang(schwarz)).toEqual(["e4"]);
    expect(gegnerAmZug(weiss, 1)).toBe(true);
    expect(istBuchzug(weiss, 0, "e4")).toBe(true);
    expect(istBuchzug(weiss, 0, "d4")).toBe(false);
    expect(mitAntwort(weiss, [])).toEqual(["e4", "e5"]);
  });
});

// W10: Warum-Fragen an Schlüsselzügen aus den vorbereiteten Texten zu Kapitel 2.
describe("Warum-Fragen im Repertoire-Trainer", () => {
  const kapitel = ladeKapitel(2);
  const eroeffnungen = eroeffnungenAus(kapitel);
  const alle = eroeffnungen.flatMap((e) =>
    repertoirerunde(e, "white", 99, kapitel.abbildungen).flatMap((a) => a.fragen ?? []),
  );

  it("findet Fragen an Zügen vieler Varianten (gemessen 20 verschiedene)", () => {
    const verschiedene = new Set(alle.map((f) => f.zug));
    expect(verschiedene.size).toBeGreaterThanOrEqual(18);
  });

  it("Spanische Partie: „Warum spielt Schwarz 3... a6?“ nach dem sechsten Halbzug", () => {
    const spanisch = eroeffnungen.find((e) => e.titel.includes("Spanische Partie"));
    if (!spanisch) throw new Error("Spanische Partie fehlt");
    const [erste] = repertoirerunde(spanisch, "black", 1, kapitel.abbildungen);
    const frage = erste?.fragen?.find((f) => f.zug === "3... a6");
    expect(frage?.stelle).toBe(5);
    expect(erste?.linie[5]).toBe("a6");
  });
});
