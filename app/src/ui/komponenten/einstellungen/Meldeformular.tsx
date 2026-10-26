/**
 * Formular „Fehler melden“ (R57): Art, Text, Häkchen für Geräteangaben, Senden.
 *
 * Rolle im Gesamtbild: In den Einstellungen („Über die App“) und an jeder Abbildung („Fehler im
 * Buch melden“, mit Abbildungsnummer und Stellung). Die Meldung landet im Dashboard des Autors
 * (app/melden.ts). Fehlt das Netz, wartet die Meldung auf dem Gerät und geht später hinaus (V9);
 * scheitert das Senden aus anderem Grund, bietet das Formular den alten Weg an: Angaben kopieren
 * und per E-Mail schicken.
 * „Was wird gesendet?“ zeigt unter dem voreingestellten Häkchen die echten Angaben, damit niemand
 * einer Voreinstellung blind zustimmt (T3); die Datenschutzerklärung ist ein Link (T2).
 * Abhängigkeiten: app/melden.ts, Segmentwahl, i18n.
 */
import { useState } from "react";
import {
  geraeteangaben,
  KONTAKT_ADRESSE,
  MELDEARTEN,
  sendeMeldung,
  TEXT_ZEICHEN,
  type Meldeart,
  type Sendeergebnis,
} from "../../../app/melden";
import { t } from "../../../i18n/sprache";
import { Segmentwahl } from "../bausteine/Segmentwahl";

const DATENSCHUTZ = "/datenschutz/";

/**
 * Die Angaben, die mit dem Häkchen mitgehen, mit ihren echten Werten (T3).
 * Beispiel: App-Version 0.2.131, Browser und Gerät „Mozilla/5.0 (Linux; Android 14 …)“,
 * Bildschirm „412×915 @2.625“, Sprache „de“, an einer Abbildung dazu Nummer und FEN.
 */
function Sendeangaben({ abbildung, stellung }: { abbildung?: string; stellung?: string }) {
  const g = geraeteangaben();
  const zeilen: readonly (readonly [string, string | undefined])[] = [
    [t("melden.angabe.version"), g.version],
    [t("melden.angabe.geraet"), g.geraet],
    [t("melden.angabe.bildschirm"), g.bildschirm],
    [t("melden.angabe.sprache"), g.sprache],
    [t("melden.angabe.abbildung"), abbildung],
    [t("melden.angabe.stellung"), stellung],
  ];
  return (
    <details className="sendeangaben">
      <summary>{t("melden.wasGesendet")}</summary>
      <dl>
        {zeilen
          .filter(([, wert]) => wert)
          .map(([name, wert]) => (
            <div key={name}>
              <dt>{name}</dt>
              <dd>{wert}</dd>
            </div>
          ))}
      </dl>
      <p>{t("melden.angabe.nicht")}</p>
    </details>
  );
}

/** Rückmeldung nach dem Senden, bei Fehler mit Kopierknopf. */
function Ergebnis({ ergebnis, kopiertext }: { ergebnis: Sendeergebnis; kopiertext: string }) {
  const [kopiert, setzeKopiert] = useState(false);
  if (ergebnis.art === "gesendet") {
    return (
      <p className="hinweis" role="status">
        {t("melden.gesendet", { nummer: ergebnis.nummer })}
      </p>
    );
  }
  if (ergebnis.art === "vorgemerkt") {
    return (
      <p className="hinweis" role="status">
        {t("melden.vorgemerkt")}
      </p>
    );
  }
  if (ergebnis.art === "zuViele") {
    return (
      <p className="hinweis" role="status">
        {t("melden.zuViele")}
      </p>
    );
  }
  const kopiere = () =>
    navigator.clipboard
      .writeText(kopiertext)
      .then(() => setzeKopiert(true))
      .catch((fehler: unknown) => console.warn("Zwischenablage nicht verfügbar:", fehler));
  return (
    <div role="status">
      <p className="hinweis">{t("melden.fehler", { adresse: KONTAKT_ADRESSE })}</p>
      <button type="button" className="knopf-zweit" onClick={() => void kopiere()}>
        {kopiert ? t("melden.kopiert") : t("melden.kopieren")}
      </button>
      {!kopiert && <p className="hinweis vorformatiert">{kopiertext}</p>}
    </div>
  );
}

/**
 * Eingaben: Art zu Beginn, auf Wunsch Abbildung und Stellung (FEN), Angaben für den Kopierweg,
 * Schließen.
 * Beispiel: an Abbildung 3.12 → Art „Fehler im Buch“, Abbildung und FEN gehen mit.
 */
export function Meldeformular({
  anfangsart = "fehler",
  abbildung,
  stellung,
  angaben,
  beiSchliessen,
}: {
  anfangsart?: Exclude<Meldeart, "absturz">;
  abbildung?: string;
  stellung?: string;
  angaben: string;
  beiSchliessen: () => void;
}) {
  const [art, setzeArt] = useState(anfangsart);
  const [text, setzeText] = useState("");
  const [mitGeraet, setzeMitGeraet] = useState(true);
  const [sendet, setzeSendet] = useState(false);
  const [ergebnis, setzeErgebnis] = useState<Sendeergebnis | null>(null);
  const sende = async () => {
    setzeSendet(true);
    const zusatz = mitGeraet
      ? { ...(abbildung ? { abbildung } : {}), ...(stellung ? { stellung } : {}) }
      : {};
    setzeErgebnis(await sendeMeldung({ art, text, ...zusatz }, mitGeraet));
    setzeSendet(false);
  };
  if (ergebnis?.art === "gesendet" || ergebnis?.art === "vorgemerkt") {
    return (
      <div className="meldeformular" data-testid="meldeformular">
        <Ergebnis ergebnis={ergebnis} kopiertext="" />
        <button type="button" className="knopf-zweit" onClick={beiSchliessen}>
          {t("melden.schliessen")}
        </button>
      </div>
    );
  }
  return (
    <div className="meldeformular" data-testid="meldeformular">
      <Segmentwahl
        name={t("melden.art")}
        werte={MELDEARTEN}
        gewaehlt={art}
        text={(wert) => t(`melden.art.${wert}`)}
        beiWahl={setzeArt}
      />
      <label className="meldefeld">
        {t(`melden.frage.${art}`)}
        <textarea
          value={text}
          maxLength={TEXT_ZEICHEN}
          rows={5}
          onChange={(e) => setzeText(e.target.value)}
        />
      </label>
      <label className="meldehaken">
        <input
          type="checkbox"
          checked={mitGeraet}
          onChange={(e) => setzeMitGeraet(e.target.checked)}
        />
        {abbildung ? t("melden.mitAbbildung", { nummer: abbildung }) : t("melden.mitGeraet")}
      </label>
      <Sendeangaben abbildung={abbildung} stellung={stellung} />
      <p className="hinweis klein">
        {t("melden.datenschutz")} <a href={DATENSCHUTZ}>{t("melden.datenschutzLink")}</a>
      </p>
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-haupt"
          disabled={sendet || text.trim() === ""}
          onClick={() => void sende()}
        >
          {sendet ? t("melden.sendet") : t("melden.senden")}
        </button>
        <button type="button" className="knopf-zweit" onClick={beiSchliessen}>
          {t("melden.abbrechen")}
        </button>
      </div>
      {ergebnis && <Ergebnis ergebnis={ergebnis} kopiertext={`${text}\n\n${angaben}`} />}
    </div>
  );
}
