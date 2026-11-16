/**
 * Kleine Hilfen zum Laden des Abenteuerpakets (paket/paketlader.ts): Zeitlimit, Prüfsumme und
 * begrenzt gleichzeitige Abrufe. Ausgelagert, damit der Paketlader unter 400 Zeilen bleibt.
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
