/**
 * Die Ringe des Fortschritts für die Karte „Dein Fortschritt“ (Fortschrittsuebersicht.tsx) und die
 * Gratulation bei einem vollen Ring (Ringfeier.tsx); eigene Datei, damit beide dieselben Zahlen
 * zeigen. Drei Gruppen: das Buch (Abbildungen, Übungen, Lernziele, Trainer), die fünf Teile des
 * Buches und die Bündel der Bots (Wunsch des Autors, 26.10.2026: jeder volle Ring wird ein Orden).
 * Die Rechnung der neuen Ringe steht in ringrechnung.ts.
 * Abhängigkeiten: ringrechnung.ts, speicher, speicher/fortschritt.ts, app/lernstand.ts,
 * daten/laden.ts, useDaten, i18n, lucide-react.
 */
import {
  Bot,
  ClipboardCheck,
  Cpu,
  Crown,
  DoorOpen,
  Dumbbell,
  LayoutGrid,
  ListChecks,
  Sprout,
  Swords,
  Target,
  Timer,
  type LucideIcon,
} from "lucide-react";
import { abgehakt, useLernstand } from "../../../app/lernstand";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { ladeIndex, ladeNachschlagen, type Datenverzeichnis } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { erstmalsTrainiert, type Anteil } from "../../../speicher/fortschritt";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { mitVerdient } from "../../../speicher/verdient";
import { useOrdenprobe } from "./ordenprobe";
import { ordenkennungAusRing } from "../ordenkunst/entwuerfe";
import type { Symbolringangabe } from "./Symbolringe";
import { useDaten } from "../bausteine/useDaten";
import {
  BOTBUENDEL,
  BUCHTEILE,
  botsDesBuendels,
  buendelanteil,
  ENGINEBUENDEL,
  istVoll,
  teilanteil,
  uebungsanteil,
  type Buchteil,
} from "./ringrechnung";

/** Zeichen der Teile des Buches. */
const TEILZEICHEN: Readonly<Record<Buchteil, LucideIcon>> = {
  grundlagen: Sprout,
  eroeffnung: DoorOpen,
  mittelspiel: Swords,
  endspiel: Crown,
  praxis: Target,
};

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

/**
 * Die Ringe der Bots: je Bündel der Stufen „alle einmal besiegt“ und „alle in allen Zeitarten
 * besiegt“; das Bündel der Engine (Stufe 10) nur „einmal“, der Superorden.
 */
function useBotringe(): Symbolringangabe[] {
  const besiegt = useSpeicher((zustand) => zustand.daten.spiel.besiegt);
  return BOTBUENDEL.flatMap(({ kennung }) => {
    const bots = botsDesBuendels(kennung);
    const stufen = t("fortschritt.buendel", { stufen: kennung.replace("-", "–") });
    if (kennung === ENGINEBUENDEL) {
      const anteil = buendelanteil(besiegt, bots, "einmal");
      return [
        {
          name: t("fortschritt.engine"),
          legende: t("fortschritt.engineKurz"),
          symbol: Cpu,
          anteil,
          testid: "ich-bots-10",
        },
      ];
    }
    return [
      {
        name: t("fortschritt.buendelEinmal", { stufen }),
        legende: t("fortschritt.einmalKurz"),
        symbol: Bot,
        anteil: buendelanteil(besiegt, bots, "einmal"),
        testid: `ich-bots-${kennung}-einmal`,
      },
      {
        name: t("fortschritt.buendelAlle", { stufen }),
        legende: t("fortschritt.alleKurz"),
        symbol: Timer,
        anteil: buendelanteil(besiegt, bots, "alleZeitarten"),
        testid: `ich-bots-${kennung}-alle`,
      },
    ];
  });
}

/**
 * Die Ringe des Fortschritts (Buch und besiegte Bots); null, solange der Index lädt. Auch für die
 * Gratulation bei einem vollen Ring (Ringfeier.tsx, seit 0.2.144).
 */
export function useFortschrittsringe(): {
  index: Datenverzeichnis;
  buchringe: Symbolringangabe[];
  teilringe: Symbolringangabe[];
  botringe: Symbolringangabe[];
} | null {
  const index = useDaten(ladeIndex, "index");
  const fortschritt = useSpeicher((zustand) => zustand.daten.fortschritt);
  const lernziele = useLernzielanteil();
  const botringe = useBotringe();
  const probe = useOrdenprobe();
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
    {
      name: t("fortschritt.uebungen"),
      symbol: ClipboardCheck,
      anteil: uebungsanteil(fortschritt),
      testid: "ich-uebungen",
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
  const teilringe: Symbolringangabe[] = BUCHTEILE.map(({ kennung }) => ({
    name: t("fortschritt.teil", { teil: t(`fortschritt.teil.${kennung}`) }),
    legende: t(`fortschritt.teil.${kennung}`),
    symbol: TEILZEICHEN[kennung],
    anteil: teilanteil(kennung, index.wert.kapitel, fortschritt),
    testid: `ich-teil-${kennung}`,
  }));
  // Zur Probe des Autors (Aufgabenseite) gelten geprobte Ringe als voll; echte Daten bleiben.
  const geprobt = (ringe: Symbolringangabe[]) =>
    ringe.map((r) =>
      probe.has(r.testid)
        ? { ...r, anteil: { erreicht: r.anteil.gesamt, gesamt: r.anteil.gesamt } }
        : r,
    );
  return {
    index: index.wert,
    buchringe: geprobt(buchringe),
    teilringe: geprobt(teilringe),
    botringe: geprobt(botringe),
  };
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
  // Gamifizierung G3: das Datum der ersten Feier in die Nutzerdaten (Schlüssel wie startorden.ts).
  const schluessel = `orden:${ordenkennungAusRing(testid)}`;
  void aendere((d) => mitVerdient(d, [schluessel], new Date()));
}

/** Volle Ringe ohne Gratulation, in der Reihenfolge der Profilkarte. */
export function offeneRinge(
  ringe: readonly Symbolringangabe[],
  schon: ReadonlySet<string> = gefeiert(),
): Symbolringangabe[] {
  return ringe.filter((r) => istVoll(r.anteil) && !schon.has(r.testid));
}
