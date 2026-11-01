/** Tests für das Abfragen einer Variante (Variationsbrowser, Stufe 4). */
import { describe, expect, it } from "vitest";
import { vereinige } from "../schach/baumvereinigung";
import {
  abfrageAnfang,
  abfragelinien,
  gezogeneZuege,
  mitGezeigtemZug,
  nachAntwort,
  naechsteLinie,
  pruefeAbfragezug,
  type Abfrage,
} from "./variantenabfrage";
import { linieAlsKnoten } from "./variationsquellen";

const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const linie = (text: string) => linieAlsKnoten(GRUND, text.split(" "), "buch").knoten;
/** Petroff wie Abb. 2.40: Hauptvariante 3... d6, Nebenvariante 3... Sxe4?!. */
const PETROFF = {
  startFen: GRUND,
  zuege: vereinige(linie("e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4"), linie("e4 e5 Nf3 Nf6 Nxe5 Nxe4 Qe2")),
};

function abfrage(seite: "white" | "black", start: readonly string[] = []): Abfrage {
  return { baum: PETROFF, linien: abfragelinien(PETROFF, start, seite), seite };
}

describe("abfragelinien", () => {
  it("Hauptvariante zuerst, der Abzweig fragt erst ab dem Abzweig", () => {
    const linien = abfragelinien(PETROFF, [], "black");
    expect(linien).toHaveLength(2);
    expect(linien[0]).toEqual({ pfad: ["e4", "e5", "Nf3", "Nf6", "Nxe5", "d6", "Nf3", "Nxe4"], ab: 0 });
    expect(linien[1]?.ab).toBe(5);
  });

  it("Linien ohne eigenen Zug ab dem Abzweig fallen weg", () => {
    // Weiß: Im Abzweig 3... Sxe4 hat Weiß noch 4. De2 → bleibt; ohne De2 fiele die Linie weg.
    const kurz = { startFen: GRUND, zuege: vereinige(linie("e4 e5 Nf3 Nf6 Nxe5 d6"), linie("e4 e5 Nf3 Nf6 Nxe5 Nxe4")) };
    expect(abfragelinien(kurz, [], "white")).toHaveLength(1);
    expect(abfragelinien(PETROFF, [], "white")).toHaveLength(2);
  });

  it("ein fremder Startpfad ergibt keine Linien", () => {
    expect(abfragelinien(PETROFF, ["d4"], "white")).toEqual([]);
  });
});

describe("Ablauf", () => {
  it("als Schwarz: die App zieht 1. e4, gefragt ist 1... e5", () => {
    const a = abfrage("black");
    const stand = abfrageAnfang(a);
    expect(gezogeneZuege(a, stand)).toEqual(["e4"]);
    expect(pruefeAbfragezug(a, stand, "e5")).toBe("richtig");
    expect(pruefeAbfragezug(a, stand, "c5")).toBe("falsch");
  });

  it("richtig → Antwort der Gegenseite; falsch zählt und zeigt den Zug", () => {
    const a = abfrage("black");
    let stand = nachAntwort(a, abfrageAnfang(a), "falsch");
    expect(stand.gezeigt).toBe(true);
    stand = nachAntwort(a, stand, "richtig");
    expect(gezogeneZuege(a, stand)).toEqual(["e4", "e5", "Nf3"]);
    expect(stand).toMatchObject({ richtig: 0, gefragt: 1, fehlerHier: 0, gezeigt: false });
  });

  it("ein Zug einer anderen Linie zählt nicht als Fehler", () => {
    const a = abfrage("black");
    let stand = abfrageAnfang(a);
    for (const zug of ["e5", "Nf6"]) stand = nachAntwort(a, stand, pruefeAbfragezug(a, stand, zug));
    expect(pruefeAbfragezug(a, stand, "Nxe4")).toBe("andere");
    expect(nachAntwort(a, stand, "andere")).toBe(stand);
  });

  it("zwei Linien nacheinander, dann fertig", () => {
    const a = abfrage("black");
    let stand = abfrageAnfang(a);
    for (const zug of ["e5", "Nf6", "d6", "Nxe4"]) stand = nachAntwort(a, stand, pruefeAbfragezug(a, stand, zug));
    expect(stand.linieFertig).toBe(true);
    stand = naechsteLinie(a, stand);
    expect(gezogeneZuege(a, stand)).toEqual(["e4", "e5", "Nf3", "Nf6", "Nxe5"]);
    stand = mitGezeigtemZug(stand);
    stand = nachAntwort(a, stand, pruefeAbfragezug(a, stand, "Nxe4"));
    expect(stand.linieFertig).toBe(true);
    expect(stand).toMatchObject({ richtig: 4, gefragt: 5 });
    expect(naechsteLinie(a, stand).fertig).toBe(true);
  });

  it("ab einem Startpfad als Weiß", () => {
    const a = abfrage("white", ["e4", "e5", "Nf3", "Nf6"]);
    const stand = abfrageAnfang(a);
    expect(gezogeneZuege(a, stand)).toEqual(["e4", "e5", "Nf3", "Nf6"]);
    expect(pruefeAbfragezug(a, stand, "Nxe5")).toBe("richtig");
  });
});
