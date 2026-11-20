/**
 * Holt die gekaufte Grafik des Schach-Abenteuers aus dem privaten Repository (Entscheidung G1).
 *
 * Warum: Die LimeZu-Lizenz verbietet die Weitergabe der Dateien, deshalb liegen sie nicht im
 * öffentlichen Repository, sondern in `dobili/schach-abenteuer-inhalte`. Der Bau bei Cloudflare
 * holt sie mit einem nur lesenden Zugangsschlüssel (Umgebungsvariable GRAFIK_TOKEN, vom Autor im
 * Dashboard von Cloudflare eingetragen, nie im Repository) nach `app/inhalte-privat/quelle/`.
 * Ohne Schlüssel oder schon vorhandenen Ordner passiert nichts: Der Paketbau nimmt dann die
 * eigenen Platzhalter, die App baut wie bisher.
 * Ausnahme main (Vorbereitung des Schritts nach main, 20.11.2026): Beim Bau der Leser-App bei
 * Cloudflare (WORKERS_CI_BRANCH=main) bricht ein fehlender oder falscher Schlüssel den Bau ab.
 * Sonst ginge das Spiel still mit Platzhaltergrafik an echte Leser; so bleibt die alte Fassung
 * online, und das Protokoll von Cloudflare nennt den Grund.
 * Aufruf: Teil von `npm run vorbereiten`, vor dem Paketbau.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = resolve(HIER, "../inhalte-privat/quelle");
const REPOSITORY = "github.com/dobili/schach-abenteuer-inhalte";
/** Baut Cloudflare gerade die Leser-App (Zweig main)? */
const LESER_APP = process.env.WORKERS_CI_BRANCH === "main";

/** Ohne Grafik weiter (Platzhalter), außer beim Bau der Leser-App: dort Abbruch. */
function ohneGrafik(grund) {
  if (LESER_APP) {
    console.error(`Privatgrafik: ${grund}. Die Leser-App (main) baut nicht mit Platzhaltern.`);
    process.exit(1);
  }
  console.log(`Privatgrafik: ${grund}, das Spiel nutzt die Platzhalter.`);
}

function hole() {
  if (existsSync(ZIEL)) {
    console.log("Privatgrafik: schon vorhanden, nichts zu holen.");
    return;
  }
  const schluessel = process.env.GRAFIK_TOKEN;
  if (!schluessel) {
    ohneGrafik("kein GRAFIK_TOKEN");
    return;
  }
  try {
    execFileSync(
      "git",
      ["clone", "--depth", "1", `https://x-access-token:${schluessel}@${REPOSITORY}`, ZIEL],
      { stdio: ["ignore", "ignore", "pipe"] },
    );
    console.log("Privatgrafik: geholt.");
  } catch {
    // Den Fehlertext nicht ausgeben: Er enthielte die Adresse mit dem Schlüssel.
    ohneGrafik("Holen fehlgeschlagen");
  }
}

hole();
