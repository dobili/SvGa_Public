/**
 * Tests der Meisterschaft je Thema (Gamifizierung P3): Stufenregeln (Zahl, Quote, Tage, Abstand),
 * „einmal erreicht, bleibt“, Auffrischen, neue Stufen in „verdient“, Zählung je Präfix.
 */
import { describe, expect, it } from "vitest";
import type { Themenstand } from "../speicher/gamifizierung";
import { stufeAus, tagesspanne, verdientSchluessel, ausVerdientSchluessel } from "./meisterschaft";
import {
  mitNeuenStufen,
  themenmedaille,
  themenmedaillen,
  themenstufen,
  zaehleThemen,
  type Meisterschaftsdaten,
} from "./meisterschaftsstand";

function stand(richtig: number, letzte: string, tage: string[] = ["2026-10-01"]): Themenstand {
  return { richtig, falsch: 0, letzte, tage, zuletzt: "2026-10-31T10:00:00.000Z" };
}

const JETZT = new Date("2026-10-31T12:00:00");
const r = (n: number) => "r".repeat(n);

describe("Stufenregeln", () => {
  it("Bronze ab 5 richtigen", () => {
    expect(stufeAus(stand(4, r(4)), null)).toBeNull();
    expect(stufeAus(stand(5, r(5)), null)).toBe("bronze");
  });

  it("Silber braucht 15 richtige und 70 % der letzten 20", () => {
    expect(stufeAus(stand(15, r(14) + "ffffff"), null)).toBe("silber");
    expect(stufeAus(stand(15, r(13) + "fffffff"), null)).toBe("bronze");
    expect(stufeAus(stand(14, r(14)), null)).toBe("bronze");
  });

  it("Gold braucht drei Tage, zwei davon mindestens 7 Tage auseinander", () => {
    const zweiTage = stand(20, r(20), ["2026-10-01", "2026-10-09"]);
    const eng = stand(20, r(20), ["2026-10-01", "2026-10-03", "2026-10-07"]);
    const gut = stand(20, r(20), ["2026-10-01", "2026-10-04", "2026-10-08"]);
    expect(stufeAus(zweiTage, null)).toBe("silber");
    expect(stufeAus(eng, null)).toBe("silber");
    expect(stufeAus(gut, null)).toBe("gold");
    expect(tagesspanne(gut.tage)).toBe(7);
  });

  it("Gold setzt Silber voraus", () => {
    const tage = ["2026-10-01", "2026-10-04", "2026-10-08"];
    expect(stufeAus(stand(10, r(10), tage), null)).toBe("bronze");
  });

  it("eine gefeierte Stufe bleibt, auch wenn die Quote sinkt (E4)", () => {
    const schwach = stand(16, "fffffffffffrrrrrrrrr");
    expect(stufeAus(schwach, null)).toBe("bronze");
    expect(stufeAus(schwach, "silber")).toBe("silber");
    const mitTagen = { ...schwach, tage: ["2026-10-01", "2026-10-04", "2026-10-08"] };
    expect(stufeAus(mitTagen, "silber")).toBe("gold");
  });
});

describe("Schlüssel in „verdient“", () => {
  it("hin und zurück, auch mit Doppelpunkt im Thema", () => {
    const s = verdientSchluessel("silber", "taktik:fesselung");
    expect(s).toBe("meisterschaft:silber:taktik:fesselung");
    expect(ausVerdientSchluessel(s)).toEqual({ stufe: "silber", thema: "taktik:fesselung" });
    expect(ausVerdientSchluessel("abzeichen:woche")).toBeNull();
    expect(ausVerdientSchluessel("meisterschaft:platin:falle")).toBeNull();
  });
});

describe("Medaillen über alle Themen", () => {
  const daten: Meisterschaftsdaten = {
    themen: { "taktik:fesselung": stand(7, r(7), ["2026-10-30"]), falle: stand(2, "rr") },
    verdient: { "meisterschaft:gold:endspiel:opposition": "2026-09-01T10:00:00.000Z" },
  };

  it("Themen aus Protokoll und verdient, Fortschritt „7 von 15“", () => {
    const medaillen = themenmedaillen(daten, JETZT);
    expect(medaillen.map((m) => m.thema)).toEqual([
      "endspiel:opposition",
      "falle",
      "taktik:fesselung",
    ]);
    const fesselung = themenmedaille(daten, "taktik:fesselung", JETZT);
    expect(fesselung.stufe).toBe("bronze");
    expect(fesselung.naechste).toEqual({ stufe: "silber", erreicht: 7, noetig: 15, art: "richtig" });
    expect(themenmedaille(daten, "endspiel:opposition", JETZT).naechste).toBeNull();
  });

  it("Probe hebt die Stufe nur in der Anzeige", () => {
    const probe = { "taktik:gabel": "silber" as const };
    expect(themenmedaille(daten, "taktik:gabel", JETZT, probe).stufe).toBe("silber");
    expect(mitNeuenStufen(daten, JETZT).daten.verdient).not.toHaveProperty(
      "meisterschaft:silber:taktik:gabel",
    );
  });

  it("Zum Auffrischen nach mehr als 60 Tagen ohne richtige Antwort", () => {
    const alt = { themen: { falle: stand(6, r(6), ["2026-08-01"]) }, verdient: {} };
    expect(themenmedaille(alt, "falle", JETZT).auffrischen).toBe(true);
    expect(themenmedaille(alt, "falle", new Date("2026-09-15T12:00:00")).auffrischen).toBe(false);
  });

  it("neue Stufen werden einmal eingetragen und gemeldet", () => {
    const erst = mitNeuenStufen(daten, JETZT);
    expect(erst.neue).toEqual([{ thema: "taktik:fesselung", stufe: "bronze" }]);
    expect(erst.daten.verdient["meisterschaft:bronze:taktik:fesselung"]).toBe(JETZT.toISOString());
    // Gold der Opposition war schon gefeiert: Bronze und Silber kommen still dazu.
    expect(erst.daten.verdient).toHaveProperty("meisterschaft:silber:endspiel:opposition");
    const zweit = mitNeuenStufen(erst.daten, JETZT);
    expect(zweit.neue).toEqual([]);
    expect(zweit.daten).toBe(erst.daten);
  });

  it("zählt Themen je Stufe und Präfix", () => {
    const stufen = themenstufen(daten);
    expect(zaehleThemen(stufen, "bronze")).toBe(2);
    expect(zaehleThemen(stufen, "gold")).toBe(1);
    expect(zaehleThemen(stufen, "gold", "taktik")).toBe(0);
    expect(zaehleThemen(stufen, "bronze", "taktik")).toBe(1);
  });
});
