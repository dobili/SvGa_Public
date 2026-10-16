/**
 * Werkzeug k12-sicherheitsblick: die drei Fragen vor dem Ziehen. Steht mein König danach sicher?
 * Kann der Gegner die gezogene Figur sofort schlagen? Erlaube ich ein Schach oder gar ein Matt?
 *
 * Rolle im Gesamtbild: Pflichtenheft 6.3 („Sicherheitsblick. E“). Gold: der geprüfte Zug; rot:
 * der Schlag auf die gezogene Figur und die Schachs, die der Zug erlaubt.
 * Abhängigkeiten: chessops, analyse/stellungsprofil.ts, schach/drohungen.ts, i18n.
 * Buchbezug: Kapitel 12, Denkroutine Schritt 4 („Bevor du ziehst, folgt der Sicherheitsblick auf
 * den gewählten Zug, drei Fragen“); Übung 12.6 (Zeitnot: 1. Txd5? erlaubt Lh2+).
 */
import { kingAttacks } from "chessops/attacks";
import type { Chess } from "chessops/chess";
import { makeSan, parseSan } from "chessops/san";
import type { Color, NormalMove, Square } from "chessops/types";
import { t } from "../i18n/sprache";
import { erzwingendeZuege, type ErzwingendeZuege } from "../schach/drohungen";
import { koenigImFreien } from "../schach/koenigImFreien";
import { feldname, gegner, type Stellung } from "../schach/stellung";
import { profil } from "./stellungsprofil";
import { aufzaehlung, farbname, mitVorzeichen, zugtext } from "./texte";
import type { Befund, Markierung, Werkzeug, Werkzeugergebnis } from "./werkzeug";

/** Was der Sicherheitsblick zu einem Zug ergibt. */
interface Blick {
  readonly san: string;
  readonly zug: NormalMove;
  readonly danach: Stellung;
  /** Erzwingende Züge des Gegners nach dem Zug. */
  readonly gegner: ErzwingendeZuege;
  /** Freie Nachbarfelder des eigenen Königs danach. */
  readonly luft: readonly Square[];
  /** Angegriffene Nachbarfelder, wenn der König danach im Freien steht; sonst null (C1.29). */
  readonly imFreien: readonly Square[] | null;
  /** Bilanz des Gegners, wenn er die gezogene Figur schlägt; null, wenn er sie nicht angreift. */
  readonly schlagbilanz: number | null;
  readonly schlagzug: string | null;
}

/** Die Stellung nach einem Zug als Stellung der App. */
function spiele(stellung: Stellung, regeln: Chess, zug: NormalMove): Stellung {
  const danach = regeln.clone();
  danach.play(zug);
  return { fen: stellung.fen, brett: danach.board, amZug: danach.turn, regeln: danach };
}

/** Freie Nachbarfelder des Königs: weder besetzt von eigenen Figuren noch vom Gegner angegriffen. */
function luftDesKoenigs(danach: Stellung, eigen: Color): Square[] {
  const koenig = danach.brett.kingOf(eigen);
  if (koenig === undefined) return [];
  const karte = profil(danach).angriffskarte;
  return [...kingAttacks(koenig)].filter(
    (feld) => danach.brett.get(feld)?.color !== eigen && !karte.greiftAn(feld, gegner(eigen)),
  );
}

/** Rechnet den Sicherheitsblick für einen Zug in SAN; null, wenn der Zug nicht geht. */
function blick(stellung: Stellung, eigen: Color, san: string): Blick | null {
  const { regeln } = stellung;
  if (!regeln || regeln.turn !== eigen) return null;
  const zug = parseSan(regeln, san) as NormalMove | undefined;
  if (!zug) return null;
  const danach = spiele(stellung, regeln, zug);
  const e = erzwingendeZuege(danach.regeln as Chess);
  const schlag = e.schlaege.find((s) => s.nach === zug.to);
  return {
    san: makeSan(regeln, zug),
    zug,
    danach,
    gegner: e,
    luft: luftDesKoenigs(danach, eigen),
    imFreien: koenigImFreien(danach, eigen),
    schlagbilanz: schlag ? schlag.bilanz : null,
    schlagzug: schlag ? schlag.san : null,
  };
}

/** Einzahl und Mehrzahl: „kein freies Nachbarfeld“, „ein freies …“, „3 freie Nachbarfelder“. */
function luftSchluessel(
  anzahl: number,
): "sicher.koenig.luftKeins" | "sicher.koenig.luftEins" | "sicher.koenig.luft" {
  if (anzahl === 0) return "sicher.koenig.luftKeins";
  return anzahl === 1 ? "sicher.koenig.luftEins" : "sicher.koenig.luft";
}

/**
 * Frage 1: Steht mein König danach sicher? Matt und Patt zuerst, dann der König im Freien
 * (ohne Bauernschild, Nachbarfelder angegriffen; Befund C1.29, Abb. 12.3), Luft und Schachs.
 */
function frage1(b: Blick): string[] {
  const regeln = b.danach.regeln;
  // Präzisierung aus Kapitel 10, Prüfung 3: Ein Zug, der patt setzt, ist der schlimmste Fall.
  if (regeln?.isStalemate()) return [t("sicher.koenig.patt")];
  if (regeln?.isCheckmate()) return [t("sicher.koenig.mattGesetzt")];
  const matt = b.gegner.schachs.find((s) => s.matt);
  if (matt) return [t("sicher.koenig.matt", { zug: zugtext(matt.san) })];
  const zeilen = b.imFreien
    ? [t("sicher.koenig.imFreien", { felder: aufzaehlung(b.imFreien.map(feldname)) })]
    : [];
  zeilen.push(
    t(luftSchluessel(b.luft.length), {
      anzahl: b.luft.length,
      felder: aufzaehlung(b.luft.map(feldname)),
    }),
  );
  const schachs = b.gegner.schachs.length;
  zeilen.push(
    schachs === 0
      ? t("sicher.koenig.ruhig")
      : t(schachs === 1 ? "sicher.koenig.unruhigEins" : "sicher.koenig.unruhig", {
          anzahl: schachs,
        }),
  );
  return zeilen;
}

/** Frage 2: Kann der Gegner die gezogene Figur sofort schlagen? */
function frage2(b: Blick): string[] {
  if (b.schlagbilanz === null || b.schlagzug === null)
    return [t("sicher.figur.nein", { feld: feldname(b.zug.to) })];
  const werte = { zug: zugtext(b.schlagzug), bilanz: mitVorzeichen(b.schlagbilanz) };
  if (b.schlagbilanz > 0) return [t("sicher.figur.verliert", werte)];
  return [t("sicher.figur.gedeckt", werte)];
}

/** Frage 3: Erlaube ich ein Schach oder gar ein Matt? */
function frage3(b: Blick): string[] {
  const matt = b.gegner.schachs.find((s) => s.matt);
  if (matt) return [t("sicher.schach.matt", { zug: zugtext(matt.san) })];
  if (b.gegner.schachs.length === 0) return [t("sicher.schach.keins")];
  return [
    t("sicher.schach.liste", { zuege: aufzaehlung(b.gegner.schachs.map((s) => zugtext(s.san))) }),
  ];
}

/** Gold der Zug, rot der Schlag auf die Figur, die erlaubten Schachs und die angegriffenen Nachbarfelder des Königs im Freien. */
function markierungen(b: Blick): Markierung[] {
  const marken: Markierung[] = [
    { typ: "pfeil", farbe: "gold", von: feldname(b.zug.from), nach: feldname(b.zug.to) },
  ];
  for (const s of b.gegner.schlaege.filter((s) => s.nach === b.zug.to).slice(0, 1)) {
    marken.push({ typ: "pfeil", farbe: "rot", von: feldname(s.von), nach: feldname(s.nach) });
  }
  for (const s of b.gegner.schachs) {
    marken.push({ typ: "pfeil", farbe: "rot", von: feldname(s.von), nach: feldname(s.nach) });
  }
  for (const feld of b.imFreien ?? []) {
    marken.push({ typ: "feld", farbe: "rot", feld: feldname(feld) });
  }
  return marken;
}

/** Ergebnis ohne prüfbaren Zug. */
function ohneZug(eigen: Color): Werkzeugergebnis {
  return {
    werkzeug: "k12-sicherheitsblick",
    art: "E",
    ueberschrift: t("sicher.titel"),
    befunde: [
      {
        kennung: "hinweis",
        art: "E",
        titel: t("sicher.hinweisTitel"),
        zeilen: [t("sicher.ohneZug", { farbe: farbname(eigen) })],
        farbe: null,
      },
    ],
    fazit: t("sicher.ohneZug", { farbe: farbname(eigen) }),
    markierungen: [],
    stufen: [["hinweis"], ["hinweis"], ["hinweis"]],
    regel: t("werkzeug.k12-sicherheitsblick.regel"),
  };
}

/** Fazit: sicher, oder was der Zug erlaubt. */
function fazit(b: Blick): string {
  if (b.danach.regeln?.isStalemate()) return t("sicher.fazitPatt", { zug: zugtext(b.san) });
  if (b.danach.regeln?.isCheckmate()) return t("sicher.fazitMattGesetzt", { zug: zugtext(b.san) });
  const matt = b.gegner.schachs.find((s) => s.matt);
  if (matt) return t("sicher.fazitMatt", { zug: zugtext(b.san), matt: zugtext(matt.san) });
  if (b.schlagbilanz !== null && b.schlagbilanz > 0 && b.schlagzug)
    return t("sicher.fazitVerliert", { zug: zugtext(b.san), schlag: zugtext(b.schlagzug) });
  if (b.imFreien) return t("sicher.fazitImFreien", { zug: zugtext(b.san) });
  const schachs = b.gegner.schachs.length;
  if (schachs > 0)
    return t(schachs === 1 ? "sicher.fazitSchachEins" : "sicher.fazitSchach", {
      zug: zugtext(b.san),
      anzahl: schachs,
    });
  return t("sicher.fazitSicher", { zug: zugtext(b.san) });
}

/**
 * Stellt die drei Fragen des Sicherheitsblicks zu einem geplanten Zug.
 *
 * Eingaben: Stellung, eigene Seite, Zug in SAN (der nächste Buchzug oder ein eigener). Ausgabe:
 * drei Befunde. Beispiel: Abb. 12.1 mit 1. Lxh7+: Der Läufer kann geschlagen werden („gerade
 * der Plan“), der weiße König steht sicher. Übung 12.6 mit 1. Txd5: erlaubt 1... Lh2+.
 * Sonderfall: ohne Zug, ohne Regeln oder wenn der Gegner am Zug ist ein Hinweis.
 */
export function sicherheitsblick(stellung: Stellung, eigen: Color, zug?: string): Werkzeugergebnis {
  const b = zug ? blick(stellung, eigen, zug) : null;
  if (!b) return ohneZug(eigen);
  const befunde: Befund[] = [
    { kennung: "koenig", art: "E", titel: t("sicher.koenigTitel"), zeilen: frage1(b), farbe: null },
    { kennung: "figur", art: "E", titel: t("sicher.figurTitel"), zeilen: frage2(b), farbe: "rot" },
    {
      kennung: "schach",
      art: "E",
      titel: t("sicher.schachTitel"),
      zeilen: frage3(b),
      farbe: "rot",
    },
  ];
  return {
    werkzeug: "k12-sicherheitsblick",
    art: "E",
    ueberschrift: t("sicher.titelZug", { zug: zugtext(b.san) }),
    befunde,
    fazit: fazit(b),
    markierungen: markierungen(b),
    stufen: [
      ["koenig", "figur", "schach"],
      ["koenig", "figur", "schach"],
      ["koenig", "figur", "schach"],
    ],
    regel: t("werkzeug.k12-sicherheitsblick.regel"),
  };
}

/** Was der Sicherheitsblick im Spiel gegen die Engine vor einem Zug meldet. */
export interface Sicherheitswarnung {
  readonly art: "matt" | "figur";
  /** Das Fazit des Sicherheitsblicks, etwa „1. Txd5 erlaubt 1... Lh2+ …“. */
  readonly text: string;
  readonly markierungen: readonly Markierung[];
}

/**
 * Prüft einen Zug im Spiel: Erlaubt er ein Matt oder verliert er die gezogene Figur?
 *
 * Warum: Bildschirmentwurf „Partie“: Vor dem Zug fragt die App „Erlaubst du ein Matt?“ mit
 * „Anderen Zug wählen“ und „Trotzdem ziehen“ (Kapitel 12, Denkroutine Schritt 4).
 * Ausgabe: Warnung oder null, wenn der Zug sicher ist, selbst mattsetzt oder nicht geht.
 * Beispiel: Übung 12.6 mit 1. Txd5 → nur ein Schach, keine Warnung; ein Zug, nach dem der
 * Gegner mattsetzt → Art „matt“.
 */
export function sicherheitswarnung(
  stellung: Stellung,
  eigen: Color,
  zug: string,
): Sicherheitswarnung | null {
  const b = blick(stellung, eigen, zug);
  if (!b || b.danach.regeln?.isCheckmate()) return null;
  const matt = b.gegner.schachs.some((s) => s.matt);
  const verliert = b.schlagbilanz !== null && b.schlagbilanz > 0;
  if (!matt && !verliert) return null;
  return { art: matt ? "matt" : "figur", text: fazit(b), markierungen: markierungen(b) };
}

/** Das Werkzeug k12-sicherheitsblick in der gemeinsamen Form aller Werkzeuge (Konzept 7.1). */
export const k12Sicherheitsblick: Werkzeug = {
  id: "k12-sicherheitsblick",
  kapitel: 12,
  name: "werkzeug.k12-sicherheitsblick.name",
  regel: "werkzeug.k12-sicherheitsblick.regel",
  erklaerung: "werkzeug.k12-sicherheitsblick.erklaerung",
  art: "E",
  braucht: ["stellung", "zug"],
  berechne: ({ stellung, perspektive, zug }) => sicherheitsblick(stellung, perspektive, zug),
};
