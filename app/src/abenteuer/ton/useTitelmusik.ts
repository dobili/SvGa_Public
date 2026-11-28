/**
 * Titelmusik unter Startbild und Hauptmenü (Wunsch des Autors, 28.11.2026: „Musik bei der
 * Startanimation und im Hauptmenü“): eine durchgehende Musik, die beim Übergang vom Startbild ins
 * Hauptmenü (und zur Startkarte für ein neues Spiel) nicht neu beginnt und beim Spielbeginn in 1 s
 * ausblendet, bevor die Musik der Karte einsetzt.
 *
 * Warum ein eigener Baustein: Die Ansicht sagt nur, ob ein Menü zu sehen ist; was klingt, bleibt
 * Sache der Tonregie (ton/tonregie.ts `titelAn`, `titelAus`). Lautstärke, Stummschalter und der
 * eigene Stummschalter des Abenteuers gelten wie überall (ton/useAbenteuerton.ts; der Ton der App zählt seit 28.11.2026 nicht mehr). Autoplay: Der Browser spielt
 * erst nach einer Berührung (app/ton.ts `entsperreTon`); der Tipp auf den Reiter „Abenteuer“ zählt
 * schon, sonst beginnt die Musik mit dem ersten Tipp. Ohne Paket (allererster Start) bleibt es
 * still; ist es geladen, versucht der Baustein das Stück neu.
 * Rolle im Gesamtbild: einmal in anbindung/AbenteuerAnsicht.tsx aufgerufen, nach useAbenteuerton.
 * Abhängigkeiten: ton/tonregie.ts.
 */
import { useEffect } from "react";
import { tonregie } from "./tonregie";

/**
 * Schaltet die Titelmusik nach der Ansicht.
 * Eingaben: `menue` – Startbild, Hauptmenü oder Startkarte sind zu sehen (nicht die Welt);
 * `paketDa` – das Paket liegt auf dem Gerät (dann gibt es das Stück).
 * Ausgabe: keine. Beispiel: Startbild → Hauptmenü: `menue` bleibt true, die Musik läuft weiter;
 * „Fortsetzen“ → Welt: `menue` wird false, die Titelmusik blendet aus.
 */
export function useTitelmusik(menue: boolean, paketDa: boolean): void {
  useEffect(() => {
    if (menue) tonregie.titelAn();
    else tonregie.titelAus();
  }, [menue, paketDa]);
}
