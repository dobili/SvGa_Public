/**
 * Tests des Zähltrainers (Nebenchat, 30.10.2026): Schach und Matt, gefesselte Figuren zählen
 * nicht mit (Kapitel 1, Abb. 1.12), Stufen und Motive. Die Stellungen meldete der Autor.
 */
import { describe, expect, it } from "vitest";
import { profil } from "../analyse/stellungsprofil";
import { feldAusName, stellungAusFen, type Stellung } from "../schach/stellung";
import { gefesselteAmFeld } from "./zaehlfesselung";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import {
  haengendeFiguren,
  ZAEHLSTUFEN,
  zaehlfelder,
  zaehlrunde,
  zaehlstufe,
  zumZaehlenGeeignet,
} from "./zaehltrainer";
import { festerZufall } from "./zufall";

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

  it("der gefesselte Läufer e2 deckt f3 nicht", () => {
    const p = profil(stellung(FESSELUNG));
    expect(gefesselteAmFeld(p, feld("f3"))).toEqual([feld("e2")]);
    expect(gefesselteAmFeld(p, feld("a7"))).toEqual([]);
    const f3 = zaehlfelder({ nummer: "x", kapitel: 1, stellung: stellung(FESSELUNG) }).find(
      (a) => a.feld === "f3",
    );
    // Springer f3: angegriffen vom Springer g5, gedeckt nur scheinbar vom gefesselten Läufer e2
    // (die Dame d1 steht hinter e2 nicht auf der Diagonale); also hängt f3.
    expect(f3?.motive).toContain("fesselung");
    expect(f3?.stufe).toBe("schwer");
    expect(haengendeFiguren(stellung(FESSELUNG))).toContain("f3");
  });

  it("eine Batterie hinter einer gefesselten Figur zählt nicht (Prüfung 31.10.2026)", () => {
    // Td2 an Ke1 gefesselt (Lb4), Td1 dahinter: Keiner der Türme schlägt je auf d6, nur Sb5.
    const fen = "7k/8/3n4/1N6/1b6/8/3R4/3RK3 w - - 0 1";
    const d6 = zaehlfelder({ nummer: "x", kapitel: 1, stellung: stellung(fen) }).find(
      (a) => a.feld === "d6",
    );
    expect(d6?.angreifer).toBe(1);
    expect(d6?.verteidiger).toBe(1); // Lb4 deckt d6 über c5
    expect(d6?.motive).not.toContain("batterie");
    expect(d6?.motive).toContain("fesselung");
  });

  it("Stufen: wenige Figuren leicht, Fesselung schwer", () => {
    expect(zaehlstufe({ angreifer: 1, verteidiger: 1, motive: [] })).toBe("leicht");
    expect(zaehlstufe({ angreifer: 2, verteidiger: 2, motive: [] })).toBe("mittel");
    expect(zaehlstufe({ angreifer: 3, verteidiger: 2, motive: ["batterie"] })).toBe("schwer");
    expect(zaehlstufe({ angreifer: 1, verteidiger: 1, motive: ["fesselung"] })).toBe("schwer");
  });

  it("zählt einen gedeckten, aber unterdeckten Bauern als hängend", () => {
    expect(haengendeFiguren(stellung(UNTERDECKT))).toContain("e4");
  });
});

describe("Zähltrainer: Stufen an den Buchstellungen", () => {
  const KAPITELZAHL = 13;
  const RUNDE = 8;
  const stellungen = buchstellungenAus(
    Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)),
  );

  it("jede Stufe füllt eine Runde, und die Runde hält ihre Stufe", { timeout: 60_000 }, () => {
    for (const stufe of ZAEHLSTUFEN) {
      const runde = zaehlrunde(stellungen, RUNDE, festerZufall(1), stufe);
      expect(runde).toHaveLength(RUNDE);
      expect(runde.every((a) => a.stufe === stufe)).toBe(true);
    }
  });
});
