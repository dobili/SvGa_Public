/**
 * Stellungseditor auf dem Spielen-Bildschirm (Wunsch des Autors, 17.10.2026): eine Stellung
 * aufbauen und von dort gegen die Engine oder einen Menschen spielen.
 *
 * Rolle im Gesamtbild: Zwei Arten des Aufbaus. „Züge spielen“: Figur und Zielfeld antippen, die
 * Züge folgen den Regeln (schach/weiterspielen.ts), Umwandlung mit Nachfrage. „Figuren setzen“:
 * unten einen Stein wählen und Felder antippen; ein zweiter Tipp entfernt ihn; beliebig viele
 * Steine, auch außerhalb der Regeln (spiel/stellungsbau.ts); dazu die Seite am Zug. Ob sich aus
 * der Stellung eine Partie spielen lässt, prüft spiel/partie.ts (spielbar); erst dann lässt sie
 * sich übernehmen.
 * Abhängigkeiten: spiel/stellungsbau.ts, schach/weiterspielen.ts, spiel/partie.ts, Brett, Figur,
 * Auswahl, Umwandlung, i18n.
 */
import type { Color } from "chessops/types";
import { useState } from "react";
import { useEinstellungen } from "../../../app/einstellungen";
import { t } from "../../../i18n/sprache";
import type { Rolle } from "../../../schach/stellung";
import { legaleZiele, spieleZug } from "../../../schach/weiterspielen";
import { spielbar } from "../../../spiel/partie";
import {
  amZugVon,
  GRUNDSTELLUNG,
  LEERES_BRETT,
  mitAmZug,
  setzeStein,
  STEINE,
} from "../../../spiel/stellungsbau";
import { Brett } from "../../brett/Brett";
import { Figur } from "../../brett/Figur";
import { BRETTFARBEN, FELD } from "../../brett/masse";
import { Auswahl } from "../bausteine/Auswahl";
import { Umwandlung } from "../brettbedienung/Umwandlung";

type Modus = "ziehen" | "setzen";
/** Werkzeug beim Setzen: ein Stein (FEN-Buchstabe) oder das Räumen eines Feldes. */
type Werkzeug = string | "loeschen";
const FIGURGROESSE = 32;

/** Name eines Steins: „Dame (Weiß)“. */
function steinname(zeichen: string): string {
  const farbe = t(zeichen === zeichen.toUpperCase() ? "farbe.w" : "farbe.b");
  const rolle = zeichen.toLowerCase() as "p" | "n" | "b" | "r" | "q" | "k";
  return t("spielen.editor.figur", { figur: t(`figur.${rolle}`), farbe });
}

/** Die zwölf Steine und das Räumen als Chips mit kleinem Bild. */
function Figurenwahl({
  werkzeug,
  beiWahl,
}: {
  werkzeug: Werkzeug;
  beiWahl: (w: Werkzeug) => void;
}) {
  const einstellungen = useEinstellungen();
  return (
    <div className="figurenwahl" role="radiogroup" aria-label={t("spielen.editor.steine")}>
      {STEINE.map((zeichen) => (
        <button
          key={zeichen}
          type="button"
          role="radio"
          className="figurenwahl-stein"
          aria-checked={werkzeug === zeichen}
          aria-label={steinname(zeichen)}
          onClick={() => beiWahl(zeichen)}
        >
          <svg viewBox={`0 0 ${FELD} ${FELD}`} width={FIGURGROESSE} height={FIGURGROESSE}>
            <Figur
              zeichen={zeichen}
              x={0}
              y={0}
              satz={einstellungen.figurensatz}
              farbe={BRETTFARBEN[einstellungen.brettfarben].figur}
            />
          </svg>
        </button>
      ))}
      <button
        type="button"
        role="radio"
        className="chip"
        aria-checked={werkzeug === "loeschen"}
        onClick={() => beiWahl("loeschen")}
      >
        {t("spielen.editor.leeren")}
      </button>
    </div>
  );
}

/** Züge nach den Regeln: gewählte Figur, Zielfelder, Umwandlung. */
function useZiehen(fen: string, setzeFen: (fen: string) => void) {
  const [gewaehlt, setzeGewaehlt] = useState<string | null>(null);
  const [umwandlung, setzeUmwandlung] = useState<{ von: string; nach: string } | null>(null);
  const ziele = gewaehlt ? legaleZiele(fen, gewaehlt) : [];
  const spiele = (von: string, nach: string, rolle?: Rolle) => {
    const versuch = spieleZug(fen, von, nach, rolle);
    if (versuch.art === "gespielt") setzeFen(versuch.fen);
    if (versuch.art === "umwandlung") setzeUmwandlung({ von, nach });
  };
  const beiFeld = (feld: string) => {
    if (gewaehlt && ziele.includes(feld)) {
      spiele(gewaehlt, feld);
      setzeGewaehlt(null);
      return;
    }
    setzeGewaehlt(legaleZiele(fen, feld).length > 0 && feld !== gewaehlt ? feld : null);
  };
  const waehleUmwandlung = (rolle: Rolle | null) => {
    if (rolle && umwandlung) spiele(umwandlung.von, umwandlung.nach, rolle);
    setzeUmwandlung(null);
  };
  return { gewaehlt, ziele, umwandlung, beiFeld, waehleUmwandlung };
}

/**
 * Der Editor. Eingaben: die Stellung, mit der er beginnt; Übernehmen mit der fertigen FEN;
 * Abbrechen. Beispiel: Grundstellung, „Figuren setzen“, Brett leeren, K auf e1, k auf e8, Q auf
 * d1 → „Stellung übernehmen“ ist frei, die Partie beginnt mit Weiß am Zug.
 */
export function Stellungseditor({
  start,
  beiUebernehmen,
  beiAbbrechen,
}: {
  start: string;
  beiUebernehmen: (fen: string) => void;
  beiAbbrechen: () => void;
}) {
  const [modus, setzeModus] = useState<Modus>("setzen");
  const [fen, setzeFen] = useState(start);
  const [werkzeug, setzeWerkzeug] = useState<Werkzeug>("K");
  const ziehen = useZiehen(fen, setzeFen);
  const ok = spielbar(fen);
  const beiFeld = (feld: string) => {
    if (modus === "ziehen") ziehen.beiFeld(feld);
    else setzeFen(setzeStein(fen, feld, werkzeug === "loeschen" ? null : werkzeug));
  };
  return (
    <div className="stellungseditor" data-testid="stellungseditor">
      <Auswahl
        name={t("spielen.editor.modus")}
        werte={["setzen", "ziehen"] as const}
        gewaehlt={modus}
        text={(m) => t(`spielen.editor.${m}`)}
        beiWahl={setzeModus}
      />
      <p className="hinweis">{t(`spielen.editor.hinweis.${modus}`)}</p>
      <Brett
        fen={fen}
        markierungen={[]}
        beschriftung={t("spielen.editor.brett")}
        ausgewaehlt={modus === "ziehen" ? ziehen.gewaehlt : null}
        ziele={modus === "ziehen" ? ziehen.ziele : []}
        beiFeld={beiFeld}
      />
      {modus === "ziehen" && ziehen.umwandlung && <Umwandlung beiWahl={ziehen.waehleUmwandlung} />}
      {modus === "setzen" && (
        <>
          <Figurenwahl werkzeug={werkzeug} beiWahl={setzeWerkzeug} />
          <Auswahl
            name={t("spielen.editor.amZug")}
            werte={["white", "black"] as const}
            gewaehlt={amZugVon(fen)}
            text={(farbe: Color) => t(farbe === "white" ? "farbe.w" : "farbe.b")}
            beiWahl={(farbe) => setzeFen(mitAmZug(fen, farbe))}
          />
          <div className="knopfreihe">
            <button type="button" className="knopf-zweit" onClick={() => setzeFen(LEERES_BRETT)}>
              {t("spielen.editor.brettLeeren")}
            </button>
            <button type="button" className="knopf-zweit" onClick={() => setzeFen(GRUNDSTELLUNG)}>
              {t("spielen.editor.grundstellung")}
            </button>
          </div>
        </>
      )}
      {!ok && <p className="fehlertext">{t("spielen.editor.ungueltig")}</p>}
      <div className="knopfreihe">
        <button
          type="button"
          className="knopf-haupt"
          disabled={!ok}
          onClick={() => beiUebernehmen(fen)}
        >
          {t("spielen.fenUebernehmen")}
        </button>
        <button type="button" className="knopf-zweit" onClick={beiAbbrechen}>
          {t("spielen.editor.abbrechen")}
        </button>
      </div>
    </div>
  );
}
