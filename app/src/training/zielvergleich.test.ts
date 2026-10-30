/**
 * Tests zum Abweichungsmodus aus dem Nebenchat (30.10.2026): Zielzug, Gambits aus Kapitel 3,
 * Hinweis vor dem Zug, Planzug und Begründung.
 */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { gambitsAus } from "./abweichungstrainer";
import { abweichungshinweis, istPlanzug, zielbegruendung } from "./zielvergleich";
import { zielkandidaten } from "./zielzug";
import { stellungNach } from "./uebungsaufgabe";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
/** London nach 1. d4 d5 2. Lf4 Sf6 3. e3 e6 4. Sf3 c5 5. c3 (Schwarz zieht 5... Ld6). */
const LONDON = stellungNach(GRUND, ["d4", "d5", "Bf4", "Nf6", "e3", "e6", "Nf3", "c5", "c3"]);

describe("Zielzug", () => {
  it("nach 1. e4 e5 bringt ein Zentrums- oder Entwicklungszug die Ziele am meisten voran", () => {
    const fen = stellungNach(GRUND, ["e4", "e5"]);
    const zuege = zielkandidaten(fen);
    expect(zuege.length).toBeGreaterThan(0);
    expect(zuege.every((z) => /^[NBd]/.test(z) || z.startsWith("d"))).toBe(true);
  });

  it("begründet einen teuren Zielzug mit der Antwort des Gegners", () => {
    const fen = stellungNach(GRUND, ["e4", "e5", "Nf3", "Nc6"]);
    const saetze = zielbegruendung(
      fen,
      "white",
      { zug: "Bb5", wert: 0.4, folge: ["Bb5", "a6"] },
      { zug: "d4", wert: -1.2, folge: ["d4", "exd4"] },
    );
    expect(saetze[0]).toContain("d4 bringt die Eröffnungsziele am meisten voran");
    expect(saetze[1]).toContain("1,6 Bauern");
    expect(saetze[1]).toContain("exd4");
    expect(saetze[2]).toContain("Lb5 a6");
  });
});

describe("Abweichungsmodus: Kapitel 3 und Hinweise", () => {
  it("Kapitel 3 liefert die Gambits und das Damengambit", () => {
    const gambits = gambitsAus(ladeKapitel(3), ladeKapitel(2));
    const titel = gambits.map((g) => g.titel).join(" | ");
    expect(gambits.length).toBeGreaterThanOrEqual(8);
    expect(titel).toContain("Königsgambit");
    expect(titel).toContain("Damengambit");
  });

  it("London: 5... Ld6 greift den Läufer f4 an", () => {
    const danach = stellungNach(LONDON, ["Bd6"]);
    expect(abweichungshinweis(LONDON, "Bd6", danach).join(" ")).toContain("Läufer f4");
  });

  it("erkennt den Planzug auch ohne Schachzeichen", () => {
    expect(istPlanzug("Nbd2", "Nbd2")).toBe(true);
    expect(istPlanzug("Bg3", "Nbd2")).toBe(false);
    expect(istPlanzug("Nbd2", null)).toBe(false);
  });
});
