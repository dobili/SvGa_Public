/**
 * Blinde Flecken eines eigenen Gegners oder der eigenen Stufe als Kacheln mit Zeichen (seit
 * 0.2.129, Vorschlag DS38, vom Autor am 25.10.2026 freigegeben).
 *
 * Rolle im Gesamtbild: Ersetzt die Abhakliste der blinden Flecken und ihre gesperrten Regler im
 * erweiterten Modus (bis 0.2.128). Jede Kachel zeigt Zeichen, Namen und Stufe; ein Tipp schaltet
 * weiter: aus → selten → normal → oft → sehr oft → aus (normal = wie Menschen seiner Stärke).
 * Eine unmenschliche Stufe aus älteren Daten bleibt sichtbar, bis man weiterschaltet.
 * Abhängigkeiten: fehlerprofil.ts, engine/blindeFlecken.ts, i18n, lucide-react.
 */
import {
  ArrowLeftRight,
  ChessBishop,
  ChessKnight,
  ChessPawn,
  ChessQueen,
  ChessRook,
  Moon,
  PanelBottom,
  ScanEye,
  Split,
  Undo2,
  type LucideIcon,
} from "lucide-react";
import { BLINDE_FLECKEN, type BlinderFleck } from "../../engine/blindeFlecken";
import type { EigenerGegner } from "../../engine/gegner";
import { t } from "../../i18n/sprache";
import { naechsterFleckstand, setzeStufe, stufenwort, stufeVon } from "./fehlerprofil";

const ZEICHENGROESSE = 24;

/** Zeichen je Fleck: Figur der Zugart, sonst ein Bild der Bewegung. */
const FLECKZEICHEN: Readonly<Record<BlinderFleck, LucideIcon>> = {
  rueckzug: Undo2,
  diagonale: ChessBishop,
  springer: ChessKnight,
  dame: ChessQueen,
  turm: ChessRook,
  ruhig: Moon,
  abzug: Split,
  bauer: ChessPawn,
  roentgen: ScanEye,
  zwischenzug: ArrowLeftRight,
  grundreihe: PanelBottom,
};

/** Klasse für die Farbe der Kachel: aus, an, stark (oft und mehr). */
function stand(stufe: number | null): string {
  if (stufe === null) return "aus";
  return stufe >= 1 ? "stark" : "an";
}

/**
 * Die Kacheln aller blinden Flecken. Beispiel: Tipp auf „Zwischenzüge“ (aus) → „selten“.
 */
export function Fleckenkacheln({
  g,
  setze,
}: {
  g: EigenerGegner;
  setze: (g: EigenerGegner) => void;
}) {
  return (
    <div className="fleckenkacheln" data-testid="blinde-flecken">
      <p className="hinweis">{t("spielen.profil.fleckenHinweis")}</p>
      <div className="fleckenraster">
        {BLINDE_FLECKEN.map((fleck) => {
          const stufe = stufeVon(g, fleck);
          const Zeichen = FLECKZEICHEN[fleck];
          const name = t(`blind.${fleck}`);
          return (
            <button
              key={fleck}
              type="button"
              className={`fleckkachel fleck-${stand(stufe)}`}
              aria-label={`${name}: ${stufenwort(stufe)}`}
              onClick={() => setze(setzeStufe(g, fleck, naechsterFleckstand(stufe)))}
            >
              <Zeichen size={ZEICHENGROESSE} aria-hidden="true" />
              <span className="fleckkachel-name">{name}</span>
              <span className="fleckkachel-stand">{stufenwort(stufe)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
