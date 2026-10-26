/**
 * Stufenschalter einer Fehlerart oder Gruppe als steigende Säulen, der Schalter „aus · an“ und die
 * Wahl des Höchstverlusts; eigene Datei, damit Fehlerprofil.tsx und diese Datei unter 400 Zeilen
 * bleiben.
 *
 * Rolle im Gesamtbild: Die Feinregler (Feinregler.tsx) zeigen je Regler eine Zeile mit diesen
 * Schaltern; das Netz (Profilnetz.tsx) ist die einfache Ansicht darüber.
 * Abhängigkeiten: fehlerprofil.ts, i18n, lucide-react.
 */
import { Ban } from "lucide-react";
import { t } from "../../../i18n/sprache";
import {
  STUFEN_ALLE,
  STUFEN_MENSCHLICH,
  stufenwort,
  UNMENSCHLICH_AB,
  VERLUSTWAHL,
  verlusttext,
} from "./fehlerprofil";

const PROZENT = 100;

/** Höhe der niedrigsten Säule in Prozent; die höchste füllt die Spur. */
const SAEULE_MINDESTENS = 25;
const ZEICHEN_AUS = 18;

/**
 * Höhe der Säule einer Stufe in Prozent: von „sehr selten“ (klein) bis „sehr oft“ (voll).
 * Beispiel: sechs Stufen mit „aus“ → sehr selten 40 %, normal 70 %, sehr oft 100 %.
 */
function saeulenhoehe(position: number, anzahl: number): number {
  return SAEULE_MINDESTENS + ((PROZENT - SAEULE_MINDESTENS) * position) / anzahl;
}

/**
 * Der Stufenschalter einer Art oder Gruppe. Seit 0.2.131 (Wunsch des Autors, 25.10.2026: aufgeräumter, wie
 * die Balken in „Deine Züge“) als Säulen wie eine Lautstärkeanzeige: „aus“ als Zeichen links,
 * dann je Stufe eine höhere Säule; gefüllt bis zur gewählten Stufe, unter „normal“ ein Strich
 * wie das Übliche in „Deine Züge“, rechts das Wort der Wahl. Jede Säule bleibt ein Optionsfeld
 * mit dem Wort als Namen (Bildschirmleser, Tests).
 */
export function Stufenschalter({
  kennung,
  name,
  wert,
  extrem,
  beiWahl,
}: {
  kennung: string;
  name: string;
  wert: number | null;
  extrem: boolean;
  beiWahl: (stufe: number | null) => void;
}) {
  const stufen = extrem ? STUFEN_ALLE : STUFEN_MENSCHLICH;
  const anzahl = stufen.length - 1;
  return (
    <div className="stufenbalken-zeile">
      <div
        className="stufenbalken"
        role="radiogroup"
        aria-label={name}
        data-testid={`stufe-${kennung}`}
      >
        {stufen.map((s, position) => (
          <button
            key={String(s)}
            type="button"
            role="radio"
            aria-checked={s === wert}
            aria-label={stufenwort(s)}
            title={stufenwort(s)}
            className={saeulenklasse(s, wert)}
            onClick={() => beiWahl(s)}
          >
            {s === null ? (
              <Ban size={ZEICHEN_AUS} aria-hidden="true" />
            ) : (
              <span
                className="stufenbalken-saeule"
                style={{ height: `${saeulenhoehe(position, anzahl)}%` }}
              />
            )}
          </button>
        ))}
      </div>
      <span className="stufenbalken-wert" aria-hidden="true">
        {stufenwort(wert)}
      </span>
    </div>
  );
}

/** Klassen einer Säule: gefüllt bis zur Wahl, „normal“ mit Strich, unmenschlich gestreift. */
function saeulenklasse(s: number | null, wert: number | null): string {
  if (s === null) return "stufenbalken-aus";
  const teile = ["stufenbalken-stufe"];
  if (wert !== null && s <= wert) teile.push("gefuellt");
  if (s === 0) teile.push("ist-normal");
  if (Math.abs(s) >= UNMENSCHLICH_AB) teile.push("unmenschlich");
  return teile.join(" ");
}

/** Kleiner Schalter „aus · an“ (seit 0.2.135 nur noch für „setzt nie Patt“). */
export function AnAusSchalter({
  kennung,
  name,
  an,
  beiWahl,
}: {
  kennung: string;
  name: string;
  an: boolean;
  beiWahl: (an: boolean) => void;
}) {
  return (
    <div
      className="stufenschalter stufen-2"
      role="radiogroup"
      aria-label={name}
      data-testid={`schalter-${kennung}`}
    >
      {[false, true].map((wahl) => (
        <button
          key={String(wahl)}
          type="button"
          role="radio"
          aria-checked={wahl === an}
          onClick={() => beiWahl(wahl)}
        >
          {t(wahl ? "spielen.profil.an" : "spielen.profil.aus")}
        </button>
      ))}
    </div>
  );
}

/** Wahl des Höchstverlusts als Chips (unter einer Zeile aufgeklappt). */
export function Verlustwahl({
  wert,
  beiWahl,
}: {
  wert: number | null;
  beiWahl: (bauern: number | null) => void;
}) {
  const wahl = VERLUSTWAHL.includes(wert) ? VERLUSTWAHL : [...VERLUSTWAHL.slice(0, -1), wert, null];
  return (
    <div className="verlustwahl" role="radiogroup" aria-label={t("spielen.profil.verlustTitel")}>
      <span className="hinweis">{t("spielen.profil.verlustTitel")}</span>
      {wahl.map((b) => (
        <button
          key={String(b)}
          type="button"
          role="radio"
          className="chip"
          aria-checked={b === wert}
          onClick={() => beiWahl(b)}
        >
          {verlusttext(b)}
        </button>
      ))}
    </div>
  );
}
