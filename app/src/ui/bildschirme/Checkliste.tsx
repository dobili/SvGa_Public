/**
 * Gesamt-Checkliste als Abhakliste: je Kapitel die Lernziele aus dem Buch zum Abhaken, dazu
 * Kernfrage, Werkzeug und Fehlerart aus der Tabelle in Kapitel 12.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Gesamt-Checkliste: die Tabelle aus Kapitel 12 als
 * Nachschlagekarte, jede Zeile verlinkt zum Kapitel“, erweitert auf Wunsch des Autors (Test von
 * 0.2.0) um die Liste „Bevor du weiterliest, solltest du Folgendes können“ am Ende jedes Kapitels.
 * Alle Texte kommen aus nachschlagen.json (Pipeline, aus dem LaTeX); die Haken speichert
 * app/lernstand.ts auf dem Gerät.
 * Abhängigkeiten: daten/laden.ts, app/lernstand.ts, Navigation, i18n.
 */
import { useNavigation } from "../../app/navigationsKontext";
import { abgehakt, schalteLernziel, useLernstand, type Lernstand } from "../../app/lernstand";
import { ladeNachschlagen, type Nachschlagen } from "../../daten/laden";
import { t } from "../../i18n/sprache";
import { Kopfzeile } from "../komponenten/Kopfzeile";
import { Kapitelnummer } from "../komponenten/Kapitelnummer";
import { useDaten } from "../komponenten/useDaten";

type Liste = NonNullable<Nachschlagen["checkliste"]>;
type Zeile = Liste["zeilen"][number];
type Lernziele = Nachschlagen["lernziele"][number];

/** Die Punkte eines Kapitels als Kästchen; ein Tipp hakt ab oder nimmt den Haken zurück. */
function Punkte({ ziele, stand }: { ziele: Lernziele; stand: Lernstand }) {
  const erledigt = stand[ziele.kapitel] ?? [];
  return (
    <ul className="lernziele">
      {ziele.punkte.map((punkt, index) => (
        <li key={punkt}>
          <label className="lernziel">
            <input
              type="checkbox"
              checked={erledigt.includes(index)}
              onChange={() => schalteLernziel(ziele.kapitel, index)}
            />
            <span>{punkt}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}

/** Eine Karte je Kapitel: zu Kernfrage und Fortschritt, aufgeklappt Lernziele und Werkzeug. */
function Kapitelkarte({
  zeile,
  ziele,
  spalten,
  stand,
}: {
  zeile: Zeile;
  ziele: Lernziele | undefined;
  spalten: readonly string[];
  stand: Lernstand;
}) {
  const { navigiere } = useNavigation();
  const anzahl = ziele?.punkte.length ?? 0;
  const fertig = ziele ? abgehakt(stand, zeile.kapitel, anzahl) : 0;
  return (
    <details
      className="lernkarte"
      data-testid={`lernkarte-${zeile.kapitel}`}
      data-tour="checkliste-karte"
    >
      <summary>
        <Kapitelnummer nummer={zeile.kapitel} anteil={{ erreicht: fertig, gesamt: anzahl }} />
        <span className="lernkarte-frage">{zeile.kernfrage}</span>
        {anzahl > 0 && (
          <span className="lernkarte-stand">
            {t("checkliste.kapitelStand", { erledigt: fertig, alle: anzahl })}
          </span>
        )}
      </summary>
      {ziele && <p className="hinweis">{ziele.einleitung}</p>}
      {ziele && <Punkte ziele={ziele} stand={stand} />}
      <p className="lernkarte-werkzeug">
        <strong>{spalten[2]}:</strong> {zeile.werkzeug}
        <br />
        <strong>{spalten[3]}:</strong> {zeile.fehlerart}
      </p>
      <button
        type="button"
        className="knopf-link links"
        onClick={() => navigiere({ bildschirm: "kapitel", nummer: zeile.kapitel })}
      >
        {t("checkliste.zumKapitel", { nummer: zeile.kapitel })}
      </button>
    </details>
  );
}

function Inhalt({ daten }: { daten: Nachschlagen }) {
  const stand = useLernstand();
  const liste = daten.checkliste;
  if (!liste) return null;
  const zuKapitel = new Map(daten.lernziele.map((ziele) => [ziele.kapitel, ziele]));
  const alle = daten.lernziele.reduce((summe, ziele) => summe + ziele.punkte.length, 0);
  const erledigt = daten.lernziele.reduce(
    (summe, ziele) => summe + abgehakt(stand, ziele.kapitel, ziele.punkte.length),
    0,
  );
  return (
    <>
      <p className="hinweis">{liste.titel}</p>
      {alle > 0 && <p className="hinweis">{t("checkliste.hinweis")}</p>}
      {alle > 0 && (
        <p className="lernstand-gesamt" data-testid="lernstand-gesamt" data-tour="checkliste-stand">
          {t("checkliste.gesamt", { erledigt, alle })}
        </p>
      )}
      {liste.zeilen.map((zeile) => (
        <Kapitelkarte
          key={zeile.kapitel}
          zeile={zeile}
          ziele={zuKapitel.get(zeile.kapitel)}
          spalten={liste.spalten}
          stand={stand}
        />
      ))}
    </>
  );
}

/** Bildschirm „Gesamt-Checkliste“. Beispiel: Kapitel 1 mit sechs Lernzielen zum Abhaken. */
export function Checkliste() {
  const daten = useDaten(ladeNachschlagen, "nachschlagen");
  return (
    <div className="bildschirm">
      <Kopfzeile titel={t("checkliste.titel")} zurueckText={t("nachschlagen.titel")} />
      {daten.art === "laedt" && <p className="lade">…</p>}
      {daten.art === "fehler" && <p className="fehlertext">{daten.meldung}</p>}
      {daten.art === "fertig" && <Inhalt daten={daten.wert} />}
    </div>
  );
}
