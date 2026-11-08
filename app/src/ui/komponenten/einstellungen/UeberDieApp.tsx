/**
 * Seite „Über die App“: Version, Datenstand, Offline, Update, Fehler melden, App weitergeben
 * (seit 8.11.2026), Installation, Lizenzen, Datenschutz, Impressum.
 *
 * Rolle im Gesamtbild: Bis 0.3.31 eine Karte am Ende des Bildschirms „Einstellungen“, die unter
 * jedem Reiter erneut stand. Seit dem Entwurf K2 (Wahl des Autors, 31.10.2026) eine eigene Seite
 * hinter der Zeile „Über die App“ (einstellungsseiten.ts); Inhalt und Reihenfolge wie vorher.
 * „Fehler melden“ ist seit R57 (24.10.2026) ein Formular an das Dashboard des Autors
 * (Meldeformular.tsx); Impressum und Datenschutz stehen direkt da (T2, § 5 DDG).
 * Abhängigkeiten: app/offline.ts, app/version.ts, app/geraet.ts, daten/laden.ts, Meldeformular,
 * Knopfsymbol, Infoblase, Navigation, i18n. Weniger Text P15 (31.10.2026): Beta als Abzeichen an
 * der Version, der Satz dazu im ⓘ.
 */
import { useId, useState } from "react";
import { istInstalliert } from "../../../app/geraet";
import { useNavigation } from "../../../app/navigationsKontext";
import { aktualisiereJetzt, sucheUpdate, useOfflineStand } from "../../../app/offline";
import { APP_VERSION } from "../../../app/version";
import { ladeIndex } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { Blase, Infoknopf } from "../bausteine/Infoblase";
import { Knopfsymbol } from "../bausteine/Knopfsymbol";
import { useDaten } from "../bausteine/useDaten";
import { AppWeitergebenKnopf } from "../teilen/AppWeitergeben";
import { Meldeformular } from "./Meldeformular";

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
 * Zeile „App-Version“ mit Abzeichen „Beta“ und ⓘ (Weniger Text P15, 31.10.2026): Der Beta-Hinweis
 * (Wunsch des Autors, 24.10.2026: die App wird laufend erweitert) steht vollständig in der Blase.
 */
function Versionszeile() {
  const [offen, setzeOffen] = useState(false);
  const kennung = useId();
  return (
    <div className="einstellung einstellung-mit-blase">
      <dt>{t("ich.version")}</dt>
      <dd>
        <span className="version-mit-info">
          <span data-testid="app-version">{APP_VERSION}</span>
          <span className="abzeichen-beta">{t("wenigertext.seiten.beta")}</span>
          <Infoknopf
            thema={t("wenigertext.seiten.beta")}
            offen={offen}
            steuert={kennung}
            beiTipp={() => setzeOffen(!offen)}
          />
        </span>
        {offen && (
          <Blase id={kennung}>
            <p>{t("ich.beta")}</p>
          </Blase>
        )}
      </dd>
    </div>
  );
}

/** „Fehler melden“: klappt das Formular auf (Meldeformular.tsx). */
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

/** Version, Datenstand und Offline-Stand als Texte, auch für die Angaben der Fehlermeldung. */
function useStandtexte() {
  const offline = useOfflineStand();
  const index = useDaten(ladeIndex, "index");
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
  return { offline, datenstand, offlineText, angaben };
}

/** Knöpfe: Update, Fehler melden, App weitergeben, Installation (nur im Browser), Lizenzen. */
function Knoepfe({ angaben }: { angaben: string }) {
  const { navigiere } = useNavigation();
  const offline = useOfflineStand();
  const [updateMeldung, setzeUpdateMeldung] = useState<string | null>(null);
  const suche = async () => {
    const gefunden = await sucheUpdate();
    setzeUpdateMeldung(gefunden ? t("ich.updateLaedt") : t("ich.updateKeins"));
  };
  return (
    <>
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
        <AppWeitergebenKnopf />
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
    </>
  );
}

/** Der Inhalt der Seite „Über die App“. */
export function UeberDieApp() {
  const { datenstand, offlineText, angaben } = useStandtexte();
  return (
    <section className="karte">
      <dl className="einstellungen">
        <Versionszeile />
        <Zeile name={t("ich.datenstand")} wert={datenstand} />
        <Zeile name={t("ich.offline")} wert={offlineText} testid="offline-stand" />
      </dl>
      <Knoepfe angaben={angaben} />
      <p className="rechtliche-links">
        <a href="/datenschutz/">{t("lizenzen.datenschutz")}</a>
        <a href="/impressum/">{t("lizenzen.impressum")}</a>
      </p>
    </section>
  );
}
