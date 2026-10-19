/**
 * Bildschirm „Steckbriefe“: die Eröffnungs-Steckbriefe und die Fallenchecks des Buches zum
 * Nachschlagen (seit 0.2.99).
 *
 * Rolle im Gesamtbild: Wunsch des Autors vom 19.10.2026, Nachschlagen zu prüfen. Die Steckbriefe
 * der Eröffnungen (Kapitel 2) und die Fallenchecks (Kapitel 4) standen schon in den Buchdaten,
 * waren in der App aber nirgends am Stück zu lesen. Jeder Eintrag ist aufklappbar; ein Knopf
 * führt zur passenden Stelle im Buch (erste Abbildung des Abschnitts, Stopp-Moment der Falle).
 * Begriffe wie im Buch: „Wer tappt hinein?“, „Prüfung“, „Reicht?“, „Rettender Zug“,
 * „Fallensteller-Test“. Regel 1: Inhalte kommen unverändert aus den Buchdaten.
 * Abhängigkeiten: daten/laden.ts, Buchtext, Kopfzeile, Navigation, i18n.
 */
import { ChevronDown } from "lucide-react";
import { useNavigation } from "../../app/navigationsKontext";
import { ladeIndex, ladeKapitel, type Kapitel } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { Buchtext, type Textaktionen } from "../komponenten/Unterschrift";
import { useDaten } from "../komponenten/useDaten";

/** Größe des Pfeils, der zeigt, dass sich ein Eintrag aufklappen lässt. */
const PFEILGROESSE = 20;

type Steckbrief = Kapitel["steckbriefe"][number];
type Fallencheck = Kapitel["fallenchecks"][number];
type Wertung = NonNullable<Fallencheck["zeilen"][number]["wertung"]>;

/** Alle Kapitel, die das Verzeichnis kennt (für Steckbriefe aus mehreren Kapiteln). */
async function ladeAlleKapitel(): Promise<readonly Kapitel[]> {
  const index = await ladeIndex();
  return Promise.all(index.kapitel.map((k) => ladeKapitel(k.kapitel)));
}

/** Zeichen und Wort der Bewertung wie im Buch (✓ ◐ ✗ –), nie nur das Zeichen (WCAG 1.4.1). */
function Bewertung({ wertung }: { wertung: Wertung | null }) {
  if (!wertung) return null;
  return (
    <span className={`steckbrief-wertung wertung-${wertung}`}>
      {t(`steckbrief.wertung.${wertung}`)}
    </span>
  );
}

/** Erste Abbildung eines Abschnitts („2.2“), damit der Knopf an die Stelle im Buch führt. */
function ersteAbbildung(kapitel: readonly Kapitel[], abschnitt: string | null): string | null {
  if (!abschnitt) return null;
  for (const k of kapitel) {
    const treffer = k.abbildungen.find((a) => a.abschnitt?.nummer === abschnitt);
    if (treffer) return treffer.id;
  }
  return null;
}

function Eroeffnung({
  steckbrief,
  abbildung,
  aktionen,
}: {
  steckbrief: Steckbrief;
  abbildung: string | null;
  aktionen: Textaktionen;
}) {
  return (
    <details className="karte steckbrief" data-testid="steckbrief">
      <summary className="karte-kopf">
        <h3>{steckbrief.name}</h3>
        {steckbrief.abschnitt && (
          <span className="hinweis">
            {t("steckbrief.abschnitt", { nummer: steckbrief.abschnitt })}
          </span>
        )}
        <ChevronDown className="aufklapper" size={PFEILGROESSE} aria-hidden="true" />
      </summary>
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
      {abbildung && (
        <button
          type="button"
          className="knopf-zweit"
          onClick={() => aktionen.beiVerweis(abbildung)}
        >
          {t("steckbrief.zumBuch", { nummer: abbildung })}
        </button>
      )}
    </details>
  );
}

/** Knopf zum Stopp-Moment der Falle im Buch. */
function StoppKnopf({ nummer, aktionen }: { nummer: string; aktionen: Textaktionen }) {
  return (
    <button type="button" className="knopf-zweit" onClick={() => aktionen.beiVerweis(nummer)}>
      {t("steckbrief.stopp", { nummer })}
    </button>
  );
}

function Falle({ falle, aktionen }: { falle: Fallencheck; aktionen: Textaktionen }) {
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
      {falle.stopp && <StoppKnopf nummer={falle.stopp} aktionen={aktionen} />}
    </details>
  );
}

export function Steckbriefe() {
  const { navigiere } = useNavigation();
  const kapitel = useDaten(ladeAlleKapitel, "alle-kapitel");
  const aktionen: Textaktionen = {
    beiVerweis: (nummer) => navigiere({ bildschirm: "abbildung", nummer }),
    beiBegriff: (begriff) => navigiere({ bildschirm: "begriff", begriff }),
  };
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("steckbrief.titel")} zurueckText={t("nachschlagen.titel")} />
      <p className="hinweis">{t("steckbrief.einleitung")}</p>
      {kapitel.art === "laedt" && <p className="lade">…</p>}
      {kapitel.art === "fehler" && (
        <p className="fehlertext">{t("buch.ladefehler", { fehler: kapitel.meldung })}</p>
      )}
      {kapitel.art === "fertig" && (
        <>
          <h2 className="abschnitt-titel">{t("steckbrief.eroeffnungen")}</h2>
          {kapitel.wert.flatMap((k) =>
            k.steckbriefe.map((s) => (
              <Eroeffnung
                key={s.name}
                steckbrief={s}
                abbildung={ersteAbbildung(kapitel.wert, s.abschnitt)}
                aktionen={aktionen}
              />
            )),
          )}
          <h2 className="abschnitt-titel">{t("steckbrief.fallen")}</h2>
          {kapitel.wert.flatMap((k) =>
            k.fallenchecks.map((f) => <Falle key={f.name} falle={f} aktionen={aktionen} />),
          )}
        </>
      )}
    </div>
  );
}
