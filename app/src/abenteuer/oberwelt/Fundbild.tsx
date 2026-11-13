/**
 * Bild eines Fundes (funde.json, Feld `bild`; Bildliste von mittel-3) im Fund-Fenster der Oberwelt
 * und auf der Fensterbank (T15).
 *
 * Rolle im Gesamtbild: kleine gemeinsame Anzeige für Oberwelt.tsx (Meldung) und Fensterbank.tsx.
 * Fehlt die Datei im Zusatzpaket, zeigt sie nichts, und es bleibt beim Text wie bisher.
 * Abhängigkeiten: paket/paketlader.ts.
 */
import { useEffect, useState } from "react";
import { paketdateiAlsAdresseOderNull } from "../paket/paketlader";

/** Das Bild zum Pfad (oder nichts, solange es lädt oder wenn es fehlt). */
export function Fundbild({ bild, klein = false }: { bild: string | null; klein?: boolean }) {
  const [geladen, setzeGeladen] = useState<{ bild: string; adresse: string | null } | null>(null);
  useEffect(() => {
    if (!bild) return;
    let aktiv = true;
    void paketdateiAlsAdresseOderNull(bild).then((adresse) => {
      if (aktiv) setzeGeladen({ bild, adresse });
    });
    return () => {
      aktiv = false;
    };
  }, [bild]);
  if (!bild || geladen?.bild !== bild || !geladen.adresse) return null;
  return (
    <img
      className={klein ? "abenteuer-fundbild abenteuer-fundbild-klein" : "abenteuer-fundbild"}
      src={geladen.adresse}
      alt=""
      data-testid="abenteuer-fundbild"
    />
  );
}
