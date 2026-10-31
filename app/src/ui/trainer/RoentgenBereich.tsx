/**
 * Schach-Röntgen-Trainer: Stufe wählen (leicht, mittel, schwer oder gemischt), dann eine Runde.
 *
 * Rolle im Gesamtbild: Trainer „roentgen“ (AP 13). Die Stellungen sind die Abbildungen und die
 * Hauptvarianten der Zugfolgen des Buches (training/roentgenstufen.ts); die Stufe misst, wie
 * viele Schachs und Schläge man gleichzeitig finden muss (Wunsch des Autors, 30.10.2026).
 * Abhängigkeiten: training/roentgenstufen.ts, daten/laden.ts, Rundenablauf, Roentgenaufgabe.
 */
import { useState } from "react";
import { ladeIndex, ladeKapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { buchstellungenAus } from "../../training/buchstellungen";
import {
  ROENTGENSTUFEN,
  roentgenrundeNachStufe,
  zugfolgenstellungen,
  type Roentgenstufe,
} from "../../training/roentgenstufen";
import { ZUFALL } from "../../training/zufall";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Roentgenaufgabe } from "./Roentgentrainer";
import { Rundenablauf } from "./Rundenablauf";

/** Aufgaben je Runde (wie bisher). */
const AUFGABEN_JE_RUNDE = 5;

/** Alle Stellungen: Abbildungen und Zugfolgen aller Kapitel. */
async function ladeRoentgenstellungen() {
  const index = await ladeIndex();
  const kapitel = await Promise.all(index.kapitel.map((k) => ladeKapitel(k.kapitel)));
  return [...buchstellungenAus(kapitel), ...zugfolgenstellungen(kapitel)];
}

/** Die Wahl der Stufe: gemischt oder eine der drei Stufen. */
function Roentgenstufenwahl({
  stufe,
  setze,
}: {
  stufe: Roentgenstufe | null;
  setze: (stufe: Roentgenstufe | null) => void;
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
        {ROENTGENSTUFEN.map((s) => (
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
      <p className="hinweis">{t("roentgentrainer.stufenText")}</p>
    </>
  );
}

/** Der Röntgen-Trainer mit Stufenwahl. */
export function RoentgenBereich() {
  const daten = useDaten(ladeRoentgenstellungen, "roentgenstellungen");
  const [stufe, setzeStufe] = useState<Roentgenstufe | null>(null);
  const [laeuft, setzeLaeuft] = useState(false);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  if (!laeuft)
    return (
      <div
        className="trainerrunde trainerwahl"
        data-testid="roentgen-wahl"
        data-tour="trainer-wahl"
      >
        <Roentgenstufenwahl stufe={stufe} setze={setzeStufe} />
        <button type="button" className="knopf-haupt" onClick={() => setzeLaeuft(true)}>
          <Knopfsymbol art="starten" />
          {t("taktiktrainer.starten")}
        </button>
      </div>
    );
  return (
    <Rundenablauf
      key={`${stufe}-${durchlauf}`}
      kennung="roentgen"
      erzeuge={() =>
        roentgenrundeNachStufe(daten.wert, stufe, AUFGABEN_JE_RUNDE, ZUFALL).map((a) => (r) => (
          <Roentgenaufgabe aufgabe={a} runde={r} />
        ))
      }
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzeLaeuft(false)}
    />
  );
}
