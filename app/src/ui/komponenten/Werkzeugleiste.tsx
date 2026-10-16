/**
 * Werkzeugleiste unter dem Brett: die Bündel des Kapitels, „◀ frühere“ und „spätere ▶“, dazu die
 * Reiter des gewählten Bündels.
 *
 * Rolle im Gesamtbild: Teil des Abbildung-Bildschirms. Seit dem Werkzeug-Umbau 0.2.30 steht je
 * Verfahren des Buches ein Knopf in der Leiste (Bündel, werkzeugordnung.ts); die Teile schaltet
 * man in der Karte wie Reiter um (Reiterleiste unten). Zählen, Ziehen, Engine, Röntgen und
 * Warnsignale sitzen als Symbole am Brett (Brettsymbole.tsx; Zählen seit 0.2.31).
 * Bedienung: Ein Tipp wählt ein Bündel, ein zweiter wählt es wieder ab (Kreuz im Knopf).
 * Abhängigkeiten: werkzeugordnung.ts, useWerkzeugwahl.ts, i18n, lucide-react.
 */
import { Bone, X } from "lucide-react";
import { t, type Textschluessel } from "../../i18n/sprache";
import type { Werkzeugwahlstand } from "./useWerkzeugwahl";
import {
  buendelname,
  leiste,
  teileVon,
  werkzeugname,
  type Buendelkennung,
} from "./werkzeugordnung";

/** Kennung eines angemeldeten Werkzeugs wie „k1-roentgen“ (analyse/register.ts). */
export type Werkzeugkennung = `k${number}-${string}`;
/** Was gewählt sein kann: Zählen, ein Werkzeug des Buches, Ziehen oder die Engine. */
export type Werkzeugwahl = "zaehlen" | "ziehen" | "engine" | Werkzeugkennung;

const SYMBOLGROESSE = 16;

/** Im gewählten Knopf ein Kreuz: Ein zweites Tippen wählt ab. */
function Wahlsymbol() {
  return <X className="chip-symbol" size={SYMBOLGROESSE} aria-hidden="true" />;
}

/** „◀ frühere“ oder „spätere ▶“: schaltet Bündel anderer Kapitel zu. */
function Zuschalter({
  an,
  text,
  name,
  beiKlick,
}: {
  an: boolean;
  text: Textschluessel;
  name: Textschluessel;
  beiKlick: () => void;
}) {
  return (
    <button
      type="button"
      className="chip chip-leise"
      aria-pressed={an}
      aria-label={t(name)}
      title={t(name)}
      onClick={beiKlick}
    >
      {t(text)}
    </button>
  );
}

/**
 * Leiste mit den Bündeln eines Kapitels, in der Reihenfolge ihrer Einführung im Buch.
 *
 * Eingaben: Kapitel der Abbildung, ob die Stellung Regeln hat (Lehrbilder ohne König haben keine
 * Bündel, dann fehlt die Leiste), Zustand der Werkzeugwahl.
 * Beispiel: Abb. 3.10 → Eröffnung prüfen; „◀ frühere“ setzt die Angriffsregel aus Kapitel 1
 * dahinter, „spätere ▶“ die Bündel ab Kapitel 4 als Vorschau ans Ende.
 */
export function Werkzeugleiste({
  kapitel,
  mitRegeln,
  werkzeug,
}: {
  kapitel: number;
  mitRegeln: boolean;
  werkzeug: Werkzeugwahlstand;
}) {
  const { buendel, hatFruehere, hatSpaetere } = leiste(
    kapitel,
    { frueher: werkzeug.frueher, spaeter: werkzeug.spaeter },
    mitRegeln,
  );
  if (buendel.length === 0 && !hatFruehere && !hatSpaetere) return null;
  return (
    <div className="werkzeugleiste" role="toolbar" aria-label={t("abbildung.werkzeuge")}>
      {hatFruehere && (
        <Zuschalter
          an={werkzeug.frueher}
          text="werkzeug.frueher"
          name="werkzeug.frueherName"
          beiKlick={werkzeug.schalteFrueher}
        />
      )}
      {buendel.map((b) => {
        const gewaehlt = werkzeug.buendel === b.kennung;
        return (
          <button
            key={b.kennung}
            type="button"
            className={b.vorschau ? "chip chip-vorschau" : "chip"}
            aria-pressed={gewaehlt}
            onClick={() => werkzeug.tippeBuendel(b.kennung)}
          >
            {t(b.name)}
            {b.vorschau && (
              <span className="plakette-vorschau">
                {t("werkzeug.vorschauKapitel", { kapitel: b.einfuehrung })}
              </span>
            )}
            {gewaehlt && <Wahlsymbol />}
          </button>
        );
      })}
      {hatSpaetere && (
        <Zuschalter
          an={werkzeug.spaeter}
          text="werkzeug.spaeter"
          name="werkzeug.spaeterName"
          beiKlick={werkzeug.schalteSpaeter}
        />
      )}
    </div>
  );
}

/**
 * Reiter eines Bündels über der Karte: die Teile in der Reihenfolge des Buches, spätere mit der
 * Plakette „Vorschau“. Beim Skelett-Röntgen zusätzlich rechts daneben der Schalter „Skelett“
 * (früher das Knochensymbol am Brett). Erscheint nur, wenn es mehr als einen Teil gibt oder den Schalter.
 * Beispiel: Abb. 6.20, Planfindung → Wo?, Angriffsregel, Gegner?, LAP, Planbilanz.
 */
export function Reiterleiste({
  kennung,
  kapitel,
  werkzeug,
  skelett,
}: {
  kennung: Buendelkennung;
  kapitel: number;
  werkzeug: Werkzeugwahlstand;
  skelett: { readonly an: boolean; readonly schalte: () => void } | null;
}) {
  const teile = teileVon(kennung, kapitel, werkzeug.spaeter);
  if (teile.length < 2 && !skelett) return null;
  return (
    <div className="reiterbereich">
      {teile.length > 1 && (
        <div
          className="reiterleiste"
          role="tablist"
          aria-label={t("werkzeug.reiter", { buendel: t(buendelname(kennung)) })}
        >
          {teile.map((teil) => (
            <button
              key={teil.wahl}
              type="button"
              role="tab"
              className="reiter"
              aria-selected={werkzeug.wahl === teil.wahl}
              onClick={() => werkzeug.tippeTeil(teil.wahl)}
            >
              {t(werkzeugname(teil.wahl))}
              {teil.vorschau && <span className="plakette-vorschau">{t("werkzeug.vorschau")}</span>}
            </button>
          ))}
        </div>
      )}
      {/* Rechts neben dem letzten Reiter (Wunsch des Autors, Test von 0.2.30): klein, mit
          Knochensymbol wie früher am Brett. */}
      {skelett && (
        <button
          type="button"
          className="chip chip-skelett"
          aria-pressed={skelett.an}
          aria-label={t("werkzeug.skelettZeigen")}
          onClick={skelett.schalte}
        >
          <Bone size={SYMBOLGROESSE} aria-hidden="true" />
          {t("werkzeug.skelett")}
        </button>
      )}
    </div>
  );
}
