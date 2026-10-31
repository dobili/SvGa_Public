/**
 * Fällige Wiederholungen im Bereich Training (Konzept 9.1: „Beim Öffnen der App zeigt der Bereich
 * ‚Training‘, wie viele Karten fällig sind“).
 *
 * Rolle im Gesamtbild: Zählt die fälligen Karten (training/wiederholung.ts) und startet die
 * Übungen des Buches als Reihe im Bildschirm „Übung“. Fällige Aufgaben der Trainer (Taktik,
 * „Falle oder Köder“, Strukturerkenner, Endspiel; U9) führen in ihren Trainer; dort startet
 * „Wiederholen“ sie. Oben steht die Gesamtzahl, darunter je Quelle ein Knopf.
 * Abhängigkeiten: Speicher, Navigation, training/wiederholung.ts, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import type { Uebungsverweis } from "../../../app/stapel";
import { datumText, t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import {
  aufgabenAusKarten,
  faellige,
  uebungAusKarte,
  WIEDERHOLTE_TRAINER,
  type WiederholterTrainer,
} from "../../../training/wiederholung";
import { useVorhandeneAufgaben } from "./vorhandeneAufgaben";

/**
 * Je Trainer die Zahl der fälligen Aufgaben, die es noch gibt (größer als null). Verwaiste Karten
 * (Aufgabe aussortiert oder ausgeschlossen) zählen nicht (vorhandeneAufgaben.ts).
 */
function trainerAnzahlen(
  faellig: readonly string[],
  vorhanden: (trainer: WiederholterTrainer, ids: readonly string[]) => number,
): { kennung: WiederholterTrainer; anzahl: number }[] {
  return WIEDERHOLTE_TRAINER.map((kennung) => ({
    kennung,
    anzahl: vorhanden(kennung, aufgabenAusKarten(faellig, kennung)),
  })).filter((z) => z.anzahl > 0);
}

/**
 * Zeigt im Bereich Training, wie viele Wiederholungen fällig sind, und startet sie.
 *
 * Aufbau (Wunsch des Autors, 30.10.2026: „2 Übungen“ oben und „4 fällig“ darunter verwirrte):
 * oben die Gesamtzahl, darunter je Quelle eine Zeile mit eigenem Knopf (Übungen aus dem Buch,
 * dann die Trainer), dazu aufklappbar das Prinzip der Lernkartei.
 */
export function FaelligeWiederholungen() {
  const { navigiere } = useNavigation();
  const karten = useSpeicher((z) => z.daten.karten);
  const staende = useSpeicher((z) => z.daten.fortschritt.uebungen);
  const vorhanden = useVorhandeneAufgaben();
  const jetzt = new Date();
  const faellig = faellige(karten, jetzt);
  const reihe: Uebungsverweis[] = faellig.flatMap((kennung) => {
    const id = uebungAusKarte(kennung);
    const kapitel = id ? staende[id]?.kapitel : undefined;
    return id && kapitel !== undefined ? [{ kapitel, id }] : [];
  });
  const trainer = trainerAnzahlen(faellig, vorhanden);
  const gesamt = reihe.length + trainer.reduce((summe, z) => summe + z.anzahl, 0);
  const erste = reihe[0];
  if (gesamt === 0) {
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
        {gesamt === 1
          ? t("training.faelligGesamtEins")
          : t("training.faelligGesamt", { anzahl: gesamt })}
      </p>
      <ul className="faellig-liste">
        {erste && (
          <li>
            <button
              type="button"
              className="knopf-zweit"
              onClick={() => navigiere({ bildschirm: "uebung", ...erste, reihe })}
            >
              {t("training.faelligBuch", { anzahl: reihe.length })}
            </button>
          </li>
        )}
        {trainer.map(({ kennung, anzahl }) => (
          <li key={kennung}>
            <button
              type="button"
              className="knopf-zweit"
              onClick={() => navigiere({ bildschirm: "trainer", kennung })}
            >
              {t("training.faelligTrainer", { trainer: t(`trainer.${kennung}.name`), anzahl })}
            </button>
          </li>
        ))}
      </ul>
      <details className="faellig-prinzip">
        <summary>{t("training.faelligPrinzipTitel")}</summary>
        <p className="hinweis">{t("training.faelligPrinzip")}</p>
      </details>
    </div>
  );
}
