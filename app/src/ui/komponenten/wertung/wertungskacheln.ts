/**
 * Rechnung der Karte „Deine Wertung“ (Profil neu, 31.10.2026): je Zeitklasse eine Kachel mit Zahl
 * und Zahl der Partien, für Zeitklassen ohne eigene Partie eine Schätzung, dazu die Zahlen und die
 * Kurve im gewählten Maßstab. Reine Funktionen ohne Oberfläche.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (31.10.2026, Entwurf W3 „Drei Kacheln“): Die alte Karte
 * zeigte die Zahl im gewählten Maßstab, die Kurve aber immer im Maßstab von Lichess; das verwirrte.
 * Hier steht beides im selben Maßstab. Eine Zeitklasse ohne eigene Partie bekommt eine deutlich
 * markierte Schätzung aus einer gespielten Zeitklasse über engine/zeitklassenabstand.ts (derselbe
 * Mensch in einer anderen Zeitklasse; Entscheidung des Autors: ja). Die Berechnung der Wertung
 * selbst bleibt unberührt (spiel/ ist gesperrt).
 * Abhängigkeiten: spiel/wertung.ts, spiel/elomodell.ts, spiel/umrechnung.ts,
 * engine/zeitklassenabstand.ts, fortschritt/wertungsmassstab.ts (Typ).
 */
import { wertungInZeitklasse } from "../../../engine/zeitklassenabstand";
import { WERTUNGSTEMPI, type Wertungstempo } from "../../../spiel/elomodell";
import { umgerechnet } from "../../../spiel/umrechnung";
import {
  aktuelleWertung,
  istVorlaeufig,
  verlaufDerZeitklasse,
  type Wertungspunkt,
} from "../../../spiel/wertung";
import type { Wertungsmassstab } from "../fortschritt/wertungsmassstab";

/** Die Zeitklassen der Kacheln in fester Reihenfolge; eine neue Zeitklasse ist eine Zeile mehr. */
export const KACHELKLASSEN: readonly Wertungstempo[] = WERTUNGSTEMPI;

/** Suchbereich der Umkehrrechnung (Schnellschach-Wertung) und Schritte der Halbierung. */
const SUCHE_UNTEN = 0;
const SUCHE_OBEN = 3500;
const HALBIERUNGEN = 30;

/** Eine Kachel: Zeitklasse, Wertung im Maßstab von Lichess, Partien, Schätzung oder echt. */
export interface Wertungskachel {
  readonly tempo: Wertungstempo;
  /** Wertung im Maßstab von Lichess (wie berechnet); null nur ohne jede gewertete Partie. */
  readonly wert: number | null;
  readonly partien: number;
  /** Keine eigene Partie: Schätzung aus einer anderen Zeitklasse. */
  readonly geschaetzt: boolean;
  readonly vorlaeufig: boolean;
}

/**
 * Die Schnellschach-Wertung desselben Menschen aus seiner Wertung in einer Zeitklasse (Umkehrung
 * von wertungInZeitklasse durch Halbieren; die Abbildung steigt streng).
 * Beispiel: Blitz 1300 → Schnellschach etwa 1500.
 */
export function schnellschachAus(wert: number, tempo: Wertungstempo): number {
  if (tempo === "rapid") return wert;
  let unten = SUCHE_UNTEN;
  let oben = SUCHE_OBEN;
  for (let i = 0; i < HALBIERUNGEN; i += 1) {
    const mitte = (unten + oben) / 2;
    if (wertungInZeitklasse(mitte, tempo) < wert) unten = mitte;
    else oben = mitte;
  }
  return (unten + oben) / 2;
}

/** Die Zeitklasse, aus der geschätzt wird: Schnellschach, sonst die mit den meisten Partien. */
function grundklasse(punkte: readonly Wertungspunkt[]): Wertungstempo | null {
  const gespielt = KACHELKLASSEN.map((tempo) => ({
    tempo,
    anzahl: verlaufDerZeitklasse(punkte, tempo).length,
  })).filter((k) => k.anzahl > 0);
  if (gespielt.some((k) => k.tempo === "rapid")) return "rapid";
  return [...gespielt].sort((a, b) => b.anzahl - a.anzahl)[0]?.tempo ?? null;
}

/**
 * Die Kacheln aller Zeitklassen. Gespielte Zeitklassen zeigen ihre Wertung; die übrigen eine
 * Schätzung aus der Grundklasse (Schnellschach oder die meistgespielte).
 * Beispiel: drei Schnellschach-Partien, Wertung 1500 → Blitz ≈ 1300 (geschätzt), Schnellschach
 * 1500 (3 Partien, vorläufig), Klassisch ≈ 1650 (geschätzt). Sonderfall: ohne Partie alle null.
 */
export function wertungskacheln(punkte: readonly Wertungspunkt[]): Wertungskachel[] {
  const grund = grundklasse(punkte);
  const grundwert = grund ? aktuelleWertung(verlaufDerZeitklasse(punkte, grund)) : null;
  const schnell = grund && grundwert !== null ? schnellschachAus(grundwert, grund) : null;
  return KACHELKLASSEN.map((tempo) => {
    const kette = verlaufDerZeitklasse(punkte, tempo);
    const eigene = aktuelleWertung(kette);
    if (eigene !== null) {
      return {
        tempo,
        wert: eigene,
        partien: kette.length,
        geschaetzt: false,
        vorlaeufig: istVorlaeufig(kette),
      };
    }
    const wert = schnell === null ? null : Math.round(wertungInZeitklasse(schnell, tempo));
    return { tempo, wert, partien: 0, geschaetzt: true, vorlaeufig: false };
  });
}

/**
 * Eine Wertung als eine Zahl im Maßstab: Lichess unverändert, sonst die Mitte der Umrechnung;
 * null außerhalb der Tabellen. Beispiel: Schnellschach 1680 auf chess.com → etwa 1340.
 */
export function zahlInMassstab(
  tempo: Wertungstempo,
  wert: number,
  massstab: Wertungsmassstab,
): number | null {
  if (massstab === "lichess") return wert;
  return umgerechnet(tempo, wert, massstab)?.mitte ?? null;
}

/**
 * Die Punkte der Kurve im Maßstab der Zahl; Punkte außerhalb der Tabellen fallen weg.
 * Beispiel: zwei Schnellschach-Punkte 1660 und 1680 auf chess.com → etwa 1320 und 1340.
 */
export function kurveImMassstab(
  punkte: readonly Wertungspunkt[],
  tempo: Wertungstempo,
  massstab: Wertungsmassstab,
): Wertungspunkt[] {
  return punkte.flatMap((p) => {
    const zahl = zahlInMassstab(tempo, p.wertung, massstab);
    return zahl === null ? [] : [{ ...p, wertung: zahl }];
  });
}

/**
 * Die Zeitklasse, die beim Öffnen hervorgehoben ist: die der letzten gewerteten Partie, ohne
 * Partie Schnellschach. Eine gewählte Zeitklasse gilt, wenn es sie gibt.
 */
export function startklasse(
  punkte: readonly Wertungspunkt[],
  wahl: Wertungstempo | null,
): Wertungstempo {
  if (wahl && KACHELKLASSEN.includes(wahl)) return wahl;
  const letzter = punkte.at(-1);
  return letzter?.tempo ?? "rapid";
}
