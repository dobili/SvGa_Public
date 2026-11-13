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
  DECKGROESSE_MIT_TASCHE,
  type Kartensorte,
  type Kartenspiel,
  type Kartenstufe,
} from "../schnittstelle/karten";
import type { Ausgang, Nadelstufe } from "../schnittstelle/partie";
import type { Abenteuerstand, Partiekarten } from "../schnittstelle/spielstand";
import { wendeWirkungenAn } from "./quests";
import { ambroseFehlt } from "./abwesenheit";

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
  const zaehlend = gespielt.filter((k) => !ZAEHLT_NICHT.has(k.kennung) && k.frei !== true);
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

/**
 * Darf diese Karte ins Deck (R24: Größe, jede Sorte einmal, höchstens eine Vorgabe)? Die Größe
 * ist 3, mit der Kartentasche 4 (deckgroesse).
 */
export function deckErlaubt(
  deck: readonly string[],
  neu: string,
  sorten: readonly Kartensorte[],
  groesse: number = DECKGROESSE,
): boolean {
  if (deck.length >= groesse || deck.includes(neu)) return false;
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
  // Freie Karten der Begegnung (R29) kommen nicht aus dem Besitz und merken sich ihr Spielen
  // als Dialogvariable (`mentorzugFreiGespielt`, für den Extra-Abspann).
  const frei = karten.frei?.includes(sorte.kennung) === true;
  const spiel: Kartenspiel = {
    kennung: sorte.kennung,
    stufe: sorte.stufe,
    halbzug,
    ...(frei ? { frei } : {}),
  };
  const dialogvariablen = frei
    ? { ...stand.dialogvariablen, [`${sorte.kennung}FreiGespielt`]: true }
    : stand.dialogvariablen;
  const besitz =
    !frei && sorte.art === "verbrauch"
      ? stand.karten
          .map((k) => (k.kennung === sorte.kennung ? { ...k, anzahl: k.anzahl - 1 } : k))
          .filter((k) => k.anzahl > 0)
      : stand.karten;
  return {
    ...stand,
    karten: besitz,
    dialogvariablen,
    partiekarten: { ...karten, gespielt: [...karten.gespielt, spiel], letzterHalbzug: halbzug },
  };
}

/**
 * Zeigt die Karte nur, dass Ambrose da ist, statt einen Zug zu spielen? Ja für eine freie Karte
 * der Begegnung (R29, Mentor-Zug im Halbfinale, Story-Bibel 34.3): goldener Rand, kein Zug;
 * den Turmzug findet der Held selbst (regeln/zugerraten.ts).
 * Beispiel: Halbfinale, frei ["mentorzug"] → ja; gekaufter Mentor-Zug im Clubkampf → nein.
 */
export function nurAnwesenheit(karten: Partiekarten, kennung: string): boolean {
  return karten.frei?.includes(kennung) === true;
}

/** Stufe einer Karte zu ihrer Kennung (für Anzeige und Protokoll). */
export function stufeVon(kennung: string, sorten: readonly Kartensorte[]): Kartenstufe | null {
  return sorten.find((s) => s.kennung === kennung)?.stufe ?? null;
}

/** Die Deckgröße des Lesers: 3, mit dem Gegenstand „Kartentasche“ 4 (docs/spiel/11, I2). */
export function deckgroesse(gegenstaende: readonly string[]): number {
  return gegenstaende.includes("kartentasche") ? DECKGROESSE_MIT_TASCHE : DECKGROESSE;
}

/**
 * Lernkarten (docs/spiel/11, Abschnitt 5): Karten, deren Buchkapitel der Leser in der App
 * abgeschlossen hat und die er noch nie geschenkt bekam (Dialogvariable lernkarte<Kennung>).
 * Beispiel: Kapitel 1 fertig, Abzählen noch nicht geschenkt → [Abzählen].
 */
export function neueLernkarten(
  stand: Abenteuerstand,
  fertigeKapitel: readonly number[],
  sorten: readonly Kartensorte[],
): readonly Kartensorte[] {
  return sorten.filter(
    (s) =>
      s.kapitel !== undefined &&
      fertigeKapitel.includes(s.kapitel) &&
      stand.dialogvariablen[lernkartenvariable(s.kennung)] !== true,
  );
}

/** Dialogvariable, die eine geschenkte Lernkarte merkt: „lernkarteAbzaehlen“. */
export function lernkartenvariable(kennung: string): string {
  return `lernkarte${kennung.charAt(0).toUpperCase()}${kennung.slice(1)}`;
}

/**
 * Schenkt alle neuen Lernkarten: Karte in den Besitz, Variable gesetzt. Ausgabe: neuer Stand und
 * die geschenkten Sorten (für die Meldung „Für Kapitel 1 im Buch: …“).
 */
export function mitLernkarten(
  stand: Abenteuerstand,
  fertigeKapitel: readonly number[],
  sorten: readonly Kartensorte[],
  jetzt: Date,
): { readonly stand: Abenteuerstand; readonly neu: readonly Kartensorte[] } {
  const neu = neueLernkarten(stand, fertigeKapitel, sorten);
  if (neu.length === 0) return { stand, neu };
  const mitKarten = wendeWirkungenAn(
    stand,
    neu.map((s) => ({ art: "karte", karte: s.kennung }) as const),
    jetzt,
  );
  const variablen = Object.fromEntries(neu.map((s) => [lernkartenvariable(s.kennung), true]));
  return {
    stand: { ...mitKarten, dialogvariablen: { ...mitKarten.dialogvariablen, ...variablen } },
    neu,
  };
}

/**
 * Regel R29: Zwischen „Tiefpunkt“ (Port Delacroix) und „Versöhnung“ (Desert Springs) ist der
 * Mentor-Zug gesperrt; Ambrose hat {held} verlassen und zieht nicht für ihn.
 * Beispiel: tiefpunktGesehen true, versoehnungGesehen false → gesperrt.
 */
export function mentorzugGesperrt(variablen: Abenteuerstand["dialogvariablen"]): boolean {
  return ambroseFehlt(variablen);
}
