/**
 * Endspieltrainer: Gruppe und Stufe wählen, dann eine Runde aus sechs Stellungen gegen die Engine.
 *
 * Rolle im Gesamtbild: Trainer „endspiel“ (Pflichtenheft 7, Kapitel 8 und 9). Die Aufgaben lädt
 * die Datei endspiel.json (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf.
 * Seit 0.2.90 kommen nicht geschaffte Stellungen in die Wiederholung (Knopf über der Wahl), und
 * unter der Wahl stehen die Kurzübungen ohne Engine (Drillaufgabe.tsx, training/endspieldrills.ts).
 * Abhängigkeiten: training/endspieltrainer.ts, Rundenablauf, Endspielaufgabe, Stufenwahl, i18n.
 */
import { useState, type ReactNode } from "react";
import { ladeEndspiele } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import {
  anzahlJeGruppe,
  endspielrunde,
  GRUPPEN,
  type Endspielgruppe,
  type Endspielwahl,
} from "../../training/endspieltrainer";
import {
  bilddrills,
  drillrunde,
  oppositionsdrill,
  quadratdrill,
  schluesseldrill,
  type Drill,
  type Drillart,
} from "../../training/endspieldrills";
import {
  bildplandrills,
  oppositionszugdrill,
  quadratzugdrill,
} from "../../training/endspielzugdrills";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/useDaten";
import { Drillaufgabe } from "./Drillaufgabe";
import { Endspielaufgabe } from "./Endspielaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Stufenwahl } from "./Stufenwahl";
import { useFaelligeAufgaben } from "./kartenantwort";
import { Wiederholungsknopf } from "./Wiederholungsknopf";
import { Knopfsymbol } from "../komponenten/Knopfsymbol";
import { Auswahlliste } from "./Auswahlliste";

/** Endspiele dauern länger als Taktikaufgaben: weniger je Runde. */
const AUFGABEN_JE_RUNDE = 6;
/** Kurzübungen gehen schnell: sieben Arten, die erste kommt zweimal. */
const DRILLS_JE_RUNDE = 8;

/** Erzeuger der Kurzübungen: zufällige Stellungen je Art, die Bild-Arten aus den Buchstellungen. */
function drillerzeuger(fens: readonly string[]): (art: Drillart) => Drill | null {
  const bilder = bilddrills(fens, ZUFALL);
  const plaene = bildplandrills(fens, ZUFALL);
  const ziehe = (vorrat: Drill[]) =>
    vorrat.splice(Math.floor(ZUFALL() * vorrat.length), 1)[0] ?? null;
  const je: Record<Drillart, () => Drill | null> = {
    quadrat: () => quadratdrill(ZUFALL),
    opposition: () => oppositionsdrill(ZUFALL),
    schluesselfelder: () => schluesseldrill(ZUFALL),
    bild: () => ziehe(bilder),
    quadratzug: () => quadratzugdrill(ZUFALL),
    oppositionszug: () => oppositionszugdrill(ZUFALL),
    bildplan: () => ziehe(plaene),
  };
  return (art) => je[art]();
}

/** Wahl von Gruppe und Stufe. */
function Wahl({
  anzahl,
  starte,
  wiederholung,
  kurz,
}: {
  anzahl: Map<Endspielgruppe, number>;
  starte: (wahl: Endspielwahl) => void;
  wiederholung: ReactNode;
  kurz: () => void;
}) {
  const [gruppe, setzeGruppe] = useState<Endspielgruppe>("alle");
  const [stufe, setzeStufe] = useState<number | null>(null);
  return (
    <div className="trainerrunde" data-testid="endspiel-wahl" data-tour="trainer-wahl">
      {wiederholung}
      <Auswahlliste
        titel={t("endspiel.gruppe")}
        eintraege={GRUPPEN.filter((g) => (anzahl.get(g) ?? 0) > 0).map((g) => ({
          wert: g,
          text: `${t(`endspiel.gruppe.${g}`)} (${anzahl.get(g)})`,
        }))}
        wert={gruppe}
        setze={setzeGruppe}
      />
      <Stufenwahl stufe={stufe} setze={setzeStufe} erklaerung={t("endspiel.stufenText")} />
      <p className="hinweis">{t("endspiel.ablaufText")}</p>
      <button type="button" className="knopf-haupt" onClick={() => starte({ gruppe, stufe })}>
        <Knopfsymbol art="starten" />
        {t("taktiktrainer.starten")}
      </button>
      <div className="trainer-kurz" data-tour="endspiel-kurz">
        <h3>{t("endspiel.kurz.titel")}</h3>
        <p className="hinweis">{t("endspiel.kurz.text")}</p>
        <button type="button" className="knopf-zweit" onClick={kurz}>
          <Knopfsymbol art="starten" />
          {t("endspiel.kurz.starten")}
        </button>
      </div>
    </div>
  );
}

export function EndspielBereich() {
  const daten = useDaten(ladeEndspiele, "trainer-endspiel");
  const [wahl, setzeWahl] = useState<Endspielwahl | null>(null);
  const faellig = useFaelligeAufgaben("endspiel");
  /** Die fälligen Stellungen, wenn der Leser „Wiederholen“ gewählt hat. */
  const [wiederholt, setzeWiederholt] = useState<readonly string[] | null>(null);
  const [kurz, setzeKurz] = useState(false);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const { aufgaben, massstab } = daten.wert;
  const vorhanden = faellig.filter((id) => aufgaben.some((a) => a.id === id));
  const zurAuswahl = () => {
    setzeWahl(null);
    setzeWiederholt(null);
    setzeKurz(false);
  };
  if (kurz)
    return (
      <Rundenablauf
        key={`kurz-${durchlauf}`}
        kennung="endspiel"
        erzeuge={() =>
          drillrunde(drillerzeuger(aufgaben.map((a) => a.fen)), DRILLS_JE_RUNDE).map((d) => (r) => (
            <Drillaufgabe drill={d} runde={r} />
          ))
        }
        nochmal={() => setzeDurchlauf(durchlauf + 1)}
        zurAuswahl={zurAuswahl}
      />
    );
  if (!wahl && !wiederholt)
    return (
      <Wahl
        anzahl={anzahlJeGruppe(aufgaben)}
        starte={setzeWahl}
        wiederholung={
          <Wiederholungsknopf anzahl={vorhanden.length} starte={() => setzeWiederholt(vorhanden)} />
        }
        kurz={() => setzeKurz(true)}
      />
    );
  const runde = () =>
    wiederholt
      ? wiederholt.slice(0, AUFGABEN_JE_RUNDE).flatMap((id) => aufgaben.filter((a) => a.id === id))
      : wahl
        ? endspielrunde(aufgaben, wahl, AUFGABEN_JE_RUNDE, ZUFALL)
        : [];
  return (
    <Rundenablauf
      key={`${wahl?.gruppe}-${wahl?.stufe}-${wiederholt?.join(",")}-${durchlauf}`}
      kennung="endspiel"
      erzeuge={() =>
        runde().map((a) => (r) => <Endspielaufgabe aufgabe={a} massstab={massstab} runde={r} />)
      }
      nochmal={() => (wiederholt ? zurAuswahl() : setzeDurchlauf(durchlauf + 1))}
      zurAuswahl={zurAuswahl}
    />
  );
}
