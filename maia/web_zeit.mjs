// Dateikopf: Misst onnxruntime-web (WASM, 1 Thread) in Node für eine Maia-2-ONNX-Fassung.
// Zweck: Rechenzeit je Stellung im Browser abschätzen. Aufruf: node web_zeit.mjs MODELL.onnx
import { readFileSync } from "node:fs";
import * as ort from "onnxruntime-web";

const LAEUFE = 200;
const AUFWAERMEN = 10;
ort.env.wasm.numThreads = 1;
const sitzung = await ort.InferenceSession.create(readFileSync(process.argv[2]), { executionProviders: ["wasm"] });
const eingabe = {
  brett: new ort.Tensor("float32", new Float32Array(18 * 64).map((_, i) => (i % 7 === 0 ? 1 : 0)), [1, 18, 8, 8]),
  elo_selbst: new ort.Tensor("int64", BigInt64Array.from([3n]), [1]),
  elo_gegner: new ort.Tensor("int64", BigInt64Array.from([3n]), [1]),
};
for (let i = 0; i < AUFWAERMEN; i++) await sitzung.run(eingabe);
const start = performance.now();
for (let i = 0; i < LAEUFE; i++) await sitzung.run(eingabe);
console.log(JSON.stringify({ modell: process.argv[2], ms: (performance.now() - start) / LAEUFE }));
