/**
 * Holt die gekaufte Grafik des Schach-Abenteuers aus dem privaten Repository (Entscheidung G1).
 *
 * Warum: Die LimeZu-Lizenz verbietet die Weitergabe der Dateien, deshalb liegen sie nicht im
 * öffentlichen Repository, sondern in `dobili/schach-abenteuer-inhalte`. Der Bau bei Cloudflare
 * holt sie mit einem nur lesenden Zugangsschlüssel (Umgebungsvariable GRAFIK_TOKEN, vom Autor im
 * Dashboard von Cloudflare eingetragen, nie im Repository) nach `app/inhalte-privat/quelle/`.
 * Ohne Schlüssel oder schon vorhandenen Ordner passiert nichts: Der Paketbau nimmt dann die
 * eigenen Platzhalter, die App baut wie bisher.
 * Aufruf: Teil von `npm run vorbereiten`, vor dem Paketbau.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const ZIEL = resolve(HIER, "../inhalte-privat/quelle");
const REPOSITORY = "github.com/dobili/schach-abenteuer-inhalte";

function hole() {
  if (existsSync(ZIEL)) {
    console.log("Privatgrafik: schon vorhanden, nichts zu holen.");
    return;
  }
  const schluessel = process.env.GRAFIK_TOKEN;
  if (!schluessel) {
    console.log("Privatgrafik: kein GRAFIK_TOKEN, das Spiel nutzt die Platzhalter.");
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
    console.warn("Privatgrafik: Holen fehlgeschlagen, das Spiel nutzt die Platzhalter.");
  }
}

hole();
