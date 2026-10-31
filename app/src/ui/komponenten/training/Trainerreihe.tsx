/**
 * Eine Wischreihe mit Trainer-Karten je Teil des Buches (Entwurf C2, 31.10.2026): kleines Brett mit
 * einer typischen Stellung, Name, Stand („neu · Kap. 2“ oder „3 Runden · 80 %“), Bestwert und
 * Plakette „fällig“.
 *
 * Rolle im Gesamtbild: Steht im Bereich Training (Training.tsx) einmal je Eintrag aus
 * trainerreihen(TRAINER). Jede Karte ist ein Knopf (Tastatur, Bildschirmleser, axe
 * „scrollable-region-focusable“ wie die Regale im Profil); der Name des Knopfs nennt Trainer,
 * Stand und Fälliges, die Teile darin sind für Bildschirmleser verborgen. Die testid
 * „trainer-<kennung>“ bleibt wie bei der früheren Trainerliste.
 * Abhängigkeiten: trainerreihen.ts, trainerbilder.ts, ui/brett/Brett.tsx, rekordtexte.ts, i18n.
 */
import { useNavigation } from "../../../app/navigationsKontext";
import { t, tZahl } from "../../../i18n/sprache";
import { useSpeicher } from "../../../speicher/speicher";
import type { Trainer, TrainerKennung } from "../../../training/trainer";
import { Brett } from "../../brett/Brett";
import { rekordtext } from "../rekorde/rekordtexte";
import { trainerbild } from "./trainerbilder";
import {
  kapitelbereich,
  trainerkartenstand,
  type Trainerkartenstand,
  type Trainerreihe as Reihe,
} from "./trainerreihen";

/** Die Standzeile. Beispiel: neu → „neu · Kap. 2–3“; gespielt → „3 Runden · 80 %“. */
function standzeile(stand: Trainerkartenstand, kapitel: string): string {
  if (stand.runden === 0) return t("trainingslook.neu", { kapitel });
  const runden = tZahl("trainingslook.runden", stand.runden, { anzahl: stand.runden });
  return stand.quote === null
    ? runden
    : `${runden} · ${t("trainingslook.quote", { quote: stand.quote })}`;
}

/** Eine Karte. Beispiel: Strukturerkenner, 1 fällig → Plakette „1 fällig“ auf dem Brett. */
function Trainerkachel({ trainer, faellig }: { trainer: Trainer; faellig: number }) {
  const { navigiere } = useNavigation();
  const trainerstand = useSpeicher((z) => z.daten.fortschritt.trainer[trainer.kennung]);
  const rekorde = useSpeicher((z) => z.daten.rekorde);
  const stand = trainerkartenstand(trainer.kennung, trainerstand, rekorde);
  const bild = trainerbild(trainer.kennung);
  const name = t(`trainer.${trainer.kennung}.name`);
  const zeile = standzeile(stand, kapitelbereich(trainer.kapitel));
  const bestwert = stand.rekord ? rekordtext(stand.rekord.kennung, stand.rekord.wert) : null;
  const plakette = faellig > 0 ? t("trainingslook.faellig", { anzahl: faellig }) : null;
  const beschriftung = [name, zeile, bestwert, plakette].filter(Boolean).join(", ");
  return (
    <li data-testid={`trainer-${trainer.kennung}`}>
      <button
        type="button"
        className="trainerkachel"
        aria-label={beschriftung}
        onClick={() => navigiere({ bildschirm: "trainer", kennung: trainer.kennung })}
      >
        <span className="trainerkachel-bild" aria-hidden="true">
          <Brett fen={bild.fen} markierungen={bild.markierungen} koordinaten={false} beschriftung="" />
          {plakette && <span className="plakette-faellig">{plakette}</span>}
        </span>
        <span className="trainerkachel-name">{name}</span>
        <span className={stand.runden === 0 ? "trainerkachel-stand neu" : "trainerkachel-stand"}>
          {zeile}
        </span>
        {bestwert && (
          <span className="trainerkachel-bestwert">
            {t("trainingslook.bestwert", { wert: bestwert })}
          </span>
        )}
        <span className="trainerkachel-band">
          <span style={{ width: `${String(stand.quote ?? 0)}%` }} />
        </span>
      </button>
    </li>
  );
}

/**
 * Eine Reihe: Kopf mit Teil, Kapiteln und Zahl der Trainer, darunter die Karten zum Wischen.
 *
 * Eingaben: die Reihe und je Trainer die Zahl fälliger Aufgaben (aus useFaelligeUebersicht).
 * Beispiel: „Grundlagen“, „Kapitel 0–1 · 3 Trainer“.
 */
export function Trainerreihe({
  reihe,
  faellig,
}: {
  reihe: Reihe;
  faellig: ReadonlyMap<TrainerKennung, number>;
}) {
  const kapitel = kapitelbereich(reihe.kapitel);
  return (
    <section className="trainerreihe" data-testid={`trainerreihe-${reihe.teil}`}>
      <div className="trainerreihe-kopf">
        <h2>{t(`fortschritt.teil.${reihe.teil}`)}</h2>
        <span className="hinweis">
          {tZahl("trainingslook.reihenkopf", reihe.trainer.length, {
            kapitel,
            anzahl: reihe.trainer.length,
          })}
        </span>
      </div>
      <ul className="trainerreihe-karten">
        {reihe.trainer.map((trainer) => (
          <Trainerkachel
            key={trainer.kennung}
            trainer={trainer}
            faellig={faellig.get(trainer.kennung) ?? 0}
          />
        ))}
      </ul>
    </section>
  );
}
