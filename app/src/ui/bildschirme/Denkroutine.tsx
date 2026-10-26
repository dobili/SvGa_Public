/**
 * Denkroutine als Nachschlagekarte (die Gesamt-Checkliste steht in Checkliste.tsx).
 *
 * Rolle im Gesamtbild: Pflichtenheft 4: „Denkroutine: die Kopiervorlage als aufklappbare Karte:
 * vier Schritte, Sicherheitsblick, Werkzeuge je Partiephase“. Alle Texte kommen aus
 * nachschlagen.json (Pipeline, aus dem LaTeX). Aus den Trainern heraus aufrufbar (AP 13); bis
 * dahin über Nachschlagen.
 * Abhängigkeiten: daten/laden.ts, i18n.
 */
import { ladeNachschlagen, type Nachschlagen } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/rahmen/Kopfzeile";
import { useDaten } from "../komponenten/bausteine/useDaten";
import { Phasenzeichen } from "../komponenten/auswertung/Phasenzeichen";
import { phaseZumNamen } from "../komponenten/auswertung/zeilensymbole";

type Routine = NonNullable<Nachschlagen["denkroutine"]>;

/** Karte 1: vier Schritte, Sicherheitsblick, Ziehen, Rückweg zu Schritt 2. */
function Schritte({ routine }: { routine: Routine }) {
  return (
    <section className="karte" data-tour="denkroutine-schritte">
      <h2 className="karte-titel">{routine.titel}</h2>
      <ol className="schrittliste">
        {routine.schritte.map((schritt) => (
          <li key={schritt.nummer} className="schritt">
            <span className="schritt-nummer" aria-hidden="true">
              {schritt.nummer}
            </span>
            <p>
              <strong>{schritt.titel}</strong> {schritt.text}
            </p>
          </li>
        ))}
      </ol>
      <div className="sicherheitsblick">
        <p>
          <strong>{routine.sicherheitsblick.titel}</strong> {routine.sicherheitsblick.text}
        </p>
        <p className="hinweis">{t("denkroutine.zurueck", { frage: routine.zurueck })}</p>
      </div>
      <p className="abschluss">✓ {routine.abschluss}</p>
    </section>
  );
}

/** Zeichen der Phase vor ihrem Namen (DS26); nichts, wenn der Name keine Phase ist. */
function Phasensymbol({ name }: { name: string }) {
  const phase = phaseZumNamen(name);
  return phase ? <Phasenzeichen phase={phase} /> : null;
}

/** Karte 2: je Phase aufklappbar, wann sie gilt und welche Werkzeuge. */
function Phasen({ routine }: { routine: Routine }) {
  return (
    <section className="karte" data-tour="denkroutine-phasen">
      <h2 className="karte-titel">{routine.phasenTitel}</h2>
      {routine.phasen.map((phase) => (
        <details key={phase.name} className="phase">
          <summary>
            <Phasensymbol name={phase.name} />
            <strong>{phase.name}</strong>
            <span className="hinweis"> {phase.wann}</span>
          </summary>
          {phase.abschnitte.map((abschnitt) => (
            <div key={abschnitt.titel} className="phase-abschnitt">
              <h3>{abschnitt.titel}</h3>
              <ul>
                {abschnitt.punkte.map((punkt) => (
                  <li key={punkt}>{punkt}</li>
                ))}
              </ul>
            </div>
          ))}
        </details>
      ))}
      <p className="hinweis">{routine.zuerst}</p>
    </section>
  );
}

/**
 * Die Denkroutine des Buches als Nachschlagekarte: vier Schritte, Sicherheitsblick und Werkzeuge je
 * Partiephase.
 */
export function Denkroutine() {
  const daten = useDaten(ladeNachschlagen, "nachschlagen");
  const routine = daten.art === "fertig" ? daten.wert.denkroutine : null;
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("denkroutine.titel")} zurueckText={t("nachschlagen.titel")} />
      {daten.art === "laedt" && <p className="lade">…</p>}
      {daten.art === "fehler" && <p className="fehlertext">{daten.meldung}</p>}
      {routine && <Schritte routine={routine} />}
      {routine && <Phasen routine={routine} />}
    </div>
  );
}
