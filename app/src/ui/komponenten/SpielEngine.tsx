/**
 * Engine-Knopf während der Partie: Schritt für Schritt Bewertung, Urteil über den eigenen letzten
 * Zug, Erklärung und bester Zug.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (18.10.2026): Statt der Hinweisknöpfe unten gibt es unter
 * dem Brett einen Knopf „Engine“ wie bei den Abbildungen, der mit jedem Tipp etwas mehr verrät:
 * 1. die Bewertung der Stellung, 2. das Zeichen des eigenen letzten Zuges in den Klassen der
 * Auswertung (!, ?!, ?, ??) ohne Erklärung, 3. warum er schlecht war (Regeln des Buches,
 * spiel/erklaerung.ts), 4. der beste Zug jetzt als goldener Pfeil. Schritte, die nichts zu sagen
 * haben, fallen weg (kein eigener Zug bisher; ein guter Zug braucht kein „Warum“).
 * Die Engine rechnet erst beim Tipp, mit voller Stärke.
 * Abhängigkeiten: engine/engineDienst.ts, engine/letzterzug.ts, spiel/erklaerung.ts,
 * ui/komponenten/useZugurteil.ts, i18n.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { AuftragAbgebrochen, engine, type Bewertung } from "../../engine/engineDienst";
import { urteilUeberLetztenZug, wertNachDemZug } from "../../engine/letzterzug";
import { wertAlsZahl, wertInWorten } from "../../engine/wertInWorten";
import { t } from "../../i18n/sprache";
import { erklaereZug } from "../../spiel/erklaerung";
import { urteilsmarkierung } from "./useZugurteil";
import {
  brauchtWarum,
  eigenerLetzterZug,
  naechsterSchritt,
  urteilsschluessel,
  zugtext,
  type EigenesUrteil,
  type Folgeschritt,
  type Schritt,
} from "./spielEngineSchritte";

/** Rechenzeit je Stellung (Konzept 8.1: höchstens 2 bis 3 Sekunden für einen Hinweis). */
const RECHENZEIT_MS = 1500;
/** Zwei Varianten vor dem Zug: So erkennt das Urteil auch den einzigen guten Zug („!“). */
const VARIANTEN_VORHER = 2;
const FELD = 2;

interface Stand {
  readonly schritt: Schritt;
  readonly jetzt: Bewertung | null;
  readonly eigenes: EigenesUrteil | null;
}

/** Rechnet, was der nächste Schritt braucht. */
async function rechne(
  schritt: Folgeschritt,
  stand: Stand,
  fen: string,
  zuege: readonly string[],
  startFen: string,
): Promise<Stand> {
  if (schritt === 1) return { ...stand, schritt, jetzt: await engine.bewerte(fen, RECHENZEIT_MS) };
  if (schritt !== 2) return { ...stand, schritt };
  const zug = eigenerLetzterZug(startFen, zuege);
  if (!zug) return { ...stand, schritt };
  const vorher = await engine.bewerte(zug.vorherFen, RECHENZEIT_MS, VARIANTEN_VORHER);
  const danach = await engine.bewerte(zug.danachFen, RECHENZEIT_MS);
  const weissZog = zug.vorherFen.split(" ")[1] !== "b";
  const wert = wertNachDemZug(danach.varianten, zug.danachFen);
  const urteil = urteilUeberLetztenZug(vorher.varianten, wert, zug.uci, weissZog);
  const erklaerung = urteil
    ? erklaereZug(
        zug.vorherFen,
        zug.danachFen,
        zug.uci,
        danach.besterZug ?? "",
        urteil.verlust,
        urteil.besterZug,
      )
    : null;
  return { ...stand, schritt, eigenes: { zug, urteil, erklaerung } };
}

/** Markierungen bis zum erreichten Schritt. */
function markierungen(stand: Stand): Markierung[] {
  const marken: Markierung[] = [];
  const e = stand.eigenes;
  if (stand.schritt >= 2 && e?.urteil) {
    marken.push(...urteilsmarkierung({ ...e.urteil, besterZug: null }, e.zug));
  }
  if (stand.schritt >= 3 && brauchtWarum(e) && e?.erklaerung) marken.push(...e.erklaerung.marken);
  const bester = stand.jetzt?.besterZug;
  if (stand.schritt >= 4 && bester) {
    marken.push({
      typ: "pfeil",
      farbe: "gold",
      von: bester.slice(0, FELD),
      nach: bester.slice(FELD, FELD * 2),
    });
  }
  return marken;
}

/** Die Sätze der erreichten Schritte. */
function Saetze({ stand, fen }: { stand: Stand; fen: string }) {
  const erste = stand.jetzt?.varianten[0];
  const e = stand.eigenes;
  const bester = stand.jetzt?.besterZug;
  return (
    <ol className="hinweisliste">
      {erste && (
        <li className="engine-wert">
          <span className="zahl">{wertAlsZahl(erste.wert)}</span> {wertInWorten(erste.wert)}
        </li>
      )}
      {stand.schritt >= 2 && e && (
        <li data-testid="spielengine-urteil">
          {t(urteilsschluessel(e.urteil), { zug: zugtext(e.zug.vorherFen, e.zug.uci) })}
        </li>
      )}
      {stand.schritt >= 3 && e && brauchtWarum(e) && (
        <li>
          {e.erklaerung
            ? t("spielengine.warum", { text: e.erklaerung.text })
            : t("spielengine.warumOhneRegel")}
          {e.urteil?.besterZug &&
            ` ${t("spielengine.besser", { zug: zugtext(e.zug.vorherFen, e.urteil.besterZug) })}`}
        </li>
      )}
      {stand.schritt >= 4 && bester && (
        <li>{t("spielengine.bester", { zug: zugtext(fen, bester) })}</li>
      )}
    </ol>
  );
}

/**
 * Eingaben: Stellung (der Leser ist am Zug), die Züge der Partie in SAN, die Startstellung und
 * der Rückruf für die Markierungen. Der Aufrufer setzt `key` auf die Stellung, damit ein neuer Zug
 * von vorn beginnt.
 * Beispiel: nach 1. e4 e5 2. Dh5 Sc6 3. Lc4 Sf6?? und 4. Dxf7#: Schritt 2 sagt „3... Sf6?? ist ein
 * Patzer.“, Schritt 3 nennt die übersehene Drohung.
 */
export function SpielEngine({
  fen,
  zuege,
  startFen,
  beiMarkierungen,
}: {
  fen: string;
  zuege: readonly string[];
  startFen: string;
  beiMarkierungen: (markierungen: readonly Markierung[]) => void;
}) {
  const [stand, setzeStand] = useState<Stand>({ schritt: 0, jetzt: null, eigenes: null });
  const [laedt, setzeLaedt] = useState(false);
  const [fehler, setzeFehler] = useState<string | null>(null);
  const naechster = naechsterSchritt(
    stand.schritt,
    eigenerLetzterZug(startFen, zuege),
    stand.eigenes,
  );
  const weiter = () => {
    if (naechster === null) return;
    setzeLaedt(true);
    rechne(naechster, stand, fen, zuege, startFen)
      .then((neu) => {
        setzeStand(neu);
        beiMarkierungen(markierungen(neu));
      })
      .catch((grund: unknown) => {
        if (grund instanceof AuftragAbgebrochen) return;
        console.error("Engine während der Partie fehlgeschlagen:", grund);
        setzeFehler(grund instanceof Error ? grund.message : String(grund));
      })
      .finally(() => setzeLaedt(false));
  };
  return (
    <section className="karte spielengine" data-testid="spielengine">
      {stand.schritt > 0 && <Saetze stand={stand} fen={fen} />}
      {fehler && <p className="fehlertext">{t("engine.fehler", { fehler })}</p>}
      {naechster !== null && (
        <button type="button" className="knopf-zweit" disabled={laedt} onClick={weiter}>
          {laedt ? t("spielengine.rechnet") : t(`spielengine.knopf.${naechster}`)}
        </button>
      )}
    </section>
  );
}
