/**
 * Bauplan eines vorgefertigten Gegners: Typ, Persönlichkeiten und die Prüfhelfer `bot` und
 * `spassbot`.
 *
 * Rolle im Gesamtbild: Von den Listen engine/gegnerliste0.ts bis gegnerliste2.ts gebraucht, die
 * engine/gegnerliste.ts zusammenführt; getrennt, damit kein Modul im Kreis importiert.
 * Seit 0.2.116 (Plan „menschlichere Bots und Uhr der Bots“, Wunsch des Autors vom 20.10.2026:
 * „mach die Bots komplett neu“, Porträts bleiben) spielt jeder Bot wie Menschen seiner Stufe
 * (engine/menschenwahl.ts); seine Persönlichkeit sind Gewichte auf einzelne Fehlerarten und
 * blinde Flecken (1: wie Menschen, 0: nie, 3: dreimal so oft), dazu Stil und Fehlerhäufigkeit.
 * Abhängigkeiten: engine/stufen.ts (Stufennummer), engine/blindeFlecken.ts, engine/fehlerart.ts,
 * engine/stil.ts, engine/zugwahl.ts (Gewichte), schach/phase.ts, i18n.
 */
import type { Textschluessel } from "../i18n/sprache";
import type { BlinderFleck } from "./blindeFlecken";
import type { Fehlerart } from "./fehlerart";
import type { Phase } from "../schach/phase";
import { STIL_MAX, STIL_MIN } from "./stil";
import type { Stufennummer } from "./stufen";

/** Gewicht je Fehlerart oder Fleck (fehlend: 1, wie Menschen der Stufe). */
export type Gewichte = Readonly<Partial<Record<Fehlerart | BlinderFleck, number>>>;

export interface Gegner {
  readonly kennung: string;
  readonly name: string;
  readonly beschreibung: Textschluessel;
  /** Porträt (Datei in app/public/gegner/ ohne Endung); seit 0.2.116 eigenes Feld. */
  readonly portraet: string;
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
  /** Erlaubte Fehlerarten; null: alle, gewichtet nach `gewichte`. */
  readonly fehlerarten: readonly Fehlerart[] | null;
  /** Blinde Flecken, für die der Bot besonders blind ist (dreifach). */
  readonly blindeFlecken: readonly BlinderFleck[];
  readonly gewichte: Gewichte;
  /** Fehlerhäufigkeit insgesamt (1: wie Menschen der Stufe). */
  readonly haeufigkeit: number;
  /** Spielstil von −2 (sehr defensiv) bis 2 (sehr aggressiv), engine/stil.ts (0.2.65). */
  readonly stil: number;
  /** Anteil der Züge, die ein beliebiger legaler Zug sind (nur Spaß-Bots, 0.2.88). */
  readonly zufallszuege?: number;
}

/** Eine Persönlichkeit: Gewichte, besondere blinde Flecken, Fehlerhäufigkeit. */
export interface Charakter {
  readonly gewichte: Gewichte;
  readonly flecken: readonly BlinderFleck[];
  readonly haeufigkeit?: number;
}

/** Die Persönlichkeiten der Bots (Beschreibung in de.json, „gegner.<kennung>“). */
export const CHARAKTERE = {
  /** Spielt wie Menschen seiner Stufe, ohne Vorlieben. */
  solide: { gewichte: {}, flecken: [] },
  /** Greift an, schlägt schnell zu und vergisst den eigenen König. */
  angreifer: {
    gewichte: { schlagreflex: 1.5, koenigsschild: 1.8, drohungIgnoriert: 1.3, bauernvorstoss: 1.3 },
    flecken: ["rueckzug"],
  },
  /** Sichert zuerst alles ab, spielt dafür langsam und passiv. */
  vorsichtig: {
    gewichte: { drohungIgnoriert: 0.6, figurHaengen: 0.6, tempoverlust: 1.8, koenigPassiv: 1.8 },
    flecken: ["abzug"],
  },
  /** Kann keinem Bauern widerstehen und schlägt gern. */
  materialist: {
    gewichte: { bauernraub: 3, schlagreflex: 2, verfruehteDame: 1.5 },
    flecken: ["ruhig"],
  },
  /** Sieht Taktik gut, hat aber wenig Gefühl für Bauern und Endspiel. */
  taktiker: {
    gewichte: {
      taktikUebersehen: 0.5,
      koenigPassiv: 2,
      bauernvorstoss: 1.8,
      falscherAbtausch: 1.8,
    },
    flecken: [],
  },
  /** Plant gut und stellt die Figuren richtig, übersieht dafür Taktik. */
  stratege: {
    gewichte: {
      taktikUebersehen: 1.7,
      drohungIgnoriert: 1.3,
      tempoverlust: 0.5,
      koenigsschild: 0.5,
    },
    flecken: ["zwischenzug"],
  },
  /** Zieht schnell und hektisch, übersieht Drohungen. */
  hektiker: {
    gewichte: { drohungIgnoriert: 1.6, schlagreflex: 1.4 },
    flecken: ["rueckzug", "springer"],
    haeufigkeit: 1.15,
  },
  /** Holt die Dame früh heraus und liebt ihre langen Wege. */
  damenfan: {
    gewichte: { verfruehteDame: 3, figurHaengen: 1.2 },
    flecken: ["springer"],
  },
  /** Lässt den König gern in der Mitte stehen und denkt erst später an die Rochade. */
  koenigswanderer: {
    gewichte: { koenigMitte: 3, koenigsschild: 1.5 },
    flecken: ["diagonale"],
  },
  /** Träumt von schönen Zügen und übersieht die stillen. */
  traeumer: {
    gewichte: {},
    flecken: ["ruhig", "bauer"],
    haeufigkeit: 1.05,
  },
  /** Spielt Endspiele stark, kennt dafür wenig Eröffnung. */
  endspieler: {
    gewichte: { koenigPassiv: 0.3, bauernvorstoss: 0.6, koenigMitte: 1.5, verfruehteDame: 1.5 },
    flecken: [],
  },
  /** Kennt viel Theorie und kommt gut aus der Eröffnung, wird später unsicher. */
  theoretiker: {
    gewichte: { verfruehteDame: 0.3, koenigMitte: 0.3, tempoverlust: 0.5, koenigPassiv: 1.8 },
    flecken: ["dame"],
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
 * seltener, sonst kämen sie nie über deren Stärke (die Daten reichen bis 2400).
 * Beispiel: bot("ella", "Ella", "lotta", [1, 1, 1], "solide", 0).
 * Sonderfall: Streuung über 2 oder Stil außerhalb −2 bis 2 ist ein Programmierfehler und wirft.
 */
export function bot(
  kennung: string,
  name: string,
  portraet: string,
  stufen: readonly [Stufennummer, Stufennummer, Stufennummer],
  charakter: Charaktername,
  stil: number,
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
    blindeFlecken: c.flecken,
    gewichte: c.gewichte,
    haeufigkeit: (c.haeufigkeit ?? 1) * seltener,
    stil,
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
): Gegner {
  if (zufallszuege <= 0 || zufallszuege > ZUFALL_HOECHSTENS) {
    throw new Error(`Spaß-Bot ${kennung}: Zufallsanteil ${zufallszuege}`);
  }
  return { ...bot(kennung, name, portraet, [stufe, stufe, stufe], charakter, stil), zufallszuege };
}
