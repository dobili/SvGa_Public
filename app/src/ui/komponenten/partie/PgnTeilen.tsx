/**
 * Inhalt des Blattes „Teilen“: die Partie als PGN kopieren oder als Datei sichern.
 *
 * Rolle im Gesamtbild: Bis zur Auswertung neu (31.10.2026) standen die beiden Knöpfe ganz oben in
 * der Auswertung (Wunsch des Autors vom 25.10.2026: Export sucht man nicht mitten im Text). Im
 * Entwurf F2 stehen sie in einem Blatt hinter „Teilen“ unten (Partieabschluss.tsx), als Liste mit
 * Symbol. Die PGN trägt Zugzeichen und die absichtlichen Fehler der Engine als Kommentar.
 * Abhängigkeiten: spiel/pgn.ts, engine/stufen.ts, bausteine/dateiAnbieten.ts, profil, i18n, lucide.
 */
import { Download, ListOrdered } from "lucide-react";
import { useState } from "react";
import { stufe } from "../../../engine/stufen";
import { t } from "../../../i18n/sprache";
import { enginefehler, type Zugurteil } from "../../../spiel/auswertung";
import type { Partie } from "../../../spiel/partie";
import { alsPgn } from "../../../spiel/pgn";
import { useSpielerprofil } from "../../profil/spieler";
import { bieteDateiAn } from "../bausteine/dateiAnbieten";

const SYMBOLGROESSE = 20;

/** Der PGN-Text mit Kopf, Zugzeichen und Kommentaren zu den Fehlern der Engine. */
function usePgnText(partie: Partie, urteile: readonly Zugurteil[]): string {
  const profil = useSpielerprofil();
  const s = stufe(partie.einstellung.stufe);
  const kommentare = new Map(
    enginefehler(partie).map((f) => [
      f.index,
      t("pgn.fehler", { fehler: t(`fehlerart.${f.fehler}`) }),
    ]),
  );
  const zeichen = new Map(
    urteile.flatMap((u) => (u.zeichen ? [[u.index, u.zeichen] as const] : [])),
  );
  const mensch = partie.einstellung.gegner === "mensch";
  const kopf = {
    ereignis: mensch
      ? t("pgn.ereignisMensch")
      : t("pgn.ereignis", { nummer: s.nummer, name: t(s.name) }),
    // Seit 0.2.140 der Name aus dem Profil, sonst „Leser“.
    leser: mensch ? t("pgn.weiss") : profil.name || t("pgn.leser"),
    engine: mensch ? t("pgn.schwarz") : t("pgn.engine", { nummer: s.nummer }),
  };
  return alsPgn(partie, kopf, kommentare, zeichen);
}

/**
 * Zwei Zeilen: „PGN kopieren“ und „PGN als Datei sichern“; darunter die Meldung, ohne
 * Zwischenablage die PGN zum Markieren.
 */
export function PgnTeilen({ partie, urteile }: { partie: Partie; urteile: readonly Zugurteil[] }) {
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const text = usePgnText(partie, urteile);
  const kopiere = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setzeMeldung(t("pgn.kopiert"));
    } catch (fehler) {
      console.warn("Zwischenablage nicht verfügbar:", fehler);
      setzeMeldung(t("pgn.nichtKopiert"));
    }
  };
  const datei = `partie-${partie.begonnen.slice(0, "JJJJ-MM-TT".length)}.pgn`;
  return (
    <div className="pgn blattliste" data-testid="pgn-teilen">
      <button type="button" className="blattzeile" onClick={() => void kopiere()}>
        <ListOrdered size={SYMBOLGROESSE} aria-hidden="true" />
        {t("pgn.kopieren")}
      </button>
      <button
        type="button"
        className="blattzeile"
        onClick={() => bieteDateiAn(text, datei, "application/vnd.chess-pgn")}
      >
        <Download size={SYMBOLGROESSE} aria-hidden="true" />
        {t("pgn.sichern")}
      </button>
      {meldung && (
        <p className="hinweis" role="status">
          {meldung}
        </p>
      )}
      {meldung === t("pgn.nichtKopiert") && <pre className="vorformatiert">{text}</pre>}
    </div>
  );
}
