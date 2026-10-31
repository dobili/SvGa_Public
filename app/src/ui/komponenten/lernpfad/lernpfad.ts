/**
 * Rechnung des Lernpfads „Dein Weg durchs Buch“ (Gamifizierung P2): Stationen, aktuelle Station,
 * Etappen mit Orden und der Satz unter dem Weg. Reine Funktionen ohne Oberfläche.
 *
 * Rolle im Gesamtbild: Der Bildschirm Lernpfad.tsx zeigt die 13 Kapitel als Stationen eines
 * Weges, in fünf Etappen nach den Teilen des Buches (BUCHTEILE); am Ende jeder Etappe steht der
 * Orden des Teils. Eine Station füllt sich mit dem, was ihr Kapitel verlangt. Was zählt, steht in
 * der Liste STATIONSTEILE (heute Abbildungen und Übungen, wie der Orden des Teils): Ein späteres
 * Werkzeug oder ein Trainer, der zu einem Kapitel gehört, trägt dort eine Zeile ein (Wunsch des
 * Autors, 31.10.2026: eintragen statt umbauen). Ehrlich: Nichts wird geschenkt, alles zählt aus
 * den gespeicherten Daten. Der Orden einer Etappe folgt immer der Ringrechnung (teilanteil), damit
 * der Weg nie einen Orden zeigt, den das Profil nicht kennt.
 * Abhängigkeiten: fortschritt/ringrechnung.ts, daten/uebungsliste-daten.ts, speicher, i18n.
 */
import { UEBUNGEN_JE_KAPITEL } from "../../../daten/uebungsliste-daten";
import { t, tZahl, type Textschluessel } from "../../../i18n/sprache";
import type { Fortschritt } from "../../../speicher/format";
import type { Anteil } from "../../../speicher/fortschritt";
import {
  BUCHTEILE,
  istVoll,
  teilanteil,
  type Buchteil,
  type Kapitelangabe,
} from "../fortschritt/ringrechnung";

/** Merker der Station, an der die Figur beim letzten Öffnen stand (nur auf dem Gerät). */
export const MERKER_STATION = "lernpfadStation";

/** Ein Bestandteil einer Station: was in einem Kapitel zu schaffen ist. */
export interface Stationsteil {
  readonly kennung: string;
  /** Text des Rests in Mehrzahl („{anzahl} Abbildungen“); die Einzahl heißt „…Eins“. */
  readonly rest: Textschluessel;
  readonly zaehle: (kapitel: Kapitelangabe, fortschritt: Fortschritt) => Anteil;
}

/** Abbildungen und Übungen, wie der Orden des Teils; je neuer Bestandteil eine Zeile. */
export const STATIONSTEILE: readonly Stationsteil[] = [
  {
    kennung: "abbildungen",
    rest: "lernpfad.rest.abbildungen",
    zaehle: (k, f) => ({
      erreicht: k.abbildungen.filter((id) => f.gesehen[id] !== undefined).length,
      gesamt: k.abbildungen.length,
    }),
  },
  {
    kennung: "uebungen",
    rest: "lernpfad.rest.uebungen",
    zaehle: (k, f) => {
      const ids = UEBUNGEN_JE_KAPITEL[k.kapitel] ?? [];
      return {
        erreicht: ids.filter((id) => f.uebungen[id]?.geloest === true).length,
        gesamt: ids.length,
      };
    },
  },
];

/** Eine Station des Weges: ein Kapitel mit seinen Bestandteilen. */
export interface Station {
  readonly kapitel: number;
  readonly teil: Buchteil;
  readonly teile: readonly { readonly rest: Textschluessel; readonly anteil: Anteil }[];
  /** Alle Bestandteile zusammen (Summe, wie teilanteil). */
  readonly anteil: Anteil;
  readonly fertig: boolean;
}

/** Eine Etappe: ein Teil des Buches mit seinen Stationen und seinem Orden. */
export interface Etappe {
  readonly teil: Buchteil;
  readonly stationen: readonly Station[];
  readonly ordenVerdient: boolean;
}

/** Der Teil des Buches, zu dem ein Kapitel gehört. Beispiel: 6 → „mittelspiel“. */
export function teilDesKapitels(kapitel: number): Buchteil {
  const treffer = BUCHTEILE.find((b) => (b.kapitel as readonly number[]).includes(kapitel));
  return treffer?.kennung ?? "praxis";
}

/**
 * Die Stationen in der Reihenfolge des Buches.
 *
 * Beispiel: Kapitel 0 mit 28 Abbildungen und 3 Übungen, alles angesehen und gelöst → Station 0
 * „31 von 31“, fertig. Sonderfall: Ein Kapitel ohne Inhalt ist nie fertig (wie istVoll).
 */
export function stationen(
  kapitel: readonly Kapitelangabe[],
  fortschritt: Fortschritt,
  teile: readonly Stationsteil[] = STATIONSTEILE,
): Station[] {
  return kapitel.map((k) => {
    const gezaehlt = teile.map((teil) => ({
      rest: teil.rest,
      anteil: teil.zaehle(k, fortschritt),
    }));
    const anteil = {
      erreicht: gezaehlt.reduce((s, x) => s + x.anteil.erreicht, 0),
      gesamt: gezaehlt.reduce((s, x) => s + x.anteil.gesamt, 0),
    };
    return {
      kapitel: k.kapitel,
      teil: teilDesKapitels(k.kapitel),
      teile: gezaehlt,
      anteil,
      fertig: istVoll(anteil),
    };
  });
}

/**
 * Index der aktuellen Station: das Kapitel der zuletzt geöffneten Abbildung, solange es nicht
 * fertig ist; sonst das nächste unfertige danach, sonst das erste unfertige überhaupt.
 *
 * Warum nicht einfach das erste unfertige Kapitel: Wer Kapitel 6 liest und in Kapitel 0 eine
 * Übung ausgelassen hat, soll nicht ans Anfang zurückgesetzt werden.
 * Sonderfall: Alles fertig → die letzte Station.
 */
export function aktuelleStation(liste: readonly Station[], zuletztKapitel: number | null): number {
  const start = Math.max(
    0,
    liste.findIndex((s) => s.kapitel === zuletztKapitel),
  );
  const ab = liste.findIndex((s, i) => i >= start && !s.fertig);
  if (ab >= 0) return ab;
  const irgendeins = liste.findIndex((s) => !s.fertig);
  return irgendeins >= 0 ? irgendeins : liste.length - 1;
}

/** Das Kapitel einer Abbildungsnummer. Beispiel: „6.21“ → 6; null → null. */
export function kapitelDerNummer(nummer: string | null): number | null {
  const kapitel = Number.parseInt(nummer ?? "", 10);
  return Number.isNaN(kapitel) ? null : kapitel;
}

/** Die Etappen nach BUCHTEILE; der Orden gilt nach der Ringrechnung (teilanteil). */
export function etappen(
  liste: readonly Station[],
  kapitel: readonly Kapitelangabe[],
  fortschritt: Fortschritt,
): Etappe[] {
  return BUCHTEILE.map(({ kennung }) => ({
    teil: kennung,
    stationen: liste.filter((s) => s.teil === kennung),
    ordenVerdient: istVoll(teilanteil(kennung, kapitel, fortschritt)),
  }));
}

/** Name des Ordens eines Teils, etwa „Teil Mittelspiel“. */
export function ordenname(teil: Buchteil): string {
  return t("lernpfad.ordenName", { teil: t(`fortschritt.teil.${teil}`) });
}

/** Aufzählung mit „und“ vor dem letzten Glied: [„a“, „b“, „c“] → „a, b und c“. */
function aufzaehlung(glieder: readonly string[]): string {
  if (glieder.length < 2) return glieder.join("");
  return `${glieder.slice(0, -1).join(", ")}${t("lernpfad.und")}${glieder.at(-1) ?? ""}`;
}

/** Was in einer Station noch fehlt: „12 Abbildungen und 4 Übungen“. */
function rest(station: Station): string {
  return aufzaehlung(
    station.teile
      .map(({ rest: schluessel, anteil }) => ({
        schluessel,
        anzahl: anteil.gesamt - anteil.erreicht,
      }))
      .filter(({ anzahl }) => anzahl > 0)
      .map(({ schluessel, anzahl }) => tZahl(schluessel, anzahl, { anzahl })),
  );
}

/**
 * Der Satz unter dem Weg zur aktuellen Station.
 *
 * Beispiel: Kapitel 6, noch 12 Abbildungen und 4 Übungen, Kapitel 7 offen → „Noch 12 Abbildungen
 * und 4 Übungen bis zum Ende von Kapitel 6. Danach fehlt dir nur noch Kapitel 7 bis zum Orden
 * „Teil Mittelspiel“.“ Sonderfall: alles fertig → der Satz zum ganzen Weg.
 */
export function hinweistext(liste: readonly Station[], aktuell: number): string {
  const station = liste[aktuell];
  if (!station || liste.every((s) => s.fertig)) return t("lernpfad.hinweisFertig");
  const erster = t("lernpfad.hinweisKapitel", { rest: rest(station), kapitel: station.kapitel });
  const offen = liste
    .filter((s) => s.teil === station.teil && !s.fertig && s.kapitel !== station.kapitel)
    .map((s) => String(s.kapitel));
  const orden = ordenname(station.teil);
  const zweiter =
    offen.length === 0
      ? t("lernpfad.hinweisOrden", { orden })
      : tZahl("lernpfad.hinweisNoch", offen.length, { kapitel: aufzaehlung(offen), orden });
  return `${erster} ${zweiter}`;
}
