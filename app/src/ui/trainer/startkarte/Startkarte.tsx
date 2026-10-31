/**
 * Die Startkarte eines Trainers (Entwurf G1, Wahl des Autors vom 31.10.2026).
 *
 * Rolle im Gesamtbild: Ersetzt die frühere Startseite aus Text, Formular und wieder Text. Für
 * jeden Trainer dieselbe Form: oben ein Beispielbrett mit einem Satz, worum es geht
 * (trainerstarts.ts), darunter „Deine Runde“ als antippbare Zeilen mit den zuletzt gewählten
 * Werten (Einstellzeile.tsx), ein großer Knopf „Runde starten“ und die weiteren Modi des
 * Trainers als kleinere Knöpfe. Die Beschreibung des Ablaufs und weitere Erklärungen stehen hinter
 * „So funktioniert dieser Trainer“. Die Bereiche (ui/trainer/*Bereich.tsx) liefern nur Listen.
 * Abhängigkeiten: ui/brett/Brett.tsx, einstellung.ts, Einstellzeile.tsx, trainerstarts.ts, i18n.
 */
import {
  CalendarCheck,
  ChevronDown,
  CircleHelp,
  Clock,
  Flame,
  Play,
  RotateCcw,
  Timer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { t } from "../../../i18n/sprache";
import type { TrainerKennung } from "../../../training/trainer";
import { Brett } from "../../brett/Brett";
import type { Einstellung, Modussymbol, Startknopf, Startmodus } from "./einstellung";
import { Einstellzeile } from "./Einstellzeile";
import { TRAINERSTARTS } from "./trainerstarts";
import "../../stil/startkarte.css";

/** Größe der Zeichen der Modi und des Startknopfs (Bildpunkte). */
const MODUSZEICHEN = 26;
const KNOPFZEICHEN = 20;

/** Das Bild je Modus; ein neuer Modus trägt hier eine Zeile ein. */
const MODUSBILDER: Readonly<Record<Modussymbol, LucideIcon>> = {
  serie: Flame,
  wiederholen: RotateCcw,
  kurz: Zap,
  zeit: Timer,
  tag: CalendarCheck,
  plan: Clock,
};

/** Beispielbrett und Satz oben; das Brett ist Schmuck und für Bildschirmleser verborgen. */
function Startkopf({ kennung }: { kennung: TrainerKennung }) {
  const beispiel = TRAINERSTARTS[kennung];
  return (
    <div className="startkopf" data-tour="trainer-ablauf">
      {beispiel && (
        <div className="startkopf-brett" aria-hidden="true" inert>
          <Brett
            fen={beispiel.fen}
            markierungen={beispiel.markierungen}
            gedreht={beispiel.gedreht ?? false}
            koordinaten={false}
            beschriftung={t(`trainer.${kennung}.name`)}
          />
        </div>
      )}
      <div className="startkopf-text">
        <h2 className="startkopf-satz">{t(`trainerstart.${kennung}.satz`)}</h2>
        <p className="startkopf-kurz">{t(`trainerstart.${kennung}.kurz`)}</p>
      </div>
    </div>
  );
}

/** Ein weiterer Modus als Knopf: Zeichen, Name, ein Satz, Startzeichen. */
function Modusknopf({ modus }: { modus: Startmodus }) {
  const Bild = MODUSBILDER[modus.symbol];
  return (
    <button
      type="button"
      className="startmodus"
      data-testid={modus.testkennung}
      data-tour={modus.tour}
      onClick={modus.starte}
    >
      <Bild className="startmodus-zeichen" size={MODUSZEICHEN} aria-hidden="true" />
      <span className="startmodus-text">
        <span className="startmodus-titel">{modus.titel}</span>
        <span className="startmodus-satz">{modus.text}</span>
      </span>
      <span className="startmodus-los" aria-hidden="true">
        <Play size={KNOPFZEICHEN - 2} />
      </span>
    </button>
  );
}

/** Der große Startknopf mit Zusatz („Runde starten · 8 Aufgaben“). */
function Hauptknopf({ start }: { start: Startknopf }) {
  const text = start.text ?? t("taktiktrainer.starten");
  return (
    <button
      type="button"
      className="knopf-haupt startknopf"
      data-testid={start.testkennung}
      disabled={start.gesperrt ?? false}
      onClick={start.starte}
    >
      <Play size={KNOPFZEICHEN} aria-hidden="true" />
      {start.zusatz ? t("trainerstart.startMit", { text, zusatz: start.zusatz }) : text}
    </button>
  );
}

/** „So funktioniert dieser Trainer“: Ablauf und weitere Erklärungen, zugeklappt. */
function Starthilfe({ kennung, hilfen }: { kennung: TrainerKennung; hilfen: readonly string[] }) {
  return (
    <details className="starthilfe" data-testid="trainer-hilfe">
      <summary>
        <CircleHelp size={KNOPFZEICHEN} aria-hidden="true" />
        {t("trainerstart.hilfe")}
        <ChevronDown className="starthilfe-pfeil" size={KNOPFZEICHEN - 2} aria-hidden="true" />
      </summary>
      <p className="trainer-ablauf">{t(`trainer.${kennung}.ablauf`)}</p>
      {hilfen.map((h) => (
        <p key={h} className="hinweis">
          {h}
        </p>
      ))}
    </details>
  );
}

/**
 * Die Startkarte eines Trainers.
 *
 * Eingaben: Trainer, Einstellzeilen (dürfen fehlen), Startknopf (oder null), weitere Modi,
 * ein Hinweis unter der Runde (etwa die Herkunft von Zusatzaufgaben), weitere Erklärungen für
 * „So funktioniert“ und die Prüfkennung.
 * Beispiel: Taktiktrainer mit „Aufgaben“, „Motiv“, „Stufe“, Startknopf und „Serie ohne Fehler“.
 */
export function Startkarte({
  kennung,
  zeilen = [],
  start,
  modi = [],
  hinweis = null,
  hilfen = [],
  testkennung,
}: {
  kennung: TrainerKennung;
  zeilen?: readonly Einstellung[];
  start: Startknopf | null;
  modi?: readonly Startmodus[];
  hinweis?: ReactNode;
  hilfen?: readonly string[];
  testkennung: string;
}) {
  return (
    <div className="trainerrunde trainerwahl startkarte" data-testid={testkennung}>
      <Startkopf kennung={kennung} />
      <div className="startrunde-block" data-tour="trainer-wahl">
        {zeilen.length > 0 && (
          <section className="startrunde" aria-label={t("trainerstart.deineRunde")}>
            <p className="startrunde-titel">{t("trainerstart.deineRundeAntippen")}</p>
            {zeilen.map((z) => (
              <Einstellzeile key={z.kennung} zeile={z} />
            ))}
          </section>
        )}
        {hinweis}
        {start && <Hauptknopf start={start} />}
      </div>
      {modi.map((m) => (
        <Modusknopf key={m.kennung} modus={m} />
      ))}
      <Starthilfe kennung={kennung} hilfen={hilfen} />
    </div>
  );
}
