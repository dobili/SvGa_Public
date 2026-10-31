/**
 * Meldung „Fesselung: Silber!“ am Ende einer Trainerrunde (Gamifizierung P3), mit kurzem Glanz.
 *
 * Rolle im Gesamtbild: Eintrag in NACH_DER_RUNDE (ui/trainer/nachDerRunde.ts). Nach dem
 * Rundenende trägt sie alle neu erreichten Stufen in „verdient“ ein (G3) und zeigt je Thema die
 * erreichte Stufe mit Medaille und Teilen-Knopf. Ohne neue Stufe zeigt sie nichts. Jeder Trainer,
 * der den Rundenrahmen nutzt und Antworten mit Thema notiert, bekommt die Meldung von selbst.
 * Den Glanz gibt es nur mit eingeschalteten Feiereffekten (und nicht bei „Bewegung reduzieren“).
 * Abhängigkeiten: training/meisterschaftsstand.ts, Themenmedaille.tsx, MedailleTeilen.tsx,
 * thementexte.ts, app/feiereffekte.ts, Speicher, i18n.
 */
import { useEffect, useRef, useState } from "react";
import { feiereffekteAn } from "../../../app/feiereffekte";
import { t } from "../../../i18n/sprache";
import { aendere } from "../../../speicher/speicher";
import { mitNeuenStufen, type NeueStufe } from "../../../training/meisterschaftsstand";
import "../../stil/themen.css";
import { MedailleTeilen } from "./MedailleTeilen";
import { Themenmedaille } from "./Themenmedaille";
import { hatThemenname, stufenname, themenname } from "./thementexte";

/**
 * Trägt neue Stufen einmal nach dem Anzeigen ein und gibt sie zurück.
 * Warum der Aufschub (queueMicrotask): wie bei den Rekorden (useRekordpruefung.ts) laufen die
 * Effekte der Trainerkomponente zuerst; so steht die letzte Antwort sicher im Protokoll.
 */
function useNeueStufen(): readonly NeueStufe[] {
  const [neue, setzeNeue] = useState<readonly NeueStufe[]>([]);
  const geprueft = useRef(false);
  useEffect(() => {
    if (geprueft.current) return;
    geprueft.current = true;
    queueMicrotask(() => {
      let gefunden: readonly NeueStufe[] = [];
      void aendere((daten) => {
        const ergebnis = mitNeuenStufen(daten, new Date());
        gefunden = ergebnis.neue;
        return ergebnis.daten;
      }).then(() => setzeNeue(gefunden.filter((n) => hatThemenname(n.thema))));
    });
  }, []);
  return neue;
}

/** Eintrag am Rundenende. */
export function Meisterschaftsmeldung() {
  const neue = useNeueStufen();
  if (neue.length === 0) return null;
  const glanz = feiereffekteAn();
  return (
    <div data-testid="meisterschaft-meldung">
      {neue.map(({ thema, stufe }) => (
        <div key={thema} className={`themenmeldung${glanz ? " themenmeldung-glanz" : ""}`}>
          <Themenmedaille thema={thema} stufe={stufe} klasse="themenmedaille-gross" />
          <div>
            <p className="meldung gut" role="status">
              {t("themen.meldung", { name: themenname(thema), stufe: stufenname(stufe) })}
            </p>
            <MedailleTeilen thema={thema} stufe={stufe} />
          </div>
        </div>
      ))}
    </div>
  );
}
