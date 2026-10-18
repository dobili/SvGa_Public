// Misst die Stufen der Engine (Konzept 8.2): Partien Stufe gegen Stufe mit der echten Engine.
//
// Warum: Die Kalibrierung soll nachvollziehbar sein (AP 11). Das Skript startet je Paarung einen
// Vitest-Lauf (src/engine/stufen.messung.ts, vitest.messung.config.ts), mehrere parallel, und
// fasst die Ergebnisse als Tabelle zusammen: Punkte der höheren Stufe, gemessene Fehlerquote je
// Seite, höchster Verlust eines Fehlerzuges, mittlere Dauer. Die Ergebnisse liegen nur lokal in
// buch/arbeit/stufenmessung/ (CLAUDE.md: Berichte nie ins Repository).
//
// Aufruf (im Ordner app/):
//   npm run messen:stufen                       # Nachbarn 1-2 … 7-8, je 10 Partien
//   npm run messen:stufen -- 1-2 3-4 --partien 6 --parallel 2
//   npm run messen:stufen -- 4-s5 5-e1600       # gegen festes Skill Level oder feste Elo-Zahl
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const APP = resolve(HIER, "..");
const ZIEL = resolve(APP, "../buch/arbeit/stufenmessung");
const NACHBARN = ["1-2", "2-3", "3-4", "4-5", "5-6", "6-7", "7-8"];
const STANDARD_PARTIEN = 10;
const STANDARD_PARALLEL = 4;
const PROZENT = 100;

function argumente(argv) {
  const paarungen = [];
  let partien = STANDARD_PARTIEN;
  let parallel = STANDARD_PARALLEL;
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === "--partien") partien = Number(argv[(i += 1)]);
    else if (a === "--parallel") parallel = Number(argv[(i += 1)]);
    else paarungen.push(a);
  }
  return { paarungen: paarungen.length > 0 ? paarungen : NACHBARN, partien, parallel };
}

/** Startet einen Messlauf für eine Paarung; erfüllt mit dem Exit-Code. */
function lauf(paarung, partien) {
  return new Promise((erfuellen) => {
    const kind = spawn(
      "npx",
      ["vitest", "run", "--config", "vitest.messung.config.ts", "src/engine/stufen.messung.ts"],
      {
        cwd: APP,
        env: {
          ...process.env,
          MESSUNG_PAARUNG: paarung,
          MESSUNG_PARTIEN: String(partien),
          MESSUNG_ZIEL: ZIEL,
          VITE_CONFIG_NATIVE_IGNORE_WARNING: "true",
        },
        stdio: ["ignore", "ignore", "inherit"],
      },
    );
    kind.on("close", (code) => {
      console.log(`Paarung ${paarung}: Lauf beendet (Code ${code}).`);
      erfuellen(code);
    });
  });
}

/** Führt die Läufe mit begrenzter Parallelität aus. */
async function alleLaeufe(paarungen, partien, parallel) {
  const warteschlange = [...paarungen];
  const arbeiter = Array.from({ length: Math.min(parallel, paarungen.length) }, async () => {
    for (let p = warteschlange.shift(); p !== undefined; p = warteschlange.shift()) {
      await lauf(p, partien);
    }
  });
  await Promise.all(arbeiter);
}

function prozent(zaehler, nenner) {
  return nenner > 0 ? `${Math.round((zaehler / nenner) * PROZENT)} %` : "–";
}

/** Fasst eine Paarung zusammen: Punkte der zweiten (höheren) Seite, Fehlerquoten, Verluste. */
function zusammenfassung(paarung) {
  const { berichte } = JSON.parse(readFileSync(join(ZIEL, `${paarung}.json`), "utf8"));
  // Am letzten Bindestrich trennen: Kennungen der Gegner enthalten selbst Bindestriche.
  const trenner = paarung.lastIndexOf("-");
  const [a, b] = [paarung.slice(0, trenner), paarung.slice(trenner + 1)];
  const seiten = {
    [a]: { punkte: 0, zuege: 0, fehler: 0, verlust: 0, arten: {} },
    [b]: { ...{ punkte: 0, zuege: 0, fehler: 0, verlust: 0, arten: {} } },
  };
  let dauer = 0;
  let halbzuege = 0;
  for (const p of berichte) {
    dauer += p.dauerMs;
    halbzuege += p.halbzuege;
    for (const [farbe, kuerzel] of [
      ["weiss", p.weiss],
      ["schwarz", p.schwarz],
    ]) {
      const s = seiten[kuerzel];
      const st = p.statistik[farbe];
      s.zuege += st.zuege;
      s.fehler += st.fehler;
      s.verlust = Math.max(s.verlust, st.hoechsterVerlust);
      for (const [art, n] of Object.entries(st.arten)) s.arten[art] = (s.arten[art] ?? 0) + n;
      const gewonnen = p.ergebnis === (farbe === "weiss" ? "1-0" : "0-1");
      s.punkte += gewonnen ? 1 : p.ergebnis === "1/2-1/2" ? 0.5 : 0;
    }
  }
  const arten = (s) =>
    Object.entries(s.arten)
      .sort((x, y) => y[1] - x[1])
      .map(([art, n]) => `${art} ${n}`)
      .join(", ") || "–";
  return {
    paarung,
    partien: berichte.length,
    zeile: `| ${paarung} | ${berichte.length} | ${seiten[b].punkte} : ${seiten[a].punkte} | ${prozent(seiten[a].fehler, seiten[a].zuege)} / ${prozent(seiten[b].fehler, seiten[b].zuege)} | ${seiten[a].verlust.toFixed(1)} / ${seiten[b].verlust.toFixed(1)} | ${Math.round(halbzuege / berichte.length)} | ${Math.round(dauer / berichte.length / 1000)} s |`,
    arten: `- ${paarung}: ${a}: ${arten(seiten[a])}; ${b}: ${arten(seiten[b])}`,
  };
}

async function main() {
  const { paarungen, partien, parallel } = argumente(process.argv.slice(2));
  mkdirSync(ZIEL, { recursive: true });
  console.log(
    `Messung: ${paarungen.join(", ")} · ${partien} Partien je Paarung · ${parallel} parallel`,
  );
  await alleLaeufe(paarungen, partien, parallel);
  const zeilen = paarungen.map(zusammenfassung);
  const tabelle = [
    `# Stufenmessung (${new Date().toISOString().slice(0, "JJJJ-MM-TT".length)})`,
    "",
    "| Paarung a-b | Partien | Punkte b : a | Fehlerquote a / b | Höchster Verlust a / b | Halbzüge | Dauer je Partie |",
    "|---|---|---|---|---|---|---|",
    ...zeilen.map((z) => z.zeile),
    "",
    "Fehlerarten:",
    ...zeilen.map((z) => z.arten),
    "",
  ].join("\n");
  writeFileSync(join(ZIEL, "bericht.md"), tabelle);
  console.log(tabelle);
  console.log(`Bericht: ${join(ZIEL, "bericht.md")}`);
}

main().catch((fehler) => {
  console.error(fehler);
  process.exit(1);
});
