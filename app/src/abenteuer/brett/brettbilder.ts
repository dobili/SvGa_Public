/**
 * Gezeichnete Bretter und Figurensätze der Brettstile aus dem Paket des Schach-Abenteuers.
 *
 * Rolle im Gesamtbild: Der Autor lässt je Ort ein Brett und einen Figurensatz bei Gemini zeichnen
 * (Wunsch des Autors, 14.11.2026). pipeline/abenteuer/brettbilder.py schneidet sie zu und legt sie
 * im privaten Repository ab, der Paketbau (skripte/brettbilder-paket.mjs) bringt sie unter
 * brett/<stil>/ ins Paket. Hier werden sie gelesen: Gibt es zu einem Stil ein Brettbild, zeigt das
 * Brett im Abenteuer dieses Bild statt der Feldfarben (Bilderzeichnung.tsx); gibt es alle zwölf
 * Figuren, ersetzen sie die Pixelfiguren. Ohne Dateien bleibt alles beim gerechneten Stil.
 * Abhängigkeiten: paket/paketlader.ts, brettstile.ts (Kennungen).
 */
import {
  beiPaketAenderung,
  liesPaketJson,
  paketdateiAlsAdresseOderNull,
} from "../paket/paketlader";
import type { Brettstilkennung } from "./brettstile";

/** FEN-Zeichen der zwölf Figuren in der Reihenfolge des Figurenblatts (oben Weiß). */
export const FIGURZEICHEN = ["K", "Q", "R", "B", "N", "P", "k", "q", "r", "b", "n", "p"] as const;

/** Mittlere Feldfarben des Bildes (brett.json), für Koordinaten und Schimmer der App. */
export interface Brettbildfarben {
  readonly hell: string;
  readonly dunkel: string;
}

/** Was das Paket zu einem Stil an Bildern hat; Adressen sind Objekt-Adressen (blob:). */
export interface Brettbilder {
  readonly brett: string;
  /** FEN-Zeichen → Adresse; null, wenn nicht alle zwölf Figuren da sind. */
  readonly figuren: Readonly<Record<string, string>> | null;
  readonly farben: Brettbildfarben | null;
}

/**
 * Pfad einer Datei des Stils im Paket.
 *
 * Beispiel: („schiefer“, „n“) → „brett/schiefer/bN.webp“; („schiefer“, null) → das Brett.
 */
export function brettbildpfad(kennung: Brettstilkennung, zeichen: string | null): string {
  if (zeichen === null) return `brett/${kennung}/brett.webp`;
  const farbe = zeichen === zeichen.toUpperCase() ? "w" : "b";
  return `brett/${kennung}/${farbe}${zeichen.toUpperCase()}.webp`;
}

/** Eine Farbe aus brett.json, nur in Hex-Schreibweise (sonst keine). */
const HEXFARBE = /^#[0-9A-Fa-f]{6}$/;

/** Die Feldfarben aus brett.json; null, wenn die Datei fehlt oder nicht passt. */
async function ladeFarben(kennung: Brettstilkennung): Promise<Brettbildfarben | null> {
  try {
    const angaben = await liesPaketJson<Partial<Brettbildfarben>>(`brett/${kennung}/brett.json`);
    const { hell, dunkel } = angaben;
    if (!hell || !dunkel || !HEXFARBE.test(hell) || !HEXFARBE.test(dunkel)) return null;
    return { hell, dunkel };
  } catch (fehler: unknown) {
    console.warn("Brettbild: Farben nicht gelesen", kennung, fehler);
    return null;
  }
}

/**
 * Lädt Brett, Figuren und Farben eines Stils aus dem Paket.
 *
 * Ausgabe: null ohne Brettbild (dann fragt es auch nicht nach Figuren). Figuren nur, wenn alle
 * zwölf da sind: Ein halber Satz neben Pixelfiguren sähe falsch aus.
 * Beispiel: „schiefer“ mit allen 13 Bildern → Brett, zwölf Figuren und die Farben aus brett.json.
 */
export async function ladeBrettbilder(kennung: Brettstilkennung): Promise<Brettbilder | null> {
  const brett = await paketdateiAlsAdresseOderNull(brettbildpfad(kennung, null));
  if (!brett) return null;
  const adressen = await Promise.all(
    FIGURZEICHEN.map((z) => paketdateiAlsAdresseOderNull(brettbildpfad(kennung, z))),
  );
  const vollstaendig = adressen.every((a): a is string => a !== null);
  const figuren = vollstaendig
    ? Object.fromEntries(FIGURZEICHEN.map((z, i) => [z, adressen[i] ?? ""]))
    : null;
  return { brett, figuren, farben: await ladeFarben(kennung) };
}

/** Einmal geladene Bilder je Stil für die ganze Sitzung (Objekt-Adressen bleiben gültig). */
const geladen = new Map<Brettstilkennung, Promise<Brettbilder | null>>();
/** Schon fertige Ergebnisse, damit eine wieder geöffnete Ansicht ohne Wartezeit zeichnet. */
const fertig = new Map<Brettstilkennung, Brettbilder | null>();

/** Bilder eines Stils, je Sitzung einmal geladen; ein Fehler gilt als „keine Bilder“. */
export function brettbilderVon(kennung: Brettstilkennung): Promise<Brettbilder | null> {
  let laden = geladen.get(kennung);
  if (!laden) {
    laden = ladeBrettbilder(kennung)
      .catch((fehler: unknown) => {
        console.warn("Brettbilder nicht geladen:", kennung, fehler);
        return null;
      })
      .then((bilder) => {
        fertig.set(kennung, bilder);
        return bilder;
      });
    geladen.set(kennung, laden);
  }
  return laden;
}

/** Das fertige Ergebnis, wenn schon geladen; undefined, solange es noch nicht feststeht. */
export function brettbilderFertig(kennung: Brettstilkennung): Brettbilder | null | undefined {
  return fertig.get(kennung);
}

/** Vergisst alle geladenen Bilder (neues Paket, Tests). */
export function vergissBrettbilder(): void {
  geladen.clear();
  fertig.clear();
}

// Ein neues oder gelöschtes Paket kann andere Bilder haben: dann neu fragen.
beiPaketAenderung(vergissBrettbilder);
