/**
 * Stellungsprofil: die gemeinsamen Grundbausteine aller Werkzeuge, je Stellung einmal gerechnet.
 *
 * Rolle im Gesamtbild: Konzept 7.2: „Für jede Stellung berechnet der Kern einmal ein Profil, das
 * alle Werkzeuge teilen“: Angriffskarte, Abtauschrechnung, Strahlen (mit Linienmotiven), sichere
 * Felder, Bauernprofil, Königsumgebung, dazu die Drohungen (Konzept 7.2, „Drohungen technisch“).
 * Jeder Teil wird erst beim ersten Zugriff gerechnet und dann behalten; das Profil hängt an der
 * Stellung selbst, die nie verändert wird (stellung.ts).
 * Abhängigkeiten: alle Bausteine in schach/.
 * Buchbezug: Kapitel 1 (Zählen, Röntgen-Regel), 4 (Warnsignale), 5 (Skelett), 7 (Motive).
 */
import type { Color } from "chessops/types";
import { abtausch, type Abtausch } from "../schach/abtausch";
import { aufgabenJeFigur, istUeberlastet, type DoppelteAufgabe } from "../schach/aufgaben";
import { Angriffskarte } from "../schach/angriffskarte";
import { bauernprofil, type Bauernprofil } from "../schach/bauernprofil";
import { bauernschwaechen, type Bauernschwaechen } from "../schach/bauernschwaechen";
import {
  drohungenVon,
  erzwingendeZuege,
  nullzug,
  schachs,
  schlaege,
  type Drohung,
  type ErzwingendeZuege,
  type Schachzug,
  type Schlagzug,
} from "../schach/drohungen";
import { koenigsumgebung, type Koenigsumgebung } from "../schach/koenigsumgebung";
import { linienmotive, type Linienmotiv } from "../schach/linienmotive";
import { sichereFelder, type Figurenfelder } from "../schach/sichereFelder";
import { gegner, type Feldindex, type Stellung } from "../schach/stellung";
import { strahlen, type Strahl } from "../schach/strahlen";

/** Ein Wert je Farbe, einmal gerechnet. */
interface JeFarbe<T> {
  readonly white: T;
  readonly black: T;
}

/** Rechnet einen Wert erst beim ersten Zugriff und merkt ihn sich. */
function einmal<T>(rechne: () => T): () => T {
  let wert: { readonly ergebnis: T } | null = null;
  return () => {
    if (wert === null) wert = { ergebnis: rechne() };
    return wert.ergebnis;
  };
}

/** Wie einmal(), aber je Farbe. */
function einmalJeFarbe<T>(rechne: (farbe: Color) => T): (farbe: Color) => T {
  const beide = einmal<JeFarbe<T>>(() => ({ white: rechne("white"), black: rechne("black") }));
  return (farbe) => beide()[farbe];
}

/** Das Stellungsprofil (Konzept 7.2). Alle Teile sind Funktionen, damit nichts umsonst rechnet. */
export interface Stellungsprofil {
  readonly stellung: Stellung;
  readonly angriffskarte: Angriffskarte;
  /** Abtauschrechnung auf einem Feld (Kapitel 1), null bei leerem Feld. */
  readonly abtausch: (feld: Feldindex) => Abtausch | null;
  readonly strahlen: () => readonly Strahl[];
  readonly linienmotive: () => readonly Linienmotiv[];
  readonly sichereFelder: (farbe: Color) => readonly Figurenfelder[];
  readonly bauernprofil: (farbe: Color) => Bauernprofil;
  readonly bauernschwaechen: (farbe: Color) => Bauernschwaechen;
  /** null bei Lehrbildern ohne König. */
  readonly koenigsumgebung: (farbe: Color) => Koenigsumgebung | null;
  /**
   * Drohungen einer Farbe, als wäre sie jetzt am Zug. null ohne Regeln oder wenn die Seite am
   * Zug im Schach steht (Konzept 7.2).
   */
  readonly drohungen: (farbe: Color) => readonly Drohung[] | null;
  /** Schachs, Schläge und drohende Züge der Seite am Zug; null ohne Regeln. */
  readonly erzwingend: () => ErzwingendeZuege | null;
  /**
   * Schachs einer Farbe, für den Gegner als wäre er nochmals am Zug (Röntgen-Frage 1: „Kann mein
   * Gegner mich mit Schach überraschen?“). null ohne Regeln oder wenn die Seite am Zug im Schach
   * steht und nach dem Gegner gefragt wird.
   */
  readonly schachsVon: (farbe: Color) => readonly Schachzug[] | null;
  /** Schläge einer Farbe mit Bilanz, nach Bilanz absteigend; sonst wie schachsVon. */
  readonly schlaegeVon: (farbe: Color) => readonly Schlagzug[] | null;
  /**
   * Figuren einer Farbe mit mindestens einer Aufgabe (Grundlage von W4, Art N). null ohne Regeln
   * oder wenn die Farbe am Zug im Schach steht.
   */
  readonly aufgaben: (farbe: Color) => readonly DoppelteAufgabe[] | null;
  /** Figuren einer Farbe mit zwei oder mehr Aufgaben (überlastet, Kapitel 7). */
  readonly doppelteAufgaben: (farbe: Color) => readonly DoppelteAufgabe[] | null;
}

/** Regeln, in denen ``farbe`` am Zug ist; null, wenn das nicht geht (Konzept 7.2). */
function regelnFuer(stellung: Stellung, farbe: Color) {
  const { regeln } = stellung;
  if (!regeln) return null;
  if (regeln.turn === farbe) return regeln;
  return regeln.isCheck() ? null : nullzug(regeln, farbe);
}

const PROFILE = new WeakMap<Stellung, Stellungsprofil>();

/** Baut ein Profil; die teuren Teile warten auf ihren ersten Aufruf. */
function neuesProfil(stellung: Stellung): Stellungsprofil {
  const { brett, regeln } = stellung;
  const angriffskarte = new Angriffskarte(brett);
  const abtauschJeFeld = new Map<Feldindex, Abtausch | null>();
  const alleStrahlen = einmal(() => strahlen(brett));
  const motive = einmal(() => linienmotive(brett, angriffskarte));
  const aufgaben = einmalJeFarbe((farbe) =>
    regeln ? aufgabenJeFigur(regeln, angriffskarte, farbe) : null,
  );
  return {
    stellung,
    angriffskarte,
    abtausch: (feld) => {
      const bekannt = abtauschJeFeld.get(feld);
      if (bekannt !== undefined) return bekannt;
      const neu = abtausch(brett, feld);
      abtauschJeFeld.set(feld, neu);
      return neu;
    },
    strahlen: alleStrahlen,
    linienmotive: motive,
    sichereFelder: einmalJeFarbe((farbe) => sichereFelder(stellung, farbe)),
    bauernprofil: einmalJeFarbe((farbe) => bauernprofil(brett, farbe)),
    bauernschwaechen: einmalJeFarbe((farbe) => bauernschwaechen(brett, farbe)),
    koenigsumgebung: einmalJeFarbe((farbe) => koenigsumgebung(stellung, farbe)),
    drohungen: einmalJeFarbe((farbe) => (regeln ? drohungenVon(regeln, farbe) : null)),
    erzwingend: einmal(() => (regeln ? erzwingendeZuege(regeln) : null)),
    schachsVon: einmalJeFarbe((farbe) => {
      const fuer = regelnFuer(stellung, farbe);
      return fuer ? schachs(fuer) : null;
    }),
    aufgaben,
    doppelteAufgaben: (farbe) => aufgaben(farbe)?.filter(istUeberlastet) ?? null,
    schlaegeVon: einmalJeFarbe((farbe) => {
      const fuer = regelnFuer(stellung, farbe);
      return fuer ? schlaege(fuer).sort((a, b) => b.bilanz - a.bilanz) : null;
    }),
  };
}

/**
 * Das Profil einer Stellung; derselbe Stellungswert bekommt immer dasselbe Profil.
 *
 * Warum: Mehrere Werkzeuge und die Oberfläche fragen dieselbe Stellung; die Angriffskarte und
 * die Drohungen sollen nur einmal entstehen (Konzept 7.2). Die Stellung wird nie verändert,
 * deshalb bleibt das Profil gültig, solange sie lebt (WeakMap, kein Aufräumen nötig).
 * Eingabe: Stellung aus stellungAusFen. Ausgabe: Stellungsprofil.
 * Beispiel: profil(abb126).angriffskarte.angreiferVon(d4, "black") → Bauer c5, Springer c6,
 * Dame b6 (Batterie).
 */
export function profil(stellung: Stellung): Stellungsprofil {
  const bekannt = PROFILE.get(stellung);
  if (bekannt) return bekannt;
  const neu = neuesProfil(stellung);
  PROFILE.set(stellung, neu);
  return neu;
}

/** Die Perspektive „Gegner der Seite am Zug“, für Werkzeuge mit Schalter (Pflichtenheft 6.1). */
export function gegenseite(stellung: Stellung): Color {
  return gegner(stellung.amZug);
}
