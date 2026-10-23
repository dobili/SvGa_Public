/**
 * Engine-Teil des Werkzeugs k12-kandidaten in der Werkzeugkarte: Die Engine bewertet die
 * Stellung jetzt und jeden Kandidaten (nur diese Züge, „searchmoves“) und sagt je Kandidat, ob
 * er die Stellung hält, verbessert oder verschlechtert, etwa „2. Dc2: +0,35 – hält die
 * Stellung“, „1. Lxh7+: −1,20 – verschlechtert die Stellung um 1,55“.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (R43, 23.10.2026): Statt „Material −1“ bei ruhigen Zügen
 * die Stellungsbewertung der Engine mit Verbesserung oder Verschlechterung. Muster:
 * ErzwingendKarte.tsx (als `zusatz` in der Werkzeugkarte, Werkzeugzusatz.tsx). Die Rechnung
 * läuft in zwei Aufträgen nacheinander (eine Engine): erst die Stellung, dann die Kandidaten.
 * Abhängigkeiten: analyse/k12-kandidaten.ts (kandidatenliste), engine/engineDienst.ts,
 * engine/gegnerplan.ts (Nullzug), engine/wertInWorten.ts, kandidatenbewertung.ts, i18n.
 * Buchbezug: Kapitel 12, Denkroutine Schritt 4 („Am Ende bewerten und vergleichen“).
 */
import type { Color } from "chessops/types";
import { useEffect, useState } from "react";
import { istRuhig, kandidatenliste, type Kandidat } from "../../analyse/k12-kandidaten";
import { zugtext } from "../../analyse/texte";
import { AuftragAbgebrochen, engine, VOLLE_STAERKE } from "../../engine/engineDienst";
import { fenNullzug } from "../../engine/gegnerplan";
import type { Wert } from "../../engine/uci";
import { wertInWorten } from "../../engine/wertInWorten";
import { t } from "../../i18n/sprache";
import type { Stellung } from "../../schach/stellung";
import {
  kandidatenurteil,
  urteiltext,
  vergleichswert,
  wertAusSicht,
  wertzahl,
} from "./kandidatenbewertung";

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

/** Der stärkste Kandidat nach der Engine (bei Gleichstand der frühere), oder null. */
function bester(kandidaten: readonly Bewertet[], eigen: Color): Bewertet | null {
  let beste: Bewertet | null = null;
  for (const b of kandidaten) {
    if (!b.wert) continue;
    if (
      !beste?.wert ||
      vergleichswert(wertAusSicht(b.wert, eigen)) > vergleichswert(wertAusSicht(beste.wert, eigen))
    )
      beste = b;
  }
  return beste;
}

/** Die Zeile eines Kandidaten: Nummer, Zug, Wert, Urteil; ohne Wert ein Hinweis. */
function zeile(b: Bewertet, nr: number, jetzt: Wert, eigen: Color): string {
  const werte = { nr, zug: zugtext(b.kandidat.san) };
  if (!b.wert) return t("kandidaten.engine.ohneWert", werte);
  const urteil = kandidatenurteil(wertAusSicht(jetzt, eigen), wertAusSicht(b.wert, eigen));
  return t("kandidaten.engine.zeile", {
    ...werte,
    wert: wertzahl(b.wert, eigen),
    urteil: urteiltext(urteil),
  });
}

/** Der Schluss: der stärkste Kandidat und der Hinweis auf die ruhigen Züge. */
function Schluss({ kandidaten, eigen }: { kandidaten: readonly Bewertet[]; eigen: Color }) {
  const beste = bester(kandidaten, eigen);
  if (!beste) return <p>{t("kandidaten.engine.keine")}</p>;
  const nr = kandidaten.indexOf(beste) + 1;
  const ruhig = kandidaten.some((b) => istRuhig(b.kandidat));
  return (
    <p>
      {t("kandidaten.engine.bester", { nr, zug: zugtext(beste.kandidat.san) })}
      {ruhig && ` ${t("kandidaten.engine.ruhigHinweis")}`}
    </p>
  );
}

/**
 * Bewertet die Kandidaten mit der Engine und zeigt die Zeilen als Abschnitt der Werkzeugkarte.
 *
 * Eingaben: Stellung, eigene Seite (Sicht), der nächste Buchzug (Kandidat). Beispiel: Abb. 12.1:
 * „Stellung jetzt: +1,20 (Weiß steht deutlich besser)“, „1. Lxh7+: +3,10 – verbessert die
 * Stellung um 1,90“, „2. Dc2: +1,05 – hält die Stellung“; „Am stärksten nach der Engine: 1.
 * Lxh7+.“ Sonderfall: Ohne Kandidaten (Matt) erscheint nichts.
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
  const [zustand, setzeZustand] = useState<Zustand>({ art: "rechnet" });
  const liste = kandidatenliste(stellung, eigen, zug);
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
    // Die Liste folgt aus Stellung, Seite und Buchzug; der Schlüssel der Karte wechselt mit ihnen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stellung, eigen, zug]);
  if (liste.length === 0) return null;
  return (
    <div className="engine-abschnitt" aria-live="polite" data-testid="kandidaten-karte">
      <h3>{t("kandidaten.engine.titel")}</h3>
      {zustand.art === "rechnet" && (
        <p className="lade">
          <span className="ladepunkt" aria-hidden="true" /> {t("kandidaten.engine.rechnet")}
        </p>
      )}
      {zustand.art === "fehler" && (
        <p className="fehlertext">{t("kandidaten.engine.fehler", { meldung: zustand.meldung })}</p>
      )}
      {zustand.art === "fertig" && (
        <>
          <p>
            {t("kandidaten.engine.jetzt", {
              wert: wertzahl(zustand.jetzt, eigen),
              worte: wertInWorten(zustand.jetzt),
            })}
          </p>
          <ul>
            {zustand.kandidaten.map((b, i) => (
              <li key={b.kandidat.uci}>{zeile(b, i + 1, zustand.jetzt, eigen)}</li>
            ))}
          </ul>
          <Schluss kandidaten={zustand.kandidaten} eigen={eigen} />
        </>
      )}
    </div>
  );
}
