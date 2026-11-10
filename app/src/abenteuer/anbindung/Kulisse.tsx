/**
 * Kulisse hinter dem Brett: Lebendschach unter den Mammutbäumen (Weg 9; docs/spiel/15, Abschnitt 4,
 * Punkt 7). Bis zur Animation der Kinder steht die gewöhnliche Brettansicht vor dem Bild der
 * Lichtung (Hintergrund der Karte aus dem Kartenbauer).
 *
 * Rolle im Gesamtbild: Teil der Kartenleiste (KartenleisteAnzeige.tsx), App-Seite der Modulgrenze.
 * Das Bild wird für die Dauer der Partie Hintergrund von body (Klasse abenteuer-mit-kulisse,
 * Variable --abenteuer-kulisse), mit einem hellen Schleier davor, damit Brett und Texte lesbar
 * bleiben; beim Verlassen räumt die Komponente auf. Ein Element mit negativem z-index reichte
 * nicht: Der Grund von body malte darüber. Ohne Bild im Paket (Entwicklung ohne private Grafik)
 * bleibt alles wie immer.
 * Abhängigkeiten: paket/paketlader.ts.
 */
import { useEffect } from "react";
import { paketdateiAlsAdresseOderNull } from "../paket/paketlader";

const KLASSE = "abenteuer-mit-kulisse";
const VARIABLE = "--abenteuer-kulisse";

export function Kulisse({ karte }: { readonly karte: string | null }) {
  useEffect(() => {
    if (!karte) return undefined;
    let aktiv = true;
    void paketdateiAlsAdresseOderNull(`grafik/karten/${karte}.png`).then((adresse) => {
      if (!aktiv || !adresse) return;
      document.body.style.setProperty(VARIABLE, `url(${adresse})`);
      document.body.classList.add(KLASSE);
    });
    return () => {
      aktiv = false;
      document.body.classList.remove(KLASSE);
      document.body.style.removeProperty(VARIABLE);
    };
  }, [karte]);
  return null;
}
