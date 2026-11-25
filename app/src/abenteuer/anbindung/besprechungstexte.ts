/**
 * Die Sätze der Partiebesprechung: je Moment ein bis drei kurze Sätze in Ambroses Stimme oder, ohne
 * ihn, als Notiz des Helden; dazu Auftakt und Schluss.
 *
 * Rolle im Gesamtbild: anbindung/Besprechung.tsx zeigt sie in der Sprechblase über dem Brett. Die
 * Texte stehen in inhalte/abenteuer/texte/de.json (Entwurf docs/spiel/auftraege/
 * partiebesprechung_25-11.md, Abschnitt 6):
 * - `besprechung.<stimme>.<stufe>.<kategorie>.<n>` (Stufe 1 knapp, ab 2 mit dem besseren Zug),
 * - `besprechung.<stimme>.begriff.<begriff>.<gegen|fuer>.<n>` ab Stufe 2, nur bekannte Begriffe,
 * - `besprechung.<stimme>.folge.<n>` ab Stufe 3 (die ersten Züge der besseren Fortsetzung),
 * - `besprechung.<stimme>.auftakt|schluss.<ausgang>|ruhig|rechnet.<n>`.
 * Ohne Ambrose (`allein`) gibt es keine Stufen in den Schlüsseln, nur in der Auswahl.
 * Gezogen wird mit zieheAus (anbindung/tischtexte.ts): ohne Wiederholung in einer Besprechung, mit
 * festem Zufall je Partie, damit zwei Partien verschieden klingen.
 * Abhängigkeiten: anbindung/tischtexte.ts, regeln/besprechung.ts, regeln/besprechungsmomente.ts,
 * anbindung/besprechungsmotiv.ts (Typ), texte/texte.ts.
 */
import type { Ausgang } from "../schnittstelle/partie";
import type { Begriff, Besprechungsstimme, Besprechungsstufe } from "../regeln/besprechung";
import type { Besprechungsmoment } from "../regeln/besprechungsmomente";
import { tSpiel } from "../texte/texte";
import type { Role } from "chessops/types";
import type { FruehererFehler } from "./besprechungsbezug";
import type { Lagebefund } from "./besprechungslage";
import type { Materialfolge } from "./besprechungsmaterial";
import type { Momentmotiv } from "./besprechungsmotiv";
import { figurwort, type Ursache } from "./besprechungsursache";
import { zieheAus } from "./tischtexte";

/** Wer spricht, wie viel, mit welchen Wörtern, für welche Partie. */
export interface Besprechungskontext {
  readonly stimme: Besprechungsstimme;
  readonly stufe: Besprechungsstufe;
  readonly begriffe: ReadonlySet<Begriff>;
  readonly partiekennung: string;
  /** Lehrer je Begriff (versuchte Runden, besprechungsbezug.ts); fehlt: keine Rückbezüge. */
  readonly lehrer?: ReadonlyMap<Begriff, string>;
  /** Frühere Partien mit derselben Ursache (besprechungsbezug.ts); fehlt: keine Rückbezüge. */
  readonly frueher?: ReadonlyMap<string, FruehererFehler>;
}

/** Höchstens so viele Rückbezüge je Besprechung (Abschnitt 11, Punkt 5). */
const BEZUEGE_HOECHSTENS = 2;

/** Was ein Moment an Einzelheiten mitbringt (Züge schon als Text in der Sprache des Spiels). */
export interface Momentangaben {
  readonly moment: Besprechungsmoment;
  /** Der gespielte Zug mit Nummer („12. Sf3“). */
  readonly zug: string;
  /** Der bessere Zug ohne Nummer („Lc4“), null ohne Engine-Zug oder wenn er gespielt wurde. */
  readonly besser: string | null;
  readonly motiv: Momentmotiv | null;
  /** Die ersten Züge der besseren Fortsetzung („Sxe5 Dh5“), null ohne. */
  readonly folge: string | null;
  /** Name der Eröffnung beim Theoriemoment, null ohne. */
  readonly eroeffnung: string | null;
  /** Ursache eines Fehlers des Helden mit Figur und Feld (besprechungsursache.ts), null ohne. */
  readonly ursache: Ursache | null;
  /** Was der Fehler kostet oder die Chance bringt, als Figur oder Matt, null ohne. */
  readonly material: Materialfolge | null;
  /** Phase und Lage vor einem Fehler des Helden (besprechungslage.ts), null ohne sichere Lage. */
  readonly lage: Lagebefund | null;
  /** Die Figur, die ein brillanter oder starker Zug hergibt, null ohne Opfer. */
  readonly opfer: Role | null;
}

/** Kategorien, deren Satz (ab Stufe 2, allein immer) den besseren Zug nennt. */
const MIT_BESSEREM: ReadonlySet<string> = new Set([
  "fehler",
  "patzer",
  "verpasst",
  "ungenau",
  "gegnerfehler",
]);
/** Kategorien, bei denen ab Stufe 3 die Folge dazukommt. */
const MIT_FOLGE: ReadonlySet<string> = new Set(["fehler", "patzer", "verpasst", "gegnerfehler"]);

/** Die Vorsilbe der Stimme: Ambrose spricht, sonst die Notizen des Helden. */
function vorsilbe(stimme: Besprechungsstimme): string {
  return stimme === "ambrose" ? "besprechung.ambrose" : "besprechung.allein";
}

/** Zieht Zeilen ohne Wiederholung: zählt je Gruppe mit. */
class Ziehung {
  private readonly nutzung = new Map<string, number>();
  constructor(private readonly kennung: string) {}

  /** Eine Zeile der Gruppe (übersetzt, mit Werten) oder null, wenn die Gruppe leer ist. */
  zeile(gruppe: string, werte: Readonly<Record<string, string>> = {}): string | null {
    const n = this.nutzung.get(gruppe) ?? 0;
    this.nutzung.set(gruppe, n + 1);
    const schluessel = zieheAus([gruppe], n, this.kennung);
    return schluessel ? tSpiel(schluessel, werte) : null;
  }
}

/**
 * Gruppe des Kategoriesatzes: Ambrose nach Stufe (1 knapp, ab 2 mit dem besseren Zug), ohne ihn
 * ohne Stufe; Theorie mit Namen, wenn es einen gibt. Fehlt der bessere Zug (die Engine kennt
 * keinen), gilt der knappe Satz: Ambrose den von Stufe 1, allein `knapp`.
 */
function kategoriegruppe(k: Besprechungskontext, a: Momentangaben): string {
  const kategorie = a.moment.kategorie;
  const mitName = kategorie === "theorie" && a.eroeffnung ? ".name" : "";
  const ohneBesser = a.besser === null && MIT_BESSEREM.has(kategorie);
  if (k.stimme !== "ambrose") {
    return `${vorsilbe(k.stimme)}${ohneBesser ? ".knapp" : ""}.${kategorie}${mitName}`;
  }
  const stufe = k.stufe === 1 || ohneBesser ? 1 : 2;
  return `${vorsilbe(k.stimme)}.${stufe}.${kategorie}${mitName}`;
}

/** Der Satz zum Begriff, ab Stufe 2 und nur, wenn der Held den Begriff kennt. */
function begriffssatz(k: Besprechungskontext, a: Momentangaben, z: Ziehung): string | null {
  const motiv = a.motiv;
  if (!motiv || k.stufe < 2 || !k.begriffe.has(motiv.begriff)) return null;
  return z.zeile(`${vorsilbe(k.stimme)}.begriff.${motiv.begriff}.${motiv.richtung}`);
}

/**
 * Der Satz zur Ursache ab Stufe 2 (Abschnitt 11, Punkt 1): mit Fachwort nur, wenn der Held den
 * Begriff kennt (Gruppe `.wort`), sonst ohne. Ersetzt den Satz zum Begriff, wenn es ihn gibt.
 */
function ursachesatz(k: Besprechungskontext, a: Momentangaben, z: Ziehung): string | null {
  const u = a.ursache;
  if (!u || k.stufe < 2) return null;
  const basis = `${vorsilbe(k.stimme)}.ursache.${u.gruppe}`;
  const wort = u.begriff !== null && k.begriffe.has(u.begriff);
  return (wort ? z.zeile(`${basis}.wort`, u.werte) : null) ?? z.zeile(basis, u.werte);
}

/**
 * Der Satz zum Material (Abschnitt 11, Punkt 2): beim eigenen Fehler auf jeder Stufe, bei einer
 * Chance ab Stufe 2. Nennt die Figur, nie Bauerneinheiten.
 */
function materialsatz(k: Besprechungskontext, a: Momentangaben, z: Ziehung): string | null {
  const m = a.material;
  if (!m || (m.richtung === "gewinn" && k.stufe < 2)) return null;
  const basis = `${vorsilbe(k.stimme)}.material`;
  if (m.art === "matt")
    return z.zeile(`${basis}.${m.richtung === "verlust" ? "mattVerlust" : "mattGewinn"}`);
  return z.zeile(`${basis}.${m.richtung}`, { figur: figurwort(m.rolle, "den") });
}

/**
 * Der Satz zur Lage vor dem Fehler ab Stufe 2 (Abschnitt 11, Punkt 3), mit der Phase
 * („im Endspiel“). Höchstens jeder zweite Moment bekommt ihn (`frei`), sonst klingt es nach Liste.
 */
function lagesatz(
  k: Besprechungskontext,
  a: Momentangaben,
  z: Ziehung,
  frei: boolean,
): string | null {
  const l = a.lage;
  if (!l || !frei || k.stufe < 2) return null;
  const phase = tSpiel(`besprechung.phase.${l.phase}`);
  return z.zeile(`${vorsilbe(k.stimme)}.lage.${l.lage}`, { phase });
}

/** Der Satz zum Opfer eines brillanten oder starken Zuges, auf jeder Stufe (Abschnitt 11, Punkt 4). */
function opfersatz(k: Besprechungskontext, a: Momentangaben, z: Ziehung): string | null {
  if (!a.opfer) return null;
  return z.zeile(`${vorsilbe(k.stimme)}.opfer`, { figur: figurwort(a.opfer, "den") });
}

/** Der Begriff, um den es am Moment geht: aus der Ursache, sonst aus dem Motiv gegen den Helden. */
function begriffDes(a: Momentangaben): Begriff | null {
  return a.ursache?.begriff ?? (a.motiv?.richtung === "gegen" ? a.motiv.begriff : null);
}

/**
 * Ein Rückbezug ab Stufe 2 (Abschnitt 11, Punkt 5): zuerst auf eine frühere Partie mit derselben
 * Ursache, sonst auf den Lehrer, bei dem der Held das Thema geübt hat.
 */
function bezugssatz(k: Besprechungskontext, a: Momentangaben, z: Ziehung): string | null {
  if (k.stufe < 2) return null;
  const basis = `${vorsilbe(k.stimme)}.bezug`;
  const frueher = a.ursache ? k.frueher?.get(a.ursache.gruppe) : undefined;
  if (frueher) {
    const gruppe = frueher.gleicherGegner ? "partieGleich" : "partie";
    return z.zeile(`${basis}.${gruppe}`, { gegner: frueher.gegner });
  }
  const begriff = begriffDes(a);
  const lehrer = begriff ? k.lehrer?.get(begriff) : undefined;
  return lehrer ? z.zeile(`${basis}.lehrer`, { lehrer }) : null;
}

/**
 * Höchstens eine Anekdote je Besprechung, nur von Ambrose ab Stufe 2, zum Begriff des Moments,
 * wenn der Held ihn schon kennt (Abschnitt 11, Punkt 6); null, wenn es zu dem Begriff keine gibt.
 */
function anekdotensatz(k: Besprechungskontext, a: Momentangaben, z: Ziehung): string | null {
  const begriff = a.ursache?.begriff ?? a.motiv?.begriff ?? null;
  if (k.stimme !== "ambrose" || k.stufe < 2 || !begriff || !k.begriffe.has(begriff)) return null;
  return z.zeile(`besprechung.ambrose.anekdote.${begriff}`);
}

/** Der Satz zur Folge, ab Stufe 3 bei Fehlern und Chancen. */
function folgesatz(k: Besprechungskontext, a: Momentangaben, z: Ziehung): string | null {
  if (k.stufe < 3 || !a.folge || !MIT_FOLGE.has(a.moment.kategorie)) return null;
  return z.zeile(`${vorsilbe(k.stimme)}.folge`, { folge: a.folge });
}

/**
 * Die Sätze aller Momente, in der Reihenfolge der Momente.
 * Beispiel: Stufe 1, Fehler bei „7. Lc4“ mit besserem Zug „d4“ → „Hier ist dir ein Fehler passiert.“
 * (Stufe 1 nennt den besseren Zug nicht); Stufe 2 mit bekannter Gabel → „Hier wäre d4 besser
 * gewesen. Danach hatte dein Gegner eine Gabel.“
 */
export function momentsaetze(k: Besprechungskontext, angaben: readonly Momentangaben[]): string[] {
  const z = new Ziehung(k.partiekennung);
  let lageZuvor = false;
  let bezuege = 0;
  let anekdote = false;
  return angaben.map((a) => {
    const lage = lagesatz(k, a, z, !lageZuvor);
    lageZuvor = lage !== null;
    const werte = {
      zug: a.zug,
      besser: a.besser ?? "",
      eroeffnung: a.eroeffnung ?? "",
    };
    const ursache = ursachesatz(k, a, z);
    const teile = [
      z.zeile(kategoriegruppe(k, a), werte),
      lage,
      opfersatz(k, a, z),
      ursache ?? begriffssatz(k, a, z),
      materialsatz(k, a, z),
      folgesatz(k, a, z),
    ];
    const bezug = bezuege < BEZUEGE_HOECHSTENS ? bezugssatz(k, a, z) : null;
    if (bezug) bezuege += 1;
    const geschichte = !anekdote && !bezug ? anekdotensatz(k, a, z) : null;
    if (geschichte) anekdote = true;
    teile.push(bezug, geschichte);
    return teile.filter((t): t is string => t !== null).join(" ");
  });
}

/** Der erste Satz der Besprechung; nach dem Abschied ein eigener. */
export function auftaktsatz(k: Besprechungskontext): string {
  const gruppe =
    k.stimme === "abschied" ? "besprechung.abschied.auftakt" : `${vorsilbe(k.stimme)}.auftakt`;
  return new Ziehung(k.partiekennung).zeile(gruppe) ?? "";
}

/** Der letzte Satz nach dem Ausgang; ohne Momente der Satz für eine ruhige Partie davor. */
export function schlusssatz(
  k: Besprechungskontext,
  ausgang: Ausgang,
  ohneMomente: boolean,
): string {
  const z = new Ziehung(k.partiekennung);
  const ruhig = ohneMomente ? z.zeile(`${vorsilbe(k.stimme)}.ruhig`) : null;
  const schluss = z.zeile(`${vorsilbe(k.stimme)}.schluss.${ausgang}`);
  return [ruhig, schluss].filter((t): t is string => t !== null).join(" ");
}

/** Der Satz, solange die Rechenmaschine die Partie durchsieht. */
export function rechnetsatz(k: Besprechungskontext): string {
  return new Ziehung(k.partiekennung).zeile(`${vorsilbe(k.stimme)}.rechnet`) ?? "";
}

/**
 * Ambroses Angebot am Ende der Blase, wenn es eine Folge zu zeigen gibt (Abschnitt 10 des
 * Entwurfs); ohne Ambrose kein Satz, dort steht nur der Knopf.
 * Beispiel: Patzer mit besserem Weg → „Soll ich es dir zeigen?“; brillanter Zug → „Soll ich dir
 * zeigen, wie es weitergeht?“. `nr` ist die Nummer des Moments (verschiedene Zeilen je Moment).
 */
export function angebotssatz(k: Besprechungskontext, besser: boolean, nr: number): string {
  if (k.stimme !== "ambrose") return "";
  const gruppe = besser ? "besprechung.ambrose.angebot" : "besprechung.ambrose.angebotWeiter";
  const schluessel = zieheAus([gruppe], nr, k.partiekennung);
  return schluessel ? tSpiel(schluessel) : "";
}

/** Der Satz, während die Folge läuft („Sieh her: g6 Df3.“); ohne Ambrose als Notiz. */
export function zeigsatz(k: Besprechungskontext, folge: string): string {
  const gruppe = k.stimme === "ambrose" ? "besprechung.ambrose.zeigt" : "besprechung.allein.zeigt";
  const schluessel = zieheAus([gruppe], 0, k.partiekennung);
  return schluessel ? tSpiel(schluessel, { folge }) : folge;
}
