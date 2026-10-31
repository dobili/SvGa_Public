/**
 * Eine Zeile der Einstellungen: Symbol, Name, Fragezeichen mit Erklärung, rechts der Schalter oder
 * ein Wert; dazu der Schalter an/aus als eigener Baustein.
 *
 * Rolle im Gesamtbild: Entwurf K2 „Brettvorschau oben“ (Wahl des Autors, 31.10.2026): Die
 * Einstellungen wirkten wie ein Formular mit vielen Chips „an/aus“ und dauerhaft sichtbaren
 * Erklärungen. Jetzt hat jede Einstellung eine Zeile; die Erklärung steht hinter dem Fragezeichen
 * (wie MitInfo, InfoKnopf.tsx) und ist anfangs eingeklappt. Ein Schalter ist für Bildschirmleser
 * ein „switch“ mit dem Namen der Zeile.
 * Abhängigkeiten: React, Lucide-Symbole, i18n.
 */
import { ChevronRight, CircleHelp, type LucideIcon } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { t } from "../../../i18n/sprache";

/** Größe des Symbols links in der Zeile. */
const SYMBOLGROESSE = 21;
/** Größe des Fragezeichens und des Pfeils rechts. */
const KLEINES_SYMBOL = 18;

/**
 * Schalter an/aus (role „switch“). Beispiel: „Koordinaten“ an; ein Tipp schaltet aus.
 * Eingaben: Name für Bildschirmleser, Zustand, Wechsel. Sonderfall: ohne Namen nur mit
 * `beschriftetVon` (Kennung der sichtbaren Beschriftung).
 */
export function Schalter({
  name,
  beschriftetVon,
  an,
  beiWechsel,
}: {
  name?: string;
  beschriftetVon?: string;
  an: boolean;
  beiWechsel: (an: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={an}
      aria-label={name}
      aria-labelledby={beschriftetVon}
      className="schalter"
      onClick={() => beiWechsel(!an)}
    >
      <span className="schalter-knopf" aria-hidden="true" />
    </button>
  );
}

/** Rechts ein leiser Wert und ein Pfeil, wie in einer Liste, die eine Unterseite öffnet. */
export function Wertpfeil({ wert }: { wert: ReactNode }) {
  return (
    <span className="einstellungszeile-wert">
      {wert}
      <ChevronRight size={KLEINES_SYMBOL} aria-hidden="true" />
    </span>
  );
}

/** Das Fragezeichen der Zeile; die Erklärung erscheint unter der Zeile. */
function Fragezeichen({
  thema,
  offen,
  kennung,
  beiWechsel,
}: {
  thema: string;
  offen: boolean;
  kennung: string;
  beiWechsel: () => void;
}) {
  return (
    <button
      type="button"
      className="infoknopf"
      aria-expanded={offen}
      aria-controls={kennung}
      aria-label={t("info.erklaerung", { thema })}
      onClick={beiWechsel}
    >
      <CircleHelp size={KLEINES_SYMBOL} aria-hidden="true" />
    </button>
  );
}

/**
 * Eine Zeile: Symbol, Name, wahlweise Fragezeichen mit Erklärung, rechts ein Bedienelement; darunter
 * wahlweise weitere Bedienung (`unten`, etwa die Chips des Nachtmodus).
 * Beispiel: Symbol Hand, „Figuren per Wischen ziehen“, Fragezeichen, Schalter an.
 */
export function Einstellungszeile({
  symbol: Symbol,
  name,
  namenskennung,
  erklaerung,
  rechts,
  unten,
}: {
  symbol: LucideIcon;
  name: string;
  /** Kennung des Namens, damit ein Schalter ihn als Beschriftung nutzen kann. */
  namenskennung?: string;
  erklaerung?: string;
  rechts?: ReactNode;
  unten?: ReactNode;
}) {
  const [offen, setzeOffen] = useState(false);
  const kennung = useId();
  return (
    <div className="einstellungszeile">
      <div className="einstellungszeile-oben">
        <Symbol className="einstellungszeile-symbol" size={SYMBOLGROESSE} aria-hidden="true" />
        <span className="einstellungszeile-name" id={namenskennung}>
          {name}
        </span>
        {erklaerung && (
          <Fragezeichen
            thema={name}
            offen={offen}
            kennung={kennung}
            beiWechsel={() => setzeOffen(!offen)}
          />
        )}
        {rechts}
      </div>
      {offen && erklaerung && (
        <p id={kennung} className="hinweis einstellungszeile-erklaerung">
          {erklaerung}
        </p>
      )}
      {unten}
    </div>
  );
}
