/**
 * Infoblase: ein ⓘ am Ende einer Zeile (meist einer Überschrift); ein Tipp öffnet darunter eine
 * Sprechblase mit dem Text, der vorher dauerhaft dastand.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“ (Wahl des Autors, 31.10.2026): Junge Nutzer schreckt
 * viel Text ab. Erklärungen, die bleiben müssen (Wertungsregeln, Einleitungen, Lizenzzeilen),
 * wandern hinter ein ⓘ. Der ältere Baustein MitInfo (InfoKnopf.tsx) zeigt ein Fragezeichen und
 * klappt einen Absatz mit Goldstrich auf; diese Blase hat das allgemein bekannte ⓘ und einen
 * kleinen Pfeil zum Knopf, wie in den Entwürfen P1 bis P15. Der Knopf hat einen Namen
 * („Erklärung: …“) und sagt mit aria-expanded, ob die Blase offen ist.
 * Abhängigkeiten: React, lucide-react, i18n, Stil in ui/stil/wenigertext-seiten.css.
 */
import { Info } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import "../../stil/wenigertext-seiten.css";

/** Größe des ⓘ (Bildpunkte). */
const SYMBOLGROESSE = 20;

/**
 * Nur der Knopf ⓘ; für Stellen, an denen Zeile und Blase getrennt stehen (Partiekopf).
 * Beispiel: <Infoknopf thema="Gegner" offen={offen} steuert={id} beiTipp={schalte} />.
 */
export function Infoknopf({
  thema,
  offen,
  steuert,
  beiTipp,
}: {
  /** Wofür die Erklärung ist (Bildschirmleser: „Erklärung: …“). */
  thema: string;
  offen: boolean;
  /** Kennung der Blase (aria-controls). */
  steuert: string;
  beiTipp: () => void;
}) {
  return (
    <button
      type="button"
      className="infoknopf infoblase-knopf"
      aria-expanded={offen}
      aria-controls={steuert}
      aria-label={t("info.erklaerung", { thema })}
      onClick={beiTipp}
    >
      <Info size={SYMBOLGROESSE} aria-hidden="true" />
    </button>
  );
}

/**
 * Die Blase selbst; der Pfeil zeigt nach oben rechts zum Knopf, mit `links` nach oben links
 * (Sprechblase am Porträt im Partiekopf).
 */
export function Blase({
  id,
  links = false,
  children,
}: {
  id: string;
  links?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      className={links ? "infoblase infoblase-links" : "infoblase"}
      data-testid="infoblase"
    >
      {children}
    </div>
  );
}

/**
 * Zeile mit ⓘ am Ende; darunter die Blase, wenn offen.
 * Beispiel: <MitInfoblase zeile={<h2>Deine Wertung</h2>} thema="Deine Wertung"
 * erklaerung={<p>Es zählen Partien …</p>} /> → Überschrift mit ⓘ, ein Tipp zeigt die Regeln.
 * Sonderfall: `klasse` setzt eine zusätzliche Klasse auf die Hülle (Abstände je Ort).
 */
export function MitInfoblase({
  zeile,
  erklaerung,
  thema,
  klasse = "",
}: {
  zeile: ReactNode;
  erklaerung: ReactNode;
  thema: string;
  klasse?: string;
}) {
  const [offen, setzeOffen] = useState(false);
  const kennung = useId();
  return (
    <div className={`mitinfoblase ${klasse}`.trim()}>
      <div className="mitinfoblase-zeile">
        <div className="mitinfoblase-text">{zeile}</div>
        <Infoknopf
          thema={thema}
          offen={offen}
          steuert={kennung}
          beiTipp={() => setzeOffen(!offen)}
        />
      </div>
      {offen && <Blase id={kennung}>{erklaerung}</Blase>}
    </div>
  );
}
