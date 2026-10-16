/**
 * Karte „Zwei Antworten weiter“ (Prüffrage F2): die zwei stärksten Antworten des Gegners auf den
 * geplanten Zug, je höchstens vier Halbzüge.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2, Prüffragen: „F2: die Engine zeigt die zwei stärksten
 * Antworten des Gegners, in Schritten zu höchstens vier Halbzügen.“ Die Rechnung braucht die
 * Engine und läuft deshalb hier, unter der Karte des Werkzeugs k4-prueffragen.
 * Abhängigkeiten: engine/engineDienst.ts, schach/notation.ts, i18n.
 * Buchbezug: Kapitel 4, F2 („Rechne mindestens zwei Antworten des Gegners … weiter“).
 */
import { Chess } from "chessops/chess";
import { makeFen, parseFen } from "chessops/fen";
import { parseSan } from "chessops/san";
import { useEffect, useState } from "react";
import {
  AuftragAbgebrochen,
  engine,
  STANDARD_RECHENZEIT_MS,
  type Bewertung,
} from "../../engine/engineDienst";
import { wertAlsZahl } from "../../engine/wertInWorten";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache, zugfolgeAlsText } from "../../schach/notation";
import type { Stellung } from "../../schach/stellung";

/** Zwei Antworten, je höchstens vier Halbzüge (Pflichtenheft 6.2). */
const ANTWORTEN = 2;
const HALBZUEGE = 4;

type Zustand =
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly bewertung: Bewertung; readonly danach: Chess }
  | { readonly art: "fehler"; readonly meldung: string };

/** Die Stellung nach dem geplanten Zug, oder null. */
function nachDemZug(stellung: Stellung, san: string): Chess | null {
  const setup = parseFen(stellung.fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  if (pos.isErr) return null;
  const zug = parseSan(pos.value, san);
  if (!zug) return null;
  pos.value.play(zug);
  return pos.value;
}

/**
 * Rechnet die zwei stärksten Antworten auf den geplanten Zug und zeigt sie.
 * Beispiel: Abb. 4.21 mit 8. axb4: „8... Sd3#“ als erste Antwort.
 */
export function AntwortenKarte({ stellung, geplant }: { stellung: Stellung; geplant: string }) {
  const [zustand, setzeZustand] = useState<Zustand>({ art: "rechnet" });
  useEffect(() => {
    let aktiv = true;
    const danach = nachDemZug(stellung, geplant);
    if (!danach) return;
    engine
      .bewerte(makeFen(danach.toSetup()), STANDARD_RECHENZEIT_MS, ANTWORTEN)
      .then((bewertung) => aktiv && setzeZustand({ art: "fertig", bewertung, danach }))
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        setzeZustand({ art: "fehler", meldung });
      });
    return () => {
      aktiv = false;
    };
  }, [stellung, geplant]);
  const zug = sanInSprache(geplant, sprache());
  return (
    <section className="karte" aria-live="polite" data-testid="antworten-karte">
      <div className="karte-kopf">
        <h2>{t("prueffragen.f2.engineTitel", { zug })}</h2>
      </div>
      {zustand.art === "rechnet" && (
        <p className="lade">
          <span className="ladepunkt" aria-hidden="true" /> {t("prueffragen.f2.rechnet")}
        </p>
      )}
      {zustand.art === "fehler" && (
        <p className="fehlertext">{t("falle.engine.fehler", { meldung: zustand.meldung })}</p>
      )}
      {zustand.art === "fertig" && (
        <ol className="varianten">
          {zustand.bewertung.varianten.map((v) => (
            <li key={v.nummer}>
              <span className="zahl">{wertAlsZahl(v.wert)}</span>{" "}
              {zugfolgeAlsText(zustand.danach, v.zuege, sprache(), HALBZUEGE)}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
