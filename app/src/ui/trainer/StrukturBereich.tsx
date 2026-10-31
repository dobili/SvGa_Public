/**
 * Strukturerkenner: Stufe wählen, dann eine Runde aus acht Skeletten.
 *
 * Rolle im Gesamtbild: Trainer „struktur“ (AP 13). Die Aufgaben lädt die Datei struktur.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf. Die Stufe misst hier
 * nicht die Engine, sondern wie viele Merkmale und Figuren zu überblicken sind. Falsch gelöste
 * Skelette kommen in die Wiederholung (wie bei „Falle oder Köder“, FallenBereich.tsx).
 * Abhängigkeiten: training/strukturtrainer.ts, Rundenablauf, Strukturaufgabe, Startkarte, i18n.
 */
import { useState } from "react";
import { ladeStrukturen } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { strukturrunde } from "../../training/strukturtrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Strukturaufgabe } from "./Strukturaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { useFaelligeAufgaben } from "./kartenantwort";
import { aufgabenzahl, stufenzeile, wiederholung } from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkteStufe } from "./startkarte/useGemerkt";

const AUFGABEN_JE_RUNDE = 8;

/** Der Strukturerkenner: Stufe wählen, dann eine Runde aus acht Skeletten (Bauernstrukturen). */
export function StrukturBereich() {
  const daten = useDaten(ladeStrukturen, "trainer-struktur");
  const [stufe, setzeStufe] = useGemerkteStufe("struktur");
  const faellig = useFaelligeAufgaben("struktur");
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
        kennung="struktur"
        testkennung="struktur-wahl"
        zeilen={[stufenzeile(stufe, setzeStufe, t("strukturtrainer.stufenText"))]}
        start={{ zusatz: aufgabenzahl(AUFGABEN_JE_RUNDE), starte: () => setzeLaeuft([]) }}
        modi={wiederholung(vorhanden.length, () => setzeLaeuft(vorhanden))}
      />
    );
  const istWiederholung = laeuft.length > 0;
  const runde = () =>
    istWiederholung
      ? laeuft.slice(0, AUFGABEN_JE_RUNDE).flatMap((id) => aufgaben.filter((a) => a.id === id))
      : strukturrunde(aufgaben, stufe, AUFGABEN_JE_RUNDE, ZUFALL);
  return (
    <Rundenablauf
      key={`${stufe}-${laeuft.join(",")}-${durchlauf}`}
      kennung="struktur"
      erzeuge={() => runde().map((a) => (r) => <Strukturaufgabe aufgabe={a} runde={r} />)}
      nochmal={() => (istWiederholung ? setzeLaeuft(null) : setzeDurchlauf(durchlauf + 1))}
      zurAuswahl={() => setzeLaeuft(null)}
    />
  );
}
