/**
 * Rahmen einer Trainingsrunde: Stand oben, Aufgabe in der Mitte, „Weiter“ nach der Antwort,
 * am Ende Ergebnis mit Zeit und „Noch eine Runde“.
 *
 * Rolle im Gesamtbild: Gemeinsame Hülle aller Trainer (AP 13). Die Aufgaben selbst stehen in den
 * Komponenten der einzelnen Trainer; sie bekommen die Runde und melden ihr Ergebnis.
 * Seit 0.2.93 steht nach der Antwort „In die Lernsammlung“ für die Stellung, die die Aufgabe
 * über sammelstellung.ts meldet.
 * Abhängigkeiten: useRunde.ts, sammelstellung.ts, SammelFormular, i18n.
 */
import { useState } from "react";
import { t } from "../../i18n/sprache";
import type { TrainerKennung } from "../../training/trainer";
import { Fortschrittsbalken } from "../komponenten/Fortschrittsbalken";
import { SammelKnopf } from "../komponenten/SammelFormular";
import { SammelstellungKontext } from "./sammelstellung";
import type { Runde } from "./useRunde";

/** Rückmeldung zu einer Antwort, grün oder rot. */
export function Antwortmeldung({ richtig, children }: { richtig: boolean; children?: string }) {
  return (
    <p className={`meldung ${richtig ? "gut" : "schlecht"}`} role="status">
      {richtig ? t("trainer.richtig") : t("trainer.falsch")}
      {children ? ` ${children}` : ""}
    </p>
  );
}

function Ende({
  runde,
  nochmal,
  zurAuswahl,
}: {
  runde: Runde;
  nochmal: () => void;
  zurAuswahl: (() => void) | null;
}) {
  return (
    <section className="karte" data-testid="runde-ende">
      <h2 className="karte-titel">{t("trainer.rundeFertig")}</h2>
      <p>{t("trainer.ergebnis", { richtig: runde.richtig, anzahl: runde.anzahl })}</p>
      {runde.sekunden !== null && <p>{t("trainer.zeit", { sekunden: runde.sekunden })}</p>}
      <div className="knopfzeile">
        <button type="button" className="knopf-haupt" onClick={nochmal}>
          {t("trainer.nochmal")}
        </button>
        {zurAuswahl && (
          <button type="button" className="knopf-zweit" onClick={zurAuswahl}>
            {t("trainer.zurAuswahl")}
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * Die Hülle einer Runde.
 *
 * Eingaben: Kennung des Trainers (Fundstelle in der Lernsammlung), Runde, die aktuelle Aufgabe
 * als Kinder, „Noch eine Runde“ und „Zur Auswahl“ (null, wenn der Trainer nur eine Übungsart hat).
 */
export function Rundenrahmen({
  kennung,
  runde,
  nochmal,
  zurAuswahl,
  children,
}: {
  kennung: TrainerKennung;
  runde: Runde;
  nochmal: () => void;
  zurAuswahl: (() => void) | null;
  children: React.ReactNode;
}) {
  const [stellung, setzeStellung] = useState<string | null>(null);
  if (runde.fertig) return <Ende runde={runde} nochmal={nochmal} zurAuswahl={zurAuswahl} />;
  return (
    <div className="trainerrunde" data-testid="trainerrunde">
      <p className="hinweis" aria-live="polite">
        {t("trainer.stand", {
          nummer: runde.index + 1,
          anzahl: runde.anzahl,
          richtig: runde.richtig,
        })}
      </p>
      {/* Wie weit die Runde ist, auf einen Blick (DS6); der Satz darüber bleibt für Vorleser. */}
      <Fortschrittsbalken
        anteil={{ erreicht: runde.index, gesamt: runde.anzahl }}
        beschriftung={t("trainer.rundenfortschritt")}
      />
      <SammelstellungKontext value={setzeStellung}>{children}</SammelstellungKontext>
      {runde.ergebnis !== null && stellung && (
        <SammelKnopf
          key={`${runde.index} ${stellung}`}
          fen={stellung}
          herkunft={{ herkunft: "trainer", quelle: kennung }}
        />
      )}
      {runde.ergebnis !== null && (
        <div className="knopfzeile">
          <button type="button" className="knopf-haupt" onClick={runde.weiter}>
            {runde.index + 1 < runde.anzahl ? t("trainer.weiter") : t("trainer.auswerten")}
          </button>
        </div>
      )}
    </div>
  );
}
