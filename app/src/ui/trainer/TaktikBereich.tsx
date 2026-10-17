/**
 * Taktiktrainer: Thema und Stufe wählen, dann eine Runde aus acht Aufgaben.
 *
 * Rolle im Gesamtbild: Trainer „taktik“ (Pflichtenheft 7: „Aufgaben nach Motiv oder gemischt,
 * als Themenblock wie im 30-Minuten-Plan“). Die Aufgaben lädt die Datei taktik.json
 * (daten/trainerdaten.ts); die Runde läuft im gemeinsamen Rundenablauf.
 * Abhängigkeiten: training/taktiktrainer.ts, Rundenablauf, Taktikaufgabe, i18n.
 */
import { useState } from "react";
import { ladeTaktik } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import {
  anzahlJeThema,
  MOTIVE,
  taktikrunde,
  type Taktikthema,
  type Taktikwahl,
} from "../../training/taktiktrainer";
import { ZUFALL } from "../../training/zufall";
import { useDaten } from "../komponenten/useDaten";
import { Rundenablauf } from "./Rundenablauf";
import { Taktikaufgabe } from "./Taktikaufgabe";

const AUFGABEN_JE_RUNDE = 8;
const STUFEN = [1, 2, 3, 4, 5] as const;
const THEMEN: readonly Taktikthema[] = ["gemischt", "mattbilder", ...MOTIVE];

function themenname(thema: Taktikthema): string {
  if (thema === "gemischt") return t("taktiktrainer.gemischt");
  if (thema === "mattbilder") return t("taktiktrainer.mattbilder");
  return t(`taktiktrainer.motiv.${thema}`);
}

/** Wahl von Thema und Stufe. */
function Wahl({
  anzahl,
  starte,
}: {
  anzahl: Map<Taktikthema, number>;
  starte: (wahl: Taktikwahl) => void;
}) {
  const [thema, setzeThema] = useState<Taktikthema>("gemischt");
  const [stufe, setzeStufe] = useState<number | null>(null);
  return (
    <div className="trainerrunde" data-testid="taktik-wahl">
      <fieldset className="zahlwahl">
        <legend>{t("taktiktrainer.thema")}</legend>
        {THEMEN.filter((th) => (anzahl.get(th) ?? 0) > 0).map((th) => (
          <button
            key={th}
            type="button"
            className="chip"
            aria-pressed={thema === th}
            onClick={() => setzeThema(th)}
          >
            {themenname(th)} ({anzahl.get(th)})
          </button>
        ))}
      </fieldset>
      <fieldset className="zahlwahl">
        <legend>{t("taktiktrainer.stufeWahl")}</legend>
        <button
          type="button"
          className="chip"
          aria-pressed={stufe === null}
          onClick={() => setzeStufe(null)}
        >
          {t("taktiktrainer.alleStufen")}
        </button>
        {STUFEN.map((s) => (
          <button
            key={s}
            type="button"
            className="chip"
            aria-pressed={stufe === s}
            onClick={() => setzeStufe(s)}
          >
            {s}
          </button>
        ))}
      </fieldset>
      <p className="hinweis">{t("taktiktrainer.stufenText")}</p>
      <button type="button" className="knopf-haupt" onClick={() => starte({ thema, stufe })}>
        {t("taktiktrainer.starten")}
      </button>
    </div>
  );
}

export function TaktikBereich() {
  const daten = useDaten(ladeTaktik, "trainer-taktik");
  const [wahl, setzeWahl] = useState<Taktikwahl | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const aufgaben = daten.wert.aufgaben;
  if (!wahl) return <Wahl anzahl={anzahlJeThema(aufgaben)} starte={setzeWahl} />;
  return (
    <Rundenablauf
      key={`${wahl.thema}-${wahl.stufe}-${durchlauf}`}
      kennung="taktik"
      erzeuge={() =>
        taktikrunde(aufgaben, wahl, AUFGABEN_JE_RUNDE, ZUFALL).map((a) => (r) => (
          <Taktikaufgabe aufgabe={a} runde={r} />
        ))
      }
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzeWahl(null)}
    />
  );
}
