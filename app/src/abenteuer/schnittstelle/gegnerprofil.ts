/**
 * Gegnerprofil des Abenteuers: Wer ist der Gegner, wie stark spielt er, welche Fehler macht er,
 * und in welchem Zustand tritt er an („abgelenkt“, „analysiert“).
 *
 * Rolle im Gesamtbild: Jede Figur des Spiels, die Schach spielt (Clubchef, Clubmitglied,
 * Straßengegner, Victor, ZERO-gestützte Spieler), hat genau ein Profil. Das Spiel rechnet daraus
 * vor jeder Partie eine Partieeinstellung der App (spiel/partie.ts, Typ Partieeinstellung); die
 * App spielt die Partie, das Spiel bekommt das Ergebnis zurück (schnittstelle/partie.ts).
 * Hier stehen nur Typen; die Umrechnung in Stufen und Fehlerhäufigkeit ist eine reine Funktion in
 * einer späteren Datei (gegnerstaerke.ts), die aus Ziel-Elo die Stufe je Phase bestimmt.
 * Abhängigkeiten: engine/stufen.ts (Stufennummer), engine/fehlerart-typen.ts (Fehlerart,
 * BlinderFleck), engine/stile.ts (Stilname, Stilmix), schach/phase.ts (Phase).
 * Buchbezug: Die Fehlerarten tragen die Kapitel des Buches (engine/fehlerart.ts), zum Beispiel
 * „Figur hängen“ (Kapitel 4) oder „Todsünde Dame früh“ (Kapitel 1); ein Clubchef, der Fesselungen
 * übersieht, bekommt ein hohes Gewicht auf der passenden Fehlerart.
 */
import type { BlinderFleck, Fehlerart } from "../../engine/fehlerart-typen";
import type { Stilmix, Stilname } from "../../engine/stile";
import type { Stufennummer } from "../../engine/stufen";
import type { Phase } from "../../schach/phase";

/** Rolle des Gegners in der Spielwelt; bestimmt Zielstärke, Format und Belohnung. */
export type Gegnerrolle =
  /** Gegner auf der Straße, kurz und unterhalb der eigenen Stärke. */
  | "strasse"
  /** Mitglied eines Clubs, stellt Aufgaben und spielt etwa auf Augenhöhe. */
  | "clubmitglied"
  /** Clubchef: die Partie um die Clubnadel. */
  | "clubchef"
  /** Victor und andere Figuren der Haupthandlung mit festem Verlauf. */
  | "story"
  /** Gegner der Landesmeisterschaft und des Post-Game. */
  | "turnier";

/**
 * Zielstärke, aus der das Spiel die Stufe je Phase und die Fehlerhäufigkeit rechnet.
 * Warum zwei Bezugspunkte: Straßengegner folgen der aktuellen Wertung des Lesers, damit sie fair
 * bleiben; Clubchefs steigen von Club zu Club über der Eingangswertung, mit der das Abenteuer
 * begann, damit der Leser sich anstrengen muss und am Ende besser ist (Entscheidung A6).
 */
export type Zielstaerke =
  /** Fester Elo-Wert, zum Beispiel für Story-Partien mit vorgegebenem Verlauf. */
  | { readonly art: "fest"; readonly elo: number }
  /** Aktuelle Wertung des Lesers plus Versatz (Straße: etwa −100, Clubmitglied: ±0). */
  | { readonly art: "aktuell"; readonly versatz: number }
  /** Eingangswertung beim Start des Abenteuers plus Versatz (Clubchef n: 160 + 60 · n). */
  | { readonly art: "eingang"; readonly versatz: number };

/** Eröffnungsverhalten des Gegners, wie in spiel/partie.ts Feld `eroeffnung` und spiel/boteroeffnung.ts. */
export type Eroeffnungsverhalten =
  /** Wie Menschen seiner Stärke (EROEFFNUNG_PRAXIS). */
  | { readonly art: "praxis" }
  /** Feste Eröffnungen (Werte wie „praxis:Italian Game“ oder ein Name aus dem Buch) mit Abweichung in Prozent. */
  | { readonly art: "fest"; readonly eroeffnungen: readonly string[]; readonly abweichung: number }
  /** Ohne Buch, die Engine eröffnet selbst (für Vorgabestellungen ohnehin erzwungen). */
  | { readonly art: "frei" };

/**
 * Sichtbarer Zustand vor der Partie (Konzept: Gegner nie heimlich schwächen).
 * Beispiel: Big Joe hat nach der Feier schlecht geschlafen → abgelenkt, Fehlerhäufigkeit × 1,4,
 * im Dialog angekündigt und als Symbol am Brett gezeigt.
 */
export interface Gegnerzustand {
  /** Faktor auf die Fehlerhäufigkeit; 1 = unverändert, größer = abgelenkt, kleiner = konzentriert. */
  readonly haeufigkeitsfaktor: number;
  /** Textschlüssel des Grundes für Dialog und Symbol, zum Beispiel „zustand.schlechtGeschlafen“. */
  readonly grund: string | null;
  /** Der Leser hat den Gegner vorbereitet (Nebenquest „analysiert“): Steckbriefzeilen sind sichtbar. */
  readonly analysiert: boolean;
}

/**
 * Eine Zeile im Steckbrief des Clubtagebuchs (Entscheidung C7), erzeugt aus dem Profil, nicht von
 * Hand geschrieben. Beispiel: { art: "fehlerart", wert: "fesselungUebersehen" } → „Big Joe übersieht
 * Fesselungen“.
 */
export type Steckbriefzeile =
  | { readonly art: "fehlerart"; readonly wert: Fehlerart }
  | { readonly art: "fleck"; readonly wert: BlinderFleck }
  | { readonly art: "stil"; readonly wert: Stilname }
  | { readonly art: "eroeffnung"; readonly wert: string };

/**
 * Das vollständige Profil eines Gegners des Spiels. Alles, was die App zum Spielen braucht,
 * lässt sich daraus in eine Partieeinstellung übersetzen; alles Übrige ist Erzählung.
 */
export interface Gegnerprofil {
  /** Kennung in den Spieldaten, zum Beispiel „ironwood.bigJoe“. */
  readonly kennung: string;
  /** Textschlüssel des Namens (Spieltexte, nicht de.json der App). */
  readonly name: string;
  readonly rolle: Gegnerrolle;
  /** Porträt im Zusatzpaket, relativ zum Paketordner, zum Beispiel „portraets/big-joe.webp“. */
  readonly portraet: string;
  readonly staerke: Zielstaerke;
  /**
   * Abweichung der Phasen von der Zielstärke in Stufen, zum Beispiel { endspiel: −1 } für einen
   * Angreifer, der Endspiele schlecht spielt; fehlend: alle Phasen gleich.
   */
  readonly phasenversatz?: Readonly<Partial<Record<Phase, number>>>;
  /** Gewicht je Fehlerart und blindem Fleck (0 aus, 1 wie Menschen, 2 doppelt); fehlend: wie Menschen. */
  readonly gewichte?: Readonly<Partial<Record<Fehlerart | BlinderFleck, number>>>;
  /** Stil des Gegners (engine/stile.ts) oder eine Mischung. */
  readonly stil: Stilname | Stilmix;
  readonly eroeffnung: Eroeffnungsverhalten;
  /** Spielt mit Maia, wenn das Paket geladen ist? Fehlend: ja. Konzernspieler: nein (sie spielen „perfekt“). */
  readonly menschlich?: boolean;
  /** Steckbriefzeilen, die Vorbereitungs-Quests freischalten, in der Reihenfolge des Freischaltens. */
  readonly steckbrief: readonly Steckbriefzeile[];
}

/**
 * Was das Spiel aus Profil, Zustand und Wertung des Lesers rechnet, bevor die App die Partie
 * anlegt: die Stufe je Phase und die Häufigkeit. Ergebnis der (späteren) reinen Funktion
 * gegnerstaerke.ts; hier nur der Typ, damit Partieauftrag ihn tragen kann.
 */
export interface Gerechnetestaerke {
  readonly zielElo: number;
  readonly stufenJePhase: Readonly<Record<Phase, Stufennummer>>;
  /** Fehlerhäufigkeit insgesamt nach Zustand, 1 = wie Menschen der Stufe. */
  readonly haeufigkeit: number;
}
