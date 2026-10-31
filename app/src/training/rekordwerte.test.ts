/**
 * Tests der Rekordwerte aus den Nutzerdaten (Gamifizierung P5): Tagesprotokoll, Wertung ohne
 * vorläufige Partien, besiegte Bots, Partie ohne Patzer, „Zug erraten“.
 */
import { describe, expect, it } from "vitest";
import { staerkeDesBots } from "../engine/botstaerke";
import { ANFANGSPARTIEN } from "../spiel/wertung";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import { testpartie, punkt } from "../ui/komponenten/fortschritt/abzeichen.testhilfe";
import {
  besteRatequote,
  hoechsteWertung,
  laengstePartieOhnePatzer,
  meisteLerntageInEinerWoche,
  meisteRichtigeAnEinemTag,
  staerksterBesiegterBot,
} from "./rekordwerte";

const LEER = leereDaten(new Date("2026-10-31T10:00:00.000Z"));

describe("Rekordwerte", () => {
  it("leere Daten haben keine Werte", () => {
    for (const f of [
      meisteRichtigeAnEinemTag,
      meisteLerntageInEinerWoche,
      hoechsteWertung,
      staerksterBesiegterBot,
      laengstePartieOhnePatzer,
      besteRatequote,
    ])
      expect(f(LEER), f.name).toBeNull();
  });

  it("Tagesprotokoll: meiste Richtige an einem Tag, meiste Lerntage einer Woche", () => {
    const daten: Nutzerdaten = {
      ...LEER,
      aktivitaet: {
        "2026-10-26": { trainerRichtig: 12, trainerAntwort: 14 },
        "2026-10-28": { abbildung: 3 },
        "2026-10-30": { trainerRichtig: 30, trainerAntwort: 31 },
        "2026-11-02": { partie: 1 },
        "2026-11-03": { sammlung: 1 },
      },
    };
    expect(meisteRichtigeAnEinemTag(daten)).toBe(30);
    // Woche ab 26.10.: drei Lerntage; Woche ab 2.11.: einer (Sammlung ist keine Lernart).
    expect(meisteLerntageInEinerWoche(daten)).toBe(3);
  });

  it("Wertung: erst ab der zehnten Partie einer Zeitklasse", () => {
    const vorlaeufig = Array.from({ length: ANFANGSPARTIEN - 1 }, (_, i) => punkt(900, 1400 - i, 1));
    const daten = { ...LEER, spiel: { ...LEER.spiel, wertung: vorlaeufig } };
    expect(hoechsteWertung(daten)).toBeNull();
    const mehr = [...vorlaeufig, punkt(900, 1180, 0), punkt(900, 1215, 1), punkt(900, 1190, 0)];
    expect(hoechsteWertung({ ...LEER, spiel: { ...LEER.spiel, wertung: mehr } })).toBe(1215);
  });

  it("stärkster besiegter Bot nach der Zahl in der Zeitklasse", () => {
    const besiegt = { blitz: [], rapid: ["ella", "leyla"], classical: [] };
    const daten = { ...LEER, spiel: { ...LEER.spiel, besiegt } };
    const erwartet = Math.max(staerkeDesBots("ella") ?? 0, staerkeDesBots("leyla") ?? 0);
    expect(erwartet).toBeGreaterThan(0);
    expect(staerksterBesiegterBot(daten)).toBe(erwartet);
  });

  it("Partie ohne Patzer: nur ausgewertete Partien, ein ?? des Lesers schließt aus", () => {
    const sans = ["e4", "e5", "Nf3", "Nc6", "Bc4", "Nf6"];
    const partie = testpartie("ruhig", sans);
    const eintrag = { partie, werte: sans.map(() => 0.3).concat(0.3), beste: [], abstaende: [] };
    const mit = (werte: number[]) => ({
      ...LEER,
      spiel: { ...LEER.spiel, partien: [{ ...eintrag, werte, varianten: [] }] },
    });
    expect(laengstePartieOhnePatzer(mit(eintrag.werte))).toBe(sans.length);
    expect(laengstePartieOhnePatzer(mit([]))).toBeNull();
    // 3. Lc4 (Halbzug 5, Leser) verliert 5 Bauern: Patzer.
    const patzer = [0.3, 0.3, 0.3, 0.3, 0.3, -4.7, -4.7];
    expect(laengstePartieOhnePatzer(mit(patzer))).toBeNull();
  });

  it("Zug erraten: beste Quote ab 10 Versuchen", () => {
    const datum = "2026-10-30T10:00:00.000Z";
    const zugErraten = {
      "Opernpartie (white)": [
        { datum, treffer: 9, versuche: 12 },
        { datum, treffer: 3, versuche: 3 },
      ],
    };
    expect(besteRatequote({ ...LEER, zugErraten })).toBe(75);
  });
});
