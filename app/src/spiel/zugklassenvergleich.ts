/**
 * Vergleich der Zugklassen einer Partie mit dem Üblichen bei gleicher Spielstärke (R56).
 *
 * Rolle im Gesamtbild: Wunsch des Autors (23.10.2026): Die Klassen (brillant bis Patzer) sind
 * nicht gleichwertig; ein großer Balken für „Patzer“ wäre schlecht, einer für „Bester Zug“ gut.
 * Deshalb steht jede Klasse gegen ihren üblichen Anteil bei einem Spieler gleicher Stärke, mit
 * Zonen „schwach / normal / gut“ (bei den schwachen Klassen umgekehrt). Die Anzeige steht in
 * ui/komponenten/Zugklassen.tsx.
 * Die Tabelle VORLAEUFIG_UEBLICH ist eine vorläufige Schätzung: Die echten Anteile je Elo und
 * Zeitklasse erhebt der Bot-Chat aus Lichess-Partien und ersetzt die Tabelle (und die festen
 * Zonengrenzen) dann durch Werte aus der Streuung der Spieler.
 * Abhängigkeiten: spiel/auswertung.ts (Zugklasse).
 */
import type { Zugklasse } from "./auswertung";

/** Klassen, von denen man viele haben will; die übrigen möglichst wenige. */
export const GUTE_KLASSEN: ReadonlySet<Zugklasse> = new Set([
  "brillant",
  "stark",
  "bester",
  "sehrGut",
  "gut",
  "buch",
]);

/**
 * Üblicher Anteil je Klasse in Prozent der eigenen Züge an vier Stützstellen der Spielstärke;
 * dazwischen wird gerade verbunden, außerhalb gilt die nächste Stützstelle. VORLÄUFIG (siehe
 * Dateikopf).
 */
const VORLAEUFIG_UEBLICH: readonly (readonly [number, Readonly<Record<Zugklasse, number>>])[] = [
  [
    800,
    {
      brillant: 0.3,
      stark: 1,
      bester: 28,
      sehrGut: 14,
      gut: 14,
      buch: 6,
      ungenau: 12,
      fehler: 9,
      verpasst: 6,
      patzer: 9,
    },
  ],
  [
    1200,
    {
      brillant: 0.4,
      stark: 1.5,
      bester: 30,
      sehrGut: 16,
      gut: 14,
      buch: 8,
      ungenau: 11,
      fehler: 7,
      verpasst: 5,
      patzer: 6,
    },
  ],
  [
    1600,
    {
      brillant: 0.5,
      stark: 2,
      bester: 36,
      sehrGut: 17,
      gut: 13,
      buch: 10,
      ungenau: 9,
      fehler: 5,
      verpasst: 3.5,
      patzer: 3.5,
    },
  ],
  [
    2000,
    {
      brillant: 0.6,
      stark: 2.5,
      bester: 42,
      sehrGut: 17,
      gut: 12,
      buch: 11,
      ungenau: 7,
      fehler: 3.5,
      verpasst: 2,
      patzer: 1.5,
    },
  ],
];

/** Unter so vielen eigenen Zügen springen die Anteile zu stark: dann nur die Anzahlen. */
export const MINDESTZUEGE_VERGLEICH = 15;
/** „normal“ heißt: 75 % bis 125 % des Üblichen (vorläufig, siehe Dateikopf). */
const NORMAL_UNTEN = 0.75;
const NORMAL_OBEN = 1.25;
/** Die Skala jeder Zeile reicht bis zum Doppelten des Üblichen. */
const SKALA_FAKTOR = 2;
const PROZENT = 100;

export type Klassenurteil = "gut" | "normal" | "schwach";

export interface Klassenvergleich {
  readonly klasse: Zugklasse;
  readonly anzahl: number;
  /** Anteil an den eigenen Zügen in Prozent. */
  readonly anteil: number;
  /** Üblicher Anteil bei dieser Spielstärke in Prozent. */
  readonly ueblich: number;
  /** Anteil geteilt durch den üblichen (1 = genau üblich). */
  readonly relativ: number;
  readonly urteil: Klassenurteil;
  /** Länge des Balkens auf der Skala 0 bis 1 (Skala bis zum Doppelten des Üblichen). */
  readonly balken: number;
  /** Ragt der Anteil über die Skala hinaus (etwa ein brillanter Zug in einer kurzen Partie)? */
  readonly ueberSkala: boolean;
}

/**
 * Üblicher Anteil einer Klasse bei einer Spielstärke, aus der vorläufigen Tabelle.
 * Beispiel: „bester“ bei 1400 → 33 (Mitte zwischen 30 bei 1200 und 36 bei 1600).
 */
export function ueblicherAnteil(klasse: Zugklasse, elo: number): number {
  const erste = VORLAEUFIG_UEBLICH[0];
  const letzte = VORLAEUFIG_UEBLICH[VORLAEUFIG_UEBLICH.length - 1];
  if (!erste || !letzte) return 0;
  if (elo <= erste[0]) return erste[1][klasse];
  if (elo >= letzte[0]) return letzte[1][klasse];
  const oben = VORLAEUFIG_UEBLICH.findIndex(([grenze]) => grenze >= elo);
  const [eloA, werteA] = VORLAEUFIG_UEBLICH[oben - 1] ?? erste;
  const [eloB, werteB] = VORLAEUFIG_UEBLICH[oben] ?? letzte;
  const t = (elo - eloA) / (eloB - eloA);
  return werteA[klasse] + t * (werteB[klasse] - werteA[klasse]);
}

/** Urteil aus dem Verhältnis: bei guten Klassen ist mehr besser, bei schwachen weniger. */
function urteilFuer(klasse: Zugklasse, relativ: number): Klassenurteil {
  const viel = relativ > NORMAL_OBEN;
  const wenig = relativ < NORMAL_UNTEN;
  if (!viel && !wenig) return "normal";
  return GUTE_KLASSEN.has(klasse) === viel ? "gut" : "schwach";
}

/**
 * Vergleich einer Klasse mit dem Üblichen.
 *
 * Eingaben: Klasse, Anzahl der Züge dieser Klasse, Zahl aller eigenen Züge, Spielstärke für den
 * Vergleich. Ausgabe: Anteil, üblicher Anteil, Verhältnis, Urteil, Balkenlänge.
 * Beispiel: 4 Ungenauigkeiten in 33 Zügen bei 1400 (üblich 10 %) → Anteil 12 %, Verhältnis 1,21,
 * „normal“. Ein brillanter Zug in 33 Zügen → weit über dem Üblichen, „gut“, über der Skala.
 * Sonderfall: keine Züge → Anteil 0.
 */
export function vergleicheKlasse(
  klasse: Zugklasse,
  anzahl: number,
  zuege: number,
  elo: number,
): Klassenvergleich {
  const anteil = zuege > 0 ? (anzahl / zuege) * PROZENT : 0;
  const ueblich = ueblicherAnteil(klasse, elo);
  const relativ = ueblich > 0 ? anteil / ueblich : 0;
  const skala = ueblich * SKALA_FAKTOR;
  return {
    klasse,
    anzahl,
    anteil,
    ueblich,
    relativ,
    urteil: urteilFuer(klasse, relativ),
    balken: skala > 0 ? Math.min(anteil / skala, 1) : 0,
    ueberSkala: anteil > skala,
  };
}
