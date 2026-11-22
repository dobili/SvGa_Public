/**
 * Wahl der Figur beim Spielbeginn und im Spielmenü: Held oder Heldin (Wunsch des Autors,
 * 22.11.2026), je mit Vorschaubild (Standbild nach unten aus dem Bogen im Paket).
 *
 * Warum ein eigenes Bild statt Phaser: Die Startkarte gehört zum Kern der App und lädt den
 * Spielbaustein mit Phaser erst nach dem Start; das Vorschaubild schneidet deshalb das Standbild
 * selbst aus dem Bogen (Leinwand). Fehlt ein Bogen (die Heldin, bis der Autor sie in PixelLab
 * erstellt hat), steht ein Platzhalter da; im Spiel gilt dann der Held (regeln/heldfigur.ts).
 * Abhängigkeiten: oberwelt/figurbogen.ts (Bogen suchen, ohne Phaser), regeln/heldfigur.ts, i18n.
 */
import { useEffect, useRef, useState } from "react";
import { t } from "../../i18n/sprache";
import { figurenbildAdresse, istGrossbogen } from "../oberwelt/figurbogen";
import { HELDFIGUREN, heldbogenpfad } from "../regeln/heldfigur";
import type { Heldfigur } from "../schnittstelle/spielstand";

/** Standbild nach unten: viertes Bild der oberen Reihe (rechts, oben, links, unten; figurbilder.ts). */
const STANDBILD_UNTEN = 3;
/** Rahmen der Bögen: PixelLab 32 × 32, LimeZu 16 × 32 (figurbogen.ts). */
const GROSS = 32;
const KLEIN_BREITE = 16;
/** Kantenlänge des Vorschaubilds in Bildpunkten der Leinwand. */
const VORSCHAU = 32;

/** Zeichnet das Standbild nach unten auf die Leinwand; false, wenn der Bogen fehlt. */
async function zeichneVorschau(leinwand: HTMLCanvasElement, figur: Heldfigur): Promise<boolean> {
  const adresse = await figurenbildAdresse(heldbogenpfad(figur));
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

/** Ein Knopf der Wahl mit Vorschaubild oder Platzhalter. */
function Wahlknopf({
  figur,
  gewaehlt,
  beiWahl,
}: {
  figur: Heldfigur;
  gewaehlt: boolean;
  beiWahl: () => void;
}) {
  const leinwand = useRef<HTMLCanvasElement>(null);
  const [bildDa, setzeBildDa] = useState(false);
  useEffect(() => {
    let aktiv = true;
    const ziel = leinwand.current;
    if (!ziel) return;
    zeichneVorschau(ziel, figur)
      .then((da) => {
        if (aktiv) setzeBildDa(da);
      })
      .catch((fehler: unknown) => {
        // Kein Bild ist kein Fehler des Spiels: der Platzhalter bleibt, die Wahl geht trotzdem.
        console.warn("Schach-Abenteuer: Vorschaubild fehlt", figur, fehler);
      });
    return () => {
      aktiv = false;
    };
  }, [figur]);
  return (
    <button
      type="button"
      className="abenteuer-heldwahl-knopf"
      aria-pressed={gewaehlt}
      data-testid={`abenteuer-figur-${figur}`}
      onClick={beiWahl}
    >
      <canvas ref={leinwand} width={VORSCHAU} height={VORSCHAU} hidden={!bildDa} />
      {!bildDa && (
        <span className="abenteuer-heldwahl-platzhalter" aria-hidden="true">
          ?
        </span>
      )}
      <span>{t(`abenteuer.figur.${figur}`)}</span>
      {!bildDa && <small>{t("abenteuer.figurFolgt")}</small>}
    </button>
  );
}

/**
 * Die Wahl Held oder Heldin. Eingaben: gewählte Figur und was bei einer Wahl geschieht.
 * Beispiel: Startkarte vor dem ersten Start; Spielmenü (ändert die Figur sofort).
 */
export function Heldwahl({
  figur,
  beiWahl,
}: {
  figur: Heldfigur;
  beiWahl: (figur: Heldfigur) => void;
}) {
  return (
    <fieldset className="abenteuer-heldwahl" data-testid="abenteuer-heldwahl">
      <legend>{t("abenteuer.figurFrage")}</legend>
      {HELDFIGUREN.map((f) => (
        <Wahlknopf key={f} figur={f} gewaehlt={f === figur} beiWahl={() => beiWahl(f)} />
      ))}
    </fieldset>
  );
}
