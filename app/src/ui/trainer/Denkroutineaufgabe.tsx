/**
 * Aufgabe des Denkroutine-Trainers: eine Minute denken, dann zwei Kandidaten mit je der stärksten
 * Antwort am Brett ziehen (F2), prüfen und mit der Engine vergleichen.
 *
 * Rolle im Gesamtbild: Trainer „denkroutine“ (Kapitel 12, AP 13 Stufe 3). Während der Minute
 * steht nur das Brett da; erst danach öffnet sich die Eingabe (die feste Zeit ist der Kern der
 * Übung). Gelöst ist die Aufgabe, wenn zu beiden Kandidaten eine Antwort steht und der bessere
 * Kandidat höchstens 0,5 Bauern hinter dem Zug der Engine liegt.
 * Abhängigkeiten: training/denkroutinetrainer.ts, useDenkvergleich.ts, Denkeingabe.tsx,
 * Trainerbrett, i18n.
 */
import { useEffect, useState } from "react";
import { sprache, t, tZahl, zahlText } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import {
  DENKZEIT_S,
  geloest,
  pruefeKandidat,
  VERLUST_GRENZE,
  type Denkaufgabe,
  type Denkvergleich,
  type Kandidatpruefung,
} from "../../training/denkroutinetrainer";
import { Denkeingabe } from "./Denkeingabe";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import { Folgenwahl } from "./Folgespieler";
import { useDenkvergleich, type Denkstand, type Kandidat } from "./useDenkvergleich";
import type { Runde } from "./useRunde";
import { useSammelstellung } from "./sammelstellung";

const SEKUNDE_MS = 1000;
/** Ab diesem Betrag ist ein Wert ein Matt (Engine-Werte mit Matt liegen nahe 100). */
const MATT_AB = 50;

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
      return p.antwort === ""
        ? t("denk.ohneAntwort", { zug: de(p.kandidat) })
        : t("denk.vollstaendig", { zug: de(p.kandidat), antwort: de(p.antwort) });
  }
}

/** Ergebnis der Engine: bester Zug, je Kandidat Wert und stärkste Antwort. */
function Vergleich({
  stand,
  pruefungen,
  fen,
}: {
  stand: Denkstand;
  pruefungen: readonly Kandidatpruefung[];
  fen: string;
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
      <Folgenwahl
        startFen={fen}
        linien={[
          { name: t("denk.linieEngine", { zug: de(v.besterZug) }), zuege: [v.besterZug] },
          ...v.kandidaten.map((k) => ({
            name: t("denk.linieKandidat", { zug: de(k.zug) }),
            zuege: k.antwort ? [k.zug, k.antwort] : [k.zug],
          })),
        ]}
        titel={t("denk.linienTitel")}
        gedreht={fen.split(" ")[1] === "b"}
        testid="denk-folgen"
      />
    </section>
  );
}

/**
 * Der Grund des Urteils: Wie weit liegt der bessere eigene Kandidat hinter dem Zug der Engine?
 * Gelöst ist bis 0,5 Bauern (training/denkroutinetrainer.ts, geloest).
 */
function urteilssatz(v: Denkvergleich): string {
  const bester = Math.max(...v.kandidaten.map((k) => k.wert));
  const abstand = Math.max(0, v.besterWert - bester);
  if (abstand <= VERLUST_GRENZE) return t("denk.urteilGut");
  const zug = de(v.besterZug);
  // Matt ist kein Abstand in Bauern (Werte nahe 100): eigener Satz statt „97,8 Bauern“, seit
  // Stellungen im Schach erlaubt sind häufiger (Prüfung beim Übernehmen, 31.10.2026).
  const matt = mattfall(v.besterWert, bester);
  if (matt) return t(matt, { zug });
  return t("denk.urteilAbstand", { abstand: zahlText(abstand, 1), zug });
}

/**
 * Welcher Satz für einen Mattfall (Schlüssel)? Beide Werte aus Sicht der Seite am Zug, Matt nahe ±100.
 * Beispiel: Engine 98 (Matt in 2), bester Kandidat 1,5 → verpasst; beide matt → schneller; sonst null.
 */
function mattfall(
  engine: number,
  bester: number,
):
  | "denk.urteilMattLaenger"
  | "denk.urteilMattVerpasst"
  | "denk.urteilMattUnvermeidlich"
  | "denk.urteilMattDroht"
  | null {
  if (engine >= MATT_AB)
    return bester >= MATT_AB ? "denk.urteilMattLaenger" : "denk.urteilMattVerpasst";
  if (engine <= -MATT_AB) return "denk.urteilMattUnvermeidlich";
  return bester <= -MATT_AB ? "denk.urteilMattDroht" : null;
}

/**
 * Eine Aufgabe des Denkroutine-Trainers (Kapitel 12): eine Minute denken, dann zwei Kandidaten mit
 * der stärksten Antwort ziehen und mit der Engine vergleichen.
 */
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
      {!eingeben && (
        <Trainerbrett
          fen={aufgabe.fen}
          gedreht={seite === "b"}
          beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
        />
      )}
      {!eingeben && (
        <button
          type="button"
          className="knopf-haupt"
          disabled={rest > 0}
          onClick={() => setzeEingeben(true)}
          data-testid="denk-weiter"
        >
          {rest > 0 ? tZahl("denk.minute", rest, { sekunden: rest }) : t("denk.zurEingabe")}
        </button>
      )}
      {eingeben && (
        <Denkeingabe
          fen={aufgabe.fen}
          gedreht={seite === "b"}
          gegner={t(seite === "w" ? "farbe.b" : "farbe.w")}
          pruefe={pruefe}
        />
      )}
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
      {/* Einheitliche Reihenfolge (Punkt B6 des Nebenchats): Urteil mit Grund, dann der Vergleich
          und zuletzt das Durchspielen mit Balken. */}
      {beantwortet && (
        <Antwortmeldung richtig={runde.ergebnis === true}>
          {stand.art === "fertig" && vollstaendig ? urteilssatz(stand.vergleich) : undefined}
        </Antwortmeldung>
      )}
      <Vergleich stand={stand} pruefungen={pruefungen ?? []} fen={aufgabe.fen} />
    </>
  );
}
