/**
 * Ein Eintrag der Fehlerdatenbank: zugeklappt Datum, Fehlerart und Zug; offen mit Satz, Brett,
 * Bearbeiten und Löschen.
 *
 * Rolle im Gesamtbild: Teil des Trainers „Fehlerdatenbank“ (FehlerBereich.tsx). Bearbeiten zeigt
 * dieselben Felder wie das Anlegen (Fehlerfelder.tsx: Fehlerart und Satz; Wunsch des Autors,
 * 1.11.2026); Stellung, Zug und Datum bleiben. Löschen übernimmt der Bereich (mit Rückgängig).
 * Beim Bearbeiten lässt sich eine Variante verknüpfen, neu anlegen oder lösen; verknüpfte Varianten
 * fragt „Abfragen“ ab (Variationsbrowser, Stufe 4).
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
import { VariantenHinweis } from "../komponenten/varianten/VariantenHinweis";
import { alsWert } from "../komponenten/varianten/variantenwert";
import { Variantenwahl } from "../komponenten/varianten/Variantenwahl";
import { useVariantenwahl } from "../komponenten/varianten/variantenwahlSpeichern";
import { ausFehler } from "../../training/variationsquellen";
import { Fehlerfelder, type Fehlerwerte } from "./Fehlerfelder";
import { Trainerbrett } from "./Trainerbrett";
import { artName, type Fehlerart } from "./useFehlerarten";

/** Eine neue Variante aus dem Fehler (Stellung davor, gespielter Zug, Satz als Kommentar). */
function neueFehlervariante(eintrag: Fehlereintrag) {
  const titel = t("varianten.titel.fehler", { datum: datumText(new Date(eintrag.datum)) });
  return ausFehler(eintrag, titel, new Date());
}

/** Fehlerart und Satz bearbeiten, mit Speichern und Abbrechen. */
function Bearbeiten({ eintrag, beiFertig }: { eintrag: Fehlereintrag; beiFertig: () => void }) {
  const [werte, setzeWerte] = useState<Fehlerwerte>({
    art: eintrag.fehlerart,
    satz: eintrag.satz,
  });
  const variante = useVariantenwahl();
  const ziel = { art: "fehler", id: eintrag.id } as const;
  const speichern = () => {
    const art = werte.art;
    if (art === null) return;
    void aendere((daten) =>
      mitGeaendertemFehler(daten, eintrag.id, { fehlerart: art, satz: werte.satz.trim() }),
    );
    const neu = () => neueFehlervariante({ ...eintrag, satz: werte.satz.trim() });
    // An der Grenze bleibt das Formular offen und sagt es; Fehlerart und Satz sind gespeichert.
    if (variante.wende(ziel, neu)) beiFertig();
  };
  return (
    <div className="fehlerformular" data-testid="fehlerdb-bearbeiten">
      <Fehlerfelder
        werte={werte}
        beiAenderung={(teil) => setzeWerte((alt) => ({ ...alt, ...teil }))}
      />
      <Variantenwahl ziel={ziel} wahl={variante.wahl} beiWahl={variante.setzeWahl} />
      {variante.meldung && <p className="fehlertext">{variante.meldung}</p>}
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
      <VariantenHinweis
        quelle={{ art: "fehler", id: eintrag.id }}
        wert={alsWert({ art: "fehler", id: eintrag.id })}
      />
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
