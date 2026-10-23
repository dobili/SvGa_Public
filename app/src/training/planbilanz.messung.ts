/**
 * Prüflauf: schreibt alle Aufgaben der Planbilanz-Übung (Planfragen mit allen Antworten, Phase der
 * Stellung) als Text nach buch/arbeit/planbilanz.txt, zur Durchsicht ohne Engine (P4, R48).
 *
 * Rolle im Gesamtbild: Läuft nicht in „npm run pruefen“, sondern einmalig über
 * `npx vitest run --config vitest.messung.config.ts src/training/planbilanz.messung.ts`.
 * Abhängigkeiten: training/planbilanztrainer.ts, schach/phase.ts, analyse/stellungsprofil.ts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { it } from "vitest";
import { profil } from "../analyse/stellungsprofil";
import { ladeKapitel } from "../schach/buchabbildungen.testhilfe";
import { phase } from "../schach/phase";
import { buchstellungenAus } from "./buchstellungen";
import { lapaufgabe, planaufgaben } from "./planbilanztrainer";
import { festerZufall } from "./zufall";

const ZIEL = process.env.PLANBILANZ_ZIEL ?? resolve(__dirname, "../../../buch/arbeit/planbilanz.txt");
const KAPITELZAHL = 13;

it("schreibt alle Planaufgaben als Text", () => {
  const stellungen = buchstellungenAus(
    Array.from({ length: KAPITELZAHL }, (_, i) => ladeKapitel(i)),
  );
  const phasen = new Map(
    stellungen.map((b) => {
      const p = profil(b.stellung);
      return [b.nummer, phase(b.stellung, p.angriffskarte, p.drohungen).phase] as const;
    }),
  );
  const zeilen: string[] = [];
  for (const a of planaufgaben(stellungen, festerZufall(3))) {
    zeilen.push(`== Abb. ${a.nummer} (${a.seite} am Zug, Phase ${phasen.get(a.nummer)}) ${a.fen}`);
    for (const f of a.fragen) {
      zeilen.push(`  ${f.frage}`);
      f.antworten.forEach((antwort, i) => {
        zeilen.push(`    ${i === f.richtig ? "✓" : "✗"} ${antwort}`);
      });
    }
  }
  zeilen.push("", "== LAP-Aufgaben");
  for (const b of stellungen) {
    const l = lapaufgabe(b);
    if (l) zeilen.push(`  Abb. ${l.nummer} (${l.seite}, ${phasen.get(l.nummer)}): ${l.figur} → ${l.ziel}`);
  }
  mkdirSync(dirname(ZIEL), { recursive: true });
  writeFileSync(ZIEL, zeilen.join("\n") + "\n");
});
