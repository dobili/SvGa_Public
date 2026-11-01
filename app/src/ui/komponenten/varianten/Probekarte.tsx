/**
 * Karte „Probepartie läuft“ oben auf der Startseite von „Spielen“: eine Probepartie, die nicht
 * beendet oder abgelegt wurde, mit „Weiterspielen“ und „Beenden“.
 *
 * Rolle im Gesamtbild: Offener Punkt aus Stufe 1 der Varianten (Probepartie „von hier“, Wunsch des
 * Autors vom 1.11.2026). Eine Probepartie liegt in einem eigenen Platz des Spielstands
 * (speicher/partien.ts, „probe“) und erscheint weder in der Partienliste noch als laufende Partie.
 * Wer sie verlässt, ohne sie zu beenden, fand sie bisher nicht wieder. Diese Karte zeigt sie wie
 * die Karte „Partie läuft“ (spielstart/LaufendeKarte.tsx), mit dem Hinweis „zählt nicht“.
 * „Beenden“ fragt wie unter der Partie (Probeabschluss.tsx): als Variante speichern oder verwerfen.
 * Abhängigkeiten: probespeichern.ts (speichereProbe, probegegner), LaufendeKarte.tsx (Minibrett),
 * speicher, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { mitProbe } from "../../../speicher/partien";
import { aendere, useSpeicher } from "../../../speicher/speicher";
import { aktuelleFen, type Partie } from "../../../spiel/partie";
import { Minibrett } from "../spielstart/LaufendeKarte";
import { probegegner, speichereProbe } from "./probespeichern";
import { merkePfad, varianteAnsicht } from "./variantenwert";
import "../../stil/variantenanalyse.css";

/** „Als Variante speichern“ und „Verwerfen“, nach „Beenden“. */
function Abschluss({ partie }: { partie: Partie }) {
  const { navigiere } = useNavigation();
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const sichere = () => {
    const ergebnis = speichereProbe(partie);
    if (typeof ergebnis === "string") return setzeMeldung(ergebnis);
    merkePfad(ergebnis.id, ergebnis.pfad);
    navigiere(varianteAnsicht(ergebnis.id));
  };
  const verwirf = () => void aendere((d) => ({ ...d, spiel: mitProbe(d.spiel, null) }));
  return (
    <>
      <div className="knopfreihe">
        <button type="button" className="knopf-haupt" onClick={sichere}>
          {t("varianten.alsVarianteSpeichern")}
        </button>
        <button type="button" className="knopf-zweit" onClick={verwirf}>
          {t("varianten.probe.verwerfen")}
        </button>
      </div>
      {meldung && <p className="fehlertext">{meldung}</p>}
    </>
  );
}

/**
 * Die Karte; ohne Probepartie nichts.
 * Beispiel: Probepartie aus der Petroff-Falle gegen Lotte verlassen → „Probepartie läuft“,
 * „zählt nicht · gegen Lotte“, „Weiterspielen“ öffnet sie wieder.
 */
export function Probekarte() {
  const probe = useSpeicher((z) => z.daten.spiel.probe);
  const { navigiere } = useNavigation();
  const [beenden, setzeBeenden] = useState(false);
  if (!probe) return null;
  const fertig = probe.ende !== null;
  return (
    <section className="karte laufende-karte probekarte" data-testid="probekarte">
      <Minibrett fen={aktuelleFen(probe)} />
      <div className="laufende-text">
        <h2 className="karte-titel">
          {t(fertig ? "varianten.probe.beendet" : "varianten.probe.laeuft")}
        </h2>
        <p>{t("varianten.probe.zeile", { gegner: probegegner(probe) })}</p>
      </div>
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => navigiere({ bildschirm: "partie", id: probe.id })}
        >
          {t(fertig ? "varianten.probe.ansehen" : "varianten.probe.weiterspielen")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          aria-expanded={beenden}
          onClick={() => setzeBeenden(!beenden)}
        >
          {t("varianten.probe.kurzBeenden")}
        </button>
      </div>
      {beenden && <Abschluss partie={probe} />}
    </section>
  );
}
