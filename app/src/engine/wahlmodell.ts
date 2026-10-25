/**
 * Wahlmodell der Bots (0.2.125): Unter den Kandidaten eines Zuges wählt der Bot so, wie Menschen
 * seiner Wertung wählen (bedingtes Logit, geeicht an 180 000 Stellungen von Lichess).
 *
 * Rolle im Gesamtbild: Plan „Zugwahl der Bots“ (Freigabe des Autors, 23.10.2026) und Teil E des
 * Plans „Bots, zweite Runde“. Der Nutzen eines Kandidaten ist die Summe gewichteter Merkmale:
 * Verlustkurve (Stützstellen 0,5; 1,2; 3; 10 Bauern, stückweise linear, in Eröffnung und
 * Endspiel mit eigenen Gewichten), Bonus „bester Zug“, Fehlerart, eigene blinde Flecken des Zuges,
 * blinde Flecken der Widerlegung, Stilmerkmale. Jedes Gewicht hängt von der Wertung ab
 * (g0 + g1·E + g2·E², E = (Elo − 1500)/1000, engine/wahlmodell-daten.ts). Die Wahrscheinlichkeit
 * eines Kandidaten ist exp(Nutzen / Temperatur) geteilt durch die Summe; Temperatur 1 ist die
 * Eichung, Tagesform und Zeitnot verschieben sie. Die Persönlichkeit eines Bots verschiebt
 * einzelne Gewichte (Fehlerart, Fleck, Stil) additiv; ausgeschlossene Arten bekommen −∞.
 * Warum so: Dieselbe Kandidatenerzeugung wie in der Eichung (sechs Engine-Züge, typische
 * Fehlerzüge je Art) macht die Fehlerraten des Bots je Band, Phase und Art von selbst menschlich
 * (geprüft an zurückgelegten Stellungen auf etwa einen Prozentpunkt), ohne Nachregeln.
 * Seit 0.2.143 mit Maia (Variante C): Ist eine Maia-Karte da (engine/maia.ts, ab Halbzug 10), kommt
 * ln p_Maia des Kandidaten als weiteres Merkmal dazu, mit eigenen, gemeinsam geeichten Gewichten
 * (engine/wahlmodell-maia-daten.ts); ohne Karte gelten die Gewichte ohne Maia.
 * Abhängigkeiten: engine/wahlmodell-daten.ts, engine/wahlmodell-maia-daten.ts, engine/fehlerart.ts, engine/blindeFlecken.ts,
 * engine/stilmerkmale.ts, schach/phase.ts, chessops.
 */
import { normalizeMove } from "chessops/chess";
import { parseUci } from "chessops/util";
import type { Phase } from "../schach/phase";
import { BLINDE_FLECKEN, fenNachUci, fleckeVon, type BlinderFleck } from "./blindeFlecken";
import { FEHLERARTEN, type Fehlerart, type Lage } from "./fehlerart";
import { STILMERKMALE, stilmerkmale } from "./stilmerkmale";
import { WAHL_GEWICHTE, WAHL_MERKMALE, type Wahltempo } from "./wahlmodell-daten";
import { WAHL_GEWICHTE_MAIA } from "./wahlmodell-maia-daten";

export type { Wahltempo } from "./wahlmodell-daten";

/** Ein Kandidat, wie die Fehlerschicht ihn liefert: Zug, Verlust, Antwort der Engine, Fehlerart. */
export interface Wahlkandidat {
  readonly uci: string;
  readonly verlust: number;
  readonly antwort: readonly string[];
  readonly art: Fehlerart | null;
}

/** Verschiebungen der Gewichte durch die Persönlichkeit (additiv im Nutzen, −∞ schließt aus). */
export interface Wahlverschiebung {
  readonly arten: Readonly<Partial<Record<Fehlerart, number>>>;
  readonly flecken: Readonly<Partial<Record<BlinderFleck, number>>>;
  readonly stil: Readonly<Partial<Record<(typeof STILMERKMALE)[number], number>>>;
}

export const OHNE_VERSCHIEBUNG: Wahlverschiebung = { arten: {}, flecken: {}, stil: {} };

/** Stützstellen der Verlustkurve in Bauern (wie in der Eichung). */
const KNOTEN = [0, 0.5, 1.2, 3, 10] as const;
/** Bezugswertung und Maßstab der Elo-Abhängigkeit. */
const ELO_MITTE = 1500;
const ELO_MASSSTAB = 1000;
/** Fehlerart zählt erst ab einem halben Bauern Verlust (Grenze der Auswertung). */
const FEHLER_AB = 0.5;
/** Außerhalb des Eichbereichs (400 bis 2600) werden die Gewichte nicht weiter fortgeschrieben. */
const ELO_MIN = 400;
const ELO_MAX = 2600;
const ANZAHL_MERKMALE = WAHL_MERKMALE.length;
/** Untergrenze der Maia-Wahrscheinlichkeit vor dem Logarithmus (wie in der Eichung). */
const MAIA_MINDESTENS = 1e-6;

/** Index je Merkmalname, einmal aufgebaut. */
const INDEX = new Map<string, number>(WAHL_MERKMALE.map((name, i) => [name, i]));

function index(name: string): number {
  const i = INDEX.get(name);
  if (i === undefined) throw new Error(`Wahlmodell: unbekanntes Merkmal ${name}`);
  return i;
}

/** Hutfunktionen der Verlustkurve: Anteile an den Stützstellen 0,5 bis 10 (0 ist der Bezug). */
function verlustkurve(verlust: number): number[] {
  const letzte = KNOTEN[KNOTEN.length - 1] as number;
  const v = Math.max(0, Math.min(letzte, verlust));
  const aus: number[] = [];
  for (let i = 1; i < KNOTEN.length; i += 1) {
    const k = KNOTEN[i] as number;
    const links = KNOTEN[i - 1] as number;
    const rechts = KNOTEN[i + 1] as number | undefined;
    let h = 0;
    if (v >= links && v <= k) h = (v - links) / (k - links);
    else if (rechts !== undefined && v > k && v <= rechts) h = (rechts - v) / (rechts - k);
    if (rechts === undefined && v >= k) h = 1;
    aus.push(h);
  }
  return aus;
}

/**
 * Der Merkmalsvektor eines Kandidaten (Reihenfolge WAHL_MERKMALE).
 * Beispiel: 2... Sf6?? nach 2. Dh5 (Verlust 3, Art „drohungIgnoriert“, Widerlegung Dxe5+):
 * verlust_3.0 = 1, art_drohungIgnoriert = 1, fw_dame? nein (Dxe5 ist kurz), stil_vorwaerts = 1.
 */
export function merkmale(
  lage: Lage,
  fen: string,
  k: Wahlkandidat,
  bester: string | null,
  phase: Phase,
): Float64Array {
  const m = new Float64Array(ANZAHL_MERKMALE);
  const kurve = verlustkurve(k.verlust);
  KNOTEN.slice(1).forEach((knoten, i) => {
    m[index(`verlust_${knoten.toFixed(1)}`)] = kurve[i] ?? 0;
    if (phase !== "mittelspiel") m[index(`${phase}_verlust_${knoten.toFixed(1)}`)] = kurve[i] ?? 0;
  });
  const istBester = k.uci === bester ? 1 : 0;
  m[index("bester")] = istBester;
  if (phase !== "mittelspiel") {
    m[index(`${phase}_bester`)] = istBester;
    m[index(phase)] = 1;
  }
  if (k.art && k.verlust >= FEHLER_AB && FEHLERARTEN.includes(k.art)) m[index(`art_${k.art}`)] = 1;
  for (const fleck of fleckeVon(fen, k.uci)) m[index(`fb_${fleck}`)] = 1;
  const danach = fenNachUci(fen, k.uci);
  const widerlegung = k.antwort[0];
  if (danach && widerlegung)
    for (const fleck of fleckeVon(danach, widerlegung)) m[index(`fw_${fleck}`)] = 1;
  const roh = parseUci(k.uci);
  if (roh && "from" in roh) {
    const zug = normalizeMove(lage.regeln, roh);
    if (lage.regeln.isLegal(zug) && "from" in zug) {
      const stil = stilmerkmale(lage.regeln, zug);
      for (const name of STILMERKMALE) m[index(`stil_${name}`)] = stil[name] ? 1 : 0;
    }
  }
  return m;
}

/**
 * Die Gewichte je Merkmal für eine Wertung und Zeitklasse; mit Maia ein Gewicht mehr (zuletzt,
 * für ln p_Maia) aus der gemeinsamen Eichung.
 */
export function gewichte(tempo: Wahltempo, elo: number, mitMaia = false): Float64Array {
  const e = (Math.max(ELO_MIN, Math.min(ELO_MAX, elo)) - ELO_MITTE) / ELO_MASSSTAB;
  const g = mitMaia ? WAHL_GEWICHTE_MAIA[tempo] : WAHL_GEWICHTE[tempo];
  const laenge = ANZAHL_MERKMALE + (mitMaia ? 1 : 0);
  const aus = new Float64Array(laenge);
  for (let i = 0; i < laenge; i += 1) {
    aus[i] = (g.g0[i] ?? 0) + (g.g1[i] ?? 0) * e + (g.g2[i] ?? 0) * e * e;
  }
  return aus;
}

/** Nutzen eines Kandidaten: Skalarprodukt plus Verschiebungen der Persönlichkeit. */
export function nutzen(
  m: Float64Array,
  g: Float64Array,
  k: Wahlkandidat,
  v: Wahlverschiebung,
): number {
  let summe = 0;
  for (let i = 0; i < ANZAHL_MERKMALE; i += 1) summe += (m[i] ?? 0) * (g[i] ?? 0);
  if (k.art && k.verlust >= FEHLER_AB) summe += v.arten[k.art] ?? 0;
  for (const fleck of BLINDE_FLECKEN) {
    if (m[index(`fb_${fleck}`)] === 1) summe += v.flecken[fleck] ?? 0;
  }
  for (const name of STILMERKMALE) {
    if (m[index(`stil_${name}`)] === 1) summe += v.stil[name] ?? 0;
  }
  return summe;
}

/**
 * Wahrscheinlichkeiten der Kandidaten (Softmax des Nutzens durch die Temperatur).
 * Eingaben: Lage und FEN, Kandidaten, bester Zug, Phase, Zeitklasse, Wertung, Verschiebung,
 * Temperatur (1: wie geeicht; größer: zufälliger, etwa in Zeitnot oder bei schlechter Tagesform),
 * Maia-Karte (Zug → Wahrscheinlichkeit, engine/maia.ts) oder null.
 * Beispiel: Zwei gleich gute Züge und ein Patzer bekommen bei 1500 etwa 48/48/4 %.
 * Sonderfall: Ein Kandidat mit −∞ (ausgeschlossene Art) hat Wahrscheinlichkeit 0; sind alle
 * ausgeschlossen, gilt der beste Zug allein.
 */
export function wahrscheinlichkeiten(
  lage: Lage,
  fen: string,
  kandidaten: readonly Wahlkandidat[],
  bester: string | null,
  tempo: Wahltempo,
  elo: number,
  verschiebung: Wahlverschiebung = OHNE_VERSCHIEBUNG,
  temperatur = 1,
  maia: ReadonlyMap<string, number> | null = null,
): number[] {
  const g = gewichte(tempo, elo, maia !== null);
  const maiagewicht = maia ? (g[ANZAHL_MERKMALE] ?? 0) : 0;
  const werte = kandidaten.map((k) => {
    const basis = nutzen(merkmale(lage, fen, k, bester, lage.phase), g, k, verschiebung);
    const zusatz = maia
      ? maiagewicht * Math.log(Math.max(MAIA_MINDESTENS, maia.get(k.uci) ?? 0))
      : 0;
    return (basis + zusatz) / Math.max(1e-6, temperatur);
  });
  const maxi = Math.max(...werte.filter((w) => Number.isFinite(w)), Number.NEGATIVE_INFINITY);
  if (!Number.isFinite(maxi)) return kandidaten.map((k) => (k.uci === bester ? 1 : 0));
  const ex = werte.map((w) => (Number.isFinite(w) ? Math.exp(w - maxi) : 0));
  const summe = ex.reduce((a, b) => a + b, 0);
  return ex.map((x) => x / summe);
}

/** Zieht einen Kandidaten nach den Wahrscheinlichkeiten (Zufall 0 bis 1). */
export function ziehe<T>(
  liste: readonly T[],
  p: readonly number[],
  zufall: () => number,
): T | undefined {
  let rest = zufall();
  for (let i = 0; i < liste.length; i += 1) {
    rest -= p[i] ?? 0;
    if (rest < 0) return liste[i];
  }
  return liste[liste.length - 1];
}

/** Zeitklasse einer Uhr wie Lichess (geschätzte Dauer = Grundzeit + 40 · Zuschlag): unter 8 min Blitz, unter 25 Schnellschach, sonst klassisch; ohne Uhr Schnellschach. */
export function wahltempo(uhr: { grundzeitMs: number; zuschlagMs: number } | null): Wahltempo {
  if (!uhr) return "rapid";
  const dauer = uhr.grundzeitMs + 40 * uhr.zuschlagMs;
  if (dauer < 480_000) return "blitz";
  if (dauer < 1_500_000) return "rapid";
  return "classical";
}
