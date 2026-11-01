/**
 * Tests der Pflege eigener Einträge (Kapitel 12): Lernsammlung und Fehlerdatenbank bearbeiten,
 * löschen, Löschen rückgängig machen; die Wiederholungskarten bleiben stimmig.
 */
import { describe, expect, it } from "vitest";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import {
  fundstelleIn,
  mitFehlerZurueck,
  mitGeaendertemFehler,
  mitGeaendertemSammeleintrag,
  mitSammeleintragZurueck,
  ohneFehlerIn,
  ohneSammeleintragIn,
  wiederEingesetzt,
} from "./eintragspflege";
import { auswertung, type Fehlereintrag } from "./fehlerdatenbank";
import { eintraegeZu, GRUNDSTELLUNG, PLAN_HOECHSTENS, type Sammeleintrag } from "./lernsammlung";

const JETZT = new Date("2026-11-01T12:00:00.000Z");
const KARTEN = {
  "taktik:taktik-b-7.6": { kasten: 2, faellig: "2026-11-03T12:00:00.000Z", verlauf: [] },
};

function sammeleintrag(id: string, plan = ""): Sammeleintrag {
  return {
    id,
    datum: JETZT.toISOString(),
    fen: GRUNDSTELLUNG,
    herkunft: "trainer",
    quelle: "taktik",
    eroeffnung: "",
    plan,
    notiz: "",
  };
}

function fehler(id: string, fehlerart: number): Fehlereintrag {
  return { id, datum: JETZT.toISOString(), fen: GRUNDSTELLUNG, satz: "", fehlerart, zug: "e4" };
}

function daten(): Nutzerdaten {
  return {
    ...leereDaten(JETZT),
    karten: KARTEN,
    sammlung: [sammeleintrag("a"), sammeleintrag("b", "alt"), sammeleintrag("c")],
    fehler: [fehler("x", 1), fehler("y", 1), fehler("z", 7)],
  };
}

describe("Lernsammlung bearbeiten und löschen", () => {
  it("ändert den Plan, und die Abfrage über die Kennungen zeigt den neuen", () => {
    const neu = mitGeaendertemSammeleintrag(daten(), "b", { plan: "Druck auf e5" });
    expect(eintraegeZu(neu.sammlung, ["b"])[0]?.plan).toBe("Druck auf e5");
    expect(neu.sammlung[1]?.id).toBe("b");
    expect(neu.sammlung[1]?.fen).toBe(GRUNDSTELLUNG);
  });

  it("kürzt einen zu langen Plan auf die Länge des Eingabefelds", () => {
    const neu = mitGeaendertemSammeleintrag(daten(), "a", { plan: "x".repeat(500) });
    expect(neu.sammlung[0]?.plan).toHaveLength(PLAN_HOECHSTENS);
  });

  it("löscht nur den Eintrag; die Karte der Trainer-Aufgabe bleibt", () => {
    const neu = ohneSammeleintragIn(daten(), "b");
    expect(neu.sammlung.map((e) => e.id)).toEqual(["a", "c"]);
    expect(neu.karten).toEqual(KARTEN);
    expect(neu.fehler).toHaveLength(3);
  });

  it("holt einen gelöschten Eintrag an seine alte Stelle zurück", () => {
    const vorher = daten();
    const geloescht = fundstelleIn(vorher.sammlung, "b");
    expect(geloescht?.stelle).toBe(1);
    if (!geloescht) return;
    const zurueck = mitSammeleintragZurueck(ohneSammeleintragIn(vorher, "b"), geloescht);
    expect(zurueck.sammlung).toEqual(vorher.sammlung);
  });

  it("lässt die Abfrage gelöschte Einträge überspringen", () => {
    const neu = ohneSammeleintragIn(daten(), "b");
    expect(eintraegeZu(neu.sammlung, ["c", "b", "a"]).map((e) => e.id)).toEqual(["c", "a"]);
  });
});

describe("Fehlerdatenbank bearbeiten und löschen", () => {
  it("ändert Fehlerart und Satz; die Auswertung zählt den Fehler beim neuen Kapitel", () => {
    const neu = mitGeaendertemFehler(daten(), "y", { fehlerart: 7, satz: "Läufer übersehen" });
    expect(neu.fehler[1]).toMatchObject({ id: "y", fehlerart: 7, satz: "Läufer übersehen" });
    expect(neu.fehler[1]?.zug).toBe("e4");
    const zahlen = auswertung(neu.fehler, JETZT);
    expect(zahlen.find((z) => z.fehlerart === 7)?.gesamt).toBe(2);
  });

  it("übergeht eine Fehlerart außerhalb der Gesamt-Checkliste", () => {
    const neu = mitGeaendertemFehler(daten(), "x", { fehlerart: 13 });
    expect(neu.fehler[0]?.fehlerart).toBe(1);
  });

  it("löscht einen Eintrag und holt ihn mit Rückgängig an seine Stelle zurück", () => {
    const vorher = daten();
    const geloescht = fundstelleIn(vorher.fehler, "y");
    const ohne = ohneFehlerIn(vorher, "y");
    expect(ohne.fehler.map((e) => e.id)).toEqual(["x", "z"]);
    expect(ohne.karten).toEqual(KARTEN);
    if (!geloescht) throw new Error("Eintrag y fehlt");
    expect(mitFehlerZurueck(ohne, geloescht).fehler).toEqual(vorher.fehler);
  });
});

describe("Wiedereinsetzen", () => {
  it("setzt nicht doppelt ein und hängt bei zu großer Stelle ans Ende", () => {
    const liste = [{ id: "a" }, { id: "b" }];
    expect(wiederEingesetzt(liste, { eintrag: { id: "a" }, stelle: 1 }, 10)).toEqual(liste);
    expect(wiederEingesetzt(liste, { eintrag: { id: "c" }, stelle: 9 }, 10).at(-1)?.id).toBe("c");
  });
});
