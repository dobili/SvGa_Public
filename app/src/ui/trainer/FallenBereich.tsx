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

const AUFGABEN_JE_RUNDE = 8;

export function FallenBereich() {
  const daten = useDaten(ladeFallen, "trainer-falle");
  const [stufe, setzeStufe] = useState<number | null>(null);
  const [laeuft, setzeLaeuft] = useState(false);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const aufgaben = daten.wert.aufgaben;
  if (!laeuft)
    return (
      <div className="trainerrunde" data-testid="falle-wahl">
        <Stufenwahl stufe={stufe} setze={setzeStufe} />
        <button type="button" className="knopf-haupt" onClick={() => setzeLaeuft(true)}>
          {t("taktiktrainer.starten")}
        </button>
      </div>
    );
  return (
    <Rundenablauf
      key={`${stufe}-${durchlauf}`}
      kennung="falle"
      erzeuge={() =>
        fallenrunde(aufgaben, stufe, AUFGABEN_JE_RUNDE, ZUFALL).map((a) => (r) => (
          <Fallenaufgabe aufgabe={a} runde={r} />
        ))
      }
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzeLaeuft(false)}
    />
  );
}
