/**
 * Eine Trainingsrunde: Aufgaben einmal erzeugen, dann der Reihe nach im Rundenrahmen zeigen.
 *
 * Rolle im Gesamtbild: Gemeinsam für alle Trainer (AP 13). Wer die Aufgaben erzeugt, liefert je
 * Aufgabe eine Darstellung, die die Runde bekommt und ihr Ergebnis meldet.
 * Abhängigkeiten: Rundenrahmen.tsx, useRunde.ts, i18n.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import type { TrainerKennung } from "../../training/trainer";
import { Rundenrahmen } from "./Rundenrahmen";
import { useRunde, type Runde } from "./useRunde";

/** Eine Aufgabe, gleich welcher Art, mit ihrer Darstellung. */
export type Darstellung = (runde: Runde) => React.ReactNode;

/**
 * Eine Trainingsrunde, gemeinsam für alle Trainer: erzeugt die Aufgaben einmal und zeigt sie der
 * Reihe nach.
 */
export function Rundenablauf({
  kennung,
  erzeuge,
  nochmal,
  zurAuswahl,
}: {
  kennung: TrainerKennung;
  erzeuge: () => Darstellung[];
  nochmal: () => void;
  zurAuswahl: (() => void) | null;
}) {
  const [aufgaben] = useState(erzeuge);
  const runde = useRunde(kennung, aufgaben.length);
  const aktuelle = aufgaben[runde.index];
  if (!aktuelle) return <p className="hinweis">{t("trainer.keineAufgaben")}</p>;
  return (
    <Rundenrahmen kennung={kennung} runde={runde} nochmal={nochmal} zurAuswahl={zurAuswahl}>
      <div key={runde.index} className="trainer-aufgabe">
        {aktuelle(runde)}
      </div>
    </Rundenrahmen>
  );
}
