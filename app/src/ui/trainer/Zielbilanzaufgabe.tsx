/**
 * Aufgabe der Zielbilanz-Übung: die Tabelle aus Kapitel 2 für beide Seiten ausfüllen.
 *
 * Rolle im Gesamtbild: Trainer „zielbilanz“ (AP 13). Der Leser wählt je Seite und Ziel ja, teils
 * oder nein; nach „Prüfen“ zeigt die App ihre Wertung neben jeder Zeile und darunter die
 * Begründung mit denselben Sätzen wie das Werkzeug „Zielbilanz“ (k2-zielbilanz.ts).
 * Abhängigkeiten: training/zielbilanztrainer.ts, analyse/k2-zielbilanz.ts, Trainerbrett.
 */
import type { Color } from "chessops/types";
import { useMemo, useState } from "react";
import { zielbilanzWerkzeug } from "../../analyse/k2-zielbilanz";
import { t } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import type { Wertung } from "../../schach/zielbilanz";
import {
  abweichungen,
  SEITEN,
  WERTUNGEN,
  ZIELE,
  type Tabelle,
  type Ziel,
  type Zielbilanzaufgabe as Aufgabe,
} from "../../training/zielbilanztrainer";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";
import { Wahlzeile } from "./Wahlzeile";

type Entwurf = Record<Color, Partial<Record<Ziel, Wertung>>>;

/** Die fertige Tabelle, sobald jedes Feld gewählt ist, sonst null. */
function vollstaendig(entwurf: Entwurf): Tabelle | null {
  const zeile = (seite: Color) => {
    const z = entwurf[seite];
    return z.zentrum && z.entwicklung && z.koenig
      ? { zentrum: z.zentrum, entwicklung: z.entwicklung, koenig: z.koenig }
      : null;
  };
  const weiss = zeile("white");
  const schwarz = zeile("black");
  return weiss && schwarz ? { white: weiss, black: schwarz } : null;
}

/** Die Begründung der App, wie im Werkzeug „Zielbilanz“. */
function Begruendung({ fen }: { fen: string }) {
  const ergebnis = useMemo(() => {
    const gelesen = stellungAusFen(fen);
    return gelesen.ok ? zielbilanzWerkzeug(gelesen.wert, "white") : null;
  }, [fen]);
  if (!ergebnis) return null;
  return (
    <section className="karte" data-testid="zielbilanz-begruendung">
      {ergebnis.befunde.map((b) => (
        <div key={b.kennung}>
          <h3 className="karte-titel">{b.titel}</h3>
          {b.zeilen.map((z) => (
            <p key={z}>{z}</p>
          ))}
        </div>
      ))}
    </section>
  );
}

export function Zielbilanzaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  const [entwurf, setzeEntwurf] = useState<Entwurf>({ white: {}, black: {} });
  const beantwortet = runde.ergebnis !== null;
  const tabelle = vollstaendig(entwurf);
  const setze = (seite: Color, ziel: Ziel) => (w: Wertung) =>
    setzeEntwurf({ ...entwurf, [seite]: { ...entwurf[seite], [ziel]: w } });
  return (
    <>
      <p>{t("zielbilanztrainer.auftrag")}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      {SEITEN.map((seite) => (
        <section key={seite} data-testid={`zielbilanz-${seite}`}>
          <h3 className="karte-titel">{t(`zielbilanztrainer.seite.${seite}`)}</h3>
          {ZIELE.map((ziel) => (
            <Wahlzeile
              key={ziel}
              titel={t(`zielbilanz.ziel.${ziel}`)}
              werte={WERTUNGEN}
              name={(w) => t(`zielbilanz.wertung.${w}`)}
              wert={entwurf[seite][ziel]}
              setze={setze(seite, ziel)}
              app={beantwortet ? aufgabe.loesung[seite][ziel] : null}
            />
          ))}
        </section>
      ))}
      {!beantwortet && (
        <button
          type="button"
          className="knopf-haupt"
          disabled={tabelle === null}
          onClick={() => tabelle && runde.beantworte(abweichungen(aufgabe, tabelle).length === 0)}
        >
          {t("trainer.pruefen")}
        </button>
      )}
      {beantwortet && <Antwortmeldung richtig={runde.ergebnis === true} />}
      {beantwortet && <Begruendung fen={aufgabe.fen} />}
    </>
  );
}
