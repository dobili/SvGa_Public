/**
 * Datensicherung im Bereich Ich: alle eigenen Daten als Datei sichern und wieder einspielen.
 *
 * Rolle im Gesamtbild: Teil der Karte „Daten auf diesem Gerät“, neben „Alle Daten löschen“
 * (Auftrag des Autors zu AP 12). Pflichtenheft 4, Stufe 2: Export und Import als eine Datei;
 * Konzept 9.4: sanfter Hinweis alle vier Wochen. Vor dem Einspielen fragt die App nach und
 * nennt, was in der Sicherung steckt, denn das Einspielen ersetzt alle Daten auf dem Gerät.
 * Seit 0.2.80 mit Fragezeichen neben der Überschrift (Erklärung anfangs eingeklappt).
 * Abhängigkeiten: speicher/sicherung.ts, speicher/speicher.ts, app/version.ts, InfoKnopf, i18n.
 */
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { APP_VERSION } from "../../app/version";
import { t } from "../../i18n/sprache";
import {
  dateiname,
  exportiere,
  importiere,
  inhaltsangabe,
  pruefeSicherung,
  sicherungFaellig,
  type Sicherungspruefung,
} from "../../speicher/sicherung";
import { useSpeicher } from "../../speicher/speicher";
import { bieteDateiAn } from "./dateiAnbieten";
import { MitInfo } from "./InfoKnopf";

/** So lange bleibt die Datei zum Herunterladen im Speicher. */
type Gepruefte = Extract<Sicherungspruefung, { ok: true }>;
type Stand =
  | { readonly art: "ruhe" }
  | { readonly art: "frage"; readonly sicherung: Gepruefte }
  | { readonly art: "meldung"; readonly text: string; readonly fehler: boolean };

function datum(iso: string): string {
  const zeit = new Date(iso);
  return Number.isNaN(zeit.getTime()) ? "?" : zeit.toLocaleDateString("de-DE");
}

function alsMeldung(fehler: unknown): string {
  return fehler instanceof Error ? fehler.message : String(fehler);
}

/** Ob der Browser die Daten dauerhaft aufbewahrt (navigator.storage.persisted). */
function useDauerhaft(): boolean | null {
  const [dauerhaft, setzeDauerhaft] = useState<boolean | null>(null);
  useEffect(() => {
    if (typeof navigator.storage?.persisted !== "function") return;
    navigator.storage.persisted().then(setzeDauerhaft, (fehler: unknown) => {
      console.warn("Dauerhafter Speicher nicht abfragbar:", fehler);
    });
  }, []);
  return dauerhaft;
}

/** Rückfrage vor dem Einspielen mit der Inhaltsangabe der Sicherung. */
function Rueckfrage({
  sicherung,
  ersetzen,
  abbrechen,
}: {
  sicherung: Gepruefte;
  ersetzen: () => void;
  abbrechen: () => void;
}) {
  const angabe = inhaltsangabe(sicherung.daten);
  return (
    <div className="nachfrage" role="alertdialog" aria-label={t("sicherung.importieren")}>
      <p>
        {t("sicherung.frage", {
          datum: datum(sicherung.exportiert),
          version: sicherung.appVersion,
          ...angabe,
        })}
      </p>
      <div className="knopfreihe">
        <button type="button" className="knopf-gefahr" onClick={ersetzen}>
          {t("sicherung.ersetzen")}
        </button>
        <button type="button" className="knopf-zweit" onClick={abbrechen}>
          {t("sicherung.abbrechen")}
        </button>
      </div>
    </div>
  );
}

/** Stand der letzten Sicherung, Hinweis alle vier Wochen, dauerhafter Speicher. */
function Sicherungsstand() {
  const daten = useSpeicher((zustand) => zustand.daten);
  const dauerhaft = useDauerhaft();
  const wert = dauerhaft === null ? "unbekannt" : dauerhaft ? "ja" : "nein";
  return (
    <>
      <p className="hinweis" data-testid="letzte-sicherung">
        {daten.letzteSicherung
          ? t("sicherung.letzte", { datum: datum(daten.letzteSicherung) })
          : t("sicherung.keine")}
      </p>
      {sicherungFaellig(daten, new Date()) && (
        <p className="hinweis sicherung-faellig">{t("sicherung.faellig")}</p>
      )}
      <dl className="einstellungen">
        <div className="einstellung">
          <dt>{t("sicherung.dauerhaft")}</dt>
          <dd>{t(`sicherung.dauerhaft.${wert}`)}</dd>
        </div>
      </dl>
    </>
  );
}

export function Datensicherung() {
  const [stand, setzeStand] = useState<Stand>({ art: "ruhe" });
  const auswahl = useRef<HTMLInputElement>(null);
  const melde = (text: string, fehler: boolean) => setzeStand({ art: "meldung", text, fehler });

  const sichere = async () => {
    try {
      const jetzt = new Date();
      bieteDateiAn(await exportiere(APP_VERSION, jetzt), dateiname(jetzt));
      melde(t("sicherung.exportiert", { datei: dateiname(jetzt) }), false);
    } catch (fehler) {
      console.error("Datensicherung fehlgeschlagen:", fehler);
      melde(t("sicherung.exportFehler", { fehler: alsMeldung(fehler) }), true);
    }
  };

  const gewaehlt = async (ereignis: ChangeEvent<HTMLInputElement>) => {
    const datei = ereignis.target.files?.[0];
    ereignis.target.value = "";
    if (!datei) return;
    try {
      const pruefung = pruefeSicherung(await datei.text(), new Date());
      if (pruefung.ok) setzeStand({ art: "frage", sicherung: pruefung });
      else melde(t(`sicherung.fehler.${pruefung.grund}`), true);
    } catch (fehler) {
      console.error("Sicherungsdatei nicht lesbar:", fehler);
      melde(t("sicherung.fehler.lesen", { fehler: alsMeldung(fehler) }), true);
    }
  };

  const ersetze = async (sicherung: Gepruefte) => {
    const ok = await importiere(sicherung.daten);
    melde(t(ok ? "sicherung.eingespielt" : "sicherung.nichtGespeichert"), !ok);
  };

  return (
    <div className="datensicherung">
      <MitInfo
        zeile={<h3 className="einstellung-name">{t("sicherung.titel")}</h3>}
        erklaerung={t("sicherung.erklaerung")}
        thema={t("sicherung.titel")}
      />
      <Sicherungsstand />
      <div className="knopfreihe">
        <button type="button" className="knopf-zweit" onClick={() => void sichere()}>
          {t("sicherung.exportieren")}
        </button>
        <button type="button" className="knopf-zweit" onClick={() => auswahl.current?.click()}>
          {t("sicherung.importieren")}
        </button>
      </div>
      <input
        ref={auswahl}
        type="file"
        accept="application/json,.json"
        hidden
        data-testid="sicherung-datei"
        onChange={(ereignis) => void gewaehlt(ereignis)}
      />
      {stand.art === "frage" && (
        <Rueckfrage
          sicherung={stand.sicherung}
          ersetzen={() => void ersetze(stand.sicherung)}
          abbrechen={() => setzeStand({ art: "ruhe" })}
        />
      )}
      {stand.art === "meldung" && (
        <p className={stand.fehler ? "fehlertext" : "hinweis"} role="status">
          {stand.text}
        </p>
      )}
    </div>
  );
}
