/** Tests der Planbilanz-Übung (Kapitel 6): Planfragen, LAP, Wettrennen an Buchstellungen. */
import { describe, expect, it } from "vitest";
import { profil } from "../analyse/stellungsprofil";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { phase } from "../schach/phase";
import { stellungAusFen } from "../schach/stellung";
import { lapbegruendung } from "./lapbegruendung";
import { buchstellungenAus } from "./buchstellungen";
import { hauptketteText } from "./planablenker";
import { lapaufgabe, planaufgaben, rennaufgabe } from "./planbilanztrainer";
import { festerZufall } from "./zufall";

const KAPITELZAHL = 13;
const stellungen = buchstellungenAus(Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)));
const GEGNERFRAGE = "Was will mein Gegner?";
const FIGURFRAGE = "Welche Figur?";

function stellung(nummer: string) {
  const b = stellungen.find((s) => s.nummer === nummer);
  if (!b) throw new Error(`${nummer} fehlt`);
  return b;
}

describe("Planbilanz-Übung", () => {
  it("Befund N696: Warum-Fragen tragen eine eigene Überschrift statt der Planfragen", () => {
    const warum = planaufgaben(stellungen, festerZufall(3)).filter((a) => a.warum);
    expect(warum.length).toBeGreaterThan(0);
    expect(warum.every((a) => !a.fragen.some((f) => f.frage === GEGNERFRAGE))).toBe(true);
  });

  const aufgaben = planaufgaben(stellungen, festerZufall(3));
  const planfragen = aufgaben.filter((a) => a.fragen.some((f) => f.frage === GEGNERFRAGE));

  it("Planfragen: drei Fragen je Stellung, die richtige Antwort steht zur Wahl", () => {
    expect(planfragen.length).toBeGreaterThan(10);
    for (const a of aufgaben) {
      for (const f of a.fragen) {
        expect(f.antworten[f.richtig], `${a.nummer} ${f.frage}`).toBeDefined();
        expect(new Set(f.antworten).size).toBe(f.antworten.length);
      }
    }
    expect(aufgaben.some((a) => a.buchbilanz)).toBe(true);
    expect(
      aufgaben
        .flatMap((a) => a.fragen)
        .some((f) => f.antworten[f.richtig]?.startsWith("Noch offen")),
    ).toBe(false);
  });

  it("R48: nur Mittelspielstellungen nach der Phasenerkennung der App, auch die Warum-Fragen", () => {
    for (const a of aufgaben) {
      const b = stellung(a.nummer);
      const p = profil(b.stellung);
      expect(phase(b.stellung, p.angriffskarte, p.drohungen).phase, a.nummer).toBe("mittelspiel");
    }
  });

  it("R48: „Was will mein Gegner?“ nennt in jeder Antwort nur den Gegner", () => {
    for (const a of planfragen) {
      const gegner = a.seite === "white" ? "Schwarz" : "Weiß";
      const frage = a.fragen.find((f) => f.frage === GEGNERFRAGE);
      for (const antwort of frage?.antworten ?? []) {
        expect(antwort.startsWith(gegner), `${a.nummer}: ${antwort}`).toBe(true);
      }
    }
  });

  it("R48: „Welche Figur?“ nennt eigene Figuren mit „dein“, Ablenker sind andere eigene Figuren", () => {
    for (const a of planfragen) {
      const frage = a.fragen.find((f) => f.frage === FIGURFRAGE);
      for (const antwort of frage?.antworten ?? []) {
        expect(/^Dein|^Deine|^Die Türme/.test(antwort), `${a.nummer}: ${antwort}`).toBe(true);
      }
      const figuren = (frage?.antworten ?? []).map((t) => /[a-h][1-8]/.exec(t)?.[0]);
      expect(new Set(figuren).size, a.nummer).toBe(figuren.length);
    }
  });

  it("R48: Ablenker zu „Wo spiele ich?“ gehören zu einer anderen Lage", () => {
    const ort = (text: string) => text.split(":")[0]?.split(",")[0] ?? text;
    for (const a of planfragen) {
      const frage = a.fragen.find((f) => f.frage === "Wo spiele ich?");
      if (!frage) continue;
      const richtig = frage.antworten[frage.richtig] ?? "";
      for (const antwort of frage.antworten) {
        if (antwort === richtig) continue;
        // Gleicher Ort nur mit anderem Grund (Kette, Sturm, Figuren, Schwäche, Minderheit).
        if (ort(antwort) === ort(richtig))
          expect(antwort.split(":")[1] === richtig.split(":")[1], `${a.nummer}: ${antwort}`).toBe(false);
      }
    }
  });

  it("Hauptkette: Abb. 11.78 (Weiß) nennt e4–d5, nicht c3–b4", () => {
    const b = stellung("11.78");
    expect(hauptketteText(profil(b.stellung), "white")).toBe("e4–d5");
    const aufgabe = planfragen.find((a) => a.nummer === "11.78");
    const wo = aufgabe?.fragen[0];
    expect(wo?.antworten[wo.richtig]).toContain("Kette e4–d5");
  });

  it("LAP: genug Stellungen, Figur und Zielfeld als Feldnamen", () => {
    const lap = stellungen.flatMap((b) => lapaufgabe(b) ?? []);
    expect(lap.length).toBeGreaterThan(10);
    expect(lap.every((a) => /^[a-h][1-8]$/.test(a.figur))).toBe(true);
  });

  it("Wettrennen: Abb. 6.6 Weiß 2, Schwarz 3", () => {
    expect(rennaufgabe(stellung("6.6"))?.zuege).toEqual({ white: 2, black: 3 });
    expect(stellungen.flatMap((s) => rennaufgabe(s) ?? []).length).toBeGreaterThan(3);
  });
});

describe("LAP: ruhige Stellungen und Begründung (Nebenchat, 30.10.2026)", () => {
  /** Die Stellung des Autors: Springer e7 gefesselt und angegriffen (Schwarz am Zug). */
  const UNRUHIG = "1r2k1r1/pbppnp1p/1bn2P2/7q/Q7/B1PB1N2/P4PPP/3RR1K1 b - - 0 1";

  it("nimmt keine Stellung mit gefesselter oder hängender eigener Figur", () => {
    const gelesen = stellungAusFen(UNRUHIG);
    if (!gelesen.ok) throw new Error(gelesen.fehler);
    expect(lapaufgabe({ nummer: "6.x", kapitel: 6, stellung: gelesen.wert })).toBeNull();
  });

  it("nennt die freien Felder und den Grund gegen eine andere Figur", () => {
    const lap = stellungen.flatMap((b) => lapaufgabe(b) ?? []);
    const aufgabe = lap.find((a) => a.figuren.length > 1);
    if (!aufgabe) throw new Error("keine LAP-Aufgabe mit mehreren Figuren");
    const andere = aufgabe.figuren.find((f) => f.feld !== aufgabe.figur);
    const saetze = lapbegruendung(aufgabe, andere?.feld ?? null, null);
    expect(saetze[0]).toContain("Freie Felder");
    expect(saetze).toHaveLength(2);
    expect(lapbegruendung(aufgabe, aufgabe.figur, aufgabe.ziel)).toHaveLength(1);
  });
});
