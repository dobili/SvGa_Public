// Gezeichnete Bretter und Figurensätze je Brettstil für das Zusatzpaket des Abenteuers
// (skripte/baue-abenteuerpaket.mjs).
//
// Warum: Der Autor lässt je Ort ein Brett und einen Figurensatz bei Gemini zeichnen (Wunsch des
// Autors, 14.11.2026). pipeline/abenteuer/brettbilder.py legt sie im privaten Repository unter
// spiel/brett/<stil>/ ab: brett.webp, brett.json (mittlere Feldfarben) und wK.webp … bP.webp.
// Ins Paket kommen sie unter brett/<stil>/; die App zeigt sie statt der Pixelfiguren
// (src/abenteuer/brett/brettbilder.ts). Ohne Ordner gibt es nichts zu kopieren.
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

/** Dateien, die zu einem Brettstil gehören: Bilder und die Angaben zum Brett. */
const ENDUNG = /\.(webp|json)$/;

/**
 * Die Dateien aller Brettstile im privaten Ordner, sortiert.
 *
 * Eingabe: Ordner spiel/ des privaten Repositorys (wie PRIVAT im Paketbau).
 * Ausgabe: je Datei { pfad: "brett/schiefer/wK.webp", quelle: absoluter Pfad, gruppe }.
 * Beispiel: spiel/brett/schiefer/brett.json → { pfad: "brett/schiefer/brett.json", gruppe: "daten" }.
 * Sonderfall: andere Dateien (etwa eine Vorschau als PNG) bleiben draußen.
 */
export async function brettbilderDateien(privat) {
  const quelle = join(privat, "brett");
  if (!existsSync(quelle)) return [];
  const dateien = [];
  const stile = (await readdir(quelle, { withFileTypes: true })).filter((e) => e.isDirectory());
  for (const stil of stile.map((e) => e.name).sort()) {
    const namen = (await readdir(join(quelle, stil))).filter((d) => ENDUNG.test(d)).sort();
    for (const name of namen) {
      dateien.push({
        pfad: `brett/${stil}/${name}`,
        quelle: join(quelle, stil, name),
        gruppe: name.endsWith(".json") ? "daten" : "grafik",
      });
    }
  }
  return dateien;
}
