/**
 * Menschliche Zugwahl: Fehler je Gelegenheit, blinde Flecken und eine Grundschicht, alles nach
 * den Zahlen von Menschen derselben Spielstärke.
 *
 * Rolle im Gesamtbild: Plan „menschlichere Bots und Uhr der Bots“ (vom Autor freigegeben am
 * 20.10.2026). Ersetzt die Fehlerwürfe der Stufen 1 bis 4 (bis 0.2.115: bei Stufe 1 jeder dritte
 * Zug ein gezielt gesuchter Fehler, oft eine Figur direkt ins Schlagfeld). Ablauf je Zug:
 * 1. Die Engine rechnet sechs Kandidaten; dazu je Fehlerart bis zu zwei typische Fehlerzüge nach
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
 * 4. Die Grundschicht wählt gewichtet unter den Kandidaten ohne Fehlerart (Potenzkern aus den
 *    Daten, so dass Ungenauigkeiten ohne Art so oft vorkommen wie bei Menschen); Züge mit
 *    Fehlerart kommen nur über Schritt 2, so dass ein abgewähltes Fehlerbild nie vorkommt. Der
 *    Stil wählt danach.
 * Alle Zahlen sind an den Lichess-Zügen geeicht (pipeline/menschenprofil/eichen.py): nachgespielt
 * trifft der Bot je Band die Anteile der Menschen an besten Zügen und an Verlusten ab einem
 * halben, einem und drei Bauern auf etwa zwei Prozentpunkte.
 * Sind alle Gewichte null, bleibt nur die Grundschicht: eine abgeschwächte Engine wie bei Lichess.
 * Abhängigkeiten: engine/menschenprofil.ts, engine/fehlerart.ts, engine/fehlersuche.ts,
 * engine/blindeFlecken.ts, engine/menschlich.ts, engine/stil.ts, engine/spielbewerter.ts.
 */
import type { Phase } from "../schach/phase";
import { BLINDE_FLECKEN, blindeFehlerart, fleckeVon, type BlinderFleck } from "./blindeFlecken";
import type { Staerke } from "./engineDienst";
import { fehlerartIn, lageVon, type Fehlerart, type Lage } from "./fehlerart";
import { typischeFehlerzuege } from "./fehlersuche";
import {
  blindZusatz,
  gelegenheitsrate,
  GELEGENHEITSARTEN,
  verlustfaktor,
  wahlInArt,
  wahlkern,
  zeitnotFaktoren,
  type Gelegenheitsart,
} from "./menschenprofil";
import { gewichteteZugwahl, temperaturFuer, verlaufsfaktor, type Verlauf } from "./menschlich";
import { wertFuer, type Spielbewerter, type Zugwahl } from "./spielbewerter";
import { STIL_NEUTRAL, stilwahl } from "./stil";
import type { Variante } from "./uci";

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
}

/** So viele Kandidaten rechnet die Engine; je Art so viele typische Fehlerzüge gezielt. */
const KANDIDATEN = 6;
const JE_ART = 2;
const MINDESTVERLUST = 0.5;
const HOECHSTE_WAHRSCHEINLICHKEIT = 0.95;
/** Kandidaten so nah am besten gelten als gleich gut (Breite der Wahl, engine/bedenkzeit.ts). */
const GLEICH_GUT = 0.3;
/** Fehlerzüge ab so vielen Bauern Verlust zählen in Zeitnot als Patzer (wie in den Daten). */
const PATZER_AB = 3;

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

/** Zieht gewichtet einen Eintrag (Zufall 0 bis 1). */
function gewichtetGezogen<T>(
  liste: readonly T[],
  gewichte: readonly number[],
  zufall: () => number,
): T | undefined {
  const summe = gewichte.reduce((a, b) => a + b, 0);
  let rest = zufall() * summe;
  return liste.find((_, i) => (rest -= gewichte[i] ?? 0) < 0) ?? liste.at(-1);
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

interface Gelegenheit {
  readonly art: Gelegenheitsart;
  readonly zug: Zugkandidat;
  readonly wahrscheinlichkeit: number;
}

/** Die Gelegenheiten je Art: gezogener Zug und Wahrscheinlichkeit (Schritt 2 im Dateikopf). */
function gelegenheiten(
  lage: Lage,
  pool: readonly Eingeordnet[],
  werte: Menschenwerte,
  kontext: Wahlkontext,
  zufall: () => number,
): Gelegenheit[] {
  const zeit = zeitnotFaktoren(kontext.wertung, kontext.restMs);
  const verlauf = verlaufsfaktor(kontext.verlauf);
  const beta = wahlInArt(kontext.wertung);
  return GELEGENHEITSARTEN.flatMap((art): Gelegenheit[] => {
    const gewicht = gewichtVon(werte, art);
    if (gewicht <= 0) return [];
    const hoechst = werte.hoechstverlust[art] ?? Number.POSITIVE_INFINITY;
    const zuege = pool.filter((k) => k.art === art && k.verlust <= hoechst);
    const zug = gewichtetGezogen(
      zuege,
      zuege.map((k) => k.verlust ** -beta),
      zufall,
    );
    if (!zug) return [];
    const zeitfaktor = zug.verlust >= PATZER_AB ? zeit.patzer : zeit.fehler;
    const roh = gelegenheitsrate(art, kontext.wertung, lage.phase as Phase);
    const p =
      roh *
      verlustfaktor(kontext.wertung, zug.verlust) *
      gewicht *
      werte.haeufigkeit *
      verlauf *
      zeitfaktor;
    return [{ art, zug, wahrscheinlichkeit: Math.min(HOECHSTE_WAHRSCHEINLICHKEIT, p) }];
  });
}

/** Würfelt je Gelegenheit; unter den Treffern entscheidet die Wahrscheinlichkeit. */
function fehlerwurf(liste: readonly Gelegenheit[], zufall: () => number): Zugwahl | null {
  const treffer = liste.filter((g) => zufall() < g.wahrscheinlichkeit);
  const wahl = gewichtetGezogen(
    treffer,
    treffer.map((g) => g.wahrscheinlichkeit),
    zufall,
  );
  if (!wahl) return null;
  return { uci: wahl.zug.uci, quelle: "fehler", fehler: wahl.art, verlust: wahl.zug.verlust };
}

/** Übersieht der Bot seinen besten Zug wegen eines blinden Flecks? Dann der Fleck, sonst null. */
function blinderFleck(
  fen: string,
  bester: string,
  werte: Menschenwerte,
  kontext: Wahlkontext,
  zufall: () => number,
): BlinderFleck | null {
  const zeit = zeitnotFaktoren(kontext.wertung, kontext.restMs).fehler;
  for (const fleck of fleckeVon(fen, bester)) {
    const gewicht = gewichtVon(werte, fleck);
    const p = blindZusatz(fleck, kontext.wertung) * gewicht * werte.haeufigkeit * zeit;
    if (gewicht > 0 && zufall() < Math.min(HOECHSTE_WAHRSCHEINLICHKEIT, p)) return fleck;
  }
  return null;
}

/**
 * Der Zug eines menschlichen Bots (Ablauf im Dateikopf).
 *
 * Eingaben: Bewerter, Stellung, Suche (Rechenzeit, Stärke der Kandidatensuche), Stellschrauben,
 * Lage, Zufall (für Tests fest). Ausgabe: Zug mit Herkunft und, bei einem Fehler, Art und
 * Verlust; null ohne legalen Zug.
 * Beispiel: Wertung 600, Mittelspiel, der Gegner droht eine Figur zu schlagen: Mit etwa 26 %
 * bleibt die Drohung stehen („drohungIgnoriert“); eine Figur, die sonst nicht angegriffen ist,
 * stellt der Bot nur mit etwa 2 % ein.
 */
export async function menschlicheWahl(
  bewerter: Spielbewerter,
  fen: string,
  suche: { readonly rechenzeitMs: number; readonly staerke: Staerke },
  werte: Menschenwerte,
  kontext: Wahlkontext,
  zufall: () => number,
): Promise<Zugwahl | null> {
  const lage = lageVon(fen);
  const b = await bewerter.bewerte(fen, suche.rechenzeitMs, KANDIDATEN, suche.staerke);
  const erste = b.varianten[0];
  const bester = erste?.zuege[0] ?? null;
  if (!lage || !erste || !bester) return bester ? engineZug(bester) : null;
  const weiss = fen.split(" ")[1] !== "b";
  const bestwert = wertFuer(erste.wert, weiss);
  const kandidaten = kandidatenAus(b.varianten, bestwert, weiss);
  const aktiv = new Set(GELEGENHEITSARTEN.filter((a) => gewichtVon(werte, a) > 0));
  const extra = zuPruefen(lage, aktiv, new Set(kandidaten.map((k) => k.uci)));
  const gezielt =
    extra.length > 0
      ? await bewerter.bewerte(fen, suche.rechenzeitMs, 1, suche.staerke, extra)
      : null;
  const eingeordnet = einordnen(lage, kandidaten, bester);
  const pool = [
    ...eingeordnet.slice(1),
    ...(gezielt ? einordnen(lage, kandidatenAus(gezielt.varianten, bestwert, weiss), bester) : []),
  ];
  const breite = kandidaten.filter((k) => k.verlust <= GLEICH_GUT).length;
  const fehler = fehlerwurf(gelegenheiten(lage, pool, werte, kontext, zufall), zufall);
  if (fehler) return { ...fehler, breite };
  const ohneArt = eingeordnet.filter((k) => k.art === null);
  const wahl = grundschicht(fen, b.varianten, ohneArt, werte, kontext, zufall);
  return wahl ? { ...wahl, breite } : null;
}

function engineZug(uci: string): Zugwahl {
  return { uci, quelle: "engine", fehler: null, verlust: 0 };
}

/** Schritte 3 und 4: blinde Flecken, gewichtete Wahl unter den Kandidaten ohne Fehlerart, Stil. */
function grundschicht(
  fen: string,
  varianten: readonly Variante[],
  kandidaten: readonly Zugkandidat[],
  werte: Menschenwerte,
  kontext: Wahlkontext,
  zufall: () => number,
): Zugwahl | null {
  const bester = kandidaten[0];
  if (!bester) return null;
  const fleck = blinderFleck(fen, bester.uci, werte, kontext, zufall);
  const sichtbar = fleck
    ? kandidaten.filter((k) => !fleckeVon(fen, k.uci).includes(fleck))
    : kandidaten;
  const auswahl = sichtbar.length > 0 ? sichtbar : kandidaten;
  const zeit = zeitnotFaktoren(kontext.wertung, kontext.restMs).fehler;
  const kern = wahlkern(kontext.wertung);
  const grund = kern.tau * werte.haeufigkeit * zeit;
  const breite = temperaturFuer(grund, kontext.verlauf);
  const wahl = gewichteteZugwahl(auswahl, breite, zufall, kern.exponent);
  if (!wahl) return null;
  if (fleck && wahl.verlust >= MINDESTVERLUST) {
    return {
      uci: wahl.uci,
      quelle: "fehler",
      fehler: blindeFehlerart(fleck),
      verlust: wahl.verlust,
    };
  }
  if (kontext.stil === STIL_NEUTRAL) return { ...engineZug(wahl.uci), verlust: wahl.verlust };
  const erlaubt = varianten.filter((v) => auswahl.some((k) => k.uci === v.zuege[0]));
  const uci = stilwahl(fen, erlaubt, kontext.stil, wahl.uci) ?? wahl.uci;
  const verlust = auswahl.find((k) => k.uci === uci)?.verlust ?? wahl.verlust;
  return { uci, quelle: "engine", fehler: null, verlust };
}
