/**
 * Bild eines Statisten nach seiner Rolle (Kartenblick M05, Auftrag des Hauptchats, 24.11.2026).
 *
 * Warum: 633 von 682 Statisten hatten kein eigenes Bild; die App würfelte es aus dem Namen. Die 40
 * Bögen des Vorrats zeigen nur 11 Bilder, sieben davon den Arbeiter mit Bauhelm: Die Empfangsdame
 * war ein Jugendlicher, der Koch eine Rentnerin, und in London 1851 stand jemand in Warnweste.
 * Jetzt bestimmt die Rolle das Bild: Name, `tun` und die Eigenschaft `rolle` führen zu einer Regel
 * aus statistenrollen.json, die Regel nennt die passenden Bilder. Unter ihnen entscheidet ein
 * fester Streuwert des Namens, aber so, dass dasselbe Bild nicht zweimal nah beieinander steht, das
 * Geschlecht des Namens passt und Sitzende ein Sitzbild haben.
 *
 * Rolle im Gesamtbild: Reine Logik ohne Phaser; belebung.ts ruft `waehleStatistenbilder` beim Lesen
 * der Karte. Dieselbe Rechnung steht in pipeline/abenteuer/statistenwahl.py (Vorschau, Editor,
 * Prüfung statistenrolle.py); die Probe statistenwahl.probe.json hält beide zusammen.
 * Abhängigkeiten: statistenrollen.json.
 */
import rollen from "./statistenrollen.json";

/** Ein Bild des Vorrats: Hat es ein Sitzbild, und zu welchem Geschlecht passt es (fehlt: beide)? */
interface Typ {
  readonly sitzbild: boolean;
  readonly geschlecht?: string;
}

/** Eine Regel der Rollenliste. */
interface Regel {
  readonly rolle: string;
  readonly typen: readonly string[];
  readonly ausweich: readonly string[];
  readonly namen: readonly string[];
  readonly tun: readonly string[];
}

/** Was die Wahl von einem Statisten wissen muss (aus der Tiled-Karte). */
export interface Statistenangabe {
  readonly name: string;
  readonly feld: { readonly x: number; readonly y: number };
  readonly tun: string;
  /** Eigenes Bild (Eigenschaft `bild`), sonst null. */
  readonly bild: string | null;
  /** Regel direkt (Eigenschaft `rolle`, etwa „historisch“), sonst null. */
  readonly rolle: string | null;
  readonly sitzt: boolean;
}

/** Ein Eintrag der Geschlechterliste: Endungen und Anfänge des Namens, `ist` leer für „keins“. */
interface Geschlechtseintrag {
  readonly ist: string;
  readonly enden: readonly string[];
  readonly anfaenge: readonly string[];
}

const TYPEN: Readonly<Record<string, Typ>> = rollen.typen;
const REGELN: readonly Regel[] = rollen.regeln;
const GESCHLECHT: readonly Geschlechtseintrag[] = rollen.geschlecht;

/** So nah (in Feldern, waagerecht und senkrecht) gilt dasselbe Bild als „daneben“. */
export const NAH = 6;
/**
 * Abzüge für ein Bild; das kleinste gewinnt. Jede Stufe wiegt mehr als alle darunter zusammen:
 * Lieber ein Ausweichbild ohne Sitzbild mit falschem Geschlecht als dasselbe Bild daneben.
 */
const ABZUG_GLEICH_NAH = 8;
const ABZUG_GESCHLECHT = 4;
const ABZUG_AUSWEICH = 2;
const ABZUG_OHNE_SITZBILD = 1;
/** FNV-1a mit 32 Bit. */
const FNV_START = 0x811c9dc5;
const FNV_PRIMZAHL = 0x01000193;
/** Alte Bögen des Vorrats: „statist-07“ ist eine Kopie eines Typs (rollen.vorrat). */
const VORRATSBOGEN = /^statist-(\d+)$/;

/** Fester Streuwert eines Namens (FNV-1a), damit derselbe Name immer gleich aussieht. */
export function streuwert(text: string): number {
  let h = FNV_START;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, FNV_PRIMZAHL) >>> 0;
  }
  return h;
}

/** Regel mit dem längsten Wort (aus `namen` oder `tun`), das im Text steckt, sonst null. */
function laengstes(text: string, schluessel: "namen" | "tun"): Regel | null {
  let beste: Regel | null = null;
  let laenge = 0;
  for (const regel of REGELN) {
    for (const wort of regel[schluessel]) {
      if (wort.length > laenge && text.includes(wort)) {
        beste = regel;
        laenge = wort.length;
      }
    }
  }
  return beste;
}

/** Regel mit diesem Namen; die Liste ist fest, darum darf sie nicht fehlen. */
function regelNamens(rolle: string): Regel | null {
  return REGELN.find((r) => r.rolle === rolle) ?? null;
}

/**
 * Die Regel eines Statisten: Eigenschaft `rolle`, sonst Wort im Namen, sonst im `tun`, sonst die
 * Regel für alle übrigen (Alltag).
 * Warum der Name zuerst: Er ist die Rollenbezeichnung der Szene; im `tun` stehen auch andere
 * („erklärt den Kindern …“). Bei gleich langen Wörtern gewinnt die frühere Regel.
 * Beispiel: („mutterMitKinderwagen“, „“) → alltag (Kinderwagen schlägt Kind);
 * („finn“, „angelt Flaschen aus dem Becken“) → wasser; rolle „historisch“ → historisch.
 * Sonderfall: Eine unbekannte `rolle` zählt nicht (die Pipeline meldet sie, statistenrolle.py).
 */
export function statistenrolle(name: string, tun = "", rolle: string | null = null): string {
  const direkt = rolle ? regelNamens(rolle) : null;
  const regel =
    direkt ?? laengstes(name.toLowerCase(), "namen") ?? laengstes(tun.toLowerCase(), "tun");
  return regel?.rolle ?? rollen.sonst;
}

/** Name bis zum ersten Großbuchstaben oder zur ersten Ziffer, klein: „wanderinBeimEssen“ → „wanderin“. */
function kopf(name: string): string {
  const ende = name.slice(1).search(/[A-Z0-9]/);
  return (ende < 0 ? name : name.slice(0, ende + 1)).toLowerCase();
}

/**
 * „w“, „m“ oder null nach Endung und Anfang des Namens (Listen in statistenrollen.json).
 * Beispiel: „fotografin“ → w, „alterHerr“ → m, „touristen“ und „kinder“ → null (Mehrzahl).
 */
export function statistengeschlecht(name: string): string | null {
  const k = kopf(name);
  for (const eintrag of GESCHLECHT) {
    const passt =
      eintrag.enden.some((e) => k.endsWith(e)) || eintrag.anfaenge.some((a) => k.startsWith(a));
    if (passt) return eintrag.ist || null;
  }
  return null;
}

/**
 * Das Bild hinter einem Bogennamen: Alte Vorratsbögen sind Kopien eines Typs.
 * Beispiel: „statist-07“ → „statist.kindA“; „otis“ → „otis“.
 */
export function kennbild(bild: string): string {
  const nummer = Number(VORRATSBOGEN.exec(bild)?.[1] ?? 0);
  return rollen.vorrat[nummer - 1] ?? bild;
}

/** Ein schon vergebenes Bild mit seinem Feld. */
interface Vergeben {
  readonly feld: Statistenangabe["feld"];
  readonly bild: string;
}

/** Stehen zwei Felder höchstens NAH auseinander (waagerecht und senkrecht)? */
function nah(a: Statistenangabe["feld"], b: Statistenangabe["feld"]): boolean {
  return Math.abs(a.x - b.x) <= NAH && Math.abs(a.y - b.y) <= NAH;
}

/** Abzüge eines Bildes für diesen Statisten (Stufen siehe oben). */
function abzugFuer(
  typ: string,
  ausweich: boolean,
  a: Statistenangabe,
  vergeben: readonly Vergeben[],
): number {
  const angabe = TYPEN[typ];
  const eigenes = statistengeschlecht(a.name);
  let abzug = ausweich ? ABZUG_AUSWEICH : 0;
  if (vergeben.some((v) => v.bild === typ && nah(v.feld, a.feld))) abzug += ABZUG_GLEICH_NAH;
  if (eigenes && angabe?.geschlecht && angabe.geschlecht !== eigenes) abzug += ABZUG_GESCHLECHT;
  if (a.sitzt && !angabe?.sitzbild) abzug += ABZUG_OHNE_SITZBILD;
  return abzug;
}

/** Das Bild mit dem kleinsten Abzug; bei Gleichstand das erste ab dem Streuwert des Namens. */
function waehleEines(a: Statistenangabe, vergeben: readonly Vergeben[]): string {
  const regel = regelNamens(statistenrolle(a.name, a.tun, a.rolle));
  const typen = regel?.typen ?? [];
  const start = typen.length > 0 ? streuwert(a.name) % typen.length : 0;
  const folge = [
    ...[...typen.slice(start), ...typen.slice(0, start)].map((typ) => ({ typ, ausweich: false })),
    ...(regel?.ausweich ?? []).map((typ) => ({ typ, ausweich: true })),
  ];
  let bestes = folge[0]?.typ ?? "";
  let kleinster = Number.POSITIVE_INFINITY;
  for (const { typ, ausweich } of folge) {
    const abzug = abzugFuer(typ, ausweich, a, vergeben);
    if (abzug < kleinster) {
      bestes = typ;
      kleinster = abzug;
    }
  }
  return bestes;
}

/**
 * Bogenname je Statist einer Karte, in der Reihenfolge der Eingabe.
 * Eingabe: alle Statisten der Karte. Wer `bild` trägt, behält es; die übrigen bekommen der Reihe
 * nach das beste Bild ihrer Regel, wobei schon vergebene Bilder in der Nähe gemieden werden.
 * Ausgabe: Namen wie „statist.service“ oder „otis“ (Pfad im Paket: `figuren/<name>.png`).
 * Beispiel: zwei „rentner“ nebeneinander → „statist.rentner“ und das Ausweichbild „wanderer“;
 * „empfangsdame“ → „statist.konzern“; „bauarbeiter“ → „statist.arbeiter“ (nur dort der Bauhelm).
 * Sonderfall: Eine Regel mit nur einem Bild und ohne freies Ausweichbild wiederholt es.
 */
export function waehleStatistenbilder(angaben: readonly Statistenangabe[]): string[] {
  const vergeben: Vergeben[] = angaben.flatMap((a) =>
    a.bild ? [{ feld: a.feld, bild: kennbild(a.bild) }] : [],
  );
  return angaben.map((a) => {
    if (a.bild) return a.bild;
    const bild = waehleEines(a, vergeben);
    vergeben.push({ feld: a.feld, bild });
    return bild;
  });
}
