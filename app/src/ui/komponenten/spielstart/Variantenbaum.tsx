/**
 * Aufklappbarer Variantenbaum einer Eröffnung in der Klappe „Eröffnungen nach Spielstärke“: die
 * häufigsten Varianten nach Lichess, verzweigt ab dem ersten abweichenden Zug, mit Anteil an der
 * Eröffnung; ein Tipp legt die Variante für den Bot fest.
 *
 * Rolle im Gesamtbild: Eröffnungspaket Stufe 3 (Ideensammlung, „Nur notiert“ Nr. 2: Variantenbaum,
 * Verzweigung ab dem ersten abweichenden Zug, die häufigsten je Eröffnung nach Häufigkeit, benannt
 * nach Lichess). Rechnung in spiel/eroeffnungsbaender.ts (variantenbaum). Die Wahl ist wie jede
 * Praxis-Eröffnung „praxis:Name“. Seit Paket 9 auch mit Mehrfachauswahl (Gegnereditor: feste
 * Eröffnungen eines eigenen Bots) und Schnellwahl der häufigsten Varianten.
 * Abhängigkeiten: spiel/eroeffnungsbaender.ts, schach/notation.ts, i18n.
 */
import { sprache, t } from "../../../i18n/sprache";
import { sanInSprache } from "../../../schach/notation";
import {
  variantenbaum,
  type Bandfamilie,
  type Eroeffnungsbaender,
  type Variantenknoten,
} from "../../../spiel/eroeffnungsbaender";
import { PRAXIS_VORSILBE } from "../../../spiel/partie";
import { SCHNELLWAHL } from "../../../spiel/boteroeffnung";

/** Nachkommastellen des Anteils. */
const STELLEN = 0;

/**
 * Die Züge ab Halbzug `ab` mit Zugnummern in der Sprache der App.
 * Beispiel: "e4 e5 Nf3 Nc6 Bc4 Nf6 Ng5", ab 5 → „3... Sf6 4. Sg5“.
 */
function zuegeAb(folge: string, ab: number): string {
  return folge
    .split(" ")
    .map((san, i) => ({ san, i }))
    .slice(ab)
    .map(({ san, i }, j) => {
      const nummer = Math.floor(i / 2) + 1;
      const vorsatz = i % 2 === 0 ? `${nummer}. ` : j === 0 ? `${nummer}... ` : "";
      return `${vorsatz}${sanInSprache(san, sprache())}`;
    })
    .join(" ");
}

/**
 * Der Name ohne das, was darüber schon steht: „Italian Game: Evans Gambit“ unter der Eröffnung →
 * „Evans Gambit“; „… Two Knights Defense, Knight Attack“ unter „… Two Knights Defense“ →
 * „Knight Attack“.
 */
function kurzname(name: string, familie: string, eltern: string | null): string {
  if (eltern && name.startsWith(`${eltern}, `)) return name.slice(eltern.length + 2);
  return name.startsWith(`${familie}: `) ? name.slice(familie.length + 2) : name;
}

function Knoten({
  knoten,
  familie,
  vorher,
  eltern,
  ist,
  beiWahl,
}: {
  knoten: Variantenknoten;
  familie: string;
  /** Zugfolge darüber (Eltern oder Eröffnung); gezeigt werden nur die Züge danach. */
  vorher: string;
  /** Name der Variante darüber, null unter der Eröffnung selbst. */
  eltern: string | null;
  ist: (wert: string) => boolean;
  beiWahl: (eroeffnung: string) => void;
}) {
  const { variante, anteil, kinder } = knoten;
  const wert = `${PRAXIS_VORSILBE}${variante.name}`;
  // Über eine Zugumstellung erreicht: dann die ganze Zugfolge zeigen
  const ab = variante.folge.startsWith(`${vorher} `) ? vorher.split(" ").length : 0;
  return (
    <li>
      <button
        type="button"
        className="variantenknoten"
        aria-pressed={ist(wert)}
        onClick={() => beiWahl(wert)}
      >
        <span className="staerkewahl-name">{kurzname(variante.name, familie, eltern)}</span>
        {variante.gambit && (
          <span className="staerkewahl-marke">{t("spielen.staerkewahl.gambit")}</span>
        )}
        <span className="hinweis">
          {t("spielen.staerkewahl.variante", {
            zuege: zuegeAb(variante.folge, ab),
            anteil: anteil.toLocaleString(sprache(), { maximumFractionDigits: STELLEN }),
          })}
        </span>
      </button>
      {kinder.length > 0 && (
        <ul className="variantenbaum">
          {kinder.map((k) => (
            <Knoten
              key={k.variante.name}
              knoten={k}
              familie={familie}
              vorher={variante.folge}
              eltern={variante.name}
              ist={ist}
              beiWahl={beiWahl}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Schnellwahl im Gegnereditor: die häufigsten 3, 5 oder alle Varianten (Paket 9). */
function Schnellwahl({
  familie,
  beiSchnellwahl,
}: {
  familie: Bandfamilie;
  beiSchnellwahl: (familie: Bandfamilie, anzahl: number | null) => void;
}) {
  return (
    <div className="knopfreihe schnellwahl" data-testid="schnellwahl">
      {SCHNELLWAHL.filter((n) => n === null || n < familie.varianten.length).map((anzahl) => (
        <button
          key={String(anzahl)}
          type="button"
          className="knopf-zweit"
          onClick={() => beiSchnellwahl(familie, anzahl)}
        >
          {anzahl === null
            ? t("spielen.boteroeffnung.alleVarianten")
            : t("spielen.boteroeffnung.haeufigste", { anzahl: String(anzahl) })}
        </button>
      ))}
    </div>
  );
}

/**
 * Die Klappe „Varianten (n)“ unter einer Eröffnung. Mit `beiSchnellwahl` (Gegnereditor,
 * Mehrfachauswahl) stehen darüber Knöpfe für die häufigsten 3, 5 oder alle Varianten.
 */
export function Variantenbaum({
  daten,
  familie,
  ist,
  beiWahl,
  beiSchnellwahl,
}: {
  daten: Eroeffnungsbaender;
  familie: Bandfamilie;
  ist: (wert: string) => boolean;
  beiWahl: (eroeffnung: string) => void;
  beiSchnellwahl?: (familie: Bandfamilie, anzahl: number | null) => void;
}) {
  if (familie.varianten.length === 0) return null;
  const baum = variantenbaum(daten, familie);
  return (
    <details className="variantenklappe" data-testid="variantenbaum">
      <summary>{t("spielen.staerkewahl.varianten", { anzahl: familie.varianten.length })}</summary>
      {beiSchnellwahl && <Schnellwahl familie={familie} beiSchnellwahl={beiSchnellwahl} />}
      <ul className="variantenbaum">
        {baum.map((k) => (
          <Knoten
            key={k.variante.name}
            knoten={k}
            familie={familie.name}
            vorher={familie.folge}
            eltern={null}
            ist={ist}
            beiWahl={beiWahl}
          />
        ))}
      </ul>
    </details>
  );
}
