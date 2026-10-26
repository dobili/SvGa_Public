/**
 * Aufgabe „Zug erraten“: eine Meisterpartie aus Kapitel 11 Zug für Zug raten.
 *
 * Rolle im Gesamtbild: Trainer „zugErraten“ (AP 13, Stufe 3). Der Leser zieht für seine Seite;
 * die App sagt „getroffen“ oder nennt den Partiezug, stellt ihn aufs Brett und spielt den
 * nächsten Zug der Gegenseite. Am Ende zählt die Runde die Partie als gut geraten, wenn
 * mindestens die Hälfte der Züge getroffen ist. Nach einem verfehlten Zug vergleicht die Engine
 * den eigenen Zug mit dem Partiezug und erinnert an die Frage des Buches, warum der Meister anders
 * zog (W12, Kapitel 12: „erst selbst denken und dann vergleichen“). Seit 0.2.90 speichert die
 * App die Trefferzahl je Partie (speicher/trainerverlauf.ts) und nennt beim nächsten Mal den
 * letzten Durchgang zum Vergleich (Pflichtenheft 7: „Wiederholung derselben Partie nach Wochen“).
 * Seit R45 (Wunsch des Autors, 23.10.2026): Hinweis-Knopf (goldenes Feld unter der Figur des
 * Partiezuges; ein Treffer mit Hinweis zählt nicht), Pfeile für den letzten Zug (gold der
 * Partiezug, rot der eigene, falls er abweicht), Bewertungsbalken am Brett nach jedem Zug,
 * Kommentar nach Motiven und Fehlerarten (training/zugkommentar.ts), Blättern durch die
 * gespielten Züge und ein Analysemodus (Zugerratenleiste.tsx).
 * Abhängigkeiten: training/studientrainer.ts, training/repertoiretrainer.ts,
 * training/zugkommentar.ts, useZugerratenEngine, Zugvergleich, Zugerratenleiste, Brettbereich.
 */
import { useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { useSpeicher } from "../../speicher/speicher";
import type { Rateeintrag } from "../../speicher/trainerverlauf";
import { datumText, sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { stellungAusFen, type Rolle } from "../../schach/stellung";
import { spieleZug, zugFelder } from "../../schach/weiterspielen";
import type { Repertoireaufgabe as Aufgabe } from "../../training/repertoiretrainer";
import { stellungNach } from "../../training/uebungsaufgabe";
import { Bewertungsbalken } from "../komponenten/rueckblick/Bewertungsbalken";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { Antwortmeldung } from "./Rundenrahmen";
import type { Runde } from "./useRunde";
import { useSammelstellung } from "./sammelstellung";
import { useZugerratenEngine } from "./useZugerratenEngine";
import { vergleichspfeile } from "./vergleichspfeile";
import { Analysebereich, Zugerratenleiste } from "./Zugerratenleiste";
import { Zugkommentare, type Rateversuch } from "./Zugkommentare";
import { Zugvergleich } from "./Zugvergleich";
import { partieKennung, useRatestand, type Ratezustand } from "./useRatestand";

const KEINE_WAHL = () => undefined;

/** Der letzte gespeicherte Durchgang dieser Partie, falls es einen gibt. */
function Frueher({ eintrag }: { eintrag: Rateeintrag | undefined }) {
  if (!eintrag) return null;
  return (
    <p className="hinweis" data-testid="zugerraten-frueher">
      {t("zugerraten.frueher", {
        treffer: eintrag.treffer,
        versuche: eintrag.versuche,
        datum: datumText(new Date(eintrag.datum)),
      })}
    </p>
  );
}

/** Meldung zum letzten Rateversuch: getroffen (auch mit Hinweis) oder der Partiezug. */
function Meldung({ versuch }: { versuch: Rateversuch }) {
  const text = versuch.getroffen
    ? t(versuch.mitHinweis ? "zugerraten.getroffenMitHinweis" : "zugerraten.getroffen")
    : `${t("zugerraten.partiezug", { zug: sanInSprache(versuch.partie, sprache()) })} ${t("zugerraten.pfeile")}`;
  return (
    <p
      className={`meldung ${versuch.getroffen && !versuch.mitHinweis ? "gut" : "schlecht"}`}
      role="status"
    >
      {text}
    </p>
  );
}

/** Markierungen in der aktuellen Stellung: Hinweisfeld oder die Pfeile zum letzten Zug. */
function markierungen(
  versuch: Rateversuch | null,
  hinweisFeld: string | null,
): readonly Markierung[] {
  if (hinweisFeld) return [{ typ: "feld", farbe: "gold", feld: hinweisFeld }];
  if (!versuch) return [];
  if (versuch.fehlversuch) return vergleichspfeile(versuch.fehlversuch);
  const felder = zugFelder(versuch.vorherFen, versuch.partie);
  return felder ? [{ typ: "pfeil", farbe: "gold", ...felder }] : [];
}

/** Der Hinweis-Knopf, oder nach dem Tipp der Satz zum goldenen Feld. */
function Hinweis({ aktiv, zeige }: { aktiv: boolean; zeige: () => void }) {
  if (aktiv) return <p className="hinweis">{t("zugerraten.hinweisAktiv")}</p>;
  return (
    <button type="button" className="knopf-zweit" onClick={zeige} data-testid="zugerraten-hinweis">
      <Knopfsymbol art="hinweis" />
      {t("zugerraten.hinweis")}
    </button>
  );
}

/**
 * Das Brett mit Balken: gezeigt wird die aktuelle Stellung, eine frühere (Blättern) oder die
 * Analyse. Geraten wird nur in der aktuellen Stellung; in der Analyse ziehen beide Seiten frei.
 */
function Zugerratenbrett({
  aufgabe,
  s,
  fertig,
  gezeigt,
  wert,
}: {
  aufgabe: Aufgabe;
  s: Ratezustand;
  fertig: boolean;
  gezeigt: string;
  wert: number | null;
}) {
  const spiele = (von: string, nach: string, umwandlung?: Rolle) => {
    const live = !fertig && s.stelle === null;
    if (!s.analyse && !live) return "ungueltig" as const;
    const versuch = spieleZug(gezeigt, von, nach, umwandlung);
    if (versuch.art !== "gespielt") return versuch.art;
    if (s.analyse) s.setzeAnalyse([...s.analyse, versuch.san]);
    else s.rate(versuch.san);
    return "gespielt" as const;
  };
  const ziehbar = s.analyse !== null || (!fertig && s.stelle === null);
  const bedienung = useBrettbedienung(
    { fen: gezeigt, spiele },
    ziehbar ? "ziehen" : null,
    KEINE_WAHL,
  );
  const stellung = useMemo(() => stellungAusFen(gezeigt), [gezeigt]);
  const aktuell = s.stelle === null && !s.analyse;
  const hinweisFeld =
    aktuell && s.hinweis && !fertig
      ? (zugFelder(s.fen, aufgabe.linie[s.zuege.length] ?? "")?.von ?? null)
      : null;
  // Der letzte Zug der gezeigten Stellung: aus der Analyse, beim Blättern oder der Partie.
  const [basis, folge] = s.analyse
    ? [s.fen, s.analyse]
    : [aufgabe.startFen, s.stelle === null ? s.zuege : s.zuege.slice(0, s.stelle)];
  const letzter =
    folge.length > 0
      ? zugFelder(stellungNach(basis, folge.slice(0, -1)), folge.at(-1) ?? "")
      : null;
  if (!stellung.ok) return null;
  return (
    <Brettbereich
      stellung={stellung.wert}
      markierungen={aktuell ? markierungen(s.versuch, hinweisFeld) : []}
      letzterZug={letzter}
      bedienung={bedienung}
      beschriftung={t("trainer.zugErraten.name")}
      anfangsGedreht={aufgabe.seite === "black"}
      seitenleiste={(gedreht) => <Bewertungsbalken wert={wert ?? 0} gedreht={gedreht} />}
    />
  );
}

/**
 * Eine Aufgabe „Zug erraten“: eine Meisterpartie aus Kapitel 11 Zug für Zug raten; nach einem
 * Fehlversuch vergleicht die Engine.
 */
export function Zugerratenaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  const s = useRatestand(aufgabe, runde);
  // Der letzte Durchgang vor dieser Runde; bleibt während der Runde stehen.
  const verlauf = useSpeicher((z) => z.daten.zugErraten[partieKennung(aufgabe)]);
  const [frueher] = useState(() => verlauf?.at(-1));
  const fertig = runde.ergebnis !== null;
  const gezeigt = s.analyse
    ? stellungNach(s.fen, s.analyse)
    : s.stelle !== null
      ? stellungNach(aufgabe.startFen, s.zuege.slice(0, s.stelle))
      : s.fen;
  useSammelstellung(gezeigt);
  const rechnung = useZugerratenEngine(s.versuch?.fehlversuch ?? null, gezeigt);
  const aktuell = s.stelle === null && !s.analyse;
  return (
    <>
      <p className="trainer-auftrag">
        {t("zugerraten.auftrag", {
          titel: aufgabe.titel,
          farbe: t(aufgabe.seite === "white" ? "farbe.w" : "farbe.b"),
        })}
      </p>
      <Zugerratenbrett
        aufgabe={aufgabe}
        s={s}
        fertig={fertig}
        gezeigt={gezeigt}
        wert={rechnung.wert}
      />
      <Zugerratenleiste
        startFen={aufgabe.startFen}
        zuege={s.zuege}
        stelle={s.analyse ? null : s.stelle}
        setzeStelle={(stelle) => {
          s.setzeAnalyse(null);
          s.setzeStelle(stelle);
        }}
      />
      {s.versuch && !fertig && <Meldung versuch={s.versuch} />}
      {s.versuch?.fehlversuch && rechnung.vergleich && (
        <Zugvergleich
          versuch={s.versuch.fehlversuch}
          stand={rechnung.vergleich}
          bezug="partie"
          zusatz={t("zugerraten.warum")}
          testid="zugerraten-vergleich"
        />
      )}
      {s.versuch && (
        <Zugkommentare aufgabe={aufgabe} versuch={s.versuch} vergleich={rechnung.vergleich} />
      )}
      {!fertig && aktuell && <Hinweis aktiv={s.hinweis} zeige={() => s.setzeHinweis(true)} />}
      <Analysebereich
        fen={s.fen}
        analyse={s.analyse}
        setzeAnalyse={s.setzeAnalyse}
        moeglich={!fertig && s.stelle === null}
      />
      <p data-testid="zugerraten-stand">{t("zugerraten.stand", { ...s.stand })}</p>
      <Frueher eintrag={frueher} />
      {fertig && (
        <Antwortmeldung richtig={runde.ergebnis === true}>{t("zugerraten.ende")}</Antwortmeldung>
      )}
    </>
  );
}
