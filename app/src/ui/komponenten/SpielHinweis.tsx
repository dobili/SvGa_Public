/**
 * Gestufter Hinweis im Spiel gegen die Engine: erst die Lage, dann die Figur, dann der Zug.
 *
 * Rolle im Gesamtbild: Wunsch des Autors für AP 11: Tipps auf Grundlage der Engine-Bewertung,
 * passend zu den gestuften Hinweisen der Abbildungen (Pflichtenheft 6.1, „Erst selbst denken“).
 * Hinweis 1: Bewertung in Worten und welche Art Zug gesucht ist (Schach, Schlag, ruhiger Zug).
 * Hinweis 2: mit welcher Figur (goldenes Feld). Hinweis 3: der Zug der Engine (goldener Pfeil).
 * Die Engine rechnet erst beim ersten Tipp, mit voller Stärke.
 * Abhängigkeiten: engine/engineDienst.ts, engine/wertInWorten.ts, spiel/zuege.ts, i18n.
 */
import { parseSquare } from "chessops/util";
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { AuftragAbgebrochen, engine } from "../../engine/engineDienst";
import type { Wert } from "../../engine/uci";
import { wertInWorten } from "../../engine/wertInWorten";
import { t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { ROLLENBUCHSTABE } from "../../schach/stellung";
import { regelstellung, uciZuSan } from "../../spiel/zuege";

/** Rechenzeit für den Hinweis (Konzept 8.1: höchstens 2 bis 3 Sekunden). */
const HINWEIS_MS = 1500;
const LETZTE_STUFE = 3;

interface Vorschlag {
  readonly san: string;
  readonly von: string;
  readonly nach: string;
  readonly figur: string;
  readonly wert: Wert | null;
}

type Zustand =
  | { readonly art: "aus" }
  | { readonly art: "laedt" }
  | { readonly art: "fertig"; readonly vorschlag: Vorschlag }
  | { readonly art: "fehler"; readonly meldung: string };

/** Was für ein Zug gesucht ist, aus der Kurznotation. */
function zugart(san: string): "matt" | "schach" | "schlag" | "ruhig" {
  if (san.includes("#")) return "matt";
  if (san.includes("+")) return "schach";
  return san.includes("x") ? "schlag" : "ruhig";
}

async function berechne(fen: string): Promise<Vorschlag> {
  const bewertung = await engine.bewerte(fen, HINWEIS_MS, 1);
  const uci = bewertung.besterZug;
  const san = uci ? uciZuSan(fen, uci) : null;
  const von = uci ? parseSquare(uci.slice(0, 2)) : undefined;
  const rolle = von === undefined ? undefined : regelstellung(fen)?.board.get(von)?.role;
  if (!uci || !san || !rolle) throw new Error(t("spielhinweis.keinZug"));
  return {
    san,
    von: uci.slice(0, 2),
    nach: uci.slice(2, 4),
    figur: t(`figur.${ROLLENBUCHSTABE[rolle]}`),
    wert: bewertung.varianten[0]?.wert ?? null,
  };
}

/** Markierungen bis zur gewählten Stufe. */
function markierungenBis(stufe: number, v: Vorschlag): Markierung[] {
  if (stufe >= LETZTE_STUFE) return [{ typ: "pfeil", farbe: "gold", von: v.von, nach: v.nach }];
  if (stufe === 2) return [{ typ: "feld", farbe: "gold", feld: v.von }];
  return [];
}

/**
 * Eingaben: Stellung (der Leser ist am Zug), Rückruf für die Markierungen auf dem Brett.
 * Der Aufrufer setzt `key` auf die Stellung, damit ein neuer Zug den Hinweis zurücksetzt.
 */
export function SpielHinweis({
  fen,
  beiMarkierungen,
}: {
  fen: string;
  beiMarkierungen: (markierungen: readonly Markierung[]) => void;
}) {
  const [stufe, setzeStufe] = useState(0);
  const [zustand, setzeZustand] = useState<Zustand>({ art: "aus" });
  const weiter = (neu: number, vorschlag: Vorschlag | null) => {
    setzeStufe(neu);
    if (vorschlag) beiMarkierungen(markierungenBis(neu, vorschlag));
  };
  const naechster = () => {
    if (zustand.art === "fertig") return weiter(stufe + 1, zustand.vorschlag);
    setzeZustand({ art: "laedt" });
    berechne(fen)
      .then((vorschlag) => {
        setzeZustand({ art: "fertig", vorschlag });
        weiter(1, vorschlag);
      })
      .catch((grund: unknown) => {
        if (grund instanceof AuftragAbgebrochen) return setzeZustand({ art: "aus" });
        console.error("Hinweis fehlgeschlagen:", grund);
        const meldung = grund instanceof Error ? grund.message : String(grund);
        setzeZustand({ art: "fehler", meldung });
      });
  };
  const v = zustand.art === "fertig" ? zustand.vorschlag : null;
  return (
    <section className="karte spielhinweis" data-testid="spielhinweis">
      {v && stufe >= 1 && (
        <ol className="hinweisliste">
          <li>
            {v.wert && `${t("spielhinweis.lage", { wert: wertInWorten(v.wert) })} `}
            {t(`spielhinweis.art.${zugart(v.san)}`)}
          </li>
          {stufe >= 2 && <li>{t("spielhinweis.figur", { figur: v.figur, feld: v.von })}</li>}
          {stufe >= LETZTE_STUFE && (
            <li>{t("spielhinweis.zug", { zug: sanInSprache(v.san, "de") })}</li>
          )}
        </ol>
      )}
      {zustand.art === "fehler" && <p className="fehlertext">{zustand.meldung}</p>}
      {stufe < LETZTE_STUFE && (
        <button
          type="button"
          className="knopf-zweit"
          disabled={zustand.art === "laedt"}
          onClick={naechster}
        >
          {zustand.art === "laedt"
            ? t("spielhinweis.rechnet")
            : t("spielhinweis.knopf", { stufe: stufe + 1 })}
        </button>
      )}
    </section>
  );
}
