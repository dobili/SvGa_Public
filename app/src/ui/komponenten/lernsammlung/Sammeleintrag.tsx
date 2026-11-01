/**
 * Ein Eintrag der Lernsammlung: zugeklappt Fundstelle und Plan, offen mit Brett, Notiz,
 * Sprung zur Abbildung, Bearbeiten und Löschen.
 *
 * Rolle im Gesamtbild: Teil des Bildschirms Lernsammlung (AP 15). Bearbeiten zeigt dieselben
 * Felder wie das Anlegen (Sammelfelder.tsx: Plan, Notiz, Eröffnung; Wunsch des Autors,
 * 1.11.2026); Stellung, Fundstelle und Datum bleiben. Ohne Plan heißt der Knopf „Plan
 * ergänzen“. Löschen übernimmt der Bildschirm (mit Rückgängig, bausteine/useRueckgaengig.tsx).
 * Abhängigkeiten: training/eintragspflege.ts, speicher/speicher.ts, Trainerbrett, Sammelfelder,
 * sammeltexte.ts, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import { aendere } from "../../../speicher/speicher";
import { mitGeaendertemSammeleintrag } from "../../../training/eintragspflege";
import type { Sammeleintrag } from "../../../training/lernsammlung";
import { Trainerbrett } from "../../trainer/Trainerbrett";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { Sammelfelder, type Sammelwerte } from "./Sammelfelder";
import { fundstelle } from "./sammeltexte";

/** Die Felder des Anlegens zum Bearbeiten, mit Speichern und Abbrechen. */
function Bearbeiten({ eintrag, beiFertig }: { eintrag: Sammeleintrag; beiFertig: () => void }) {
  const [werte, setzeWerte] = useState<Sammelwerte>({
    plan: eintrag.plan,
    notiz: eintrag.notiz,
    eroeffnung: eintrag.eroeffnung,
  });
  const speichern = () => {
    const teil = {
      plan: werte.plan.trim(),
      notiz: werte.notiz.trim(),
      eroeffnung: werte.eroeffnung.trim(),
    };
    void aendere((daten) => mitGeaendertemSammeleintrag(daten, eintrag.id, teil));
    beiFertig();
  };
  return (
    <div className="fehlerformular" data-testid="sammel-bearbeiten">
      <Sammelfelder
        werte={werte}
        beiAenderung={(teil) => setzeWerte((alt) => ({ ...alt, ...teil }))}
      />
      <div className="knopfreihe">
        <button type="button" className="knopf-haupt" onClick={speichern}>
          <Knopfsymbol art="speichern" />
          {t("sammlung.aenderungSpeichern")}
        </button>
        <button type="button" className="knopf-zweit" onClick={beiFertig}>
          {t("sammlung.abbrechen")}
        </button>
      </div>
    </div>
  );
}

/** Plan und Notiz zum Lesen, mit Hinweis, wenn der Plan noch fehlt. */
function Inhalt({ eintrag }: { eintrag: Sammeleintrag }) {
  return (
    <>
      <p>
        <strong>{t("sammlung.plan")}:</strong> {eintrag.plan || t("sammlung.ohnePlan")}
      </p>
      {eintrag.notiz && <p className="vorformatiert">{eintrag.notiz}</p>}
    </>
  );
}

/** Die Knöpfe unter einem Eintrag: zur Abbildung, Bearbeiten (oder Plan ergänzen), Löschen. */
function Knoepfe({
  eintrag,
  beiBearbeiten,
  beiLoeschen,
}: {
  eintrag: Sammeleintrag;
  beiBearbeiten: () => void;
  beiLoeschen: () => void;
}) {
  const { navigiere } = useNavigation();
  return (
    <div className="knopfreihe">
      {eintrag.herkunft === "abbildung" && (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => navigiere({ bildschirm: "abbildung", nummer: eintrag.quelle })}
        >
          {t("sammlung.zurAbbildung", { nummer: eintrag.quelle })}
        </button>
      )}
      <button type="button" className="knopf-zweit" onClick={beiBearbeiten}>
        <Knopfsymbol art="bearbeiten" />
        {eintrag.plan ? t("sammlung.bearbeiten") : t("sammlung.planErgaenzen")}
      </button>
      <button type="button" className="knopf-zweit" onClick={beiLoeschen}>
        <Knopfsymbol art="loeschen" />
        {t("sammlung.loeschen")}
      </button>
    </div>
  );
}

/**
 * Ein Eintrag der Lernsammlung: zugeklappt Fundstelle und Plan, aufgeklappt mit Brett, Notiz,
 * Sprung zur Abbildung, Bearbeiten und Löschen. `beiLoeschen` löscht mit Rückgängig.
 */
export function SammeleintragKarte({
  eintrag,
  beiLoeschen,
}: {
  eintrag: Sammeleintrag;
  beiLoeschen: (id: string) => void;
}) {
  const [bearbeiten, setzeBearbeiten] = useState(false);
  return (
    <details className="sammeleintrag" data-testid="sammeleintrag">
      <summary>
        {fundstelle(eintrag)}
        {eintrag.plan ? ` · ${eintrag.plan}` : ""}
      </summary>
      <Trainerbrett fen={eintrag.fen} beschriftung={t("sammlung.stellung")} />
      {bearbeiten ? (
        <Bearbeiten eintrag={eintrag} beiFertig={() => setzeBearbeiten(false)} />
      ) : (
        <>
          <Inhalt eintrag={eintrag} />
          <Knoepfe
            eintrag={eintrag}
            beiBearbeiten={() => setzeBearbeiten(true)}
            beiLoeschen={() => beiLoeschen(eintrag.id)}
          />
        </>
      )}
    </details>
  );
}
