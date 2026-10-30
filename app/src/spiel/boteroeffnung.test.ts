/**
 * Tests der festen Eröffnungen eigener Bots (Paket 9): Umschalten, Schnellwahl im Variantenbaum,
 * Wahl je Partie mit Vorrang der globalen Wahl, Abweichung je Buchzug, Namen.
 */
import { describe, expect, it } from "vitest";
import type { EigenerGegner } from "../engine/gegner";
import {
  abweichungDerPartie,
  eroeffnungFuerPartie,
  eroeffnungsname,
  haeufigsteVarianten,
  MAX_BOTEROEFFNUNGEN,
  mitAbweichung,
  mitSchnellwahl,
  umgeschaltet,
} from "./boteroeffnung";
import type { Bandfamilie, Eroeffnungsbaender } from "./eroeffnungsbaender";
import { EROEFFNUNG_PRAXIS } from "./partie";

const ITALIENISCH: Bandfamilie = {
  name: "Italian Game",
  nameDe: "Italienische Partie",
  seite: "w",
  folge: "e4 e5 Nf3 Nc6 Bc4",
  gambit: false,
  buch: "2.3",
  anteil: [1, 2],
  varianten: [
    {
      name: "Italian Game: Giuoco Piano",
      folge: "e4 e5 Nf3 Nc6 Bc4 Bc5",
      gambit: false,
      anzahl: 50,
    },
    {
      name: "Italian Game: Evans Gambit",
      folge: "e4 e5 Nf3 Nc6 Bc4 Bc5 b4",
      gambit: true,
      anzahl: 5,
    },
    {
      name: "Italian Game: Two Knights Defense",
      folge: "e4 e5 Nf3 Nc6 Bc4 Nf6",
      gambit: false,
      anzahl: 40,
    },
    {
      name: "Italian Game: Paris Defense",
      folge: "e4 e5 Nf3 Nc6 Bc4 d6",
      gambit: false,
      anzahl: 1,
    },
  ],
};
const GIUOCO = "praxis:Italian Game: Giuoco Piano";
const ZWEISPRINGER = "praxis:Italian Game: Two Knights Defense";
const EVANS = "praxis:Italian Game: Evans Gambit";
const PARIS = "praxis:Italian Game: Paris Defense";
const LONDON = "praxis:Queen's Pawn Game: London System";

/** Eine feste Folge von Zufallszahlen. */
function folge(...werte: number[]): () => number {
  let i = 0;
  return () => werte[i++ % werte.length] ?? 0;
}

const BOT: EigenerGegner = {
  kennung: "eigen-1",
  name: "Tante Erna",
  stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
  fehlerarten: [],
  stil: 0,
  blindeFlecken: [],
  eroeffnungen: [GIUOCO, LONDON],
  abweichung: 30,
};

describe("Feste Eröffnungen eigener Bots: Auswahl", () => {
  it("schaltet um und hält die Grenze", () => {
    expect(umgeschaltet([], LONDON)).toEqual([LONDON]);
    expect(umgeschaltet([LONDON, GIUOCO], LONDON)).toEqual([GIUOCO]);
    const voll = Array.from({ length: MAX_BOTEROEFFNUNGEN }, (_, i) => `praxis:E${i}`);
    expect(umgeschaltet(voll, LONDON)).toBe(voll);
  });

  it("Schnellwahl: die häufigsten nach Anzahl, ersetzt nur die Varianten dieser Eröffnung", () => {
    expect(haeufigsteVarianten(ITALIENISCH, 2)).toEqual([GIUOCO, ZWEISPRINGER]);
    expect(haeufigsteVarianten(ITALIENISCH, null)).toEqual([GIUOCO, ZWEISPRINGER, EVANS, PARIS]);
    const liste = [LONDON, PARIS];
    expect(mitSchnellwahl(liste, ITALIENISCH, 3)).toEqual([LONDON, GIUOCO, ZWEISPRINGER, EVANS]);
    expect(mitSchnellwahl([LONDON, GIUOCO, EVANS], ITALIENISCH, 1)).toEqual([LONDON, GIUOCO]);
  });
});

describe("Feste Eröffnungen eigener Bots: im Spiel", () => {
  it("wählt je Partie zufällig eine; der Haken gibt der globalen Wahl Vorrang", () => {
    const lage = { botEroeffnungen: [GIUOCO, LONDON], ueberschreiben: false, global: "praxis" };
    expect(eroeffnungFuerPartie(lage, folge(0))).toBe(GIUOCO);
    expect(eroeffnungFuerPartie(lage, folge(0.99))).toBe(LONDON);
    expect(eroeffnungFuerPartie({ ...lage, ueberschreiben: true }, folge(0))).toBe("praxis");
    expect(eroeffnungFuerPartie({ ...lage, botEroeffnungen: [] }, folge(0))).toBe("praxis");
  });

  it("Abweichung: 0 folgt immer, 100 nie, dazwischen nach dem Wurf", () => {
    expect(mitAbweichung(GIUOCO, 0, folge(0))).toBe(GIUOCO);
    expect(mitAbweichung(GIUOCO, 100, folge(0.999))).toBe(EROEFFNUNG_PRAXIS);
    expect(mitAbweichung(GIUOCO, 30, folge(0.29))).toBe(EROEFFNUNG_PRAXIS);
    expect(mitAbweichung(GIUOCO, 30, folge(0.31))).toBe(GIUOCO);
    expect(mitAbweichung(null, 100, folge(0))).toBeNull();
    // Über viele Buchzüge etwa der eingestellte Anteil
    const LAEUFE = 1000;
    const zufall = folge(...Array.from({ length: LAEUFE }, (_, i) => i / LAEUFE));
    const abweichend = Array.from({ length: LAEUFE }, () => mitAbweichung(GIUOCO, 30, zufall));
    expect(abweichend.filter((e) => e === EROEFFNUNG_PRAXIS)).toHaveLength(300);
  });

  it("die Abweichung gilt nur für eine der festen Eröffnungen des Bots", () => {
    expect(abweichungDerPartie(BOT, LONDON)).toBe(30);
    expect(abweichungDerPartie(BOT, "praxis")).toBe(0);
    expect(abweichungDerPartie(undefined, LONDON)).toBe(0);
    expect(abweichungDerPartie({ ...BOT, abweichung: undefined }, LONDON)).toBe(0);
  });

  it("Namen zur Anzeige: Buch wie gespeichert, Praxis ohne Vorsilbe, deutsch mit Eröffnung", () => {
    const daten = { familien: [ITALIENISCH] } as unknown as Eroeffnungsbaender;
    expect(eroeffnungsname("Italienische Partie", daten, true)).toBe("Italienische Partie");
    expect(eroeffnungsname(EVANS, null, true)).toBe("Italian Game: Evans Gambit");
    expect(eroeffnungsname(EVANS, daten, true)).toBe("Italienische Partie: Evans Gambit");
    expect(eroeffnungsname("praxis:Italian Game", daten, false)).toBe("Italian Game");
  });
});
