/**
 * Werkzeugleiste unter dem Brett: die Bündel des Kapitels, „◀ frühere“ und „spätere ▶“, dazu die
 * Reiter des gewählten Bündels.
 *
 * Rolle im Gesamtbild: Teil des Abbildung-Bildschirms. Je Verfahren des Buches steht ein Knopf in
 * der Leiste (Bündel, werkzeugordnung.ts); die Teile schaltet man in der Karte wie Reiter um
 * (Reiterleiste unten). Zählen, Ziehen, Engine, Röntgen und Warnsignale sitzen als Symbole am
 * Brett (Brettsymbole.tsx).
 * Bedienung: Ein Tipp wählt ein Bündel, ein zweiter wählt es wieder ab (Kreuz im Knopf).
 * Eine waagerecht scrollbare Reihe statt umbrechender Zeilen (Wunsch des Autors); jedes Bündel
 * trägt ein Symbol (buendelsymbole.ts), „frühere“ und „spätere“ stehen als Schalter mit Symbol am
 * Anfang und am Ende derselben Reihe.
 * Abhängigkeiten: werkzeugordnung.ts, useWerkzeugwahl.ts, werkzeugwahltyp.ts, i18n, lucide-react.
 */
import { Bone, X, type LucideIcon } from "lucide-react";
import { t, type Textschluessel } from "../../../i18n/sprache";
import { BUENDELSYMBOL, FRUEHERE_SYMBOL, SPAETERE_SYMBOL } from "./buendelsymbole";
import type { Werkzeugwahlstand } from "./useWerkzeugwahl";
import {
  buendelname,
  leiste,
  teileVon,
  werkzeugname,
  type Buendelkennung,
} from "./werkzeugordnung";

/** Typen aus werkzeugwahltyp.ts, weitergegeben für Dateien, die sie von hier importieren. */
export type { Werkzeugkennung, Werkzeugwahl } from "./werkzeugwahltyp";

const SYMBOLGROESSE = 16;

/** Im gewählten Knopf ein Kreuz: Ein zweites Tippen wählt ab. */
function Wahlsymbol() {
  return <X className="chip-symbol" size={SYMBOLGROESSE} aria-hidden="true" />;
}

/** „frühere“ oder „spätere“ mit Symbol: schaltet Bündel anderer Kapitel zu. */
function Zuschalter({
  an,
  text,
  name,
  Symbol,
  beiKlick,
}: {
  an: boolean;
  text: Textschluessel;
  name: Textschluessel;
  Symbol: LucideIcon;
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
      <Symbol className="chip-symbol" size={SYMBOLGROESSE} aria-hidden="true" />
      {t(text)}
    </button>
  );
}

/** Ein Bündel als Knopf: Symbol, Name, bei Vorschau die Plakette „Kap. N“, gewählt ein Kreuz. */
export function Buendelknopf({
  kennung,
  name,
  gewaehlt,
  vorschau = null,
  beiKlick,
}: {
  kennung: Buendelkennung;
  name: string;
  gewaehlt: boolean;
  /** Kapitel der Einführung bei Bündeln späterer Kapitel, sonst null. */
  vorschau?: number | null;
  beiKlick: () => void;
}) {
  const Symbol = BUENDELSYMBOL[kennung];
  return (
    <button
      type="button"
      className={vorschau !== null ? "chip chip-vorschau" : "chip"}
      aria-pressed={gewaehlt}
      onClick={beiKlick}
    >
      <Symbol className="chip-symbol" size={SYMBOLGROESSE} aria-hidden="true" />
      {name}
      {vorschau !== null && (
        <span className="plakette-vorschau">
          {t("werkzeug.vorschauKapitel", { kapitel: vorschau })}
        </span>
      )}
      {gewaehlt && <Wahlsymbol />}
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
    <div
      className="werkzeugleiste"
      role="toolbar"
      aria-label={t("abbildung.werkzeuge")}
      data-tour="werkzeugleiste"
    >
      {hatFruehere && (
        <Zuschalter
          an={werkzeug.frueher}
          text="werkzeug.frueher"
          name="werkzeug.frueherName"
          Symbol={FRUEHERE_SYMBOL}
          beiKlick={werkzeug.schalteFrueher}
        />
      )}
      {buendel.map((b) => (
        <Buendelknopf
          key={b.kennung}
          kennung={b.kennung}
          name={t(b.name)}
          gewaehlt={werkzeug.buendel === b.kennung}
          vorschau={b.vorschau ? b.einfuehrung : null}
          beiKlick={() => werkzeug.tippeBuendel(b.kennung)}
        />
      ))}
      {hatSpaetere && (
        <Zuschalter
          an={werkzeug.spaeter}
          text="werkzeug.spaeter"
          name="werkzeug.spaeterName"
          Symbol={SPAETERE_SYMBOL}
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
          data-tour="reiterleiste"
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
