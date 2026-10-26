/**
 * Zugart je Stellung: taktisch oder ruhig (Strategie). Grundlage der Trennung des Mittelspiels
 * in Taktik und Strategie bei der Spielstärke je Phase.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): die Spielstärke im Mittelspiel wie bei
 * chess.com nach Taktik und Strategie getrennt zeigen, damit der Leser sieht, ob ihn Rechnen oder
 * Planen mehr kostet. Die Regel ist die des Sicherheitsblicks (Kapitel 12) und der erzwingenden
 * Züge (Kapitel 7): Eine Stellung ist taktisch, wenn die Seite am Zug im Schach steht, wenn der
 * Gegner etwas droht (Materialgewinn oder Matt in einem Zug), wenn sie selbst einen Schlag mit
 * Gewinn hat oder Matt setzen kann. Alles andere ist eine ruhige Stellung, in der die Richtung
 * (Kapitel 5) zählt: Strategie. chess.com veröffentlicht seine Regel nicht; unsere ist am Buch
 * festgemacht und in der Auswertung nachprüfbar.
 * Abhängigkeiten: analyse/stellungsprofil.ts, schach/stellung.ts, spiel/partie.ts.
 */
import { profil } from "../analyse/stellungsprofil";
import { gegner, stellungAusFen } from "../schach/stellung";
import { stellungen, type Partie } from "./partie";

export type Zugart = "taktik" | "strategie";
/** Die beiden Zugarten, nach denen die Spielstärke im Mittelspiel getrennt wird. */
export const ZUGARTEN: readonly Zugart[] = ["taktik", "strategie"];

/**
 * Die Zugart einer Stellung (für den Zug, der aus ihr heraus gespielt wird); null bei unlesbarer
 * Stellung oder ohne Regeln (Lehrbilder ohne König).
 *
 * Regel: Kapitel 12, Sicherheitsblick („Was droht? Was kann ich schlagen?“), Kapitel 7,
 * erzwingende Züge.
 * Beispiel: Grundstellung → Strategie; nach 1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6 droht Dxf7# → Taktik
 * (Weiß kann Matt setzen); nach 1. e4 d5 → Taktik (Weiß kann mit Gewinn schlagen, exd5).
 * Sonderfall: Steht die Seite am Zug im Schach, ist die Stellung taktisch, auch ohne Drohung.
 */
export function zugartVon(fen: string): Zugart | null {
  const stellung = stellungAusFen(fen);
  if (!stellung.ok) return null;
  const regeln = stellung.wert.regeln;
  if (!regeln) return null;
  if (regeln.isCheck()) return "taktik";
  const p = profil(stellung.wert);
  const drohungen = p.drohungen(gegner(regeln.turn));
  if (drohungen && drohungen.length > 0) return "taktik";
  const eigene = p.erzwingend();
  if (!eigene) return "strategie";
  const gewinn = eigene.schlaege.some((s) => s.bilanz > 0);
  const matt = eigene.schachs.some((s) => s.matt);
  return gewinn || matt ? "taktik" : "strategie";
}

/**
 * Die Zugart je Stellung der Partie (Startstellung bis Ende), gleich lang wie die Werte.
 * Beispiel: 1. e4 e5 2. Dh5: Strategie, Strategie, Strategie, Taktik (Dh5 droht Dxe5+, Schwarz
 * muss decken).
 */
export function zugartJeStellung(partie: Partie): (Zugart | null)[] {
  return stellungen(partie).map(zugartVon);
}
