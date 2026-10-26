/**
 * Schmaler senkrechter Bewertungsbalken links am Brett, mit Zahl (Vorschlag H).
 *
 * Rolle im Gesamtbild: Nur beim Nachspielen einer ausgewerteten Partie (Partie.tsx); während der
 * Partie verriete er zu viel. Weiß wächst von der eigenen Seite her: bei gedrehtem Brett (der
 * Leser spielt Schwarz) von oben.
 * Abhängigkeiten: spiel/rueckblick.ts, i18n.
 */
import { t } from "../../i18n/sprache";
import { balkenanteil, balkentext } from "../../spiel/rueckblick";

const PROZENT = 100;

/**
 * Der schmale Bewertungsbalken links am Brett, mit Zahl; nur beim Nachspielen einer ausgewerteten
 * Partie.
 */
export function Bewertungsbalken({ wert, gedreht }: { wert: number; gedreht: boolean }) {
  const weiss = balkenanteil(wert) * PROZENT;
  const text = balkentext(wert);
  return (
    <div
      className={`bewertungsbalken${gedreht ? " gedreht" : ""}`}
      role="img"
      aria-label={t("rueckblick.balken", { wert: text })}
      data-testid="bewertungsbalken"
    >
      <div className="bewertungsbalken-weiss" style={{ height: `${weiss}%` }} />
      <span className="bewertungsbalken-zahl">{text}</span>
    </div>
  );
}
