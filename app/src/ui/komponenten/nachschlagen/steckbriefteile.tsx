/**
 * Teile der Steckbriefe zum Nachschlagen: der Inhalt eines Eröffnungs-Steckbriefs und ein
 * Fallencheck zum Aufklappen.
 *
 * Rolle im Gesamtbild: Seit der Gestaltung nach Entwurf H2 (31.10.2026) zeigt der Bildschirm
 * „Steckbriefe“ die Eröffnungen als Baum; ein Tipp öffnet den vollständigen Steckbrief als eigene
 * Seite, die Fallenchecks stehen auf einer eigenen Seite. Inhalt und Begriffe wie bisher und wie
 * im Buch: „Wer tappt hinein?“, „Prüfung“, „Reicht?“, „Rettender Zug“, „Fallensteller-Test“.
 * Regel 1: Inhalte kommen unverändert aus den Buchdaten.
 * Abhängigkeiten: daten/laden.ts (Typen), Buchtext, Stellungsbild, steckbriefdaten.ts, i18n.
 */
import { ChevronDown } from "lucide-react";
import type { Abbildung, Kapitel } from "../../../daten/laden";
import { t } from "../../../i18n/sprache";
import { Buchtext } from "../abbildung/Unterschrift";
import { useBuchaktionen } from "./steckbriefdaten";
import { Stellungsbild } from "./Stellungsbild";

/** Größe des Pfeils, der zeigt, dass sich ein Eintrag aufklappen lässt. */
const PFEILGROESSE = 20;

export type Steckbrief = Kapitel["steckbriefe"][number];
export type Fallencheck = Kapitel["fallenchecks"][number];
type Wertung = NonNullable<Fallencheck["zeilen"][number]["wertung"]>;

/** Zeichen und Wort der Bewertung wie im Buch (✓ ◐ ✗ –), nie nur das Zeichen (WCAG 1.4.1). */
function Bewertung({ wertung }: { wertung: Wertung | null }) {
  if (!wertung) return null;
  return (
    <span className={`steckbrief-wertung wertung-${wertung}`}>
      {t(`steckbrief.wertung.${wertung}`)}
    </span>
  );
}

/**
 * Der vollständige Steckbrief einer Eröffnung: die Zeilen des Buches, das Diagramm der
 * Schlussstellung der Hauptvariante und der Knopf an die Stelle im Buch.
 */
export function SteckbriefInhalt({
  steckbrief,
  abbildung,
  schluss,
}: {
  steckbrief: Steckbrief;
  abbildung: string | null;
  schluss: Abbildung | null;
}) {
  const aktionen = useBuchaktionen();
  return (
    <section className="karte steckbrief-seite" data-testid="steckbrief-inhalt">
      <dl className="steckbrief-zeilen">
        {steckbrief.zeilen.map((zeile) => (
          <div key={zeile.frage}>
            <dt>{zeile.frage}</dt>
            <dd>
              <Buchtext teile={zeile.antwort} aktionen={aktionen} />
            </dd>
          </div>
        ))}
      </dl>
      {schluss && (
        <Stellungsbild
          abbildung={schluss}
          text={t("steckbrief.schluss", { nummer: schluss.id })}
          beiKlick={() => aktionen.beiVerweis(schluss.id)}
        />
      )}
      {abbildung && (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => aktionen.beiVerweis(abbildung)}
        >
          {t("steckbrief.zumBuch", { nummer: abbildung })}
        </button>
      )}
    </section>
  );
}

/** Der Stopp-Moment der Falle: als Diagramm, wenn die Abbildung geladen ist, sonst als Knopf. */
function StoppKnopf({ nummer, bild }: { nummer: string; bild: Abbildung | null }) {
  const aktionen = useBuchaktionen();
  const text = t("steckbrief.stopp", { nummer });
  if (bild) {
    return (
      <Stellungsbild abbildung={bild} text={text} beiKlick={() => aktionen.beiVerweis(nummer)} />
    );
  }
  return (
    <button type="button" className="knopf-zweit" onClick={() => aktionen.beiVerweis(nummer)}>
      {text}
    </button>
  );
}

/** Die Zeilen eines Fallenchecks mit Bewertung. */
function Fallenzeilen({ falle }: { falle: Fallencheck }) {
  const aktionen = useBuchaktionen();
  return (
    <dl className="steckbrief-zeilen">
      {falle.zeilen.map((zeile) => (
        <div key={`${zeile.kennung ?? ""} ${zeile.titel}`}>
          <dt>
            {zeile.kennung} {zeile.titel} <Bewertung wertung={zeile.wertung} />
          </dt>
          <dd>
            <Buchtext teile={zeile.text} aktionen={aktionen} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Ein Fallencheck zum Aufklappen, mit Stopp-Moment als Diagramm. */
export function Falle({ falle, stoppbild }: { falle: Fallencheck; stoppbild: Abbildung | null }) {
  const aktionen = useBuchaktionen();
  return (
    <details className="karte steckbrief" data-testid="fallencheck">
      <summary className="karte-kopf">
        <h3>{falle.name}</h3>
        {falle.abschnitt && (
          <span className="hinweis">{t("steckbrief.abschnitt", { nummer: falle.abschnitt })}</span>
        )}
        <ChevronDown className="aufklapper" size={PFEILGROESSE} aria-hidden="true" />
      </summary>
      <p>
        <strong>{t("steckbrief.wer")}</strong> <Buchtext teile={falle.wer} aktionen={aktionen} />
      </p>
      <Fallenzeilen falle={falle} />
      {falle.rettung && (
        <p>
          <strong>{t("steckbrief.rettung")}</strong>{" "}
          <Buchtext teile={falle.rettung} aktionen={aktionen} />
        </p>
      )}
      {falle.fallensteller && (
        <p>
          <strong>{t("steckbrief.fallensteller")}</strong>{" "}
          <Bewertung wertung={falle.fallensteller.wertung} />{" "}
          <Buchtext teile={falle.fallensteller.text} aktionen={aktionen} />
        </p>
      )}
      {falle.stopp && <StoppKnopf nummer={falle.stopp} bild={stoppbild} />}
    </details>
  );
}
