/**
 * Karte mit dem Ergebnis eines Werkzeugs: Befunde, Fazit und „So prüft die App“.
 *
 * Rolle im Gesamtbild: Einschätzungskarte (Konzept 10.2), für alle Werkzeuge gleich. Befunde mit
 * Farbe tragen dieselbe Linienart wie die Pfeile am Brett, damit der Farbcode auch ohne
 * Farbsehen lesbar bleibt (Konzept 10.3).
 * Vergleiche der Faktorenbilanz zeigen zusätzlich eine Waage (Kapitel 3).
 * Der Schalter „Sicht“ oben rechts in der Kopfzeile tauscht die Seite, für die das Werkzeug rechnet
 * (Entscheidung des Autors, 15.10.2026); er sagt auch, ob diese Seite am Zug ist. Unter „So
 * prüft die App“ stehen Erklärung und Regel des Werkzeugs und der Hinweis, dass die Werkzeuge
 * irren können und das Buch maßgeblich ist (SoPrueft.tsx). Darüber steht klein die Legende der
 * Markierungen am Brett (seit 0.2.30, Wunsch des Autors). Hat das Ergebnis einen Hinweis (etwa
 * „Nur Kandidaten“ bei den Todsünden, seit 0.2.33), steht er hervorgehoben unter dem Namen.
 * Abhängigkeiten: analyse/werkzeug.ts, Waage.tsx, useSicht.ts, i18n, lucide-react.
 */
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { erklaerungVon, legendeVon } from "../../analyse/register";
import type { Befund, Werkzeugergebnis } from "../../analyse/werkzeug";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { farbkuerzel } from "../../schach/stellung";
import { SoPrueft } from "./SoPrueft";
import { stufenansicht } from "./stufen";
import type { Sicht } from "./useSicht";
import { Waage } from "./Waage";

const SYMBOLGROESSE = 16;

/** „Sicht: Weiß (am Zug)“ mit Tauschsymbol; ein Tipp rechnet für die andere Seite. */
function Sichtschalter({ sicht }: { sicht: Sicht }) {
  const farbe = t(`farbe.${farbkuerzel(sicht.farbe)}`);
  const zustand = t(sicht.amZug ? "werkzeug.sicht.amZug" : "werkzeug.sicht.nichtAmZug");
  return (
    <button
      type="button"
      className="chip sichtschalter"
      onClick={sicht.wechsle}
      aria-label={t("werkzeug.sicht.wechseln", { farbe, zustand })}
      data-testid="sichtschalter"
    >
      <ArrowLeftRight size={SYMBOLGROESSE} aria-hidden="true" />
      <span className="sicht-text">
        {t("werkzeug.sicht", { farbe })}
        <span className="sicht-zustand">{zustand}</span>
      </span>
    </button>
  );
}

/** Ein Befund: Titel in der Linienart seiner Farbe, Waage, Zeilen, Sprung ins Buch. */
function Befundblock({ befund }: { befund: Befund }) {
  const { navigiere } = useNavigation();
  return (
    <div className="befund">
      <h3 className={befund.farbe ? `befund-titel linie-${befund.farbe}` : "befund-titel"}>
        {befund.titel}
      </h3>
      {befund.waage && <Waage waage={befund.waage} />}
      <ul>
        {befund.zeilen.map((zeile) => (
          <li key={zeile}>{zeile}</li>
        ))}
      </ul>
      {befund.sprung && (
        <button
          type="button"
          className="knopf-link"
          onClick={() =>
            befund.sprung && navigiere({ bildschirm: "abbildung", nummer: befund.sprung.abbildung })
          }
        >
          {befund.sprung.text}
        </button>
      )}
    </div>
  );
}

/**
 * Die Ergebniskarte eines Werkzeugs. Gestuft (seit 0.2.30): zuerst Stufe 1, „Mehr …“ zeigt die
 * nächste; das Fazit und die Legende stehen immer da. Für ein anderes Werkzeug legt der
 * Bildschirm die Karte neu an (key), dann beginnt sie wieder bei Stufe 1.
 * Beispiel: Prüffragen an Abb. 4.2 → F1, „Mehr …“ → F1 und F2, „Mehr …“ → dazu F3.
 */
export function Werkzeugkarte({
  ergebnis,
  sicht = null,
  zusatz = null,
}: {
  ergebnis: Werkzeugergebnis;
  /** Sicht-Schalter; null bei Werkzeugen, deren Ergebnis nicht von der Seite abhängt. */
  sicht?: Sicht | null;
  /** Weiterer Inhalt nach den Befunden, etwa die Engine bei „Gegner?“ (seit 0.2.32). */
  zusatz?: React.ReactNode;
}) {
  const [stufe, setzeStufe] = useState(0);
  const ansicht = stufenansicht(ergebnis, stufe);
  const erklaerung = erklaerungVon(ergebnis.werkzeug);
  const legende = legendeVon(ergebnis.werkzeug);
  return (
    <section className="karte" aria-live="polite" data-testid="werkzeugkarte">
      {/* Der Sicht-Schalter steht oben rechts neben dem Namen (Wunsch des Autors, Nachtest
          0.2.27); reicht der Platz nicht, rutscht er in die nächste Zeile. */}
      <div className="karte-kopf werkzeugkopf">
        <h2>{ergebnis.ueberschrift}</h2>
        <div className="werkzeugkopf-rechts">{sicht && <Sichtschalter sicht={sicht} />}</div>
      </div>
      {ergebnis.hinweis && (
        <p className="werkzeug-hinweis" data-testid="werkzeug-hinweis">
          {ergebnis.hinweis}
        </p>
      )}
      {ansicht.befunde.length > 0 && (
        <div className="befunde">
          {ansicht.befunde.map((befund) => (
            <Befundblock key={befund.kennung} befund={befund} />
          ))}
        </div>
      )}
      {zusatz}
      {ansicht.naechste !== null && (
        <button
          type="button"
          className="knopf-link"
          onClick={() => setzeStufe(ansicht.naechste ?? stufe)}
        >
          {t("werkzeug.stufeMehr")}
        </button>
      )}
      <p className="fazit">{ergebnis.fazit}</p>
      {legende && (
        <p className="legende">
          <strong>{t("werkzeug.legendeTitel")}</strong> {t(legende)}
        </p>
      )}
      <SoPrueft
        beschriftung={t("werkzeug.soPrueft")}
        absaetze={[erklaerung ? t(erklaerung) : "", ergebnis.regel]}
      />
    </section>
  );
}
