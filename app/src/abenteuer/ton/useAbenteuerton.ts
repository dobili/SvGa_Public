/**
 * Verbindet die Einstellungen der App mit der Tonregie des Abenteuers: Lautstärken und
 * Stummschalter wirken sofort, beim Verlassen des Abenteuers blendet alles aus (T1, T2).
 * Musik von Anfang an (Wunsch des Autors, 28.11.2026): Das Abenteuer klingt unabhängig vom
 * allgemeinen Ton der App (dessen Vorgabe „aus“ gilt für die Lern-App); still wird es nur über
 * seinen eigenen Stummschalter oder die Lautstärkeregler.
 *
 * Rolle im Gesamtbild: einmal in anbindung/AbenteuerAnsicht.tsx aufgerufen.
 * Abhängigkeiten: app/einstellungen.ts, ton/tonregie.ts.
 */
import { useEffect } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import { tonregie } from "./tonregie";

/** Stellt Lautstärken ein und blendet beim Verlassen aus. Eingaben: keine; Ausgabe: keine. */
export function useAbenteuerton(): void {
  const { abenteuerton } = useEinstellungen();
  useEffect(() => {
    tonregie.stelleEin(abenteuerton, true);
  }, [abenteuerton]);
  useEffect(() => {
    return () => tonregie.verlassen();
  }, []);
}
