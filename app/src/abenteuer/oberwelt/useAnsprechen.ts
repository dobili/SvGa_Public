/**
 * Hauptfiguren sprechen den Helden an (Regeln in regeln/ansprechen.ts, Wunsch des Autors,
 * 25.11.2026): Betritt der Held ein Feld vor der Figur, die das Ziel des laufenden
 * Hauptquestschritts ist (ansprechziel.ts), hält die Steuerung an, die Figur geht auf ihn zu
 * (ansprechschicht.ts), und ihr Dialog beginnt, genau der, den der Aktionsknopf öffnen würde
 * (useAusloeser.ts, sprichFigurAn).
 *
 * Rolle im Gesamtbild: Hook für oberwelt/Oberwelt.tsx, gebaut wie useBlickpunkte.ts: Er sieht in
 * einem ruhigen Takt nach (kein Eingriff in jedes Bild der Szene) und liest Stand, Welt und `frei`
 * über Refs. Gemerkt wird beim Losgehen, nicht am Ende des Gesprächs: Wer es abbricht, wird in
 * diesem Schritt nicht noch einmal angesprochen.
 * Abhängigkeiten: kern.ts, eingang.ts, ansprechziel.ts, ansprechschicht.ts, regeln/ansprechen.ts.
 */
import { useEffect, useRef } from "react";
import { ansprechGesperrt, nachAnsprechen, schonAngesprochen } from "../regeln/ansprechen";
import { figurVorDemHelden, kommZumHelden } from "./ansprechschicht";
import { ansprechziele } from "./ansprechziel";
import { eingangsdialog } from "./eingang";
import { szeneAus, type Oberweltkern } from "./kern";

/** So oft sieht der Hook nach (ms): Im Gehen legt der Held in der Zeit weniger als ein Feld zurück. */
const TAKT_MS = 200;
/**
 * Öffnet sich der Dialog nach dem Herankommen nicht (Datei fehlt), darf der Held nach dieser Zeit
 * wieder laufen (ms); sonst gibt das Ende des Dialogs die Steuerung frei (Oberwelt.tsx).
 */
const NOTFREIGABE_MS = 3000;

/**
 * Löst das Ansprechen aus, wenn der Held vor der richtigen Figur vorbeigeht.
 * Eingaben: Kern der Oberwelt; `frei` (keine Fenster, kein Menü, keine Meldung, kein Warten, kein
 * Hinweis); `sprichFigurAn` aus useAusloeser.ts.
 * Beispiel: Zwischen erster Nacht und Club geht der Held an der Bushaltestelle vorbei → Juno kommt
 * ein Feld heran, und ihr Gespräch „maple-falls-aussen.juno“ beginnt.
 * Sonderfälle: in einer Erinnerung Ambroses nie; während ein Eingangsdialog oder eine Rückmeldung
 * wartet nicht; nur beim Betreten eines Felds, nicht im Stehen.
 */
export function useAnsprechen(
  k: Oberweltkern,
  frei: boolean,
  sprichFigurAn: (name: string, vonDerFigur: boolean) => void,
): void {
  const karte = k.welt?.kennung ?? null;
  const freiRef = useRef(frei);
  const sprich = useRef(sprichFigurAn);
  useEffect(() => {
    freiRef.current = frei;
    sprich.current = sprichFigurAn;
  });
  useEffect(() => {
    if (!karte) return;
    const beginn = performance.now();
    let letzteKachel: string | null = null;
    let laeuft = false;
    const takt = window.setInterval(() => {
      const stand = k.standRef.current;
      const welt = k.weltRef.current;
      const szene = szeneAus(k.spiel);
      if (laeuft || !stand || !szene || welt?.kennung !== karte || welt.erinnerung) return;
      const { x, y } = szene.position();
      const kachel = `${x},${y}`;
      if (kachel === letzteKachel) return;
      letzteKachel = kachel;
      const ziele = ansprechziele(stand, welt.daten, karte, welt.ort.kennung).filter(
        (z) => !schonAngesprochen(stand, z.schluessel),
      );
      const zugang = ziele.length > 0 ? szene.fuehrungszugang() : null;
      const wer = zugang
        ? figurVorDemHelden(
            zugang,
            ziele.map((z) => z.figur),
            { x, y },
          )
        : null;
      const ziel = ziele.find((z) => z.figur === wer?.name);
      if (!zugang || !wer || !ziel) return;
      const wartet =
        Boolean(stand.rueckmeldungOffen) ||
        eingangsdialog(welt.ort, karte, stand.dialogvariablen) !== null;
      const lage = { frei: freiRef.current && !wartet, seitKarte: performance.now() - beginn };
      if (ansprechGesperrt({ ...lage, rennt: szene.gangart.rennt(), abstand: wer.abstand })) return;
      laeuft = true;
      k.schreibe(nachAnsprechen(stand, ziel.schluessel));
      szene.laufenErlaubt(false);
      void kommZumHelden(zugang, wer).then(() => {
        laeuft = false;
        if (k.weltRef.current?.kennung !== karte) return;
        sprich.current(wer.name, true);
        window.setTimeout(() => {
          if (freiRef.current) szeneAus(k.spiel)?.laufenErlaubt(true);
        }, NOTFREIGABE_MS);
      });
    }, TAKT_MS);
    return () => window.clearInterval(takt);
    // Je Karte (und je Neuaufbau) ein Takt; Stand, Welt und `frei` liest er über Refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [karte, k.aufbau]);
}
