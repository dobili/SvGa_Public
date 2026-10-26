/**
 * Texte des Werkzeugs k12-kandidaten: die drei Befunde (Sammeln, Antwort, Bewerten) und das
 * Fazit aus den gerechneten Kandidaten und Antworten.
 *
 * Rolle im Gesamtbild: Textteil von k12-kandidaten (der Rechenteil steht in k12-kandidaten.ts
 * und k12-antwort.ts), damit jede Datei unter 400 Zeilen bleibt.
 * Abhängigkeiten: i18n, analyse/texte.ts, analyse/k12-kandidat.ts (Kandidat).
 * Buchbezug: Kapitel 12, Denkroutine Schritte 2 bis 4; Glossar „Schach“ (wegziehen, schlagen,
 * dazwischenstellen).
 */
import type { Color } from "chessops/types";
import { t, tZahl } from "../i18n/sprache";
import type { Antwort } from "./k12-antwort";
import { istRuhig, type Kandidat } from "./k12-kandidat";
import { aufzaehlung, farbname, figurenname, mitVorzeichen, zugtext } from "./texte";
import type { Befund } from "./werkzeug";

/** Was die Texte brauchen: Kandidaten, Antworten und der beste Kandidat (oder null). */
export interface Kandidatenrechnung {
  readonly eigen: Color;
  readonly imSchach: boolean;
  readonly liste: readonly Kandidat[];
  readonly antworten: readonly Antwort[];
  readonly beste: number | null;
  /** Das Werkzeug der Phase für den besten ruhigen Zug (leer im Schach). */
  readonly phasenwerkzeug: string;
}

/** Zeile zu einem Kandidaten: „1. Lxh7+ (Schach)“, „1. f5 (Abwehr: dazwischenstellen, der Buchzug)“. */
function kandidatenzeile(k: Kandidat, nr: number): string {
  const aufgabe = t(`kandidaten.art.${k.art}`);
  return t("kandidaten.zeile", {
    nr: nr + 1,
    zug: zugtext(k.san),
    art: k.buchzug && k.art !== "ruhig" ? t("kandidaten.artBuchzug", { art: aufgabe }) : aufgabe,
  });
}

/**
 * Zeile zur stärksten Antwort; ein Kandidat, auf den Matt folgt, scheidet aus (C1.28). Bei
 * ruhigen Kandidaten steht kein Materialstand, sondern der Verweis auf die Engine (R43: „Material
 * −1“ nach einem Zug Tiefe sagte über den Buchzug nichts Verlässliches).
 */
function antwortzeile(k: Kandidat, a: Antwort): string {
  if (a.mattGesetzt) return t("kandidaten.antwortMattGesetzt", { zug: zugtext(k.san) });
  if (a.art === "matt")
    return t("kandidaten.antwortMatt", { zug: zugtext(k.san), antwort: zugtext(a.san) });
  if (istRuhig(k)) return ruhigeAntwortzeile(k, a);
  if (a.art === "keine")
    return t("kandidaten.antwortKeine", { zug: zugtext(k.san), bilanz: mitVorzeichen(a.bilanz) });
  return t("kandidaten.antwort", {
    zug: zugtext(k.san),
    antwort: zugtext(a.san),
    art: t(`kandidaten.antwortArt.${a.art}`),
    gabel:
      a.gabel.length > 0
        ? t("kandidaten.gabel", { ziele: aufzaehlung(a.gabel.map(figurenname)) })
        : "",
    bilanz: mitVorzeichen(a.bilanz),
    koenig: a.imFreien ? t("kandidaten.imFreien") : "",
  });
}

/** Ein ruhiger Kandidat: die Antwort ohne Material, die Bewertung macht die Engine. */
function ruhigeAntwortzeile(k: Kandidat, a: Antwort): string {
  if (a.art === "keine") return t("kandidaten.antwortRuhig", { zug: zugtext(k.san) });
  return t("kandidaten.antwortRuhigMit", {
    zug: zugtext(k.san),
    antwort: zugtext(a.san),
    art: t(`kandidaten.antwortArt.${a.art}`),
    gabel:
      a.gabel.length > 0
        ? t("kandidaten.gabel", { ziele: aufzaehlung(a.gabel.map(figurenname)) })
        : "",
    koenig: a.imFreien ? t("kandidaten.imFreien") : "",
  });
}

/** Schritt 2: im Schach die Überschrift über die Abwehrzüge, sonst Kandidaten und Phase. */
function sammelnZeilen(r: Kandidatenrechnung): string[] {
  const farbe = farbname(r.eigen);
  if (r.imSchach) {
    if (r.liste.length === 0) return [t("kandidaten.matt", { farbe })];
    return [t("kandidaten.imSchach", { farbe }), ...r.liste.map(kandidatenzeile)];
  }
  const zeilen =
    r.liste.length > 0 ? r.liste.map(kandidatenzeile) : [t("kandidaten.keineErzwingenden")];
  zeilen.push(t("kandidaten.ruhig", { werkzeuge: r.phasenwerkzeug }));
  return zeilen;
}

/**
 * Schritt 4: der beste Kandidat gegen die stärkste Antwort nach Material, Matt zählt als
 * schlechtestes; liegt ein ruhiger Kandidat vorn oder gibt es ruhige, verweist der Satz auf die
 * Engine (R43).
 */
function bewertenZeile(r: Kandidatenrechnung): string {
  if (r.liste.length === 0)
    return r.imSchach
      ? t("kandidaten.matt", { farbe: farbname(r.eigen) })
      : t("kandidaten.keineErzwingenden");
  const ruhige = r.liste.filter(istRuhig).length;
  const kandidat = r.beste === null ? undefined : r.liste[r.beste];
  const antwort = r.beste === null ? undefined : r.antworten[r.beste];
  if (!kandidat || !antwort)
    return t(r.imSchach ? "kandidaten.alleMattImSchach" : "kandidaten.alleMatt");
  const werte = { zug: zugtext(kandidat.san), bilanz: mitVorzeichen(antwort.bilanz) };
  // Ein ruhiger Kandidat vorn: Material sagt wenig, die Engine urteilt (R43).
  if (istRuhig(kandidat)) return t("kandidaten.besteRuhig", werte);
  const zusatz = ruhige > 0 ? ` ${t("kandidaten.ruhigeUnten")}` : "";
  return t(antwort.imFreien ? "kandidaten.besteImFreien" : "kandidaten.beste", werte) + zusatz;
}

/** Fazit: wie viele Kandidaten; im Schach wie viele Abwehrzüge. */
function fazit(r: Kandidatenrechnung): string {
  const werte = { farbe: farbname(r.eigen), anzahl: r.liste.length };
  if (!r.imSchach) return tZahl("kandidaten.fazit", r.liste.length, werte);
  if (r.liste.length === 0) return t("kandidaten.matt", werte);
  return t(r.liste.length === 1 ? "kandidaten.fazitSchachEins" : "kandidaten.fazitSchach", werte);
}

/**
 * Baut die drei Befunde und das Fazit des Werkzeugs Kandidaten.
 *
 * Eingaben: die Rechnung (Kandidaten, Antworten, bester Kandidat). Ausgabe: Befunde Sammeln (E,
 * gold), Antwort (N, rot), Bewerten (N) und das Fazit.
 * Beispiel: Abb. 12.4: „Auf b5: Dxf7# (Matt) – scheidet aus: Matt.“ Abb. 12.3: „Auf f5: Sxe6
 * (Schlag mit Gewinn), danach Gabel gegen Dame c7 und Turm f8; Material danach +1, der König
 * steht im Freien.“
 * Sonderfälle: Ist die Seite matt, sagen alle drei Teile nur das.
 */
export function kandidatenBefunde(r: Kandidatenrechnung): {
  befunde: Befund[];
  fazit: string;
} {
  const befunde: Befund[] = [
    {
      kennung: "sammeln",
      art: "E",
      titel: t("kandidaten.sammelnTitel"),
      zeilen: sammelnZeilen(r),
      farbe: "gold",
    },
    {
      kennung: "antwort",
      art: "N",
      titel: t("kandidaten.antwortTitel"),
      zeilen: r.liste.map((k, i) => antwortzeile(k, r.antworten[i] as Antwort)),
      farbe: "rot",
    },
    {
      kennung: "bewerten",
      art: "N",
      titel: t("kandidaten.bewertenTitel"),
      zeilen: [bewertenZeile(r), t("kandidaten.rat")],
      farbe: null,
    },
  ];
  return { befunde, fazit: fazit(r) };
}
