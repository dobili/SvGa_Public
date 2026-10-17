/**
 * Eine Aufgabe des Taktiktrainers: Züge ziehen, gestufte Hilfen, danach das Motiv benennen.
 *
 * Rolle im Gesamtbild: Trainer „taktik“ (Pflichtenheft 7: „Gestufte Hilfen: Warnsignal, Motiv,
 * Schlüsselfigur, Lösung. Nach der Lösung benennst du das Motiv.“). Das Warnsignal rechnet das
 * Werkzeug Warnsignale aus Kapitel 7 aus der Stellung. Richtig zählt eine Aufgabe, die ohne
 * falschen Zug und ohne Hilfe gelöst ist; das Benennen des Motivs zeigt nur, ob es stimmte.
 * Abhängigkeiten: training/taktiktrainer.ts, analyse/k7-warnsignale.ts, Brettbereich.
 */
import { useMemo, useState } from "react";
import { warnsignaleSieben } from "../../analyse/k7-warnsignale";
import type { Markierung } from "../../analyse/werkzeug";
import type { Taktikaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { stellungAusFen, type Rolle } from "../../schach/stellung";
import { spieleZug, zugFelder } from "../../schach/weiterspielen";
import { alsZugaufgabe, MOTIVE, pruefeTaktikzug } from "../../training/taktiktrainer";
import { stellungNach } from "../../training/uebungsaufgabe";
import { Brettbereich } from "../komponenten/Brettbereich";
import { useBrettbedienung } from "../komponenten/useBrettbedienung";
import { Antwortmeldung } from "./Rundenrahmen";
import type { Runde } from "./useRunde";

const HILFEN = 3;
const KEINE_WAHL = () => undefined;

/** Woher die Aufgabe stammt: Abbildung des Buches oder Lichess-Datenbank. */
function Herkunft({ aufgabe }: { aufgabe: Aufgabe }) {
  const h = aufgabe.herkunft;
  return (
    <p className="hinweis">
      {h.quelle === "buch"
        ? t("taktiktrainer.ausBuch", { nummer: h.abbildung })
        : t("taktiktrainer.ausLichess", { wertung: h.wertung })}
      {" · "}
      {t("taktiktrainer.stufe", { stufe: aufgabe.schwierigkeit })}
    </p>
  );
}

/** Die Hilfen in drei Stufen, darunter „Lösung zeigen“. */
function Hilfen({
  aufgabe,
  stufe,
  weiter,
  zeigeLoesung,
}: {
  aufgabe: Aufgabe;
  stufe: number;
  weiter: () => void;
  zeigeLoesung: () => void;
}) {
  const warnsignal = useMemo(() => {
    const gelesen = stellungAusFen(aufgabe.fen);
    const eigen = aufgabe.amZug === "w" ? "white" : "black";
    return gelesen.ok ? warnsignaleSieben(gelesen.wert, eigen).fazit : "";
  }, [aufgabe]);
  const motiv = aufgabe.motiv
    ? t(`taktiktrainer.motiv.${aufgabe.motiv}`)
    : aufgabe.mattbild
      ? t(`mattbild.${aufgabe.mattbild}`)
      : t("taktiktrainer.ohneMotiv");
  return (
    <div className="uebung-hilfe">
      {stufe >= 1 && <p>{t("taktiktrainer.hilfeWarnsignal", { text: warnsignal })}</p>}
      {stufe >= 2 && <p data-testid="taktik-motiv">{t("taktiktrainer.hilfeMotiv", { motiv })}</p>}
      {stufe >= HILFEN && <p>{t("taktiktrainer.hilfeFigur")}</p>}
      <div className="knopfzeile">
        {stufe < HILFEN && (
          <button type="button" className="knopf-zweit" onClick={weiter}>
            {t("uebung.hinweis", { stufe: stufe + 1 })}
          </button>
        )}
        <button type="button" className="knopf-link" onClick={zeigeLoesung}>
          {t("uebung.loesungZeigen")}
        </button>
      </div>
    </div>
  );
}

/** Nach dem Lösen: das Motiv benennen (nur bei Aufgaben mit Grundmotiv). */
function MotivBenennen({ richtig }: { richtig: Aufgabe["motiv"] }) {
  const [gewaehlt, setzeGewaehlt] = useState<string | null>(null);
  if (!richtig) return null;
  return (
    <fieldset className="zahlwahl" data-testid="motiv-benennen">
      <legend>{t("taktiktrainer.benennen")}</legend>
      {MOTIVE.map((m) => (
        <button
          key={m}
          type="button"
          className="chip"
          aria-pressed={gewaehlt === m}
          disabled={gewaehlt !== null}
          onClick={() => setzeGewaehlt(m)}
        >
          {t(`taktiktrainer.motiv.${m}`)}
        </button>
      ))}
      {gewaehlt && (
        <Antwortmeldung richtig={gewaehlt === richtig}>
          {t("taktiktrainer.motivWar", { motiv: t(`taktiktrainer.motiv.${richtig}`) })}
        </Antwortmeldung>
      )}
    </fieldset>
  );
}

/** Eine Taktikaufgabe in der Runde. */
export function Taktikaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  const zugaufgabe = useMemo(() => alsZugaufgabe(aufgabe), [aufgabe]);
  const [zuege, setzeZuege] = useState<readonly string[]>([]);
  const [stufe, setzeStufe] = useState(0);
  const [fehler, setzeFehler] = useState(false);
  const [gezeigt, setzeGezeigt] = useState(false);
  const fen = stellungNach(aufgabe.fen, zuege);
  const fertig = runde.ergebnis !== null;
  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    if (!zugaufgabe || fertig) return "ungueltig" as const;
    const versuch = spieleZug(fen, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    const pruefung = pruefeTaktikzug(zugaufgabe, zuege, versuch.san);
    if (pruefung.art === "falsch") {
      setzeFehler(true);
      return "gespielt" as const;
    }
    const neu = [...zuege, versuch.san, ...(pruefung.antwort ? [pruefung.antwort] : [])];
    setzeZuege(neu);
    if (pruefung.art === "geloest") runde.beantworte(!fehler && stufe === 0);
    return "gespielt" as const;
  };
  const zeigeLoesung = () => {
    setzeGezeigt(true);
    setzeZuege(zugaufgabe?.linien[0] ?? []);
    runde.beantworte(false);
  };
  const bedienung = useBrettbedienung({ fen, spiele }, fertig ? null : "ziehen", KEINE_WAHL);
  const stellung = useMemo(() => stellungAusFen(fen), [fen]);
  const markierungen: Markierung[] =
    stufe >= HILFEN && !fertig
      ? [{ typ: "feld", farbe: "gold", feld: aufgabe.schluesselfeld }]
      : [];
  const letzter =
    zuege.length > 0
      ? zugFelder(stellungNach(aufgabe.fen, zuege.slice(0, -1)), zuege[zuege.length - 1] ?? "")
      : null;
  return (
    <>
      <p className="trainer-auftrag">
        {t(`taktiktrainer.ziel.${aufgabe.ziel}`, {
          farbe: t(aufgabe.amZug === "w" ? "farbe.w" : "farbe.b"),
        })}
      </p>
      {stellung.ok && (
        <Brettbereich
          stellung={stellung.wert}
          markierungen={markierungen}
          letzterZug={letzter}
          bedienung={bedienung}
          beschriftung={t("trainer.taktik.name")}
          anfangsGedreht={aufgabe.amZug === "b"}
        />
      )}
      <Herkunft aufgabe={aufgabe} />
      {!fertig && fehler && (
        <Antwortmeldung richtig={false}>{t("taktiktrainer.falsch")}</Antwortmeldung>
      )}
      {!fertig && (
        <Hilfen
          aufgabe={aufgabe}
          stufe={stufe}
          weiter={() => setzeStufe(stufe + 1)}
          zeigeLoesung={zeigeLoesung}
        />
      )}
      {fertig && (
        <Antwortmeldung richtig={!gezeigt}>
          {t("taktiktrainer.loesung", {
            zuege: (zugaufgabe?.linien[0] ?? []).map((z) => sanInSprache(z, sprache())).join(" "),
          })}
        </Antwortmeldung>
      )}
      {fertig && <MotivBenennen richtig={aufgabe.motiv} />}
    </>
  );
}
