/**
 * Referenzergebnisse: Was jedes Werkzeug (ohne Engine) an jeder Abbildung des Buches findet, ist
 * festgehalten (Konzept 13 und 15.3).
 *
 * Warum: Ein Umbau an einem Baustein (etwa der Angriffskarte) kann unbemerkt Ergebnisse an
 * anderen Abbildungen verschieben. Hier steht je Abbildung und Werkzeug eine kurze Zeile mit
 * Urteil (E, N, V), Befunden mit Farbe und den Markierungen am Brett, ohne Texte; ändert sich
 * eine Zeile, scheitert der Test und zeigt den Unterschied. Ist die Änderung gewollt, schreibt
 * `npx vitest run src/analyse/referenzergebnisse.test.ts -u` die Datei neu (im Commit begründen).
 * Formulierungen der Texte dürfen sich ändern, ohne dass der Test anschlägt.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Datenverzeichnis } from "../daten/generiert/index";
import type { Kapitel } from "../daten/generiert/kapitel";
import { baueEroeffnungsindex } from "../schach/eroeffnungsindex";
import { ladeKapitel, naechsterBuchzug } from "../schach/buchabbildungen.testhilfe";
import { stellungAusFen } from "../schach/stellung";
import { werkzeugeFuer } from "./register";
import type { Bedarf, Markierung, Werkzeugergebnis } from "./werkzeug";

const ORDNER = new URL("../../public/daten/de/a1/", import.meta.url);
const verzeichnis = JSON.parse(
  readFileSync(new URL("index.json", ORDNER), "utf8"),
) as Datenverzeichnis;
const abbildungen = verzeichnis.kapitel.flatMap(
  (eintrag) =>
    (JSON.parse(readFileSync(new URL(eintrag.datei, ORDNER), "utf8")) as Kapitel).abbildungen,
);
const EROEFFNUNGEN = baueEroeffnungsindex([ladeKapitel(2), ladeKapitel(3)]);
/** Werkzeuge, die allein aus Stellung, Buchzug und Eröffnungen rechnen (kein Feld, keine Engine). */
const OHNE_EXTRAS: ReadonlySet<Bedarf> = new Set(["stellung", "zug", "eroeffnungen"]);
const TESTFRIST_MS = 120_000;

/** Eine Markierung als kurzer Text: „rot d4“ oder „gold e2-e4“. */
function marke(m: Markierung): string {
  return m.typ === "pfeil" ? `${m.farbe} ${m.von}-${m.nach}` : `${m.farbe} ${m.feld}`;
}

/** Die Zeile eines Ergebnisses: Urteil, Befunde mit Farbe, Markierungen (sortiert). */
function zeile(e: Werkzeugergebnis): string {
  const befunde = e.befunde.map((b) => `${b.kennung}:${b.art}${b.farbe ? `/${b.farbe}` : ""}`);
  const marken = e.markierungen.map(marke).sort();
  return `${e.art} [${befunde.join(" ")}] {${marken.join(" ")}}`;
}

describe("Referenzergebnisse der Werkzeuge an allen Abbildungen", () => {
  it(
    "stimmen mit der festgehaltenen Datei überein",
    async () => {
      const zeilen: string[] = [];
      for (const abbildung of abbildungen) {
        const stellung = stellungAusFen(abbildung.fen);
        if (!stellung.ok) continue;
        // Nur die Werkzeuge, die an dieser Abbildung freigeschaltet sind (bis zu ihrem Kapitel).
        const kapitel = Number(abbildung.id.split(".")[0]);
        const werkzeuge = werkzeugeFuer(kapitel).filter((w) =>
          w.braucht.every((b) => OHNE_EXTRAS.has(b)),
        );
        for (const w of werkzeuge) {
          const zug = naechsterBuchzug(abbildung.id) ?? undefined;
          const e = w.berechne({
            stellung: stellung.wert,
            perspektive: stellung.wert.amZug,
            ...(zug ? { zug } : {}),
            eroeffnungen: EROEFFNUNGEN,
            buchstellung: true,
          });
          if (e) zeilen.push(`${abbildung.id} ${w.id}: ${zeile(e)}`);
        }
      }
      await expect(`${zeilen.join("\n")}\n`).toMatchFileSnapshot("./__referenz__/werkzeuge.txt");
    },
    TESTFRIST_MS,
  );
});
