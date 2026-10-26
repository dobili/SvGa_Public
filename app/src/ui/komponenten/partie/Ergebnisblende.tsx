/**
 * Ergebnis der Partie kurz und groß direkt auf dem Brett: „Gewonnen!“, „Remis“, „Verloren“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (R38, 23.10.2026). Endet die Partie, erscheint die
 * Meldung animiert über dem Brett und verschwindet nach knapp drei Sekunden von selbst; die Karte
 * „Partieende“ darunter (Partieende.tsx) bleibt wie bisher. Nur wenn die Partie gerade endet,
 * nicht beim Öffnen einer beendeten Partie aus der Liste. Für Bildschirmleser zählt die Karte;
 * die Blende ist nur Bild (aria-hidden), sonst hörte man das Ergebnis doppelt.
 * Seit 0.2.144 (Wunsch des Autors, 25.10.2026): Ein Sieg feiert mit einem kleinen Feuerwerk und,
 * bei eingeschaltetem Ton, einem kurzen steigenden Klang; Remis und Niederlage bleiben ruhig (das
 * Schild sinkt sanft, das Brett wird bei einer Niederlage etwas dunkler), ohne Feier.
 * Abhängigkeiten: spiel/partienfilter.ts, Ergebnismarke.tsx, Feuerwerk.tsx, partietexte.ts,
 * app/ton.ts, app/einstellungen.ts, i18n.
 */
import { useEffect, useState } from "react";
import { useEinstellungen } from "../../../app/einstellungen";
import { spieleKlang } from "../../../app/ton";
import { Feuerwerk } from "../bausteine/Feuerwerk";
import { t } from "../../../i18n/sprache";
import type { Partie } from "../../../spiel/partie";
import { ergebnisFuerLeser } from "../../../spiel/partienfilter";
import { Ergebnismarke } from "./Ergebnismarke";
import { kurzergebnis } from "./partietexte";

/**
 * So lange steht die Meldung auf dem Brett (ms): 0,25 s Warten auf die Zuganimation und 2,8 s
 * Ein- und Ausblenden wie in brett.css.
 */
export const ERGEBNISBLENDE_MS = 3050;
/** Der Siegesklang folgt dem Klang des Endes (Matt, app/ton.ts) mit etwas Abstand (ms). */
const SIEGESKLANG_NACH_MS = 700;

/** Das große Wort der Blende; bei Partien zu zweit, wer gewonnen hat. */
function ergebniswort(partie: Partie): string {
  const ergebnis = ergebnisFuerLeser(partie);
  if (ergebnis) return t(`brett.ergebnis.${ergebnis}`);
  const ende = partie.ende;
  if (ende && "sieger" in ende) return t(`brett.ergebnis.sieg.${ende.sieger}`);
  return t("brett.ergebnis.remis");
}

/**
 * Zeigt die Blende, sobald die Partie während des Zusehens endet.
 *
 * Eingaben: die Partie. Ausgabe: Blende oder nichts.
 * Beispiel: 2. g4?? Dh4# → „Verloren“ mit rotem Kreuz und darunter „Matt. Die Engine hat
 * gewonnen.“, nach gut 3 s weg. Sonderfall: Eine schon beendete Partie öffnen zeigt nichts; eine
 * Rücknahme nach dem Ende und ein neues Ende zeigen sie wieder.
 */
export function Ergebnisblende({ partie }: { partie: Partie }) {
  const beendet = partie.ende !== null;
  const [warBeendet, setzeWarBeendet] = useState(beendet);
  const [sichtbar, setzeSichtbar] = useState(false);
  // Übergang laufend → beendet beim Zeichnen erkennen (abgeleiteter Zustand, kein Effekt).
  if (beendet !== warBeendet) {
    setzeWarBeendet(beendet);
    setzeSichtbar(beendet);
  }
  const { ton } = useEinstellungen();
  const art = ergebnisFuerLeser(partie) ?? "neutral";
  useEffect(() => {
    if (!sichtbar) return;
    const zeit = setTimeout(() => setzeSichtbar(false), ERGEBNISBLENDE_MS);
    const klang =
      art === "gewonnen" && ton === "an"
        ? setTimeout(() => spieleKlang("sieg"), SIEGESKLANG_NACH_MS)
        : undefined;
    return () => {
      clearTimeout(zeit);
      clearTimeout(klang);
    };
  }, [sichtbar, art, ton]);
  if (!sichtbar || !partie.ende) return null;
  return (
    <div className={`ergebnisblende ergebnisblende-${art}`} aria-hidden="true">
      {art === "gewonnen" && <Feuerwerk umfang="klein" />}
      <div className="ergebnisblende-schild" data-testid="ergebnisblende">
        <Ergebnismarke partie={partie} gross />
        <span className="ergebnisblende-wort">{ergebniswort(partie)}</span>
        <span className="ergebnisblende-grund">{kurzergebnis(partie)}</span>
      </div>
    </div>
  );
}
