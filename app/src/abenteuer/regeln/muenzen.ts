/**
 * Münzen und Läden (docs/spiel/08, G1 bis G6): wie viele Münzen es wofür gibt und was ein Kauf
 * am Spielstand ändert. Münzen sind reine Spielwährung, es gibt keine Echtgeld-Käufe.
 *
 * Rolle im Gesamtbild: Reine Funktionen; der Rückweg aus Partie und Runde (regeln/rueckweg.ts)
 * schreibt Münzen gut, das Ladenfenster (oberwelt/Laden.tsx) ruft `kaufe`. Gold gibt es weiter
 * nur ohne Karten (R17), deshalb verschiebt ein gekaufter Fingerzeig nichts an den Nadelregeln.
 * Beispiel: 30 Münzen, Kauf „Zweite Chance“ für 20 → 10 Münzen, eine Zweite Chance mehr.
 */
import type { Kartensorte } from "../schnittstelle/karten";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { wendeWirkungenAn } from "./quests";

/** Münzen je Anlass (G1, G4: ein Clubbesuch bringt etwa 60 bis 100). */
export const MUENZEN = {
  strassensieg: 10,
  /** Jeder weitere Sieg gegen denselben Straßengegner am selben Tag (Befund mittel-2, 11, 7.4). */
  strassensiegWiederholt: 2,
  rundeBestanden: 10,
  ersteNadel: 50,
} as const;

/** Eine Ware im Laden (laeden.json). */
export interface Ware {
  readonly art: "karte" | "gegenstand";
  readonly kennung: string;
  readonly preis: number;
}

/**
 * Warum eine Ware gerade nicht zu kaufen ist; null, wenn sie es ist. Dauerhafte Karten und
 * Gegenstände gibt es nur einmal.
 */
export function kaufhindernis(
  stand: Abenteuerstand,
  ware: Ware,
  sorten: readonly Kartensorte[],
): "zuTeuer" | "schonDa" | null {
  if (ware.art === "gegenstand" && stand.gegenstaende.includes(ware.kennung)) return "schonDa";
  if (ware.art === "karte") {
    const dauerhaft = sorten.find((s) => s.kennung === ware.kennung)?.art === "dauerhaft";
    if (dauerhaft && stand.karten.some((k) => k.kennung === ware.kennung)) return "schonDa";
  }
  return stand.muenzen < ware.preis ? "zuTeuer" : null;
}

/** Der Stand nach dem Kauf; nicht kaufbar → unverändert (derselbe Stand). */
export function kaufe(
  stand: Abenteuerstand,
  ware: Ware,
  sorten: readonly Kartensorte[],
  jetzt: Date,
): Abenteuerstand {
  if (kaufhindernis(stand, ware, sorten) !== null) return stand;
  const bezahlt = { ...stand, muenzen: stand.muenzen - ware.preis };
  const wirkung =
    ware.art === "karte"
      ? ({ art: "karte", karte: ware.kennung } as const)
      : ({ art: "gegenstand", gegenstand: ware.kennung } as const);
  return wendeWirkungenAn(bezahlt, [wirkung], jetzt);
}

/**
 * Der Stand nach dem Bezahlen eines festen Preises (Fahrt mit dem Lastkahn, Ink `zahle`). Reicht
 * das Geld nicht, bleibt der Stand unverändert: Der Dialog fragt vorher `muenzen` ab und sagt
 * dann „nicht genug“; die App gerät so nie unter null. Beispiel: 12 Münzen, Preis 5 → 7 Münzen;
 * 3 Münzen, Preis 5 → derselbe Stand. Ein Preis unter eins ändert nichts.
 */
export function bezahle(stand: Abenteuerstand, preis: number): Abenteuerstand {
  if (!(preis >= 1) || stand.muenzen < preis) return stand;
  return { ...stand, muenzen: stand.muenzen - preis };
}

/** Länge des Datums in einer ISO-Zeit („2026-11-08“). */
const DATUMSLAENGE = 10;

/**
 * Münzen für einen Sieg gegen einen Straßengegner: der erste Sieg je Gegner und Tag voll, jeder
 * weitere wenig, damit Münzen nicht durch Wiederholen des leichtesten Gegners entstehen.
 * Beispiel: Jo heute schon einmal besiegt → 2; erster Sieg heute → 10.
 */
export function strassensiegMuenzen(
  protokoll: readonly {
    readonly gegner: string;
    readonly ergebnis: { readonly ausgang: string; readonly beendet: string };
  }[],
  gegner: string,
  beendet: string,
): number {
  const tag = beendet.slice(0, DATUMSLAENGE);
  const schonHeute = protokoll.some(
    (e) =>
      e.gegner === gegner &&
      e.ergebnis.ausgang === "sieg" &&
      e.ergebnis.beendet.slice(0, DATUMSLAENGE) === tag,
  );
  return schonHeute ? MUENZEN.strassensiegWiederholt : MUENZEN.strassensieg;
}
