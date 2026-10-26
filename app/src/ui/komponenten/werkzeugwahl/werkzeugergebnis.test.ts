/**
 * Tests für den Sicht-Schalter: Werkzeuge mit Schalter ändern ihr Ergebnis mit der Sicht, die
 * ohne Schalter nicht (Wunsch des Autors nach dem Test von 0.2.27: „Tools, bei denen sich
 * wirklich nichts ändert, brauchen den Button nicht“).
 */
import { describe, expect, it } from "vitest";
import { werkzeugeFuer, wende } from "../../../analyse/register";
import type { Werkzeugergebnis } from "../../../analyse/werkzeug";
import {
  alleAbbildungen,
  naechsterBuchzug,
  stellungAus,
} from "../../../schach/buchabbildungen.testhilfe";
import type { Farbe } from "../../../schach/stellung";
import { OHNE_SICHT, hatSicht } from "./werkzeugergebnis";

/** Jede so vielte Abbildung des Buches wird geprüft; das hält den Test kurz. */
const SCHRITT = 6;

const STELLUNGEN = alleAbbildungen()
  .filter((_, stelle) => stelle % SCHRITT === 0)
  .map((a) => ({ id: a.id, stellung: stellungAus(a.fen) }))
  .filter((a) => a.stellung.regeln !== null);

/** Ergebnis eines Werkzeugs aus einer Sicht, als Text zum Vergleichen. */
function aus(id: string, nummer: string, sicht: Farbe): string {
  const eintrag = STELLUNGEN.find((s) => s.id === nummer);
  if (!eintrag) return "";
  const ergebnis: Werkzeugergebnis | null = wende(id, {
    stellung: eintrag.stellung,
    perspektive: sicht,
    zug: naechsterBuchzug(nummer) ?? undefined,
    fortsetzung: [],
  });
  // Ohne den Stempel der Sicht (`seite`), den `wende` immer setzt: Es zählt nur der Inhalt.
  return JSON.stringify(ergebnis ? { ...ergebnis, seite: undefined } : null);
}

/** Zahl der geprüften Abbildungen, an denen die Sicht etwas ändert. */
function aenderungen(id: string): number {
  return STELLUNGEN.filter((s) => aus(id, s.id, "white") !== aus(id, s.id, "black")).length;
}

describe("Sicht-Schalter", () => {
  const werkzeuge = werkzeugeFuer(12)
    .map((w) => w.id)
    .filter((id) => id !== "k1-zaehlen");

  it.each(werkzeuge.filter(hatSicht))("%s ändert sich mit der Sicht", (id) => {
    expect(aenderungen(id)).toBeGreaterThan(0);
  });

  it.each(werkzeuge.filter((id) => OHNE_SICHT.has(id)))(
    "%s hängt nicht von der Sicht ab, braucht also keinen Schalter",
    (id) => {
      expect(aenderungen(id)).toBe(0);
    },
  );
});
