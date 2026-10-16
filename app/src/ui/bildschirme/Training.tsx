/**
 * Bereich Training: fällige Wiederholungen, 30-Minuten-Plan und alle Trainer je Kapitel.
 *
 * Rolle im Gesamtbild: Startseite des Bereichs (Konzept 10.1). Alle Trainer stehen von Anfang an
 * im Menü, unter genau den Namen, die später in den Trainingskästen des Buches stehen
 * (Pflichtenheft 7); unfertige tragen „folgt mit einem Update“. Ein Tipp zeigt den Ablauf.
 * Seit 16.10.2026 führt je Kapitel ein Link zur Trainingsseite der Website (/training/kapNN/),
 * dem früheren Kasten „Training zu diesem Kapitel“ des Buches; sie ist offline vorhanden.
 * Abhängigkeiten: training/trainer.ts, daten/laden.ts, Navigation, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import { ladeIndex } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { TRAINER, trainerZuKapitel, type Trainer } from "../../training/trainer";
import { kapiteladresse } from "../../startseite/trainingsseiten";
import { FaelligeWiederholungen } from "../komponenten/FaelligeWiederholungen";
import { useDaten } from "../komponenten/useDaten";

/** Ein Trainer als aufklappbarer Eintrag mit seinem Ablauf. */
export function Trainerkarte({ trainer }: { trainer: Trainer }) {
  return (
    <details className="trainerkarte" data-testid={`trainer-${trainer.kennung}`}>
      <summary>
        <span className="trainer-name">{t(`trainer.${trainer.kennung}.name`)}</span>
        {!trainer.fertig && <span className="plakette-folgt">{t("training.folgt")}</span>}
      </summary>
      <p>{t(`trainer.${trainer.kennung}.ablauf`)}</p>
    </details>
  );
}

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
        <section key={nummer} className="abschnitt">
          <button
            type="button"
            className="knopf-link links"
            onClick={() => navigiere({ bildschirm: "kapitel", nummer })}
          >
            {t("training.kapitel", { nummer })} · {titel(nummer)}
          </button>
          {trainerZuKapitel(nummer).map((trainer) => (
            <Trainerkarte key={trainer.kennung} trainer={trainer} />
          ))}
          <a className="knopf-link klein" href={kapiteladresse(nummer)}>
            {t("training.kasten")}
          </a>
        </section>
      ))}
    </>
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
      <section className="karte">
        <h2 className="karte-titel">{t("training.uebersicht.titel")}</h2>
        <p>{t("training.kastenText")}</p>
        <a className="knopf-zweit" href="/training/">
          {t("training.seite.uebersicht")}
        </a>
      </section>
      <h2 className="abschnitt-titel">{t("training.jeKapitel")}</h2>
      <JeKapitel />
    </div>
  );
}
