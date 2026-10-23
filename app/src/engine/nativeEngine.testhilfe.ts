/**
 * Hilfe für lange Messläufe: ein Kanal zu einer nativen Stockfish-Datei unter Node.
 *
 * Rolle im Gesamtbild: Die App und die Tests sprechen über einen austauschbaren Kanal mit der
 * Engine (engineDienst.ts, Konzept 8). Für die Auswertung zehntausender Stellungen aus
 * Menschenpartien (engine/menschenprofil.messung.ts, Plan vom 20.10.2026) ist Stockfish lite
 * unter Node zu langsam; dieser Kanal startet stattdessen eine native Engine als eigenen Prozess
 * (nur lokal, Pfad über die Umgebung). Kein Test im Namen, damit Vitest die Datei nicht sammelt.
 * Abhängigkeiten: engineDienst.ts (Kanal), node:child_process, node:readline.
 */
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { EngineDienst, type Kanal } from "./engineDienst";

/**
 * Ein Kanal zu der Engine-Datei unter `pfad` (UCI über Standardein- und -ausgabe).
 * Beispiel: nativerKanal("../buch/arbeit/werkzeug/stockfish/stockfish-ubuntu-x86-64-avx2").
 */
export function nativerKanal(pfad: string): Kanal {
  const prozess = spawn(pfad, [], { stdio: ["pipe", "pipe", "inherit"] });
  let empfaenger: (zeile: string) => void = () => undefined;
  createInterface({ input: prozess.stdout }).on("line", (zeile) => empfaenger(zeile));
  return {
    senden: (befehl) => prozess.stdin.write(`${befehl}\n`),
    beiZeile: (neu) => {
      empfaenger = neu;
    },
    beenden: () => {
      prozess.stdin.write("quit\n");
      prozess.kill();
    },
  };
}

/** Ein Engine-Dienst über die native Engine; nach dem Lauf mit `beendeEngine()` schließen. */
export function nativeEngine(pfad: string): EngineDienst {
  return new EngineDienst(() => nativerKanal(pfad));
}
