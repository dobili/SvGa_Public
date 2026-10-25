/** Tests für das Sichern und Wiederherstellen der Navigation (V2, Nutzungsprüfung 25.10.2026). */
import { describe, expect, it } from "vitest";
import { neuerStapel, schritt, type Ansicht, type Stapel } from "./stapel";
import { ansichtAus, HOECHSTALTER_MS, stapelAlsMerker, stapelAusMerker } from "./stapelMerker";

const JETZT = new Date("2026-10-25T10:00:00.000Z");
const STUNDE_MS = 60 * 60 * 1000;

function vorher(ms: number): Date {
  return new Date(JETZT.getTime() - ms);
}

/** Der Merkertext eines Stapels aus rohen Ansichten, wie ihn eine ältere Version schreiben könnte. */
function roherMerker(ansichten: unknown[], bereich = "buch", zeit = JETZT.getTime()): string {
  return JSON.stringify({ format: 1, zeit, stapel: { bereich, ansichten } });
}

const BUCH_MIT_ABBILDUNG: Stapel = schritt(neuerStapel("buch"), {
  art: "navigiere",
  ansicht: { bildschirm: "abbildung", nummer: "1.26" },
});

describe("stapelAusMerker", () => {
  it("stellt einen Stapel von vor zwei Stunden wieder her", () => {
    const text = stapelAlsMerker(BUCH_MIT_ABBILDUNG, vorher(2 * STUNDE_MS));
    expect(stapelAusMerker(text, JETZT)).toEqual(BUCH_MIT_ABBILDUNG);
  });

  it("verwirft Stände, die älter als 24 Stunden sind", () => {
    const text = stapelAlsMerker(BUCH_MIT_ABBILDUNG, vorher(HOECHSTALTER_MS + 1));
    expect(stapelAusMerker(text, JETZT)).toBeNull();
  });

  it("beginnt wie bisher ohne Merker, bei kaputtem Text oder anderem Format", () => {
    expect(stapelAusMerker(null, JETZT)).toBeNull();
    expect(stapelAusMerker("{kein json", JETZT)).toBeNull();
    const fremdesFormat = JSON.stringify({ format: 2, zeit: JETZT.getTime(), stapel: {} });
    expect(stapelAusMerker(fremdesFormat, JETZT)).toBeNull();
  });

  it("verwirft den ganzen Stapel bei unbekanntem Bereich oder unbekanntem Bildschirm", () => {
    expect(stapelAusMerker(roherMerker([{ bildschirm: "buch" }], "keller"), JETZT)).toBeNull();
    const unbekannt = [{ bildschirm: "buch" }, { bildschirm: "zauberei" }];
    expect(stapelAusMerker(roherMerker(unbekannt), JETZT)).toBeNull();
    const falscheNummer = [{ bildschirm: "buch" }, { bildschirm: "abbildung", nummer: "eins" }];
    expect(stapelAusMerker(roherMerker(falscheNummer), JETZT)).toBeNull();
  });

  it("endet vor einer Partie, damit die Uhr nicht von selbst weiterläuft", () => {
    const mitPartie = [
      { bildschirm: "spielen" },
      { bildschirm: "partie", id: "p-1" },
      { bildschirm: "abbildung", nummer: "1.26" },
    ];
    expect(stapelAusMerker(roherMerker(mitPartie, "spielen"), JETZT)).toEqual({
      bereich: "spielen",
      ansichten: [{ bildschirm: "spielen" }],
    });
    const nurPartie = [{ bildschirm: "partie", id: "p-1" }];
    expect(stapelAusMerker(roherMerker(nurPartie, "spielen"), JETZT)).toBeNull();
  });
});

describe("ansichtAus", () => {
  it("übernimmt gültige Ansichten aller Art und lässt fremde Felder weg", () => {
    const gueltig: Ansicht[] = [
      { bildschirm: "glossar" },
      { bildschirm: "kapitel", nummer: 12 },
      { bildschirm: "begriff", begriff: "Hebel" },
      { bildschirm: "trainer", kennung: "zaehlen" },
      { bildschirm: "spielen" },
      { bildschirm: "spielen", startFen: "8/8/8/4k3/8/8/4P3/4K3 w - - 0 1", abbildung: "8.3" },
      {
        bildschirm: "uebung",
        kapitel: 1,
        id: "ueb:a",
        reihe: [{ kapitel: 1, id: "ueb:b" }],
      },
    ];
    gueltig.forEach((ansicht) => expect(ansichtAus(ansicht)).toEqual(ansicht));
    expect(ansichtAus({ bildschirm: "abbildung", nummer: "1.26", geheim: 1 })).toEqual({
      bildschirm: "abbildung",
      nummer: "1.26",
    });
  });

  it("lehnt unpassende Parameter ab", () => {
    expect(ansichtAus({ bildschirm: "kapitel", nummer: 13 })).toBeNull();
    expect(ansichtAus({ bildschirm: "trainer", kennung: "zauberei" })).toBeNull();
    expect(ansichtAus({ bildschirm: "spielen", startFen: "keine Stellung" })).toBeNull();
    expect(ansichtAus({ bildschirm: "uebung", kapitel: 1, id: "a", reihe: [{}] })).toBeNull();
    expect(ansichtAus({ bildschirm: "partie", id: "p-1" })).toBeNull();
    expect(ansichtAus("buch")).toBeNull();
  });
});
