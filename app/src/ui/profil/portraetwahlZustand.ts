/**
 * Zustand der Porträtwahl (seit 0.2.140): Art (auswählen, selbst gestalten, kein Bild), das
 * gewählte Porträt, die Merkmale des Baukastens und das daraus gebaute SVG.
 *
 * Rolle im Gesamtbild: Gemeinsam für das Profil des Lesers (ProfilEditor.tsx) und eigene Bots
 * (GegnerEditor.tsx), Wunsch des Autors vom 25.10.2026. Das Ergebnis ist ein Profilbild
 * (speicher/profil.ts) oder null; das SVG entsteht nachgeladen (merkmale.ts, baueSvg).
 * Abhängigkeiten: merkmale.ts, speicher/profil.ts, engine/portraetwahl.ts, React.
 */
import { useEffect, useState } from "react";
import type { Portraetkennung } from "../../engine/portraetwahl";
import type { Profilbild } from "../../speicher/profil";
import { baueSvg, START_MERKMALE, vollstaendig, type Merkmalfeld } from "./merkmale";

export type Bildart = "wahl" | "bau" | "keins";
export type Werte = Readonly<Record<Merkmalfeld, string>>;

export interface Portraetwahlzustand {
  readonly art: Bildart;
  readonly setzeArt: (art: Bildart) => void;
  readonly wahl: Portraetkennung | null;
  readonly setzeWahl: (kennung: Portraetkennung) => void;
  readonly werte: Werte;
  readonly setzeWerte: (werte: Werte) => void;
  /** Das Ergebnis; null bei „kein Bild“, ohne Wahl oder solange das SVG noch entsteht. */
  readonly bild: Profilbild | null;
}

/** Baut das SVG zu den Merkmalen, sobald sie sich ändern (nur bei „Selbst gestalten“). */
function useGebautesSvg(aktiv: boolean, werte: Werte, anfang: string | null): string | null {
  const [svg, setzeSvg] = useState(anfang);
  useEffect(() => {
    if (!aktiv) return;
    let aktuell = true;
    void baueSvg(werte).then((neu) => aktuell && setzeSvg(neu));
    return () => {
      aktuell = false;
    };
  }, [aktiv, werte]);
  return svg;
}

/**
 * Der Zustand ab einem gespeicherten Bild. Beispiel: Start { art: "wahl", kennung: "wahl-07" } →
 * Art „Auswählen“, wahl-07 markiert; Wechsel zu „Selbst gestalten“ baut ab den Startmerkmalen.
 */
export function usePortraetwahl(start: Profilbild | null): Portraetwahlzustand {
  const [art, setzeArt] = useState<Bildart>(start?.art ?? "keins");
  const [wahl, setzeWahl] = useState<Portraetkennung | null>(
    start?.art === "wahl" ? start.kennung : null,
  );
  const [werte, setzeWerte] = useState<Werte>(() =>
    start?.art === "bau" ? vollstaendig(start.merkmale) : START_MERKMALE,
  );
  const svg = useGebautesSvg(art === "bau", werte, start?.art === "bau" ? start.svg : null);
  const bild: Profilbild | null =
    art === "wahl" && wahl
      ? { art: "wahl", kennung: wahl }
      : art === "bau" && svg
        ? { art: "bau", merkmale: werte, svg }
        : null;
  return { art, setzeArt, wahl, setzeWahl, werte, setzeWerte, bild };
}
