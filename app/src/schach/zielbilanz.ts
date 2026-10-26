/**
 * Zielbilanz: die drei Prüfungen aus Kapitel 2 für eine Seite (Zentrum, Entwicklung, König).
 *
 * Rolle im Gesamtbild: Baustein für das Werkzeug k2-zielbilanz. Pflichtenheft 6.2: „Zentrums-
 * prüfung: eigener Bauer auf d4, e4, d5 oder e5, sonst Kontrolle der Felder durch Figuren.
 * Entwicklungsprüfung: alle vier Leichtfiguren haben ihr Startfeld verlassen, getauschte zählen
 * als erledigt. Königsprüfung: rochiert, und von den drei Bauern vor dem König stehen mindestens
 * zwei höchstens ein Feld von ihrem Ausgangsfeld entfernt. Ergebnis je Seite als ja, teils oder
 * nein wie im Buch.“ Kalibriert an den Zielbilanzen aus Kapitel 2 (kap02.json, `bilanzen`).
 * Seit 0.2.33 (Entscheidungen des Autors vom 16.10.2026): Ein angegriffener Zentrumsbauer zählt
 * voll, ob er wirklich hängt, prüft danach die Engine (C1.1, engine/zentrumsschlag.ts); ein König
 * eine Reihe vor der Grundreihe am Rand gilt als rochiert mit beschädigtem Schild (C2.20).
 * Abhängigkeiten: chessops, angriffskarte.ts, abtausch.ts, stellung.ts.
 * Buchbezug: Kapitel 1, „Die drei Ziele jeder Eröffnung“; Kapitel 2, Zentrums-, Entwicklungs-
 * und Königsprüfung.
 */
import type { Board } from "chessops/board";
import type { Color, Role, Square } from "chessops/types";
import { squareFile, squareFromCoords, squareRank } from "chessops/util";
import { abtausch } from "./abtausch";
import type { Angriffskarte, Figurenstand } from "./angriffskarte";
import { feldAusName, gegner } from "./stellung";

export type Wertung = "ja" | "teils" | "nein";

/** Die vier Zentrumsfelder (Kapitel 1: „die wertvollste Immobilie auf dem Brett“). */
export const ZENTRUM: readonly Square[] = ["d4", "e4", "d5", "e5"].flatMap(
  (name) => feldAusName(name) ?? [],
);

/**
 * Ab so vielen kontrollierten Zentrumsfeldern gilt das Zentrum ohne Bauern als erfüllt
 * (Pflichtenheft 6.6, „Zentrumskontrolle durch Figuren“: mindestens zwei der vier Felder).
 */
const KONTROLLE_FUER_JA = 2;
/** Ab so vielen erledigten Leichtfiguren ist die Entwicklung „teils“ (Buch: zwei fehlen, teils). */
const ENTWICKELT_FUER_TEILS = 2;
const LEICHTFIGUREN = 4;
/** Mindestens so viele Schildbauern müssen stehen (Kapitel 2, Königsprüfung). */
const SCHILD_MINDESTENS = 2;
/** Grundreihe (Index) und Vorwärtsrichtung je Farbe. */
const GRUNDREIHE: Readonly<Record<Color, number>> = { white: 0, black: 7 };
const VORWAERTS: Readonly<Record<Color, number>> = { white: 1, black: -1 };
/** Startlinien der Leichtfiguren: Springer b und g, Läufer c und f. */
const STARTLINIEN: readonly { readonly linie: number; readonly rolle: Role }[] = [
  { linie: 1, rolle: "knight" },
  { linie: 6, rolle: "knight" },
  { linie: 2, rolle: "bishop" },
  { linie: 5, rolle: "bishop" },
];
/** König auf diesen Linien der Grundreihe gilt als rochiert (kurz: f bis h ohne f, lang: a bis c). */
const ROCHADELINIEN = new Set([0, 1, 2, 6, 7]);
const LETZTE_LINIE = 7;

export interface Zentrumspruefung {
  readonly wertung: Wertung;
  /** Eigene Bauern auf Zentrumsfeldern; alle zählen für die Wertung (seit 0.2.33, C1.1). */
  readonly bauern: readonly Square[];
  /**
   * Davon die, die der Gegner am Zug laut Abtauschrechnung auf dem Feld mit Gewinn schlagen
   * könnte. Ob der Schlag auch nach der besten Antwort Material bringt, prüft die Engine
   * (engine/zentrumsschlag.ts); bis dahin heißt ein solcher Bauer nur „angegriffen“.
   */
  readonly angegriffen: readonly Square[];
  /**
   * Ohne Zentrumsbauern: die Zentrumsfelder, die eigene Figuren mindestens so oft angreifen wie
   * der Gegner (Art N).
   */
  readonly kontrolliert: readonly Square[];
}

export interface Entwicklungspruefung {
  readonly wertung: Wertung;
  /** Leichtfiguren, die noch auf ihrem Startfeld stehen. */
  readonly offen: readonly Figurenstand[];
}

export interface Koenigspruefung {
  readonly wertung: Wertung;
  readonly koenig: Square | null;
  readonly rochiert: boolean;
  /**
   * Der König hatte rochiert und steht jetzt eine Reihe vor der Grundreihe (gezogen oder
   * gejagt, etwa nach Kxh7): rochiert, Schild beschädigt.
   */
  readonly vorgerueckt: boolean;
  /** Die Schildbauern, die höchstens ein Feld vorgerückt sind. */
  readonly schild: readonly Square[];
}

export interface Zielbilanz {
  readonly farbe: Color;
  readonly zentrum: Zentrumspruefung;
  readonly entwicklung: Entwicklungspruefung;
  readonly koenig: Koenigspruefung;
}

/** Zentrumskontrolle zählt nur direkte Angreifer (siehe zentrumspruefung). */
const OHNE_BATTERIE = false;

/**
 * Zentrumsprüfung einer Seite.
 *
 * Regel: Kapitel 2, „Steht mindestens ein eigener Bauer auf einem der vier Zentrumsfelder? Oder
 * kontrollieren deine Figuren die Zentrumsfelder so gut, dass der Gegner sie nicht ungestört
 * besetzen kann?“ Jeder Zentrumsbauer zählt (ja). Einen Bauern, den der Gegner am Zug laut
 * Abtauschrechnung auf dem Feld mit Gewinn schlagen könnte, nennt die App nur „angegriffen“:
 * Ob der Schlag auch nach der besten Antwort Material bringt, sieht die Zählung auf einem Feld
 * nicht (Abb. 2.40: 3... Sxe4?! 4. De2!; Abb. 2.24: 6... Sxe4? 7. dxc5). Das prüft danach die
 * Engine; hängt der Bauer wirklich, gilt das Zentrum nur als teils (zentrumMitEngine, Abb. 2.29:
 * „Bauer d5 … kann aber gleich geschlagen werden“). Entscheidung des Autors zu C1.1 (16.10.2026).
 * Ohne Zentrumsbauern gilt Pflichtenheft 6.6: ja, wenn eigene Figuren mindestens zwei der vier
 * Zentrumsfelder mindestens so oft angreifen wie der Gegner; teils bei einem Feld; sonst nein.
 * Gezählt werden nur Figuren, die das Feld direkt angreifen, keine Batterien dahinter (seit
 * 0.2.32): Kontrolle eines Feldes heißt, welche Figuren es jetzt treffen; Batterien gehören zur
 * Abtauschrechnung auf einem besetzten Feld. Befund des Autors zu Abb. 2.128: Der Läufer
 * beherrscht d4 und e5; e5 zählte vorher nicht, weil die Dame c7 hinter Ld6 mitgezählt wurde.
 */
function zentrumspruefung(
  brett: Board,
  karte: Angriffskarte,
  farbe: Color,
  amZug: Color,
): Zentrumspruefung {
  const bauern = ZENTRUM.filter((feld) => {
    const figur = brett.get(feld);
    return figur?.role === "pawn" && figur.color === farbe;
  });
  const gegnerAmZug = amZug !== farbe;
  const angegriffen = bauern.filter(
    (feld) => gegnerAmZug && (abtausch(brett, feld)?.bilanz ?? 0) > 0,
  );
  const kontrolliert = ZENTRUM.filter((feld) => {
    const eigene = karte.angreiferVon(feld, farbe, OHNE_BATTERIE).length;
    return eigene > 0 && eigene >= karte.angreiferVon(feld, gegner(farbe), OHNE_BATTERIE).length;
  });
  if (bauern.length > 0) return { wertung: "ja", bauern, angegriffen, kontrolliert: [] };
  const wertung: Wertung =
    kontrolliert.length >= KONTROLLE_FUER_JA ? "ja" : kontrolliert.length > 0 ? "teils" : "nein";
  return { wertung, bauern, angegriffen, kontrolliert };
}

/**
 * Die Wertung des Zentrums, nachdem die Engine die angegriffenen Bauern geprüft hat.
 *
 * Regel: Kapitel 2, Zentrumsprüfung: Ein Bauer, der „gleich geschlagen werden“ kann, zählt nur
 * als teils (Abb. 2.29). Warum eigene Funktion: Die Engine rechnet erst nach dem Werkzeug
 * (ui/komponenten/werkzeugkarten/ZentrumKarte.tsx); Karte und Kalibrierung setzen ihr Urteil gleich ein.
 * Eingaben: die Zentrumsprüfung, die Bauern, die laut Engine wirklich hängen.
 * Ausgabe: ja, solange mindestens ein Zentrumsbauer nicht hängt; sonst teils.
 * Beispiel: Abb. 2.29, Schwarz: d5 hängt (11. Lxd5) → teils. Abb. 2.24, Weiß: e4 hängt nicht
 * (6... Sxe4? 7. dxc5) → ja mit d4 und e4.
 * Sonderfälle: Ohne Zentrumsbauern bleibt die Wertung der Figurenkontrolle unverändert.
 */
export function zentrumMitEngine(z: Zentrumspruefung, haengen: readonly Square[]): Wertung {
  if (z.bauern.length === 0) return z.wertung;
  return z.bauern.some((feld) => !haengen.includes(feld)) ? "ja" : "teils";
}

/**
 * Entwicklungsprüfung einer Seite.
 *
 * Regel: Kapitel 2, „Zähle deine vier Leichtfiguren … Haben alle vier ihr Startfeld verlassen,
 * ist das Ziel erfüllt, wobei eine Leichtfigur, die schon abgetauscht wurde, als erledigt
 * zählt.“ Teils bei zwei oder drei erledigten (Abb. 2.76: „Springer b1 und Läufer c1 fehlen
 * noch“, teils), nein bei höchstens einer (Abb. 2.76: „Nur der Springer f6“, nein).
 */
function entwicklungspruefung(brett: Board, farbe: Color): Entwicklungspruefung {
  const offen = STARTLINIEN.flatMap(({ linie, rolle }) => {
    const feld = squareFromCoords(linie, GRUNDREIHE[farbe]);
    const figur = feld === undefined ? undefined : brett.get(feld);
    return feld !== undefined && figur?.role === rolle && figur.color === farbe
      ? [{ feld, figur }]
      : [];
  });
  const erledigt = LEICHTFIGUREN - offen.length;
  const wertung: Wertung =
    erledigt === LEICHTFIGUREN ? "ja" : erledigt >= ENTWICKELT_FUER_TEILS ? "teils" : "nein";
  return { wertung, offen };
}

/** Schildbauern vor einem König auf der Grundreihe: die drei Linien um ihn, Reihe 2 oder 3. */
function schildbauern(brett: Board, farbe: Color, koenig: Square): Square[] {
  const mitte = Math.min(Math.max(squareFile(koenig), 1), LETZTE_LINIE - 1);
  const reihen = [1, 2].map((schritt) => GRUNDREIHE[farbe] + schritt * VORWAERTS[farbe]);
  return [mitte - 1, mitte, mitte + 1].flatMap((linie) =>
    reihen.flatMap((reihe) => {
      const feld = squareFromCoords(linie, reihe);
      const figur = feld === undefined ? undefined : brett.get(feld);
      return feld !== undefined && figur?.role === "pawn" && figur.color === farbe ? [feld] : [];
    }),
  );
}

/** Steht der König auf einer Rochadelinie (a, b, c, g oder h) dieser Reihe seiner Farbe? */
function aufRochadelinie(koenig: Square, farbe: Color, schritte: number): boolean {
  const reihe = GRUNDREIHE[farbe] + schritte * VORWAERTS[farbe];
  return squareRank(koenig) === reihe && ROCHADELINIEN.has(squareFile(koenig));
}

/** Steht der König dieser Seite rochiert (am Rand der Grundreihe oder eine Reihe davor)? */
export function koenigRochiert(brett: Board, farbe: Color): boolean {
  return koenigspruefung(brett, farbe).rochiert;
}

/**
 * Königsprüfung einer Seite.
 *
 * Regel: Kapitel 2, „Hat der König rochiert, und stehen von den drei Bauern direkt vor ihm
 * (nach der kurzen Rochade der f-, g- und h-Bauer) noch mindestens zwei höchstens ein Feld von
 * ihrem Ausgangsfeld entfernt?“ Rochiert heißt: Der König steht auf der Grundreihe am Rand
 * (a, b, c, g oder h). Rochiert mit gelockertem Schild: teils. Nicht rochiert: nein.
 * Steht der König auf denselben Linien eine Reihe weiter vorn (h7, g7, b7, bei Weiß h2, g2, b2),
 * hatte er rochiert und wurde gezogen oder gejagt: rochiert, Schild beschädigt, also teils
 * (Entscheidung des Autors zu C2.20: Abb. 12.2 nach 1. Lxh7+ Kxh7 2. Sg5+; ebenso der König g2
 * nach der künstlichen Rochade in Abb. 3.53).
 */
function koenigspruefung(brett: Board, farbe: Color): Koenigspruefung {
  const koenig = brett.kingOf(farbe) ?? null;
  const ohne = { koenig, rochiert: false, vorgerueckt: false, schild: [] };
  if (koenig === null) return { wertung: "nein", ...ohne };
  if (aufRochadelinie(koenig, farbe, 1)) {
    return { wertung: "teils", koenig, rochiert: true, vorgerueckt: true, schild: [] };
  }
  if (!aufRochadelinie(koenig, farbe, 0)) return { wertung: "nein", ...ohne };
  const schild = schildbauern(brett, farbe, koenig);
  const wertung = schild.length >= SCHILD_MINDESTENS ? "ja" : "teils";
  return { wertung, koenig, rochiert: true, vorgerueckt: false, schild };
}

/**
 * Die Zielbilanz einer Seite: drei Prüfungen mit ja, teils oder nein.
 *
 * Warum: Kapitel 2 schließt jede Hauptvariante mit einer Zielbilanz ab; die App prüft jede
 * Stellung auf dieselbe Weise. Eingaben: Brett, Angriffskarte, Farbe, Seite am Zug (für
 * „angegriffen“: nur der Gegner am Zug kann gleich schlagen). Ausgabe: die drei Prüfungen.
 * Beispiel: Abb. 2.11 (Spanisch, Hauptvariante): Weiß und Schwarz dreimal ja.
 * Sonderfälle: Ohne König ist die Königsprüfung nein.
 */
export function zielbilanz(
  brett: Board,
  karte: Angriffskarte,
  farbe: Color,
  amZug: Color,
): Zielbilanz {
  return {
    farbe,
    zentrum: zentrumspruefung(brett, karte, farbe, amZug),
    entwicklung: entwicklungspruefung(brett, farbe),
    koenig: koenigspruefung(brett, farbe),
  };
}
