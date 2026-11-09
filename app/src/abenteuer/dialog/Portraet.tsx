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
import { paketdateiAlsAdresse, paketdateiAlsAdresseOderNull } from "../paket/paketlader";
import { portraetpfad } from "./portraetpfad";

/** Ein geladenes Porträt: Bogen aus dem Porträt-Generator (animiert) oder gezeichnetes Bild. */
interface Bild {
  readonly adresse: string;
  readonly bogen: boolean;
}

/** Einmal geladene Bilder, damit ein Dialog nicht bei jeder Zeile neu lädt (null: fehlt). */
const geladen = new Map<string, Promise<Bild | null>>();

/**
 * Erst der Bogen aus der gekauften Grafik (`portraets/<name>.png`, Modern UI: 32 × 32, Zeile 1
 * Sprechen mit zehn Bildern), sonst das gezeichnete Ersatzbild (`.svg`).
 */
async function ladeBild(pfad: string): Promise<Bild | null> {
  const bogen = await paketdateiAlsAdresseOderNull(pfad.replace(/\.svg$/, ".png"));
  if (bogen) return { adresse: bogen, bogen: true };
  const svg = await paketdateiAlsAdresse(pfad).catch(() => null);
  return svg ? { adresse: svg, bogen: false } : null;
}

function lade(pfad: string): Promise<Bild | null> {
  let bild = geladen.get(pfad);
  if (!bild) {
    bild = ladeBild(pfad);
    geladen.set(pfad, bild);
  }
  return bild;
}

export function Portraet({
  sprecher,
  stimmung,
  zeile,
}: {
  sprecher: string;
  stimmung: string | null;
  /** Text der Zeile: Bei jeder neuen Zeile bewegt das Porträt die Lippen (Bogen aus Modern UI). */
  zeile?: string;
}) {
  const pfad = portraetpfad(sprecher, stimmung);
  const [bild, setzeBild] = useState<{ pfad: string; bild: Bild | null } | null>(null);
  useEffect(() => {
    let aktiv = true;
    void lade(pfad).then((geladenesBild) => {
      if (aktiv) setzeBild({ pfad, bild: geladenesBild });
    });
    return () => {
      aktiv = false;
    };
  }, [pfad]);
  if (!bild || bild.pfad !== pfad || !bild.bild) return null;
  if (bild.bild.bogen) {
    return (
      <span
        // Neuer Schlüssel je Zeile: Die Sprechanimation startet bei jeder Zeile neu.
        key={zeile ?? ""}
        className="abenteuer-dialog-portraet abenteuer-portraet-bogen"
        style={{ backgroundImage: `url("${bild.bild.adresse}")` }}
        aria-hidden="true"
      />
    );
  }
  return (
    <img
      className="abenteuer-dialog-portraet"
      src={bild.bild.adresse}
      alt=""
      width={48}
      height={48}
    />
  );
}
