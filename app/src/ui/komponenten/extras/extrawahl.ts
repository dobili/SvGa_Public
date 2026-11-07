/**
 * Wahl der Extras je Art (Gamifizierung P7): wo die Wahl steht, wie sie gelesen und gesetzt wird.
 *
 * Rolle im Gesamtbild: training/extras.ts sagt, welche Extras es gibt und wann sie frei sind;
 * diese Datei verbindet jede Art mit ihrer Wahl. Brett und Figuren stehen in den Einstellungen
 * (Speicher, gehen mit der Datensicherung um), Porträtrahmen und Konfettifarben als Merker auf
 * dem Gerät (kein neues Speicherfeld, Format gesperrt), ebenso der Titel unter dem Namen (P3).
 * Eine neue Art (etwa Zubehör) bekommt hier eine Zeile in `EXTRAWAHL`; die Profilkarte zeigt sie
 * dann mit eigenem Reiter, in der Vorschau oben und mit „Ablegen“ (seit 31.10.2026).
 * Seit „Aussehen im Profil“ (Wunsch des Autors, 7.11.2026) wählt man Brett und Figuren nur noch
 * in der Profilkarte: `grundwerte` nennt die immer freien Werte einer Art (alle Brettfarben und
 * Figurensätze, die kein Extra sind), `Zusatz` eine Zeile unter den Kacheln (Koordinaten beim
 * Brett). Ein neues Brett in speicher/format.ts erscheint so von selbst in der Karte.
 * Abhängigkeiten: training/extras.ts, app/einstellungen.ts, app/merker.ts, app/konfetti.ts,
 * speicher/format.ts (Standard und Listen der Einstellungen), Koordinatenschalter.tsx, i18n.
 */
import { useSyncExternalStore, type ComponentType } from "react";
import {
  aendereEinstellungen,
  BILDSAETZE,
  useEinstellungen,
  type Brettfarben,
  type Einstellungen,
  type Figurensatz,
} from "../../../app/einstellungen";
import { MERKER_KONFETTI } from "../../../app/konfetti";
import { beobachteMerker, liesMerker, schreibeMerker } from "../../../app/merker";
import { istTextschluessel, t } from "../../../i18n/sprache";
import { BRETTARTEN, STANDARD_EINSTELLUNGEN } from "../../../speicher/format";
import { extraZu, type Extraart } from "../../../training/extras";
import { Koordinatenschalter } from "./Koordinatenschalter";

/** Merker des Porträtrahmens: „bronze“, „silber“, „gold“; fehlt er, gibt es keinen Rahmen. */
export const MERKER_RAHMEN = "portraetrahmen";
/** Merker des Titels unter dem Namen (P3): „taktiker“ …; fehlt er, steht kein Titel. */
export const MERKER_TITEL = "profiltitel";
/** Wert ohne Rahmen bzw. mit den Farben der App (zum Ablegen eines Extras). */
const OHNE_RAHMEN = "ohne";
const OHNE_TITEL = "ohne";
const KONFETTI_APP = "app";

/**
 * Wo eine Art in der Vorschau „So siehst du gerade aus“ erscheint: am Porträt (Rahmen, Titel)
 * oder als Zeile neben dem Mini-Brett (Brett, Figuren, Konfetti, jede neue Art).
 */
export type Buehnenort = "portraet" | "zeile";

/** Wie eine Art gewählt wird. */
interface Extrawahl {
  readonly art: Extraart;
  /** Der Wert, zu dem „Ablegen“ zurückkehrt (bei Brett und Figuren der Standard „wie im Buch“). */
  readonly ohne: string;
  readonly ort: Buehnenort;
  readonly lies: (einstellungen: Einstellungen) => string;
  readonly waehle: (wert: string) => void;
  /** Name eines Werts, der kein Extra ist (etwa „holz“ → „Holz“, „app“ → „Farben der App“). */
  readonly name: (wert: string) => string;
  /** Immer freie Werte, die vor den Extras als Kacheln stehen (Brett: „wie im Buch“, „Grün“ …). */
  readonly grundwerte?: readonly string[];
  /** Eine Zeile unter den Kacheln dieser Art (Brett: Schalter „Koordinaten“). */
  readonly Zusatz?: ComponentType;
}

/** Die Werte einer Art ohne die, die ein Extra sind. Beispiel: Bretter ohne „nacht-gold“. */
function ohneExtras(art: Extraart, werte: readonly string[]): readonly string[] {
  return werte.filter((wert) => !extraZu(art, wert));
}

/**
 * Text eines Schlüssels, sonst der Wert selbst. Der Schlüssel steht als Vorlage im Aufruf, damit
 * die Prüfung auf ungenutzte Texte (i18n/ungenutzt.test.ts) ihn findet.
 * Beispiel: („einstellungen.brettfarben.holz“, „holz“) → „Ahorn & Nussbaum“.
 */
function textOder(schluessel: string, wert: string): string {
  return istTextschluessel(schluessel) ? t(schluessel) : wert;
}

/** Je Art eine Zeile. */
export const EXTRAWAHL: readonly Extrawahl[] = [
  {
    art: "rahmen",
    ohne: OHNE_RAHMEN,
    ort: "portraet",
    lies: () => liesMerker(MERKER_RAHMEN) ?? OHNE_RAHMEN,
    waehle: (wert) => schreibeMerker(MERKER_RAHMEN, wert),
    name: () => t("extrasneu.ohne"),
  },
  {
    art: "brett",
    ohne: STANDARD_EINSTELLUNGEN.brettfarben,
    ort: "zeile",
    lies: (e) => e.brettfarben,
    waehle: (wert) => aendereEinstellungen({ brettfarben: wert as Brettfarben }),
    name: (wert) => textOder(`einstellungen.brettfarben.${wert}`, wert),
    grundwerte: ohneExtras("brett", BRETTARTEN),
    Zusatz: Koordinatenschalter,
  },
  {
    art: "figuren",
    ohne: STANDARD_EINSTELLUNGEN.figurensatz,
    ort: "zeile",
    lies: (e) => e.figurensatz,
    waehle: (wert) => aendereEinstellungen({ figurensatz: wert as Figurensatz }),
    name: (wert) => textOder(`einstellungen.figurensatz.${wert}`, wert),
    grundwerte: ohneExtras("figuren", ["buch", ...BILDSAETZE]),
  },
  {
    art: "konfetti",
    ohne: KONFETTI_APP,
    ort: "zeile",
    lies: () => liesMerker(MERKER_KONFETTI) ?? KONFETTI_APP,
    waehle: (wert) => schreibeMerker(MERKER_KONFETTI, wert),
    name: () => t("extrasneu.konfetti.app"),
  },
  {
    art: "titel",
    ohne: OHNE_TITEL,
    ort: "portraet",
    lies: () => liesMerker(MERKER_TITEL) ?? OHNE_TITEL,
    waehle: (wert) => schreibeMerker(MERKER_TITEL, wert),
    name: () => t("extrasneu.ohne"),
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
  if (name !== MERKER_RAHMEN && name !== MERKER_KONFETTI && name !== MERKER_TITEL) return;
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

/** Der gewählte Titel („ohne“, „taktiker“ …); für die Zeile unter dem Namen im Profil (P3). */
export function useProfiltitel(): string {
  useMerkerfassung();
  return liesMerker(MERKER_TITEL) ?? OHNE_TITEL;
}

/** Der gewählte Porträtrahmen („ohne“, „bronze“ …); für das Spielerbild. */
export function usePortraetrahmen(): string {
  useMerkerfassung();
  return liesMerker(MERKER_RAHMEN) ?? OHNE_RAHMEN;
}
