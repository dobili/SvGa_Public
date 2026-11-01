/**
 * Löst den Wert der Ansicht „variante“ in eine Variante auf: gespeichert oder neuer Entwurf.
 *
 * Rolle im Gesamtbild: Der Bildschirm „Variante“ (ui/bildschirme/Variante.tsx) fragt hier nach
 * dem Anfangsstand. Gespeicherte Varianten kommen aus dem Speicher, Entwürfe aus der Quelle
 * (entwurfAusDaten.ts); eine Abbildung lädt dazu ihr Kapitel (Buchbaum, Frage h).
 * Abhängigkeiten: daten/laden.ts, speicher, training/variationsquellen.ts, variantenwert.ts.
 */
import { useMemo } from "react";
import { ladeKapitel, type Kapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import type { Pfad } from "../../../schach/variationsbaum";
import { useSpeicher } from "../../../speicher/speicher";
import type { Variation } from "../../../training/variationen";
import { ausAbbildung } from "../../../training/variationsquellen";
import { useDaten, type Ladezustand } from "../bausteine/useDaten";
import { entwurfAusDaten } from "./entwurfAusDaten";
import { gemerkterPfad, wertAus, type Entwurfsquelle } from "./variantenwert";

/** Anfangsstand des Bildschirms. */
export type Anfang =
  | { readonly art: "laedt" }
  | { readonly art: "fehlt" }
  | { readonly art: "fertig"; readonly variation: Variation; readonly pfad: Pfad };

/** Der Entwurf aus einer Abbildung, sobald ihr Kapitel geladen ist. */
function ausKapitel(
  kapitel: Ladezustand<Kapitel | null>,
  quelle: Extract<Entwurfsquelle, { art: "abbildung" }>,
): Anfang {
  if (kapitel.art === "laedt") return { art: "laedt" };
  const abbildung =
    kapitel.art === "fertig" ? kapitel.wert?.abbildungen.find((a) => a.id === quelle.nummer) : null;
  if (!abbildung || kapitel.art !== "fertig" || !kapitel.wert) return { art: "fehlt" };
  const verweis = abbildung.beispiel;
  const beispiel = verweis ? kapitel.wert.beispiele.find((b) => b.id === verweis.id) : null;
  const pfad = quelle.pfad ?? verweis?.pfad ?? [];
  const titel = t("abbildung.titel", { nummer: abbildung.id });
  const v = ausAbbildung(
    { nummer: abbildung.id, fen: abbildung.fen, beispiel: beispiel ?? null, pfad },
    titel,
    new Date(),
  );
  return v ? { art: "fertig", variation: v, pfad: v.startpfad } : { art: "fehlt" };
}

/** Kapitelnummer einer Abbildung („2.40“ → 2); 0, wenn keine Abbildung verlangt ist. */
function kapitelVon(quelle: Entwurfsquelle | null): number {
  return quelle?.art === "abbildung" ? Number(quelle.nummer.split(".")[0]) : 0;
}

/**
 * Der Anfangsstand zum Wert der Ansicht.
 * Beispiel: „neu:abbildung:2.40“ → Entwurf mit dem Buchbaum, geöffnet an Abb. 2.40;
 * „var-…“ → die gespeicherte Variante am zuletzt gezeigten Zug.
 * Sonderfälle: Unbekannte Kennung, gelöschte Partie, Lehrbild ohne König → „fehlt“.
 */
export function useVariantenentwurf(wert: string | null): Anfang {
  const gelesen = useMemo(() => wertAus(wert), [wert]);
  const quelle = gelesen?.art === "neu" ? gelesen.quelle : null;
  const kapitelnummer = kapitelVon(quelle);
  const kapitel = useDaten<Kapitel | null>(
    () => (kapitelnummer > 0 ? ladeKapitel(kapitelnummer) : Promise.resolve(null)),
    `varianten-kapitel-${kapitelnummer}`,
  );
  const geladen = useSpeicher((z) => z.geladen);
  const daten = useSpeicher((z) => z.daten);
  return useMemo((): Anfang => {
    if (!gelesen) return { art: "fehlt" };
    if (!geladen) return { art: "laedt" };
    if (gelesen.art === "gespeichert") {
      const v = daten.variationen.find((x) => x.id === gelesen.id);
      return v
        ? { art: "fertig", variation: v, pfad: gemerkterPfad(v.id) ?? v.startpfad }
        : { art: "fehlt" };
    }
    if (gelesen.quelle.art === "abbildung") return ausKapitel(kapitel, gelesen.quelle);
    const v = entwurfAusDaten(gelesen.quelle, daten, new Date());
    return v ? { art: "fertig", variation: v, pfad: v.startpfad } : { art: "fehlt" };
    // Nur beim Öffnen: Spätere Änderungen hält der Bildschirm selbst (useVariante.ts).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gelesen, geladen, kapitel.art]);
}
