/**
 * Ein Trainer als kompakte Zeile: Symbol, Name, Fragezeichen mit dem Ablauf und der Knopf
 * „Trainieren“; ein künftiger, noch unfertiger Trainer trüge die Plakette „folgt mit einem Update“
 * (seit 0.2.71 sind alle spielbar).
 *
 * Rolle im Gesamtbild: Steht auf der Trainingsseite (Training.tsx) und im Kasten „Training und
 * Übungen“ jedes Kapitels (Kapitel.tsx). Seit 0.2.85 (Wunsch des Autors: weniger Text, schneller
 * erkennbar) mit Symbol je Trainer (trainersymbole.ts); der Ablauf steht hinter dem Fragezeichen.
 * Abhängigkeiten: training/trainer.ts, Navigation, InfoKnopf, lucide, i18n.
 */
import { Play } from "lucide-react";
import { useNavigation } from "../../../app/navigationsKontext";
import { t } from "../../../i18n/sprache";
import type { Trainer } from "../../../training/trainer";
import { MitInfo } from "../bausteine/InfoKnopf";
import { TRAINERSYMBOL } from "./trainersymbole";

const SYMBOL = 22;
const KNOPFSYMBOL = 20;

/** Beispiel: Zähltrainer → Taschenrechner, „Zähltrainer“, ?, „Trainieren“. */
export function Trainerkarte({ trainer }: { trainer: Trainer }) {
  const { navigiere } = useNavigation();
  const Symbol = TRAINERSYMBOL[trainer.kennung];
  const name = t(`trainer.${trainer.kennung}.name`);
  return (
    <div
      className={trainer.fertig ? "trainerkarte bereit" : "trainerkarte"}
      data-testid={`trainer-${trainer.kennung}`}
    >
      <span className="trainersymbol" aria-hidden="true">
        <Symbol size={SYMBOL} />
      </span>
      <div className="trainerkarte-text">
        <MitInfo
          zeile={<span className="trainer-name">{name}</span>}
          erklaerung={<p>{t(`trainer.${trainer.kennung}.ablauf`)}</p>}
          thema={name}
        />
      </div>
      {trainer.fertig ? (
        // Seit 0.2.87 nur das Symbol (Rückmeldung des Autors: der Knopf mit Text verdeckte Namen
        // und Fragezeichen); der Name „Trainieren“ bleibt für Bildschirmleser und als Tooltip.
        <button
          type="button"
          className="knopf-zweit trainieren"
          aria-label={t("training.trainieren")}
          title={t("training.trainieren")}
          onClick={() => navigiere({ bildschirm: "trainer", kennung: trainer.kennung })}
        >
          <Play size={KNOPFSYMBOL} aria-hidden="true" />
        </button>
      ) : (
        <span className="plakette-folgt">{t("training.folgt")}</span>
      )}
    </div>
  );
}
