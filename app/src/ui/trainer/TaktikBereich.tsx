/**
 * Taktiktrainer: Thema und Stufe wählen, dann eine Runde aus acht Aufgaben.
 *
 * Rolle im Gesamtbild: Trainer „taktik“ (Pflichtenheft 7: „Aufgaben nach Motiv oder gemischt,
 * als Themenblock wie im 30-Minuten-Plan“). Die Aufgaben lädt die Datei taktik.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf. Seit Paket 8 wählt der
 * Leser oben die Quelle: „Aus dem Buch“ (wie bisher) oder „Zusatzaufgaben (Lichess)“ aus
 * zusatzaufgaben.json (ZusatzWahl.tsx). Fällige Wiederholungen beider Quellen kommen in eine Runde.
 * Abhängigkeiten: training/taktiktrainer.ts, training/zusatzaufgaben.ts, Rundenablauf,
 * Taktikaufgabe, ZusatzWahl, i18n.
 */
import { useState } from "react";
import { ladeZusatzaufgaben } from "../../daten/laden";
import { ladeTaktik, type Taktikaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import {
  anzahlJeThema,
  MOTIVE,
  taktikrunde,
  type Taktikthema,
  type Taktikwahl,
} from "../../training/taktiktrainer";
import { ZUFALL } from "../../training/zufall";
import { zusatzrunde, type Zusatzaufgabe, type Zusatzwahl } from "../../training/zusatzaufgaben";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Rundenablauf, type Darstellung } from "./Rundenablauf";
import { Stufenwahl } from "./Stufenwahl";
import { Taktikaufgabe } from "./Taktikaufgabe";
import { useFaelligeAufgaben } from "./kartenantwort";
import { Wiederholungsknopf } from "./Wiederholungsknopf";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { Auswahlliste } from "./Auswahlliste";
import type { Runde } from "./useRunde";
import { Quellenwahl, ZusatzWahl, type Taktikquelle } from "./ZusatzWahl";

const AUFGABEN_JE_RUNDE = 8;
const THEMEN: readonly Taktikthema[] = ["gemischt", "mattbilder", ...MOTIVE];

function themenname(thema: Taktikthema): string {
  if (thema === "gemischt") return t("taktiktrainer.gemischt");
  if (thema === "mattbilder") return t("taktiktrainer.mattbilder");
  return t(`taktiktrainer.motiv.${thema}`);
}

/** Wahl von Thema und Stufe der Buchaufgaben. */
function BuchWahl({
  anzahl,
  starte,
}: {
  anzahl: Map<Taktikthema, number>;
  starte: (wahl: Taktikwahl) => void;
}) {
  const [thema, setzeThema] = useState<Taktikthema>("gemischt");
  const [stufe, setzeStufe] = useState<number | null>(null);
  return (
    <>
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
    </>
  );
}

/** Gewählt: eine Runde nach Thema und Stufe (Buch oder Zusatz) oder die fälligen Wiederholungen. */
type Rundenwahl =
  Taktikwahl | { readonly zusatz: Zusatzwahl } | { readonly wiederholung: readonly string[] };

/** Eine Zusatzaufgabe in der Runde, mit vorgespieltem Gegnerzug. */
function zusatzaufgabe(z: Zusatzaufgabe, r: Runde, motivAbfragen: boolean) {
  const zusatz = { themenname: t(`zusatzaufgaben.thema.${z.thema}`), vorher: z.vorher };
  return (
    <Taktikaufgabe aufgabe={z.aufgabe} runde={r} motivAbfragen={motivAbfragen} zusatz={zusatz} />
  );
}

/** Die Aufgaben einer Runde als Bausteine für den Rundenablauf. */
function rundenaufgaben(
  wahl: Rundenwahl,
  aufgaben: readonly Aufgabe[],
  zusaetze: readonly Zusatzaufgabe[],
): Darstellung[] {
  if ("wiederholung" in wahl)
    return wahl.wiederholung
      .slice(0, AUFGABEN_JE_RUNDE)
      .flatMap((id) => [
        ...aufgaben
          .filter((a) => a.id === id)
          .map((a) => (r: Runde) => <Taktikaufgabe aufgabe={a} runde={r} />),
        ...zusaetze
          .filter((z) => z.aufgabe.id === id)
          .map((z) => (r: Runde) => zusatzaufgabe(z, r, true)),
      ]);
  if ("zusatz" in wahl)
    return zusatzrunde(zusaetze, wahl.zusatz, AUFGABEN_JE_RUNDE, ZUFALL).map(
      (z) => (r: Runde) => zusatzaufgabe(z, r, wahl.zusatz.thema === "gemischt"),
    );
  // Bei einem einzelnen Motiv steht die Antwort auf „Welches Motiv?“ schon fest (R30).
  const einMotiv = (MOTIVE as readonly string[]).includes(wahl.thema);
  return taktikrunde(aufgaben, wahl, AUFGABEN_JE_RUNDE, ZUFALL).map((a) => (r: Runde) => (
    <Taktikaufgabe aufgabe={a} runde={r} motivAbfragen={!einMotiv} />
  ));
}

/** Der Taktiktrainer: Quelle, Thema und Stufe wählen, dann eine Runde aus acht Aufgaben. */
export function TaktikBereich() {
  const daten = useDaten(ladeTaktik, "trainer-taktik");
  const zusatzdaten = useDaten(ladeZusatzaufgaben, "zusatzaufgaben");
  const faellig = useFaelligeAufgaben("taktik");
  const [quelle, setzeQuelle] = useState<Taktikquelle>("buch");
  const [wahl, setzeWahl] = useState<Rundenwahl | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const aufgaben = daten.wert.aufgaben;
  const zusaetze = zusatzdaten.art === "fertig" ? zusatzdaten.wert : [];
  const bekannt = new Set([...aufgaben.map((a) => a.id), ...zusaetze.map((z) => z.aufgabe.id)]);
  const vorhanden = faellig.filter((id) => bekannt.has(id));
  if (!wahl)
    return (
      <div className="trainerrunde trainerwahl" data-testid="taktik-wahl" data-tour="trainer-wahl">
        <Wiederholungsknopf
          anzahl={vorhanden.length}
          starte={() => setzeWahl({ wiederholung: vorhanden })}
        />
        <Quellenwahl quelle={quelle} setze={setzeQuelle} />
        {quelle === "buch" ? (
          <BuchWahl anzahl={anzahlJeThema(aufgaben)} starte={setzeWahl} />
        ) : (
          <ZusatzWahl zustand={zusatzdaten} starte={(zusatz) => setzeWahl({ zusatz })} />
        )}
      </div>
    );
  return (
    <Rundenablauf
      key={`${JSON.stringify(wahl)}-${durchlauf}`}
      kennung="taktik"
      erzeuge={() => rundenaufgaben(wahl, aufgaben, zusaetze)}
      nochmal={() => ("wiederholung" in wahl ? setzeWahl(null) : setzeDurchlauf(durchlauf + 1))}
      zurAuswahl={() => setzeWahl(null)}
    />
  );
}
