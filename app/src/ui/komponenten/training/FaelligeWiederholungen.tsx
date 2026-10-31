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
import { useMemo } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import type { Uebungsverweis } from "../../../app/stapel";
import { ladeStrukturen } from "../../../daten/trainerdaten";
import { datumText, t } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import {
  aufgabenAusKarten,
  faellige,
  uebungAusKarte,
  WIEDERHOLTE_TRAINER,
  type WiederholterTrainer,
} from "../../../training/wiederholung";
import { useDaten } from "../bausteine/useDaten";

/** Je Trainer die Zahl der fälligen Aufgaben, die es noch gibt (größer als null). */
function trainerAnzahlen(
  faellig: readonly string[],
  vorhandeneStruktur: ReadonlySet<string> | null,
): { kennung: WiederholterTrainer; anzahl: number }[] {
  return WIEDERHOLTE_TRAINER.map((kennung) => {
    const ids = aufgabenAusKarten(faellig, kennung);
    // Aussortierte Aufgaben des Strukturerkenners (Nebenchat, 30.10.2026) zählen nicht mehr mit.
    const gueltig =
      kennung === "struktur" && vorhandeneStruktur
        ? ids.filter((id) => vorhandeneStruktur.has(id))
        : ids;
    return { kennung, anzahl: gueltig.length };
  }).filter((z) => z.anzahl > 0);
}

/** Die Kennungen der Aufgaben des Strukturerkenners, sobald die Daten geladen sind. */
function useVorhandeneStruktur(): ReadonlySet<string> | null {
  const daten = useDaten(ladeStrukturen, "trainer-struktur");
  return useMemo(
    () => (daten.art === "fertig" ? new Set(daten.wert.aufgaben.map((a) => a.id)) : null),
    [daten],
  );
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
  const vorhandeneStruktur = useVorhandeneStruktur();
  const jetzt = new Date();
  const faellig = faellige(karten, jetzt);
  const reihe: Uebungsverweis[] = faellig.flatMap((kennung) => {
    const id = uebungAusKarte(kennung);
    const kapitel = id ? staende[id]?.kapitel : undefined;
    return id && kapitel !== undefined ? [{ kapitel, id }] : [];
  });
  const trainer = trainerAnzahlen(faellig, vorhandeneStruktur);
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
