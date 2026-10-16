/**
 * Tests für die Datensicherung: Rundreise Export → Import auf einem zweiten Gerät, Prüfung
 * fremder, beschädigter und neuerer Dateien, sanfter Hinweis alle vier Wochen.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { leereDaten, SCHEMA_VERSION } from "./format";
import { markiereGesehen, notiereUebung } from "./fortschritt";
import {
  DATEIKENNUNG,
  dateiname,
  pruefeSicherung,
  sicherungAlsText,
  sicherungFaellig,
} from "./sicherung";
import { frischeUmgebung } from "./testhilfen";

const JETZT = new Date("2026-10-15T10:00:00.000Z");
const TAG_MS = 86_400_000;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Rundreise", () => {
  it("überträgt alle Daten von einem Gerät auf ein anderes", async () => {
    frischeUmgebung();
    const erstes = await import("./speicher");
    const sicherungErstes = await import("./sicherung");
    await erstes.lade(JETZT);
    await erstes.aendere((d) => ({
      ...markiereGesehen(d, "1.26", JETZT),
      einstellungen: {
        brettfarben: "gruen",
        strenge: "streng",
        figurensatz: "kontrastreich",
        ton: "an",
      },
      lernstand: { 1: [0, 2] },
    }));
    const text = await sicherungErstes.exportiere("0.2.22", JETZT);
    const daheim = erstes.speicherzustand().daten;
    expect(daheim.letzteSicherung).toBe(JETZT.toISOString());

    // Zweites Gerät: frische Datenbank, frische Module.
    frischeUmgebung();
    const zweites = await import("./speicher");
    const sicherungZweites = await import("./sicherung");
    await zweites.lade(JETZT);
    const pruefung = sicherungZweites.pruefeSicherung(text, JETZT);
    expect(pruefung.ok && pruefung.appVersion).toBe("0.2.22");
    if (!pruefung.ok) return;
    expect(await sicherungZweites.importiere(pruefung.daten)).toBe(true);
    expect(zweites.speicherzustand().daten).toEqual(daheim);

    // Auch nach einem Neustart des zweiten Geräts ist alles da.
    vi.resetModules();
    const neu = await import("./speicher");
    await neu.lade(JETZT);
    expect(neu.speicherzustand().daten).toEqual(daheim);
  });
});

describe("Prüfung der Datei", () => {
  const gueltig = sicherungAlsText(leereDaten(JETZT), "0.2.22", JETZT);

  it("nimmt eine gültige Sicherung an", () => {
    expect(pruefeSicherung(gueltig, JETZT)).toEqual({
      ok: true,
      daten: leereDaten(JETZT),
      appVersion: "0.2.22",
      exportiert: JETZT.toISOString(),
    });
  });

  it("wandelt eine Sicherung im alten Format um", () => {
    const alt = JSON.stringify({ art: DATEIKENNUNG, daten: { lernstand: { 3: [1] } } });
    const pruefung = pruefeSicherung(alt, JETZT);
    expect(pruefung.ok && pruefung.daten.lernstand).toEqual({ 3: [1] });
  });

  it("lehnt Fremdes, Beschädigtes und Neueres mit Grund ab", () => {
    const mit = (daten: unknown) => JSON.stringify({ art: DATEIKENNUNG, daten });
    expect(pruefeSicherung("%PDF-1.7", JETZT)).toEqual({ ok: false, grund: "keinJson" });
    expect(pruefeSicherung('{"schemaVersion":1}', JETZT)).toEqual({ ok: false, grund: "fremd" });
    expect(pruefeSicherung(mit("x"), JETZT)).toEqual({ ok: false, grund: "kaputt" });
    expect(pruefeSicherung(mit({ schemaVersion: SCHEMA_VERSION + 1 }), JETZT)).toEqual({
      ok: false,
      grund: "neuer",
    });
  });

  it("benennt die Datei mit dem Datum", () => {
    expect(dateiname(JETZT)).toBe("schach-von-grund-auf-sicherung-2026-10-15.json");
  });
});

describe("Hinweis alle vier Wochen", () => {
  const mitDaten = notiereUebung(leereDaten(JETZT), { id: "a", kapitel: 1, richtig: true }, JETZT);
  const spaeter = (tage: number) => new Date(JETZT.getTime() + tage * TAG_MS);

  it("schweigt ohne eigene Daten und in den ersten vier Wochen", () => {
    expect(sicherungFaellig(leereDaten(JETZT), spaeter(100))).toBe(false);
    expect(sicherungFaellig(mitDaten, spaeter(27))).toBe(false);
  });

  it("erinnert nach vier Wochen ohne Sicherung, danach wieder vier Wochen Ruhe", () => {
    expect(sicherungFaellig(mitDaten, spaeter(28))).toBe(true);
    const gesichert = { ...mitDaten, letzteSicherung: spaeter(28).toISOString() };
    expect(sicherungFaellig(gesichert, spaeter(40))).toBe(false);
    expect(sicherungFaellig(gesichert, spaeter(56))).toBe(true);
  });
});
