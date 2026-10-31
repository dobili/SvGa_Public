/**
 * Grauer Statuschip „⊘ Nur bei Angebot“ für Werkzeuge, die in der Stellung nicht greifen; der
 * ganze Satz steht hinter dem Infoknopf.
 *
 * Rolle im Gesamtbild: Runde „Weniger Text“, P9 (Wahl des Autors, 31.10.2026). Den Kurzgrund
 * setzt leerfall.ts (Feld `status` des Ergebnisses), den Satz liefert das Fazit wie bisher
 * („Die Zielbilanz gilt in Eröffnung und Mittelspiel. Hier nicht: Es ist Endspiel.“). Für
 * Bildschirmleser trägt der Chip den Kurzgrund mit „Greift hier nicht“ davor.
 * Abhängigkeiten: bausteine/InfoKnopf.tsx (MitInfo), lucide-react, i18n.
 */
import { Ban } from "lucide-react";
import { MitInfo } from "../komponenten/bausteine/InfoKnopf";
import { t } from "../../i18n/sprache";

const SYMBOLGROESSE = 16;

/**
 * Chip mit Verbotszeichen und Kurzgrund, dazu ⓘ mit dem ganzen Satz.
 * Beispiel: Prüffragen ohne Angebot → „⊘ Nur bei Angebot“, ⓘ: „Kein Material im Angebot …“.
 */
export function Statuschip({ kurz, satz }: { kurz: string; satz: string }) {
  return (
    <div className="statuszeile" data-testid="werkzeug-status">
      <MitInfo
        thema={kurz}
        zeile={
          <span
            className="statuschip"
            role="img"
            aria-label={t("wenigertext.werkzeug.status.name", { kurz })}
          >
            <Ban size={SYMBOLGROESSE} aria-hidden="true" />
            <span aria-hidden="true">{kurz}</span>
          </span>
        }
        erklaerung={<p>{satz}</p>}
      />
    </div>
  );
}
