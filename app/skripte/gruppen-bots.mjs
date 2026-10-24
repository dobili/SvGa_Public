// Gibt die Kennungen der vorgefertigten Bots einer Gruppe aus (für die Messung je Zeitklasse).
//
// Warum: Die Messung je Zeitklasse (skripte/messe-zeitklasse.sh) läuft je Gruppe in einem eigenen
// Chat und braucht die Bots der Gruppe ohne die App zu starten. Die Gruppe folgt der gemessenen
// Schnellschach-Zahl (engine/botgruppe.ts: 300 Elo je Gruppe, gerundet), Spaß-Bots zählen nicht.
// Aufruf (im Ordner app/): node skripte/gruppen-bots.mjs 3   → „tom marie …“ (eine Zeile)
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ENGINE = resolve(dirname(fileURLToPath(import.meta.url)), "../src/engine");
const ELO_JE_GRUPPE = 300;
const STUFEN_ZAHL = 10;
const BOT = /bot\(\s*"([^"]+)",\s*"[^"]*",\s*"[^"]*",\s*\[(\d+), (\d+), (\d+)\]/g;

function lies(name) {
  return readFileSync(resolve(ENGINE, name), "utf8");
}

const zahlen = new Map(
  // Schlüssel mit oder ohne Anführungszeichen (Prettier lässt sie bei einfachen Namen weg)
  [...lies("botstaerke-daten.ts").matchAll(/^\s+"?([a-z0-9-]+)"?: (-?\d+),$/gm)].map((m) => [
    m[1],
    Number(m[2]),
  ]),
);
const gruppe = Number(process.argv[2]);
if (!(gruppe >= 1 && gruppe <= STUFEN_ZAHL)) throw new Error("Gruppe 1 bis 10 angeben");
const kennungen = [];
for (const datei of ["gegnerliste1.ts", "gegnerliste2.ts"]) {
  for (const m of lies(datei).matchAll(BOT)) {
    const zahl = zahlen.get(m[1]);
    const schnitt = (Number(m[2]) + Number(m[3]) + Number(m[4])) / 3;
    const roh = zahl === undefined ? schnitt : zahl / ELO_JE_GRUPPE;
    const g = Math.max(1, Math.min(STUFEN_ZAHL, Math.round(roh)));
    if (g === gruppe) kennungen.push(m[1]);
  }
}
console.log(kennungen.join(" "));
