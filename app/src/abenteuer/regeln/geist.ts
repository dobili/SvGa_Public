/**
 * Geisterhafte Figuren (Wunsch des Autors, 13.11.2026): Eine Figur mit `geist: true` in orte.json
 * (bisher Ambrose) steht auf allen Karten leicht durchsichtig, kühl getönt und schwebt sanft; ihr
 * Porträt im Dialog ist ebenfalls leicht durchsichtig. In Erinnerungen (Sepia, der junge Ambrose)
 * ist sie lebendig und sieht normal aus. Die Marken `#erscheint` und `#geist` im Dialog gelten wie
 * bisher und gehen vor. Eine Eigenschaft der Figur, nicht an den Namen gebunden.
 *
 * Rolle im Gesamtbild: reine Regeln ohne Phaser und React für oberwelt/geistfigur.ts (Karte),
 * oberwelt/weltdaten.ts und dialog/Dialog.tsx (Porträt).
 * Abhängigkeiten: daten/laden.ts (Typ der Ortdaten).
 */
import type { Ortdaten } from "../daten/laden";

/** Deckkraft einer geisterhaften Figur auf der Karte (1 = ganz deckend). */
export const GEIST_DECKKRAFT = 0.7;
/** Ganz leichter kühler Schimmer: Tönung in Phaser (Weiß wäre ohne Tönung). */
export const GEIST_TOENUNG = 0xdce8ff;
/** So viele Pixel schwebt die Figur auf und ab. */
export const GEIST_SCHWEBEN = 1;
/** Dauer eines halben Auf und Ab in Millisekunden. */
export const GEIST_SCHWEBEDAUER = 1400;

/** Erscheinung des Porträts im Dialog (data-erscheinung, abenteuer.css). */
export type Erscheinung = "erscheint" | "geist" | "geisterhaft";

/** Der Kurzname einer Figur aus ihrer Kennung. Beispiel: „mapleFalls.ambrose“ → „ambrose“. */
function kurzname(kennung: string): string {
  return kennung.slice(kennung.indexOf(".") + 1);
}

/**
 * Die Kurznamen aller geisterhaften Figuren (zugleich die Sprecher im Dialog, `#sprecher:ambrose`).
 * Beispiel: Figur „mapleFalls.ambrose“ mit geist: true → { "ambrose" }.
 */
export function geistsprecher(orte: readonly Ortdaten[]): ReadonlySet<string> {
  return new Set(
    orte.flatMap((ort) =>
      ort.figuren.filter((f) => f.geist === true).map((f) => kurzname(f.kennung)),
    ),
  );
}

/**
 * Die Figuren einer Karte, die als Geist erscheinen: Objektnamen, deren Figur geist: true hat.
 * Sonderfall: in einer Erinnerung keine (dort lebt Ambrose noch).
 */
export function geisterDerKarte(
  namen: readonly string[],
  istGeist: (name: string) => boolean,
  erinnerung: boolean,
): ReadonlySet<string> {
  return new Set(erinnerung ? [] : namen.filter(istGeist));
}

/**
 * Erscheinung des Porträts: `#geist` (halb durchsichtig) und `#erscheint` (einblenden) gehen vor;
 * sonst ist ein geisterhafter Sprecher leicht durchsichtig, außer in einer Erinnerung.
 * Beispiel: „ambrose“ ohne Marke → „geisterhaft“; in der Erinnerung → undefined.
 */
export function erscheinungDesPortraets(
  tags: Readonly<Record<string, string>> | undefined,
  sprecher: string,
  geister: ReadonlySet<string>,
  erinnerung: boolean,
): Erscheinung | undefined {
  if (tags?.geist) return "geist";
  if (tags?.erscheint) return "erscheint";
  return geister.has(sprecher) && !erinnerung ? "geisterhaft" : undefined;
}
