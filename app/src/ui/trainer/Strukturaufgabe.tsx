/**
 * Eine Aufgabe des Strukturerkenners: im Skelett die schwachen Bauern antippen, dann den Plan
 * wählen.
 *
 * Rolle im Gesamtbild: Trainer „struktur“ (Pflichtenheft 7: „Nur das Skelett ist sichtbar. Du
 * beantwortest die Leitfragen durch Antippen … und wählst den passenden Plan-Satz.“). Das Brett
 * zeigt nur Bauern und Könige (Skelett-Röntgen, Kapitel 5). Richtig zählt die Aufgabe, wenn
 * beide Schritte stimmen.
 * Abhängigkeiten: training/strukturtrainer.ts, schach/weiterspielen.ts (Skelett), Trainerbrett.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import type { Strukturaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { skelettFen } from "../../schach/weiterspielen";
import { planwahl, schwacheBauern, type Plan } from "../../training/strukturtrainer";
import { pruefeFelder } from "../../training/zaehltrainer";
import { ZUFALL } from "../../training/zufall";
import { abgleichsfelder, umschalten } from "./abgleich";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";

/** Schritt 1: schwache Bauern antippen und prüfen. */
function SchwacheBauern({
  aufgabe,
  geprueft,
  pruefe,
}: {
  aufgabe: Aufgabe;
  geprueft: ReturnType<typeof pruefeFelder> | null;
  pruefe: (vergleich: ReturnType<typeof pruefeFelder>) => void;
}) {
  const [getippt, setzeGetippt] = useState<readonly string[]>([]);
  const erwartet = schwacheBauern(aufgabe);
  const markierungen: Markierung[] = geprueft
    ? abgleichsfelder(geprueft)
    : getippt.map((feld) => ({ typ: "feld", farbe: "gold", feld }));
  return (
    <>
      <p>{t("strukturtrainer.schritt1")}</p>
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
      {geprueft && (
        <Antwortmeldung richtig={geprueft.richtig}>
          {erwartet.length > 0
            ? t("strukturtrainer.schwache", { felder: erwartet.join(", ") })
            : t("strukturtrainer.keineSchwachen")}
        </Antwortmeldung>
      )}
    </>
  );
}

/** Schritt 2: den passenden Plan-Satz wählen. */
function Planwahl({
  aufgabe,
  runde,
  schritt1,
}: {
  aufgabe: Aufgabe;
  runde: Runde;
  schritt1: boolean;
}) {
  const [plaene] = useState(() => planwahl(aufgabe, ZUFALL));
  const [gewaehlt, setzeGewaehlt] = useState<Plan | null>(null);
  const farbe = t(aufgabe.seite === "w" ? "farbe.w" : "farbe.b");
  const waehle = (plan: Plan) => {
    if (gewaehlt) return;
    setzeGewaehlt(plan);
    runde.beantworte(schritt1 && plan === aufgabe.plan);
  };
  return (
    <div className="knopfreihe" role="group" aria-label={t("strukturtrainer.schritt2", { farbe })}>
      <p>{t("strukturtrainer.schritt2", { farbe })}</p>
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
  const [geprueft, setzeGeprueft] = useState<ReturnType<typeof pruefeFelder> | null>(null);
  return (
    <>
      <SchwacheBauern aufgabe={aufgabe} geprueft={geprueft} pruefe={setzeGeprueft} />
      {geprueft && <Planwahl aufgabe={aufgabe} runde={runde} schritt1={geprueft.richtig} />}
      <p className="hinweis">
        {aufgabe.herkunft.quelle === "buch"
          ? t("strukturtrainer.ausBuch", { nummer: aufgabe.herkunft.abbildung })
          : t("taktiktrainer.ausLichess", { wertung: aufgabe.herkunft.wertung })}{" "}
        · {t("taktiktrainer.stufe", { stufe: aufgabe.schwierigkeit })}
      </p>
    </>
  );
}
