/**
 * Ein Eintrag der Fehlerdatenbank: zugeklappt Datum, Fehlerart und Zug; offen mit Satz, Brett,
 * Bearbeiten und Löschen.
 *
 * Rolle im Gesamtbild: Teil des Trainers „Fehlerdatenbank“ (FehlerBereich.tsx). Bearbeiten zeigt
 * dieselben Felder wie das Anlegen (Fehlerfelder.tsx: Fehlerart und Satz; Wunsch des Autors,
 * 1.11.2026); Stellung, Zug und Datum bleiben. Löschen übernimmt der Bereich (mit Rückgängig).
 * Abhängigkeiten: training/eintragspflege.ts, training/fehlerdatenbank.ts, Fehlerfelder,
 * Trainerbrett, Speicher, i18n.
 */
import { useState } from "react";
import { datumText, sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { aendere } from "../../speicher/speicher";
import { mitGeaendertemFehler } from "../../training/eintragspflege";
import type { Fehlereintrag } from "../../training/fehlerdatenbank";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { Fehlerfelder, type Fehlerwerte } from "./Fehlerfelder";
import { Trainerbrett } from "./Trainerbrett";
import { artName, type Fehlerart } from "./useFehlerarten";

/** Fehlerart und Satz bearbeiten, mit Speichern und Abbrechen. */
function Bearbeiten({ eintrag, beiFertig }: { eintrag: Fehlereintrag; beiFertig: () => void }) {
  const [werte, setzeWerte] = useState<Fehlerwerte>({
    art: eintrag.fehlerart,
    satz: eintrag.satz,
  });
  const speichern = () => {
    const art = werte.art;
    if (art === null) return;
    void aendere((daten) =>
      mitGeaendertemFehler(daten, eintrag.id, { fehlerart: art, satz: werte.satz.trim() }),
    );
    beiFertig();
  };
  return (
    <div className="fehlerformular" data-testid="fehlerdb-bearbeiten">
      <Fehlerfelder
        werte={werte}
        beiAenderung={(teil) => setzeWerte((alt) => ({ ...alt, ...teil }))}
      />
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-haupt"
          disabled={werte.art === null}
          onClick={speichern}
        >
          <Knopfsymbol art="speichern" />
          {t("fehlerdb.aenderungSpeichern")}
        </button>
        <button type="button" className="knopf-zweit" onClick={beiFertig}>
          {t("fehlerdb.abbrechen")}
        </button>
      </div>
    </div>
  );
}

/**
 * Ein Eintrag der Fehlerdatenbank. Eingaben: Eintrag, Fehlerarten (für den Namen), Löschen (mit
 * Rückgängig, vom Bereich). Beispiel: „01.11.2026 · Schach oder Schlag übersehen (Kapitel 1) ·
 * Sxe4“.
 */
export function FehlerEintrag({
  eintrag,
  arten,
  beiLoeschen,
}: {
  eintrag: Fehlereintrag;
  arten: readonly Fehlerart[];
  beiLoeschen: (id: string) => void;
}) {
  const [bearbeiten, setzeBearbeiten] = useState(false);
  const datum = datumText(new Date(eintrag.datum));
  return (
    <details className="karte" data-testid="fehlerdb-eintrag">
      <summary>
        {datum} · {artName(arten, eintrag.fehlerart)}
        {eintrag.zug ? ` · ${sanInSprache(eintrag.zug, sprache())}` : ""}
      </summary>
      {!bearbeiten && eintrag.satz && <p>{eintrag.satz}</p>}
      <Trainerbrett fen={eintrag.fen} beschriftung={t("fehlerdb.stellung")} />
      {bearbeiten ? (
        <Bearbeiten eintrag={eintrag} beiFertig={() => setzeBearbeiten(false)} />
      ) : (
        <div className="knopfreihe">
          <button type="button" className="knopf-zweit" onClick={() => setzeBearbeiten(true)}>
            <Knopfsymbol art="bearbeiten" />
            {t("fehlerdb.bearbeiten")}
          </button>
          <button type="button" className="knopf-zweit" onClick={() => beiLoeschen(eintrag.id)}>
            <Knopfsymbol art="loeschen" />
            {t("fehlerdb.loeschen")}
          </button>
        </div>
      )}
    </details>
  );
}
