/**
 * Lage und Satz für „Dein nächster Schritt“ (Gamifizierung P1), getrennt von der Karte, damit
 * auch der Monatsrückblick (P12, Abschnitt „Dein nächster Schritt für November“) denselben
 * Vorschlag zeigt.
 *
 * Rolle im Gesamtbild: Stellt die Lage zusammen (Speicher, Datenverzeichnis, Übungen der fast
 * gelesenen Kapitel, Merker „zuletzt“ und „tagesserie“) und übersetzt den Satz eines Vorschlags.
 * Die Vorschläge selbst rechnet training/naechsterSchritt.ts.
 * Abhängigkeiten: training/naechsterSchritt.ts, daten/laden.ts, Speicher, Merker, i18n.
 */
import { useFaelligeUebersicht } from "../training/vorhandeneAufgaben";
import { liesMerker } from "../../../app/merker";
import { ladeIndex, ladeKapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { serieAus } from "../../../training/kurzplaene";
import {
  kapitelFuerUebungen,
  tagesaufgabeHeuteErledigt,
  type Kapitelangabe,
  type Lage,
  type Vorschlag,
} from "../../../training/naechsterSchritt";
import { useDaten } from "../bausteine/useDaten";

const MERKER_ZULETZT = "zuletzt";
const MERKER_SERIE = "tagesserie";
const KEINE_KAPITEL: readonly Kapitelangabe[] = [];

/** Lädt die Übungskennungen der genannten Kapitel (aus dem Zwischenspeicher, wenn geladen). */
async function ladeUebungen(kapitel: readonly number[]): Promise<Record<number, string[]>> {
  const geladen = await Promise.all(kapitel.map((nummer) => ladeKapitel(nummer)));
  return Object.fromEntries(geladen.map((k) => [k.kapitel, k.uebungen.map((u) => u.id)]));
}

/** Der Satz eines Vorschlags; Namen (Thema, Trainer) werden erst hier übersetzt. */
export function vorschlagstext(vorschlag: Vorschlag): string {
  const namen = Object.fromEntries(
    Object.entries(vorschlag.namen ?? {}).map(([platz, schluessel]) => [platz, t(schluessel)]),
  );
  return t(vorschlag.text, { ...vorschlag.werte, ...namen });
}

/** Die Lage aus Speicher, Verzeichnis und Merkern; die Übungen kommen nach dem Laden dazu. */
export function useLage(): Lage | null {
  const daten = useSpeicher((z) => z.daten);
  // Dieselbe Zahl wie in der Übersicht im Training (ohne verwaiste Karten).
  const { gesamt } = useFaelligeUebersicht();
  const index = useDaten(ladeIndex, "index");
  const kapitel = index.art === "fertig" ? index.wert.kapitel : KEINE_KAPITEL;
  const kandidaten = kapitelFuerUebungen(daten, kapitel);
  const uebungen = useDaten(
    () => ladeUebungen(kandidaten),
    `naechster-uebungen-${kandidaten.join(",")}`,
  );
  if (index.art !== "fertig") return null;
  const jetzt = new Date();
  return {
    daten,
    kapitel,
    uebungen: uebungen.art === "fertig" ? uebungen.wert : {},
    zuletzt: liesMerker(MERKER_ZULETZT),
    tagesaufgabeErledigt: tagesaufgabeHeuteErledigt(
      daten,
      serieAus(liesMerker(MERKER_SERIE)),
      jetzt,
    ),
    jetzt,
    faelligAnzahl: gesamt,
  };
}
