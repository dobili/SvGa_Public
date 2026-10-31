/**
 * Anbindung von Erfahrungspunkten und Abzeichen an Speicher und Merker: was erreicht ist, was
 * schon gefeiert wurde und was die Probe des Autors gerade vorspielt.
 *
 * Rolle im Gesamtbild: Die Rechnung steht rein in erfahrung.ts und abzeichen.ts. Hier kommen die
 * Nutzerdaten (Speicher) und drei Merker auf dem Gerät dazu, wie bei den Orden
 * (fortschrittsringe.ts, ordenprobe.ts), ohne neues Feld im Speicher:
 * - „abzeichenGefeiert“: Abzeichen, zu denen die Meldung schon kam; sie bleiben verdient, auch wenn
 *   ihre Partie später aus der Liste der letzten 50 fällt.
 * - „stufeGefeiert“: die höchste Stufe, zu der die Meldung schon kam.
 * - „abzeichenProbe“ und „erfahrungProbe“: die Probe der Aufgabenseite (geprobte Abzeichen,
 *   zusätzliche EP); echte Daten bleiben unberührt.
 * Der Merker „abzeichenStill“ unterdrückt die Meldungen (für die Oberflächentests, die sonst nach
 * der ersten Partie oder Übung eine Meldung vor dem Brett hätten).
 * Abhängigkeiten: erfahrung.ts, abzeichen.ts, speicher, app/merker.ts, training/kurzplaene.ts
 * (Serie der Tagesaufgabe, nur lesen), React.
 */
import { useMemo, useSyncExternalStore } from "react";
import { beobachteMerker, entferneMerker, liesMerker, schreibeMerker } from "../../../app/merker";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { mitVerdient } from "../../../speicher/verdient";
import { serieAus } from "../../../training/kurzplaene";
import {
  ABZEICHEN,
  abzeichengrundlageAus,
  brillanterZug,
  erfuellteAbzeichen,
  type Abzeichenkennung,
} from "./abzeichen";
import { erfahrungspunkte, STUFEN, stufeZu, type Erfahrungsstufe } from "./erfahrung";

const MERKER_GEFEIERT = "abzeichenGefeiert";
const MERKER_STUFE = "stufeGefeiert";
const MERKER_PROBE = "abzeichenProbe";
const MERKER_EP_PROBE = "erfahrungProbe";
const MERKER_STILL = "abzeichenStill";
/** Merker der Tagesaufgabe (ui/trainer/ZeitrundeBereich.tsx), hier nur gelesen. */
const MERKER_TAGESSERIE = "tagesserie";
const TRENNER = ",";

/** Alle Merker dieser Datei als Stand, damit React bei jeder Änderung neu zeichnet. */
interface Merkerstand {
  readonly gefeiert: ReadonlySet<string>;
  /** Höchste gefeierte Stufe; null, solange es noch keinen Merker gibt (erster Start). */
  readonly stufeGefeiert: number | null;
  readonly probe: ReadonlySet<string>;
  readonly epProbe: number;
  readonly still: boolean;
  readonly tagesserie: number;
}

function liste(name: string): ReadonlySet<string> {
  return new Set((liesMerker(name) ?? "").split(TRENNER).filter(Boolean));
}

function zahl(name: string): number | null {
  const wert = Number(liesMerker(name) ?? Number.NaN);
  return Number.isFinite(wert) ? wert : null;
}

function lies(): Merkerstand {
  return {
    gefeiert: liste(MERKER_GEFEIERT),
    stufeGefeiert: zahl(MERKER_STUFE),
    probe: liste(MERKER_PROBE),
    epProbe: zahl(MERKER_EP_PROBE) ?? 0,
    still: liesMerker(MERKER_STILL) === "ja",
    tagesserie: serieAus(liesMerker(MERKER_TAGESSERIE)).beste,
  };
}

const zuhoerer = new Set<() => void>();
let stand = lies();

function melde(): void {
  stand = lies();
  for (const z of zuhoerer) z();
}

// Die Tagesaufgabe (ui/trainer/ZeitrundeBereich.tsx) schreibt die Serie selbst; ohne diese Meldung
// kämen Erfahrungspunkte und „Eine Woche dabei“ erst nach einem Neuladen.
beobachteMerker((name) => {
  if (name === MERKER_TAGESSERIE) melde();
});

function useMerker(): Merkerstand {
  return useSyncExternalStore(
    (z) => {
      zuhoerer.add(z);
      return () => zuhoerer.delete(z);
    },
    () => stand,
  );
}

/** Was Profil und Meldung zeigen. */
export interface Abzeichenstand {
  readonly stufe: Erfahrungsstufe;
  /** Verdiente Abzeichen: erfüllt, schon gefeiert oder zur Probe. */
  readonly verdient: ReadonlySet<Abzeichenkennung>;
  /** Verdient, aber noch ohne Meldung, in der Reihenfolge des Gitters. */
  readonly neu: readonly Abzeichenkennung[];
  /** Eine höhere Stufe als die zuletzt gefeierte ist erreicht. */
  readonly neueStufe: boolean;
  /** Meldungen unterdrückt (Merker „abzeichenStill“). */
  readonly still: boolean;
  /** Erster Start: Die erreichte Stufe ist noch nicht gemerkt (merkeErsteStufe). */
  readonly stufeUngemerkt: boolean;
}

/** Stand der Erfahrung und der Abzeichen; null, solange der Speicher lädt. */
export function useAbzeichenstand(): Abzeichenstand | null {
  const geladen = useSpeicher((z) => z.geladen);
  const daten = useSpeicher((z) => z.daten);
  const merker = useMerker();
  // Die Zugklassen aller Partien zu rechnen ist teuer: nur bei neuen Partien und nur, solange das
  // Abzeichen noch nicht gefeiert ist.
  const schonBrillant = merker.gefeiert.has("brillant");
  const brillant = useMemo(
    () => schonBrillant || brillanterZug(daten.spiel.partien),
    [schonBrillant, daten.spiel.partien],
  );
  return useMemo(() => {
    if (!geladen) return null;
    const grundlage = abzeichengrundlageAus(daten, merker.tagesserie, brillant);
    const erfuellt = new Set<string>(erfuellteAbzeichen(grundlage));
    const verdient = new Set(
      ABZEICHEN.map((a) => a.kennung).filter(
        (k) => erfuellt.has(k) || merker.gefeiert.has(k) || merker.probe.has(k),
      ),
    );
    const stufe = stufeZu(erfahrungspunkte(grundlage) + merker.epProbe);
    return {
      stufe,
      verdient,
      neu: [...verdient].filter((k) => !merker.gefeiert.has(k)),
      neueStufe: merker.stufeGefeiert !== null && stufe.nummer > merker.stufeGefeiert,
      still: merker.still,
      stufeUngemerkt: merker.stufeGefeiert === null,
    };
  }, [geladen, daten, merker, brillant]);
}

/**
 * Nach der Meldung: Abzeichen und Stufe als gefeiert merken, damit die Meldung nur einmal kommt.
 * Beim ersten Start (noch kein Merker der Stufe) merkt die Meldung die Stufe ohne Aufstieg.
 */
export function merkeGefeiert(kennungen: readonly string[], stufe: number): void {
  // Gamifizierung G3: das Datum der ersten Feier in die Nutzerdaten (nicht für Proben).
  const echte = kennungen.filter((k) => !stand.probe.has(k)).map((k) => `abzeichen:${k}`);
  if (echte.length > 0) void aendere((d) => mitVerdient(d, echte, new Date()));
  schreibeMerker(MERKER_GEFEIERT, [...stand.gefeiert, ...kennungen].join(TRENNER));
  schreibeMerker(MERKER_STUFE, String(Math.max(stufe, stand.stufeGefeiert ?? 0)));
  melde();
}

/** Beim ersten Start die erreichte Stufe still merken: Aufstiege zählen erst ab jetzt. */
export function merkeErsteStufe(stufe: number): void {
  if (stand.stufeGefeiert !== null) return;
  schreibeMerker(MERKER_STUFE, String(stufe));
  melde();
}

/** Probe: ein Abzeichen gilt als verdient. Beispiel: probeAbzeichen("brillant"). */
export function probeAbzeichen(kennung: Abzeichenkennung): void {
  schreibeMerker(MERKER_PROBE, [...stand.probe, kennung].join(TRENNER));
  melde();
}

/** Probe: so viele EP dazu, dass die nächste Stufe erreicht ist (auf der höchsten nichts). */
export function probeNaechsteStufe(stufe: Erfahrungsstufe): void {
  if (stufe.naechsteAb === null) return;
  schreibeMerker(MERKER_EP_PROBE, String(stand.epProbe + stufe.naechsteAb - stufe.ep));
  melde();
}

/**
 * Beendet die Probe: geprobte Abzeichen und EP fallen weg, ihre Meldungen sind vergessen, und die
 * gefeierte Stufe gilt wieder ab der echten. Eingabe: die EP, wie sie gerade angezeigt werden
 * (mit Probe).
 */
export function beendeAbzeichenprobe(epMitProbe: number): void {
  const geprobt = stand.probe;
  const echteStufe = stufeZu(epMitProbe - stand.epProbe).nummer;
  schreibeMerker(MERKER_GEFEIERT, [...stand.gefeiert].filter((k) => !geprobt.has(k)).join(TRENNER));
  schreibeMerker(MERKER_STUFE, String(echteStufe));
  entferneMerker(MERKER_PROBE);
  entferneMerker(MERKER_EP_PROBE);
  melde();
}

/** Läuft gerade eine Probe? */
export function useAbzeichenprobeAktiv(): boolean {
  const merker = useMerker();
  return merker.probe.size > 0 || merker.epProbe > 0;
}

/** Zahl aller Stufen (für „Stufe 3 von 10“). */
export const STUFENZAHL = STUFEN.length;
