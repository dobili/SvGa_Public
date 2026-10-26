/**
 * Sprachwahl in den Einstellungen (Reiter „Anzeige“), seit 0.2.94; bis 0.2.129 Teil von
 * EinstellungenKarte.tsx.
 *
 * Rolle im Gesamtbild: Eine Auswahl, sobald es mehr als eine Sprache gibt; bis dahin nur die Zeile
 * „Deutsch (Englisch folgt …)“. Ohne Wahl gilt die Sprache des Geräts. Seit V4 (Nutzungsprüfung
 * 25.10.2026) lädt eine weitere Sprache erst bei der Wahl: Währenddessen steht „Englisch wird
 * geladen …“ da; ohne Netz eine verständliche Meldung, und die App bleibt bei der bisherigen Sprache.
 * Abhängigkeiten: app/sprachwahl.ts, Auswahl, i18n.
 */
import { useState } from "react";
import { startOhneNetzGewesen, useSprache, waehleSprache } from "../../../app/sprachwahl";
import { istGeladen, sprachname, t, verfuegbareSprachen } from "../../../i18n/sprache";
import { Auswahl } from "../bausteine/Auswahl";

/** Was unter der Auswahl steht: nichts, „wird geladen“ oder die Meldung ohne Netz. */
type Zustand = "ruhig" | "laedt" | "ohneNetz";

/**
 * Die Sprachwahl. Beispiel: Tippen auf „English (preview)“ mit Netz → kurz „Englisch wird
 * geladen …“, dann ist alles englisch; im Flugmodus vor dem ersten Laden → Meldung, App bleibt deutsch.
 */
export function SprachWahl() {
  const aktuell = useSprache();
  const sprachen = verfuegbareSprachen();
  const [zustand, setzeZustand] = useState<Zustand>(() =>
    startOhneNetzGewesen() ? "ohneNetz" : "ruhig",
  );
  if (sprachen.length <= 1) {
    return (
      <dl className="einstellungen">
        <div className="einstellung">
          <dt>{t("einstellungen.sprache")}</dt>
          <dd>{t("einstellungen.sprache.wert")}</dd>
        </div>
      </dl>
    );
  }
  const waehle = (sprachcode: string) => {
    if (!istGeladen(sprachcode)) setzeZustand("laedt");
    void waehleSprache(sprachcode).then((ergebnis) =>
      setzeZustand(ergebnis === "ohneNetz" ? "ohneNetz" : "ruhig"),
    );
  };
  return (
    <>
      <Auswahl
        name={t("einstellungen.sprache")}
        werte={sprachen}
        gewaehlt={aktuell}
        text={sprachname}
        beiWahl={waehle}
      />
      {/* Nur mit Inhalt im Bild (sonst entstünde eine leere Lücke); die Meldung ohne Netz als
          „alert“, damit Bildschirmleser sie beim Erscheinen sicher vorlesen. */}
      {zustand === "laedt" && (
        <p className="hinweis" role="status">
          {t("einstellungen.sprache.laedt")}
        </p>
      )}
      {zustand === "ohneNetz" && (
        <p className="hinweis" role="alert" data-testid="sprachwahl-ohne-netz">
          {t("einstellungen.sprache.ohneNetz")}
        </p>
      )}
    </>
  );
}
