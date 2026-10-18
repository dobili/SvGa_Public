/**
 * Ergebnis einer beendeten Partie: wie sie endete, neue Partie.
 *
 * Rolle im Gesamtbild: Erscheint auf dem Partie-Bildschirm nach dem Ende (Pflichtenheft 5.2,
 * 5.3 Auswertung). Die Auswertung mit Zugzeichen, den absichtlichen Fehlern der
 * Engine und der PGN steht darunter (ui/komponenten/Auswertung.tsx). Seit 0.2.85 (Rückmeldung
 * des Autors) fehlt „Noch einmal aus derselben Stellung“ bei Partien aus der Grundstellung: Das
 * ist dort dasselbe wie „Neue Partie“ und verwirrte.
 * Abhängigkeiten: spiel/partie.ts, Navigation, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import type { Partie } from "../../spiel/partie";
import { ausGrundstellung } from "../../spiel/wertung";
import { kurzergebnis } from "./partietexte";

export function Partieende({ partie }: { partie: Partie }) {
  const { navigiere } = useNavigation();
  const { startFen, abbildung } = partie.einstellung;
  const eigeneStellung = !ausGrundstellung(partie);
  return (
    <section className="karte partieende" data-testid="partieende">
      <h2 className="karte-titel">{kurzergebnis(partie)}</h2>
      <div className="knopfreihe">
        {eigeneStellung && (
          <button
            type="button"
            className="knopf-haupt"
            onClick={() =>
              navigiere({ bildschirm: "spielen", startFen, ...(abbildung ? { abbildung } : {}) })
            }
          >
            {t("partie.nochmal")}
          </button>
        )}
        <button
          type="button"
          className={eigeneStellung ? "knopf-zweit" : "knopf-haupt"}
          onClick={() => navigiere({ bildschirm: "spielen" })}
        >
          {t("partie.neu")}
        </button>
      </div>
    </section>
  );
}
