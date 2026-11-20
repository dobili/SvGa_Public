/**
 * Test: Nutzerdaten der App auf main (Format 10, Version 0.3.55) werden in Format 11 (mit dem
 * Schach-Abenteuer) ohne Verlust übernommen.
 *
 * Warum (Vorbereitung des Schritts nach main, 20.11.2026): Ab dem Schritt haben echte Leser
 * Daten im Format 10 auf dem Gerät; die Ausnahme der Beta (Speicherformat darf sich ändern,
 * Stände dürfen verloren gehen) gilt für sie nicht. Format 11 bringt nur Neues dazu: den
 * Spielstand `abenteuer` (leer) und in den Einstellungen Ton und Steuerkreuz des Spiels
 * (Vorgaben). Alles andere muss unverändert bleiben.
 */
import { describe, expect, it } from "vitest";
import { leereDaten, SCHEMA_VERSION, STANDARD_ABENTEUERTON, wandleUm } from "./format";

const JETZT = new Date("2026-11-20T10:00:00.000Z");

/** Daten wie aus der App auf main: Format 10, ohne die Felder des Spiels, mit etwas Lernstand. */
function format10(): Record<string, unknown> {
  const daten: Record<string, unknown> = { ...leereDaten(JETZT), schemaVersion: 10 };
  delete daten.abenteuer;
  const einstellungen: Record<string, unknown> = {
    ...leereDaten(JETZT).einstellungen,
    brettfarben: "gruen",
  };
  delete einstellungen.abenteuerton;
  delete einstellungen.abenteuersteuerkreuz;
  return { ...daten, lernstand: { 2: [0, 1], 6: [3] }, einstellungen };
}

describe("Format 10 → 11 (main → Spiel)", () => {
  it("übernimmt alles, ergänzt nur den leeren Spielstand und die Vorgaben des Spiels", () => {
    const alt = format10();
    const ergebnis = wandleUm(JSON.parse(JSON.stringify(alt)), JETZT);
    if (!ergebnis.ok) throw new Error("nicht gelesen");
    expect(ergebnis.vonVersion).toBe(10);
    const { abenteuer, schemaVersion, einstellungen, ...rest } = ergebnis.daten;
    expect(schemaVersion).toBe(SCHEMA_VERSION);
    expect(abenteuer).toBeNull();
    const { abenteuerton, abenteuersteuerkreuz, ...alteEinstellungen } = einstellungen;
    expect(abenteuerton).toEqual(STANDARD_ABENTEUERTON);
    expect(abenteuersteuerkreuz).toBe("rechts");
    expect({ ...rest, schemaVersion: 10, einstellungen: alteEinstellungen }).toEqual(alt);
  });
});
