/**
 * Die Ringe des Fortschritts (Abbildungen, Lernziele, Trainer erstmals, besiegte Bots je Zeitart)
 * für die Karte „Dein Fortschritt“ (Fortschrittsuebersicht.tsx) und die Gratulation bei einem
 * vollen Ring (Ringfeier.tsx); eigene Datei, damit beide dieselben Zahlen zeigen.
 * Abhängigkeiten: speicher, speicher/besiegt.ts, speicher/fortschritt.ts, engine/gegner.ts,
 * app/lernstand.ts, daten/laden.ts, useDaten, zeitartzeichen.ts, i18n, lucide-react.
 */
import { Dumbbell, LayoutGrid, ListChecks } from "lucide-react";
import { abgehakt, useLernstand } from "../../../app/lernstand";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { ladeIndex, ladeNachschlagen, type Datenverzeichnis } from "../../../daten/laden";
import { GEGNER } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { botsiegeJeTempo } from "../../../speicher/besiegt";
import { erstmalsTrainiert, type Anteil } from "../../../speicher/fortschritt";
import { useSpeicher } from "../../../speicher/speicher";
import type { Symbolringangabe } from "./Symbolringe";
import { useDaten } from "../bausteine/useDaten";
import { ZEITARTZEICHEN, zeitartname } from "../bausteine/zeitartzeichen";

/** Kennungen aller vorgefertigten Bots, auch der Spaß-Bots (sie tragen ebenso Siegmarken). */
const VORGEFERTIGTE = GEGNER.map((g) => g.kennung);

/** Summe einer Zahlenliste. */
export function summe(zahlen: readonly number[]): number {
  return zahlen.reduce((gesamt, zahl) => gesamt + zahl, 0);
}

/** Abgehakte Lernziele über alle Kapitel; null, solange nachschlagen.json lädt oder ohne Ziele. */
function useLernzielanteil(): Anteil | null {
  const nachschlagen = useDaten(ladeNachschlagen, "nachschlagen");
  const stand = useLernstand();
  if (nachschlagen.art !== "fertig") return null;
  const ziele = nachschlagen.wert.lernziele;
  const gesamt = summe(ziele.map((z) => z.punkte.length));
  if (gesamt === 0) return null;
  return { erreicht: summe(ziele.map((z) => abgehakt(stand, z.kapitel, z.punkte.length))), gesamt };
}

/** Je Zeitart ein Ring: besiegte vorgefertigte Bots (Blitz, Schnellschach, Klassisch). */
function useBotringe(): Symbolringangabe[] {
  const besiegt = useSpeicher((zustand) => zustand.daten.spiel.besiegt);
  return botsiegeJeTempo(besiegt, VORGEFERTIGTE).map(({ tempo, erreicht, gesamt }) => ({
    name: t("fortschritt.botsiege", { zeitart: zeitartname(tempo) }),
    legende: zeitartname(tempo),
    symbol: ZEITARTZEICHEN[tempo],
    anteil: { erreicht, gesamt },
    testid: `ich-bots-${tempo}`,
  }));
}

/**
 * Die Ringe des Fortschritts (Buch und besiegte Bots); null, solange der Index lädt. Auch für die
 * Gratulation bei einem vollen Ring (Ringfeier.tsx, seit 0.2.144).
 */
export function useFortschrittsringe(): {
  index: Datenverzeichnis;
  buchringe: Symbolringangabe[];
  botringe: Symbolringangabe[];
} | null {
  const index = useDaten(ladeIndex, "index");
  const fortschritt = useSpeicher((zustand) => zustand.daten.fortschritt);
  const lernziele = useLernzielanteil();
  const botringe = useBotringe();
  if (index.art !== "fertig") return null;
  const alle = index.wert.kapitel.flatMap((kapitel) => kapitel.abbildungen);
  const abbildungen = {
    erreicht: alle.filter((id) => fortschritt.gesehen[id] !== undefined).length,
    gesamt: alle.length,
  };
  const buchringe: Symbolringangabe[] = [
    {
      name: t("fortschritt.abbildungen"),
      symbol: LayoutGrid,
      anteil: abbildungen,
      testid: "ich-abbildungen",
    },
    ...(lernziele
      ? [
          {
            name: t("fortschritt.lernziele"),
            symbol: ListChecks,
            anteil: lernziele,
            testid: "ich-lernziele",
          },
        ]
      : []),
    {
      name: t("fortschritt.trainerErstmals"),
      symbol: Dumbbell,
      anteil: erstmalsTrainiert(fortschritt),
      testid: "ich-trainer",
    },
  ];
  return { index: index.wert, buchringe, botringe };
}

/** Merker der Ringe, deren Gratulation schon gezeigt wurde („ich-abbildungen,ich-bots-blitz“). */
const MERKER_GEFEIERT = "ringeGefeiert";

function gefeiert(): Set<string> {
  return new Set((liesMerker(MERKER_GEFEIERT) ?? "").split(",").filter(Boolean));
}

/**
 * Merkt sich auf dem Gerät, dass zu diesem vollen Fortschrittsring schon gratuliert wurde, damit
 * die Gratulation nur einmal kommt.
 */
export function merkeGefeiert(testid: string): void {
  schreibeMerker(MERKER_GEFEIERT, [...gefeiert(), testid].join(","));
}

/** Volle Ringe ohne Gratulation, in der Reihenfolge der Profilkarte. */
export function offeneRinge(
  ringe: readonly Symbolringangabe[],
  schon: ReadonlySet<string> = gefeiert(),
): Symbolringangabe[] {
  return ringe.filter(
    (r) => r.anteil.gesamt > 0 && r.anteil.erreicht >= r.anteil.gesamt && !schon.has(r.testid),
  );
}
