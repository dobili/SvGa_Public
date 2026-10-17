/**
 * Endspieltrainer: Gruppe und Stufe wählen, dann eine Runde aus sechs Stellungen gegen die Engine.
 *
 * Rolle im Gesamtbild: Trainer „endspiel“ (Pflichtenheft 7, Kapitel 8 und 9). Die Aufgaben lädt
 * die Datei endspiel.json (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf.
 * Abhängigkeiten: training/endspieltrainer.ts, Rundenablauf, Endspielaufgabe, Stufenwahl, i18n.
 */
import { useState } from "react";
import { ladeEndspiele } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import {
  anzahlJeGruppe,
  endspielrunde,
  GRUPPEN,
  type Endspielgruppe,
  type Endspielwahl,
} from "../../training/endspieltrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/useDaten";
import { Endspielaufgabe } from "./Endspielaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Stufenwahl } from "./Stufenwahl";

/** Endspiele dauern länger als Taktikaufgaben: weniger je Runde. */
const AUFGABEN_JE_RUNDE = 6;

/** Wahl von Gruppe und Stufe. */
function Wahl({
  anzahl,
  starte,
}: {
  anzahl: Map<Endspielgruppe, number>;
  starte: (wahl: Endspielwahl) => void;
}) {
  const [gruppe, setzeGruppe] = useState<Endspielgruppe>("alle");
  const [stufe, setzeStufe] = useState<number | null>(null);
  return (
    <div className="trainerrunde" data-testid="endspiel-wahl">
      <fieldset className="zahlwahl">
        <legend>{t("endspiel.gruppe")}</legend>
        {GRUPPEN.filter((g) => (anzahl.get(g) ?? 0) > 0).map((g) => (
          <button
            key={g}
            type="button"
            className="chip"
            aria-pressed={gruppe === g}
            onClick={() => setzeGruppe(g)}
          >
            {t(`endspiel.gruppe.${g}`)} ({anzahl.get(g)})
          </button>
        ))}
      </fieldset>
      <Stufenwahl stufe={stufe} setze={setzeStufe} erklaerung={t("endspiel.stufenText")} />
      <p className="hinweis">{t("endspiel.ablaufText")}</p>
      <button type="button" className="knopf-haupt" onClick={() => starte({ gruppe, stufe })}>
        {t("taktiktrainer.starten")}
      </button>
    </div>
  );
}

export function EndspielBereich() {
  const daten = useDaten(ladeEndspiele, "trainer-endspiel");
  const [wahl, setzeWahl] = useState<Endspielwahl | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const { aufgaben, massstab } = daten.wert;
  if (!wahl) return <Wahl anzahl={anzahlJeGruppe(aufgaben)} starte={setzeWahl} />;
  return (
    <Rundenablauf
      key={`${wahl.gruppe}-${wahl.stufe}-${durchlauf}`}
      kennung="endspiel"
      erzeuge={() =>
        endspielrunde(aufgaben, wahl, AUFGABEN_JE_RUNDE, ZUFALL).map((a) => (r) => (
          <Endspielaufgabe aufgabe={a} massstab={massstab} runde={r} />
        ))
      }
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzeWahl(null)}
    />
  );
}
