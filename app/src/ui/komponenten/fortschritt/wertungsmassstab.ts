/**
 * Maßstab der eigenen Wertung: „Lichess“ (wie berechnet) oder umgerechnet auf chess.com oder FIDE,
 * jeweils als Bereich und mit dem Namen der Liste.
 *
 * Rolle im Gesamtbild: Die Karten „Deine Wertung“ (Wertungskurve.tsx) und „Deine Spielstärke“
 * (LetzteSpielstaerke.tsx) zeigen jede Zahl zur eigenen Wertung wahlweise im Maßstab von Lichess
 * oder umgerechnet. Wunsch des Autors (27.10.2026): beide Listen für jede Zeitklasse, Bereich statt
 * „≈“. Die Rechnung steht in spiel/umrechnung.ts (Tabellen von chessgoals.com); hier nur Wahl,
 * Merker und die Form der Zahl. Außerhalb der Tabellen steht „–“ mit der Grenze. Die Wahl gilt je
 * Gerät (app/merker.ts); der frühere Wert „umgerechnet“ gilt als chess.com.
 * Abhängigkeiten: spiel/umrechnung.ts, app/merker.ts, i18n, React (useState).
 */
import { useState } from "react";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { t } from "../../../i18n/sprache";
import type { Wertungstempo } from "../../../spiel/elomodell";
import { umgerechnet, vergleichsbereich, type Zielliste } from "../../../spiel/umrechnung";

/** „lichess“: Zahlen wie berechnet; „chesscom“ und „fide“: umgerechnet als Bereich. */
export type Wertungsmassstab = "lichess" | Zielliste;
/** Die Maßstäbe in der Reihenfolge der Umschalter. */
export const WERTUNGSMASSSTAEBE: readonly Wertungsmassstab[] = ["lichess", "chesscom", "fide"];

/** Name des Merkers auf dem Gerät. */
const MERKER = "wertungsmassstab";
/** Steht für eine Zahl ohne Entsprechung. */
const OHNE_ZAHL = "–";

/** Der gemerkte Maßstab; ohne Merker (oder gesperrten Gerätespeicher) „lichess“. */
export function liesMassstab(): Wertungsmassstab {
  const gemerkt = liesMerker(MERKER);
  if (gemerkt === "chesscom" || gemerkt === "fide") return gemerkt;
  // Bis zum 27.10.2026 gab es nur „umgerechnet“ (chess.com für Blitz und Schnellschach).
  return gemerkt === "umgerechnet" ? "chesscom" : "lichess";
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
 * Name der Liste, mit der verglichen wird: „chess.com Blitz“, „chess.com Schnellschach“ (auch für
 * Klassisch, chess.com führt keine klassische Wertung) oder „FIDE“.
 */
export function zielname(tempo: Wertungstempo, liste: Zielliste): string {
  const ziel = liste === "fide" ? "fide" : tempo === "blitz" ? "chesscomBlitz" : "chesscomRapid";
  return t(`wertung.massstab.ziel.${ziel}`);
}

/** Eine Zahl im Maßstab: die Zahl („1424“, „1190–1490“, „–“) und, wenn umgerechnet, die Liste. */
export interface Massstabzahl {
  readonly zahl: string;
  readonly liste: string | null;
  /** true, wenn umgerechnet werden sollte, die Tabelle aber nicht reicht. */
  readonly ausserhalb: boolean;
}

/**
 * Eine eigene Wertung im gewählten Maßstab.
 * Beispiel: Schnellschach 1680 auf chess.com → { zahl: „1190–1490“, liste: „chess.com
 * Schnellschach“ }; Klassisch 1500 auf FIDE → { zahl: „–“, liste: „FIDE“, ausserhalb: true };
 * Lichess → „1680“.
 */
export function zahlImMassstab(
  tempo: Wertungstempo,
  wert: number,
  massstab: Wertungsmassstab,
): Massstabzahl {
  if (massstab === "lichess") return { zahl: String(wert), liste: null, ausserhalb: false };
  const u = umgerechnet(tempo, wert, massstab);
  return {
    zahl: u === null ? OHNE_ZAHL : t("wertung.massstab.bereich", { von: u.von, bis: u.bis }),
    liste: zielname(tempo, massstab),
    ausserhalb: u === null,
  };
}

/**
 * Eine Spanne im Maßstab als Texte für „{von}–{bis}“; null, wenn ein Ende außerhalb liegt.
 * Umgerechnet werden die Mitten beider Enden: Die Spanne sagt schon, wie unsicher die eigene Zahl
 * ist. Beispiel: Schnellschach 1600 bis 1760 auf chess.com → { von: „1240“, bis: „1440“ }.
 */
export function spanneImMassstab(
  tempo: Wertungstempo,
  von: number,
  bis: number,
  massstab: Wertungsmassstab,
): { von: string; bis: string } | null {
  if (massstab === "lichess") return { von: String(von), bis: String(bis) };
  const unten = umgerechnet(tempo, von, massstab);
  const oben = umgerechnet(tempo, bis, massstab);
  if (unten === null || oben === null) return null;
  return { von: String(unten.mitte), bis: String(oben.mitte) };
}

/**
 * Die Änderung zwischen zwei Wertungen im Maßstab (Mitten); null, wenn eine außerhalb liegt.
 * Beispiel: Blitz 1500 → 1560 auf chess.com → etwa +80.
 */
export function aenderungImMassstab(
  tempo: Wertungstempo,
  vorher: number,
  nachher: number,
  massstab: Wertungsmassstab,
): number | null {
  if (massstab === "lichess") return nachher - vorher;
  const a = umgerechnet(tempo, vorher, massstab);
  const b = umgerechnet(tempo, nachher, massstab);
  return a === null || b === null ? null : b.mitte - a.mitte;
}

/**
 * Kurzer Hinweis, warum keine umgerechnete Zahl steht.
 * Beispiel: Klassisch 1500 auf FIDE → „FIDE erst ab etwa 1730 (Lichess Klassisch)“; Blitz 2900
 * auf chess.com → „chess.com Blitz nur bis etwa 2745 (Lichess Blitz)“.
 */
export function ausserhalbText(tempo: Wertungstempo, wert: number, liste: Zielliste): string {
  const bereich = vergleichsbereich(tempo, liste);
  const werte = {
    liste: zielname(tempo, liste),
    zeitklasse: t(`spielstaerke.zeitklasse.${tempo}`),
  };
  if (!bereich) return t("wertung.massstab.ohneTabelle", werte);
  return wert < bereich.von
    ? t("wertung.massstab.unter", { ...werte, grenze: bereich.von })
    : t("wertung.massstab.ueber", { ...werte, grenze: bereich.bis });
}
