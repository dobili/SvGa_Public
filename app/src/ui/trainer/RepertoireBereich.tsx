/**
 * Repertoire-Trainer: Eröffnung und Seite wählen, dann ihre Varianten Zug für Zug ziehen.
 *
 * Rolle im Gesamtbild: Trainer „repertoire“ (Pflichtenheft 7: „Du wählst dein Starterpaket.
 * Die Hauptvarianten werden Zug für Zug abgefragt.“). Die Zugfolgen lädt das Kapitel 2
 * (daten/laden.ts); die Runde läuft im gemeinsamen Rundenablauf. Warum-Fragen stellt der
 * Trainer nicht mehr (Wunsch des Autors, 30.10.2026; früher W10); sie bleiben an den Abbildungen.
 * Abhängigkeiten: training/repertoiretrainer.ts, Rundenablauf, Repertoireaufgabe, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import { ladeKapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import {
  eroeffnungenAus,
  repertoirerunde,
  type Repertoireeroeffnung,
} from "../../training/repertoiretrainer";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Repertoireaufgabe } from "./Repertoireaufgabe";
import { Rundenablauf } from "./Rundenablauf";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { Auswahlliste } from "./Auswahlliste";

const KAPITEL_EROEFFNUNGEN = 2;
const VARIANTEN_JE_RUNDE = 6;
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
    <div
      className="trainerrunde trainerwahl"
      data-testid="repertoire-wahl"
      data-tour="trainer-wahl"
    >
      {gewaehlt && (
        <Auswahlliste
          titel={t("repertoiretrainer.eroeffnung")}
          eintraege={eroeffnungen.map((e) => ({ wert: e.id, text: e.titel }))}
          wert={gewaehlt.id}
          setze={(id) => setzeGewaehlt(eroeffnungen.find((e) => e.id === id) ?? gewaehlt)}
        />
      )}
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
        <Knopfsymbol art="starten" />
        {t("taktiktrainer.starten")}
      </button>
    </div>
  );
}

/**
 * Der Repertoire-Trainer (Kapitel 2): Eröffnung und Seite wählen, dann ihre Varianten Zug für Zug
 * ziehen.
 */
export function RepertoireBereich() {
  const daten = useDaten(
    () => ladeKapitel(KAPITEL_EROEFFNUNGEN),
    `kapitel-${KAPITEL_EROEFFNUNGEN}`,
  );
  const [wahl, setzeWahl] = useState<Wahl | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  if (!wahl) return <Auswahl eroeffnungen={eroeffnungenAus(daten.wert)} starte={setzeWahl} />;
  return (
    <Rundenablauf
      key={`${wahl.eroeffnung.id}-${wahl.seite}-${durchlauf}`}
      kennung="repertoire"
      erzeuge={() =>
        repertoirerunde(wahl.eroeffnung, wahl.seite, VARIANTEN_JE_RUNDE).map((a) => (r) => (
          <Repertoireaufgabe aufgabe={a} runde={r} />
        ))
      }
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={() => setzeWahl(null)}
    />
  );
}
