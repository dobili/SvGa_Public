/**
 * Tests für das Nummernfeld „Abbildung öffnen“ (Konzept 6.1, findeAbbildung). Dazu der
 * Abnahmepunkt A1 für 1.0 (Pflichtenheft 9): Jede Abbildung des Buches lässt sich über ihre
 * Nummer öffnen, geprüft an allen Nummern des eingecheckten Verzeichnisses.
 */
import { readFileSync } from "node:fs";
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

/** Verzeichnis der ausgelieferten Buchdaten: Kapitel mit ihren Abbildungsnummern. */
interface Verzeichnis {
  readonly kapitel: readonly {
    readonly kapitel: number;
    readonly abbildungen: readonly string[];
  }[];
}

describe("Abnahme A1: jede Abbildung über ihre Nummer", () => {
  const verzeichnis = JSON.parse(
    readFileSync(new URL("../../public/daten/de/a1/index.json", import.meta.url), "utf8"),
  ) as Verzeichnis;
  const alle = verzeichnis.kapitel.flatMap((k) => k.abbildungen);

  it("findet alle Nummern im richtigen Kapitel, auch mit Komma und „Abb.“", () => {
    expect(alle.length).toBeGreaterThan(700);
    const falsch = verzeichnis.kapitel.flatMap((k) =>
      k.abbildungen.filter((nummer) => {
        const mitKomma = findeAbbildung(`Abb. ${nummer.replace(".", ",")}`, alle);
        return !(
          mitKomma.art === "gefunden" &&
          mitKomma.nummer === nummer &&
          mitKomma.kapitel === k.kapitel
        );
      }),
    );
    expect(falsch).toEqual([]);
  });

  it("jede Nummer steht nur einmal im Verzeichnis", () => {
    expect(new Set(alle).size).toBe(alle.length);
  });
});
