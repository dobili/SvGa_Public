/**
 * Das Brett der Trainer: Stellung, Markierungen, Tipp auf ein Feld, Seite am Zug.
 *
 * Rolle im Gesamtbild: Schlanker als der Brettbereich der Abbildungen (keine Werkzeuge, kein
 * Zugziehen); jeder Trainer bestimmt selbst, was ein Tipp bedeutet. Koordinaten wie in den
 * Einstellungen, außer der Trainer schaltet sie ab (Feld finden).
 * Abhängigkeiten: ui/brett, app/merker.ts, i18n.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { liesMerker } from "../../app/merker";
import { t } from "../../i18n/sprache";
import { Brett } from "../brett/Brett";

/** Der Buchstabe der Seite am Zug aus der FEN („w“ oder „b“). */
function amZug(fen: string): "w" | "b" {
  return fen.split(" ")[1] === "b" ? "b" : "w";
}

/**
 * Das Brett der Trainer: zeigt Stellung und Markierungen und meldet einen Tipp auf ein Feld;
 * schlanker als das Brett der Abbildungen.
 */
export function Trainerbrett({
  fen,
  markierungen = [],
  beiFeld,
  ausgewaehlt = null,
  ziele = [],
  gedreht = false,
  ohneKoordinaten = false,
  zeigeAmZug = true,
  beschriftung,
}: {
  fen: string;
  markierungen?: readonly Markierung[];
  beiFeld?: (feld: string) => void;
  ausgewaehlt?: string | null;
  ziele?: readonly string[];
  gedreht?: boolean;
  ohneKoordinaten?: boolean;
  zeigeAmZug?: boolean;
  beschriftung: string;
}) {
  const [koordinaten] = useState(liesMerker("koordinaten") !== "aus");
  const seite = amZug(fen);
  return (
    <div className="brettbereich">
      <Brett
        fen={fen}
        markierungen={markierungen}
        gedreht={gedreht}
        koordinaten={koordinaten && !ohneKoordinaten}
        ausgewaehlt={ausgewaehlt}
        ziele={ziele}
        {...(beiFeld ? { beiFeld } : {})}
        beschriftung={beschriftung}
      />
      {zeigeAmZug && (
        <p className="am-zug">
          <span className={`am-zug-marke am-zug-${seite}`} aria-hidden="true" />
          {t(`abbildung.amZug.${seite}`)}
        </p>
      )}
    </div>
  );
}
