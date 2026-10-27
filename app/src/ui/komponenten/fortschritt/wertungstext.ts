/**
 * Texte zur eigenen Wertung: Name der Zeitklasse und die Bereiche auf chess.com und beim
 * Weltschachbund (FIDE), für alle Zeitklassen.
 *
 * Rolle im Gesamtbild: Gemeinsame Sätze für die Karte „Spielstärke“ in der Auswertung und die Karte
 * „Deine Spielstärke“ unter Spielen; die Rechnung steht in spiel/umrechnung.ts.
 * Abhängigkeiten: spiel/elomodell.ts, spiel/umrechnung.ts, i18n.
 */
import { t } from "../../../i18n/sprache";
import type { Wertungsschaetzung, Wertungstempo } from "../../../spiel/elomodell";
import { bereichEtwa, CHESSCOM_ZEITKLASSE, vergleichsbereich } from "../../../spiel/umrechnung";

/** „Blitz“, „Schnellschach“, „Klassisch“. */
export function zeitklassenname(tempo: Wertungstempo): string {
  return t(`spielstaerke.zeitklasse.${tempo}`);
}

/**
 * Der Satz zur Entsprechung als Bereich (spiel/umrechnung.ts, bereichEtwa); bei Klassisch der
 * Hinweis, dass chess.com dafür Schnellschach wertet; dazu FIDE (unter der Grenze die Begründung).
 * Beispiel: Schnellschach 1680 → „Deine Zahl gilt für Schnellschach und richtet sich nach Lichess;
 * Spieler mit dieser Zahl stehen auf chess.com Schnellschach etwa bei 1170 bis 1510.“; Klassisch
 * 2120 → „… auf chess.com Schnellschach etwa bei 1820 bis 2170 (chess.com wertet alle Partien ab
 * zehn Minuten als Schnellschach). Beim Weltschachbund (FIDE) etwa 1830 bis 2100.“
 * Sonderfall: außerhalb der Tabelle „… für chess.com Blitz gibt es dazu keinen Vergleichswert.“
 */
export function entsprichtText(s: Wertungsschaetzung): string {
  const zeitklasse = zeitklassenname(s.tempo);
  const liste = t("spielstaerke.liste.chesscom", {
    zeitklasse: zeitklassenname(CHESSCOM_ZEITKLASSE[s.tempo]),
  });
  const ziel = bereichEtwa(s.tempo, s.mitte);
  if (ziel === null) return t("spielstaerke.entsprichtOhne", { zeitklasse, liste });
  const satz = t("spielstaerke.entspricht", { zeitklasse, liste, von: ziel.von, bis: ziel.bis });
  return [
    satz,
    ...(s.tempo === "classical" ? [t("spielstaerke.entsprichtKlassisch")] : []),
    ...fideSatz(s),
  ].join(" ");
}

/**
 * Der Satz zu FIDE: der Bereich, unter der Grenze der Messung die Begründung, sonst nichts.
 * Warum die Begründung: Unter etwa 1800 Lichess stehen fast alle FIDE-Spieler am Boden der
 * FIDE-Wertung (pipeline/wertungsvergleich/auswerten.py, MINDESTSTEIGUNG); ein Bereich wäre dort
 * Scheingenauigkeit (Wunsch des Autors, 27.10.2026).
 * Beispiel: Blitz 1500 → „Für FIDE sagt eine Lichess-Zahl unter etwa 1750 wenig: …“.
 */
function fideSatz(s: Wertungsschaetzung): string[] {
  const fide = bereichEtwa(s.tempo, s.mitte, "fide");
  if (fide) return [t("spielstaerke.entsprichtFide", { von: fide.von, bis: fide.bis })];
  const grenze = vergleichsbereich(s.tempo, "fide");
  return grenze && s.mitte < grenze.von
    ? [t("spielstaerke.entsprichtFideUnter", { grenze: grenze.von })]
    : [];
}
