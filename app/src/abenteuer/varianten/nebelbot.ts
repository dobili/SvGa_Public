/**
 * Bot für Nebelschach (L5, Theron im Bayou): rechnet mit der Engine nur auf dem, was er sieht, und
 * wählt zufällig unter den guten Zügen; einen sichtbaren König schlägt er immer.
 *
 * Warum: Für Nebelschach gibt es keine Engine mit verdeckter Information. docs/spiel/10 sieht eine
 * „eigene Bot-Logik“ vor: Engine auf der Stellung, aber ehrlich begrenzt. Ehrlich heißt hier: Die
 * Engine bekommt die Sichtstellung (nebel.ts), also weder versteckte Figuren noch den König, wenn
 * der Bot ihn nicht sieht (dann steht er dort, wo der Bot ihn zuletzt sah). Ein Angriff aus dem
 * Nebel trifft den Bot so wie einen Menschen.
 * Abhängigkeiten: nebel.ts, freistellung.ts; die Engine kommt als Funktion (Zugbewerter) von außen.
 */
import type { Color, Square } from "chessops/types";
import { opposite } from "chessops/util";
import { alsFen, ausUci, gleich, type Freizug } from "./freistellung";
import { waehle, type Bewerteterzug, type Botstil, type Zugbewerter } from "./botwahl";
import { koenigGesehen, nebelzuege, sichtstellung, type Nebelpartie } from "./nebel";

/** Was der Bot sich merkt: das Feld, auf dem er den fremden König zuletzt sah. */
export interface Nebelgedaechtnis {
  readonly koenigZuletzt: Square;
}

/** Grundfeld des Königs (e1 = 4, e8 = 60), Startwert des Gedächtnisses. */
const KOENIGSFELD: Record<Color, Square> = { white: 4, black: 60 };

/** Das Gedächtnis zu Beginn: Der fremde König steht auf seinem Grundfeld. */
export function neuesGedaechtnis(botFarbe: Color): Nebelgedaechtnis {
  return { koenigZuletzt: KOENIGSFELD[opposite(botFarbe)] };
}

/** Gedächtnis nach einem Blick auf die Stellung (nach jedem Halbzug aufrufen). */
export function merke(p: Nebelpartie, botFarbe: Color, g: Nebelgedaechtnis): Nebelgedaechtnis {
  return { koenigZuletzt: koenigGesehen(p.stellung, botFarbe, g.koenigZuletzt) };
}

/** Der Zug, der den fremden König schlägt, wenn es ihn gibt (dann ist der König auch sichtbar). */
export function koenigsfang(p: Nebelpartie): Freizug | null {
  const koenig = p.stellung.brett.kingOf(opposite(p.stellung.amZug));
  return nebelzuege(p).find((z) => z.nach === koenig) ?? null;
}

/** Notzug ohne Engine: ein Schlag, sonst irgendein erlaubter Zug (zufällig). */
function notzug(erlaubt: readonly Freizug[], p: Nebelpartie, stil: Botstil): Freizug {
  const schlaege = erlaubt.filter((z) => p.stellung.brett.has(z.nach));
  const auswahl = schlaege.length > 0 ? schlaege : erlaubt;
  return auswahl[Math.floor(stil.zufall() * auswahl.length)] as Freizug;
}

/**
 * Der Zug des Bots. Schlägt einen erreichbaren König; sonst Engine auf der Sichtstellung, Wahl
 * unter den guten Zügen, die auch nach den echten Nebelregeln gehen. Gibt die Engine nichts
 * Brauchbares (Fehler, nur Züge, die eine versteckte Figur verstellt), ein Notzug.
 * Eingaben: Partie (der Bot ist am Zug), Gedächtnis, Engine, Stil.
 * Sonderfall: Ohne erlaubten Zug wirft die Funktion (die Partie ist dann schon als Patt beendet).
 */
export async function nebelbotZug(
  p: Nebelpartie,
  g: Nebelgedaechtnis,
  bewerter: Zugbewerter,
  stil: Botstil,
): Promise<Freizug> {
  const erlaubt = nebelzuege(p);
  if (erlaubt.length === 0) throw new Error("Der Bot hat keinen Zug.");
  const fang = koenigsfang(p);
  if (fang) return fang;
  const sicht = sichtstellung(p.stellung, p.stellung.amZug, g.koenigZuletzt);
  const liste = await bewerter(alsFen(sicht), stil.varianten).catch((fehler: unknown) => {
    console.warn("Nebelbot: Engine ohne Antwort, Notzug.", fehler);
    return [];
  });
  const passend = liste.filter((b) => {
    const zug = ausUci(b.zug);
    return zug !== null && erlaubt.some((e) => gleich(e, zug));
  });
  if (passend.length === 0) return notzug(erlaubt, p, stil);
  return ausUci((passend[waehle(passend, stil)] as Bewerteterzug).zug) as Freizug;
}
