/**
 * „Falle oder Köder“: Stufe wählen, dann eine Runde aus acht Angeboten.
 *
 * Rolle im Gesamtbild: Trainer „falle“ (AP 13). Die Aufgaben lädt die Datei falle.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf.
 * Abhängigkeiten: training/fallentrainer.ts, Rundenablauf, Fallenaufgabe, Startkarte, i18n.
 */
import { useState } from "react";
import { ladeFallen } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { fallenrunde } from "../../training/fallentrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Fallenaufgabe } from "./Fallenaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { useFaelligeAufgaben } from "./kartenantwort";
import { aufgabenzahl, stufenzeile, wiederholung } from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkteStufe } from "./startkarte/useGemerkt";

const AUFGABEN_JE_RUNDE = 8;

/** Der Trainer „Falle oder Köder“: Stufe wählen, dann eine Runde aus acht Angeboten. */
export function FallenBereich() {
  const daten = useDaten(ladeFallen, "trainer-falle");
  const [stufe, setzeStufe] = useGemerkteStufe("falle");
  const faellig = useFaelligeAufgaben("falle");
  /** null: Auswahl; leer: Runde nach Stufe; sonst die fälligen Wiederholungen. */
  const [laeuft, setzeLaeuft] = useState<readonly string[] | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const aufgaben = daten.wert.aufgaben;
  const vorhanden = faellig.filter((id) => aufgaben.some((a) => a.id === id));
  if (!laeuft)
    return (
      <Startkarte
        kennung="falle"
        testkennung="falle-wahl"
        zeilen={[stufenzeile(stufe, setzeStufe, t("stufen.text.geeicht"))]}
        start={{ zusatz: aufgabenzahl(AUFGABEN_JE_RUNDE), starte: () => setzeLaeuft([]) }}
        modi={wiederholung(vorhanden.length, () => setzeLaeuft(vorhanden))}
      />
    );
  const istWiederholung = laeuft.length > 0;
  const runde = () =>
    istWiederholung
      ? laeuft.slice(0, AUFGABEN_JE_RUNDE).flatMap((id) => aufgaben.filter((a) => a.id === id))
      : fallenrunde(aufgaben, stufe, AUFGABEN_JE_RUNDE, ZUFALL);
  return (
    <Rundenablauf
      key={`${stufe}-${laeuft.join(",")}-${durchlauf}`}
      kennung="falle"
      erzeuge={() => runde().map((a) => (r) => <Fallenaufgabe aufgabe={a} runde={r} />)}
      nochmal={() => (istWiederholung ? setzeLaeuft(null) : setzeDurchlauf(durchlauf + 1))}
      zurAuswahl={() => setzeLaeuft(null)}
    />
  );
}
