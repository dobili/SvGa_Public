/**
 * Der Knopf „Partie beginnen“ mit der Rückfrage, wenn schon eine Partie läuft.
 *
 * Rolle im Gesamtbild: Seit 0.2.85 (Wunsch des Autors) steht der Knopf auf dem Bildschirm Spielen
 * direkt unter den drei Kacheln der Gegnerwahl statt ganz unten (GegnerWahl.tsx, Spielen.tsx).
 * Abhängigkeiten: i18n.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { Knopfsymbol } from "./Knopfsymbol";

/**
 * Eingaben: läuft schon eine Partie (dann erst die Rückfrage „ersetzen?“), darf begonnen werden,
 * ein Hinweis darunter (etwa „erst einen eigenen Bot wählen“), der Beginn selbst.
 */
export function BeginnenKnopf({
  laufend,
  moeglich,
  hinweis,
  beiBeginn,
}: {
  laufend: boolean;
  moeglich: boolean;
  hinweis: string | null;
  beiBeginn: () => void;
}) {
  const [ersetzen, setzeErsetzen] = useState(false);
  return (
    <div className="beginnen">
      {laufend && ersetzen ? (
        <div className="nachfrage">
          <p>{t("spielen.ersetzenFrage")}</p>
          <div className="knopfreihe">
            <button type="button" className="knopf-gefahr" onClick={beiBeginn}>
              {t("spielen.ersetzenJa")}
            </button>
            <button type="button" className="knopf-zweit" onClick={() => setzeErsetzen(false)}>
              {t("loeschen.nein")}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="knopf-haupt"
          disabled={!moeglich}
          onClick={() => (laufend ? setzeErsetzen(true) : beiBeginn())}
        >
          <Knopfsymbol art="starten" />
          {t("spielen.beginnen")}
        </button>
      )}
      {hinweis && <p className="hinweis">{hinweis}</p>}
    </div>
  );
}
