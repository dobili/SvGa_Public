/**
 * Der Eröffnungsbaum im Bildschirm „Steckbriefe“ (Entwurf H2): Züge als goldene Marken, Äste als
 * Linien, an jedem Ende einer Kennzugfolge die Eröffnung als Karte mit kleinem Brett.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (31.10.2026), die Steckbriefe weniger wie ein Formular
 * zu zeigen. Einsteiger sehen auf einen Blick, welche Eröffnung aus welchen Zügen entsteht. Der
 * Baum kommt aus eroeffnungsbaum.ts (aus den Buchdaten); ein Tipp auf eine Karte öffnet den
 * vollständigen Steckbrief.
 * Abhängigkeiten: eroeffnungsbaum.ts, ui/brett, i18n.
 */
import { istTextschluessel, sprache, t } from "../../../i18n/sprache";
import { Brett } from "../../brett/Brett";
import { charakterKurz, fenNach, zugbeschriftung, type Baumknoten } from "./eroeffnungsbaum";
import type { Steckbrief } from "./steckbriefteile";

type Knoten = Baumknoten<Steckbrief>;
type BeiWahl = (steckbrief: Steckbrief) => void;

/** Unterzeile einer Karte: Charakter in wenigen Worten und Abschnitt im Buch. */
function unterzeile(steckbrief: Steckbrief): string {
  const charakter = charakterKurz(steckbrief, t("nachschlagenneu.steckbriefe.charakterFrage"));
  const abschnitt = steckbrief.abschnitt
    ? t("steckbrief.abschnitt", { nummer: steckbrief.abschnitt })
    : null;
  return [charakter, abschnitt].filter(Boolean).join(" · ");
}

/** Eine Eröffnung als Karte mit Brett der Stellung nach ihren Kennzügen. */
function Blatt({
  knoten,
  steckbrief,
  beiWahl,
}: {
  knoten: Knoten;
  steckbrief: Steckbrief;
  beiWahl: BeiWahl;
}) {
  const zuege = zugbeschriftung({ ...knoten, zuege: knoten.pfad }, sprache());
  return (
    <button
      type="button"
      className="baum-blatt"
      data-testid="steckbrief"
      onClick={() => beiWahl(steckbrief)}
    >
      <span className="baum-brett" aria-hidden="true">
        <Brett
          fen={fenNach(knoten.pfad)}
          markierungen={[]}
          koordinaten={false}
          beschriftung={t("nachschlagenneu.steckbriefe.stellung", { zuege })}
        />
      </span>
      <span className="baum-blatt-text">
        <strong>{steckbrief.name}</strong>
        <small>{unterzeile(steckbrief)}</small>
      </span>
    </button>
  );
}

/** Ein Knoten: seine Zugmarke, die Eröffnungen, die hier enden, und darunter seine Äste. */
function Zweig({
  knoten,
  beiWahl,
  wurzel = false,
}: {
  knoten: Knoten;
  beiWahl: BeiWahl;
  wurzel?: boolean;
}) {
  const marke = zugbeschriftung(knoten, sprache());
  const namensschluessel = `nachschlagenneu.steckbriefe.name.${knoten.zuege.join("-")}`;
  const name = wurzel && istTextschluessel(namensschluessel) ? t(namensschluessel) : null;
  return (
    <>
      <div className={wurzel ? "baum-zeile baum-wurzel" : "baum-zeile"}>
        <span className="baum-zug">{marke}</span>
        {name && <span className="hinweis">{name}</span>}
        {knoten.eintraege.map((s) => (
          <Blatt key={s.name} knoten={knoten} steckbrief={s} beiWahl={beiWahl} />
        ))}
      </div>
      {knoten.kinder.length > 0 && (
        <ul className="baum-ast">
          {knoten.kinder.map((kind) => (
            <li key={kind.zuege.join(" ")} className="baum-knoten">
              <Zweig knoten={kind} beiWahl={beiWahl} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

/** Der ganze Baum: je erstem Zug von Weiß ein Stamm (1. e4, 1. d4 …). */
export function Eroeffnungsbaum({
  wurzeln,
  beiWahl,
}: {
  wurzeln: readonly Knoten[];
  beiWahl: BeiWahl;
}) {
  return (
    <div className="eroeffnungsbaum">
      {wurzeln.map((w) => (
        <section key={w.zuege.join(" ")} className="baum-stamm">
          <Zweig knoten={w} beiWahl={beiWahl} wurzel />
        </section>
      ))}
    </div>
  );
}
