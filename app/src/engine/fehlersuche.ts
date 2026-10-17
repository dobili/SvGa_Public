/**
 * Die Fehlersuche der Stufen 1 bis 4: ein typischer Anfängerfehler mit begrenztem Verlust.
 *
 * Rolle im Gesamtbild: Konzept 8.2, Fehlerprofile. Die Zugwahl (engine/zugwahl.ts) ruft die
 * Suche, wenn der Fehlerwurf der Stufe trifft. Die Engine rechnet zuerst mit voller Stärke ihre
 * besten Kandidaten (MultiPV), damit der Verlust jedes Zuges gegen den besten Zug feststeht.
 * Weil grobe Fehler unter den besten Kandidaten fehlen, prüfen die Fehlerprofile (engine/
 * fehlerart.ts) zusätzlich alle legalen Züge mit den Werkzeugen des Buches und lassen die Engine
 * einige typische Fehlerzüge gezielt bewerten („searchmoves“). Gewählt wird ein Zug, dessen
 * Verlust zwischen Mindest- und Höchstverlust der Stufe liegt, am liebsten einer mit erkannter
 * Art, seit 0.2.40 gewichtet nach dem Fehlerprofil der Phase und Stufe (engine/fehlerprofil.ts).
 * Ab Stufe 2 ist ein grundloses Damenopfer ausdrücklich ausgeschlossen (Abtauschrechnung),
 * unabhängig davon, was die Engine dem Zug an Verlust zuschreibt.
 * Abhängigkeiten: engine/engineDienst.ts, engine/fehlerart.ts, engine/spielbewerter.ts,
 * engine/stufen.ts.
 */
import { VOLLE_STAERKE } from "./engineDienst";
import {
  alleZuege,
  fehlerartIn,
  istDamenopfer,
  lageVon,
  type Fehlerart,
  type Lage,
} from "./fehlerart";
import { gewicht, gewichteteWahl } from "./fehlerprofil";
import { wertFuer, type Spielbewerter, type Zugwahl } from "./spielbewerter";
import type { Stufe } from "./stufen";
import type { Variante } from "./uci";

/** So viele Kandidaten rechnet die Engine mit voller Stärke. */
const KANDIDATEN = 8;
/** Ein Fehlerzug verliert mindestens so viel; kleinere Abweichungen sind keine Fehler. */
export const MINDESTVERLUST = 0.5;
/** So viele typische Fehlerzüge aus den Werkzeugen bewertet die Engine gezielt. */
const HOECHSTENS_GEPRUEFT = 6;
/** Alle Arten, die zur Prüfung kommen; die Reihenfolge ergibt das Gewicht im Profil der Phase. */
const PRUEFBARE: readonly Fehlerart[] = [
  "drohungIgnoriert",
  "figurHaengen",
  "schlagreflex",
  "taktikUebersehen",
  "verfruehteDame",
  "koenigMitte",
  "tempoverlust",
  "bauernraub",
  "koenigsschild",
  "falscherAbtausch",
  "koenigPassiv",
  "bauernvorstoss",
  "pattGesetzt",
];

/** Ein Fehlerzug mit Art und Verlust gegenüber dem besten Zug. */
export interface Fehlerkandidat {
  readonly uci: string;
  readonly art: Fehlerart;
  readonly verlust: number;
}

/** Ein typischer Fehlerzug aus den Werkzeugen, noch ohne Verlust. */
interface Typischer {
  readonly uci: string;
  readonly art: Fehlerart;
}

function zufallsauswahl<T>(liste: readonly T[], zufall: () => number): T | undefined {
  return liste[Math.floor(zufall() * liste.length)];
}

/** Mischt eine Liste mit der Zufallsquelle (Fisher-Yates), ohne die Eingabe zu ändern. */
function gemischt<T>(liste: readonly T[], zufall: () => number): T[] {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i -= 1) {
    const j = Math.floor(zufall() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j] as T, kopie[i] as T];
  }
  return kopie;
}

/**
 * Alle typischen Fehlerzüge einer Stellung nach den Werkzeugen des Buches (ohne Engine).
 *
 * Beispiel: Abb. 1.13 nach 2. Dh5: 2... Sf6 (Drohung ignoriert), 2... Ke7 (ungedeckte Figuren
 * hängen) und weitere; Züge ohne erkannte Art fehlen.
 */
export function typischeFehlerzuege(lage: Lage): Typischer[] {
  return alleZuege(lage)
    .map((uci) => ({ uci, art: fehlerartIn(lage, uci, [], null) }))
    .filter((k) => k.art !== "ungenau");
}

/**
 * Wählt bis zu HOECHSTENS_GEPRUEFT Züge zur Prüfung: reihum je Art ein Zug, Arten mit höherem
 * Gewicht im Profil der Phase und Stufe zuerst, innerhalb einer Art zufällig.
 */
function zurPruefung(
  typische: readonly Typischer[],
  stufe: Stufe,
  phase: Lage["phase"],
  zufall: () => number,
): Typischer[] {
  const arten = [...PRUEFBARE].sort(
    (a, b) => gewicht(phase, stufe.nummer, b) - gewicht(phase, stufe.nummer, a),
  );
  const gruppen = arten.map((art) =>
    gemischt(
      typische.filter((k) => k.art === art),
      zufall,
    ),
  );
  const auswahl: Typischer[] = [];
  for (let runde = 0; auswahl.length < HOECHSTENS_GEPRUEFT; runde += 1) {
    const vorher = auswahl.length;
    for (const gruppe of gruppen) {
      const naechster = gruppe[runde];
      if (naechster && auswahl.length < HOECHSTENS_GEPRUEFT) auswahl.push(naechster);
    }
    if (auswahl.length === vorher) break;
  }
  return auswahl;
}

/** Verlust einer Variante gegenüber dem besten Wert, aus Sicht der Seite am Zug. */
function verlustVon(v: Variante, bestwert: number, weissAmZug: boolean): number {
  return bestwert - wertFuer(v.wert, weissAmZug);
}

/** Die Kandidaten der Engine (ohne den besten) mit Verlust und Art. */
function ausEngine(
  lage: Lage,
  varianten: readonly Variante[],
  bestwert: number,
  weissAmZug: boolean,
): Fehlerkandidat[] {
  const besterZug = varianten[0]?.zuege[0] ?? null;
  return varianten.slice(1).flatMap((v) => {
    const uci = v.zuege[0];
    if (!uci) return [];
    const verlust = verlustVon(v, bestwert, weissAmZug);
    const art = fehlerartIn(lage, uci, v.zuege.slice(1), verlust, besterZug);
    return [{ uci, art, verlust }];
  });
}

/** Lässt die Engine die typischen Fehlerzüge gezielt bewerten. */
async function geprueft(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  auswahl: readonly Typischer[],
  bestwert: number,
  weissAmZug: boolean,
): Promise<Fehlerkandidat[]> {
  if (auswahl.length === 0) return [];
  const zuege = auswahl.map((k) => k.uci);
  const bewertung = await bewerter.bewerte(
    fen,
    stufe.rechenzeitMs,
    zuege.length,
    VOLLE_STAERKE,
    zuege,
  );
  return bewertung.varianten.flatMap((v) => {
    const kandidat = auswahl.find((k) => k.uci === v.zuege[0]);
    if (!kandidat) return [];
    return [{ ...kandidat, verlust: verlustVon(v, bestwert, weissAmZug) }];
  });
}

/**
 * Sucht einen Fehlerzug für die Stufe.
 *
 * Warum: Konzept 8.2: „Die Engine liefert mehrere Kandidaten mit Bewertung; die App wählt
 * mit der Fehlerquote der Stufe einen typischen Fehlerzug … Fehler bleiben plausibel: Je höher
 * die Stufe, desto kleiner darf der Verlust sein. Ein grundloses Damenopfer gibt es ab Stufe 2
 * nicht.“ Eingaben: Bewerter, Stellung, Stufe, Zufallsquelle (für Tests fest).
 * Ausgabe: der Fehlerzug mit Art und Verlust, oder null, wenn kein Zug in die Grenzen passt.
 * Beispiel: Abb. 1.13 nach 2. Dh5, Stufe 1: etwa 2... Sf6?? (Drohung ignoriert, Verlust etwa 1)
 * oder 2... Ke7?? (Figur hängen lassen); auf Stufe 3 nie ein Zug, der mehr als eine Leichtfigur
 * verliert.
 */
export async function sucheFehlerzug(
  bewerter: Spielbewerter,
  fen: string,
  stufe: Stufe,
  zufall: () => number,
  erlaubteArten: readonly Fehlerart[] | null = null,
): Promise<Zugwahl | null> {
  const lage = lageVon(fen);
  if (!lage) return null;
  const weissAmZug = lage.regeln.turn === "white";
  const voll = await bewerter.bewerte(fen, stufe.rechenzeitMs, KANDIDATEN, VOLLE_STAERKE);
  const beste = voll.varianten[0];
  if (!beste) return null;
  const bestwert = wertFuer(beste.wert, weissAmZug);
  const erlaubt = (uci: string) => stufe.damenopferErlaubt || !istDamenopfer(lage, uci);
  const bekannt = new Set(voll.varianten.map((v) => v.zuege[0]));
  const typische = typischeFehlerzuege(lage).filter((k) => !bekannt.has(k.uci) && erlaubt(k.uci));
  const auswahl = zurPruefung(typische, stufe, lage.phase, zufall);
  const kandidaten = [
    ...ausEngine(lage, voll.varianten, bestwert, weissAmZug),
    ...(await geprueft(bewerter, fen, stufe, auswahl, bestwert, weissAmZug)),
  ];
  // Eigene Gegner (0.2.42) erlauben nur bestimmte Fehlerarten.
  const artErlaubt = (k: Fehlerkandidat) => erlaubteArten === null || erlaubteArten.includes(k.art);
  const moegliche = kandidaten.filter(
    (k) =>
      k.verlust >= MINDESTVERLUST &&
      k.verlust <= stufe.hoechstverlust &&
      erlaubt(k.uci) &&
      artErlaubt(k),
  );
  const mitArt = moegliche.filter((k) => k.art !== "ungenau");
  // Gewichtet nach dem Profil der Phase und Stufe (0.2.40); ohne erkannte Art gleichverteilt.
  const wahl =
    mitArt.length > 0
      ? gewichteteWahl(mitArt, (k) => gewicht(lage.phase, stufe.nummer, k.art), zufall)
      : zufallsauswahl(moegliche, zufall);
  return wahl ? { uci: wahl.uci, quelle: "fehler", fehler: wahl.art, verlust: wahl.verlust } : null;
}
