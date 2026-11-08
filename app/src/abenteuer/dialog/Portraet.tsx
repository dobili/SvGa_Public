/**
 * Das Porträt der sprechenden Figur im Dialog (Q17-2, Pixel-Porträts aus
 * app/skripte/erzeuge-figurenbilder.mjs, DiceBear Pixel Art, CC0).
 *
 * Rolle im Gesamtbild: Teil des Dialogfensters (dialog/Dialog.tsx). Der Sprecher kommt aus dem
 * Ink-Tag `#sprecher:okafor`, die Datei heißt `portraets/okafor.svg` (camelCase wird kebab-case:
 * `coachDelgado` → `coach-delgado`). Mit `#stimmung:jung` zeigt Ambrose sein junges Gesicht
 * (Erinnerungen). Fehlt ein Bild, bleibt nur der Name stehen.
 * Abhängigkeiten: paket/paketlader.ts.
 */
import { useEffect, useState } from "react";
import { paketdateiAlsAdresse } from "../paket/paketlader";
import { portraetpfad } from "./portraetpfad";

/** Einmal geladene Bilder, damit ein Dialog nicht bei jeder Zeile neu lädt (null: fehlt). */
const geladen = new Map<string, Promise<string | null>>();

function lade(pfad: string): Promise<string | null> {
  let bild = geladen.get(pfad);
  if (!bild) {
    bild = paketdateiAlsAdresse(pfad).catch(() => null);
    geladen.set(pfad, bild);
  }
  return bild;
}

export function Portraet({ sprecher, stimmung }: { sprecher: string; stimmung: string | null }) {
  const pfad = portraetpfad(sprecher, stimmung);
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
  return (
    <img className="abenteuer-dialog-portraet" src={bild.adresse} alt="" width={48} height={48} />
  );
}
