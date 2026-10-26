/**
 * Abfrage der Lernsammlung: Stellung zeigen, selbst an den Plan denken, dann aufdecken.
 *
 * Rolle im Gesamtbild: Kapitel 12 lässt die Lernsammlung regelmäßig abfragen („Eigene
 * Lernsammlung anlegen und abfragen“, Werkzeugkasten). Die App mischt die Einträge einer Gruppe
 * oder der ganzen Sammlung und zeigt sie nacheinander; erst „Plan zeigen“ deckt Plan und Notiz
 * auf. Gespeichert wird dabei nichts.
 * Abhängigkeiten: training/zufall.ts, Trainerbrett, sammeltexte.ts, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import type { Sammeleintrag } from "../../../training/lernsammlung";
import { Trainerbrett } from "../../trainer/Trainerbrett";
import { fundstelle } from "./sammeltexte";

/** Gemischte Reihenfolge (Fisher-Yates), einmal je Abfrage. */
function gemischt<T>(liste: readonly T[]): T[] {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tausch = kopie[i] as T;
    kopie[i] = kopie[j] as T;
    kopie[j] = tausch;
  }
  return kopie;
}

/**
 * Die Abfrage. Eingaben: Einträge, Ende (zurück zur Sammlung).
 * Beispiel: drei Einträge der Spanischen Partie → drei Stellungen in zufälliger Folge.
 */
export function SammelAbfrage({
  liste,
  beiEnde,
}: {
  liste: readonly Sammeleintrag[];
  beiEnde: () => void;
}) {
  const [reihe] = useState(() => gemischt(liste));
  const [stelle, setzeStelle] = useState(0);
  const [offen, setzeOffen] = useState(false);
  const eintrag = reihe[stelle];
  if (!eintrag) return null;
  const letzte = stelle + 1 >= reihe.length;
  const weiter = () => {
    if (letzte) return beiEnde();
    setzeStelle(stelle + 1);
    setzeOffen(false);
  };
  return (
    <section className="karte" data-testid="sammelabfrage">
      <h2 className="karte-titel">
        {t("sammlung.abfrageStand", { nummer: stelle + 1, anzahl: reihe.length })}
      </h2>
      <p className="hinweis">
        {eintrag.eroeffnung || t("sammlung.ohneEroeffnung")} · {fundstelle(eintrag)}
      </p>
      <Trainerbrett fen={eintrag.fen} beschriftung={t("sammlung.stellung")} />
      {offen ? (
        <div data-testid="sammelabfrage-plan">
          <p>
            <strong>{t("sammlung.plan")}:</strong> {eintrag.plan || t("sammlung.ohnePlan")}
          </p>
          {eintrag.notiz && <p className="vorformatiert">{eintrag.notiz}</p>}
        </div>
      ) : (
        <p>{t("sammlung.abfrageFrage")}</p>
      )}
      <div className="knopfreihe">
        {!offen && (
          <button type="button" className="knopf-haupt" onClick={() => setzeOffen(true)}>
            {t("sammlung.planZeigen")}
          </button>
        )}
        {offen && (
          <button type="button" className="knopf-haupt" onClick={weiter}>
            {letzte ? t("sammlung.abfrageFertig") : t("sammlung.abfrageWeiter")}
          </button>
        )}
        <button type="button" className="knopf-zweit" onClick={beiEnde}>
          {t("sammlung.abfrageAbbrechen")}
        </button>
      </div>
    </section>
  );
}
