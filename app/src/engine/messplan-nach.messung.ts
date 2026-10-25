/**
 * Messplan der Nachmessung nach Plan C (Nachtarbeit 25./26.10.2026, Auftrag des Autors): alle Bots,
 * Gruppen und die zwei übrigen Neuling-Kandidaten noch einmal mit 24 Partien, ohne und mit Maia.
 *
 * Rolle im Gesamtbild: Die Neumessung (engine/messplan.messung.ts) hatte 12 Partien je Bot; ihre
 * Zahlen streuen um etwa ±130, die Bereiche benachbarter Gruppen überschneiden sich, die Gruppen 2
 * und 3 liegen verkehrt. Mit 24 Partien mehr (zusammen 36) sinkt die Streuung auf etwa ±75. Die
 * Gegner sind die zwei Nm-Stufen um die neue Zahl im eigenen Zahlensatz (ohne: botstaerke-daten,
 * mit: botstaerke-maia-daten). Ohne Anker: die Anker der Neumessung gelten weiter.
 * Ergebnis: app/messplan-nach/<fassung>/teil-N.txt (eine Zeile Paarungen) für skripte/messe-nach.sh.
 * Aufruf: npx vitest run --config vitest.messung.config.ts src/engine/messplan-nach.messung.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { it } from "vitest";
import { BOTKANDIDATEN_NEULING } from "./botkandidaten-neuling";
import { gemesseneGruppenstaerke } from "./gruppe";
import { GEGNER } from "./gegner";
import { STUFEN_ZAHL, type Stufennummer } from "./stufen";
import { bottabelle, stufentabelle, type Zahlensatz } from "./zahlensatz";

const TEILE = 10;
const PARTIEN = 24;
const ZIEL = join(import.meta.dirname, "../../messplan-nach");
const KANDIDAT_ERSATZ = 300;

/** Die zwei Nm-Stufen um eine Zahl im Zahlensatz (unten Stufe 1 und 2, oben 9 und 10). */
function nachbarn(zahl: number, satz: Zahlensatz): [number, number] {
  const tabelle = stufentabelle(satz);
  const stufen = Array.from({ length: STUFEN_ZAHL }, (_, i) => i + 1);
  const darueber = stufen.find((s) => tabelle[s as Stufennummer] > zahl) ?? STUFEN_ZAHL;
  const unten = Math.max(1, darueber - 1);
  return unten === darueber ? [unten, unten + 1] : [unten, darueber];
}

function spielerIm(satz: Zahlensatz): { kern: string; zahl: number }[] {
  const bots = bottabelle(satz);
  return [
    ...GEGNER.map((g) => ({ kern: `@${g.kennung}`, zahl: bots[g.kennung] ?? KANDIDAT_ERSATZ })),
    ...BOTKANDIDATEN_NEULING.map((g) => ({ kern: `@${g.kennung}`, zahl: KANDIDAT_ERSATZ })),
    ...Array.from({ length: STUFEN_ZAHL }, (_, i) => ({
      kern: `@gruppe-${i + 1}`,
      zahl: gemesseneGruppenstaerke((i + 1) as Stufennummer, satz === "mit") ?? 0,
    })),
  ];
}

it("schreibt den Plan der Nachmessung", () => {
  let zahl = 0;
  for (const [satz, stern] of [
    ["ohne", ""],
    ["mit", "*"],
  ] as const) {
    const paarungen = spielerIm(satz).flatMap(({ kern, zahl: z }) =>
      nachbarn(z, satz).map((n) => `${kern}${stern}-${n}m${stern}`),
    );
    zahl += paarungen.length;
    const teile: string[][] = Array.from({ length: TEILE }, () => []);
    paarungen.forEach((p, i) => teile[i % TEILE]?.push(p));
    mkdirSync(join(ZIEL, satz), { recursive: true });
    teile.forEach((liste, i) =>
      writeFileSync(join(ZIEL, satz, `teil-${i + 1}.txt`), `${liste.join(" ")}\n`),
    );
  }
  writeFileSync(
    join(ZIEL, "README.md"),
    `# Nachmessung nach Plan C\n\n${zahl} Paarungen zu je ${PARTIEN} Partien (${zahl * PARTIEN} ` +
      `Partien) auf ${TEILE} Teile, ohne und mit Maia. Aufruf je Teil (im Ordner app/): ` +
      `\`skripte/messe-nach.sh ohne N\` oder \`mit N\`. Erzeugt von src/engine/messplan-nach.messung.ts.\n`,
  );
});
