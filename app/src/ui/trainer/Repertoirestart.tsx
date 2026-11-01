/**
 * Startkarte des Repertoire-Trainers: Quelle (Eröffnungen aus Kapitel 2, Gambits aus Kapitel 3,
 * auf Wunsch die Praxis nach Lichess), Eröffnung oder Varianten, Seite.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (1.11.2026): „Dieselbe Funktion des Repertoire-Trainers
 * auch für Gambits“ und optional die Eröffnungen nach Spielstärke, die die App für die Bots hat.
 * Die Zeile „Aus“ ist dieselbe wie im Abweichungsmodus (eroeffnungsquelle.ts); für die Bücher
 * zeichnet Eroeffnungsstart.tsx die Karte, für die Praxis diese Datei mit der Auswahl aus
 * Praxiswahl.tsx. Gemerkt wird alles im Gerätemerker des Trainers („quelle“, „eroeffnung“,
 * „gambit“, „praxis“, „praxiswahl“, „seite“); das Speicherformat bleibt unverändert.
 * Die Varianten aus der Praxis gehen nach dem Namen mit den häufigsten Folgezügen im Band des
 * Lesers weiter (Wunsch des Autors zu N2538, training/praxisfortsetzung.ts); das Band kommt aus
 * seiner Wertung (training/rivalen.ts, eigeneWertung), ohne Wertung 1200.
 * Abhängigkeiten: training/repertoiretrainer.ts, training/praxisrepertoire.ts,
 * training/praxisfortsetzung.ts, training/abweichungstrainer.ts (gambitsAus), Eroeffnungsstart,
 * Startkarte, Praxiswahl, speicher.ts, i18n.
 */
import type { Color } from "chessops/types";
import { useMemo, type ReactNode } from "react";
import { ladeEroeffnungsbaender, ladePraxisfortsetzungen } from "../../daten/laden";
import type { Kapitel } from "../../daten/generiert/kapitel";
import { sprache, tZahl } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";
import { gambitsAus } from "../../training/abweichungstrainer";
import {
  bandindexFuer,
  WERTUNG_OHNE_PARTIEN,
  type Praxisfortsetzungen,
} from "../../training/praxisfortsetzung";
import {
  praxisanzahl,
  praxislinien,
  wahlAlsText,
  wahlAusText,
  type Praxislinie,
  type Verlaengerung,
} from "../../training/praxisrepertoire";
import { eroeffnungenAus } from "../../training/repertoiretrainer";
import { eigeneWertung } from "../../training/rivalen";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Eroeffnungsstart, type Eroeffnungswahl } from "./Eroeffnungsstart";
import {
  ALLE_QUELLEN,
  BUCHQUELLEN,
  quellenzeile,
  type Eroeffnungsquelle,
} from "./eroeffnungsquelle";
import { Praxiskopf, Praxisliste, Praxisschalter } from "./Praxiswahl";
import { seitenzeile, SEITEN, type Einstellung } from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkt, useGemerkterText } from "./startkarte/useGemerkt";

/** Gewählt: eine Eröffnung des Buches oder Varianten aus der Praxis, dazu die Seite. */
export type Repertoirewahl =
  | ({ readonly art: "buch" } & Eroeffnungswahl)
  | { readonly art: "praxis"; readonly linien: readonly Praxislinie[]; readonly seite: Color };

const KENNUNG = "repertoire";
const SCHALTER = ["aus", "an"] as const;

/** Der Zusatz des Startknopfs: „6 Varianten“, „1 Variante“, „keine Variante“. */
function variantenzahl(anzahl: number): string {
  return tZahl("trainerstart.varianten", anzahl, { anzahl });
}

/** Die Verlängerung im Band des Lesers, null, solange die Fortsetzungen laden (oder fehlen). */
function useVerlaengerung(): { verlaengerung: Verlaengerung | null; eigene: boolean } {
  const fortsetzungen = useDaten(ladePraxisfortsetzungen, "praxisfortsetzungen");
  const wertung = useSpeicher((z) => eigeneWertung(z.daten)?.wert ?? null);
  const daten: Praxisfortsetzungen | null =
    fortsetzungen.art === "fertig" ? fortsetzungen.wert : null;
  const verlaengerung = useMemo(
    () => (daten ? { daten, band: bandindexFuer(daten, wertung ?? WERTUNG_OHNE_PARTIEN) } : null),
    [daten, wertung],
  );
  return { verlaengerung, eigene: wertung !== null };
}

/** Die Karte für die Praxis: Zeilen „Aus“ und Seite, Auswahl der Varianten, Startknopf. */
function Praxisstart({
  vorne,
  schalter,
  jeRunde,
  starte,
}: {
  vorne: Einstellung;
  schalter: ReactNode;
  jeRunde: number;
  starte: (wahl: Repertoirewahl) => void;
}) {
  const daten = useDaten(ladeEroeffnungsbaender, "eroeffnungsbaender");
  const [text, setzeText] = useGemerkterText(KENNUNG, "praxiswahl");
  const [seite, setzeSeite] = useGemerkt<Color>(KENNUNG, "seite", SEITEN, "white");
  const { verlaengerung, eigene } = useVerlaengerung();
  const werte = wahlAusText(text);
  const setzeWerte = (neu: readonly string[]) => setzeText(wahlAlsText(neu));
  const baender = daten.art === "fertig" ? daten.wert : null;
  // Warum gemerkt: Mit „Alle Varianten“ sind es viele Linien, jede wird Zug für Zug geprüft.
  const linien = useMemo(
    () =>
      baender ? praxislinien(baender, wahlAusText(text), sprache() === "de", verlaengerung) : [],
    [baender, text, verlaengerung],
  );
  const anzahl = praxisanzahl(linien, seite, jeRunde);
  return (
    <Startkarte
      kennung={KENNUNG}
      testkennung={`${KENNUNG}-wahl`}
      zeilen={[vorne, seitenzeile(seite, setzeSeite)]}
      hinweis={
        <>
          {schalter}
          <Praxiskopf
            werte={werte}
            setze={setzeWerte}
            band={verlaengerung ? (verlaengerung.daten.baender[verlaengerung.band] ?? null) : null}
            eigene={eigene}
          />
        </>
      }
      nachStart={<Praxisliste werte={werte} setze={setzeWerte} />}
      start={{
        zusatz: variantenzahl(anzahl),
        gesperrt: anzahl === 0,
        starte: () => starte({ art: "praxis", linien, seite }),
      }}
    />
  );
}

/**
 * Die Startkarte des Repertoire-Trainers.
 *
 * Eingaben: Kapitel 2, Kapitel 3 (null, solange es lädt), Varianten je Runde, Rückruf beim Start.
 * Beispiel: „Aus: Gambits (Kapitel 3) · Eröffnung: Königsgambit · Du spielst: Weiß“.
 * Sonderfall: Ohne den Schalter „Praxis“ gilt eine gemerkte Quelle „praxis“ als Kapitel 2.
 */
export function Repertoirestart({
  kapitel2,
  kapitel3,
  jeRunde,
  starte,
}: {
  kapitel2: Kapitel;
  kapitel3: Kapitel | null;
  jeRunde: number;
  starte: (wahl: Repertoirewahl) => void;
}) {
  const [praxis, setzePraxis] = useGemerkt(KENNUNG, "praxis", SCHALTER, "aus");
  const quellen = praxis === "an" ? ALLE_QUELLEN : BUCHQUELLEN;
  const [quelle, setzeQuelle] = useGemerkt<Eroeffnungsquelle>(
    KENNUNG,
    "quelle",
    quellen,
    "kapitel2",
  );
  const schalte = (an: boolean) => {
    setzePraxis(an ? "an" : "aus");
    if (an) setzeQuelle("praxis");
    else if (quelle === "praxis") setzeQuelle("kapitel2");
  };
  const zeile = quellenzeile(quellen, quelle, setzeQuelle, "repertoire-quelle");
  const schalter = <Praxisschalter an={praxis === "an"} setze={schalte} />;
  if (quelle === "praxis")
    return <Praxisstart vorne={zeile} schalter={schalter} jeRunde={jeRunde} starte={starte} />;
  const gambits = quelle === "kapitel3";
  return (
    <Eroeffnungsstart
      key={quelle}
      kennung={KENNUNG}
      eroeffnungen={
        gambits ? (kapitel3 ? gambitsAus(kapitel3, kapitel2) : []) : eroeffnungenAus(kapitel2)
      }
      vorne={[zeile]}
      feld={gambits ? "gambit" : "eroeffnung"}
      hinweis={schalter}
      zusatz={variantenzahl(jeRunde)}
      starte={(wahl) => starte({ art: "buch", ...wahl })}
    />
  );
}
