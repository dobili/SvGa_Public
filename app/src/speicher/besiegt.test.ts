/**
 * Tests der besiegten Bots (0.2.99): nur gewertete Siege gegen einen Bot zählen, die Liste
 * wächst beim Ablegen, „Wertung zurücksetzen“ leert sie, ältere Daten bekommen sie aus den
 * gespeicherten Partien.
 */
import { describe, expect, it } from "vitest";
import { gibAuf, neuePartie, type Partie } from "../spiel/partie";
import {
  besiegtAus,
  besiegterBot,
  irgendwoBesiegt,
  KEINE_BESIEGTEN,
  mitBesiegtem,
} from "./besiegt";
import { legeAb, LEERER_SPIELSTAND, setzeWertungZurueck } from "./partien";
import { spielstandAus } from "./partienLesen";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Eine Partie gegen einen Bot; „gewonnen“ heißt: die Engine (Schwarz) hat aufgegeben. */
function partie(
  bot: string | null,
  gewertet: boolean,
  gewonnen: boolean,
  uhr: { grundzeitMs: number; zuschlagMs: number } | null = null,
): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 2,
      uhr,
      ruecknahmeErlaubt: false,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 2, mittelspiel: 2, endspiel: 2 },
      gegner: "engine",
      bot,
      hilfen: { symbole: false, werkzeuge: false },
      gewertet,
    },
    `p-${bot ?? "stufe"}-${String(gewertet)}-${String(gewonnen)}`,
    "2026-10-19T08:00:00.000Z",
  );
  if (!neu) throw new Error("nicht spielbar");
  const verloren = gibAuf(neu);
  if (!verloren.ende || !("sieger" in verloren.ende)) throw new Error("kein Ende");
  return gewonnen ? { ...verloren, ende: { ...verloren.ende, sieger: "white" } } : verloren;
}

describe("besiegte Bots", () => {
  it("zählt nur gewertete Siege gegen einen Bot", () => {
    expect(besiegterBot(partie("lotta", true, true))).toBe("lotta");
    expect(besiegterBot(partie("lotta", false, true))).toBeNull();
    expect(besiegterBot(partie("lotta", true, false))).toBeNull();
    expect(besiegterBot(partie(null, true, true))).toBeNull();
  });

  it("merkt jeden Bot je Zeitklasse nur einmal (R51: ohne Uhr Schnellschach, 3 + 2 Blitz)", () => {
    const sieg = partie("mia", true, true);
    const blitz = partie("mia", true, true, { grundzeitMs: 180_000, zuschlagMs: 2_000 });
    const liste = mitBesiegtem(mitBesiegtem(KEINE_BESIEGTEN, sieg), sieg);
    expect(liste).toEqual({ ...KEINE_BESIEGTEN, rapid: ["mia"] });
    expect(mitBesiegtem(liste, blitz).blitz).toEqual(["mia"]);
    expect(irgendwoBesiegt(liste, "mia")).toBe(true);
    expect(irgendwoBesiegt(liste, "max")).toBe(false);
    // 30 + 20 ist Klassisch (wie bei Lichess): nur der Klassisch-Stern (Autor, 24.10.2026).
    const klassisch = partie("max", true, true, { grundzeitMs: 1_800_000, zuschlagMs: 20_000 });
    const mitMax = mitBesiegtem(liste, klassisch);
    expect(mitMax.classical).toEqual(["max"]);
    expect(mitMax.rapid).toEqual(["mia"]);
    expect(mitMax.blitz).toEqual([]);
  });

  it("wächst beim Ablegen und wird mit der Wertung zurückgesetzt", () => {
    const stand = legeAb(LEERER_SPIELSTAND, partie("max", true, true));
    expect(stand.besiegt.rapid).toEqual(["max"]);
    expect(setzeWertungZurueck(stand).besiegt).toEqual(KEINE_BESIEGTEN);
  });

  it("ergänzt ältere Daten aus den gespeicherten Partien; alte einfache Liste zählt als Schnellschach", () => {
    expect(besiegtAus(undefined, [partie("finn", true, true)]).rapid).toEqual(["finn"]);
    expect(besiegtAus(["emil", 7, "emil"], [])).toEqual({ ...KEINE_BESIEGTEN, rapid: ["emil"] });
    expect(besiegtAus({ blitz: ["ida"], rapid: 3 }, []).blitz).toEqual(["ida"]);
    const roh = JSON.parse(
      JSON.stringify({ ...legeAb(LEERER_SPIELSTAND, partie("leon", true, true)), besiegt: [] }),
    ) as unknown;
    expect(spielstandAus(roh).besiegt.rapid).toEqual(["leon"]);
  });
});
