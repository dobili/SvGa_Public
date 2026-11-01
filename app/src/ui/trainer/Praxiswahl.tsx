/**
 * Repertoire-Trainer, Eröffnungen aus der Praxis: der Schalter „Auch Eröffnungen aus der Praxis
 * (Lichess)“ und die Auswahl der Varianten nach Spielstärke mit Haken.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026). Die Auswahl ist dieselbe Klappe wie beim
 * Bot im Gegnereditor (Staerkewahl.tsx mit Mehrfachauswahl: Bänder, Familien je Seite, Variantenbaum
 * mit Schnellwahl „die häufigsten 3 und 5“ und „alle“, Einzelhaken, Gambits). Gewählt sind Werte
 * „praxis:Name“ wie beim Bot; der Repertoire-Trainer merkt sie im Gerätemerker (useGemerkt.ts),
 * nicht in den Nutzerdaten. Die Kennzeichnung sagt, dass die Züge nicht aus dem Buch stammen.
 * Abhängigkeiten: spiel/boteroeffnung.ts (umschalten, Schnellwahl), Staerkewahl, i18n.
 */
import { t, tZahl } from "../../i18n/sprache";
import { mitSchnellwahl, umgeschaltet } from "../../spiel/boteroeffnung";
import { Staerkewahl } from "../komponenten/spielstart/Staerkewahl";

/**
 * Der Schalter unter den Zeilen der Startkarte; Vorgabe aus (Wunsch des Autors).
 * Beispiel: angehakt → die Zeile „Aus“ bietet „Praxis (Lichess)“ und wählt sie gleich.
 */
export function Praxisschalter({ an, setze }: { an: boolean; setze: (an: boolean) => void }) {
  return (
    <label className="schalterzeile" data-testid="repertoire-praxis" data-tour="repertoire-praxis">
      <input type="checkbox" checked={an} onChange={(e) => setze(e.target.checked)} />
      {t("repertoiretrainer.praxis.schalter")}
    </label>
  );
}

/**
 * Die Auswahl der Varianten aus der Praxis: Kennzeichnung, Klappe nach Spielstärke mit Haken,
 * die Zahl der gewählten und „Alle entfernen“.
 *
 * Eingaben: gewählte Werte („praxis:Name“), Rückruf mit der neuen Liste.
 * Beispiel: Italienisch, „Die häufigsten 3“ → drei Varianten gewählt.
 */
export function Praxisauswahl({
  werte,
  setze,
}: {
  werte: readonly string[];
  setze: (werte: readonly string[]) => void;
}) {
  return (
    <div className="praxisauswahl" data-testid="repertoire-praxisauswahl">
      <p className="hinweis" data-testid="repertoire-praxishinweis">
        {t("repertoiretrainer.praxis.kennzeichnung")}
      </p>
      <Staerkewahl
        praefix="repertoire-staerke"
        offen
        erklaerung={t("repertoiretrainer.praxis.erklaerung")}
        wahl={{
          ist: (wert) => werte.includes(wert),
          beiWahl: (wert) => setze(umgeschaltet(werte, wert)),
          beiSchnellwahl: (familie, anzahl) => setze(mitSchnellwahl(werte, familie, anzahl)),
        }}
      />
      <div className="knopfreihe">
        <span className="hinweis" data-testid="repertoire-praxisanzahl">
          {tZahl("repertoiretrainer.praxis.gewaehlt", werte.length, { anzahl: werte.length })}
        </span>
        {werte.length > 0 && (
          <button type="button" className="knopf-zweit" onClick={() => setze([])}>
            {t("spielen.boteroeffnung.alleEntfernen")}
          </button>
        )}
      </div>
    </div>
  );
}
