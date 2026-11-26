/**
 * Bühnenregie der Oberwelt (Atmosphäre T6 und T9): wendet die Bühnenanweisungen jeder
 * Dialogzeile auf die Karte an und stellt am Dialogende das Licht der Karte wieder her.
 *
 * Rolle im Gesamtbild: Oberwelt.tsx gibt `zeile` und `ende` an den Dialog weiter. Die Anweisungen
 * liest buehne.ts, das Blenden der Figuren macht figurblende.ts, das Licht die Tönungsschicht der
 * Szene (mit zwei Sekunden Umblenden). Geführte Wege (`#gehe`, `#stelle`, gefuehrterweg.ts) gehen
 * an die Szene; solange einer läuft, meldet `laeuft` dem Dialog, dass er warten soll. `#uhr:abend`
 * oder `#uhr:22` stellt die Spieluhr (Geschichte geht vor, regeln/spieluhr.ts); am Dialogende gilt
 * dann das Licht der neuen Zeit. Spricht der Geist und steht er nicht auf der Karte, erscheint er
 * als Begleiter neben dem Helden und blendet am Dialogende aus (begleiterschicht.ts).
 * `#schwenk:ZIEL` (26.11.2026, schwenk.ts) fährt die Kamera zu dem, was die Zeile beschreibt; der
 * Held bleibt stehen. Jede neue Zeile lässt einen laufenden Schwenk ans Ziel springen; `#gehe`,
 * `#stelle` und das Dialogende holen die Kamera zum Helden zurück.
 * Abhängigkeiten: kern.ts, buehne.ts, figurblende.ts, gefuehrterweg.ts, fuehrungsschicht.ts,
 * begleiterschicht.ts, schwenkschicht.ts, regeln/begleiter.ts.
 */
import { useRef, useState } from "react";
import { fuehre, stehAuf, stelle } from "./fuehrungsschicht";
import { wendeZu, wendeZurueck } from "./zuwendungsschicht";
import { stellauftrag, wegauftraege } from "./gefuehrterweg";
import { buehnenanweisung } from "./buehne";
import { blendeFigur } from "./figurblende";
import { szeneAus, type Oberweltkern } from "./kern";
import { zeigeKartenteilchen, zeigeTeilchen } from "./teilchen";
import { spielminuteJetzt, uhrNachAngabe } from "../regeln/spieluhr";
import { toenungJetzt } from "./uhrtoenung";
import { verabschiedeBegleiter, zeigeBegleiter } from "./begleiterschicht";
import { begleiterErscheint } from "../regeln/begleiter";
import { geistsprecher } from "../regeln/geist";
import { ambroseNichtDa } from "../regeln/abwesenheit";
import { setzeFahrt } from "./schwenkfahrt";
import { schwenkAmZiel, schwenkeKamera, schwenkeZurueck, type Dialoglage } from "./schwenkschicht";
import type { Fuehrungszugang } from "./fuehrungsschicht";

/** Bewegung reduziert (Systemeinstellung)? Dann springt die Kamera statt zu fahren. */
function ruhig(): boolean {
  return typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
}

/** Lage des Dialogfensters (dialog/Dialog.tsx) auf dem Bildschirm, oder null. */
function dialoglage(): Dialoglage {
  const fenster = document.querySelector("[data-testid='abenteuer-dialog']");
  // Eine Sprechblase bei der Figur ist kein Fenster am Rand; sie verdeckt keinen Streifen.
  if (!fenster || fenster.classList.contains("abenteuer-sprechblase")) return null;
  const r = fenster.getBoundingClientRect();
  return { links: r.left, oben: r.top };
}

/** So viele Bilder wartet ein Schwenk höchstens auf die Szene (gut eine Sekunde). */
const SCHWENK_WARTEBILDER = 90;

/**
 * Kamera zur Zeile: Ein laufender Schwenk springt ans Ziel; wer geht, wird wieder verfolgt; ein
 * Schwenk-Tag fährt zum Ziel, sobald das Fenster der Zeile steht (es verdeckt den unteren Rand); die
 * Zeile selbst erscheint erst am Ziel (schwenkschicht.ts, Speicher der Fahrt).
 * Die erste Zeile eines Eingangs kommt, bevor die neue Karte ihren Helden aufgestellt hat; dann
 * wartet der Schwenk Bild für Bild auf den Zugang der Szene (höchstens SCHWENK_WARTEBILDER).
 */
function schwenkeZurZeile(
  zugang: () => Fuehrungszugang | null,
  tags: Readonly<Record<string, string>>,
): void {
  const jetzt = zugang();
  if (jetzt) schwenkAmZiel(jetzt);
  if (tags.gehe !== undefined || tags.stelle !== undefined) {
    if (jetzt) schwenkeZurueck(jetzt, ruhig());
    return;
  }
  const ziel = tags.schwenk;
  if (ziel === undefined) return;
  // Die Zeile wartet von Anfang an (kein kurzes Aufblitzen vor der Fahrt), außer bei ruhiger Bewegung.
  if (!ruhig()) setzeFahrt(true);
  let bilder = 0;
  const versuche = () => {
    const z = zugang();
    const ergebnis = z ? schwenkeKamera(z, ziel, dialoglage(), ruhig()) : "wartet";
    if (ergebnis === "faehrt") return;
    if (ergebnis === "wartet" && ++bilder < SCHWENK_WARTEBILDER) {
      requestAnimationFrame(versuche);
      return;
    }
    setzeFahrt(false); // Ziel unbekannt oder Szene zu lange nicht bereit: die Zeile kommt gleich.
  };
  requestAnimationFrame(versuche);
}

/** Rückrufe für den Dialog. */
export interface Buehne {
  /** Eine neue Zeile mit ihren Tags. */
  readonly zeile: (tags: Readonly<Record<string, string>>) => void;
  /** Der Dialog ist zu Ende: Licht der Karte zurück. */
  readonly ende: () => void;
  /** Läuft gerade ein geführter Weg? Dann wartet der Dialog („Weiter“ und Wahlen gesperrt). */
  readonly laeuft: boolean;
}

/** Die Bühnenregie für den Kern der Oberwelt. Eingabe: Kern. Ausgabe: Rückrufe für den Dialog. */
export function useBuehne(k: Oberweltkern): Buehne {
  // Hat der Dialog das Licht verändert? Nur dann wird es am Ende zurückgestellt.
  const lichtGeaendert = useRef(false);
  const teilchenGeaendert = useRef(false);
  const uhrGeaendert = useRef(false);
  /** `#uhr:abend` oder `#uhr:22`: Die Geschichte stellt die Spieluhr (regeln/spieluhr.ts). */
  const stelleUhr = (angabe: string | undefined) => {
    const aktuell = k.standRef.current;
    if (!angabe || !aktuell) return;
    const neu = uhrNachAngabe(spielminuteJetzt(aktuell), angabe);
    if (neu === null || neu === aktuell.spieluhr) return;
    k.schreibe({ ...aktuell, spieluhr: neu });
    uhrGeaendert.current = true;
  };
  const [laeuft, setzeLaeuft] = useState(false);
  // `#erinnerung` bis `#erinnerung:aus` im Dialog: Dort lebt Ambrose, kein Begleiter.
  const erinnerung = useRef(false);
  /** Der Geist spricht und steht nicht auf der Karte: Er erscheint neben dem Helden. */
  const begleite = (tags: Readonly<Record<string, string>>) => {
    if (tags.erinnerung !== undefined) erinnerung.current = tags.erinnerung !== "aus";
    const szene = szeneAus(k.spiel);
    const zugang = szene?.fuehrungszugang();
    const welt = k.weltRef.current;
    if (!szene || !zugang || !welt || !tags.sprecher) return;
    const lage = {
      sprecher: tags.sprecher,
      geister: geistsprecher(welt.daten.orte),
      erinnerung: welt.erinnerung || erinnerung.current,
      nichtDa: ambroseNichtDa(k.standRef.current?.dialogvariablen ?? {}),
      aufKarte: szene.children.getByName(tags.sprecher) !== null,
    };
    if (begleiterErscheint(lage)) zeigeBegleiter(zugang, tags.sprecher, szene.position().richtung);
  };
  /** Versetzen sofort, dann alle Wege der Zeile zugleich; der Dialog wartet auf den letzten. */
  const gehe = (tags: Readonly<Record<string, string>>) => {
    const zugang = szeneAus(k.spiel)?.fuehrungszugang();
    const versetzen = stellauftrag(tags.stelle);
    if (zugang && versetzen) stelle(zugang, versetzen);
    const wege = wegauftraege(tags.gehe);
    if (!zugang || wege.length === 0) return;
    setzeLaeuft(true);
    const fertig = Promise.all(wege.map((w) => fuehre(zugang, w)));
    // Gleich sichern: Die Szene nennt mitten im Weg schon das Ziel als Position. Wer jetzt neu
    // lädt, steht danach dort (ein Neuladen sichert die Sitzung nicht zuverlässig, useWeltladen.ts).
    const aktuell = k.standRef.current;
    if (aktuell) k.schreibe({ ...aktuell, position: k.position(aktuell) });
    void fertig.then(() => setzeLaeuft(false));
  };
  return {
    laeuft,
    zeile: (tags) => {
      const szene = szeneAus(k.spiel);
      if (!szene) return;
      const anweisung = buehnenanweisung(tags);
      if (anweisung.licht !== undefined) {
        szene.setzeToenung(anweisung.licht);
        lichtGeaendert.current = true;
      }
      if (anweisung.teilchen !== undefined) {
        zeigeTeilchen(szene, anweisung.teilchen);
        teilchenGeaendert.current = true;
      }
      if (anweisung.figur) blendeFigur(szene, anweisung.figur.name, anweisung.figur.deckkraft);
      // `#erscheint` mit Sprecher, der nicht auf der Karte steht: Er erscheint im Bild (R8,
      // Spieltest einstieg: Ambrose blieb auf dem Dachboden unsichtbar, als der Text ihn zeigte).
      if (tags.erscheint && tags.sprecher) szene.erscheine(tags.sprecher);
      // Wer spricht und auf der Karte steht, schaut den Helden an (zuwendungsschicht.ts).
      const zugang = szene.fuehrungszugang();
      if (zugang && tags.sprecher) wendeZu(zugang, tags.sprecher);
      schwenkeZurZeile(() => szeneAus(k.spiel)?.fuehrungszugang() ?? null, tags);
      gehe(tags);
      begleite(tags);
      stelleUhr(tags.uhr);
    },
    ende: () => {
      const szene = szeneAus(k.spiel);
      const zugang = szene?.fuehrungszugang();
      if (zugang) stehAuf(zugang);
      if (zugang) wendeZurueck(zugang);
      if (zugang) schwenkeZurueck(zugang, ruhig());
      setzeFahrt(false);
      if (szene) verabschiedeBegleiter(szene);
      erinnerung.current = false;
      if (teilchenGeaendert.current && szene) zeigeKartenteilchen(szene);
      teilchenGeaendert.current = false;
      // Hat die Geschichte die Uhr gestellt, gilt danach das Licht der neuen Zeit (uhrtoenung.ts).
      const welt = k.weltRef.current;
      const stand = k.standRef.current;
      if (uhrGeaendert.current && welt && stand) {
        uhrGeaendert.current = lichtGeaendert.current = false;
        k.zeigeToenung(toenungJetzt(welt, stand));
        return;
      }
      if (!lichtGeaendert.current) return;
      lichtGeaendert.current = false;
      szene?.setzeToenung(k.toenung);
    },
  };
}
