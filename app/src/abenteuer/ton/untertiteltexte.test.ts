/**
 * Geräusche als Text: Zu jeder Musik und jedem Geräusch, das orte.json, die Dialoge und die
 * Begegnungen nennen, gibt es einen Text in den Spieltexten (ton/untertitel.ts). Die Tondateien
 * selbst liegen privat; ihre Texte stehen schon in texte/de.json und prüft der Paketbau nicht.
 */
import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { untertitelschluessel, type Untertitelart } from "./untertitel";
import { motivFuer } from "./motive";

const INHALTE = new URL("../../../../inhalte/abenteuer/", import.meta.url);
const STEUERWERTE = new Set(["aus", "karte", "bleibt", "ja"]);
/** Die erzeugten Motive (ton/motive.ts), die als `#klang` erklingen. */
const MOTIVE = [
  "aha",
  "konzern",
  "hale",
  "aufgabe",
  "fehler",
  "atme",
  "kerzenton",
  "blindschach.e4",
];

function lies(pfad: string): string {
  return readFileSync(new URL(pfad, INHALTE), "utf8");
}

/** Alle Angaben je Art aus orte.json, den Ink-Dialogen und begegnungen.json. */
function alleAngaben(): [Untertitelart, string][] {
  const angaben: [Untertitelart, string][] = [];
  const orte = JSON.parse(lies("orte.json")) as {
    orte: {
      karten: {
        musik?: string;
        geraeusch?: string;
        klangquellen?: { musik: string }[];
      }[];
    }[];
  };
  for (const karte of orte.orte.flatMap((o) => o.karten)) {
    if (karte.musik) angaben.push(["musik", karte.musik]);
    if (karte.geraeusch) angaben.push(["klang", karte.geraeusch]);
    for (const q of karte.klangquellen ?? []) angaben.push(["musik", q.musik]);
  }
  const ordner = new URL("dialoge/de/", INHALTE);
  for (const datei of readdirSync(ordner).filter((d) => d.endsWith(".ink"))) {
    const text = readFileSync(new URL(datei, ordner), "utf8");
    for (const [, art, wert] of text.matchAll(/#(musik|geraeusch|klang):([\w.-]+)/g)) {
      if (!wert || STEUERWERTE.has(wert)) continue;
      angaben.push([art === "musik" ? "musik" : "klang", wert]);
    }
  }
  for (const [, wert] of lies("begegnungen.json").matchAll(/"klang": "([^"]+)"/g)) {
    if (wert) angaben.push(["klang", wert]);
  }
  for (const motiv of MOTIVE) angaben.push(["klang", motiv]);
  return angaben;
}

describe("Geräusche als Text: Texte", () => {
  it("kennt die Motive, die es prüft", () => {
    expect(MOTIVE.filter((m) => motivFuer(m) === null)).toEqual([]);
  });

  it("hat zu jeder Musik und jedem Geräusch einen Text", () => {
    const texte = JSON.parse(lies("texte/de.json")) as Record<string, string>;
    const fehlend = alleAngaben()
      .filter(([art, angabe]) => !untertitelschluessel(art, angabe).some((s) => s in texte))
      .map(([art, angabe]) => `${art} ${angabe}`);
    expect([...new Set(fehlend)]).toEqual([]);
  });
});
