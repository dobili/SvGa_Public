/**
 * Aufgaben des Zähltrainers: Bilanz zählen und hängende Figuren finden (Kapitel 1).
 *
 * Rolle im Gesamtbild: Trainer „zaehlen“ (AP 13). Nach der Antwort zeigt die App ihre Rechnung
 * mit denselben Pfeilen und demselben Satz wie das Werkzeug „Zählen“ (k1-zaehlen.ts).
 * Abhängigkeiten: training/zaehltrainer.ts, analyse/k1-zaehlen.ts, Trainerbrett, Rundenrahmen.
 */
import { useMemo, useState } from "react";
import { zaehle } from "../../analyse/k1-zaehlen";
import type { Markierung } from "../../analyse/werkzeug";
import { t } from "../../i18n/sprache";
import { feldAusName, stellungAusFen } from "../../schach/stellung";
import {
  HOECHSTE_ANZAHL,
  HOECHSTE_BILANZ,
  pruefeFelder,
  pruefeZaehlantwort,
  type Haengeaufgabe,
  type Zaehlaufgabe,
} from "../../training/zaehltrainer";
import { abgleichsfelder, umschalten } from "./abgleich";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";

const ANZAHLEN = Array.from({ length: HOECHSTE_ANZAHL }, (_, i) => i + 1);
const BILANZEN = Array.from({ length: HOECHSTE_BILANZ + 1 }, (_, i) => i);

/** Eine Reihe Auswahlknöpfe für eine Zahl. */
function Zahlwahl({
  titel,
  werte,
  wert,
  setze,
  text = String,
}: {
  titel: string;
  werte: readonly number[];
  wert: number | null;
  setze: (wert: number) => void;
  text?: (wert: number) => string;
}) {
  return (
    <fieldset className="zahlwahl">
      <legend>{titel}</legend>
      {werte.map((w) => (
        <button
          key={w}
          type="button"
          className="chip"
          aria-pressed={wert === w}
          onClick={() => setze(w)}
        >
          {text(w)}
        </button>
      ))}
    </fieldset>
  );
}

/** Die Rechnung der App (wie das Werkzeug „Zählen“). */
function Rechnung({ fen, feld }: { fen: string; feld: string }) {
  const ergebnis = useMemo(() => {
    const gelesen = stellungAusFen(fen);
    const ziel = feldAusName(feld);
    return gelesen.ok && ziel !== null ? zaehle(gelesen.wert, ziel) : null;
  }, [fen, feld]);
  if (!ergebnis) return null;
  return (
    <section className="karte" data-testid="zaehl-rechnung">
      {ergebnis.befunde.map((b) => (
        <p key={b.kennung}>
          <strong>{b.titel}:</strong> {b.zeilen.join(", ")}
        </p>
      ))}
      <p>{ergebnis.fazit}</p>
    </section>
  );
}

/** Pfeile der Rechnung, sobald die Antwort steht. */
function rechnungspfeile(fen: string, feld: string): Markierung[] {
  const gelesen = stellungAusFen(fen);
  const ziel = feldAusName(feld);
  return gelesen.ok && ziel !== null ? zaehle(gelesen.wert, ziel).markierungen.slice() : [];
}

/** Aufgabe „Bilanz zählen“: Angreifer, Verteidiger, Gewinn beim Schlagen. */
export function Zaehlaufgabe({ aufgabe, runde }: { aufgabe: Zaehlaufgabe; runde: Runde }) {
  const [angreifer, setzeAngreifer] = useState<number | null>(null);
  const [verteidiger, setzeVerteidiger] = useState<number | null>(null);
  const [bilanz, setzeBilanz] = useState<number | null>(null);
  const beantwortet = runde.ergebnis !== null;
  const markierungen: Markierung[] = beantwortet
    ? rechnungspfeile(aufgabe.fen, aufgabe.feld)
    : [{ typ: "feld", farbe: "rot", feld: aufgabe.feld }];
  const pruefe = () => {
    if (angreifer === null || verteidiger === null || bilanz === null) return;
    runde.beantworte(pruefeZaehlantwort(aufgabe, { angreifer, verteidiger, bilanz }).richtig);
  };
  return (
    <>
      <p>{t("zaehltrainer.auftrag", { feld: aufgabe.feld })}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        markierungen={markierungen}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      <Zahlwahl
        titel={t("zaehltrainer.angreifer")}
        werte={ANZAHLEN}
        wert={angreifer}
        setze={setzeAngreifer}
      />
      <Zahlwahl
        titel={t("zaehltrainer.verteidiger")}
        werte={ANZAHLEN}
        wert={verteidiger}
        setze={setzeVerteidiger}
      />
      <Zahlwahl
        titel={t("zaehltrainer.bilanz")}
        werte={BILANZEN}
        wert={bilanz}
        setze={setzeBilanz}
        text={(w) => (w === 0 ? t("zaehltrainer.lohntNicht") : `+${w}`)}
      />
      {!beantwortet && (
        <button
          type="button"
          className="knopf-haupt"
          disabled={angreifer === null || verteidiger === null || bilanz === null}
          onClick={pruefe}
        >
          {t("trainer.pruefen")}
        </button>
      )}
      {beantwortet && <Antwortmeldung richtig={runde.ergebnis === true} />}
      {beantwortet && <Rechnung fen={aufgabe.fen} feld={aufgabe.feld} />}
    </>
  );
}

/** Aufgabe „hängende Figuren finden“: alle Figuren beider Seiten antippen, die hängen. */
export function Haengeaufgabe({ aufgabe, runde }: { aufgabe: Haengeaufgabe; runde: Runde }) {
  const [getippt, setzeGetippt] = useState<readonly string[]>([]);
  const vergleich = pruefeFelder(aufgabe.haengend, getippt);
  const beantwortet = runde.ergebnis !== null;
  const markierungen: Markierung[] = beantwortet
    ? abgleichsfelder(vergleich)
    : getippt.map((feld) => ({ typ: "feld", farbe: "gold", feld }));
  const beiFeld = (feld: string) => {
    if (!beantwortet) setzeGetippt(umschalten(getippt, feld));
  };
  return (
    <>
      <p>{t("zaehltrainer.haengenAuftrag")}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        markierungen={markierungen}
        beiFeld={beiFeld}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      {!beantwortet && (
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => runde.beantworte(vergleich.richtig)}
        >
          {getippt.length === 0 ? t("zaehltrainer.keineHaengt") : t("trainer.pruefen")}
        </button>
      )}
      {beantwortet && (
        <Antwortmeldung richtig={vergleich.richtig}>
          {aufgabe.haengend.length === 0
            ? t("zaehltrainer.keineHing")
            : t("zaehltrainer.haengend", { felder: aufgabe.haengend.join(", ") })}
        </Antwortmeldung>
      )}
      {beantwortet && <p className="hinweis">{t("trainer.legendeFelder")}</p>}
    </>
  );
}
