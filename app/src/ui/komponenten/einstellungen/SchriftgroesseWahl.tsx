/**
 * Einstellung „Schriftgröße“ (Wunsch des Autors, 24.10.2026): kleiner und größer in Schritten von
 * 10 %, dazwischen die Prozentzahl, dazu „Standard“ zurück auf die Gerätevorgabe.
 *
 * Rolle im Gesamtbild: Reiter „Anzeige“ der Einstellungen (anzeigezeilen.tsx). Seit dem Entwurf
 * K2 (31.10.2026) eine Zeile: rechts „A−“, Prozent, „A+“; die Erklärung hinter dem Fragezeichen,
 * „Standard“ darunter, sobald die Größe abweicht. Die Wahl gilt sofort und bleibt auf dem Gerät
 * (app/schriftgroesse.ts). Die Knöpfe sind Tippflächen von 44 Pixeln; am Rand des Bereichs ist
 * der Knopf abgeschaltet.
 * Abhängigkeiten: app/schriftgroesse.ts, Einstellungszeile, i18n.
 */
import { ALargeSmall } from "lucide-react";
import { useState } from "react";
import {
  GROESSTE,
  KLEINSTE,
  liesSchriftgroesse,
  NORMAL,
  SCHRITT,
  setzeSchriftgroesse,
} from "../../../app/schriftgroesse";
import { t } from "../../../i18n/sprache";
import { Einstellungszeile } from "./Einstellungszeile";

/** Beispiel: 100 % → „A−“ „100 %“ „A+“; nach „A+“ 110 % und der Knopf „Standard“ erscheint. */
export function SchriftgroesseWahl() {
  const [prozent, setzeProzent] = useState(liesSchriftgroesse);
  const waehle = (neu: number) => setzeProzent(setzeSchriftgroesse(neu));
  const name = t("einstellungen.schriftgroesse");
  const stepper = (
    <div className="schriftgroesse-reihe" role="group" aria-label={name}>
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
    </div>
  );
  return (
    <div data-testid="schriftgroesse">
      <Einstellungszeile
        symbol={ALargeSmall}
        name={name}
        erklaerung={t("einstellungen.schriftgroesse.hinweis")}
        rechts={stepper}
        unten={
          prozent !== NORMAL && (
            <button
              type="button"
              className="knopf-zweit einstellungszeile-unten"
              onClick={() => waehle(NORMAL)}
            >
              {t("einstellungen.schriftgroesse.standard")}
            </button>
          )
        }
      />
    </div>
  );
}
