/**
 * Der Knopf „Partie beginnen“ mit der Rückfrage, wenn schon eine Partie läuft.
 *
 * Rolle im Gesamtbild: Steht auf der Karte „Schnell eine Partie“ und in der festen Startleiste
 * der Unterseiten von „Spielen“ (Entwurf J3; Startleiste.tsx, Vorschlagskarte.tsx). Der Knopf zeigt den Tipp sofort (gedrückt, für Bildschirmleser
 * „beschäftigt“) und beginnt die Partie erst nach diesem Bild (V6, Nutzungsprüfung 25.10.2026);
 * sonst stünde gedrosselt (CPU 4×) gut 0,2 s lang nichts Neues da, bis die Partie fertig
 * gezeichnet ist.
 * Abhängigkeiten: i18n, nachDemNaechstenBild.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { nachDemNaechstenBild } from "../bausteine/nachDemNaechstenBild";

/**
 * Eingaben: läuft schon eine Partie (dann erst die Rückfrage „ersetzen?“), darf begonnen werden,
 * ein Hinweis darunter (etwa „erst einen eigenen Bot wählen“), der Beginn selbst.
 */
export function BeginnenKnopf({
  laufend,
  moeglich,
  hinweis,
  beiBeginn,
  text,
  vorlesen,
  gross = false,
}: {
  /** Sichtbarer Text (seit J3 „Spielen“). */
  text: string;
  /** Name für Bildschirmleser, beginnt mit dem sichtbaren Text („Spielen gegen Felix“). */
  vorlesen?: string;
  /** Großer Knopf über die ganze Breite (Karte „Schnell eine Partie“). */
  gross?: boolean;
  laufend: boolean;
  moeglich: boolean;
  hinweis: string | null;
  beiBeginn: () => void;
}) {
  const [ersetzen, setzeErsetzen] = useState(false);
  const [beginnt, setzeBeginnt] = useState(false);
  // Erst die Rückmeldung zeichnen, dann die Partie anlegen und öffnen (V6).
  const beginne = () => {
    if (beginnt) return;
    setzeBeginnt(true);
    void nachDemNaechstenBild().then(beiBeginn);
  };
  return (
    <div className="beginnen">
      {laufend && ersetzen ? (
        <div className="nachfrage">
          <p>{t("spielen.ersetzenFrage")}</p>
          <div className="knopfreihe">
            <button type="button" className="knopf-gefahr" aria-busy={beginnt} onClick={beginne}>
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
          className={gross ? "knopf-haupt knopf-spielen-gross" : "knopf-haupt"}
          aria-label={vorlesen}
          disabled={!moeglich}
          aria-busy={beginnt}
          onClick={() => (laufend ? setzeErsetzen(true) : beginne())}
        >
          <Knopfsymbol art="starten" />
          {text}
        </button>
      )}
      {hinweis && <p className="hinweis">{hinweis}</p>}
    </div>
  );
}
