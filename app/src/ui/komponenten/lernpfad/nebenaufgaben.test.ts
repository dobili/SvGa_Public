/**
 * Tests der Nebenaufgaben des Lernpfads: Jedes Stück der Karte „Deine Erfolge“ hat ein Kapitel,
 * die Orden der Teile fehlen (sie stehen am Ende der Etappen), jedes Kapitel hat Nebenaufgaben,
 * die Kapitelaufgaben zählen Übungen, Lernziele und Trainer aus den gespeicherten Daten.
 */
import { Award } from "lucide-react";
import { describe, expect, it } from "vitest";
import { UEBUNGEN_JE_KAPITEL } from "../../../daten/uebungsliste-daten";
import { leereDaten } from "../../../speicher/format";
import { ABZEICHEN } from "../fortschritt/abzeichen";
import { BOTBUENDEL, ENGINEBUENDEL } from "../fortschritt/ringrechnung";
import { verdientSchluessel, type Erfolgsstueck } from "../erfolge/erfolgsstuecke";
import { stueckziel } from "../erfolge/stueckziele";
import { kapitelaufgaben, trainerMitRunde } from "./kapitelaufgaben";
import {
  kapitelDesStuecks,
  LETZTES_KAPITEL,
  nebenaufgabenJeKapitel,
  titelstueck,
  ZUORDNUNG,
} from "./nebenaufgaben";

const KAPITEL = Array.from({ length: LETZTES_KAPITEL + 1 }, (_, i) => i);
const DATEN = leereDaten(new Date("2026-10-31T08:00:00.000Z"));
const LEERE_QUELLE = {
  fortschritt: DATEN.fortschritt,
  lernstand: DATEN.lernstand,
  lernziele: new Map(KAPITEL.map((k) => [k, 5])),
};

/** Ein Stück für Tests. */
function stueck(art: "orden" | "abzeichen", kennung: string, verdient = false): Erfolgsstueck {
  return {
    art,
    kennung,
    name: kennung,
    bedingung: "",
    symbol: Award,
    anteil: null,
    verdient,
    ring: art === "orden" ? `ich-${kennung === "engine" ? "bots-10" : kennung}` : null,
  };
}

/** Die Schlüssel aller Orden außer den Teilen, wie fortschrittsringe.ts sie vergibt. */
const ORDEN = [
  "abbildungen",
  "uebungen",
  "lernziele",
  "trainer",
  ...BOTBUENDEL.flatMap(({ kennung }) =>
    kennung === ENGINEBUENDEL ? ["engine"] : [`bots-${kennung}-einmal`, `bots-${kennung}-alle`],
  ),
];

describe("Nebenaufgaben", () => {
  it("ordnet jedes Abzeichen und jeden Orden (ohne Teile) genau einem Kapitel zu", () => {
    const erwartet = [
      ...ABZEICHEN.map((a) => `abzeichen:${a.kennung}`),
      ...ORDEN.map((k) => `orden:${k}`),
    ];
    expect(new Set(Object.keys(ZUORDNUNG))).toEqual(new Set(erwartet));
    for (const kapitel of Object.values(ZUORDNUNG)) expect(KAPITEL).toContain(kapitel);
  });

  it("hat zu jedem Abzeichen und Orden einen Ort oder bewusst keinen", () => {
    const ohneOrt = Object.keys(ZUORDNUNG).filter((s) => {
      const [art = "", kennung = ""] = s.split(":");
      return stueckziel(stueck(art as "orden", kennung)) === null;
    });
    expect(ohneOrt).toEqual(["abzeichen:woche"]);
  });

  it("die Orden der Teile führen zum ersten Kapitel ihres Teils (Fehlertest f3)", () => {
    expect(stueckziel(stueck("orden", "teil-grundlagen"))).toEqual({
      bildschirm: "kapitel",
      nummer: 0,
    });
    expect(stueckziel(stueck("orden", "teil-endspiel"))).toEqual({
      bildschirm: "kapitel",
      nummer: 8,
    });
    expect(stueckziel(stueck("orden", "teil-praxis"))).toEqual({
      bildschirm: "kapitel",
      nummer: 11,
    });
  });

  it("verteilt die Stücke, lässt Teile weg, zählt doppelte einmal und hängt Unbekanntes ans Ende", () => {
    const stuecke = [
      stueck("abzeichen", "warum"),
      stueck("abzeichen", "warum"),
      stueck("orden", "teil-grundlagen"),
      stueck("abzeichen", "neuOhneZeile"),
    ];
    const liste = nebenaufgabenJeKapitel(stuecke, KAPITEL, () => []);
    expect(liste.get(2)?.map(verdientSchluessel)).toEqual(["abzeichen:warum"]);
    expect(liste.get(LETZTES_KAPITEL)?.map((s) => s.kennung)).toEqual(["neuOhneZeile"]);
    expect([...liste.keys()].sort((a, b) => a - b)).toEqual([2, LETZTES_KAPITEL]);
    expect(kapitelDesStuecks(stueck("abzeichen", "kurzerProzess"))).toBe(4);
  });

  it("gibt jedem Kapitel Kapitelaufgaben (Lernziele und Trainer mit Runde)", () => {
    for (const kapitel of KAPITEL) {
      const aufgaben = kapitelaufgaben(kapitel, LEERE_QUELLE);
      expect(aufgaben.length, `Kapitel ${kapitel}`).toBeGreaterThanOrEqual(2);
      expect(trainerMitRunde(kapitel).length, `Kapitel ${kapitel}`).toBeGreaterThan(0);
    }
    expect(trainerMitRunde(LETZTES_KAPITEL)).not.toContain("fehlerdatenbank");
  });

  it("zählt die Übungen eines Kapitels und führt zur ersten offenen", () => {
    const ids = UEBUNGEN_JE_KAPITEL[1] ?? [];
    const [erste = "", zweite = ""] = ids;
    const fortschritt = {
      ...DATEN.fortschritt,
      uebungen: { [erste]: { kapitel: 1, versuche: 1, geloest: true, zuletzt: "2026-10-31" } },
    };
    const [uebungen] = kapitelaufgaben(1, { ...LEERE_QUELLE, fortschritt });
    expect(uebungen?.anteil).toEqual({ erreicht: 1, gesamt: ids.length });
    expect(uebungen?.verdient).toBe(false);
    expect(uebungen?.ziel).toEqual({ bildschirm: "uebung", kapitel: 1, id: zweite });
  });

  it("zählt Lernziele und Trainer; fertig ist eine Aufgabe erst, wenn alles geschafft ist", () => {
    const fortschritt = {
      ...DATEN.fortschritt,
      trainer: { koordinaten: { durchgaenge: 1, aufgaben: 10, richtig: 9, zuletzt: "2026-10-31" } },
    };
    const lernstand = { 0: [0, 1, 2, 3, 4] };
    const aufgaben = kapitelaufgaben(0, { ...LEERE_QUELLE, fortschritt, lernstand });
    const nach = new Map(aufgaben.map((a) => [a.kennung, a]));
    expect(nach.get("lernziele-0")?.verdient).toBe(true);
    expect(nach.get("trainer-0")?.verdient).toBe(true);
    expect(nach.get("trainer-0")?.ziel).toEqual({ bildschirm: "training" });
    expect(nach.get("uebungen-0")?.verdient).toBe(false);
  });

  it("zeigt auf dem Bündel zuerst ein verdientes Stück", () => {
    const offen = stueck("abzeichen", "warum");
    const verdient = stueck("abzeichen", "woche", true);
    expect(titelstueck([offen, verdient])).toBe(verdient);
    expect(titelstueck([offen])).toBeNull();
    expect(titelstueck([])).toBeNull();
  });
});
