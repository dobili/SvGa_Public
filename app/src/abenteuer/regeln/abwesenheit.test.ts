/**
 * Tests für abwesenheit.ts: Ambrose ist zwischen Tiefpunkt und Versöhnung und nach dem Abschied
 * nicht da (eine Regel für die ganze Hülle: Karten, Schutzengel, Tischgespräch, Rätsel,
 * Reisebrett); seine Kommentare zu Statisten nur, wenn er sprechen kann.
 */
import { describe, expect, it } from "vitest";
import begegnungsdatei from "../../../../inhalte/abenteuer/begegnungen.json";
import { mentorzugGesperrt } from "./karten";
import { schutzengelGesperrt } from "./schutzengel";
import { raetselsprecher, tischplan } from "./tischgespraech";
import {
  ambroseNichtDa,
  ambroseSprichtJetzt,
  ambroseVerabschiedet,
  anwesendeMomente,
  istAmbrosesKarte,
  ohneAbwesende,
  raetselstimmen,
  uebungspartie,
} from "./abwesenheit";

const TIEFPUNKT = { tiefpunktGesehen: true };
const VERSOEHNT = { tiefpunktGesehen: true, versoehnungGesehen: true };
const ABSCHIED = { ...VERSOEHNT, abschiedGesehen: true };

describe("Ambroses Abwesenheit", () => {
  it("gilt zwischen Tiefpunkt und Versöhnung und nach dem Abschied", () => {
    expect(ambroseNichtDa({})).toBe(false);
    expect(ambroseNichtDa(TIEFPUNKT)).toBe(true);
    expect(ambroseNichtDa(VERSOEHNT)).toBe(false);
    expect(ambroseNichtDa(ABSCHIED)).toBe(true);
    expect(ambroseNichtDa({ abschiedGesehen: true })).toBe(true);
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
    expect(ohneAbwesende(karte, ABSCHIED).layers[1]?.objects).toHaveLength(2);
  });

  it("macht nur seine Karten grau", () => {
    expect(istAmbrosesKarte({ wirkung: { art: "mentorzug" } })).toBe(true);
    expect(istAmbrosesKarte({ wirkung: { art: "fluestern" } })).toBe(true);
    expect(istAmbrosesKarte({ wirkung: { art: "werkzeug" } })).toBe(false);
  });

  it("lässt Partiemomente mit Ambrose weg", () => {
    const momente = [{ sprecher: "ambrose" }, { sprecher: "okafor" }];
    expect(anwesendeMomente(momente, ambroseNichtDa(TIEFPUNKT))).toEqual([{ sprecher: "okafor" }]);
    expect(anwesendeMomente(momente, ambroseNichtDa(ABSCHIED))).toEqual([{ sprecher: "okafor" }]);
    expect(anwesendeMomente(momente, ambroseNichtDa({}))).toHaveLength(2);
  });
});

describe("Was die Hülle ohne Ambrose tut (Tiefpunkt und nach dem Abschied gleich)", () => {
  it("sperrt Mentor-Zug und Schutzengel", () => {
    for (const variablen of [TIEFPUNKT, ABSCHIED]) {
      expect(mentorzugGesperrt(variablen)).toBe(true);
      expect(schutzengelGesperrt(variablen, "mapleFalls.clubkampf")).toBe(true);
    }
    expect(mentorzugGesperrt(VERSOEHNT)).toBe(false);
    expect(schutzengelGesperrt(VERSOEHNT, "mapleFalls.clubkampf")).toBe(false);
  });

  it("lässt Ambrose am Brett schweigen: Der Plan des Tischgesprächs hat keine Zeile von ihm", () => {
    // Der Held verliert im 3. Halbzug die Dame: Ereignis „hinten“, sonst mit Ambroses Zeile.
    const verlauf = {
      fens: [
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 1",
        "rnbqkbnr/pppp1ppp/8/4p3/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2",
        "rnbqkbnr/pppp1ppp/8/4p2Q/3P4/8/PPP1PPPP/RNB1KBNR b KQkq - 1 2",
        "rnb1kbnr/pppp1ppp/8/4p2q/3P4/8/PPP1PPPP/RNB1KBNR w KQkq - 0 3",
      ],
      vomHelden: [true, false, true, false],
      held: "white" as const,
    };
    const da = !schutzengelGesperrt(VERSOEHNT, "mapleFalls.clubkampf");
    const weg = !schutzengelGesperrt(ABSCHIED, "mapleFalls.clubkampf");
    expect(tischplan(verlauf, "p1", da).some((z) => z.sprecher === "ambrose")).toBe(true);
    expect(tischplan(verlauf, "p1", weg).some((z) => z.sprecher === "ambrose")).toBe(false);
  });

  it("lässt in den Rätseln nur sprechen, wer da ist", () => {
    expect(raetselstimmen("sam", {})).toEqual({ steller: true, ambrose: true });
    expect(raetselstimmen("sam", TIEFPUNKT)).toEqual({ steller: true, ambrose: false });
    expect(raetselstimmen("sam", ABSCHIED)).toEqual({ steller: true, ambrose: false });
    // Ambroses Erinnerungen: Er stellt selbst; ist er nicht da, läuft die Runde ohne Stimme.
    expect(raetselstimmen("ambrose", {})).toEqual({ steller: true, ambrose: false });
    expect(raetselstimmen("ambrose", ABSCHIED)).toEqual({ steller: false, ambrose: false });
    expect(raetselstimmen(null, ABSCHIED)).toEqual({ steller: true, ambrose: false });
  });

  it("gibt ohne Ambrose weder Hinweiszeile noch Zuspruch von ihm", () => {
    const lage = { kennung: "r1", aufgabe: 2, falschInFolge: 2, gesprochenBei: null };
    const ohne = { ...lage, ambroseDa: raetselstimmen("sam", ABSCHIED).ambrose };
    const mit = { ...lage, ambroseDa: raetselstimmen("sam", VERSOEHNT).ambrose };
    expect(raetselsprecher("hinweis", mit)).toBe("ambrose");
    expect(raetselsprecher("falsch", mit)).toBe("ambrose");
    expect(raetselsprecher("hinweis", ohne)).toBeNull();
    expect(raetselsprecher("falsch", ohne)).not.toBe("ambrose");
  });

  it("lässt am Reisebrett Juno spielen", () => {
    expect(uebungspartie({})).toBe("reisebrett.ambrose");
    expect(uebungspartie(VERSOEHNT)).toBe("reisebrett.ambrose");
    expect(uebungspartie(TIEFPUNKT)).toBe("reisebrett.juno");
    expect(uebungspartie(ABSCHIED)).toBe("reisebrett.juno");
    const gegner = (kennung: string) =>
      begegnungsdatei.begegnungen.find((b) => b.kennung === kennung)?.gegner;
    expect(gegner(uebungspartie(ABSCHIED))).toBe("mapleFalls.juno");
    expect(gegner(uebungspartie({}))).toBe("mapleFalls.ambrose");
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

  it("sagt nach dem Abschied im Finale nichts mehr (Entscheidung Q21-5)", () => {
    const nachFinale = { ...LEKTION, ...VERSOEHNT, ambroseSprichtWieder: true };
    expect(ambroseVerabschiedet(nachFinale)).toBe(false);
    expect(ambroseSprichtJetzt(nachFinale)).toBe(true);
    expect(ambroseVerabschiedet({ ...nachFinale, abschiedGesehen: true })).toBe(true);
    expect(ambroseSprichtJetzt({ ...nachFinale, abschiedGesehen: true })).toBe(false);
    expect(ambroseSprichtJetzt({ ...LEKTION, abschiedGesehen: true })).toBe(false);
  });
});
