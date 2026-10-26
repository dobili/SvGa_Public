/**
 * Der Wahlschritt eines Bots: aus den Stellschrauben eines Bots die Verschiebungen des
 * Wahlmodells bilden und unter den Kandidaten ziehen.
 *
 * Rolle im Gesamtbild: Teil von engine/menschenwahl.ts; statt einzelner Würfe je Gelegenheit und
 * auf blinde Flecken wählt das geeichte Wahlmodell (engine/wahlmodell.ts).
 * Die Stellschrauben der Bots werden dafür übersetzt: Gewicht einer Fehlerart g →
 * Verschiebung ln(g) (0 schließt aus, 1 wie Menschen, 3 etwa dreimal so wahrscheinlich); Gewicht
 * eines Flecks g → (g − 1) · Blindstärke (3: deutlich blinder als Menschen, 0: weniger blind);
 * Fehlerhäufigkeit h → ln(h) auf alle Arten; Stilregler −2 bis 2 → Verschiebung der Stilmerkmale;
 * Höchstverlust je Art → Kandidaten darüber ausgeschlossen. Tagesform und Zeitnot wirken als
 * Temperatur (größer: zufälliger). Vorgefertigte Bots bringen statt des Reglers einen der sieben
 * Stile mit (engine/stile.ts, Teil D).
 * Der Typ Menschenwerte steht hier und nicht in engine/menschenwahl.ts (das ihn weiterreicht),
 * damit sich beide Dateien nicht gegenseitig importieren.
 * Abhängigkeiten: engine/wahlmodell.ts, engine/blindeFlecken.ts, engine/fehlerart.ts,
 * engine/stilmerkmale.ts.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "./blindeFlecken";
import { FEHLERARTEN, type Fehlerart, type Lage } from "./fehlerart";
import type { Zugwahl } from "./spielbewerter";
import { mischverschiebung, stilverschiebung, type Stilname, type Stilmix } from "./stile";
import type { Stilmerkmale } from "./stilmerkmale";
import {
  wahrscheinlichkeiten,
  ziehe,
  type Wahlkandidat,
  type Wahltempo,
  type Wahlverschiebung,
} from "./wahlmodell";

/** Die Stellschrauben eines Bots (Grundstufe: alles 1, keine Höchstverluste). */
export interface Menschenwerte {
  /** Faktor auf alle Fehler und die Temperatur (1: wie Menschen dieser Stärke). */
  readonly haeufigkeit: number;
  /** Faktor je Fehlerart oder blindem Fleck; fehlt eine Art, gilt `standardgewicht`. */
  readonly gewichte: Readonly<Partial<Record<Fehlerart | BlinderFleck, number>>>;
  readonly standardgewicht: number;
  /** Erlaubte Fehlerarten (null: alle); nicht erlaubte haben Gewicht 0 (Abhakliste, eigene Bots). */
  readonly erlaubt: readonly Fehlerart[] | null;
  /** Höchstverlust je Fehlerart in Bauern; fehlt er, ist der Verlust nicht begrenzt (wie Menschen). */
  readonly hoechstverlust: Readonly<Partial<Record<Fehlerart, number>>>;
}

/** Verschiebung je Einheit des Fleckgewichts über 1 (Gewicht 3 → −1: deutlich blinder). */
const BLINDSTAERKE = 0.5;
/** Verschiebung je Reglerstufe des Stils (−2 bis 2). */
const STILSCHRITT = 0.25;
/** Abtausche gehören zum defensiven Stil: halbe Verschiebung in Gegenrichtung. */
const TAUSCH_ANTEIL = 0.5;
/** Kandidaten so nah am besten gelten als gleich gut (Breite der Wahl, engine/bedenkzeit.ts). */
const GLEICH_GUT = 0.3;
/** Ab so viel Verlust ist der gewählte Zug ein Fehler mit Art (wie die Auswertung). */
const FEHLER_AB = 0.5;

const AGGRESSIV: readonly (keyof Stilmerkmale)[] = [
  "schlag",
  "schach",
  "koenigsnaehe",
  "bauernsturm",
  "vorwaerts",
];

export interface Wahlschritt {
  readonly tempo: Wahltempo;
  readonly wertung: number;
  /** 1: wie geeicht; Tagesform mal Zeitnot. */
  readonly temperatur: number;
  /** Regler −2 bis 2 (eigene Gegner); gilt nur ohne `stilname`. */
  readonly stil: number;
  /** Einer der sieben Stile (engine/stile.ts) der vorgefertigten Bots. */
  readonly stilname?: Stilname;
  /** Stil-Mischung eigener Bots (engine/stile.ts); vorhanden: gilt statt `stilname`. */
  readonly stilmix?: Stilmix;
  /** Maia-Karte der Stellung (engine/maia.ts); fehlend oder null: ohne Maia. */
  readonly maia?: ReadonlyMap<string, number> | null;
}

function gewichtVon(werte: Menschenwerte, art: Fehlerart | BlinderFleck): number {
  const istFleck = (BLINDE_FLECKEN as readonly string[]).includes(art);
  if (werte.erlaubt && !istFleck && !(werte.erlaubt as readonly string[]).includes(art)) return 0;
  return werte.gewichte[art] ?? werte.standardgewicht;
}

/** ln(g) mit −∞ für 0. */
function logGewicht(g: number): number {
  return g <= 0 ? Number.NEGATIVE_INFINITY : Math.log(g);
}

/**
 * Die Verschiebungen des Wahlmodells aus den Stellschrauben eines Bots.
 * Beispiel: Gewichte {verfruehteDame: 3}, Fleck „springer“ 3, Stil +2 → verfrühte Dame +1,10,
 * Springerzüge −1,0 (blinder), Schläge und Schachs +0,5, Rückzüge −0,5.
 */
export function verschiebungAus(
  werte: Menschenwerte,
  stil: number,
  stilname?: Stilname,
  stilmix?: Stilmix,
): Wahlverschiebung {
  const haeufigkeit = logGewicht(werte.haeufigkeit);
  const arten: Partial<Record<Fehlerart, number>> = {};
  for (const art of FEHLERARTEN) arten[art] = logGewicht(gewichtVon(werte, art)) + haeufigkeit;
  const flecken: Partial<Record<BlinderFleck, number>> = {};
  for (const fleck of BLINDE_FLECKEN)
    flecken[fleck] = -(gewichtVon(werte, fleck) - 1) * BLINDSTAERKE;
  if (stilmix) return { arten, flecken, stil: mischverschiebung(stilmix) };
  if (stilname) return { arten, flecken, stil: stilverschiebung(stilname) };
  const stilwerte: Partial<Record<keyof Stilmerkmale, number>> = {};
  for (const name of AGGRESSIV) stilwerte[name] = STILSCHRITT * stil;
  stilwerte.rueckzug = -STILSCHRITT * stil;
  stilwerte.tausch = -TAUSCH_ANTEIL * STILSCHRITT * stil;
  return { arten, flecken, stil: stilwerte };
}

/** Überschreitet ein Kandidat den Höchstverlust seiner Art? */
function ueberHoechstverlust(k: Wahlkandidat, werte: Menschenwerte): boolean {
  if (!k.art) return false;
  const hoechst = werte.hoechstverlust[k.art];
  return hoechst !== undefined && k.verlust > hoechst;
}

/**
 * Zieht den Zug eines Bots unter den Kandidaten nach dem Wahlmodell.
 * Eingaben: Lage und FEN, Kandidaten (der beste zuerst), bester Zug, Schritt (Zeitklasse,
 * Wertung, Temperatur, Stil), Stellschrauben, Zufall. Ausgabe: Zugwahl mit Herkunft „fehler“ und
 * Art, wenn der gewählte Zug ab einem halben Bauern verliert und eine Art hat; sonst „engine“.
 * Beispiel: Bot der Wertung 600 nach 2. Dh5 (Kandidaten Sc6, d6, Sf6??, g6??): Sf6?? und g6??
 * zusammen mit knapp einem Viertel Wahrscheinlichkeit.
 * Sonderfall: ohne Kandidaten null.
 */
export function waehleMenschlich(
  lage: Lage,
  fen: string,
  kandidaten: readonly Wahlkandidat[],
  bester: string | null,
  schritt: Wahlschritt,
  werte: Menschenwerte,
  zufall: () => number,
): Zugwahl | null {
  if (kandidaten.length === 0) return null;
  const verschiebung = verschiebungAus(werte, schritt.stil, schritt.stilname, schritt.stilmix);
  const roh = wahrscheinlichkeiten(
    lage,
    fen,
    kandidaten,
    bester,
    schritt.tempo,
    schritt.wertung,
    verschiebung,
    schritt.temperatur,
    schritt.maia ?? null,
  );
  const gefiltert = roh.map((p, i) => {
    const k = kandidaten[i];
    return k && ueberHoechstverlust(k, werte) ? 0 : p;
  });
  const summe = gefiltert.reduce((a, b) => a + b, 0);
  const p =
    summe > 0 ? gefiltert.map((x) => x / summe) : kandidaten.map((k) => (k.uci === bester ? 1 : 0));
  const wahl = ziehe(kandidaten, p, zufall) ?? kandidaten[0];
  if (!wahl) return null;
  const breite = kandidaten.filter((k) => k.verlust <= GLEICH_GUT).length;
  const fehler = wahl.verlust >= FEHLER_AB && wahl.art ? wahl.art : null;
  return {
    uci: wahl.uci,
    quelle: fehler ? "fehler" : "engine",
    fehler,
    verlust: wahl.verlust,
    breite,
  };
}
