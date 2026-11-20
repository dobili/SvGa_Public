/**
 * Ton im Hintergrund nachladen (Entscheidung des Autors, 13.11.2026; Messung „zugang“,
 * 15.11.2026): Musik und Geräusche gehören nicht zum Grundpaket. Das Spiel startet, sobald Grafik
 * und Daten da sind; der Ton des laufenden Akts lädt danach im Hintergrund (beim ersten Spielen
 * Akt 1), der späterer Akte beim Betreten des Akts oder auf Wunsch im Spielmenü
 * (anbindung/Aktton.tsx). Musik gehört seit dem 16.11.2026 nicht mehr dazu (Auftrag „Leistung“:
 * 18 MB Musik von Akt 1 luden bei jedem ersten Start mit): Ein Stück lädt, wenn es gespielt wird,
 * das der Nachbarkarten vorab (ton/vorabladen.ts); danach liegt es im Cache. Nur der Wunsch im
 * Spielmenü lädt alle Musik auf einmal.
 *
 * Rolle im Gesamtbild: Die Dateien stehen im Verzeichnis des Pakets mit `akt`
 * (schnittstelle/paket.ts); sie landen im selben Cache wie das Grundpaket. Bis sie da sind, liest
 * liesPaketdatei sie aus dem Netz, und ohne Netz bleibt es still (ton/tonspieler.ts). Den Stand
 * des Nachladens („lädt“, „vollständig“) zeigt anbindung/Ladestand.tsx; „vollständig“ heißt:
 * Grundpaket und Geräusche des laufenden Akts liegen auf dem Gerät, das Spiel geht ohne Netz
 * (Musik, die noch nie lief, bleibt dann still).
 * Seit dem 20.11.2026 lädt hier auch Maia (anbindung/maiapflicht.ts), nach den Geräuschen: Der
 * erste Start wartete vorher auf alle 92 MB Maia. „Vollständig“ heißt jetzt: Grundpaket,
 * Geräusche des Akts und Maia liegen auf dem Gerät.
 * Abhängigkeiten: paket/paketlader.ts, anbindung/maiapflicht.ts.
 */
import { useEffect, useSyncExternalStore } from "react";
import { beiPaketAenderung, fehlendeDateien, ladeNach, paketDa } from "./paketlader";
import type { Ladefortschritt, Paketverzeichnis } from "../schnittstelle/paket";
import { ladeMaiaImHintergrund, MAIA_DER_APP, type Maiazugriff } from "../anbindung/maiapflicht";

/** Erster Akt, dessen Ton nachgeladen wird (seit 15.11.2026 auch Akt 1). */
export const ERSTER_NACHLADEAKT = 1;

/** Stand des Nachladens für die Anzeige. */
export type Tonladestand =
  /** Noch nichts geprüft (kein Paket oder noch nicht gefragt). */
  | { readonly art: "ruht" }
  | { readonly art: "laedt"; readonly geladen: number; readonly gesamt: number }
  /** Alles da; `frisch`, wenn in dieser Sitzung etwas geladen wurde (dann kurze Meldung). */
  | { readonly art: "vollstaendig"; readonly frisch: boolean }
  /** Etwas fehlt noch (meist ohne Netz); das Spiel läuft, nur still. */
  | { readonly art: "unvollstaendig" };

let stand: Tonladestand = { art: "ruht" };
const beobachter = new Set<() => void>();

/** Zähler der Hintergrundläufe. */
let laeufe = 0;

function setzeStand(neu: Tonladestand): void {
  stand = neu;
  for (const b of beobachter) b();
}

/** Der Stand des Nachladens (für useSyncExternalStore). */
export function tonladestand(): Tonladestand {
  return stand;
}

/** Meldet Änderungen am Stand; Ausgabe: Abmelden. */
export function beiTonladestand(b: () => void): () => void {
  beobachter.add(b);
  return () => beobachter.delete(b);
}

/** Musik des Pakets (lädt beim Abspielen, nicht mit dem Akt). Beispiel: „musik/weg.m4a“. */
export function istMusik(datei: { readonly pfad: string }): boolean {
  return datei.pfad.startsWith("musik/");
}

/**
 * Was im Hintergrund zu einem Akt gehört: Grundpaket, Großbilder (ohne Akt, Feld hintergrund) und
 * Geräusche des Akts, keine Musik.
 */
function zumAkt(akt: number): (datei: Paketverzeichnis["dateien"][number]) => boolean {
  return (d) => (d.akt === undefined || d.akt === akt) && !istMusik(d);
}

/** Laufende Ladevorgänge je Akt, damit ein Akt nicht doppelt lädt. */
const laufend = new Map<number, Promise<boolean>>();

/** Ohne Anzeige: Fortschritt wird nicht gezeigt. */
const STILL: Ladefortschritt = () => undefined;

/**
 * Lädt die Geräusche eines Akts nach (einmal je Sitzung und Paket, auch bei mehrfachem Aufruf).
 * Ausgabe: true, wenn alles da ist; ohne geladenes Paket oder bei Netzfehlern false (dann gilt
 * der Vorgang nicht als erledigt, der nächste Aufruf versucht es neu).
 */
export function ladeAktton(akt: number, fortschritt: Ladefortschritt = STILL): Promise<boolean> {
  if (akt < ERSTER_NACHLADEAKT) return Promise.resolve(true);
  let vorgang = laufend.get(akt);
  if (!vorgang) {
    vorgang = ladeNach(
      (d) => (d.akt === akt || d.hintergrund === true) && !istMusik(d),
      fortschritt,
    ).catch((fehler: unknown) => {
      // Ohne Netz bleibt der Ton aus; beim nächsten Betreten des Akts ein neuer Versuch.
      console.warn(`Ton von Akt ${akt} nicht geladen`, fehler);
      return false;
    });
    const dieser = vorgang;
    laufend.set(akt, dieser);
    void dieser.then((ok) => {
      if (!ok && laufend.get(akt) === dieser) laufend.delete(akt);
    });
  }
  return vorgang;
}

/**
 * Lädt den Ton des Akts und danach Maia im Hintergrund, mit Stand für die Anzeige, und prüft
 * danach, ob das Spiel vollständig auf dem Gerät liegt. Ohne geladenes Paket bleibt der Stand
 * „ruht“. Beispiel: erstes Spielen, Akt 1 → „lädt 0 … 100 %“ (Geräusche und Maia zusammen),
 * dann „vollständig“ (frisch).
 */
export async function ladeTonImHintergrund(
  akt: number,
  maia: Maiazugriff = MAIA_DER_APP,
): Promise<void> {
  // Nur der jüngste Lauf schreibt den Stand (ein neues Paket startet einen neuen Lauf).
  const dieser = ++laeufe;
  const setze = (neu: Tonladestand) => {
    if (dieser === laeufe) setzeStand(neu);
  };
  const fehlend = await fehlendeDateien(zumAkt(akt));
  // Ohne Paket (Startkarte vor dem ersten Laden) lädt auch Maia nicht.
  if (!(await paketDa())) return;
  const fehltMaia = maia.online() && !(await maia.geladen());
  const maiaBytes = fehltMaia ? ((await maia.groesse()) ?? 0) : 0;
  const tonBytes = fehlend.reduce((summe, d) => summe + d.bytes, 0);
  const frisch = fehlend.length > 0 || fehltMaia;
  let tonGeladen = 0;
  const melde = (maiaGeladen: number) => {
    if (frisch) {
      const gesamt = Math.max(1, tonBytes + maiaBytes);
      setze({ art: "laedt", geladen: tonGeladen + maiaGeladen, gesamt });
    }
  };
  melde(0);
  const ok = await ladeAktton(akt, (geladen) => {
    tonGeladen = Math.min(geladen, tonBytes);
    melde(0);
  });
  const maiaOk = await ladeMaiaImHintergrund(melde, maia);
  if (!ok) {
    setze(frisch ? { art: "unvollstaendig" } : { art: "ruht" });
    return;
  }
  const rest = await fehlendeDateien(zumAkt(akt));
  const voll = rest.length === 0 && (maiaOk || !maia.online());
  setze(voll ? { art: "vollstaendig", frisch } : { art: "unvollstaendig" });
}

/** Lädt den Ton aller Akte samt aller Musik (Wunsch im Spielmenü). */
export async function ladeAlleAkte(fortschritt: Ladefortschritt): Promise<boolean> {
  const ok = await ladeNach((d) => d.akt !== undefined || d.hintergrund === true, fortschritt);
  return ok;
}

/** Bytes des Tons aller Akte, der noch nicht auf dem Gerät liegt. */
export async function fehlendeAktbytes(): Promise<number> {
  const fehlend = await fehlendeDateien((d) => d.akt !== undefined || d.hintergrund === true);
  return fehlend.reduce((summe, d) => summe + d.bytes, 0);
}

/**
 * Lädt den Ton des Akts im Hintergrund, sobald ein Paket da ist, und nach jeder Änderung am Paket
 * neu (frisch geladen, neue Version, gelöscht). Eingabe: Akt des Spielstands (ohne Spielstand 1).
 */
export function useAktton(akt: number): void {
  useEffect(() => {
    let aktiv = true;
    const starte = () => {
      laufend.clear();
      setzeStand({ art: "ruht" });
      ladeTonImHintergrund(akt).catch((fehler: unknown) => {
        if (aktiv) console.warn("Ton nicht nachgeladen", fehler);
      });
    };
    starte();
    const abmelden = beiPaketAenderung(starte);
    return () => {
      aktiv = false;
      abmelden();
    };
  }, [akt]);
}

/** Der Stand des Nachladens als Hook. */
export function useTonladestand(): Tonladestand {
  return useSyncExternalStore(beiTonladestand, tonladestand);
}
