/**
 * Das Porträt des Lesers (Wunsch des Autors vom 25.10.2026): gewähltes oder selbst gebautes Bild,
 * sonst der Anfangsbuchstabe des Namens oder ein Personenzeichen.
 *
 * Rolle im Gesamtbild: Gegenstück zu GegnerBild.tsx; dieselben Klassen, damit Größe, Rundung und
 * Grundfarbe überall zu den Bots passen (Profilkopf, Partieuhr, Partienliste).
 * Seit Gamifizierung P7 trägt das Bild den gewählten Porträtrahmen (Bronze, Silber, Gold), ein
 * freischaltbares Extra (komponenten/extras/extrawahl.ts). Die Profilkarte „Deine Extras“ zeigt
 * mit `rahmen` jeden Rahmen zur Probe, ohne ihn anzulegen.
 * Abhängigkeiten: speicher/profil.ts, spieler.ts, extras/extrawahl.ts, lucide-react.
 */
import { CircleUserRound } from "lucide-react";
import { bildadresse, type Spielerprofil } from "../../speicher/profil";
import { usePortraetrahmen } from "../komponenten/extras/extrawahl";

/** Größe des Personenzeichens ohne Bild (Bildpunkte). */
const ZEICHENGROESSE = 22;

/**
 * Bild des Lesers. `profil`: zum Anzeigen eines Entwurfs im Editor; sonst das gespeicherte.
 * `rahmen`: ein Rahmen zur Probe (Kacheln der Extras); ohne gilt der angelegte.
 * Beispiel: Profil mit „wahl-07“ → das Porträt wahl-07; ohne Bild mit Namen „Dana“ → „D“.
 */
export function Spielerbild({ profil, rahmen: probe }: { profil: Spielerprofil; rahmen?: string }) {
  const angelegt = usePortraetrahmen();
  const rahmen = probe ?? angelegt;
  const rahmenklasse = rahmen === "ohne" ? "" : ` spielerbild-rahmen spielerbild-rahmen-${rahmen}`;
  return (
    <span
      className={`gegnerbild spielerbild${rahmenklasse}`}
      data-testid="spielerbild"
      data-rahmen={rahmen}
    >
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
