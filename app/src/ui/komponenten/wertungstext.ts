/**
 * Texte zur eigenen Wertung (0.2.124): Name der Zeitklasse und „entspricht etwa“ auf chess.com oder
 * beim Weltschachbund.
 *
 * Rolle im Gesamtbild: Gemeinsame Sätze für die Karte „Spielstärke“ in der Auswertung und die Karte
 * „Deine Spielstärke“ unter Spielen; die Rechnung steht in spiel/umrechnung.ts.
 * Abhängigkeiten: spiel/elomodell.ts, spiel/umrechnung.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import type { Wertungsschaetzung, Wertungstempo } from "../../spiel/elomodell";
import { entsprichtEtwa, ZIELLISTE } from "../../spiel/umrechnung";

/** „Blitz“, „Schnellschach“, „Klassisch“. */
export function zeitklassenname(tempo: Wertungstempo): string {
  return t(`spielstaerke.zeitklasse.${tempo}`);
}

/**
 * Der Satz zur Entsprechung. Beispiel: Schnellschach 1700 → „Deine Zahl gilt für Schnellschach und
 * ist am Maßstab von Lichess geeicht; sie entspricht etwa chess.com Schnellschach 1360.“; Klassisch
 * 1500 → „… für FIDE liegt sie außerhalb der veröffentlichten Vergleichstabellen.“
 */
export function entsprichtText(s: Wertungsschaetzung): string {
  const zeitklasse = zeitklassenname(s.tempo);
  const liste = t(`spielstaerke.liste.${ZIELLISTE[s.tempo]}`, { zeitklasse });
  const ziel = entsprichtEtwa(s.tempo, s.mitte);
  return ziel === null
    ? t("spielstaerke.entsprichtOhne", { zeitklasse, liste })
    : t("spielstaerke.entspricht", { zeitklasse, liste, ziel });
}
