/**
 * Kapitelübersicht: Abschnitte des Kapitels mit allen Abbildungen als kleine Bretter.
 *
 * Rolle im Gesamtbild: Bildschirm „Kapitelübersicht“ aus Konzept 10.1 (Pflichtenheft 4
 * „Abbildung aufrufen … Kapitelübersicht mit kleinen Brettern“). Erreichbar über das Buch.
 * Die kleinen Bretter zeigen Pfeile und Felder wie im Buch; ein Tipp öffnet die Abbildung.
 * Das Kapitelbild folgt, sobald die Bilder des Buches final sind. Oben stehen der Fortschritt
 * des Lesers (AP 12), dann Trainer (Pflichtenheft 7) und Übungen in einer Karte, darunter die
 * Galerie der Abbildungen mit den Abhak-Knöpfen (Abbildungsgalerie.tsx).
 * Abhängigkeiten: daten/laden.ts, Abbildungsgalerie, Kapitelfortschritt, KapitelUebungen, i18n.
 */
import { ladeKapitel, type Kapitel as KapitelDaten } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { Abbildungsgalerie } from "../komponenten/kapitel/Abbildungsgalerie";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { KapitelUebungen } from "../komponenten/kapitel/KapitelUebungen";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Kapitelfortschritt } from "../komponenten/kapitel/Kapitelfortschritt";
import { trainerZuKapitel } from "../../training/trainer";
import { Trainerkarte } from "../komponenten/training/Trainerkarte";
import { Titelsymbol } from "../komponenten/bausteine/Titelsymbol";

/**
 * Trainer und Übungen des Kapitels in einer Karte (Konzept 10.1: „Trainer des Kapitels“; seit
 * 0.2.80 zusammen, Wunsch des Autors vom 18.10.2026). Ohne beides keine Karte.
 */
function TrainingUndUebungen({ kapitel }: { kapitel: KapitelDaten }) {
  const trainer = trainerZuKapitel(kapitel.kapitel);
  if (trainer.length === 0 && kapitel.uebungen.length === 0) return null;
  return (
    <section className="karte kapitel-training" data-testid="kapitel-training">
      <h2 className="karte-titel">
        <Titelsymbol art="training" />
        {t("kapitel.trainingUndUebungen")}
      </h2>
      {trainer.length > 0 && (
        <div className="kapitel-trainer" data-tour="kapitel-trainer">
          <h3 className="unterteil-titel">{t("training.kapitelTrainer")}</h3>
          {trainer.map((eintrag) => (
            <Trainerkarte key={eintrag.kennung} trainer={eintrag} />
          ))}
        </div>
      )}
      <KapitelUebungen kapitel={kapitel} />
    </section>
  );
}

function Inhalt({ kapitel }: { kapitel: KapitelDaten }) {
  return (
    <>
      <p className="kapitel-untertitel">{kapitel.titel}</p>
      <Kapitelfortschritt kapitel={kapitel} />
      <TrainingUndUebungen kapitel={kapitel} />
      <Abbildungsgalerie kapitel={kapitel} />
    </>
  );
}

/**
 * Bildschirm eines Kapitels.
 *
 * Eingabe: Kapitelnummer. Beispiel: Kapitel 1 mit Abschnitt 1.4 und den Abb. 1.26 bis 1.29.
 */
export function Kapitel({ nummer }: { nummer: number }) {
  const kapitel = useDaten(() => ladeKapitel(nummer), `kapitel-${nummer}`);
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("buch.kapitel", { nummer })} zurueckText={t("buch.titel")} />
      {kapitel.art === "laedt" && <p className="lade">…</p>}
      {kapitel.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: kapitel.meldung })}</p>
      )}
      {kapitel.art === "fertig" && <Inhalt kapitel={kapitel.wert} />}
    </div>
  );
}
