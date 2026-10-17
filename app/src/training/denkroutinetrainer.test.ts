/** Tests des Denkroutine-Trainers (Kapitel 12): Stellungen, Eingaben, Urteil. */
import { describe, expect, it } from "vitest";
import { ladeKapitel, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import {
  denkaufgabe,
  denkrunde,
  geloest,
  pruefeKandidat,
  type Kandidatpruefung,
} from "./denkroutinetrainer";
import { festerZufall } from "./zufall";

const KAPITELZAHL = 13;
const stellungen = buchstellungenAus(Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)));
const FEN_12_1 = stellungVon("12.1").fen;

describe("Denkroutine-Trainer", () => {
  it("nimmt Stellungen aus Kapitel 7, 11 und 12, keine im Schach", () => {
    const alle = stellungen.flatMap((b) => denkaufgabe(b) ?? []);
    expect(alle.length).toBeGreaterThan(30);
    expect(alle.every((a) => /^(7|11|12)\./.test(a.nummer))).toBe(true);
    expect(denkrunde(stellungen, 3, festerZufall(1))).toHaveLength(3);
  });

  it("Abb. 12.1: Lxh7+ mit Kxh7 vollständig, deutsch und englisch", () => {
    expect(pruefeKandidat(FEN_12_1, "Lxh7+", "Kxh7")).toMatchObject({
      art: "vollstaendig",
      kandidat: "Bxh7+",
      antwort: "Kxh7",
    });
    expect(pruefeKandidat(FEN_12_1, "Bxh7", "Kxh7").art).toBe("vollstaendig");
  });

  it("meldet fehlende und falsche Eingaben", () => {
    expect(pruefeKandidat(FEN_12_1, "", "").art).toBe("leer");
    expect(pruefeKandidat(FEN_12_1, "Lxh7+", "").art).toBe("antwortFehlt");
    expect(pruefeKandidat(FEN_12_1, "Ke5", "Kxh7").art).toBe("kandidatUngueltig");
    expect(pruefeKandidat(FEN_12_1, "Lxh7+", "Kxh6").art).toBe("antwortUngueltig");
  });

  it("gelöst nur vollständig und höchstens 0,5 hinter der Engine", () => {
    const voll = pruefeKandidat(FEN_12_1, "Lxh7+", "Kxh7");
    const zwei: Kandidatpruefung[] = [voll, voll];
    const vergleich = (besser: number) => ({
      besterZug: "Bxh7+",
      besterWert: 2,
      kandidaten: [
        { zug: "Bxh7+", wert: besser, antwort: "Kxh7" },
        { zug: "Qc2", wert: 0.3, antwort: "g6" },
      ],
    });
    expect(geloest(zwei, vergleich(1.8))).toBe(true);
    expect(geloest(zwei, vergleich(1.2))).toBe(false);
    expect(geloest([voll, { art: "antwortFehlt", kandidat: "Qc2" }], vergleich(2))).toBe(false);
  });
});
