/**
 * Auslöser und Aktionsknopf der Oberwelt: Was der Held gerade trifft (aus Phaser), was beim
 * Betreten geschieht (Übergang, Quest-Ereignis „ort“) und was der Aktionsknopf öffnet (Dialog der
 * Figur oder des Auslösers, Sprechblase eines Statisten).
 *
 * Rolle im Gesamtbild: ausgelagert aus Oberwelt.tsx (Größengrenze 400 Zeilen, Auftrag des
 * Hauptchats, 20.11.2026). Oberwelt.tsx zeichnet nur noch; dieser Hook hält den Zustand von Treffer
 * und Sprechblase.
 * Abhängigkeiten: kern.ts, useDialogende.ts (Dialoge öffnen), weltdaten.ts, regeln/abwesenheit.ts.
 */
import { useRef, useState } from "react";
import { ambroseSprichtJetzt } from "../regeln/abwesenheit";
import { ANGESPROCHEN } from "../regeln/ansprechen";
import { variablenAusBesitz } from "../regeln/dialogvariablen";
import { ankunftNachher } from "./eingang";
import { tSpiel } from "../texte/texte";
import { szeneAus, type Oberweltkern } from "./kern";
import type { SprechblasenInhalt } from "./Sprechblase";
import type { Ausloesertreffer } from "./szene";
import type { Dialoge } from "./useDialogende";
import { ausloeserFuer, figurZu, sprechblaseFuer } from "./weltdaten";
import { wendeZu } from "./zuwendungsschicht";

/** Was die Oberwelt vom Hook sieht. */
export interface Ausloeser {
  readonly treffer: Ausloesertreffer | null;
  readonly setzeTreffer: (t: Ausloesertreffer | null) => void;
  readonly sprechblase: SprechblasenInhalt | null;
  readonly schliesseSprechblase: () => void;
  /** Ein Auslöser der Karte (aus Phaser): Übergänge sofort, alles andere als Quest-Ereignis. */
  readonly beiTreffer: (t: Ausloesertreffer | null) => void;
  /** Der Aktionsknopf: Dialog des Auslösers oder der Figur öffnen, Statisten sprechen lassen. */
  readonly beiAktion: () => void;
  /** Dialog einer Figur öffnen; `vonDerFigur`: Sie hat den Helden angesprochen (useAnsprechen.ts). */
  readonly sprichFigurAn: (name: string, vonDerFigur: boolean) => void;
}

/**
 * Treffer, Sprechblase und Aktionsknopf über dem Kern der Oberwelt.
 * Beispiel: Held vor Coach Delgado, Aktionsknopf → oeffneDialog("maple-falls-clubraum.coach").
 * Sonderfälle: Ein Übergang wechselt erst, wenn der Held in den Durchgang geht (R060); ein
 * Übergang ohne Ziel meldet „Karte fehlt“; ein Statist sagt bei jedem Ansprechen den nächsten Satz
 * (gezählt nur in dieser Sitzung).
 */
export function useAusloeser(
  k: Oberweltkern,
  dialoge: Pick<Dialoge, "oeffneDialog" | "oeffneUebergang">,
): Ausloeser {
  const [treffer, setzeTreffer] = useState<Ausloesertreffer | null>(null);
  const [sprechblase, setzeSprechblase] = useState<SprechblasenInhalt | null>(null);
  const angesprochen = useRef(new Map<string, number>());

  const beiTreffer = (t: Ausloesertreffer | null) => {
    setzeTreffer(t);
    if (!t) setzeSprechblase(null);
    const w = k.weltRef.current;
    const aktuell = k.standRef.current;
    if (!t || !w || !aktuell) return;
    const a = ausloeserFuer(w.ort, w.kennung, t.name);
    const uebergang = t.typ === "ausloeser" && a?.art === "uebergang";
    if (uebergang && !t.durch) return;
    // Ankunft zu Fuß (`nachher`, eingang.ts): erst wechseln, der Dialog läuft auf der Zielkarte.
    const bedingungen = { ...aktuell.dialogvariablen, ...variablenAusBesitz(aktuell) };
    if (uebergang && a.ziel && ankunftNachher(a, bedingungen)) {
      k.wechsleKarte(a.ziel.karte, a.ziel.ausloeser);
      return;
    }
    if (uebergang && a.dialog && a.ziel) {
      dialoge.oeffneUebergang(a.dialog, a.ziel, a.wenn ?? null);
      return;
    }
    if (uebergang) {
      // Ein Übergang ohne Ziel (etwa die Landstraße nach Cedar Creek) ist noch nicht gebaut.
      if (a.ziel) k.wechsleKarte(a.ziel.karte, a.ziel.ausloeser);
      else k.setzeMeldung(tSpiel("oberwelt.karteFehlt", { karte: a.name }));
      return;
    }
    k.melde({ art: "ort", karte: aktuell.position.karte, ausloeser: t.name }, w);
  };

  /**
   * Öffnet den Dialog einer Figur der Karte, wie der Aktionsknopf es tut; auch für das Ansprechen
   * durch die Figur (useAnsprechen.ts), damit es keinen zweiten Weg in den Dialog gibt. Die
   * Dialogvariable `angesprochen` sagt Ink, wer angefangen hat (regeln/ansprechen.ts).
   */
  const sprichFigurAn = (name: string, vonDerFigur: boolean) => {
    const welt = k.weltRef.current;
    const stand = k.standRef.current;
    const figur = welt ? figurZu(welt.ort, name) : undefined;
    if (!figur) return;
    if (stand && stand.dialogvariablen[ANGESPROCHEN] !== vonDerFigur) {
      k.schreibe({
        ...stand,
        dialogvariablen: { ...stand.dialogvariablen, [ANGESPROCHEN]: vonDerFigur },
      });
    }
    dialoge.oeffneDialog(figur.dialog);
  };

  const beiAktion = () => {
    const welt = k.welt;
    const stand = k.stand;
    if (!welt || !treffer) return;
    if (treffer.typ === "statist") {
      const schluessel = `${welt.kennung}.${treffer.name}`;
      const besuch = angesprochen.current.get(schluessel) ?? 0;
      angesprochen.current.set(schluessel, besuch + 1);
      const spricht = stand ? ambroseSprichtJetzt(stand.dialogvariablen) : false;
      setzeSprechblase(
        sprechblaseFuer(welt, treffer.name, besuch, stand?.held.name ?? "", spricht),
      );
      return;
    }
    if (treffer.typ === "figur") {
      // Die Angesprochene dreht sich zum Helden (Wunsch des Autors, 22.11.2026).
      const zugang = szeneAus(k.spiel)?.fuehrungszugang();
      if (zugang) wendeZu(zugang, treffer.name);
      sprichFigurAn(treffer.name, false);
      return;
    }
    const a = ausloeserFuer(welt.ort, welt.kennung, treffer.name);
    if (a?.dialog) dialoge.oeffneDialog(a.dialog);
  };

  return {
    treffer,
    setzeTreffer,
    sprechblase,
    schliesseSprechblase: () => setzeSprechblase(null),
    beiTreffer,
    beiAktion,
    sprichFigurAn,
  };
}
