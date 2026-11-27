/**
 * Zustand des Spielpakets für die Hülle des Abenteuers: abfragen, laden, neue Version nachladen
 * (ausgelagert aus AbenteuerAnsicht.tsx, 27.11.2026, als das Hauptmenü dazukam).
 *
 * Rolle im Gesamtbild: Startkarte, Hauptmenü und Startbild fragen, ob das Paket da ist (Bilder,
 * Einstieg in die Welt). Ohne Cache-Speicher (gesperrte Website-Daten) gilt das Paket als fehlend;
 * das Laden meldet dann seinen Fehler auf der Startkarte, statt dass die Prüfung ewig läuft.
 * Abhängigkeiten: dienste.ts (Paketzustand), schnittstelle/modul.ts, schnittstelle/paket.ts.
 */
import { useEffect, useRef, useState } from "react";
import type { Appdienste } from "../schnittstelle/modul";
import type { Paketzustand } from "../schnittstelle/paket";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { aktualisierePaketzustand } from "./dienste";

/** Was die Hülle vom Paket braucht. */
export interface Paketlage {
  readonly zustand: Paketzustand;
  readonly setzeZustand: (zustand: Paketzustand) => void;
  /** Ist der Zustand schon abgefragt? Vorher kein Knopf (Affentest 14.11.2026). */
  readonly geprueft: boolean;
  /** Ist ein Paket da (auch ein veraltetes)? */
  readonly da: boolean;
  /** Lädt das Paket mit Fortschritt; Fehler landen im Zustand. */
  readonly lade: () => void;
}

/** Der Paketzustand der Hülle; `stand` entscheidet, ob eine neue Version gleich lädt. */
export function usePaketzustand(dienste: Appdienste, stand: Abenteuerstand | null): Paketlage {
  const [zustand, setzeZustand] = useState<Paketzustand>({ art: "fehlt" });
  const [geprueft, setzeGeprueft] = useState(false);
  useEffect(() => {
    let aktiv = true;
    void aktualisierePaketzustand()
      .catch((): Paketzustand => ({ art: "fehlt" }))
      .then((z) => {
        if (!aktiv) return;
        setzeZustand(z);
        setzeGeprueft(true);
      });
    return () => {
      aktiv = false;
    };
  }, []);
  const lade = () => {
    setzeZustand({ art: "laedt", geladen: 0, gesamt: 1 });
    dienste
      .ladePaket((geladen, gesamt) => setzeZustand({ art: "laedt", geladen, gesamt }))
      .then(() => aktualisierePaketzustand().then(setzeZustand))
      .catch(() => {
        const online = typeof navigator === "undefined" || navigator.onLine;
        setzeZustand({ art: "fehler", grund: online ? "unbekannt" : "ohneNetz" });
      });
  };
  // Neue Version des Spiels auf dem Server (Wunsch des Autors, 19.11.2026): mit Spielstand gleich
  // laden; danach führt der Weg wie gewohnt weiter. Ohne Netz bleibt das alte Paket.
  const aktualisiert = useRef(false);
  useEffect(() => {
    if (zustand.art !== "fehlt" || !zustand.neuerStand || !stand || aktualisiert.current) return;
    aktualisiert.current = true;
    lade();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zustand, stand]);
  const da = zustand.art === "vorhanden" || zustand.art === "veraltet";
  return { zustand, setzeZustand, geprueft, da, lade };
}
