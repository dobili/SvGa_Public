/** Tests des Ablaufs mit Uhr und des Engine-Zuges mit Buchzügen (fester Zufall, falsche Engine). */
import { describe, expect, it } from "vitest";
import type { Bewertung } from "../engine/engineDienst";
import { stufe } from "../engine/stufen";
import type { Spielbewerter } from "../engine/zugwahl";
import { nimmZurueckMitUhr, pausiere, pruefeZeit, setzeUhrFort, zieheMitUhr } from "./ablauf";
import { engineZug } from "./enginezug";
import { leserzug, neuePartie, type Partie, type Partiezug } from "./partie";
import { restzeit } from "./uhr";

const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const MINUTE = 60_000;
const SEKUNDE = 1000;

function partie(mitUhr: boolean): Partie {
  const neu = neuePartie(
    {
      startFen: GRUNDSTELLUNG,
      eigeneFarbe: "white",
      stufe: 1,
      uhr: mitUhr ? { grundzeitMs: MINUTE, zuschlagMs: 2 * SEKUNDE } : null,
      ruecknahmeErlaubt: true,
      abbildung: null,
      eroeffnung: null,
      stufenJePhase: { eroeffnung: 1, mittelspiel: 1, endspiel: 1 },
      gegner: "engine",
      bot: null,
      hilfen: { symbole: true, werkzeuge: true },
      gewertet: true,
    },
    "p",
    "2026-10-15T08:00:00.000Z",
  );
  if (!neu) throw new Error("nicht spielbar");
  return neu;
}

/** Zug der Seite am Zug: Weiß ist der Leser, Schwarz die Engine. */
function zug(p: Partie | null, san: string, jetzt: number): Partie {
  const halbzug: Partiezug =
    p && p.zuege.length % 2 === 1
      ? { san, von: "engine", quelle: "engine", fehler: null, verlust: 0 }
      : leserzug(san);
  const weiter = p ? zieheMitUhr(p, halbzug, jetzt) : null;
  if (!weiter) throw new Error(`Zug geht nicht: ${san}`);
  return weiter;
}

describe("Ablauf mit Uhr", () => {
  it("drückt nach jedem Zug die Uhr", () => {
    const p = zug(zug(partie(true), "e4", 0), "e5", 5 * SEKUNDE);
    expect(p.uhr?.laeuft).toBe("white");
    expect(p.uhr && restzeit(p.uhr, "black", 5 * SEKUNDE)).toBe(MINUTE - 3 * SEKUNDE);
  });

  it("Zug der Engine, während die App im Hintergrund ist: die Uhr bleibt stehen", () => {
    const eins = zug(partie(true), "e4", 0);
    const engineZug: Partiezug = {
      san: "e5",
      von: "engine",
      quelle: "engine",
      fehler: null,
      verlust: 0,
    };
    const p = zieheMitUhr(eins, engineZug, 5 * SEKUNDE, false);
    expect(p?.uhr?.laeuft).toBeNull();
    expect(p?.uhr && restzeit(p.uhr, "white", 9 * MINUTE)).toBe(MINUTE);
    const weiter = setzeUhrFort(p ?? eins, 10 * MINUTE);
    expect(weiter.uhr?.laeuft).toBe("white");
  });

  it("Zeitüberschreitung des Lesers beendet die Partie und hält die Uhr an", () => {
    // Weiß (Leser) zieht e4, Schwarz e5, dann läuft die Uhr des Lesers ab
    const zwei = zug(zug(partie(true), "e4", 0), "e5", SEKUNDE);
    const p = pruefeZeit(zwei, 2 * MINUTE);
    expect(p.ende).toEqual({ art: "zeit", sieger: "black" });
    expect(p.uhr?.laeuft).toBeNull();
  });

  it("die Uhr des Bots läuft nicht in echter Zeit ab (seine Zeit ist simuliert, 0.2.117)", () => {
    const p = zug(partie(true), "e4", 0);
    expect(pruefeZeit(p, 2 * MINUTE)).toBe(p);
  });

  it("Pause und Fortsetzen", () => {
    const pause = pausiere(zug(partie(true), "e4", 0), 10 * SEKUNDE);
    expect(pause.uhr?.laeuft).toBeNull();
    const weiter = setzeUhrFort(pause, 10 * MINUTE);
    expect(weiter.uhr && restzeit(weiter.uhr, "black", 10 * MINUTE)).toBe(50 * SEKUNDE);
    expect(setzeUhrFort(partie(true), 0).uhr?.laeuft).toBeNull();
  });

  it("Rücknahme lässt die Uhr des Lesers laufen, vor dem ersten Zug steht sie", () => {
    const zwei = zug(zug(partie(true), "e4", 0), "e5", 5 * SEKUNDE);
    const vier = zug(zug(zwei, "Nf3", 6 * SEKUNDE), "Nc6", 7 * SEKUNDE);
    const zurueck = nimmZurueckMitUhr(vier, 8 * SEKUNDE);
    expect(zurueck?.zuege).toHaveLength(2);
    expect(zurueck?.uhr?.laeuft).toBe("white");
    const anfang = nimmZurueckMitUhr(zwei, 6 * SEKUNDE)?.uhr;
    expect(anfang?.laeuft).toBeNull();
    expect(anfang?.restMs).toEqual({ white: MINUTE, black: MINUTE });
  });

  it("ohne Uhr bleibt alles ohne Uhr", () => {
    const p = zug(partie(false), "e4", 0);
    expect(p.uhr).toBeNull();
    expect(pruefeZeit(p, 10 * MINUTE)).toBe(p);
  });
});

describe("Engine-Zug", () => {
  const bewerter = (besterZug: string | null): Spielbewerter => ({
    bewerte: () => {
      const bewertung: Bewertung = {
        varianten: besterZug
          ? [{ nummer: 1, wert: { art: "bauern", bauern: 0.2 }, zuege: [besterZug] }]
          : [],
        tiefe: 1,
        knotenJeSekunde: 0,
        rechenzeitMs: 0,
        startzeitMs: 0,
        besterZug,
      };
      return Promise.resolve(bewertung);
    },
  });

  it("spielt einen Buchzug in SAN mit Quelle „buch“", async () => {
    const zugwahl = await engineZug(bewerter("g1f3"), GRUNDSTELLUNG, stufe(5), ["d4"], () => 0);
    expect(zugwahl).toEqual({ san: "d4", von: "engine", quelle: "buch", fehler: null, verlust: 0 });
  });

  it("außerhalb des Buches der Zug der Engine, als SAN", async () => {
    const zugwahl = await engineZug(bewerter("g1f3"), GRUNDSTELLUNG, stufe(5), [], () => 0.5);
    expect(zugwahl?.san).toBe("Nf3");
    expect(zugwahl?.quelle).toBe("engine");
  });

  it("ohne Zug: null", async () => {
    expect(await engineZug(bewerter(null), GRUNDSTELLUNG, stufe(8), [], () => 0.5)).toBeNull();
  });
});
