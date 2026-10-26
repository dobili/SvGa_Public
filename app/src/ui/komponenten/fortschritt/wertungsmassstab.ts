/**
 * Maßstab der eigenen Wertung (Wunsch des Autors, 26.10.2026): „Lichess“ oder umgerechnet auf
 * chess.com, seit 0.3.2 für alle drei Zeitklassen und als Bereich („1080–1300“) statt einer Zahl.
 *
 * Rolle im Gesamtbild: Die Karten „Deine Wertung“ (Wertungskurve.tsx) und „Deine Spielstärke“
 * (LetzteSpielstaerke.tsx) zeigen jede Zahl zur eigenen Wertung wahlweise im Maßstab von Lichess
 * oder umgerechnet. Die Rechnung steht in spiel/umrechnung.ts (Tabellen von chessgoals.com); hier
 * nur Wahl, Merker und die Form der Zahl. Außerhalb der Tabellen steht „–“ mit der Grenze
 * (chess.com für Klassisch erst ab etwa 1505 Lichess Klassisch). Die Wahl gilt je Gerät
 * (app/merker.ts); der gespeicherte Wert „umgerechnet“ bleibt derselbe wie vor 0.3.2.
 * Abhängigkeiten: spiel/umrechnung.ts, app/merker.ts, i18n, React (useState).
 */
import { useState } from "react";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { t } from "../../../i18n/sprache";
import type { Wertungstempo } from "../../../spiel/elomodell";
import {
  bereichDerSpanne,
  bereichEtwa,
  entsprichtEtwa,
  vergleichsbereich,
  type Wertungsbereich,
} from "../../../spiel/umrechnung";

/** „lichess“: Zahlen wie berechnet; „umgerechnet“: Bereich auf chess.com je Zeitklasse. */
export type Wertungsmassstab = "lichess" | "umgerechnet";
/** Die beiden Maßstäbe in der Reihenfolge der Umschalter: zuerst Lichess, dann umgerechnet. */
export const WERTUNGSMASSSTAEBE: readonly Wertungsmassstab[] = ["lichess", "umgerechnet"];

/** Name des Merkers auf dem Gerät. */
const MERKER = "wertungsmassstab";
/** Steht für eine Zahl ohne Entsprechung. */
const OHNE_ZAHL = "–";

/** Der gemerkte Maßstab; ohne Merker (oder gesperrten Gerätespeicher) „lichess“. */
export function liesMassstab(): Wertungsmassstab {
  return liesMerker(MERKER) === "umgerechnet" ? "umgerechnet" : "lichess";
}

/**
 * Der Maßstab als Zustand einer Karte, gemerkt je Gerät.
 * Beispiel: const [massstab, setzeMassstab] = useWertungsmassstab().
 */
export function useWertungsmassstab(): readonly [
  Wertungsmassstab,
  (massstab: Wertungsmassstab) => void,
] {
  const [massstab, setze] = useState<Wertungsmassstab>(liesMassstab);
  const waehle = (neu: Wertungsmassstab) => {
    setze(neu);
    schreibeMerker(MERKER, neu);
  };
  return [massstab, waehle];
}

/**
 * Kurzer Name der Zielliste: „chess.com“ für alle Zeitklassen (Klassisch zählt dort als
 * Schnellschach, spiel/umrechnung.ts).
 */
export function zielname(): string {
  return t("wertung.massstab.liste.chesscom");
}

/** Ein Bereich als kurzer Text „1080–1300“. */
function bereichstext(bereich: Wertungsbereich): string {
  return t("wertung.massstab.bereich", { von: bereich.von, bis: bereich.bis });
}

/** Eine Zahl im Maßstab: die Zahl („1424“, „1080–1300“, „–“) und, wenn umgerechnet, die Liste. */
export interface Massstabzahl {
  readonly zahl: string;
  readonly liste: string | null;
  /** true, wenn umgerechnet werden sollte, die Tabelle aber nicht reicht. */
  readonly ausserhalb: boolean;
  /** true, wenn die Zahl ein Bereich ist (die Oberfläche setzt sie dann etwas kleiner). */
  readonly bereich: boolean;
}

/**
 * Eine eigene Wertung im gewählten Maßstab; umgerechnet der Bereich, in dem etwa die Hälfte der
 * Spieler mit dieser Zahl auf chess.com steht (spiel/umrechnung.ts, bereichEtwa).
 * Beispiel: Schnellschach 1680 umgerechnet → { zahl: „1170–1510“, liste: „chess.com“ };
 * Klassisch 1500 umgerechnet → { zahl: „–“, liste: „chess.com“, ausserhalb: true };
 * Lichess → „1680“.
 */
export function zahlImMassstab(
  tempo: Wertungstempo,
  wert: number,
  massstab: Wertungsmassstab,
): Massstabzahl {
  if (massstab === "lichess") {
    return { zahl: String(wert), liste: null, ausserhalb: false, bereich: false };
  }
  const ziel = bereichEtwa(tempo, wert);
  return {
    zahl: ziel === null ? OHNE_ZAHL : bereichstext(ziel),
    liste: zielname(),
    ausserhalb: ziel === null,
    bereich: ziel !== null,
  };
}

/**
 * Eine Spanne im Maßstab als Texte für „{von}–{bis}“; null, wenn ein Ende außerhalb liegt.
 * Umgerechnet die äußere Hülle aus Spanne und Bereich (spiel/umrechnung.ts, bereichDerSpanne).
 * Beispiel: Schnellschach 1600 bis 1760 umgerechnet → { von: „1070“, bis: „1620“ }.
 */
export function spanneImMassstab(
  tempo: Wertungstempo,
  von: number,
  bis: number,
  massstab: Wertungsmassstab,
): { von: string; bis: string } | null {
  if (massstab === "lichess") return { von: String(von), bis: String(bis) };
  const bereich = bereichDerSpanne(tempo, von, bis);
  return bereich ? { von: String(bereich.von), bis: String(bereich.bis) } : null;
}

/**
 * Die Änderung zwischen zwei Wertungen im Maßstab; null, wenn eine davon außerhalb liegt.
 * Umgerechnet zwischen den Mitten der Bereiche: Die Breite der Bereiche hebt sich bei einer
 * Änderung auf, ein Bereich wäre hier irreführend breit.
 * Beispiel: Blitz 1500 → 1560 umgerechnet → etwa +80 auf chess.com.
 */
export function aenderungImMassstab(
  tempo: Wertungstempo,
  vorher: number,
  nachher: number,
  massstab: Wertungsmassstab,
): number | null {
  if (massstab === "lichess") return nachher - vorher;
  const a = entsprichtEtwa(tempo, vorher);
  const b = entsprichtEtwa(tempo, nachher);
  return a === null || b === null ? null : b - a;
}

/**
 * Kurzer Hinweis, warum keine umgerechnete Zahl steht.
 * Beispiel: Klassisch 1500 → „chess.com erst ab etwa 1505 (Lichess Klassisch)“; Blitz 2900 →
 * „chess.com nur bis etwa 2745 (Lichess Blitz)“.
 */
export function ausserhalbText(tempo: Wertungstempo, wert: number): string {
  const bereich = vergleichsbereich(tempo);
  const werte = { liste: zielname(), zeitklasse: t(`spielstaerke.zeitklasse.${tempo}`) };
  if (!bereich) return t("wertung.massstab.ohneTabelle", werte);
  return wert < bereich.von
    ? t("wertung.massstab.unter", { ...werte, grenze: bereich.von })
    : t("wertung.massstab.ueber", { ...werte, grenze: bereich.bis });
}
