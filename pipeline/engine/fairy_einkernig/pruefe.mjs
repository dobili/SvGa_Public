// Rauchprobe der einkernigen Fairy-Stockfish (bauen.sh): Engine laden, je Variante der App einen
// Zug rechnen lassen und prüfen, dass „bestmove“ kommt. Aufruf: node pruefe.mjs ORDNER
// Warum: Ein Build, der zwar übersetzt, aber im synchronen Betrieb hängt, fiele sonst erst im Spiel auf.
import { createRequire } from "node:module";
import { resolve } from "node:path";

const ordner = resolve(process.argv[2] ?? ".");
const require = createRequire(import.meta.url);
const Stockfish = require(resolve(ordner, "stockfish.js"));
const VARIANTEN = [
  "chess",
  "3check",
  "atomic",
  "kingofthehill",
  "racingkings",
  "antichess",
  "duck",
];
const FRIST_MS = 60000;

const engine = await Stockfish({
  locateFile: (datei) => resolve(ordner, datei),
});
const zeilen = [];
engine.addMessageListener((zeile) => zeilen.push(zeile));

/** Wartet, bis eine Zeile mit `anfang` kommt, und gibt sie zurück. */
async function warte(anfang) {
  const ende = Date.now() + FRIST_MS;
  while (Date.now() < ende) {
    const treffer = zeilen.find((z) => z.startsWith(anfang));
    if (treffer) {
      zeilen.length = 0;
      return treffer;
    }
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(`keine Zeile „${anfang}“ in ${FRIST_MS} ms`);
}

engine.postMessage("uci");
await warte("uciok");
engine.postMessage("setoption name Use NNUE value false");
for (const v of VARIANTEN) {
  engine.postMessage(`setoption name UCI_Variant value ${v}`);
  engine.postMessage("ucinewgame");
  engine.postMessage("position startpos");
  engine.postMessage("go depth 6");
  console.log(v, await warte("bestmove"));
}
engine.terminate();
process.exit(0);
