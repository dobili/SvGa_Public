/**
 * Hilfen der eigenen Ziele (Gamifizierung P13) für die Oberfläche: Texte übersetzen, Kontext
 * laden, Knöpfe ausführen, erreichte Ziele prüfen und einmal feiern.
 *
 * Rolle im Gesamtbild: Die Rechnung steht rein in training/ziel*.ts; hier kommen Speicher,
 * Verzeichnis der Kapitel, Navigation und der Einstieg „Partie gegen diesen Bot“
 * (spielstart/vorbelegung.ts, Bot und Zeitart vorbelegt, gewertet) dazu.
 * Feier: Der Merker `zieleGefeiert` hält den Zeitpunkt des zuletzt gefeierten Ziels; gefeiert wird
 * jedes später erreichte Ziel der letzten sieben Tage, auch wenn es in einer Partie erreicht wurde
 * (dann beim nächsten Blick auf die Wochenkarte).
 * Abhängigkeiten: training/ziele.ts, training/zieltypen.ts, app/merker.ts, Navigation, Speicher,
 * daten/laden.ts, bausteine/useDaten.ts, spielstart/vorbelegung.ts, i18n.
 */
import { useEffect, useState } from "react";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { useNavigation } from "../../../app/navigationsKontext";
import { ladeIndex } from "../../../daten/laden";
import { t, tZahl } from "../../../i18n/sprache";
import type { Ziel, Zielstand } from "../../../speicher/gamifizierung";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { pruefeZiele, zielErreicht } from "../../../training/ziele";
import type { Hinfuehrung, Zielkontext, Zieltext } from "../../../training/zieltypen";
import { useDaten } from "../bausteine/useDaten";
import { useSpielvorbelegung } from "../spielstart/vorbelegung";

/** Merker: ISO-Zeitpunkt des zuletzt gefeierten Ziels. */
export const MERKER_ZIELE_GEFEIERT = "zieleGefeiert";
/** Nur so frisch erreichte Ziele werden noch gefeiert (etwa nach einer Datensicherung nicht). */
const FEIER_TAGE = 7;
const MS_JE_TAG = 86_400_000;

/** Übersetzt einen Zieltext mit Namen und eingesetzten Texten. Beispiel: „Besiege Lotte in Blitz.“ */
export function zieltext(text: Zieltext): string {
  const namen = Object.entries(text.namen ?? {}).map(([k, s]) => [k, t(s)] as const);
  const unter = Object.entries(text.unter ?? {}).map(([k, u]) => [k, zieltext(u)] as const);
  const werte = { ...text.werte, ...Object.fromEntries([...namen, ...unter]) };
  // Einzahl („1 Bot“) über den Schlüssel „…Eins“, wenn der Text eine Zahl n hat.
  const n = text.werte.n;
  return typeof n === "number" ? tZahl(text.schluessel, n, werte) : t(text.schluessel, werte);
}

/** Kontext aus Speicher und Verzeichnis der Kapitel (null, solange es lädt). */
export function useZielkontext(): Zielkontext {
  const daten = useSpeicher((z) => z.daten);
  const index = useDaten(ladeIndex, "index");
  return { daten, kapitel: index.art === "fertig" ? index.wert.kapitel : null };
}

/** Prüft angeheftete Ziele, sobald eines erreicht ist (etwa ein Ring eines Buchteils). */
export function useZielpruefung(kontext: Zielkontext): void {
  const { daten, kapitel } = kontext;
  const faellig = daten.ziele.angeheftet.some((z) => zielErreicht(z, kontext));
  useEffect(() => {
    if (!faellig) return;
    void aendere((d) => pruefeZiele(d, kapitel, new Date()).daten);
  }, [faellig, kapitel]);
}

/** Erreichte Ziele, die noch gefeiert werden (nach dem Merker, höchstens sieben Tage alt). */
export function zuFeiern(
  erreicht: Zielstand["erreicht"],
  merker: string | null,
  jetzt: Date,
): Ziel[] {
  const grenze = jetzt.getTime() - FEIER_TAGE * MS_JE_TAG;
  return erreicht
    .filter((e) => (merker === null || e.datum > merker) && Date.parse(e.datum) >= grenze)
    .map((e) => e.ziel);
}

/**
 * Die eben erreichten Ziele für die Feier; merkt sie sich, damit jede Feier einmal kommt.
 * Der Merker wird beim Einblenden gelesen; was danach erreicht wird, feiert die Karte sofort mit.
 */
export function useZielfeier(erreicht: Zielstand["erreicht"]): Ziel[] {
  const [merker] = useState(() => liesMerker(MERKER_ZIELE_GEFEIERT));
  const [jetzt] = useState(() => new Date());
  const feier = zuFeiern(erreicht, merker, jetzt);
  const neueste = erreicht.reduce((m, e) => (e.datum > m ? e.datum : m), "");
  const etwas = feier.length > 0;
  useEffect(() => {
    if (etwas) schreibeMerker(MERKER_ZIELE_GEFEIERT, neueste);
  }, [etwas, neueste]);
  return feier;
}

/** Führt den Knopf eines Ziels aus: Partie vorbelegen oder Ansicht öffnen. */
export function useHinfuehrung(): (hin: Hinfuehrung) => void {
  const { navigiere } = useNavigation();
  const spiele = useSpielvorbelegung();
  return (hin) => {
    if (hin.art === "spielen") spiele({ bot: hin.bot, tempo: hin.tempo });
    else navigiere(hin.ansicht);
  };
}
