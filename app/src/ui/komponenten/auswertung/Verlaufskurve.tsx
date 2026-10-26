/**
 * Verlaufskurve der Bewertung über die ganze Partie (Vorschlag H).
 *
 * Rolle im Gesamtbild: Steht über der Auswertung (Auswertung.tsx). x: Halbzug, y: Bewertung aus
 * Sicht von Weiß, auf ±5 begrenzt (Matt am Rand). Die Fläche unter der Kurve ist hell (der Anteil
 * von Weiß wie im Balken), darüber dunkel; die Nulllinie ist eingezeichnet. Fehler, verpasste
 * Chancen und Patzer sind Punkte. Die Übergänge zum Mittelspiel und zum Endspiel stehen als
 * senkrechte Linien mit „M“ und „E“ (spiel/phasen.ts, Wunsch des Autors). Ein Tipp springt zur
 * Stellung. Für Bildschirmleser und Tastatur ist die Kurve ein Bild; springen geht dort über die
 * Zugliste.
 * Wunsch des Autors (R56, 23.10.2026): Unter der Kurve stehen „Ganze Partie“ und die Phasen als
 * Knöpfe; eine Phase zieht ihren Abschnitt auf die volle Breite. Finger auf der Kurve halten und
 * fahren zeigt darüber den Zug („23. Sf5“), Loslassen springt dorthin; zwei Finger zoomen
 * (useKurvenzoom.ts).
 * Abhängigkeiten: spiel/rueckblick.ts, spiel/auswertung.ts, useKurvenzoom.ts, i18n.
 */
import type { Zugklasse, Zugurteil } from "../../../spiel/auswertung";
import type { Phase } from "../../../spiel/phasen";
import { kurvenpunkte } from "../../../spiel/rueckblick";
import { t } from "../../../i18n/sprache";
import { phasenausschnitte, useKurvenzoom, type Ausschnitt } from "./useKurvenzoom";

/** Zeichenfläche in SVG-Einheiten; das Bild passt sich der Breite an. */
const BREITE = 300;
const HOEHE = 80;
const PUNKTRADIUS = 3;
/** Schriftgröße und Abstand der Phasenbuchstaben „M“ und „E“ am oberen Rand. */
const PHASENSCHRIFT = 9;
const PHASENRAND = 2;
const FEHLERKLASSEN: ReadonlySet<Zugklasse> = new Set<Zugklasse>(["fehler", "verpasst", "patzer"]);
const PHASENBUCHSTABE: Readonly<Record<Phase, string>> = {
  eroeffnung: "",
  mittelspiel: "M",
  endspiel: "E",
};

const PHASEN_DER_KURVE: readonly Phase[] = ["eroeffnung", "mittelspiel", "endspiel"];

/** Knöpfe „Ganze Partie“ und je Phase; die gezeigte ist gedrückt. */
function Zoomknoepfe({
  phasen,
  gezeigt,
  ganz,
  beiWahl,
}: {
  phasen: Partial<Record<Phase, Ausschnitt>>;
  gezeigt: Ausschnitt;
  ganz: boolean;
  beiWahl: (a: Ausschnitt | null) => void;
}) {
  const vorhanden = PHASEN_DER_KURVE.filter((ph) => phasen[ph] !== undefined);
  if (vorhanden.length < 2) return null;
  return (
    <div className="verlaufskurve-zoom" role="group" aria-label={t("rueckblick.zoom")}>
      <button type="button" aria-pressed={ganz} onClick={() => beiWahl(null)}>
        {t("rueckblick.ganzePartie")}
      </button>
      {vorhanden.map((ph) => {
        const a = phasen[ph];
        const an = !ganz && a !== undefined && a.von === gezeigt.von && a.bis === gezeigt.bis;
        return (
          <button key={ph} type="button" aria-pressed={an} onClick={() => beiWahl(a ?? null)}>
            {t(`phase.name.${ph}`)}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Die Kurve mit Zoom und Fingerfahren.
 *
 * Eingaben: Werte je Stellung, Urteile je Halbzug, Übergänge der Phasen (Index der ersten
 * Stellung je Phase, null ohne), Sprung zu einer Stelle (0 = Startstellung), Name des Zuges vor
 * einer Stelle für die Anzeige beim Fahren (ohne: keine Anzeige).
 */
export function Verlaufskurve({
  werte,
  urteile,
  wechsel,
  beiStelle,
  zugname,
}: {
  werte: readonly number[];
  urteile: readonly Zugurteil[];
  wechsel?: Readonly<Record<Phase, number | null>>;
  beiStelle: (stelle: number) => void;
  zugname?: (stelle: number) => string;
}) {
  const zoom = useKurvenzoom(werte.length, beiStelle);
  const { von, bis } = zoom.ausschnitt;
  const punkte = kurvenpunkte(werte.slice(von, bis + 1), BREITE, HOEHE);
  if (werte.length < 2 || punkte.length < 2) return null;
  const punktAn = (stelle: number) =>
    stelle >= von && stelle <= bis ? punkte[stelle - von] : undefined;
  const linie = punkte.map((p) => `${p.x},${p.y}`).join(" ");
  const mitte = HOEHE / 2;
  const flaeche = `0,${HOEHE} ${linie} ${BREITE},${HOEHE}`;
  const fehler = urteile.filter((u) => FEHLERKLASSEN.has(u.klasse));
  const uebergaenge = (["mittelspiel", "endspiel"] as const).flatMap((ph) => {
    const stelle = wechsel?.[ph];
    const p = stelle !== null && stelle !== undefined && stelle > 0 ? punktAn(stelle) : undefined;
    return p ? [{ ph, x: p.x }] : [];
  });
  const finger = zoom.finger !== null ? punktAn(zoom.finger) : undefined;
  return (
    <div className="verlaufskurve-rahmen" data-tour="auswertung-kurve">
      <p className="verlaufskurve-finger" aria-live="polite">
        {zoom.finger !== null && zugname ? zugname(zoom.finger) : "\u00a0"}
      </p>
      <svg
        className="verlaufskurve"
        viewBox={`0 0 ${BREITE} ${HOEHE}`}
        role="img"
        aria-label={t("rueckblick.kurve")}
        data-testid="verlaufskurve"
        {...zoom.griffe}
      >
        <rect className="verlaufskurve-schwarz" x={0} y={0} width={BREITE} height={HOEHE} />
        <polygon className="verlaufskurve-weiss" points={flaeche} />
        <line className="verlaufskurve-null" x1={0} y1={mitte} x2={BREITE} y2={mitte} />
        <polyline className="verlaufskurve-linie" points={linie} />
        {uebergaenge.map(({ ph, x }) => (
          <g key={ph} className="verlaufskurve-phase">
            <line x1={x} y1={0} x2={x} y2={HOEHE} />
            <text x={x + PHASENRAND} y={PHASENSCHRIFT + PHASENRAND} fontSize={PHASENSCHRIFT}>
              {PHASENBUCHSTABE[ph]}
            </text>
          </g>
        ))}
        {fehler.map((u) => {
          const p = punktAn(u.index + 1);
          return p ? (
            <circle
              key={u.index}
              className="verlaufskurve-fehler"
              cx={p.x}
              cy={p.y}
              r={PUNKTRADIUS}
            />
          ) : null;
        })}
        {finger && (
          <line className="verlaufskurve-zeiger" x1={finger.x} y1={0} x2={finger.x} y2={HOEHE} />
        )}
      </svg>
      <Zoomknoepfe
        phasen={phasenausschnitte(werte.length, wechsel)}
        gezeigt={zoom.ausschnitt}
        ganz={zoom.ganz}
        beiWahl={zoom.zeige}
      />
    </div>
  );
}
