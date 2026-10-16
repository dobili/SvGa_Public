/**
 * Engine-Teil des Werkzeugs k7-erzwingend in der Werkzeugkarte: Die Engine rechnet die ersten
 * Kandidaten nacheinander bis zur Ruhe und schreibt die Bilanz dazu, etwa „2. Th8+ Kxh8 Sxf7+ Kg8
 * Sxd6 – bis zur Ruhe: +5 (gewinnt die Dame)“. Die Zeilen erscheinen nach und nach; am Brett
 * bekommt der stärkste Kandidat ein „!“, Kandidaten ohne Gewinn werden grau.
 *
 * Rolle im Gesamtbild: Vorschlag B1 (Antwort des Autors „einverstanden“, seit 0.2.33). Röntgen
 * zeigt den Rundumblick (beide Seiten, ein Zug), „Erzwingende Züge“ die durchgerechneten eigenen
 * Kandidaten. Muster: GegnerKarte.tsx (als `zusatz` in der Werkzeugkarte).
 * Abhängigkeiten: analyse/k7-erzwingend.ts (Kandidaten, Markierungen), engine/kandidatenruhe.ts,
 * engine/gegnerplan.ts (Nullzug), engine/engineDienst.ts, i18n.
 * Buchbezug: Kapitel 7, Schritt 2 und 3 („Rechne sie in dieser Reihenfolge … jeden Ast bis zur
 * Ruhe“).
 */
import type { Color } from "chessops/types";
import { useEffect, useState } from "react";
import {
  erzwingendeKandidaten,
  kandidatenMarkierungen,
  type Einstufung,
  type Kandidat,
} from "../../analyse/k7-erzwingend";
import { zugtext } from "../../analyse/texte";
import type { Markierung } from "../../analyse/werkzeug";
import { AuftragAbgebrochen, engine } from "../../engine/engineDienst";
import { fenNullzug } from "../../engine/gegnerplan";
import {
  kandidatenwert,
  rechneKandidatenruhe,
  type Kandidatenruhe,
} from "../../engine/kandidatenruhe";
import { t } from "../../i18n/sprache";
import type { Stellung } from "../../schach/stellung";
import { kandidatenzeile } from "./kandidatenzeile";

/** So viele Kandidaten rechnet die Engine höchstens (eine Engine, Aufträge nacheinander). */
export const HOECHSTENS_GERECHNET = 6;
/** Rechenzeit je Kandidat: kurz, damit sechs Kandidaten in wenigen Sekunden fertig sind. */
const RECHENZEIT_JE_KANDIDAT_MS = 800;

/** Ein gerechneter Kandidat. */
interface Gerechnet {
  readonly kandidat: Kandidat;
  readonly ruhe: Kandidatenruhe;
}

type Zustand =
  | { readonly art: "rechnet"; readonly fertig: readonly Gerechnet[] }
  | { readonly art: "fertig"; readonly fertig: readonly Gerechnet[] }
  | { readonly art: "fehler"; readonly meldung: string };

/** Der stärkste gerechnete Kandidat (bester Wert der Engine, bei Gleichstand der frühere). */
function besterVon(fertig: readonly Gerechnet[], eigen: Color): Gerechnet | null {
  let bester: Gerechnet | null = null;
  for (const g of fertig)
    if (!bester || kandidatenwert(g.ruhe, eigen) > kandidatenwert(bester.ruhe, eigen)) bester = g;
  return bester;
}

/**
 * Einstufung für das Brett: der stärkste mit „!“, verworfen, wer bis zur Ruhe nichts gewinnt.
 * Regel: Kapitel 7, Schritt 3 („Die Bilanz: Zähle am Ende der Variante nach“).
 */
function einstufungVon(
  fertig: readonly Gerechnet[],
  eigen: Color,
  ganz: boolean,
): Map<number, Einstufung> {
  const einstufung = new Map<number, Einstufung>();
  const bester = ganz ? besterVon(fertig, eigen) : null;
  for (const g of fertig) {
    if (g === bester) einstufung.set(g.kandidat.nummer, "bester");
    else if (g.ruhe.matt !== "setzt" && g.ruhe.bilanz <= 0)
      einstufung.set(g.kandidat.nummer, "verworfen");
  }
  return einstufung;
}

/** Die Stellung, in der die eigene Seite am Zug ist (sonst nach einem Nullzug des Gegners). */
function fenFuer(stellung: Stellung, eigen: Color): string | null {
  return stellung.amZug === eigen ? stellung.fen : fenNullzug(stellung.fen);
}

/**
 * Rechnet die Kandidaten nacheinander und meldet jeden fertigen sofort.
 *
 * Eingaben: Stellung, eigene Seite, Rückruf nach jedem Kandidaten, Prüfung „noch gewünscht?“.
 * Ausgabe: alle gerechneten Kandidaten. Ein abgebrochener Auftrag (anderes Werkzeug, andere
 * Stellung) beendet die Rechnung mit AuftragAbgebrochen.
 */
async function rechneAlle(
  stellung: Stellung,
  eigen: Color,
  melde: (fertig: readonly Gerechnet[]) => void,
  aktiv: () => boolean,
): Promise<readonly Gerechnet[]> {
  const fen = fenFuer(stellung, eigen);
  const fertig: Gerechnet[] = [];
  if (!fen) return fertig;
  for (const kandidat of erzwingendeKandidaten(stellung, eigen).slice(0, HOECHSTENS_GERECHNET)) {
    if (!aktiv()) break;
    const ruhe = await rechneKandidatenruhe(
      engine,
      fen,
      kandidat.zug.uci,
      RECHENZEIT_JE_KANDIDAT_MS,
    );
    if (!ruhe) continue;
    fertig.push({ kandidat, ruhe });
    melde([...fertig]);
  }
  return fertig;
}

/** Der Satz unter den Zeilen: der stärkste Kandidat und, wenn nötig, wie viele gerechnet sind. */
function Schluss({
  fertig,
  eigen,
  anzahl,
}: {
  fertig: readonly Gerechnet[];
  eigen: Color;
  anzahl: number;
}) {
  const bester = besterVon(fertig, eigen);
  if (!bester) return <p>{t("erzwingend.engine.keine")}</p>;
  const gewinnt = fertig.some((g) => g.ruhe.matt === "setzt" || g.ruhe.bilanz > 0);
  const werte = { nummer: bester.kandidat.nummer, zug: zugtext(bester.kandidat.zug.san) };
  return (
    <p>
      {t(gewinnt ? "erzwingend.engine.bester" : "erzwingend.engine.besterOhneGewinn", werte)}
      {anzahl > fertig.length &&
        ` ${t("erzwingend.engine.auswahl", { gerechnet: fertig.length, anzahl })}`}
    </p>
  );
}

/**
 * Rechnet die Kandidaten bis zur Ruhe und zeigt die Zeilen als Abschnitt der Werkzeugkarte.
 *
 * Eingaben: Stellung, eigene Seite (Sicht), Rückruf für die Markierungen am Brett. Beispiel:
 * Abb. 7.14: „1. Te8+ Txe8 – bis zur Ruhe: −5 (verliert einen Turm)“, „2. Th8+ Kxh8 Sxf7+ Kg8
 * Sxd6 – bis zur Ruhe: +5 (gewinnt die Dame)“; am Brett h8 „2+!“, e8 grau.
 */
export function ErzwingendKarte({
  stellung,
  eigen,
  beiMarkierungen,
}: {
  stellung: Stellung;
  eigen: Color;
  beiMarkierungen: (markierungen: Markierung[]) => void;
}) {
  const [zustand, setzeZustand] = useState<Zustand>({ art: "rechnet", fertig: [] });
  const anzahl = erzwingendeKandidaten(stellung, eigen).length;
  useEffect(() => {
    let aktiv = true;
    const liste = erzwingendeKandidaten(stellung, eigen);
    // Zuerst die Kandidaten ohne Einstufung, damit keine Pfeile einer anderen Sicht stehen bleiben.
    beiMarkierungen(kandidatenMarkierungen(liste));
    const melde = (fertig: readonly Gerechnet[], ganz: boolean) => {
      setzeZustand({ art: ganz ? "fertig" : "rechnet", fertig });
      beiMarkierungen(kandidatenMarkierungen(liste, einstufungVon(fertig, eigen, ganz)));
    };
    const zwischendurch = (fertig: readonly Gerechnet[]) => {
      if (aktiv) melde(fertig, false);
    };
    rechneAlle(stellung, eigen, zwischendurch, () => aktiv)
      .then((fertig) => {
        if (aktiv) melde(fertig, true);
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        setzeZustand({ art: "fehler", meldung });
      });
    return () => {
      aktiv = false;
    };
  }, [stellung, eigen, beiMarkierungen]);
  if (anzahl === 0) return null;
  const gerechnet = zustand.art === "fehler" ? [] : zustand.fertig;
  return (
    <div className="engine-abschnitt" aria-live="polite" data-testid="erzwingend-karte">
      <h3>{t("erzwingend.engine.titel")}</h3>
      {gerechnet.length > 0 && (
        <ul>
          {gerechnet.map((g) => (
            <li key={g.kandidat.nummer}>{kandidatenzeile(stellung, eigen, g.kandidat, g.ruhe)}</li>
          ))}
        </ul>
      )}
      {zustand.art === "rechnet" && (
        <p className="lade">
          <span className="ladepunkt" aria-hidden="true" />{" "}
          {t("erzwingend.engine.rechnet", {
            nummer: gerechnet.length + 1,
            anzahl: Math.min(anzahl, HOECHSTENS_GERECHNET),
          })}
        </p>
      )}
      {zustand.art === "fehler" && (
        <p className="fehlertext">{t("erzwingend.engine.fehler", { meldung: zustand.meldung })}</p>
      )}
      {zustand.art === "fertig" && <Schluss fertig={gerechnet} eigen={eigen} anzahl={anzahl} />}
    </div>
  );
}
