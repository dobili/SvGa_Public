/**
 * Auswahl der Figur bei der Umwandlung eines Bauern (Dame, Turm, Läufer, Springer) mit Abbruch.
 *
 * Rolle im Gesamtbild: Erscheint, wenn ein Bauer die letzte Reihe erreicht, beim Weiterspielen an
 * einer Abbildung (Brettbereich.tsx) wie im Stellungseditor (Stellungseditor.tsx).
 * Die Zurück-Taste bricht die Umwandlung ab (app/blattstapel.ts), statt das Brett zu verlassen.
 * Beim Öffnen bekommt die Dame den Fokus: Sonst stand er auf dem Zielfeld, und wer mit der
 * Tastatur spielt, musste sich durch das ganze Brett tabben; im Querformat lag die Auswahl außerdem
 * halb unter dem Bildrand und kommt so ins Bild (Prüfung „zugang“, 19.11.2026).
 * Abhängigkeiten: app/blattstapel.ts, schach/weiterspielen.ts (UMWANDLUNGEN), schach/stellung.ts, i18n.
 */
import { useEffect, useRef } from "react";
import { useZurueckSchliesst } from "../../../app/blattstapel";
import { t } from "../../../i18n/sprache";
import { ROLLENBUCHSTABE, type Rolle } from "../../../schach/stellung";
import { UMWANDLUNGEN } from "../../../schach/weiterspielen";

/**
 * Die Auswahl der Figur, wenn ein Bauer die letzte Reihe erreicht (Dame, Turm, Läufer, Springer
 * oder Abbruch).
 */
export function Umwandlung({ beiWahl }: { beiWahl: (rolle: Rolle | null) => void }) {
  useZurueckSchliesst(true, () => beiWahl(null));
  const erste = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    erste.current?.focus();
  }, []);
  return (
    <div className="umwandlung" role="dialog" aria-label={t("zugleiste.umwandlung")}>
      <span>{t("zugleiste.umwandlung")}</span>
      {UMWANDLUNGEN.map((rolle, i) => (
        <button
          key={rolle}
          ref={i === 0 ? erste : undefined}
          type="button"
          className="chip"
          onClick={() => beiWahl(rolle)}
        >
          {t(`figur.${ROLLENBUCHSTABE[rolle]}`)}
        </button>
      ))}
      <button type="button" className="knopf-link klein" onClick={() => beiWahl(null)}>
        {t("loeschen.nein")}
      </button>
    </div>
  );
}
