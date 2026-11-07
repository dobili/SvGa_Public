/**
 * Tests von „Muster aus deinen Partien“ (Konzept „Fehler mit Buchbezug“ 4.3): Mindestzahl,
 * Schwellen je Zuverlässigkeit, Zählen nach Partien, nur Fehler/Patzer/Verpasst, Auswahl bei
 * Gleichstand, Ruhe nach dem Üben, dazu der Vorschlag auf der Startseite und sein Rang.
 */
import { describe, expect, it } from "vitest";
import type { Zugklasse } from "../spiel/auswertung";
import type { Buchkennung } from "../spiel/buchbezug";
import { BUCHBEZUG_REGELN } from "../spiel/buchkuerzel";
import { opernauswertung } from "../spiel/buchzuege.testhilfe";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import type { Partieeintrag } from "../speicher/partien";
import { MUSTER_MINDESTENS, musterAusPartien, musterFuer } from "./musterausPartien";
import { rangFuerWeg } from "./startweg";
import { VORSCHLAGSARTEN } from "./vorschlagsarten";
import type { Lage } from "./naechsterSchritt";

const OPER = opernauswertung();
const JETZT = new Date("2026-11-07T10:00:00Z");

/** Eine ausgewertete Partie mit diesen Kürzeln (je Eintrag ein Zug), Beginn am Tag `tag`. */
function partie(kuerzel: readonly Buchkennung[], tag = 1, klasse: Zugklasse = "fehler") {
  const begonnen = `2026-11-${String(tag).padStart(2, "0")}T10:00:00.000Z`;
  const eintrag: Partieeintrag = {
    ...OPER,
    partie: { ...OPER.partie, id: `p${tag}-${kuerzel.join("")}`, begonnen },
    abstaende: [],
    varianten: [],
    buchbezug: {
      regeln: BUCHBEZUG_REGELN,
      zuege: kuerzel.map((k, index) => ({ index, klasse, kuerzel: [k] })),
    },
  };
  return eintrag;
}

/** Zehn Partien, neueste zuerst; in den ersten `mit` steht die Kategorie. */
function zehn(kennung: Buchkennung, mit: number, klasse: Zugklasse = "fehler"): Partieeintrag[] {
  const ANZAHL = 10;
  return Array.from({ length: ANZAHL }, (_, i) =>
    partie(i < mit ? [kennung] : [], ANZAHL - i + 1, klasse),
  );
}

function daten(partien: readonly Partieeintrag[]): Nutzerdaten {
  const d = leereDaten(JETZT);
  return { ...d, spiel: { ...d.spiel, partien } };
}

describe("Muster aus deinen Partien", () => {
  it("W3 in 3 von 10 Partien ist ein Muster (hohe Zuverlässigkeit: 3 und 30 %)", () => {
    expect(musterAusPartien(zehn("W3", 3))).toMatchObject({ kennung: "W3", anzahl: 3, partien: 10 });
    expect(musterAusPartien(zehn("W3", 2))).toBeNull();
  });

  it("mittlere Zuverlässigkeit (W9) braucht 4 Partien und 40 %", () => {
    expect(musterAusPartien(zehn("W9", 3))).toBeNull();
    expect(musterAusPartien(zehn("W9", 4))?.kennung).toBe("W9");
  });

  it("zählt Partien, nicht Züge: fünfmal W4 in einer Partie bleibt eine", () => {
    const wild = partie(["W4", "W4", "W4", "W4", "W4"], 20);
    const ruhig = Array.from({ length: 9 }, (_, i) => partie([], i + 1));
    expect(musterAusPartien([wild, ...ruhig])).toBeNull();
  });

  it("erst ab 5 Partien mit Kürzeln; Partien ohne Kürzel zählen nicht mit", () => {
    const vier = zehn("W3", 4).slice(0, MUSTER_MINDESTENS - 1);
    expect(musterAusPartien(vier)).toBeNull();
    const ohne: Partieeintrag = { ...OPER, abstaende: [], varianten: [] };
    expect(musterAusPartien([...vier, ohne, ohne])).toBeNull();
  });

  it("„ungenau“ zählt nicht für die Startseite", () => {
    expect(musterAusPartien(zehn("F4", 5, "ungenau"))).toBeNull();
    expect(musterAusPartien(zehn("F4", 5, "verpasst"))?.kennung).toBe("F4");
  });

  it("Gleichstand: hohe Zuverlässigkeit, dann das kleinere Kapitel", () => {
    const partien = Array.from({ length: 10 }, (_, i) =>
      partie(i < 4 ? ["F3", "W5", "W9"] : [], 10 - i),
    );
    // F3 (Kapitel 7) und W5 (Kapitel 1) beide hoch, W9 mittel: W5 gewinnt.
    expect(musterAusPartien(partien)?.kennung).toBe("W5");
  });

  it("ruht, wenn der passende Trainer nach der neuesten Partie geübt wurde", () => {
    const partien = zehn("W3", 4);
    const d = daten(partien);
    expect(musterFuer(d)?.kennung).toBe("W3");
    const stand = { durchgaenge: 1, aufgaben: 5, richtig: 4, zuletzt: "2026-11-30T10:00:00.000Z" };
    const geuebt = { ...d, fortschritt: { ...d.fortschritt, trainer: { roentgen: stand } } };
    expect(musterFuer(geuebt)).toBeNull();
  });
});

describe("Vorschlag auf der Startseite", () => {
  const lage = (d: Nutzerdaten): Lage => ({
    daten: d,
    kapitel: [],
    uebungen: {},
    zuletzt: null,
    tagesaufgabeErledigt: true,
    jetzt: JETZT,
  });
  const art = VORSCHLAGSARTEN.find((a) => a.kennung === "muster");

  it("„Muster“ steht mit Rang 52 vor der Phase und öffnet den Trainer mit Thema", () => {
    expect(art?.rang).toBe(52);
    const v = art?.ermittle(lage(daten(zehn("F1", 3))));
    expect(v).toMatchObject({
      art: "muster",
      text: "naechster.muster",
      werte: { anzahl: 3, partien: 10, kapitel: 7 },
      ziel: { bildschirm: "trainer", kennung: "taktik", thema: "taktik:mattbilder" },
    });
    expect(art?.ermittle(lage(daten(zehn("F1", 2))))).toBeNull();
  });

  it("auf dem Spielweg vor der Phase, auf dem Buchweg mit Grundrang", () => {
    expect(rangFuerWeg("muster", 52, "spielen")).toBeLessThan(rangFuerWeg("phase", 55, "spielen"));
    expect(rangFuerWeg("muster", 52, "buch")).toBe(52);
  });
});
