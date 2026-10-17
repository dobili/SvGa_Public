/**
 * Bildschirm „Trainer“: Übungsart wählen und eine Runde spielen (AP 13).
 *
 * Rolle im Gesamtbild: Konzept 9.2 (starte, naechste, antworte, beende). Zähltrainer,
 * Schach-Röntgen-Trainer und „Koordinaten, Notation, Gangarten“ üben an den Buchstellungen;
 * Taktiktrainer, „Falle oder Köder“ und Strukturerkenner haben eigene Aufgaben aus den
 * Trainerdaten (ui/trainer/*Bereich.tsx). Die
 * Aufgaben entstehen aus den Stellungen des Buches (training/buchstellungen.ts); eine Runde hat
 * je nach Übungsart 5 bis 16 Aufgaben und zählt am Ende als Durchgang im Fortschritt.
 * Abhängigkeiten: training/*, ui/trainer/*, Navigation, i18n.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import { ladeBuchstellungen, type Buchstellung } from "../../training/buchstellungen";
import { feldrunde, gangartrunde, zugrunde } from "../../training/koordinatentrainer";
import { roentgenrunde } from "../../training/roentgentrainer";
import type { TrainerKennung } from "../../training/trainer";
import { haengerunde, zaehlrunde } from "../../training/zaehltrainer";
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
import { StrukturBereich } from "../trainer/StrukturBereich";
import { EndspielBereich } from "../trainer/EndspielBereich";
import { TaktikBereich } from "../trainer/TaktikBereich";
import { Haengeaufgabe, Zaehlaufgabe } from "../trainer/Zaehltrainer";

export type Uebungsart =
  "bilanz" | "haengen" | "roentgen" | "felder" | "notieren" | "ausfuehren" | "gangarten";

/** Die Übungsarten der spielbaren Trainer, in der Reihenfolge der Auswahl. */
const UEBUNGSARTEN: Readonly<Partial<Record<TrainerKennung, readonly Uebungsart[]>>> = {
  zaehlen: ["bilanz", "haengen"],
  roentgen: ["roentgen"],
  koordinaten: ["felder", "notieren", "ausfuehren", "gangarten"],
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
