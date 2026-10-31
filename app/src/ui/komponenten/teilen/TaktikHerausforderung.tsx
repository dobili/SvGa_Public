/**
 * Herausforderungen im Taktiktrainer (Gamifizierung P9): der Knopf nach einer gelösten Aufgabe und
 * die geöffnete Aufgabe aus einem Link.
 *
 * Rolle im Gesamtbild: `TaktikHerausforderungsknopf` kommt in die Taktikaufgabe (gesperrte Datei,
 * Einbau als Patch durch den Koordinierungs-Chat) und zeigt sich nur bei Aufgaben aus freien
 * Quellen (E7). `TaktikHerausforderung` ist der Eintrag in HERAUSFORDERUNGEN: Sie lädt die
 * Aufgaben, sucht die verlinkte und stellt sie wie die Tagesaufgabe als Runde mit einer Aufgabe;
 * die Antwort zählt wie im Trainer. Danach kann der Freund sie weitergeben oder den Trainer öffnen.
 * Abhängigkeiten: taktikherausforderung.ts, Herausforderungsknopf.tsx, ui/trainer/Taktikaufgabe,
 * ui/trainer/useFreieRunde, daten/trainerdaten.ts, Navigation, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { ladeTaktik, type Taktikaufgabe } from "../../../daten/trainerdaten";
import { t } from "../../../i18n/sprache";
import { Taktikaufgabe as Aufgabe } from "../../trainer/Taktikaufgabe";
import { useFreieRunde } from "../../trainer/useFreieRunde";
import { useDaten } from "../bausteine/useDaten";
import { Herausforderungsknopf } from "./Herausforderungsknopf";
import { findeFreieTaktik, taktikFrei, taktikKurz } from "./taktikherausforderung";

/** Kennung des Trainers in Adresse und Liste. */
const TRAINER = "taktik";

/** Der Satz zur Aufgabe. Beispiel: Weiß am Zug, Ziel Gewinn → „Schaffst du das? Weiß zieht und gewinnt.“ */
function satz(aufgabe: Taktikaufgabe): string {
  const farbe = t(aufgabe.amZug === "w" ? "farbe.w" : "farbe.b");
  return t(`teilen.satz.${aufgabe.ziel}`, { farbe });
}

/** Knopf „Freunde herausfordern“ unter einer gelösten Taktikaufgabe; bei Buchaufgaben nichts. */
export function TaktikHerausforderungsknopf({ aufgabe }: { aufgabe: Taktikaufgabe }) {
  if (!taktikFrei(aufgabe)) return null;
  return (
    <Herausforderungsknopf trainer={TRAINER} aufgabe={taktikKurz(aufgabe)} text={satz(aufgabe)} />
  );
}

/** Die Aufgabe mit Runde, nach dem Lösen Weitergeben und der Weg zum Trainer. */
function Herausforderungsrunde({ aufgabe }: { aufgabe: Taktikaufgabe }) {
  const { runde } = useFreieRunde(1);
  const { navigiere } = useNavigation();
  return (
    <>
      <p className="hinweis">{t("teilen.einladung")}</p>
      <Aufgabe aufgabe={aufgabe} runde={runde} />
      {runde.ergebnis !== null && (
        <>
          {/* Bis der Knopf in Taktikaufgabe.tsx steht (Patch an den Koordinierungs-Chat), hier. */}
          <TaktikHerausforderungsknopf aufgabe={aufgabe} />
          <button
            type="button"
            className="knopf-link"
            onClick={() => navigiere({ bildschirm: "trainer", kennung: TRAINER })}
          >
            {t("teilen.zumTrainer", { trainer: t(`trainer.${TRAINER}.name`) })}
          </button>
        </>
      )}
    </>
  );
}

/** Die verlinkte Taktikaufgabe; unbekannt oder aus dem Buch → ein Hinweis statt der Aufgabe. */
export function TaktikHerausforderung({ aufgabe: kurz }: { aufgabe: string }) {
  const daten = useDaten(ladeTaktik, "trainer-taktik");
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const aufgabe = findeFreieTaktik(daten.wert.aufgaben, kurz);
  if (!aufgabe) return <p className="hinweis">{t("teilen.unbekannt")}</p>;
  return <Herausforderungsrunde aufgabe={aufgabe} />;
}
