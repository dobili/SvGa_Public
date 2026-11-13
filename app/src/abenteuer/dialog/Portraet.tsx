/**
 * Das Porträt der sprechenden Figur im Dialog (Q17-2, Pixel-Porträts aus
 * app/skripte/erzeuge-figurenbilder.mjs, DiceBear Pixel Art, CC0).
 *
 * Rolle im Gesamtbild: Teil des Dialogfensters (dialog/Dialog.tsx) und des Kopfs der Spielhülle.
 * Der Sprecher kommt aus dem Ink-Tag `#sprecher:okafor` (camelCase wird kebab-case:
 * `coachDelgado` → `coach-delgado`), die Stimmung aus `#stimmung`. Gesucht wird in dieser
 * Reihenfolge, das erste vorhandene Bild gilt:
 * 1. ein großes Einzelbild genau dieser Fassung (`portraets/gross/<name>[-fassung].webp|png`, T4);
 * 2. das Porträtblatt der Figur (`portraets/blatt/<name>.png`, sechs Fassungen à 64 × 64), das
 *    Feld wählt portraetblatt.json über die Stimmung (dialog/portraetblatt.ts);
 * 3. der Sprechbogen aus Modern UI (`portraets/<name>.png`, animiert);
 * 4. das Ersatzbild (`portraets/<name>.svg`), erst der Fassung, dann der Grundfassung.
 * Fehlt alles, bleibt nur der Name stehen.
 * Abhängigkeiten: paket/paketlader.ts, dialog/portraetpfad.ts, dialog/portraetblatt.ts.
 */
import { useEffect, useState } from "react";
import {
  liesPaketJson,
  paketdateiAlsAdresse,
  paketdateiAlsAdresseOderNull,
} from "../paket/paketlader";
import { blattfeld, blattpfad, type Blattaufbau } from "./portraetblatt";
import { grossePortraets, portraetpfad } from "./portraetpfad";

/** Ein geladenes Porträt. */
type Bild =
  | { readonly art: "gross" | "bogen" | "svg"; readonly adresse: string }
  | { readonly art: "blatt"; readonly adresse: string; readonly aufbau: Blattaufbau };

/** Anzeigegröße in CSS-Pixeln: große Bilder und Blätter, Ersatzbilder. */
const GROSS_PX = 96;
const KLEIN_PX = 48;

/** Einmal geladene Bilder je Schlüssel (null: fehlt), damit nicht jede Zeile neu lädt. */
const geladen = new Map<string, Promise<Bild | null>>();
let blattaufbau: Promise<Blattaufbau | null> | null = null;

function einmal(schluessel: string, laden: () => Promise<Bild | null>): Promise<Bild | null> {
  let bild = geladen.get(schluessel);
  if (!bild) {
    bild = laden();
    geladen.set(schluessel, bild);
  }
  return bild;
}

/** Der Aufbau der Blätter aus dem Paket; ohne ihn gibt es keine Blätter (erwarteter Rückfall). */
function aufbau(): Promise<Blattaufbau | null> {
  blattaufbau ??= liesPaketJson<Blattaufbau>("daten/portraetblatt.json").catch(() => null);
  return blattaufbau;
}

/** 1. Großes Einzelbild der Fassung. */
async function ladeGross(pfad: string): Promise<Bild | null> {
  for (const datei of grossePortraets(pfad)) {
    const adresse = await paketdateiAlsAdresseOderNull(datei);
    if (adresse) return { art: "gross", adresse };
  }
  return null;
}

/** 2. Porträtblatt der Figur. */
async function ladeBlatt(pfad: string): Promise<Bild | null> {
  const [a, adresse] = await Promise.all([aufbau(), paketdateiAlsAdresseOderNull(pfad)]);
  return a && adresse ? { art: "blatt", adresse, aufbau: a } : null;
}

/** 3. und 4. Sprechbogen, sonst Ersatzbild. */
async function ladeBogenOderSvg(pfad: string): Promise<Bild | null> {
  const bogen = await paketdateiAlsAdresseOderNull(pfad.replace(/\.svg$/, ".png"));
  if (bogen) return { art: "bogen", adresse: bogen };
  const svg = await paketdateiAlsAdresse(pfad).catch(() => null);
  return svg ? { art: "svg", adresse: svg } : null;
}

/** Das Bild zu Sprecher und Stimmung in der Reihenfolge des Dateikopfs. */
async function suche(sprecher: string, stimmung: string | null): Promise<Bild | null> {
  const pfad = portraetpfad(sprecher, stimmung);
  const grund = portraetpfad(sprecher, null);
  const blatt = blattpfad(sprecher, stimmung);
  return (
    (await einmal(`gross:${pfad}`, () => ladeGross(pfad))) ??
    (await einmal(`blatt:${blatt}`, () => ladeBlatt(blatt))) ??
    (await einmal(`bogen:${pfad}`, () => ladeBogenOderSvg(pfad))) ??
    (pfad === grund ? null : await einmal(`bogen:${grund}`, () => ladeBogenOderSvg(grund)))
  );
}

/** Das Feld eines Blatts als Hintergrund, auf 96 Pixel vergrößert. */
function Blattbild({
  bild,
  stimmung,
}: {
  bild: Extract<Bild, { art: "blatt" }>;
  stimmung: string | null;
}) {
  const feld = blattfeld(bild.aufbau, stimmung);
  return (
    <span
      className="abenteuer-dialog-portraet abenteuer-portraet-gross abenteuer-portraet-blatt"
      style={{
        backgroundImage: `url("${bild.adresse}")`,
        backgroundSize: `${bild.aufbau.spalten * GROSS_PX}px ${bild.aufbau.zeilen * GROSS_PX}px`,
        backgroundPosition: `-${feld.spalte * GROSS_PX}px -${feld.zeile * GROSS_PX}px`,
      }}
      aria-hidden="true"
    />
  );
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
  const schluessel = `${sprecher}:${stimmung ?? ""}`;
  const [bild, setzeBild] = useState<{ schluessel: string; bild: Bild | null } | null>(null);
  useEffect(() => {
    let aktiv = true;
    void suche(sprecher, stimmung).then((gefunden) => {
      if (aktiv) setzeBild({ schluessel, bild: gefunden });
    });
    return () => {
      aktiv = false;
    };
  }, [sprecher, stimmung, schluessel]);
  if (!bild || bild.schluessel !== schluessel || !bild.bild) return null;
  const b = bild.bild;
  if (b.art === "blatt") return <Blattbild bild={b} stimmung={stimmung} />;
  if (b.art === "bogen") {
    return (
      <span
        // Neuer Schlüssel je Zeile: Die Sprechanimation startet bei jeder Zeile neu.
        key={zeile ?? ""}
        className="abenteuer-dialog-portraet abenteuer-portraet-bogen"
        style={{ backgroundImage: `url("${b.adresse}")` }}
        aria-hidden="true"
      />
    );
  }
  const gross = b.art === "gross";
  const groesse = gross ? GROSS_PX : KLEIN_PX;
  return (
    <img
      className={
        gross ? "abenteuer-dialog-portraet abenteuer-portraet-gross" : "abenteuer-dialog-portraet"
      }
      src={b.adresse}
      alt=""
      width={groesse}
      height={groesse}
    />
  );
}
