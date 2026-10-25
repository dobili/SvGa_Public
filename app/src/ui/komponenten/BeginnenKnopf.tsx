/**
 * Der Knopf „Partie beginnen“ mit der Rückfrage, wenn schon eine Partie läuft.
 *
 * Rolle im Gesamtbild: Seit 0.2.85 (Wunsch des Autors) steht der Knopf auf dem Bildschirm Spielen
 * direkt unter den drei Kacheln der Gegnerwahl statt ganz unten (GegnerWahl.tsx, Spielen.tsx).
 * Seit V6 (Nutzungsprüfung 25.10.2026) zeigt der Knopf den Tipp sofort (gedrückt, für Bildschirmleser „beschäftigt“)
 * und beginnt die Partie erst nach diesem Bild; vorher stand gedrosselt (CPU 4×) gut 0,2 s lang
 * nichts Neues da, bis die Partie fertig gezeichnet war.
 * Abhängigkeiten: i18n, nachDemNaechstenBild.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { Knopfsymbol } from "./Knopfsymbol";
import { nachDemNaechstenBild } from "./nachDemNaechstenBild";

/**
 * Eingaben: läuft schon eine Partie (dann erst die Rückfrage „ersetzen?“), darf begonnen werden,
 * ein Hinweis darunter (etwa „erst einen eigenen Bot wählen“), der Beginn selbst.
 */
export function BeginnenKnopf({
  laufend,
  moeglich,
  hinweis,
  beiBeginn,
  kurz = false,
}: {
  /** Nur „Beginnen“ sichtbar (Startleiste, DS50); Bildschirmleser hören „Partie beginnen“. */
  kurz?: boolean;
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
          className="knopf-haupt"
          aria-label={kurz ? t("spielen.beginnen") : undefined}
          disabled={!moeglich}
          aria-busy={beginnt}
          onClick={() => (laufend ? setzeErsetzen(true) : beginne())}
        >
          <Knopfsymbol art="starten" />
          {t(kurz ? "spielen.beginnenKurz" : "spielen.beginnen")}
        </button>
      )}
      {hinweis && <p className="hinweis">{hinweis}</p>}
    </div>
  );
}
