/**
 * Aufgabe des Faktorenbilanz-Trainers: je Faktor sagen, wer vorn liegt (Kapitel 3).
 *
 * Rolle im Gesamtbild: Trainer „faktorenbilanz“ (AP 13). Der Leser stellt die Waage für
 * Material und Zeit und gibt Königssicherheit und Aktivität je Seite ✓ ◐ ✗ wie die Tabelle im
 * Buch (Faktorwahl.tsx); nach „Prüfen“ steht je Faktor die Antwort daneben (aus der
 * Faktorenbilanz des Buches, wenn die Abbildung eine hat, W9), darunter die Bilanz mit denselben
 * Sätzen wie das Werkzeug „Faktorenbilanz“ (k3-faktorenbilanz.ts) und die Warum-Fragen der
 * Abbildung (AP 14).
 * Abhängigkeiten: training/faktorentrainer.ts, analyse/k3-faktorenbilanz.ts, Faktorwahl.tsx,
 * Trainerbrett.
 */
import { useMemo, useState } from "react";
import { faktorenbilanz } from "../../analyse/k3-faktorenbilanz";
import { t } from "../../i18n/sprache";
import { stellungAusFen } from "../../schach/stellung";
import {
  falscheFaktoren,
  vergleiche,
  type Faktorantwort,
  type Faktorenaufgabe as Aufgabe,
  type Vorn,
} from "../../training/faktorentrainer";
import { WarumFragenListe } from "../komponenten/abbildung/WarumFrage";
import { Seitenwahl, Waagenwahl, type Seitenwertung } from "./Faktorwahl";
import { faktorenVorn } from "../../training/prinzipVsEngine";
import { EngineEinschaetzung } from "./EngineEinschaetzung";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";
import { useSammelstellung } from "./sammelstellung";

/** Die Eingabe: Waagen für Material und Zeit, ✓ ◐ ✗ je Seite für König und Aktivität. */
interface Entwurf {
  readonly material?: Vorn;
  readonly zeit?: Vorn;
  readonly koenig: Seitenwertung;
  readonly aktivitaet: Seitenwertung;
}

const LEER: Entwurf = { koenig: {}, aktivitaet: {} };

/** Wer nach den Zeichen beider Seiten vorn liegt; undefined, solange eine Seite fehlt. */
function vornAus(wertung: Seitenwertung): Vorn | undefined {
  return wertung.white && wertung.black ? vergleiche(wertung.white, wertung.black) : undefined;
}

function vollstaendig(e: Entwurf): Faktorantwort | null {
  const koenig = vornAus(e.koenig);
  const aktivitaet = vornAus(e.aktivitaet);
  return e.material && e.zeit && koenig && aktivitaet
    ? { material: e.material, zeit: e.zeit, koenig, aktivitaet }
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

/**
 * Eine Aufgabe des Faktorenbilanz-Trainers (Kapitel 3): je Faktor einschätzen, wer vorn liegt, und
 * mit der Bilanz vergleichen.
 */
export function Faktorenaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  useSammelstellung(aufgabe.fen);
  const [entwurf, setzeEntwurf] = useState<Entwurf>(LEER);
  const beantwortet = runde.ergebnis !== null;
  const antwort = vollstaendig(entwurf);
  return (
    <>
      <p>{t("faktorentrainer.auftrag")}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      {(["material", "zeit"] as const).map((faktor) => (
        <Waagenwahl
          key={faktor}
          titel={t(`faktoren.name.${faktor}`)}
          wert={entwurf[faktor]}
          setze={(w) => setzeEntwurf({ ...entwurf, [faktor]: w })}
          loesung={beantwortet ? aufgabe.loesung[faktor] : null}
          quelle={aufgabe.quelle}
        />
      ))}
      {(["koenig", "aktivitaet"] as const).map((faktor) => (
        <Seitenwahl
          key={faktor}
          titel={t(`faktoren.name.${faktor}`)}
          wert={entwurf[faktor]}
          setze={(w) => setzeEntwurf({ ...entwurf, [faktor]: w })}
          vorn={vornAus(entwurf[faktor])}
          loesung={beantwortet ? aufgabe.loesung[faktor] : null}
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
      {beantwortet && (
        <EngineEinschaetzung
          fen={aufgabe.fen}
          gedreht={false}
          bilanz={faktorenVorn(Object.values(aufgabe.loesung))}
        />
      )}
      {beantwortet && <WarumFragenListe vorbereitet={aufgabe.vorbereitet} />}
    </>
  );
}
