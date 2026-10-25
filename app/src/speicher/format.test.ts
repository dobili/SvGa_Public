/**
 * Tests für das Format der Nutzerdaten (Konzept 13: „Jedes frühere Format wird korrekt
 * umgewandelt“).
 */
import { describe, expect, it } from "vitest";
import {
  einstellungenAus,
  leereDaten,
  merkerAlsFormat0,
  SCHEMA_VERSION,
  STANDARD_EINSTELLUNGEN,
  wandleUm,
} from "./format";
import { LEERES_PROFIL } from "./profil";
import { LEERER_SPIELSTAND } from "./partien";

const JETZT = new Date("2026-10-15T10:00:00.000Z");

describe("Format 0: Merker der Versionen 0.2.x", () => {
  it("übernimmt Brettfarben, Strenge und Lernstand", () => {
    const roh = merkerAlsFormat0('{"brettfarben":"holz","strenge":"streng"}', '{"1":[3,0],"8":[]}');
    const ergebnis = wandleUm(roh, JETZT);
    expect(ergebnis.ok).toBe(true);
    if (!ergebnis.ok) return;
    expect(ergebnis.vonVersion).toBe(0);
    expect(ergebnis.daten.schemaVersion).toBe(SCHEMA_VERSION);
    expect(ergebnis.daten.einstellungen).toEqual({
      brettfarben: "holz",
      strenge: "streng",
      figurensatz: "buch",
      ton: "aus",
      vorWerkzeugen: "aus",
      maia: "an",
    });
    expect(ergebnis.daten.lernstand).toEqual({ 1: [0, 3], 8: [] });
    expect(ergebnis.daten.fortschritt).toEqual({
      gesehen: {},
      uebungen: {},
      trainer: {},
      warum: {},
      eingeschaetzt: {},
    });
    expect(ergebnis.daten.angelegt).toBe(JETZT.toISOString());
  });

  it("übernimmt alte Figurensätze (kontrastreich, klassisch, holz), Unbekanntes als „buch“", () => {
    expect(einstellungenAus({ figurensatz: "kontrastreich" }).figurensatz).toBe(
      "klassisch-cburnett",
    );
    expect(einstellungenAus({ figurensatz: "klassisch" }).figurensatz).toBe("klassisch-cburnett");
    expect(einstellungenAus({ figurensatz: "holz" }).figurensatz).toBe("holz-kiefer-kirsche");
    expect(einstellungenAus({ figurensatz: "modern-celtic" }).figurensatz).toBe("modern-celtic");
    expect(einstellungenAus({ figurensatz: "bunt" }).figurensatz).toBe("buch");
  });

  it("übergeht den alten Genauigkeitsmodus (0.2.83 bis 0.2.120) beim Lesen", () => {
    expect(einstellungenAus({ genauigkeitsmodus: "chesscom" })).not.toHaveProperty(
      "genauigkeitsmodus",
    );
    // Seit 0.2.90: „Erst selbst denken“ vor Werkzeugen, ältere Stände lesen sich als „aus“.
    expect(einstellungenAus({}).vorWerkzeugen).toBe("aus");
    expect(einstellungenAus({ vorWerkzeugen: "an" }).vorWerkzeugen).toBe("an");
  });

  it("übersteht kaputte und fehlende Merker", () => {
    const ergebnis = wandleUm(merkerAlsFormat0("kein json", '{"1":[0,"x",2],"2":"x"}'), JETZT);
    expect(ergebnis.ok && ergebnis.daten.einstellungen).toEqual(STANDARD_EINSTELLUNGEN);
    expect(ergebnis.ok && ergebnis.daten.lernstand).toEqual({ 1: [0, 2] });
    expect(wandleUm(merkerAlsFormat0(null, null), JETZT)).toEqual({
      ok: true,
      daten: leereDaten(JETZT),
      vonVersion: 0,
    });
  });
});

describe("Format 1", () => {
  it("wird zum aktuellen Format ohne Partien und Karten, alles andere bleibt", () => {
    const format1 = {
      schemaVersion: 1,
      angelegt: "2026-10-10T08:00:00.000Z",
      einstellungen: { brettfarben: "gruen", strenge: "locker" },
      lernstand: { 4: [1] },
      fortschritt: {
        gesehen: { "1.26": "2026-10-14T08:00:00.000Z" },
        uebungen: {
          "ueb:droh-ignorieren": { kapitel: 1, versuche: 2, geloest: true, zuletzt: "x" },
        },
        trainer: { roentgen: { durchgaenge: 1, aufgaben: 10, richtig: 8, zuletzt: "y" } },
      },
      letzteSicherung: "2026-10-01T00:00:00.000Z",
    };
    const ergebnis = wandleUm(JSON.parse(JSON.stringify(format1)), JETZT);
    expect(ergebnis).toEqual({
      ok: true,
      daten: {
        ...format1,
        // Figurensatz und Ton (seit 0.2.33) fehlen in Format 1 und lesen sich als Standard.
        einstellungen: {
          ...format1.einstellungen,
          figurensatz: "buch",
          ton: "aus",
          vorWerkzeugen: "aus",
          maia: "an",
        },
        // Beantwortete Warum-Fragen (seit 0.2.99) fehlen in Format 1 und lesen sich leer.
        fortschritt: { ...format1.fortschritt, warum: {}, eingeschaetzt: {} },
        schemaVersion: SCHEMA_VERSION,
        spiel: LEERER_SPIELSTAND,
        karten: {},
        fehler: [],
        sammlung: [],
        zugErraten: {},
        planstand: null,
        // Name und Porträt (seit 0.2.140) fehlen in Format 1 und lesen sich leer.
        profil: LEERES_PROFIL,
      },
      vonVersion: 1,
    });
  });

  it("Format 3 → 4: Die Fehlerdatenbank ist leer, alles andere bleibt", () => {
    const format3 = { ...leereDaten(JETZT), schemaVersion: 3 } as Record<string, unknown>;
    delete format3.fehler;
    const ergebnis = wandleUm(format3, JETZT);
    expect(ergebnis.ok && ergebnis.daten.fehler).toEqual([]);
    expect(ergebnis.ok && ergebnis.vonVersion).toBe(3);
  });

  it("Format 4 liest die Fehlerdatenbank, Unlesbares fällt weg", () => {
    const eintrag = {
      id: "f1",
      datum: "2026-10-18T08:00:00.000Z",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      satz: "Schach übersehen",
      fehlerart: 1,
    };
    const roh = {
      ...leereDaten(JETZT),
      fehler: [eintrag, { id: 2 }, { ...eintrag, fehlerart: 99 }],
    };
    const ergebnis = wandleUm(roh, JETZT);
    expect(ergebnis.ok && ergebnis.daten.fehler).toEqual([eintrag]);
  });

  it("Format 4 → 5: Die Lernsammlung ist leer, alles andere bleibt", () => {
    const format4 = { ...leereDaten(JETZT), schemaVersion: 4, lernstand: { 2: [0] } } as Record<
      string,
      unknown
    >;
    delete format4.sammlung;
    const ergebnis = wandleUm(format4, JETZT);
    expect(ergebnis.ok && ergebnis.daten.sammlung).toEqual([]);
    expect(ergebnis.ok && ergebnis.daten.lernstand).toEqual({ 2: [0] });
    expect(ergebnis.ok && ergebnis.daten.schemaVersion).toBe(SCHEMA_VERSION);
    expect(ergebnis.ok && ergebnis.vonVersion).toBe(4);
  });

  it("Format 5 liest die Lernsammlung, Unlesbares fällt weg", () => {
    const eintrag = {
      id: "s1",
      datum: "2026-10-18T08:00:00.000Z",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      herkunft: "abbildung",
      quelle: "2.2",
      eroeffnung: "Spanische Partie",
      plan: "Druck auf e5",
      notiz: "",
    };
    const ergebnis = wandleUm({ ...leereDaten(JETZT), sammlung: [eintrag, { id: 3 }] }, JETZT);
    expect(ergebnis.ok && ergebnis.daten.sammlung).toEqual([eintrag]);
  });

  it("bereinigt fremde und unpassende Einträge", () => {
    const ergebnis = wandleUm(
      {
        schemaVersion: 1,
        einstellungen: { brettfarben: "lila" },
        fortschritt: {
          gesehen: { "1.1": "a", "1.2": 3 },
          uebungen: { u: { versuche: -2, geloest: "ja" } },
          trainer: { unbekannt: { durchgaenge: 1 }, falle: "x" },
        },
      },
      JETZT,
    );
    expect(ergebnis.ok).toBe(true);
    if (!ergebnis.ok) return;
    expect(ergebnis.daten.einstellungen.brettfarben).toBe("buch");
    expect(ergebnis.daten.fortschritt.gesehen).toEqual({ "1.1": "a" });
    expect(ergebnis.daten.fortschritt.uebungen).toEqual({
      u: { kapitel: 0, versuche: 0, geloest: false, zuletzt: "" },
    });
    expect(ergebnis.daten.fortschritt.trainer).toEqual({});
  });
});

describe("Abgelehnte Daten", () => {
  it("lehnt Daten aus einer neueren App ab", () => {
    expect(wandleUm({ schemaVersion: SCHEMA_VERSION + 1 }, JETZT)).toEqual({
      ok: false,
      grund: "neuer",
      version: SCHEMA_VERSION + 1,
    });
  });

  it("lehnt Nicht-Objekte und unsinnige Versionen ab", () => {
    for (const roh of [null, "text", [1], { schemaVersion: "1" }, { schemaVersion: -1 }]) {
      expect(wandleUm(roh, JETZT)).toEqual({ ok: false, grund: "kaputt" });
    }
  });
});

describe("Format 2", () => {
  it("wird zu Format 3 mit leeren Wiederholungskarten, alles andere bleibt", () => {
    const format2 = { ...leereDaten(JETZT), schemaVersion: 2 } as Record<string, unknown>;
    delete format2.karten;
    const ergebnis = wandleUm(JSON.parse(JSON.stringify(format2)), JETZT);
    // Bis Format 5 gab es acht Stufen: die Vorgabe Stufe 1 wird Stufe 3 (0.2.117)
    const leer = leereDaten(JETZT);
    const drei = { eroeffnung: 3, mittelspiel: 3, endspiel: 3 } as const;
    const vorlieben = { ...leer.spiel.vorlieben, stufe: 3, stufenJePhase: drei } as const;
    const daten = { ...leer, spiel: { ...leer.spiel, vorlieben } };
    expect(ergebnis).toEqual({ ok: true, daten, vonVersion: 2 });
  });

  it("Format 5 → 6: alte Stufen werden die neue Stufe mit der nächsten Elo-Zahl", () => {
    const leer = leereDaten(JETZT);
    const alt = { eroeffnung: 1, mittelspiel: 2, endspiel: 8 };
    const vorlieben = { ...leer.spiel.vorlieben, stufe: 2, stufenJePhase: alt };
    const roh = { ...leer, schemaVersion: 5, spiel: { ...leer.spiel, vorlieben } };
    const ergebnis = wandleUm(JSON.parse(JSON.stringify(roh)), JETZT);
    const neu = ergebnis.ok ? ergebnis.daten.spiel.vorlieben : null;
    expect(neu?.stufe).toBe(4);
    expect(neu?.stufenJePhase).toEqual({ eroeffnung: 3, mittelspiel: 4, endspiel: 10 });
    // Daten im aktuellen Format bleiben, wie sie sind
    const aktuell = wandleUm(JSON.parse(JSON.stringify({ ...roh, schemaVersion: 6 })), JETZT);
    expect(aktuell.ok && aktuell.daten.spiel.vorlieben.stufe).toBe(2);
  });

  it("Karten bleiben beim Lesen erhalten, kaputte fallen weg", () => {
    const karte = { kasten: 2, faellig: "2026-10-19T20:00:00.000Z", verlauf: [] };
    const roh = {
      ...leereDaten(JETZT),
      karten: { "uebung:ueb:a": karte, kaputt: { kasten: "x" } },
    };
    const ergebnis = wandleUm(JSON.parse(JSON.stringify(roh)), JETZT);
    expect(ergebnis.ok && ergebnis.daten.karten).toEqual({ "uebung:ueb:a": karte });
  });
});
