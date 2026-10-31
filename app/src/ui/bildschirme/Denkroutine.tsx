/**
 * Denkroutine als Nachschlagekarte (die Gesamt-Checkliste steht in Checkliste.tsx).
 *
 * Rolle im Gesamtbild: Pflichtenheft 4: „Denkroutine: die Kopiervorlage als aufklappbare Karte:
 * vier Schritte, Sicherheitsblick, Werkzeuge je Partiephase“. Alle Texte kommen aus
 * nachschlagen.json (Pipeline, aus dem LaTeX). Aus den Trainern heraus aufrufbar (AP 13); bis
 * dahin über Nachschlagen. Seit „Weniger Text“ P6 (31.10.2026) fünf Karten mit Zeichen, deren
 * Buchtext per Tipp aufklappt (Schrittkarten.tsx), und drei Phasenzeichen mit „Du bist hier“
 * (Phasenwahl.tsx).
 * Abhängigkeiten: daten/laden.ts, komponenten/denkroutine/, i18n.
 */
import { ladeNachschlagen } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Phasenwahl } from "../komponenten/denkroutine/Phasenwahl";
import { Schrittkarten } from "../komponenten/denkroutine/Schrittkarten";

/**
 * Die Denkroutine des Buches als Nachschlagekarte: vier Schritte, Sicherheitsblick und Werkzeuge je
 * Partiephase.
 */
export function Denkroutine() {
  const daten = useDaten(ladeNachschlagen, "nachschlagen");
  const routine = daten.art === "fertig" ? daten.wert.denkroutine : null;
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("denkroutine.titel")} zurueckText={t("nachschlagen.titel")} />
      {daten.art === "laedt" && <p className="lade">…</p>}
      {daten.art === "fehler" && <p className="fehlertext">{daten.meldung}</p>}
      {routine && <Schrittkarten routine={routine} />}
      {routine && <Phasenwahl routine={routine} />}
    </div>
  );
}
