/** Tests für das Nummernfeld „Abbildung öffnen“ (Konzept 6.1, findeAbbildung). */
import { describe, expect, it } from "vitest";
import { findeAbbildung, normiereNummer } from "./finde";

const VORHANDEN = Array.from({ length: 43 }, (_, i) => `1.${i + 1}`);

describe("normiereNummer", () => {
  it.each([
    ["1.26", "1.26"],
    ["1,26", "1.26"],
    ["Abb. 1.26", "1.26"],
    ["abb 1 26", "1.26"],
    [" 01.026 ", "1.26"],
    ["Abbildung 7.3", "7.3"],
  ])("versteht %s", (eingabe, erwartet) => {
    expect(normiereNummer(eingabe)).toBe(erwartet);
  });

  it.each(["", "abc", "1.", "126", "1.2.3"])("lehnt %s ab", (eingabe) => {
    expect(normiereNummer(eingabe)).toBeNull();
  });
});

describe("findeAbbildung", () => {
  it("findet Abb. 1.26 in Kapitel 1", () => {
    expect(findeAbbildung("1,26", VORHANDEN)).toEqual({
      art: "gefunden",
      nummer: "1.26",
      kapitel: 1,
    });
  });

  it("schlägt bei einer unbekannten Nummer die nächstliegenden vor", () => {
    const ergebnis = findeAbbildung("1.62", VORHANDEN);
    expect(ergebnis).toEqual({
      art: "unbekannt",
      nummer: "1.62",
      vorschlaege: ["1.43", "1.42", "1.41"],
    });
  });

  it("erkennt vertauschte Zahlen", () => {
    const ergebnis = findeAbbildung("26.1", VORHANDEN);
    expect(ergebnis.art === "unbekannt" && ergebnis.vorschlaege[0]).toBe("1.26");
  });

  it("meldet ungültige Eingaben", () => {
    expect(findeAbbildung("hallo", VORHANDEN)).toEqual({ art: "ungueltig" });
  });
});
