/**
 * Eine Aufgabe von „Falle oder Köder“: Angebot ansehen, Warnsignale prüfen, entscheiden.
 *
 * Rolle im Gesamtbild: Trainer „falle“ (Pflichtenheft 7: „Die Engine spielt den Fallensteller und
 * bietet Material an. Du entscheidest, ob du nimmst, und markierst vorher die Warnsignale.“). Die
 * Warnsignale rechnet das Werkzeug aus Kapitel 4 (k4-warnsignale) auf Wunsch aus der Stellung;
 * danach steht die Widerlegung oder der Gewinn aus der Engine-Prüfung da.
 * Abhängigkeiten: training/fallentrainer.ts, analyse/k4-warnsignale.ts, Trainerbrett.
 */
import { useMemo, useState } from "react";
import { warnsignale } from "../../analyse/k4-warnsignale";
import type { Markierung } from "../../analyse/werkzeug";
import type { Fallenaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { sprache, t } from "../../i18n/sprache";
import { ohneZugzeichen, sanInSprache } from "../../schach/notation";
import { stellungAusFen } from "../../schach/stellung";
import { zugFelder } from "../../schach/weiterspielen";
import { pruefeEntscheidung } from "../../training/fallentrainer";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";
import { antworteMitKarte } from "./kartenantwort";
import { useSammelstellung } from "./sammelstellung";

const buchzug = (san: string) => sanInSprache(san, sprache());
/** Das Angebot vor der Entscheidung: ohne „+“, „#“, „!“ oder „?“, die die Antwort verraten (R31). */
const angebotszug = (san: string) => buchzug(ohneZugzeichen(san));

/** Herkunft: Fallencheck des Buches oder Lichess-Aufgabe. */
function herkunftstext(aufgabe: Aufgabe): string {
  const h = aufgabe.herkunft;
  if (h.quelle === "buch")
    return t("fallentrainer.ausBuch", { nummer: h.abbildung, name: h.fallencheck ?? "" });
  return t("taktiktrainer.ausLichess", { wertung: h.wertung });
}

/** Die Auflösung nach der Entscheidung. */
function Aufloesung({ aufgabe, richtig }: { aufgabe: Aufgabe; richtig: boolean }) {
  const [, widerlegung] = aufgabe.fortsetzung;
  const folge = aufgabe.fortsetzung.map(buchzug).join(" ");
  const text =
    aufgabe.antwort === "falle"
      ? t("fallentrainer.warFalle", {
          zug: buchzug(aufgabe.angebot),
          widerlegung: widerlegung ? buchzug(widerlegung) : folge,
          bester: buchzug(aufgabe.bester),
        })
      : t("fallentrainer.warGeschenk", { zug: buchzug(aufgabe.angebot), folge });
  return (
    <>
      <Antwortmeldung richtig={richtig}>{text}</Antwortmeldung>
      <p className="hinweis">{t("fallentrainer.fortsetzung", { folge })}</p>
    </>
  );
}

/** Die Pfeile: grau das Angebot; nach der Entscheidung gold der beste Zug, falls er anders ist. */
function pfeile(aufgabe: Aufgabe, entschieden: boolean): Markierung[] {
  const angebot = zugFelder(aufgabe.fen, aufgabe.angebot);
  const bester = zugFelder(aufgabe.fen, aufgabe.bester);
  const marken: Markierung[] = angebot ? [{ typ: "pfeil", farbe: "grau", ...angebot }] : [];
  if (entschieden && bester && aufgabe.bester !== aufgabe.angebot)
    marken.push({ typ: "pfeil", farbe: "gold", ...bester });
  return marken;
}

export function Fallenaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  useSammelstellung(aufgabe.fen);
  const [signale, setzeSignale] = useState(false);
  const entschieden = runde.ergebnis !== null;
  const warn = useMemo(() => {
    const gelesen = stellungAusFen(aufgabe.fen);
    const eigen = aufgabe.amZug === "w" ? "white" : "black";
    return gelesen.ok ? warnsignale(gelesen.wert, eigen) : null;
  }, [aufgabe]);
  const markierungen = [
    ...pfeile(aufgabe, entschieden),
    ...(signale && warn ? warn.markierungen : []),
  ];
  const farbe = t(aufgabe.amZug === "w" ? "farbe.w" : "farbe.b");
  return (
    <>
      <p>{t("fallentrainer.auftrag", { farbe, zug: angebotszug(aufgabe.angebot) })}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        markierungen={markierungen}
        gedreht={aufgabe.amZug === "b"}
        beschriftung={t("trainer.falle.name")}
      />
      <p className="hinweis">
        {herkunftstext(aufgabe)} · {t("taktiktrainer.stufe", { stufe: aufgabe.schwierigkeit })}
      </p>
      {!signale && !entschieden && (
        <button type="button" className="knopf-zweit" onClick={() => setzeSignale(true)}>
          {t("fallentrainer.warnsignale")}
        </button>
      )}
      {signale && warn && <p data-testid="falle-warnsignale">{warn.fazit}</p>}
      {!entschieden && (
        <div className="knopfzeile">
          <button
            type="button"
            className="knopf-haupt"
            onClick={() =>
              antworteMitKarte(runde, "falle", aufgabe.id, pruefeEntscheidung(aufgabe, true))
            }
          >
            {t("fallentrainer.nehmen", { zug: angebotszug(aufgabe.angebot) })}
          </button>
          <button
            type="button"
            className="knopf-haupt"
            onClick={() =>
              antworteMitKarte(runde, "falle", aufgabe.id, pruefeEntscheidung(aufgabe, false))
            }
          >
            {t("fallentrainer.nichtNehmen")}
          </button>
        </div>
      )}
      {entschieden && <Aufloesung aufgabe={aufgabe} richtig={runde.ergebnis === true} />}
    </>
  );
}
