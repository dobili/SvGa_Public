/**
 * Kurze Partieformen in der Spielhülle: zählt die Züge bis zur Wertung, lässt die Stellung dann
 * von der Auswertungs-Engine bewerten und beendet die Partie nach den Regeln R13 bis R13b.
 *
 * Rolle im Gesamtbild: PartieHuelle.tsx ruft den Hook mit der laufenden Partie. Die Regeln stehen
 * in regeln/kurzform.ts (ohne Engine getestet); hier nur der Ablauf: wann rechnen, wie schreiben.
 * Geschrieben wird nur, wenn die Partie noch dieselbe Zugzahl hat (Muster wie die rechnenden
 * Karten, kartenwirkungen.ts, stellungNochGleich).
 * Abhängigkeiten: engine/engineDienst.ts (Auswertungs-Engine), ui/komponenten/partie/botzug.ts
 * (aendereNeueste), spiel/ablauf.ts (Uhr anhalten), regeln/kurzform.ts.
 * Beispiel: Stellungsduell mit 10 Zügen; nach dem 10. Zug des Lesers und der Antwort des Gegners
 * bewertet die Engine +1,3 → Ende „ziel“ mit dem Leser als Sieger.
 */
import { useEffect, useRef, useState } from "react";
import { auswertungsEngine } from "../../engine/engineDienst";
import { wertFuer } from "../../engine/fallenurteil";
import { pausiere } from "../../spiel/ablauf";
import { stellungen, type Partie } from "../../spiel/partie";
import { aendereNeueste } from "../../ui/komponenten/partie/botzug";
import { kurzformEnde, restzuege, wertungFaellig, type Kurzform } from "../regeln/kurzform";

/** Rechenzeit und Tiefe der Wertung (Regelwerk R13: Auswertungs-Engine, Tiefe 12). */
const WERTUNG_MS = 1500;
const WERTUNG_TIEFE = 12;

/** Bewertung einer Stellung aus Sicht einer Farbe in Bauern; im Test austauschbar. */
export type Kurzformbewerter = (
  fen: string,
  farbe: Partie["einstellung"]["eigeneFarbe"],
) => Promise<number>;

/** Die Auswertungs-Engine der App als Bewerter (Matt zählt als großer Wert). */
export const bewerteMitEngine: Kurzformbewerter = async (fen, farbe) => {
  const bewertung = await auswertungsEngine.bewerte(fen, WERTUNG_MS, 1, {
    art: "tiefe",
    tiefe: WERTUNG_TIEFE,
  });
  const wert = bewertung.varianten[0]?.wert;
  return wert ? wertFuer(wert, farbe) : 0;
};

/** Was die Hülle anzeigt: die Form, die restlichen Züge und ob gerade gerechnet wird. */
export interface Kurzformstand {
  readonly form: Kurzform;
  readonly rest: number;
  readonly rechnet: boolean;
  /**
   * Die Wertung steht an: Das Brett nimmt keinen Zug mehr an. Warum: Wer während der Wertung
   * (bis 1,5 s) weiterzog, spielte einen Zug mehr als vereinbart, und die Wertung begann von vorn
   * (Befund im Browser, 18.11.2026). Scheitert die Engine, ist das Brett wieder frei.
   */
  readonly gesperrt: boolean;
}

/**
 * Bewertet die Stellung und schreibt das Ende, wenn die Partie sich inzwischen nicht verändert hat.
 * Ausgabe: die geschriebene Partie oder null (verändert, beendet oder Fehler der Engine).
 */
export async function werteKurzformAus(
  partie: Partie,
  form: Kurzform,
  bewerte: Kurzformbewerter,
): Promise<Partie | null> {
  const fen = stellungen(partie).at(-1);
  if (!fen) return null;
  const farbe = partie.einstellung.eigeneFarbe;
  const wert = await bewerte(fen, farbe);
  const ende = kurzformEnde(form, wert, farbe);
  return aendereNeueste(partie.id, (p) =>
    p.ende === null && p.zuege.length === partie.zuege.length
      ? { ...pausiere(p, Date.now()), ende }
      : null,
  );
}

/**
 * Hook der Spielhülle. Null bei ganzen Partien. Rechnet höchstens einmal je Zugstand; solange
 * die Wertung ansteht, ist das Brett gesperrt (`gesperrt`). Ein Fehler der Engine lässt die Partie
 * weiterlaufen und meldet sich in der Konsole (nicht verschluckt).
 */
export function useKurzform(
  partie: Partie | null,
  bewerte: Kurzformbewerter = bewerteMitEngine,
): Kurzformstand | null {
  const form = partie?.einstellung.abenteuer?.kurzform ?? null;
  const [rechnet, setzeRechnet] = useState(false);
  // Zugstand, bei dem die Engine scheiterte: Dort läuft die Partie weiter (Brett wieder frei).
  const [gescheitert, setzeGescheitert] = useState<string | null>(null);
  const zuletzt = useRef<string | null>(null);
  const faellig = partie !== null && form !== null && wertungFaellig(partie, form);
  const schluessel = partie ? `${partie.id}:${partie.zuege.length}` : null;
  useEffect(() => {
    if (!faellig || !partie || !form || zuletzt.current === schluessel) return;
    zuletzt.current = schluessel;
    setzeRechnet(true);
    werteKurzformAus(partie, form, bewerte)
      .catch((fehler: unknown) => {
        console.warn("Wertung der kurzen Partieform fehlgeschlagen", fehler);
        setzeGescheitert(schluessel);
      })
      .finally(() => setzeRechnet(false));
  }, [faellig, partie, form, bewerte, schluessel]);
  if (!partie || !form) return null;
  const gesperrt = faellig && gescheitert !== schluessel;
  return { form, rest: restzuege(partie, form), rechnet, gesperrt };
}
