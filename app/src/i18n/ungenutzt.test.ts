/**
 * Test gegen ungenutzte Texte: Jeder Schlüssel in de.json soll im Code vorkommen.
 *
 * Warum: Am 26.10.2026 lagen in de.json Texte, die kein Code mehr aufrief (Codeführer,
 * Verbesserungen). Sie kosten Übersetzungsarbeit für en.json und verwirren beim Lesen. Der Test
 * meldet jeden neuen ungenutzten Schlüssel; dann den Text löschen (de.json und en.json) oder,
 * wenn der Code ihn auf eine Weise zusammensetzt, die dieser Test nicht erkennt, in die Prüfliste
 * eintragen.
 * Als benutzt gilt ein Schlüssel, wenn er im Code als Zeichenkette oder als „{{schluessel}}“ in
 * einer HTML-Seite steht, wenn sein Grundschlüssel ohne „Eins“/„Null“ (Einzahl, i18n/sprache.ts)
 * oder ohne eine angehängte Endung („${schluessel}Da“) dort steht oder wenn ein zusammengesetzter
 * Schlüssel mit seinem Anfang beginnt (Vorlage „spielen.ordnung.${…}“, auch mitten in einer
 * Vorlage wie „{{training.ort.${ort}}}“, oder Verkettung "werkzeug." + id).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import de from "./de.json";

const APP = resolve(__dirname, "../..");
/** Die HTML-Seiten außerhalb von src/ mit „{{schluessel}}“ (Startseite, Installation, Recht). */
const SEITEN = [
  "index.html",
  "app/index.html",
  "installieren/index.html",
  "admin/index.html",
  "datenschutz/index.html",
  "impressum/index.html",
];
/** Kürzere Anfänge zusammengesetzter Schlüssel („t.“) sagen nichts; sie zählen nicht. */
const KUERZESTER_ANFANG = 3;

/**
 * Schlüssel, die der Code benutzt, die der Test aber nicht selbst erkennt (geprüft am
 * 26.10.2026; die übrigen Einträge der früheren Liste waren wirklich ungenutzt und sind gelöscht).
 * Alle acht setzt `MerkerWahl` in ui/komponenten/einstellungen/EinstellungenKarte.tsx als
 * `${schluessel}.${w}` zusammen: `schluessel` ist einer der vier Grundschlüssel unten, `w` ist
 * „an“ oder „aus“ (KOORDINATEN).
 */
const NOCH_ZU_PRUEFEN: ReadonlySet<string> = new Set([
  "einstellungen.koordinaten.an",
  "einstellungen.koordinaten.aus",
  "einstellungen.wischen.an",
  "einstellungen.wischen.aus",
  "einstellungen.zuganimation.an",
  "einstellungen.zuganimation.aus",
  "einstellungen.startanimation.an",
  "einstellungen.startanimation.aus",
]);

/** Der Quelltext aller Dateien unter src/ (ohne Tests und Textdateien) und der HTML-Seiten. */
function quelltext(): string {
  const teile: string[] = [];
  const lauf = (ordner: string) => {
    for (const name of readdirSync(ordner)) {
      const pfad = join(ordner, name);
      if (statSync(pfad).isDirectory()) lauf(pfad);
      else if (/\.(ts|tsx|html|mjs)$/.test(name) && !/\.test\./.test(name)) {
        teile.push(readFileSync(pfad, "utf8"));
      }
    }
  };
  lauf(join(APP, "src"));
  for (const seite of SEITEN) teile.push(readFileSync(join(APP, seite), "utf8"));
  return teile.join("\n");
}

/** Die Schlüssel aus de.json, die im Quelltext nicht vorkommen. */
function ungenutzteSchluessel(): string[] {
  const text = quelltext();
  const woerter = [...text.matchAll(/(?:["'`]|\{\{)([a-zA-Z0-9_.-]+)(?:["'`]|\}\})/g)];
  const literale = new Set(woerter.map((m) => m[1] ?? ""));
  const vorlagen = [...text.matchAll(/`([a-zA-Z0-9_.-]*)\$\{/g)].map((m) => m[1] ?? "");
  // Anfänge mitten in einer Vorlage, etwa `<span …>{{training.ort.${ort}}}</span>`.
  const mitten = [...text.matchAll(/([a-zA-Z][a-zA-Z0-9_.]*\.)\$\{/g)].map((m) => m[1] ?? "");
  const verkettet = [...text.matchAll(/["'`]([a-zA-Z0-9_.-]+\.)["'`]\s*\+/g)].map(
    (m) => m[1] ?? "",
  );
  const anfaenge = [...vorlagen, ...mitten, ...verkettet].filter(
    (a) => a.length >= KUERZESTER_ANFANG,
  );
  // Angehängte Endungen wie `${schluessel}Da` (analyse/planfragen.ts), dazu „Eins“ und „Null“.
  const endungen = [...text.matchAll(/\$\{[^}]+\}([A-Za-z]+)`/g)].map((m) => m[1] ?? "");
  const grundformen = (k: string) =>
    ["Eins", "Null", ...endungen].filter((e) => k.endsWith(e)).map((e) => k.slice(0, -e.length));
  return Object.keys(de).filter(
    (k) =>
      !literale.has(k) &&
      !grundformen(k).some((g) => literale.has(g)) &&
      !anfaenge.some((a) => k.startsWith(a)),
  );
}

/**
 * Texte, die ein Nebenchat durch neue Schlüssel abgelöst hat. Er darf gemeinsame Schlüssel nicht
 * löschen (Absprache mit dem Haupt-Chat, 30.10.2026); der Haupt-Chat löscht sie beim Übernehmen
 * in de.json und en.json und leert diese Liste. Ungenutzt sein müssen sie trotzdem.
 */
const ABGELOEST: ReadonlySet<string> = new Set([
  // Zähltrainer: klarere Auftragstexte (Nebenchat, Punkte B4 und N).
  "zaehltrainer.auftrag",
  "zaehltrainer.haengenAuftrag",
]);

describe("Texte in de.json", () => {
  it("abgelöste Texte sind wirklich ungenutzt", () => {
    const ungenutzt = new Set(ungenutzteSchluessel());
    expect([...ABGELOEST].filter((k) => !ungenutzt.has(k))).toEqual([]);
  });

  it("jeder Text wird im Code benutzt (oder steht in der Prüfliste)", () => {
    const neu = ungenutzteSchluessel().filter((k) => !NOCH_ZU_PRUEFEN.has(k) && !ABGELOEST.has(k));
    expect(neu).toEqual([]);
  });

  it("die Prüfliste nennt nur Schlüssel, die es gibt", () => {
    const fehlend = [...NOCH_ZU_PRUEFEN].filter((k) => !(k in de));
    expect(fehlend).toEqual([]);
  });

  it("die Prüfliste nennt nur Schlüssel, die der Test nicht selbst erkennt", () => {
    const ungenutzt = new Set(ungenutzteSchluessel());
    const erkannt = [...NOCH_ZU_PRUEFEN].filter((k) => !ungenutzt.has(k));
    expect(erkannt).toEqual([]);
  });
});
