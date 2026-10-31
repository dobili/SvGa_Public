/**
 * Zähltrainer: Stufe wählen (gemischt, leicht, mittel, schwer), dann „Bilanz zählen“ oder
 * „Hängende Figuren finden“.
 *
 * Rolle im Gesamtbild: Trainer „zaehlen“ (AP 13). Seit dem Nebenchat (30.10.2026, Wunsch des
 * Autors: weitere Schwierigkeitsgrade) mit Stufen nach der Zahl der beteiligten Figuren und den
 * Motiven Batterie und Fesselung (training/zaehltrainer.ts).
 * Abhängigkeiten: training/zaehltrainer.ts, training/buchstellungen.ts, Rundenablauf, i18n.
 */
import { useMemo, useState } from "react";
import { t } from "../../i18n/sprache";
import { ladeBuchstellungen } from "../../training/buchstellungen";
import { haengerunde, zaehlrunde } from "../../training/zaehltrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { istHaengeaufgabe, zaehlaufgabenAus } from "../../training/wiederholbar";
import { useFaelligeAufgaben } from "./kartenantwort";
import { Rundenablauf } from "./Rundenablauf";
import {
  aufgabenzahl,
  wiederholung,
  wortstufenzeile,
  type Startmodus,
} from "./startkarte/einstellung";
import { Startkarte } from "./startkarte/Startkarte";
import { useGemerkteWortstufe } from "./startkarte/useGemerkt";
import { Haengeaufgabe, Zaehlaufgabe } from "./Zaehltrainer";

/** Aufgaben je Runde (wie bisher). */
const AUFGABEN_JE_RUNDE = 8;
type Art = "bilanz" | "haengen";

/** Der zweite Modus „Hängende Figuren finden“ (auf Zeit). */
function haengenmodus(starte: () => void): Startmodus {
  return {
    kennung: "haengen",
    titel: t("trainerstart.modus.haengen"),
    text: t("trainerstart.modus.haengenText"),
    symbol: "zeit",
    starte,
    testkennung: "zaehl-haengen",
  };
}

/** Der Zähltrainer: Startkarte mit Stufe, „Bilanz zählen“ als Runde, „Hängende Figuren“ als Modus. */
export function ZaehlBereich() {
  const daten = useDaten(ladeBuchstellungen, "buchstellungen");
  const [stufe, setzeStufe] = useGemerkteWortstufe("zaehlen");
  const [art, setzeArt] = useState<Art | "wiederholung" | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  const faellig = useFaelligeAufgaben("zaehlen");
  const vorhanden = useMemo(
    () => (daten.art === "fertig" ? zaehlaufgabenAus(daten.wert, faellig) : []),
    [daten, faellig],
  );
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  if (art === null)
    return (
      <Startkarte
        kennung="zaehlen"
        testkennung="zaehl-wahl"
        zeilen={[wortstufenzeile(stufe, setzeStufe, t("zaehltrainer.stufenText"))]}
        start={{
          zusatz: aufgabenzahl(AUFGABEN_JE_RUNDE),
          starte: () => setzeArt("bilanz"),
          testkennung: "zaehl-bilanz",
        }}
        modi={[
          haengenmodus(() => setzeArt("haengen")),
          ...wiederholung(vorhanden.length, () => setzeArt("wiederholung")),
        ]}
      />
    );
  return (
    <Rundenablauf
      key={`${art}-${stufe}-${durchlauf}`}
      kennung="zaehlen"
      erzeuge={() => {
        if (art === "wiederholung")
          return vorhanden
            .slice(0, AUFGABEN_JE_RUNDE)
            .map(
              (a) => (r) =>
                istHaengeaufgabe(a) ? (
                  <Haengeaufgabe aufgabe={a} runde={r} />
                ) : (
                  <Zaehlaufgabe aufgabe={a} runde={r} />
                ),
            );
        return art === "bilanz"
          ? zaehlrunde(daten.wert, AUFGABEN_JE_RUNDE, ZUFALL, stufe).map((a) => (r) => (
              <Zaehlaufgabe aufgabe={a} runde={r} />
            ))
          : haengerunde(daten.wert, AUFGABEN_JE_RUNDE, ZUFALL).map((a) => (r) => (
              <Haengeaufgabe aufgabe={a} runde={r} />
            ));
      }}
      nochmal={() => (art === "wiederholung" ? setzeArt(null) : setzeDurchlauf(durchlauf + 1))}
      zurAuswahl={() => setzeArt(null)}
    />
  );
}
