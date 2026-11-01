/**
 * Varianten mit einem Eintrag der Lernsammlung oder der Fehlerdatenbank verknüpfen und lösen,
 * ohne das Speicherformat zu ändern.
 *
 * Rolle im Gesamtbild: Variationsbrowser, Stufe 4 (Wunsch des Autors, 1.11.2026: „Beim Anlegen
 * und Bearbeiten eines Lernsammlungs-Eintrags eine Variante verknüpfen; beim Training der
 * Lernsammlung auch die Varianten abfragen“). Format 8 kennt schon die Quelle einer Variante
 * ({ art: "sammlung", id }); verknüpft ist eine Variante genau dann, wenn ihre Quelle der Eintrag
 * ist (training/variationen.ts, variationenZu). Verknüpfen setzt also die Quelle, Lösen setzt sie
 * auf „Stellung“ zurück. Eine Variante hat so höchstens einen Eintrag; ihre frühere Quelle
 * (etwa eine Abbildung) gibt sie beim Verknüpfen ab (Rückfrage an den Autor im Bericht).
 * Reine Funktionen.
 * Abhängigkeiten: training/variationen.ts.
 */
import {
  mitVariation,
  neueVariationskennung,
  variationenZu,
  type Variation,
  type Variationsquelle,
} from "./variationen";

/** Ein Eintrag, an den Varianten gehängt werden können. */
export type Verknuepfungsziel = { readonly art: "sammlung" | "fehler"; readonly id: string };

/** Wert der Auswahl „Variante“: keine weitere, eine neue aus der Stellung oder eine Kennung. */
export const WAHL_KEINE = "";
export const WAHL_NEU = "neu";

/** Was der Leser im Formular gewählt hat; angewandt wird beim Speichern. */
export interface Variantenwahl {
  /** WAHL_KEINE, WAHL_NEU oder die Kennung einer vorhandenen Variante. */
  readonly wahl: string;
  /** Kennungen verknüpfter Varianten, die gelöst werden sollen. */
  readonly loesen: readonly string[];
}

export const KEINE_WAHL: Variantenwahl = { wahl: WAHL_KEINE, loesen: [] };

/** Die mit dem Eintrag verknüpften Varianten. */
export function verknuepfte(liste: readonly Variation[], ziel: Verknuepfungsziel): readonly Variation[] {
  return variationenZu(liste, ziel);
}

/** Die Varianten, die sich noch verknüpfen lassen (alle anderen), zuletzt geänderte zuerst. */
export function waehlbare(liste: readonly Variation[], ziel: Verknuepfungsziel | null): Variation[] {
  const schon = new Set(ziel ? verknuepfte(liste, ziel).map((v) => v.id) : []);
  return liste.filter((v) => !schon.has(v.id)).sort((a, b) => b.geaendert.localeCompare(a.geaendert));
}

/** Setzt die Quelle einer Variante (geändert jetzt); fehlt sie, bleibt die Liste. */
function mitQuelle(
  liste: readonly Variation[],
  id: string,
  quelle: Variationsquelle,
  jetzt: Date,
): readonly Variation[] {
  return liste.map((v) => (v.id === id ? { ...v, quelle, geaendert: jetzt.toISOString() } : v));
}

/**
 * Wendet die Wahl auf die Varianten an: lösen, eine vorhandene verknüpfen oder eine neue aus der
 * Stellung des Eintrags anlegen (``neu`` baut ihren Entwurf, etwa ausSammlung).
 *
 * Ausgabe: neue Liste; passt eine neue Variante nicht mehr (Grenze), bleibt sie weg und
 * ``grenze`` ist true (die Oberfläche meldet es).
 * Beispiel: Eintrag „Spanisch, Plan: d4 vorbereiten“, Wahl „neu“ → eine neue Variante mit der
 * Quelle { art: "sammlung", id } und dem Weg zur Stellung.
 */
export function mitVariantenwahl(
  liste: readonly Variation[],
  ziel: Verknuepfungsziel,
  wahl: Variantenwahl,
  neu: () => Variation | null,
  jetzt: Date,
): { readonly liste: readonly Variation[]; readonly grenze: boolean } {
  let ergebnis = liste;
  for (const id of wahl.loesen) ergebnis = mitQuelle(ergebnis, id, { art: "fen" }, jetzt);
  if (wahl.wahl === WAHL_KEINE) return { liste: ergebnis, grenze: false };
  if (wahl.wahl !== WAHL_NEU) return { liste: mitQuelle(ergebnis, wahl.wahl, ziel, jetzt), grenze: false };
  const entwurf = neu();
  if (!entwurf) return { liste: ergebnis, grenze: false };
  const variation = { ...entwurf, id: neueVariationskennung(jetzt), quelle: ziel };
  const gespeichert = mitVariation(ergebnis, variation);
  return "liste" in gespeichert ? { liste: gespeichert.liste, grenze: false } : { liste: ergebnis, grenze: true };
}
