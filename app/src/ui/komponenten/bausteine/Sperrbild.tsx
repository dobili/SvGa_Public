/**
 * Gesperrte Vorschau eines freischaltbaren Extras: das echte Bild abgedunkelt, darauf ein Schloss
 * in der Ecke (Gestaltung „Deine Extras neu“, 31.10.2026).
 *
 * Rolle im Gesamtbild: Früher erschienen gesperrte Extras als graue Silhouette; in den
 * Einstellungen sah das wie ein Ladefehler aus (Fund der Durchsicht, 31.10.2026). Jetzt zeigen
 * die Profilkarte „Deine Extras“ und die Kacheln der Einstellungen (Vorschauwahl.tsx) dasselbe:
 * man sieht, was man bekommt, nur dunkler, und das Schloss sagt, dass es noch zu verdienen ist.
 * Das Schloss ist Schmuck (aria-hidden); die Bedingung steht als Text daneben.
 * Abhängigkeiten: lucide-react, Stil in ui/stil/extras.css.
 */
import { Lock } from "lucide-react";
import type { ReactNode } from "react";

/** Größe des Schlosses in der Ecke (Bildpunkte). */
const SCHLOSSGROESSE = 13;

/**
 * Hülle um eine Vorschau; gesperrt abgedunkelt mit Schloss, sonst unverändert.
 * Beispiel: Brett „Nacht und Gold“ ohne alle Orden der Buchteile → dunkles Brett mit Schloss.
 */
export function Sperrbild({ gesperrt, children }: { gesperrt: boolean; children: ReactNode }) {
  return (
    <span className={`sperrbild${gesperrt ? " sperrbild-zu" : ""}`}>
      <span className="sperrbild-inhalt">{children}</span>
      {gesperrt && (
        <span className="sperrbild-schloss" aria-hidden="true">
          <Lock size={SCHLOSSGROESSE} />
        </span>
      )}
    </span>
  );
}
