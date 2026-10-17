/**
 * Tests der Wertung (0.2.41): Elo-Erwartung, Ergebnis aus Sicht des Lesers, erste Partie setzt die
 * Wertung auf die Schätzung, weitere Partien ändern sie nach Elo, was nicht zählt, und die
 * Ausschnitte für die Kurve.
 */
import { describe, expect, it } from "vitest";
import type { Partieeintrag } from "../speicher/partien";
import { leserzug, neuePartie, ziehe, type Partie, type Partieeinstellung } from "./partie";
import {
  ANFANGSPARTIEN,
  ergebnisFuer,
  erwartung,
  imBereich,
  K_ANFANG,
  K_DANACH,
  mitGewerteterPartie,
  staerkeDerPartie,
  wertungspunktFuer,
  type Wertungspunkt,
} from "./wertung";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** Spanisch, Breyer-Variante bis 20. Lg5: 39 Halbzüge, genug für die Schätzung beider Seiten. */
const BREYER =
  "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7 Re1 b5 Bb3 d6 c3 O-O h3 Nb8 d4 Nbd7 Nbd2 Bb7 Bc2 Re8 Nf1 Bf8 Ng3 g6 a4 c5 d5 c4 Bg5 h6 Be3 Nc5 Qd2 h5 Bg5".split(
    " ",
  );

const EINSTELLUNG: Partieeinstellung = {
  startFen: GRUNDSTELLUNG,
  eigeneFarbe: "white",
  stufe: 3,
  stufenJePhase: { eroeffnung: 3, mittelspiel: 3, endspiel: 3 },
  uhr: null,
  ruecknahmeErlaubt: true,
  abbildung: null,
  eroeffnung: null,
  gegner: "engine",
  bot: null,
  hilfen: { symbole: true, werkzeuge: true },
  gewertet: true,
};

/** Eine beendete, ausgewertete Partie (alle Werte 0: beide Seiten spielen fehlerfrei). */
function eintrag(
  id: string,
  sieger: "white" | "black" | null,
  einstellung: Partial<Partieeinstellung> = {},
  zeit = "2026-10-17T08:00:00.000Z",
): Partieeintrag {
  const neu = neuePartie({ ...EINSTELLUNG, ...einstellung }, id, zeit);
  const gespielt = BREYER.reduce<Partie | null>((p, z) => (p ? ziehe(p, leserzug(z)) : null), neu);
  if (!gespielt) throw new Error("Zug geht nicht");
  const ende = sieger ? { art: "aufgabe" as const, sieger } : { art: "material" as const };
  const partie = { ...gespielt, ende };
  const werte = partie.zuege.map(() => 0).concat([0]);
  return { partie, werte, beste: werte.map(() => ""), abstaende: [] };
}

describe("Wertung", () => {
  it("Elo-Erwartung: gleich stark ½, 400 Punkte schwächer etwa 0,09", () => {
    expect(erwartung(1500, 1500)).toBe(0.5);
    expect(erwartung(1500, 1900)).toBeCloseTo(0.0909, 3);
    expect(erwartung(1900, 1500)).toBeCloseTo(0.9091, 3);
  });

  it("Ergebnis aus Sicht des Lesers: Sieg 1, Remis ½, Niederlage 0, laufend null", () => {
    expect(ergebnisFuer(eintrag("a", "white").partie)).toBe(1);
    expect(ergebnisFuer(eintrag("b", "black").partie)).toBe(0);
    expect(ergebnisFuer(eintrag("c", null).partie)).toBe(0.5);
    expect(ergebnisFuer(eintrag("d", "black", { eigeneFarbe: "black" }).partie)).toBe(1);
    expect(ergebnisFuer({ ...eintrag("e", "white").partie, ende: null })).toBeNull();
  });

  it("erste Partie: Schätzung der Engine; danach Elo mit K 32, nach zehn Partien K 20", () => {
    const erste = eintrag("1", "black");
    const schaetzung = staerkeDerPartie(erste)?.white.spielstaerke ?? null;
    expect(schaetzung).not.toBeNull();
    let verlauf = mitGewerteterPartie([], erste);
    expect(verlauf).toHaveLength(1);
    expect(verlauf[0]?.wertung).toBe(schaetzung);
    expect(verlauf[0]?.ergebnis).toBe(0);
    // Zweite Partie gewonnen gegen einen gleich starken Gegner: + 32 · (1 − ½) = 16.
    verlauf = mitGewerteterPartie(verlauf, eintrag("2", "white"));
    expect(verlauf[1]?.wertung).toBe((schaetzung ?? 0) + K_ANFANG / 2);
    for (let i = 3; i <= ANFANGSPARTIEN; i += 1) {
      verlauf = mitGewerteterPartie(verlauf, eintrag(String(i), null));
    }
    expect(verlauf).toHaveLength(ANFANGSPARTIEN);
    const vorher = verlauf.at(-1)?.wertung ?? 0;
    verlauf = mitGewerteterPartie(verlauf, eintrag("11", "black"));
    const erwartet = vorher + K_DANACH * (0 - erwartung(vorher, verlauf.at(-1)?.gegner ?? 0));
    expect(verlauf.at(-1)?.wertung).toBe(Math.round(erwartet));
  });

  it("zählt nicht: ungewertet, gegen Mensch, laufend, ohne Auswertung, schon gezählt", () => {
    expect(wertungspunktFuer([], eintrag("a", "white", { gewertet: false }))).toBeNull();
    expect(wertungspunktFuer([], eintrag("b", "white", { gegner: "mensch" }))).toBeNull();
    const laufend = eintrag("c", "white");
    expect(
      wertungspunktFuer([], { ...laufend, partie: { ...laufend.partie, ende: null } }),
    ).toBeNull();
    expect(wertungspunktFuer([], { ...laufend, werte: [], beste: [] })).toBeNull();
    const verlauf = mitGewerteterPartie([], laufend);
    expect(wertungspunktFuer(verlauf, laufend)).toBeNull();
    expect(mitGewerteterPartie(verlauf, laufend)).toBe(verlauf);
  });

  it("Ausschnitte: letzte N Partien oder Zeitraum bis jetzt", () => {
    const punkt = (id: string, zeit: string): Wertungspunkt => ({
      partieId: id,
      zeit,
      gegner: 1500,
      ergebnis: 1,
      wertung: 1500,
    });
    const punkte = [
      punkt("a", "2026-09-01T10:00:00.000Z"),
      punkt("b", "2026-10-12T10:00:00.000Z"),
      punkt("c", "2026-10-16T10:00:00.000Z"),
    ];
    const jetzt = new Date("2026-10-17T10:00:00.000Z");
    expect(imBereich(punkte, { art: "partien", anzahl: 2 }, jetzt).map((p) => p.partieId)).toEqual([
      "b",
      "c",
    ]);
    expect(imBereich(punkte, { art: "zeit", tage: 7 }, jetzt).map((p) => p.partieId)).toEqual([
      "b",
      "c",
    ]);
    expect(imBereich(punkte, { art: "zeit", tage: 1 }, jetzt).map((p) => p.partieId)).toEqual([
      "c",
    ]);
    expect(imBereich(punkte, { art: "zeit", tage: 365 }, jetzt)).toHaveLength(3);
  });
});
