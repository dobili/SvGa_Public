/**
 * Tests der Startkarte (Entwurf G1): Beispielstellungen, Einstellzeilen, gemerkte Werte.
 *
 * Warum: Jede Beispielstellung muss eine gültige, regelgerechte Stellung sein, sonst zeigt die
 * Startkarte ein leeres oder falsches Brett; die gemerkten Werte dürfen nie einen Wert liefern,
 * den die Zeile nicht kennt (etwa ein gelöschtes Motiv).
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { stellungAusFen } from "../../../schach/stellung";
import { TRAINER } from "../../../training/trainer";
import {
  ALLE,
  aufgabenzahl,
  einstellung,
  stufeAus,
  stufenwert,
  wiederholung,
  wortstufenzeile,
  zahlstufen,
} from "./einstellung";
import { gemerkterWert, merkeWert } from "./useGemerkt";
import { TRAINERSTARTS } from "./trainerstarts";

/** Ersatz für localStorage in der Node-Umgebung der Tests. */
function ersatzspeicher(): Storage {
  const werte = new Map<string, string>();
  return {
    get length() {
      return werte.size;
    },
    clear: () => werte.clear(),
    getItem: (schluessel) => werte.get(schluessel) ?? null,
    key: (index) => [...werte.keys()][index] ?? null,
    removeItem: (schluessel) => void werte.delete(schluessel),
    setItem: (schluessel, wert) => void werte.set(schluessel, wert),
  };
}

const FELD = /^[a-h][1-8]$/;

describe("Beispielstellungen der Startkarten", () => {
  it("jede FEN ist regelgerecht und jede Markierung trifft ein Feld", () => {
    for (const [kennung, start] of Object.entries(TRAINERSTARTS)) {
      const stellung = stellungAusFen(start.fen);
      expect(stellung.ok, kennung).toBe(true);
      if (stellung.ok) expect(stellung.wert.regeln, kennung).not.toBeNull();
      for (const m of start.markierungen) {
        const felder = m.typ === "pfeil" ? [m.von, m.nach] : [m.feld];
        for (const f of felder) expect(f, kennung).toMatch(FELD);
      }
    }
  });

  it("nur Trainer aus TRAINER haben eine Startkarte", () => {
    for (const kennung of Object.keys(TRAINERSTARTS))
      expect(TRAINER.some((tr) => tr.kennung === kennung)).toBe(true);
  });
});

describe("Einstellzeilen", () => {
  it("Stufen: „alle“ und 1 bis 5 hin und zurück", () => {
    expect(zahlstufen([1, 2]).map((o) => o.wert)).toEqual([ALLE, "1", "2"]);
    expect(stufeAus(ALLE)).toBeNull();
    expect(stufeAus("3")).toBe(3);
    expect(stufeAus("x")).toBeNull();
    expect(stufenwert(null)).toBe(ALLE);
    expect(stufenwert(4)).toBe("4");
  });

  it("einstellung übernimmt nur Werte aus den Optionen", () => {
    const gesetzt: string[] = [];
    const zeile = einstellung({
      kennung: "seite",
      titel: "Seite",
      symbol: "seite",
      optionen: [{ wert: "white", text: "Weiß" }],
      wert: "white",
      setze: (w) => gesetzt.push(w),
    });
    zeile.setze("black");
    zeile.setze("white");
    expect(gesetzt).toEqual(["white"]);
  });

  it("Wortstufen: „gemischt“ ergibt null", () => {
    let stufe: string | null = "leicht";
    const zeile = wortstufenzeile("leicht", (s) => (stufe = s), "");
    expect(zeile.optionen.map((o) => o.wert)).toEqual(["gemischt", "leicht", "mittel", "schwer"]);
    zeile.setze("gemischt");
    expect(stufe).toBeNull();
  });

  it("Wiederholen erscheint nur mit fälligen Aufgaben", () => {
    expect(wiederholung(0, () => undefined)).toEqual([]);
    expect(wiederholung(3, () => undefined)[0]?.testkennung).toBe("trainer-wiederholung");
    expect(aufgabenzahl(1)).not.toEqual(aufgabenzahl(2).replace("2", "1"));
  });
});

describe("Gemerkte Werte", () => {
  beforeEach(() => vi.stubGlobal("window", { localStorage: ersatzspeicher() }));

  it("liefert den gemerkten Wert, wenn er erlaubt ist", () => {
    merkeWert("taktik", "stufe", "3");
    merkeWert("taktik", "thema", "fesselung");
    expect(gemerkterWert("taktik", "stufe", [ALLE, "3"], ALLE)).toBe("3");
    expect(gemerkterWert("taktik", "thema", ["gemischt", "fesselung"], "gemischt")).toBe(
      "fesselung",
    );
  });

  it("fällt bei Unbekanntem oder kaputtem Merker auf die Vorgabe zurück", () => {
    merkeWert("falle", "stufe", "9");
    expect(gemerkterWert("falle", "stufe", [ALLE, "1"], ALLE)).toBe(ALLE);
    window.localStorage.setItem("svga.trainerstart.falle", "{kaputt");
    expect(gemerkterWert("falle", "stufe", [ALLE, "1"], ALLE)).toBe(ALLE);
  });
});
