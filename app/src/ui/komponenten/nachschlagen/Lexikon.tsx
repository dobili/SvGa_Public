/**
 * Bausteine der Lexikonseite im Glossar (Entwurf I3): Buchstaben-Reiter, Seitenkopf mit
 * Leitwörtern, großer Anfangsbuchstabe und die Einträge als Fließtext mit Kapitelangabe.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (31.10.2026), das Glossar weniger wie ein Formular und
 * mehr wie ein Buch wirken zu lassen. Ein Tipp auf einen Eintrag öffnet wie bisher die
 * Begriffsseite mit allen Stellen, Verweisen und Diagrammen. Hat ein Begriff eine Abbildung im
 * Buch, steht ihr Diagramm klein neben dem Text, wie eine Abbildung im Lexikon.
 * Abhängigkeiten: lexikon.ts, ui/brett (Diagramm), buchmarkierungen.ts, i18n, Navigation.
 */
import { useEffect, useId, useRef } from "react";
import { useNavigation } from "../../../app/navigationsKontext";
import type { Abbildung, Glossareintrag } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { Brett } from "../../brett/Brett";
import { buchmarkierungen } from "../abbildung/buchmarkierungen";
import { kapitelDesBegriffs, lexikontext, type Lexikonseite } from "./lexikon";

/** Die Reiter A bis Z (nur Buchstaben, die vorkommen); der gewählte ist hervorgehoben. */
export function Buchstabenreiter({
  seiten,
  aktiv,
  beiWahl,
}: {
  seiten: readonly Lexikonseite[];
  aktiv: string;
  beiWahl: (buchstabe: string) => void;
}) {
  const leiste = useRef<HTMLElement>(null);
  // Den gewählten Reiter waagrecht in die Mitte holen, ohne die Seite senkrecht zu verschieben.
  useEffect(() => {
    const nav = leiste.current;
    const knopf = nav?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (nav && knopf) nav.scrollLeft = knopf.offsetLeft - (nav.clientWidth - knopf.offsetWidth) / 2;
  }, [aktiv]);
  return (
    <nav
      ref={leiste}
      className="lexikon-reiter"
      aria-label={t("nachschlagenneu.glossar.reiter")}
      data-tour="glossar-buchstaben"
    >
      {seiten.map(({ buchstabe }) => (
        <button
          key={buchstabe}
          type="button"
          aria-pressed={buchstabe === aktiv}
          onClick={() => beiWahl(buchstabe)}
        >
          {buchstabe}
        </button>
      ))}
    </nav>
  );
}

/** Kleines Diagramm einer Abbildung neben dem Text, mit Nummer darunter. */
function Lexikonbild({ abbildung }: { abbildung: Abbildung }) {
  const nummer = t("nachschlagenneu.glossar.abbildung", { nummer: abbildung.id });
  return (
    <span className="lexikon-bild">
      <Brett
        fen={abbildung.fen}
        markierungen={buchmarkierungen(abbildung)}
        koordinaten={false}
        beschriftung={t("abbildung.titel", { nummer: abbildung.id })}
      />
      <small aria-hidden="true">{nummer}</small>
    </span>
  );
}

/**
 * Ein Eintrag als Absatz: Begriff fett, Definition, Kapitelangabe in Gold; ganz antippbar.
 * Der Knopf heißt wie der Begriff, die Definition ist seine Beschreibung (Bildschirmleser).
 */
export function Lexikoneintrag({
  eintrag,
  bild,
}: {
  eintrag: Glossareintrag;
  bild: Abbildung | null;
}) {
  const { navigiere } = useNavigation();
  const textId = useId();
  const kapitel = kapitelDesBegriffs(eintrag);
  return (
    <li className="lexikon-eintrag">
      <button
        type="button"
        aria-label={eintrag.begriff}
        aria-describedby={textId}
        onClick={() => navigiere({ bildschirm: "begriff", begriff: eintrag.begriff })}
      >
        {bild && <Lexikonbild abbildung={bild} />}
        <span id={textId}>
          <strong className="lexikon-begriff">{eintrag.begriff}.</strong> {lexikontext(eintrag)}
          {kapitel.length > 0 && (
            <span className="lexikon-kapitel">
              {" "}
              {t("nachschlagenneu.glossar.kapitel", { liste: kapitel.join(", ") })}
            </span>
          )}
        </span>
      </button>
    </li>
  );
}

/** Die Einträge einer Seite oder der Suche als Liste. */
export function Lexikonliste({
  eintraege,
  bildZu,
}: {
  eintraege: readonly Glossareintrag[];
  bildZu: (eintrag: Glossareintrag) => Abbildung | null;
}) {
  return (
    <ul className="lexikon-liste" data-tour="glossar-liste">
      {eintraege.map((eintrag) => (
        <Lexikoneintrag key={eintrag.begriff} eintrag={eintrag} bild={bildZu(eintrag)} />
      ))}
    </ul>
  );
}

/** Eine Seite: Leitwörter (erster und letzter Begriff), großer Anfangsbuchstabe, Einträge. */
export function LexikonseiteAnsicht({
  seite,
  bildZu,
}: {
  seite: Lexikonseite;
  bildZu: (eintrag: Glossareintrag) => Abbildung | null;
}) {
  const erster = seite.eintraege[0]?.begriff ?? "";
  const letzter = seite.eintraege.at(-1)?.begriff ?? "";
  return (
    <section className="lexikon-seite" aria-labelledby="lexikon-initiale">
      <p className="lexikon-leitwoerter">
        <span>{erster}</span>
        <span>
          {t("nachschlagenneu.glossar.seitenkopf", {
            buchstabe: seite.buchstabe,
            anzahl: seite.eintraege.length,
          })}
        </span>
        <span>{letzter}</span>
      </p>
      <h2 id="lexikon-initiale" className="lexikon-initiale">
        {seite.buchstabe}
      </h2>
      <Lexikonliste eintraege={seite.eintraege} bildZu={bildZu} />
    </section>
  );
}
