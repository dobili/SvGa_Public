/**
 * Tests der englischen Sprachdatei (seit 0.2.104): gleiche Schlüssel und Platzhalter wie
 * Deutsch, englische Figurenbuchstaben in Zügen, Buchzitate bleiben deutsch.
 */
import { afterEach, describe, expect, it } from "vitest";
import de from "./de.json";
import en from "./en.json";
import buchzitate from "./en.buchzitate.json";
import { datensprache, datumText, GRUNDSPRACHE, setzeSprache, t, zahlText } from "./sprache";

const DEUTSCH: Readonly<Record<string, string>> = de;
const ENGLISCH: Readonly<Record<string, string>> = en;

/** Die Platzhalter eines Textes, sortiert, etwa ["farbe", "feld"]. */
function platzhalter(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1] ?? "").sort();
}

afterEach(() => {
  setzeSprache(GRUNDSPRACHE);
});

describe("englische Sprachdatei", () => {
  it("hat jeden deutschen Schlüssel, außer den wörtlichen Buchzitaten", () => {
    const fehlend = Object.keys(DEUTSCH).filter((k) => !(k in ENGLISCH));
    expect(fehlend.sort()).toEqual([...buchzitate].sort());
    expect(Object.keys(ENGLISCH).filter((k) => !(k in DEUTSCH))).toEqual([]);
  });

  it("hat dieselben Platzhalter wie Deutsch", () => {
    const abweichend = Object.entries(ENGLISCH).filter(
      ([k, v]) => platzhalter(v).join() !== platzhalter(DEUTSCH[k] ?? "").join(),
    );
    expect(abweichend.map(([k]) => k)).toEqual([]);
  });

  it("schreibt Züge mit englischen Buchstaben (Lf4 → Bf4) und Zahlen mit Punkt", () => {
    const deutscherZug = /\b[DTLS][a-h]?[1-8]?x?[a-h][1-8]\b/;
    const dezimalkomma = /\d,\d/;
    const auffaellig = Object.entries(ENGLISCH).filter(
      ([, v]) => deutscherZug.test(v) || dezimalkomma.test(v),
    );
    expect(auffaellig.map(([k]) => k)).toEqual([]);
  });
});

describe("Wechsel auf Englisch", () => {
  it("zeigt englische Texte, Buchzitate deutsch, Buchdaten deutsch", () => {
    setzeSprache("en");
    expect(t("abbildung.titel", { nummer: "1.26" })).toBe("Fig. 1.26");
    // Seit 0.2.116 sind auch die Buchzitate übersetzt (EN2); die Liste ist leer.
    expect(buchzitate).toEqual([]);
    expect(t("regeln.titel")).toBe("The six golden endgame rules");
    expect(datensprache()).toBe("de");
  });

  it("formatiert Zahlen und Daten nach der Sprache", () => {
    const tag = new Date(2026, 9, 19);
    expect(zahlText(1.25, 1)).toBe("1,3");
    expect(zahlText(3, 1, false)).toBe("3");
    expect(datumText(tag)).toBe("19.10.2026");
    setzeSprache("en");
    expect(zahlText(1.25, 1)).toBe("1.3");
    expect(datumText(tag)).toBe("10/19/2026");
  });
});
