/**
 * Menschliche Zusatzfehler der Bots: Fehler je Gelegenheit und blinde Flecken nach den Zahlen von
 * Menschen derselben Spielstärke, über der Grundschicht der Stufe.
 *
 * Rolle im Gesamtbild: Plan „menschlichere Bots und Uhr der Bots“ (vom Autor freigegeben am
 * 20.10.2026). Ersetzt die Fehlerwürfe der Stufen 1 bis 4 (bis 0.2.115: bei Stufe 1 jeder dritte
 * Zug ein gezielt gesuchter Fehler, oft eine Figur direkt ins Schlagfeld). Ablauf je Zug:
 * 1. Die Engine rechnet sechs Kandidaten in Tiefe 10; dazu je Fehlerart bis zu zwei typische Fehlerzüge nach
 *    den Werkzeugen des Buches, gezielt bewertet. Jeder Zug mit mindestens einem halben Bauern
 *    Verlust bekommt seine Fehlerart; ein Zug der Art (bis zum Höchstverlust, falls der Leser
 *    einen gesetzt hat) ist eine Gelegenheit.
 * 2. Je Fehlerart mit Gelegenheit: Unter ihren Zügen wird einer gezogen, billige eher (Gewicht
 *    Verlust^(−beta), beta wächst mit der Stärke). Dann ein eigener Wurf: Wahrscheinlichkeit, mit
 *    der Menschen dieser Stärke die Gelegenheit nutzen (Lichess-Daten), mal Verlustfaktor des
 *    gezogenen Zuges (billige Fehler eher als teure), mal Gewicht der Art im Profil des Bots, mal
 *    Fehlerhäufigkeit, mal Tagesform, mal Zeitnot (ab drei Bauern Verlust der
 *    Faktor für Patzer). Treffen mehrere Würfe, entscheidet die Wahrscheinlichkeit.
 * 3. Sonst blinde Flecken: Gehört der beste Zug zu einem Fleck, wird er mit der Zusatz-
 *    wahrscheinlichkeit von Menschen (mal Gewicht) übersehen; die Züge dieses Flecks fallen weg.
 * 4. Sonst zieht die Grundschicht der Stufe (engine/grundschicht.ts), ohne die Züge des
 *    übersehenen Flecks. Der Stil wählt danach.
 * Die Raten sind an den Lichess-Zügen geeicht (pipeline/menschenprofil/eichen.py). Seit 0.2.117
 * (Vorschlag des Autors vom 21.10.2026) bestimmt die Grundschicht die Stärke der Stufe; die
 * Zusatzfehler machen einen Bot menschlicher und schwächer. Sind alle Gewichte null, zieht nur
 * die Grundschicht, ohne die Suche dieser Datei.
 * Abhängigkeiten: engine/menschenprofil.ts, engine/fehlerart.ts, engine/fehlersuche.ts,
 * engine/blindeFlecken.ts, engine/menschlich.ts, engine/stil.ts, engine/spielbewerter.ts.
 */
import { BLINDE_FLECKEN, blindeFehlerart, fleckeVon, type BlinderFleck } from "./blindeFlecken";
import type { Staerke } from "./engineDienst";
import { fehlerartIn, lageVon, type Fehlerart, type Lage } from "./fehlerart";
import { typischeFehlerzuege } from "./fehlersuche";
import { grundzug, kandidatenAusVarianten } from "./grundschicht";
import { GELEGENHEITSARTEN, zeitnotTemperatur } from "./menschenprofil";
import { verlaufsfaktor, type Verlauf } from "./menschlich";
import { wertFuer, type Spielbewerter, type Zugwahl } from "./spielbewerter";
import { STIL_NEUTRAL, stilwahl } from "./stil";
import type { Stilname } from "./stile";
import type { Stufe } from "./stufen";
import type { Variante } from "./uci";
import type { Wahltempo } from "./wahlmodell";
import { waehleMenschlich, type Wahlschritt } from "./wahlschritt";

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

export const WIE_MENSCHEN: Menschenwerte = {
  haeufigkeit: 1,
  gewichte: {},
  standardgewicht: 1,
  erlaubt: null,
  hoechstverlust: {},
};

/** Lage des Zuges: Spielstärke der Phase, Restzeit der eigenen Uhr, Verlauf, Stil. */
export interface Wahlkontext {
  readonly wertung: number;
  readonly restMs: number | null;
  readonly verlauf: Verlauf;
  readonly stil: number;
  /** Stil eines vorgefertigten Bots (0.2.124, engine/stile.ts); fehlend: der Regler `stil`. */
  readonly stilname?: Stilname;
  /** Zeitklasse für das Wahlmodell (0.2.124). */
  readonly tempo: Wahltempo;
}

/** So viele Kandidaten rechnet die Engine; je Art so viele typische Fehlerzüge gezielt. */
const KANDIDATEN = 6;
/** Suche der Fehlerschicht: genug Tiefe, damit die Verluste der Fehlerzüge stimmen (Daten: Tiefe 12). */
const FEHLERSUCHE: Staerke = { art: "tiefe", tiefe: 10 };
const FEHLERSUCHE_MS = 1500;
const JE_ART = 2;
const MINDESTVERLUST = 0.5;
/** Kandidaten so nah am besten gelten als gleich gut (Breite der Wahl, engine/bedenkzeit.ts). */
const GLEICH_GUT = 0.3;

interface Zugkandidat {
  readonly uci: string;
  readonly verlust: number;
  readonly antwort: readonly string[];
}

/** Ein Kandidat mit seiner Fehlerart (null unter einem halben Bauern Verlust oder ohne Art). */
interface Eingeordnet extends Zugkandidat {
  readonly art: Fehlerart | null;
}

/** Ordnet jedem Kandidaten seine Fehlerart zu (einmal je Zug, für Fehler- und Grundschicht). */
function einordnen(lage: Lage, kandidaten: readonly Zugkandidat[], bester: string): Eingeordnet[] {
  return kandidaten.map((k) => {
    if (k.verlust < MINDESTVERLUST || k.uci === bester) return { ...k, art: null };
    const art = fehlerartIn(lage, k.uci, k.antwort, k.verlust, bester);
    return { ...k, art: art === "ungenau" ? null : art };
  });
}

function gewichtVon(werte: Menschenwerte, art: Fehlerart | BlinderFleck): number {
  if (werte.erlaubt && !(werte.erlaubt as readonly string[]).includes(art) && !istFleck(art))
    return 0;
  return werte.gewichte[art] ?? werte.standardgewicht;
}

function istFleck(art: Fehlerart | BlinderFleck): art is BlinderFleck {
  return (BLINDE_FLECKEN as readonly string[]).includes(art);
}

function kandidatenAus(varianten: readonly Variante[], bestwert: number, weiss: boolean) {
  return varianten.flatMap((v): Zugkandidat[] => {
    const uci = v.zuege[0];
    if (!uci) return [];
    const verlust = Math.max(0, bestwert - wertFuer(v.wert, weiss));
    return [{ uci, verlust, antwort: v.zuege.slice(1) }];
  });
}

/** Typische Fehlerzüge der aktiven Arten, die nicht schon unter den Kandidaten sind. */
function zuPruefen(lage: Lage, aktiv: ReadonlySet<Fehlerart>, schon: ReadonlySet<string>) {
  const jeArt = new Map<Fehlerart, string[]>();
  for (const k of typischeFehlerzuege(lage)) {
    if (!aktiv.has(k.art) || schon.has(k.uci)) continue;
    const liste = jeArt.get(k.art) ?? [];
    if (liste.length < JE_ART) jeArt.set(k.art, [...liste, k.uci]);
  }
  return [...new Set([...jeArt.values()].flat())];
}

/** Hat der Bot überhaupt Zusatzfehler (eine Fehlerart oder ein Fleck mit Gewicht über 0)? */
export function hatZusatzfehler(werte: Menschenwerte): boolean {
  if (werte.haeufigkeit <= 0) return false;
  return [...GELEGENHEITSARTEN, ...BLINDE_FLECKEN].some((a) => gewichtVon(werte, a) > 0);
}

/** Temperatur des Wahlmodells: Tagesform mal Zeitnot je Zeitklasse (nicht die Fehlerhäufigkeit). */
function grundfaktor(kontext: Wahlkontext): number {
  return (
    verlaufsfaktor(kontext.verlauf) *
    zeitnotTemperatur(kontext.tempo, kontext.wertung, kontext.restMs)
  );
}

function breiteVon(varianten: readonly Variante[], weiss: boolean): number {
  return kandidatenAusVarianten(varianten, weiss).filter((k) => k.verlust <= GLEICH_GUT).length;
}

/**
 * Der Zug der Grundschicht, ohne die Züge eines übersehenen Flecks, danach der Stil.
 * Stufe 10 (volle Engine) zieht ihren besten Zug; mit Fleck den besten der übrigen Kandidaten.
 */
async function basiszug(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  kontext: Wahlkontext,
  zufall: () => number,
  fleck: BlinderFleck | null,
  kandidaten: readonly Zugkandidat[],
): Promise<Zugwahl | null> {
  const weiss = fen.split(" ")[1] !== "b";
  const ohneFleck = (uci: string) => fleck !== null && fleckeVon(fen, uci).includes(fleck);
  const grund = stufe.grund;
  if (!grund) {
    const uebrig = kandidaten.find((k) => !ohneFleck(k.uci)) ?? kandidaten[0];
    return uebrig ? { ...engineZug(uebrig.uci), verlust: uebrig.verlust } : null;
  }
  const faktor = grundfaktor(kontext);
  const wahl = await grundzug(bewerter, fen, grund, stufe.rechenzeitMs, faktor, zufall, ohneFleck);
  if (!wahl) return null;
  const { zug, varianten } = wahl;
  const breite = breiteVon(varianten, weiss);
  if (fleck && zug.verlust >= MINDESTVERLUST) {
    const fehler = blindeFehlerart(fleck);
    return { uci: zug.uci, quelle: "fehler", fehler, verlust: zug.verlust, breite };
  }
  if (kontext.stil === STIL_NEUTRAL) return { ...engineZug(zug.uci), verlust: zug.verlust, breite };
  const uci = stilwahl(fen, varianten, kontext.stil, zug.uci) ?? zug.uci;
  const verlust = kandidatenAusVarianten(varianten, weiss).find((k) => k.uci === uci)?.verlust;
  return { uci, quelle: "engine", fehler: null, verlust: verlust ?? zug.verlust, breite };
}

/**
 * Der Zug einer Stufe mit oder ohne Zusatzfehler (Ablauf im Dateikopf).
 *
 * Eingaben: Bewerter, Stellung, Stufe, Stellschrauben, Lage, Zufall (für Tests fest). Ausgabe:
 * Zug mit Herkunft und, bei einem Fehler, Art und Verlust; null ohne legalen Zug.
 * Beispiel: Bot der Stufe 2 (600) im Mittelspiel, der Gegner droht eine Figur zu schlagen: Mit
 * etwa 26 % bleibt die Drohung stehen („drohungIgnoriert“); sonst zieht die Grundschicht.
 */
export async function menschlicheWahl(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  werte: Menschenwerte,
  kontext: Wahlkontext,
  zufall: () => number,
): Promise<Zugwahl | null> {
  if (!hatZusatzfehler(werte)) return basiszug(bewerter, fen, stufe, kontext, zufall, null, []);
  const lage = lageVon(fen);
  const b = await bewerter.bewerte(fen, FEHLERSUCHE_MS, KANDIDATEN, FEHLERSUCHE);
  const erste = b.varianten[0];
  const bester = erste?.zuege[0] ?? null;
  if (!lage || !erste || !bester) return bester ? engineZug(bester) : null;
  const weiss = fen.split(" ")[1] !== "b";
  const bestwert = wertFuer(erste.wert, weiss);
  const kandidaten = kandidatenAus(b.varianten, bestwert, weiss);
  const aktiv = new Set(GELEGENHEITSARTEN.filter((a) => gewichtVon(werte, a) > 0));
  const extra = zuPruefen(lage, aktiv, new Set(kandidaten.map((k) => k.uci)));
  const gezielt =
    extra.length > 0 ? await bewerter.bewerte(fen, FEHLERSUCHE_MS, 1, FEHLERSUCHE, extra) : null;
  const pool = [
    ...einordnen(lage, kandidaten, bester),
    ...(gezielt ? einordnen(lage, kandidatenAus(gezielt.varianten, bestwert, weiss), bester) : []),
  ];
  // Seit 0.2.124 wählt das geeichte Wahlmodell unter allen Kandidaten (engine/wahlschritt.ts)
  const schritt: Wahlschritt = {
    tempo: kontext.tempo,
    wertung: kontext.wertung,
    temperatur: grundfaktor(kontext),
    stil: kontext.stil,
    stilname: kontext.stilname,
  };
  return waehleMenschlich(lage, fen, pool, bester, schritt, werte, zufall);
}

function engineZug(uci: string): Zugwahl {
  return { uci, quelle: "engine", fehler: null, verlust: 0 };
}
