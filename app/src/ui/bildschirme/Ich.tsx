/**
 * Bereich „Einstellungen“ (Zahnrad, intern „ich“): Fortschritt, „Über die App“ (App-Version,
 * Datenstand, Offline bereit, Update, Fehler melden; bis 0.2.84 hieß die Karte „Einstellungen“,
 * Rückmeldung des Autors: dort stellt man nichts ein), die Karte „Einstellungen“ und Daten auf
 * diesem Gerät (sichern, einspielen, löschen).
 *
 * Rolle im Gesamtbild: Konzept 10.1. Fortschritt und Datensicherung kamen mit AP 12; die
 * Lernsammlung hat seit 0.2.93 einen eigenen Bildschirm (Karte im Training) und steckt in der
 * Datensicherung. Seit 0.2.41 steht ganz oben die Wertung des Lesers aus den
 * gewerteten Partien (Wertungskurve.tsx, Wunsch des Autors). Seit 0.2.60 steht unter der Karte
 * „Einstellungen“ die Abhakliste der Fehlerarten (FehlerartenKarte.tsx, Rückfrage S7);
 * seit 0.2.80 steht sie beim Spielen (Wunsch des Autors: dort stellt man die Engine ein). Ebenfalls
 * seit 0.2.80: Liegt eine neue Version bereit, wird „Nach Update suchen“ an derselben Stelle zu
 * „Jetzt aktualisieren“ (vorher stand der Knopf nur ganz oben).
 * Abhängigkeiten: app/offline.ts, app/version.ts, daten/laden.ts, speicher/, DatenLoeschen,
 * Wertungskurve, Navigation, i18n.
 */
import { useState } from "react";
import { istInstalliert } from "../../app/geraet";
import { useNavigation } from "../../app/navigationsKontext";
import { aktualisiereJetzt, sucheUpdate, useOfflineStand } from "../../app/offline";
import { APP_VERSION } from "../../app/version";
import { ladeIndex } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { DatenLoeschen } from "../komponenten/DatenLoeschen";
import { EinstellungenKarte } from "../komponenten/EinstellungenKarte";
import { Fortschrittsuebersicht } from "../komponenten/Fortschrittsuebersicht";
import { useDaten } from "../komponenten/useDaten";
import { Wertungskurve } from "../komponenten/Wertungskurve";
import { useSpeicher } from "../../speicher/speicher";

/** Der Installationsteil der Startseite (Entscheidung 15.10.2026). */
const INSTALLATIONSSEITE = "/installieren/";

/** Datum „2026-10-13“ als „13.10.2026“. */
function deutschesDatum(iso: string): string {
  const [jahr, monat, tag] = iso.split("-");
  return `${tag}.${monat}.${jahr}`;
}

function Zeile({ name, wert, testid }: { name: string; wert: string; testid?: string }) {
  return (
    <div className="einstellung">
      <dt>{name}</dt>
      <dd data-testid={testid}>{wert}</dd>
    </div>
  );
}

/** Kopiert die Angaben für eine Fehlermeldung in die Zwischenablage (Konzept 13, „Fehler melden“). */
function FehlerMelden({ angaben }: { angaben: string }) {
  const [meldung, setzeMeldung] = useState<string | null>(null);
  const kopiere = async () => {
    try {
      await navigator.clipboard.writeText(angaben);
      setzeMeldung(t("ich.fehlerKopiert"));
    } catch (fehler) {
      console.warn("Zwischenablage nicht verfügbar:", fehler);
      setzeMeldung(`${t("ich.fehlerNichtKopiert")}\n${angaben}`);
    }
  };
  return (
    <>
      <button type="button" className="knopf-zweit" onClick={() => void kopiere()}>
        {t("ich.fehlerMelden")}
      </button>
      {meldung && (
        <p className="hinweis vorformatiert" role="status">
          {meldung}
        </p>
      )}
    </>
  );
}

export function Ich() {
  const { navigiere } = useNavigation();
  const offline = useOfflineStand();
  const wertung = useSpeicher((z) => z.daten.spiel.wertung);
  const index = useDaten(ladeIndex, "index");
  const [updateMeldung, setzeUpdateMeldung] = useState<string | null>(null);
  const datenstand =
    index.art === "fertig"
      ? t("ich.datenstandWert", {
          auflage: index.wert.auflage,
          datum: deutschesDatum(index.wert.datenstand),
        })
      : "…";
  const offlineText = !offline.verfuegbar
    ? t("ich.offlineUnbekannt")
    : offline.bereit
      ? t("ich.offlineBereit")
      : t("ich.offlineNicht", { prozent: offline.prozent });
  const angaben = [
    t("ich.angabe.version", { wert: APP_VERSION }),
    t("ich.angabe.datenstand", { wert: datenstand }),
    t("ich.angabe.offline", { wert: offlineText }),
    t("ich.angabe.geraet", { wert: navigator.userAgent }),
  ].join("\n");

  const suche = async () => {
    const gefunden = await sucheUpdate();
    setzeUpdateMeldung(gefunden ? t("ich.updateLaedt") : t("ich.updateKeins"));
  };

  return (
    <div className="bildschirm">
      {/* Keine sichtbare Überschrift (Wunsch des Autors, Test von 0.2.30); Bildschirmleser hören
          „Einstellungen“. */}
      <h1 className="nur-vorlesen">{t("ich.titel")}</h1>
      <Wertungskurve punkte={wertung} />
      <Fortschrittsuebersicht />
      <section className="karte">
        <h2 className="karte-titel">{t("ich.einstellungen")}</h2>
        <dl className="einstellungen">
          <Zeile name={t("ich.version")} wert={APP_VERSION} testid="app-version" />
          <Zeile name={t("ich.datenstand")} wert={datenstand} />
          <Zeile name={t("ich.offline")} wert={offlineText} testid="offline-stand" />
        </dl>
        <div className="knopfreihe">
          {offline.updateVerfuegbar ? (
            <button type="button" className="knopf-haupt" onClick={() => void aktualisiereJetzt()}>
              {t("update.knopf")}
            </button>
          ) : (
            <button type="button" className="knopf-zweit" onClick={() => void suche()}>
              {t("ich.updateSuchen")}
            </button>
          )}
          <FehlerMelden angaben={angaben} />
          {/* Die Installation erklärt die Startseite des Buches; installiert braucht es sie nicht. */}
          {!istInstalliert() && (
            <a className="knopf-zweit" href={INSTALLATIONSSEITE}>
              {t("ich.installationsseite")}
            </a>
          )}
          <button
            type="button"
            className="knopf-zweit"
            onClick={() => navigiere({ bildschirm: "lizenzen" })}
          >
            {t("installation.lizenzen")}
          </button>
        </div>
        {updateMeldung && !offline.updateVerfuegbar && (
          <p className="hinweis" role="status">
            {updateMeldung}
          </p>
        )}
      </section>
      <EinstellungenKarte />
      <DatenLoeschen />
    </div>
  );
}
