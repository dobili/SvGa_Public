/**
 * Partiemoment über dem Brett (Atmosphäre T5): eine Sprechzeile mit Porträt, mitten in der Partie.
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
import { ladeSpieldaten } from "../daten/laden";
import { Portraet } from "../dialog/Portraet";
import { faelligerMoment, type Partiemoment } from "../regeln/partiemomente";
import { tSpiel } from "../texte/texte";
import { tonregie } from "../ton/tonregie";

/** Lesedauer: Grundzeit plus je Zeichen, höchstens so lange (ms). */
const LESEN_GRUND_MS = 3000;
const LESEN_JE_ZEICHEN_MS = 50;
const LESEN_HOECHSTENS_MS = 9000;

/** Die Momente der Begegnung (leer, solange geladen wird oder wenn es keine gibt). */
function useMomente(begegnung: string): readonly Partiemoment[] {
  const [geladen, setzeGeladen] = useState<{
    begegnung: string;
    momente: readonly Partiemoment[];
  } | null>(null);
  useEffect(() => {
    let aktiv = true;
    ladeSpieldaten()
      .then((daten) => {
        const b = daten.begegnungen.find((x) => x.kennung === begegnung);
        if (aktiv) setzeGeladen({ begegnung, momente: b?.momente ?? [] });
      })
      .catch((fehler: unknown) => {
        // Ohne Spieldaten gibt es keine Momente; die Partie läuft trotzdem.
        console.warn("Partiemomente nicht geladen", fehler);
      });
    return () => {
      aktiv = false;
    };
  }, [begegnung]);
  return geladen?.begegnung === begegnung ? geladen.momente : [];
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

/**
 * Zeigt den fälligen Moment der laufenden Partie. Eingabe: die Partie. Ausgabe: die Sprechzeile
 * oder nichts. Sonderfälle: Nach dem Ende der Partie und beim Nachspielen keine Momente.
 */
export function Momentzeile({ partie }: { readonly partie: Partie }) {
  const momente = useMomente(partie.einstellung.abenteuer?.kennung ?? "");
  const faellig = useMemo(() => {
    if (momente.length === 0) return null;
    const verlauf = {
      fens: stellungen(partie),
      vomHelden: partie.zuege.map((z) => z.von === "leser"),
      held: partie.einstellung.eigeneFarbe,
    };
    return faelligerMoment(momente, verlauf);
  }, [momente, partie]);
  // Der Moment bleibt stehen, auch wenn der Gegner sofort antwortet (dann ist er nicht mehr
  // „fällig“); deshalb merkt sich die Zeile ihn, angepasst während des Zeichnens (React-Muster).
  const [gezeigt, setzeGezeigt] = useState<Gezeigt | null>(null);
  const [zuletzt, setzeZuletzt] = useState<string | null>(null);
  const schluessel = faellig ? `${faellig.halbzug}:${faellig.index}` : null;
  const moment = faellig ? momente[faellig.index] : undefined;
  if (schluessel && moment && schluessel !== zuletzt) {
    setzeZuletzt(schluessel);
    setzeGezeigt({ schluessel, moment });
  }
  useEffect(() => {
    if (!gezeigt) return;
    tonregie.dialogzeile(tagsVon(gezeigt.moment));
    const text = tSpiel(gezeigt.moment.text);
    const dauer = Math.min(LESEN_HOECHSTENS_MS, LESEN_GRUND_MS + text.length * LESEN_JE_ZEICHEN_MS);
    const uhr = window.setTimeout(() => setzeGezeigt(null), dauer);
    return () => window.clearTimeout(uhr);
  }, [gezeigt]);
  if (!gezeigt || partie.ende) return null;
  const { sprecher, text } = gezeigt.moment;
  return (
    <button
      type="button"
      className="abenteuer-moment"
      data-testid="abenteuer-moment"
      aria-label={tSpiel("huelle.momentSchliessen")}
      onClick={() => setzeGezeigt(null)}
    >
      <Portraet sprecher={sprecher} stimmung={null} zeile={text} />
      <span role="status" aria-live="polite">
        <strong>{tSpiel(`figur.${sprecher}.name`)}</strong> {tSpiel(text)}
      </span>
    </button>
  );
}
