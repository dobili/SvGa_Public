/**
 * Trainer „Abweichungsmodus“: Eröffnung und Seite wählen, dann drei Abweichungen der Engine
 * beantworten.
 *
 * Rolle im Gesamtbild: Trainer „abweichung“ (Kapitel 2 und 3, AP 13 Stufe 3). Die Eröffnungen
 * und Varianten kommen aus Kapitel 2 wie im Repertoire-Trainer; welche Züge Buch sind, sagt der
 * Eröffnungsindex der Kapitel 2 und 3.
 * Abhängigkeiten: training/abweichungstrainer.ts, training/repertoiretrainer.ts,
 * ui/komponenten/useEroeffnungsindex.ts, Rundenablauf, Abweichungsaufgabe, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import { ladeKapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { abweichungsrunde } from "../../training/abweichungstrainer";
import { eroeffnungenAus, type Repertoireeroeffnung } from "../../training/repertoiretrainer";
import { ZUFALL } from "../../training/zufall";
import { PARTIEKAPITEL } from "../komponenten/partiewerkzeug";
import { useDaten } from "../komponenten/useDaten";
import { useEroeffnungsindex } from "../komponenten/useEroeffnungsindex";
import { Abweichungsaufgabe } from "./Abweichungsaufgabe";
import { Rundenablauf } from "./Rundenablauf";

const KAPITEL_EROEFFNUNGEN = 2;
const AUFGABEN_JE_RUNDE = 3;
const SEITEN: readonly Color[] = ["white", "black"];

interface Wahl {
  readonly eroeffnung: Repertoireeroeffnung;
  readonly seite: Color;
}

function Auswahl({
  eroeffnungen,
  starte,
}: {
  eroeffnungen: readonly Repertoireeroeffnung[];
  starte: (wahl: Wahl) => void;
}) {
  const [gewaehlt, setzeGewaehlt] = useState(eroeffnungen[0] ?? null);
  const [seite, setzeSeite] = useState<Color>("white");
  return (
    <div className="trainerrunde" data-testid="abweichung-wahl">
      <fieldset className="zahlwahl">
        <legend>{t("repertoiretrainer.eroeffnung")}</legend>
        {eroeffnungen.map((e) => (
          <button
            key={e.id}
            type="button"
            className="chip"
            aria-pressed={gewaehlt?.id === e.id}
            onClick={() => setzeGewaehlt(e)}
          >
            {e.titel}
          </button>
        ))}
      </fieldset>
      <fieldset className="zahlwahl">
        <legend>{t("repertoiretrainer.seite")}</legend>
        {SEITEN.map((s) => (
          <button
            key={s}
            type="button"
            className="chip"
            aria-pressed={seite === s}
            onClick={() => setzeSeite(s)}
          >
            {t(s === "white" ? "farbe.w" : "farbe.b")}
          </button>
        ))}
      </fieldset>
      <button
        type="button"
        className="knopf-haupt"
        disabled={gewaehlt === null}
        onClick={() => gewaehlt && starte({ eroeffnung: gewaehlt, seite })}
      >
        {t("taktiktrainer.starten")}
      </button>
    </div>
  );
}

export function AbweichungBereich() {
  const daten = useDaten(
    () => ladeKapitel(KAPITEL_EROEFFNUNGEN),
    `kapitel-${KAPITEL_EROEFFNUNGEN}`,
  );
  // Index der Kapitel 2 und 3 (wie beim Spiel gegen die Engine).
  const index = useEroeffnungsindex(PARTIEKAPITEL);
  const [wahl, setzeWahl] = useState<Wahl | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  if (!wahl) return <Auswahl eroeffnungen={eroeffnungenAus(daten.wert)} starte={setzeWahl} />;
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
