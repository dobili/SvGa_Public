/**
 * Tests der Zusatzaufgaben (Lichess, nicht aus dem Buch) an der ganzen Datei
 * public/daten/zusatzaufgaben.json: Daten lesbar und legal, jede Lösung führt Zug für Zug zu
 * „gelöst“, Zuordnung der Themen zu den Motiven des Buches, Runden nach Thema und Stufe.
 */
import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import de from "../i18n/de.json";
import type { Taktikdaten } from "../daten/trainerdaten";
import { alsZugaufgabe, MOTIVE, pruefeTaktikzug } from "./taktiktrainer";
import {
  alsZusatzaufgabe,
  stufeAusWertung,
  ZUSATZ_VORSATZ,
  ZUSATZTHEMEN,
  ZUSATZTHEMENLISTE,
  zusatzeintraegeAus,
  zusatzJeThema,
  zusatzrunde,
  type Zusatzaufgabe,
} from "./zusatzaufgaben";
import { festerZufall } from "./zufall";

const DATEI = new URL("../../public/daten/zusatzaufgaben.json", import.meta.url);
const TAKTIK = new URL("../../../inhalte/de/trainer/taktik.json", import.meta.url);
const roh = JSON.parse(readFileSync(DATEI, "utf8")) as { aufgaben: unknown[] };
const eintraege = zusatzeintraegeAus(roh) ?? [];
const aufgaben = eintraege.flatMap((e) => alsZusatzaufgabe(e) ?? []);
const HOECHSTENS_BYTES = 300_000;
const ETWA_ANZAHL = 1000;
const JE_THEMA = 50;
const WERTUNG_VON = 600;
const WERTUNG_BIS = 2200;
const HOECHSTENS_EIGENE_ZUEGE = 4;
const RUNDE = 8;

/** Spielt die Lösung so, wie der Leser sie zieht; Ergebnis „geloest“, wenn alles passt. */
function loese(z: Zusatzaufgabe): string {
  const zugaufgabe = alsZugaufgabe(z.aufgabe);
  if (!zugaufgabe) return "nicht spielbar";
  const bisher: string[] = [];
  const linie = zugaufgabe.linien[0] ?? [];
  for (let i = 0; i < linie.length; i += 2) {
    const ergebnis = pruefeTaktikzug(zugaufgabe, bisher, linie[i] ?? "");
    if (ergebnis.art !== "weiter") return ergebnis.art;
    bisher.push(linie[i] ?? "", ergebnis.antwort);
  }
  return "offen";
}

describe("Zusatzaufgaben: Datei", () => {
  it("ist klein und hat etwa 1000 Aufgaben, je Thema 50", () => {
    expect(statSync(DATEI).size).toBeLessThan(HOECHSTENS_BYTES);
    expect(eintraege).toHaveLength(roh.aufgaben.length);
    expect(eintraege).toHaveLength(ETWA_ANZAHL);
    const anzahl = zusatzJeThema(aufgaben);
    for (const thema of ZUSATZTHEMENLISTE) expect(anzahl.get(thema), thema).toBe(JE_THEMA);
  });

  it("jede Aufgabe ist legal, kurz, im Wertungsbereich und einmalig", () => {
    expect(aufgaben).toHaveLength(eintraege.length);
    for (const z of aufgaben) {
      expect(z.aufgabe.id.startsWith(ZUSATZ_VORSATZ)).toBe(true);
      expect(z.aufgabe.loesung.length).toBeLessThanOrEqual(2 * HOECHSTENS_EIGENE_ZUEGE - 1);
    }
    for (const e of eintraege) {
      expect(e.wertung).toBeGreaterThanOrEqual(WERTUNG_VON);
      expect(e.wertung).toBeLessThanOrEqual(WERTUNG_BIS);
    }
    expect(new Set(eintraege.map((e) => e.id)).size).toBe(eintraege.length);
  });

  it("jede Lösung führt Zug für Zug zu „gelöst“", () => {
    const fehler = aufgaben.filter((z) => loese(z) !== "geloest").map((z) => z.aufgabe.id);
    expect(fehler).toEqual([]);
  });

  it("keine Aufgabe steht schon im Taktiktrainer des Buches", () => {
    const taktik = JSON.parse(readFileSync(TAKTIK, "utf8")) as Taktikdaten;
    const dort = new Set(
      taktik.aufgaben.flatMap((a) => (a.herkunft.quelle === "lichess" ? [a.herkunft.puzzle] : [])),
    );
    expect(eintraege.filter((e) => dort.has(e.id))).toEqual([]);
  });
});

describe("Zusatzaufgaben: Zuordnung und Umrechnung", () => {
  it("jedes Thema gehört zu einem Grundmotiv aus Kapitel 7 oder zu keinem, und hat einen Namen", () => {
    const texte = de as Record<string, string>;
    for (const [thema, motiv] of Object.entries(ZUSATZTHEMEN)) {
      if (motiv !== null) expect(MOTIVE).toContain(motiv);
      expect(texte[`zusatzaufgaben.thema.${thema}`], thema).toBeTruthy();
    }
    expect(ZUSATZTHEMEN.ablenkung).toBe("ueberlastung");
    expect(ZUSATZTHEMEN.raeumung).toBe("hinlenkung");
  });

  it("spielt den Gegnerzug vor und beginnt die Lösung danach (Lichess 00008)", () => {
    const z = alsZusatzaufgabe({
      id: "00008",
      fen: "r6k/pp2r2p/4Rp1Q/3p4/8/1N1P2R1/PqP2bPP/7K b - - 0 24",
      zuege: "f2g3 e6e7 b2b1 b3c1 b1c1 h6c1",
      wertung: 1800,
      thema: "beseitigung",
      ziel: "gewinn",
    });
    expect(z?.vorher.zug).toBe("Bxg3");
    expect(z?.aufgabe.amZug).toBe("w");
    expect(z?.aufgabe.loesung).toEqual(["Rxe7", "Qb1+", "Nc1", "Qxc1+", "Qxc1"]);
    expect(z?.aufgabe.schluesselfeld).toBe("e6");
    expect(z?.aufgabe.schwierigkeit).toBe(4);
    expect(z?.aufgabe.id).toBe("lichess:00008");
  });

  it("liest die Rochade in Lichess-Schreibweise (e1g1) und verwirft Unspielbares", () => {
    const fen = "r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1";
    const eintrag = { id: "x", fen, wertung: 900, thema: "matt1", ziel: "matt" } as const;
    expect(alsZusatzaufgabe({ ...eintrag, zuege: "e1g1 e8c8" })?.aufgabe.loesung).toEqual([
      "O-O-O",
    ]);
    expect(alsZusatzaufgabe({ ...eintrag, zuege: "e1g1 e8e1" })).toBeNull();
    expect(alsZusatzaufgabe({ ...eintrag, zuege: "e1g1" })).toBeNull();
  });

  it("verwirft kaputte Einträge und unbekannte Themen", () => {
    expect(zusatzeintraegeAus({ aufgaben: [{ id: 1 }, { ...eintraege[0], thema: "neu" }] })).toEqual(
      [],
    );
    expect(zusatzeintraegeAus([])).toBeNull();
  });

  it("Stufen nach Wertung wie im Taktiktrainer", () => {
    expect([999, 1000, 1450, 1899, 1900].map(stufeAusWertung)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("Zusatzaufgaben: Runden", () => {
  it("passen zu Thema und Stufe, leichteste zuerst", () => {
    const runde = zusatzrunde(aufgaben, { thema: "spiess", stufe: 2 }, RUNDE, festerZufall(1));
    expect(runde).toHaveLength(RUNDE);
    expect(runde.every((z) => z.thema === "spiess" && z.aufgabe.schwierigkeit === 2)).toBe(true);
    const gemischt = zusatzrunde(aufgaben, { thema: "gemischt", stufe: null }, RUNDE, festerZufall(2));
    const wertungen = gemischt.map((z) =>
      z.aufgabe.herkunft.quelle === "lichess" ? z.aufgabe.herkunft.wertung : 0,
    );
    expect(wertungen).toEqual([...wertungen].sort((a, b) => a - b));
  });
});
