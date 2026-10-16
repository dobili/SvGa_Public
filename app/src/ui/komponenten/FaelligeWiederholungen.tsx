/**
 * Fällige Wiederholungen im Bereich Training (Konzept 9.1: „Beim Öffnen der App zeigt der Bereich
 * ‚Training‘, wie viele Karten fällig sind“).
 *
 * Rolle im Gesamtbild: Zählt die fälligen Karten (training/wiederholung.ts) und startet sie als
 * Reihe im Bildschirm „Übung“. Bisher gibt es Karten nur zu den Übungen des Buches (AP 13);
 * Karten der Trainer kommen mit ihnen dazu.
 * Abhängigkeiten: Speicher, Navigation, training/wiederholung.ts, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import type { Uebungsverweis } from "../../app/stapel";
import { t } from "../../i18n/sprache";
import { useSpeicher } from "../../speicher/speicher";
import { faellige, uebungAusKarte } from "../../training/wiederholung";

export function FaelligeWiederholungen() {
  const { navigiere } = useNavigation();
  const karten = useSpeicher((z) => z.daten.karten);
  const staende = useSpeicher((z) => z.daten.fortschritt.uebungen);
  const jetzt = new Date();
  const reihe: Uebungsverweis[] = faellige(karten, jetzt).flatMap((kennung) => {
    const id = uebungAusKarte(kennung);
    const kapitel = id ? staende[id]?.kapitel : undefined;
    return id && kapitel !== undefined ? [{ kapitel, id }] : [];
  });
  const erste = reihe[0];
  if (!erste) {
    const termine = Object.values(karten).map((k) => Date.parse(k.faellig));
    const naechster = termine.length > 0 ? new Date(Math.min(...termine)) : null;
    return (
      <p className="hinweis" data-testid="faellig">
        {naechster
          ? t("training.naechsteFaellig", { datum: naechster.toLocaleDateString("de-DE") })
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
    </div>
  );
}
