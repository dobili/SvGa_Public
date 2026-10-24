/**
 * Einstellung „Schriftgröße“ (Wunsch des Autors, 24.10.2026): kleiner und größer in Schritten von
 * 10 %, dazwischen die Prozentzahl, dazu „Standard“ zurück auf die Gerätevorgabe.
 *
 * Rolle im Gesamtbild: Bereich „Anzeige“ der Einstellungen (EinstellungenKarte.tsx). Die Wahl
 * gilt sofort und bleibt auf dem Gerät (app/schriftgroesse.ts). Die Knöpfe sind Tippflächen von
 * 44 Pixeln; am Rand des Bereichs ist der Knopf abgeschaltet.
 * Abhängigkeiten: app/schriftgroesse.ts, i18n.
 */
import { useState } from "react";
import {
  GROESSTE,
  KLEINSTE,
  liesSchriftgroesse,
  NORMAL,
  SCHRITT,
  setzeSchriftgroesse,
} from "../../app/schriftgroesse";
import { t } from "../../i18n/sprache";

/** Beispiel: 100 % → „A−“ „100 %“ „A+“; nach „A+“ 110 % und der Knopf „Standard“ erscheint. */
export function SchriftgroesseWahl() {
  const [prozent, setzeProzent] = useState(liesSchriftgroesse);
  const waehle = (neu: number) => setzeProzent(setzeSchriftgroesse(neu));
  return (
    <div className="einstellung-auswahl" data-testid="schriftgroesse">
      <p className="einstellung-name" id="schriftgroesse-name">
        {t("einstellungen.schriftgroesse")}
      </p>
      <div
        className="chipreihe schriftgroesse-reihe"
        role="group"
        aria-labelledby="schriftgroesse-name"
      >
        <button
          type="button"
          className="chip"
          aria-label={t("einstellungen.schriftgroesse.kleiner")}
          disabled={prozent <= KLEINSTE}
          onClick={() => waehle(prozent - SCHRITT)}
        >
          A−
        </button>
        <output className="schriftgroesse-wert" data-testid="schriftgroesse-wert">
          {t("einstellungen.schriftgroesse.wert", { prozent })}
        </output>
        <button
          type="button"
          className="chip"
          aria-label={t("einstellungen.schriftgroesse.groesser")}
          disabled={prozent >= GROESSTE}
          onClick={() => waehle(prozent + SCHRITT)}
        >
          A+
        </button>
        {prozent !== NORMAL && (
          <button type="button" className="knopf-zweit" onClick={() => waehle(NORMAL)}>
            {t("einstellungen.schriftgroesse.standard")}
          </button>
        )}
      </div>
      <p className="hinweis">{t("einstellungen.schriftgroesse.hinweis")}</p>
    </div>
  );
}
