/**
 * Unter einer Probepartie: der Hinweis „zählt nicht“, „Beenden“ und am Ende „Als Variante
 * speichern“ oder „Verwerfen“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): Eine Probepartie „von hier“ (aus einer
 * Variante oder der Auswertung) zählt für nichts. Am Ende und beim Abbrechen bietet die App an,
 * die Züge als Abzweig an genau dieser Stelle zu speichern (training/probevariante.ts); sonst wird
 * nichts gespeichert. Beides räumt den Platz der Probepartie (speicher/partien.ts, „probe“).
 * Abhängigkeiten: probespeichern.ts, speicher, variantenwert.ts, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { mitProbe } from "../../../speicher/partien";
import { aendere } from "../../../speicher/speicher";
import type { Partie } from "../../../spiel/partie";
import { speichereProbe } from "./probespeichern";
import { merkePfad, varianteAnsicht } from "./variantenwert";

/** Der Bereich unter der Probepartie. */
export function Probeabschluss({ partie }: { partie: Partie }) {
  const { ersetze, zurueck } = useNavigation();
  const [beenden, setzeBeenden] = useState(false);
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const sichere = () => {
    const ergebnis = speichereProbe(partie);
    if (typeof ergebnis === "string") return setzeMeldung(ergebnis);
    merkePfad(ergebnis.id, ergebnis.pfad);
    ersetze(varianteAnsicht(ergebnis.id));
  };
  const verwirf = () => {
    void aendere((d) => ({ ...d, spiel: mitProbe(d.spiel, null) }));
    zurueck();
  };
  const fertig = partie.ende !== null || beenden;
  return (
    <section className="karte probeabschluss" data-testid="probeabschluss">
      <p className="hinweis">{t("varianten.probe.hinweis")}</p>
      {!fertig && (
        <button type="button" className="knopf-zweit" onClick={() => setzeBeenden(true)}>
          {t("varianten.probe.beenden")}
        </button>
      )}
      {fertig && (
        <div className="knopfreihe">
          <button type="button" className="knopf-haupt" onClick={sichere}>
            {t("varianten.alsVarianteSpeichern")}
          </button>
          <button type="button" className="knopf-zweit" onClick={verwirf}>
            {t("varianten.probe.verwerfen")}
          </button>
        </div>
      )}
      {meldung && <p className="fehlertext">{meldung}</p>}
    </section>
  );
}
