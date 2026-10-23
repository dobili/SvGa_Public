/** Tests für den Kommentar beim Zugerraten (R45): Motive des Partiezuges, Fehlerart des eigenen Zuges. */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import type { Rateurteil } from "./rateurteil";
import { partienAus } from "./studientrainer";
import { stellungNach } from "./uebungsaufgabe";
import { kommentarZumEigenenZug, kommentarZumPartiezug } from "./zugkommentar";

/** Abb. 1.13, Schwarz am Zug nach 2. Dh5: Weiß droht Dxe5+. */
const NACH_DH5 = "rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2";

describe("Kommentar zum Partiezug", () => {
  const opern = partienAus(ladeKapitel(11), "white")[0];
  if (!opern) throw new Error("Opernpartie fehlt");
  /** Kommentar zum Halbzug mit diesem Index der Opernpartie. */
  const kommentar = (index: number) =>
    kommentarZumPartiezug(
      {
        vorherFen: stellungNach(opern.startFen, opern.linie.slice(0, index)),
        davorFen: index > 0 ? stellungNach(opern.startFen, opern.linie.slice(0, index - 1)) : null,
      },
      opern.linie.slice(index),
    );

  it("ruhige Züge und bloßes Zurückschlagen bleiben ohne Kommentar", () => {
    expect(opern.linie[2]).toBe("Nf3");
    expect(kommentar(2)).toBeNull();
    expect(opern.linie[8]).toBe("Qxf3");
    expect(kommentar(8)).toBeNull();
  });

  it("16. Db8+ mit Ablenkung und Grundreihenmatt", () => {
    expect(opern.linie[30]).toBe("Qb8+");
    expect(kommentar(30)).toMatch(/^Im Partiezug Db8\+ steckt: Ablenkung.*Grundreihenmatt/);
  });
});

describe("Kommentar zum eigenen Zug", () => {
  const umfeld = { vorherFen: NACH_DH5, davorFen: null };

  it("ein Fehler mit Zeichen bekommt die Fehlerart wie im Rückblick", () => {
    const urteil: Rateurteil = {
      art: "schwaecher",
      unterschied: 3,
      eigenerWert: { art: "bauern", bauern: 3 },
      partieWert: { art: "bauern", bauern: 0 },
      eigeneFolge: ["g8f6", "h5e5"],
    };
    const k = kommentarZumEigenenZug(umfeld, "Nf6", "Nc6", urteil);
    expect(k).toMatch(/^Dein Zug Sf6 lässt die Drohung Dxe5\+ stehen/);
  });

  it("kleiner Abstand ohne Zeichen: kein Kommentar", () => {
    const urteil: Rateurteil = {
      art: "schwaecher",
      unterschied: 0.35,
      eigenerWert: { art: "bauern", bauern: 0.35 },
      partieWert: { art: "bauern", bauern: 0 },
      eigeneFolge: ["g7g6", "h5f3"],
    };
    expect(kommentarZumEigenenZug(umfeld, "g6", "Nc6", urteil)).toBeNull();
  });
});
