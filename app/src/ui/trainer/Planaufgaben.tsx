/**
 * Aufgaben der Planbilanz-Übung (Kapitel 6): Planfragen mit Antwortauswahl, LAP-Übung und
 * Wettrennen bei entgegengesetzten Rochaden.
 *
 * Rolle im Gesamtbild: Trainer „planbilanz“ (AP 13 Stufe 3), drei Übungsarten im gemeinsamen
 * Rundenablauf. Planfragen: Nach jeder Wahl zeigt die Frage die richtige Antwort; gelöst ist die
 * Aufgabe, wenn alle Fragen stimmen. LAP: Figur antippen, dann ihr Zielfeld, „Prüfen“. Wettrennen:
 * Bauernzüge bis zum ersten Hebel für beide Seiten wählen, „Prüfen“.
 * Abhängigkeiten: training/planbilanztrainer.ts, Trainerbrett, Wahlzeile, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { t } from "../../i18n/sprache";
import {
  HOECHSTENS_ZUEGE,
  type Lapaufgabe as LapAufgabe,
  type Planaufgabe as PlanAufgabe,
  type Rennaufgabe as RennAufgabe,
  type Wahlfrage,
} from "../../training/planbilanztrainer";
import { lapbegruendung } from "../../training/lapbegruendung";
import { EngineEinschaetzung } from "./EngineEinschaetzung";
import { lapkennung } from "../../training/wiederholbar";
import { antworteMitKarte } from "./kartenantwort";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";
import { Wahlzeile } from "./Wahlzeile";
import { useSammelstellung } from "./sammelstellung";

const farbe = (seite: Color) => t(seite === "white" ? "farbe.w" : "farbe.b");

/** Eine Frage mit Antwortknöpfen; nach der Wahl grün oder rot und die Erklärung. */
function Frageblock({ frage, waehle }: { frage: Wahlfrage; waehle: (richtig: boolean) => void }) {
  const [gewaehlt, setzeGewaehlt] = useState<number | null>(null);
  const klasse = (i: number) => {
    if (gewaehlt === null) return "antwort";
    if (i === frage.richtig) return "antwort antwort-richtig";
    return i === gewaehlt ? "antwort antwort-falsch" : "antwort";
  };
  return (
    <div className="antworten" role="group" aria-label={frage.frage}>
      <p>
        <strong>{frage.frage}</strong>
      </p>
      {frage.antworten.map((antwort, i) => (
        <button
          key={antwort}
          type="button"
          className={klasse(i)}
          disabled={gewaehlt !== null}
          aria-pressed={gewaehlt === i}
          onClick={() => {
            setzeGewaehlt(i);
            waehle(i === frage.richtig);
          }}
        >
          {antwort}
        </button>
      ))}
      {gewaehlt !== null && frage.erklaerung && <p className="fazit">{frage.erklaerung}</p>}
    </div>
  );
}

/**
 * Eine Aufgabe der Planbilanz-Übung (Kapitel 6): Planfragen mit Antwortauswahl; gelöst, wenn alle
 * Antworten stimmen.
 */
export function Planfragenaufgabe({ aufgabe, runde }: { aufgabe: PlanAufgabe; runde: Runde }) {
  useSammelstellung(aufgabe.fen);
  const [ergebnisse, setzeErgebnisse] = useState<readonly boolean[]>([]);
  const waehle = (richtig: boolean) => {
    const neu = [...ergebnisse, richtig];
    setzeErgebnisse(neu);
    if (neu.length === aufgabe.fragen.length) runde.beantworte(neu.every(Boolean));
  };
  return (
    <>
      <p>
        {aufgabe.warum
          ? t("planuebung.auftragWarum", { nummer: aufgabe.nummer })
          : t("planuebung.auftrag", { farbe: farbe(aufgabe.seite) })}
      </p>
      <Trainerbrett
        fen={aufgabe.fen}
        gedreht={aufgabe.seite === "black"}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      {aufgabe.fragen.map((f) => (
        <Frageblock key={f.frage} frage={f} waehle={waehle} />
      ))}
      {runde.ergebnis !== null && <Antwortmeldung richtig={runde.ergebnis} />}
      {runde.ergebnis !== null && !aufgabe.warum && (
        <EngineEinschaetzung fen={aufgabe.fen} gedreht={aufgabe.seite === "black"} />
      )}
      {runde.ergebnis !== null && aufgabe.buchbilanz && (
        <p className="hinweis">{t("planbilanz.buchVerweis", { abbildung: aufgabe.nummer })}</p>
      )}
    </>
  );
}

/**
 * Eine LAP-Aufgabe der Planbilanz-Übung (Kapitel 6): Figur antippen, dann ihr Zielfeld, und prüfen.
 */
export function Lapaufgabe({ aufgabe, runde }: { aufgabe: LapAufgabe; runde: Runde }) {
  useSammelstellung(aufgabe.fen);
  const [figur, setzeFigur] = useState<string | null>(null);
  const [ziel, setzeZiel] = useState<string | null>(null);
  const beantwortet = runde.ergebnis !== null;
  const tippe = (feld: string) => {
    if (beantwortet) return;
    if (figur === null || feld === figur) {
      setzeFigur(feld === figur ? null : feld);
      setzeZiel(null);
    } else setzeZiel(feld);
  };
  const gewaehlt: Markierung[] = [
    ...(figur ? [{ typ: "feld", farbe: "gold", feld: figur } as const] : []),
    ...(ziel ? [{ typ: "feld", farbe: "grau", feld: ziel } as const] : []),
  ];
  const loesung: Markierung[] = aufgabe.ziel
    ? [{ typ: "pfeil", farbe: "gold", von: aufgabe.figur, nach: aufgabe.ziel }]
    : [{ typ: "feld", farbe: "gold", feld: aufgabe.figur }];
  return (
    <>
      <p>{t("planuebung.lap", { farbe: farbe(aufgabe.seite) })}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        gedreht={aufgabe.seite === "black"}
        markierungen={beantwortet ? [...gewaehlt, ...loesung] : gewaehlt}
        beiFeld={tippe}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      {!beantwortet && (
        <button
          type="button"
          className="knopf-haupt"
          disabled={figur === null || ziel === null}
          onClick={() =>
            antworteMitKarte(
              runde,
              "planbilanz",
              lapkennung(aufgabe),
              figur === aufgabe.figur && ziel === aufgabe.ziel,
            )
          }
        >
          {t("trainer.pruefen")}
        </button>
      )}
      {beantwortet && (
        <Antwortmeldung richtig={runde.ergebnis === true}>
          {t("planuebung.lapLoesung", { figur: aufgabe.figur, ziel: aufgabe.ziel ?? "" })}
        </Antwortmeldung>
      )}
      {beantwortet && <EngineEinschaetzung fen={aufgabe.fen} gedreht={aufgabe.seite === "black"} />}
      {beantwortet && (
        <section className="karte" data-testid="lap-begruendung">
          {lapbegruendung(aufgabe, figur, ziel).map((satz) => (
            <p key={satz}>{satz}</p>
          ))}
        </section>
      )}
    </>
  );
}

const ZUEGE = Array.from({ length: HOECHSTENS_ZUEGE }, (_, i) => String(i + 1));

/**
 * Eine Wettrennen-Aufgabe der Planbilanz-Übung (Kapitel 6): bei entgegengesetzten Rochaden die
 * Bauernzüge bis zum ersten Hebel für beide Seiten wählen.
 */
export function Rennaufgabe({ aufgabe, runde }: { aufgabe: RennAufgabe; runde: Runde }) {
  const [wahl, setzeWahl] = useState<Partial<Record<Color, string>>>({});
  const beantwortet = runde.ergebnis !== null;
  const { white: weiss, black: schwarz } = aufgabe.zuege;
  const schneller = weiss === schwarz ? "gleich" : weiss < schwarz ? "weiss" : "schwarz";
  return (
    <>
      <p>{t("planuebung.rennen")}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      {(["white", "black"] as const).map((seite) => (
        <Wahlzeile
          key={seite}
          titel={farbe(seite)}
          werte={ZUEGE}
          name={(w) => w}
          wert={wahl[seite]}
          setze={(w) => setzeWahl({ ...wahl, [seite]: w })}
          app={beantwortet ? String(aufgabe.zuege[seite]) : null}
        />
      ))}
      {!beantwortet && (
        <button
          type="button"
          className="knopf-haupt"
          disabled={!wahl.white || !wahl.black}
          onClick={() =>
            runde.beantworte(wahl.white === String(weiss) && wahl.black === String(schwarz))
          }
        >
          {t("trainer.pruefen")}
        </button>
      )}
      {beantwortet && (
        <Antwortmeldung richtig={runde.ergebnis === true}>
          {t(`planuebung.schneller.${schneller}`)}
        </Antwortmeldung>
      )}
    </>
  );
}
