/**
 * Ergebnis einer beendeten Partie als Kopfzeile über dem Brett (Entwurf F2, Wahl des Autors
 * 31.10.2026).
 *
 * Rolle im Gesamtbild: Ersetzt die Ergebniskarte „Partieende“ unter dem Brett. Links das Porträt
 * des Bots (zu zweit oder ohne Bot das Ergebniszeichen), daneben groß „Gewonnen“, „Verloren“ oder
 * „Remis“ und darunter, wie die Partie endete und in welchem Zug; rechts nach der Auswertung die
 * Genauigkeit des Lesers. Die Knöpfe „Neue Partie“, „Noch einmal“ und „Teilen“ stehen seitdem
 * unten (Partieabschluss.tsx). Pflichtenheft 5.2 und 5.3.
 * Abhängigkeiten: spiel/partienfilter.ts, engine/gegner.ts, GegnerBild, Ergebnismarke, i18n.
 */
import { gegnername } from "../../../engine/gegner";
import { t } from "../../../i18n/sprache";
import { stellungen, type Partie } from "../../../spiel/partie";
import { ergebnisFuerLeser } from "../../../spiel/partienfilter";
import { useSpeicher } from "../../../speicher/speicher";
import { GegnerBild } from "../gegner/GegnerBild";
import { Ergebnismarke } from "./Ergebnismarke";
import { kurzergebnis } from "./partietexte";

/** Zugnummer des letzten Zuges (Vollzug), aus der Stellung davor. */
function letzteZugnummer(partie: Partie): number {
  const fens = stellungen(partie);
  return Number(fens[Math.max(0, partie.zuege.length - 1)]?.split(" ")[5] ?? "1") || 1;
}

/** Links: Porträt des Bots, sonst das große Ergebniszeichen. */
function Bild({ partie }: { partie: Partie }) {
  const eigene = useSpeicher((z) => z.daten.spiel.eigeneGegner);
  const e = partie.einstellung;
  const name = e.gegner === "engine" ? gegnername(e.bot, e.botName, eigene) : null;
  if (!name) return <Ergebnismarke partie={partie} gross />;
  return <GegnerBild bot={e.bot} eigene={eigene} name={name} />;
}

/**
 * Die Kopfzeile.
 * Eingaben: Partie (beendet), Genauigkeit des Lesers (null vor der Auswertung oder zu zweit).
 * Beispiel: Sieg gegen Derya im 29. Zug, 78 % → „Gewonnen“, „Matt! Du hast gewonnen. · im 29.
 * Zug“, rechts „78 % genau“.
 */
export function Ergebniskopf({
  partie,
  genauigkeit,
}: {
  partie: Partie;
  genauigkeit: number | null;
}) {
  const ergebnis = ergebnisFuerLeser(partie);
  const titel = ergebnis
    ? t(`auswertungneu.ergebnis.${ergebnis}`)
    : t("auswertungneu.ergebnis.ende");
  return (
    <section
      className={`ergebniskopf ergebniskopf-${ergebnis ?? "neutral"}`}
      data-testid="partieende"
      data-tour="partie-ende"
    >
      <Bild partie={partie} />
      <div className="ergebniskopf-text">
        <h2 className="ergebniskopf-titel">{titel}</h2>
        <p className="ergebniskopf-zeile">
          {kurzergebnis(partie)}
          {partie.zuege.length > 0 &&
            ` · ${t("auswertungneu.imZug", { zug: letzteZugnummer(partie) })}`}
        </p>
      </div>
      {genauigkeit !== null && (
        <p className="ergebniskopf-genau" data-testid="ergebniskopf-genauigkeit">
          <b>{t("spielstaerke.prozent", { wert: Math.round(genauigkeit) })}</b>
          <span>{t("auswertungneu.genau")}</span>
        </p>
      )}
    </section>
  );
}
