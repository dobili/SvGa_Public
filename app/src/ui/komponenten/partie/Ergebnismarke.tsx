/**
 * Ergebnis einer Partie als Marke mit Zeichen und Farbe aus Sicht des Lesers (seit 0.2.101,
 * Symbolsprache DS25).
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 19.10.2026, Listen ohne Lesen erfassbar zu machen.
 * In der Partienliste stand bisher nur „1–0“; ob das ein Sieg war, hing an der Farbe, die man
 * gespielt hatte. Jetzt: Pokal auf Gold für einen Sieg, Händedruck auf Grau für Remis, Kreuz in Rot
 * für eine Niederlage, die Schachschreibweise bleibt daneben. Bei Mensch gegen Mensch gibt es kein
 * „du“, die Marke bleibt neutral. Farbe ist nie das einzige Merkmal (Zeichen und Wort im
 * Bildschirmleser, WCAG 1.4.1).
 * Abhängigkeiten: spiel/partienfilter.ts, i18n, lucide-react.
 */
import { CircleX, Handshake, Trophy, type LucideIcon } from "lucide-react";
import { t } from "../../../i18n/sprache";
import type { Partie } from "../../../spiel/partie";
import { ergebnisFuerLeser } from "../../../spiel/partienfilter";

/** Größe des Zeichens in der Liste und am Partieende (Bildpunkte). */
const GROESSE_KLEIN = 14;
const GROESSE_GROSS = 22;

const ZEICHEN: Readonly<Record<"gewonnen" | "remis" | "verloren", LucideIcon>> = {
  gewonnen: Trophy,
  remis: Handshake,
  verloren: CircleX,
};

/** Ergebnis in der Schreibweise des Schachs: „1–0“, „0–1“, „½–½“; „läuft“ ohne Ende. */
function ergebniszeichen(partie: Partie): string {
  const ende = partie.ende;
  if (!ende) return t("spielen.laeuftKurz");
  if (!("sieger" in ende)) return "½–½";
  return ende.sieger === "white" ? "1–0" : "0–1";
}

/**
 * Marke mit Zeichen und „1–0“; `gross` nur das Zeichen in größerem Kreis (Partieende).
 * Beispiel: Leser mit Schwarz gewinnt → goldene Marke mit Pokal und „0–1“, vorgelesen „Sieg, 0–1“.
 */
export function Ergebnismarke({ partie, gross = false }: { partie: Partie; gross?: boolean }) {
  const ergebnis = ergebnisFuerLeser(partie);
  const Bild = ergebnis ? ZEICHEN[ergebnis] : null;
  const art = ergebnis ?? "neutral";
  if (gross) {
    if (!Bild) return null;
    return (
      <span className={`ergebnismarke-gross ergebnis-${art}`} aria-hidden="true">
        <Bild size={GROESSE_GROSS} />
      </span>
    );
  }
  return (
    <span className={`ergebnismarke ergebnis-${art}`}>
      {Bild && <Bild size={GROESSE_KLEIN} aria-hidden="true" />}
      {ergebnis && <span className="nur-vorlesen">{t(`spielen.ergebnis.${ergebnis}`)}, </span>}
      {ergebniszeichen(partie)}
    </span>
  );
}
