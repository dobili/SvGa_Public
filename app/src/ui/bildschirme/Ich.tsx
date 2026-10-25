/**
 * Bereich „Einstellungen“ (Zahnrad, intern „ich“): Fortschritt, „Über die App“ (App-Version,
 * Datenstand, Offline bereit, Update, Fehler melden; bis 0.2.84 hieß die Karte „Einstellungen“,
 * Rückmeldung des Autors: dort stellt man nichts ein), die Karte „Darstellung und Training“ (bis
 * 0.2.128 „Einstellungen“, DS44) und Daten auf diesem Gerät (sichern, einspielen, löschen).
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
import { Knopfsymbol } from "../komponenten/Knopfsymbol";
import { Meldeformular } from "../komponenten/Meldeformular";
import { Titelsymbol } from "../komponenten/Titelsymbol";
import { TourKnopf } from "../../tour/TourKnopf";

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

/**
 * „Fehler melden“: Seit R57 (24.10.2026) ein Formular, das die Meldung an das Dashboard des Autors
 * schickt (Meldeformular.tsx); vorher kopierte der Knopf nur die Angaben (Konzept 13).
 */
function FehlerMelden({ angaben }: { angaben: string }) {
  const [offen, setzeOffen] = useState(false);
  return (
    <>
      <button
        type="button"
        className="knopf-zweit"
        aria-expanded={offen}
        onClick={() => setzeOffen(!offen)}
      >
        <Knopfsymbol art="fehlerMelden" />
        {t("ich.fehlerMelden")}
      </button>
      {offen && <Meldeformular angaben={angaben} beiSchliessen={() => setzeOffen(false)} />}
    </>
  );
}

export function Ich() {
  const { navigiere } = useNavigation();
  const offline = useOfflineStand();
  const wertung = useSpeicher((z) => z.daten.spiel.wertung);
  const partien = useSpeicher((z) => z.daten.spiel.partien);
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
      {/* Sichtbarer Titel wie auf Buch, Training, Spielen und Nachschlagen (DS44, 25.10.2026; bis
          0.2.128 nur für Bildschirmleser nach dem Test von 0.2.30). */}
      <header className="seitenkopf">
        <h1>{t("ich.titel")}</h1>
        <TourKnopf />
      </header>
      <Wertungskurve punkte={wertung} partien={partien} />
      <Fortschrittsuebersicht />
      <EinstellungenKarte />
      <DatenLoeschen />
      {/* „Über die App“ am Ende (DS14): Version und Lizenzen braucht man selten, die
          Einstellungen oft. */}
      <section className="karte" data-tour="einstellungen-ueber">
        <h2 className="karte-titel">
          <Titelsymbol art="ueberApp" />
          {t("ich.einstellungen")}
        </h2>
        <dl className="einstellungen">
          <Zeile
            name={t("ich.version")}
            wert={t("ich.versionBeta", { wert: APP_VERSION })}
            testid="app-version"
          />
          <Zeile name={t("ich.datenstand")} wert={datenstand} />
          <Zeile name={t("ich.offline")} wert={offlineText} testid="offline-stand" />
        </dl>
        {/* Beta-Hinweis (Wunsch des Autors, 24.10.2026): Die App wird laufend erweitert. */}
        <p className="hinweis">{t("ich.beta")}</p>
        <div className="knopfreihe">
          {offline.updateVerfuegbar ? (
            <button type="button" className="knopf-haupt" onClick={() => void aktualisiereJetzt()}>
              {t("update.knopf")}
            </button>
          ) : (
            <button type="button" className="knopf-zweit" onClick={() => void suche()}>
              <Knopfsymbol art="aktualisieren" />
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
        {/* T2 (0.2.131): Impressum und Datenschutz direkt erreichbar (§ 5 DDG), nicht nur über
            die Lizenzen. */}
        <p className="rechtliche-links">
          <a href="/datenschutz/">{t("lizenzen.datenschutz")}</a>
          <a href="/impressum/">{t("lizenzen.impressum")}</a>
        </p>
        {updateMeldung && !offline.updateVerfuegbar && (
          <p className="hinweis" role="status">
            {updateMeldung}
          </p>
        )}
      </section>
    </div>
  );
}
