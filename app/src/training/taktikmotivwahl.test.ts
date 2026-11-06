/**
 * Tests der Motivwahl im Taktiktrainer an allen Aufgaben: den 674 Aufgaben aus
 * inhalte/de/trainer/taktik.json und den 1000 Zusatzaufgaben aus public/daten/zusatzaufgaben.json.
 *
 * Warum: Frage des Autors (6.11.2026): „Können mehrere Motive gleichzeitig zutreffen?“ Der Test
 * geht jede Aufgabe mit dem Motiverkenner der App durch, prüft, dass das Motiv der Daten immer
 * richtig bleibt, und hält fest, wie oft mehr als ein Motiv zutrifft (Zahlen im Bericht an den
 * Autor, docs/ENTSCHEIDUNGEN.md, 6.11.2026).
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Taktikaufgabe, Taktikdaten } from "../daten/trainerdaten";
import { pruefeMotivwahl, zutreffendeMotive } from "./taktikmotivwahl";
import { alsZusatzaufgabe, zusatzeintraegeAus } from "./zusatzaufgaben";

const TAKTIK = new URL("../../../inhalte/de/trainer/taktik.json", import.meta.url);
const ZUSATZ = new URL("../../public/daten/zusatzaufgaben.json", import.meta.url);
const daten = JSON.parse(readFileSync(TAKTIK, "utf8")) as Taktikdaten;
const zusatz = (zusatzeintraegeAus(JSON.parse(readFileSync(ZUSATZ, "utf8"))) ?? []).flatMap(
  (eintrag) => {
    const z = alsZusatzaufgabe(eintrag);
    return z ? [z.aufgabe] : [];
  },
);
const ALLE: readonly Taktikaufgabe[] = [...daten.aufgaben, ...zusatz];
/** Alle Aufgaben durchzurechnen dauert auf dem ausgelasteten Prüfrechner mehrere Sekunden. */
const FRIST_MS = 60_000;
/** Untergrenze für den Anteil der Aufgaben mit mehreren Motiven (gemessen 6.11.2026: über 50 %). */
const MINDESTANTEIL_MEHRERE = 0.4;

function aufgabe(id: string): Taktikaufgabe {
  const gefunden = daten.aufgaben.find((a) => a.id === id);
  if (!gefunden) throw new Error(`${id} fehlt`);
  return gefunden;
}

describe("zutreffende Motive aller Aufgaben", { timeout: FRIST_MS }, () => {
  const mitMotiv = ALLE.filter((a) => a.motiv !== null);
  const zutreffend = new Map<string, readonly string[]>();
  /** Einmal je Aufgabe rechnen (der Erkenner braucht einige Millisekunden je Aufgabe). */
  const motive = (a: Taktikaufgabe) => {
    const bekannt = zutreffend.get(a.id);
    if (bekannt) return bekannt;
    const neu = zutreffendeMotive(a);
    zutreffend.set(a.id, neu);
    return neu;
  };

  it("das Motiv der Daten steht immer an erster Stelle, kein Motiv doppelt", () => {
    const abweichend = mitMotiv.filter((a) => {
      const z = motive(a);
      return z[0] !== a.motiv || new Set(z).size !== z.length;
    });
    expect(abweichend.map((a) => a.id)).toEqual([]);
  });

  it("Aufgaben ohne Motiv (Mattbilder) fragen kein Motiv ab", () => {
    const ohne = ALLE.filter((a) => a.motiv === null);
    expect(ohne.every((a) => motive(a).length === 0)).toBe(true);
  });

  it("bei vielen Aufgaben trifft mehr als ein Motiv zu", () => {
    const mehrere = mitMotiv.filter((a) => motive(a).length > 1);
    expect(mehrere.length / mitMotiv.length).toBeGreaterThan(MINDESTANTEIL_MEHRERE);
  });
});

describe("Beispiele aus dem Buch", () => {
  it("Abb. 7.14: Hinlenkung Th8+ Kxh8 und Gabel Sxf7+", () => {
    expect(zutreffendeMotive(aufgabe("taktik-b-7.14"))).toEqual(["hinlenkung", "doppelangriff"]);
  });

  it("Abb. 7.18: Beseitigung, dazu Gabel Se7+ und Fesselung", () => {
    expect(zutreffendeMotive(aufgabe("taktik-b-7.18"))).toEqual([
      "beseitigung",
      "doppelangriff",
      "fesselung",
    ]);
  });

  it("Abb. 7.6: Spieß Th1+ ist nur ein Spieß", () => {
    expect(zutreffendeMotive(aufgabe("taktik-b-7.6"))).toEqual(["spiess"]);
  });

  it("Abb. 7.29: Rettung durch Patt bleibt nur Rettung, auch wenn die Dame zwei Figuren angreift", () => {
    expect(zutreffendeMotive(aufgabe("taktik-b-7.29"))).toEqual(["rettung"]);
  });
});

describe("pruefeMotivwahl", () => {
  const zutreffend = ["hinlenkung", "doppelangriff"] as const;

  it("jedes zutreffende Motiv ist richtig und nennt die übrigen", () => {
    expect(pruefeMotivwahl(zutreffend, "doppelangriff")).toEqual({
      richtig: true,
      weitere: ["hinlenkung"],
    });
    expect(pruefeMotivwahl(zutreffend, "hinlenkung")).toEqual({
      richtig: true,
      weitere: ["doppelangriff"],
    });
  });

  it("ein anderes Motiv ist falsch und nennt alle zutreffenden", () => {
    expect(pruefeMotivwahl(zutreffend, "fesselung")).toEqual({
      richtig: false,
      weitere: ["hinlenkung", "doppelangriff"],
    });
  });
});
