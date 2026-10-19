/**
 * Aufgabe des Denkroutine-Trainers: eine Minute denken, dann zwei Kandidaten mit je der stärksten
 * Antwort eingeben, prüfen und mit der Engine vergleichen.
 *
 * Rolle im Gesamtbild: Trainer „denkroutine“ (Kapitel 12, AP 13 Stufe 3). Während der Minute
 * steht nur das Brett da; erst danach öffnet sich die Eingabe (die feste Zeit ist der Kern der
 * Übung). Gelöst ist die Aufgabe, wenn zu beiden Kandidaten eine Antwort steht und der bessere
 * Kandidat höchstens 0,5 Bauern hinter dem Zug der Engine liegt.
 * Abhängigkeiten: training/denkroutinetrainer.ts, useDenkvergleich.ts, Trainerbrett, i18n.
 */
import { useEffect, useState } from "react";
import { sprache, t, zahlText } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import {
  DENKZEIT_S,
  geloest,
  KANDIDATEN,
  pruefeKandidat,
  type Denkaufgabe,
  type Kandidatpruefung,
} from "../../training/denkroutinetrainer";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import { useDenkvergleich, type Denkstand, type Kandidat } from "./useDenkvergleich";
import type { Runde } from "./useRunde";
import { useSammelstellung } from "./sammelstellung";

const SEKUNDE_MS = 1000;
/** Ab diesem Betrag ist ein Wert ein Matt (Engine-Werte mit Matt liegen nahe 100). */
const MATT_AB = 50;
const LEER: readonly [string, string] = ["", ""];

const de = (san: string) => sanInSprache(san, sprache());

/** Wert aus Sicht der Seite am Zug: „+0,3“, „−1,2“ oder „Matt“. */
function werttext(wert: number): string {
  if (Math.abs(wert) >= MATT_AB) return t(wert > 0 ? "denk.mattFuer" : "denk.mattGegen");
  const zahl = zahlText(Math.abs(wert), 1);
  return `${wert < 0 ? "−" : "+"}${zahl}`;
}

/** Die verbleibenden Sekunden der Denkminute. */
function useDenkminute(): number {
  const [beginn] = useState(() => Date.now());
  const [jetzt, setzeJetzt] = useState(beginn);
  const rest = Math.max(0, DENKZEIT_S - Math.floor((jetzt - beginn) / SEKUNDE_MS));
  useEffect(() => {
    if (rest === 0) return undefined;
    const takt = window.setInterval(() => setzeJetzt(Date.now()), SEKUNDE_MS);
    return () => window.clearInterval(takt);
  }, [rest]);
  return rest;
}

/** Meldung zur Prüfung eines Kandidaten. */
function pruefsatz(p: Kandidatpruefung, nummer: number): string {
  switch (p.art) {
    case "leer":
      return t("denk.leer", { nummer });
    case "kandidatUngueltig":
      return t("denk.kandidatUngueltig", { nummer, eingabe: p.eingabe });
    case "antwortFehlt":
      return t("denk.antwortFehlt", { zug: de(p.kandidat) });
    case "antwortUngueltig":
      return t("denk.antwortUngueltig", { zug: de(p.kandidat), eingabe: p.eingabe });
    case "vollstaendig":
      return t("denk.vollstaendig", { zug: de(p.kandidat), antwort: de(p.antwort) });
  }
}

/** Ergebnis der Engine: bester Zug, je Kandidat Wert und stärkste Antwort. */
function Vergleich({
  stand,
  pruefungen,
}: {
  stand: Denkstand;
  pruefungen: readonly Kandidatpruefung[];
}) {
  if (stand.art === "aus") return null;
  if (stand.art === "rechnet") return <p className="hinweis">{t("denk.rechnet")}</p>;
  if (stand.art === "fehler") return <p className="fehlertext">{stand.meldung}</p>;
  const v = stand.vergleich;
  return (
    <section className="karte" data-testid="denk-vergleich">
      <p>{t("denk.engineBester", { zug: de(v.besterZug), wert: werttext(v.besterWert) })}</p>
      <ul>
        {v.kandidaten.map((k, i) => {
          const p = pruefungen[i];
          const eigene = p?.art === "vollstaendig" ? p.antwort : "";
          return (
            <li key={k.zug}>
              {t("denk.kandidatWert", { zug: de(k.zug), wert: werttext(k.wert) })}{" "}
              {k.antwort &&
                t(k.antwort === eigene ? "denk.antwortGleich" : "denk.antwortAnders", {
                  antwort: de(k.antwort),
                  eigene: eigene ? de(eigene) : "",
                })}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** Zwei Zeilen mit Kandidat und Antwort. */
function Eingabe({ pruefe }: { pruefe: (k: readonly string[], a: readonly string[]) => void }) {
  const [kandidaten, setzeKandidaten] = useState<readonly string[]>(LEER);
  const [antworten, setzeAntworten] = useState<readonly string[]>(LEER);
  const setze = (liste: readonly string[], i: number, wert: string) =>
    liste.map((alt, j) => (j === i ? wert : alt));
  return (
    <form
      className="fehlerformular"
      onSubmit={(e) => {
        e.preventDefault();
        pruefe(kandidaten, antworten);
      }}
    >
      {Array.from({ length: KANDIDATEN }, (_, i) => (
        <div key={i} className="denkzeile">
          <input
            type="text"
            className="suchfeld"
            aria-label={t("denk.kandidat", { nummer: i + 1 })}
            placeholder={t("denk.kandidat", { nummer: i + 1 })}
            value={kandidaten[i] ?? ""}
            onChange={(e) => setzeKandidaten(setze(kandidaten, i, e.target.value))}
          />
          <input
            type="text"
            className="suchfeld"
            aria-label={t("denk.antwort", { nummer: i + 1 })}
            placeholder={t("denk.antwort", { nummer: i + 1 })}
            value={antworten[i] ?? ""}
            onChange={(e) => setzeAntworten(setze(antworten, i, e.target.value))}
          />
        </div>
      ))}
      <button type="submit" className="knopf-haupt">
        {t("trainer.pruefen")}
      </button>
    </form>
  );
}

export function Denkroutineaufgabe({ aufgabe, runde }: { aufgabe: Denkaufgabe; runde: Runde }) {
  useSammelstellung(aufgabe.fen);
  const rest = useDenkminute();
  const [eingeben, setzeEingeben] = useState(false);
  const [pruefungen, setzePruefungen] = useState<readonly Kandidatpruefung[] | null>(null);
  const [kandidaten, setzeKandidaten] = useState<readonly Kandidat[] | null>(null);
  const stand = useDenkvergleich(aufgabe.fen, kandidaten);
  const vollstaendig = pruefungen?.every((p) => p.art === "vollstaendig") ?? false;
  const beantwortet = runde.ergebnis !== null;
  useEffect(() => {
    if (beantwortet || !pruefungen) return;
    if (!vollstaendig) runde.beantworte(false);
    else if (stand.art === "fertig") runde.beantworte(geloest(pruefungen, stand.vergleich));
    else if (stand.art === "fehler") runde.beantworte(false);
  }, [beantwortet, pruefungen, vollstaendig, stand, runde]);
  const pruefe = (k: readonly string[], a: readonly string[]) => {
    const neu = k.map((zug, i) => pruefeKandidat(aufgabe.fen, zug, a[i] ?? ""));
    setzePruefungen(neu);
    if (neu.every((p) => p.art === "vollstaendig")) {
      setzeKandidaten(
        neu.flatMap((p) =>
          p.art === "vollstaendig" ? [{ zug: p.kandidat, fenDanach: p.fenDanach }] : [],
        ),
      );
    }
  };
  const seite = aufgabe.fen.split(" ")[1] === "b" ? "b" : "w";
  return (
    <>
      <p>{t("denk.auftrag", { farbe: t(`farbe.${seite}`) })}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        gedreht={seite === "b"}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      {!eingeben && (
        <button
          type="button"
          className="knopf-haupt"
          disabled={rest > 0}
          onClick={() => setzeEingeben(true)}
          data-testid="denk-weiter"
        >
          {rest > 0 ? t("denk.minute", { sekunden: rest }) : t("denk.zurEingabe")}
        </button>
      )}
      {eingeben && !pruefungen && <Eingabe pruefe={pruefe} />}
      {pruefungen && (
        <ul data-testid="denk-pruefung">
          {pruefungen.map((p, i) => (
            <li key={i}>{pruefsatz(p, i + 1)}</li>
          ))}
        </ul>
      )}
      {pruefungen && !vollstaendig && (
        <p className="meldung schlecht">{t("denk.unvollstaendig")}</p>
      )}
      <Vergleich stand={stand} pruefungen={pruefungen ?? []} />
      {beantwortet && <Antwortmeldung richtig={runde.ergebnis === true} />}
    </>
  );
}
