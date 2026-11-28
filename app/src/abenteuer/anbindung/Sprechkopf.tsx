/**
 * Der Kopf der Partie als Sprechzeile (Wunsch des Autors, 28.11.2026: „Können wir bei Aussagen des
 * Gegners und was er tut den Platz neben dem Porträt nutzen, statt ein eigenes Fenster drüber zu
 * legen?“). Links das Porträt, rechts klein der Name und darunter der Ort; spricht jemand, steht
 * sein Satz an der Stelle des Orts. Spricht jemand anderes als der Gegner (Ambrose, Juno, der Coach
 * am Rand), zeigt das Porträt für die Dauer des Satzes ihn, danach wieder den Gegner.
 *
 * Rolle im Gesamtbild: Ersetzt in der Partie (anbindung/PartieHuelle.tsx) die Sprechblasen über
 * und unter dem Brett (anbindung/Tischblase.tsx); die Sprecher legen ihre Zeilen weiter über
 * useTischblasen() in dieselbe Warteschlange (anbindung/tischblasen.ts), der Kopf zeigt die
 * älteste. Was er zeigt, rechnet anbindung/sprechkopfanzeige.ts.
 * Bedienung: Der Satz blendet sanft ein und steht nach seiner Lesedauer, beim nächsten Zug des
 * Helden (nach mindestens zwei Sekunden) oder auf Tipp nicht mehr da; dann rückt der nächste
 * nach. Höhe fest (huelle.css, Sprechkopf): Ein langer Satz bricht um und blättert in Seiten weiter
 * (Tipp oder Zeit), statt den Kopf zu vergrößern; das Brett bleibt stehen. Bildschirmleser lesen
 * jeden Satz über eine aria-live-Region vor.
 * Abhängigkeiten: anbindung/sprechkopfanzeige.ts, anbindung/tischblasen.ts, anbindung/tischkontext.ts,
 * dialog/Portraet.tsx, texte/texte.ts.
 */
import { useEffect, useRef, useState, type RefObject } from "react";
import "../sprechkopf.css";
import { Portraet } from "../dialog/Portraet";
import { tSpiel } from "../texte/texte";
import { kopfanzeige, seitendauer, zugNimmtWeg, type Kopfanzeige } from "./sprechkopfanzeige";
import { ersteZeile, type Blasenzeile } from "./tischblasen";
import { useTischblasen } from "./tischkontext";

/** Seiten eines Textfelds fester Höhe (mindestens eine). */
function seitenzahl(feld: HTMLElement): number {
  return Math.max(1, Math.ceil((feld.scrollHeight - 1) / Math.max(1, feld.clientHeight)));
}

/** Blättert eine Seite weiter; false, wenn schon die letzte Seite steht. */
function blaettere(feld: HTMLElement): boolean {
  if (feld.scrollTop + feld.clientHeight >= feld.scrollHeight - 1) return false;
  feld.scrollTop += feld.clientHeight;
  return true;
}

/**
 * Lesedauer, Zug und Tipp einer gezeigten Zeile: Nach der Seitendauer blättert sie weiter oder
 * endet; ein Zug des Helden beendet sie, wenn sie schon ZUG_NIMMT_AB_MS stand.
 */
function useZeilenzeit(
  zeile: Blasenzeile | null,
  zugzahl: number,
  feld: RefObject<HTMLSpanElement | null>,
  schliesse: (zeile: Blasenzeile) => void,
): () => void {
  const seit = useRef(0);
  // Zählt nur das Blättern, damit die Zeit der nächsten Seite neu beginnt (keine Seitennummer).
  const [seite, setzeSeite] = useState(0);
  const weiter = () => {
    if (!zeile) return;
    if (feld.current && blaettere(feld.current)) setzeSeite((s) => s + 1);
    else schliesse(zeile);
  };
  useEffect(() => {
    seit.current = Date.now();
  }, [zeile?.schluessel]);
  useEffect(() => {
    if (!zeile) return;
    const seiten = feld.current ? seitenzahl(feld.current) : 1;
    const uhr = window.setTimeout(weiter, seitendauer(zeile.text, seiten));
    return () => window.clearTimeout(uhr);
    // Neu je Zeile und je Seite; `weiter` ist bei jedem Zeichnen neu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zeile?.schluessel, seite]);
  useEffect(() => {
    if (zeile && zugNimmtWeg(Date.now() - seit.current)) schliesse(zeile);
    // Nur beim Zug des Helden.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zugzahl]);
  return weiter;
}

/** Das Porträt im Kopf; der Schlüssel je Sprecher lässt es beim Wechsel sanft einblenden. */
function Kopfbild({ anzeige, text }: { readonly anzeige: Kopfanzeige; readonly text: string }) {
  return (
    <span
      key={anzeige.sprecher ?? "ohne"}
      className="abenteuer-sprechkopf-bild"
      data-erscheinung={anzeige.geist ? "geisterhaft" : undefined}
    >
      {anzeige.sprecher && (
        <Portraet sprecher={anzeige.sprecher} stimmung={anzeige.stimmung} zeile={text} />
      )}
    </span>
  );
}

/**
 * Der Kopf der Partie. Eingaben: Name und Porträtkennung des Gegners, Ort (leer ohne Spielstand),
 * Zahl der Züge des Helden (ein neuer Zug nimmt die gezeigte Zeile weg).
 * Beispiel: Gegen Coach Delgado im Clubraum → „Coach Delgado / Clubraum der Maple Falls High“; er
 * sagt „Gut gesehen.“ → „Coach Delgado / Gut gesehen.“; danach flüstert Ambrose → Ambroses
 * Porträt, „Ambrose / Ruhig, mein Lehrling.“; dann wieder Delgado und der Ort.
 * Sonderfall: ohne Rahmen der Sprechblasen (useTischblasen() null) steht immer der Ort da.
 */
export function Sprechkopf({
  figur,
  sprecher,
  ort,
  zugzahl,
}: {
  readonly figur: string;
  readonly sprecher: string | null;
  readonly ort: string;
  readonly zugzahl: number;
}) {
  const steuerung = useTischblasen();
  const zeile = steuerung ? ersteZeile(steuerung.stand) : null;
  const anzeige = kopfanzeige({ sprecher, name: figur }, zeile);
  const feld = useRef<HTMLSpanElement>(null);
  const weiter = useZeilenzeit(zeile, zugzahl, feld, (z) =>
    steuerung?.schliesse(z.lage, z.schluessel),
  );
  return (
    <header
      className="abenteuer-huelle-kopf abenteuer-sprechkopf"
      data-testid="abenteuer-huelle-kopf"
      data-art={anzeige.art}
      data-bild={anzeige.bild}
    >
      <Kopfbild anzeige={anzeige} text={anzeige.text} />
      <div className="abenteuer-sprechkopf-rechts">
        <p className="abenteuer-huelle-figur">{anzeige.name}</p>
        {!zeile && ort && <p className="abenteuer-huelle-ort">{ort}</p>}
        {/* Die Region bleibt stehen, damit Bildschirmleser jeden neuen Satz vorlesen. */}
        <div className="abenteuer-sprechkopf-region" role="status" aria-live="polite">
          {zeile && (
            <button
              key={zeile.schluessel}
              type="button"
              className="abenteuer-sprechkopf-zeile"
              data-testid={zeile.testid}
              data-lage={zeile.lage}
              onClick={weiter}
            >
              <span className="abenteuer-sprechkopf-vorlesen">
                {tSpiel("huelle.sprecherSagt", { name: anzeige.name })}{" "}
              </span>
              <span ref={feld} className="abenteuer-sprechkopf-text">
                {zeile.text}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
