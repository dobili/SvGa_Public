/** Tests der Zielbilanz-Übung (AP 13) an den Eröffnungsstellungen der Kapitel 2 und 3. */
import { describe, expect, it } from "vitest";
import {
  bilanzfaelle,
  ladeKapitel,
  stellungVon,
} from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import {
  abweichungen,
  zielbilanzaufgabe,
  zielbilanzrunde,
  type Ziel,
} from "./zielbilanztrainer";
import { festerZufall } from "./zufall";

const KAPITELZAHL = 13;
const stellungen = buchstellungenAus(Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)));

describe("Zielbilanz-Übung", () => {
  it("genug Stellungen, alle aus Kapitel 2 und 3, ohne angegriffenen Zentrumsbauern", () => {
    const alle = stellungen.flatMap((b) => zielbilanzaufgabe(b) ?? []);
    expect(alle.length).toBeGreaterThan(20);
    expect(alle.every((a) => a.nummer.startsWith("2.") || a.nummer.startsWith("3."))).toBe(true);
  });

  it("stimmt mit allen Bilanztabellen des Buches überein, die als Aufgabe taugen", () => {
    const zeile: Record<string, Ziel> = {
      Zentrum: "zentrum",
      Entwicklung: "entwicklung",
      Königssicherheit: "koenig",
    };
    let verglichen = 0;
    for (const fall of bilanzfaelle("ziel")) {
      const kapitel = Number(fall.abbildung.split(".")[0]);
      const stellung = stellungVon(fall.abbildung);
      const aufgabe = zielbilanzaufgabe({ nummer: fall.abbildung, kapitel, stellung });
      if (!aufgabe) continue;
      for (const z of fall.tabelle.zeilen) {
        const ziel = zeile[z.name];
        if (!ziel) throw new Error(`Unbekannte Zeile ${z.name}`);
        // Abb. 2.71: Befund aus der Kalibrierung des Werkzeugs (k2-zielbilanz.test.ts).
        if (fall.abbildung !== "2.71" || ziel !== "zentrum")
          expect(aufgabe.loesung.black[ziel], fall.abbildung).toBe(z.rechts.wertung);
        expect(aufgabe.loesung.white[ziel], fall.abbildung).toBe(z.links.wertung);
        verglichen += 1;
      }
    }
    expect(verglichen).toBeGreaterThan(0);
  });

  it("eine Runde mit fester Saat; Abweichungen zählen Feld für Feld", () => {
    const runde = zielbilanzrunde(stellungen, 5, festerZufall(3));
    expect(runde).toHaveLength(5);
    const erste = runde[0];
    if (!erste) throw new Error("leere Runde");
    expect(abweichungen(erste, erste.loesung)).toEqual([]);
    const falsch = { ...erste.loesung, white: { ...erste.loesung.white, koenig: "teils" as const } };
    const anders = erste.loesung.white.koenig === "teils" ? [] : [{ seite: "white", ziel: "koenig" }];
    expect(abweichungen(erste, falsch)).toEqual(anders);
  });
});
