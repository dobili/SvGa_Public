/**
 * PGN kopieren oder als Datei sichern, für eine Variante oder alle.
 *
 * Rolle im Gesamtbild: Frage g (Empfehlung C): Export als PGN, die Lichess als Studie liest. Wie
 * die Knöpfe der Lernsammlung (bildschirme/Lernsammlung.tsx): Kopieren in die Zwischenablage,
 * sonst der Text zum Markieren; Sichern als Datei mit Datum im Namen.
 * Abhängigkeiten: dateiAnbieten.ts, spiel/pgn.ts (Datum), Knopfsymbol, i18n.
 */
import { useState } from "react";
import { t } from "../../../i18n/sprache";
import { pgnDatum } from "../../../spiel/pgn";
import { bieteDateiAn } from "../bausteine/dateiAnbieten";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { dateiteil } from "./variantentexte";

/** Zwei Knöpfe; ``name`` ergibt den Dateinamen („varianten-petroff-falle-2026-11-01.pgn“). */
export function PgnTeilen({ text, name }: { text: string; name: string }) {
  const [meldung, setzeMeldung] = useState<"kopiert" | "nichtKopiert" | null>(null);
  const kopiere = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setzeMeldung("kopiert");
    } catch (fehler) {
      console.warn("Zwischenablage nicht verfügbar:", fehler);
      setzeMeldung("nichtKopiert");
    }
  };
  const datei = `varianten-${dateiteil(name)}-${pgnDatum(new Date().toISOString(), "-")}.pgn`;
  return (
    <div className="pgn" data-tour="varianten-pgn">
      <div className="knopfreihe">
        <button type="button" className="knopf-zweit" onClick={() => void kopiere()}>
          <Knopfsymbol art="kopieren" />
          {t("varianten.pgn.kopieren")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => bieteDateiAn(text, datei, "application/vnd.chess-pgn")}
        >
          <Knopfsymbol art="herunterladen" />
          {t("varianten.pgn.sichern")}
        </button>
      </div>
      {meldung && <p className="hinweis">{t(`varianten.pgn.${meldung}`)}</p>}
      {meldung === "nichtKopiert" && <pre className="vorformatiert">{text}</pre>}
    </div>
  );
}
