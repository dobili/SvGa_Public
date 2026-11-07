/**
 * Rechnet im Leerlauf die Kürzel „Fehler mit Buchbezug“ ausgewerteter Partien und legt sie zur
 * Partie (Format 10, spiel/buchkuerzel.ts): gleich nach jeder neuen Auswertung, für ältere
 * Partien ohne Kürzel und nach einer Änderung der Regeln (BUCHBEZUG_REGELN).
 *
 * Rolle im Gesamtbild: Konzept docs/KONZEPT_FEHLER_BUCHBEZUG.md, Abschnitt 4.2. Die Startseite
 * („Muster aus deinen Partien“, training/musterausPartien.ts) liest nur die gespeicherten Kürzel;
 * gerechnet wird hier, eine Partie nach der anderen und Zug für Zug mit einer Pause dazwischen,
 * damit der Bildschirm nicht stockt (am Handy 30 bis 50 ms je Zug). App.tsx ruft den Hook einmal
 * in der Hülle auf. Gespeichert wird erst, wenn die Buchdaten (Fallen, Buchvarianten) da sind;
 * sonst fehlten W1 und F8 dauerhaft.
 * Abhängigkeiten: speicher/speicher.ts, speicher/partien.ts, spiel/auswertung.ts,
 * spiel/buchkuerzel.ts, buchkontext.ts.
 */
import { useEffect } from "react";
import { zugurteile } from "../../../spiel/auswertung";
import {
  BUCHBEZUG_REGELN,
  buchkuerzelDesZuges,
  kuerzelAktuell,
  type Buchkuerzelzug,
} from "../../../spiel/buchkuerzel";
import type { Buchkontextdaten } from "../../../spiel/buchzuege";
import { mitBuchkuerzeln, type Partieeintrag } from "../../../speicher/partien";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { ladeBuchkontext } from "./buchkontext";

/** Pause vor dem Nachrechnen, damit Start und Auswertung zuerst fertig zeichnen (ms). */
const NACHTRAG_PAUSE_MS = 1500;

/** Die erste ausgewertete Partie ohne aktuelle Kürzel, neueste zuerst; null, wenn alle fertig. */
export function naechsteOhneKuerzel(partien: readonly Partieeintrag[]): Partieeintrag | null {
  return partien.find((e) => e.werte.length > 0 && !kuerzelAktuell(e.buchbezug)) ?? null;
}

/** Wartet bis zum nächsten Takt der Ereignisschleife. */
function naechsterTakt(): Promise<void> {
  return new Promise((weiter) => setTimeout(weiter, 0));
}

/** Rechnet die Kürzel einer Partie Zug für Zug; null, wenn unterwegs abgebrochen. */
async function rechne(
  e: Partieeintrag,
  kontext: Buchkontextdaten,
  aktiv: () => boolean,
): Promise<Buchkuerzelzug[] | null> {
  const zuege: Buchkuerzelzug[] = [];
  for (const urteil of zugurteile(e.partie, e.werte, e.beste, e.abstaende)) {
    if (!aktiv()) return null;
    const zug = buchkuerzelDesZuges(e, urteil, kontext);
    if (zug) zuege.push(zug);
    await naechsterTakt();
  }
  return zuege;
}

/** Rechnet und speichert die Kürzel einer Partie, wenn die Buchdaten vollständig sind. */
async function trageNach(e: Partieeintrag, aktiv: () => boolean): Promise<void> {
  const kontext = await ladeBuchkontext();
  if (!aktiv() || !kontext.fallenindex || !kontext.eroeffnungsindex) return;
  const zuege = await rechne(e, kontext, aktiv);
  if (!zuege) return;
  const stand = { regeln: BUCHBEZUG_REGELN, zuege };
  await aendere((d) => ({ ...d, spiel: mitBuchkuerzeln(d.spiel, e.partie.id, stand) }));
}

/**
 * Hält die Kürzel aller ausgewerteten Partien aktuell, eine Partie je Durchgang.
 * Beispiel: Nach dem Ende einer Partie schreibt die Auswertung die Werte; kurz danach rechnet der
 * Hook die Kürzel und legt sie dazu, danach die nächste ältere Partie ohne Kürzel.
 */
export function useBuchkuerzelNachtrag(): void {
  const partien = useSpeicher((z) => (z.geladen ? z.daten.spiel.partien : null));
  useEffect(() => {
    const offen = partien ? naechsteOhneKuerzel(partien) : null;
    if (!offen) return undefined;
    let laeuft = true;
    const aktiv = () => laeuft;
    const zeit = window.setTimeout(() => {
      trageNach(offen, aktiv).catch((fehler: unknown) => {
        console.error("Kürzel „Fehler mit Buchbezug“ nicht gespeichert:", fehler);
      });
    }, NACHTRAG_PAUSE_MS);
    return () => {
      laeuft = false;
      window.clearTimeout(zeit);
    };
  }, [partien]);
}
