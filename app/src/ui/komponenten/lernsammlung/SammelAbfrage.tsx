/**
 * Abfrage der Lernsammlung: Stellung zeigen, selbst an den Plan denken, dann aufdecken.
 *
 * Rolle im Gesamtbild: Kapitel 12 lässt die Lernsammlung regelmäßig abfragen („Eigene
 * Lernsammlung anlegen und abfragen“, Werkzeugkasten). Die App mischt die Einträge einer Gruppe
 * oder der ganzen Sammlung und zeigt sie nacheinander; erst „Plan zeigen“ deckt Plan und Notiz
 * auf. Gespeichert wird dabei nichts. Die Abfrage merkt sich nur die Kennungen und liest jeden
 * Eintrag aus dem aktuellen Stand der Sammlung: Ein geänderter Plan gilt sofort, ein gelöschter
 * Eintrag fällt weg (Wunsch des Autors, 1.11.2026). Hat ein Eintrag verknüpfte Varianten, fragt
 * „Varianten abfragen“ nach dem Plan auch sie ab, Zug für Zug und die Abzweige nacheinander
 * (Variationsbrowser, Stufe 4; die Seite ist die, die in der Stellung am Zug ist).
 * Abhängigkeiten: training/lernsammlung.ts, training/variationen.ts, Trainerbrett,
 * varianten/Variantenabfrage, sammeltexte.ts, Speicher, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import { eintraegeZu, type Sammeleintrag } from "../../../training/lernsammlung";
import { variationenZu } from "../../../training/variationen";
import { Variantenabfrage } from "../varianten/Variantenabfrage";
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
 * Die verknüpften Varianten eines Eintrags nacheinander abfragen; ``beiEnde`` nach der letzten.
 * Beispiel: Eintrag „Spanisch nach 3. Lb5“ mit einer Variante → ihre Linien ab der Stellung.
 */
function Variantenteil({ eintrag, beiEnde }: { eintrag: Sammeleintrag; beiEnde: () => void }) {
  const liste = variationenZu(
    useSpeicher((z) => z.daten.variationen),
    { art: "sammlung", id: eintrag.id },
  );
  const [stelle, setzeStelle] = useState(0);
  const variation = liste[stelle];
  if (!variation) return null;
  const seite = eintrag.fen.split(" ")[1] === "b" ? "black" : "white";
  const weiter = () => (stelle + 1 >= liste.length ? beiEnde() : setzeStelle(stelle + 1));
  return (
    <div data-testid="sammelabfrage-varianten">
      <p className="hinweis">
        {t("sammlung.variantenStand", {
          titel: variation.titel,
          nummer: stelle + 1,
          anzahl: liste.length,
        })}
      </p>
      <Variantenabfrage
        key={variation.id}
        variation={variation}
        start={variation.startpfad}
        seite={seite}
        beiEnde={weiter}
      />
    </div>
  );
}

/** Plan und Notiz nach „Plan zeigen“, vorher die Frage. */
function Planteil({ eintrag, offen }: { eintrag: Sammeleintrag; offen: boolean }) {
  if (!offen) return <p>{t("sammlung.abfrageFrage")}</p>;
  return (
    <div data-testid="sammelabfrage-plan">
      <p>
        <strong>{t("sammlung.plan")}:</strong> {eintrag.plan || t("sammlung.ohnePlan")}
      </p>
      {eintrag.notiz && <p className="vorformatiert">{eintrag.notiz}</p>}
    </div>
  );
}

/** Was die Knöpfe der Abfrage brauchen. */
interface Knopfstand {
  readonly offen: boolean;
  readonly verknuepft: number;
  readonly letzte: boolean;
  readonly aufdecken: () => void;
  readonly varianten: () => void;
  readonly weiter: () => void;
  readonly beiEnde: () => void;
}

/** Die Knöpfe: Plan zeigen, Varianten abfragen (wenn verknüpft), Weiter, Zurück. */
function Abfrageknoepfe(k: Knopfstand) {
  const { offen, verknuepft, letzte, aufdecken, varianten, weiter, beiEnde } = k;
  return (
    <div className="knopfreihe">
      {!offen && (
        <button type="button" className="knopf-haupt" onClick={aufdecken}>
          {t("sammlung.planZeigen")}
        </button>
      )}
      {offen && verknuepft > 0 && (
        <button
          type="button"
          className="knopf-zweit"
          data-testid="sammelabfrage-variantenknopf"
          onClick={varianten}
        >
          {t("sammlung.variantenAbfragen", { anzahl: verknuepft })}
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
  );
}

/** Stand, Eröffnung, Fundstelle und Brett eines Eintrags. */
function Eintragskopf({
  eintrag,
  nummer,
  anzahl,
}: {
  eintrag: Sammeleintrag;
  nummer: number;
  anzahl: number;
}) {
  return (
    <>
      <h2 className="karte-titel">{t("sammlung.abfrageStand", { nummer, anzahl })}</h2>
      <p className="hinweis">
        {eintrag.eroeffnung || t("sammlung.ohneEroeffnung")} · {fundstelle(eintrag)}
      </p>
      <Trainerbrett fen={eintrag.fen} beschriftung={t("sammlung.stellung")} />
    </>
  );
}

/**
 * Die Abfrage. Eingaben: Kennungen der Einträge, Ende (zurück zur Sammlung).
 * Beispiel: drei Einträge der Spanischen Partie → drei Stellungen in zufälliger Folge.
 */
export function SammelAbfrage({
  kennungen,
  beiEnde,
}: {
  kennungen: readonly string[];
  beiEnde: () => void;
}) {
  const sammlung = useSpeicher((z) => z.daten.sammlung);
  const alleVarianten = useSpeicher((z) => z.daten.variationen);
  const [gemischteKennungen] = useState(() => gemischt(kennungen));
  const reihe = eintraegeZu(sammlung, gemischteKennungen);
  const [stelle, setzeStelle] = useState(0);
  const [offen, setzeOffen] = useState(false);
  const [varianten, setzeVarianten] = useState(false);
  const eintrag = reihe[stelle];
  if (!eintrag) return null;
  const letzte = stelle + 1 >= reihe.length;
  const weiter = () => {
    if (letzte) return beiEnde();
    setzeStelle(stelle + 1);
    setzeOffen(false);
  };
  const verknuepft = variationenZu(alleVarianten, { art: "sammlung", id: eintrag.id }).length;
  return (
    <section className="karte" data-testid="sammelabfrage">
      {varianten ? (
        <Variantenteil eintrag={eintrag} beiEnde={() => setzeVarianten(false)} />
      ) : (
        <>
          <Eintragskopf eintrag={eintrag} nummer={stelle + 1} anzahl={reihe.length} />
          <Planteil eintrag={eintrag} offen={offen} />
          <Abfrageknoepfe
            {...{ offen, verknuepft, letzte, weiter, beiEnde }}
            aufdecken={() => setzeOffen(true)}
            varianten={() => setzeVarianten(true)}
          />
        </>
      )}
    </section>
  );
}
