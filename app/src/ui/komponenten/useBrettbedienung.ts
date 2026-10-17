/**
 * Was ein Tipp aufs Brett bedeutet: Feld zählen oder eine Figur ziehen, samt Umwandlung.
 *
 * Rolle im Gesamtbild: Teil des Abbildung-Bildschirms. Mit „Zählen“ zählt ein Tipp das Feld (wie
 * im Durchstich), mit „Ziehen“ wählt der erste Tipp eine Figur und der zweite ihr Zielfeld
 * (Konzept 10.2, „Tippen auf Figur und Zielfeld“). Eine Wahl gilt nur für die Stellung, in der sie
 * getroffen wurde: Nach einem Schritt in der Zugleiste ist sie von selbst aufgehoben.
 * Seit 0.2.29 ist anfangs kein Werkzeug gewählt (Wunsch des Autors); seit 0.2.30 bewirkt ein Tipp
 * aufs Brett dann nichts. Seit 0.2.58: Ein Tipp auf eine eigene Figur, die nicht ziehen darf
 * (Schach, Fesselung, blockiert), leuchtet kurz rot auf, mit Warnton und Satz unter dem Brett.
 * Abhängigkeiten: schach/weiterspielen.ts, useNachspielen.ts, app/ton.ts.
 */
import { useCallback, useEffect, useState } from "react";
import { useEinstellungen } from "../../app/einstellungen";
import { spieleKlang } from "../../app/ton";
import type { Rolle } from "../../schach/stellung";
import { legaleZiele, zugsperre, type Zugsperre } from "../../schach/weiterspielen";

/** So lange leuchtet eine gesperrte Figur rot (ms). */
const SPERRE_SICHTBAR_MS = 900;
import type { Nachspielstand } from "./useNachspielen";
import type { Werkzeugwahl } from "./Werkzeugleiste";

/** Ein Feld, gemerkt zusammen mit der Stellung, in der es angetippt wurde. */
interface Gemerkt {
  readonly fen: string;
  readonly feld: string;
}

export interface Brettbedienung {
  /** Das gezählte Feld (nur bei „Zählen“). */
  readonly zaehlfeld: string | null;
  /** Das hervorgehobene Feld: gezähltes Feld oder gewählte Figur. */
  readonly ausgewaehlt: string | null;
  /** Zielfelder der gewählten Figur. */
  readonly ziele: readonly string[];
  /** Zuletzt angetippte Figur, die nicht ziehen darf, mit Grund; null nach kurzer Zeit. */
  readonly gesperrt: { readonly feld: string; readonly grund: Zugsperre } | null;
  /** Offene Umwandlung: Der Bauer steht vor der letzten Reihe, die Figur fehlt noch. */
  readonly umwandlungOffen: boolean;
  readonly beiFeld: (feld: string) => void;
  /** Vergisst Zählfeld und gewählte Figur (beim Abwählen des Werkzeugs). */
  readonly vergiss: () => void;
  readonly waehleUmwandlung: (rolle: Rolle | null) => void;
}

/**
 * Verwaltet Zählfeld, gewählte Figur und offene Umwandlung.
 *
 * Eingaben: gezeigte Stellung und Zugfunktion (Nachspielen oder Partie gegen die Engine),
 * gewähltes Werkzeug, Umschalten des Werkzeugs.
 * Sonderfälle: Ohne Werkzeug bewirkt ein Tipp nichts; mit einem anderen Werkzeug als „Ziehen“
 * schaltet er auf „Zählen“ um (wie bisher bei der Engine).
 */
export function useBrettbedienung(
  stand: Pick<Nachspielstand, "fen" | "spiele">,
  wahl: Werkzeugwahl | null,
  setzeWahl: (wahl: Werkzeugwahl) => void,
): Brettbedienung {
  const [gezaehlt, setzeGezaehlt] = useState<Gemerkt | null>(null);
  const [gewaehlt, setzeGewaehlt] = useState<Gemerkt | null>(null);
  const [umwandlung, setzeUmwandlung] = useState<(Gemerkt & { nach: string }) | null>(null);
  const [gesperrt, setzeGesperrt] = useState<(Gemerkt & { grund: Zugsperre }) | null>(null);
  const { ton } = useEinstellungen();
  useEffect(() => {
    if (!gesperrt) return;
    const zeit = setTimeout(() => setzeGesperrt(null), SPERRE_SICHTBAR_MS);
    return () => clearTimeout(zeit);
  }, [gesperrt]);
  const hier = (gemerkt: Gemerkt | null) => (gemerkt?.fen === stand.fen ? gemerkt.feld : null);
  const zaehlfeld = wahl === "zaehlen" ? hier(gezaehlt) : null;
  const figur = wahl === "ziehen" ? hier(gewaehlt) : null;
  const ziele = figur ? legaleZiele(stand.fen, figur) : [];

  const ziehe = (feld: string) => {
    if (figur && ziele.includes(feld)) {
      if (stand.spiele(figur, feld) === "umwandlung") {
        setzeUmwandlung({ fen: stand.fen, feld: figur, nach: feld });
      }
      setzeGewaehlt(null);
      return;
    }
    const eigeneFigur = legaleZiele(stand.fen, feld).length > 0;
    setzeGewaehlt(eigeneFigur && feld !== figur ? { fen: stand.fen, feld } : null);
    const grund = eigeneFigur ? null : zugsperre(stand.fen, feld);
    if (grund) {
      setzeGesperrt({ fen: stand.fen, feld, grund });
      if (ton === "an") spieleKlang("warnung");
    }
  };
  const beiFeld = (feld: string) => {
    if (wahl === "ziehen") {
      ziehe(feld);
      return;
    }
    // Ohne Werkzeug geschieht nichts (Wunsch des Autors nach dem Test von 0.2.29); mit einem
    // anderen Werkzeug als Zählen oder Ziehen schaltet der Tipp auf Zählen um.
    if (wahl === null) return;
    setzeWahl("zaehlen");
    setzeGezaehlt(feld === zaehlfeld ? null : { fen: stand.fen, feld });
  };
  // Stabil über alle Darstellungen, damit der Tipp auf den Hintergrund nicht ständig neu lauscht.
  const vergiss = useCallback(() => {
    setzeGezaehlt(null);
    setzeGewaehlt(null);
  }, []);
  const waehleUmwandlung = (rolle: Rolle | null) => {
    if (rolle && umwandlung?.fen === stand.fen)
      stand.spiele(umwandlung.feld, umwandlung.nach, rolle);
    setzeUmwandlung(null);
  };
  return {
    zaehlfeld,
    ausgewaehlt: zaehlfeld ?? figur,
    ziele,
    gesperrt: gesperrt?.fen === stand.fen ? { feld: gesperrt.feld, grund: gesperrt.grund } : null,
    umwandlungOffen: umwandlung?.fen === stand.fen,
    beiFeld,
    vergiss,
    waehleUmwandlung,
  };
}
