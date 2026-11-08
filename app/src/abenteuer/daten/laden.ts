/**
 * Spieldaten aus dem Zusatzpaket laden: Gegner, Karten, Quests, Orte, Begegnungen.
 *
 * Rolle im Gesamtbild: Die Typen kommen aus den Schemas (src/daten/generiert/abenteuer-*.ts,
 * erzeugt von skripte/erzeuge-typen.mjs); die Dateien liegen im Paket unter daten/ (gebaut von
 * skripte/baue-abenteuerpaket.mjs). Einmal geladen bleiben sie im Speicher der Seite.
 * Abhängigkeiten: paket/paketlader.ts, daten/generiert/abenteuer-*.ts.
 */
import type { BegegnungenDesSchachAbenteuers } from "../../daten/generiert/abenteuer-begegnungen";
import type { GegnerDesSchachAbenteuers } from "../../daten/generiert/abenteuer-gegner";
import type { AufgabenrundenDesSchachAbenteuers } from "../../daten/generiert/abenteuer-runden";
import type { FundeDesSchachAbenteuers } from "../../daten/generiert/abenteuer-funde";
import type { LadenDesSchachAbenteuers } from "../../daten/generiert/abenteuer-laeden";
import type { HilfskartenDesSchachAbenteuers } from "../../daten/generiert/abenteuer-karten";
import type { OrteDesSchachAbenteuers } from "../../daten/generiert/abenteuer-orte";
import type { QuestsDesSchachAbenteuers } from "../../daten/generiert/abenteuer-quests";
import { liesPaketJson } from "../paket/paketlader";

export type Gegnerdaten = GegnerDesSchachAbenteuers["gegner"][number];
export type Kartendaten = HilfskartenDesSchachAbenteuers["karten"][number];
export type Questdaten = QuestsDesSchachAbenteuers["quests"][number];
export type Ortdaten = OrteDesSchachAbenteuers["orte"][number];
export type Begegnungsdaten = BegegnungenDesSchachAbenteuers["begegnungen"][number];
export type Rundendaten = AufgabenrundenDesSchachAbenteuers["runden"][number];
export type Funddaten = FundeDesSchachAbenteuers["funde"][number];
export type Ladendaten = LadenDesSchachAbenteuers["laeden"][number];

/** Alle Verzeichnisse des Spiels auf einmal. */
export interface Spieldaten {
  readonly gegner: readonly Gegnerdaten[];
  readonly karten: readonly Kartendaten[];
  readonly quests: readonly Questdaten[];
  readonly orte: readonly Ortdaten[];
  readonly begegnungen: readonly Begegnungsdaten[];
  readonly runden: readonly Rundendaten[];
  readonly funde: readonly Funddaten[];
  readonly laeden: readonly Ladendaten[];
}

let vorrat: Promise<Spieldaten> | null = null;

/** Lädt die Spieldaten einmal; ein Fehler verwirft den Vorrat, damit ein neuer Versuch möglich ist. */
export function ladeSpieldaten(): Promise<Spieldaten> {
  vorrat ??= Promise.all([
    liesPaketJson<GegnerDesSchachAbenteuers>("daten/gegner.json"),
    liesPaketJson<HilfskartenDesSchachAbenteuers>("daten/karten.json"),
    liesPaketJson<QuestsDesSchachAbenteuers>("daten/quests.json"),
    liesPaketJson<OrteDesSchachAbenteuers>("daten/orte.json"),
    liesPaketJson<BegegnungenDesSchachAbenteuers>("daten/begegnungen.json"),
    liesPaketJson<AufgabenrundenDesSchachAbenteuers>("daten/runden.json"),
    liesPaketJson<FundeDesSchachAbenteuers>("daten/funde.json"),
    liesPaketJson<LadenDesSchachAbenteuers>("daten/laeden.json"),
  ])
    .then(([g, k, q, o, b, r, f, l]) => ({
      gegner: g.gegner,
      karten: k.karten,
      quests: q.quests,
      orte: o.orte,
      begegnungen: b.begegnungen,
      runden: r.runden,
      funde: f.funde,
      laeden: l.laeden,
    }))
    .catch((fehler: unknown) => {
      vorrat = null;
      throw fehler;
    });
  return vorrat;
}

/** Vergisst die geladenen Daten (nach einem Update des Pakets). */
export function vergissSpieldaten(): void {
  vorrat = null;
}

/** Die Karte eines Ortes mit ihrem Ort; null, wenn unbekannt. */
export function findeKarte(
  daten: Spieldaten,
  kennung: string,
): { ort: Ortdaten; karte: Ortdaten["karten"][number] } | null {
  for (const ort of daten.orte) {
    const karte = ort.karten.find((k) => k.kennung === kennung);
    if (karte) return { ort, karte };
  }
  return null;
}
