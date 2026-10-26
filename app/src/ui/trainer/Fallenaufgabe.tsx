/**
 * Eine Aufgabe von „Falle oder Köder“: Köder-Zug des Gegners ansehen, entscheiden, dann die
 * Widerlegung und die Warnsignale sehen.
 *
 * Rolle im Gesamtbild: Trainer „falle“ (Pflichtenheft 7: „Die Engine spielt den Fallensteller und
 * bietet Material an. Du entscheidest, ob du nimmst.“). Seit P4 (R50) steht der Köder-Zug als
 * roter Pfeil am Brett, das Angebot als grauer; die Warnsignale (Kapitel 4, k4-warnsignale)
 * erscheinen erst nach der Antwort, zusammen mit der Widerlegung aus der Engine-Prüfung und dem
 * Wert vor und nach dem Nehmen.
 * Abhängigkeiten: training/fallentrainer.ts, analyse/k4-warnsignale.ts, Trainerbrett.
 */
import { useMemo } from "react";
import { warnsignale } from "../../analyse/k4-warnsignale";
import type { Markierung } from "../../analyse/werkzeug";
import type { Fallenaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { sprache, t, zahlText } from "../../i18n/sprache";
import { ohneZugzeichen, sanInSprache } from "../../schach/notation";
import { stellungAusFen } from "../../schach/stellung";
import { zugFelder } from "../../schach/weiterspielen";
import {
  pruefeEntscheidung,
  widerlegungszug,
  wirkungDerWiderlegung,
} from "../../training/fallentrainer";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";
import { antworteMitKarte } from "./kartenantwort";
import { useSammelstellung } from "./sammelstellung";

const buchzug = (san: string) => sanInSprache(san, sprache());
const NACHKOMMASTELLEN = 1;
/** Ab diesem „Verlust“ ist der Wert ein Mattwert (mehr Material gibt es auf dem Brett nicht). */
const MATT_AB_BAUERN = 50;
/** Das Angebot vor der Entscheidung: ohne „+“, „#“, „!“ oder „?“, die die Antwort verraten (R31). */
const angebotszug = (san: string) => buchzug(ohneZugzeichen(san));

/** Herkunft: Fallencheck des Buches oder Lichess-Aufgabe. */
function herkunftstext(aufgabe: Aufgabe): string {
  const h = aufgabe.herkunft;
  if (h.quelle === "buch")
    return t("fallentrainer.ausBuch", { nummer: h.abbildung, name: h.fallencheck ?? "" });
  return t("taktiktrainer.ausLichess", { wertung: h.wertung });
}

/** Die Auflösung nach der Entscheidung: Widerlegung, Wirkung, Wert vorher und nachher. */
function Aufloesung({ aufgabe, richtig }: { aufgabe: Aufgabe; richtig: boolean }) {
  const folge = aufgabe.fortsetzung.map(buchzug).join(" ");
  const widerlegung = widerlegungszug(aufgabe);
  const wirkung = wirkungDerWiderlegung(aufgabe);
  // Bei Matt ist der Verlust ein Mattwert, keine Bauernzahl (Befund N691, 26.10.2026).
  const matt = wirkung === "matt" || aufgabe.verlustBeimNehmen >= MATT_AB_BAUERN;
  const text =
    aufgabe.antwort === "falle"
      ? t(matt ? "fallentrainer.warFalleMatt" : "fallentrainer.warFalle", {
          zug: buchzug(aufgabe.angebot),
          widerlegung: widerlegung ? buchzug(widerlegung) : folge,
          wirkung: t(`fallentrainer.wirkung.${wirkung}`),
          verlust: zahlText(aufgabe.verlustBeimNehmen, NACHKOMMASTELLEN),
          bester: buchzug(aufgabe.bester),
        })
      : t("fallentrainer.warGeschenk", {
          zug: buchzug(aufgabe.angebot),
          vorzug: buchzug(aufgabe.vorzug),
        });
  return (
    <>
      <Antwortmeldung richtig={richtig}>{text}</Antwortmeldung>
      <p className="hinweis">{t("fallentrainer.fortsetzung", { folge })}</p>
    </>
  );
}

/**
 * Die Pfeile: rot der Köder-Zug des Gegners, grau das Angebot; nach der Entscheidung gold der
 * beste Zug, falls er ein anderer ist.
 */
function pfeile(aufgabe: Aufgabe, entschieden: boolean): Markierung[] {
  const koeder = zugFelder(aufgabe.fenVorher, aufgabe.vorzug);
  const angebot = zugFelder(aufgabe.fen, aufgabe.angebot);
  const bester = zugFelder(aufgabe.fen, aufgabe.bester);
  const marken: Markierung[] = [];
  if (koeder) marken.push({ typ: "pfeil", farbe: "rot", ...koeder });
  if (angebot) marken.push({ typ: "pfeil", farbe: "grau", ...angebot });
  if (entschieden && bester && aufgabe.bester !== aufgabe.angebot)
    marken.push({ typ: "pfeil", farbe: "gold", ...bester });
  return marken;
}

/**
 * Eine Aufgabe von „Falle oder Köder“: den Köder-Zug ansehen, nehmen oder ablehnen, dann
 * Widerlegung und Warnsignale sehen.
 */
export function Fallenaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  useSammelstellung(aufgabe.fen);
  const entschieden = runde.ergebnis !== null;
  const warn = useMemo(() => {
    const gelesen = stellungAusFen(aufgabe.fen);
    const eigen = aufgabe.amZug === "w" ? "white" : "black";
    return gelesen.ok ? warnsignale(gelesen.wert, eigen) : null;
  }, [aufgabe]);
  const markierungen = [
    ...pfeile(aufgabe, entschieden),
    ...(entschieden && warn ? warn.markierungen : []),
  ];
  const farbe = t(aufgabe.amZug === "w" ? "farbe.w" : "farbe.b");
  const antworte = (nimmt: boolean) =>
    antworteMitKarte(runde, "falle", aufgabe.id, pruefeEntscheidung(aufgabe, nimmt));
  return (
    <>
      <p>
        {t("fallentrainer.auftrag", {
          farbe,
          vorzug: buchzug(aufgabe.vorzug),
          zug: angebotszug(aufgabe.angebot),
        })}
      </p>
      <Trainerbrett
        fen={aufgabe.fen}
        markierungen={markierungen}
        gedreht={aufgabe.amZug === "b"}
        beschriftung={t("trainer.falle.name")}
      />
      <p className="hinweis">
        {herkunftstext(aufgabe)} · {t("taktiktrainer.stufe", { stufe: aufgabe.schwierigkeit })}
      </p>
      {!entschieden && (
        <div className="knopfzeile">
          <button type="button" className="knopf-haupt" onClick={() => antworte(true)}>
            {t("fallentrainer.nehmen", { zug: angebotszug(aufgabe.angebot) })}
          </button>
          <button type="button" className="knopf-haupt" onClick={() => antworte(false)}>
            {t("fallentrainer.nichtNehmen")}
          </button>
        </div>
      )}
      {entschieden && <Aufloesung aufgabe={aufgabe} richtig={runde.ergebnis === true} />}
      {entschieden && warn && (
        <p className="hinweis" data-testid="falle-warnsignale">
          {t("fallentrainer.warnsignaleDanach", { fazit: warn.fazit })}
        </p>
      )}
    </>
  );
}
