/**
 * Menschlichere Zugwahl der Stufen 1 bis 3 (Empfehlung R4, umgesetzt 0.2.52).
 *
 * Rolle im Gesamtbild: Bis 0.2.51 spielten die Stufen 1 bis 3 mit Stockfishs „Skill Level 0“ und
 * zufälligen Fehlerwürfen: fehlerfrei bei allem, was einen Zug tief sichtbar ist (jeder Schlag,
 * jedes Matt in einem), und dazwischen grundlos verschenkend („dämlich, dann genial“, Rückmeldung
 * des Autors). Ein Mensch um 1000 Elo ist umgekehrt: gleichmäßig blind ab zwei Zügen Tiefe und
 * selten grundlos verschenkend. Deshalb rechnet die Engine für diese Stufen nur bis zu einer
 * Tiefengrenze (engine/engineDienst.ts, Stärke „tiefe“: Taktik jenseits des Horizonts sieht sie
 * gar nicht) und wählt unter ihren Kandidaten gewichtet zufällig mit einer „Temperatur“: Jeder
 * Kandidat bekommt das Gewicht e^(−Verlust/Temperatur). Kleine Fehler sind so häufig, große
 * selten, und in erzwungenen Lagen (ein Zug weit vor den anderen) bleibt der beste Zug sehr
 * wahrscheinlich. Die Temperatur steigt mit der Lage (viele Züge zur Wahl), sinkt im Schach,
 * steigt nach eigenen Fehlern für drei Züge (Strähne) und schwankt je Partie (Tagesform).
 * Die Fehlerprofile (engine/fehlersuche.ts) bleiben daneben: Sie liefern die erklärbaren Fehler.
 * Abhängigkeiten: engine/fehlerart.ts (Damenopfer), engine/spielbewerter.ts, engine/uci.ts.
 */
import { istDamenopfer, lageVon } from "./fehlerart";
import { wertFuer } from "./spielbewerter";
import type { Variante } from "./uci";

/** Einstellung einer Stufe: Temperatur in Bauerneinheiten und Zahl der Kandidaten der Engine. */
export interface Menschlich {
  readonly temperatur: number;
  readonly kandidaten: number;
}

/** Was der Verlauf der Partie zur Fehlerneigung beiträgt. */
export interface Verlauf {
  /** Eigene Züge mit Verlust unter den letzten drei (0 bis 3): Strähne. */
  readonly fehlerAnlauf: number;
  /** Tagesform je Partie, Faktor um 1 (0,75 bis 1,25). */
  readonly tagesform: number;
}

export const RUHIGER_VERLAUF: Verlauf = { fehlerAnlauf: 0, tagesform: 1 };

/** Im Schach sieht auch ein Anfänger die wenigen Antworten: halbe Temperatur. */
const IM_SCHACH = 0.5;
/** Ab so vielen legalen Zügen ist die Lage unübersichtlich: Temperatur um ein Drittel höher. */
const VIELE_ZUEGE_AB = 30;
const VIELE_ZUEGE = 1.3;
/** Je eigenem Fehler unter den letzten drei Zügen ein Viertel mehr (Strähne). */
const ANLAUF_JE_FEHLER = 0.25;
/** Die Tagesform liegt zwischen 1 − Spanne und 1 + Spanne. */
const TAGESFORM_SPANNE = 0.25;
/** Streuung der Saat in der Tagesform (einfacher Zeichenmischer). */
const SAAT_FAKTOR = 31;
const SAAT_MODUL = 1_000_003;
/** Unter dieser Temperatur zieht die Engine praktisch immer den besten Zug. */
const KALT = 0.01;

/**
 * Tagesform aus einer Saat (der Kennung der Partie): fest je Partie, zwischen 0,75 und 1,25.
 * Beispiel: zwei Partien mit verschiedenen Kennungen bekommen verschiedene, aber je Partie
 * gleichbleibende Tagesformen.
 */
export function tagesform(saat: string): number {
  let stand = 0;
  for (const zeichen of saat) stand = (stand * SAAT_FAKTOR + zeichen.charCodeAt(0)) % SAAT_MODUL;
  const anteil = stand / SAAT_MODUL;
  return 1 - TAGESFORM_SPANNE + 2 * TAGESFORM_SPANNE * anteil;
}

/**
 * Die Temperatur für eine Stellung: Grundtemperatur der Stufe, nach Lage (Schach, viele Züge),
 * Strähne und Tagesform. Eingaben: Stellung, Grundtemperatur, Verlauf. Ausgabe: Temperatur in
 * Bauerneinheiten, nie unter KALT.
 * Beispiel: Grund 0,7, im Schach → 0,35; nach zwei eigenen Fehlern und Tagesform 1,2 → 1,26.
 */
export function temperaturFuer(fen: string, grund: number, verlauf: Verlauf): number {
  const lage = lageVon(fen);
  let temperatur = grund * verlauf.tagesform * (1 + ANLAUF_JE_FEHLER * verlauf.fehlerAnlauf);
  if (lage?.regeln.isCheck()) temperatur *= IM_SCHACH;
  else if (lage && zahlLegaleZuege(lage) >= VIELE_ZUEGE_AB) temperatur *= VIELE_ZUEGE;
  return Math.max(KALT, temperatur);
}

function zahlLegaleZuege(lage: NonNullable<ReturnType<typeof lageVon>>): number {
  let zahl = 0;
  for (const [, ziele] of lage.regeln.allDests()) zahl += ziele.size();
  return zahl;
}

/** Ein Kandidat mit seinem Verlust gegenüber dem besten Zug (aus Sicht der Seite am Zug). */
export interface Kandidat {
  readonly uci: string;
  readonly verlust: number;
}

/** Kandidaten aus den Varianten der Engine; ohne Züge über dem Höchstverlust und ohne verbotene
 * Damenopfer, der beste bleibt immer. */
export function kandidatenAus(
  fen: string,
  varianten: readonly Variante[],
  hoechstverlust: number,
  damenopferErlaubt: boolean,
): Kandidat[] {
  const weissAmZug = fen.split(" ")[1] !== "b";
  const beste = varianten[0];
  if (!beste) return [];
  const bestwert = wertFuer(beste.wert, weissAmZug);
  const lage = damenopferErlaubt ? null : lageVon(fen);
  return varianten.flatMap((v, i) => {
    const uci = v.zuege[0];
    if (!uci) return [];
    const verlust = Math.max(0, bestwert - wertFuer(v.wert, weissAmZug));
    if (i > 0 && verlust > hoechstverlust) return [];
    if (i > 0 && lage && istDamenopfer(lage, uci)) return [];
    return [{ uci, verlust }];
  });
}

/**
 * Wählt unter den Kandidaten gewichtet zufällig: Gewicht e^(−Verlust/Temperatur).
 *
 * Eingaben: Kandidaten (bester zuerst), Temperatur, Zufall (0 bis 1; für Tests fest). Ausgabe: der
 * gewählte Kandidat oder null ohne Kandidaten.
 * Beispiel: Verluste 0, 0,5, 3 bei Temperatur 1: Gewichte 1, 0,61, 0,05 → der beste zu 60 %, der
 * zweite zu 37 %, der dritte zu 3 %. Bei Temperatur 0,45: 1, 0,33, 0,001 → 75 %, 25 %, 0 %.
 * Sonderfall: Zufall 0 ergibt immer den besten Zug.
 */
export function gewichteteZugwahl(
  kandidaten: readonly Kandidat[],
  temperatur: number,
  zufall: () => number,
): Kandidat | null {
  if (kandidaten.length === 0) return null;
  const gewichte = kandidaten.map((k) => Math.exp(-k.verlust / Math.max(KALT, temperatur)));
  const summe = gewichte.reduce((a, b) => a + b, 0);
  let rest = zufall() * summe;
  for (const [i, gewicht] of gewichte.entries()) {
    rest -= gewicht;
    if (rest < 0) return kandidaten[i] ?? null;
  }
  return kandidaten[kandidaten.length - 1] ?? null;
}
