/**
 * Referenztests für das Werkzeug k1-zaehlen: Es muss die Pfeile des Buches reproduzieren.
 *
 * Die Stellungen und Pfeile kommen aus den erzeugten Buchdaten (public/daten/de/a1/kap01.json),
 * also genau aus dem LaTeX. Buchbezug: Kapitel 1, Abb. 1.6, 1.26 und 1.28.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Kapitel } from "../daten/generiert/kapitel";
import { feldAusName, stellungAusFen } from "../schach/stellung";
import { zaehle } from "./k1-zaehlen";
import type { Markierung } from "./werkzeug";

const kapitel1 = JSON.parse(
  readFileSync(new URL("../../public/daten/de/a1/kap01.json", import.meta.url), "utf8"),
) as Kapitel;

/** Wendet das Werkzeug auf eine Abbildung an und liefert das Ergebnis. */
function zaehleInAbbildung(nummer: string, feld: string) {
  const abbildung = kapitel1.abbildungen.find((a) => a.id === nummer);
  if (!abbildung) throw new Error(`Abb. ${nummer} fehlt in den Daten`);
  const stellung = stellungAusFen(abbildung.fen);
  const ziel = feldAusName(feld);
  if (!stellung.ok || ziel === null) throw new Error(`Abb. ${nummer} nicht lesbar`);
  return { abbildung, ergebnis: zaehle(stellung.wert, ziel) };
}

/** Pfeile als vergleichbare Texte wie „rot c5-d4“, sortiert. */
function pfeiltexte(liste: readonly { farbe: string; von: string; nach: string }[]): string[] {
  return liste.map((p) => `${p.farbe} ${p.von}-${p.nach}`).sort();
}

function nurPfeile(markierungen: readonly Markierung[]) {
  return markierungen.flatMap((m) => (m.typ === "pfeil" ? [m] : []));
}

describe("k1-zaehlen reproduziert die Buchpfeile", () => {
  it.each([
    ["1.26", "d4"],
    ["1.28", "d4"],
    ["1.6", "d4"],
  ])("Abb. %s, Feld %s", (nummer, feld) => {
    const { abbildung, ergebnis } = zaehleInAbbildung(nummer, feld);
    expect(pfeiltexte(nurPfeile(ergebnis.markierungen))).toEqual(pfeiltexte(abbildung.pfeile));
  });
});

describe("k1-zaehlen nennt Figuren und Bilanz wie das Buch", () => {
  it("Abb. 1.26: drei gegen drei, Dame b6 in Batterie hinter c5, Dame d1 über die d-Linie", () => {
    const { ergebnis } = zaehleInAbbildung("1.26", "d4");
    const [angreifer, verteidiger] = ergebnis.befunde;
    expect(angreifer?.titel).toBe("Schwarz greift an");
    expect(angreifer?.zeilen).toEqual(["Bauer c5", "Springer c6", "Dame b6 (Batterie hinter c5)"]);
    expect(verteidiger?.zeilen).toEqual(["Bauer c3", "Springer f3", "Dame d1 (über die d-Linie)"]);
    expect(ergebnis.fazit).toBe("3 gegen 3: Noch geht nichts: Schlagen gewinnt kein Material.");
  });

  it("Abb. 1.28: zwei gegen eins, Schwarz gewinnt einen Bauern", () => {
    const { ergebnis } = zaehleInAbbildung("1.28", "d4");
    expect(ergebnis.fazit).toBe(
      "2 gegen 1: Schwarz gewinnt mit Sxd4 Sxd4 Dxd4 Material: +1 Bauerneinheit.",
    );
  });

  it("Abb. 1.6: Dame d8 hinter d5 und Dame d1 hinter Ld3 zählen nicht", () => {
    const { ergebnis } = zaehleInAbbildung("1.6", "d4");
    expect(ergebnis.fazit.startsWith("2 gegen 3")).toBe(true);
  });

  it("zeigt schon auf Stufe 1 Angreifer und Verteidiger (gestufte Karten seit 0.2.30)", () => {
    const { ergebnis } = zaehleInAbbildung("1.26", "d4");
    expect(ergebnis.stufen[0]).toEqual(["angreifer", "verteidiger"]);
  });

  it("markiert das gezählte Feld rot wie im Buch", () => {
    const { ergebnis } = zaehleInAbbildung("1.26", "d4");
    expect(ergebnis.markierungen).toContainEqual({ typ: "feld", farbe: "rot", feld: "d4" });
  });
});
