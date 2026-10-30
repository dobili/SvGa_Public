/**
 * Eine Aufgabe des Strukturerkenners: in der echten Stellung die starken Felder antippen
 * (Leitfrage 1, W5), dann die schwachen Bauern, eine Feldart benennen, dann den Plan wählen.
 *
 * Rolle im Gesamtbild: Trainer „struktur“ (Pflichtenheft 7). Das Brett zeigt die echte Stellung
 * (P4, R49); ein Knopf blendet alles außer Bauern und Königen aus (Skelett-Röntgen, Kapitel 5).
 * Richtig zählt die Aufgabe, wenn alle Schritte stimmen. Hat die Seite am Zug mehr als vier
 * starke Felder (Lehrbilder mit wenigen Bauern), entfällt der erste Schritt; ohne Feld einer der
 * fünf Arten entfällt die Feldart-Frage.
 * Abhängigkeiten: training/strukturtrainer.ts, schach/weiterspielen.ts (Skelett), Trainerbrett.
 */
import { useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import type { Strukturaufgabe as Aufgabe } from "../../daten/trainerdaten";
import { t } from "../../i18n/sprache";
import { skelettFen } from "../../schach/weiterspielen";
import {
  feldartfrage,
  planwahl,
  schwacheBauern,
  starkeFelderMitArt,
  type Feldart,
  type Feldartfrage,
  type Plan,
} from "../../training/strukturtrainer";
import { pruefeFelder } from "../../training/zaehltrainer";
import { ZUFALL } from "../../training/zufall";
import { abgleichsfelder, umschalten } from "./abgleich";
import { antworteMitKarte } from "./kartenantwort";
import { bauernbegruendungen } from "../../training/strukturbegruendung";
import { Antwortmeldung } from "./Rundenrahmen";
import { Trainerbrett } from "./Trainerbrett";
import type { Runde } from "./useRunde";
import { useSammelstellung } from "./sammelstellung";

type Vergleich = ReturnType<typeof pruefeFelder>;

/** Das Brett der Aufgabe: echte Stellung oder Skelett, mit dem Umschaltknopf darunter. */
function Aufgabenbrett({
  aufgabe,
  skelett,
  schalte,
  markierungen,
  beiFeld,
}: {
  aufgabe: Aufgabe;
  skelett: boolean;
  schalte: () => void;
  markierungen: readonly Markierung[];
  beiFeld?: (feld: string) => void;
}) {
  return (
    <>
      <Trainerbrett
        fen={skelett ? skelettFen(aufgabe.fen) : aufgabe.fen}
        markierungen={markierungen}
        gedreht={aufgabe.seite === "b"}
        {...(beiFeld ? { beiFeld } : {})}
        beschriftung={t("trainer.struktur.name")}
      />
      <button type="button" className="knopf-link" aria-pressed={skelett} onClick={schalte}>
        {t(skelett ? "strukturtrainer.alleFiguren" : "strukturtrainer.skelett")}
      </button>
    </>
  );
}

/** Ein Schritt mit Antippen: Auftrag, Brett, Prüfen, Meldung mit den erwarteten Feldern. */
function Tippschritt({
  aufgabe,
  auftrag,
  erwartet,
  meldung,
  geprueft,
  pruefe,
  skelett,
  schalte,
  begruendung,
}: {
  aufgabe: Aufgabe;
  auftrag: string;
  erwartet: readonly string[];
  meldung: string;
  geprueft: Vergleich | null;
  pruefe: (vergleich: Vergleich) => void;
  skelett: boolean;
  schalte: () => void;
  /** Sätze zu den übersehenen und zu viel getippten Feldern (Regel L, Nebenchat). */
  begruendung?: (vergleich: Vergleich) => readonly string[];
}) {
  const [getippt, setzeGetippt] = useState<readonly string[]>([]);
  const markierungen: Markierung[] = geprueft
    ? abgleichsfelder(geprueft)
    : getippt.map((feld) => ({ typ: "feld", farbe: "gold", feld }));
  return (
    <>
      <p>{auftrag}</p>
      <Aufgabenbrett
        aufgabe={aufgabe}
        skelett={skelett}
        schalte={schalte}
        markierungen={markierungen}
        {...(geprueft
          ? {}
          : { beiFeld: (feld: string) => setzeGetippt(umschalten(getippt, feld)) })}
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
      {geprueft && begruendung && <Begruendungsliste saetze={begruendung(geprueft)} />}
    </>
  );
}

/** Die Begründungen nach dem Prüfen, je Satz ein Absatz; leer, wenn alles stimmte. */
function Begruendungsliste({ saetze }: { saetze: readonly string[] }) {
  if (saetze.length === 0) return null;
  return (
    <section className="karte" data-testid="struktur-begruendung">
      {saetze.map((satz) => (
        <p key={satz}>{satz}</p>
      ))}
    </section>
  );
}

/** Schritt Feldart: das goldene Feld benennen (Loch, schwaches Feld, starkes Feld, Vorposten, rückständiger Bauer). */
function Feldartschritt({
  aufgabe,
  frage,
  auftrag,
  skelett,
  schalte,
  fertig,
}: {
  aufgabe: Aufgabe;
  frage: Feldartfrage;
  auftrag: string;
  skelett: boolean;
  schalte: () => void;
  fertig: (richtig: boolean) => void;
}) {
  const [gewaehlt, setzeGewaehlt] = useState<Feldart | null>(null);
  const waehle = (art: Feldart) => {
    if (gewaehlt) return;
    setzeGewaehlt(art);
    fertig(art === frage.richtig);
  };
  return (
    <>
      <p>{auftrag}</p>
      <Aufgabenbrett
        aufgabe={aufgabe}
        skelett={skelett}
        schalte={schalte}
        markierungen={[{ typ: "feld", farbe: "gold", feld: frage.feld }]}
      />
      <div className="knopfreihe" role="group" aria-label={auftrag}>
        {frage.optionen.map((art) => (
          <button
            key={art}
            type="button"
            className="knopf-zweit"
            aria-pressed={gewaehlt === art}
            disabled={gewaehlt !== null}
            onClick={() => waehle(art)}
          >
            {t(`strukturtrainer.feldart.${art}`)}
          </button>
        ))}
      </div>
      {gewaehlt && (
        <Antwortmeldung richtig={gewaehlt === frage.richtig}>
          {t("strukturtrainer.feldartErgebnis", {
            feld: frage.feld,
            art: t(`strukturtrainer.feldart.${frage.richtig}`),
            warum: t(`strukturtrainer.feldartWarum.${frage.richtig}`),
          })}
        </Antwortmeldung>
      )}
    </>
  );
}

/** Die Meldung nach dem Prüfen der starken Felder: Vorposten gekennzeichnet, oder „keine“. */
function felderMeldung(felder: readonly { feld: string; vorposten: boolean }[]): string {
  if (felder.length === 0) return t("strukturtrainer.keine.felder");
  const text = felder
    .map((f) => (f.vorposten ? t("strukturtrainer.vorpostenKurz", { feld: f.feld }) : f.feld))
    .join(", ");
  return t("strukturtrainer.ergebnis.felder", { felder: text });
}

/** Schritt Plan: den passenden Plan-Satz wählen. */
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
    antworteMitKarte(runde, "struktur", aufgabe.id, vorher && plan === aufgabe.plan);
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

/**
 * Eine Aufgabe des Strukturerkenners: starke Felder und schwache Bauern antippen, eine Feldart
 * benennen und den Plan wählen.
 */
export function Strukturaufgabe({ aufgabe, runde }: { aufgabe: Aufgabe; runde: Runde }) {
  useSammelstellung(aufgabe.fen);
  const [felder] = useState(() => starkeFelderMitArt(aufgabe));
  const [frage] = useState(() => feldartfrage(aufgabe, ZUFALL));
  const [skelett, setzeSkelett] = useState(false);
  const [vergleichFelder, setzeVergleichFelder] = useState<Vergleich | null>(null);
  const [vergleichBauern, setzeVergleichBauern] = useState<Vergleich | null>(null);
  const [feldartRichtig, setzeFeldartRichtig] = useState<boolean | null>(null);
  const schalte = () => setzeSkelett(!skelett);
  const bauern = schwacheBauern(aufgabe);
  const gesamt = 2 + (felder ? 1 : 0) + (frage ? 1 : 0);
  const schrittBauern = felder ? 2 : 1;
  const schrittFeldart = schrittBauern + 1;
  const bauernDran = felder === null || vergleichFelder !== null;
  const feldartDran = vergleichBauern !== null && frage !== null;
  const planDran = vergleichBauern !== null && (frage === null || feldartRichtig !== null);
  const vorher =
    (vergleichFelder?.richtig ?? true) &&
    (vergleichBauern?.richtig ?? false) &&
    (feldartRichtig ?? true);
  const schritt = (nummer: number) => t("strukturtrainer.schritt", { nummer, gesamt });
  return (
    <>
      {felder && (
        <Tippschritt
          aufgabe={aufgabe}
          auftrag={`${schritt(1)} ${t("strukturtrainer.auftrag.felder")}`}
          erwartet={felder.map((f) => f.feld)}
          meldung={felderMeldung(felder)}
          geprueft={vergleichFelder}
          pruefe={setzeVergleichFelder}
          skelett={skelett}
          schalte={schalte}
        />
      )}
      {bauernDran && (
        <Tippschritt
          aufgabe={aufgabe}
          auftrag={`${schritt(schrittBauern)} ${t("strukturtrainer.auftrag.bauern")}`}
          erwartet={bauern}
          meldung={
            bauern.length > 0
              ? t("strukturtrainer.ergebnis.bauern", { felder: bauern.join(", ") })
              : t("strukturtrainer.keine.bauern")
          }
          geprueft={vergleichBauern}
          pruefe={setzeVergleichBauern}
          skelett={skelett}
          schalte={schalte}
          begruendung={(v) => bauernbegruendungen(aufgabe, v.fehlend, v.falsch)}
        />
      )}
      {feldartDran && frage && (
        <Feldartschritt
          aufgabe={aufgabe}
          frage={frage}
          auftrag={`${schritt(schrittFeldart)} ${t("strukturtrainer.auftrag.feldart")}`}
          skelett={skelett}
          schalte={schalte}
          fertig={setzeFeldartRichtig}
        />
      )}
      {planDran && (
        <Planwahl aufgabe={aufgabe} runde={runde} vorher={vorher} auftrag={schritt(gesamt)} />
      )}
      <p className="hinweis">
        {aufgabe.herkunft.quelle === "buch"
          ? t(aufgabe.herkunft.beispiel ? "strukturtrainer.ausPartie" : "strukturtrainer.ausBuch", {
              nummer: aufgabe.herkunft.abbildung,
            })
          : t("taktiktrainer.ausLichess", { wertung: aufgabe.herkunft.wertung })}{" "}
        · {t("taktiktrainer.stufe", { stufe: aufgabe.schwierigkeit })}
      </p>
    </>
  );
}
