/**
 * Taktiktrainer: Thema und Stufe wählen, dann eine Runde aus acht Aufgaben.
 *
 * Rolle im Gesamtbild: Trainer „taktik“ (Pflichtenheft 7: „Aufgaben nach Motiv oder gemischt,
 * als Themenblock wie im 30-Minuten-Plan“). Die Aufgaben lädt die Datei taktik.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf. Seit Paket 8 wählt der
 * Leser oben die Quelle: „Aus dem Buch“ (wie bisher) oder „Zusatzaufgaben (Lichess)“ aus
 * zusatzaufgaben.json (ZusatzWahl.tsx). Fällige Wiederholungen beider Quellen kommen in eine Runde.
 * Gamifizierung P5: Neben der Runde startet die Buchwahl die „Serie ohne Fehler“ (TaktikSerie.tsx);
 * die Startknöpfe stehen als Liste STARTARTEN, ein späterer Modus ergänzt eine Zeile. Mit Thema
 * geöffnet („taktik:fesselung“, ui/trainer/trainerthema.ts, etwa aus „Dein nächster Schritt“),
 * ist das Motiv gleich vorgewählt.
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
  TAKTIKTHEMEN,
  taktikrunde,
  vorgewaehltesThema,
  type Taktikthema,
  type Taktikwahl,
} from "../../training/taktiktrainer";
import { serienaufgaben } from "../../training/taktikserie";
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
import { TaktikSerie } from "./TaktikSerie";
import { useTrainerthema } from "./trainerthema";

const AUFGABEN_JE_RUNDE = 8;

function themenname(thema: Taktikthema): string {
  if (thema === "gemischt") return t("taktiktrainer.gemischt");
  if (thema === "mattbilder") return t("taktiktrainer.mattbilder");
  return t(`taktiktrainer.motiv.${thema}`);
}

/** Gewählt: eine Runde nach Thema und Stufe (Buch oder Zusatz), die fälligen Wiederholungen
 * oder eine Serie ohne Fehler zum Thema. */
type Rundenwahl =
  | Taktikwahl
  | { readonly zusatz: Zusatzwahl }
  | { readonly wiederholung: readonly string[] }
  | { readonly serie: Taktikthema };

/** Ein Startknopf der Buchwahl: Text, Stil, Prüfkennung und was er aus Thema und Stufe startet. */
interface Startart {
  readonly kennung: string;
  readonly text: "taktiktrainer.starten" | "serie.starten";
  readonly haupt: boolean;
  readonly wahl: (thema: Taktikthema, stufe: number | null) => Rundenwahl;
}

/** Die Startknöpfe der Buchwahl; ein neuer Modus ergänzt eine Zeile (Wunsch des Autors). */
const STARTARTEN: readonly Startart[] = [
  {
    kennung: "runde",
    text: "taktiktrainer.starten",
    haupt: true,
    wahl: (thema, stufe) => ({ thema, stufe }),
  },
  { kennung: "serie", text: "serie.starten", haupt: false, wahl: (thema) => ({ serie: thema }) },
];

/** Wahl von Thema und Stufe der Buchaufgaben, darunter die Startknöpfe (Runde, Serie). */
function BuchWahl({
  anzahl,
  starte,
}: {
  anzahl: Map<Taktikthema, number>;
  starte: (wahl: Rundenwahl) => void;
}) {
  const vorwahl = vorgewaehltesThema(useTrainerthema("taktik"), anzahl);
  const [thema, setzeThema] = useState<Taktikthema>(vorwahl);
  const [stufe, setzeStufe] = useState<number | null>(null);
  return (
    <>
      <Auswahlliste
        titel={t("taktiktrainer.thema")}
        eintraege={TAKTIKTHEMEN.filter((th) => (anzahl.get(th) ?? 0) > 0).map((th) => ({
          wert: th,
          text: `${themenname(th)} (${anzahl.get(th)})`,
        }))}
        wert={thema}
        setze={setzeThema}
      />
      <Stufenwahl stufe={stufe} setze={setzeStufe} />
      {STARTARTEN.map((art) => (
        <button
          key={art.kennung}
          type="button"
          className={art.haupt ? "knopf-haupt" : "knopf-zweit"}
          data-testid={`taktik-start-${art.kennung}`}
          onClick={() => starte(art.wahl(thema, stufe))}
        >
          <Knopfsymbol art="starten" />
          {t(art.text)}
        </button>
      ))}
      <p className="hinweis">{t("serie.erklaerung")}</p>
    </>
  );
}

/** Eine Zusatzaufgabe in der Runde, mit vorgespieltem Gegnerzug. */
function zusatzaufgabe(z: Zusatzaufgabe, r: Runde, motivAbfragen: boolean) {
  const zusatz = { themenname: t(`zusatzaufgaben.thema.${z.thema}`), vorher: z.vorher };
  return (
    <Taktikaufgabe aufgabe={z.aufgabe} runde={r} motivAbfragen={motivAbfragen} zusatz={zusatz} />
  );
}

/** Die Aufgaben einer Runde als Bausteine für den Rundenablauf. */
function rundenaufgaben(
  wahl: Exclude<Rundenwahl, { readonly serie: Taktikthema }>,
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
  if ("serie" in wahl) {
    const thema = wahl.serie;
    return (
      <TaktikSerie
        erzeuge={() => serienaufgaben(aufgaben, thema, ZUFALL)}
        zurAuswahl={() => setzeWahl(null)}
      />
    );
  }
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
