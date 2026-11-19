/**
 * Ambroses Zeit-Hinweise am Brett (Wunsch des Autors, 19.11.2026): In Partien mit Uhr sagt er
 * selten „Lass dir Zeit“ oder „Du musst schneller werden“, wenn der Held deutlich vom sinnvollen
 * Tempo abweicht.
 *
 * Rolle im Gesamtbild: Teil der Spielhülle (anbindung/PartieHuelle.tsx), zeichnet selbst nichts;
 * die Zeile geht wie Ambroses andere Zeilen in die Sprechblase unten (anbindung/Tischblase.tsx,
 * nie über dem Brett). Nach jedem Zug des Helden merkt sich die Zeile seine Restzeit; daraus
 * folgen die Bedenkzeit je Zug und mit regeln/zeithinweis.ts der Hinweis. Gemessen wird nur in
 * dieser Sitzung (nach dem Neuladen beginnt die Messung neu, ohne Speicher).
 * Nur in ganzen Partien, nicht in kurzen Formen (Stellungsduell). Ambrose schweigt, wo er nicht da ist (wie im Tischgespräch: regeln/schutzengel.ts,
 * schutzengelGesperrt), vor der ersten Clubnadel, gegen sich selbst am Reisebrett und in Zeitnot
 * unter 30 Sekunden (dann spricht schon das Tischgespräch). Am Ende einer Schnellschach-Partie
 * mit Zeitwahl, die nach der genutzten Zeit als Blitz zählt, sagt er das einmal
 * (regeln/zeitklassenwertung.ts; so wird sie auch gewertet).
 * Abhängigkeiten: regeln/zeithinweis.ts, regeln/zeithinweis-lage.ts, regeln/schutzengel.ts,
 * regeln/abwesenheit.ts, anbindung/tischsprecher.ts, spiel/partie.ts.
 */
import { useEffect, useRef } from "react";
import { stellungen, type Partie } from "../../spiel/partie";
import { UEBUNGSPARTIE_AMBROSE } from "../regeln/abwesenheit";
import { schutzengelGesperrt } from "../regeln/schutzengel";
import {
  genutztAusRestzeiten,
  zeithinweis,
  zeithinweiseFreigeschaltet,
  zeithinweisSatz,
  type Zeithinweisart,
} from "../regeln/zeithinweis";
import { echteWahl } from "../regeln/zeithinweis-lage";
import { wertungsklasse } from "../regeln/zeitklassenwertung";
import { zeitwertung } from "../regeln/zeitwertung";
import { wertungstempo } from "../../spiel/elomodell";
import { uhrbilanzAus } from "./partieergebnis";
import { tSpiel } from "../texte/texte";
import { useAbenteuerstand } from "./dienste";
import { useTischblasen } from "./tischkontext";
import { ambrosezeile } from "./tischsprecher";

/** Unter so viel Restzeit spricht schon das Tischgespräch zur Zeitnot (Tischgespraech.tsx). */
const ZEITNOT_MS = 30_000;
/** Stimmung des Porträts je Hinweis. */
const STIMMUNG: Readonly<Record<Zeithinweisart, string>> = {
  zuSchnell: "laechelt",
  zuLangsam: "ernst",
};

/** Was die Zeile über die laufende Partie gesammelt hat. */
interface Messung {
  readonly partieId: string;
  /** Eigene Züge beim ersten Messpunkt. */
  readonly abZug: number;
  /** Ob vor dem ersten Messpunkt noch kein Zug fiel und der Held anfängt (erster Zug ohne Zuschlag). */
  readonly ersterOhneZuschlag: boolean;
  readonly restzeiten: number[];
  readonly echteWahl: boolean[];
  letzterHinweis: number | null;
  bisherige: number;
}

/** Eigene Züge des Helden in der Partie. */
function eigeneZuege(partie: Partie): number {
  return partie.zuege.filter((z) => z.von === "leser").length;
}

/** Restzeit des Helden aus dem Uhrstand (nach seinem Zug steht seine Uhr). */
function restDesHelden(partie: Partie): number | null {
  return partie.uhr ? partie.uhr.restMs[partie.einstellung.eigeneFarbe] : null;
}

/** Beginnt eine Messung für diese Partie (auch nach dem Neuladen mitten in der Partie). */
function neueMessung(partie: Partie, rest: number): Messung {
  const zuege = eigeneZuege(partie);
  return {
    partieId: partie.id,
    abZug: zuege,
    ersterOhneZuschlag: partie.zuege.length === 0,
    restzeiten: [rest],
    echteWahl: [],
    letzterHinweis: null,
    bisherige: 0,
  };
}

/** Nimmt den gerade gespielten Zug des Helden auf (Restzeit danach, echte Wahl). */
function nimmZugAuf(messung: Messung, partie: Partie, rest: number): void {
  const index = partie.zuege.length - 1;
  const fens = stellungen(partie);
  const san = partie.zuege[index]?.san ?? "";
  const gegner = partie.zuege[index - 1]?.san ?? null;
  messung.restzeiten.push(rest);
  messung.echteWahl.push(echteWahl(fens[index] ?? "", gegner, san));
}

/** Der Hinweis nach dem letzten Zug des Helden, falls fällig. */
function faelligerHinweis(messung: Messung, partie: Partie, rest: number): Zeithinweisart | null {
  const zuschlagMs = partie.einstellung.uhr?.zuschlagMs ?? 0;
  const genutzt = genutztAusRestzeiten(messung.restzeiten, zuschlagMs, messung.ersterOhneZuschlag);
  const art = zeithinweis({
    zuschlagMs,
    genutztJeZug: genutzt,
    echteWahl: messung.echteWahl,
    eigeneZuege: eigeneZuege(partie),
    restMs: rest,
    letzterHinweisNachZug: messung.letzterHinweis,
    bisherige: messung.bisherige,
  });
  return art === "zuLangsam" && rest < ZEITNOT_MS ? null : art;
}

/** So viele Sätze gibt es für das Ende einer geblitzten Partie (`tisch.ambrose.geblitzt.<n>`). */
const GEBLITZT_SAETZE = 2;
const MS_JE_SEKUNDE = 1000;

/**
 * Der Satz am Ende einer Schnellschach-Partie mit Zeitwahl, die nach der genutzten Zeit als Blitz
 * zählt (regeln/zeitklassenwertung.ts), sonst null.
 * Beispiel: 10 + 5, 25 Züge mit je 4 Sekunden → „Im Schnitt 4 Sekunden je Zug. Für Schnellschach
 * ist das sehr flott.“ (oder der andere Satz, je nach Partie).
 */
function geblitztText(partie: Partie): string | null {
  const uhr = partie.einstellung.uhr;
  const bilanz = uhrbilanzAus(partie).uhrbilanz;
  if (!uhr || !bilanz || wertungstempo(uhr) !== "rapid") return null;
  const spieluhr = {
    sekunden: uhr.grundzeitMs / MS_JE_SEKUNDE,
    zuschlag: uhr.zuschlagMs / MS_JE_SEKUNDE,
  };
  const lage = { zeitwahl: true, uhr: spieluhr, bilanz, abzug: 0 };
  if (wertungsklasse(lage) !== "blitz") return null;
  const schnitt = zeitwertung({ ...uhr, ...bilanz })?.schnittMs ?? 0;
  const satz = (zeithinweisSatz(partie.id, 0) % GEBLITZT_SAETZE) + 1;
  return tSpiel(`tisch.ambrose.geblitzt.${satz}`, {
    sekunden: Math.max(1, Math.round(schnitt / MS_JE_SEKUNDE)),
  });
}

/**
 * Am Ende einer Partie mit Zeitwahl, die in dieser Sitzung lief (Messung vorhanden): einmal
 * Ambroses Satz, wenn sie für Schnellschach zu schnell war (geblitztText).
 */
function useGeblitztAmEnde(
  partie: Partie,
  aktiv: boolean,
  messung: { readonly current: Messung | null },
): void {
  const blasen = useTischblasen();
  useEffect(() => {
    if (!partie.ende || !aktiv || !blasen || messung.current?.partieId !== partie.id) return;
    const text = geblitztText(partie);
    if (!text) return;
    const angaben = { schluessel: `${partie.id}:geblitzt`, vorrang: "tisch" as const };
    blasen.zeige(
      ambrosezeile({ text, stimmung: "laechelt" }, { ...angaben, testid: "abenteuer-zeithinweis" }),
    );
    // Einmal zum Ende der Partie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partie.ende]);
}

/**
 * Die Zeit-Hinweise der laufenden Partie. Eingabe: die Partie. Zeichnet nichts.
 * Beispiel: 10 + 5 nach der ersten Clubnadel, ab Zug 10 fünf Züge mit je 2 Sekunden in offenen
 * Stellungen → Ambrose unten: „Du hast Zeit, mein Lehrling. Nimm sie dir.“
 */
export function Zeithinweis({ partie }: { readonly partie: Partie }) {
  const stand = useAbenteuerstand();
  const blasen = useTischblasen();
  const messung = useRef<Messung | null>(null);
  const variablen = stand?.dialogvariablen ?? {};
  const begegnung = partie.einstellung.abenteuer?.kennung ?? "";
  // Nur ganze Partien: In einer kurzen Form (zehn Züge bis zur Wertung) käme der Hinweis
  // frühestens mit dem letzten Zug und gleich danach der Ausklang (Test, 19.11.2026).
  const aktiv =
    partie.einstellung.uhr !== null &&
    !partie.einstellung.abenteuer?.kurzform &&
    begegnung !== UEBUNGSPARTIE_AMBROSE &&
    zeithinweiseFreigeschaltet(variablen) &&
    !schutzengelGesperrt(variablen, begegnung);
  const zuege = eigeneZuege(partie);
  useEffect(() => {
    const rest = restDesHelden(partie);
    if (!aktiv || !blasen || rest === null || partie.ende) return;
    const m = messung.current;
    if (!m || m.partieId !== partie.id) {
      messung.current = neueMessung(partie, rest);
      return;
    }
    if (zuege <= m.abZug + m.echteWahl.length) return;
    nimmZugAuf(m, partie, rest);
    const art = faelligerHinweis(m, partie, rest);
    if (!art) return;
    const satz = zeithinweisSatz(partie.id, m.bisherige);
    m.letzterHinweis = zuege;
    m.bisherige += 1;
    const text = { text: tSpiel(`tisch.ambrose.${art}.${satz + 1}`), stimmung: STIMMUNG[art] };
    const angaben = { schluessel: `${partie.id}:zeit:${zuege}`, vorrang: "tisch" as const };
    blasen.zeige(ambrosezeile(text, { ...angaben, testid: "abenteuer-zeithinweis" }));
    // Neu nur nach einem Zug des Helden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zuege, partie.id, aktiv, blasen !== null]);
  useGeblitztAmEnde(partie, aktiv && stand?.laufendeWertung?.zeitwahl === true, messung);
  return null;
}
