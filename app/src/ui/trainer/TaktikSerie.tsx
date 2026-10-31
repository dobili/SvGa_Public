/**
 * Serienmodus „ohne Fehler“ im Taktiktrainer (Gamifizierung P5): Aufgaben steigender Schwierigkeit
 * ohne Uhr, der erste Fehler beendet die Serie, Ergebnis „12 in Folge“.
 *
 * Rolle im Gesamtbild: Ein Modus neben der Runde in TaktikBereich.tsx (Startknopf „Serie ohne
 * Fehler“). Die Reihenfolge und das Ende rechnet training/taktikserie.ts. Jede Antwort geht wie in
 * der Runde über Taktikaufgabe.tsx (antworteMitKarte) ins Antwortprotokoll je Thema und in die
 * Wiederholungskarten; am Ende zählt die Serie als Durchgang des Trainers „taktik“ im
 * Tagesprotokoll (notiereDurchgang) und meldet ihren Wert als Rekord „taktikSerie“ (Quelle
 * „serie“), wie die Zeitrunde in ZeitrundeBereich.tsx. Ein neuer Rekord erscheint als Meldung.
 * Abhängigkeiten: training/taktikserie.ts, Taktikaufgabe.tsx, useFreieRunde.ts,
 * speicher/fortschritt.ts, ui/komponenten/rekorde/, i18n.
 */
import { useEffect, useRef, useState } from "react";
import type { Taktikaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { t, tZahl } from "../../i18n/sprache";
import { notiereDurchgang } from "../../speicher/fortschritt";
import { useSpeicher } from "../../speicher/speicher";
import type { Verbesserung } from "../../training/rekorde";
import {
  QUELLE_SERIE,
  REKORD_TAKTIKSERIE,
  serienende,
  type Serienende,
} from "../../training/taktikserie";
import { Knopfsymbol } from "../komponenten/bausteine/Knopfsymbol";
import { NeueRekorde } from "../komponenten/rekorde/NeueRekorde";
import { aendereMitRekorden } from "../komponenten/rekorde/useRekordpruefung";
import { Taktikaufgabe } from "./Taktikaufgabe";
import { useFreieRunde } from "./useFreieRunde";

/** Eine beendete Serie: Grund und Zahl der gelösten Aufgaben. */
interface Ergebnis {
  readonly ende: Exclude<Serienende, null>;
  readonly richtig: number;
}

/**
 * Am Ende: Durchgang ins Tagesprotokoll, Wert als Rekord prüfen. Ohne Antwort zählt nichts.
 * Beispiel: 12 richtig, dann ein Fehler → Durchgang 13 Aufgaben, 12 richtig; Rekord 12.
 */
function meldeSerie(richtig: number, falsch: number): Promise<readonly Verbesserung[]> {
  if (richtig + falsch === 0) return Promise.resolve([]);
  const durchgang = { aufgaben: richtig + falsch, richtig };
  return aendereMitRekorden((d, jetzt) => notiereDurchgang(d, "taktik", durchgang, jetzt), {
    quelle: QUELLE_SERIE,
    wert: richtig,
  });
}

/** Ergebnis der Serie mit Rekordmeldung, bestem Wert und den Knöpfen danach. */
function Serienergebnis({
  ergebnis,
  neue,
  nochmal,
  zurAuswahl,
}: {
  ergebnis: Ergebnis;
  neue: readonly Verbesserung[];
  nochmal: () => void;
  zurAuswahl: () => void;
}) {
  const beste = useSpeicher((z) => z.daten.rekorde[REKORD_TAKTIKSERIE]?.wert ?? 0);
  return (
    <div className="trainer-ende" data-testid="serie-ergebnis">
      <p className="meldung">{t(`serie.ende.${ergebnis.ende}`)}</p>
      <p className="meldung" data-testid="serie-zahl">
        {tZahl("serie.ergebnis", ergebnis.richtig, { anzahl: ergebnis.richtig })}
      </p>
      <NeueRekorde neue={neue} />
      {beste > 0 && <p className="hinweis">{tZahl("serie.beste", beste, { anzahl: beste })}</p>}
      <div className="knopfzeile">
        <button type="button" className="knopf-haupt" onClick={nochmal}>
          <Knopfsymbol art="starten" />
          {t("serie.nochmal")}
        </button>
        <button type="button" className="knopf-zweit" onClick={zurAuswahl}>
          {t("trainer.zurAuswahl")}
        </button>
      </div>
    </div>
  );
}

/** Eine laufende Serie; meldet sich genau einmal, sobald sie vorbei ist. */
function Serienlauf({
  erzeuge,
  nochmal,
  zurAuswahl,
}: {
  erzeuge: () => readonly Aufgabe[];
  nochmal: () => void;
  zurAuswahl: () => void;
}) {
  const [aufgaben] = useState(erzeuge);
  const { runde, richtig, falsch } = useFreieRunde(aufgaben.length);
  const [aufgehoert, setzeAufgehoert] = useState(false);
  const [neue, setzeNeue] = useState<readonly Verbesserung[]>([]);
  const ende = serienende({
    richtig,
    falsch,
    index: runde.index,
    anzahl: aufgaben.length,
    aufgehoert,
  });
  const gemeldet = useRef(false);
  useEffect(() => {
    if (ende === null || gemeldet.current) return;
    gemeldet.current = true;
    void meldeSerie(richtig, falsch).then(setzeNeue);
  }, [ende, richtig, falsch]);
  const aufgabe = aufgaben[runde.index];
  if (aufgaben.length === 0) return <p className="hinweis">{t("trainer.keineAufgaben")}</p>;
  return (
    <div className="trainerrunde" data-testid="taktik-serie">
      <p className="hinweis" aria-live="polite" data-testid="serie-stand">
        {tZahl("serie.stand", richtig, { anzahl: richtig })}
      </p>
      {aufgabe && ende !== "aufgehoert" && (
        <div key={`${runde.index}-${runde.versuch}`} className="trainer-aufgabe">
          <Taktikaufgabe aufgabe={aufgabe} runde={runde} motivAbfragen={false} />
        </div>
      )}
      {ende === null && runde.ergebnis === true && (
        <button type="button" className="knopf-haupt" onClick={runde.weiter}>
          {t("trainer.weiter")}
        </button>
      )}
      {ende === null && richtig > 0 && (
        <button type="button" className="knopf-link" onClick={() => setzeAufgehoert(true)}>
          {t("serie.aufhoeren")}
        </button>
      )}
      {ende !== null && (
        <Serienergebnis
          ergebnis={{ ende, richtig }}
          neue={neue}
          nochmal={nochmal}
          zurAuswahl={zurAuswahl}
        />
      )}
    </div>
  );
}

/**
 * Der Serienmodus: jede neue Serie mischt neu (Schlüssel `lauf`).
 * Eingaben: `erzeuge` liefert die Aufgaben einer Serie (training/taktikserie.ts, serienaufgaben),
 * `zurAuswahl` führt zurück zur Wahl von Thema und Modus.
 */
export function TaktikSerie({
  erzeuge,
  zurAuswahl,
}: {
  erzeuge: () => readonly Aufgabe[];
  zurAuswahl: () => void;
}) {
  const [lauf, setzeLauf] = useState(0);
  return (
    <Serienlauf
      key={lauf}
      erzeuge={erzeuge}
      nochmal={() => setzeLauf(lauf + 1)}
      zurAuswahl={zurAuswahl}
    />
  );
}
