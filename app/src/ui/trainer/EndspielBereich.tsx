/**
 * Endspieltrainer: Gruppe und Stufe wählen, dann eine Runde aus sechs Stellungen gegen die Engine.
 *
 * Rolle im Gesamtbild: Trainer „endspiel“ (Pflichtenheft 7, Kapitel 8 und 9). Die Aufgaben lädt
 * die Datei endspiel.json (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf.
 * Gruppe und Stufe stehen als Zeilen auf der Startkarte (Entwurf G1, 31.10.2026); nicht geschaffte
 * Stellungen (Wiederholen) und die Kurzübungen ohne Engine (Drillaufgabe.tsx,
 * training/endspieldrills.ts) sind weitere Modi darunter.
 * Abhängigkeiten: training/endspieltrainer.ts, Rundenablauf, Endspielaufgabe, Startkarte, i18n.
 */
import { useState } from "react";
import { ladeEndspiele } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import {
  anzahlJeGruppe,
  endspielrunde,
  GRUPPEN,
  gruppeZumThema,
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
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Drillaufgabe } from "./Drillaufgabe";
import { Endspielaufgabe } from "./Endspielaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { useFaelligeAufgaben } from "./kartenantwort";
import { einstellung, stufenzeile, wiederholung, type Startmodus } from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkt, useGemerkteStufe } from "./startkarte/useGemerkt";
import { useTrainerthema } from "./trainerthema";

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

/** Die Startkarte: Gruppe und Stufe, darunter Kurzübungen und Wiederholen als weitere Modi. */
function Wahl({
  anzahl,
  starte,
  modi,
}: {
  anzahl: Map<Endspielgruppe, number>;
  starte: (wahl: Endspielwahl) => void;
  modi: readonly Startmodus[];
}) {
  // Mit Thema geöffnet (Meisterschaft P3, nächster Schritt P1): dessen Gruppe vorwählen.
  const vorhanden = GRUPPEN.filter((g) => (anzahl.get(g) ?? 0) > 0);
  const vorwahl = gruppeZumThema(useTrainerthema("endspiel"));
  const [gruppe, setzeGruppe] = useGemerkt("endspiel", "gruppe", vorhanden, "alle", vorwahl);
  const [stufe, setzeStufe] = useGemerkteStufe("endspiel");
  const gruppenzeile = einstellung({
    kennung: "gruppe",
    titel: t("trainerstart.zeile.gruppe"),
    symbol: "gruppe",
    optionen: vorhanden.map((g) => ({
      wert: g,
      text: t("trainerstart.eintrag", {
        name: t(`endspiel.gruppe.${g}`),
        anzahl: anzahl.get(g) ?? 0,
      }),
    })),
    wert: gruppe,
    setze: setzeGruppe,
    testkennung: "zeile-gruppe",
  });
  return (
    <Startkarte
      kennung="endspiel"
      testkennung="endspiel-wahl"
      zeilen={[gruppenzeile, stufenzeile(stufe, setzeStufe, t("endspiel.stufenText"))]}
      start={{
        zusatz: t("trainerstart.stellungen", { anzahl: AUFGABEN_JE_RUNDE }),
        starte: () => starte({ gruppe, stufe }),
      }}
      modi={modi}
      hilfen={[t("endspiel.ablaufText"), t("endspiel.kurz.text")]}
    />
  );
}

/** Der Modus „Kurzübungen“ (ohne Engine) unter dem Startknopf. */
function kurzmodus(starte: () => void): Startmodus {
  return {
    kennung: "kurz",
    titel: t("trainerstart.modus.kurz"),
    text: t("trainerstart.modus.kurzText"),
    symbol: "kurz",
    starte,
    tour: "endspiel-kurz",
    testkennung: "endspiel-kurz",
  };
}

/**
 * Der Endspieltrainer (Kapitel 8 und 9): Gruppe und Stufe wählen und Stellungen gegen die Engine
 * spielen; darunter die Kurzübungen.
 */
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
        modi={[
          kurzmodus(() => setzeKurz(true)),
          ...wiederholung(vorhanden.length, () => setzeWiederholt(vorhanden)),
        ]}
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
