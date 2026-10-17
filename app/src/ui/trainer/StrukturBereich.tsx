/**
 * Strukturerkenner: Stufe wählen, dann eine Runde aus acht Skeletten.
 *
 * Rolle im Gesamtbild: Trainer „struktur“ (AP 13). Die Aufgaben lädt die Datei struktur.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf. Die Stufe misst hier
 * nicht die Engine, sondern wie viele Merkmale und Figuren zu überblicken sind.
 * Abhängigkeiten: training/strukturtrainer.ts, Rundenablauf, Strukturaufgabe, Stufenwahl, i18n.
 */
import { useState } from "react";
import { ladeStrukturen } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { strukturrunde } from "../../training/strukturtrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/useDaten";
import { Strukturaufgabe } from "./Strukturaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Stufenwahl } from "./Stufenwahl";

const AUFGABEN_JE_RUNDE = 8;

export function StrukturBereich() {
  const daten = useDaten(ladeStrukturen, "trainer-struktur");
  const [stufe, setzeStufe] = useState<number | null>(null);
  const [laeuft, setzeLaeuft] = useState(false);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const aufgaben = daten.wert.aufgaben;
  if (!laeuft)
    return (
      <div className="trainerrunde" data-testid="struktur-wahl">
        <Stufenwahl stufe={stufe} setze={setzeStufe} erklaerung={t("strukturtrainer.stufenText")} />
        <button type="button" className="knopf-haupt" onClick={() => setzeLaeuft(true)}>
          {t("taktiktrainer.starten")}
        </button>
      </div>
    );
  return (
    <Rundenablauf
      key={`${stufe}-${durchlauf}`}
      kennung="struktur"
      erzeuge={() =>
        strukturrunde(aufgaben, stufe, AUFGABEN_JE_RUNDE, ZUFALL).map((a) => (r) => (
          <Strukturaufgabe aufgabe={a} runde={r} />
        ))
      }
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzeLaeuft(false)}
    />
  );
}
