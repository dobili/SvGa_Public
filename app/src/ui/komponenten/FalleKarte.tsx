/**
 * Karte „Urteil der Engine“ für das Werkzeug k4-falle: Ist das Angebot eine Falle?
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.2, „Falle oder Köder“: Die Engine vergleicht „Material
 * nehmen“ mit dem besten anderen Zug. Die Rechnung dauert einige Sekunden und läuft deshalb hier
 * und nicht im Werkzeug selbst. Ist das Urteil da, meldet die Karte die Pfeile fürs Brett: Rot der
 * Fehlzug, Gold die Rettung. Seit 0.2.91 nennt der Satz die Gewinnchance nach dem Schlag und
 * nach der Rettung (wie der Rückblick nach der Partie) statt der Bauerneinheiten.
 * Abhängigkeiten: engine/fallenpruefung.ts, engine/fallenurteil.ts, engine/engineDienst.ts,
 * spiel/genauigkeit.ts, schach/notation.ts, i18n.
 */
import type { Color } from "chessops/types";
import { useEffect, useState } from "react";
import type { Angebot } from "../../analyse/k4-falle";
import type { Markierung } from "../../analyse/werkzeug";
import { AuftragAbgebrochen, engine, STANDARD_RECHENZEIT_MS } from "../../engine/engineDienst";
import { pruefeFalle, type Fallenpruefung } from "../../engine/fallenpruefung";
import { wertFuer } from "../../engine/fallenurteil";
import { wertAlsZahl } from "../../engine/wertInWorten";
import { sprache, t, zahlText } from "../../i18n/sprache";
import { sanInSprache, zugfolgeAlsText } from "../../schach/notation";
import type { Stellung } from "../../schach/stellung";
import { gewinnwahrscheinlichkeit } from "../../spiel/genauigkeit";

/** So viele Halbzüge der Folge nach dem Schlag zeigt die Karte (Pflichtenheft 6.2, F2: vier). */
const HALBZUEGE_FOLGE = 4;
/** Länge eines Feldnamens in UCI („e2“). */
const FELDLAENGE = 2;

type Zustand =
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly pruefung: Fallenpruefung | null }
  | { readonly art: "fehler"; readonly meldung: string };

function pfeil(uci: string, farbe: "rot" | "gold"): Markierung {
  return {
    typ: "pfeil",
    farbe,
    von: uci.slice(0, FELDLAENGE),
    nach: uci.slice(FELDLAENGE, 2 * FELDLAENGE),
  };
}

/** Rot der Schlag, wenn er eine Falle ist; Gold die Rettung; beim Geschenk Gold der Schlag. */
function markierungenAus(p: Fallenpruefung, schlag: string): Markierung[] {
  if (p.urteil.art !== "falle") return [pfeil(schlag, "gold")];
  return [pfeil(schlag, "rot"), ...(p.rettung ? [pfeil(p.rettung.zug, "gold")] : [])];
}

/** Ein Zug in UCI als Text wie im Buch („Sxc7“). */
function zugAlsText(stellung: Stellung, uci: string): string {
  return stellung.regeln
    ? zugfolgeAlsText(stellung.regeln, [uci], sprache()).replace(/^\d+\.+\s/, "")
    : uci;
}

/** Der Satz zum Urteil; bei Matt nach dem Schlag ohne Bauerneinheiten. */
function urteilssatz(p: Fallenpruefung, zug: string, rettung: string, farbe: Color): string {
  if (p.urteil.art !== "falle") return t(`falle.engine.${p.urteil.art}`, { zug });
  const wert = p.wertNachSchlag;
  const mattGegenSich =
    wert.art === "matt" && (farbe === "white" ? wert.zuege < 0 : wert.zuege > 0);
  if (mattGegenSich) return t("falle.engine.matt", { zug, rettung });
  const prozent = (w: number) => String(Math.round(gewinnwahrscheinlichkeit(w)));
  const nachher = prozent(wertFuer(wert, farbe));
  const vorher = p.rettung ? prozent(wertFuer(p.rettung.wert, farbe)) : nachher;
  if (vorher === nachher) {
    const verlust = zahlText(p.urteil.verlust, 1);
    return t("falle.engine.falleBauern", { zug, rettung, verlust });
  }
  const seite = t(farbe === "white" ? "farbe.w" : "farbe.b");
  return t("falle.engine.falle", { zug, rettung, seite, vorher, nachher });
}

function Urteil({
  stellung,
  angebot,
  p,
}: {
  stellung: Stellung;
  angebot: Angebot;
  p: Fallenpruefung;
}) {
  const zug = sanInSprache(angebot.san, sprache());
  const rettung = p.rettung ? zugAlsText(stellung, p.rettung.zug) : "";
  const satz = urteilssatz(p, zug, rettung, stellung.amZug);
  const nachSchlag = stellung.regeln?.clone();
  const folge =
    nachSchlag &&
    zugfolgeAlsText(nachSchlag, [angebot.uci, ...p.folge], sprache(), HALBZUEGE_FOLGE + 1);
  return (
    <>
      <p className="fazit">{satz}</p>
      <ul>
        {p.rettung && (
          <li>
            {t("falle.engine.werte", {
              zug,
              nach: wertAlsZahl(p.wertNachSchlag),
              rettung,
              mit: wertAlsZahl(p.rettung.wert),
            })}
          </li>
        )}
        {folge && <li>{t("falle.engine.folge", { folge })}</li>}
      </ul>
    </>
  );
}

/**
 * Rechnet das Urteil der Engine für ein Angebot und zeigt es.
 *
 * Eingaben: Stellung, Angebot, Rückruf für die Pfeile am Brett. Beispiel: Abb. 4.11, Angebot
 * Lxf3: „Falle: Lxf3 steht um … Bauerneinheiten schlechter als …“.
 */
export function FalleKarte({
  stellung,
  angebot,
  beiMarkierungen,
}: {
  stellung: Stellung;
  angebot: Angebot;
  beiMarkierungen: (markierungen: Markierung[]) => void;
}) {
  const [zustand, setzeZustand] = useState<Zustand>({ art: "rechnet" });
  useEffect(() => {
    let aktiv = true;
    const farbe: Color = stellung.amZug;
    pruefeFalle(engine, stellung.fen, angebot.uci, farbe, STANDARD_RECHENZEIT_MS)
      .then((pruefung) => {
        if (!aktiv) return;
        setzeZustand({ art: "fertig", pruefung });
        beiMarkierungen(pruefung ? markierungenAus(pruefung, angebot.uci) : []);
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        setzeZustand({ art: "fehler", meldung });
      });
    return () => {
      aktiv = false;
    };
  }, [stellung, angebot, beiMarkierungen]);
  return (
    <section className="karte" aria-live="polite" data-testid="falle-karte">
      <div className="karte-kopf">
        <h2>{t("falle.engine.titel")}</h2>
      </div>
      {zustand.art === "rechnet" && (
        <p className="lade">
          <span className="ladepunkt" aria-hidden="true" />{" "}
          {t("falle.engine.rechnet", { zug: sanInSprache(angebot.san, sprache()) })}
        </p>
      )}
      {zustand.art === "fehler" && (
        <p className="fehlertext">{t("falle.engine.fehler", { meldung: zustand.meldung })}</p>
      )}
      {zustand.art === "fertig" && zustand.pruefung && (
        <Urteil stellung={stellung} angebot={angebot} p={zustand.pruefung} />
      )}
    </section>
  );
}
