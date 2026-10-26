/**
 * Aufklappbarer Abschnitt „So prüft die App“ unter einer Ergebniskarte: Erklärung des Werkzeugs,
 * Regel mit Buchbezug und der Hinweis, dass die Werkzeuge irren können.
 *
 * Rolle im Gesamtbild: Ein zweites Tippen auf ein Werkzeug wählt es wieder ab (Wunsch des
 * Autors); die Erklärung steht deshalb hier in der Karte. Nur „Zählen“ und „Ziehen“, bei denen
 * man mit dem Brett arbeitet, zeigen sie in einer eigenen Kachel (Erklaerkarte.tsx).
 * Abhängigkeiten: i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";

/**
 * Beispiel: Röntgen an Abb. 1.26 → Knopf „So prüft die App“, aufgeklappt Erklärung, Regel aus
 * Kapitel 1 und der Hinweis „… Maßgeblich ist das Buch.“
 */
export function SoPrueft({
  beschriftung,
  absaetze,
}: {
  beschriftung: string;
  /** Die Absätze in ihrer Reihenfolge; leere fallen weg. */
  absaetze: readonly string[];
}) {
  const [offen, setzeOffen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="knopf-link"
        aria-expanded={offen}
        onClick={() => setzeOffen(!offen)}
      >
        {beschriftung}
      </button>
      {offen &&
        absaetze
          .filter((absatz) => absatz.length > 0)
          .map((absatz) => (
            <p key={absatz} className="regeltext">
              {absatz}
            </p>
          ))}
      {offen && <p className="hinweis">{t("werkzeug.irrtum")}</p>}
    </>
  );
}
