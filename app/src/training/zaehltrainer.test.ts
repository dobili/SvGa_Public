/**
 * Tests des Zähltrainers zu ungeeigneten Stellungen (Nebenchat, 30.10.2026): Schach, Matt und
 * gefesselte Figuren. Die Stellungen meldete der Autor aus dem Zähltrainer.
 */
import { describe, expect, it } from "vitest";
import { profil } from "../analyse/stellungsprofil";
import { feldAusName, stellungAusFen, type Stellung } from "../schach/stellung";
import {
  gefesselteBeteiligt,
  haengendeFiguren,
  zaehlfelder,
  zumZaehlenGeeignet,
} from "./zaehltrainer";

/** Weiß ist matt: Sf3 gibt Schach, die Dame e4 fesselt den Läufer e2 (Fallenstellung). */
const MATT = "r1b1kbnr/pppp1Npp/8/8/4q3/5n2/PPPPBP1P/RNBQKR2 w Qkq - 0 1";
/** Dieselbe Fesselung ohne Schach: Der Springer f3 steht auf g5 statt f3. */
const FESSELUNG = "r1b1kbnr/pppp2pp/8/6n1/4q3/5N2/PPPPBP1P/RNBQKR2 w Qkq - 0 1";
/** Abb. aus dem Zähltrainer: e4 ist unterdeckt (d5 und Sf6 gegen d3). */
const UNTERDECKT = "rnbq1rk1/pp3ppp/2pb1n2/3pp3/4P3/1B1P1N2/PPP2PPP/RNBQ1RK1 w - - 0 1";

function stellung(fen: string): Stellung {
  const gelesen = stellungAusFen(fen);
  if (!gelesen.ok) throw new Error(gelesen.fehler);
  return gelesen.wert;
}

function feld(name: string) {
  const f = feldAusName(name);
  if (f === null) throw new Error(name);
  return f;
}

describe("Zähltrainer: geeignete Stellungen", () => {
  it("nimmt keine Stellung, in der die Seite am Zug im Schach steht oder matt ist", () => {
    expect(zumZaehlenGeeignet(stellung(MATT))).toBe(false);
    expect(haengendeFiguren(stellung(MATT))).toBeNull();
    expect(zaehlfelder({ nummer: "4.x", kapitel: 4, stellung: stellung(MATT) })).toEqual([]);
  });

  it("erkennt den gefesselten Läufer e2 als Verteidiger von f3", () => {
    const p = profil(stellung(FESSELUNG));
    expect(gefesselteBeteiligt(p, feld("f3"))).toBe(true);
    expect(gefesselteBeteiligt(p, feld("a7"))).toBe(false);
  });

  it("zählt einen gedeckten, aber unterdeckten Bauern als hängend", () => {
    expect(haengendeFiguren(stellung(UNTERDECKT))).toContain("e4");
  });
});
