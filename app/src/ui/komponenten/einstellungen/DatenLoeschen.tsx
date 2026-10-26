/**
 * Karte „Daten auf diesem Gerät“: Datensicherung, alle Daten der App löschen, Anleitung zum
 * Entfernen.
 *
 * Rolle im Gesamtbild: Teil des Bereichs Ich. Löschen braucht eine Bestätigung im zweiten Schritt,
 * weil später auch Trainingsfortschritt dazugehört. Die Anleitung erklärt, wie das Symbol vom
 * Startbildschirm verschwindet; das kann eine Web-App nicht selbst.
 * Seit 0.2.80 (Wunsch des Autors): oben eine kurze Zeile mit Fragezeichen; dahinter die
 * Erklärung, auch dass auf dem iPhone App und Safari-Tab getrennte Speicher haben (stand vorher
 * lose unter der Seite).
 * Abhängigkeiten: app/loeschen.ts, speicher/speicher.ts, Datensicherung, InfoKnopf, i18n.
 */
import { useState } from "react";
import { loescheAlleDaten } from "../../../app/loeschen";
import { t } from "../../../i18n/sprache";
import { vergiss } from "../../../speicher/speicher";
import { Datensicherung } from "./Datensicherung";
import { MitInfo } from "../bausteine/InfoKnopf";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { Titelsymbol } from "../bausteine/Titelsymbol";

type Stand = "ruhe" | "nachfrage" | "laeuft" | "fertig" | "teilweise";

/** Schritte zum Entfernen der App, je Gerät eine Zeile. */
const GERAETE = ["iphone", "mac", "chrome", "android"] as const;

function Anleitung() {
  return (
    <details className="anleitung">
      <summary>{t("loeschen.anleitungTitel")}</summary>
      <ul>
        {GERAETE.map((geraet) => (
          <li key={geraet}>
            <strong>{t(`loeschen.anleitung.${geraet}.titel`)}</strong>{" "}
            {t(`loeschen.anleitung.${geraet}.text`)}
          </li>
        ))}
      </ul>
    </details>
  );
}

/**
 * Die Karte „Daten auf diesem Gerät“: Datensicherung, alle Daten löschen (mit Bestätigung) und
 * Anleitung zum Entfernen der App.
 */
export function DatenLoeschen() {
  const [stand, setzeStand] = useState<Stand>("ruhe");
  const loesche = async () => {
    setzeStand("laeuft");
    const fehler = await loescheAlleDaten();
    vergiss();
    setzeStand(fehler.length === 0 ? "fertig" : "teilweise");
  };
  return (
    <section className="karte" data-tour="einstellungen-daten">
      <h2 className="karte-titel">
        <Titelsymbol art="daten" />
        {t("loeschen.titel")}
      </h2>
      <MitInfo
        zeile={<p>{t("loeschen.kurz")}</p>}
        erklaerung={
          <>
            <p>{t("loeschen.erklaerung")}</p>
            <p>{t("ich.speicher")}</p>
          </>
        }
        thema={t("loeschen.titel")}
      />
      <Datensicherung />
      {stand === "ruhe" && (
        <button type="button" className="knopf-zweit" onClick={() => setzeStand("nachfrage")}>
          <Knopfsymbol art="loeschen" />
          {t("loeschen.knopf")}
        </button>
      )}
      {stand === "nachfrage" && (
        <div className="nachfrage" role="alertdialog" aria-label={t("loeschen.knopf")}>
          <p>{t("loeschen.frage")}</p>
          <div className="knopfreihe">
            <button type="button" className="knopf-gefahr" onClick={() => void loesche()}>
              <Knopfsymbol art="loeschen" />
              {t("loeschen.ja")}
            </button>
            <button type="button" className="knopf-zweit" onClick={() => setzeStand("ruhe")}>
              {t("loeschen.nein")}
            </button>
          </div>
        </div>
      )}
      {stand === "laeuft" && <p className="hinweis">…</p>}
      {(stand === "fertig" || stand === "teilweise") && (
        <p className="hinweis" role="status">
          {t(stand === "fertig" ? "loeschen.fertig" : "loeschen.teilweise")}
        </p>
      )}
      <Anleitung />
    </section>
  );
}
