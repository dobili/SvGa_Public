/**
 * Hilfen zur Wahl der Bedenkzeit unter Spielen: Namen der Vorgaben mit Zeitklasse, gewählte
 * Stelle, Uhr beim Start.
 *
 * Rolle im Gesamtbild: Eigene Datei, damit Spielen.tsx unter 400 Zeilen bleibt. Die Wertung gilt
 * je Zeitklasse (R51, Wunsch des Autors, 23.10.2026); deshalb hat jede Partie aus der
 * Grundstellung eine Uhr (ohne gewählte Uhr 10 + 0, Schnellschach wie der Partietag des
 * 30-Minuten-Plans). „Ohne Uhr“ gibt es nur für Partien aus einer Abbildung oder aufgebauten
 * Stellung, die ohnehin ungewertet sind (Entscheidung des Autors, 24.10.2026).
 * Abhängigkeiten: spiel/uhr.ts, spiel/elomodell.ts (Zeitklasse), wertungstext.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import { wertungstempo } from "../../../spiel/elomodell";
import { gleicheUhr, UHR_STANDARD, UHR_VORGABEN, type Uhreinstellung } from "../../../spiel/uhr";
import { zeitklassenname } from "../fortschritt/wertungstext";

const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;
const GRUNDSTELLUNG = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** Kennung der Wahl „Ohne Uhr“ in der Auswahl. */
export const OHNE_UHR = "ohne";

/** Name einer Stelle: „Blitz 3 + 2“, „Schnellschach 15 + 10“ oder „Ohne Uhr“. */
export function uhrname(stelle: string): string {
  const vorgabe = UHR_VORGABEN[Number(stelle)];
  if (stelle === OHNE_UHR || !vorgabe) return t("spielen.uhr.ohne");
  return t("spielen.uhr.mitKlasse", {
    zeitklasse: zeitklassenname(wertungstempo(vorgabe)),
    minuten: vorgabe.grundzeitMs / MINUTE_MS,
    sekunden: vorgabe.zuschlagMs / SEKUNDE_MS,
  });
}

/**
 * Kurzer Name einer Uhr für die Startleiste (DS50): nur „10 + 0“, weil die Zeitklasse schon in
 * der gewählten Kachel steht und die Zusammenfassung bei 360 Pixeln sonst abgeschnitten wird.
 * Beispiel: Stelle der Vorgabe Schnellschach 10 + 0 → „10 + 0“; „ohne“ → „Ohne Uhr“.
 */
export function uhrnameKurz(stelle: string): string {
  const vorgabe = UHR_VORGABEN[Number(stelle)];
  if (stelle === OHNE_UHR || !vorgabe) return t("spielen.uhr.ohne");
  return t("spielen.uhr.kurz", {
    minuten: vorgabe.grundzeitMs / MINUTE_MS,
    sekunden: vorgabe.zuschlagMs / SEKUNDE_MS,
  });
}

/** Die Stellen der Auswahl: alle Vorgaben, außerhalb der Grundstellung dazu „Ohne Uhr“. */
export function uhrStellen(fen: string): string[] {
  const stellen = UHR_VORGABEN.map((_, stelle) => String(stelle));
  return fen === GRUNDSTELLUNG ? stellen : [...stellen, OHNE_UHR];
}

/**
 * Die Uhr, mit der die Partie beginnt: aus der Grundstellung immer eine (gespeichert „ohne Uhr“
 * oder nichts → 10 + 0), aus einer Abbildung oder aufgebauten Stellung auch keine.
 * Beispiel: Grundstellung, Vorliebe null → 10 + 0; Abbildung 1.26, Vorliebe null → ohne Uhr.
 */
export function wirksameUhr(fen: string, uhr: Uhreinstellung | null): Uhreinstellung | null {
  if (uhr) return uhr;
  return fen === GRUNDSTELLUNG ? UHR_STANDARD : null;
}

/** Die gewählte Stelle zur wirksamen Uhr; unbekannte Uhren zeigen die erste Vorgabe. */
export function uhrstelle(fen: string, uhr: Uhreinstellung | null): string {
  const wirksam = wirksameUhr(fen, uhr);
  if (!wirksam) return OHNE_UHR;
  const stelle = UHR_VORGABEN.findIndex((v) => gleicheUhr(v, wirksam));
  return String(Math.max(0, stelle));
}
