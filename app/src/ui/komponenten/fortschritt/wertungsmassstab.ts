/**
 * Maßstab der eigenen Wertung (Wunsch des Autors, 26.10.2026): „Lichess“, „chess.com“ oder „FIDE“,
 * für alle drei Zeitklassen und als Bereich („1080–1300“) statt einer Zahl (seit 0.3.2, FIDE als
 * eigene Stellung seit 0.3.3).
 *
 * Rolle im Gesamtbild: Die Karten „Deine Wertung“ (Wertungskurve.tsx) und „Deine Spielstärke“
 * (LetzteSpielstaerke.tsx) zeigen jede Zahl zur eigenen Wertung wahlweise im Maßstab von Lichess
 * oder umgerechnet. Die Rechnung steht in spiel/umrechnung.ts; hier nur Wahl, Merker und die Form
 * der Zahl. Außerhalb der Tabellen steht „–“ mit der Grenze. Die Wahl gilt je Gerät
 * (app/merker.ts); „umgerechnet“ heißt aus Rücksicht auf gespeicherte Merker weiter chess.com,
 * „fide“ kam in 0.3.3 dazu (ein älterer Stand liest „fide“ als Lichess, nichts geht verloren).
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
  type Zielliste,
} from "../../../spiel/umrechnung";

/** „lichess“: Zahlen wie berechnet; „umgerechnet“: Bereich auf chess.com; „fide“: Bereich auf FIDE. */
export type Wertungsmassstab = "lichess" | "umgerechnet" | "fide";
/** Die Maßstäbe in der Reihenfolge der Umschalter: Lichess, chess.com, FIDE. */
export const WERTUNGSMASSSTAEBE: readonly Wertungsmassstab[] = ["lichess", "umgerechnet", "fide"];

/** Name des Merkers auf dem Gerät. */
const MERKER = "wertungsmassstab";
/** Steht für eine Zahl ohne Entsprechung. */
const OHNE_ZAHL = "–";

/** Der gemerkte Maßstab; ohne Merker (oder gesperrten Gerätespeicher) „lichess“. */
export function liesMassstab(): Wertungsmassstab {
  const gemerkt = liesMerker(MERKER);
  return WERTUNGSMASSSTAEBE.find((m) => m === gemerkt) ?? "lichess";
}

/** Die Liste hinter einem umgerechneten Maßstab. */
function listeVon(massstab: Exclude<Wertungsmassstab, "lichess">): Zielliste {
  return massstab === "fide" ? "fide" : "chesscom";
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
 * Kurzer Name der Zielliste: „chess.com“ (Klassisch zählt dort als Schnellschach,
 * spiel/umrechnung.ts) oder „FIDE“.
 */
export function zielname(massstab: Exclude<Wertungsmassstab, "lichess">): string {
  return t(`wertung.massstab.liste.${listeVon(massstab)}`);
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
 * Spieler mit dieser Zahl auf der Liste steht (spiel/umrechnung.ts, bereichEtwa).
 * Beispiel: Schnellschach 1680 umgerechnet → { zahl: „1170–1510“, liste: „chess.com“ };
 * außerhalb der Tabelle → { zahl: „–“, ausserhalb: true }; Lichess → „1680“.
 */
export function zahlImMassstab(
  tempo: Wertungstempo,
  wert: number,
  massstab: Wertungsmassstab,
): Massstabzahl {
  if (massstab === "lichess") {
    return { zahl: String(wert), liste: null, ausserhalb: false, bereich: false };
  }
  const ziel = bereichEtwa(tempo, wert, listeVon(massstab));
  return {
    zahl: ziel === null ? OHNE_ZAHL : bereichstext(ziel),
    liste: zielname(massstab),
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
  const bereich = bereichDerSpanne(tempo, von, bis, listeVon(massstab));
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
  const a = entsprichtEtwa(tempo, vorher, listeVon(massstab));
  const b = entsprichtEtwa(tempo, nachher, listeVon(massstab));
  return a === null || b === null ? null : b - a;
}

/**
 * Kurzer Hinweis, warum keine umgerechnete Zahl steht.
 * Beispiel: Klassisch 1500 → „chess.com erst ab etwa 1505 (Lichess Klassisch)“; Blitz 2900 →
 * „chess.com nur bis etwa 2745 (Lichess Blitz)“.
 */
export function ausserhalbText(
  tempo: Wertungstempo,
  wert: number,
  massstab: Exclude<Wertungsmassstab, "lichess">,
): string {
  const bereich = vergleichsbereich(tempo, listeVon(massstab));
  const werte = { liste: zielname(massstab), zeitklasse: t(`spielstaerke.zeitklasse.${tempo}`) };
  if (!bereich) return t("wertung.massstab.ohneTabelle", werte);
  return wert < bereich.von
    ? t("wertung.massstab.unter", { ...werte, grenze: bereich.von })
    : t("wertung.massstab.ueber", { ...werte, grenze: bereich.bis });
}
