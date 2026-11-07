/**
 * Tests der gespeicherten Kürzel „Fehler mit Buchbezug“ (Konzept 4.2): Rechnung je Partie (nur
 * Züge des Lesers), Lesen aus Rohdaten, Speichern im Spielstand, Verfall bei neuen Werten und die
 * Umwandlung von Format 9 nach Format 10.
 */
import { describe, expect, it } from "vitest";
import { leereDaten, SCHEMA_VERSION, wandleUm } from "../speicher/format";
import { mitBuchkuerzeln, mitWerten, type Partieeintrag } from "../speicher/partien";
import {
  BUCHBEZUG_REGELN,
  buchkuerzelAus,
  buchkuerzelDerPartie,
  kuerzelAktuell,
} from "./buchkuerzel";
import { opernauswertung, opernurteile, OOO, SC3 } from "./buchzuege.testhilfe";

const OPER = opernauswertung();
const STAND = buchkuerzelDerPartie(OPER, opernurteile(OPER));
const JETZT = new Date("2026-11-07T10:00:00Z");

describe("Kürzel einer Partie", () => {
  it("Opernpartie: 8. Sc3? mit F4, 12. O-O-O?? mit W3, nichts von der Engine", () => {
    expect(STAND.regeln).toBe(BUCHBEZUG_REGELN);
    const jeIndex = new Map(STAND.zuege.map((z) => [z.index, z]));
    expect(jeIndex.get(SC3)?.kuerzel).toContain("F4");
    expect(jeIndex.get(OOO)).toMatchObject({ klasse: "patzer" });
    expect(jeIndex.get(OOO)?.kuerzel[0]).toBe("W3");
    // 12... Td8 ist ein Patzer der Engine: zählt nicht.
    expect(jeIndex.has(OOO + 1)).toBe(false);
    for (const z of STAND.zuege) expect(z.kuerzel.length).toBeLessThanOrEqual(2);
  });

  it("liest gespeicherte Kürzel und lässt Unbekanntes weg", () => {
    expect(buchkuerzelAus(JSON.parse(JSON.stringify(STAND)))).toEqual(STAND);
    const roh = {
      regeln: 1,
      zuege: [
        { index: 3, klasse: "fehler", kuerzel: ["W3", "W99"] },
        { index: -1, klasse: "fehler", kuerzel: ["W3"] },
        { index: 4, klasse: "gut", kuerzel: ["F1"] },
      ],
    };
    expect(buchkuerzelAus(roh)).toEqual({
      regeln: 1,
      zuege: [{ index: 3, klasse: "fehler", kuerzel: ["W3"] }],
    });
    expect(buchkuerzelAus(undefined)).toBeUndefined();
    expect(buchkuerzelAus({ zuege: [] })).toBeUndefined();
  });

  it("veraltete Regeln gelten nicht als aktuell", () => {
    expect(kuerzelAktuell(STAND)).toBe(true);
    expect(kuerzelAktuell({ ...STAND, regeln: BUCHBEZUG_REGELN - 1 })).toBe(false);
    expect(kuerzelAktuell(undefined)).toBe(false);
  });
});

/** Ein Spielstand mit der Opernpartie als einzigem Eintrag. */
function stand(eintrag: Partieeintrag) {
  const d = leereDaten(JETZT);
  return { ...d.spiel, partien: [eintrag] };
}

describe("Kürzel im Speicher", () => {
  const eintrag: Partieeintrag = { ...OPER, abstaende: [], varianten: [] };

  it("mitBuchkuerzeln legt die Kürzel zur Partie, neue Werte machen sie ungültig", () => {
    const mit = mitBuchkuerzeln(stand(eintrag), OPER.partie.id, STAND);
    expect(mit.partien[0]?.buchbezug).toEqual(STAND);
    const neu = mitWerten(mit, OPER.partie.id, OPER.werte, OPER.beste);
    expect(neu.partien[0]?.buchbezug).toBeUndefined();
    expect(mitBuchkuerzeln(mit, "gibt-es-nicht", STAND)).toBe(mit);
  });

  it("Format 9 ohne Kürzel wird Format 10, die Partie bleibt; Format 10 behält die Kürzel", () => {
    const daten = { ...leereDaten(JETZT), spiel: stand(eintrag) };
    const alt = wandleUm(JSON.parse(JSON.stringify({ ...daten, schemaVersion: 9 })), JETZT);
    expect(SCHEMA_VERSION).toBe(10);
    expect(alt.ok && alt.daten.schemaVersion).toBe(10);
    expect(alt.ok && alt.daten.spiel.partien[0]?.buchbezug).toBeUndefined();
    expect(alt.ok && alt.daten.spiel.partien[0]?.werte.length).toBe(OPER.werte.length);
    const mitKuerzeln = { ...daten, spiel: mitBuchkuerzeln(daten.spiel, OPER.partie.id, STAND) };
    const neu = wandleUm(JSON.parse(JSON.stringify(mitKuerzeln)), JETZT);
    expect(neu.ok && neu.daten.spiel.partien[0]?.buchbezug).toEqual(STAND);
  });
});
