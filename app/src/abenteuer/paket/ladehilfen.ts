/**
 * Kleine Hilfen zum Laden des Abenteuerpakets (paket/paketlader.ts): Zeitlimit, Prüfsumme und
 * begrenzt gleichzeitige Abrufe (wie viele, je nach HTTP-Protokoll). Ausgelagert, damit der Paketlader unter 400 Zeilen bleibt.
 * Abhängigkeiten: Browser-Schnittstelle crypto.subtle.
 */

/** Ein Versprechen mit Zeitlimit: Nach `ms` Millisekunden wird es mit einem Fehler abgelehnt. */
export function mitZeitlimit<T>(versprechen: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((erfuellt, abgelehnt) => {
    const uhr = setTimeout(() => abgelehnt(new Error(`Zeitlimit ${ms} ms`)), ms);
    versprechen.then(
      (wert) => {
        clearTimeout(uhr);
        erfuellt(wert);
      },
      (fehler: unknown) => {
        clearTimeout(uhr);
        abgelehnt(fehler instanceof Error ? fehler : new Error(String(fehler)));
      },
    );
  });
}

/** SHA-256 eines Blobs als Hexzahl. */
export async function pruefsumme(bytes: ArrayBuffer): Promise<string> {
  const summe = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return [...summe].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Führt `aufgabe` für alle Einträge aus, höchstens `anzahl` zugleich; der erste Fehler bricht ab
 * (die übrigen laufenden Aufgaben enden noch, ihr Ergebnis bleibt im Cache).
 * Beispiel: 2000 Dateien, anzahl 6 → sechs Arbeiter nehmen sich der Reihe nach die nächste Datei.
 */
export async function jeGleichzeitig<T>(
  eintraege: readonly T[],
  anzahl: number,
  aufgabe: (eintrag: T) => Promise<void>,
): Promise<void> {
  let naechster = 0;
  const arbeiter = async (): Promise<void> => {
    for (let i = naechster++; i < eintraege.length; i = naechster++) {
      await aufgabe(eintraege[i] as T);
    }
  };
  await Promise.all(Array.from({ length: Math.min(anzahl, eintraege.length) }, arbeiter));
}

/**
 * So viele Dateien lädt das Paket gleichzeitig, je nach Protokoll des Servers.
 * Warum (Auftrag „Größe und Startzeit“, 20.11.2026): Das Grundpaket hat rund 900 Dateien, die
 * Hälfte unter 2 KB; bei Mobilfunk-Laufzeit von 60 bis 100 ms kosteten sechs zugleich allein 9 bis
 * 15 s Warten. Die Live-Seite spricht HTTP/2 (Cloudflare): Dort laufen viele Anfragen über eine
 * Verbindung, 16 zugleich nutzen die Leitung, ohne den Server zu überfahren. Unter HTTP/1.1 öffnet
 * ein Browser nur sechs Verbindungen je Server; mehr stünden nur in seiner Warteschlange.
 * Eingabe: `nextHopProtocol` der Ressource („h2“, „h3“, „http/1.1“, leer, wenn unbekannt).
 * Ausgabe: 6 bei HTTP/1.x, sonst 16. Beispiel: „h2“ → 16, „http/1.1“ → 6, „“ → 16.
 */
export function gleichzeitigFuer(protokoll: string): number {
  return protokoll.startsWith("http/1") ? GLEICHZEITIG_HTTP1 : GLEICHZEITIG_HTTP2;
}

/** Gleichzeitige Verbindungen eines Browsers je Server unter HTTP/1.1. */
const GLEICHZEITIG_HTTP1 = 6;
/** Gleichzeitige Anfragen unter HTTP/2 und HTTP/3 (eine Verbindung, viele Ströme). */
const GLEICHZEITIG_HTTP2 = 16;

/**
 * Das Protokoll, mit dem eine schon geladene Adresse kam (Resource Timing), sonst leer.
 * Beispiel: die Adresse von paket.json nach dem Abruf → „h2“ auf der Live-Seite.
 */
export function protokollVon(adresse: string): string {
  if (typeof performance === "undefined") return "";
  const eintraege = performance.getEntriesByName(adresse, "resource");
  const letzter = eintraege.at(-1) as PerformanceResourceTiming | undefined;
  return letzter?.nextHopProtocol ?? "";
}
