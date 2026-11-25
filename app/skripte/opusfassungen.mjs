// Opus-Fassungen der Tondateien für den Paketbau (Entscheidung des Autors RO41, 26.11.2026).
//
// Warum: Neben jeder AAC-Datei (musik/x.m4a) liegt im privaten Repository eine Opus-Fassung in
// WebM (musik/x.webm, 20 bis 30 % kleiner), gebaut von pipeline/abenteuer/ton/opusfassung.py.
// Sie entsteht dort und nicht hier, weil der Bau bei Cloudflare kein ffmpeg hat. Beide kommen
// ins Paket; das Gerät lädt nur eine davon (src/abenteuer/paket/tonfassung.ts).
// Eine Opus-Fassung kommt nur mit, wenn ihr Vermerk (spiel/opusquellen.json: Pfad → SHA-256 der
// AAC-Datei, aus der oder neben der sie entstand) zur heutigen AAC-Datei passt. Sonst wäre nach
// einem neuen Geräusch auf Opus-Geräten noch das alte zu hören; so spielt dort AAC, bis das
// Werkzeug neu läuft. Der Paketbau meldet, wie viele fehlen.
// Abhängigkeiten: keine (Node).
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Name des Vermerks im Ordner spiel/ des privaten Repositorys. */
export const VERMERK = "opusquellen.json";

/**
 * Liest den Vermerk; fehlt er, ein leerer (dann kommt keine Opus-Fassung ins Paket).
 * Eingabe: Ordner spiel/. Ausgabe: Pfad („musik/akt2/x.m4a“) → { aac: Prüfsumme, aus }.
 */
export async function liesOpusvermerk(spiel) {
  const datei = join(spiel, VERMERK);
  if (!existsSync(datei)) return {};
  return JSON.parse(await readFile(datei, "utf8"));
}

/** Pfad der Opus-Fassung zu einem AAC-Namen. Beispiel: „weg.m4a“ → „weg.webm“. */
export function opusname(name) {
  return name.replace(/\.m4a$/, ".webm");
}

/**
 * Die Bytes der passenden Opus-Fassung oder null.
 * Eingaben: Vermerk, Ordner der Datei, Schlüssel im Vermerk („klang/akt2/regen.m4a“), Name und
 * Bytes der AAC-Datei. Beispiel: Vermerk passt und regen.webm liegt daneben → deren Bytes.
 * Sonderfälle: kein AAC (ogg), keine Datei, kein oder veralteter Vermerk → null.
 */
export async function passendeOpusfassung(vermerk, ordner, schluessel, name, aac) {
  if (!name.endsWith(".m4a")) return null;
  const datei = join(ordner, opusname(name));
  if (!existsSync(datei)) return null;
  const summe = createHash("sha256").update(aac).digest("hex");
  if (vermerk[schluessel]?.aac !== summe) return null;
  return readFile(datei);
}
