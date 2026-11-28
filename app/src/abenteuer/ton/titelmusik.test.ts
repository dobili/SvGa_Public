/**
 * Tests für die Titelmusik unter Startbild und Hauptmenü (ton/tonregie.ts `titelAn`, `titelAus`;
 * Wunsch des Autors, 28.11.2026): Start, durchgehend beim Übergang, Ausblenden in 1 s beim
 * Spielbeginn, Vorrang der Kartenmusik, stumm und ohne Ton der App, ohne Paket still.
 */
import { describe, expect, it } from "vitest";
import { TITEL_AUSBLENDEN_S, TITELMUSIK, Tonregie, type Spielwerk } from "./tonregie";
import { STANDARD_ABENTEUERTON } from "./tonplan";

/** Schreibt die Musikwünsche mit (mit Ausblendzeit, wenn eine genannt ist). */
function mitschreiber() {
  const musik: string[] = [];
  let vergessen = 0;
  const werk: Spielwerk = {
    setzePegel: () => undefined,
    spieleSchleife: async (spur, angabe, ausblenden) => {
      if (spur !== "musik") return;
      musik.push(`${angabe ?? "aus"}${ausblenden === undefined ? "" : ` ${ausblenden}s`}`);
    },
    setzeNaehe: () => undefined,
    spieleEinmal: async () => undefined,
    stoppeAlles: () => musik.push("stopp"),
    vergissFehlende: () => {
      vergessen++;
    },
  };
  return { musik, werk, vergessen: () => vergessen };
}

/** Eine Regie mit Ton an und Standardlautstärke; das Protokoll beginnt danach leer. */
function laute() {
  const schreiber = mitschreiber();
  const regie = new Tonregie(() => schreiber.werk);
  regie.stelleEin(STANDARD_ABENTEUERTON, true);
  schreiber.musik.length = 0;
  return { regie, ...schreiber };
}

describe("Titelmusik", () => {
  it("spielt unter Startbild und Hauptmenü, derselbe Wunsch beim Übergang", () => {
    const { regie, musik } = laute();
    regie.titelAn(); // Startbild
    regie.titelAn(); // Hauptmenü: derselbe Wunsch, der Spieler startet laufende Musik nicht neu
    expect(musik).toEqual([TITELMUSIK, TITELMUSIK]);
    expect(regie.soll.musik).toBe(TITELMUSIK);
  });

  it("blendet beim Spielbeginn in 1 s aus, danach übernimmt die Karte", () => {
    const { regie, musik } = laute();
    regie.titelAn();
    regie.titelAus();
    regie.karteBetreten("maple-falls");
    expect(musik).toEqual([TITELMUSIK, `aus ${TITEL_AUSBLENDEN_S}s`, "maple-falls"]);
  });

  it("betritt die Welt zuerst eine Karte, überblendet sie selbst; titelAus ändert nichts", () => {
    const { regie, musik } = laute();
    regie.titelAn();
    regie.karteBetreten("maple-falls");
    regie.titelAus();
    expect(musik).toEqual([TITELMUSIK, "maple-falls"]);
    expect(regie.soll.musik).toBe("maple-falls");
  });

  it("zurück ins Hauptmenü: Titelmusik statt Kartenmusik und Dauergeräusch", () => {
    const { regie, musik } = laute();
    regie.karteBetreten("maple-falls", "wind");
    regie.titelAn();
    expect(musik.at(-1)).toBe(TITELMUSIK);
    expect(regie.soll).toEqual({ musik: TITELMUSIK, geraeusch: null });
  });

  it("stumm oder ohne Ton der App: still, nach dem Einschalten die Titelmusik", () => {
    const { musik, werk } = mitschreiber();
    const regie = new Tonregie(() => werk);
    regie.stelleEin({ ...STANDARD_ABENTEUERTON, stumm: true }, true);
    regie.titelAn();
    regie.stelleEin(STANDARD_ABENTEUERTON, false);
    expect(musik.filter((m) => m !== "aus")).toEqual([]);
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    expect(musik.at(-1)).toBe(TITELMUSIK);
  });

  it("versucht das Stück neu, wenn es fehlte (Paket erst später geladen)", () => {
    const { regie, vergessen } = laute();
    regie.titelAn();
    regie.titelAn();
    expect(vergessen()).toBe(2);
  });

  it("ohne Spielwerk (kein Web Audio) geschieht nichts, und nichts wirft", () => {
    const regie = new Tonregie(() => null);
    regie.stelleEin(STANDARD_ABENTEUERTON, true);
    expect(() => {
      regie.titelAn();
      regie.titelAus();
    }).not.toThrow();
  });
});
