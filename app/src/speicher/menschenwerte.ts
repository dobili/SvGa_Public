/**
 * Lesen der Stellschrauben des erweiterten Modus aus gespeicherten Daten.
 *
 * Rolle im Gesamtbild: Eigene Gegner (speicher/gegner.ts) und Partien (speicher/partienLesen.ts)
 * können Gewichte je Fehlerart und blindem Fleck, die Fehlerhäufigkeit insgesamt und Höchst-
 * verluste je Art tragen (engine/menschenwahl.ts). Unbekanntes und Werte außerhalb der Grenzen
 * fallen weg, fehlende Angaben bleiben fehlend (dann gilt „wie Menschen“), damit ältere Daten
 * unverändert weiterlaufen.
 * Abhängigkeiten: engine/blindeFlecken.ts, engine/fehlerart.ts.
 */
import { BLINDE_FLECKEN, type BlinderFleck } from "../engine/blindeFlecken";
import { FEHLERARTEN, type Fehlerart } from "../engine/fehlerart";

/** Größtes Gewicht je Fehlerart oder blindem Fleck (Faktor; 0 = nie, ohne Angabe gilt 1). */
export const GEWICHT_HOECHSTENS = 3;
/** Größte Fehlerhäufigkeit insgesamt (Faktor, das kleinste ist 0); Grenze des Reglers. */
export const HAEUFIGKEIT_HOECHSTENS = 2;
/** Kleinster Höchstverlust je Fehlerart, in Bauern. */
export const HOECHSTVERLUST_MINDESTENS = 0.5;
/** Größter Höchstverlust je Fehlerart, in Bauern. */
export const HOECHSTVERLUST_HOECHSTENS = 9;

type Roh = Record<string, unknown>;

function istObjekt(wert: unknown): wert is Roh {
  return typeof wert === "object" && wert !== null && !Array.isArray(wert);
}

function zahlIn(wert: unknown, von: number, bis: number): number | undefined {
  if (typeof wert !== "number" || !Number.isFinite(wert)) return undefined;
  return Math.max(von, Math.min(bis, wert));
}

/** Gewichte je Art oder Fleck (0 bis 3); undefined ohne Angabe. */
export function gewichteAus(
  roh: unknown,
): Partial<Record<Fehlerart | BlinderFleck, number>> | undefined {
  if (!istObjekt(roh)) return undefined;
  const aus: Partial<Record<Fehlerart | BlinderFleck, number>> = {};
  for (const art of [...FEHLERARTEN, ...BLINDE_FLECKEN]) {
    const wert = zahlIn(roh[art], 0, GEWICHT_HOECHSTENS);
    if (wert !== undefined) aus[art] = wert;
  }
  return aus;
}

/** Fehlerhäufigkeit insgesamt (0 bis 2); undefined ohne Angabe. */
export function haeufigkeitAus(roh: unknown): number | undefined {
  return zahlIn(roh, 0, HAEUFIGKEIT_HOECHSTENS);
}

/** Höchstverlust je Fehlerart in Bauern (0,5 bis 9); undefined ohne Angabe. */
export function hoechstverlustAus(roh: unknown): Partial<Record<Fehlerart, number>> | undefined {
  if (!istObjekt(roh)) return undefined;
  const aus: Partial<Record<Fehlerart, number>> = {};
  for (const art of FEHLERARTEN) {
    const wert = zahlIn(roh[art], HOECHSTVERLUST_MINDESTENS, HOECHSTVERLUST_HOECHSTENS);
    if (wert !== undefined) aus[art] = wert;
  }
  return aus;
}

/** Die drei Angaben eines Rohobjekts, nur die vorhandenen (für Gegner und Partien). */
export function menschenwerteAus(roh: Roh): {
  gewichte?: Partial<Record<Fehlerart | BlinderFleck, number>>;
  haeufigkeit?: number;
  hoechstverlust?: Partial<Record<Fehlerart, number>>;
} {
  const gewichte = gewichteAus(roh.gewichte);
  const haeufigkeit = haeufigkeitAus(roh.haeufigkeit);
  const hoechstverlust = hoechstverlustAus(roh.hoechstverlust);
  return {
    ...(gewichte ? { gewichte } : {}),
    ...(haeufigkeit !== undefined ? { haeufigkeit } : {}),
    ...(hoechstverlust ? { hoechstverlust } : {}),
  };
}
