/**
 * Tests der Texte der Spielhülle (docs/spiel/18_Spielhuelle.md, Abschnitt 3): Der Status spricht
 * in der Sprache der Geschichte, der Kopf findet das Porträt des Gegners.
 */
import { describe, expect, it } from "vitest";
import type { Partie } from "../../spiel/partie";
import { gegnerName, sprecherAusPfad, sprecherAusSchluessel, statustext } from "./huellentexte";

describe("Spielhülle: Texte", () => {
  it("nennt den Gegner beim Namen, wenn er am Zug ist", () => {
    expect(statustext({ fehler: null, engineDenkt: true }, "Skater Jo")).toBe(
      "Skater Jo überlegt …",
    );
  });

  it("sagt dem Leser, dass er am Zug ist", () => {
    expect(statustext({ fehler: null, engineDenkt: false }, "Skater Jo")).toBe("Du bist am Zug.");
  });

  it("zeigt einen Fehler der Engine statt des Status", () => {
    expect(statustext({ fehler: "Zeit", engineDenkt: true }, "Jo")).toContain("Zeit");
  });

  it("liest die Sprecherkennung aus dem Porträtpfad", () => {
    expect(sprecherAusPfad("portraets/coach-delgado.svg")).toBe("coach-delgado");
    expect(sprecherAusPfad(undefined)).toBeNull();
  });

  it("liest die Sprecherkennung aus dem Namensschlüssel dessen, der die Aufgaben stellt", () => {
    expect(sprecherAusSchluessel("figur.coachDelgado.name")).toBe("coachDelgado");
    expect(sprecherAusSchluessel("ort.mapleFalls.name")).toBeNull();
  });

  it("nimmt den Namen aus der Partie, sonst „Gegner“", () => {
    const mitName = { einstellung: { botName: "Big Joe" } } as unknown as Partie;
    expect(gegnerName(mitName)).toBe("Big Joe");
    expect(gegnerName(null)).toBe("Gegner");
  });
});
