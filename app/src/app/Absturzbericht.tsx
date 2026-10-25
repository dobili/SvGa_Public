/**
 * Knopf „Fehler melden“ nach einem Absturz: schickt die technische Fehlermeldung an den Autor,
 * Angaben zum Gerät nur mit Häkchen; geht das nicht, „Text kopieren“ als Rückweg.
 *
 * Rolle im Gesamtbild: Teil beider Fehlergrenzen, der äußeren um die ganze App
 * (app/Fehlergrenze.tsx) und der um jeden Bildschirm (app/Bildschirmgrenze.tsx, seit V7,
 * Nutzungsprüfung 25.10.2026). Bis dahin gingen die Geräteangaben bei Abstürzen immer mit; jetzt
 * gilt dasselbe Häkchen wie im Formular „Fehler melden“ (Datenschutzerklärung, „Meldungen aus der
 * App“). Gesendet wird nur auf Tipp. Ohne Netz wartet der Bericht auf dem Gerät (V9).
 * Abhängigkeiten: app/melden.ts, i18n.
 */
import { useState } from "react";
import { t } from "../i18n/sprache";
import { geraeteangaben, KONTAKT_ADRESSE, sendeMeldung } from "./melden";

type Stand = "bereit" | "sendet" | "gesendet" | "vorgemerkt" | "nicht";

/** Der Text für die Zwischenablage: Bericht und, mit Häkchen, die Angaben zum Gerät. */
function kopiertext(bericht: string, mitGeraet: boolean): string {
  if (!mitGeraet) return bericht;
  const angaben = Object.entries(geraeteangaben()).map(([name, wert]) => `${name}: ${wert}`);
  return [bericht, angaben.join("\n")].join("\n\n");
}

/** Nach gescheitertem Senden: Hinweis und Knopf „Text kopieren“. */
function Kopierweg({ text }: { text: string }) {
  const [kopiert, setzeKopiert] = useState(false);
  const kopiere = () =>
    navigator.clipboard
      .writeText(text)
      .then(() => setzeKopiert(true))
      .catch((fehler: unknown) => console.warn("Zwischenablage nicht verfügbar:", fehler));
  return (
    <div role="status">
      <p className="hinweis">{t("fehler.berichtNicht", { adresse: KONTAKT_ADRESSE })}</p>
      <button type="button" className="knopf-zweit" onClick={() => void kopiere()}>
        {kopiert ? t("melden.kopiert") : t("fehler.kopieren")}
      </button>
    </div>
  );
}

/**
 * Eingaben: der technische Bericht (Meldung, Stapel, Komponenten), Beschriftung des Knopfes.
 * Beispiel: Absturz auf Abb. 3.12 → „Fehler melden“ → „Danke, der Bericht ist angekommen.“
 * Sonderfälle: ohne Netz → „Ohne Netz gespeichert …“; Serverfehler oder Drossel → Kopierweg.
 */
export function Absturzbericht({ text, knopfText }: { text: string; knopfText: string }) {
  const [stand, setzeStand] = useState<Stand>("bereit");
  const [mitGeraet, setzeMitGeraet] = useState(true);
  const sende = async () => {
    setzeStand("sendet");
    const meldung = { art: "absturz", text, seite: window.location.pathname } as const;
    const ergebnis = await sendeMeldung(meldung, mitGeraet);
    setzeStand(ergebnis.art === "zuViele" || ergebnis.art === "fehler" ? "nicht" : ergebnis.art);
  };
  if (stand === "nicht") return <Kopierweg text={kopiertext(text, mitGeraet)} />;
  if (stand === "gesendet" || stand === "vorgemerkt") {
    return (
      <p className="hinweis" role="status">
        {t(stand === "gesendet" ? "fehler.berichtGesendet" : "melden.vorgemerkt")}
      </p>
    );
  }
  return (
    <>
      <button
        type="button"
        className="knopf-zweit"
        disabled={stand === "sendet"}
        onClick={() => void sende()}
      >
        {knopfText}
      </button>
      <label className="meldehaken">
        <input
          type="checkbox"
          checked={mitGeraet}
          onChange={(e) => setzeMitGeraet(e.target.checked)}
        />
        {t("melden.mitGeraet")}
      </label>
      <p className="hinweis klein">{t("fehler.berichtHinweis")}</p>
    </>
  );
}
