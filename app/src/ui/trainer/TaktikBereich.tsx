/**
 * Taktiktrainer: Thema und Stufe wählen, dann eine Runde aus acht Aufgaben.
 *
 * Rolle im Gesamtbild: Trainer „taktik“ (Pflichtenheft 7: „Aufgaben nach Motiv oder gemischt,
 * als Themenblock wie im 30-Minuten-Plan“). Die Aufgaben lädt die Datei taktik.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf.
 * Abhängigkeiten: training/taktiktrainer.ts, Rundenablauf, Taktikaufgabe, i18n.
 */
import { useState } from "react";
import { ladeTaktik } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import {
  anzahlJeThema,
  MOTIVE,
  taktikrunde,
  type Taktikthema,
  type Taktikwahl,
} from "../../training/taktiktrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/useDaten";
import { Rundenablauf } from "./Rundenablauf";
import { Stufenwahl } from "./Stufenwahl";
import { Taktikaufgabe } from "./Taktikaufgabe";
import { useFaelligeAufgaben } from "./kartenantwort";
import { Wiederholungsknopf } from "./Wiederholungsknopf";
import { Knopfsymbol } from "../komponenten/Knopfsymbol";
import { Auswahlliste } from "./Auswahlliste";

const AUFGABEN_JE_RUNDE = 8;
const THEMEN: readonly Taktikthema[] = ["gemischt", "mattbilder", ...MOTIVE];

function themenname(thema: Taktikthema): string {
  if (thema === "gemischt") return t("taktiktrainer.gemischt");
  if (thema === "mattbilder") return t("taktiktrainer.mattbilder");
  return t(`taktiktrainer.motiv.${thema}`);
}

/** Wahl von Thema und Stufe. */
function Wahl({
  anzahl,
  starte,
  faellig,
  wiederhole,
}: {
  anzahl: Map<Taktikthema, number>;
  starte: (wahl: Taktikwahl) => void;
  faellig: number;
  wiederhole: () => void;
}) {
  const [thema, setzeThema] = useState<Taktikthema>("gemischt");
  const [stufe, setzeStufe] = useState<number | null>(null);
  return (
    <div className="trainerrunde" data-testid="taktik-wahl">
      <Wiederholungsknopf anzahl={faellig} starte={wiederhole} />
      <Auswahlliste
        titel={t("taktiktrainer.thema")}
        eintraege={THEMEN.filter((th) => (anzahl.get(th) ?? 0) > 0).map((th) => ({
          wert: th,
          text: `${themenname(th)} (${anzahl.get(th)})`,
        }))}
        wert={thema}
        setze={setzeThema}
      />
      <Stufenwahl stufe={stufe} setze={setzeStufe} />
      <button type="button" className="knopf-haupt" onClick={() => starte({ thema, stufe })}>
        <Knopfsymbol art="starten" />
        {t("taktiktrainer.starten")}
      </button>
    </div>
  );
}

/** Gewählt: eine Runde nach Thema und Stufe oder die fälligen Wiederholungen. */
type Rundenwahl = Taktikwahl | { readonly wiederholung: readonly string[] };

export function TaktikBereich() {
  const daten = useDaten(ladeTaktik, "trainer-taktik");
  const faellig = useFaelligeAufgaben("taktik");
  const [wahl, setzeWahl] = useState<Rundenwahl | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const aufgaben = daten.wert.aufgaben;
  const vorhanden = faellig.filter((id) => aufgaben.some((a) => a.id === id));
  if (!wahl)
    return (
      <Wahl
        anzahl={anzahlJeThema(aufgaben)}
        starte={setzeWahl}
        faellig={vorhanden.length}
        wiederhole={() => setzeWahl({ wiederholung: vorhanden })}
      />
    );
  const runde = () =>
    "wiederholung" in wahl
      ? wahl.wiederholung
          .slice(0, AUFGABEN_JE_RUNDE)
          .flatMap((id) => aufgaben.filter((a) => a.id === id))
      : taktikrunde(aufgaben, wahl, AUFGABEN_JE_RUNDE, ZUFALL);
  return (
    <Rundenablauf
      key={`${JSON.stringify(wahl)}-${durchlauf}`}
      kennung="taktik"
      erzeuge={() => runde().map((a) => (r) => <Taktikaufgabe aufgabe={a} runde={r} />)}
      nochmal={() => ("wiederholung" in wahl ? setzeWahl(null) : setzeDurchlauf(durchlauf + 1))}
      zurAuswahl={() => setzeWahl(null)}
    />
  );
}
