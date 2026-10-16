/**
 * Referenztests und Kalibrierung für das Werkzeug k3-faktorenbilanz an den 18 Faktorenbilanzen
 * des Buches (Kapitel 3, 6 und 11).
 *
 * Material und Zeit (Art E) müssen in jeder Bilanz mit der Waage des Buches übereinstimmen.
 * Königssicherheit und Aktivität sind Einschätzungen (Art N): Der Test verlangt die gemessene
 * Übereinstimmung (32 und 29 von 36) und listet die Abweichungen, damit Änderungen an den
 * Regeln sichtbar werden (Konzept 13).
 */
import type { Color } from "chessops/types";
import { describe, expect, it } from "vitest";
import { bilanzfaelle, stellungAus, stellungVon } from "../schach/buchabbildungen.testhilfe";
import type { Zelle } from "../daten/generiert/bilanz";
import { faktorenbilanz, faktorwertungen } from "./k3-faktorenbilanz";

/** Buchwertung ja/teils/nein in der Sprache der App. */
const EINSCHAETZUNG: Record<string, string> = { ja: "gut", teils: "teils", nein: "schlecht" };

function waage(links: Zelle, rechts: Zelle): "links" | "rechts" | "gerade" {
  const wertung = links.wertung ?? rechts.wertung;
  if (wertung === "vornlinks") return "links";
  if (wertung === "vornrechts") return "rechts";
  return "gerade";
}

/** Erste Zahl im Vorsprung des Buches, „+1 Springer“ in Bauerneinheiten. */
function vorsprung(zelle: Zelle, material: boolean): number {
  const text = zelle.text.map((teil) => teil.text).join("");
  const treffer = /\+(\d+)\s*(\p{L}*)/u.exec(text);
  if (!treffer) return 0;
  const zahl = Number(treffer[1]);
  const leichtfigur = /^(Springer|Läufer)/.test(treffer[2] ?? "");
  return material && leichtfigur ? zahl * 3 : zahl;
}

describe("k3-faktorenbilanz: Kalibrierung an allen Faktorenbilanzen des Buches", () => {
  const faelle = bilanzfaelle("faktor");
  const abweichungen: string[] = [];
  const zaehler = { koenig: 0, aktivitaet: 0 };

  it("findet 18 Faktorenbilanzen", () => {
    expect(faelle.length).toBe(18);
  });

  it.each(faelle.map((fall) => [fall.abbildung, fall] as const))(
    "Abb. %s: Material und Zeit wie die Waage im Buch",
    (_nummer, fall) => {
      const stellung = stellungVon(fall.abbildung);
      const links: Color = fall.tabelle.spalten[0].startsWith("Weiß") ? "white" : "black";
      const w = faktorwertungen(stellung, links);
      for (const zeile of fall.tabelle.zeilen) {
        if (zeile.name === "Material" || zeile.name === "Zeit") {
          const v = zeile.name === "Material" ? w.material : w.zeit;
          const app = v.vorn === null ? "gerade" : v.vorn === links ? "links" : "rechts";
          const buch = waage(zeile.links, zeile.rechts);
          expect(app, `${fall.abbildung} ${zeile.name}`).toBe(buch);
          const zelle = buch === "rechts" ? zeile.rechts : zeile.links;
          if (buch !== "gerade") {
            expect(v.um).toBe(vorsprung(zelle, zeile.name === "Material"));
          }
          continue;
        }
        const paar = zeile.name === "Königssicherheit" ? w.koenig : w.aktivitaet;
        const schluessel = zeile.name === "Königssicherheit" ? "koenig" : "aktivitaet";
        for (const [seite, zelle] of [
          [paar.eigen, zeile.links],
          [paar.gegner, zeile.rechts],
        ] as const) {
          if (seite.wertung === EINSCHAETZUNG[zelle.wertung ?? ""]) zaehler[schluessel]++;
          else abweichungen.push(`${fall.abbildung} ${zeile.name}: ${seite.wertung}`);
        }
      }
    },
  );

  it("Einschätzungen stimmen wie gemessen mit dem Buch überein (32 und 29 von 36)", () => {
    expect(zaehler.koenig, abweichungen.join("; ")).toBeGreaterThanOrEqual(32);
    expect(zaehler.aktivitaet, abweichungen.join("; ")).toBeGreaterThanOrEqual(29);
  });
});

describe("k3-faktorenbilanz an Buchabbildungen", () => {
  it("Abb. 3.10 (Muzio-Gambit): Waage, Zeitfiguren gold, Fazit mit Kompensation", () => {
    const stellung = stellungVon("3.10");
    const ergebnis = faktorenbilanz(stellung, "white");
    const material = ergebnis.befunde.find((b) => b.kennung === "material");
    expect(material?.waage).toEqual({
      links: "Weiß",
      rechts: "Schwarz",
      neigung: "rechts",
      vorsprung: "+3",
    });
    const zeit = ergebnis.befunde.find((b) => b.kennung === "zeit");
    expect(zeit?.zeilen[0]).toBe("Weiß: 3 im Spiel (Lc4, Df3 und Tf1)");
    expect(zeit?.zeilen).toContain(
      "Schwarz ist am Zug: eine Figur vom weißen Vorsprung abgezogen.",
    );
    expect(ergebnis.markierungen).toContainEqual({ typ: "feld", farbe: "gold", feld: "f3" });
    // Aus Sicht von Schwarz nur die schwarzen Markierungen: keine weiße Figur gold (0.2.28).
    const schwarz = faktorenbilanz(stellung, "black").markierungen;
    expect(schwarz).not.toContainEqual({ typ: "feld", farbe: "gold", feld: "f3" });
    // Ausführlichere Markierungen (0.2.29): Drohung gold, Angriff grau, zu Hause grau, König.
    const weiss = ergebnis.markierungen;
    expect(weiss).toContainEqual({ typ: "pfeil", farbe: "gold", von: "f3", nach: "f4" });
    expect(weiss).toContainEqual({ typ: "pfeil", farbe: "grau", von: "c4", nach: "f7" });
    expect(weiss).toContainEqual({ typ: "feld", farbe: "grau", feld: "b1" });
    expect(weiss).toContainEqual({ typ: "feld", farbe: "gold", feld: "g1" });
    expect(schwarz).toContainEqual({ typ: "feld", farbe: "rot", feld: "e8" });
    expect(schwarz).toContainEqual({ typ: "feld", farbe: "rot", feld: "f7" });
    expect(ergebnis.fazit).toContain("Ob das eine das andere aufwiegt, beurteilt erst die Engine.");
  });

  it("Abb. 3.10 aus Sicht von Schwarz (am Zug): Weiß bleibt links, wie im Buch", () => {
    const ergebnis = faktorenbilanz(stellungVon("3.10"), "black");
    const material = ergebnis.befunde.find((b) => b.kennung === "material");
    expect(material?.waage?.links).toBe("Weiß");
    expect(material?.waage?.neigung).toBe("rechts");
    expect(material?.zeilen[0]).toMatch(/^Weiß:/);
  });

  it("Abb. 6.31: Material mit Zahlwörtern wie im Buch", () => {
    const material = faktorenbilanz(stellungVon("6.31"), "white").befunde[0];
    expect(material?.zeilen[0]).toMatch(/^Weiß: Dame, zwei Springer, fünf Bauern \(\d+\)$/);
  });

  it("Abb. 3.6 und 3.42 (C1.5): „rochiert, aber ohne f-Bauern vor dem König“, kein Turm f8", () => {
    for (const nummer of ["3.6", "3.42"]) {
      const ergebnis = faktorenbilanz(stellungVon(nummer), "white");
      const koenig = ergebnis.befunde.find((b) => b.kennung === "koenig");
      expect(koenig?.zeilen[0], nummer).toBe(
        "Weiß: teils – rochiert, aber ohne f-Bauern vor dem König",
      );
      // Der Turm f8 steht hinter f7 und sieht nicht zum König: kein roter Pfeil nach f1.
      expect(ergebnis.markierungen, nummer).not.toContainEqual({
        typ: "pfeil",
        farbe: "rot",
        von: "f8",
        nach: "f1",
      });
    }
  });

  it("C1.5: Turm ohne Bauern dazwischen heißt „auf der offenen f-Linie“, mit Pfeil", () => {
    const stellung = stellungAus("5rk1/6pp/8/8/8/8/6PP/q4RK1 w - - 0 1");
    const ergebnis = faktorenbilanz(stellung, "white");
    expect(ergebnis.befunde.find((b) => b.kennung === "koenig")?.zeilen[0]).toBe(
      "Weiß: teils – rochiert, aber der gegnerische Turm f8 steht auf der offenen f-Linie am König",
    );
    expect(ergebnis.markierungen).toContainEqual({
      typ: "pfeil",
      farbe: "rot",
      von: "f8",
      nach: "f1",
    });
    // Mit einem schwarzen Bauern auf f4 ist die Linie halboffen, der Turm f8 steht dahinter.
    const halboffen = faktorenbilanz(
      stellungAus("5rk1/6pp/8/8/5p2/8/6PP/q4RK1 w - - 0 1"),
      "white",
    );
    expect(halboffen.befunde.find((b) => b.kennung === "koenig")?.zeilen[0]).toBe(
      "Weiß: teils – rochiert, aber ohne f-Bauern vor dem König",
    );
  });

  it("Abb. 3.60 und 3.69 (C1.6): Weiß ist matt, die Bilanz zeigt nur das Ergebnis", () => {
    for (const nummer of ["3.60", "3.69"]) {
      const ergebnis = faktorenbilanz(stellungVon(nummer), "white");
      expect(
        ergebnis.befunde.map((b) => b.zeilen),
        nummer,
      ).toEqual([["Matt: Die Partie ist entschieden."]]);
      expect(ergebnis.fazit).toBe("Matt: Die Partie ist entschieden.");
    }
  });

  it("Patt (C1.6): „Patt: Die Partie ist entschieden (remis).“", () => {
    const ergebnis = faktorenbilanz(stellungAus("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1"), "black");
    expect(ergebnis.fazit).toBe("Patt: Die Partie ist entschieden (remis).");
  });

  it.each(["3.23", "3.34", "3.68"])(
    "Abb. %s (C1.6): im Schach erst der Hinweis, der König dort nicht „gut“",
    (nummer) => {
      const stellung = stellungVon(nummer);
      const ergebnis = faktorenbilanz(stellung, stellung.amZug);
      expect(ergebnis.befunde[0]?.zeilen[0]).toBe(
        "Erst das Schach und die Taktik zu Ende rechnen (Kapitel 1 und 7); die Bilanz zählt nur, was gerade auf dem Brett steht.",
      );
      expect(ergebnis.stufen[0][0]).toBe("schach");
      const { koenig } = faktorwertungen(stellung, stellung.amZug);
      expect(koenig.eigen.wertung).not.toBe("gut");
    },
  );

  it("Abb. 3.23 (C1.6): Weiß im Schach durch Lb4+ heißt „teils – der König steht im Schach“", () => {
    const ergebnis = faktorenbilanz(stellungVon("3.23"), "white");
    expect(ergebnis.befunde.find((b) => b.kennung === "koenig")?.zeilen[0]).toBe(
      "Weiß: teils – der König steht im Schach",
    );
    expect(ergebnis.fazit).toMatch(/^Weiß steht im Schach: erst zu Ende rechnen\./);
  });

  it("Lehrbild ohne König: keine Fehler", () => {
    const ergebnis = faktorenbilanz(stellungAus("8/8/8/3N4/8/8/8/8 w - - 0 1"), "white");
    expect(ergebnis.befunde).toHaveLength(5);
  });
});
