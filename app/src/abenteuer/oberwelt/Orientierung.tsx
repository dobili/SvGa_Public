/**
 * Orientierung in der Welt (Spieltest „einstieg“, 15.11.2026): der Zielhinweis auf der Karte (R1),
 * ein Ortsschild beim Kartenwechsel (R1) und je eine kurze Erklärung, wenn Münzen und Spielstärke
 * zum ersten Mal etwas bedeuten (R9).
 *
 * Warum: Ein Kind von 11 Jahren wusste nicht, wo es war (keine Ortsanzeige nach dem Hinausgehen),
 * wohin es sollte, und was „Spielstärke 616“ oder „0 Münzen“ heißt. Gute Einsteigerspiele nennen
 * den Ort beim Betreten kurz und erklären jede neue Zahl einmal, wenn sie zum ersten Mal zählt.
 * Rolle im Gesamtbild: Teil von oberwelt/Oberwelt.tsx (ausgelagert, Größengrenze). Die Erklärung
 * kommt als gewöhnliche Meldung, erst wenn kein Fenster offen ist und keine andere Meldung steht;
 * ob sie schon kam, merkt sich der Spielstand (Dialogvariablen, erklaerungen.ts).
 * Abhängigkeiten: kern.ts, useZielhinweis.ts, erklaerungen.ts, texte/texte.ts.
 */
import { useEffect } from "react";
import { tSpiel } from "../texte/texte";
import { faelligeErklaerung } from "./erklaerungen";
import type { Oberweltkern } from "./kern";
import { useZielhinweis } from "./useZielhinweis";

/** Zeigt eine fällige Erklärung als Meldung, sobald die Welt frei ist, und hakt sie ab. */
function useErklaerungen(k: Oberweltkern, frei: boolean): void {
  const { stand, meldung } = k;
  useEffect(() => {
    if (!stand || !frei || meldung !== null) return;
    const e = faelligeErklaerung(stand);
    if (!e) return;
    k.setzeMeldung(tSpiel(e.schluessel, e.werte));
    k.schreibe({ ...stand, dialogvariablen: { ...stand.dialogvariablen, [e.variable]: true } });
    // Kern und Schreiben bleiben gleich; es zählen Stand, freie Welt und Meldung.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stand, frei, meldung]);
}

/**
 * Zielhinweis, Ortsschild und Erklärungen. Eingaben: Kern der Oberwelt und ob gerade kein Fenster
 * offen ist. Das Ortsschild nennt die Karte („Dein Zimmer“, „Maple Falls, Hauptstraße“) und blendet
 * nach gut zwei Sekunden aus (abenteuer.css); jede neue Karte zeigt es neu.
 */
export function Orientierung({ k, frei }: { readonly k: Oberweltkern; readonly frei: boolean }) {
  useZielhinweis(k);
  useErklaerungen(k, frei);
  const welt = k.welt;
  const name = welt?.ort.karten.find((x) => x.kennung === welt.kennung)?.name;
  if (!welt || !name) return null;
  return (
    <p key={welt.kennung} className="abenteuer-ortsschild" data-testid="abenteuer-ortsschild">
      {tSpiel(name)}
    </p>
  );
}
