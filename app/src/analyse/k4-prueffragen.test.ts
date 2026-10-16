/**
 * Referenztests für das Werkzeug k4-prueffragen (F1 bis F3) an den Fallenchecks aus Kapitel 4.
 *
 * Die Stellungen und der geplante Zug (der nächste Zug im Buch) kommen aus den erzeugten
 * Buchdaten. Kalibrierung an der Zeile „F3 Fesselungs-Check“ der Fallenchecks: „Keine Fesselung
 * im Spiel“ (Abb. 4.2, 4.5, 4.29, 4.34, 4.38), relative Fesselung (4.13, 4.17), zweite Fesselung
 * (4.21, 4.24). Abweichung in Abb. 4.45 steht als Befund in docs/FORTSCHRITT.md.
 */
import { describe, expect, it } from "vitest";
import { naechsterBuchzug, stellungAus, stellungVon } from "../schach/buchabbildungen.testhilfe";
import { prueffragen } from "./k4-prueffragen";
import type { Werkzeugergebnis } from "./werkzeug";

/** Prüffragen an einer Abbildung; ohne Angabe mit dem nächsten Buchzug als geplantem Zug. */
function ergebnis(nummer: string, zug = naechsterBuchzug(nummer) ?? undefined): Werkzeugergebnis {
  const stellung = stellungVon(nummer);
  const auswertung = prueffragen(stellung, stellung.amZug, zug);
  if (!auswertung) throw new Error(`Abb. ${nummer}: kein Ergebnis`);
  return auswertung;
}

function zeilen(auswertung: Werkzeugergebnis, kennung: string): readonly string[] {
  return auswertung.befunde.find((befund) => befund.kennung === kennung)?.zeilen ?? [];
}

describe("k4-prueffragen an den Fallenchecks aus Kapitel 4", () => {
  it.each(["4.2", "4.5", "4.34", "4.38"])(
    "Abb. %s: Keine Fesselung im Spiel, auch nicht nach dem Zug (wie im Buch)",
    (nummer) => {
      const auswertung = ergebnis(nummer);
      expect(zeilen(auswertung, "f3")).toEqual(["Keine Fesselung im Spiel."]);
      expect(zeilen(auswertung, "f3-nach")).toEqual(["Nein."]);
    },
  );

  it("Abb. 4.13: relative Fesselung Lg5–Sf6–Dd8; F1 fragt nach Sxd5", () => {
    const auswertung = ergebnis("4.13");
    expect(zeilen(auswertung, "f3")).toEqual([
      "Läufer g5 fesselt Springer f6 an Dame d8 (relativ)",
    ]);
    expect(zeilen(auswertung, "f1")).toEqual(["Sxd5 nimmt Material: Warum lässt Schwarz das zu?"]);
    expect(auswertung.markierungen).toContainEqual({
      typ: "pfeil",
      farbe: "grau",
      von: "g5",
      nach: "d8",
    });
  });

  it("Abb. 4.17: relative Fesselung Lg4–Sf3–Dd1", () => {
    expect(zeilen(ergebnis("4.17"), "f3")).toEqual([
      "Läufer g4 fesselt Springer f3 an Dame d1 (relativ)",
    ]);
  });

  it("Abb. 4.21 mit 8. axb4: erste Fesselung aufgehoben, die zweite wartet auf der e-Linie", () => {
    const auswertung = ergebnis("4.21");
    const nach = zeilen(auswertung, "f3-nach");
    expect(nach[0]).toBe("Ja.");
    expect(nach).toContain("aufgehoben: Läufer b4 fesselt Springer d2 an König e1 (absolut)");
    expect(nach).toContain(
      "bleibt: verdeckt: Dame e7 – Springer e5 – Bauer e2 – König e1; zieht Springer e5 weg, " +
        "ist Bauer e2 an den König gefesselt",
    );
    expect(nach.some((zeile) => zeile.startsWith("Antwort Sd3#"))).toBe(true);
    expect(auswertung.markierungen).toContainEqual({
      typ: "pfeil",
      farbe: "rot",
      von: "e7",
      nach: "e1",
    });
    expect(auswertung.fazit).toContain("Nach axb4 steht eine Fesselung gegen dich");
  });

  it("Abb. 4.24 mit 7... Sxe4: Die Antwort De2 baut die zweite Fesselung auf", () => {
    const nach = zeilen(ergebnis("4.24"), "f3-nach");
    expect(nach).toEqual([
      "Ja.",
      "Antwort De2 baut auf: verdeckt: Dame e2 – Springer e4 – Bauer e7 – König e8; " +
        "zieht Springer e4 weg, ist Bauer e7 an den König gefesselt",
    ]);
  });

  it("Abb. 4.25 mit 8... Sf6: Der Bauer e7 ist jetzt direkt an den König gefesselt", () => {
    expect(zeilen(ergebnis("4.25"), "f3-nach")).toContain(
      "neu: Dame e2 fesselt Bauer e7 an König e8 (absolut)",
    );
  });

  it("ohne geplanten Zug: F1 nennt scheinbare Geschenke, F3 nur die Stellung", () => {
    const auswertung = ergebnis("4.11", "");
    expect(zeilen(auswertung, "f1")).toEqual([
      "Lxf3 gewinnt scheinbar 6: Warum lässt Weiß das zu?",
    ]);
    expect(auswertung.befunde.some((befund) => befund.kennung === "f3-nach")).toBe(false);
  });

  it("ohne Angebot, aber mit Fesselung: F1 und F2 entfallen, F3 bleibt (Abb. 4.17)", () => {
    const auswertung = ergebnis("4.17");
    expect(zeilen(auswertung, "f1")).toEqual([
      "Kein Material im Angebot: F1 und F2 entfallen. Der Fesselungs-Check (F3) gilt trotzdem.",
    ]);
    expect(auswertung.befunde.some((befund) => befund.kennung === "f2")).toBe(false);
  });

  it("Abb. 4.29: weder Angebot noch Fesselung – nur der Hinweis, der beides nennt", () => {
    const auswertung = ergebnis("4.29");
    // Der Hinweis steht nur einmal, als Fazit (N99, Nachtest 0.2.27).
    expect(auswertung.befunde).toEqual([]);
    expect(auswertung.fazit).toContain("keine Fesselung im Spiel");
  });

  it("ohne Angebot und ohne Fesselung: nur ein Hinweis (Grundstellung)", () => {
    const auswertung = prueffragen(
      stellungAus("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"),
      "white",
    );
    expect(auswertung?.befunde).toEqual([]);
    expect(auswertung?.markierungen).toEqual([]);
  });

  it("ein Zug, der nicht geht, wird übergangen", () => {
    const auswertung = ergebnis("4.21", "Qh8");
    expect(auswertung.befunde.some((befund) => befund.kennung === "f3-nach")).toBe(false);
  });

  it("Lehrbild ohne König: kein Ergebnis", () => {
    expect(prueffragen(stellungAus("8/8/8/3N4/8/8/8/8 w - - 0 1"), "white")).toBeNull();
  });
});
