/**
 * Taktiktrainer: Startkarte, dann eine Runde aus acht Aufgaben, eine Serie oder Wiederholungen.
 *
 * Rolle im Gesamtbild: Trainer „taktik“ (Pflichtenheft 7: „Aufgaben nach Motiv oder gemischt,
 * als Themenblock wie im 30-Minuten-Plan“). Die Aufgaben lädt die Datei taktik.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf. Vor dem Start zeigt die
 * Startkarte (TaktikStart.tsx, Entwurf G1 vom 31.10.2026) Quelle („Aus dem Buch“ oder zusätzlich
 * Lichess, Paket 8), Motiv und Stufe; fällige Wiederholungen beider Quellen kommen in eine Runde.
 * Gamifizierung P5: „Serie ohne Fehler“ (TaktikSerie.tsx) ist ein weiterer Modus der Startkarte.
 * Mit Thema geöffnet („taktik:fesselung“, ui/trainer/trainerthema.ts) ist das Motiv vorgewählt.
 * Abhängigkeiten: training/taktiktrainer.ts, training/zusatzaufgaben.ts, Rundenablauf,
 * Taktikaufgabe, TaktikStart, TaktikSerie, i18n.
 */
import { useState } from "react";
import { ladeZusatzaufgaben } from "../../daten/laden";
import { ladeTaktik, type Taktikaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import {
  MOTIVE,
  taktikrunde,
  type Taktikthema,
  type Taktikwahl,
} from "../../training/taktiktrainer";
import { serienaufgaben } from "../../training/taktikserie";
import { ZUFALL } from "../../training/zufall";
import { zusatzrunde, type Zusatzaufgabe, type Zusatzwahl } from "../../training/zusatzaufgaben";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Rundenablauf, type Darstellung } from "./Rundenablauf";
import { Taktikaufgabe } from "./Taktikaufgabe";
import { useFaelligeAufgaben } from "./kartenantwort";
import type { Runde } from "./useRunde";
import { TaktikSerie } from "./TaktikSerie";
import { TaktikStart } from "./TaktikStart";

const AUFGABEN_JE_RUNDE = 8;

/** Gewählt: eine Runde nach Thema und Stufe (Buch oder Zusatz), die fälligen Wiederholungen
 * oder eine Serie ohne Fehler zum Thema. */
type Rundenwahl =
  | Taktikwahl
  | { readonly zusatz: Zusatzwahl }
  | { readonly wiederholung: readonly string[] }
  | { readonly serie: Taktikthema };

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
      <TaktikStart
        aufgaben={aufgaben}
        zusatz={zusatzdaten}
        faellig={vorhanden.length}
        starte={(start) => setzeWahl("wiederholung" in start ? { wiederholung: vorhanden } : start)}
      />
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
