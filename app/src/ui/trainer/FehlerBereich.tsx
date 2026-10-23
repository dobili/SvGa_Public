/**
 * Trainer „Fehlerdatenbank“ (Kapitel 12): eigene Fehler eintragen, je Fehlerart über die Wochen
 * auswerten, passenden Trainer vorschlagen, Einträge mit Stellung ansehen und löschen.
 *
 * Rolle im Gesamtbild: Pflichtenheft 5.3, Konzept 4.7 (Nutzerdaten „fehler“, Format 4). Neue
 * Einträge kommen meist aus dem Rückblick einer Partie („In die Fehlerdatenbank“); hier geht es
 * auch mit einer Stellung als FEN, etwa aus einer Partie im Verein.
 * Abhängigkeiten: training/fehlerdatenbank.ts, FehlerFormular, Trainerbrett, Speicher,
 * Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { datumText, sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { stellungAusFen } from "../../schach/stellung";
import { aendere, useSpeicher } from "../../speicher/speicher";
import {
  auswertung,
  ohneEintrag,
  vorschlag,
  WOCHEN,
  type Fehlereintrag,
} from "../../training/fehlerdatenbank";
import { FehlerFormular } from "./FehlerFormular";
import { useFehlerarten, type Fehlerart } from "./useFehlerarten";
import { Trainerbrett } from "./Trainerbrett";
import { Knopfsymbol } from "../komponenten/Knopfsymbol";

/** So viele Einträge zeigt die Liste zuerst; der Rest auf Wunsch. */
const ERSTE_EINTRAEGE = 10;

/** Name einer Fehlerart, oder „Kapitel n“, solange die Checkliste lädt. */
function artName(arten: readonly Fehlerart[], kapitel: number): string {
  const art = arten.find((a) => a.kapitel === kapitel);
  return art
    ? t("fehlerdb.artName", { kapitel, name: art.name })
    : t("fehlerdb.kapitel", { kapitel });
}

/** Neuer Eintrag mit einer Stellung als FEN. */
function NeuerEintrag() {
  const [fen, setzeFen] = useState("");
  const gelesen = fen.trim() === "" ? null : stellungAusFen(fen.trim());
  const gueltig = gelesen?.ok ? gelesen.wert.fen : null;
  return (
    <section className="karte" data-testid="fehlerdb-neu" data-tour="fehler-neu">
      <h2 className="karte-titel">{t("fehlerdb.neu")}</h2>
      <p className="hinweis">{t("fehlerdb.neuHinweis")}</p>
      <input
        type="text"
        className="suchfeld"
        aria-label={t("fehlerdb.fen")}
        placeholder={t("fehlerdb.fen")}
        value={fen}
        onChange={(e) => setzeFen(e.target.value)}
      />
      {gelesen && !gelesen.ok && <p className="fehlertext">{t("fehlerdb.fenUngueltig")}</p>}
      {gueltig && <Trainerbrett fen={gueltig} beschriftung={t("fehlerdb.stellung")} />}
      <FehlerFormular key={gueltig ?? "leer"} fen={gueltig} beiGespeichert={() => setzeFen("")} />
    </section>
  );
}

/** Auswertung je Fehlerart mit den letzten Wochen und dem Vorschlag. */
function Auswertung({
  liste,
  arten,
}: {
  liste: readonly Fehlereintrag[];
  arten: readonly Fehlerart[];
}) {
  const { navigiere } = useNavigation();
  const zahlen = auswertung(liste, new Date());
  const rat = vorschlag(zahlen);
  return (
    <section className="karte" data-testid="fehlerdb-auswertung" data-tour="fehler-auswertung">
      <h2 className="karte-titel">{t("fehlerdb.auswertung")}</h2>
      <table className="fehlertabelle">
        <thead>
          <tr>
            <th>{t("fehlerdb.fehlerart")}</th>
            <th className="zahl">{t("fehlerdb.gesamt")}</th>
            <th className="zahl">{t("fehlerdb.wochen", { wochen: WOCHEN })}</th>
          </tr>
        </thead>
        <tbody>
          {zahlen.map((z) => (
            <tr key={z.fehlerart}>
              <td>{artName(arten, z.fehlerart)}</td>
              <td className="zahl">{z.gesamt}</td>
              <td className="zahl">{[...z.jeWoche].reverse().join(" · ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="hinweis">{t("fehlerdb.wochenHinweis")}</p>
      {rat ? (
        <p>
          {t("fehlerdb.vorschlag", { art: artName(arten, rat.fehlerart) })}{" "}
          <button
            type="button"
            className="knopf-link"
            onClick={() => navigiere({ bildschirm: "trainer", kennung: rat.trainer })}
          >
            {t(`trainer.${rat.trainer}.name`)}
          </button>
        </p>
      ) : (
        <p className="hinweis">{t("fehlerdb.keinVorschlag")}</p>
      )}
    </section>
  );
}

/** Ein Eintrag, zugeklappt mit Datum, Fehlerart und Satz; offen mit Brett und Löschen. */
function Eintrag({ eintrag, arten }: { eintrag: Fehlereintrag; arten: readonly Fehlerart[] }) {
  const datum = datumText(new Date(eintrag.datum));
  const loeschen = () =>
    void aendere((daten) => ({ ...daten, fehler: ohneEintrag(daten.fehler, eintrag.id) }));
  return (
    <details className="karte" data-testid="fehlerdb-eintrag">
      <summary>
        {datum} · {artName(arten, eintrag.fehlerart)}
        {eintrag.zug ? ` · ${sanInSprache(eintrag.zug, sprache())}` : ""}
      </summary>
      {eintrag.satz && <p>{eintrag.satz}</p>}
      <Trainerbrett fen={eintrag.fen} beschriftung={t("fehlerdb.stellung")} />
      <button type="button" className="knopf-zweit" onClick={loeschen}>
        <Knopfsymbol art="loeschen" />
        {t("fehlerdb.loeschen")}
      </button>
    </details>
  );
}

export function FehlerBereich() {
  const liste = useSpeicher((z) => z.daten.fehler);
  const arten = useFehlerarten();
  const [alle, setzeAlle] = useState(false);
  const neueste = [...liste].reverse();
  const sichtbar = alle ? neueste : neueste.slice(0, ERSTE_EINTRAEGE);
  return (
    <>
      <NeuerEintrag />
      {liste.length === 0 ? (
        <p className="hinweis" data-testid="fehlerdb-leer">
          {t("fehlerdb.leer")}
        </p>
      ) : (
        <>
          <Auswertung liste={liste} arten={arten} />
          <h2 className="abschnitt-titel" data-tour="fehler-eintraege">
            {t("fehlerdb.eintraege", { anzahl: liste.length })}
          </h2>
          {sichtbar.map((e) => (
            <Eintrag key={e.id} eintrag={e} arten={arten} />
          ))}
          {!alle && neueste.length > ERSTE_EINTRAEGE && (
            <button type="button" className="knopf-link" onClick={() => setzeAlle(true)}>
              {t("fehlerdb.alle")}
            </button>
          )}
        </>
      )}
    </>
  );
}
