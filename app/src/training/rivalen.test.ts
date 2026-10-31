/**
 * Tests der Duelle und Rivalen (Gamifizierung P8): Bilanz je Bot, Wahl des Rivalen mit und ohne
 * Wertung, Wechsel, gewonnenes Duell nach dem Partieende, Sprüche je Charakter.
 */
import { describe, expect, it } from "vitest";
import { CHARAKTERE, type Charaktername } from "../engine/gegnerbau";
import { GEGNER } from "../engine/gegner";
import de from "../i18n/de.json";
import en from "../i18n/en.json";
import { leereDaten, type Nutzerdaten } from "../speicher/format";
import { mitPartie } from "../speicher/partien";
import { nachPartieende } from "../speicher/partieprotokoll";
import type { Wertungspunkt } from "../spiel/wertung";
import { letztesErgebnis, mitDuell, partienImDuell } from "./duelle";
import { aktuellerRivale, besiegteRivalen, waehleRivale } from "./rivalen";
import { duelleUndRivale } from "./rivalenfolge";
import {
  anlassAus,
  charakterVon,
  RIVALENSPRUECHE,
  SPRUCHANLAESSE,
  spruchschluessel,
} from "./rivalensprueche";
import { botVon, partieGegen, testquelle } from "./rivalen.testhilfe";

const JETZT = new Date("2026-10-31T12:00:00.000Z");
const QUELLE = testquelle([["tom", "marie"], ["lotte", "luis"]], {
  tom: 1180,
  marie: 1290,
  lotte: 1400,
  luis: 1260,
});

/** Daten mit einer Schnellschach-Wertung. */
function mitWertung(daten: Nutzerdaten, wertung: number): Nutzerdaten {
  const punkt: Wertungspunkt = {
    partieId: "w",
    zeit: JETZT.toISOString(),
    gegner: wertung,
    ergebnis: 1,
    wertung,
    phasen: { eroeffnung: null, mittelspiel: null, endspiel: null },
    tempo: "rapid",
  };
  return { ...daten, spiel: { ...daten.spiel, wertung: [punkt] } };
}

/** Wie nach dem Speichern einer Partie in der App: Spielstand, dann NACH_PARTIEENDE. */
function spiele(daten: Nutzerdaten, partie: ReturnType<typeof partieGegen>): Nutzerdaten {
  return nachPartieende({ ...daten, spiel: mitPartie(daten.spiel, partie) }, partie, false, JETZT);
}

describe("Duellbilanz", () => {
  it("zählt Sieg, Remis und Niederlage je Bot, gewertet oder nicht", () => {
    let duelle = mitDuell({}, partieGegen("lotte", "gewonnen", false), JETZT);
    duelle = mitDuell(duelle, partieGegen("lotte", "remis"), JETZT);
    duelle = mitDuell(duelle, partieGegen("lotte", "verloren"), JETZT);
    expect(duelle.lotte).toEqual({ siege: 1, remis: 1, niederlagen: 1, zuletzt: JETZT.toISOString() });
    expect(partienImDuell(duelle.lotte)).toBe(3);
  });

  it("ohne Bot oder ohne Ende zählt nichts", () => {
    expect(mitDuell({}, partieGegen(null, "gewonnen"), JETZT)).toEqual({});
    const laufend = { ...partieGegen("tom", "gewonnen"), ende: null };
    expect(mitDuell({}, laufend, JETZT)).toEqual({});
  });

  it("das letzte Ergebnis steht in der neuesten Partie gegen den Bot", () => {
    const d = spiele(spiele(leereDaten(JETZT), partieGegen("tom", "gewonnen", false, "a")), partieGegen("tom", "verloren", false, "b"));
    expect(letztesErgebnis(d, "tom")).toBe("verloren");
    expect(letztesErgebnis(d, "marie")).toBeNull();
  });
});

describe("Wahl des Rivalen", () => {
  it("mit Wertung: Stärke 50 bis 150 darüber, am nächsten an +100", () => {
    const d = mitWertung(leereDaten(JETZT), 1200);
    expect(waehleRivale(d, [], QUELLE)?.kennung).toBe("marie");
  });

  it("bei mehreren im Abstand der mit den meisten Partien gegen den Leser", () => {
    const d = { ...mitWertung(leereDaten(JETZT), 1200), duelle: { luis: { siege: 0, remis: 1, niederlagen: 2, zuletzt: "" } } };
    expect(waehleRivale(d, [], QUELLE)?.kennung).toBe("luis");
  });

  it("schon gewertet besiegte und ausgenommene Bots sind keine Rivalen", () => {
    const d = mitWertung(leereDaten(JETZT), 1200);
    const besiegt = { ...d, spiel: { ...d.spiel, besiegt: { blitz: ["marie"], rapid: [], classical: [] } } };
    expect(waehleRivale(besiegt, [], QUELLE)?.kennung).toBe("luis");
    expect(waehleRivale(besiegt, ["luis"], QUELLE)?.kennung).toBe("lotte");
  });

  it("ohne Wertung: die niedrigste Stufe mit einem unbesiegten Bot", () => {
    const d = leereDaten(JETZT);
    expect(waehleRivale(d, [], QUELLE)?.kennung).toBe("tom");
    const beide = { ...d, spiel: { ...d.spiel, besiegt: { blitz: ["tom"], rapid: ["marie"], classical: [] } } };
    expect(waehleRivale(beide, [], QUELLE)?.kennung).toBe("lotte");
  });

  it("alle besiegt → kein Rivale; die echten Bots liefern ohne Wertung einen der Stufe 1", () => {
    const d = leereDaten(JETZT);
    const alle = { ...d, spiel: { ...d.spiel, besiegt: { blitz: [], rapid: ["tom", "marie", "lotte", "luis"], classical: [] } } };
    expect(waehleRivale(alle, [], QUELLE)).toBeNull();
    expect(waehleRivale(d)).not.toBeNull();
  });

  it("der gespeicherte Rivale gilt, solange er nicht besiegt ist", () => {
    const d = { ...leereDaten(JETZT), rivale: { kennung: "lotte", seit: "" } };
    expect(aktuellerRivale(d, QUELLE)?.kennung).toBe("lotte");
    const besiegt = { ...d, spiel: { ...d.spiel, besiegt: { blitz: ["lotte"], rapid: [], classical: [] } } };
    expect(aktuellerRivale(besiegt, QUELLE)?.kennung).toBe("tom");
  });
});

describe("Nach dem Partieende", () => {
  it("die erste Partie gegen einen Bot hält den Rivalen fest und schreibt die Bilanz", () => {
    const d = spiele(leereDaten(JETZT), partieGegen("tom", "verloren"));
    expect(d.rivale?.kennung).toBeTruthy();
    expect(d.duelle.tom?.niederlagen).toBe(1);
  });

  it("gewerteter Sieg gegen den Rivalen: Duell gewonnen, neuer Rivale", () => {
    const start = { ...leereDaten(JETZT), rivale: { kennung: "tom", seit: "" } };
    const d = spiele(start, partieGegen("tom", "gewonnen"));
    expect(besiegteRivalen(d)).toEqual(["tom"]);
    expect(d.rivale?.kennung).not.toBe("tom");
    expect(d.rivale?.seit).toBe(JETZT.toISOString());
  });

  it("ungewerteter Sieg oder Sieg gegen einen anderen Bot gewinnt kein Duell", () => {
    const start = { ...leereDaten(JETZT), rivale: { kennung: "tom", seit: "" } };
    expect(besiegteRivalen(spiele(start, partieGegen("tom", "gewonnen", false)))).toEqual([]);
    expect(besiegteRivalen(spiele(start, partieGegen("marie", "gewonnen")))).toEqual([]);
  });

  it("ohne gespeicherten Rivalen zählt der Sieg gegen den, der vorher gezeigt wurde", () => {
    const start = leereDaten(JETZT);
    const gezeigt = aktuellerRivale(start);
    if (!gezeigt) throw new Error("kein Rivale");
    const partie = partieGegen(gezeigt.kennung, "gewonnen");
    const d = spiele(start, partie);
    expect(besiegteRivalen(d)).toEqual([gezeigt.kennung]);
    expect(duelleUndRivale(start, partieGegen(null, "gewonnen"), JETZT).rivale).toBeNull();
  });
});

describe("Sprüche je Charakter", () => {
  it("jeder Charakter hat eine Zeile und vier Texte in beiden Sprachen", () => {
    const namen = Object.keys(CHARAKTERE) as Charaktername[];
    expect(RIVALENSPRUECHE.map((s) => s.charakter).sort()).toEqual([...namen].sort());
    for (const c of namen) {
      for (const anlass of SPRUCHANLAESSE) {
        const schluessel = spruchschluessel(c, anlass);
        expect(de[schluessel], schluessel).toBeTruthy();
        expect((en as Record<string, string>)[schluessel], schluessel).toBeTruthy();
      }
    }
  });

  it("findet den Charakter jedes Bots und den Anlass aus dem letzten Ergebnis", () => {
    expect(charakterVon(botVon("tom"))).toBe("angreifer");
    expect(charakterVon(botVon("lotte"))).toBe("materialist");
    for (const g of GEGNER) expect(Object.keys(CHARAKTERE)).toContain(charakterVon(g));
    expect(anlassAus(null)).toBe("begruessung");
    expect(anlassAus("verloren")).toBe("botSieg");
    expect(anlassAus("gewonnen")).toBe("botNiederlage");
    expect(anlassAus("remis")).toBe("remis");
  });
});
