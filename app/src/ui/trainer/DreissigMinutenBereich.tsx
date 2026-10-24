/**
 * Trainer „30-Minuten-Plan“ (Kapitel 12): geführte Einheit mit Uhr, Tag A (Partietag) und
 * Tag B (Studientag) im Wechsel.
 *
 * Rolle im Gesamtbild: Trainer „dreissigMinuten“ (Pflichtenheft 7, AP 13 Stufe 3). Ohne
 * laufende Einheit zeigt der Bereich den Plan beider Tage und schlägt den Tag vor, der dran ist.
 * Während der Einheit stehen oben Tag, Schritt und die Restzeit des Schritts; „Schritt erledigt“
 * führt weiter. Die Zeit ist ein Richtwert: Sie läuft weiter und zeigt, wie weit sie
 * überschritten ist, statt den Schritt abzubrechen. Eine abgeschlossene Einheit zählt als
 * Durchgang im Fortschritt.
 * Abhängigkeiten: training/dreissigminuten.ts, usePlanstand.ts, Planschritte.tsx,
 * speicher/fortschritt.ts, spiel/uhr.ts (nur Zeitanzeige), i18n.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { zeitAlsText } from "../../spiel/uhr";
import { notiereDurchgang } from "../../speicher/fortschritt";
import { aendere } from "../../speicher/speicher";
import {
  abbrechen,
  aktuellerSchritt,
  mitBereich,
  naechsterTag,
  PLAN,
  restMs,
  starte,
  TAGESARTEN,
  weiter,
  type Einheit,
  type Tagesart,
} from "../../training/dreissigminuten";
import { Planschritt } from "./Planschritte";
import { useJetzt, usePlanstand } from "./usePlanstand";
import { Knopfsymbol } from "../komponenten/Knopfsymbol";

/** Der Plan eines Tages als Tabelle: Zeit, Aktivität, Ziel. */
function Tagesplan({ tag }: { tag: Tagesart }) {
  return (
    <table className="fehlertabelle plantabelle">
      <caption>{t(`dreissig.tag.${tag}`)}</caption>
      <tbody>
        {PLAN[tag].map((s) => (
          <tr key={s.art}>
            <td className="zahl">{t("dreissig.minuten", { minuten: s.minuten })}</td>
            <td>
              {t(`dreissig.schritt.${s.art}`)}
              <br />
              <span className="hinweis">{t(`dreissig.ziel.${s.art}`)}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Ohne laufende Einheit: der Plan beider Tage und die beiden Startknöpfe. */
function Start({ vorschlag, starte }: { vorschlag: Tagesart; starte: (tag: Tagesart) => void }) {
  return (
    <div className="trainerrunde" data-testid="plan-start" data-tour="trainer-wahl">
      <p>{t("dreissig.heute", { tag: t(`dreissig.tag.${vorschlag}`) })}</p>
      {TAGESARTEN.map((tag) => (
        <Tagesplan key={tag} tag={tag} />
      ))}
      <p className="hinweis">{t("dreissig.langePartie")}</p>
      <p className="hinweis">{t("dreissig.weniger")}</p>
      {TAGESARTEN.map((tag) => (
        <button
          key={tag}
          type="button"
          className={tag === vorschlag ? "knopf-haupt" : "knopf-zweit"}
          onClick={() => starte(tag)}
        >
          <Knopfsymbol art="starten" />
          {t("dreissig.starten", { tag: t(`dreissig.tag.${tag}`) })}
        </button>
      ))}
    </div>
  );
}

/** Kopf der laufenden Einheit: Tag, Schritt, Restzeit. */
function Uhrzeile({ einheit }: { einheit: Einheit }) {
  const jetzt = useJetzt(true);
  const rest = restMs(einheit, jetzt);
  const schritt = aktuellerSchritt(einheit);
  return (
    <div className="karte planuhr" data-testid="plan-uhr">
      <p className="hinweis">
        {t("dreissig.stand", {
          tag: t(`dreissig.tag.${einheit.tag}`),
          nummer: einheit.schritt + 1,
          anzahl: PLAN[einheit.tag].length,
        })}
      </p>
      <h2 className="karte-titel">
        {t(`dreissig.schritt.${schritt.art}`)} (
        {t("dreissig.minuten", { minuten: schritt.minuten })})
      </h2>
      <p className={rest < 0 ? "planzeit planzeit-ueber" : "planzeit"} role="timer">
        {rest < 0
          ? t("dreissig.ueber", { zeit: zeitAlsText(-rest) })
          : t("dreissig.rest", { zeit: zeitAlsText(rest) })}
      </p>
      <p className="hinweis">{t(`dreissig.ziel.${schritt.art}`)}</p>
    </div>
  );
}

export function DreissigMinutenBereich() {
  const [stand, aenderePlan] = usePlanstand();
  const [geschafft, setzeGeschafft] = useState<Tagesart | null>(null);
  const einheit = stand.einheit;
  const vorschlag = naechsterTag(stand.letzterTag);
  const erledigt = () => {
    const ergebnis = weiter(stand, Date.now());
    aenderePlan(() => ergebnis.stand);
    if (!ergebnis.fertig || !einheit) return;
    setzeGeschafft(einheit.tag);
    const schritte = PLAN[einheit.tag].length;
    void aendere((daten) =>
      notiereDurchgang(
        daten,
        "dreissigMinuten",
        { aufgaben: schritte, richtig: schritte },
        new Date(),
      ),
    );
  };
  if (!einheit)
    return (
      <>
        {geschafft && (
          <p className="meldung" data-testid="plan-geschafft">
            {t("dreissig.geschafft", { tag: t(`dreissig.tag.${vorschlag}`) })}
          </p>
        )}
        <Start
          vorschlag={vorschlag}
          starte={(tag) => {
            setzeGeschafft(null);
            aenderePlan((alt) => starte(alt, tag, Date.now()));
          }}
        />
      </>
    );
  const letzter = einheit.schritt + 1 === PLAN[einheit.tag].length;
  return (
    <div className="trainerrunde" data-testid="plan-einheit">
      <Uhrzeile einheit={einheit} />
      <Planschritt
        key={`${einheit.tag}-${einheit.schritt}`}
        art={aktuellerSchritt(einheit).art}
        bereich={einheit.bereich}
        waehleBereich={(b) => aenderePlan((alt) => mitBereich(alt, b))}
      />
      <button type="button" className="knopf-haupt" onClick={erledigt}>
        {t(letzter ? "dreissig.abschliessen" : "dreissig.erledigt")}
      </button>
      <button type="button" className="knopf-link" onClick={() => aenderePlan(abbrechen)}>
        {t("dreissig.abbrechen")}
      </button>
    </div>
  );
}
