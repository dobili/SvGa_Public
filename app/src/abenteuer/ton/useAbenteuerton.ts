/**
 * Verbindet die Einstellungen der App mit der Tonregie des Abenteuers: Lautstärken und
 * Stummschalter wirken sofort, beim Verlassen des Abenteuers blendet alles aus (T1, T2).
 *
 * Rolle im Gesamtbild: einmal in anbindung/AbenteuerAnsicht.tsx aufgerufen.
 * Abhängigkeiten: app/einstellungen.ts, ton/tonregie.ts.
 */
import { useEffect } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import { tonregie } from "./tonregie";

/** Stellt Lautstärken ein und blendet beim Verlassen aus. Eingaben: keine; Ausgabe: keine. */
export function useAbenteuerton(): void {
  const { ton, abenteuerton } = useEinstellungen();
  useEffect(() => {
    tonregie.stelleEin(abenteuerton, ton === "an");
  }, [ton, abenteuerton]);
  useEffect(() => {
    return () => tonregie.verlassen();
  }, []);
}
