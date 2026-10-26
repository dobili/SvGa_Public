/**
 * Engine-Teil des Werkzeugs k6-gegner in der Werkzeugkarte: was der Gegner vorhat (Nullzug) und
 * der eigene Vorbeugezug.
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Die Engine zeigt, was der Gegner spielen würde, wenn
 * er jetzt am Zug wäre. Rot: gegnerischer Plan als Pfeil.“). Seit 0.2.32 (Vorschlag D4,
 * Entscheidung des Autors vom 15.10.2026) steht alles in einer Karte: Der Abschnitt erscheint in
 * der Werkzeugkarte von „Gegner?“ statt als eigene Kachel, mit Überschriften, die die Farbe nennen,
 * und mit dem Vorbeugezug der Engine (engine/vorbeugezug.ts). Die Rechnung dauert einige
 * Sekunden und läuft deshalb hier und nicht im Werkzeug selbst.
 * Abhängigkeiten: engine/gegnerplan.ts, engine/vorbeugezug.ts, engine/engineDienst.ts,
 * schach/notation.ts, i18n.
 */
import { Chess } from "chessops/chess";
import { parseFen } from "chessops/fen";
import { useEffect, useState } from "react";
import type { Markierung } from "../../../analyse/werkzeug";
import { farbname } from "../../../analyse/texte";
import { AuftragAbgebrochen, engine, STANDARD_RECHENZEIT_MS } from "../../../engine/engineDienst";
import { rechneGegnerplan, type Gegnerplan } from "../../../engine/gegnerplan";
import { rechneVorbeugezug, type Vorbeugung } from "../../../engine/vorbeugezug";
import { wertAlsZahl } from "../../../engine/wertInWorten";
import { sprache, t } from "../../../i18n/sprache";
import { zugfolgeAlsText } from "../../../schach/notation";
import { gegner, type Stellung } from "../../../schach/stellung";

/** So viele Züge des Gegners fragt die Karte ab. */
const VARIANTEN = 3;
/** So viele Halbzüge der Folge zeigt die Karte je Zug. */
const HALBZUEGE_FOLGE = 4;
const FELDLAENGE = 2;
/** Rechenzeit je Prüfung eines eigenen Kandidaten (nur der beste Zug des Gegners zählt). */
const PRUEFZEIT_MS = 1000;

type Zustand =
  | { readonly art: "rechnet" }
  | {
      readonly art: "fertig";
      readonly plan: Gegnerplan | null;
      readonly vorbeugung: Vorbeugung | null;
    }
  | { readonly art: "fehler"; readonly meldung: string };

function pfeil(uci: string, farbe: "rot" | "gold"): Markierung {
  return {
    typ: "pfeil",
    farbe,
    von: uci.slice(0, FELDLAENGE),
    nach: uci.slice(FELDLAENGE, 2 * FELDLAENGE),
  };
}

/** Rot sein bester Zug, gold der Vorbeugezug, wenn er den Plan verhindert. */
function markierungenAus(plan: Gegnerplan | null, vorbeugung: Vorbeugung | null): Markierung[] {
  const bester = plan?.varianten[0]?.zuege[0];
  return [
    ...(bester ? [pfeil(bester, "rot")] : []),
    ...(vorbeugung?.verhindert ? [pfeil(vorbeugung.zug, "gold")] : []),
  ];
}

/** Züge als Text in einer Stellung, ohne führende Zugnummer: „Lxh7+ Kxh7 Sg5+ Kg8“. */
function folgentext(fen: string, zuege: readonly string[], hoechstens: number): string | null {
  const setup = parseFen(fen);
  if (setup.isErr) return null;
  const pos = Chess.fromSetup(setup.value);
  if (pos.isErr) return null;
  return zugfolgeAlsText(pos.value, zuege, sprache(), hoechstens).replace(/^\d+\.+\s/, "");
}

/** Plan des Gegners, danach der Vorbeugezug (die Engine rechnet nacheinander). */
async function rechne(stellung: Stellung): Promise<Zustand> {
  const plan = await rechneGegnerplan(engine, stellung.fen, STANDARD_RECHENZEIT_MS, VARIANTEN);
  const planzug = plan?.varianten[0]?.zuege[0];
  const vorbeugung = planzug
    ? await rechneVorbeugezug(engine, stellung.fen, planzug, STANDARD_RECHENZEIT_MS, PRUEFZEIT_MS)
    : null;
  return { art: "fertig", plan, vorbeugung };
}

/** Der Satz zum Vorbeugezug. Beispiel: „Vorbeugen mit h3: Danach spielt Weiß nicht mehr Lg5.“ */
function vorbeugesatz(stellung: Stellung, plan: Gegnerplan, v: Vorbeugung): string {
  const zug = folgentext(stellung.fen, [v.zug], 1) ?? v.zug;
  const planzug = plan.varianten[0]?.zuege[0];
  const seiner = planzug ? (folgentext(plan.fenGegner, [planzug], 1) ?? planzug) : "";
  const farbe = farbname(gegner(stellung.amZug));
  return t(v.verhindert ? "gegner.vorbeugen.zug" : "gegner.vorbeugen.keiner", {
    zug,
    plan: seiner,
    farbe,
  });
}

/** Was der Gegner vorhat: seine besten Züge mit Wert. */
function Plan({ plan }: { plan: Gegnerplan }) {
  return (
    <ol>
      {plan.varianten.map((v) => {
        const folge = folgentext(plan.fenGegner, v.zuege, HALBZUEGE_FOLGE);
        return folge ? (
          <li key={v.zuege.join(" ")}>
            {t("gegner.engine.variante", { folge, wert: wertAlsZahl(v.wert) })}
          </li>
        ) : null;
      })}
    </ol>
  );
}

/**
 * Rechnet Plan und Vorbeugezug und zeigt beides als Abschnitt der Werkzeugkarte.
 *
 * Eingaben: Stellung, Rückruf für die Pfeile am Brett. Beispiel: Abb. 6.13 (Schwarz am Zug):
 * „Was Weiß vorhat (Engine): Lxh7+ …“, roter Pfeil d3–h7, darunter der Vorbeugezug von Schwarz.
 */
export function GegnerKarte({
  stellung,
  beiMarkierungen,
}: {
  stellung: Stellung;
  beiMarkierungen: (markierungen: Markierung[]) => void;
}) {
  const [zustand, setzeZustand] = useState<Zustand>({ art: "rechnet" });
  useEffect(() => {
    let aktiv = true;
    rechne(stellung)
      .then((neu) => {
        if (!aktiv || neu.art !== "fertig") return;
        setzeZustand(neu);
        beiMarkierungen(markierungenAus(neu.plan, neu.vorbeugung));
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
  const name = farbname(gegner(stellung.amZug));
  const eigene = farbname(stellung.amZug);
  return (
    <div className="gegner-engine" aria-live="polite" data-testid="gegner-karte">
      <h3>{t("gegner.engine.titel", { farbe: name })}</h3>
      {zustand.art === "rechnet" && (
        <p className="lade">
          <span className="ladepunkt" aria-hidden="true" />{" "}
          {t("gegner.engine.rechnet", { farbe: name })}
        </p>
      )}
      {zustand.art === "fehler" && (
        <p className="fehlertext">{t("gegner.engine.fehler", { meldung: zustand.meldung })}</p>
      )}
      {zustand.art === "fertig" && !zustand.plan && <p>{t("gegner.engine.schach")}</p>}
      {zustand.art === "fertig" && zustand.plan && (
        <>
          <Plan plan={zustand.plan} />
          <h3>{t("gegner.vorbeugen.titel", { farbe: eigene })}</h3>
          <p>
            {zustand.vorbeugung
              ? vorbeugesatz(stellung, zustand.plan, zustand.vorbeugung)
              : t("gegner.vorbeugen.ohne")}
          </p>
        </>
      )}
    </div>
  );
}
