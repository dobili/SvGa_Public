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
import { gruppenstaerkeSichtbar, gruppenstufe } from "../../engine/gruppe";
import { aktiverAnzeigesatz } from "../../engine/zahlensatz";
import type { EigenerGegner } from "../../engine/gegner";
import type { Besiegte } from "../../speicher/besiegt";
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
    // Vor der Partie gilt der Zahlensatz der Anzeige (mit Maia, wenn es jetzt mitspielt).
    maia: aktiverAnzeigesatz() === "mit",
  });
}

/**
 * Die Angabe der Startleiste: wie startstaerke, für eine Gruppe vor dem ersten Sieg aber
 * „unbekannt“ wie in Sprechblase und Knopf (Gruppenmodus, Befund N795 vom 26.10.2026).
 * Beispiel: Gruppe der Stufe 1, noch nie besiegt → "unbekannt"; nach einem Sieg ihre Zahl.
 */
export function startangabe(
  v: Spielvorlieben,
  fen: string,
  eigene: readonly EigenerGegner[],
  besiegt: Besiegte,
): number | "unbekannt" | null {
  const gruppe = v.gegner === "engine" ? gruppenstufe(v.bot) : null;
  if (gruppe !== null && !gruppenstaerkeSichtbar(besiegt, gruppe)) return "unbekannt";
  return startstaerke(v, fen, eigene);
}
