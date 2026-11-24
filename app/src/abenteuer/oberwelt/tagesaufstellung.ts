/**
 * Tagesaufstellung beim Kartenaufbau: verbindet die reine Regel (regeln/tagesablauf.ts) mit Uhr,
 * Quests und Paket. Die Uhr (regeln/spieluhr.ts) nennt die Stunde, die Zielsuche (zielsuche.ts)
 * die Figuren, die ein laufender Questschritt braucht (Regel 1: Sie bleiben, wo die Szene sie
 * stellt).
 *
 * Rolle im Gesamtbild: Hilfe für oberwelt/weltdaten.ts (ladeWelt). Abhängigkeiten: paketlader.ts,
 * regeln/spieluhr.ts, regeln/tagesablauf.ts, zielsuche.ts.
 */
import type { Ortdaten, Spieldaten } from "../daten/laden";
import { liesPaketJson } from "../paket/paketlader";
import { stundeJetzt } from "../regeln/spieluhr";
import {
  festgehaltene,
  fortgeschickte,
  nachTagesablauf,
  personenDerFiguren,
  type Tagesablaeufe,
} from "../regeln/tagesablauf";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { zielangabe, zielangaben } from "./zielsuche";

let vorrat: Promise<Tagesablaeufe> | null = null;

/** Die Abläufe aus dem Paket, einmal je Sitzung (daten/tagesablaeufe.json). */
export function ladeTagesablaeufe(): Promise<Tagesablaeufe> {
  vorrat ??= liesPaketJson<Tagesablaeufe>("daten/tagesablaeufe.json").catch((fehler: unknown) => {
    vorrat = null;
    throw fehler;
  });
  return vorrat;
}

/**
 * Die Karte nach Uhr und Geschichte. Eingaben: geladene Karte (Bedingungen schon angewandt),
 * Kennung, Ort, Spielstand, Spieldaten, Dialogvariablen und Abläufe.
 * Beispiel: Maple Falls außen um 23 Uhr: Carla sitzt im Park statt vor ihrem Haus, außer ein
 * Questschritt braucht sie dort.
 */
export function nachUhr<T extends object>(
  karte: T,
  kennung: string,
  ort: Ortdaten,
  stand: Abenteuerstand,
  daten: Spieldaten,
  variablen: Readonly<Record<string, unknown>>,
  ablaeufe: Tagesablaeufe,
): T {
  const zuordnung = personenDerFiguren(ort.figuren, ablaeufe);
  // Regel 1: Ziele laufender Schritte und der erste Schritt jeder noch nicht begonnenen
  // Hauptquest (sonst träfe man Odile draußen, bevor die Quest in der Turnhalle beginnt, und ihr
  // Vorwurf wäre vorbei; der Schritt wartete dann vergeblich, Lauf der Simulation mit Uhr).
  const kommende = daten.quests
    .filter((q) => q.haupt && !stand.quests.some((s) => s.kennung === q.kennung))
    .flatMap((q) => (q.schritte[0] ? [zielangabe(q.schritte[0], daten, variablen)] : []));
  const ziele = new Set(
    [...zielangaben(stand, daten), ...kommende].flatMap((z) => (z?.objekt ? [z.objekt] : [])),
  );
  const fest = festgehaltene(ort.figuren, zuordnung, ziele, variablen);
  return nachTagesablauf(karte, {
    karte: kennung,
    stunde: stundeJetzt(stand),
    zuordnung,
    fest,
    fort: fortgeschickte(ort.figuren, zuordnung, variablen),
    ablaeufe,
  });
}
