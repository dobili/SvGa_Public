/**
 * Repertoire-Trainer: Eröffnung und Seite auf der Startkarte wählen (Eroeffnungsstart.tsx), dann
 * ihre Varianten Zug für Zug ziehen.
 *
 * Rolle im Gesamtbild: Trainer „repertoire“ (Pflichtenheft 7: „Du wählst dein Starterpaket.
 * Die Hauptvarianten werden Zug für Zug abgefragt.“). Die Zugfolgen lädt das Kapitel 2
 * (daten/laden.ts); die Runde läuft im gemeinsamen Rundenablauf. Warum-Fragen stellt der
 * Trainer nicht mehr (Wunsch des Autors, 30.10.2026; früher W10); sie bleiben an den Abbildungen.
 * Abhängigkeiten: training/repertoiretrainer.ts, Rundenablauf, Repertoireaufgabe, i18n.
 */
import { useState } from "react";
import { ladeKapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { eroeffnungenAus, repertoirerunde } from "../../training/repertoiretrainer";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Repertoireaufgabe } from "./Repertoireaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Eroeffnungsstart, type Eroeffnungswahl } from "./Eroeffnungsstart";

const KAPITEL_EROEFFNUNGEN = 2;
const VARIANTEN_JE_RUNDE = 6;

/**
 * Der Repertoire-Trainer (Kapitel 2): Eröffnung und Seite wählen, dann ihre Varianten Zug für Zug
 * ziehen.
 */
export function RepertoireBereich() {
  const daten = useDaten(
    () => ladeKapitel(KAPITEL_EROEFFNUNGEN),
    `kapitel-${KAPITEL_EROEFFNUNGEN}`,
  );
  const [wahl, setzeWahl] = useState<Eroeffnungswahl | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  if (!wahl)
    return (
      <Eroeffnungsstart
        kennung="repertoire"
        eroeffnungen={eroeffnungenAus(daten.wert)}
        zusatz={t("trainerstart.varianten", { anzahl: VARIANTEN_JE_RUNDE })}
        starte={setzeWahl}
      />
    );
  return (
    <Rundenablauf
      key={`${wahl.eroeffnung.id}-${wahl.seite}-${durchlauf}`}
      kennung="repertoire"
      erzeuge={() =>
        repertoirerunde(wahl.eroeffnung, wahl.seite, VARIANTEN_JE_RUNDE).map((a) => (r) => (
          <Repertoireaufgabe aufgabe={a} runde={r} />
        ))
      }
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzeWahl(null)}
    />
  );
}
