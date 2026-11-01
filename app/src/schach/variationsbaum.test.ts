/**
 * Tests für den Zugbaum der Varianten (Lesen) und seine Änderungen.
 * Beispiel ist die Petroff-Falle wie Abb. 2.40: 1. e4 e5 2. Sf3 Sf6 3. Sxe5 mit 3... d6 (Haupt)
 * und 3... Sxe4?! 4. De2.
 */
import { describe, expect, it } from "vitest";
import type { Variationsknoten } from "../training/variationen";
import {
  alsHauptvariante,
  mitFortsetzung,
  mitLinie,
  mitZugdaten,
  ohneAbHier,
} from "./variationsaenderung";
import {
  abzweigpunkte,
  abzweigzahl,
  fenAm,
  fortsetzungenAm,
  hauptvariantenAnteil,
  knotenAm,
  knotenzahl,
  zeileDurch,
  type Zugbaum,
} from "./variationsbaum";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Eine Kette von Buchzügen; ``weiter`` hängt am letzten. */
function kette(zuege: readonly string[], weiter: Variationsknoten[] = []): Variationsknoten[] {
  return zuege.reduceRight<Variationsknoten[]>(
    (rest, zug) => [{ zug, herkunft: "buch", weiter: rest }],
    weiter,
  );
}

const PETROFF: Zugbaum = {
  startFen: GRUND,
  zuege: kette(
    ["e4", "e5", "Nf3", "Nf6", "Nxe5"],
    [
      ...kette(["d6", "Nf3", "Nxe4"]),
      { zug: "Nxe4", zeichen: "?!", kommentar: "gierig", weiter: kette(["Qe2"]) },
    ],
  ),
};
const BIS_SXE5 = ["e4", "e5", "Nf3", "Nf6", "Nxe5"];

describe("Zugbaum lesen", () => {
  it("zeigt die Zeile durch den Pfad mit Abzweig-Marke, Zugzeichen und Kommentar", () => {
    const zeile = zeileDurch(PETROFF, [...BIS_SXE5, "Nxe4"], "de");
    expect(zeile.map((z) => z.text)).toEqual(["e4", "e5", "Sf3", "Sf6", "Sxe5", "Sxe4?!", "De2"]);
    expect(zeile[4]?.abzweige).toBe(2);
    expect(zeile[5]).toMatchObject({ nummer: 3, weiss: false, kommentiert: true, eigen: true });
    expect(zeile[0]).toMatchObject({ eigen: false, abzweige: 0 });
  });

  it("folgt nach dem Pfad der Hauptvariante bis zum Ende", () => {
    const zeile = zeileDurch(PETROFF, BIS_SXE5, "en");
    expect(zeile.map((z) => z.san).slice(5)).toEqual(["d6", "Nf3", "Nxe4"]);
  });

  it("kennt Fortsetzungen, Knoten, FEN und den Anteil der Hauptvariante", () => {
    expect(fortsetzungenAm(PETROFF, BIS_SXE5).map((k) => k.zug)).toEqual(["d6", "Nxe4"]);
    expect(knotenAm(PETROFF, [])).toBeNull();
    expect(knotenAm(PETROFF, ["d4"])).toBeNull();
    expect(fenAm(PETROFF, ["e4"])).toBe(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1",
    );
    expect(hauptvariantenAnteil(PETROFF, [...BIS_SXE5, "Nxe4", "Qe2"])).toEqual(BIS_SXE5);
    expect(knotenzahl(PETROFF.zuege)).toBe(10);
    expect(abzweigzahl(PETROFF)).toBe(1);
  });

  it("findet die Abzweigpunkte für die Baum-Ansicht (Stufe 2)", () => {
    const baum = { startFen: GRUND, zuege: [...PETROFF.zuege, ...kette(["d4"])] };
    expect(abzweigpunkte(baum)).toEqual([
      { pfad: [], fortsetzungen: ["e4", "d4"], tiefe: 0 },
      { pfad: BIS_SXE5, fortsetzungen: ["d6", "Nxe4"], tiefe: 0 },
    ]);
  });
});

describe("Zugbaum ändern", () => {
  it("hängt einen neuen Zug hinten an und springt in vorhandene", () => {
    const neu = mitFortsetzung(PETROFF, BIS_SXE5, "Qe7");
    expect(neu.art).toBe("neu");
    if (neu.art !== "neu") return;
    expect(fortsetzungenAm({ ...PETROFF, zuege: neu.zuege }, BIS_SXE5).map((k) => k.zug)).toEqual([
      "d6",
      "Nxe4",
      "Qe7",
    ]);
    expect(mitFortsetzung(PETROFF, BIS_SXE5, "d6")).toEqual({
      art: "vorhanden",
      pfad: [...BIS_SXE5, "d6"],
    });
    expect(mitFortsetzung(PETROFF, BIS_SXE5, "Ke2").art).toBe("ungueltig");
    expect(PETROFF.zuege[0]?.weiter[0]?.weiter[0]?.weiter[0]?.weiter[0]?.weiter).toHaveLength(2);
  });

  it("bringt Züge in die Schreibweise von chessops und meldet volle Stellungen", () => {
    const leer = { startFen: GRUND, zuege: [] };
    const ergebnis = mitFortsetzung(leer, [], "Ng1f3");
    expect(ergebnis.art === "neu" && ergebnis.pfad).toEqual(["Nf3"]);
    // Dreißig Fortsetzungen (hier Platzhalter) sind die Grenze; ein weiterer Zug wird gemeldet.
    const dreissig = Array.from({ length: 30 }, (_, i) => ({ zug: `z${i}`, weiter: [] }));
    expect(mitFortsetzung({ startFen: GRUND, zuege: dreissig }, [], "e4").art).toBe("voll");
    expect(mitFortsetzung({ startFen: GRUND, zuege: dreissig.slice(1) }, [], "e4").art).toBe("neu");
  });

  it("macht einen Abzweig samt Weg zur Hauptvariante", () => {
    const zuege = alsHauptvariante(PETROFF, [...BIS_SXE5, "Nxe4", "Qe2"]);
    expect(zeileDurch({ ...PETROFF, zuege }, [], "en").map((z) => z.san)).toEqual([
      ...BIS_SXE5,
      "Nxe4",
      "Qe2",
    ]);
  });
});

describe("Zugbaum ändern: löschen, Zugdaten, Folgen", () => {
  it("löscht ab hier und gibt den Pfad davor zurück", () => {
    const ergebnis = ohneAbHier(PETROFF, [...BIS_SXE5, "Nxe4"]);
    expect(ergebnis.pfad).toEqual(BIS_SXE5);
    expect(knotenzahl(ergebnis.zuege)).toBe(8);
    expect(ohneAbHier(PETROFF, ["d4"]).zuege).toBe(PETROFF.zuege);
  });

  it("setzt und entfernt Zugzeichen und Kommentar", () => {
    const pfad = [...BIS_SXE5, "Nxe4"];
    const mit = mitZugdaten(PETROFF, pfad, { zeichen: "?", kommentar: "Abzug!" });
    expect(knotenAm({ ...PETROFF, zuege: mit }, pfad)).toMatchObject({
      zeichen: "?",
      kommentar: "Abzug!",
    });
    const ohne = mitZugdaten({ ...PETROFF, zuege: mit }, pfad, { zeichen: null, kommentar: "" });
    const knoten = knotenAm({ ...PETROFF, zuege: ohne }, pfad);
    expect(knoten && "zeichen" in knoten).toBe(false);
    expect(knoten && "kommentar" in knoten).toBe(false);
  });

  it("hängt eine Zugfolge an und merkt den ersten neuen Zug", () => {
    const linie = mitLinie(PETROFF, BIS_SXE5, ["Nxe4", "Qe2", "Qe7", "Qxe4"]);
    expect(linie.ersterNeuer).toEqual([...BIS_SXE5, "Nxe4", "Qe2", "Qe7"]);
    expect(linie.pfad).toHaveLength(9);
    expect(linie.abgebrochen).toBe(false);
    expect(mitLinie(PETROFF, [], ["e4", "Ke7", "Nf3"]).abgebrochen).toBe(true);
  });
});
