/**
 * Ergebnis einer beendeten Partie: wie sie endete, neue Partie.
 *
 * Rolle im Gesamtbild: Erscheint auf dem Partie-Bildschirm nach dem Ende (Pflichtenheft 5.2,
 * 5.3 Auswertung). Die Auswertung mit Zugzeichen, den absichtlichen Fehlern der
 * Engine und der PGN steht darunter (ui/komponenten/Auswertung.tsx).
 * Abhängigkeiten: spiel/partie.ts, Navigation, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import type { Partie } from "../../spiel/partie";
import { kurzergebnis } from "./partietexte";

export function Partieende({ partie }: { partie: Partie }) {
  const { navigiere } = useNavigation();
  const { startFen, abbildung } = partie.einstellung;
  return (
    <section className="karte partieende" data-testid="partieende">
      <h2 className="karte-titel">{kurzergebnis(partie)}</h2>
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-haupt"
          onClick={() =>
            navigiere({ bildschirm: "spielen", startFen, ...(abbildung ? { abbildung } : {}) })
          }
        >
          {t("partie.nochmal")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => navigiere({ bildschirm: "spielen" })}
        >
          {t("partie.neu")}
        </button>
      </div>
    </section>
  );
}
