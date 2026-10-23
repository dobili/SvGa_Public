/**
 * Die Lernsammlung als PGN: je Eintrag eine Partie, die Lichess beim Import in eine Studie als
 * eigenes Kapitel anlegt.
 *
 * Rolle im Gesamtbild: Teil der Lernsammlung (training/lernsammlung.ts, AP 15). Kapitel 12 und
 * der Werkzeugkasten des Buches empfehlen die Lichess-Funktion „Studien“ als Lernsammlung; der
 * Leser legt dort eine Studie an und fügt die Datei über „PGN importieren“ ein. Lichess nennt
 * jedes Kapitel nach „Weiß – Schwarz“, deshalb stehen dort Eröffnung und Fundstelle;
 * „ChapterName“ steht zusätzlich dabei. Plan und Notiz stehen als Kommentar an der Stellung.
 * Kennt die App den Weg zur Stellung, beginnt das Kapitel am Start des Weges (Züge zum
 * Nachspielen); sonst beginnt es mit der gesammelten Stellung ([SetUp] und [FEN]).
 * Abhängigkeiten: training/lernsammlung.ts. Reine Funktionen.
 */
import { GRUNDSTELLUNG, type Sammeleintrag } from "./lernsammlung";

/** Feld der FEN mit der Seite am Zug und mit der Zugnummer. */
const FEN_SEITE = 1;
const FEN_ZUGNUMMER = 5;

/** Wert eines PGN-Kopfes: Rückstrich und Anführungszeichen maskiert, ohne Zeilenumbruch. */
function kopfwert(wert: string): string {
  return wert
    .replace(/[\r\n]+/g, " ")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}

/** Ein PGN-Kommentar darf keine geschweifte Klammer enthalten. */
function kommentar(wert: string): string {
  return wert.replace(/[{]/g, "(").replace(/[}]/g, ")").replace(/\s+/g, " ").trim();
}

/**
 * Die Züge mit Nummern ab einer Stellung.
 * Beispiel: Grundstellung, [e4, e5, Nf3] → „1. e4 e5 2. Nf3“; Schwarz am Zug in Zug 6, [Nf6] →
 * „6... Nf6“.
 */
export function zugtext(startFen: string, zuege: readonly string[]): string {
  const felder = startFen.split(" ");
  let schwarz = felder[FEN_SEITE] === "b";
  let nummer = Number(felder[FEN_ZUGNUMMER]) || 1;
  const teile: string[] = [];
  zuege.forEach((san, stelle) => {
    if (!schwarz) teile.push(`${nummer}. ${san}`);
    else teile.push(stelle === 0 ? `${nummer}... ${san}` : san);
    if (schwarz) nummer += 1;
    schwarz = !schwarz;
  });
  return teile.join(" ");
}

/** Datum für den PGN-Kopf: „2026.10.18“. */
function pgnDatum(iso: string): string {
  return iso.slice(0, "JJJJ-MM-TT".length).replace(/-/g, ".");
}

/** Texte, die die Oberfläche beisteuert (Sprache der App). */
export interface Pgntexte {
  /** Fundstelle als Kapitelname, etwa „Abb. 1.26“ oder „Partie vom 18.10.2026“. */
  readonly fundstelle: (eintrag: Sammeleintrag) => string;
  readonly ohneEroeffnung: string;
  readonly plan: string;
  readonly notiz: string;
}

/**
 * Ein Eintrag als PGN-Partie.
 * Beispiel: Abb. 2.2 mit Plan „Druck auf e5“ → Kopf mit White „Spanische Partie“, Black
 * „Abb. 2.2“, Züge 1. e4 e5 2. Nf3 Nc6 3. Bb5 und {Plan: Druck auf e5} am Ende.
 */
export function eintragAlsPgn(eintrag: Sammeleintrag, texte: Pgntexte): string {
  const eroeffnung = eintrag.eroeffnung || texte.ohneEroeffnung;
  const fundstelle = texte.fundstelle(eintrag);
  const start = eintrag.verlauf?.startFen ?? eintrag.fen;
  const zuege = eintrag.verlauf?.zuege ?? [];
  const koepfe: [string, string][] = [
    ["Event", eroeffnung],
    ["Site", "schach-von-grund-auf.com"],
    ["Date", pgnDatum(eintrag.datum)],
    ["White", eroeffnung],
    ["Black", fundstelle],
    ["Result", "*"],
    ["ChapterName", `${eroeffnung}: ${fundstelle}`],
  ];
  if (start !== GRUNDSTELLUNG) koepfe.push(["SetUp", "1"], ["FEN", start]);
  const notizen = [
    eintrag.plan && `${texte.plan}: ${kommentar(eintrag.plan)}`,
    eintrag.notiz && `${texte.notiz}: ${kommentar(eintrag.notiz)}`,
  ].filter(Boolean);
  const zugteil = [zugtext(start, zuege), notizen.length ? `{${notizen.join(" ")}}` : "", "*"];
  return [
    ...koepfe.map(([name, wert]) => `[${name} "${kopfwert(wert)}"]`),
    "",
    zugteil.filter(Boolean).join(" "),
  ].join("\n");
}

/** Die ganze Sammlung (oder eine Gruppe) als eine PGN-Datei, Partien durch Leerzeilen getrennt. */
export function sammlungAlsPgn(liste: readonly Sammeleintrag[], texte: Pgntexte): string {
  return `${liste.map((e) => eintragAlsPgn(e, texte)).join("\n\n")}\n`;
}
