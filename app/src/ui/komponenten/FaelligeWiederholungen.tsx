/**
 * Fällige Wiederholungen im Bereich Training (Konzept 9.1: „Beim Öffnen der App zeigt der Bereich
 * ‚Training‘, wie viele Karten fällig sind“).
 *
 * Rolle im Gesamtbild: Zählt die fälligen Karten (training/wiederholung.ts) und startet die
 * Übungen des Buches als Reihe im Bildschirm „Übung“. Fällige Aufgaben des Taktiktrainers und
 * von „Falle oder Köder“ (U9, 0.2.47) führen in ihren Trainer; dort startet „Wiederholen“ sie.
 * Abhängigkeiten: Speicher, Navigation, training/wiederholung.ts, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import type { Uebungsverweis } from "../../app/stapel";
import { datumText, t } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";
import {
  aufgabenAusKarten,
  faellige,
  uebungAusKarte,
  WIEDERHOLTE_TRAINER,
} from "../../training/wiederholung";

/** Je Trainer mit fälligen Aufgaben ein Knopf in den Trainer. */
function Trainerwiederholungen({ faellig }: { faellig: readonly string[] }) {
  const { navigiere } = useNavigation();
  return WIEDERHOLTE_TRAINER.map((kennung) => {
    const anzahl = aufgabenAusKarten(faellig, kennung).length;
    if (anzahl === 0) return null;
    return (
      <p key={kennung}>
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => navigiere({ bildschirm: "trainer", kennung })}
        >
          {t("training.faelligTrainer", { trainer: t(`trainer.${kennung}.name`), anzahl })}
        </button>
      </p>
    );
  });
}

/** Zeigt im Bereich Training, wie viele Wiederholungen fällig sind, und startet sie. */
export function FaelligeWiederholungen() {
  const { navigiere } = useNavigation();
  const karten = useSpeicher((z) => z.daten.karten);
  const staende = useSpeicher((z) => z.daten.fortschritt.uebungen);
  const jetzt = new Date();
  const faellig = faellige(karten, jetzt);
  const trainer = <Trainerwiederholungen faellig={faellig} />;
  const reihe: Uebungsverweis[] = faellig.flatMap((kennung) => {
    const id = uebungAusKarte(kennung);
    const kapitel = id ? staende[id]?.kapitel : undefined;
    return id && kapitel !== undefined ? [{ kapitel, id }] : [];
  });
  const erste = reihe[0];
  const trainerFaellig = WIEDERHOLTE_TRAINER.some(
    (kennung) => aufgabenAusKarten(faellig, kennung).length > 0,
  );
  if (!erste && trainerFaellig) return <div data-testid="faellig">{trainer}</div>;
  if (!erste) {
    const termine = Object.values(karten).map((k) => Date.parse(k.faellig));
    const naechster = termine.length > 0 ? new Date(Math.min(...termine)) : null;
    return (
      <p className="hinweis" data-testid="faellig">
        {naechster
          ? t("training.naechsteFaellig", { datum: datumText(naechster) })
          : t("training.keineFaellig")}
      </p>
    );
  }
  return (
    <div data-testid="faellig">
      <p>
        {reihe.length === 1
          ? t("training.faelligEine")
          : t("training.faelligAnzahl", { anzahl: reihe.length })}
      </p>
      <button
        type="button"
        className="knopf-haupt"
        onClick={() => navigiere({ bildschirm: "uebung", ...erste, reihe })}
      >
        {t("training.wiederholen")}
      </button>
      {trainer}
    </div>
  );
}
