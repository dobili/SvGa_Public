/**
 * Schach-Röntgen-Trainer: Stufe wählen (leicht, mittel, schwer oder gemischt), dann eine Runde.
 *
 * Rolle im Gesamtbild: Trainer „roentgen“ (AP 13). Die Stellungen sind die Abbildungen und die
 * Hauptvarianten der Zugfolgen des Buches (training/roentgenstufen.ts); die Stufe misst, wie
 * viele Schachs und Schläge man gleichzeitig finden muss (Wunsch des Autors, 30.10.2026).
 * Abhängigkeiten: training/roentgenstufen.ts, daten/laden.ts, Rundenablauf, Roentgenaufgabe.
 */
import { useMemo, useState } from "react";
import { ladeIndex, ladeKapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { buchstellungenAus } from "../../training/buchstellungen";
import { roentgenrundeNachStufe, zugfolgenstellungen } from "../../training/roentgenstufen";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Roentgenaufgabe } from "./Roentgentrainer";
import { roentgenaufgabenAus } from "../../training/wiederholbar";
import { useFaelligeAufgaben } from "./kartenantwort";
import { Rundenablauf } from "./Rundenablauf";
import { aufgabenzahl, wiederholung, wortstufenzeile } from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkteWortstufe } from "./startkarte/useGemerkt";

/** Aufgaben je Runde (wie bisher). */
const AUFGABEN_JE_RUNDE = 5;

/** Alle Stellungen: Abbildungen und Zugfolgen aller Kapitel. */
async function ladeRoentgenstellungen() {
  const index = await ladeIndex();
  const kapitel = await Promise.all(index.kapitel.map((k) => ladeKapitel(k.kapitel)));
  return [...buchstellungenAus(kapitel), ...zugfolgenstellungen(kapitel)];
}

/** Der Röntgen-Trainer: Startkarte mit Stufe, dann die Runde. */
export function RoentgenBereich() {
  const daten = useDaten(ladeRoentgenstellungen, "roentgenstellungen");
  const [stufe, setzeStufe] = useGemerkteWortstufe("roentgen");
  /** null: Auswahl; „runde“: nach Stufe; „wiederholung“: die fälligen Aufgaben. */
  const [laeuft, setzeLaeuft] = useState<"runde" | "wiederholung" | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  const faellig = useFaelligeAufgaben("roentgen");
  const vorhanden = useMemo(
    () => (daten.art === "fertig" ? roentgenaufgabenAus(daten.wert, faellig) : []),
    [daten, faellig],
  );
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  if (laeuft === null)
    return (
      <Startkarte
        kennung="roentgen"
        testkennung="roentgen-wahl"
        zeilen={[wortstufenzeile(stufe, setzeStufe, t("roentgentrainer.stufenText"))]}
        start={{ zusatz: aufgabenzahl(AUFGABEN_JE_RUNDE), starte: () => setzeLaeuft("runde") }}
        modi={wiederholung(vorhanden.length, () => setzeLaeuft("wiederholung"))}
      />
    );
  return (
    <Rundenablauf
      key={`${laeuft}-${stufe}-${durchlauf}`}
      kennung="roentgen"
      erzeuge={() =>
        (laeuft === "wiederholung"
          ? vorhanden.slice(0, AUFGABEN_JE_RUNDE)
          : roentgenrundeNachStufe(daten.wert, stufe, AUFGABEN_JE_RUNDE, ZUFALL)
        ).map((a) => (r) => <Roentgenaufgabe aufgabe={a} runde={r} />)
      }
      nochmal={() =>
        laeuft === "wiederholung" ? setzeLaeuft(null) : setzeDurchlauf(durchlauf + 1)
      }
      zurAuswahl={() => setzeLaeuft(null)}
    />
  );
}
