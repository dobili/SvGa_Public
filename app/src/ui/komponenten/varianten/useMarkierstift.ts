/**
 * Der Stift der Variante: Farbe wählen, Feld zweimal antippen setzt einen Rahmen, Feld und dann
 * Zielfeld einen Pfeil; Radierer mit Rückgängig.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 2 (Frage e, Entscheidung C). Ziehen und Zeichnen
 * sind getrennte Modi (Entwurf, Abschnitt 8: „damit ein Tipp nie zwei Bedeutungen hat“): Ist der
 * Stift an, bekommt das Brett eine eigene Bedienung (dieselbe Form wie useBrettbedienung), die
 * nur zeichnet. Die Marken gehören zur gezeigten Stellung (Startstellung: `start` der Variante,
 * sonst der Knoten des Zuges davor) und werden sofort gespeichert; ein Entwurf wird damit zur
 * gespeicherten Variante (wie beim ersten eigenen Zug).
 * Abhängigkeiten: training/variationsmarken.ts, schach/variationsaenderung.ts,
 * schach/variationsbaum.ts, useVariante.ts, brettbedienung/useBrettbedienung.ts (Typ).
 */
import { useCallback, useState } from "react";
import type { Markierungsfarbe } from "../../../analyse/werkzeug";
import { mitKnotendaten } from "../../../schach/variationsaenderung";
import { knotenAm, type Pfad } from "../../../schach/variationsbaum";
import type { Knotendaten, Variation } from "../../../training/variationen";
import { mitMarke, ohneMarken } from "../../../training/variationsmarken";
import type { Brettbedienung } from "../brettbedienung/useBrettbedienung";
import type { Variantenstand } from "./useVariante";

/** Die Knotendaten der gezeigten Stellung. */
export function knotendatenAm(v: Variation, pfad: Pfad): Knotendaten {
  return pfad.length === 0 ? v.start : (knotenAm(v, pfad) ?? {});
}

/**
 * Knotendaten (Wurzel oder Zug) mit Marken, Nummerntexten und Marken ohne Nummer (Format 9) aus
 * ``daten``; der Rest bleibt.
 */
function mitDaten<T extends Knotendaten>(k: T, daten: Knotendaten): T {
  const roh = {
    ...k,
    marken: daten.marken,
    nummerntexte: daten.nummerntexte,
    ohneNummer: daten.ohneNummer,
  };
  // Leere Felder fallen ganz weg, damit der Speicher keine „undefined“-Einträge trägt.
  return Object.fromEntries(Object.entries(roh).filter(([, wert]) => wert !== undefined)) as T;
}

/** Die Variante mit neuen Knotendaten an ``pfad`` (Marken und Nummerntexte). */
export function variationMitDaten(v: Variation, pfad: Pfad, daten: Knotendaten): Variation {
  if (pfad.length === 0) return { ...v, start: mitDaten(v.start, daten) };
  return { ...v, zuege: mitKnotendaten(v, pfad, (k) => mitDaten(k, daten)) };
}

/** Was der Bildschirm vom Stift braucht. */
export interface Markierstift {
  readonly an: boolean;
  readonly schalte: (an: boolean) => void;
  readonly farbe: Markierungsfarbe;
  readonly waehleFarbe: (farbe: Markierungsfarbe) => void;
  /** Das zuerst angetippte Feld, solange das Ziel fehlt. */
  readonly start: string | null;
  /** Bedienung des Brettes, solange der Stift an ist. */
  readonly bedienung: Brettbedienung;
  readonly radiere: () => void;
  /** Die Marken vor dem Radieren, solange „Rückgängig“ angeboten wird. */
  readonly geleert: Knotendaten | null;
  readonly holeZurueck: () => void;
  /** Die Grenze von 24 Marken ist erreicht (Meldung). */
  readonly voll: boolean;
}

/** Die Bedienung des Brettes im Stift-Modus: nur Antippen, kein Ziehen. */
function stiftbedienung(start: string | null, beiFeld: (feld: string) => void): Brettbedienung {
  return {
    zaehlfeld: null,
    ausgewaehlt: start,
    ziele: [],
    gesperrt: null,
    umwandlungOffen: false,
    beiFeld,
    ziehen: null,
    vergiss: () => undefined,
    waehleUmwandlung: () => undefined,
  };
}

/** Der Radierer: leert die Stellung und bietet „Rückgängig“ an, solange sie gezeigt wird. */
function useRadierer(v: Variation, pfad: Pfad, setze: (daten: Knotendaten) => void) {
  const [geleert, setzeGeleert] = useState<{ pfad: Pfad; daten: Knotendaten } | null>(null);
  const hier = geleert && geleert.pfad.join(" ") === pfad.join(" ") ? geleert.daten : null;
  const radiere = () => {
    const vorher = knotendatenAm(v, pfad);
    if (!vorher.marken) return;
    setzeGeleert({ pfad, daten: vorher });
    setze(ohneMarken(vorher));
  };
  const holeZurueck = () => {
    if (hier) setze(hier);
    setzeGeleert(null);
  };
  return { radiere, geleert: hier, holeZurueck, vergiss: () => setzeGeleert(null) };
}

/**
 * Zustand und Bedienung des Stifts für die gezeigte Stellung.
 * Beispiel: Gold gewählt, e2 und e4 antippen → goldener Pfeil „Gold 1“; e8 zweimal → Rahmen
 * „Gold 2“; noch einmal e2, e4 → der Pfeil ist weg, der Rahmen wird „Gold 1“.
 */
export function useMarkierstift(stand: Variantenstand): Markierstift {
  const [an, setzeAn] = useState(false);
  const [farbe, waehleFarbe] = useState<Markierungsfarbe>("gold");
  const [start, setzeStart] = useState<{ fen: string; feld: string } | null>(null);
  const [voll, setzeVoll] = useState(false);
  const { variation: v, pfad, fen, aendereVariation } = stand;
  const hier = start?.fen === fen ? start.feld : null;
  const setze = useCallback(
    (daten: Knotendaten) => aendereVariation(variationMitDaten(v, pfad, daten), "sofort"),
    [v, pfad, aendereVariation],
  );
  const beiFeld = (feld: string) => {
    if (!hier) return setzeStart({ fen, feld });
    setzeStart(null);
    const nach = feld === hier ? null : feld;
    const ergebnis = mitMarke(knotendatenAm(v, pfad), farbe, hier, nach, v.nummernAus);
    setzeVoll(ergebnis.art === "voll");
    if (ergebnis.art !== "voll") setze(ergebnis.daten);
  };
  const radierer = useRadierer(v, pfad, setze);
  const schalte = (neu: boolean) => {
    setzeAn(neu);
    setzeStart(null);
    setzeVoll(false);
    radierer.vergiss();
  };
  return {
    an,
    schalte,
    farbe,
    waehleFarbe,
    start: hier,
    bedienung: stiftbedienung(hier, beiFeld),
    radiere: radierer.radiere,
    geleert: radierer.geleert,
    holeZurueck: radierer.holeZurueck,
    voll,
  };
}
