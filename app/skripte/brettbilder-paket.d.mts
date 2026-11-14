// Typen zu skripte/brettbilder-paket.mjs, damit der Komponententest sie ohne any nutzen kann.

/** Eine Datei eines Brettstils: Pfad im Paket, Quelle auf der Platte, Paketgruppe. */
export interface Brettbilddatei {
  readonly pfad: string;
  readonly quelle: string;
  readonly gruppe: "daten" | "grafik";
}

/** Die Dateien aller Brettstile unter <privat>/brett/<stil>/ (webp und json), sortiert. */
export function brettbilderDateien(privat: string): Promise<Brettbilddatei[]>;
