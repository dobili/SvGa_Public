/**
 * Zustand des Bildschirms „Variante“: gezeigter Pfad, Ziehen legt Abzweige an, Menü am Zug,
 * Kommentare, Rückgängig nach dem Löschen.
 *
 * Rolle im Gesamtbild: Verbindet den Zugbaum (schach/variationsbaum.ts, variationsaenderung.ts)
 * mit der Arbeitskopie (useVariantenspeicher.ts). Bedienung nach Frage b (Empfehlung B):
 * „Vor“ folgt der Hauptvariante, ein Tipp auf einen Chip „Weiter: …“ wählt eine Nebenvariante.
 * Ein gezogener Zug, den es an dieser Stelle schon gibt, springt hinein; sonst wird er als
 * letzte Fortsetzung angehängt (nie automatisch Hauptvariante).
 * Abhängigkeiten: schach/variationsbaum.ts, schach/variationsaenderung.ts, schach/weiterspielen.ts,
 * useVariantenspeicher.ts.
 */
import { useCallback, useState } from "react";
import type { Rolle } from "../../../schach/stellung";
import {
  alsHauptvariante,
  mitFortsetzung,
  mitZugdaten,
  ohneAbHier,
  type Zugaenderung,
} from "../../../schach/variationsaenderung";
import {
  fenAm,
  fortsetzungenAm,
  hauptlinieBisEnde,
  type Pfad,
} from "../../../schach/variationsbaum";
import { spieleZug, type Zugversuch } from "../../../schach/weiterspielen";
import type { Variation } from "../../../training/variationen";
import type { Zugrichtung } from "../brettbedienung/Zugknoepfe";
import { useVariantenspeicher, type Variantenspeicher } from "./useVariantenspeicher";

/** Was nach „Ab hier löschen“ zurückgeholt werden kann. */
interface Rueckholung {
  readonly variation: Variation;
  readonly pfad: Pfad;
}

export interface Variantenstand extends Variantenspeicher {
  readonly pfad: Pfad;
  readonly fen: string;
  readonly springe: (pfad: Pfad) => void;
  readonly schritt: (richtung: Zugrichtung) => void;
  readonly kann: { readonly zurueck: boolean; readonly vor: boolean };
  readonly spiele: (von: string, nach: string, umwandlung?: Rolle) => Zugversuch["art"];
  readonly zurHauptvariante: (pfad: Pfad) => void;
  readonly abHierLoeschen: (pfad: Pfad) => void;
  readonly aendereZug: (pfad: Pfad, teil: Zugaenderung, art: "sofort" | "pause") => void;
  /** Die zuletzt gelöschten Züge, solange „Rückgängig“ angeboten wird. */
  readonly geloescht: Rueckholung | null;
  readonly rueckgaengig: () => void;
  /** Eine Stellung hat schon 30 Fortsetzungen (Grenze, Meldung). */
  readonly voll: boolean;
}

/** Pfad nach einem Schritt der Zugknöpfe; „vor“ und „ende“ folgen der Hauptvariante. */
function pfadNach(v: Variation, pfad: Pfad, richtung: Zugrichtung): Pfad {
  if (richtung === "anfang") return [];
  if (richtung === "zurueck") return pfad.slice(0, -1);
  if (richtung === "ende") return hauptlinieBisEnde(v, pfad);
  const naechster = fortsetzungenAm(v, pfad)[0];
  return naechster ? [...pfad, naechster.zug] : pfad;
}

/** Die Änderungen am Baum: Hauptvariante, ab hier löschen (mit Rückgängig), Zugdaten. */
function useBaumaenderungen(speicher: Variantenspeicher, setzePfad: (p: Pfad) => void) {
  const { variation: v, aendereVariation } = speicher;
  const [geloescht, setzeGeloescht] = useState<Rueckholung | null>(null);
  const zurHauptvariante = (pfad: Pfad) =>
    aendereVariation({ ...v, zuege: alsHauptvariante(v, pfad) }, "sofort");
  const abHierLoeschen = (pfad: Pfad) => {
    const ergebnis = ohneAbHier(v, pfad);
    if (aendereVariation({ ...v, zuege: ergebnis.zuege }, "sofort")) {
      setzeGeloescht({ variation: v, pfad });
      setzePfad(ergebnis.pfad);
    }
  };
  const aendereZug = (pfad: Pfad, teil: Zugaenderung, art: "sofort" | "pause") =>
    aendereVariation({ ...v, zuege: mitZugdaten(v, pfad, teil) }, art);
  const rueckgaengig = () => {
    if (!geloescht) return;
    aendereVariation({ ...geloescht.variation, id: v.id }, "sofort");
    setzePfad(geloescht.pfad);
    setzeGeloescht(null);
  };
  return { zurHauptvariante, abHierLoeschen, aendereZug, geloescht, rueckgaengig };
}

/**
 * Der ganze Zustand des Bildschirms.
 * Beispiel aus dem Buch: Abb. 2.40 geöffnet, Leser zieht 3... Sxe4 statt 3... d6 → neuer Abzweig,
 * die Variante wird gespeichert, die Leiste zeigt nach 3. Sxe5 die Gabel mit „2“.
 */
export function useVariante(anfang: Variation, anfangspfad: Pfad): Variantenstand {
  const speicher = useVariantenspeicher(anfang);
  const v = speicher.variation;
  const [pfad, setzePfad] = useState<Pfad>(anfangspfad);
  const [voll, setzeVoll] = useState(false);
  const fen = fenAm(v, pfad) ?? v.startFen;
  const springe = useCallback((neu: Pfad) => setzePfad(neu), []);
  const aenderungen = useBaumaenderungen(speicher, setzePfad);
  const spiele = (von: string, nach: string, umwandlung?: Rolle): Zugversuch["art"] => {
    const versuch = spieleZug(fen, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    const ergebnis = mitFortsetzung(v, pfad, versuch.san);
    setzeVoll(ergebnis.art === "voll");
    if (ergebnis.art === "vorhanden") setzePfad(ergebnis.pfad);
    if (
      ergebnis.art === "neu" &&
      speicher.aendereVariation({ ...v, zuege: ergebnis.zuege }, "sofort")
    )
      setzePfad(ergebnis.pfad);
    return "gespielt";
  };
  return {
    ...speicher,
    ...aenderungen,
    pfad,
    fen,
    springe,
    schritt: (richtung) => setzePfad(pfadNach(v, pfad, richtung)),
    kann: { zurueck: pfad.length > 0, vor: fortsetzungenAm(v, pfad).length > 0 },
    spiele,
    voll,
  };
}
