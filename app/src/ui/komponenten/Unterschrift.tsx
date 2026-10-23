/**
 * Bildunterschrift einer Abbildung, eins zu eins aus dem Buch, mit fett, kursiv und Verweisen.
 *
 * Rolle im Gesamtbild: Die Unterschrift kommt als Textteile aus der Pipeline (Entscheidung vom
 * 13.10.2026). Verweise auf andere Abbildungen sind antippbar.
 * Absätze und die Zustandszeichen der Bilanzen (✓ ◐ ✗ ⚖) werden ebenfalls dargestellt, weil
 * dieselben Textteile auch in Übungen, Glossar und Bilanzen vorkommen (AP 2).
 * Querverweise im Glossar („begriff“) und Stellen im Buch („stelle“) sind antippbar, wenn der
 * Bildschirm eine Aktion dafür mitgibt (Buchtext).
 * Abhängigkeiten: erzeugte Datentypen, i18n.
 */
import type { Textteil } from "../../daten/laden";
import { sprache, t } from "../../i18n/sprache";
import { buchzugInSprache } from "../../schach/notation";

interface UnterschriftEigenschaften {
  readonly nummer: string;
  readonly teile: readonly Textteil[];
  readonly beiVerweis: (nummer: string) => void;
}

/** Was antippbare Textteile auslösen; fehlt eine Angabe, erscheint der Teil als Text. */
export interface Textaktionen {
  readonly beiVerweis: (nummer: string) => void;
  /** Querverweis im Glossar (Textteil „begriff“). */
  readonly beiBegriff?: (begriff: string) => void;
  /** Stelle im Buch (Textteil „stelle“, Glossaranker wie „abschneiden-9“). */
  readonly beiStelle?: (anker: string) => void;
}

/** Ein Textteil mit seinem Stil. */
function Teil({ teil, aktionen }: { teil: Textteil; aktionen: Textaktionen }) {
  if (teil.art === "verweis" && teil.abbildung) {
    const ziel = teil.abbildung;
    return (
      <button type="button" className="verweis" onClick={() => aktionen.beiVerweis(ziel)}>
        {teil.text}
      </button>
    );
  }
  const begriff = teil.begriff;
  if (teil.art === "begriff" && begriff && aktionen.beiBegriff) {
    const beiBegriff = aktionen.beiBegriff;
    return (
      <button type="button" className="verweis" onClick={() => beiBegriff(begriff)}>
        {teil.text}
      </button>
    );
  }
  const anker = teil.anker;
  if (teil.art === "stelle" && anker && aktionen.beiStelle) {
    const beiStelle = aktionen.beiStelle;
    return (
      <button type="button" className="verweis" onClick={() => beiStelle(anker)}>
        {teil.text}
      </button>
    );
  }
  if (teil.art === "absatz") return <br />;
  if (teil.art === "zeichen" && teil.zeichen) {
    return (
      <span className="zeichen" role="img" aria-label={t(`zeichen.${teil.zeichen}`)}>
        {teil.text}
      </span>
    );
  }
  // Züge aus dem Klartext (seit 0.2.94) in der Notation der Sprache; auf Deutsch wie im Buch.
  if (teil.art === "zug") return <>{buchzugInSprache(teil.text, sprache())}</>;
  if (teil.stil === "fett") return <strong>{teil.text}</strong>;
  if (teil.stil === "kursiv") return <em>{teil.text}</em>;
  return <>{teil.text}</>;
}

/** Textteile aus dem Buch ohne eigenen Absatz, etwa für Glossar und Übungen. */
export function Buchtext({
  teile,
  aktionen,
}: {
  teile: readonly Textteil[];
  aktionen: Textaktionen;
}) {
  return (
    <>
      {teile.map((teil, index) => (
        <Teil key={index} teil={teil} aktionen={aktionen} />
      ))}
    </>
  );
}

export function Unterschrift({ nummer, teile, beiVerweis }: UnterschriftEigenschaften) {
  return (
    <p className="unterschrift" data-tour="unterschrift">
      <strong>{t("abbildung.titel", { nummer })}:</strong>{" "}
      <Buchtext teile={teile} aktionen={{ beiVerweis }} />
    </p>
  );
}
