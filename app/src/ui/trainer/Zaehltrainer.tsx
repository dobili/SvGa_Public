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

/** Mindestens ein Angreifer und ein Verteidiger, sonst gäbe es nichts zu zählen. */
const KLEINSTE_ANZAHL = 1;

/**
 * Zahl mit „−“ und „+“ statt einer Reihe Knöpfe (Wunsch des Autors, 19.10.2026: eine Reihe
 * Zahlenknöpfe wirkte unruhig). Vor der ersten Eingabe steht „–“; der erste Tipp auf „+“ setzt
 * den kleinsten Wert.
 */
function Zahlwahl({
  titel,
  von,
  bis,
  wert,
  setze,
  text = String,
}: {
  titel: string;
  von: number;
  bis: number;
  wert: number | null;
  setze: (wert: number) => void;
  text?: (wert: number) => string;
}) {
  return (
    <fieldset className="zahlschritt">
      <legend>{titel}</legend>
      <button
        type="button"
        className="chip"
        aria-label={t("zahlschritt.weniger", { titel })}
        disabled={wert === null || wert <= von}
        onClick={() => wert !== null && setze(wert - 1)}
      >
        −
      </button>
      <output className="zahlschritt-wert" aria-live="polite">
        {wert === null ? "–" : text(wert)}
      </output>
      <button
        type="button"
        className="chip"
        aria-label={t("zahlschritt.mehr", { titel })}
        disabled={wert !== null && wert >= bis}
        onClick={() => setze(wert === null ? von : wert + 1)}
      >
        +
      </button>
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
        von={KLEINSTE_ANZAHL}
        bis={HOECHSTE_ANZAHL}
        wert={angreifer}
        setze={setzeAngreifer}
      />
      <Zahlwahl
        titel={t("zaehltrainer.verteidiger")}
        von={KLEINSTE_ANZAHL}
        bis={HOECHSTE_ANZAHL}
        wert={verteidiger}
        setze={setzeVerteidiger}
      />
      <Zahlwahl
        titel={t("zaehltrainer.bilanz")}
        von={0}
        bis={HOECHSTE_BILANZ}
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
