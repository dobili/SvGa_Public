/**
 * Wahl der Figuren beim Spielbeginn: Held oder Heldin, Rivale Victor oder Rivalin Victoria (Wunsch
 * des Autors, 22.11.2026), je mit Vorschaubild (Standbild nach unten aus dem Bogen im Paket). Die
 * Wahl gilt für das ganze Spiel; das Spielmenü zeigt sie nur noch an (Wunsch des Autors,
 * 24.11.2026).
 *
 * Warum ein eigenes Bild statt Phaser: Die Startkarte gehört zum Kern der App und lädt den
 * Spielbaustein mit Phaser erst nach dem Start; das Vorschaubild schneidet deshalb das Standbild
 * selbst aus dem Bogen (Leinwand). Fehlt ein Bogen (die Heldin, bis der Autor sie in PixelLab
 * erstellt hat, ebenso Victoria), steht ein Platzhalter da; im Spiel gilt dann der Held
 * (regeln/heldfigur.ts) bzw. der Bogen von Victor (regeln/rivalform.ts).
 * Abhängigkeiten: oberwelt/figurbogen.ts (Bogen suchen, ohne Phaser), regeln/heldfigur.ts, i18n.
 */
import { useEffect, useRef, useState } from "react";
import { t, type Textschluessel } from "../../i18n/sprache";
import { figurenbildAdresse, istGrossbogen } from "../oberwelt/figurbogen";
import { HELDFIGUREN } from "../regeln/heldfigur";
import type { Heldfigur } from "../schnittstelle/spielstand";

/** Standbild nach unten: viertes Bild der oberen Reihe (rechts, oben, links, unten; figurbilder.ts). */
const STANDBILD_UNTEN = 3;
/** Rahmen der Bögen: PixelLab 32 × 32, LimeZu 16 × 32 (figurbogen.ts). */
const GROSS = 32;
const KLEIN_BREITE = 16;
/** Kantenlänge des Vorschaubilds in Bildpunkten der Leinwand. */
const VORSCHAU = 32;

/** Zeichnet das Standbild nach unten auf die Leinwand; false, wenn der Bogen fehlt. */
async function zeichneVorschau(leinwand: HTMLCanvasElement, bogen: string): Promise<boolean> {
  const adresse = await figurenbildAdresse(`figuren/${bogen}.png`);
  const stift = leinwand.getContext("2d");
  if (!adresse || !stift) return false;
  const bild = new Image();
  bild.src = adresse;
  await bild.decode();
  const breite = istGrossbogen(adresse) ? GROSS : KLEIN_BREITE;
  stift.imageSmoothingEnabled = false;
  stift.clearRect(0, 0, VORSCHAU, VORSCHAU);
  const links = (VORSCHAU - breite) / 2;
  stift.drawImage(bild, STANDBILD_UNTEN * breite, 0, breite, GROSS, links, 0, breite, GROSS);
  return true;
}

/** Eine Möglichkeit der Wahl: Bogen im Paket (figuren/<bogen>.png) und Textschlüssel. */
interface Wahl {
  readonly bogen: string;
  readonly text: Textschluessel;
  readonly testid: string;
}

/** Ein Knopf der Wahl mit Vorschaubild oder Platzhalter. */
function Wahlknopf({
  wahl,
  gewaehlt,
  beiWahl,
}: {
  wahl: Wahl;
  gewaehlt: boolean;
  beiWahl: () => void;
}) {
  const { bogen } = wahl;
  const leinwand = useRef<HTMLCanvasElement>(null);
  const [bildDa, setzeBildDa] = useState(false);
  useEffect(() => {
    let aktiv = true;
    const ziel = leinwand.current;
    if (!ziel) return;
    zeichneVorschau(ziel, bogen)
      .then((da) => {
        if (aktiv) setzeBildDa(da);
      })
      .catch((fehler: unknown) => {
        // Kein Bild ist kein Fehler des Spiels: der Platzhalter bleibt, die Wahl geht trotzdem.
        console.warn("Schach-Abenteuer: Vorschaubild fehlt", bogen, fehler);
      });
    return () => {
      aktiv = false;
    };
  }, [bogen]);
  return (
    <button
      type="button"
      className="abenteuer-heldwahl-knopf"
      aria-pressed={gewaehlt}
      data-testid={wahl.testid}
      onClick={beiWahl}
    >
      <canvas ref={leinwand} width={VORSCHAU} height={VORSCHAU} hidden={!bildDa} />
      {!bildDa && (
        <span className="abenteuer-heldwahl-platzhalter" aria-hidden="true">
          ?
        </span>
      )}
      <span>{t(wahl.text)}</span>
      {!bildDa && <small>{t("abenteuer.figurFolgt")}</small>}
    </button>
  );
}

/** Eine Reihe Wahlknöpfe unter einer Frage. */
function Figurwahl({
  frage,
  testid,
  wahlen,
  gewaehlt,
  beiWahl,
}: {
  frage: Textschluessel;
  testid: string;
  wahlen: readonly Wahl[];
  gewaehlt: number;
  beiWahl: (index: number) => void;
}) {
  return (
    <fieldset className="abenteuer-heldwahl" data-testid={testid}>
      <legend>{t(frage)}</legend>
      {wahlen.map((w, i) => (
        <Wahlknopf key={w.bogen} wahl={w} gewaehlt={i === gewaehlt} beiWahl={() => beiWahl(i)} />
      ))}
    </fieldset>
  );
}

/** Held und Heldin: Bogen und Text heißen wie die Figur. */
const HELDWAHLEN: readonly Wahl[] = HELDFIGUREN.map((f) => ({
  bogen: f,
  text: f === "heldin-0" ? "abenteuer.figur.heldin-0" : "abenteuer.figur.held-0",
  testid: `abenteuer-figur-${f}`,
}));

/**
 * Die Wahl Held oder Heldin. Eingaben: gewählte Figur und was bei einer Wahl geschieht.
 * Beispiel: Startkarte vor dem ersten Start.
 */
export function Heldwahl({
  figur,
  beiWahl,
}: {
  figur: Heldfigur;
  beiWahl: (figur: Heldfigur) => void;
}) {
  return (
    <Figurwahl
      frage="abenteuer.figurFrage"
      testid="abenteuer-heldwahl"
      wahlen={HELDWAHLEN}
      gewaehlt={HELDFIGUREN.indexOf(figur)}
      beiWahl={(i) => beiWahl(HELDFIGUREN[i] ?? figur)}
    />
  );
}

/** Rivale und Rivalin; die Bögen von Victoria folgen (bis dahin Platzhalter). */
const RIVALWAHLEN: readonly Wahl[] = [
  { bogen: "victor", text: "abenteuer.rivale.victor", testid: "abenteuer-rivale-victor" },
  { bogen: "victoria", text: "abenteuer.rivale.victoria", testid: "abenteuer-rivale-victoria" },
];

/**
 * Die Wahl Rivale Victor oder Rivalin Victoria (nach der Heldenwahl). Eingaben: ob die Rivalin
 * gewählt ist und was bei einer Wahl geschieht.
 */
export function Rivalwahl({
  rivalin,
  beiWahl,
}: {
  rivalin: boolean;
  beiWahl: (rivalin: boolean) => void;
}) {
  return (
    <Figurwahl
      frage="abenteuer.rivaleFrage"
      testid="abenteuer-rivalwahl"
      wahlen={RIVALWAHLEN}
      gewaehlt={rivalin ? 1 : 0}
      beiWahl={(i) => beiWahl(i === 1)}
    />
  );
}
