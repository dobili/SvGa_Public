/**
 * Lädt den Bogen einer Figur aus dem Paket für Zeichnungen außerhalb von Phaser (Figurrahmen.tsx:
 * Hauptmenü und Startbild, 27.11.2026).
 *
 * Rolle im Gesamtbild: Dieselben Bögen wie in der Welt (oberwelt/figurbogen.ts: zuerst PixelLab
 * unter figuren32/ mit Rahmen 32 × 32, sonst LimeZu unter figuren/ mit 16 × 32). Das öffentliche
 * Repository enthält keine Paketbilder; ohne Paket oder Grafik bleibt der Bogen null.
 * Abhängigkeiten: oberwelt/figurbogen.ts.
 */
import { useEffect, useState } from "react";
import { figurenbildAdresse, istGrossbogen, rahmenhoeheDerAdresse } from "../oberwelt/figurbogen";

/** Rahmenbreite der Bögen von PixelLab und LimeZu. */
const BREITE_GROSS = 32;
const BREITE_KLEIN = 16;
/** Rahmenhöhe der LimeZu-Bögen. */
const HOEHE_KLEIN = 32;

/** Ein geladener Bogen mit seinen Maßen. */
export interface Figurbogen {
  readonly adresse: string;
  readonly rahmenbreite: number;
  readonly rahmenhoehe: number;
  /** Rahmen je Reihe. */
  readonly spalten: number;
  readonly breite: number;
  readonly hoehe: number;
}

/** Maße eines Bildes nach dem Laden; null, wenn es nicht lädt. */
function bildmasse(adresse: string): Promise<{ breite: number; hoehe: number } | null> {
  return new Promise((fertig) => {
    const bild = new Image();
    bild.onload = () => fertig({ breite: bild.naturalWidth, hoehe: bild.naturalHeight });
    bild.onerror = () => fertig(null);
    bild.src = adresse;
  });
}

/** Der Bogen hinter einem Pfad mit Maßen, oder null (fehlt, lädt nicht). */
async function ladeFigurbogen(pfad: string): Promise<Figurbogen | null> {
  const adresse = await figurenbildAdresse(pfad).catch(() => null);
  const masse = adresse ? await bildmasse(adresse) : null;
  if (!adresse || !masse) return null;
  const gross = istGrossbogen(adresse);
  const rahmenbreite = gross ? BREITE_GROSS : BREITE_KLEIN;
  const rahmenhoehe = gross ? rahmenhoeheDerAdresse(adresse) : HOEHE_KLEIN;
  const spalten = Math.max(1, Math.floor(masse.breite / rahmenbreite));
  return { adresse, rahmenbreite, rahmenhoehe, spalten, ...masse };
}

/**
 * Lädt den Bogen einer Figur, sobald `bereit` gilt (Paket da). Ausgabe: der Bogen oder null
 * (lädt noch, fehlt oder kein Paket). Beispiel: "figuren/held-0.png" → figuren32/held-0.png, 32 × 32.
 */
export function useFigurbogen(pfad: string, bereit: boolean): Figurbogen | null {
  const [bogen, setzeBogen] = useState<{ pfad: string; bogen: Figurbogen | null } | null>(null);
  useEffect(() => {
    if (!bereit) return;
    let aktiv = true;
    void ladeFigurbogen(pfad).then((geladen) => {
      if (aktiv) setzeBogen({ pfad, bogen: geladen });
    });
    return () => {
      aktiv = false;
    };
  }, [pfad, bereit]);
  return bogen?.pfad === pfad ? bogen.bogen : null;
}
