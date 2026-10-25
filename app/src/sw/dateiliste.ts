/**
 * Teilt die Dateiliste des Service Workers in den Kern (vorab geladen) und die Sprachpakete.
 *
 * Rolle im Gesamtbild: Der Build trägt alle Dateien der App in die Liste ein (vite.config.ts,
 * injectManifest). Seit V4 (Nutzungsprüfung 25.10.2026) lädt das Gerät davon nur den Kern vorab:
 * alles Deutsche, die Engine, Bilder und Schriften. Die Dateien einer weiteren Sprache (Buch- und
 * Trainerdaten unter daten/<sprache>/ und die Sprachdatei der Oberfläche als Baustein
 * assets/sprachpaket-<sprache>-…js) bilden ein Sprachpaket, das erst geladen wird, wenn der Leser
 * die Sprache wählt (sw/sprachpakete.ts). Die Einträge bleiben in der Liste, weil sie die Revision
 * jeder Datei tragen: So erkennt der Service Worker auch im Sprachpaket eine neue Fassung.
 * Abhängigkeiten: keine (reine Funktionen, auch in den Komponententests nutzbar).
 */

/** Ein Eintrag der Dateiliste, wie ihn vite-plugin-pwa einträgt (self.__WB_MANIFEST). */
export type Listeneintrag = string | { readonly url: string; readonly revision: string | null };

/** Ein Eintrag mit Adresse und Revision (null, wenn der Dateiname schon einen Hash trägt). */
export interface Paketdatei {
  readonly url: string;
  readonly revision: string | null;
}

/** Stand eines Sprachpakets auf dem Gerät: Zahl der Dateien und wie viele davon gespeichert sind. */
export interface Paketstand {
  readonly gesamt: number;
  readonly vorhanden: number;
}

/** Die Grundsprache: Ihre Dateien gehören immer zum Kern. */
const KERNSPRACHE = "de";
/** Buch- und Trainerdaten einer Sprache: daten/<sprache>/… */
const DATENORDNER = /^\/?daten\/([a-z]{2})\//;
/** Sprachdatei der Oberfläche als eigener Baustein: assets/sprachpaket-<sprache>-<hash>.js */
const SPRACHBAUSTEIN = /^\/?assets\/sprachpaket-([a-z]{2})-[\w-]+\.js$/;

/**
 * Zu welchem Sprachpaket gehört eine Datei?
 *
 * Warum: Nur die Dateien einer weiteren Sprache bleiben aus dem Vorabladen heraus; alles
 * Deutsche muss sofort und offline da sein (Freigabe des Autors zu V4).
 * Eingabe: Pfad wie in der Dateiliste, mit oder ohne führenden Schrägstrich.
 * Ausgabe: Sprachcode des Pakets oder null für den Kern.
 * Beispiel: "daten/en/a1/kap01.json" → "en"; "assets/sprachpaket-en-Bx3f.js" → "en";
 * "daten/de/a1/kap01.json" → null; "daten/praxisbuch.json" → null (gilt für alle Sprachen).
 */
export function sprachpaketVon(pfad: string): string | null {
  const code = DATENORDNER.exec(pfad)?.[1] ?? SPRACHBAUSTEIN.exec(pfad)?.[1] ?? null;
  return code === KERNSPRACHE ? null : code;
}

/** Ein Eintrag der Liste als Adresse mit Revision. */
function alsPaketdatei(eintrag: Listeneintrag): Paketdatei {
  return typeof eintrag === "string" ? { url: eintrag, revision: null } : eintrag;
}

/**
 * Teilt die Dateiliste in Kern und Sprachpakete.
 *
 * Eingabe: die Liste des Builds. Ausgabe: der Kern (für das Vorabladen, in der Form der Liste)
 * und je Sprache die Dateien ihres Pakets.
 * Beispiel: ["app/index.html", {url: "daten/en/a1/index.json", revision: "ab"}] →
 * kern ["app/index.html"], pakete { en: [{url: "daten/en/a1/index.json", revision: "ab"}] }.
 * Sonderfall: Eine Liste ohne fremde Sprache ergibt leere Pakete; der Kern ist dann die ganze Liste.
 */
export function teileDateiliste(liste: readonly Listeneintrag[]): {
  kern: Listeneintrag[];
  pakete: Record<string, Paketdatei[]>;
} {
  const kern: Listeneintrag[] = [];
  const pakete: Record<string, Paketdatei[]> = {};
  for (const eintrag of liste) {
    const datei = alsPaketdatei(eintrag);
    const code = sprachpaketVon(datei.url);
    if (code === null) kern.push(eintrag);
    else (pakete[code] ??= []).push(datei);
  }
  return { kern, pakete };
}
