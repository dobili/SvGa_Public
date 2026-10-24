/**
 * Bauplan eines vorgefertigten Gegners: Typ, Persönlichkeiten und die Prüfhelfer `bot` und
 * `spassbot`.
 *
 * Rolle im Gesamtbild: Von den Listen engine/gegnerliste0.ts bis gegnerliste2.ts gebraucht, die
 * engine/gegnerliste.ts zusammenführt; getrennt, damit kein Modul im Kreis importiert.
 * Seit 0.2.117 (Plan „menschlichere Bots und Uhr der Bots“, Wunsch des Autors vom 20.10.2026:
 * „mach die Bots komplett neu“, Porträts bleiben) spielt jeder Bot wie Menschen seiner Stufe
 * (engine/menschenwahl.ts); seine Persönlichkeit sind seit 0.2.125 Stufen auf menschlichen
 * Quantilen je Fehlerart und blindem Fleck (engine/spielerbereiche.ts: −2 selten wie die 5 %
 * unauffälligsten Spieler, 0 Median, 2 wie die auffälligsten 5 %, ±3 und ±4 darüber hinaus),
 * dazu einer der sieben Stile (engine/stile.ts) und die Fehlerhäufigkeit. Die Faktoren auf die
 * Gewichte entstehen erst beim Spielen aus der Wertung des Bots (ui/komponenten/botzug.ts).
 * Abhängigkeiten: engine/stufen.ts (Stufennummer), engine/blindeFlecken.ts, engine/fehlerart.ts,
 * engine/stil.ts, engine/stile.ts, schach/phase.ts, i18n.
 */
import { buchtiefeVon } from "./praxisbuch";
import type { Textschluessel } from "../i18n/sprache";
import type { BlinderFleck } from "./blindeFlecken";
import type { Fehlerart } from "./fehlerart";
import type { Phase } from "../schach/phase";
import { STIL_MAX, STIL_MIN } from "./stil";
import { faktorFuerStufe } from "./spielerbereiche";
import type { Stilname } from "./stile";
import type { Stufennummer } from "./stufen";

/** Gewicht je Fehlerart oder Fleck (fehlend: 1, wie Menschen der Stufe). */
export type Gewichte = Readonly<Partial<Record<Fehlerart | BlinderFleck, number>>>;

export interface Gegner {
  readonly kennung: string;
  readonly name: string;
  readonly beschreibung: Textschluessel;
  /** Porträt (Datei in app/public/gegner/ ohne Endung); seit 0.2.117 eigenes Feld. */
  readonly portraet: string;
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
  /** Erlaubte Fehlerarten; null: alle, gewichtet nach `gewichte`. */
  readonly fehlerarten: readonly Fehlerart[] | null;
  /** Blinde Flecken, für die der Bot besonders blind ist (Stufe über 0 in `persoenlichkeit`). */
  readonly blindeFlecken: readonly BlinderFleck[];
  /** Feste Faktoren (eigene Gegner im erweiterten Modus); vorgefertigte Bots: leer, siehe `persoenlichkeit`. */
  readonly gewichte: Gewichte;
  /** Stufen auf den menschlichen Quantilen je Fehlerart und Fleck (0.2.125). */
  readonly persoenlichkeit: Charakter;
  /** Fehlerhäufigkeit insgesamt (1: wie Menschen der Stufe). */
  readonly haeufigkeit: number;
  /** Spielstil von −2 (sehr defensiv) bis 2 (sehr aggressiv), engine/stil.ts (0.2.65); eigene Gegner. */
  readonly stil: number;
  /** Einer der sieben Stile aus den Spielerprofilen (0.2.125, engine/stile.ts). */
  readonly stilname: Stilname;
  /** Anteil der Züge, die ein beliebiger legaler Zug sind (nur Spaß-Bots, 0.2.88). */
  readonly zufallszuege?: number;
  /**
   * Halbzüge aus dem Praxisbuch höchstens (0.2.128, engine/praxisbuch.ts): Theoretiker 20,
   * Hektiker 10, sonst 16. Spaß-Bots spielen kein Buch.
   */
  readonly buchtiefe: number;
}

/**
 * Eine Persönlichkeit: Stufen je Fehlerart und je blindem Fleck auf den menschlichen Quantilen
 * (engine/spielerbereiche.ts; fehlend 0: wie der Median), Fehlerhäufigkeit.
 */
export interface Charakter {
  readonly arten: Readonly<Partial<Record<Fehlerart, number>>>;
  readonly flecken: Readonly<Partial<Record<BlinderFleck, number>>>;
  readonly haeufigkeit?: number;
}

/** Stufe eines besonders blinden Flecks (wie die 5 % blindesten Spieler). */
const BESONDERS_BLIND_STUFE = 2;

/**
 * Die Faktoren einer Persönlichkeit für eine Wertung (engine/spielerbereiche.ts): je Fehlerart und
 * Fleck mit Stufe der Faktor zum Median der Spieler dieser Stärke.
 * Beispiel: damenfan bei 1300 → verfruehteDame etwa 2,9 (Stufe 3), figurHaengen etwa 1,2,
 * springer etwa 1,5 (Stufe 2).
 */
export function faktorenAus(c: Charakter, wertung: number): Gewichte {
  const aus: Partial<Record<Fehlerart | BlinderFleck, number>> = {};
  for (const [art, stufe] of Object.entries(c.arten) as [Fehlerart, number][]) {
    aus[art] = faktorFuerStufe("arten", art, stufe, wertung);
  }
  for (const [fleck, stufe] of Object.entries(c.flecken) as [BlinderFleck, number][]) {
    aus[fleck] = faktorFuerStufe("flecken", fleck, stufe, wertung);
  }
  return aus;
}

/** Die Persönlichkeiten der Bots (Beschreibung in de.json, „gegner.<kennung>“). */
export const CHARAKTERE = {
  /** Spielt wie Menschen seiner Stufe, ohne Vorlieben. */
  solide: { arten: {}, flecken: {} },
  /** Greift an, schlägt schnell zu und vergisst den eigenen König. */
  angreifer: {
    arten: { schlagreflex: 1, koenigsschild: 2, drohungIgnoriert: 1, bauernvorstoss: 1 },
    flecken: { rueckzug: BESONDERS_BLIND_STUFE },
  },
  /** Sichert zuerst alles ab, spielt dafür langsam und passiv. */
  vorsichtig: {
    arten: { drohungIgnoriert: -1, figurHaengen: -1, tempoverlust: 2, koenigPassiv: 2 },
    flecken: { abzug: BESONDERS_BLIND_STUFE },
  },
  /** Kann keinem Bauern widerstehen und schlägt gern. */
  materialist: {
    arten: { bauernraub: 3, schlagreflex: 2, verfruehteDame: 1 },
    flecken: { ruhig: BESONDERS_BLIND_STUFE },
  },
  /** Sieht Taktik gut, hat aber wenig Gefühl für Bauern und Endspiel. */
  taktiker: {
    arten: { taktikUebersehen: -1, koenigPassiv: 2, bauernvorstoss: 2, falscherAbtausch: 2 },
    flecken: {},
  },
  /** Plant gut und stellt die Figuren richtig, übersieht dafür Taktik. */
  stratege: {
    arten: { taktikUebersehen: 2, drohungIgnoriert: 1, tempoverlust: -1, koenigsschild: -1 },
    flecken: { zwischenzug: BESONDERS_BLIND_STUFE },
  },
  /** Zieht schnell und hektisch, übersieht Drohungen. */
  hektiker: {
    arten: { drohungIgnoriert: 2, schlagreflex: 1 },
    flecken: { rueckzug: BESONDERS_BLIND_STUFE, springer: BESONDERS_BLIND_STUFE },
    haeufigkeit: 1.15,
  },
  /** Holt die Dame früh heraus und liebt ihre langen Wege. */
  damenfan: {
    arten: { verfruehteDame: 3, figurHaengen: 1 },
    flecken: { springer: BESONDERS_BLIND_STUFE },
  },
  /** Lässt den König gern in der Mitte stehen und denkt erst später an die Rochade. */
  koenigswanderer: {
    arten: { koenigMitte: 3, koenigsschild: 1 },
    flecken: { diagonale: BESONDERS_BLIND_STUFE },
  },
  /** Träumt von schönen Zügen und übersieht die stillen. */
  traeumer: {
    arten: {},
    flecken: { ruhig: BESONDERS_BLIND_STUFE, bauer: BESONDERS_BLIND_STUFE },
    haeufigkeit: 1.05,
  },
  /** Spielt Endspiele stark, kennt dafür wenig Eröffnung. */
  endspieler: {
    arten: { koenigPassiv: -2, bauernvorstoss: -1, koenigMitte: 1, verfruehteDame: 1 },
    flecken: {},
  },
  /** Kennt viel Theorie und kommt gut aus der Eröffnung, wird später unsicher. */
  theoretiker: {
    arten: { verfruehteDame: -2, koenigMitte: -2, tempoverlust: -1, koenigPassiv: 2 },
    flecken: { dame: BESONDERS_BLIND_STUFE },
  },
} as const satisfies Record<string, Charakter>;

export type Charaktername = keyof typeof CHARAKTERE;

/** Streuung um das Mittelspiel, höchstens zwei Stufen (Vorgabe des Autors). */
const STREUUNG = 2;
/** Höchster Anteil an Zufallszügen (darüber spielt der Bot gar nicht mehr Schach). */
const ZUFALL_HOECHSTENS = 0.9;

/**
 * Baut einen Bot und prüft Streuung und Stil. Der letzte Wert (seit 0.2.117) ist ein Faktor auf
 * die Fehlerhäufigkeit seiner Persönlichkeit: Die stärksten Bots machen die Fehler der Menschen
 * seltener, sonst kämen sie nie über deren Stärke (die Daten reichen bis 2400); 0 heißt: keine
 * Zusatzfehler, nur Stil (die fünf stärksten Bots, volle Engine).
 * Beispiel: bot("ella", "Ella", "lotta", [1, 1, 1], "solide", 0, "universell").
 * Sonderfall: Streuung über 2 oder Stil außerhalb −2 bis 2 ist ein Programmierfehler und wirft.
 */
export function bot(
  kennung: string,
  name: string,
  portraet: string,
  stufen: readonly [Stufennummer, Stufennummer, Stufennummer],
  charakter: Charaktername,
  stil: number,
  stilname: Stilname,
  seltener = 1,
): Gegner {
  const [eroeffnung, mittelspiel, endspiel] = stufen;
  if (
    Math.abs(eroeffnung - mittelspiel) > STREUUNG ||
    Math.abs(endspiel - mittelspiel) > STREUUNG
  ) {
    throw new Error(`Gegner ${kennung}: Streuung über ${STREUUNG} Stufen`);
  }
  if (stil < STIL_MIN || stil > STIL_MAX) throw new Error(`Gegner ${kennung}: Stil ${stil}`);
  const c: Charakter = CHARAKTERE[charakter];
  return {
    kennung,
    name,
    beschreibung: `gegner.${kennung}` as Textschluessel,
    portraet,
    stufenJePhase: { eroeffnung, mittelspiel, endspiel },
    fehlerarten: null,
    blindeFlecken: (Object.keys(c.flecken) as BlinderFleck[]).filter(
      (f) => (c.flecken[f] ?? 0) > 0,
    ),
    gewichte: {},
    persoenlichkeit: c,
    haeufigkeit: (c.haeufigkeit ?? 1) * seltener,
    stil,
    stilname,
    buchtiefe: buchtiefeVon(charakter),
  };
}

/**
 * Baut einen Spaß-Bot (Wunsch des Autors, 0.2.88): eine Stufe in allen Phasen und dazu ein
 * Anteil an Zufallszügen. Seit 0.2.117 hat jeder seine eigene Stufe (Stufe 1 ist schon fast
 * zufällig). Beispiel: spassbot("kiki", "Kiki", "fritzi", 3, 0.5, "hektiker", 1).
 * Sonderfall: ein Anteil über 0,9 oder unter 0 ist ein Programmierfehler und wirft.
 */
export function spassbot(
  kennung: string,
  name: string,
  portraet: string,
  stufe: Stufennummer,
  zufallszuege: number,
  charakter: Charaktername,
  stil: number,
  stilname: Stilname,
): Gegner {
  if (zufallszuege <= 0 || zufallszuege > ZUFALL_HOECHSTENS) {
    throw new Error(`Spaß-Bot ${kennung}: Zufallsanteil ${zufallszuege}`);
  }
  return {
    ...bot(kennung, name, portraet, [stufe, stufe, stufe], charakter, stil, stilname),
    zufallszuege,
  };
}
