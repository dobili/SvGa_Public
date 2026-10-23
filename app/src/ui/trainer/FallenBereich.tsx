/**
 * „Falle oder Köder“: Stufe wählen, dann eine Runde aus acht Angeboten.
 *
 * Rolle im Gesamtbild: Trainer „falle“ (AP 13). Die Aufgaben lädt die Datei falle.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf.
 * Abhängigkeiten: training/fallentrainer.ts, Rundenablauf, Fallenaufgabe, Stufenwahl, i18n.
 */
import { useState } from "react";
import { ladeFallen } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { fallenrunde } from "../../training/fallentrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/useDaten";
import { Fallenaufgabe } from "./Fallenaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Stufenwahl } from "./Stufenwahl";
import { useFaelligeAufgaben } from "./kartenantwort";
import { Wiederholungsknopf } from "./Wiederholungsknopf";
import { Knopfsymbol } from "../komponenten/Knopfsymbol";

const AUFGABEN_JE_RUNDE = 8;

export function FallenBereich() {
  const daten = useDaten(ladeFallen, "trainer-falle");
  const [stufe, setzeStufe] = useState<number | null>(null);
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
      <div className="trainerrunde" data-testid="falle-wahl" data-tour="trainer-wahl">
        <Wiederholungsknopf anzahl={vorhanden.length} starte={() => setzeLaeuft(vorhanden)} />
        <Stufenwahl stufe={stufe} setze={setzeStufe} />
        <button type="button" className="knopf-haupt" onClick={() => setzeLaeuft([])}>
          <Knopfsymbol art="starten" />
          {t("taktiktrainer.starten")}
        </button>
      </div>
    );
  const wiederholung = laeuft.length > 0;
  const runde = () =>
    wiederholung
      ? laeuft.slice(0, AUFGABEN_JE_RUNDE).flatMap((id) => aufgaben.filter((a) => a.id === id))
      : fallenrunde(aufgaben, stufe, AUFGABEN_JE_RUNDE, ZUFALL);
  return (
    <Rundenablauf
      key={`${stufe}-${laeuft.join(",")}-${durchlauf}`}
      kennung="falle"
      erzeuge={() => runde().map((a) => (r) => <Fallenaufgabe aufgabe={a} runde={r} />)}
      nochmal={() => (wiederholung ? setzeLaeuft(null) : setzeDurchlauf(durchlauf + 1))}
      zurAuswahl={() => setzeLaeuft(null)}
    />
  );
}
