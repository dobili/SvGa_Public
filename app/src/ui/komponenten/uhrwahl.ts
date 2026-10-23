/**
 * Hilfen zur Wahl der Bedenkzeit unter Spielen: Namen der Vorgaben, gewählte Stelle, Uhr beim Start.
 *
 * Rolle im Gesamtbild: Aus Spielen.tsx ausgelagert (Dateien unter 400 Zeilen). Seit R51 (Wunsch
 * des Autors, 23.10.2026) haben gewertete Partien immer eine Uhr; ohne gewählte Uhr beginnen sie
 * mit 10 + 0 (Schnellschach wie der Partietag des 30-Minuten-Plans).
 * Abhängigkeiten: spiel/uhr.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import { UHR_PARTIETAG, UHR_VORGABEN, type Uhreinstellung } from "../../spiel/uhr";

const MINUTE_MS = 60_000;
const SEKUNDE_MS = 1000;

/** Name einer Uhrvorgabe: „Ohne Uhr“ oder „15 + 10“. */
export function uhrname(stelle: number): string {
  const vorgabe = UHR_VORGABEN[stelle];
  if (!vorgabe) return t("spielen.uhr.ohne");
  return t("spielen.uhr.zeit", {
    minuten: vorgabe.grundzeitMs / MINUTE_MS,
    sekunden: vorgabe.zuschlagMs / SEKUNDE_MS,
  });
}

/** Stelle der Vorgabe, die zur Uhr passt; 0 („Ohne Uhr“), wenn keine passt. */
export function uhrstelle(uhr: Uhreinstellung | null): number {
  const stelle = UHR_VORGABEN.findIndex(
    (v) => v?.grundzeitMs === uhr?.grundzeitMs && v?.zuschlagMs === uhr?.zuschlagMs,
  );
  return Math.max(0, stelle);
}

/**
 * Die Uhr, mit der die Partie beginnt.
 * Beispiel: gewertet ohne gewählte Uhr → 10 + 0; ungewertet ohne Uhr → ohne Uhr.
 */
export function uhrFuerStart(gewertet: boolean, uhr: Uhreinstellung | null): Uhreinstellung | null {
  return gewertet && !uhr ? UHR_PARTIETAG : uhr;
}
