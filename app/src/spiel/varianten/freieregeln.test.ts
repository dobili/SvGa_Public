// Partie und Brett ohne chessops (Märchenfiguren über ffish): mit einer erfundenen Regelschicht,
// die Schach spielt und beim Springerzug von g1 zusätzlich „Falke einsetzen“ (g1f3h) anbietet.
import { describe, expect, it } from "vitest";
import { figurenAusFen } from "../../ui/brett/geometrie";
import {
  freierLetzterZug,
  tascheAus,
  variantenstellung,
} from "../../abenteuer/anbindung/variantenbrett";
import { legaleZiele, spieleZug, ziehbareFelder, zugzusaetze } from "../../schach/weiterspielen";
import { partieendeNach } from "../ergebnis";
import { spielbar } from "../partie";
import { fenNach, sanZuUci, uciZuSan } from "../zuege";
import "./alle";
import { chessopsRegeln } from "./regelschicht";
import { registriereVariante, type Regelschicht } from "./variante";

const KENNUNG = "probeFalke";
const schach = chessopsRegeln("chess", KENNUNG);
const FALKE = "h";
const regeln: Regelschicht = {
  chessops: null,
  stellung: () => null,
  legaleZuege: (fen) =>
    schach
      .legaleZuege(fen)
      .flatMap((uci) => (uci.startsWith("g1") ? [uci, `${uci}${FALKE}`] : [uci])),
  ziehe: (fen, uci) => {
    const zug = schach.ziehe(fen, uci.endsWith(FALKE) ? uci.slice(0, -1) : uci);
    return zug && uci.endsWith(FALKE) ? { ...zug, san: `${zug.san}/H` } : zug;
  },
  ende: (fen) => schach.ende(fen),
};
registriereVariante({
  kennung: KENNUNG,
  art: "figuren",
  name: "variante.probeFalke.name",
  regeln,
  engine: { engine: "fairy", uciVariante: "seirawan" },
});

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

describe("Regeln ohne chessops", () => {
  it("Züge, Kurznotation und Stellung danach über die Regelschicht", () => {
    expect(spielbar(START, KENNUNG)).toBe(true);
    expect(uciZuSan(START, "g1f3h", KENNUNG)).toBe("Nf3/H");
    expect(sanZuUci(START, "Nf3/H", KENNUNG)).toBe("g1f3h");
    expect(fenNach(START, "Nf3/H", KENNUNG)?.split(" ")[0]).toBe(
      "rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R",
    );
  });

  it("Brett: Ziele, Figuren und die Auswahl des Zusatzes", () => {
    expect(legaleZiele(START, "g1", KENNUNG).sort()).toEqual(["f3", "h3"]);
    expect(ziehbareFelder(START, KENNUNG)).toHaveLength(10);
    expect(zugzusaetze(START, "g1", "f3", KENNUNG)).toEqual(["", FALKE]);
    expect(spieleZug(START, "g1", "f3", undefined, KENNUNG).art).toBe("auswahl");
    const mit = spieleZug(START, "g1", "f3", undefined, KENNUNG, FALKE);
    expect(mit.art === "gespielt" ? mit.san : null).toBe("Nf3/H");
    const ohne = spieleZug(START, "g1", "f3", undefined, KENNUNG, "");
    expect(ohne.art === "gespielt" ? ohne.san : null).toBe("Nf3");
    expect(spieleZug(START, "e2", "e4", undefined, KENNUNG).art).toBe("gespielt");
    expect(spieleZug(START, "e2", "e5", undefined, KENNUNG).art).toBe("ungueltig");
  });

  it("Ende nach den Regeln der Variante (Matt im Narrenmatt)", () => {
    const matt = "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3";
    expect(partieendeNach([matt], KENNUNG)).toEqual({
      art: "variante",
      sieger: "black",
      grund: "variante.matt",
    });
  });

  it("Brett der Hülle: Märchenfiguren, Tasche, letzter Zug", () => {
    const fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR[HEhe] w KQBCDFGkqbcdfg - 0 1";
    expect(figurenAusFen(fen).size).toBe(32);
    expect(figurenAusFen("4k3/8/8/8/8/8/8/4K2H w - - 0 1").get("h1")).toBe("H");
    expect(tascheAus(fen)).toEqual({ weiss: "HE", schwarz: "he" });
    expect(tascheAus(START)).toBeNull();
    const brett = variantenstellung("4k3/8/8/8/8/8/8/4K2H[e] b - - 0 1", KENNUNG);
    expect(brett.ok && brett.wert.amZug).toBe("black");
    expect(freierLetzterZug(KENNUNG, START, "Nf3/H")).toEqual({ von: "g1", nach: "f3" });
  });
});
