/**
 * Weltdaten der Oberwelt: Laden von Spieldaten, Karte und Bildern für eine Karte des Spielstands,
 * dazu die Deutung der Tiled-Objekte über orte.json (Auslöser je Karte, Figuren, Aktionsknopf).
 *
 * Rolle im Gesamtbild: Reine Hilfen für oberwelt/Oberwelt.tsx, ausgelagert, damit der Bildschirm
 * lesbar bleibt. Platzhalterbilder des Prototyps bis zur eigentlichen Grafik (Entscheidung A10).
 * Abhängigkeiten: paket/paketlader.ts, daten/laden.ts, oberwelt/szene.ts (Treffer), texte/texte.ts.
 * Beispiel: `ausloeserFuer(ort, "mapleFalls.clubraum", "schule")` liefert den Eintrag mit
 * `karte: "mapleFalls.clubraum"` (Rückweg nach draußen), auf der Außenkarte den Eintrag ohne Karte.
 */
import { findeKarte, ladeSpieldaten, type Ortdaten, type Spieldaten } from "../daten/laden";
import {
  liesPaketJson,
  paketdateiAlsAdresse,
  paketdateiAlsAdresseOderNull,
} from "../paket/paketlader";
import { Spielfehler } from "../schnittstelle/spielfehler";
import { sprache } from "../../i18n/sprache";
import { hatSpieltext, ladeSpieltexte, tSpiel } from "../texte/texte";
export { ladeDialog } from "../dialog/dialogdatei";
import { liesBelebung, statistenbild, statistensatz } from "./belebung";
import type { SprechblasenInhalt } from "./Sprechblase";
import { ohneAbwesende } from "../regeln/abwesenheit";
import { ohneFigurenNachBedingung } from "../regeln/figurbedingung";
import type { Abenteuerstand, Heldfigur } from "../schnittstelle/spielstand";
import { ERSATZFIGUR, heldbogenpfad } from "../regeln/heldfigur";
import { rivalinbogen, rivalinGewaehlt } from "../regeln/rivalform";
import { ladeTagesablaeufe, nachUhr } from "./tagesaufstellung";
import { figurenbildAdresse } from "./figurbogen";
import type { Standbildindex } from "./figurzustand";
import { figurstandbilderFuer, ladeStandbildindex } from "./standbildindex";
import { geisterDerKarte } from "../regeln/geist";
import { kartenfassung } from "./kartenfassung";
import { jahreszeitDer, type Jahreszeit } from "./jahreszeitfarben";
import { ladeMoebel, type Moebel } from "./moebel";
import { tierartVon } from "./tiere";
import type { Ausloesertreffer } from "./szene";

/** Bilder des Prototyps im Paket (bis die LimeZu-Kacheln da sind, Entscheidung A10). */
const KACHELBILD = "grafik/platzhalter.png";
const HELDBILD = "grafik/held.png";
const FIGURBILD = "grafik/figur.png";
export const KACHELSATZ = "platzhalter";

/** Was zum Aufbau der Szene geladen wurde. */
export interface Weltdaten {
  /** Kennung der geladenen Karte; passt sie nicht mehr zum Spielstand, gilt die Welt als alt. */
  readonly kennung: string;
  readonly daten: Spieldaten;
  readonly ort: Ortdaten;
  /** Innenraum (kein Fahrrad, keine Tiere draußen)? */
  readonly innen: boolean;
  /**
   * Erinnerung Ambroses (Ort-Art „erinnerung“, docs/spiel/08, F1 und F3): Sepia-Tönung, Ambrose
   * als Held (Bild einer Figur statt des Helden), kein Tagebuch.
   */
  readonly erinnerung: boolean;
  readonly karte: object;
  readonly kachelbild: string;
  readonly heldbild: string;
  readonly figurbild: string;
  /** Bogen des Helden im Format von LimeZu (gekaufte Grafik); null ohne. */
  readonly heldfigur: string | null;
  /** Bögen der Figuren dieser Karte im Format von LimeZu, nach Objektname. */
  readonly figurenbilder: Readonly<Record<string, string>>;
  /** Weitere Standbilder je Figur der Karte (Karteneditor 1.9, figurzustand.ts). */
  readonly figurstandbilder: Readonly<Record<string, Standbildindex>>;
  /** Figuren dieser Karte, die als Geist erscheinen (regeln/geist.ts), nach Objektname. */
  readonly geister: ReadonlySet<string>;
  /** Möbel und Schmuck der Karte. */
  readonly moebel: readonly Moebel[];
  /** Hintergrundbild aus dem Kartenbauer (grafik/karten/<kennung>.png), sonst null. */
  readonly hintergrund: string | null;
  /** Zweite Fassung der Karte (zustand_der_karte), sonst null. */
  readonly zustand: string | null;
  /** Jahreszeit der Karte (Eigenschaft `jahreszeit`, jahreszeitfarben.ts): umgefärbte Möbel. */
  readonly jahreszeit: Jahreszeit | null;
  /** Bögen der Statisten und Tiere dieser Karte, Pfad im Paket → Adresse (nur vorhandene). */
  readonly belebungsbilder: Readonly<Record<string, string>>;
}

/**
 * Die Bögen der Belebung einer Karte: Statisten aus dem Vorrat (`figuren/statist-NN.png`), Tiere
 * nach Art (`tiere/<art>.png`), nur wo das Paket ein Bild hat (ohne private Grafik: keins).
 */
async function belebungsbilderFuer(karte: object): Promise<Record<string, string>> {
  const pfade = new Set(
    liesBelebung(karte).flatMap((b) => {
      if (b.typ === "statist") return [statistenbild(b)];
      const art = tierartVon(b.name, b.bild);
      return art ? [`tiere/${art}.png`] : [];
    }),
  );
  const paare = await Promise.all(
    // Statisten wie Figuren: PixelLab-Bogen vor LimeZu (figurbogen.ts); Tiere gehen durch.
    [...pfade].map(async (pfad) => [pfad, await figurenbildAdresse(pfad)] as const),
  );
  return Object.fromEntries(paare.filter((p): p is readonly [string, string] => p[1] !== null));
}

/** Objektnamen der Figuren einer Tiled-Karte (Objekte mit type „figur“). */
function figurennamen(karte: object): string[] {
  const ebenen = (karte as { layers?: readonly { objects?: readonly unknown[] }[] }).layers ?? [];
  return ebenen.flatMap((e) =>
    (e.objects ?? []).flatMap((o) => {
      const objekt = o as { name?: string; type?: string };
      return objekt.type === "figur" && objekt.name ? [objekt.name] : [];
    }),
  );
}

/**
 * Die Bögen der Figuren einer Karte (Pfad aus `sprite` in orte.json), nur wo das Paket ein Bild hat.
 * Beispiel: Objekt „juno“, Sprite „figuren/juno.png“ → { juno: "blob:…" }.
 */
async function figurenbilderFuer(
  spriteVon: (name: string) => string | undefined,
  karte: object,
  rivalin: boolean,
): Promise<Record<string, string>> {
  const paare = await Promise.all(
    figurennamen(karte).map(async (name) => {
      const sprite = spriteVon(name);
      // Rivalin Victoria: ihr Bogen, solange er fehlt Victors (regeln/rivalform.ts).
      const ihrer = sprite ? rivalinbogen(sprite, rivalin) : null;
      const eigene = ihrer ? await figurenbildAdresse(ihrer) : null;
      const adresse = eigene ?? (sprite ? await figurenbildAdresse(sprite) : null);
      return adresse ? ([name, adresse] as const) : null;
    }),
  );
  return Object.fromEntries(paare.filter((p) => p !== null));
}

/**
 * Bögen der Geister, die nicht auf dieser Karte stehen: Sie können im Dialog erscheinen
 * (`#erscheint`, szene.ts `erscheine`; Spieltest „einstieg“, R8) oder als Begleiter neben dem
 * Helden (begleiterschicht.ts), und das an jedem Ort, nicht nur in ihrem. In Erinnerungen keine.
 * Beispiel: Diner in Maple Falls oder Hafen von Lockport ohne Ambrose-Objekt → { ambrose: "blob:…" }.
 */
async function erscheinungsbilderFuer(
  orte: readonly Ortdaten[],
  karte: object,
  erinnerung: boolean,
): Promise<Record<string, string>> {
  if (erinnerung) return {};
  const aufKarte = new Set(figurennamen(karte));
  const paare = await Promise.all(
    orte
      .flatMap((ort) => ort.figuren)
      .filter((f) => f.geist === true && f.sprite)
      .map(async (f) => {
        const name = f.kennung.slice(f.kennung.indexOf(".") + 1);
        if (aufKarte.has(name)) return null;
        const adresse = await figurenbildAdresse(f.sprite);
        return adresse ? ([name, adresse] as const) : null;
      }),
  );
  return Object.fromEntries(paare.filter((p) => p !== null));
}

/** Orte in Wüste und Canyon (Weltbeschreibung): Sandboden statt Gras. */
const WUESTE = new Set([
  "desertSprings",
  "ghostTown",
  "wegDelacroixDesert",
  "wegDesertSummit",
  "wegPinewoodGhost",
]);

/** Eigenschaft `stil` einer Tiled-Karte (etwa „kueste“ für Fähre, Deich, Bayou), sonst null. */
function kartenstil(karte?: object): string | null {
  const eigenschaften = (karte as { properties?: readonly { name?: string; value?: unknown }[] })
    ?.properties;
  const stil = eigenschaften?.find((e) => e.name === "stil")?.value;
  return typeof stil === "string" ? stil : null;
}

/**
 * Kachelstil einer Karte (gekaufte Grafik, `grafik/stil-<stil>.png` im Raster des Platzhalters):
 * Eigenschaft `stil` der Karte, sonst innen, Wüste, Weg (Natur) oder Stadt.
 * Beispiel: Clubraum → „innen“, Landstraße → „natur“, Ghost Town draußen → „wueste“.
 */
export function kachelstil(ort: Ortdaten, innen: boolean, karte?: object): string {
  const eigener = kartenstil(karte);
  if (eigener) return eigener;
  if (innen) return "innen";
  if (WUESTE.has(ort.kennung)) return "wueste";
  return ort.art === "weg" ? "natur" : "aussen";
}

/**
 * Bogen des Helden: in Erinnerungen der junge Ambrose, sonst die gewählte Figur. Fehlt ihr Bogen
 * (die Heldin, bis der Autor sie in PixelLab erstellt hat), gilt der Held (regeln/heldfigur.ts).
 */
async function heldfigurbogen(erinnerung: boolean, figur: Heldfigur): Promise<string | null> {
  if (erinnerung) return figurenbildAdresse("figuren/ambrose-jung.png");
  const gewaehlt = await figurenbildAdresse(heldbogenpfad(figur));
  return gewaehlt ?? figurenbildAdresse(heldbogenpfad(ERSATZFIGUR));
}

/**
 * Lädt Spieldaten, Karte und Bilder für die Karte des Spielstands. `variablen` (Dialogvariablen)
 * wählen die Fassung der Karte (zustand_der_karte).
 */
export async function ladeWelt(
  kartenkennung: string,
  gewaehlteFigur: Heldfigur = ERSATZFIGUR,
  variablen: Readonly<Record<string, unknown>> = {},
  stand: Abenteuerstand | null = null,
): Promise<Weltdaten> {
  // Spieltexte in der Sprache der App (Dokument 17); ohne Übersetzung im Paket bleibt Deutsch.
  await ladeSpieltexte(sprache());
  const daten = await ladeSpieldaten();
  const fund = findeKarte(daten, kartenkennung);
  if (!fund) throw new Spielfehler("fehler.welt.karteFehlt", { karte: kartenkennung });
  const fassung = kartenfassung(fund.karte, variablen);
  const [geladen, kachelbild, heldbild, figurbild] = await Promise.all([
    liesPaketJson<object>(fassung.datei),
    paketdateiAlsAdresse(KACHELBILD),
    paketdateiAlsAdresse(fund.ort.art === "erinnerung" ? FIGURBILD : HELDBILD),
    paketdateiAlsAdresse(FIGURBILD),
  ]);
  // Im Tiefpunkt steht Ambrose auf keiner Karte (regeln/abwesenheit.ts); Figuren mit `wenn`
  // und Möbel stehen nur, wenn ihre Bedingung gilt (regeln/figurbedingung.ts).
  const ohneVerborgene = ohneFigurenNachBedingung(
    ohneAbwesende(geladen, variablen as Abenteuerstand["dialogvariablen"]),
    (name) => figurZu(fund.ort, name)?.wenn,
    variablen,
  );
  // Tagesabläufe (regeln/tagesablauf.ts): die Uhr stellt die Figuren auf, die Geschichte geht vor.
  const karte = stand
    ? nachUhr(
        ohneVerborgene,
        kartenkennung,
        fund.ort,
        stand,
        daten,
        variablen,
        await ladeTagesablaeufe(),
      )
    : ohneVerborgene;
  const erinnerung = fund.ort.art === "erinnerung";
  const spriteVon = (name: string) => spriteZu(daten.orte, fund.ort, name);
  const standbildindex = await ladeStandbildindex();
  const [stilbild, heldfigur, figurenbilder, moebel, hintergrund, belebungsbilder, geisterbilder] =
    await Promise.all([
      paketdateiAlsAdresseOderNull(
        `grafik/stil-${kachelstil(fund.ort, fund.karte.innen, karte)}.png`,
      ),
      heldfigurbogen(erinnerung, gewaehlteFigur),
      figurenbilderFuer(spriteVon, karte, rivalinGewaehlt(variablen)),
      ladeMoebel(karte, fund.ort.kennung),
      paketdateiAlsAdresseOderNull(
        `grafik/karten/${kartenkennung}${fassung.zustand ? `-${fassung.zustand}` : ""}.png`,
      ),
      belebungsbilderFuer(karte),
      erscheinungsbilderFuer(daten.orte, karte, erinnerung),
    ]);
  return {
    kennung: kartenkennung,
    daten,
    ort: fund.ort,
    innen: fund.karte.innen,
    erinnerung: fund.ort.art === "erinnerung",
    karte,
    kachelbild: stilbild ?? kachelbild,
    heldbild,
    figurbild,
    heldfigur,
    figurenbilder: { ...geisterbilder, ...figurenbilder },
    figurstandbilder: figurstandbilderFuer(
      figurennamen(karte),
      spriteVon,
      standbildindex,
      rivalinGewaehlt(variablen),
    ),
    geister: geisterDerKarte(
      figurennamen(karte),
      (n) => figurZu(fund.ort, n)?.geist === true,
      erinnerung,
    ),
    moebel,
    hintergrund,
    belebungsbilder,
    zustand: fassung.zustand,
    jahreszeit: jahreszeitDer(karte),
  };
}

/** Das Objekt `name` einer Tiled-Karte in Kachelkoordinaten, oder null. */
export function objektposition(karte: object, name: string): { x: number; y: number } | null {
  const ebenen = (karte as { layers?: readonly { type?: string; objects?: readonly unknown[] }[] })
    .layers;
  for (const ebene of ebenen ?? []) {
    if (ebene.type !== "objectgroup") continue;
    for (const o of ebene.objects ?? []) {
      const objekt = o as { name?: string; x?: number; y?: number };
      if (objekt.name === name) {
        return { x: Math.round((objekt.x ?? 0) / 16), y: Math.round((objekt.y ?? 0) / 16) };
      }
    }
  }
  return null;
}

/**
 * Die Bedeutung eines Auslösers auf einer Karte: Ein Eintrag mit passendem Feld `karte` geht vor
 * (der Rückweg einer Tür), sonst gilt der Eintrag des Ortes ohne Karte.
 */
export function ausloeserFuer(ort: Ortdaten, karte: string, name: string) {
  const passende = ort.ausloeser.filter((x) => x.name === name);
  return passende.find((x) => x.karte === karte) ?? passende.find((x) => !x.karte);
}

/** Figur einer Karte zu einem Objektnamen („coachDelgado“ → Figur `ort.coachDelgado`). */
export function figurZu(ort: Ortdaten, name: string) {
  return ort.figuren.find((f) => f.kennung === `${ort.kennung}.${name}` || f.kennung === name);
}

/**
 * Der Bogen einer Figur dieser Karte: aus dem eigenen Ort, sonst von der gleichnamigen Figur eines
 * anderen Orts. Warum: Der Tagesablauf stellt Personen auch an Orte, in deren `figuren` sie nicht
 * stehen; die Joggerin (Weg Ironwood–Silicon) läuft abends auf der Landstraße Maple–Cedar und war
 * dort ein leeres Platzhalterbild (Stehplatzfotos, 24.11.2026).
 * Beispiel: (alle Orte, wegMapleCedar, "joggerin") → "figuren/joggerin.png".
 */
export function spriteZu(
  orte: readonly Ortdaten[],
  ort: Ortdaten,
  name: string,
): string | undefined {
  const eigene = figurZu(ort, name)?.sprite;
  if (eigene) return eigene;
  return orte.flatMap((o) => o.figuren).find((f) => f.kennung.endsWith(`.${name}`) && f.sprite)
    ?.sprite;
}

/** Der Knopftext zu einem Treffer der Karte; null, wenn er nichts auslöst. */
export function aktionFuer(w: Weltdaten, treffer: Ausloesertreffer | null): string | null {
  if (!treffer) return null;
  if (treffer.typ === "statist") return tSpiel("oberwelt.aktion.sprechen");
  if (treffer.typ === "figur") {
    return figurZu(w.ort, treffer.name) ? tSpiel("oberwelt.aktion.sprechen") : null;
  }
  const a = ausloeserFuer(w.ort, w.kennung, treffer.name);
  if (!a) return null;
  if (a.art === "gegenstand") return tSpiel("oberwelt.aktion.ansehen");
  if (a.art === "dialog") return tSpiel("oberwelt.aktion.sprechen");
  return null;
}

/**
 * Was ein ansprechbarer Statist beim n-ten Ansprechen (ab 0) sagt, fertig übersetzt; {held} wird
 * durch den Namen des Helden ersetzt. Null, wenn der Statist keinen Satz hat. Ambroses Kommentar
 * nur, wenn er gerade sprechen kann (`ambroseSpricht`, regeln/abwesenheit.ts ambroseSprichtJetzt);
 * sonst fällt er weg.
 * Beispiel: Ladenhilfe im Bergladen, erstes Ansprechen → Satz „statist.summitCity.bergladen.ladenhilfe“.
 */
export function sprechblaseFuer(
  w: Weltdaten,
  name: string,
  besuch: number,
  held: string,
  ambroseSpricht: boolean,
): SprechblasenInhalt | null {
  const statist = liesBelebung(w.karte).find((b) => b.typ === "statist" && b.name === name);
  const sagt = statist?.sagt;
  const s = sagt ? statistensatz(sagt, besuch, hatSpieltext) : null;
  if (!s) return null;
  const ambrose = s.ambrose && ambroseSpricht ? tSpiel(s.ambrose, { held }) : null;
  return { satz: tSpiel(s.satz, { held }), ambrose, zeigt: statist?.zeigt ?? null };
}

/** Rahmenklasse der Welt (Oberwelt.tsx): in Erinnerungen und bei Sepia-Tönung getönt. */
export function weltklasse(erinnerung: boolean): string {
  return erinnerung ? "abenteuer-welt abenteuer-welt-erinnerung" : "abenteuer-welt";
}
