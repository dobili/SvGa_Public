/**
 * Kleines Brett über der Dialogzeile (Wunsch des Autors, 22.11.2026): Die Figur zeigt das Konzept,
 * von dem sie spricht, an einem Beispiel mit Pfeilen und Feldern.
 *
 * Rolle im Gesamtbild: Teil des Dialogfensters (dialog/Dialog.tsx), wie das Großbild
 * (dialog/Grossansicht.tsx) und mit dessen Lage: hochkant über dem Text, quer groß in der freien
 * Fläche neben der Textspalte (querformat.css). Das Brett ist nur zum Ansehen. Die Daten lädt es
 * einmal aus dem Paket; fehlen sie, zeigt es nichts, und die Zeile erscheint wie sonst.
 * Abhängigkeiten: dialog/brettmarke.ts, paket/paketlader.ts, ui/brett/Brett.tsx.
 */
import { useEffect, useState } from "react";
import type { BrettbeispieleDesSchachAbenteuers } from "../../daten/generiert/abenteuer-brettbeispiele";
import { Brett } from "../../ui/brett/Brett";
import { liesPaketJson } from "../paket/paketlader";
import { tSpiel } from "../texte/texte";
import { brettbild, type Brettmarke } from "./brettmarke";

const DATEI = "daten/brettbeispiele.json";
let geladen: Promise<BrettbeispieleDesSchachAbenteuers | null> | null = null;

/** Die Beispiele aus dem Paket, einmal geladen; null, wenn sie fehlen. */
function ladeBeispiele(): Promise<BrettbeispieleDesSchachAbenteuers | null> {
  geladen ??= liesPaketJson<BrettbeispieleDesSchachAbenteuers>(DATEI).catch((fehler: unknown) => {
    console.warn("Brettbeispiele nicht geladen:", fehler);
    return null;
  });
  return geladen;
}

/** Zeigt das Bild zur Marke; nichts, solange es lädt oder wenn es fehlt. */
export function Brettbeispiel({ marke }: { readonly marke: Brettmarke }) {
  const [daten, setzeDaten] = useState<BrettbeispieleDesSchachAbenteuers | null>(null);
  useEffect(() => {
    let aktiv = true;
    void ladeBeispiele().then((d) => {
      if (aktiv) setzeDaten(d);
    });
    return () => {
      aktiv = false;
    };
  }, []);
  const beispiel = daten?.beispiele.find((b) => b.kennung === marke.kennung);
  const bild = beispiel ? brettbild(beispiel, marke.bild) : null;
  if (!beispiel || !bild) return null;
  return (
    <figure
      className="abenteuer-grossansicht abenteuer-brettbeispiel"
      data-testid="abenteuer-brettbeispiel"
      data-beispiel={`${marke.kennung}.${marke.bild}`}
    >
      <Brett
        fen={bild.fen}
        markierungen={bild.markierungen}
        letzterZug={bild.letzterZug}
        beschriftung={tSpiel("dialog.brettbeispiel", { konzept: beispiel.konzept })}
        koordinaten={false}
      />
    </figure>
  );
}
