/**
 * Rechnung für „Zuletzt gespielt“ auf der Startseite von „Spielen“ (Entwurf J3): die letzten
 * beendeten Partien gegen einen Bot, den es noch gibt, und „heute“, „gestern“, „vor 3 Tagen“.
 * Reine Funktionen ohne Oberfläche.
 *
 * Rolle im Gesamtbild: Jede Zeile bietet „Revanche“ (Vorbelegung mit Bot und Zeitart der Partie,
 * vorbelegung.ts). Partien gegen die eigene Stufe, gegen einen Menschen, eingelesene Partien und
 * Partien gegen gelöschte eigene Bots fehlen, weil es dort keinen Bot für die Revanche gibt; sie
 * stehen weiter im Profil unter „Deine Partien“.
 * Abhängigkeiten: engine/gegner.ts, speicher/partien.ts (Typen), spiel/elomodell.ts.
 */
import { gegnerVon, type EigenerGegner } from "../../../engine/gegner";
import { wertungstempo, type Wertungstempo } from "../../../spiel/elomodell";
import type { Partie } from "../../../spiel/partie";
import type { Partieeintrag } from "../../../speicher/partien";

/** So viele Partien zeigt „Zuletzt gespielt“ höchstens. */
export const ZULETZT_HOECHSTENS = 3;
const TAG_MS = 86_400_000;

/** Eine Zeile: Partie, Bot und Zeitart für die Revanche. */
export interface Zuletztzeile {
  readonly partie: Partie;
  readonly bot: string;
  readonly tempo: Wertungstempo;
}

/**
 * Die letzten Partien mit Revanche, neueste zuerst (die Liste im Speicher ist schon so geordnet).
 * Beispiel: Sieg gegen Derya, Partie gegen eigene Stufe, Niederlage gegen Pia → Derya, Pia.
 */
export function zuletztGespielt(
  partien: readonly Partieeintrag[],
  eigene: readonly EigenerGegner[],
): Zuletztzeile[] {
  return partien
    .map((e) => e.partie)
    .filter(
      (p) => p.ende !== null && p.einstellung.gegner === "engine" && !p.einstellung.importiert,
    )
    .flatMap((p) => {
      const bot = p.einstellung.bot;
      const gibtEs =
        bot !== null && (gegnerVon(bot) !== null || eigene.some((g) => g.kennung === bot));
      return gibtEs && bot ? [{ partie: p, bot, tempo: wertungstempo(p.einstellung.uhr) }] : [];
    })
    .slice(0, ZULETZT_HOECHSTENS);
}

/**
 * Wie viele Kalendertage liegt ein Zeitpunkt zurück (Ortszeit)? 0 heute, 1 gestern.
 * Beispiel: begonnen am 30.10. um 23 Uhr, jetzt 31.10. um 8 Uhr → 1.
 */
export function tageZurueck(begonnen: string, jetzt: Date): number {
  const tag = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  return Math.max(0, Math.round((tag(jetzt) - tag(new Date(begonnen))) / TAG_MS));
}
