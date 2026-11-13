/**
 * Ton je Akt nachladen (Entscheidung des Autors, 13.11.2026; Klangplan, Gesamtübersicht): Musik
 * und Geräusche von Akt 1 kommen mit dem Grundpaket, die der Akte 2 bis 4 erst beim Betreten des
 * Akts oder auf Wunsch im Spielmenü (anbindung/Aktton.tsx).
 *
 * Rolle im Gesamtbild: Die Dateien stehen im Verzeichnis des Pakets mit `akt`
 * (schnittstelle/paket.ts); sie landen im selben Cache wie das Grundpaket. Bis sie da sind, liest
 * liesPaketdatei sie aus dem Netz, und ohne Netz bleibt es still (ton/tonspieler.ts).
 * Abhängigkeiten: paket/paketlader.ts.
 */
import { useEffect } from "react";
import { fehlendeDateien, ladeNach } from "./paketlader";
import type { Ladefortschritt } from "../schnittstelle/paket";

/** Erster Akt, dessen Ton nachgeladen wird. */
export const ERSTER_NACHLADEAKT = 2;

/** Laufende Ladevorgänge je Akt, damit ein Akt nicht doppelt lädt. */
const laufend = new Map<number, Promise<boolean>>();

/** Ohne Anzeige: Fortschritt wird nicht gezeigt. */
const STILL: Ladefortschritt = () => undefined;

/**
 * Lädt den Ton eines Akts nach (einmal je Sitzung, auch bei mehrfachem Aufruf). Akt 1 ist schon im
 * Grundpaket. Ausgabe: true, wenn alles da ist; Netzfehler werden gemeldet und ergeben false.
 */
export function ladeAktton(akt: number, fortschritt: Ladefortschritt = STILL): Promise<boolean> {
  if (akt < ERSTER_NACHLADEAKT) return Promise.resolve(true);
  let vorgang = laufend.get(akt);
  if (!vorgang) {
    vorgang = ladeNach((d) => d.akt === akt, fortschritt).catch((fehler: unknown) => {
      // Ohne Netz bleibt der Ton aus; beim nächsten Betreten des Akts ein neuer Versuch.
      console.warn(`Ton von Akt ${akt} nicht geladen`, fehler);
      laufend.delete(akt);
      return false;
    });
    laufend.set(akt, vorgang);
  }
  return vorgang;
}

/** Lädt den Ton aller späteren Akte (Wunsch im Spielmenü). */
export async function ladeAlleAkte(fortschritt: Ladefortschritt): Promise<boolean> {
  const ok = await ladeNach((d) => d.akt !== undefined, fortschritt);
  return ok;
}

/** Bytes des Tons späterer Akte, der noch nicht auf dem Gerät liegt. */
export async function fehlendeAktbytes(): Promise<number> {
  const fehlend = await fehlendeDateien((d) => d.akt !== undefined);
  return fehlend.reduce((summe, d) => summe + d.bytes, 0);
}

/** Lädt beim Betreten eines Akts dessen Ton im Hintergrund. Eingabe: Akt des Spielstands. */
export function useAktton(akt: number | undefined): void {
  useEffect(() => {
    if (akt !== undefined) void ladeAktton(akt);
  }, [akt]);
}
