/**
 * Blickpunkte in der Oberwelt (Regeln in regeln/blickpunkte.ts): Kommt der Held zum ersten Mal in
 * die Nähe einer Stelle aus ambrose_blickpunkte.json, spielt die Hülle ihren Knoten aus
 * ambrose-blick.ink, wenn Ambrose da ist, die Welt frei ist, die Ankunftsruhe vorbei ist und der
 * letzte Blickpunkt 30 Sekunden zurückliegt.
 *
 * Rolle im Gesamtbild: Hook für oberwelt/Oberwelt.tsx. Er sieht in einem ruhigen Takt nach (kein
 * Eingriff in die Szene), merkt den Knoten als gesehen (Dialogvariable `<knoten>_gesehen`) und
 * öffnet ihn wie jeden Dialog; der Geist erscheint dann von selbst neben dem Helden
 * (useBuehne.ts). Die Uhr der Pause lebt, solange die Oberwelt offen ist, über Kartenwechsel hinweg.
 * Abhängigkeiten: kern.ts, eingang.ts, dialog/dialogdatei.ts, dialog/geschichte.ts,
 * paket/paketlader.ts, regeln/blickpunkte.ts.
 */
import { useEffect, useRef, useState } from "react";
import { ladeDialog } from "../dialog/dialogdatei";
import { knotennamenAus } from "../dialog/geschichte";
import { liesPaketJson } from "../paket/paketlader";
import {
  BLICK_DATEI,
  BLICKPUNKTE_PFAD,
  BLICKUHR_START,
  blickBereit,
  blickpunktHier,
  blicktakt,
  blickvariable,
  liesBlickpunkte,
  nachAnkunft,
  nachBlickpunkt,
  type Blickpunkt,
} from "../regeln/blickpunkte";
import { eingangsdialog } from "./eingang";
import { szeneAus, type Oberweltkern } from "./kern";

/** So oft sieht der Hook nach (ms): Im Gehen legt der Held in der Zeit weniger als ein Feld zurück. */
const TAKT_MS = 250;

/** Blickpunkte und die Knoten, die es zu ihnen gibt. */
interface Blickdaten {
  readonly punkte: readonly Blickpunkt[];
  readonly knoten: ReadonlySet<string>;
}

const KEINE: Blickdaten = { punkte: [], knoten: new Set() };

/** Die Daten, einmal je Sitzung geladen. */
let geladen: Promise<Blickdaten> | null = null;

/** Lädt Blickpunkte und Knotennamen aus dem Paket; ohne die Dateien gibt es keine Blickpunkte. */
function ladeBlickdaten(): Promise<Blickdaten> {
  geladen ??= Promise.all([liesPaketJson<unknown>(BLICKPUNKTE_PFAD), ladeDialog(BLICK_DATEI)]).then(
    ([roh, dialog]) => ({
      punkte: liesBlickpunkte(roh),
      knoten: new Set(knotennamenAus(JSON.stringify(dialog))),
    }),
    (fehler: unknown) => {
      // Ein älteres Paket hat die Dateien noch nicht: Das Spiel läuft ohne Blickpunkte weiter.
      console.warn("Blickpunkte nicht geladen:", fehler);
      return KEINE;
    },
  );
  return geladen;
}

/** Die Blickdaten, sobald eine Welt geladen ist; bis dahin leer. */
function useBlickdaten(bereit: boolean): Blickdaten {
  const [daten, setzeDaten] = useState(KEINE);
  useEffect(() => {
    if (!bereit) return;
    let aktiv = true;
    void ladeBlickdaten().then((d) => {
      if (aktiv) setzeDaten(d);
    });
    return () => {
      aktiv = false;
    };
  }, [bereit]);
  return daten;
}

/**
 * Löst den Blickpunkt aus, in dessen Nähe der Held gerade ist.
 * Eingaben: Kern der Oberwelt; `frei` (kein Fenster, keine Meldung, kein Warten, kein
 * Aktionsknopf); `oeffneDialog` aus useDialogende.ts.
 * Beispiel: Der Held geht im Park von Maple Falls am Kiosk vorbei → „ambrose-blick.
 * blick_mapleFalls_park_kiosk“ öffnet sich, einmal.
 * Sonderfälle: Die Variable wird beim Öffnen gesetzt, nicht am Ende; wer den Dialog mit „Zurück“
 * abbricht, hört ihn nicht noch einmal. Liegt der letzte Blickpunkt keine 30 Sekunden zurück,
 * wartet die Stelle, bis der Held wieder vorbeikommt.
 */
export function useBlickpunkte(
  k: Oberweltkern,
  frei: boolean,
  oeffneDialog: (verweis: string) => void,
): void {
  const karte = k.welt?.kennung ?? null;
  const daten = useBlickdaten(karte !== null);
  const freiRef = useRef(frei);
  const oeffne = useRef(oeffneDialog);
  const uhr = useRef(BLICKUHR_START);
  useEffect(() => {
    freiRef.current = frei;
    oeffne.current = oeffneDialog;
  });
  const hatPunkte = karte !== null && daten.punkte.some((p) => p.karte === karte);
  useEffect(() => {
    if (!karte || !hatPunkte) return;
    uhr.current = nachAnkunft(uhr.current);
    const takt = window.setInterval(() => {
      const stand = k.standRef.current;
      const welt = k.weltRef.current;
      const szene = szeneAus(k.spiel);
      if (!stand || !szene || welt?.kennung !== karte || welt.erinnerung) return;
      const variablen = stand.dialogvariablen;
      const wartet =
        Boolean(stand.rueckmeldungOffen) || eingangsdialog(welt.ort, karte, variablen) !== null;
      uhr.current = blicktakt(uhr.current, TAKT_MS, freiRef.current && !wartet);
      if (!blickBereit(uhr.current)) return;
      const { x, y } = szene.position();
      const punkt = blickpunktHier(daten.punkte, { karte, x, y, variablen, knoten: daten.knoten });
      if (!punkt) return;
      uhr.current = nachBlickpunkt();
      const gesehen = { ...variablen, [blickvariable(punkt.knoten)]: true };
      k.schreibe({ ...stand, dialogvariablen: gesehen });
      oeffne.current(`${BLICK_DATEI}.${punkt.knoten}`);
    }, TAKT_MS);
    return () => window.clearInterval(takt);
    // Je Karte ein Takt; Stand, Welt und `frei` liest er über Refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [karte, hatPunkte, daten]);
}
