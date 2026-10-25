/**
 * Messplan der Neumessung von Plan C (0.2.141, Freigabe des Autors 25.10.2026): alle Stufen, Bots,
 * Gruppen und die Neuling-Kandidaten, je ohne und mit Maia („*“), aufgeteilt auf zehn Chats.
 *
 * Rolle im Gesamtbild: Erzeugt app/messplan/<fassung>/teil-N.txt (Fassung „ohne“ und „mit“ Maia;
 * Zeile 1: Anker, Zeile 2: Paarungen) für skripte/messe-planc.sh. Zwei Durchgänge, weil „ohne“
 * schon laufen kann, während die Gewichte mit Maia noch geeicht werden. Anker: jede Nm-Stufe gegen sich selbst (40 Partien, Bewertung in Tiefe
 * 18); Bots und Gruppen gegen die zwei Nm-Stufen, deren Zahl ihre bisherige einrahmt (je 12
 * Partien), wie im zweiten Lauf vom 24.10.2026 (docs/FORTSCHRITT.md). Die Teile sind nach der
 * Zahl der Partien ausgeglichen; jeder Teil hat eine Anker-Stufe in beiden Fassungen.
 * Aufruf: npx vitest run --config vitest.messung.config.ts src/engine/messplan.messung.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { it } from "vitest";
import { BOTKANDIDATEN_NEULING } from "./botkandidaten-neuling";
import { BOT_STAERKE, STUFEN_STAERKE } from "./botstaerke-daten";
import { GEGNER } from "./gegner";
import { STUFEN_ZAHL, type Stufennummer } from "./stufen";

const TEILE = 10;
const ANKER_PARTIEN = 40;
const BOT_PARTIEN = 12;
const ZIEL = join(import.meta.dirname, "../../messplan");

/** Die zwei Nm-Stufen um eine Zahl (unter Stufe 1: Stufe 1 und 2; über Stufe 10: 9 und 10). */
function nachbarn(zahl: number): [number, number] {
  const stufen = Array.from({ length: STUFEN_ZAHL }, (_, i) => i + 1);
  const darueber =
    stufen.find((s) => (STUFEN_STAERKE[s as Stufennummer] ?? 0) > zahl) ?? STUFEN_ZAHL;
  const unten = Math.max(1, darueber - 1);
  return unten === darueber ? [unten, unten + 1] : [unten, darueber];
}

it("schreibt den Messplan", () => {
  const spieler = [
    ...GEGNER.map((g) => ({ kern: `@${g.kennung}`, zahl: BOT_STAERKE[g.kennung] ?? 400 })),
    ...BOTKANDIDATEN_NEULING.map((g) => ({ kern: `@${g.kennung}`, zahl: 350 })),
    ...Array.from({ length: STUFEN_ZAHL }, (_, i) => ({
      kern: `@gruppe-${i + 1}`,
      zahl: STUFEN_STAERKE[(i + 1) as Stufennummer] ?? 0,
    })),
  ];
  let paarungenZahl = 0;
  for (const [fassung, stern] of [
    ["ohne", ""],
    ["mit", "*"],
  ] as const) {
    const paarungen = spieler.flatMap(({ kern, zahl }) =>
      nachbarn(zahl).map((n) => `${kern}${stern}-${n}m${stern}`),
    );
    paarungenZahl += paarungen.length;
    const teile: string[][] = Array.from({ length: TEILE }, () => []);
    paarungen.forEach((p, i) => teile[i % TEILE]?.push(p));
    mkdirSync(join(ZIEL, fassung), { recursive: true });
    teile.forEach((liste, i) => {
      const n = i + 1;
      const anker = `${n}m${stern}-${n}m${stern}`;
      writeFileSync(join(ZIEL, fassung, `teil-${n}.txt`), `${anker}\n${liste.join(" ")}\n`);
    });
  }
  const paarungen = { length: paarungenZahl };
  const partien = paarungen.length * BOT_PARTIEN + TEILE * 2 * ANKER_PARTIEN;
  writeFileSync(
    join(ZIEL, "README.md"),
    `# Messplan Plan C (0.2.141)\n\n${paarungen.length} Paarungen zu je ${BOT_PARTIEN} Partien, ` +
      `${TEILE * 2} Anker zu je ${ANKER_PARTIEN}; zusammen ${partien} Partien auf ${TEILE} Teile. ` +
      `Aufruf je Teil (im Ordner app/): \`skripte/messe-planc.sh ohne N\` oder \`mit N\`. Erzeugt von src/engine/messplan.messung.ts.\n`,
  );
});
