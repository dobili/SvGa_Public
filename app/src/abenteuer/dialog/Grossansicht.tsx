/**
 * Großansicht eines Bildes über der Dialogzeile (Atmosphäre T7): Zeitung, Foto, Sternenhimmel.
 *
 * Rolle im Gesamtbild: Teil des Dialogfensters (dialog/Dialog.tsx). Den Pfad bildet
 * dialog/grossbild.ts aus dem Tag `#bild:kennung`. Fehlt das Bild im Paket, zeigt die Ansicht
 * nichts, und die Zeile erscheint wie sonst.
 * Abhängigkeiten: paket/paketlader.ts.
 */
import { useEffect, useState } from "react";
import { paketdateiAlsAdresseOderNull } from "../paket/paketlader";

/** Einmal geladene Bilder (null: fehlt im Paket), damit ein zweites Zeigen nicht neu lädt. */
const geladen = new Map<string, Promise<string | null>>();

function lade(pfad: string): Promise<string | null> {
  let adresse = geladen.get(pfad);
  if (!adresse) {
    adresse = paketdateiAlsAdresseOderNull(pfad);
    geladen.set(pfad, adresse);
  }
  return adresse;
}

/**
 * Zeigt das Bild zum Pfad groß an, solange die Zeile steht. Eingabe: Pfad im Paket.
 * Ausgabe: das Bild oder nichts (noch nicht geladen oder fehlt).
 */
export function Grossansicht({ pfad }: { readonly pfad: string }) {
  const [bild, setzeBild] = useState<{ pfad: string; adresse: string | null } | null>(null);
  useEffect(() => {
    let aktiv = true;
    void lade(pfad).then((adresse) => {
      if (aktiv) setzeBild({ pfad, adresse });
    });
    return () => {
      aktiv = false;
    };
  }, [pfad]);
  if (!bild || bild.pfad !== pfad || !bild.adresse) return null;
  // Das Bild erzählt mit der Zeile darunter; die Zeile trägt den Sinn, deshalb kein Alternativtext.
  return (
    <figure className="abenteuer-grossansicht" data-testid="abenteuer-grossansicht">
      <img src={bild.adresse} alt="" />
    </figure>
  );
}
