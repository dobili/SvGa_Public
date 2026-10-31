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
import { useMemo, useState } from "react";
import { t } from "../../i18n/sprache";
import { ladeBuchstellungen, type Buchstellung } from "../../training/buchstellungen";
import { denkrunde } from "../../training/denkroutinetrainer";
import { faktorenrunde } from "../../training/faktorentrainer";
import {
  auswahl,
  auswahlJeStellung,
  lapaufgabe,
  planaufgaben,
  rennaufgabe,
} from "../../training/planbilanztrainer";
import { feldrunde, gangartrunde, zugrunde } from "../../training/koordinatentrainer";
import type { TrainerKennung } from "../../training/trainer";
import { zielbilanzrunde } from "../../training/zielbilanztrainer";
import { rundeNachStufe, TRAINERSTUFEN, type Trainerstufe } from "../../training/stufen";
import { lapaufgabenAus } from "../../training/wiederholbar";
import { ZUFALL } from "../../training/zufall";
import { useFaelligeAufgaben } from "../trainer/kartenantwort";
import { Wiederholungsknopf } from "../trainer/Wiederholungsknopf";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { TrainerthemaKontext } from "../trainer/trainerthema";
import { useDaten } from "../komponenten/bausteine/useDaten";
import {
  Ausfuehraufgabe,
  Feldaufgabe,
  Gangartaufgabe,
  Notieraufgabe,
} from "../trainer/Koordinatentrainer";
import { RoentgenBereich } from "../trainer/RoentgenBereich";
import { ZaehlBereich } from "../trainer/ZaehlBereich";
import { Rundenablauf, type Darstellung } from "../trainer/Rundenablauf";
import { FallenBereich } from "../trainer/FallenBereich";
import { RepertoireBereich } from "../trainer/RepertoireBereich";
import { StrukturBereich } from "../trainer/StrukturBereich";
import { StudienBereich, ZugErratenBereich } from "../trainer/StudienBereich";
import { AbweichungBereich } from "../trainer/AbweichungBereich";
import { DreissigMinutenBereich } from "../trainer/DreissigMinutenBereich";
import { KurzplanBereich } from "../trainer/KurzplanBereich";
import { EndspielBereich } from "../trainer/EndspielBereich";
import { FehlerBereich } from "../trainer/FehlerBereich";
import { TaktikBereich } from "../trainer/TaktikBereich";
import { Zielbilanzaufgabe } from "../trainer/Zielbilanzaufgabe";
import { Faktorenaufgabe } from "../trainer/Faktorenaufgabe";
import { Denkroutineaufgabe } from "../trainer/Denkroutineaufgabe";
import { Lapaufgabe, Planfragenaufgabe, Rennaufgabe } from "../trainer/Planaufgaben";

export type Uebungsart =
  | "felder"
  | "notieren"
  | "ausfuehren"
  | "gangarten"
  | "zielbilanz"
  | "faktoren"
  | "denkroutine"
  | "planfragen"
  | "lap"
  | "wettrennen";

/** Die Übungsarten der spielbaren Trainer, in der Reihenfolge der Auswahl. */
const UEBUNGSARTEN: Readonly<Partial<Record<TrainerKennung, readonly Uebungsart[]>>> = {
  koordinaten: ["felder", "notieren", "ausfuehren", "gangarten"],
  zielbilanz: ["zielbilanz"],
  faktorenbilanz: ["faktoren"],
  denkroutine: ["denkroutine"],
  planbilanz: ["planfragen", "lap", "wettrennen"],
};

/** Aufgaben je Runde: kurze Runden passen in eine Pause, „Feld finden“ geht schnell. */
const ANZAHL: Readonly<Record<Uebungsart, number>> = {
  felder: 16,
  notieren: 8,
  ausfuehren: 8,
  gangarten: 8,
  zielbilanz: 5,
  faktoren: 5,
  // Je Stellung eine Minute Denkzeit und die Rechnung der Engine: drei Stellungen je Runde.
  denkroutine: 3,
  planfragen: 4,
  lap: 6,
  wettrennen: 5,
};

/** Übungsarten mit Stufen (Punkt B2 des Nebenchats, training/stufen.ts). */
const MIT_STUFEN = ["felder", "zielbilanz", "lap", "denkroutine"] as const;
type Stufenart = (typeof MIT_STUFEN)[number];
const hatStufen = (art: Uebungsart): art is Stufenart =>
  (MIT_STUFEN as readonly Uebungsart[]).includes(art);

/** Erzeugt die Aufgaben einer Runde, jede schon mit ihrer Darstellung. */
function erzeuge(
  art: Uebungsart,
  stellungen: readonly Buchstellung[],
  stufe: Trainerstufe | null,
): Darstellung[] {
  const n = ANZAHL[art];
  switch (art) {
    case "felder":
      return feldrunde(n, ZUFALL, stufe).map((a) => (r) => <Feldaufgabe aufgabe={a} runde={r} />);
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
      return zielbilanzrunde(stellungen, n, ZUFALL, stufe).map((a) => (r) => (
        <Zielbilanzaufgabe aufgabe={a} runde={r} />
      ));
    case "faktoren":
      return faktorenrunde(stellungen, n, ZUFALL).map((a) => (r) => (
        <Faktorenaufgabe aufgabe={a} runde={r} />
      ));
    case "denkroutine":
      return denkrunde(stellungen, n, ZUFALL, stufe).map((a) => (r) => (
        <Denkroutineaufgabe aufgabe={a} runde={r} />
      ));
    default:
      return planrunde(art, stellungen, n, stufe);
  }
}

/** Die drei Übungsarten der Planbilanz-Übung (Kapitel 6). */
function planrunde(
  art: "planfragen" | "lap" | "wettrennen",
  stellungen: readonly Buchstellung[],
  n: number,
  stufe: Trainerstufe | null,
): Darstellung[] {
  switch (art) {
    case "planfragen":
      return auswahlJeStellung(planaufgaben(stellungen, ZUFALL), n, ZUFALL).map((a) => (r) => (
        <Planfragenaufgabe aufgabe={a} runde={r} />
      ));
    case "lap":
      return rundeNachStufe(
        stellungen.flatMap((b) => lapaufgabe(b) ?? []),
        stufe,
        n,
        ZUFALL,
      ).map((a) => (r) => <Lapaufgabe aufgabe={a} runde={r} />);
    case "wettrennen":
      return auswahl(
        stellungen.flatMap((b) => rennaufgabe(b) ?? []),
        n,
        ZUFALL,
      ).map((a) => (r) => <Rennaufgabe aufgabe={a} runde={r} />);
  }
}

/**
 * Die Stufe über der Runde: gemischt, leicht, mittel, schwer. Ein Wechsel startet eine neue Runde.
 * Der Satz darunter sagt, was die Stufe misst (Punkt B7 des Nebenchats).
 */
function Stufenzeile({
  art,
  stufe,
  setze,
}: {
  art: Stufenart;
  stufe: Trainerstufe | null;
  setze: (s: Trainerstufe | null) => void;
}) {
  return (
    <div className="stufenzeile" data-testid="stufenzeile">
      <fieldset className="zahlwahl">
        <legend>{t("taktiktrainer.stufeWahl")}</legend>
        {[null, ...TRAINERSTUFEN].map((s) => (
          <button
            key={s ?? "gemischt"}
            type="button"
            className="chip"
            aria-pressed={stufe === s}
            onClick={() => setze(s)}
          >
            {t(`roentgentrainer.stufe.${s ?? "gemischt"}`)}
          </button>
        ))}
      </fieldset>
      <p className="hinweis">{t(`stufen.text.${art}`)}</p>
    </div>
  );
}

/**
 * Fällige LAP-Aufgaben der Planbilanz-Übung als eigene Runde (Punkt B4 des Nebenchats); ohne
 * fällige Aufgaben steht nichts da.
 */
function LapWiederholung({
  stellungen,
  kennung,
  auswahl,
}: {
  stellungen: readonly Buchstellung[];
  kennung: TrainerKennung;
  /** Die Auswahl der Übungsarten; sie steht nur da, solange keine Wiederholung läuft. */
  auswahl: React.ReactNode;
}) {
  const faellig = useFaelligeAufgaben("planbilanz");
  const vorhanden = useMemo(() => lapaufgabenAus(stellungen, faellig), [stellungen, faellig]);
  const [laeuft, setzeLaeuft] = useState(false);
  // Während der Wiederholung keine Auswahl darunter: Ein Tipp dort brach die Runde sonst ohne
  // Rückfrage ab (Prüfung beim Übernehmen, 31.10.2026).
  if (!laeuft)
    return (
      <>
        <Wiederholungsknopf anzahl={vorhanden.length} starte={() => setzeLaeuft(true)} />
        {auswahl}
      </>
    );
  return (
    <Rundenablauf
      kennung={kennung}
      erzeuge={() =>
        vorhanden.slice(0, ANZAHL.lap).map((a) => (r) => <Lapaufgabe aufgabe={a} runde={r} />)
      }
      nochmal={() => setzeLaeuft(false)}
      zurAuswahl={() => setzeLaeuft(false)}
    />
  );
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
    <ul className="uebungsarten" data-tour="trainer-wahl">
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
  const [stufe, setzeStufe] = useState<Trainerstufe | null>(null);
  const [durchlauf, setzeDurchlauf] = useState(0);
  if (arten.length === 0) return <p className="hinweis">{t("training.folgt")}</p>;
  if (art === null) {
    const auswahl = <Auswahl arten={arten} waehle={setzeArt} />;
    return kennung === "planbilanz" ? (
      <LapWiederholung stellungen={stellungen} kennung={kennung} auswahl={auswahl} />
    ) : (
      auswahl
    );
  }
  return (
    <>
      {hatStufen(art) && <Stufenzeile art={art} stufe={stufe} setze={setzeStufe} />}
      <Rundenablauf
        key={`${art}-${stufe}-${durchlauf}`}
        kennung={kennung}
        erzeuge={() => erzeuge(art, stellungen, stufe)}
        nochmal={() => setzeDurchlauf(durchlauf + 1)}
        zurAuswahl={einzige ? null : () => setzeArt(null)}
      />
    </>
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
  abweichung: () => <AbweichungBereich />,
  dreissigMinuten: () => <DreissigMinutenBereich />,
  roentgen: () => <RoentgenBereich />,
  zaehlen: () => <ZaehlBereich />,
  kurzplaene: () => <KurzplanBereich />,
};

/**
 * Der Bildschirm eines Trainers: Übungsart und Einstellungen wählen und eine Runde Aufgaben
 * spielen. Mit Thema geöffnet, stellt er es den Bereichen bereit (ui/trainer/trainerthema.ts).
 */
export function Trainer({
  kennung,
  thema = null,
}: {
  kennung: TrainerKennung;
  thema?: string | null;
}) {
  const eigener = EIGENE_BEREICHE[kennung];
  return (
    <TrainerthemaKontext value={thema}>
      <div className="bildschirm bildschirm-trainer" data-testid="trainer">
        <Kopfzeile titel={t(`trainer.${kennung}.name`)} zurueckText={t("trainer.zurueck")} />
        <p className="hinweis trainer-ablauf" data-tour="trainer-ablauf">
          {t(`trainer.${kennung}.ablauf`)}
        </p>
        {eigener ? eigener() : <MitBuchstellungen kennung={kennung} />}
      </div>
    </TrainerthemaKontext>
  );
}
