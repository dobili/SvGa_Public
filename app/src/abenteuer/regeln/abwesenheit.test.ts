/**
 * Tests für abwesenheit.ts: Ambrose fehlt zwischen Tiefpunkt und Versöhnung; seine Kommentare zu
 * Statisten nur, wenn er sprechen kann.
 */
import { describe, expect, it } from "vitest";
import {
  ambroseFehlt,
  ambroseSprichtJetzt,
  anwesendeMomente,
  istAmbrosesKarte,
  ohneAbwesende,
} from "./abwesenheit";

const TIEFPUNKT = { tiefpunktGesehen: true };
const VERSOEHNT = { tiefpunktGesehen: true, versoehnungGesehen: true };

describe("Ambroses Abwesenheit", () => {
  it("gilt nur zwischen Tiefpunkt und Versöhnung", () => {
    expect(ambroseFehlt({})).toBe(false);
    expect(ambroseFehlt(TIEFPUNKT)).toBe(true);
    expect(ambroseFehlt(VERSOEHNT)).toBe(false);
  });

  it("nimmt Ambrose von der Karte, andere Figuren bleiben", () => {
    const karte = {
      layers: [
        { data: [1] },
        {
          objects: [
            { name: "ambrose", type: "figur" },
            { name: "juno", type: "figur" },
            { name: "ambrose", type: "ausloeser" },
          ],
        },
      ],
    };
    const ohne = ohneAbwesende(karte, TIEFPUNKT);
    expect(ohne.layers[1]?.objects?.map((o) => `${o.name}:${o.type}`)).toEqual([
      "juno:figur",
      "ambrose:ausloeser",
    ]);
    expect(ohneAbwesende(karte, VERSOEHNT)).toBe(karte);
  });

  it("macht nur seine Karten grau", () => {
    expect(istAmbrosesKarte({ wirkung: { art: "mentorzug" } })).toBe(true);
    expect(istAmbrosesKarte({ wirkung: { art: "fluestern" } })).toBe(true);
    expect(istAmbrosesKarte({ wirkung: { art: "werkzeug" } })).toBe(false);
  });

  it("lässt Partiemomente mit Ambrose weg", () => {
    const momente = [{ sprecher: "ambrose" }, { sprecher: "okafor" }];
    expect(anwesendeMomente(momente, ambroseFehlt(TIEFPUNKT))).toEqual([{ sprecher: "okafor" }]);
    expect(anwesendeMomente(momente, ambroseFehlt({}))).toHaveLength(2);
  });
});

describe("Kann Ambrose gerade sprechen (Kommentar zu Statisten)?", () => {
  const LEKTION = { ersteLektionBesprochen: true };

  it("erst nach der ersten Lektion auf dem Dachboden", () => {
    expect(ambroseSprichtJetzt({})).toBe(false);
    expect(ambroseSprichtJetzt({ brettBeruehrt: true, ambroseErwachtGesehen: true })).toBe(false);
    expect(ambroseSprichtJetzt(LEKTION)).toBe(true);
  });

  it("schweigt nach dem Vorwurf, bis er bei der Familie wieder spricht oder versöhnt ist", () => {
    expect(ambroseSprichtJetzt({ ...LEKTION, tiefpunktGesehen: true })).toBe(false);
    expect(
      ambroseSprichtJetzt({ ...LEKTION, tiefpunktGesehen: true, ambroseSprichtWieder: true }),
    ).toBe(true);
    expect(ambroseSprichtJetzt({ ...LEKTION, ...VERSOEHNT })).toBe(true);
  });
});
