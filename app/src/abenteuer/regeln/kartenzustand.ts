/**
 * Zustand einer Karte im Kartenfächer (docs/spiel/29_Tischgespraech.md, Abschnitt Kartenfächer):
 * spielbar, gesperrt mit Grund, wirkend, gespielt oder verbraucht.
 *
 * Rolle im Gesamtbild: Reine Funktionen ohne React. Die Kartenleiste (anbindung/
 * KartenleisteAnzeige.tsx) fragt hier, wie jede Karte im Fächer aussieht und welcher Satz in der
 * herausgehobenen Karte steht, wenn sie gerade nicht geht. Ob eine Karte spielbar ist, entscheiden
 * weiter kartenSpielbar (regeln/karten.ts) und passtZurPartie (regeln/zeitkarten.ts); diese Datei
 * findet nur den Grund dazu, in derselben Reihenfolge.
 * Warum: Eine graue Karte ohne Grund lässt den Leser raten. Er soll sie antippen können und lesen,
 * warum sie jetzt nicht geht („Eine Karte je Zug. Zieh erst.“).
 * Abhängigkeiten: regeln/karten.ts, regeln/zeitkarten.ts, schnittstelle/karten.ts,
 * schnittstelle/spielstand.ts.
 */
import type { Kartensorte } from "../schnittstelle/karten";
import type { Partiekarten } from "../schnittstelle/spielstand";
import { kartenSpielbar } from "./karten";
import { passtZurPartie } from "./zeitkarten";

/** Wie eine Karte im Fächer liegt. */
export type Kartenzustand =
  /** Jetzt spielbar: hell. */
  | "spielbar"
  /** Gerade nicht spielbar: gedämpft, mit Grund. */
  | "gesperrt"
  /** Dauerhafte Karte, gespielt, ihre Anzeige gilt noch (gleiche Stellung): mit Glanz. */
  | "wirkt"
  /** Dauerhafte Karte, in dieser Partie schon gespielt (einmal je Partie, R24): gedämpft. */
  | "gespielt"
  /** Verbrauchskarte, gespielt: umgedreht, Rückseite. */
  | "verbraucht";

/** Lage der Partie für kartenSpielbar (R24). */
export interface Spiellage {
  readonly leserAmZug: boolean;
  readonly engineDenkt: boolean;
  readonly beendet: boolean;
  readonly halbzug: number;
  readonly eigeneZuege: number;
}

/** Lage der Begegnung für passtZurPartie: Uhr, Sprüche, Remis. */
export interface Partielage {
  readonly uhr: boolean;
  readonly sprueche: boolean;
  readonly remis?: boolean;
}

/** Zustand und, wo die Karte nicht geht, der Textschlüssel des Grundes. */
export interface Kartenbefund {
  readonly zustand: Kartenzustand;
  readonly grund: string | null;
}

/** Präfix der Gründe in inhalte/abenteuer/texte/de.json. */
const GRUND = "faecher.grund";

/**
 * Der Grund, warum eine noch nicht gespielte Karte jetzt nicht geht; null, wenn sie geht.
 * Dieselbe Reihenfolge wie kartenSpielbar, ergänzt um passtZurPartie und eine laufende Karte.
 * Beispiel: Zweite Chance vor dem ersten eigenen Zug → „faecher.grund.ersterZug“.
 */
function grundDerSperre(
  karten: Partiekarten,
  sorte: Kartensorte,
  lage: Spiellage,
  partielage: Partielage,
): string | null {
  if (sorte.zeitpunkt === "vorher") return `${GRUND}.vorher`;
  if (sorte.zeitpunkt === "nachher") return `${GRUND}.nachher`;
  if (sorte.spruch_art === true && !partielage.sprueche) return `${GRUND}.keinSpruch`;
  if (sorte.wirkung.art === "remis" && partielage.remis === false) return `${GRUND}.keinRemis`;
  if (sorte.wirkung.art === "zeit" && !partielage.uhr) return `${GRUND}.ohneUhr`;
  if (lage.beendet) return `${GRUND}.beendet`;
  if (lage.engineDenkt || !lage.leserAmZug) return `${GRUND}.nichtAmZug`;
  if (karten.letzterHalbzug === lage.halbzug) return `${GRUND}.eineJeZug`;
  if (sorte.wirkung.art === "zweiteChance" && lage.eigeneZuege === 0) return `${GRUND}.ersterZug`;
  return null;
}

/**
 * Der Zustand einer Karte des Decks im Fächer.
 *
 * Eingaben: die Partiekarten, die Sorte, die Spiellage (R24), die Partielage (Uhr, Sprüche,
 * Remis) und die Kennung der Karte, die gerade wirkt (die Engine rechnet), sonst null.
 * Ausgabe: Zustand und Grund (Textschlüssel) für gesperrte und gespielte dauerhafte Karten.
 * Beispiel: Fingerzeig im selben Halbzug gespielt → „wirkt“ (das goldene Feld steht noch);
 * nach dem nächsten Zug → „gespielt“ mit „Einmal je Partie.“; Waage gespielt → „verbraucht“.
 * Sonderfall: Sagt kartenSpielbar nein, ohne dass hier ein Grund passt, steht ein allgemeiner
 * Satz da („Gerade nicht.“); die Regeln selbst bleiben in regeln/karten.ts.
 */
export function kartenzustand(
  karten: Partiekarten,
  sorte: Kartensorte,
  lage: Spiellage,
  partielage: Partielage,
  laeuft: string | null,
): Kartenbefund {
  const spiel = karten.gespielt.find((k) => k.kennung === sorte.kennung);
  if (spiel) {
    if (sorte.art === "verbrauch") return { zustand: "verbraucht", grund: `${GRUND}.verbraucht` };
    const wirkt = spiel.halbzug === lage.halbzug && !lage.beendet;
    return wirkt
      ? { zustand: "wirkt", grund: `${GRUND}.wirkt` }
      : { zustand: "gespielt", grund: `${GRUND}.einmal` };
  }
  if (laeuft !== null) return { zustand: "gesperrt", grund: `${GRUND}.laeuft` };
  const grund = grundDerSperre(karten, sorte, lage, partielage);
  if (grund) return { zustand: "gesperrt", grund };
  const geht = kartenSpielbar(karten, sorte, lage) && passtZurPartie(sorte, partielage);
  return geht
    ? { zustand: "spielbar", grund: null }
    : { zustand: "gesperrt", grund: `${GRUND}.sonst` };
}

/** Der Textschlüssel des Zustands für Vorleser („Fingerzeig, spielbar“). */
export function zustandsschluessel(zustand: Kartenzustand): string {
  return `faecher.zustand.${zustand}`;
}
