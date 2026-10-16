/**
 * Zusammenhang der Buchdaten aus Sicht der App: Übungen, Glossar und Bilanzen zeigen nur auf
 * Dinge, die es gibt (AP 2). Ergänzt die Schema-Prüfung der Pipeline.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Glossar } from "./generiert/glossar";
import type { Datenverzeichnis } from "./generiert/index";
import type { Kapitel } from "./generiert/kapitel";
import { fenNach } from "../schach/variantenbaum";

const ORDNER = new URL("../../public/daten/de/a1/", import.meta.url);
const lies = <T>(datei: string): T => JSON.parse(readFileSync(new URL(datei, ORDNER), "utf8")) as T;
const verzeichnis = lies<Datenverzeichnis>("index.json");
const kapitel = verzeichnis.kapitel.map((eintrag) => lies<Kapitel>(eintrag.datei));
const glossar = lies<Glossar>(verzeichnis.glossar);
const alleNummern = new Set(verzeichnis.kapitel.flatMap((k) => k.abbildungen));

describe("Buchdaten", () => {
  it("Übungen sind im Buch lückenlos von 1 an durchgezählt und haben eine Lösung", () => {
    const uebungen = kapitel.flatMap((k) => k.uebungen);
    expect(uebungen.map((u) => u.nummer)).toEqual(uebungen.map((_, i) => i + 1));
    expect(uebungen.filter((u) => u.loesung.length === 0)).toEqual([]);
  });

  it("Übungen und Bilanzen zeigen nur auf vorhandene Abbildungen", () => {
    const ziele = [
      ...kapitel.flatMap((k) => k.uebungen.flatMap((u) => u.abbildungen)),
      ...kapitel.flatMap((k) => k.bilanzen.flatMap((b) => (b.abbildung ? [b.abbildung] : []))),
    ];
    expect(ziele.filter((nummer) => !alleNummern.has(nummer))).toEqual([]);
  });

  it("Glossar: Querverweise treffen Einträge, Stellen treffen Abbildungen", () => {
    const begriffe = new Set(glossar.eintraege.map((e) => e.begriff));
    expect(glossar.eintraege.flatMap((e) => e.verweise).filter((v) => !begriffe.has(v))).toEqual(
      [],
    );
    const stellen = glossar.eintraege.flatMap((e) => e.stellen);
    expect(stellen.filter((s) => s.abbildung !== null && !alleNummern.has(s.abbildung))).toEqual(
      [],
    );
    expect(glossar.eintraege.length).toBeGreaterThan(200);
  });

  it("Bilanzen haben Tabellen mit Wertungen (Grundlage der späteren Kalibrierung)", () => {
    const bilanzen = kapitel.flatMap((k) => k.bilanzen);
    expect(bilanzen.filter((b) => b.art === "ziel").length).toBeGreaterThan(10);
    expect(bilanzen.filter((b) => b.art === "faktor").length).toBeGreaterThan(10);
    // Skelettbilanzen (Kapitel 5 und 11) und Planbilanzen (Kapitel 6 und 11), Grundlage von AP 9.
    expect(bilanzen.filter((b) => b.art === "skelett").map((b) => b.abbildung)).toEqual([
      "5.14",
      "5.17",
      "5.22",
      "5.26",
      "5.32",
      "5.43",
      "5.44",
      "11.43",
      "11.57",
      "11.70",
    ]);
    expect(bilanzen.filter((b) => b.art === "plan").map((b) => b.abbildung)).toEqual([
      "6.20",
      "11.34",
    ]);
  });

  it("Zugfolgen: jede verknüpfte Abbildung steht im Beispiel genau an ihrer Stellung", () => {
    // Verglichen werden Figuren und Zugrecht; Rochaderechte und Zugzähler weichen im Buch ab.
    const kern = (fen: string | null) => fen?.split(" ").slice(0, 2).join(" ");
    const falsch = kapitel.flatMap((k) =>
      k.abbildungen.flatMap((a) => {
        const beispiel = a.beispiel && k.beispiele.find((b) => b.id === a.beispiel?.id);
        if (!a.beispiel || !beispiel) return a.beispiel ? [`${a.id}: Beispiel fehlt`] : [];
        return kern(fenNach(beispiel, a.beispiel.pfad)) === kern(a.fen) ? [] : [a.id];
      }),
    );
    expect(falsch).toEqual([]);
  });
});
