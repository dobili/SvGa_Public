/**
 * Echte Vorschau eines Extras (Gestaltung „Deine Extras neu“, 31.10.2026): das eigene Porträt mit
 * dem Rahmen, ein Brettausschnitt in den Brettfarben oder mit dem Figurensatz, Konfetti in den
 * Farben, ein runder Orden für den Titel (das Titelband steht in der Vorschau oben).
 *
 * Rolle im Gesamtbild: Die Kacheln der Profilkarte „Deine Extras“ zeigen, wie ein Extra am Leser
 * aussieht, nicht ein Sinnbild. Je Art eine Zeile in `VORSCHAUEN`; eine neue Art ohne Zeile zeigt
 * das Bild aus training/extras.ts (Feld `bild`). Alles ist Schmuck (aria-hidden), der Name steht
 * als Text auf der Kachel.
 * Abhängigkeiten: app/konfetti.ts, app/einstellungen.ts, training/extras.ts, profil/Spielerbild,
 * bausteine/Vorschauwahl (Brettausschnitt), i18n, lucide-react, Stil in ui/stil/extras.css.
 */
import { Award } from "lucide-react";
import type { ReactNode } from "react";
import type { Brettfarben, Einstellungen, Figurensatz } from "../../../app/einstellungen";
import { KONFETTIPALETTEN, type Konfettipalette } from "../../../app/konfetti";
import { istTextschluessel, t } from "../../../i18n/sprache";
import type { Spielerprofil } from "../../../speicher/profil";
import type { Extra, Extraart } from "../../../training/extras";
import { Spielerbild } from "../../profil/Spielerbild";
import { Brettausschnitt } from "../bausteine/Vorschauwahl";

/** Was eine Vorschau vom Leser braucht: Profil (Porträt) und Einstellungen (Brett, Figuren). */
export interface Vorschaukontext {
  readonly profil: Spielerprofil;
  readonly einstellungen: Einstellungen;
}

/** Zahl der Konfettistreifen und Größe der Zeichenfläche (Einheiten der viewBox). */
const STREIFEN = 22;
const FLAECHE = 100;
/** Faktoren eines einfachen Zufallsgenerators (linear kongruent), damit das Bild stets gleich ist. */
const LCG_FAKTOR = 1103515245;
const LCG_SUMMAND = 12345;
const LCG_MODUL = 2 ** 31;
/** Maße eines Streifens (Einheiten der viewBox). */
const STREIFENBREITE = 1.8;
const STREIFENHOEHE = 4.5;
const STREIFENRUNDUNG = 0.6;
/** Streifen auf den Kacheln (64 px) doppelt so groß wie in der Vorschau oben. */
const KACHELMASSSTAB = 2;
/** Größte Drehung eines Streifens in Grad (nach beiden Seiten). */
const DREHUNG = 60;
/** Größe des Zeichens im Titelband. */
const BANDZEICHEN = 14;
/** Größe des Zeichens im runden Titelorden der Kachel. */
const TITELZEICHEN = 28;

/** Feste Folge von Zahlen zwischen 0 und 1 (immer dieselbe, damit die Bilder ruhig bleiben). */
function zufallsfolge(anzahl: number): number[] {
  let zahl = 7;
  return Array.from({ length: anzahl }, () => {
    zahl = (zahl * LCG_FAKTOR + LCG_SUMMAND) % LCG_MODUL;
    return zahl / LCG_MODUL;
  });
}

/** Streifen fürs Konfetti: Lage, Drehung und Farbstelle, vorab einmal berechnet. */
const STREIFENLAGE = (() => {
  const z = zufallsfolge(STREIFEN * 4);
  return Array.from({ length: STREIFEN }, (_, i) => ({
    x: (z[i * 4] ?? 0) * FLAECHE,
    y: (z[i * 4 + 1] ?? 0) * FLAECHE,
    drehung: ((z[i * 4 + 2] ?? 0) * 2 - 1) * DREHUNG,
    farbe: z[i * 4 + 3] ?? 0,
  }));
})();

/**
 * Konfetti in den Farben einer Palette, als ruhiges Bild ohne Bewegung.
 * Beispiel: „bunt“ → rote, grüne, blaue … Streifen; Unbekanntes → Farben der App.
 */
export function Konfettibild({
  palette,
  className,
  massstab = 1,
}: {
  palette: string;
  className?: string;
  /** Größe der Streifen; auf kleinen Kacheln größer, damit man sie erkennt. */
  massstab?: number;
}) {
  const farben = KONFETTIPALETTEN[palette as Konfettipalette] ?? KONFETTIPALETTEN.app;
  return (
    <svg
      className={className ?? "konfettibild"}
      viewBox={`0 0 ${FLAECHE} ${FLAECHE}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {STREIFENLAGE.map((s, i) => (
        <rect
          key={i}
          x={s.x}
          y={s.y}
          width={STREIFENBREITE * massstab}
          height={STREIFENHOEHE * massstab}
          rx={STREIFENRUNDUNG * massstab}
          style={{ fill: farben[Math.floor(s.farbe * farben.length)] }}
          transform={`rotate(${s.drehung.toFixed(0)} ${s.x.toFixed(1)} ${s.y.toFixed(1)})`}
        />
      ))}
    </svg>
  );
}

/** Text eines Titels („taktiker“ → „Taktiker“); unbekannt oder „ohne“ → null. */
function titeltext(wert: string): string | null {
  const schluessel = `themen.titel.${wert}`;
  return istTextschluessel(schluessel) ? t(schluessel) : null;
}

/** Der Titel als goldenes Band mit Zeichen. Beispiel: „taktiker“ → [Orden] Taktiker. */
export function Titelband({ wert }: { wert: string }) {
  const text = titeltext(wert);
  if (!text) return null;
  return (
    <span className="titelband" data-testid="titelband">
      <Award size={BANDZEICHEN} aria-hidden="true" />
      {text}
    </span>
  );
}

/** Je Art die Vorschau eines Werts; eine neue Art bekommt hier eine Zeile. */
const VORSCHAUEN: Partial<
  Readonly<Record<Extraart, (wert: string, kontext: Vorschaukontext) => ReactNode>>
> = {
  rahmen: (wert, k) => (
    <span className="extravorschau-portraet">
      <Spielerbild profil={k.profil} rahmen={wert} />
    </span>
  ),
  brett: (wert, k) => (
    <Brettausschnitt farben={wert as Brettfarben} satz={k.einstellungen.figurensatz} />
  ),
  figuren: (wert, k) => (
    <Brettausschnitt farben={k.einstellungen.brettfarben} satz={wert as Figurensatz} />
  ),
  konfetti: (wert) => (
    <Konfettibild palette={wert} className="extravorschau-konfetti" massstab={KACHELMASSSTAB} />
  ),
  // Auf der Kachel ein runder Orden statt des Bandes: Das Band passt nicht in ein Drittel der
  // Breite, und der Titel steht ohnehin als Name darunter.
  titel: () => (
    <span className="extravorschau-titel">
      <Award size={TITELZEICHEN} aria-hidden="true" />
    </span>
  ),
};

/** Die Vorschau eines Extras; ohne eigene Zeile das Bild aus der Liste der Extras. */
export function Extravorschau({ extra, kontext }: { extra: Extra; kontext: Vorschaukontext }) {
  const vorschau = VORSCHAUEN[extra.art];
  if (vorschau) return <>{vorschau(extra.wert, kontext)}</>;
  return (
    <img className="extravorschau-bild" src={`${import.meta.env.BASE_URL}${extra.bild}`} alt="" />
  );
}
