/**
 * Partiemoment über dem Brett (Atmosphäre T5 und T11): eine Sprechzeile mit Porträt oder ein
 * geführter Ink-Dialog (anbindung/Momentdialog.tsx), mitten in der Partie.
 *
 * Rolle im Gesamtbild: Teil der Spielhülle (anbindung/PartieHuelle.tsx). Welcher Moment fällig ist,
 * sagt regeln/partiemomente.ts aus den Momenten der Begegnung (begegnungen.json) und dem Verlauf.
 * Die Zeile blockiert das Brett nicht: Die Engine rechnet weiter, der Leser darf weiterziehen.
 * Sie verschwindet nach einer Lesedauer oder auf Tipp. Klang und Musik wie im Dialog
 * (ton/tonregie.ts).
 * Abhängigkeiten: daten/laden.ts, regeln/partiemomente.ts, dialog/Portraet.tsx, spiel/partie.ts.
 */
import { useEffect, useMemo, useState } from "react";
import { stellungen, type Partie } from "../../spiel/partie";
import { restzeit } from "../../spiel/uhr";
import type { Partiesteuerung } from "../../ui/komponenten/partie/usePartie";
import { Portraet } from "../dialog/Portraet";
import { faelligerMoment, type Partiemoment } from "../regeln/partiemomente";
import { tSpiel } from "../texte/texte";
import { tonregie } from "../ton/tonregie";
import { ambroseFehlt, anwesendeMomente } from "../regeln/abwesenheit";
import { useAbenteuerstand } from "./dienste";
import { useBegegnung } from "./useBegegnung";
import { Momentdialog } from "./Momentdialog";

/** Lesedauer: Grundzeit plus je Zeichen, höchstens so lange (ms). */
const LESEN_GRUND_MS = 3000;
const LESEN_JE_ZEICHEN_MS = 50;
const LESEN_HOECHSTENS_MS = 9000;

/** Die Momente der Begegnung (leer, solange geladen wird oder wenn es keine gibt). */
function useMomente(partiekennung: string): readonly Partiemoment[] {
  const begegnung = useBegegnung(partiekennung);
  return useMemo(() => begegnung?.momente ?? [], [begegnung]);
}

/** Der gerade gezeigte Moment mit seinem Schlüssel (Halbzug und Index). */
interface Gezeigt {
  readonly schluessel: string;
  readonly moment: Partiemoment;
}

/** Klang und Musik des Moments, wie die Tags einer Dialogzeile. */
function tagsVon(moment: Partiemoment): Record<string, string> {
  return {
    ...(moment.klang ? { klang: moment.klang } : {}),
    ...(moment.musik ? { musik: moment.musik } : {}),
  };
}

/** Schon gezeigte Momente je Partie und Index (für Momente mit Uhr, die der Verlauf nicht kennt). */
const gezeigtInSitzung = new Set<string>();
const MS_JE_SEKUNDE = 1000;

/** Der Verlauf für regeln/partiemomente.ts; die Uhr nur, wenn ein Moment sie braucht. */
function useVerlauf(partie: Partie, momente: readonly Partiemoment[], jetztMs: number) {
  const fens = useMemo(() => stellungen(partie), [partie]);
  const brauchtUhr = momente.some((m) => m.wenn.uhrUnter !== undefined);
  const rest =
    brauchtUhr && partie.uhr ? restzeit(partie.uhr, partie.einstellung.eigeneFarbe, jetztMs) : null;
  // Auf ganze Sekunden, damit nicht jeder Takt der Uhr neu rechnet.
  const sekunden = rest === null ? null : Math.floor(rest / MS_JE_SEKUNDE);
  return useMemo(
    () => ({
      fens,
      vomHelden: partie.zuege.map((z) => z.von === "leser"),
      held: partie.einstellung.eigeneFarbe,
      ...(sekunden === null ? {} : { uhrHeldMs: sekunden * MS_JE_SEKUNDE }),
    }),
    [fens, partie, sekunden],
  );
}

/** Die Sprechzeile eines Moments mit `text`; Tipp oder Lesedauer blendet sie aus. */
function Sprechzeile({ moment, beiEnde }: { moment: Partiemoment; beiEnde: () => void }) {
  const text = tSpiel(moment.text ?? "");
  useEffect(() => {
    const dauer = Math.min(LESEN_HOECHSTENS_MS, LESEN_GRUND_MS + text.length * LESEN_JE_ZEICHEN_MS);
    const uhr = window.setTimeout(beiEnde, dauer);
    return () => window.clearTimeout(uhr);
    // Einmal je Moment; die Hülle reicht bei jedem Takt einen neuen Rückruf.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moment]);
  return (
    <button
      type="button"
      className="abenteuer-moment"
      data-testid="abenteuer-moment"
      aria-label={tSpiel("huelle.momentSchliessen")}
      onClick={beiEnde}
    >
      <Portraet sprecher={moment.sprecher} stimmung={null} zeile={text} />
      <span role="status" aria-live="polite">
        <strong>{tSpiel(`figur.${moment.sprecher}.name`)}</strong> {text}
      </span>
    </button>
  );
}

/**
 * Zeigt den fälligen Moment der laufenden Partie: eine Sprechzeile (T5) oder einen Ink-Dialog mit
 * angehaltener Uhr (T11). Eingaben: Steuerung der Partie und die Partie. Sonderfälle: Nach dem
 * Ende der Partie und beim Nachspielen keine Momente; jeder Moment höchstens einmal je Partie.
 */
export function Momentzeile({
  s,
  partie,
}: {
  readonly s: Partiesteuerung;
  readonly partie: Partie;
}) {
  // Im Tiefpunkt spricht Ambrose nicht (regeln/abwesenheit.ts).
  const stand = useAbenteuerstand();
  const alle = useMomente(partie.einstellung.abenteuer?.kennung ?? "");
  const fehlt = ambroseFehlt(stand?.dialogvariablen ?? {});
  const momente = useMemo(() => anwesendeMomente(alle, fehlt), [alle, fehlt]);
  const verlauf = useVerlauf(partie, momente, s.jetztMs);
  const faellig = useMemo(
    () => (momente.length === 0 ? null : faelligerMoment(momente, verlauf)),
    [momente, verlauf],
  );
  // Der Moment bleibt stehen, auch wenn der Gegner sofort antwortet (dann ist er nicht mehr
  // „fällig“); deshalb merkt sich die Zeile ihn, angepasst während des Zeichnens (React-Muster).
  const [gezeigt, setzeGezeigt] = useState<Gezeigt | null>(null);
  const [zuletzt, setzeZuletzt] = useState<string | null>(null);
  const schluessel = faellig ? `${partie.id}:${faellig.index}` : null;
  const moment = faellig ? momente[faellig.index] : undefined;
  if (schluessel && moment && schluessel !== zuletzt && !gezeigtInSitzung.has(schluessel)) {
    setzeZuletzt(schluessel);
    setzeGezeigt({ schluessel, moment });
  }
  useEffect(() => {
    if (!gezeigt) return;
    gezeigtInSitzung.add(gezeigt.schluessel);
    tonregie.dialogzeile(tagsVon(gezeigt.moment));
  }, [gezeigt]);
  if (!gezeigt || partie.ende) return null;
  const schliesse = () => setzeGezeigt(null);
  if (gezeigt.moment.dialog) {
    return (
      <Momentdialog verweis={gezeigt.moment.dialog} halteUhr={s.halteUhr} beiEnde={schliesse} />
    );
  }
  return <Sprechzeile moment={gezeigt.moment} beiEnde={schliesse} />;
}
