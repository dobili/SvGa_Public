/**
 * Karte „Engine-Bewertung“: startet Stockfish auf dem Gerät, zeigt Wert und Messung; auf Wunsch
 * die beste Fortsetzung (mit Pfeil) und das Urteil über den letzten Zug (Zeichen am Zielfeld).
 *
 * Rolle im Gesamtbild: Teil des Durchstichs (AP 1): Stockfish läuft offline auf dem Handy.
 * Die Messung (Startzeit, Rechenzeit, Tiefe, Geschwindigkeit) hilft, Stufen und Rechenzeiten für
 * ältere Handys festzulegen (Konzept 8). Seit 0.2.31 (Wunsch des Autors nach dem Test von 0.2.30)
 * steht die beste Fortsetzung erst auf Wunsch da, dann mit goldenem Pfeil am Brett; ebenso auf
 * Wunsch das Urteil über den zuletzt gespielten Zug mit ??, ?, ?! oder ! am Zielfeld.
 * Abhängigkeiten: engine/engineDienst.ts, engine/letzterzug.ts, useZugurteil.ts,
 * schach/notation.ts, i18n.
 */
import { useEffect, useMemo, useState } from "react";
import type { Markierung } from "../../../analyse/werkzeug";
import { AuftragAbgebrochen, engine, type Bewertung } from "../../../engine/engineDienst";
import type { LetzterZug } from "../../../engine/letzterzug";
import { wertAlsZahl, wertInWorten } from "../../../engine/wertInWorten";
import { sprache, t, zahlText } from "../../../i18n/sprache";
import { zugfolgeAlsText } from "../../../schach/notation";
import type { Stellung } from "../../../schach/stellung";
import { SoPrueft } from "./SoPrueft";
import { Urteil } from "./Zugurteil";
import { urteilsmarkierung, useZugurteil } from "./useZugurteil";

/** Höchstens so viele Halbzüge je Variante anzeigen. */
const HALBZUEGE_JE_VARIANTE = 8;
const MS_JE_SEKUNDE = 1000;
const TAUSEND = 1000;
/** Länge eines UCI-Zuges ohne Umwandlung („e2e4“): Feld von, Feld nach. */
const FELD_LAENGE = 2;

type Zustand =
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly bewertung: Bewertung }
  | { readonly art: "fehler"; readonly meldung: string };

/** Sekunden mit einer Nachkommastelle und deutschem Komma. */
function sekunden(ms: number): string {
  return zahlText(ms / MS_JE_SEKUNDE, 1);
}

/** Goldener Pfeil für den ersten Zug der besten Variante. */
function pfeilDesBestenZuges(bewertung: Bewertung): Markierung[] {
  const zug = bewertung.varianten[0]?.zuege[0];
  if (!zug) return [];
  const von = zug.slice(0, FELD_LAENGE);
  const nach = zug.slice(FELD_LAENGE, FELD_LAENGE * 2);
  return [{ typ: "pfeil", farbe: "gold", von, nach }];
}

/** Die besten Züge der Engine mit Wert und Zugfolge. */
function Fortsetzung({ bewertung, stellung }: { bewertung: Bewertung; stellung: Stellung }) {
  return (
    <>
      <h3>{t("engine.besteZuege")}</h3>
      <ol className="varianten">
        {bewertung.varianten.map((variante) => (
          <li key={variante.nummer}>
            <span className="zahl">{wertAlsZahl(variante.wert)}</span>{" "}
            {stellung.regeln
              ? zugfolgeAlsText(stellung.regeln, variante.zuege, sprache(), HALBZUEGE_JE_VARIANTE)
              : ""}
          </li>
        ))}
      </ol>
    </>
  );
}

/** Ein Schalter in der Karte („Beste Fortsetzung zeigen“, „Letzten Zug bewerten“). */
function Schalter({ an, text, beiKlick }: { an: boolean; text: string; beiKlick: () => void }) {
  return (
    <button type="button" className="chip" aria-pressed={an} onClick={beiKlick}>
      {text}
    </button>
  );
}

/** Bewertet die gezeigte Stellung, sobald die Karte erscheint. */
function useBewertung(fen: string): Zustand {
  const [zustand, setzeZustand] = useState<Zustand>({ art: "rechnet" });
  useEffect(() => {
    let aktiv = true;
    engine
      .bewerte(fen)
      .then((bewertung) => aktiv && setzeZustand({ art: "fertig", bewertung }))
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        console.error("Engine-Bewertung fehlgeschlagen:", fehler);
        setzeZustand({ art: "fehler", meldung });
      });
    return () => {
      aktiv = false;
      engine.stoppe();
    };
  }, [fen]);
  return zustand;
}

/**
 * Die Karte. Für eine andere Stellung wird sie neu angelegt (key = FEN), damit kein alter Stand
 * bleibt. Eingaben: Stellung, letzter Zug (null an einer Stellung ohne Vorgeschichte), Rückgabe
 * der Markierungen ans Brett.
 * Beispiel: Abb. 1.26, „Letzten Zug bewerten“ → Urteil über 5... Db6, Zeichen am Feld b6.
 */
export function EngineKarte({
  stellung,
  letzterZug,
  beiMarkierungen,
}: {
  stellung: Stellung;
  letzterZug: LetzterZug | null;
  beiMarkierungen: (markierungen: Markierung[]) => void;
}) {
  const zustand = useBewertung(stellung.fen);
  const [fortsetzung, setzeFortsetzung] = useState(false);
  const [zugWerten, setzeZugWerten] = useState(false);
  const jetzt = zustand.art === "fertig" ? zustand.bewertung : null;
  const urteil = useZugurteil(letzterZug, zugWerten, jetzt, stellung.fen);
  const markierungen = useMemo(
    () => [
      ...(fortsetzung && jetzt ? pfeilDesBestenZuges(jetzt) : []),
      ...(urteil.art === "fertig" && letzterZug
        ? urteilsmarkierung(urteil.urteil, letzterZug)
        : []),
    ],
    [fortsetzung, jetzt, urteil, letzterZug],
  );
  useEffect(() => beiMarkierungen(markierungen), [beiMarkierungen, markierungen]);
  const erste = jetzt?.varianten[0];

  return (
    <section className="karte" aria-live="polite" data-testid="engine-karte">
      <div className="karte-kopf">
        <h2>{t("engine.bewerten")}</h2>
      </div>
      {zustand.art === "rechnet" && (
        <p className="lade">
          <span className="ladepunkt" aria-hidden="true" /> {t("engine.rechnet")}
        </p>
      )}
      {zustand.art === "fehler" && (
        <p className="fehlertext">{t("engine.fehler", { fehler: zustand.meldung })}</p>
      )}
      {jetzt && !erste && <p>{t("engine.keineZuege")}</p>}
      {erste && (
        <p className="engine-wert">
          <span className="zahl">{wertAlsZahl(erste.wert)}</span> {wertInWorten(erste.wert)}
        </p>
      )}
      <div className="knopfreihe">
        {letzterZug && (
          <Schalter
            an={zugWerten}
            text={t("engine.letztenZugBewerten")}
            beiKlick={() => setzeZugWerten(!zugWerten)}
          />
        )}
        <Schalter
          an={fortsetzung}
          text={t("engine.fortsetzungZeigen")}
          beiKlick={() => setzeFortsetzung(!fortsetzung)}
        />
      </div>
      {letzterZug && <Urteil stand={urteil} letzterZug={letzterZug} />}
      {fortsetzung && jetzt && <Fortsetzung bewertung={jetzt} stellung={stellung} />}
      {jetzt && (
        <p className="messung" data-testid="engine-messung">
          {t("engine.messung", {
            zeit: sekunden(jetzt.rechenzeitMs),
            tiefe: jetzt.tiefe,
            knoten: Math.round(jetzt.knotenJeSekunde / TAUSEND),
            start: sekunden(jetzt.startzeitMs),
          })}
        </p>
      )}
      <SoPrueft
        beschriftung={t("engine.soRechnet")}
        absaetze={[t("werkzeug.engine.erklaerung"), t("engine.zeichenRegel")]}
      />
    </section>
  );
}
