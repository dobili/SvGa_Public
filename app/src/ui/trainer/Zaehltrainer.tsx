/**
 * Aufgaben des Zähltrainers: Bilanz zählen und hängende Figuren finden (Kapitel 1).
 *
 * Rolle im Gesamtbild: Trainer „zaehlen“ (AP 13). Nach der Antwort zeigt die App ihre Rechnung
 * mit denselben Pfeilen und demselben Satz wie das Werkzeug „Zählen“ (k1-zaehlen.ts). Seit dem
 * Nebenchat (30.10.2026): Ergebnis mit einem Tipp, genaues Zählen umschaltbar, bei hängenden
 * Figuren zu jedem übersehenen oder falsch getippten Feld die Begründung.
 * Abhängigkeiten: training/zaehltrainer.ts, analyse/k1-zaehlen.ts, Trainerbrett, Rundenrahmen.
 */
import { useMemo, useState } from "react";
import { zaehle } from "../../analyse/k1-zaehlen";
import { figurenname } from "../../analyse/texte";
import type { Markierung } from "../../analyse/werkzeug";
import { t } from "../../i18n/sprache";
import { feldAusName, stellungAusFen } from "../../schach/stellung";
import {
  HOECHSTE_ANZAHL,
  HOECHSTE_BILANZ,
  pruefeBilanz,
  pruefeFelder,
  pruefeZaehlantwort,
  type Haengeaufgabe,
  type Zaehlaufgabe,
} from "../../training/zaehltrainer";
import { bilanzkennung, haengekennung } from "../../training/wiederholbar";
import { antworteMitKarte } from "./kartenantwort";
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

/** „lohnt nicht“ oder „+3“: die Bilanz als Text. */
function bilanztext(wert: number): string {
  return wert === 0 ? t("zaehltrainer.lohntNicht") : `+${wert}`;
}

/**
 * Die Ergebnisknöpfe „lohnt nicht“, „+1“ bis „+9“ (Wunsch des Autors, 30.10.2026: schneller
 * eingeben). Im kurzen Modus prüft der Tipp sofort, im genauen Modus wählt er nur aus.
 */
function Ergebniswahl({
  wert,
  setze,
  gesperrt,
}: {
  wert: number | null;
  setze: (wert: number) => void;
  gesperrt: boolean;
}) {
  const werte = Array.from({ length: HOECHSTE_BILANZ + 1 }, (_, i) => i);
  return (
    <fieldset className="ergebniswahl" data-testid="zaehl-ergebnisse">
      <legend>{t("zaehltrainer.bilanz")}</legend>
      {werte.map((w) => (
        <button
          key={w}
          type="button"
          className="chip"
          aria-pressed={wert === w}
          disabled={gesperrt}
          onClick={() => setze(w)}
        >
          {bilanztext(w)}
        </button>
      ))}
    </fieldset>
  );
}

/** Die Zahlen des genauen Modus: Angreifer und Verteidiger. */
function Anzahlen({
  angreifer,
  verteidiger,
  setzeAngreifer,
  setzeVerteidiger,
}: {
  angreifer: number | null;
  verteidiger: number | null;
  setzeAngreifer: (w: number) => void;
  setzeVerteidiger: (w: number) => void;
}) {
  return (
    <>
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
    </>
  );
}

/**
 * Aufgabe „Bilanz zählen“. Kurz (Standard): nur das Ergebnis antippen, die App prüft sofort; wer
 * das Ergebnis trifft, hat richtig gezählt. Genau (umschaltbar): dazu Angreifer und Verteidiger.
 */
export function Zaehlaufgabe({ aufgabe, runde }: { aufgabe: Zaehlaufgabe; runde: Runde }) {
  const [genau, setzeGenau] = useState(false);
  const [angreifer, setzeAngreifer] = useState<number | null>(null);
  const [verteidiger, setzeVerteidiger] = useState<number | null>(null);
  const [bilanz, setzeBilanz] = useState<number | null>(null);
  const beantwortet = runde.ergebnis !== null;
  const markierungen: Markierung[] = beantwortet
    ? rechnungspfeile(aufgabe.fen, aufgabe.feld)
    : [{ typ: "feld", farbe: "rot", feld: aufgabe.feld }];
  const waehle = (wert: number) => {
    setzeBilanz(wert);
    if (!genau)
      antworteMitKarte(runde, "zaehlen", bilanzkennung(aufgabe), pruefeBilanz(aufgabe, wert));
  };
  const pruefeGenau = () => {
    if (angreifer === null || verteidiger === null || bilanz === null) return;
    const richtig = pruefeZaehlantwort(aufgabe, { angreifer, verteidiger, bilanz }).richtig;
    antworteMitKarte(runde, "zaehlen", bilanzkennung(aufgabe), richtig);
  };
  return (
    <>
      <p>{t("zaehltrainer.auftragKurz", { feld: aufgabe.feld })}</p>
      <Trainerbrett
        fen={aufgabe.fen}
        markierungen={markierungen}
        beschriftung={t("trainer.brettAus", { nummer: aufgabe.nummer })}
      />
      {!beantwortet && (
        <button type="button" className="knopf-link" onClick={() => setzeGenau(!genau)}>
          {t(genau ? "zaehltrainer.nurErgebnis" : "zaehltrainer.genauZaehlen")}
        </button>
      )}
      {genau && (
        <Anzahlen
          angreifer={angreifer}
          verteidiger={verteidiger}
          setzeAngreifer={setzeAngreifer}
          setzeVerteidiger={setzeVerteidiger}
        />
      )}
      <Ergebniswahl wert={bilanz} setze={waehle} gesperrt={beantwortet} />
      {genau && !beantwortet && (
        <button
          type="button"
          className="knopf-haupt"
          disabled={angreifer === null || verteidiger === null || bilanz === null}
          onClick={pruefeGenau}
        >
          {t("trainer.pruefen")}
        </button>
      )}
      {beantwortet && (
        <Antwortmeldung richtig={runde.ergebnis === true}>
          {runde.ergebnis !== true && bilanz !== null
            ? t("zaehltrainer.deineAntwort", {
                antwort: bilanztext(bilanz),
                richtig: bilanztext(aufgabe.bilanz),
              })
            : undefined}
        </Antwortmeldung>
      )}
      {beantwortet && <Motivhinweise aufgabe={aufgabe} />}
      {beantwortet && <Rechnung fen={aufgabe.fen} feld={aufgabe.feld} />}
    </>
  );
}

/** Nach der Antwort: die Motive der Aufgabe (Fesselung, Batterie), mit Buchbezug. */
function Motivhinweise({ aufgabe }: { aufgabe: Zaehlaufgabe }) {
  const stellung = useMemo(() => stellungAusFen(aufgabe.fen), [aufgabe.fen]);
  const name = (feld: string): string => {
    const quadrat = feldAusName(feld);
    const figur = quadrat !== null && stellung.ok ? stellung.wert.brett.get(quadrat) : undefined;
    return quadrat !== null && figur ? figurenname({ feld: quadrat, figur }) : feld;
  };
  const namen = aufgabe.gefesselt.map(name);
  return (
    <>
      {namen.length > 0 && (
        <p className="meldung" data-testid="zaehl-fesselung">
          {t("zaehltrainer.fesselung", { figuren: namen.join(", ") })}
        </p>
      )}
      {aufgabe.motive.includes("batterie") && (
        <p className="hinweis">{t("zaehltrainer.batterie")}</p>
      )}
      {aufgabe.abzug.map((p) => (
        <p key={`${p.hinten}-${p.vorn}`} className="hinweis" data-testid="zaehl-abzug">
          {t("zaehltrainer.abzug", { hinten: name(p.hinten), vorn: name(p.vorn) })}
        </p>
      ))}
    </>
  );
}

/** Die Begründung je Feld: der Satz des Werkzeugs „Zählen“ (Regel L: falsch heißt begründet). */
function Begruendungen({
  fen,
  titel,
  felder,
}: {
  fen: string;
  titel: string;
  felder: readonly string[];
}) {
  const saetze = useMemo(() => {
    const gelesen = stellungAusFen(fen);
    if (!gelesen.ok) return [];
    return felder.flatMap((feld) => {
      const ziel = feldAusName(feld);
      return ziel === null
        ? []
        : [t("zaehltrainer.begruendung", { feld, fazit: zaehle(gelesen.wert, ziel).fazit })];
    });
  }, [fen, felder]);
  if (saetze.length === 0) return null;
  return (
    <section className="karte" data-testid="haengen-begruendung">
      <p>
        <strong>{titel}</strong>
      </p>
      {saetze.map((satz) => (
        <p key={satz}>{satz}</p>
      ))}
    </section>
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
      <p>{t("zaehltrainer.haengenAuftragKlar")}</p>
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
          onClick={() =>
            antworteMitKarte(runde, "zaehlen", haengekennung(aufgabe), vergleich.richtig)
          }
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
      {beantwortet && (
        <Begruendungen
          fen={aufgabe.fen}
          titel={t("zaehltrainer.uebersehen")}
          felder={vergleich.fehlend}
        />
      )}
      {beantwortet && (
        <Begruendungen
          fen={aufgabe.fen}
          titel={t("zaehltrainer.haengtNicht")}
          felder={vergleich.falsch}
        />
      )}
      {beantwortet && <p className="hinweis">{t("trainer.legendeFelder")}</p>}
    </>
  );
}
