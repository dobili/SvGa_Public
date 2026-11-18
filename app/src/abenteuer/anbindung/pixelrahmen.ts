/**
 * Pixelrahmen der Spieloberfläche (Entscheidung G2, 9.11.2026): Fenster, Knöpfe und Karten des
 * Spiels bekommen Rahmen im Pixelstil der Welt, nachgefärbt auf die Farben der App.
 *
 * Rolle im Gesamtbild: Das Zusatzpaket enthält `ui/rahmen.json` und die Bilder (eigene Platzhalter
 * aus inhalte/abenteuer/ui, später die gekauften Rahmen aus Modern UI im privaten Ordner). Diese
 * Datei lädt sie und liefert CSS-Variablen; abenteuer-atmosphaere.css zeichnet damit `border-image` unter der
 * Klasse `mit-pixelrahmen`. Fehlt etwas, bleibt das bisherige Aussehen (keine Klasse).
 * Abhängigkeiten: paket/paketlader.ts.
 */
import { useEffect, useState, type CSSProperties } from "react";
import { beiPaketAenderung, liesPaketJson, paketdateiAlsAdresse } from "../paket/paketlader";

/** Ein Rahmen: Bild im Paket, Schnittbreite im Bild (Pixel), Randbreite auf dem Schirm (CSS-Pixel). */
export interface Rahmenangabe {
  readonly datei: string;
  readonly schnitt: number;
  readonly breite: number;
}

/** Die Rahmenarten der Oberfläche. */
export const RAHMENARTEN = ["fenster", "knopf", "karte"] as const;
export type Rahmenart = (typeof RAHMENARTEN)[number];

/** Klasse und Stil für das Wurzelelement; null, solange nichts geladen ist. */
export interface Pixelrahmen {
  readonly klasse: string;
  readonly stil: CSSProperties;
}

/**
 * Die CSS-Variablen eines Satzes Rahmen.
 *
 * Beispiel: fenster {schnitt 8, breite 16}, Adresse „blob:…“ → `--rahmen-fenster-bild:
 * url("blob:…")`, `--rahmen-fenster-schnitt: 8`, `--rahmen-fenster-breite: 16px`.
 * Sonderfall: Rahmen ohne Adresse fehlen in den Variablen (die CSS-Regel greift dann nicht).
 */
export function rahmenvariablen(
  angaben: Partial<Record<Rahmenart, Rahmenangabe>>,
  adressen: Partial<Record<Rahmenart, string>>,
): Record<string, string> {
  const variablen: Record<string, string> = {};
  for (const art of RAHMENARTEN) {
    const angabe = angaben[art];
    const adresse = adressen[art];
    if (!angabe || !adresse) continue;
    variablen[`--rahmen-${art}-bild`] = `url("${adresse}")`;
    variablen[`--rahmen-${art}-schnitt`] = String(angabe.schnitt);
    variablen[`--rahmen-${art}-breite`] = `${angabe.breite}px`;
  }
  return variablen;
}

/**
 * Einmal geladen, bis sich das Paket ändert. Dann gibt der Paketlader alle Bildadressen frei
 * (paketlader.ts, vergiss): Wer die alten Rahmen behielt, zeichnete Fenster ohne Grund, weiße
 * Schrift auf der Karte. So war es in jeder Sitzung, in der das Paket erst geladen wurde, weil die
 * Startkarte die Rahmen schon vorher holt (Befund im Browser, 18.11.2026).
 */
let geladen: Promise<Pixelrahmen | null> | null = null;
beiPaketAenderung(() => {
  geladen = null;
});

async function ladeRahmen(): Promise<Pixelrahmen | null> {
  const angaben = await liesPaketJson<Partial<Record<Rahmenart, Rahmenangabe>>>("ui/rahmen.json");
  const adressen: Partial<Record<Rahmenart, string>> = {};
  for (const art of RAHMENARTEN) {
    const angabe = angaben[art];
    if (angabe) adressen[art] = await paketdateiAlsAdresse(angabe.datei);
  }
  const variablen = rahmenvariablen(angaben, adressen);
  if (Object.keys(variablen).length === 0) return null;
  return { klasse: "mit-pixelrahmen", stil: variablen as CSSProperties };
}

/**
 * Die Pixelrahmen für ein Wurzelelement des Spiels; ohne Paket oder Rahmen null.
 * Ein Fehler beim Laden ist kein Spielfehler: Er wird gemeldet, das Spiel bleibt im alten Aussehen.
 */
export function usePixelrahmen(): Pixelrahmen | null {
  const [rahmen, setzeRahmen] = useState<Pixelrahmen | null>(null);
  useEffect(() => {
    let aktiv = true;
    const lade = () => {
      geladen ??= ladeRahmen().catch((fehler: unknown) => {
        console.warn("Pixelrahmen nicht geladen:", fehler);
        return null;
      });
      const dieser = geladen;
      void dieser.then((r) => {
        // Nur der neueste Satz gilt: Die Adressen eines älteren sind schon freigegeben.
        if (aktiv && dieser === geladen) setzeRahmen(r);
      });
    };
    lade();
    // Nach einer Paketänderung neu laden (der Merker oben ist dann schon geleert).
    const abmelden = beiPaketAenderung(lade);
    return () => {
      aktiv = false;
      abmelden();
    };
  }, []);
  return rahmen;
}
