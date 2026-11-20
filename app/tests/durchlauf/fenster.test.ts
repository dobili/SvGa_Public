/**
 * Antwortwahl des Spieler-Durchlaufs (fenster.ts, waehleAntwort): Eine Wiederholung („Noch eine.“)
 * nimmt der Lauf je Frage einmal; danach geht ein echter Aufschub („Nicht jetzt.“) vor.
 * Warum: Bei Mr. Ruiz auf der Fähre spielte der Lauf sonst 149 Partien hintereinander (20.11.2026).
 */
import { describe, expect, it } from "vitest";
import { neuesFenstergedaechtnis, waehleAntwort } from "./fenster";

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
});
