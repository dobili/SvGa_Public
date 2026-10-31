/**
 * Feste Startleiste unten auf den Unterseiten von „Spielen“: Bild und Name des Gegners mit Zahl,
 * darunter Farbe, Bedenkzeit und Wertung, daneben der Knopf „Spielen“ (Vorschlag DS40, vom Autor
 * am 25.10.2026 freigegeben; seit „Spielen neu“, Entwurf J3, nur noch auf den Unterseiten).
 *
 * Rolle im Gesamtbild: Auf der Startseite beginnt die Karte „Schnell eine Partie“ die Partie; auf
 * den Unterseiten (Gegner aussuchen, Eigene Stufe, Eigene Bots, Freie Partie) soll man nach der
 * Wahl trotzdem mit einem Tipp starten können, ohne zurückzuscrollen. Die Leiste klebt über der
 * Navigation (CSS position: sticky). Ein Tipp auf die Zusammenfassung öffnet das Blatt „Partie
 * einstellen“ (vorher: Sprung zur Gegnerwahl). Hinter dem Namen steht die Spielstärke zur
 * gewählten Uhr (bildschirme/startstaerke.ts).
 * Abhängigkeiten: startangaben.tsx, staerkeangabe, i18n.
 */
import type { ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import { staerketext } from "../gegner/staerkeangabe";
import { gegnerangabe, zusammenfassung, type Startangaben } from "./startangaben";

/**
 * Die Leiste. `knopf` ist der BeginnenKnopf; `beiZeile` öffnet das Blatt „Partie einstellen“.
 * Beispiel: Tom, Weiß, Schnellschach 10 + 0, gewertet.
 */
export function Startleiste({
  angaben,
  beiZeile,
  knopf,
}: {
  angaben: Startangaben;
  beiZeile: () => void;
  knopf: ReactNode;
}) {
  const { bild, name } = gegnerangabe(angaben);
  const keiner = angaben.art === "keiner";
  const zeile = keiner ? t("spielen.startleiste.keinBotHinweis") : zusammenfassung(angaben);
  return (
    // Tourziel die ganze Leiste: Die Tour erklärt Zusammenfassung und Knopf zusammen.
    <div className="startleiste" data-testid="startleiste" data-tour="spielen-beginnen">
      <button
        type="button"
        className="startleiste-wer"
        aria-label={t("spielenneu.startleiste.einstellen", { name, zeile })}
        aria-haspopup="dialog"
        onClick={beiZeile}
      >
        <span className="startleiste-bild">{bild}</span>
        <span className="startleiste-text">
          <strong>
            {name}
            {angaben.staerke !== null && !keiner && (
              <span className="startleiste-staerke" data-testid="startleiste-staerke">
                {" · "}
                {angaben.staerke === "unbekannt"
                  ? t("gruppe.unbekannt")
                  : staerketext(angaben.staerke)}
              </span>
            )}
          </strong>
          <span>{zeile}</span>
        </span>
      </button>
      {knopf}
    </div>
  );
}
