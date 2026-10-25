// Übernimmt die Auswertung der Neumessung Plan C (beide Durchgänge) in die Daten der App.
//
// Warum: Seit 0.2.143 gibt es zwei Zahlensätze der Bot-Stärke, ohne und mit Maia
// (src/engine/zahlensatz.ts). Die Auswertung (src/engine/botstaerke.messung.ts) schreibt je
// Durchgang eine Datei botstaerke-daten.ts und einen Bericht. Dieses Skript setzt daraus
// - src/engine/botstaerke-daten.ts (ohne Maia; die Uhrabzüge bleiben, die Neumessung hat keine),
// - src/engine/botstaerke-maia-daten.ts (mit Maia, Stufen, Bots und Gruppen),
// - src/engine/gruppenstaerke-daten.ts (Gruppen ohne Maia)
// zusammen. Die Gruppen stehen nur im Bericht (Zeilen „gruppe-N“).
// Aufruf (im Ordner app/): node skripte/uebernehme-planc.mjs ../buch/arbeit/planc/ohne ../buch/arbeit/planc/mit
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const ENGINE = resolve(HIER, "../src/engine");
const [OHNE, MIT] = process.argv.slice(2);
if (!OHNE || !MIT) throw new Error("Aufruf: uebernehme-planc.mjs ORDNER_OHNE ORDNER_MIT");
const HEUTE = new Date().toISOString().slice(0, 10);
/**
 * Untergrenze jeder Zahl. Unter 400 ist die Leiter nur grob (die Eichung von „Deine Spielstärke“
 * beginnt bei 400, die App zeigt dort „unter 400“); mit Maia ergab die Neumessung für die
 * schwächsten Bots sogar Zahlen unter 0 (Streuung ±200), die als Gegnerwertung unsinnig wären.
 */
const MINDESTZAHL = 100;

/** Zahlen in „  schluessel: zahl,“-Zeilen auf die Untergrenze heben. */
function mitUntergrenze(text) {
  return text.replace(
    /^(\s+"?[\w-]+"?: )(-?\d+),$/gm,
    (_, vor, zahl) => `${vor}${Math.max(MINDESTZAHL, Number(zahl))},`,
  );
}

/** Ein Block „export const NAME … = { … };“ aus einer erzeugten Datei. */
function block(text, name) {
  const anfang = text.indexOf(`export const ${name}`);
  const ende = text.indexOf("\n};", anfang);
  if (anfang < 0 || ende < 0) throw new Error(`${name} fehlt`);
  return text.slice(anfang, ende + "\n};".length);
}

/** Die Zahlen „gruppe-N“ aus dem Bericht der Auswertung. */
function gruppen(bericht) {
  const zeilen = [...bericht.matchAll(/^\| gruppe-(\d+) \| (-?\d+) \|/gm)];
  if (zeilen.length === 0) throw new Error("keine Gruppen im Bericht");
  return zeilen
    .map((z) => [Number(z[1]), Number(z[2])])
    .sort((a, b) => a[0] - b[0])
    .map(([n, w]) => `  ${n}: ${Math.max(MINDESTZAHL, w)},`);
}

function lies(ordner, datei) {
  return readFileSync(join(ordner, datei), "utf8");
}

const ohne = lies(OHNE, "botstaerke-daten.ts");
const mit = lies(MIT, "botstaerke-daten.ts");
if (/NaN/.test(ohne) || /NaN/.test(mit)) throw new Error("NaN in den erzeugten Daten");

// Ohne Maia: neue Stufen und Bots, alte Uhrabzüge.
const alt = readFileSync(join(ENGINE, "botstaerke-daten.ts"), "utf8");
writeFileSync(
  join(ENGINE, "botstaerke-daten.ts"),
  mitUntergrenze(ohne).replace(block(ohne, "UHR_ABZUG"), block(alt, "UHR_ABZUG")),
);

// Mit Maia: eigene Namen, Gruppen aus dem Bericht.
const kopf = `/**
 * Elo-Zahl der Stufen, Bots und Gruppen, wenn Maia mitspielt (Neumessung Plan C, Durchgang „mit“,
 * ausgewertet am ${HEUTE} mit engine/botstaerke.messung.ts, übernommen mit
 * skripte/uebernehme-planc.mjs; nicht von Hand ändern).
 *
 * Rolle im Gesamtbild: Zweiter Zahlensatz für engine/zahlensatz.ts (seit 0.2.143). Gleiche Messung
 * wie botstaerke-daten.ts, nur wählen alle Spieler mit Maia. Herleitung: docs/ENTSCHEIDUNGEN.md,
 * „Maia im Wahlmodell, Plan C und eine Neumessung“.
 * Abhängigkeiten: engine/stufen.ts (Typ).
 */
import type { Stufennummer } from "./stufen";
`;
const maia = mitUntergrenze(
  [
    kopf,
    block(mit, "STUFEN_STAERKE").replace("STUFEN_STAERKE", "STUFEN_STAERKE_MAIA"),
    "",
    block(mit, "BOT_STAERKE").replace("BOT_STAERKE", "BOT_STAERKE_MAIA"),
    "",
    "export const GRUPPEN_STAERKE_MAIA: Readonly<Partial<Record<Stufennummer, number>>> = {",
    ...gruppen(lies(MIT, "bericht.md")),
    "};",
    "",
  ].join("\n"),
);
writeFileSync(join(ENGINE, "botstaerke-maia-daten.ts"), maia);

// Gruppen ohne Maia: Kopf der Datei bleibt, Zahlen neu.
const gruppendatei = readFileSync(join(ENGINE, "gruppenstaerke-daten.ts"), "utf8");
writeFileSync(
  join(ENGINE, "gruppenstaerke-daten.ts"),
  gruppendatei.replace(
    block(gruppendatei, "GRUPPEN_STAERKE"),
    [
      "export const GRUPPEN_STAERKE: Readonly<Partial<Record<Stufennummer, number>>> = {",
      ...gruppen(lies(OHNE, "bericht.md")),
      "};",
    ].join("\n"),
  ),
);
console.log("übernommen: botstaerke-daten.ts, botstaerke-maia-daten.ts, gruppenstaerke-daten.ts");
