/**
 * Geführter Moment als Ink-Dialog über dem Brett (Atmosphäre T11): Mrs. Okafor bietet einen
 * Bauern an, Ambrose drängt zum Turmopfer (Roman Kapitel 15).
 *
 * Rolle im Gesamtbild: Teil der Spielhülle (anbindung/Momentzeile.tsx zeigt ihn, wenn ein Moment
 * `dialog` statt `text` trägt). Solange der Dialog offen ist, steht die Uhr des Helden; das Brett
 * liegt darunter und nimmt keine Züge an. Der Dialog führt keinen Zug aus. Seine Variablen kommen
 * in den Spielstand wie in der Oberwelt (regeln/dialogvariablen.ts). Externe Funktionen der
 * Oberwelt (Karten schenken, Reisen, Läden) wirken hier nicht; ein Aufruf wird gemeldet.
 * Abhängigkeiten: dialog/Dialog.tsx, dialog/dialogdatei.ts, anbindung/dienste.ts.
 */
import { useEffect, useState } from "react";
import { Dialog } from "../dialog/Dialog";
import type { Dialogvariablen, Wirkungen } from "../dialog/geschichte";
import { ladeDialog } from "../dialog/dialogdatei";
import { variablenAusBesitz, variablenNachDialog } from "../regeln/dialogvariablen";
import { schreibeDialogvariablen, useAbenteuerstand } from "./dienste";

/** Meldet eine Oberwelt-Wirkung, die in der Partie nichts tut. */
function nichtInDerPartie(name: string): () => void {
  return () => console.warn(`Partiemoment: ${name} wirkt nur in der Oberwelt`);
}

/** Wirkungen in der Partie: keine; die Geschichte darf sie trotzdem aufrufen. */
const WIRKUNGEN_IN_DER_PARTIE: Wirkungen = {
  gibKarte: nichtInDerPartie("gibKarte"),
  setzeSzene: nichtInDerPartie("setzeSzene"),
  beginnePartie: nichtInDerPartie("beginnePartie"),
  beginneAufgaben: nichtInDerPartie("beginneAufgaben"),
  setzeZustand: nichtInDerPartie("setzeZustand"),
  schalteSteckbrief: nichtInDerPartie("schalteSteckbrief"),
  oeffneLaden: nichtInDerPartie("oeffneLaden"),
  gibFund: nichtInDerPartie("gibFund"),
  reise: nichtInDerPartie("reise"),
  beginneGedaechtnis: nichtInDerPartie("beginneGedaechtnis"),
  zeigeVorfuehrung: nichtInDerPartie("zeigeVorfuehrung"),
  beginneSimultan: nichtInDerPartie("beginneSimultan"),
  zahle: nichtInDerPartie("zahle"),
  setzeToenung: nichtInDerPartie("setzeToenung"),
};

/**
 * Der Dialog eines Moments. Eingaben: Verweis „datei.knoten“, Uhr anhalten, Ende melden.
 * Sonderfälle: Fehlt die Dialogdatei oder der Spielstand, endet der Moment sofort (mit Meldung
 * im Protokoll); die Partie geht weiter.
 */
export function Momentdialog({
  verweis,
  halteUhr,
  beiEnde,
  zusatz,
}: {
  readonly verweis: string;
  readonly halteUhr: (an: boolean) => void;
  readonly beiEnde: () => void;
  /** Zusätzliche Variablen nur für diesen Dialog (zugerratenTurm im Halbfinale). */
  readonly zusatz?: Dialogvariablen;
}) {
  const stand = useAbenteuerstand();
  const [datei, knoten] = verweis.split(".", 2);
  const [json, setzeJson] = useState<string | null>(null);
  // Variablen beim Öffnen: Was die Hülle währenddessen setzt, überschreibt Ink nicht.
  const [vorher] = useState<Dialogvariablen>(() => stand?.dialogvariablen ?? {});
  useEffect(() => {
    let aktiv = true;
    halteUhr(true);
    ladeDialog(datei ?? "")
      .then((geladen) => {
        if (aktiv) setzeJson(JSON.stringify(geladen));
      })
      .catch((fehler: unknown) => {
        console.warn(`Partiemoment: Dialog ${verweis} fehlt`, fehler);
        if (aktiv) beiEnde();
      });
    return () => {
      aktiv = false;
      halteUhr(false);
    };
    // Einmal je Moment; die Rückrufe der Hülle wechseln mit jedem Takt der Uhr.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verweis]);
  if (!stand || !json || !knoten) return null;
  const ende = (variablen: Dialogvariablen) => {
    void schreibeDialogvariablen(
      variablenNachDialog(vorher, stand.dialogvariablen, variablen),
    ).then((gespeichert) => {
      if (!gespeichert) console.warn(`Partiemoment: Variablen aus ${verweis} nicht gespeichert`);
    });
    beiEnde();
  };
  return (
    <div className="abenteuer-momentdialog" data-testid="abenteuer-momentdialog">
      <Dialog
        json={json}
        knoten={knoten}
        wirkungen={WIRKUNGEN_IN_DER_PARTIE}
        variablen={{ ...stand.dialogvariablen, ...variablenAusBesitz(stand), ...zusatz }}
        heldname={stand.held.name}
        beiKnoten={() => undefined}
        beiEnde={ende}
      />
    </div>
  );
}
