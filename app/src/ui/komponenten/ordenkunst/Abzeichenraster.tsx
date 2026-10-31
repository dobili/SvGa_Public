/**
 * Die Abzeichen im Profil als Raster: vier je Reihe, Name darunter, ein Tipp zeigt die Bedingung.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (30.10.2026): Im Profil standen die Abzeichen einzeln
 * untereinander, weil die allgemeine Regel der Ausklapplisten (.anleitung ul) das Gitter
 * überschrieb; das kostete viel Platz. Auf der Entwurfsseite hat er das Raster mit Namen darunter
 * und Bedingung auf Tipp freigegeben. Ersetzt die Liste „abzeichengitter“ in Erfahrung.tsx;
 * die testids der Einträge bleiben gleich (abzeichen-<kennung>).
 * Abhängigkeiten: fortschritt/abzeichen.ts, fortschritt/abzeichenstand.ts,
 * bausteine/Abzeichenbild.tsx, i18n, Stil in ui/stil/ordenkunst.css.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { Abzeichenbild } from "../bausteine/Abzeichenbild";
import {
  ABZEICHEN,
  type Abzeichenkennung,
  abzeichenname,
  abzeichenbedingung,
} from "../fortschritt/abzeichen";
import type { Abzeichenstand } from "../fortschritt/abzeichenstand";

/**
 * Das Raster aller Abzeichen; verdiente farbig mit Glanz, offene als Silhouette.
 * Beispiel: Tipp auf „Erstes Matt“ → darunter „Eine Partie mit Matt gewonnen“ (sinngemäß).
 */
export function Abzeichenraster({ stand }: { stand: Abzeichenstand }) {
  const [offen, setzeOffen] = useState<Abzeichenkennung | null>(null);
  return (
    <ul className="abzeichenraster">
      {ABZEICHEN.map((a) => {
        const verdient = stand.verdient.has(a.kennung);
        const name = abzeichenname(a.kennung);
        const zeigt = offen === a.kennung;
        return (
          <li
            key={a.kennung}
            className={verdient ? "verdient" : "offen"}
            data-testid={`abzeichen-${a.kennung}`}
          >
            <button
              type="button"
              aria-expanded={zeigt}
              onClick={() => setzeOffen(zeigt ? null : a.kennung)}
            >
              <Abzeichenbild
                symbol={a.symbol}
                kennung={a.kennung}
                beschriftung={t(verdient ? "abzeichen.verdient" : "abzeichen.offen", { name })}
                silhouette={!verdient}
              />
              <span className="abzeichenraster-name" aria-hidden="true">
                {name}
              </span>
              {zeigt && (
                <span className="abzeichenraster-bedingung">{abzeichenbedingung(a.kennung)}</span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
