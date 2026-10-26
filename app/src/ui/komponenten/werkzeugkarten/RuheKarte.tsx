/**
 * Karte „Rechnung bis zur Ruhe“ für das Werkzeug k7-ruhe: Die Engine rechnet die Hauptvariante
 * bis kein Schach und kein Schlag mehr in der Luft liegt, in Schritten zu vier Halbzügen, und
 * zeigt die Bilanz in Bauerneinheiten.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 (Taktik Schritt 3). Die Rechnung dauert einige
 * Sekunden und läuft deshalb hier und nicht im Werkzeug selbst. Ist sie da, meldet die Karte die
 * goldenen Pfeile des ersten Schrittes fürs Brett.
 * Abhängigkeiten: engine/ruhe.ts, engine/engineDienst.ts, schach/notation.ts, i18n.
 */
import { useEffect, useState } from "react";
import type { Markierung } from "../../../analyse/werkzeug";
import { AuftragAbgebrochen, engine, STANDARD_RECHENZEIT_MS } from "../../../engine/engineDienst";
import { rechneRuhe, type Ruhe } from "../../../engine/ruhe";
import { wertAlsZahl, wertInWorten } from "../../../engine/wertInWorten";
import { sprache, t, tZahl } from "../../../i18n/sprache";
import { parseUci } from "chessops/util";
import { zugfolgeAlsText } from "../../../schach/notation";
import type { Stellung } from "../../../schach/stellung";

const FELDLAENGE = 2;

type Zustand =
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly ruhe: Ruhe | null }
  | { readonly art: "fehler"; readonly meldung: string };

/** Gold die Züge des ersten Schrittes. */
function markierungenAus(ruhe: Ruhe): Markierung[] {
  return (ruhe.schritte[0] ?? []).map((uci) => ({
    typ: "pfeil",
    farbe: "gold",
    von: uci.slice(0, FELDLAENGE),
    nach: uci.slice(FELDLAENGE, 2 * FELDLAENGE),
  }));
}

/** Ein Vorzeichen wie im Buch: „+4“, „−1“, „0“. */
function mitVorzeichen(zahl: number): string {
  if (zahl > 0) return `+${zahl}`;
  return zahl < 0 ? `−${Math.abs(zahl)}` : "0";
}

function Ergebnis({ stellung, ruhe }: { stellung: Stellung; ruhe: Ruhe }) {
  const regeln = stellung.regeln;
  if (!regeln) return null;
  // Jeder Schritt wird von der Stellung aus geschrieben, die der vorige Schritt erreicht hat.
  const schritte: string[] = [];
  const pos = regeln.clone();
  for (const schritt of ruhe.schritte) {
    schritte.push(zugfolgeAlsText(pos, schritt, sprache(), schritt.length));
    for (const uci of schritt) {
      const zug = parseUci(uci);
      if (zug && pos.isLegal(zug)) pos.play(zug);
    }
  }
  return (
    <>
      <ol>
        {schritte.map((text, i) => (
          <li key={text}>{t("ruhe.engine.schritt", { nummer: i + 1, zuege: text })}</li>
        ))}
      </ol>
      <p className="fazit">
        {tZahl(`ruhe.engine.ende.${ruhe.ende}`, ruhe.zuege.length, {
          halbzuege: ruhe.zuege.length,
        })}{" "}
        {t("ruhe.engine.bilanz", {
          vorher: mitVorzeichen(ruhe.materialVorher),
          nachher: mitVorzeichen(ruhe.materialNachher),
          wert: wertAlsZahl(ruhe.wert),
          worte: wertInWorten(ruhe.wert),
        })}
      </p>
    </>
  );
}

/**
 * Rechnet die Hauptvariante bis zur Ruhe und zeigt sie in Schritten.
 *
 * Eingaben: Stellung, Rückruf für die Pfeile am Brett. Beispiel: Abb. 7.14: „1. Th8+ Kxh8
 * 2. Sxf7+ Kg8“, „3. Sxd6“, Ruhe nach 5 Halbzügen, Bilanz vorher −4, nachher +4.
 */
export function RuheKarte({
  stellung,
  beiMarkierungen,
}: {
  stellung: Stellung;
  beiMarkierungen: (markierungen: Markierung[]) => void;
}) {
  const [zustand, setzeZustand] = useState<Zustand>({ art: "rechnet" });
  useEffect(() => {
    let aktiv = true;
    rechneRuhe(engine, stellung.fen, STANDARD_RECHENZEIT_MS)
      .then((ruhe) => {
        if (!aktiv) return;
        setzeZustand({ art: "fertig", ruhe });
        beiMarkierungen(ruhe ? markierungenAus(ruhe) : []);
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        setzeZustand({ art: "fehler", meldung });
      });
    return () => {
      aktiv = false;
    };
  }, [stellung, beiMarkierungen]);
  return (
    <section className="karte" aria-live="polite" data-testid="ruhe-karte">
      <div className="karte-kopf">
        <h2>{t("ruhe.engine.titel")}</h2>
      </div>
      {zustand.art === "rechnet" && (
        <p className="lade">
          <span className="ladepunkt" aria-hidden="true" /> {t("ruhe.engine.rechnet")}
        </p>
      )}
      {zustand.art === "fehler" && (
        <p className="fehlertext">{t("ruhe.engine.fehler", { meldung: zustand.meldung })}</p>
      )}
      {zustand.art === "fertig" && !zustand.ruhe && (
        <p className="fazit">{t("ruhe.engine.keine")}</p>
      )}
      {zustand.art === "fertig" && zustand.ruhe && (
        <Ergebnis stellung={stellung} ruhe={zustand.ruhe} />
      )}
    </section>
  );
}
