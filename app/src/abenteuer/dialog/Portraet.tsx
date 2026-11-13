/**
 * Das Porträt der sprechenden Figur im Dialog (Q17-2, Pixel-Porträts aus
 * app/skripte/erzeuge-figurenbilder.mjs, DiceBear Pixel Art, CC0).
 *
 * Rolle im Gesamtbild: Teil des Dialogfensters (dialog/Dialog.tsx). Der Sprecher kommt aus dem
 * Ink-Tag `#sprecher:okafor`, die Datei heißt `portraets/okafor.svg` (camelCase wird kebab-case:
 * `coachDelgado` → `coach-delgado`). Mit `#stimmung:jung` zeigt Ambrose sein junges Gesicht
 * (Erinnerungen); andere Fassungen (T4, portraetpfad.ts) ebenso. Fehlt eine Fassung, zeigt es die
 * Grundfassung; fehlt auch die, bleibt nur der Name stehen.
 * Größere Porträts (Wunsch des Haupt-Chats, 13.11.2026): Liegt ein großes Bild in
 * `portraets/gross/<name>.webp` oder `.png` (64 × 64 oder 96 × 96, privates Paket), geht es vor;
 * es steht still und wird 96 Pixel groß gezeigt. Sonst der Bogen, sonst das SVG.
 * Abhängigkeiten: paket/paketlader.ts.
 */
import { useEffect, useState } from "react";
import { paketdateiAlsAdresse, paketdateiAlsAdresseOderNull } from "../paket/paketlader";
import { grossePortraets, portraetpfad } from "./portraetpfad";

/** Ein geladenes Porträt: groß, Bogen aus dem Porträt-Generator (animiert) oder Ersatzbild. */
interface Bild {
  readonly adresse: string;
  readonly art: "gross" | "bogen" | "svg";
}

/** Anzeigegröße in CSS-Pixeln: große Bilder und die Ersatzbilder. */
const GROSS_PX = 96;
const KLEIN_PX = 48;

/** Einmal geladene Bilder, damit ein Dialog nicht bei jeder Zeile neu lädt (null: fehlt). */
const geladen = new Map<string, Promise<Bild | null>>();

/**
 * Erst der Bogen aus der gekauften Grafik (`portraets/<name>.png`, Modern UI: 32 × 32, Zeile 1
 * Sprechen mit zehn Bildern), sonst das gezeichnete Ersatzbild (`.svg`).
 */
async function ladeBild(pfad: string): Promise<Bild | null> {
  for (const gross of grossePortraets(pfad)) {
    const adresse = await paketdateiAlsAdresseOderNull(gross);
    if (adresse) return { adresse, art: "gross" };
  }
  const bogen = await paketdateiAlsAdresseOderNull(pfad.replace(/\.svg$/, ".png"));
  if (bogen) return { adresse: bogen, art: "bogen" };
  const svg = await paketdateiAlsAdresse(pfad).catch(() => null);
  return svg ? { adresse: svg, art: "svg" } : null;
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
  const grund = portraetpfad(sprecher, null);
  const [bild, setzeBild] = useState<{ pfad: string; bild: Bild | null } | null>(null);
  useEffect(() => {
    let aktiv = true;
    void lade(pfad)
      .then((geladenesBild) => geladenesBild ?? (pfad === grund ? null : lade(grund)))
      .then((geladenesBild) => {
        if (aktiv) setzeBild({ pfad, bild: geladenesBild });
      });
    return () => {
      aktiv = false;
    };
  }, [pfad, grund]);
  if (!bild || bild.pfad !== pfad || !bild.bild) return null;
  if (bild.bild.art === "bogen") {
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
  const gross = bild.bild.art === "gross";
  const groesse = gross ? GROSS_PX : KLEIN_PX;
  return (
    <img
      className={
        gross ? "abenteuer-dialog-portraet abenteuer-portraet-gross" : "abenteuer-dialog-portraet"
      }
      src={bild.bild.adresse}
      alt=""
      width={groesse}
      height={groesse}
    />
  );
}
