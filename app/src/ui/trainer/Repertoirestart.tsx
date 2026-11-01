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
 * Abhängigkeiten: training/repertoiretrainer.ts, training/praxisrepertoire.ts,
 * training/abweichungstrainer.ts (gambitsAus), Eroeffnungsstart, Startkarte, Praxiswahl, i18n.
 */
import type { Color } from "chessops/types";
import type { ReactNode } from "react";
import { ladeEroeffnungsbaender } from "../../daten/laden";
import type { Kapitel } from "../../daten/generiert/kapitel";
import { sprache, tZahl } from "../../i18n/sprache";
import { gambitsAus } from "../../training/abweichungstrainer";
import {
  praxisanzahl,
  praxislinien,
  wahlAlsText,
  wahlAusText,
  type Praxislinie,
} from "../../training/praxisrepertoire";
import { eroeffnungenAus } from "../../training/repertoiretrainer";
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
  const werte = wahlAusText(text);
  const setzeWerte = (neu: readonly string[]) => setzeText(wahlAlsText(neu));
  const linien = daten.art === "fertig" ? praxislinien(daten.wert, werte, sprache() === "de") : [];
  const anzahl = praxisanzahl(linien, seite, jeRunde);
  return (
    <Startkarte
      kennung={KENNUNG}
      testkennung={`${KENNUNG}-wahl`}
      zeilen={[vorne, seitenzeile(seite, setzeSeite)]}
      hinweis={
        <>
          {schalter}
          <Praxiskopf werte={werte} setze={setzeWerte} />
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
