/**
 * Kopf des Lernpfads: die aktuelle Station als Balken mit den Resten (Abbildungen, Übungen,
 * Warum-Fragen, Lernziele) und rechts die Silhouette des Ordens ihres Buchteils mit den Kapiteln,
 * die dafür noch fehlen. Ob der Orden verdient ist, sagt die Etappe (Ringrechnung, nur
 * Abbildungen und Übungen), nicht die Stationen: Ein erhaltener Orden bleibt golden, auch wenn
 * noch Warum-Fragen oder Lernziele offen sind (6.11.2026).
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, Punkt P5 (Wahl des Autors, 31.10.2026). Vorher
 * standen oben zwei Sätze („Noch 43 Abbildungen und 4 Übungen bis zum Ende von Kapitel 1. Danach
 * fehlt dir nur noch Kapitel 0 bis zum Orden „Teil Grundlagen““) und unter dem Weg die Einleitung
 * („Jede Station ist ein Kapitel …“). Beide stehen jetzt vollständig im ⓘ; der Balken trägt den
 * Satz zusätzlich als Namen für Bildschirmleser. Die Reste nehmen die Texte der STATIONSTEILE
 * („{anzahl} Abbildungen“), so kommen neue Bestandteile ohne Umbau dazu.
 * Abhängigkeiten: lernpfad.ts, Fortschrittsbalken, Infoblase, Ordenkunst, lucide-react, i18n,
 * Stil in ui/stil/wenigertext-seiten.css.
 */
import { Circle, CircleHelp, LayoutGrid, ListChecks, Puzzle, type LucideIcon } from "lucide-react";
import { t, tZahl, type Textschluessel } from "../../../i18n/sprache";
import { Fortschrittsbalken } from "../bausteine/Fortschrittsbalken";
import { MitInfoblase } from "../bausteine/Infoblase";
import { Ordenkunst } from "../ordenkunst/Ordenkunst";
import { hinweistext, ordenname, type Etappe, type Station } from "./lernpfad";

/** Größe der Zeichen vor den Resten (Bildpunkte). */
const ZEICHENGROESSE = 16;

/** Zeichen je Bestandteil (Text des Rests); unbekannte Bestandteile bekommen einen Kreis. */
const RESTZEICHEN: Readonly<Partial<Record<Textschluessel, LucideIcon>>> = {
  "lernpfad.rest.abbildungen": LayoutGrid,
  "lernpfad.rest.uebungen": Puzzle,
  "lernpfad.rest.warum": CircleHelp,
  "lernpfad.rest.lernziele": ListChecks,
};

/** Die Reste der Station mit Zeichen: „▦ 43 Abbildungen · 🧩 4 Übungen“. */
function Reste({ station }: { station: Station }) {
  const offen = station.teile
    .map(({ rest, anteil }) => ({ rest, anzahl: anteil.gesamt - anteil.erreicht }))
    .filter(({ anzahl }) => anzahl > 0);
  return (
    <ul className="lernpfadkopf-reste">
      {offen.map(({ rest, anzahl }) => {
        const Zeichen = RESTZEICHEN[rest] ?? Circle;
        return (
          <li key={rest}>
            <Zeichen size={ZEICHENGROESSE} aria-hidden="true" />
            {tZahl(rest, anzahl, { anzahl })}
          </li>
        );
      })}
    </ul>
  );
}

/** Rechts: der Orden des Teils als Silhouette (golden, sobald verdient), darunter „+ Kap. 0“. */
function Teilorden(props: { liste: readonly Station[]; station: Station; verdient: boolean }) {
  const { liste, station, verdient } = props;
  const fehlend = liste.filter(
    (s) => s.teil === station.teil && !s.fertig && s.kapitel !== station.kapitel,
  );
  const orden = ordenname(station.teil);
  return (
    <span className="lernpfadkopf-orden">
      <Ordenkunst
        art="orden"
        kennung={`teil-${station.teil}`}
        silhouette={!verdient}
        beschriftung={t(verdient ? "lernpfad.ordenVerdient" : "lernpfad.ordenOffen", { orden })}
      />
      {!verdient && fehlend.length > 0 && (
        <span className="lernpfadkopf-fehlend" aria-hidden="true">
          {t("wenigertext.seiten.lernpfad.plus", {
            kapitel: fehlend.map((s) => s.kapitel).join(", "),
          })}
        </span>
      )}
    </span>
  );
}

/**
 * Der Kopf. Beispiel: Kapitel 1, nichts angesehen → „Kapitel 1“ mit ⓘ, leerer Balken,
 * „43 Abbildungen · 4 Übungen“, rechts die Silhouette „Teil Grundlagen“ mit „+ Kap. 0“.
 * Sonderfall: ohne Station (Daten fehlen) nur der Satz im ⓘ.
 */
export function Lernpfadkopf(props: {
  liste: readonly Station[];
  aktuell: number;
  etappen: readonly Etappe[];
}) {
  const { liste, aktuell, etappen } = props;
  const station = liste[aktuell];
  const verdient = etappen.some((e) => e.teil === station?.teil && e.ordenVerdient);
  const satz = hinweistext(liste, aktuell, verdient);
  return (
    <div className="karte lernpfadkopf" data-tour="lernpfad-kopf">
      <div className="lernpfadkopf-links">
        <MitInfoblase
          zeile={
            <h2 className="karte-titel">
              {station ? t("wenigertext.seiten.lernpfad.titel", { kapitel: station.kapitel }) : ""}
            </h2>
          }
          thema={t("wenigertext.seiten.lernpfad.thema")}
          erklaerung={
            <>
              <p data-testid="lernpfad-hinweis">{satz}</p>
              <p className="leise">{t("lernpfad.einleitung")}</p>
            </>
          }
        />
        {station && <Fortschrittsbalken anteil={station.anteil} beschriftung={satz} />}
        {station && <Reste station={station} />}
      </div>
      {station && <Teilorden liste={liste} station={station} verdient={verdient} />}
    </div>
  );
}
