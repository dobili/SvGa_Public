/**
 * Eine Aufgabe von „Falle oder Köder“: Köder-Zug des Gegners ansehen, entscheiden, dann die
 * Widerlegung und die Warnsignale sehen.
 *
 * Rolle im Gesamtbild: Trainer „falle“ (Pflichtenheft 7: „Die Engine spielt den Fallensteller und
 * bietet Material an. Du entscheidest, ob du nimmst.“). Der Köder-Zug steht als roter Pfeil am
 * Brett, das Angebot als grauer (P4, R50). Seit dem Nebenchat (30.10.2026, Wunsch des Autors):
 * Die Warnsignale (Kapitel 4, k4-warnsignale) sind vor der Entscheidung ein freiwilliger
 * Hinweis; nach der Entscheidung zeigt das Brett nur die Lösung, die Fortsetzung lässt sich mit
 * Bewertungsbalken vorspielen (Folgespieler), und ein Satz sagt, ob die Signale geholfen hätten.
 * Seit der Runde „Weniger Text“ (P12, 31.10.2026): Frage groß mit Pfeil-Legende, Antwort als
 * Banner mit „▼ Verlust“ und goldenem Besser-Chip, die Sätze hinter ⓘ (Fallenantwort.tsx).
 * Abhängigkeiten: training/fallentrainer.ts, analyse/k4-warnsignale.ts, Trainerbrett,
 * Fallenantwort.tsx.
 */
import { TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
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
import { warnnutzen, type Warnnutzen } from "../../training/fallenwarnung";
import { Folgespieler } from "./Folgespieler";
import { Fallenbanner, Fallenfrage, type Fallenausgang } from "./Fallenantwort";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";
import { THEMA_FALLE } from "../../speicher/themenprotokoll";
import { antworteMitKarte } from "./kartenantwort";
import { useSammelstellung } from "./sammelstellung";
import { useImSpiel } from "./imSpiel";

const buchzug = (san: string) => sanInSprache(san, sprache());
const NACHKOMMASTELLEN = 1;
const WARNSYMBOL = 18;
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

/** Der bisherige Satz der Auflösung (für ⓘ): Widerlegung, Wirkung, Verlust, besserer Zug. */
function aufloesungssatz(aufgabe: Aufgabe, matt: boolean, folge: string): string {
  const widerlegung = widerlegungszug(aufgabe);
  if (aufgabe.antwort !== "falle")
    return t("fallentrainer.warGeschenk", {
      zug: buchzug(aufgabe.angebot),
      vorzug: buchzug(aufgabe.vorzug),
    });
  return t(matt ? "fallentrainer.warFalleMatt" : "fallentrainer.warFalle", {
    zug: buchzug(aufgabe.angebot),
    widerlegung: widerlegung ? buchzug(widerlegung) : folge,
    wirkung: t(`fallentrainer.wirkung.${wirkungDerWiderlegung(aufgabe)}`),
    verlust: zahlText(aufgabe.verlustBeimNehmen, NACHKOMMASTELLEN),
    bester: buchzug(aufgabe.bester),
  });
}

/**
 * Der Ausgang nach der Entscheidung für das Banner (P12). Bei Matt ist der Verlust ein Mattwert,
 * keine Bauernzahl (Befund N691, 26.10.2026).
 */
function ausgangVon(aufgabe: Aufgabe, richtig: boolean, nutzen: Warnnutzen): Fallenausgang {
  const folge = aufgabe.fortsetzung.map(buchzug).join(" ");
  const falle = aufgabe.antwort === "falle";
  const matt =
    wirkungDerWiderlegung(aufgabe) === "matt" || aufgabe.verlustBeimNehmen >= MATT_AB_BAUERN;
  const verlust = matt
    ? t("wenigertext.werkzeug.matt")
    : zahlText(aufgabe.verlustBeimNehmen, NACHKOMMASTELLEN);
  return {
    richtig,
    falle,
    angebot: buchzug(aufgabe.angebot),
    verlust: falle ? verlust : null,
    bester: falle && aufgabe.bester !== aufgabe.angebot ? buchzug(aufgabe.bester) : null,
    folge,
    saetze: (
      <>
        <p>{aufloesungssatz(aufgabe, matt, folge)}</p>
        <p>{t("fallentrainer.fortsetzung", { folge })}</p>
        <Warnnutzensatz nutzen={nutzen} />
      </>
    ),
  };
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

/** Der Satz zum Nutzen der Warnsignale nach der Entscheidung. */
function Warnnutzensatz({ nutzen }: { nutzen: Warnnutzen }) {
  if (!nutzen) return null;
  const text =
    nutzen.art === "geholfen"
      ? t("fallentrainer.warnGeholfen", { feld: nutzen.feld, zug: buchzug(nutzen.zug) })
      : nutzen.art === "nichtGeholfen"
        ? t("fallentrainer.warnNichtGeholfen", { zug: buchzug(nutzen.zug) })
        : t("fallentrainer.warnUnnoetig");
  return <p data-testid="falle-warnnutzen">{text}</p>;
}

/**
 * Eine Aufgabe von „Falle oder Köder“: den Köder-Zug ansehen, auf Wunsch die Warnsignale als
 * Hinweis, nehmen oder ablehnen, dann Widerlegung mit Balken und den Nutzen der Signale sehen.
 */
export function Fallenaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  const imSpiel = useImSpiel();
  useSammelstellung(aufgabe.fen);
  const entschieden = runde.ergebnis !== null;
  const warn = useMemo(() => {
    const gelesen = stellungAusFen(aufgabe.fen);
    const eigen = aufgabe.amZug === "w" ? "white" : "black";
    return gelesen.ok ? warnsignale(gelesen.wert, eigen) : null;
  }, [aufgabe]);
  const [hinweis, setzeHinweis] = useState(false);
  const zeigeWarn = hinweis && !entschieden && warn !== null;
  const markierungen = [...pfeile(aufgabe, entschieden), ...(zeigeWarn ? warn.markierungen : [])];
  const nutzen = useMemo(
    () => (warn ? warnnutzen(aufgabe, warn.markierungen) : null),
    [aufgabe, warn],
  );
  const farbe = t(aufgabe.amZug === "w" ? "farbe.w" : "farbe.b");
  const antworte = (nimmt: boolean) =>
    antworteMitKarte(runde, "falle", aufgabe.id, pruefeEntscheidung(aufgabe, nimmt), THEMA_FALLE);
  const auftrag = t("fallentrainer.auftrag", {
    farbe,
    vorzug: buchzug(aufgabe.vorzug),
    zug: angebotszug(aufgabe.angebot),
  });
  // Im Schach-Abenteuer ohne Herkunft und Stufe: Die Figur der Geschichte stellt die Frage.
  const kurzzeile = imSpiel
    ? t("wenigertext.werkzeug.falle.amZug", { farbe })
    : [
        t("wenigertext.werkzeug.falle.amZug", { farbe }),
        herkunftstext(aufgabe),
        t("taktiktrainer.stufe", { stufe: aufgabe.schwierigkeit }),
      ].join(" · ");
  return (
    <>
      <Fallenfrage
        vorzug={buchzug(aufgabe.vorzug)}
        angebot={angebotszug(aufgabe.angebot)}
        kurzzeile={kurzzeile}
        auftrag={auftrag}
      />
      <Trainerbrett
        fen={aufgabe.fen}
        markierungen={markierungen}
        gedreht={aufgabe.amZug === "b"}
        beschriftung={t("trainer.falle.name")}
      />
      {!entschieden && warn && (
        <button
          type="button"
          className="knopf-link mitsymbol"
          aria-pressed={hinweis}
          onClick={() => setzeHinweis(!hinweis)}
        >
          <TriangleAlert size={WARNSYMBOL} aria-hidden="true" />
          {t(hinweis ? "fallentrainer.warnVerbergen" : "fallentrainer.warnZeigen")}
        </button>
      )}
      {zeigeWarn && (
        <p className="hinweis" data-testid="falle-warnsignale">
          {t("fallentrainer.warnHinweis", { fazit: warn.fazit })}
        </p>
      )}
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
      {entschieden && (
        <Fallenbanner ausgang={ausgangVon(aufgabe, runde.ergebnis === true, nutzen)} />
      )}
      {entschieden && (
        <Folgespieler
          startFen={aufgabe.fen}
          zuege={aufgabe.fortsetzung}
          titel={t("fallentrainer.folgeTitel")}
          gedreht={aufgabe.amZug === "b"}
          testid="falle-folge"
        />
      )}
    </>
  );
}
