/**
 * Baustein „Fortsetzung durchspielen mit Balken“: eine Zugfolge Zug für Zug ansehen, links der
 * Bewertungsbalken, der live mitläuft.
 *
 * Rolle im Gesamtbild: Regel E des Nebenchats (Wunsch des Autors, 30.10.2026): Wo die Antwort
 * eines Trainers an einer Engine-Bewertung hängt, zeigt die App nach der Entscheidung die
 * Fortsetzung mit Balken. Genutzt von „Falle oder Köder“ (Widerlegung vorspielen) und vom
 * Abweichungsmodus (bester Zug gegen Zielzug). Der Balken selbst stammt aus dem Rückblick nach
 * der Partie und wird nur eingebunden (ui/komponenten/rueckblick, gesperrter Bereich).
 * Abhängigkeiten: Brettbereich, useBrettbedienung, Bewertungsbalken, useBalkenwert,
 * schach/weiterspielen.ts, training/uebungsaufgabe.ts (stellungNach), i18n.
 */
import { useEffect, useMemo, useState } from "react";
import type { Markierung } from "../../analyse/werkzeug";
import { sprache, t } from "../../i18n/sprache";
import { sanInSprache } from "../../schach/notation";
import { stellungAusFen } from "../../schach/stellung";
import { zugFelder } from "../../schach/weiterspielen";
import { stellungNach } from "../../training/uebungsaufgabe";
import { Brettbereich } from "../komponenten/brettbedienung/Brettbereich";
import { useBrettbedienung } from "../komponenten/brettbedienung/useBrettbedienung";
import { Bewertungsbalken } from "../komponenten/rueckblick/Bewertungsbalken";
import { useBalkenwert } from "./useBalkenwert";

/** Beim Vorspielen ein Zug je so viele Millisekunden (Zeit, den Balken zu sehen). */
const VORSPIEL_TAKT_MS = 1600;
const KEINE_WAHL = () => undefined;

/** Ziehen ist hier nicht vorgesehen: Das Brett zeigt nur die Folge. */
const NUR_ANSEHEN = () => "ungueltig" as const;

/** Blätterknöpfe: zum Anfang, zurück, vor, vorspielen. */
function Blaettern({
  stelle,
  laenge,
  setze,
  spielt,
  setzeSpielt,
}: {
  stelle: number;
  laenge: number;
  setze: (stelle: number) => void;
  spielt: boolean;
  setzeSpielt: (spielt: boolean) => void;
}) {
  return (
    <div className="knopfzeile folgespieler-knoepfe">
      <button
        type="button"
        className="chip"
        disabled={stelle === 0}
        onClick={() => setze(0)}
        aria-label={t("folgespieler.anfang")}
      >
        ⏮
      </button>
      <button
        type="button"
        className="chip"
        disabled={stelle === 0}
        onClick={() => setze(stelle - 1)}
        aria-label={t("folgespieler.zurueck")}
      >
        ◀
      </button>
      <button
        type="button"
        className="chip"
        disabled={stelle >= laenge}
        onClick={() => setze(stelle + 1)}
        aria-label={t("folgespieler.vor")}
      >
        ▶
      </button>
      <button
        type="button"
        className="chip"
        aria-pressed={spielt}
        onClick={() => setzeSpielt(!spielt)}
      >
        {t(spielt ? "folgespieler.anhalten" : "folgespieler.vorspielen")}
      </button>
    </div>
  );
}

/**
 * Die Zugfolge mit Brett, Balken und Blätterknöpfen.
 *
 * Eingaben: Ausgangsstellung, Züge (englische Kurznotation wie in den Daten), Überschrift,
 * gedreht (Sicht der Seite des Lesers), zusätzliche Markierungen der Ausgangsstellung.
 * Beispiel: Falle aus Abb. 4.2: 1... Txa2? 2. Lb3 → nach dem Vorspielen zeigt der Balken, wie
 * die Stellung nach der Widerlegung kippt.
 */
export function Folgespieler({
  startFen,
  zuege,
  titel,
  gedreht,
  testid = "folgespieler",
}: {
  startFen: string;
  zuege: readonly string[];
  titel: string;
  gedreht: boolean;
  testid?: string;
}) {
  const [stelle, setzeStelle] = useState(0);
  const [spielt, setzeSpielt] = useState(false);
  // Am Ende der Folge hält das Vorspielen von selbst an (abgeleitet, kein eigener Zustand).
  const laeuft = spielt && stelle < zuege.length;
  useEffect(() => {
    if (!laeuft) return undefined;
    const zeit = setTimeout(() => setzeStelle(stelle + 1), VORSPIEL_TAKT_MS);
    return () => clearTimeout(zeit);
  }, [laeuft, stelle]);
  const schalteVorspielen = (an: boolean) => {
    if (an && stelle >= zuege.length) setzeStelle(0);
    setzeSpielt(an);
  };
  const fen = useMemo(
    () => stellungNach(startFen, zuege.slice(0, stelle)),
    [startFen, zuege, stelle],
  );
  const wert = useBalkenwert(fen);
  const stellung = useMemo(() => stellungAusFen(fen), [fen]);
  const bedienung = useBrettbedienung({ fen, spiele: NUR_ANSEHEN }, null, KEINE_WAHL);
  const letzter =
    stelle > 0
      ? zugFelder(stellungNach(startFen, zuege.slice(0, stelle - 1)), zuege[stelle - 1] ?? "")
      : null;
  const markierungen: Markierung[] = letzter ? [{ typ: "pfeil", farbe: "gold", ...letzter }] : [];
  if (!stellung.ok) return null;
  return (
    <section className="karte folgespieler" data-testid={testid}>
      <p>
        <strong>{titel}</strong>
      </p>
      <Brettbereich
        stellung={stellung.wert}
        markierungen={markierungen}
        letzterZug={letzter}
        bedienung={bedienung}
        beschriftung={titel}
        anfangsGedreht={gedreht}
        seitenleiste={(g) => <Bewertungsbalken wert={wert ?? 0} gedreht={g} />}
      />
      <ol className="folgespieler-zuege">
        {zuege.map((zug, i) => (
          <li key={`${i}-${zug}`}>
            <button
              type="button"
              className="knopf-link"
              aria-current={i + 1 === stelle ? "step" : undefined}
              onClick={() => setzeStelle(i + 1)}
            >
              {sanInSprache(zug, sprache())}
            </button>
          </li>
        ))}
      </ol>
      <Blaettern
        stelle={stelle}
        laenge={zuege.length}
        setze={setzeStelle}
        spielt={laeuft}
        setzeSpielt={schalteVorspielen}
      />
    </section>
  );
}

/** Eine Zugfolge zur Wahl: Name auf dem Knopf und Züge. */
export interface Folgenlinie {
  readonly name: string;
  readonly zuege: readonly string[];
}

/**
 * Mehrere Zugfolgen derselben Stellung zum Vergleichen: Knöpfe wählen die Folge, darunter der
 * Folgespieler mit Balken (Denkroutine: Engine-Zug gegen die eigenen Kandidaten; Abweichungsmodus:
 * bester Zug gegen Zielzug). Beispiel: „Engine: Lxh7+“, „Dein Kandidat Dc2“.
 */
export function Folgenwahl({
  startFen,
  linien,
  titel,
  gedreht,
  testid = "folgenwahl",
}: {
  startFen: string;
  linien: readonly Folgenlinie[];
  titel: string;
  gedreht: boolean;
  testid?: string;
}) {
  const [gewaehlt, setzeGewaehlt] = useState(0);
  const linie = linien[gewaehlt] ?? linien[0];
  if (!linie) return null;
  return (
    <div className="folgenwahl" data-testid={testid}>
      <div className="knopfzeile folgenwahl-knoepfe" role="group" aria-label={titel}>
        {linien.map((l, i) => (
          <button
            key={`${l.name}-${l.zuege.join(" ")}`}
            type="button"
            className="chip"
            aria-pressed={i === gewaehlt}
            onClick={() => setzeGewaehlt(i)}
          >
            {l.name}
          </button>
        ))}
      </div>
      <Folgespieler
        key={gewaehlt}
        startFen={startFen}
        zuege={linie.zuege}
        titel={`${titel}: ${linie.name}`}
        gedreht={gedreht}
        testid={`${testid}-spieler`}
      />
    </div>
  );
}
