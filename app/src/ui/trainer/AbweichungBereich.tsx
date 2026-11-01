/**
 * Trainer „Abweichungsmodus“: Kapitel, Eröffnung und Seite auf der Startkarte wählen
 * (Eroeffnungsstart.tsx), dann drei Abweichungen der Engine beantworten.
 *
 * Rolle im Gesamtbild: Trainer „abweichung“ (Kapitel 2 und 3, AP 13 Stufe 3). Die Eröffnungen
 * und Varianten kommen aus Kapitel 2 wie im Repertoire-Trainer; welche Züge Buch sind, sagt der
 * Eröffnungsindex der Kapitel 2 und 3.
 * Abhängigkeiten: training/abweichungstrainer.ts, training/repertoiretrainer.ts,
 * ui/komponenten/bausteine/useEroeffnungsindex.ts, Rundenablauf, Abweichungsaufgabe, i18n.
 */
import { useState } from "react";
import { ladeKapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { abweichungsrunde, gambitsAus } from "../../training/abweichungstrainer";
import { eroeffnungenAus } from "../../training/repertoiretrainer";
import { ZUFALL } from "../../training/zufall";
import { PARTIEKAPITEL } from "../komponenten/partie/partiewerkzeug";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { useEroeffnungsindex } from "../komponenten/bausteine/useEroeffnungsindex";
import { Abweichungsaufgabe } from "./Abweichungsaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Eroeffnungsstart, type Eroeffnungswahl } from "./Eroeffnungsstart";
import { BUCHQUELLEN, quellenzeile, type Eroeffnungsquelle } from "./eroeffnungsquelle";
import { aufgabenzahl } from "./startkarte/einstellung";
import { useGemerkt } from "./startkarte/useGemerkt";

const KAPITEL_EROEFFNUNGEN = 2;
/**
 * Eröffnungen aus Kapitel 2 oder Gambits aus Kapitel 3 (mit dem Damengambit): derselbe Trainer,
 * zwei Einstiege (Zeile „Aus“, eroeffnungsquelle.ts).
 */
const KAPITEL_GAMBITS = 3;
const AUFGABEN_JE_RUNDE = 3;

/**
 * Der Trainer „Abweichungsmodus“ (Kapitel 2 und 3): Eröffnung und Seite wählen, dann auf
 * Abweichungen der Engine vom Buch antworten.
 */
export function AbweichungBereich() {
  const daten = useDaten(
    () => ladeKapitel(KAPITEL_EROEFFNUNGEN),
    `kapitel-${KAPITEL_EROEFFNUNGEN}`,
  );
  const gambitdaten = useDaten(() => ladeKapitel(KAPITEL_GAMBITS), `kapitel-${KAPITEL_GAMBITS}`);
  const [quelle, setzeQuelle] = useGemerkt<Eroeffnungsquelle>(
    "abweichung",
    "kapitel",
    BUCHQUELLEN,
    "kapitel2",
  );
  // Index der Kapitel 2 und 3 (wie beim Spiel gegen die Engine).
  const index = useEroeffnungsindex(PARTIEKAPITEL);
  const [wahl, setzeWahl] = useState<Eroeffnungswahl | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  if (!wahl) {
    const gambits = gambitdaten.art === "fertig" ? gambitsAus(gambitdaten.wert, daten.wert) : [];
    const liste = quelle === "kapitel3" ? gambits : eroeffnungenAus(daten.wert);
    return (
      <Eroeffnungsstart
        kennung="abweichung"
        eroeffnungen={liste}
        vorne={[quellenzeile(BUCHQUELLEN, quelle, setzeQuelle, "abweichung-quelle")]}
        zusatz={aufgabenzahl(AUFGABEN_JE_RUNDE)}
        starte={setzeWahl}
      />
    );
  }
  return (
    <Rundenablauf
      key={`${wahl.eroeffnung.id}-${wahl.seite}-${durchlauf}`}
      kennung="abweichung"
      erzeuge={() =>
        abweichungsrunde(wahl.eroeffnung, wahl.seite, AUFGABEN_JE_RUNDE, ZUFALL).map((a) => (r) => (
          <Abweichungsaufgabe aufgabe={a} runde={r} index={index} />
        ))
      }
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzeWahl(null)}
    />
  );
}
