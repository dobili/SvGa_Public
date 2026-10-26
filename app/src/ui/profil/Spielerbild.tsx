/**
 * Das Porträt des Lesers (Wunsch des Autors vom 25.10.2026): gewähltes oder selbst gebautes Bild,
 * sonst der Anfangsbuchstabe des Namens oder ein Personenzeichen.
 *
 * Rolle im Gesamtbild: Gegenstück zu GegnerBild.tsx; dieselben Klassen, damit Größe, Rundung und
 * Grundfarbe überall zu den Bots passen (Profilkopf, Partieuhr, Partienliste).
 * Abhängigkeiten: speicher/profil.ts, spieler.ts, lucide-react.
 */
import { CircleUserRound } from "lucide-react";
import { bildadresse, type Spielerprofil } from "../../speicher/profil";

/** Größe des Personenzeichens ohne Bild (Bildpunkte). */
const ZEICHENGROESSE = 22;

/**
 * Bild des Lesers. `profil`: zum Anzeigen eines Entwurfs im Editor; sonst das gespeicherte.
 * Beispiel: Profil mit „wahl-07“ → das Porträt wahl-07; ohne Bild mit Namen „Dana“ → „D“.
 */
export function Spielerbild({ profil }: { profil: Spielerprofil }) {
  return (
    <span className="gegnerbild spielerbild" data-testid="spielerbild">
      {profil.bild ? (
        <img
          className="gegner-portraet"
          src={bildadresse(profil.bild, import.meta.env.BASE_URL)}
          alt=""
        />
      ) : (
        <span className="gegner-portraet gegner-zeichen" aria-hidden="true">
          {profil.name ? profil.name.slice(0, 1) : <CircleUserRound size={ZEICHENGROESSE} />}
        </span>
      )}
    </span>
  );
}
