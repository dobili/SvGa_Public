/** Tests der Fehlerdatenbank (Kapitel 12): Einträge, Auswertung je Woche, Vorschlag. */
import { describe, expect, it } from "vitest";
import {
  auswertung,
  HOECHSTENS_EINTRAEGE,
  mitEintrag,
  ohneEintrag,
  vorschlag,
  type Fehlereintrag,
} from "./fehlerdatenbank";

const JETZT = new Date("2026-10-18T12:00:00.000Z");
const TAG_MS = 86_400_000;
const GRUND = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function eintrag(id: string, fehlerart: number, tageZurueck: number): Fehlereintrag {
  const datum = new Date(JETZT.getTime() - tageZurueck * TAG_MS).toISOString();
  return { id, datum, fen: GRUND, satz: "", fehlerart };
}

describe("Fehlerdatenbank", () => {
  it("zählt je Fehlerart und Woche, häufigste zuerst", () => {
    const liste = [eintrag("a", 1, 0), eintrag("b", 1, 2), eintrag("c", 1, 22), eintrag("d", 7, 1)];
    const zahlen = auswertung(liste, JETZT);
    expect(zahlen[0]).toEqual({ fehlerart: 1, gesamt: 3, jeWoche: [2, 0, 0, 1, 0, 0, 0, 0] });
    expect(zahlen[1]?.fehlerart).toBe(7);
  });

  it("schlägt den Trainer zur häufigsten Fehlerart der letzten vier Wochen vor", () => {
    const liste = [eintrag("a", 7, 1), eintrag("b", 7, 3), eintrag("c", 1, 2), eintrag("d", 1, 60)];
    expect(vorschlag(auswertung(liste, JETZT))).toEqual({ fehlerart: 7, trainer: "taktik" });
    // Alte Fehler zählen für den Vorschlag nicht.
    expect(vorschlag(auswertung([eintrag("x", 1, 60)], JETZT))).toBeNull();
  });

  it("hängt an, löscht und hält die Obergrenze", () => {
    let liste: Fehlereintrag[] = [];
    for (let i = 0; i <= HOECHSTENS_EINTRAEGE; i++) liste = mitEintrag(liste, eintrag(`e${i}`, 1, 0));
    expect(liste).toHaveLength(HOECHSTENS_EINTRAEGE);
    expect(liste[0]?.id).toBe("e1");
    expect(ohneEintrag(liste, "e1")).toHaveLength(HOECHSTENS_EINTRAEGE - 1);
  });
});
