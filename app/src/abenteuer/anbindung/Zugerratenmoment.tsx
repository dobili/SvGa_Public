/**
 * Der geführte Moment vor dem Zugerraten (Halbfinale, Story-Bibel 34.3): Der Dialog öffnet erst,
 * wenn der Held am Zug ist und die Engine den gesuchten Zug kennt. Dann steht die Ink-Variable
 * zugerratenTurm (true, wenn der gesuchte Zug ein Turmzug ist), und der Text kann verzweigen.
 *
 * Rolle im Gesamtbild: anbindung/Momentzeile.tsx zeigt diesen Moment statt des einfachen
 * Momentdialogs, wenn der Moment `zugerraten` trägt. Der Moment spricht nach dem Zug des Helden;
 * die Stellung zum Raten entsteht aber erst mit der Antwort des Gegners. Solange gerechnet wird,
 * hält anbindung/useZugerraten.ts die Uhr des Helden schon an.
 * Abhängigkeiten: anbindung/Momentdialog.tsx, anbindung/useZugerraten.ts, regeln/zugerraten.ts.
 */
import { useEffect, useState } from "react";
import { leserAmZug, type Partie } from "../../spiel/partie";
import type { Partiesteuerung } from "../../ui/komponenten/partie/usePartie";
import { istTurmzug } from "../regeln/zugerraten";
import { Momentdialog } from "./Momentdialog";
import { gesuchterZug } from "./useZugerraten";

export function Zugerratenmoment({
  verweis,
  s,
  partie,
  beiEnde,
}: {
  readonly verweis: string;
  readonly s: Partiesteuerung;
  readonly partie: Partie;
  readonly beiEnde: () => void;
}) {
  const bereit = leserAmZug(partie) && !s.engineDenkt && !partie.ende;
  const [turm, setzeTurm] = useState<{ fen: string; turm: boolean } | null>(null);
  const fen = s.fen;
  useEffect(() => {
    if (!bereit) return;
    let aktiv = true;
    void gesuchterZug(fen).then((zug) => {
      if (aktiv) setzeTurm({ fen, turm: zug !== null && istTurmzug(fen, zug) });
    });
    return () => {
      aktiv = false;
    };
  }, [bereit, fen]);
  if (!bereit || turm?.fen !== fen) return null;
  return (
    <Momentdialog
      verweis={verweis}
      halteUhr={s.halteUhr}
      beiEnde={beiEnde}
      zusatz={{ zugerratenTurm: turm.turm }}
    />
  );
}
