/**
 * Partiemoment am Brett (Atmosphäre T5 und T11): eine Sprechzeile mit Porträt in der gemeinsamen
 * Sprechblase (anbindung/Tischblase.tsx, oben der Gegner, unten Ambrose oder der Held) oder ein
 * geführter Ink-Dialog (anbindung/Momentdialog.tsx), mitten in der Partie. Geschriebene Momente
 * gehen dem Tischgespräch vor (docs/spiel/29_Tischgespraech.md).
 *
 * Rolle im Gesamtbild: Teil der Spielhülle (anbindung/PartieHuelle.tsx). Welcher Moment fällig ist,
 * sagt regeln/partiemomente.ts aus den Momenten der Begegnung (begegnungen.json) und dem Verlauf.
 * Die Zeile blockiert das Brett nicht: Die Engine rechnet weiter, der Leser darf weiterziehen.
 * Sie verschwindet nach einer Lesedauer oder auf Tipp. Klang und Musik wie im Dialog
 * (ton/tonregie.ts).
 * Abhängigkeiten: daten/laden.ts, regeln/partiemomente.ts, anbindung/Tischblase.tsx, spiel/partie.ts.
 */
import { useEffect, useMemo, useState } from "react";
import { stellungen, type Partie } from "../../spiel/partie";
import { restzeit } from "../../spiel/uhr";
import type { Partiesteuerung } from "../../ui/komponenten/partie/usePartie";
import { faelligerMoment, type Partiemoment } from "../regeln/partiemomente";
import { tSpiel } from "../texte/texte";
import { tonregie } from "../ton/tonregie";
import { AMBROSE, ambroseFehlt, anwesendeMomente } from "../regeln/abwesenheit";
import { useAbenteuerstand } from "./dienste";
import { useBegegnung } from "./useBegegnung";
import { Momentdialog } from "./Momentdialog";
import { useTischblasen } from "./tischkontext";
import type { Blasenzeile } from "./tischblasen";
import { ambrosezeile, gegnerzeile, heldenzeile } from "./tischsprecher";
import { Zugerratenmoment } from "./Zugerratenmoment";

/** Sprecher ohne Porträt und Namen, wie im Dialog (dialog/Dialog.tsx). */
const ERZAEHLER = "erzaehler";

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

/** Der Held spricht unten ohne Porträt (Sprecher „held“ in begegnungen.json). */
const HELD = "held";

/**
 * Die Blasenzeile eines Moments mit `text`: Ambrose und der Held unten, alle anderen oben; der
 * Erzähler (etwa im Clubkampf gegen Miss Odile) ohne Porträt und Namen.
 */
function momentblase(moment: Partiemoment, schluessel: string): Blasenzeile {
  const text = { text: tSpiel(moment.text ?? ""), stimmung: null };
  const angaben = { schluessel, vorrang: "geschrieben" as const, testid: "abenteuer-moment" };
  if (moment.sprecher === AMBROSE) return ambrosezeile(text, angaben);
  if (moment.sprecher === HELD) return heldenzeile(text.text, angaben);
  if (moment.sprecher === ERZAEHLER) return { ...gegnerzeile(text, null, "", angaben), name: null };
  return gegnerzeile(text, moment.sprecher, tSpiel(`figur.${moment.sprecher}.name`), angaben);
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
  const blasen = useTischblasen();
  useEffect(() => {
    if (!gezeigt) return;
    gezeigtInSitzung.add(gezeigt.schluessel);
    tonregie.dialogzeile(tagsVon(gezeigt.moment));
    // Sprechzeilen gehen in die gemeinsame Blase (Tischblase.tsx); hier zeichnet sich nichts.
    if (!gezeigt.moment.dialog) blasen?.zeige(momentblase(gezeigt.moment, gezeigt.schluessel));
    // Einmal je Moment; die Blasen sind bei jedem Zeichnen neu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gezeigt]);
  if (!gezeigt || partie.ende || !gezeigt.moment.dialog) return null;
  const schliesse = () => setzeGezeigt(null);
  // Zugerraten (Halbfinale): Der Dialog wartet auf die Antwort des Gegners und den gesuchten Zug.
  if (gezeigt.moment.dialog && gezeigt.moment.zugerraten) {
    return (
      <Zugerratenmoment verweis={gezeigt.moment.dialog} s={s} partie={partie} beiEnde={schliesse} />
    );
  }
  if (gezeigt.moment.dialog) {
    return (
      <Momentdialog verweis={gezeigt.moment.dialog} halteUhr={s.halteUhr} beiEnde={schliesse} />
    );
  }
  return null;
}
