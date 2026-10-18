/**
 * Bereich Training: fällige Wiederholungen, 30-Minuten-Plan und alle Trainer je Kapitel.
 *
 * Rolle im Gesamtbild: Startseite des Bereichs (Konzept 10.1). Alle Trainer stehen von Anfang an
 * im Menü, unter genau den Namen, die später in den Trainingskästen des Buches stehen
 * (Pflichtenheft 7); seit 0.2.71 sind alle spielbar (die Plakette „folgt mit einem Update“
 * bleibt nur für künftige Trainer). Ein Tipp zeigt den Ablauf.
 * Seit 16.10.2026 führt je Kapitel ein Link zur Trainingsseite der Website (/training/kapNN/),
 * dem früheren Kasten „Training zu diesem Kapitel“ des Buches; sie ist offline vorhanden.
 * Seit 0.2.85 (Wunsch des Autors: viel Text) je Kapitel eine Karte mit Nummer, die Trainer als
 * Zeilen mit Symbol (Trainerkarte.tsx), Erklärungen hinter dem Fragezeichen.
 * Seit 0.2.93 führt die Karte „Lernsammlung“ zu den eigenen Stellungen (Kapitel 12, AP 15).
 * Abhängigkeiten: training/trainer.ts, daten/laden.ts, Navigation, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import { ladeIndex } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { TRAINER, trainerZuKapitel } from "../../training/trainer";
import { kapiteladresse } from "../../startseite/trainingsseiten";
import { BookmarkPlus, ExternalLink, Globe } from "lucide-react";
import { useSpeicher } from "../../speicher/speicher";
import { FaelligeWiederholungen } from "../komponenten/FaelligeWiederholungen";
import { Trainerkarte } from "../komponenten/Trainerkarte";
import { MitInfo } from "../komponenten/InfoKnopf";
import { useDaten } from "../komponenten/useDaten";

const LINKSYMBOL = 16;

/**
 * Jedes Kapitel mit seinen Trainern und dem Link zur Trainingsseite der Website.
 *
 * Ein Trainer für mehrere Kapitel steht bei jedem davon (Endspieltrainer bei Kapitel 8 und 9),
 * so wie in der Zeile „In der App“ des Buches; sonst fehlte Kapitel 9 samt seiner Trainingsseite.
 */
function JeKapitel() {
  const { navigiere } = useNavigation();
  const index = useDaten(ladeIndex, "index");
  const titel = (nummer: number) =>
    index.art === "fertig" ? index.wert.kapitel.find((k) => k.kapitel === nummer)?.titel : "";
  const kapitel = [...new Set(TRAINER.flatMap((trainer) => trainer.kapitel))].sort((a, b) => a - b);
  return (
    <>
      {kapitel.map((nummer) => (
        <section key={nummer} className="karte trainingskapitel">
          <button
            type="button"
            className="trainingskapitel-kopf"
            onClick={() => navigiere({ bildschirm: "kapitel", nummer })}
          >
            <span className="kapitelnummer" aria-hidden="true">
              {nummer}
            </span>
            <span>
              {t("training.kapitel", { nummer })} · {titel(nummer)}
            </span>
          </button>
          <div className="trainerliste">
            {trainerZuKapitel(nummer).map((trainer) => (
              <Trainerkarte key={trainer.kennung} trainer={trainer} />
            ))}
          </div>
          <a className="knopf-link klein mit-symbol" href={kapiteladresse(nummer)}>
            <ExternalLink size={LINKSYMBOL} aria-hidden="true" />
            {t("training.kasten")}
          </a>
        </section>
      ))}
    </>
  );
}

/** Karte „Lernsammlung“ mit der Zahl der Stellungen und dem Weg dorthin. */
function SammelKarte() {
  const { navigiere } = useNavigation();
  const anzahl = useSpeicher((z) => z.daten.sammlung.length);
  return (
    <section className="karte" data-testid="sammelkarte">
      <h2 className="karte-titel mit-symbol">
        <BookmarkPlus size={LINKSYMBOL} aria-hidden="true" /> {t("sammlung.titel")}
      </h2>
      <p className="hinweis">
        {anzahl === 0 ? t("sammlung.karteLeer") : t("sammlung.karte", { anzahl })}
      </p>
      <button
        type="button"
        className="knopf-zweit"
        onClick={() => navigiere({ bildschirm: "lernsammlung" })}
      >
        {t("sammlung.oeffnen")}
      </button>
    </section>
  );
}

export function Training() {
  return (
    <div className="bildschirm">
      <header className="seitenkopf">
        <h1>{t("training.titel")}</h1>
      </header>
      <section className="karte">
        <h2 className="karte-titel">{t("training.faellig")}</h2>
        <FaelligeWiederholungen />
      </section>
      <SammelKarte />
      <section className="karte">
        <MitInfo
          zeile={
            <h2 className="karte-titel mit-symbol">
              <Globe size={LINKSYMBOL} aria-hidden="true" /> {t("training.uebersicht.titel")}
            </h2>
          }
          erklaerung={<p>{t("training.kastenText")}</p>}
          thema={t("training.uebersicht.titel")}
        />
        <a className="knopf-zweit" href="/training/">
          {t("training.seite.uebersicht")}
        </a>
      </section>
      <h2 className="abschnitt-titel">{t("training.jeKapitel")}</h2>
      <JeKapitel />
    </div>
  );
}
