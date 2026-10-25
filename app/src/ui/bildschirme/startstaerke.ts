/**
 * Spielstärke des gewählten Gegners für die Startleiste (seit 0.2.138, Wunsch des Autors vom
 * 25.10.2026): Wer zur Bedenkzeit scrollt, sieht die Zahl des Gegners sonst nicht mehr; in der
 * Leiste ändert sie sich sofort mit der Zeitart.
 *
 * Rolle im Gesamtbild: Dieselbe Zahl, mit der eine gewertete Partie rechnet (engine/botstaerke.ts,
 * gegnerstaerke): gemessene Bots und Gruppen in der Zeitklasse der Uhr, eigene Stufen und eigene
 * Bots geschätzt, jeweils mit dem Abzug der Uhr. Gegen einen Menschen gibt es keine Zahl.
 * Abhängigkeiten: engine/botstaerke.ts, gegnerprofil.ts, uhrwahl.ts.
 */
import { gegnerstaerke } from "../../engine/botstaerke";
import type { EigenerGegner } from "../../engine/gegner";
import type { Spielvorlieben } from "../../speicher/partien";
import { wirksameUhr } from "../komponenten/uhrwahl";
import { gegnerprofil } from "./gegnerprofil";

/**
 * Die Zahl des Gegners zur gewählten Uhr; null gegen einen Menschen.
 * Beispiel: Bot „tom“ mit 3 + 2 → seine Blitz-Zahl.
 */
export function startstaerke(
  v: Spielvorlieben,
  fen: string,
  eigene: readonly EigenerGegner[],
): number | null {
  if (v.gegner !== "engine") return null;
  const profil = gegnerprofil(v.bot, eigene, v);
  return gegnerstaerke({
    ...profil,
    bot: v.bot,
    stufenJePhase: v.stufenJePhase,
    uhr: wirksameUhr(fen, v.uhr),
  });
}
