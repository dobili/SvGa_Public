// Lesefassung, der Kopf der Datei: Aufruf, Regeln für Wahlen und Ausgänge, Umfang und was fehlt.
//
// Zweck: Wer die Lesefassung liest (Lektorat), soll vorn sehen, nach welchen Regeln der Spielverlauf
// entstanden ist und was sie nicht zeigt. Warum ohne Datum: Gleicher Aufruf, gleiche Datei.
"use strict";
const { VORGESEHENER_AUSGANG } = require("./lesefassung-spieler.cjs");

/** So viele Dateien mit ungelesenen Knoten nennt der Kopf (die mit den meisten zuerst). */
const DATEIEN_IM_KOPF = 15;

const REGELN = [
  "**Reihenfolge.** Der Spieler geht die Gebiete in der Reihenfolge der Geschichte ab, fasst auf " +
    "jeder Karte alles an (Figuren, Dinge zum Ansehen, Auslöser) und kommt in jedem neuen " +
    "Zustand wieder; Nebenquests nimmt er mit. Am Ende holt er nie besuchte Orte nach und reist " +
    "zu offenen Quests zurück (Teil „Nach dem Abspann“). Das ist der Weg der Gesamtsimulation " +
    "(`pipeline/abenteuer/gesamtsimulation.cjs`), mit echtem inkjs und den Questregeln der App.",
  "**Wahlen.** Neugierig und freundlich: die erste inhaltliche Antwort. Antworten, die " +
    "aufschieben oder ablehnen („Nicht jetzt.“, „Gleich.“, „Später“, „Ein andermal.“), nur, wenn " +
    "es keine andere gibt. Steht dieselbe Auswahl noch einmal da, kommt die nächste Antwort an " +
    "die Reihe (Schleifen im Gespräch, zweiter Versuch bei einem Rätsel, die andere Frage beim " +
    "nächsten Besuch). Die nicht gewählten Antworten stehen als „(andere Antworten: …)“ dabei.",
  "**Partien und Aufgaben.** Je eine Zeile in eckigen Klammern. Der Spieler gewinnt jede Partie " +
    "und besteht jede Aufgabenrunde beim ersten Versuch. Ausnahme, weil die Geschichte es so " +
    "vorsieht: AUSNAHMEN. Abgebrochene Partien gibt es nicht. Eine Revanche gegen einen schon " +
    "besiegten Gegner nimmt der Spieler je Angebot einmal an („erneut“), danach verabschiedet " +
    "er sich; verlangt ein Dialog mehrere Siege (Mr. Harlans Lupe nach dreien), spielt er so oft.",
  "**Erstdurchlauf.** Die Simulation spricht jede Figur in jedem neuen Zustand mehrfach an. " +
    "Hier steht jedes Gespräch einmal: Weggelassen sind Dialoge ohne Zeile, wortgleiche " +
    "Wiederholungen und Dialoge ohne eine neue Zeile. Zweitgespräche (dieselbe Auswahl, diesmal " +
    "die nächste Antwort) sind gekürzt auf das Neue und so gekennzeichnet. Was eine Quest " +
    "bewegt oder zum ersten Mal eine Partie, Aufgabenrunde oder einen Laden auslöst, bleibt " +
    "immer stehen.",
  "**Darstellung.** Erzähler kursiv, Sprecher fett, Antworten des Helden als „HELD (Antwort)“. " +
    "Je Dialog eine Kopfzeile mit Nummer, Karte und Knoten (`datei.knoten`), darunter der " +
    "Questschritt, zu dem er gehört; „→ Quest …“ meldet, was sich an den Quests ändert. " +
    "Stimmung, Musik, Klang, Bild und Pausen sind nicht wiedergegeben. Der Held heißt HELD.",
  "**Nicht enthalten.** Statisten und Tiere (Belebung der Karten): Die Simulation spricht sie " +
    "nicht an. Ebenso Texte außerhalb der Dialoge (Tagebuch, Steckbriefe, Questtexte, " +
    "Aufgabenstellungen, Kommentare in Partien, Läden).",
];

/** Die Ausnahmen bei den Ausgängen als Satzteil, etwa „mapleFalls.victor (beim ersten Mal niederlage)“. */
function ausnahmen() {
  return Object.entries(VORGESEHENER_AUSGANG)
    .map(([b, a]) => `\`${b}\` (beim ersten Mal ${a}, danach Sieg)`)
    .join(", ");
}

/** Tabelle „Umfang“: je Akt Dialoge, Zeilen, Wörter und die Summe. */
function umfangstabelle(umfang) {
  const summe = (feld) => umfang.reduce((n, u) => n + u[feld], 0);
  const zeile = (u) =>
    `| ${u.titel} | ${u.dialoge} | ${u.zeilen} | ${u.woerter} |`;
  return [
    "| Teil | Dialoge | Zeilen | Wörter |",
    "| --- | ---: | ---: | ---: |",
    ...umfang.map(zeile),
    zeile({
      titel: "Gesamt",
      dialoge: summe("dialoge"),
      zeilen: summe("zeilen"),
      woerter: summe("woerter"),
    }),
  ].join("\n");
}

/** Absatz „Was fehlt“: Zahl der nicht durchlaufenen Knoten und die Dateien mit den meisten. */
function fehlendes(abdeckung) {
  const liste = abdeckung.dateien
    .slice(0, DATEIEN_IM_KOPF)
    .map(
      (x) =>
        `- \`${x.datei}\`: ${x.fehlend.length} von ${x.von} (${x.fehlend.join(", ")})`,
    );
  return [
    `**Was fehlt.** ${abdeckung.fehlend} von ${abdeckung.alle} Knoten der Dialogdateien kommen in ` +
      `dieser Lesefassung nicht vor (andere Antworten, Niederlagen und Remis, Wartesätze, ` +
      `Zweitgespräche), verteilt auf ${abdeckung.dateien.length} Dateien. Die Dateien mit den ` +
      `meisten ungelesenen Knoten:`,
    liste.join("\n"),
  ];
}

/**
 * Der Kopf der Lesefassung als Markdown.
 * Eingaben: `zahlen` (Startwert, Held, Umfang je Akt, Abdeckung, Weggelassenes) und `fehler`
 * (Meldungen des Durchlaufs). Ausgabe: Text bis vor den ersten Akt.
 * Sonderfall: Mit Fehlern steht vorn eine Warnung; die Lesefassung ist dann unvollständig.
 */
function kopf(zahlen, fehler) {
  const w = zahlen.weggelassen;
  const ersetze = (text) =>
    text.replace("AUSNAHMEN", ausnahmen()).replace(/HELD/g, zahlen.held);
  const warnung = fehler.length
    ? [`**Achtung, unvollständig:** ${fehler.join("; ")}`]
    : [];
  return [
    "# Schach-Abenteuer: Lesefassung eines vollständigen Spielverlaufs",
    ...warnung,
    `Erzeugt mit \`node pipeline/abenteuer/lesefassung.cjs --ziel DATEI.md --startwert ` +
      `${zahlen.startwert}\`. Der Startwert legt nur die wechselnden Sätze fest (Zufallsfolgen ` +
      `in Ink); gleicher Aufruf, gleiche Datei.`,
    ...REGELN.map(ersetze),
    `**Umfang.** Mitgeschrieben wurden ${zahlen.mitgeschrieben} Dialoge der Simulation; ` +
      `weggelassen ${w.doppelt} wortgleiche Wiederholungen, ${w.nichtsNeues} ohne neue Zeile ` +
      `und ${w.leer} ohne Zeile.`,
    umfangstabelle(zahlen.umfang),
    ...fehlendes(zahlen.abdeckung),
  ].join("\n\n");
}

module.exports = { kopf };
