/**
 * „Taktik auf Zeit“ und „Tagesaufgabe“ der Kurzpläne.
 *
 * Rolle im Gesamtbild: Teil des Trainers „kurzplaene“ (KurzplanBereich.tsx). Die Zeitrunde zeigt
 * 3 Minuten lang leichte Taktikaufgaben und endet nach drei Fehlern (freiwillig, angelehnt an
 * die Zeitaufgaben bei chess.com und Lichess). Die Tagesaufgabe ist eine Aufgabe pro Tag; die
 * Serie zählt die Tage in Folge, an denen sie bearbeitet wurde. Beides nutzt die Aufgaben des
 * Taktiktrainers (Taktikaufgabe.tsx) und geht erst am Ende als Durchgang in den Fortschritt.
 * Abhängigkeiten: training/kurzplaene.ts, training/taktiktrainer.ts, useFreieRunde.ts,
 * speicher/fortschritt.ts, app/merker.ts, i18n.
 */
import { useEffect, useRef, useState } from "react";
import { liesMerker, schreibeMerker } from "../../app/merker";
import { ladeTaktik, type Taktikaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { zaehleAktivitaet } from "../../speicher/aktivitaet";
import { notiereDurchgang } from "../../speicher/fortschritt";
import { aendere } from "../../speicher/speicher";
import {
  geltendeSerie,
  serieAus,
  serieNach,
  seriePausiert,
  tagesaufgabe,
  zeitrundeRestSekunden,
  zeitrundeVorbei,
  ZEITRUNDE_AUFGABEN,
  ZEITRUNDE_FEHLER,
} from "../../training/kurzplaene";
import { taktikrunde } from "../../training/taktiktrainer";
import { ZUFALL } from "../../training/zufall";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Taktikaufgabe } from "./Taktikaufgabe";
import { useJetzt } from "./usePlanstand";
import { useFreieRunde } from "./useFreieRunde";

const MERKER_SERIE = "tagesserie";
const MERKER_BESTE_ZEITRUNDE = "taktikzeitBeste";
const LEICHTESTE_STUFE = 1;
const ZWEITLEICHTESTE_STUFE = 2;
const SEKUNDEN_JE_MINUTE = 60;

/** Sekunden als „2:05“. */
function minutenText(sekunden: number): string {
  const sek = String(sekunden % SEKUNDEN_JE_MINUTE).padStart(2, "0");
  return `${Math.floor(sekunden / SEKUNDEN_JE_MINUTE)}:${sek}`;
}

/** Eine laufende Aufgabe mit „Weiter“, sobald sie beantwortet ist. */
function Lauf({
  aufgaben,
  runde,
  beiWeiter,
}: {
  aufgaben: readonly Aufgabe[];
  runde: ReturnType<typeof useFreieRunde>["runde"];
  beiWeiter: () => void;
}) {
  const aufgabe = aufgaben[runde.index];
  if (!aufgabe) return <p className="hinweis">{t("trainer.keineAufgaben")}</p>;
  return (
    <div key={`${runde.index}-${runde.versuch}`} className="trainer-aufgabe">
      <Taktikaufgabe aufgabe={aufgabe} runde={runde} motivAbfragen={false} />
      {runde.ergebnis !== null && (
        <button type="button" className="knopf-haupt" onClick={beiWeiter}>
          {t("trainer.weiter")}
        </button>
      )}
    </div>
  );
}

/** Die laufende Zeitrunde: Restzeit, Fehler, Aufgaben; endet von selbst. */
function Zeitrunde({
  aufgaben,
  beiEnde,
}: {
  aufgaben: readonly Aufgabe[];
  beiEnde: (richtig: number, falsch: number) => void;
}) {
  const [beginn] = useState(() => Date.now());
  const jetzt = useJetzt(true);
  const { runde, richtig, falsch } = useFreieRunde(aufgaben.length);
  const vorbei = zeitrundeVorbei(beginn, jetzt, falsch) || runde.index >= aufgaben.length;
  const gemeldet = useRef(false);
  useEffect(() => {
    if (!vorbei || gemeldet.current) return;
    gemeldet.current = true;
    beiEnde(richtig, falsch);
  }, [vorbei, richtig, falsch, beiEnde]);
  return (
    <div className="trainerrunde" data-testid="zeitrunde">
      <p className="planzeit" role="timer">
        {t("kurzplan.zeitRest", { zeit: minutenText(zeitrundeRestSekunden(beginn, jetzt)) })}
      </p>
      <p className="hinweis" aria-live="polite">
        {t("kurzplan.zeitStand", { richtig, falsch, erlaubt: ZEITRUNDE_FEHLER })}
      </p>
      {!vorbei && <Lauf aufgaben={aufgaben} runde={runde} beiWeiter={runde.weiter} />}
    </div>
  );
}

/** „Taktik auf Zeit“: Start, Runde, Ergebnis mit bester Runde. */
export function TaktikAufZeit({ zurueck }: { zurueck: () => void }) {
  const daten = useDaten(ladeTaktik, "trainer-taktik");
  const [lauf, setzeLauf] = useState(0);
  const [aufgaben, setzeAufgaben] = useState<readonly Aufgabe[] | null>(null);
  const [ergebnis, setzeErgebnis] = useState<{ richtig: number; falsch: number } | null>(null);
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const starte = () => {
    const wahl = { thema: "gemischt", stufe: LEICHTESTE_STUFE } as const;
    setzeErgebnis(null);
    setzeAufgaben(taktikrunde(daten.wert.aufgaben, wahl, ZEITRUNDE_AUFGABEN, ZUFALL));
    setzeLauf(lauf + 1);
  };
  const beiEnde = (richtig: number, falsch: number) => {
    const beste = Number(liesMerker(MERKER_BESTE_ZEITRUNDE) ?? 0);
    if (richtig > beste) schreibeMerker(MERKER_BESTE_ZEITRUNDE, String(richtig));
    setzeErgebnis({ richtig, falsch });
    setzeAufgaben(null);
    if (richtig + falsch === 0) return;
    void aendere((d) =>
      notiereDurchgang(d, "kurzplaene", { aufgaben: richtig + falsch, richtig }, new Date()),
    );
  };
  if (aufgaben) return <Zeitrunde key={lauf} aufgaben={aufgaben} beiEnde={beiEnde} />;
  const beste = Number(liesMerker(MERKER_BESTE_ZEITRUNDE) ?? 0);
  return (
    <div className="trainerrunde trainerwahl" data-testid="zeit-start">
      <p>{t("kurzplan.zeitText", { fehler: ZEITRUNDE_FEHLER })}</p>
      {ergebnis && (
        <p className="meldung" data-testid="zeit-ergebnis">
          {t("kurzplan.zeitErgebnis", { richtig: ergebnis.richtig, falsch: ergebnis.falsch })}
        </p>
      )}
      {beste > 0 && <p className="hinweis">{t("kurzplan.zeitBeste", { anzahl: beste })}</p>}
      <button type="button" className="knopf-haupt" onClick={starte}>
        <Knopfsymbol art="starten" />
        {t(ergebnis ? "kurzplan.zeitNochmal" : "kurzplan.zeitStarten")}
      </button>
      <button type="button" className="knopf-link" onClick={zurueck}>
        {t("kurzplan.zurueck")}
      </button>
    </div>
  );
}

/** Die Tagesaufgabe: eine Aufgabe pro Tag, danach zählt die Serie. */
export function Tagesaufgabe({ zurueck }: { zurueck: () => void }) {
  const daten = useDaten(ladeTaktik, "trainer-taktik");
  const { runde } = useFreieRunde(1);
  const [serie, setzeSerie] = useState(() => serieAus(liesMerker(MERKER_SERIE)));
  const heute = new Date();
  const fertig = runde.ergebnis !== null;
  // Die erste Antwort schließt die Aufgabe ab: Serie eintragen und als Durchgang zählen.
  const abschluss = (richtig: boolean) => {
    const neu = serieNach(serieAus(liesMerker(MERKER_SERIE)), new Date());
    schreibeMerker(MERKER_SERIE, JSON.stringify(neu));
    setzeSerie(neu);
    void aendere((d) =>
      zaehleAktivitaet(
        notiereDurchgang(d, "kurzplaene", { aufgaben: 1, richtig: richtig ? 1 : 0 }, new Date()),
        "tagesaufgabe",
        1,
        new Date(),
      ),
    );
  };
  const mitAbschluss = {
    ...runde,
    beantworte: (richtig: boolean) => {
      if (runde.ergebnis === null) abschluss(richtig);
      runde.beantworte(richtig);
    },
  };
  if (daten.art === "laedt") return <p className="lade">…</p>;
  if (daten.art === "fehler")
    return <p className="fehlertext">{t("buch.ladefehler", { fehler: daten.meldung })}</p>;
  const leichte = daten.wert.aufgaben.filter((a) => a.schwierigkeit <= ZWEITLEICHTESTE_STUFE);
  const aufgabe = tagesaufgabe(leichte, heute);
  return (
    <div className="trainerrunde" data-testid="tagesaufgabe">
      <p className="hinweis" data-testid="serie">
        {t(seriePausiert(serie, heute) ? "kurzplan.seriePause" : "kurzplan.serie", {
          anzahl: geltendeSerie(serie),
        })}
      </p>
      {aufgabe ? (
        <Taktikaufgabe aufgabe={aufgabe} runde={mitAbschluss} motivAbfragen={false} />
      ) : (
        <p className="hinweis">{t("trainer.keineAufgaben")}</p>
      )}
      {fertig && <p className="meldung">{t("kurzplan.tagFertig")}</p>}
      <button type="button" className="knopf-link" onClick={zurueck}>
        {t("kurzplan.zurueck")}
      </button>
    </div>
  );
}
