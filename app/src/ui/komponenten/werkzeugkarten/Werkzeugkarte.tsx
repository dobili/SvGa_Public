/**
 * Karte mit dem Ergebnis eines Werkzeugs: Befunde, Fazit und „So prüft die App“.
 *
 * Rolle im Gesamtbild: Einschätzungskarte (Konzept 10.2), für alle Werkzeuge gleich. Befunde mit
 * Farbe tragen dieselbe Linienart wie die Pfeile am Brett, damit der Farbcode auch ohne
 * Farbsehen lesbar bleibt (Konzept 10.3). Die Karte zeigt immer alle Befunde (Wunsch des
 * Autors), ohne gestuftes Aufklappen.
 * Vergleiche der Faktorenbilanz zeigen zusätzlich eine Waage (Kapitel 3).
 * Der Schalter „Sicht“ oben rechts in der Kopfzeile tauscht die Seite, für die das Werkzeug rechnet
 * (Entscheidung des Autors, 15.10.2026); er sagt auch, ob diese Seite am Zug ist. Unter „So
 * prüft die App“ stehen Erklärung und Regel des Werkzeugs und der Hinweis, dass die Werkzeuge
 * irren können und das Buch maßgeblich ist (SoPrueft.tsx). Darüber steht klein die Legende der
 * Markierungen am Brett (Wunsch des Autors); im Leerfall (U12, ohne Befunde und Markierungen)
 * fehlt sie. Die Legende nennt die Farben der gewählten Sicht („Drohungen von Schwarz“ statt „des
 * Gegners“), damit sie dem Sicht-Schalter folgt (R41, 23.10.2026). Seit der Runde „Weniger
 * Text“ (P7, 31.10.2026) ist sie eine Reihe farbiger Zeichen mit Stichwort, der Satz steht hinter
 * dem Infoknopf (ui/werkzeuge/Pfeillegende.tsx). Greift das Werkzeug nicht (Leerfall, P9), zeigt
 * die Karte statt des Fazits einen grauen Statuschip mit Kurzgrund, der ganze Satz steht hinter
 * dem Infoknopf. Hat das Ergebnis einen Hinweis (etwa „Nur Kandidaten“ bei den Todsünden), steht
 * er hervorgehoben unter dem Namen. Bei Werkzeugen mit eigener Darstellung der Befunde (die
 * Kandidaten, P10) stehen die Befunde vollständig hinter einem Infoknopf.
 * Abhängigkeiten: analyse/werkzeug.ts, Waage.tsx, useSicht.ts, ui/werkzeuge/ (Legende,
 * Statuschip), i18n, lucide-react.
 */
import { ArrowLeftRight } from "lucide-react";
import { erklaerungVon, legendeVon } from "../../../analyse/register";
import type { Befund, Werkzeugergebnis } from "../../../analyse/werkzeug";
import { useNavigation } from "../../../app/navigationsKontext";
import { farbname } from "../../../analyse/texte";
import { t } from "../../../i18n/sprache";
import { farbkuerzel, gegner } from "../../../schach/stellung";
import { SoPrueft } from "./SoPrueft";
import { MitInfo } from "../bausteine/InfoKnopf";
import { legendenreihe } from "../../werkzeuge/legenden";
import { Pfeillegende } from "../../werkzeuge/Pfeillegende";
import { Statuschip } from "../../werkzeuge/Statuschip";
import { befundeHinterInfo } from "../../werkzeuge/darstellung";
import type { Sicht } from "../werkzeugwahl/useSicht";
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

/** Die Legende: Reihe mit Infoknopf, ohne Eintrag in legenden.ts der Satz wie bisher. */
function Legende({ werkzeug, farben }: { werkzeug: string; farben: Record<string, string> }) {
  const schluessel = legendeVon(werkzeug);
  if (!schluessel) return null;
  const reihe = legendenreihe(werkzeug);
  if (reihe) return <Pfeillegende eintraege={reihe} satz={t(schluessel, farben)} werte={farben} />;
  return (
    <p className="legende">
      <strong>{t("werkzeug.legendeTitel")}</strong> {t(schluessel, farben)}
    </p>
  );
}

/** Die Befunde, untereinander oder (bei eigener Darstellung, P10) hinter einem Infoknopf. */
function Befunde({ ergebnis }: { ergebnis: Werkzeugergebnis }) {
  if (ergebnis.befunde.length === 0) return null;
  const liste = (
    <div className="befunde">
      {ergebnis.befunde.map((befund) => (
        <Befundblock key={befund.kennung} befund={befund} />
      ))}
    </div>
  );
  if (!befundeHinterInfo(ergebnis.werkzeug)) return liste;
  return (
    <MitInfo
      thema={ergebnis.ueberschrift}
      zeile={<p className="hinweis">{t("wenigertext.werkzeug.befundeAusfuehrlich")}</p>}
      erklaerung={liste}
    />
  );
}

/**
 * Die Ergebniskarte eines Werkzeugs: alle Befunde, Fazit, Legende und „So prüft die App“.
 * Beispiel: Prüffragen an Abb. 4.2 → F1, F2 und F3 untereinander.
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
  const erklaerung = erklaerungVon(ergebnis.werkzeug);
  // Ohne Sicht (Werkzeug direkt gerechnet) gilt Weiß; in der App setzt `wende` die Seite immer.
  const seite = ergebnis.seite ?? "white";
  const farben = { eigen: farbname(seite), gegner: farbname(gegner(seite)) };
  const mitMarken = ergebnis.befunde.length > 0 || ergebnis.markierungen.length > 0;
  return (
    <section
      className="karte"
      aria-live="polite"
      data-testid="werkzeugkarte"
      data-tour="werkzeugkarte"
    >
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
      {zusatz && befundeHinterInfo(ergebnis.werkzeug) && zusatz}
      <Befunde ergebnis={ergebnis} />
      {zusatz && !befundeHinterInfo(ergebnis.werkzeug) && zusatz}
      {ergebnis.status ? (
        <Statuschip kurz={ergebnis.status} satz={ergebnis.fazit} />
      ) : (
        <p className="fazit">{ergebnis.fazit}</p>
      )}
      {mitMarken && <Legende werkzeug={ergebnis.werkzeug} farben={farben} />}
      <SoPrueft
        beschriftung={t("werkzeug.soPrueft")}
        absaetze={[erklaerung ? t(erklaerung) : "", ergebnis.regel]}
      />
    </section>
  );
}
