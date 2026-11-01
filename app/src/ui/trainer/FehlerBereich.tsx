/**
 * Trainer „Fehlerdatenbank“ (Kapitel 12): eigene Fehler eintragen, je Fehlerart über die Wochen
 * auswerten, passenden Trainer vorschlagen, Einträge mit Stellung ansehen und löschen.
 *
 * Rolle im Gesamtbild: Pflichtenheft 5.3, Konzept 4.7 (Nutzerdaten „fehler“, Format 4). Neue
 * Einträge kommen meist aus dem Rückblick einer Partie („Merken“ › „Fehler“); hier geht es
 * auch mit einer Stellung als FEN, etwa aus einer Partie im Verein. Jeder Eintrag lässt sich
 * bearbeiten und löschen, mit Rückgängig (Wunsch des Autors, 1.11.2026). Erreichbar über die
 * Kachel „Fehlerdatenbank“ oben im Training und die Reihe „Praxis“ (Kapitel 12).
 * Abhängigkeiten: training/fehlerdatenbank.ts, training/eintragspflege.ts, FehlerFormular,
 * FehlerEintrag, useRueckgaengig, Trainerbrett, Speicher, Navigation, i18n.
 */
import { useState } from "react";
import { useNavigation } from "../../app/navigationsKontext";
import { t } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import { useSpeicher } from "../../speicher/speicher";
import { mitFehlerZurueck, ohneFehlerIn } from "../../training/eintragspflege";
import { auswertung, vorschlag, WOCHEN, type Fehlereintrag } from "../../training/fehlerdatenbank";
import { useLoeschenMitRueckgaengig } from "../komponenten/bausteine/useRueckgaengig";
import { FehlerEintrag } from "./FehlerEintrag";
import { FehlerFormular } from "./FehlerFormular";
import { artName, useFehlerarten, type Fehlerart } from "./useFehlerarten";
import { Trainerbrett } from "./Trainerbrett";

/** So viele Einträge zeigt die Liste zuerst; der Rest auf Wunsch. */
const ERSTE_EINTRAEGE = 10;

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
      <FehlerFormular
        key={gueltig ?? "leer"}
        fen={gueltig}
        beiGespeichert={() => setzeFen("")}
        mitSprung={false}
      />
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

/**
 * Der Trainer „Fehlerdatenbank“ (Kapitel 12): eigene Fehler eintragen, je Fehlerart auswerten,
 * passenden Trainer vorschlagen, Einträge ansehen, bearbeiten und löschen.
 */
export function FehlerBereich() {
  const liste = useSpeicher((z) => z.daten.fehler);
  const { loesche, leiste } = useLoeschenMitRueckgaengig({
    liste,
    entfernen: ohneFehlerIn,
    zurueckholen: mitFehlerZurueck,
  });
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
            <FehlerEintrag key={e.id} eintrag={e} arten={arten} beiLoeschen={loesche} />
          ))}
          {!alle && neueste.length > ERSTE_EINTRAEGE && (
            <button type="button" className="knopf-link" onClick={() => setzeAlle(true)}>
              {t("fehlerdb.alle")}
            </button>
          )}
        </>
      )}
      {leiste}
    </>
  );
}
