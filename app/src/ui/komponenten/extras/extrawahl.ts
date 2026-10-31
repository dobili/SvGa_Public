/**
 * Wahl der Extras je Art (Gamifizierung P7): wo die Wahl steht, wie sie gelesen und gesetzt wird.
 *
 * Rolle im Gesamtbild: training/extras.ts sagt, welche Extras es gibt und wann sie frei sind;
 * diese Datei verbindet jede Art mit ihrer Wahl. Brett und Figuren stehen in den Einstellungen
 * (Speicher, gehen mit der Datensicherung um), Porträtrahmen und Konfettifarben als Merker auf
 * dem Gerät (kein neues Speicherfeld, Format gesperrt). Eine neue Art (Titel, Zubehör) bekommt
 * hier eine Zeile in `EXTRAWAHL`.
 * Abhängigkeiten: training/extras.ts, app/einstellungen.ts, app/merker.ts, app/konfetti.ts, i18n.
 */
import { useSyncExternalStore } from "react";
import {
  aendereEinstellungen,
  useEinstellungen,
  type Brettfarben,
  type Einstellungen,
  type Figurensatz,
} from "../../../app/einstellungen";
import { MERKER_KONFETTI } from "../../../app/konfetti";
import { beobachteMerker, liesMerker, schreibeMerker } from "../../../app/merker";
import type { Textschluessel } from "../../../i18n/sprache";
import type { Extraart } from "../../../training/extras";

/** Merker des Porträtrahmens: „bronze“, „silber“, „gold“; fehlt er, gibt es keinen Rahmen. */
export const MERKER_RAHMEN = "portraetrahmen";
/** Wert ohne Rahmen bzw. mit den Farben der App (zum Ablegen eines Extras). */
const OHNE_RAHMEN = "ohne";
const KONFETTI_APP = "app";

/** Wie eine Art gewählt wird. */
interface Extrawahl {
  readonly art: Extraart;
  /** Überschrift der Art in der Profilkarte. */
  readonly titel: Textschluessel;
  /** Der freie Wert, zu dem „Ablegen“ zurückkehrt; null, wenn die Wahl in den Einstellungen steht. */
  readonly ohne: string | null;
  readonly lies: (einstellungen: Einstellungen) => string;
  readonly waehle: (wert: string) => void;
}

/** Je Art eine Zeile. */
export const EXTRAWAHL: readonly Extrawahl[] = [
  {
    art: "rahmen",
    titel: "extras.art.rahmen",
    ohne: OHNE_RAHMEN,
    lies: () => liesMerker(MERKER_RAHMEN) ?? OHNE_RAHMEN,
    waehle: (wert) => schreibeMerker(MERKER_RAHMEN, wert),
  },
  {
    art: "brett",
    titel: "extras.art.brett",
    ohne: null,
    lies: (e) => e.brettfarben,
    waehle: (wert) => aendereEinstellungen({ brettfarben: wert as Brettfarben }),
  },
  {
    art: "figuren",
    titel: "extras.art.figuren",
    ohne: null,
    lies: (e) => e.figurensatz,
    waehle: (wert) => aendereEinstellungen({ figurensatz: wert as Figurensatz }),
  },
  {
    art: "konfetti",
    titel: "extras.art.konfetti",
    ohne: KONFETTI_APP,
    lies: () => liesMerker(MERKER_KONFETTI) ?? KONFETTI_APP,
    waehle: (wert) => schreibeMerker(MERKER_KONFETTI, wert),
  },
];

/** Die Wahl einer Art. */
export function extrawahl(art: Extraart): Extrawahl | undefined {
  return EXTRAWAHL.find((w) => w.art === art);
}

/** Zähler, der bei jeder Änderung eines Merkers dieser Datei steigt (für useSyncExternalStore). */
let fassung = 0;
const zuhoerer = new Set<() => void>();
beobachteMerker((name) => {
  if (name !== MERKER_RAHMEN && name !== MERKER_KONFETTI) return;
  fassung += 1;
  for (const z of zuhoerer) z();
});

function useMerkerfassung(): number {
  return useSyncExternalStore(
    (z) => {
      zuhoerer.add(z);
      return () => zuhoerer.delete(z);
    },
    () => fassung,
  );
}

/** Der gewählte Wert je Art; zeichnet neu, wenn Einstellungen oder Merker sich ändern. */
export function useGewaehlteExtras(): Readonly<Record<string, string>> {
  const einstellungen = useEinstellungen();
  useMerkerfassung();
  return Object.fromEntries(EXTRAWAHL.map((w) => [w.art, w.lies(einstellungen)]));
}

/** Der gewählte Porträtrahmen („ohne“, „bronze“ …); für das Spielerbild. */
export function usePortraetrahmen(): string {
  useMerkerfassung();
  return liesMerker(MERKER_RAHMEN) ?? OHNE_RAHMEN;
}
