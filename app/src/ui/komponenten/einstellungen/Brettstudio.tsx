/**
 * Brettvorschau oben in den Einstellungen: ein großes, lebendiges Brett in den gewählten Farben
 * und Figuren, darunter der Schalter „Koordinaten“, die Farbfelder und die Figurenkacheln.
 *
 * Rolle im Gesamtbild: Entwurf K2 „Brettvorschau oben“ (Wahl des Autors, 31.10.2026): Was man am
 * häufigsten ändert, sieht man sofort groß. Die Vorschau zeigt eine Stellung aus der Italienischen
 * Partie mit Pfeil, markiertem Feld und letztem Zug, wie Abbildungen und Werkzeuge in der App;
 * jede Wahl gilt sofort auch dort. Die Brettfarben und Figurensätze kommen aus den Listen der
 * Einstellungen (speicher/format.ts) und der Extras (training/extras.ts): Ein neues Brett oder ein
 * neuer Satz erscheint hier von selbst. Gesperrte Extras zeigt Musterwahl.tsx mit Schloss.
 * Abhängigkeiten: app/einstellungen.ts, app/merker.ts, brett/ (Brett, Figur, Holzfelder, masse),
 * extras/extrakacheln.ts, training/extras.ts, Musterwahl, Einstellungszeile (Schalter), i18n.
 */
import { useId, useState } from "react";
import type { Markierung } from "../../../analyse/werkzeug";
import {
  aendereEinstellungen,
  BILDSAETZE,
  useEinstellungen,
  type Brettfarben,
  type Figurensatz,
} from "../../../app/einstellungen";
import { liesMerker, schreibeMerker } from "../../../app/merker";
import { t, type Textschluessel } from "../../../i18n/sprache";
import { BRETTARTEN } from "../../../speicher/format";
import { extraZu, type Extraart } from "../../../training/extras";
import { Brett } from "../../brett/Brett";
import { Figur } from "../../brett/Figur";
import { Brettbild, Holzfelder } from "../../brett/Holzfelder";
import { BRETTFARBEN, FELD, holzmuster } from "../../brett/masse";
import { extragruppe, kachelname, useKachelsperre } from "../extras/extrakacheln";
import { Schalter } from "./Einstellungszeile";
import { Musterwahl } from "./Musterwahl";

/** Stellung der Vorschau: Italienische Partie nach 3. … Sf6 (Weiß am Zug). */
const VORSCHAUSTELLUNG = "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4";
/** Pfeil und Feld wie bei einem Werkzeug: der Läufer zielt auf f7, den wunden Punkt. */
const VORSCHAUMARKEN: readonly Markierung[] = [
  { typ: "pfeil", farbe: "gold", von: "c4", nach: "f7" },
  { typ: "pfeil", farbe: "gold", von: "f3", nach: "g5" },
  { typ: "feld", farbe: "rot", feld: "f7" },
];
/** Der letzte Zug der Vorschau, mit Schimmer wie in der Partie. */
const VORSCHAUZUG = { von: "g8", nach: "f6" } as const;
/** Merker der Koordinaten auf dem Gerät (Trainerbrett.tsx und Abbildungen lesen ihn). */
const MERKER_KOORDINATEN = "koordinaten";
/** Seitenlänge des Farbfeldes in Feldern (2 × 2 Felder, die Ecke a8 bis b7). */
const FARBFELD_SEITE = 2;

/** Alle Werte einer Art ohne die Extras, dann die Extras (eintragen statt umbauen). */
function mitExtras<T extends string>(art: Extraart, werte: readonly T[]): readonly T[] {
  return [...werte.filter((w) => !extraZu(art, w)), ...extragruppe<T>(art).werte];
}
const BRETTWAHL = mitExtras<Brettfarben>("brett", BRETTARTEN);
const FIGURENWAHL = mitExtras<Figurensatz>("figuren", ["buch", ...BILDSAETZE]);

/** Das runde Farbfeld: hell oben links, dunkel unten rechts; Holz und Brettbilder als 2 × 2. */
function Farbfeld({ farben }: { farben: Brettfarben }) {
  const kennung = useId().replace(/:/g, "");
  const palette = BRETTFARBEN[farben];
  const seite = FARBFELD_SEITE * FELD;
  if (farben !== "holz" && !palette.bild) {
    return (
      <svg viewBox={`0 0 ${seite} ${seite}`}>
        <rect width={seite} height={seite} fill={palette.hell} />
        <polygon points={`${seite},0 ${seite},${seite} 0,${seite}`} fill={palette.dunkel} />
      </svg>
    );
  }
  const holz = farben === "holz";
  const fuellung = (hell: boolean) =>
    holz ? `url(#${holzmuster(kennung, hell)})` : hell ? palette.hell : palette.dunkel;
  return (
    <svg viewBox={`0 0 ${seite} ${seite}`}>
      {holz && <Holzfelder kennung={kennung} />}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={(i % FARBFELD_SEITE) * FELD}
          y={Math.floor(i / FARBFELD_SEITE) * FELD}
          width={FELD}
          height={FELD}
          fill={fuellung(i % FARBFELD_SEITE === Math.floor(i / FARBFELD_SEITE))}
        />
      ))}
      {palette.bild && <Brettbild pfad={palette.bild} />}
    </svg>
  );
}

/** Die Figurenkachel: ein weißer Springer des Satzes auf dem hellen Feld des gewählten Brettes. */
function Figurenfeld({ satz, farben }: { satz: Figurensatz; farben: Brettfarben }) {
  const palette = BRETTFARBEN[farben];
  return (
    <svg viewBox={`0 0 ${FELD} ${FELD}`}>
      <rect width={FELD} height={FELD} fill={palette.hell} />
      <Figur zeichen="N" x={0} y={0} satz={satz} farbe={palette.figur} />
    </svg>
  );
}

/** Die große Vorschau mit dem Schalter „Koordinaten“ darunter. */
function Vorschau() {
  const [koordinaten, setzeKoordinaten] = useState(liesMerker(MERKER_KOORDINATEN) !== "aus");
  const name = t("einstellungenneu.koordinaten");
  return (
    <div className="brettstudio-vorschau" data-tour="einstellungen-reiter-brett">
      <div className="brettstudio-brett">
        <Brett
          fen={VORSCHAUSTELLUNG}
          markierungen={VORSCHAUMARKEN}
          letzterZug={VORSCHAUZUG}
          koordinaten={koordinaten}
          beschriftung={t("einstellungenneu.vorschau")}
          vollbild
        />
      </div>
      <div className="brettstudio-koordinaten">
        <span id="brettstudio-koordinaten">{name}</span>
        <Schalter
          beschriftetVon="brettstudio-koordinaten"
          an={koordinaten}
          beiWechsel={(an) => {
            schreibeMerker(MERKER_KOORDINATEN, an ? "an" : "aus");
            setzeKoordinaten(an);
          }}
        />
      </div>
    </div>
  );
}

/** Brettvorschau, Brettfarbe und Figuren (wie das Brett aussieht). */
export function Brettstudio() {
  const { brettfarben, figurensatz } = useEinstellungen();
  const brettsperre = useKachelsperre("brett", brettfarben);
  const figurensperre = useKachelsperre("figuren", figurensatz);
  return (
    <section className="brettstudio" aria-label={t("einstellungenneu.studio")}>
      <Vorschau />
      <Musterwahl
        name={t("einstellungenneu.brettfarbe")}
        werte={BRETTWAHL}
        gewaehlt={brettfarben}
        text={(w) =>
          kachelname("brett", w, () => t(`einstellungen.brettfarben.${w}` as Textschluessel))
        }
        bild={(w) => <Farbfeld farben={w} />}
        form="kreis"
        sperre={brettsperre}
        beiWahl={(neu) => aendereEinstellungen({ brettfarben: neu })}
      />
      <Musterwahl
        name={t("einstellungenneu.figuren")}
        werte={FIGURENWAHL}
        gewaehlt={figurensatz}
        text={(w) =>
          kachelname("figuren", w, () => t(`einstellungen.figurensatz.${w}` as Textschluessel))
        }
        bild={(w) => <Figurenfeld satz={w} farben={brettfarben} />}
        form="kachel"
        sperre={figurensperre}
        beiWahl={(neu) => aendereEinstellungen({ figurensatz: neu })}
      />
    </section>
  );
}
