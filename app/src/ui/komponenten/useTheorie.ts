/**
 * Lädt die Quellen der Theorie-Erkennung: Eröffnungsindex des Buches und Lichess-Baum.
 *
 * Rolle im Gesamtbild: Zugklasse „Theoriezug“ der Auswertung (Wunsch des Autors, 25.10.2026;
 * Regel in schach/theorie.ts) und die Namen im Rückblick (schach/theorienamen.ts). Beide Quellen
 * kommen aus einem Vorrat (eroeffnungsindexVorrat.ts, theoriebaumFuer) und werden einmal gebaut;
 * der Index wartet dafür bis nach dem nächsten Bild (V6), der Baum braucht nur Millisekunden.
 * Abhängigkeiten: daten/laden.ts, schach/theorie.ts, schach/theorienamen.ts, spiel/partie.ts,
 * useEroeffnungsindex.ts, useDaten.
 */
import { useMemo } from "react";
import { ladeEroeffnungsliste, type Eroeffnungsliste } from "../../daten/laden";
import { theoriebaumFuer, type Theoriequellen } from "../../schach/theorie";
import { theorienamen, type Theorieauskunft } from "../../schach/theorienamen";
import { stellungen, type Partie } from "../../spiel/partie";
import { ladeEroeffnungsindex } from "./useEroeffnungsindex";
import { useDaten } from "./useDaten";

/** Die Lichess-Liste; scheitert das Laden, gilt nur das Buch (wie bisher die Buchzüge). */
async function listeOderNichts(): Promise<Eroeffnungsliste | null> {
  try {
    return await ladeEroeffnungsliste();
  } catch (fehler: unknown) {
    console.error("Eröffnungsliste für die Theorie nicht geladen:", fehler);
    return null;
  }
}

/**
 * Beide Quellen, sobald geladen und gebaut.
 * Beispiel: in der Partie nach dem Ende → Quellen; danach erkennt die Auswertung 1. e4 als
 * Theoriezug.
 */
export async function ladeTheorie(): Promise<Theoriequellen> {
  const [buch, liste] = await Promise.all([ladeEroeffnungsindex(), listeOderNichts()]);
  return { buch, baum: liste ? theoriebaumFuer(liste) : null };
}

/** Die Quellen; während des Ladens oder nach einem Fehler undefined (dann keine Theoriezüge). */
export function useTheorie(): Theoriequellen | undefined {
  const daten = useDaten(ladeTheorie, "theorie");
  return daten.art === "fertig" ? daten.wert : undefined;
}

/**
 * Die Auskunft zum gezeigten Zug, nur bei einem Theoriezug und geladenen Quellen.
 * Beispiel: 3. Lb5 nach 1. e4 e5 2. Sf3 Sc6 → „Spanische Partie“ …, kein Gambit.
 */
export function useTheorieauskunft(
  quellen: Theoriequellen | null | undefined,
  partie: Partie,
  index: number,
  theoriezug: boolean,
): Theorieauskunft | null {
  return useMemo(() => {
    if (!quellen || !theoriezug) return null;
    const fens = stellungen(partie).slice(0, index + 2);
    const sans = partie.zuege.slice(0, index + 1).map((z) => z.san);
    const auskunft = theorienamen(quellen, fens, sans);
    return auskunft.namen.length > 0 ? auskunft : null;
  }, [quellen, partie, index, theoriezug]);
}
