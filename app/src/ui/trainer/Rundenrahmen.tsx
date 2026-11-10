/**
 * Rahmen einer Trainingsrunde: Stand oben, Aufgabe in der Mitte, „Weiter“ nach der Antwort,
 * am Ende Ergebnis mit Zeit und „Noch eine Runde“.
 *
 * Rolle im Gesamtbild: Gemeinsame Hülle aller Trainer (AP 13). Die Aufgaben selbst stehen in den
 * Komponenten der einzelnen Trainer; sie bekommen die Runde und melden ihr Ergebnis. Nach der
 * Antwort steht „In die Lernsammlung“ für die Stellung, die die Aufgabe über sammelstellung.ts
 * meldet. Neben dem Stand steht die Kombo (Gamifizierung P10, bausteine/Kombo.tsx) für jeden
 * Trainer mit diesem Rahmen. Daneben „Als Variante öffnen“ mit Stellung und, wenn die Aufgabe sie
 * meldet, ihrer Lösung (Variationsbrowser, Stufe 4: erst nach der Antwort, damit die Lösung
 * verborgen bleibt).
 * Abhängigkeiten: useRunde.ts, sammelstellung.ts, SammelFormular, Kombo, VariantenHinweis, i18n.
 */
import { RotateCcw } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import { t } from "../../i18n/sprache";
import type { TrainerKennung } from "../../training/trainer";
import { Fortschrittsbalken } from "../komponenten/bausteine/Fortschrittsbalken";
import { Kombo } from "../komponenten/bausteine/Kombo";
import { SammelKnopf } from "../komponenten/lernsammlung/SammelFormular";
import { AufgabenGabel } from "../komponenten/varianten/VariantenHinweis";
import { ImSpielKontext } from "./imSpiel";
import { SammelstellungKontext, type Loesungslinie } from "./sammelstellung";
import { NACH_DER_RUNDE } from "./nachDerRunde";
import type { Runde } from "./useRunde";

const SYMBOLGROESSE = 16;

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
  kennung,
  runde,
  nochmal,
  zurAuswahl,
}: {
  kennung: TrainerKennung;
  runde: Runde;
  nochmal: () => void;
  zurAuswahl: (() => void) | null;
}) {
  const ergebnis = {
    trainer: kennung,
    richtig: runde.richtig,
    anzahl: runde.anzahl,
    sekunden: runde.sekunden,
  };
  return (
    <section className="karte" data-testid="runde-ende">
      <h2 className="karte-titel">{t("trainer.rundeFertig")}</h2>
      <p>{t("trainer.ergebnis", { richtig: runde.richtig, anzahl: runde.anzahl })}</p>
      {runde.sekunden !== null && <p>{t("trainer.zeit", { sekunden: runde.sekunden })}</p>}
      {/* Gamifizierung G4: Meldungen der Pakete (Rekord, Fundstück …), je eine Zeile in nachDerRunde.ts. */}
      {NACH_DER_RUNDE.map(({ kennung: k, Meldung }) => (
        <Meldung key={k} ergebnis={ergebnis} />
      ))}
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
 * `imSpiel` (Vorgabe aus): Runde des Schach-Abenteuers; dann fehlen Kombo, „In die Lernsammlung“,
 * „Als Variante öffnen“ und „Aufgabe wiederholen“ (docs/spiel/18_Spielhuelle.md, ui/trainer/imSpiel.ts).
 */
export function Rundenrahmen({
  kennung,
  runde,
  nochmal,
  zurAuswahl,
  imSpiel = false,
  children,
}: {
  kennung: TrainerKennung;
  runde: Runde;
  nochmal: () => void;
  zurAuswahl: (() => void) | null;
  imSpiel?: boolean;
  children: React.ReactNode;
}) {
  const [stellung, setzeStellung] = useState<string | null>(null);
  const [linie, setzeLinie] = useState<Loesungslinie | null>(null);
  const melde = useCallback((fen: string, loesung: Loesungslinie | null) => {
    setzeStellung(fen);
    setzeLinie(loesung);
  }, []);
  if (runde.fertig)
    return <Ende kennung={kennung} runde={runde} nochmal={nochmal} zurAuswahl={zurAuswahl} />;
  return (
    <div className="trainerrunde" data-testid="trainerrunde">
      <div className="trainerrunde-kopf">
        <p className="hinweis" aria-live="polite" data-tour="runde-stand">
          {t("trainer.stand", {
            nummer: runde.index + 1,
            anzahl: runde.anzahl,
            richtig: runde.richtig,
          })}
        </p>
        {!imSpiel && <Kombo folge={runde.folge} />}
      </div>
      {/* Wie weit die Runde ist, auf einen Blick (DS6); der Satz darüber bleibt für Vorleser. */}
      <Fortschrittsbalken
        anteil={{ erreicht: runde.index, gesamt: runde.anzahl }}
        beschriftung={t("trainer.rundenfortschritt")}
      />
      {/* Der Schlüssel setzt die Aufgabe bei „Aufgabe wiederholen“ auf den Anfang zurück. */}
      <SammelstellungKontext value={melde}>
        <ImSpielKontext value={imSpiel}>
          <Fragment key={runde.versuch}>{children}</Fragment>
        </ImSpielKontext>
      </SammelstellungKontext>
      {!imSpiel && runde.ergebnis !== null && stellung && (
        <SammelKnopf
          key={`${runde.index} ${stellung}`}
          fen={stellung}
          herkunft={{ herkunft: "trainer", quelle: kennung }}
        />
      )}
      {!imSpiel && runde.ergebnis !== null && stellung && (
        <AufgabenGabel titel={t(`trainer.${kennung}.name`)} fen={stellung} linie={linie} />
      )}
      {runde.ergebnis !== null && (
        <div className="knopfzeile">
          <button type="button" className="knopf-haupt" onClick={runde.weiter}>
            {runde.index + 1 < runde.anzahl ? t("trainer.weiter") : t("trainer.auswerten")}
          </button>
          {!imSpiel && (
            <button type="button" className="knopf-zweit" onClick={runde.wiederhole}>
              <RotateCcw size={SYMBOLGROESSE} aria-hidden="true" />
              {t("trainer.aufgabeWiederholen")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
