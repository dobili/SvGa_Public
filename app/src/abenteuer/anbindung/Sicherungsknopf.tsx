/**
 * „Speichern“ und „Laden“ im Spielmenü (Wunsch des Autors, 28.11.2026: „Selbst speichern und laden
 * außerhalb von Partien“).
 *
 * „Speichern“ legt eine Sicherung des Stands von jetzt an (sicherungen.ts): mit der Position des
 * Helden, die die Oberwelt dafür liefert (oberwelt/sicherungswunsch.ts). Danach speichert das Spiel
 * wie bisher von selbst weiter. Es geht nur in der freien Welt ohne Gespräch, Partie, Aufgabenrunde
 * oder Ergebniskarte; sonst ist der Knopf gesperrt, und ein Satz sagt warum. Die Bestätigung
 * „Gespeichert“ ist eine Statusmeldung für Bildschirmleser; fiel die älteste Sicherung weg, sagt
 * sie auch das. „Laden“ öffnet die Ladeliste des Hauptmenüs mit allen Sicherungen.
 * Abhängigkeiten: i18n, oberwelt/wartewunsch.ts (freie Welt), oberwelt/sicherungswunsch.ts,
 * useSpeicherplaetze.ts (Typ des Ergebnisses), sicherungen.ts.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { standZumSichern } from "../oberwelt/sicherungswunsch";
import { useWartelage } from "../oberwelt/wartewunsch";
import type { Abenteuerstand } from "../schnittstelle/spielstand";
import { sicherbar, SICHERUNGEN_HOECHSTENS } from "./sicherungen";
import type { Sicherungsergebnis } from "./useSpeicherplaetze";

/** Was nach dem Tipp auf „Speichern“ in der Statuszeile steht. */
type Meldung = "keine" | "gespeichert" | "aeltesteWeg" | "fehler";

/** Der Satz der Statuszeile. */
function meldetext(meldung: Meldung): string {
  if (meldung === "gespeichert") return t("abenteuer.sichern.gespeichert");
  if (meldung === "aeltesteWeg") {
    return t("abenteuer.sichern.aeltesteWeg", { anzahl: SICHERUNGEN_HOECHSTENS });
  }
  if (meldung === "fehler") return t("abenteuer.sichern.fehler");
  return "";
}

/**
 * Speichern und Laden im Spielmenü. Eingaben: der gespielte Stand (für die Prüfung auf eine offene
 * Partie), wie gesichert wird, und der Weg in die Ladeliste.
 */
export function Sicherungsknopf({
  stand,
  beiSpeichern,
  beiLaden,
}: {
  readonly stand: Abenteuerstand;
  readonly beiSpeichern: (stand: Abenteuerstand) => Promise<Sicherungsergebnis>;
  readonly beiLaden: () => void;
}) {
  const lage = useWartelage();
  const [meldung, setzeMeldung] = useState<Meldung>("keine");
  const moeglich = (lage?.moeglich ?? false) && sicherbar(stand);
  const speichere = () => {
    const jetzt = standZumSichern();
    if (!jetzt) {
      setzeMeldung("fehler");
      return;
    }
    void beiSpeichern(jetzt).then(
      (e) =>
        setzeMeldung(!e.gespeichert ? "fehler" : e.aeltesteWeg ? "aeltesteWeg" : "gespeichert"),
      () => setzeMeldung("fehler"),
    );
  };
  return (
    <section className="abenteuer-sichern" data-testid="abenteuer-sichern">
      <p className="abenteuer-hinweistext">{t("abenteuer.sichern.erklaerung")}</p>
      <div className="abenteuer-wartezeile">
        <button
          type="button"
          className="knopf-zweit"
          data-testid="abenteuer-speichern"
          disabled={!moeglich}
          onClick={speichere}
        >
          {t("abenteuer.sichern.speichern")}
        </button>
        <button
          type="button"
          className="knopf-zweit"
          data-testid="abenteuer-menue-laden"
          onClick={beiLaden}
        >
          {t("abenteuer.sichern.laden")}
        </button>
      </div>
      {!moeglich && <p className="abenteuer-hinweistext">{t("abenteuer.sichern.nichtJetzt")}</p>}
      <p role="status" data-testid="abenteuer-sichern-status">
        {meldetext(meldung)}
      </p>
    </section>
  );
}
