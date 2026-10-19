/**
 * Stand des 30-Minuten-Plans auf dem Gerät und die laufende Uhr.
 *
 * Rolle im Gesamtbild: Teil von ui/trainer/DreissigMinutenBereich.tsx. Der Stand liegt als
 * Merker im Gerätespeicher (app/merker.ts), damit die Einheit den Weg zum Spielen und zurück
 * übersteht; geht er verloren (privates Fenster), beginnt der Plan einfach neu. Seit 0.2.90 steht
 * er zusätzlich in den Nutzerdaten („planstand“) und damit in der Datensicherung; fehlt der
 * Merker (neues Gerät, eingespielte Sicherung), gilt der Stand aus den Nutzerdaten.
 * Abhängigkeiten: app/merker.ts, speicher/speicher.ts, training/dreissigminuten.ts, React.
 */
import { useEffect, useState } from "react";
import { liesMerker, schreibeMerker } from "../../app/merker";
import { aendere as aendereDaten, useSpeicher } from "../../speicher/speicher";
import { planstandAus, type Planstand } from "../../training/dreissigminuten";

const MERKER = "dreissigMinuten";
const TAKT_MS = 1000;

/** Der gemerkte Stand und eine Funktion, die ihn ändert und gleich merkt. */
export function usePlanstand(): [Planstand, (aendern: (alt: Planstand) => Planstand) => void] {
  const gesichert = useSpeicher((z) => z.daten.planstand);
  const [stand, setzeStand] = useState(() =>
    planstandAus(liesMerker(MERKER) ?? gesichert, Date.now()),
  );
  const aendere = (aendern: (alt: Planstand) => Planstand) => {
    const neu = aendern(stand);
    const text = JSON.stringify(neu);
    schreibeMerker(MERKER, text);
    void aendereDaten((d) => ({ ...d, planstand: text }));
    setzeStand(neu);
  };
  return [stand, aendere];
}

/** Die aktuelle Zeit, jede Sekunde neu, solange `laeuft` gilt. */
export function useJetzt(laeuft: boolean): number {
  const [jetzt, setzeJetzt] = useState(() => Date.now());
  useEffect(() => {
    if (!laeuft) return undefined;
    const takt = window.setInterval(() => setzeJetzt(Date.now()), TAKT_MS);
    return () => window.clearInterval(takt);
  }, [laeuft]);
  return jetzt;
}
