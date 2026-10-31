/**
 * Tests der Röntgen-Stufen (Nebenchat, 30.10.2026): Jede Stufe hat genug Aufgaben aus den
 * Abbildungen und Zugfolgen des Buches, und die Stufen messen die Zahl der Pfeile.
 */
import { describe, expect, it } from "vitest";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { buchstellungenAus } from "./buchstellungen";
import { roentgenaufgabe } from "./roentgentrainer";
import {
  ROENTGENSTUFEN,
  roentgenrundeNachStufe,
  roentgenstufe,
  zugfolgenstellungen,
} from "./roentgenstufen";
import { festerZufall } from "./zufall";

const KAPITELZAHL = 13;
const kapitel = Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i));
const stellungen = [...buchstellungenAus(kapitel), ...zugfolgenstellungen(kapitel)];
/** So viele Aufgaben braucht eine Stufe mindestens, damit Runden abwechseln. */
const MINDESTENS_JE_STUFE = 20;
const RUNDE = 5;
/** Alle Stellungen durchzurechnen dauert unter Last länger als die übliche Frist. */
const LANGE_FRIST_MS = 60_000;

describe("Röntgen-Stufen", () => {
  it("Zugfolgen liefern zusätzliche Stellungen mit Titel und Zug", () => {
    const zugfolgen = zugfolgenstellungen(kapitel);
    expect(zugfolgen.length).toBeGreaterThan(100);
    expect(zugfolgen[0]?.zugfolge?.zug).toBeGreaterThanOrEqual(8);
  });

  it("jede Stufe hat genug Aufgaben", { timeout: LANGE_FRIST_MS }, () => {
    const zaehlung = { leicht: 0, mittel: 0, schwer: 0 };
    for (const buch of stellungen) {
      const aufgabe = roentgenaufgabe(buch);
      if (aufgabe) zaehlung[roentgenstufe(aufgabe)] += 1;
      if (ROENTGENSTUFEN.every((s) => zaehlung[s] > MINDESTENS_JE_STUFE)) break;
    }
    for (const stufe of ROENTGENSTUFEN) expect(zaehlung[stufe]).toBeGreaterThan(MINDESTENS_JE_STUFE);
  });

  it("eine Runde „schwer“ enthält nur schwere Aufgaben", () => {
    const runde = roentgenrundeNachStufe(stellungen, "schwer", RUNDE, festerZufall(3));
    expect(runde).toHaveLength(RUNDE);
    expect(runde.every((a) => roentgenstufe(a) === "schwer")).toBe(true);
  });
});
