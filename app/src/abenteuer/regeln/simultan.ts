/**
 * Simultan (Partieform der Runde 6, Weltschachtag auf Weg 11; docs/spiel/15, Abschnitt 4,
 * Punkt 4): mehrere Stellungsduelle hintereinander, zusammen gewertet.
 *
 * Rolle im Gesamtbild: Reine Logik für oberwelt/Oberwelt.tsx (getestet in simultan.test.ts). Weil
 * die Oberwelt für jede Partie verlassen wird, steht der Fortschritt in den Dialogvariablen des
 * Spielstands: `simultan.laeuft` (Kennung), `simultan.brett` (Index), `simultan.punkte`.
 * Am Ende: `<name>Bestanden` wie bei Aufgabenrunden und `<name>Punkte` für die Dialoge.
 * Beispiel: drei Bretter, mindestens 2: Sieg, Remis, Sieg → 2,5 Punkte, bestanden.
 */
import { variablenNachRunde } from "./dialogvariablen";

/** Ein Simultan aus partieformen.json. */
export interface Simultaneintrag {
  readonly kennung: string;
  readonly begegnungen: readonly string[];
  readonly mindestens: number;
}

type Variablen = Readonly<Record<string, number | string | boolean>>;

export const LAEUFT = "simultan.laeuft";
export const BRETT = "simultan.brett";
export const PUNKTE = "simultan.punkte";

/** Punkte je Ausgang aus Sicht des Lesers. */
const PUNKTE_JE_AUSGANG: Readonly<Record<string, number>> = { sieg: 1, remis: 0.5 };

/** Variablen zum Beginn eines Simultans; die erste Begegnung spielt der Aufrufer. */
export function starteSimultan(variablen: Variablen, eintrag: Simultaneintrag): Variablen {
  return { ...variablen, [LAEUFT]: eintrag.kennung, [BRETT]: 0, [PUNKTE]: 0 };
}

/** Das laufende Simultan (Kennung), sonst null. */
export function laufendesSimultan(variablen: Variablen): string | null {
  const laeuft = variablen[LAEUFT];
  return typeof laeuft === "string" && laeuft.length > 0 ? laeuft : null;
}

/** Was nach einer Partie im Simultan folgt. */
export interface Simultanschritt {
  readonly variablen: Variablen;
  /** Die nächste Begegnung, oder null am Ende. */
  readonly naechste: string | null;
  /** Am Ende: Punkte und ob bestanden; sonst null. */
  readonly ende: { readonly punkte: number; readonly bestanden: boolean } | null;
}

/**
 * Wertet eine beendete Partie des Simultans und nennt die nächste Begegnung oder das Ende.
 * Sonderfall: Gehört die Partie nicht zum laufenden Brett, ändert sich nichts.
 */
export function nachSimultanpartie(
  variablen: Variablen,
  eintrag: Simultaneintrag,
  begegnung: string,
  ausgang: string,
): Simultanschritt {
  const brett = Number(variablen[BRETT] ?? 0);
  if (
    laufendesSimultan(variablen) !== eintrag.kennung ||
    eintrag.begegnungen[brett] !== begegnung
  ) {
    return { variablen, naechste: null, ende: null };
  }
  const punkte = Number(variablen[PUNKTE] ?? 0) + (PUNKTE_JE_AUSGANG[ausgang] ?? 0);
  const naechste = eintrag.begegnungen[brett + 1] ?? null;
  if (naechste) {
    return {
      variablen: { ...variablen, [BRETT]: brett + 1, [PUNKTE]: punkte },
      naechste,
      ende: null,
    };
  }
  const bestanden = punkte >= eintrag.mindestens;
  const name = eintrag.kennung.split(".").pop() ?? eintrag.kennung;
  return {
    variablen: {
      ...variablen,
      [LAEUFT]: "",
      [BRETT]: 0,
      [PUNKTE]: 0,
      [`${name}Punkte`]: punkte,
      ...variablenNachRunde(eintrag.kennung, bestanden),
    },
    naechste: null,
    ende: { punkte, bestanden },
  };
}
