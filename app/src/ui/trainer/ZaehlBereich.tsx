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
import { haengerunde, ZAEHLSTUFEN, zaehlrunde, type Zaehlstufe } from "../../training/zaehltrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { istHaengeaufgabe, zaehlaufgabenAus } from "../../training/wiederholbar";
import { useFaelligeAufgaben } from "./kartenantwort";
import { Rundenablauf } from "./Rundenablauf";
import { Wiederholungsknopf } from "./Wiederholungsknopf";
import { Haengeaufgabe, Zaehlaufgabe } from "./Zaehltrainer";

/** Aufgaben je Runde (wie bisher). */
const AUFGABEN_JE_RUNDE = 8;
type Art = "bilanz" | "haengen";
const ARTEN: readonly Art[] = ["bilanz", "haengen"];

/** Die Stufenwahl für „Bilanz zählen“. */
function Zaehlstufenwahl({
  stufe,
  setze,
}: {
  stufe: Zaehlstufe | null;
  setze: (s: Zaehlstufe | null) => void;
}) {
  return (
    <>
      <fieldset className="zahlwahl">
        <legend>{t("taktiktrainer.stufeWahl")}</legend>
        <button
          type="button"
          className="chip"
          aria-pressed={stufe === null}
          onClick={() => setze(null)}
        >
          {t("roentgentrainer.stufe.gemischt")}
        </button>
        {ZAEHLSTUFEN.map((s) => (
          <button
            key={s}
            type="button"
            className="chip"
            aria-pressed={stufe === s}
            onClick={() => setze(s)}
          >
            {t(`roentgentrainer.stufe.${s}`)}
          </button>
        ))}
      </fieldset>
      <p className="hinweis">{t("zaehltrainer.stufenText")}</p>
    </>
  );
}

/** Der Zähltrainer mit Stufenwahl und den beiden Übungsarten. */
export function ZaehlBereich() {
  const daten = useDaten(ladeBuchstellungen, "buchstellungen");
  const [stufe, setzeStufe] = useState<Zaehlstufe | null>(null);
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
      <div className="trainerrunde trainerwahl" data-testid="zaehl-wahl" data-tour="trainer-wahl">
        <Wiederholungsknopf anzahl={vorhanden.length} starte={() => setzeArt("wiederholung")} />
        <Zaehlstufenwahl stufe={stufe} setze={setzeStufe} />
        <ul className="uebungsarten">
          {ARTEN.map((a) => (
            <li key={a}>
              <button type="button" className="karte uebungsart" onClick={() => setzeArt(a)}>
                <span className="karte-titel">{t(`uebungsart.${a}.name`)}</span>
                <span className="hinweis">{t(`uebungsart.${a}.text`)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
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
