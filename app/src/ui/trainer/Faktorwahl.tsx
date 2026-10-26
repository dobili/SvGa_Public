/**
 * Eingabe des Faktorenbilanz-Trainers wie die Tabelle im Buch: eine Waage für Material und Zeit,
 * ✓ ◐ ✗ je Seite für Königssicherheit und Aktivität.
 *
 * Rolle im Gesamtbild: Teil von Faktorenaufgabe.tsx. Wunsch des Autors (19.10.2026): Der Trainer
 * soll mit Waagen arbeiten wie die Faktorenbilanz in Kapitel 3, statt mit drei gleichen Knöpfen je
 * Faktor. Nach der Antwort steht daneben, was Buch oder App sagen.
 * Abhängigkeiten: ui/komponenten/werkzeugkarten/Waage.tsx, training/faktorentrainer.ts, i18n.
 * Buchbezug: Kapitel 3, „Kompensation messen statt fühlen: die Faktorenbilanz“ (Waage bei
 * Material und Zeit, ✓ ◐ ✗ bei Königssicherheit und Aktivität).
 */
import { t } from "../../i18n/sprache";
import type { Einschaetzung } from "../../schach/faktoreinschaetzung";
import { ANTWORTEN, type Vorn } from "../../training/faktorentrainer";
import { Waage } from "../komponenten/werkzeugkarten/Waage";

/** Neigung der Waage zur gewählten Seite (Weiß links wie im Buch). */
const NEIGUNG: Readonly<Record<Vorn, "links" | "rechts" | "gerade">> = {
  white: "links",
  gleich: "gerade",
  black: "rechts",
};
const WERTUNGEN: readonly Einschaetzung[] = ["gut", "teils", "schlecht"];
/** Die Zeichen der Buchtabelle. */
const ZEICHEN: Readonly<Record<Einschaetzung, string>> = { gut: "✓", teils: "◐", schlecht: "✗" };

/** Was Buch oder App sagen, grün bei Übereinstimmung, sonst rot. */
function Vergleichssatz({
  eigen,
  loesung,
  quelle,
}: {
  eigen: Vorn | undefined;
  loesung: Vorn;
  quelle: "app" | "buch";
}) {
  return (
    <span className={`meldung ${loesung === eigen ? "gut" : "schlecht"}`}>
      {t(quelle === "buch" ? "trainer.buchSagt" : "trainer.appSagt", {
        antwort: t(`faktorentrainer.vorn.${loesung}`),
      })}
    </span>
  );
}

/**
 * Waage für Material oder Zeit: Die Knöpfe lassen sie zu Weiß oder Schwarz sinken oder gerade
 * stehen; die Waage zeigt die Wahl wie im Buch.
 */
export function Waagenwahl({
  titel,
  wert,
  setze,
  loesung,
  quelle,
}: {
  titel: string;
  wert: Vorn | undefined;
  setze: (wert: Vorn) => void;
  loesung: Vorn | null;
  quelle: "app" | "buch";
}) {
  const waage = {
    links: t("faktorentrainer.vorn.white"),
    rechts: t("faktorentrainer.vorn.black"),
    neigung: NEIGUNG[wert ?? "gleich"],
    vorsprung: "",
  };
  return (
    <fieldset className="zahlwahl faktorwahl">
      <legend>{titel}</legend>
      <Waage waage={waage} />
      <div className="faktorwahl-knoepfe">
        {ANTWORTEN.map((w) => (
          <button
            key={w}
            type="button"
            className="chip"
            aria-pressed={wert === w}
            disabled={loesung !== null}
            onClick={() => setze(w)}
          >
            {t(`faktorentrainer.waage.${w}`)}
          </button>
        ))}
      </div>
      {loesung !== null && <Vergleichssatz eigen={wert} loesung={loesung} quelle={quelle} />}
    </fieldset>
  );
}

/** Eine Zeile ✓ ◐ ✗ für eine Seite. */
function Wertungszeile({
  seite,
  wert,
  setze,
  gesperrt,
}: {
  seite: string;
  wert: Einschaetzung | undefined;
  setze: (wert: Einschaetzung) => void;
  gesperrt: boolean;
}) {
  return (
    <div className="faktorwahl-zeile" role="group" aria-label={seite}>
      <span className="faktorwahl-seite">{seite}</span>
      {WERTUNGEN.map((w) => (
        <button
          key={w}
          type="button"
          className="chip"
          aria-pressed={wert === w}
          aria-label={`${seite}: ${t(`faktorentrainer.wertung.${w}`)}`}
          disabled={gesperrt}
          onClick={() => setze(w)}
        >
          {ZEICHEN[w]}
        </button>
      ))}
    </div>
  );
}

/** Wertung je Seite für Königssicherheit oder Aktivität. */
export interface Seitenwertung {
  readonly white?: Einschaetzung;
  readonly black?: Einschaetzung;
}

/**
 * Königssicherheit oder Aktivität wie im Buch: je Seite ✓ (gut), ◐ (teils) oder ✗ (schlecht).
 * Verglichen wird, wer danach vorn liegt (Weiß ◐ gegen Schwarz ✗ → Weiß).
 */
export function Seitenwahl({
  titel,
  wert,
  setze,
  vorn,
  loesung,
  quelle,
}: {
  titel: string;
  wert: Seitenwertung;
  setze: (wert: Seitenwertung) => void;
  vorn: Vorn | undefined;
  loesung: Vorn | null;
  quelle: "app" | "buch";
}) {
  return (
    <fieldset className="zahlwahl faktorwahl">
      <legend>{titel}</legend>
      {(["white", "black"] as const).map((farbe) => (
        <Wertungszeile
          key={farbe}
          seite={t(`faktorentrainer.vorn.${farbe}`)}
          wert={wert[farbe]}
          setze={(w) => setze({ ...wert, [farbe]: w })}
          gesperrt={loesung !== null}
        />
      ))}
      {loesung !== null && <Vergleichssatz eigen={vorn} loesung={loesung} quelle={quelle} />}
    </fieldset>
  );
}
