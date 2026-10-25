/**
 * Namen zu einem Theoriezug: zu welchen Eröffnungen und Gambits die Stellung gehört.
 *
 * Rolle im Gesamtbild: Rückblick beim Nachspielen (Wunsch des Autors, 25.10.2026): Bei einem
 * Theoriezug steht „Theoriezug: Teil einer Eröffnung“ bzw. „… eines Gambits“; ein Tipp auf das
 * Wort zeigt die zutreffenden Namen (ui/komponenten/Theorieangabe.tsx). Zutreffend sind die
 * Eröffnungen, deren Zugfolge durch die Stellung führt.
 * Reihenfolge: zuerst die Eröffnungen und Gambits des Buches (Kapitel 2 und 3, Namen aus den
 * Steckbriefen und Abschnitten, in der Reihenfolge des Buches), dann die Lichess-Namen: die
 * Stellung selbst (ohne eigenen Namen die zuletzt benannte Stellung der Partie, in deren
 * Eröffnung die Partie noch ist), dann die Fortsetzungen nach Nähe (kürzeste zuerst) und bei
 * gleicher Nähe nach Bedeutung (wie viele benannte Varianten darunter liegen; die Spanische Partie
 * hat Hunderte, die Alapin-Eröffnung 2. Se2 keine). Häufigkeiten aus echten Partien
 * (public/daten/praxisbuch.json) kennt diese Datei nicht; die Datei wäre 2,7 MB nur dafür.
 * Lichess-Namen: im Deutschen die Familie übersetzt (inhalte/de/eroeffnungsfamilien.json), die
 * Variante englisch (Entscheidung R12); im Englischen wie bei Lichess.
 * Abhängigkeiten: schach/theorie.ts, schach/eroeffnungsindex.ts.
 */
import { stellungsschluessel } from "./eroeffnungsindex";
import { theorieknoten, type Theorieknoten, type Theoriequellen } from "./theorie";

/** So viele Namen zeigt die Liste; der Rest steht als „und N weitere“ da. */
export const THEORIENAMEN_HOECHSTENS = 5;

export interface Theoriename {
  readonly name: string;
  /** Aus den Kapiteln 2 und 3 des Buches oder aus der Lichess-Liste. */
  readonly herkunft: "buch" | "lichess";
}

export interface Theorieauskunft {
  /** Die ersten Namen (höchstens THEORIENAMEN_HOECHSTENS). */
  readonly namen: readonly Theoriename[];
  /** Wie viele zutreffende Namen darüber hinaus (für „und N weitere“). */
  readonly weitere: number;
  /** Ist die Eröffnung, in der die Partie gerade ist, ein Gambit? */
  readonly gambit: boolean;
}

/**
 * Ist der Name ein Gambit? Deutsch und englisch steht das Wort im Namen („Königsgambit“,
 * „King's Gambit Accepted“, „Sicilian Defense: Smith-Morra Gambit“).
 * Sonderfall: Auch das Damengambit und das Abgelehnte Damengambit zählen, wie ihr Name sagt.
 */
export function istGambit(name: string): boolean {
  return /gambit/i.test(name);
}

/**
 * Die zuletzt benannte Stellung der Partie bis zur gezeigten (rückwärts gesucht, die gezeigte
 * zuerst). Beispiel: nach 1. e4 e5 2. Sf3 Sc6 3. Lb5 a6 4. La4 Sf6 5. 0-0 Le7 6. Te1 b5 (ohne
 * eigenen Namen) → der Name der letzten benannten Stellung davor.
 */
function letzterName(knoten: readonly (Theorieknoten | null)[]): string | null {
  for (let i = knoten.length - 1; i >= 0; i -= 1) {
    const name = knoten[i]?.name;
    if (name) return name.name;
  }
  return null;
}

/** Benannte Fortsetzungen (Breitensuche), nach Nähe und Bedeutung geordnet. */
function fortsetzungen(start: Theorieknoten | null): string[] {
  const gefunden: { name: string; tiefe: number; gewicht: number; stelle: number }[] = [];
  let ebene: readonly Theorieknoten[] = start ? [start] : [];
  for (let tiefe = 1; ebene.length > 0; tiefe += 1) {
    const naechste: Theorieknoten[] = [];
    for (const knoten of ebene) {
      for (const kind of knoten.kinder.values()) {
        naechste.push(kind);
        if (kind.name) {
          const gewicht = kind.benannteDarunter;
          gefunden.push({ name: kind.name.name, tiefe, gewicht, stelle: gefunden.length });
        }
      }
    }
    ebene = naechste;
  }
  gefunden.sort((a, b) => a.tiefe - b.tiefe || b.gewicht - a.gewicht || a.stelle - b.stelle);
  return gefunden.map((g) => g.name);
}

/** Die Namen des Buches zur Stellung, ohne Doppelte, in der Reihenfolge des Buches. */
function buchnamen(quellen: Theoriequellen, schluessel: string): string[] {
  const eintraege = quellen.buch?.stellungen.get(schluessel) ?? [];
  return [...new Set(eintraege.map((e) => e.name))];
}

/**
 * Die zutreffenden Eröffnungen und Gambits zur Stellung nach einem Theoriezug.
 *
 * Eingaben: Quellen; die Stellungen der Partie bis einschließlich der Stellung nach dem Zug und
 * die Züge bis dorthin (englische Kurznotation, einer weniger als Stellungen). Ausgabe: höchstens fünf Namen, die Zahl der weiteren und
 * ob die Partie gerade in einem Gambit ist.
 * Gambit heißt: Die Eröffnung, in der die Partie gerade ist, trägt „Gambit“ im Namen: der
 * Lichess-Name der Stellung (oder der zuletzt benannten davor) oder der Name des Buches, wenn das
 * Buch für die Stellung genau eine Eröffnung kennt. Mögliche spätere Gambits zählen nicht: Sonst
 * wäre schon 1. e4 „Teil eines Gambits“, weil das Königsgambit dort beginnt.
 * Beispiel: nach 1. e4 e5 2. f4 → Buch „Königsgambit“, dann Lichess „Königsgambit“ (Familie
 * deutsch) und Fortsetzungen wie „Angenommenes Königsgambit“; Gambit ja.
 * Nach 1. e4 e5 2. Sf3 Sc6 3. Lb5 → „Spanische Partie“ (Buch), „Spanische Partie“ (Lichess,
 * doppelt entfällt) …; Gambit nein.
 * Sonderfall: Kennt keine Quelle die Stellung, ist die Liste leer.
 */
export function theorienamen(
  quellen: Theoriequellen,
  fens: readonly string[],
  sans: readonly string[],
): Theorieauskunft {
  const schluessel = stellungsschluessel(fens[fens.length - 1] ?? "");
  const knoten = quellen.baum ? theorieknoten(quellen.baum, fens, sans) : [];
  const hierKnoten = knoten[knoten.length - 1] ?? null;
  const buch = buchnamen(quellen, schluessel);
  const hier = letzterName(knoten);
  const alle: Theoriename[] = [];
  const dazu = (name: string, herkunft: Theoriename["herkunft"]) => {
    if (!alle.some((n) => n.name === name)) alle.push({ name, herkunft });
  };
  for (const name of buch) dazu(name, "buch");
  if (hier) dazu(hier, "lichess");
  for (const name of fortsetzungen(hierKnoten)) dazu(name, "lichess");
  const eindeutigImBuch = buch.length === 1 ? buch[0] : undefined;
  const gerade = [hier, eindeutigImBuch].filter((n): n is string => n !== null && n !== undefined);
  return {
    namen: alle.slice(0, THEORIENAMEN_HOECHSTENS),
    weitere: Math.max(0, alle.length - THEORIENAMEN_HOECHSTENS),
    gambit: gerade.some(istGambit),
  };
}
