/**
 * Hook der Vollbildansichten des Schach-Abenteuers: setzt den Brettstil des Ortes oder Gegners,
 * solange die Ansicht offen ist (Partie in der Spielhülle, Rätsel- und Erinnerungsrunden, Vorführung
 * und Gedächtnisstellung der Oberwelt).
 *
 * Rolle im Gesamtbild: Ein Aufruf in PartieHuelle.tsx, AufgabenAnsicht.tsx, oberwelt/Vorfuehrung.tsx
 * und oberwelt/Gedaechtnisstellung.tsx genügt; die Wahl
 * trifft stilwahl.ts, die Zeichnung kommt aus Zeichnung.tsx, das Brett der App liest sie über
 * ui/brett/brettstil.ts. In der App selbst bleibt die Wahl des Lesers (docs/spiel/30, Abschnitt 5).
 * Blindschach bekommt keinen Stil und bleibt, wie es ist. Hat das Paket zum Stil gezeichnete
 * Bilder (brettbilder.ts), ersetzen sie Feldfarben und Pixelfiguren (Bilderzeichnung.tsx).
 * Abhängigkeiten: daten/laden.ts, stilwahl.ts, Zeichnung.tsx, Bilderzeichnung.tsx,
 * brettbilder.ts, ui/brett/brettstil.ts.
 */
import { useLayoutEffect } from "react";
import type { Partie } from "../../spiel/partie";
import { setzeBrettstil } from "../../ui/brett/brettstil";
import { ladeSpieldaten } from "../daten/laden";
import type { Aufgabenauftrag } from "../schnittstelle/aufgaben";
import { begegnungVonPartie } from "../anbindung/useBegegnung";
import { waehleBrettstil, type Brettquelle, type Stildaten } from "./stilwahl";
import { bildvorgabe } from "./Bilderzeichnung";
import { brettbilderFertig, brettbilderVon } from "./brettbilder";
import { brettstilvorgabe } from "./Zeichnung";
import "./brettstil.css";

/** Die Spieldaten, sobald sie einmal geladen sind: dann gilt der Stil ohne Wartezeit. */
let geladen: Stildaten | null = null;

/** Quelle einer Partie: ihre Begegnung; Blindschach und Partien ohne Begegnung ohne Stil. */
export function partieBrettquelle(partie: Partie | null | undefined): Brettquelle | null {
  const abenteuer = partie?.einstellung.abenteuer;
  if (!abenteuer || abenteuer.variante === "blind") return null;
  return { art: "partie", begegnung: begegnungVonPartie(abenteuer.kennung) };
}

/** Quelle einer Aufgabenrunde: ihre Runde; Erinnerungen spielen auf Sepia. */
export function rundenBrettquelle(auftrag: Aufgabenauftrag | null): Brettquelle | null {
  if (!auftrag) return null;
  return { art: "runde", runde: auftrag.runde, erinnerung: auftrag.erinnerung !== undefined };
}

/** Quelle der kleinen Bretter der Oberwelt: der Ort, an dem der Held steht; null ohne Ort. */
export function ortBrettquelle(ort: string | null): Brettquelle | null {
  return ort ? { art: "ort", ort } : null;
}

/**
 * Setzt den Stil zur Quelle, solange die aufrufende Ansicht offen ist.
 *
 * Eingabe: Quelle oder null (kein Stil). Beispiel: PartieHuelle mit der Partie gegen Big Joe →
 * Stahlplatten und Metallfiguren. Sonderfall: Ohne Spieldaten (Paket fehlt) bleibt das Brett
 * des Lesers; die Partie läuft trotzdem.
 */
export function useAbenteuerBrettstil(quelle: Brettquelle | null): void {
  const schluessel = quelle ? JSON.stringify(quelle) : "";
  useLayoutEffect(() => {
    if (!schluessel) return undefined;
    const q = JSON.parse(schluessel) as Brettquelle;
    let aktiv = true;
    let aufraeumen = () => {};
    const setze = (daten: Stildaten) => {
      const kennung = waehleBrettstil(q, daten);
      if (!kennung) return;
      // Gezeichnete Bilder, wenn schon bekannt, sonst erst der gerechnete Stil und dann die Bilder.
      const bekannt = brettbilderFertig(kennung);
      aufraeumen = setzeBrettstil(
        bekannt ? bildvorgabe(kennung, bekannt) : brettstilvorgabe(kennung),
      );
      if (bekannt !== undefined) return;
      void brettbilderVon(kennung).then((bilder) => {
        if (!aktiv || !bilder) return;
        aufraeumen();
        aufraeumen = setzeBrettstil(bildvorgabe(kennung, bilder));
      });
    };
    if (geladen) setze(geladen);
    else
      ladeSpieldaten()
        .then((daten) => {
          geladen = daten;
          if (aktiv) setze(daten);
        })
        .catch((fehler: unknown) => {
          console.warn("Brettstil: Spieldaten nicht geladen", fehler);
        });
    return () => {
      aktiv = false;
      aufraeumen();
    };
  }, [schluessel]);
}
