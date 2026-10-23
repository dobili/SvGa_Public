/** Tests der Lernsammlung (Kapitel 12): Lesen, Ändern, Ordnen nach Eröffnung, PGN für Lichess. */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Eroeffnungsliste } from "../daten/generiert/eroeffnungsliste";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { baueEroeffnungsindex } from "../schach/eroeffnungsindex";
import { eroeffnungsnamenAus } from "../schach/eroeffnungsnamen";
import { fenNachZuegen } from "../schach/weiterspielen";
import {
  eroeffnungsnameFuer,
  geaenderterEintrag,
  GRUNDSTELLUNG,
  HOECHSTENS_SAMMLUNG,
  mitSammeleintrag,
  nachEroeffnung,
  ohneSammeleintrag,
  PLAN_HOECHSTENS,
  sammlungAus,
  type Sammeleintrag,
} from "./lernsammlung";
import { eintragAlsPgn, sammlungAlsPgn, zugtext, type Pgntexte } from "./sammlungpgn";

const LICHESS = eroeffnungsnamenAus(
  JSON.parse(
    readFileSync(
      new URL("../../public/daten/de/eroeffnungen-lichess.json", import.meta.url),
      "utf8",
    ),
  ) as Eroeffnungsliste,
);
const INDEX = { ...baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]), bekannte: LICHESS };
const SPANISCH = ["e4", "e5", "Nf3", "Nc6", "Bb5"];

function eintrag(id: string, eroeffnung: string, datum = "2026-10-18T12:00:00.000Z") {
  return {
    id,
    datum,
    fen: GRUNDSTELLUNG,
    herkunft: "fen",
    quelle: "",
    eroeffnung,
    plan: "",
    notiz: "",
  } satisfies Sammeleintrag;
}

const TEXTE: Pgntexte = {
  fundstelle: (e) => (e.herkunft === "abbildung" ? `Abb. ${e.quelle}` : "Stellung"),
  ohneEroeffnung: "Ohne Eröffnung",
  plan: "Plan",
  notiz: "Notiz",
};

describe("Lernsammlung lesen und ändern", () => {
  it("liest gültige Einträge, kürzt zu lange Sätze und verwirft Unbrauchbares", () => {
    const roh = [
      { ...eintrag("a", "Spanische Partie"), plan: "x".repeat(PLAN_HOECHSTENS + 5) },
      { id: "b", datum: "2026-10-18" },
      "kaputt",
      {
        ...eintrag("c", ""),
        herkunft: "unbekannt",
        verlauf: { startFen: GRUNDSTELLUNG, zuege: [1] },
      },
    ];
    const liste = sammlungAus(roh);
    expect(liste.map((e) => e.id)).toEqual(["a", "c"]);
    expect(liste[0]?.plan).toHaveLength(PLAN_HOECHSTENS);
    expect(liste[1]?.herkunft).toBe("fen");
    expect(liste[1]?.verlauf).toBeUndefined();
    expect(sammlungAus(undefined)).toEqual([]);
  });

  it("hängt an, ändert, löscht und hält die Obergrenze", () => {
    let liste = mitSammeleintrag([], eintrag("a", ""));
    liste = geaenderterEintrag(liste, "a", {
      plan: "Druck auf e5",
      eroeffnung: "Spanische Partie",
    });
    expect(liste[0]).toMatchObject({ plan: "Druck auf e5", eroeffnung: "Spanische Partie" });
    expect(ohneSammeleintrag(liste, "a")).toEqual([]);
    const voll = Array.from({ length: HOECHSTENS_SAMMLUNG }, (_, i) => eintrag(`v${i}`, ""));
    const danach = mitSammeleintrag(voll, eintrag("neu", ""));
    expect(danach).toHaveLength(HOECHSTENS_SAMMLUNG);
    expect(danach.at(-1)?.id).toBe("neu");
    expect(danach[0]?.id).toBe("v1");
  });

  it("ordnet nach Eröffnung, alphabetisch, ohne Eröffnung zuletzt, älteste zuerst", () => {
    const liste = [
      eintrag("s2", "Spanische Partie", "2026-10-18T13:00:00.000Z"),
      eintrag("o", ""),
      eintrag("f", "Französische Verteidigung"),
      eintrag("s1", "Spanische Partie", "2026-10-17T13:00:00.000Z"),
    ];
    const gruppen = nachEroeffnung(liste);
    expect(gruppen.map((g) => g.eroeffnung)).toEqual([
      "Französische Verteidigung",
      "Spanische Partie",
      "",
    ]);
    expect(gruppen[1]?.eintraege.map((e) => e.id)).toEqual(["s1", "s2"]);
  });
});

describe("Eröffnung einer gesammelten Stellung", () => {
  it("nimmt den Namen aus den Buchvarianten (Abb. 2.2 nach 3. Lb5)", () => {
    const fen = fenNachZuegen(GRUNDSTELLUNG, SPANISCH) ?? "";
    expect(eroeffnungsnameFuer(INDEX, fen)).toMatch(/^Spanisch/);
  });

  it("geht den Weg zurück bis zur letzten Buchstellung (ohne Lichess-Liste)", () => {
    const nurBuch = { ...INDEX, bekannte: undefined };
    const zuege = [...SPANISCH, "a6", "h3", "h6"];
    const fen = fenNachZuegen(GRUNDSTELLUNG, zuege) ?? "";
    expect(eroeffnungsnameFuer(nurBuch, fen)).toBe("");
    expect(eroeffnungsnameFuer(nurBuch, fen, { startFen: GRUNDSTELLUNG, zuege })).toMatch(
      /^Spanisch/,
    );
  });

  it("nennt außerhalb des Buches die Familie aus der Lichess-Liste, sonst nichts", () => {
    const zuege = ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"];
    const fen = fenNachZuegen(GRUNDSTELLUNG, zuege) ?? "";
    const name = eroeffnungsnameFuer(INDEX, fen, { startFen: GRUNDSTELLUNG, zuege });
    expect(name).not.toContain(":");
    expect(name.length).toBeGreaterThan(0);
    expect(eroeffnungsnameFuer(undefined, fen)).toBe("");
    expect(eroeffnungsnameFuer(INDEX, "8/8/4k3/8/8/4K3/8/8 w - - 0 1")).toBe("");
  });
});

describe("PGN für eine Lichess-Studie", () => {
  it("nummeriert Züge ab Weiß und ab Schwarz", () => {
    expect(zugtext(GRUNDSTELLUNG, ["e4", "e5", "Nf3"])).toBe("1. e4 e5 2. Nf3");
    expect(zugtext("8/8/4k3/8/8/4K3/8/8 b - - 0 6", ["Kd6", "Kd4"])).toBe("6... Kd6 7. Kd4");
  });

  it("schreibt Weg, Plan und Notiz; ohne Weg die Stellung als FEN", () => {
    const mitWeg: Sammeleintrag = {
      ...eintrag("a", "Spanische Partie"),
      herkunft: "abbildung",
      quelle: "2.2",
      fen: fenNachZuegen(GRUNDSTELLUNG, SPANISCH) ?? "",
      plan: "Druck auf e5 {gegen den Springer}",
      notiz: "Zeile 1\nZeile 2",
      verlauf: { startFen: GRUNDSTELLUNG, zuege: SPANISCH },
    };
    const pgn = eintragAlsPgn(mitWeg, TEXTE);
    expect(pgn).toContain('[White "Spanische Partie"]');
    expect(pgn).toContain('[Black "Abb. 2.2"]');
    expect(pgn).not.toContain("[FEN");
    expect(pgn).toContain(
      "1. e4 e5 2. Nf3 Nc6 3. Bb5 {Plan: Druck auf e5 (gegen den Springer) Notiz: Zeile 1 Zeile 2} *",
    );
    const ohneWeg = {
      ...eintrag("b", ""),
      fen: "8/8/4k3/8/8/4K3/8/8 w - - 0 1",
      plan: 'Mit "Opposition"',
    };
    const zweiter = eintragAlsPgn(ohneWeg, TEXTE);
    expect(zweiter).toContain('[SetUp "1"]\n[FEN "8/8/4k3/8/8/4K3/8/8 w - - 0 1"]');
    expect(zweiter).toContain('[White "Ohne Eröffnung"]');
    expect(zweiter).toContain('{Plan: Mit "Opposition"} *');
    expect(sammlungAlsPgn([mitWeg, ohneWeg], TEXTE).split("[Event ").length - 1).toBe(2);
  });
});
