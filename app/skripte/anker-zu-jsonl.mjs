// Ankerpartien (anker-*/<paarung>.json des Messlaufs) als stufen.jsonl für eichung-rechnen.mjs.
//
// Warum: Die Tiefe-18-Bewertung (skripte/eichung-rechnen.mjs --quellen stufen) liest Partien als
// JSONL mit Kennung und Zügen; der Messlauf schreibt je Paarung eine JSON-Datei mit Berichten.
// Aufruf: node skripte/anker-zu-jsonl.mjs <ordner>   (schreibt <ordner>/anker-bewertung/stufen.jsonl)
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ordner = resolve(process.argv[2] ?? ".");
const ziel = join(ordner, "anker-bewertung");
mkdirSync(ziel, { recursive: true });
const zeilen = [];
for (const o of readdirSync(ordner)
  .filter((n) => /^anker-s\d+$/.test(n))
  .sort()) {
  for (const n of readdirSync(join(ordner, o))
    .filter((x) => x.endsWith(".json"))
    .sort()) {
    const d = JSON.parse(readFileSync(join(ordner, o, n), "utf8"));
    d.berichte.forEach((b, i) => {
      zeilen.push(
        JSON.stringify({ plattform: "stufen", kennung: `${o}/${d.paarung}:${i}`, zuege: b.zuege }),
      );
    });
  }
}
writeFileSync(join(ziel, "stufen.jsonl"), zeilen.join("\n") + (zeilen.length ? "\n" : ""));
console.log(`${zeilen.length} Partien nach ${ziel}/stufen.jsonl`);
