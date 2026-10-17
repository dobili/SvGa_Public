/**
 * Eine Aufgabe des Strukturerkenners: im Skelett die starken Felder antippen (Leitfrage 1, W5),
 * dann die schwachen Bauern, dann den Plan wählen.
 *
 * Rolle im Gesamtbild: Trainer „struktur“ (Pflichtenheft 7: „Nur das Skelett ist sichtbar. Du
 * beantwortest die Leitfragen durch Antippen … und wählst den passenden Plan-Satz.“). Das Brett
 * zeigt nur Bauern und Könige (Skelett-Röntgen, Kapitel 5). Richtig zählt die Aufgabe, wenn
 * alle Schritte stimmen. Hat die Seite am Zug mehr als vier starke Felder (Lehrbilder mit wenigen
 * Bauern), entfällt der erste Schritt.
 * Abhängigkeiten: training/strukturtrainer.ts, schach/weiterspielen.ts (Skelett), Trainerbrett.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import type { Strukturaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { skelettFen } from "../../schach/weiterspielen";
import { planwahl, schwacheBauern, starkeFelder, type Plan } from "../../training/strukturtrainer";
import { pruefeFelder } from "../../training/zaehltrainer";
import { ZUFALL } from "../../training/zufall";
import { abgleichsfelder, umschalten } from "./abgleich";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";

type Vergleich = ReturnType<typeof pruefeFelder>;

/** Ein Schritt mit Antippen: Auftrag, Skelett, Prüfen, Meldung mit den erwarteten Feldern. */
function Tippschritt({
  aufgabe,
  auftrag,
  erwartet,
  meldung,
  geprueft,
  pruefe,
}: {
  aufgabe: Aufgabe;
  auftrag: string;
  erwartet: readonly string[];
  meldung: string;
  geprueft: Vergleich | null;
  pruefe: (vergleich: Vergleich) => void;
}) {
  const [getippt, setzeGetippt] = useState<readonly string[]>([]);
  const markierungen: Markierung[] = geprueft
    ? abgleichsfelder(geprueft)
    : getippt.map((feld) => ({ typ: "feld", farbe: "gold", feld }));
  return (
    <>
      <p>{auftrag}</p>
      <Trainerbrett
        fen={skelettFen(aufgabe.fen)}
        markierungen={markierungen}
        gedreht={aufgabe.seite === "b"}
        {...(geprueft
          ? {}
          : { beiFeld: (feld: string) => setzeGetippt(umschalten(getippt, feld)) })}
        beschriftung={t("trainer.struktur.name")}
      />
      {!geprueft && (
        <button
          type="button"
          className="knopf-haupt"
          onClick={() => pruefe(pruefeFelder(erwartet, getippt))}
        >
          {t("trainer.pruefen")}
        </button>
      )}
      {geprueft && <Antwortmeldung richtig={geprueft.richtig}>{meldung}</Antwortmeldung>}
    </>
  );
}

/** Der Auftrag eines Schrittes mit seiner Nummer („Schritt 1 von 3: …“). */
function auftragstext(schluessel: "felder" | "bauern", nummer: number, gesamt: number): string {
  return t(`strukturtrainer.auftrag.${schluessel}`, { nummer, gesamt });
}

/** Die Meldung nach dem Prüfen: die erwarteten Felder oder „keine“. */
function meldungstext(schluessel: "felder" | "bauern", erwartet: readonly string[]): string {
  return erwartet.length > 0
    ? t(`strukturtrainer.ergebnis.${schluessel}`, { felder: erwartet.join(", ") })
    : t(`strukturtrainer.keine.${schluessel}`);
}

/** Schritt 2: den passenden Plan-Satz wählen. */
function Planwahl({
  aufgabe,
  runde,
  vorher,
  auftrag,
}: {
  aufgabe: Aufgabe;
  runde: Runde;
  vorher: boolean;
  auftrag: string;
}) {
  const [plaene] = useState(() => planwahl(aufgabe, ZUFALL));
  const [gewaehlt, setzeGewaehlt] = useState<Plan | null>(null);
  const farbe = t(aufgabe.seite === "w" ? "farbe.w" : "farbe.b");
  const waehle = (plan: Plan) => {
    if (gewaehlt) return;
    setzeGewaehlt(plan);
    runde.beantworte(vorher && plan === aufgabe.plan);
  };
  const text = `${auftrag} ${t("strukturtrainer.planFrage", { farbe })}`;
  return (
    <div className="knopfreihe" role="group" aria-label={text}>
      <p>{text}</p>
      {plaene.map((plan) => (
        <button
          key={plan}
          type="button"
          className="knopf-zweit plan-satz"
          aria-pressed={gewaehlt === plan}
          disabled={gewaehlt !== null}
          onClick={() => waehle(plan)}
        >
          {t(`struktur.plan.${plan}`)}
        </button>
      ))}
      {gewaehlt && (
        <Antwortmeldung richtig={gewaehlt === aufgabe.plan}>
          {t("strukturtrainer.struktur", {
            struktur: t(`struktur.art.${aufgabe.struktur}`),
            plan: t(`struktur.plan.${aufgabe.plan}`),
          })}
        </Antwortmeldung>
      )}
    </div>
  );
}

export function Strukturaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  const [felder] = useState(() => starkeFelder(aufgabe));
  const [vergleichFelder, setzeVergleichFelder] = useState<Vergleich | null>(null);
  const [vergleichBauern, setzeVergleichBauern] = useState<Vergleich | null>(null);
  const gesamt = felder ? 3 : 2;
  const bauern = schwacheBauern(aufgabe);
  const bauernDran = felder === null || vergleichFelder !== null;
  const vorher = (vergleichFelder?.richtig ?? true) && (vergleichBauern?.richtig ?? false);
  return (
    <>
      {felder && (
        <Tippschritt
          aufgabe={aufgabe}
          auftrag={auftragstext("felder", 1, gesamt)}
          erwartet={felder}
          meldung={meldungstext("felder", felder)}
          geprueft={vergleichFelder}
          pruefe={setzeVergleichFelder}
        />
      )}
      {bauernDran && (
        <Tippschritt
          aufgabe={aufgabe}
          auftrag={auftragstext("bauern", gesamt - 1, gesamt)}
          erwartet={bauern}
          meldung={meldungstext("bauern", bauern)}
          geprueft={vergleichBauern}
          pruefe={setzeVergleichBauern}
        />
      )}
      {vergleichBauern && (
        <Planwahl
          aufgabe={aufgabe}
          runde={runde}
          vorher={vorher}
          auftrag={t("strukturtrainer.schrittPlan", { nummer: gesamt, gesamt })}
        />
      )}
      <p className="hinweis">
        {aufgabe.herkunft.quelle === "buch"
          ? t("strukturtrainer.ausBuch", { nummer: aufgabe.herkunft.abbildung })
          : t("taktiktrainer.ausLichess", { wertung: aufgabe.herkunft.wertung })}{" "}
        · {t("taktiktrainer.stufe", { stufe: aufgabe.schwierigkeit })}
      </p>
    </>
  );
}
