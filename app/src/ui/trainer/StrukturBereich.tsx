/**
 * Strukturerkenner: Stufe wählen, dann eine Runde aus acht Skeletten.
 *
 * Rolle im Gesamtbild: Trainer „struktur“ (AP 13). Die Aufgaben lädt die Datei struktur.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf. Die Stufe misst hier
 * nicht die Engine, sondern wie viele Merkmale und Figuren zu überblicken sind. Falsch gelöste
 * Skelette kommen in die Wiederholung (wie bei „Falle oder Köder“, FallenBereich.tsx).
 * Abhängigkeiten: training/strukturtrainer.ts, Rundenablauf, Strukturaufgabe, Stufenwahl, i18n.
 */
import { useState } from "react";
import { ladeStrukturen } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { strukturrunde } from "../../training/strukturtrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Strukturaufgabe } from "./Strukturaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Stufenwahl } from "./Stufenwahl";
import { useFaelligeAufgaben } from "./kartenantwort";
import { Wiederholungsknopf } from "./Wiederholungsknopf";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";

const AUFGABEN_JE_RUNDE = 8;

/** Der Strukturerkenner: Stufe wählen, dann eine Runde aus acht Skeletten (Bauernstrukturen). */
export function StrukturBereich() {
  const daten = useDaten(ladeStrukturen, "trainer-struktur");
  const [stufe, setzeStufe] = useState<number | null>(null);
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
      <div
        className="trainerrunde trainerwahl"
        data-testid="struktur-wahl"
        data-tour="trainer-wahl"
      >
        <Wiederholungsknopf anzahl={vorhanden.length} starte={() => setzeLaeuft(vorhanden)} />
        <Stufenwahl stufe={stufe} setze={setzeStufe} erklaerung={t("strukturtrainer.stufenText")} />
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
      : strukturrunde(aufgaben, stufe, AUFGABEN_JE_RUNDE, ZUFALL);
  return (
    <Rundenablauf
      key={`${stufe}-${laeuft.join(",")}-${durchlauf}`}
      kennung="struktur"
      erzeuge={() => runde().map((a) => (r) => <Strukturaufgabe aufgabe={a} runde={r} />)}
      nochmal={() => (wiederholung ? setzeLaeuft(null) : setzeDurchlauf(durchlauf + 1))}
      zurAuswahl={() => setzeLaeuft(null)}
    />
  );
}
