/**
 * Tests der festen Kennungen für Zählen, Röntgen und LAP (Nebenchat, Punkt B4): Aus der Kennung
 * einer Aufgabe entsteht wieder genau dieselbe Aufgabe.
 */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import { lapaufgabe } from "./planbilanztrainer";
import { roentgenaufgabe } from "./roentgentrainer";
import { zugfolgenstellungen } from "./roentgenstufen";
import {
  bilanzkennung,
  haengekennung,
  lapaufgabenAus,
  lapkennung,
  roentgenaufgabenAus,
  roentgenkennung,
  zaehlaufgabenAus,
} from "./wiederholbar";
import { haengendeFiguren, zaehlfelder } from "./zaehltrainer";

const KAPITELZAHL = 13;
const kapitel = Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i));
const stellungen = buchstellungenAus(kapitel);

/** Frist des Röntgen-Tests (Millisekunden). */
const ROENTGEN_FRIST_MS = 30_000;

describe("Wiederholung: feste Kennungen", () => {
  it("Zählen: Bilanz- und Hängeaufgabe kommen aus ihrer Kennung zurück", () => {
    const buch = stellungen.find((b) => zaehlfelder(b).length > 0 && haengendeFiguren(b.stellung));
    if (!buch) throw new Error("keine Zählstellung");
    const bilanz = zaehlfelder(buch)[0];
    if (!bilanz) throw new Error("kein Feld");
    const haengend = haengendeFiguren(buch.stellung) ?? [];
    const h = { nummer: buch.nummer, fen: buch.stellung.fen, haengend };
    const zurueck = zaehlaufgabenAus(stellungen, [bilanzkennung(bilanz), haengekennung(h)]);
    expect(zurueck).toEqual([bilanz, h]);
  });

  it("Röntgen: auch Stellungen aus Zugfolgen kommen zurück", () => {
    const alle = [...stellungen, ...zugfolgenstellungen(kapitel)];
    const aufgabe = alle.flatMap((b) => roentgenaufgabe(b) ?? []).find((a) => a.zugfolge);
    if (!aufgabe) throw new Error("keine Zugfolgen-Aufgabe");
    expect(roentgenaufgabenAus(alle, [roentgenkennung(aufgabe)])).toEqual([aufgabe]);
    // Röntgen-Aufgaben aller Stellungen samt Zugfolgen: unter voller Last der Testläufe über
    // fünf Sekunden (beim Übernehmen, 31.10.2026), allein etwa eine Sekunde.
  }, ROENTGEN_FRIST_MS);

  it("LAP kommt aus der Kennung zurück; unbekannte Kennungen fallen weg", () => {
    const aufgabe = stellungen.flatMap((b) => lapaufgabe(b) ?? [])[0];
    if (!aufgabe) throw new Error("keine LAP-Aufgabe");
    expect(lapaufgabenAus(stellungen, [lapkennung(aufgabe), "lap-99.99"])).toEqual([aufgabe]);
  });
});
