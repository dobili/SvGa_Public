/**
 * Antwortwahl des Spieler-Durchlaufs (fenster.ts, waehleAntwort): Eine Wiederholung („Noch eine.“)
 * nimmt der Lauf je Frage einmal; danach geht ein echter Aufschub („Nicht jetzt.“) vor.
 * Warum: Bei Mr. Ruiz auf der Fähre spielte der Lauf sonst 149 Partien hintereinander (20.11.2026).
 */
import { describe, expect, it } from "vitest";
import { Eiliger } from "./eilig";
import { merkeWahl, neuesFenstergedaechtnis, waehleAntwort } from "./fenster";

describe("Antwortwahl", () => {
  it("nimmt die Wiederholung einmal, danach den Aufschub", () => {
    const g = neuesFenstergedaechtnis();
    const frage = "Du spielst, wie ich koche: nicht zu schnell, nicht zu langsam. Noch eine?";
    const wahlen = ["„Noch eine.“", "„Nicht jetzt.“"];
    expect(waehleAntwort(g, frage, wahlen)).toBe(0);
    // Der Spielstand hat sich durch die Partie geändert; die Wiederholung zählt trotzdem als gewählt.
    g.signatur = "nach der Partie";
    expect(waehleAntwort(g, frage, wahlen)).toBe(1);
    expect(waehleAntwort(g, frage, wahlen)).toBe(1);
  });

  it("nach den ersten Antworten des eiligen Spielers schiebt er auf (Nia, 20.11.2026)", () => {
    // Die erste Antwort des Eiligen stand nicht im Gedächtnis; danach galt „Noch eine.“ als neu,
    // und der Lauf spielte endlos gegen Nia.
    const g = neuesFenstergedaechtnis();
    const eilig = new Eiliger(true);
    const frage = "Okay, okay. Du bist schneller, als du aussiehst, noch mal?";
    const wahlen = ["„Noch eine.“", "„Gleich.“"];
    for (let i = 0; i < 2; i++) {
      const wahl = eilig.antwort(frage, wahlen);
      expect(wahl).toBe(0);
      merkeWahl(g, frage, wahlen[wahl ?? 0] ?? "");
    }
    expect(eilig.antwort(frage, wahlen)).toBeNull();
    expect(waehleAntwort(g, frage, wahlen)).toBe(1);
  });

  it("nimmt nach einer gewählten Alternative nicht wieder die Wiederholung (Nia, 20.11.2026)", () => {
    const g = neuesFenstergedaechtnis();
    const frage = "Okay, okay. Du bist schneller, als du aussiehst, noch mal?";
    const wahlen = ["„Noch eine.“", "„Weiterspielen wäre schön.“"];
    expect(waehleAntwort(g, frage, wahlen)).toBe(0);
    expect(waehleAntwort(g, frage, wahlen)).toBe(1);
    // Auch die Alternative ist schon gewählt: trotzdem nicht zurück zur Wiederholung.
    expect(waehleAntwort(g, frage, wahlen)).toBe(1);
  });

  it("wechselt ohne Aufschub zwischen den Antworten statt immer die erste zu nehmen (Bus)", () => {
    const g = neuesFenstergedaechtnis();
    const frage = "Der Bus fährt gleich.";
    const wahlen = ["Mit dem Fahrer reden", "Zur Haltestelle sehen"];
    const gewaehlt = Array.from({ length: 4 }, () => waehleAntwort(g, frage, wahlen));
    expect(gewaehlt).toEqual([0, 1, 0, 1]);
  });
});
