/**
 * Engine-Teil des Werkzeugs k12-kandidaten in der Werkzeugkarte: Die Engine bewertet die
 * Stellung jetzt und jeden Kandidaten (nur diese Züge, „searchmoves“) und sagt je Kandidat, ob
 * er die Stellung hält, verbessert oder verschlechtert, etwa „2. Dc2: +0,35 – hält die
 * Stellung“, „1. Lxh7+: −1,20 – verschlechtert die Stellung um 1,55“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (R43, 23.10.2026): Statt „Material −1“ bei ruhigen Zügen
 * die Stellungsbewertung der Engine mit Verbesserung oder Verschlechterung. Seit der Runde
 * „Weniger Text“ (P10, 31.10.2026) als Zeilen mit Balken, ▲/▼, Krone und Waage
 * (Kandidatenzeilen.tsx); die Sätze („Am stärksten nach der Engine …“, der Hinweis zu ruhigen
 * Zügen) stehen hinter dem Infoknopf an „Stellung jetzt“. Muster:
 * ErzwingendKarte.tsx (als `zusatz` in der Werkzeugkarte, Werkzeugzusatz.tsx). Die Rechnung
 * läuft in zwei Aufträgen nacheinander (eine Engine): erst die Stellung, dann die Kandidaten.
 * Abhängigkeiten: analyse/k12-kandidaten.ts (kandidatenliste), engine/engineDienst.ts,
 * engine/gegnerplan.ts (Nullzug), engine/wertInWorten.ts, kandidatenbewertung.ts,
 * Kandidatenzeilen.tsx, analyse/k12-antwort.ts (stärkste Antwort, beste Bilanz), i18n.
 * Buchbezug: Kapitel 12, Denkroutine Schritt 4 („Am Ende bewerten und vergleichen“).
 */
import type { Color } from "chessops/types";
import { useEffect, useMemo, useState } from "react";
import { besterKandidat, staerksteAntwort } from "../../../analyse/k12-antwort";
import { istRuhig, kandidatenliste, type Kandidat } from "../../../analyse/k12-kandidaten";
import { zugtext } from "../../../analyse/texte";
import { AuftragAbgebrochen, engine, VOLLE_STAERKE } from "../../../engine/engineDienst";
import { fenNullzug } from "../../../engine/gegnerplan";
import type { Wert } from "../../../engine/uci";
import { wertInWorten } from "../../../engine/wertInWorten";
import { t } from "../../../i18n/sprache";
import { nullzug } from "../../../schach/drohungen";
import type { Stellung } from "../../../schach/stellung";
import { MitInfo } from "../bausteine/InfoKnopf";
import { vergleichswert, wertAusSicht, wertzahl } from "./kandidatenbewertung";
import { Kandidatenzeilen, type Kandidatenzeile } from "./Kandidatenzeilen";

/** Rechenzeit je Auftrag: zwei Aufträge, zusammen etwa drei Sekunden. */
const RECHENZEIT_MS = 1500;
const EINE_VARIANTE = 1;

/** Ein bewerteter Kandidat; null, wenn die Engine für ihn keinen Wert nannte. */
interface Bewertet {
  readonly kandidat: Kandidat;
  readonly wert: Wert | null;
}

type Zustand =
  | { readonly art: "rechnet" }
  | { readonly art: "fertig"; readonly jetzt: Wert; readonly kandidaten: readonly Bewertet[] }
  | { readonly art: "fehler"; readonly meldung: string };

/** Die Stellung, in der die eigene Seite am Zug ist (sonst nach einem Nullzug des Gegners). */
function fenFuer(stellung: Stellung, eigen: Color): string | null {
  return stellung.amZug === eigen ? stellung.fen : fenNullzug(stellung.fen);
}

/**
 * Bewertet die Stellung und die Kandidaten.
 *
 * Eingaben: Stellung, eigene Seite, Kandidaten. Ausgabe: Wert der Stellung jetzt (aus Sicht von
 * Weiß) und je Kandidat sein Wert; null ohne gültige Stellung.
 */
async function bewerte(
  stellung: Stellung,
  eigen: Color,
  liste: readonly Kandidat[],
): Promise<{ jetzt: Wert; kandidaten: Bewertet[] } | null> {
  const fen = fenFuer(stellung, eigen);
  if (!fen) return null;
  const gesamt = await engine.bewerte(fen, RECHENZEIT_MS, EINE_VARIANTE);
  const jetzt = gesamt.varianten[0]?.wert ?? { art: "bauern", bauern: 0 };
  const ucis = liste.map((k) => k.uci);
  const nur = await engine.bewerte(fen, RECHENZEIT_MS, liste.length, VOLLE_STAERKE, ucis);
  const kandidaten = liste.map((kandidat) => ({
    kandidat,
    wert: nur.varianten.find((v) => v.zuege[0] === kandidat.uci)?.wert ?? null,
  }));
  return { jetzt, kandidaten };
}

/** Index des stärksten Kandidaten nach der Engine (bei Gleichstand der frühere), oder null. */
function bester(kandidaten: readonly Bewertet[], eigen: Color): number | null {
  let beste: number | null = null;
  kandidaten.forEach((b, i) => {
    const bisher = beste === null ? null : (kandidaten[beste]?.wert ?? null);
    if (!b.wert) return;
    if (
      !bisher ||
      vergleichswert(wertAusSicht(b.wert, eigen)) > vergleichswert(wertAusSicht(bisher, eigen))
    )
      beste = i;
  });
  return beste;
}

/** Die Sätze hinter ⓘ: der stärkste Kandidat und der Hinweis auf die ruhigen Züge. */
function schlusssaetze(kandidaten: readonly Bewertet[], index: number | null): string {
  const beste = index === null ? undefined : kandidaten[index];
  if (!beste || index === null) return t("kandidaten.engine.keine");
  const satz = t("kandidaten.engine.bester", { nr: index + 1, zug: zugtext(beste.kandidat.san) });
  const ruhig = kandidaten.some((b) => istRuhig(b.kandidat));
  return ruhig ? `${satz} ${t("kandidaten.engine.ruhigHinweis")}` : satz;
}

/** Die Rechnung ohne Engine: stärkste Antwort je Kandidat und der beste nach Bilanz (Schritt 3, 4). */
function useAntworten(stellung: Stellung, eigen: Color, liste: readonly Kandidat[]) {
  return useMemo(() => {
    const { regeln } = stellung;
    if (!regeln) return { antworten: [], waage: null };
    const fuer = regeln.turn === eigen ? regeln : nullzug(regeln, eigen);
    const antworten = liste.map((k) => staerksteAntwort(fuer, k.san, eigen));
    return { antworten, waage: besterKandidat(antworten) };
  }, [stellung, eigen, liste]);
}

/** Die Engine-Rechnung als Zustand; startet neu, wenn Stellung, Seite oder Buchzug wechseln. */
function useEngineZustand(stellung: Stellung, eigen: Color, liste: readonly Kandidat[]): Zustand {
  const [zustand, setzeZustand] = useState<Zustand>({ art: "rechnet" });
  useEffect(() => {
    let aktiv = true;
    if (liste.length === 0) return undefined;
    bewerte(stellung, eigen, liste)
      .then((ergebnis) => {
        if (aktiv && ergebnis) setzeZustand({ art: "fertig", ...ergebnis });
      })
      .catch((fehler: unknown) => {
        if (!aktiv || fehler instanceof AuftragAbgebrochen) return;
        const meldung = fehler instanceof Error ? fehler.message : String(fehler);
        setzeZustand({ art: "fehler", meldung });
      });
    return () => {
      aktiv = false;
    };
  }, [stellung, eigen, liste]);
  return zustand;
}

/** Kopfzeile: rechnet, Fehler oder „Stellung jetzt +4,70“ mit ⓘ (Worte und Schlusssätze). */
function Kopf({ zustand, eigen, krone }: { zustand: Zustand; eigen: Color; krone: number | null }) {
  if (zustand.art === "rechnet")
    return (
      <p className="lade">
        <span className="ladepunkt" aria-hidden="true" /> {t("kandidaten.engine.rechnet")}
      </p>
    );
  if (zustand.art === "fehler")
    return (
      <p className="fehlertext">{t("kandidaten.engine.fehler", { meldung: zustand.meldung })}</p>
    );
  return (
    <MitInfo
      thema={t("kandidaten.engine.titel")}
      zeile={
        <p className="hinweis">
          {t("wenigertext.werkzeug.stellungJetzt", { wert: wertzahl(zustand.jetzt, eigen) })}
        </p>
      }
      erklaerung={
        <>
          <p>
            {t("kandidaten.engine.jetzt", {
              wert: wertzahl(zustand.jetzt, eigen),
              worte: wertInWorten(zustand.jetzt),
            })}
          </p>
          <p>{schlusssaetze(zustand.kandidaten, krone)}</p>
        </>
      }
    />
  );
}

/**
 * Bewertet die Kandidaten mit der Engine und zeigt sie als Zeilen in der Werkzeugkarte.
 *
 * Eingaben: Stellung, eigene Seite (Sicht), der nächste Buchzug (Kandidat). Beispiel: Abb. 12.1:
 * „Stellung jetzt +4,70“, „Lxh7+ ⊕ ▮▮▮▮ +5,37 ▲ 0,67 Krone“ mit „↳ Kxh7 · Material −2“, „Db1 ⚡
 * +1,26 ▼ 3,44 Waage“. Sonderfall: Ohne Kandidaten (Matt) erscheint nichts; solange die Engine
 * rechnet, stehen die Zeilen schon da (Zug, Art, Antwort), Balken und Pfeile kommen dazu.
 */
export function KandidatenKarte({
  stellung,
  eigen,
  zug,
}: {
  stellung: Stellung;
  eigen: Color;
  zug?: string;
}) {
  // Die Liste folgt aus Stellung, Seite und Buchzug; der Schlüssel der Karte wechselt mit ihnen.
  const liste = useMemo(() => kandidatenliste(stellung, eigen, zug), [stellung, eigen, zug]);
  const zustand = useEngineZustand(stellung, eigen, liste);
  const { antworten, waage } = useAntworten(stellung, eigen, liste);
  if (liste.length === 0) return null;
  const fertig = zustand.art === "fertig" ? zustand : null;
  const krone = fertig ? bester(fertig.kandidaten, eigen) : null;
  const zeilen: Kandidatenzeile[] = liste.flatMap((kandidat, i) => {
    const antwort = antworten[i];
    return antwort ? [{ kandidat, antwort, wert: fertig?.kandidaten[i]?.wert ?? null }] : [];
  });
  return (
    <div
      className="engine-abschnitt kandidatenkarte"
      aria-live="polite"
      data-testid="kandidaten-karte"
    >
      <h3>{t("kandidaten.engine.titel")}</h3>
      <Kopf zustand={zustand} eigen={eigen} krone={krone} />
      <Kandidatenzeilen
        zeilen={zeilen}
        jetzt={fertig?.jetzt ?? null}
        eigen={eigen}
        krone={krone}
        waage={waage}
      />
    </div>
  );
}
