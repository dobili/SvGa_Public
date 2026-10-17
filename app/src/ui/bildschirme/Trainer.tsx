/**
 * Bildschirm „Trainer“: Übungsart wählen und eine Runde spielen (AP 13).
 *
 * Rolle im Gesamtbild: Konzept 9.2 (starte, naechste, antworte, beende). Zähltrainer,
 * Schach-Röntgen-Trainer, „Koordinaten, Notation, Gangarten“, Zielbilanz-Übung und
 * Faktorenbilanz-Trainer üben an den Buchstellungen;
 * Taktiktrainer, „Falle oder Köder“ und Strukturerkenner haben eigene Aufgaben aus den
 * Trainerdaten, der Repertoire-Trainer die Zugfolgen aus Kapitel 2 (ui/trainer/*Bereich.tsx). Die
 * Aufgaben entstehen aus den Stellungen des Buches (training/buchstellungen.ts); eine Runde hat
 * je nach Übungsart 5 bis 16 Aufgaben und zählt am Ende als Durchgang im Fortschritt.
 * Abhängigkeiten: training/*, ui/trainer/*, Navigation, i18n.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { ladeBuchstellungen, type Buchstellung } from "../../training/buchstellungen";
import { denkrunde } from "../../training/denkroutinetrainer";
import { faktorenrunde } from "../../training/faktorentrainer";
import { feldrunde, gangartrunde, zugrunde } from "../../training/koordinatentrainer";
import { roentgenrunde } from "../../training/roentgentrainer";
import type { TrainerKennung } from "../../training/trainer";
import { haengerunde, zaehlrunde } from "../../training/zaehltrainer";
import { zielbilanzrunde } from "../../training/zielbilanztrainer";
import { ZUFALL } from "../../training/zufall";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { useDaten } from "../komponenten/useDaten";
import {
  Ausfuehraufgabe,
  Feldaufgabe,
  Gangartaufgabe,
  Notieraufgabe,
} from "../trainer/Koordinatentrainer";
import { Roentgenaufgabe } from "../trainer/Roentgentrainer";
import { Rundenablauf, type Darstellung } from "../trainer/Rundenablauf";
import { FallenBereich } from "../trainer/FallenBereich";
import { RepertoireBereich } from "../trainer/RepertoireBereich";
import { StrukturBereich } from "../trainer/StrukturBereich";
import { StudienBereich, ZugErratenBereich } from "../trainer/StudienBereich";
import { EndspielBereich } from "../trainer/EndspielBereich";
import { FehlerBereich } from "../trainer/FehlerBereich";
import { TaktikBereich } from "../trainer/TaktikBereich";
import { Haengeaufgabe, Zaehlaufgabe } from "../trainer/Zaehltrainer";
import { Zielbilanzaufgabe } from "../trainer/Zielbilanzaufgabe";
import { Faktorenaufgabe } from "../trainer/Faktorenaufgabe";
import { Denkroutineaufgabe } from "../trainer/Denkroutineaufgabe";

export type Uebungsart =
  | "bilanz"
  | "haengen"
  | "roentgen"
  | "felder"
  | "notieren"
  | "ausfuehren"
  | "gangarten"
  | "zielbilanz"
  | "faktoren"
  | "denkroutine";

/** Die Übungsarten der spielbaren Trainer, in der Reihenfolge der Auswahl. */
const UEBUNGSARTEN: Readonly<Partial<Record<TrainerKennung, readonly Uebungsart[]>>> = {
  zaehlen: ["bilanz", "haengen"],
  roentgen: ["roentgen"],
  koordinaten: ["felder", "notieren", "ausfuehren", "gangarten"],
  zielbilanz: ["zielbilanz"],
  faktorenbilanz: ["faktoren"],
  denkroutine: ["denkroutine"],
};

/** Aufgaben je Runde: kurze Runden passen in eine Pause, „Feld finden“ geht schnell. */
const ANZAHL: Readonly<Record<Uebungsart, number>> = {
  bilanz: 8,
  haengen: 8,
  roentgen: 5,
  felder: 16,
  notieren: 8,
  ausfuehren: 8,
  gangarten: 8,
  zielbilanz: 5,
  faktoren: 5,
  // Je Stellung eine Minute Denkzeit und die Rechnung der Engine: drei Stellungen je Runde.
  denkroutine: 3,
};

/** Erzeugt die Aufgaben einer Runde, jede schon mit ihrer Darstellung. */
function erzeuge(art: Uebungsart, stellungen: readonly Buchstellung[]): Darstellung[] {
  const n = ANZAHL[art];
  switch (art) {
    case "bilanz":
      return zaehlrunde(stellungen, n, ZUFALL).map((a) => (r) => (
        <Zaehlaufgabe aufgabe={a} runde={r} />
      ));
    case "haengen":
      return haengerunde(stellungen, n, ZUFALL).map((a) => (r) => (
        <Haengeaufgabe aufgabe={a} runde={r} />
      ));
    case "roentgen":
      return roentgenrunde(stellungen, n, ZUFALL).map((a) => (r) => (
        <Roentgenaufgabe aufgabe={a} runde={r} />
      ));
    case "felder":
      return feldrunde(n, ZUFALL).map((a) => (r) => <Feldaufgabe aufgabe={a} runde={r} />);
    case "notieren":
      return zugrunde(stellungen, n, false, ZUFALL).map((a) => (r) => (
        <Notieraufgabe aufgabe={a} runde={r} />
      ));
    case "ausfuehren":
      return zugrunde(stellungen, n, true, ZUFALL).map((a) => (r) => (
        <Ausfuehraufgabe aufgabe={a} runde={r} />
      ));
    case "gangarten":
      return gangartrunde(stellungen, n, ZUFALL).map((a) => (r) => (
        <Gangartaufgabe aufgabe={a} runde={r} />
      ));
    case "zielbilanz":
      return zielbilanzrunde(stellungen, n, ZUFALL).map((a) => (r) => (
        <Zielbilanzaufgabe aufgabe={a} runde={r} />
      ));
    case "faktoren":
      return faktorenrunde(stellungen, n, ZUFALL).map((a) => (r) => (
        <Faktorenaufgabe aufgabe={a} runde={r} />
      ));
    case "denkroutine":
      return denkrunde(stellungen, n, ZUFALL).map((a) => (r) => (
        <Denkroutineaufgabe aufgabe={a} runde={r} />
      ));
  }
}

/** Auswahl der Übungsart. */
function Auswahl({
  arten,
  waehle,
}: {
  arten: readonly Uebungsart[];
  waehle: (art: Uebungsart) => void;
}) {
  return (
    <ul className="uebungsarten">
      {arten.map((art) => (
        <li key={art}>
          <button type="button" className="karte uebungsart" onClick={() => waehle(art)}>
            <span className="karte-titel">{t(`uebungsart.${art}.name`)}</span>
            <span className="hinweis">{t(`uebungsart.${art}.text`)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function Inhalt({
  kennung,
  stellungen,
}: {
  kennung: TrainerKennung;
  stellungen: readonly Buchstellung[];
}) {
  const arten = UEBUNGSARTEN[kennung] ?? [];
  const einzige = arten.length === 1 ? (arten[0] ?? null) : null;
  const [art, setzeArt] = useState<Uebungsart | null>(einzige);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (arten.length === 0) return <p className="hinweis">{t("training.folgt")}</p>;
  if (art === null) return <Auswahl arten={arten} waehle={setzeArt} />;
  return (
    <Rundenablauf
      key={`${art}-${durchlauf}`}
      kennung={kennung}
      erzeuge={() => erzeuge(art, stellungen)}
      nochmal={() => setzeDurchlauf(durchlauf + 1)}
      zurAuswahl={einzige ? null : () => setzeArt(null)}
    />
  );
}

/** Trainer, die an den Buchstellungen üben (Zählen, Röntgen, Koordinaten). */
function MitBuchstellungen({ kennung }: { kennung: TrainerKennung }) {
  const daten = useDaten(ladeBuchstellungen, "buchstellungen");
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  return <Inhalt kennung={kennung} stellungen={daten.wert} />;
}

/** Trainer mit eigenen Aufgaben aus den Trainerdaten (AP 13, Fable). */
const EIGENE_BEREICHE: Partial<Record<TrainerKennung, () => React.ReactNode>> = {
  taktik: () => <TaktikBereich />,
  falle: () => <FallenBereich />,
  struktur: () => <StrukturBereich />,
  endspiel: () => <EndspielBereich />,
  repertoire: () => <RepertoireBereich />,
  studien: () => <StudienBereich />,
  zugErraten: () => <ZugErratenBereich />,
  fehlerdatenbank: () => <FehlerBereich />,
};

export function Trainer({ kennung }: { kennung: TrainerKennung }) {
  const eigener = EIGENE_BEREICHE[kennung];
  return (
    <div className="bildschirm bildschirm-trainer" data-testid="trainer">
      <Kopfzeile titel={t(`trainer.${kennung}.name`)} zurueckText={t("trainer.zurueck")} />
      <p className="hinweis">{t(`trainer.${kennung}.ablauf`)}</p>
      {eigener ? eigener() : <MitBuchstellungen kennung={kennung} />}
    </div>
  );
}
