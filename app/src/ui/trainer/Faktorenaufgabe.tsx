/**
 * Aufgabe des Faktorenbilanz-Trainers: je Faktor sagen, wer vorn liegt (Kapitel 3).
 *
 * Rolle im Gesamtbild: Trainer „faktorenbilanz“ (AP 13). Der Leser stellt die Waage für
 * Material und Zeit und vergleicht Königssicherheit und Aktivität (Weiß, gleich, Schwarz); nach
 * „Prüfen“ steht je Faktor die Antwort daneben (aus der Faktorenbilanz des Buches, wenn die
 * Abbildung eine hat, W9), darunter die Bilanz mit denselben Sätzen wie das Werkzeug
 * „Faktorenbilanz“ (k3-faktorenbilanz.ts) und die Warum-Fragen der Abbildung (AP 14).
 * Abhängigkeiten: training/faktorentrainer.ts, analyse/k3-faktorenbilanz.ts, Trainerbrett.
 */
import { useMemo, useState } from "react";
import { faktorenbilanz } from "../../analyse/k3-faktorenbilanz";
import { t } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import {
  ANTWORTEN,
  FAKTOREN,
  falscheFaktoren,
  type Faktor,
  type Faktorantwort,
  type Faktorenaufgabe as Aufgabe,
  type Vorn,
} from "../../training/faktorentrainer";
import { WarumFragenListe } from "../komponenten/WarumFrage";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";
import { Wahlzeile } from "./Wahlzeile";
import { useSammelstellung } from "./sammelstellung";

type Entwurf = Partial<Record<Faktor, Vorn>>;

function vollstaendig(e: Entwurf): Faktorantwort | null {
  return e.material && e.zeit && e.koenig && e.aktivitaet
    ? { material: e.material, zeit: e.zeit, koenig: e.koenig, aktivitaet: e.aktivitaet }
    : null;
}

/** Die Bilanz der App, wie im Werkzeug „Faktorenbilanz“ (Weiß links). */
function Bilanz({ fen }: { fen: string }) {
  const ergebnis = useMemo(() => {
    const gelesen = stellungAusFen(fen);
    return gelesen.ok ? faktorenbilanz(gelesen.wert, "white") : null;
  }, [fen]);
  if (!ergebnis) return null;
  return (
    <section className="karte" data-testid="faktoren-bilanz">
      {ergebnis.befunde.map((b) => (
        <div key={b.kennung}>
          <h3 className="karte-titel">{b.titel}</h3>
          {b.zeilen.map((z) => (
            <p key={z}>{z}</p>
          ))}
        </div>
      ))}
      <p>{ergebnis.fazit}</p>
    </section>
  );
}

export function Faktorenaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  useSammelstellung(aufgabe.fen);
  const [entwurf, setzeEntwurf] = useState<Entwurf>({});
  const beantwortet = runde.ergebnis !== null;
  const antwort = vollstaendig(entwurf);
  return (
    <>
      <p>{t("faktorentrainer.auftrag")}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      {FAKTOREN.map((faktor) => (
        <Wahlzeile
          key={faktor}
          titel={t(`faktoren.name.${faktor}`)}
          werte={ANTWORTEN}
          name={(w) => t(`faktorentrainer.vorn.${w}`)}
          wert={entwurf[faktor]}
          setze={(w) => setzeEntwurf({ ...entwurf, [faktor]: w })}
          app={beantwortet ? aufgabe.loesung[faktor] : null}
          quelle={aufgabe.quelle}
        />
      ))}
      {!beantwortet && (
        <button
          type="button"
          className="knopf-haupt"
          disabled={antwort === null}
          onClick={() =>
            antwort && runde.beantworte(falscheFaktoren(aufgabe, antwort).length === 0)
          }
        >
          {t("trainer.pruefen")}
        </button>
      )}
      {beantwortet && <Antwortmeldung richtig={runde.ergebnis === true} />}
      {beantwortet && (
        <p className="hinweis" data-testid="faktoren-quelle">
          {t(`faktorentrainer.quelle.${aufgabe.quelle}`, { nummer: aufgabe.nummer })}
        </p>
      )}
      {beantwortet && <Bilanz fen={aufgabe.fen} />}
      {beantwortet && <WarumFragenListe vorbereitet={aufgabe.vorbereitet} />}
    </>
  );
}
