/**
 * Repertoire-Trainer: Quelle, Eröffnung und Seite auf der Startkarte wählen (Repertoirestart.tsx),
 * dann ihre Varianten Zug für Zug ziehen.
 *
 * Rolle im Gesamtbild: Trainer „repertoire“ (Pflichtenheft 7: „Du wählst dein Starterpaket.
 * Die Hauptvarianten werden Zug für Zug abgefragt.“). Die Zugfolgen laden die Kapitel 2
 * (Eröffnungen) und 3 (Gambits, Wunsch des Autors vom 1.11.2026) über daten/laden.ts; auf Wunsch
 * kommen Varianten aus der Praxis dazu (Lichess, nicht aus dem Buch, training/praxisrepertoire.ts).
 * Die Runde läuft im gemeinsamen Rundenablauf. Warum-Fragen stellt der Trainer nicht mehr (Wunsch
 * des Autors, 30.10.2026; früher W10); sie bleiben an den Abbildungen.
 * Abhängigkeiten: training/repertoiretrainer.ts, training/praxisrepertoire.ts, Rundenablauf,
 * Repertoireaufgabe, Repertoirestart, i18n.
 */
import { useState } from "react";
import { ladeKapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { praxisrunde } from "../../training/praxisrepertoire";
import {
  repertoirerunde,
  type Repertoireaufgabe as Aufgabe,
} from "../../training/repertoiretrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Repertoireaufgabe } from "./Repertoireaufgabe";
import { Repertoirestart, type Repertoirewahl } from "./Repertoirestart";
import { Rundenablauf } from "./Rundenablauf";

const KAPITEL_EROEFFNUNGEN = 2;
const KAPITEL_GAMBITS = 3;
const VARIANTEN_JE_RUNDE = 6;

/** Die Aufgaben der Runde zur Wahl: Varianten des Buches oder gemischte aus der Praxis. */
function aufgabenZu(wahl: Repertoirewahl): Aufgabe[] {
  return wahl.art === "buch"
    ? repertoirerunde(wahl.eroeffnung, wahl.seite, VARIANTEN_JE_RUNDE)
    : praxisrunde(wahl.linien, wahl.seite, VARIANTEN_JE_RUNDE, ZUFALL);
}

/** Schlüssel einer Runde: neue Wahl oder „Nochmal“ beginnt sie neu. */
function rundenschluessel(wahl: Repertoirewahl, durchlauf: number): string {
  const was = wahl.art === "buch" ? wahl.eroeffnung.id : wahl.linien.map((l) => l.wert).join("|");
  return `${wahl.art}-${was}-${wahl.seite}-${durchlauf}`;
}

/**
 * Der Repertoire-Trainer (Kapitel 2 und 3, auf Wunsch die Praxis): Quelle, Eröffnung und Seite
 * wählen, dann die Varianten Zug für Zug ziehen.
 */
export function RepertoireBereich() {
  const daten = useDaten(
    () => ladeKapitel(KAPITEL_EROEFFNUNGEN),
    `kapitel-${KAPITEL_EROEFFNUNGEN}`,
  );
  const gambitdaten = useDaten(() => ladeKapitel(KAPITEL_GAMBITS), `kapitel-${KAPITEL_GAMBITS}`);
  const [wahl, setzeWahl] = useState<Repertoirewahl | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  if (!wahl)
    return (
      <Repertoirestart
        kapitel2={daten.wert}
        kapitel3={gambitdaten.art === "fertig" ? gambitdaten.wert : null}
        jeRunde={VARIANTEN_JE_RUNDE}
        starte={setzeWahl}
      />
    );
  return (
    <Rundenablauf
      key={rundenschluessel(wahl, durchlauf)}
      kennung="repertoire"
      erzeuge={() =>
        aufgabenZu(wahl).map((a) => (r) => <Repertoireaufgabe aufgabe={a} runde={r} />)
      }
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzeWahl(null)}
    />
  );
}
