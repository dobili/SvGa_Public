/**
 * Regeln der Hilfskarten und Clubnadeln (docs/spiel/06_Regelwerk.md, R17 bis R26): Kartenstufe
 * einer Partie, Clubnadel aus dem Ausgang, beste Nadel, Vorgabestellung, Deck- und Spielregeln.
 *
 * Rolle im Gesamtbild: Reine Funktionen ohne Oberfläche; die Kartenleiste (anbindung/
 * KartenleisteAnzeige.tsx) fragt, ob eine Karte gerade spielbar ist, die Oberwelt rechnet nach
 * der Partie die Nadel. Die Kartensorten kommen aus den Spieldaten (karten.json).
 * Abhängigkeiten: chessops (Stellung für die Vorgabe), schnittstelle/karten.ts,
 * schnittstelle/partie.ts, schnittstelle/spielstand.ts.
 * Beispiel: Sieg ohne Karten → Gold; Sieg mit Fingerzeig und Zweite Chance → Silber; Sieg mit
 * Flüstern → Bronze; Remis gegen den Clubchef → Bronze; Niederlage → keine Nadel.
 */
import { parseFen, makeFen } from "chessops/fen";
import { parseSquare } from "chessops/util";
import type { Color } from "chessops/types";
import {
  DECKGROESSE,
  type Kartensorte,
  type Kartenspiel,
  type Kartenstufe,
} from "../schnittstelle/karten";
import type { Ausgang, Nadelstufe } from "../schnittstelle/partie";
import type { Abenteuerstand, Partiekarten } from "../schnittstelle/spielstand";

/** Rangfolge der Nadeln (R21: beste bleibt). */
const NADELRANG: Readonly<Record<Nadelstufe, number>> = { bronze: 1, silber: 2, gold: 3 };
/** Mehr leichte Karten als diese geben nur noch Bronze (R17). */
const LEICHTE_FUER_SILBER = 2;
/** Karten, die nicht als gespielte Karten zählen (R17: Sanduhr; Mentor-Zug im Halbfinale über R29). */
const ZAEHLT_NICHT: ReadonlySet<string> = new Set(["sanduhr"]);
/** Höchstbestand je Verbrauchskarte (R27). */
export const HOECHSTBESTAND = 9;

/** Die Kartenstufe einer Partie aus den gespielten Karten (R17), als Nadelstufe. */
export function kartenstufeDerPartie(gespielt: readonly Kartenspiel[]): Nadelstufe {
  const zaehlend = gespielt.filter((k) => !ZAEHLT_NICHT.has(k.kennung));
  if (zaehlend.length === 0) return "gold";
  const schwer = zaehlend.some((k) => k.stufe !== "leicht");
  if (schwer || zaehlend.length > LEICHTE_FUER_SILBER) return "bronze";
  return "silber";
}

/** Die schlechtere von zwei Nadeln. */
function schlechtere(a: Nadelstufe, b: Nadelstufe): Nadelstufe {
  return NADELRANG[a] <= NADELRANG[b] ? a : b;
}

/** Die bessere von zwei Nadeln (R21); null zählt als keine. */
export function besteNadel(alt: Nadelstufe | null, neu: Nadelstufe | null): Nadelstufe | null {
  if (!alt) return neu;
  if (!neu) return alt;
  return NADELRANG[neu] > NADELRANG[alt] ? neu : alt;
}

/**
 * Die Clubnadel eines Clubkampfs (R18 bis R20): Sieg → Kartenstufe, im Wiedereinstieg ohne Sanduhr
 * höchstens Silber; Remis → Bronze; sonst keine.
 */
export function clubnadel(ausgang: Ausgang, karten: Partiekarten | null): Nadelstufe | null {
  if (ausgang === "remis") return "bronze";
  if (ausgang !== "sieg") return null;
  const gespielt = karten?.gespielt ?? [];
  const stufe = kartenstufeDerPartie(gespielt);
  const sanduhr = gespielt.some((k) => k.kennung === "sanduhr");
  if (karten?.wiedereinstieg && !sanduhr) return schlechtere(stufe, "silber");
  return stufe;
}

/** Spiegelt die Reihe eines Feldes (R26): f2 → f7, g1 → g8. */
export function gespiegelt(feld: string): string {
  const reihe = Number(feld[1]);
  return `${feld[0] ?? ""}${9 - reihe}`;
}

/**
 * Die Startstellung mit einer Vorgabe: Die Figur des Gegners auf `feld` (aus Sicht eines weißen
 * Gegners) wird entfernt; spielt der Gegner Schwarz, wird gespiegelt. Null, wenn die FEN nicht
 * lesbar ist oder auf dem Feld keine Figur des Gegners steht.
 */
export function vorgabeFen(fen: string, feld: string, gegnerfarbe: Color): string | null {
  const ziel = gegnerfarbe === "white" ? feld : gespiegelt(feld);
  const setup = parseFen(fen);
  const quadrat = parseSquare(ziel);
  if (!setup.isOk || quadrat === undefined) return null;
  const figur = setup.value.board.get(quadrat);
  if (!figur || figur.color !== gegnerfarbe) return null;
  setup.value.board.take(quadrat);
  return makeFen(setup.value);
}

/** Darf diese Karte ins Deck (R24: Größe, jede Sorte einmal, höchstens eine Vorgabe)? */
export function deckErlaubt(
  deck: readonly string[],
  neu: string,
  sorten: readonly Kartensorte[],
): boolean {
  if (deck.length >= DECKGROESSE || deck.includes(neu)) return false;
  const sorte = sorten.find((s) => s.kennung === neu);
  if (!sorte || sorte.zeitpunkt === "nachher") return false;
  if (sorte.wirkung.art === "vorgabe") {
    const vorgaben = deck.filter(
      (k) => sorten.find((s) => s.kennung === k)?.wirkung.art === "vorgabe",
    );
    if (vorgaben.length > 0) return false;
  }
  return true;
}

/**
 * Ist eine Karte „während“ jetzt spielbar (R24): im Deck, noch nicht gespielt, Leser am Zug,
 * Engine denkt nicht, Partie läuft, höchstens eine Karte je eigenem Zug; Zweite Chance erst
 * nach dem ersten eigenen Zug.
 */
export function kartenSpielbar(
  karten: Partiekarten,
  sorte: Kartensorte,
  lage: {
    readonly leserAmZug: boolean;
    readonly engineDenkt: boolean;
    readonly beendet: boolean;
    readonly halbzug: number;
    readonly eigeneZuege: number;
  },
): boolean {
  if (sorte.zeitpunkt !== "waehrend") return false;
  if (!karten.deck.includes(sorte.kennung)) return false;
  if (karten.gespielt.some((k) => k.kennung === sorte.kennung)) return false;
  if (!lage.leserAmZug || lage.engineDenkt || lage.beendet) return false;
  if (karten.letzterHalbzug === lage.halbzug) return false;
  if (sorte.wirkung.art === "zweiteChance" && lage.eigeneZuege === 0) return false;
  return true;
}

/**
 * Verbucht eine gespielte Karte: im Partiestand (gespielt, letzter Halbzug) und im Besitz
 * (Verbrauchskarten werden abgezogen, dauerhafte bleiben).
 */
export function mitGespielterKarte(
  stand: Abenteuerstand,
  sorte: Kartensorte,
  halbzug: number,
): Abenteuerstand {
  const karten = stand.partiekarten;
  if (!karten) return stand;
  const spiel: Kartenspiel = { kennung: sorte.kennung, stufe: sorte.stufe, halbzug };
  const besitz =
    sorte.art === "verbrauch"
      ? stand.karten
          .map((k) => (k.kennung === sorte.kennung ? { ...k, anzahl: k.anzahl - 1 } : k))
          .filter((k) => k.anzahl > 0)
      : stand.karten;
  return {
    ...stand,
    karten: besitz,
    partiekarten: { ...karten, gespielt: [...karten.gespielt, spiel], letzterHalbzug: halbzug },
  };
}

/** Stufe einer Karte zu ihrer Kennung (für Anzeige und Protokoll). */
export function stufeVon(kennung: string, sorten: readonly Kartensorte[]): Kartenstufe | null {
  return sorten.find((s) => s.kennung === kennung)?.stufe ?? null;
}
