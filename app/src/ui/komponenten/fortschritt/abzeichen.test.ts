/**
 * Tests der Abzeichen: Bedingungen aus den Nutzerdaten, Tage hintereinander, stärkere Gegner,
 * brillanter Zug des Lesers.
 */
import { describe, expect, it } from "vitest";
import { UEBUNGEN_JE_KAPITEL } from "../../../daten/uebungsliste-daten";
import { leereDaten } from "../../../speicher/format";
import {
  ABZEICHEN,
  abzeichengrundlageAus,
  brillanterZug,
  erfuellteAbzeichen,
  laengsteTagesfolge,
} from "./abzeichen";
import { BEGINN, mitPartien, punkt, testpartie } from "./abzeichen.testhilfe";
import { MIN_HALBZUEGE } from "./erfahrung";

const LANG = Array.from({ length: MIN_HALBZUEGE }, (_, i) => (i % 2 === 0 ? "Nf3" : "Nf6"));

describe("Abzeichen", () => {
  it("hat 10 bis 20 Abzeichen mit eindeutigen Kennungen; leere Daten erfüllen keins", () => {
    expect(ABZEICHEN.length).toBeGreaterThanOrEqual(10);
    expect(ABZEICHEN.length).toBeLessThanOrEqual(20);
    expect(new Set(ABZEICHEN.map((a) => a.kennung)).size).toBe(ABZEICHEN.length);
    const g = abzeichengrundlageAus(leereDaten(new Date(BEGINN)), 0, false);
    expect(erfuellteAbzeichen(g)).toEqual([]);
  });

  it("erste Partie, erster Sieg, erstes Matt und Sieg aus eigener Kraft", () => {
    const daten = mitPartien([
      testpartie("matt", LANG, { gewonnen: true, matt: true, ruecknahmen: 1 }),
    ]);
    const erfuellt = erfuellteAbzeichen(abzeichengrundlageAus(daten, 0, false));
    expect(erfuellt).toEqual(["erstePartie", "ersterSieg", "erstesMatt"]);
    const ohneHilfe = mitPartien([testpartie("ohne", LANG, { gewonnen: true, werkzeuge: false })]);
    expect(erfuellteAbzeichen(abzeichengrundlageAus(ohneHilfe, 0, false))).toContain(
      "siegOhneHilfe",
    );
  });

  it("Sieg und Remis gegen Stärkere: ab 100 Punkten über der eigenen Wertung", () => {
    const daten = leereDaten(new Date(BEGINN));
    const mit = (wertung: ReturnType<typeof punkt>[]) =>
      erfuellteAbzeichen(
        abzeichengrundlageAus({ ...daten, spiel: { ...daten.spiel, wertung } }, 0, false),
      );
    expect(mit([punkt(1299, 1200, 1), punkt(1299, 1200, 0.5)])).not.toContain(
      "siegGegenStaerkeren",
    );
    const erfuellt = mit([punkt(1300, 1200, 1), punkt(1400, 1200, 0.5)]);
    expect(erfuellt).toContain("siegGegenStaerkeren");
    expect(erfuellt).toContain("remisGegenStaerkeren");
  });

  it("alle Übungen eines Kapitels gelöst", () => {
    const [kapitel, ids] = Object.entries(UEBUNGEN_JE_KAPITEL).find(([, l]) => l.length > 0) ?? [];
    const leer = leereDaten(new Date(BEGINN));
    const uebungen = Object.fromEntries(
      (ids ?? []).map((id) => [
        id,
        { kapitel: Number(kapitel), versuche: 1, geloest: true, zuletzt: BEGINN },
      ]),
    );
    const daten = { ...leer, fortschritt: { ...leer.fortschritt, uebungen } };
    const erfuellt = erfuellteAbzeichen(abzeichengrundlageAus(daten, 0, false));
    expect(erfuellt).toContain("ersteUebung");
    expect(erfuellt).toContain("kapitelUebungen");
  });

  it("Tage hintereinander: Lücken unterbrechen, mehrfach am selben Tag zählt einmal", () => {
    expect(laengsteTagesfolge([])).toBe(0);
    const tage = ["2026-10-01", "2026-10-02", "2026-10-02", "2026-10-03", "2026-10-05"];
    expect(laengsteTagesfolge(tage.map((t) => `${t}T12:00:00`))).toBe(3);
    const woche = Array.from({ length: 7 }, (_, i) => `2026-10-${String(10 + i)}T12:00:00`);
    expect(laengsteTagesfolge(woche)).toBe(7);
  });

  it("eine Woche dabei: aus Lernzeiten oder aus der besten Serie der Tagesaufgabe", () => {
    const leer = leereDaten(new Date(BEGINN));
    const gesehen = Object.fromEntries(
      Array.from({ length: 7 }, (_, i) => [`1.${i + 1}`, `2026-10-${String(10 + i)}T12:00:00`]),
    );
    const daten = { ...leer, fortschritt: { ...leer.fortschritt, gesehen } };
    expect(erfuellteAbzeichen(abzeichengrundlageAus(daten, 0, false))).toContain("woche");
    expect(erfuellteAbzeichen(abzeichengrundlageAus(leer, 7, false))).toEqual(["woche"]);
  });

  it("brillanter Zug: ein Opfer des Lesers als bester Zug, nicht einer der Engine", () => {
    // 1. e4 e5 2. Dh5 Sc6 3. Dxf7+ Kxf7: Die Dame gibt sich auf f7 hin; mit den Werten der Engine
    // ist 3. Dxf7+ hier der beste Zug ohne Verlust.
    const sans = ["e4", "e5", "Qh5", "Nc6", "Qxf7+", "Kxf7"];
    const partie = testpartie("opfer", sans);
    const werte = Array.from({ length: sans.length + 1 }, () => 0.3);
    const beste = ["", "", "", "", "h5f7", ""];
    const eintrag = { partie, werte, beste, abstaende: [], varianten: [] };
    expect(brillanterZug([eintrag])).toBe(true);
    expect(brillanterZug([{ ...eintrag, werte: [] }])).toBe(false);
    const alsEngine = {
      ...eintrag,
      partie: { ...partie, einstellung: { ...partie.einstellung, eigeneFarbe: "black" as const } },
    };
    const engineZuege = partie.zuege.map((z, i) => ({
      ...z,
      von: i % 2 === 0 ? ("engine" as const) : ("leser" as const),
    }));
    expect(
      brillanterZug([{ ...alsEngine, partie: { ...alsEngine.partie, zuege: engineZuege } }]),
    ).toBe(false);
  });
});

describe("Abzeichen aus Teillisten (Welle 0 der Gamifizierung)", () => {
  it("jedes Abzeichen hat Name und Bedingung in beiden Sprachen und ein eigenes Bild", async () => {
    const de = (await import("../../../i18n/de.json")).default as Record<string, string>;
    const en = (await import("../../../i18n/en.json")).default as Record<string, string>;
    const { hatOrdenkunst } = await import("../ordenkunst/entwuerfe");
    for (const { kennung } of ABZEICHEN) {
      for (const sprache of [de, en]) {
        expect(sprache[`abzeichen.name.${kennung}`], kennung).toBeTruthy();
        expect(sprache[`abzeichen.bedingung.${kennung}`], kennung).toBeTruthy();
      }
      expect(hatOrdenkunst("abzeichen", kennung), kennung).toBe(true);
    }
  });

  it("die Grundlage enthält die Daten für die Bedingungen der Pakete", () => {
    const daten = leereDaten(new Date(BEGINN));
    expect(abzeichengrundlageAus(daten, 0, false).daten).toBe(daten);
  });
});
