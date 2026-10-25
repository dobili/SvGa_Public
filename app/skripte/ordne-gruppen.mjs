// Ordnet die vorgefertigten Bots nach ihrer gemessenen Zahl (ohne Maia) zu je acht in die zehn
// Stufen der Gegnerwahl und schreibt die feste Zuordnung nach src/engine/botgruppen-daten.ts.
//
// Warum: Bis 0.2.143 folgte die Stufe eines Bots aus seiner Zahl geteilt durch 300. Nach der
// Nachmessung (36 Partien je Bot, etwa ±60) überschnitten sich damit die Bereiche benachbarter
// Stufen (etwa Stufe 2 bis 642, Stufe 3 ab 499); der Autor wünscht Stufen ohne Überschneidung
// (19.10.2026). Seit 0.2.144 gilt deshalb eine feste Liste: die acht schwächsten Bots in Stufe 1,
// die nächsten acht in Stufe 2 und so weiter. Sie bleibt, bis jemand dieses Skript neu ausführt
// (dann auch die Gruppen neu messen, denn der Gruppenmodus spielt mit den acht Bots einer Stufe).
// Aufruf (im Ordner app/): node skripte/ordne-gruppen.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ENGINE = resolve(dirname(fileURLToPath(import.meta.url)), "../src/engine");
const JE_STUFE = 8;
const STUFEN = 10;
const BOT = /bot\(\s*"([^"]+)",/g;
const SPASS = /spassbot\(\s*"([^"]+)"/g;

const lies = (name) => readFileSync(resolve(ENGINE, name), "utf8");
const daten = lies("botstaerke-daten.ts");
const block = daten.slice(daten.indexOf("export const BOT_STAERKE"));
const zahlen = new Map(
  [...block.slice(0, block.indexOf("\n};")).matchAll(/^\s+"?([a-z0-9-]+)"?: (-?\d+),$/gm)].map(
    (m) => [m[1], Number(m[2])],
  ),
);
const listen = ["gegnerliste1.ts", "gegnerliste2.ts"].map(lies).join("\n");
const spass = new Set([...lies("gegnerliste0.ts").matchAll(SPASS)].map((m) => m[1]));
const bots = [...listen.matchAll(BOT)].map((m) => m[1]).filter((k) => !spass.has(k));
if (bots.length !== JE_STUFE * STUFEN) throw new Error(`${bots.length} Bots statt 80`);
const fehlend = bots.filter((k) => !zahlen.has(k));
if (fehlend.length > 0) throw new Error(`ohne Zahl: ${fehlend.join(", ")}`);
const sortiert = [...bots].sort((a, b) => zahlen.get(a) - zahlen.get(b) || a.localeCompare(b));
const zeilen = sortiert.map((k, i) => `  "${k}": ${Math.floor(i / JE_STUFE) + 1},`);
writeFileSync(
  resolve(ENGINE, "botgruppen-daten.ts"),
  `/**
 * Feste Stufe jedes vorgefertigten Bots in der Gegnerwahl (erzeugt von skripte/ordne-gruppen.mjs
 * am ${new Date().toISOString().slice(0, 10)} aus engine/botstaerke-daten.ts, ohne Maia; nicht von Hand ändern).
 *
 * Rolle im Gesamtbild: engine/botgruppe.ts. Je acht Bots nach der gemessenen Zahl, damit sich die
 * Bereiche benachbarter Stufen nicht überschneiden. Spaß-Bots stehen nicht darin.
 * Abhängigkeiten: keine.
 */
export const BOTGRUPPEN: Readonly<Record<string, number>> = {
${zeilen.join("\n")}
};
`,
);
console.log("Stufen neu geordnet:", sortiert.length, "Bots");
