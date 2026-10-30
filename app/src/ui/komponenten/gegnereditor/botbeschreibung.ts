/**
 * Beschreibung eines eigenen Bots aus seinen Einstellungen: Textbausteine zu Stärke, Stil, typischen
 * Fehlern und blinden Flecken, zu zwei bis vier kurzen Sätzen zusammengesetzt.
 *
 * Rolle im Gesamtbild: Wunsch des Autors (26.10.2026): eigene Bots sollen eine Beschreibung
 * bekommen, als Vorschlag aus den Einstellungen („ein Puzzlesystem, das Textbausteine erzeugt“).
 * Sie steht wie der Satz der vorgefertigten Bots in der Sprechblase der Gegnerwahl und im Editor.
 * Die Sätze entstehen bei jedem Zeigen neu; gespeichert wird nichts (kein neues Datenformat).
 * Gewählt werden die Fehlerarten und Flecken, die der Bot am stärksten macht (Regler über 0), sonst
 * die angehakten; höchstens drei, damit der Text kurz bleibt.
 * Seit Paket 9 (30.10.2026) dazu die festen Eröffnungen („Eröffnet gern: …“).
 * Abhängigkeiten: engine/gegner.ts (EigenerGegner), engine/stile.ts, stiltext.ts, i18n.
 */
import type { BlinderFleck, Fehlerart } from "../../../engine/fehlerart-typen";
import type { EigenerGegner } from "../../../engine/gegner";
import { mixAusStil } from "../../../engine/stile";
import { t } from "../../../i18n/sprache";
import { eroeffnungsname } from "../../../spiel/boteroeffnung";
import { stilkurz } from "./stiltext";

/** Höchstens so viele Fehlerarten und Flecken je Satz. */
const HOECHSTENS = 3;
/** Obergrenzen der Stärkebereiche (Durchschnitt der drei Stufen). */
const EINSTEIGER_BIS = 3;
const VEREIN_BIS = 6;
const FORTGESCHRITTEN_BIS = 8;

/** Die Fehlerarten mit einem Textbaustein (Gegenwart, „lässt Figuren hängen“). */
const BAUSTEINARTEN = [
  "figurHaengen",
  "schlagreflex",
  "verfruehteDame",
  "koenigMitte",
  "taktikUebersehen",
  "drohungIgnoriert",
  "tempoverlust",
  "bauernraub",
  "koenigsschild",
  "falscherAbtausch",
  "koenigPassiv",
  "bauernvorstoss",
  "pattGesetzt",
  "bauerEingestellt",
  "schlagVerpasst",
  "bauernzugOhneNot",
  "koenigszugOhneNot",
] as const;
type Bausteinart = (typeof BAUSTEINARTEN)[number];
const istBausteinart = (f: Fehlerart): f is Bausteinart =>
  (BAUSTEINARTEN as readonly string[]).includes(f);

/** So viele feste Eröffnungen nennt der Satz, der Rest zählt als „und n weitere“. */
const EROEFFNUNGEN_GENANNT = 2;

/** Anzahl der Phasen, über die die Stufen gemittelt werden. */
const PHASEN = 3;

/** Stärkebereich nach dem Durchschnitt der Stufen. */
function staerkebereich(g: EigenerGegner): "einsteiger" | "verein" | "fortgeschritten" | "koenner" {
  const s = g.stufenJePhase;
  const d = (s.eroeffnung + s.mittelspiel + s.endspiel) / PHASEN;
  if (d <= EINSTEIGER_BIS) return "einsteiger";
  if (d <= VEREIN_BIS) return "verein";
  return d <= FORTGESCHRITTEN_BIS ? "fortgeschritten" : "koenner";
}

/** Die stärksten Einträge: Regler über 0 absteigend, sonst die angehakten. */
function staerkste<T extends string>(g: EigenerGegner, angehakt: readonly T[]): T[] {
  const stufen = g.reglerstufen;
  if (stufen) {
    return (Object.entries(stufen) as [T, number][])
      .filter(([art, stufe]) => stufe > 0 && angehakt.includes(art))
      .sort((a, b) => b[1] - a[1])
      .map(([art]) => art)
      .slice(0, HOECHSTENS);
  }
  return angehakt.slice(0, HOECHSTENS);
}

/** „a, b und c“. */
function aufzaehlung(teile: readonly string[]): string {
  if (teile.length <= 1) return teile.join("");
  return t("botbeschreibung.und", {
    anfang: teile.slice(0, -1).join(", "),
    ende: teile.at(-1) ?? "",
  });
}

/** Ohne Namen der Daten: Praxis-Eröffnungen ohne Vorsilbe, Buch-Eröffnungen wie gespeichert. */
const ohneVorsilbe = (wert: string) => eroeffnungsname(wert, null, false);

/**
 * Der Satz zu den festen Eröffnungen (Paket 9), leer ohne.
 * Beispiel: [Italienisch, London] → „Eröffnet gern: Italienische Partie oder London-System.“
 */
function eroeffnungssatz(g: EigenerGegner, namen: (wert: string) => string): string {
  const liste = g.eroeffnungen ?? [];
  if (liste.length === 0) return "";
  const genannt = liste.slice(0, EROEFFNUNGEN_GENANNT).map(namen);
  const rest = liste.length - genannt.length;
  const text =
    rest > 0
      ? t("botbeschreibung.weitere", { liste: genannt.join(", "), anzahl: String(rest) })
      : genannt.length > 1
        ? t("botbeschreibung.oder", {
            anfang: genannt.slice(0, -1).join(", "),
            ende: genannt.at(-1) ?? "",
          })
        : (genannt[0] ?? "");
  return t("botbeschreibung.eroeffnungen", { liste: text });
}

/**
 * Die Beschreibung eines eigenen Bots.
 * Beispiel: Stufen 3 · 3 · 2, Stil Angreifer, Fehler „Figur hängen lassen“, Fleck „Rückzüge“ →
 * „Ein Gegner für Einsteiger. Spielt im Stil Angreifer. Typisch: lässt Figuren hängen. Übersieht
 * gern Rückzüge.“
 * Sonderfall: ohne Fehlerarten und Flecken „Macht kaum typische Fehler.“
 * Seit Paket 9 am Ende ein Satz zu festen Eröffnungen; `namen` macht aus einem gespeicherten Wert
 * den Namen zur Anzeige (spiel/boteroeffnung.ts, eroeffnungsname).
 */
export function botbeschreibung(
  g: EigenerGegner,
  namen: (wert: string) => string = ohneVorsilbe,
): string {
  const mix = g.stilmix ?? mixAusStil(g.stilname);
  const fehler = staerkste<Fehlerart>(g, g.fehlerarten).filter(istBausteinart);
  const flecken = staerkste<BlinderFleck>(g, g.blindeFlecken);
  const saetze = [
    t(`botbeschreibung.staerke.${staerkebereich(g)}`),
    t("botbeschreibung.stil", { stil: stilkurz(mix) }),
    fehler.length > 0
      ? t("botbeschreibung.fehler", {
          liste: aufzaehlung(fehler.map((f) => t(`botbeschreibung.art.${f}`))),
        })
      : flecken.length === 0
        ? t("botbeschreibung.fehlerfrei")
        : "",
    flecken.length > 0
      ? t("botbeschreibung.flecken", { liste: aufzaehlung(flecken.map((f) => t(`blind.${f}`))) })
      : "",
    eroeffnungssatz(g, namen),
  ];
  return saetze.filter(Boolean).join(" ");
}
