/**
 * Mamas Turnierheft als Partienotizbuch (docs/spiel/11, I4; Story-Bibel Szene 39a): Nach jeder
 * Partie hält Ambrose die wichtigsten Momente fest, das Tagebuch zeigt die letzten Partien.
 *
 * Rolle im Gesamtbild: reine Aufbereitung des Partieprotokolls im Spielstand (`protokoll`, jede
 * Partie mit ihren Schlüsselmomenten aus der Auswertung der App) für oberwelt/Tagebuch.tsx.
 * Abhängigkeiten: schnittstelle/spielstand.ts, daten/laden.ts, texte/texte.ts.
 */
import type { Gegnerdaten } from "../daten/laden";
import type { Schluesselmoment } from "../schnittstelle/partie";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { tSpiel } from "../texte/texte";

/** So viele Partien zeigt das Heft (die neuesten zuerst). */
export const NOTIZPARTIEN = 5;
/** So viele Momente je Partie: wie Mamas „drei Sätze“. */
export const NOTIZMOMENTE = 3;

/** Ein Eintrag im Heft: Gegner und Ausgang, darunter die Momente. */
export interface Notiz {
  readonly titel: string;
  readonly momente: readonly string[];
}

/** Zugnummer wie im Buch: Halbzug 0 → „1.“, Halbzug 1 → „1…“. */
function zugnummer(halbzug: number): string {
  const nummer = Math.floor(halbzug / 2) + 1;
  return halbzug % 2 === 0 ? `${nummer}.` : `${nummer}…`;
}

/** Ein Moment als Satz: „Zug 12.: Sxe5, besser war Ld3“. */
function momentsatz(m: Schluesselmoment): string {
  const zug = zugnummer(m.halbzug);
  return tSpiel("tagebuch.notizMoment", {
    zug,
    gespielt: m.gespielt,
    besser: m.besser ? tSpiel("tagebuch.notizBesser", { zug: m.besser }) : "",
  });
}

/**
 * Die Notizen der letzten Partien. Die Momente in der Reihenfolge der Partie, höchstens drei, die
 * größten Verluste zuerst ausgewählt (die Wendepunkte).
 * Beispiel: Clubkampf gegen Coach Delgado verloren → „Gegen Coach Delgado: verloren“ mit drei Zügen.
 */
export function notizen(stand: Abenteuerstand, gegner: readonly Gegnerdaten[]): Notiz[] {
  return stand.protokoll
    .slice(-NOTIZPARTIEN)
    .reverse()
    .map((eintrag) => {
      const daten = gegner.find((g) => g.kennung === eintrag.gegner);
      const titel = tSpiel("tagebuch.notizPartie", {
        gegner: tSpiel(daten?.name ?? eintrag.gegner),
        ausgang: tSpiel(`tagebuch.ausgang.${eintrag.ergebnis.ausgang}`),
      });
      const momente = [...eintrag.ergebnis.momente]
        .sort((a, b) => b.verlust - a.verlust)
        .slice(0, NOTIZMOMENTE)
        .sort((a, b) => a.halbzug - b.halbzug)
        .map(momentsatz);
      return { titel, momente };
    });
}
