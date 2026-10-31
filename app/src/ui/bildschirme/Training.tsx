/**
 * Bereich Training (Entwurf C2 nach Wahl des Autors, 31.10.2026): oben der Stapel der fälligen
 * Wiederholungen, darunter je Teil des Buches eine Wischreihe mit Trainer-Karten, unten kompakte
 * Kacheln (Lernsammlung, alle Kapitel).
 *
 * Rolle im Gesamtbild: Startseite des Bereichs (Konzept 10.1). Ziel des Autors: weniger Text,
 * weniger Formular; Einsteiger sehen zuerst, was heute dran ist, und erkennen jeden Trainer an
 * seinem Bild. Alles kommt aus Listen: Trainer und Teile aus TRAINER und BUCHTEILE
 * (trainerreihen.ts), Bilder aus TRAINERBILDER, Kacheln aus TRAININGSKACHELN. Der Ablauf eines
 * Trainers steht im Trainer selbst und in der Kapitelübersicht (Trainerkarte.tsx), der Link zur
 * Trainingsseite eines Kapitels in der Kapitelübersicht.
 * Abhängigkeiten: training/trainer.ts, komponenten/training/*, i18n, Tour.
 */
import { CircleHelp } from "lucide-react";
import { useMemo } from "react";
import { t } from "../../i18n/sprache";
import { TRAINER, type TrainerKennung } from "../../training/trainer";
import { TourKnopf } from "../../tour/TourKnopf";
import { Stapelkarte } from "../komponenten/training/Stapelkarte";
import { Trainerreihe } from "../komponenten/training/Trainerreihe";
import { trainerreihen } from "../komponenten/training/trainerreihen";
import { Trainingskacheln } from "../komponenten/training/Trainingskacheln";
import { useFaelligeUebersicht } from "../komponenten/training/vorhandeneAufgaben";

const HILFESYMBOL = 18;

/** Die Wischreihen je Teil des Buches, mit der Zahl fälliger Aufgaben je Trainer. */
function Reihen() {
  const reihen = useMemo(() => trainerreihen(TRAINER), []);
  const { trainer } = useFaelligeUebersicht();
  const faellig = new Map<TrainerKennung, number>(trainer.map((z) => [z.kennung, z.anzahl]));
  return (
    <div className="trainerreihen" data-tour="training-kapitel">
      {reihen.map((reihe) => (
        <Trainerreihe key={reihe.teil} reihe={reihe} faellig={faellig} />
      ))}
    </div>
  );
}

/** Die Startseite des Bereichs „Training“. */
export function Training() {
  return (
    <div className="bildschirm trainingsseite">
      <header className="seitenkopf">
        <h1>{t("training.titel")}</h1>
        <TourKnopf />
      </header>
      <Stapelkarte />
      {/* Kurz sichtbar, aufgeklappt die ganze Erklärung der Lernkartei (wie bisher). */}
      <details className="stapel-prinzip hinweis" data-testid="stapel-prinzip">
        <summary>
          <CircleHelp size={HILFESYMBOL} aria-hidden="true" />
          {t("trainingslook.prinzip")}
        </summary>
        <p>{t("training.faelligPrinzip")}</p>
      </details>
      <Reihen />
      <Trainingskacheln />
    </div>
  );
}
