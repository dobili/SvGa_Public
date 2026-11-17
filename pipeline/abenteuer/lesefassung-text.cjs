// Lesefassung, der Text: macht aus der Mitschrift des Lesers (lesefassung-spieler.cjs) Markdown.
//
// Zweck: Namen statt Kennungen (Sprecher, Orte, Karten, Quests aus inhalte/abenteuer/texte/de.json),
// Erzähler kursiv, Antworten des Helden mit den nicht gewählten Antworten, Partien und Aufgaben als
// eine Zeile. Tags (Stimmung, Musik, Klang, Bild, Pause) erscheinen nicht.
// Warum eigene Datei: Der Durchlauf (lesefassung.cjs) und die Darstellung bleiben getrennt prüfbar,
// und jede Datei bleibt unter 400 Zeilen (CLAUDE.md, Regel 4).
"use strict";
const fs = require("fs");
const path = require("path");

const DATEN = path.join(__dirname, "..", "..", "inhalte", "abenteuer");
const ERZAEHLER = "erzaehler";
const HELD = "held";
const AUSGANG = { sieg: "gewonnen", remis: "Remis", niederlage: "verloren" };
const FORMAT = {
  partie: "Partie",
  stellungsduell: "Stellungsduell",
  vorteil: "Vorteil herausarbeiten",
  endspiel: "Endspiel",
};

const lade = (name) =>
  JSON.parse(fs.readFileSync(path.join(DATEN, name), "utf8"));
const kurz = (kennung) => kennung.split(".").pop();

/**
 * Nachschlagewerk für lesbare Namen.
 * Eingaben: Welt der Simulation (Orte, Quests), Name des Helden. Ausgabe: Funktionen, die zu einer
 * Kennung den deutschen Text liefern; fehlt er, bleibt die Kennung stehen (nichts wird verschluckt).
 * Beispiel: sprecher("ambrose") → „Ambrose“; karte("mapleFalls.dachboden") → „Dachboden“.
 */
function namen(welt, held) {
  const texte = lade("texte/de.json");
  const t = (schluessel) => texte[schluessel] || schluessel;
  const begegnungen = new Map(
    lade("begegnungen.json").begegnungen.map((b) => [b.kennung, b]),
  );
  const gegner = new Map(lade("gegner.json").gegner.map((g) => [g.kennung, g]));
  const runden = new Map(lade("runden.json").runden.map((r) => [r.kennung, r]));
  const formen = lade("partieformen.json");
  const laeden = new Map(welt.laeden.map((l) => [l.kennung, l]));
  const quests = new Map(welt.quests.map((q) => [q.kennung, q]));
  const karten = new Map(
    welt.orte.flatMap((o) => o.karten.map((k) => [k.kennung, k])),
  );
  return {
    held,
    sprecher: (s) => (s === HELD ? held : t(`figur.${s}.name`)),
    ort: (karte) => t(welt.karteZuOrt[karte].name),
    karte: (karte) => t(karten.get(karte).name),
    quest: (kennung) => quests.get(kennung),
    questtitel: (kennung) => t(quests.get(kennung).titel),
    schritttext: (kennung, i) => t(quests.get(kennung).schritte[i].text),
    laden: (kennung) => t(laeden.get(kennung)?.name || kennung),
    partie(kennung) {
      const b = begegnungen.get(kennung);
      const wer = b ? t(gegner.get(b.gegner)?.name || b.gegner) : kennung;
      return { form: FORMAT[b?.format?.art] || FORMAT.partie, wer };
    },
    runde(kennung) {
      const r = runden.get(kennung);
      if (r) return `Aufgaben von ${t(`figur.${kurz(r.steller)}.name`)}`;
      if (formen.gedaechtnis.some((g) => g.kennung === kennung))
        return "Gedächtnisstellung";
      if (formen.simultan.some((s) => s.kennung === kennung)) return "Simultan";
      return "Aufgaben";
    },
  };
}

/** Sternchen und Unterstriche im Text entschärfen, damit Markdown sie nicht als Auszeichnung liest. */
function sicher(text) {
  return text.replace(/([*_])/g, "\\$1");
}

/**
 * Eine Zeile des Dialogs als Markdown-Absatz.
 * Beispiel: Erzähler → „*Staub, Kisten, ein Lampenschirm ohne Lampe.*“; Ambrose → „**Ambrose:** Wer
 * wagt es …“; Wahl → „**Kim (Antwort):** …“ und darunter „(andere Antworten: …)“.
 * Sonderfall: Gab es nur eine Antwort, entfällt die Zeile mit den anderen.
 */
function zeileAlsText(n, zeile) {
  if (zeile.wahl !== undefined) {
    const antwort = `**${n.held} (Antwort):** ${sicher(zeile.wahl)}`;
    if (!zeile.andere.length) return antwort;
    return `${antwort}\\\n(andere Antworten: ${zeile.andere.map(sicher).join(" · ")})`;
  }
  const sprecher = zeile.tags.sprecher || ERZAEHLER;
  if (sprecher === ERZAEHLER) return `*${sicher(zeile.text)}*`;
  return `**${sicher(n.sprecher(sprecher))}:** ${sicher(zeile.text)}`;
}

/** Was nach dem Dialog geschah: Partie, Aufgaben, Laden, Abspann, je eine Zeile in eckigen Klammern. */
function folgeAlsText(n, folge) {
  const erneut = folge.erneut ? ", erneut" : "";
  if (folge.art === "partie") {
    const { form, wer } = n.partie(folge.begegnung);
    return `[${form} gegen ${wer}${erneut} – Ausgang: ${AUSGANG[folge.ausgang]}]`;
  }
  if (folge.art === "runde")
    return `[${n.runde(folge.runde)} (${folge.runde})${erneut} – Ausgang: bestanden]`;
  if (folge.art === "laden") return `[Laden: ${n.laden(folge.laden)}]`;
  return "[Abspann]";
}

/** Eine Queständerung als Zeile, etwa „→ Quest „Das Brett auf dem Dachboden“: Schritt 1 von 4 erledigt“. */
function questAlsText(n, x) {
  const titel = `„${n.questtitel(x.quest)}“`;
  if (x.art === "begonnen") return `→ Quest begonnen: ${titel}`;
  if (x.art === "fertig") return `→ Quest abgeschlossen: ${titel}`;
  const von = n.quest(x.quest).schritte.length;
  return `→ Quest ${titel}: Schritt ${x.schritt + 1} von ${von} erledigt`;
}

/**
 * Kopfzeile eines Dialogs: Nummer und Karte als Überschrift, darunter der Knoten als `datei.knoten`
 * und der Questschritt, zu dem der Dialog gehört (`d.bezug`: Quest und Schritt vor dem Dialog).
 * Der Text des Schritts steht nur dabei, wenn `mitText` gilt (der Schritt hat gewechselt).
 * Beispiel: „#### 4 · Dachboden“, darunter „`maple-falls-dachboden.dachboden_brett` · Quest „Das
 * Brett auf dem Dachboden“, Schritt 1 von 3: Das alte Schachbrett ansehen. …“.
 * Sonderfall: Ohne laufende Quest steht „keine laufende Quest“.
 */
function kopfzeile(n, d, mitText) {
  const titel = `#### ${d.nummer} · ${n.karte(d.karte)}`;
  const knoten = `\`${d.knoten}\``;
  if (!d.bezug) return `${titel}\n\n${knoten} · keine laufende Quest`;
  const { quest, schritt } = d.bezug;
  const von = n.quest(quest).schritte.length;
  const text = mitText ? `: ${n.schritttext(quest, schritt)}` : "";
  const wo = `Quest „${n.questtitel(quest)}“, Schritt ${schritt + 1} von ${von}`;
  return `${titel}\n\n${knoten} · ${wo}${text}`;
}

/** Ein Dialog als Liste von Absätzen: Kopfzeile, Quests davor, Zeilen, Quests, Folgen, Quests danach. */
function dialogAlsText(n, d, mitText) {
  const hinweis = d.gekuerzt
    ? ["(noch einmal angesprochen; hier nur, was neu ist)"]
    : [];
  return [
    kopfzeile(n, d, mitText),
    ...hinweis,
    ...d.davor.map((x) => questAlsText(n, x)),
    ...d.zeilen.map((z) => zeileAlsText(n, z)),
    ...d.quests.map((x) => questAlsText(n, x)),
    ...d.folgen.map((f) => folgeAlsText(n, f)),
    ...d.danach.map((x) => questAlsText(n, x)),
  ];
}

/** Wörter der Zeilen und gewählten Antworten eines Dialogs (ohne Kopfzeilen und Hinweise). */
function woerter(d) {
  return d.zeilen.reduce(
    (summe, z) =>
      summe + (z.text || z.wahl).split(/\s+/).filter(Boolean).length,
    0,
  );
}

/**
 * Die Abschnitte eines Aktes als Markdown: „## Akt“, „### Ort“ bei jedem Ortswechsel, darunter die
 * Dialoge. Eingabe: { titel, dialoge } mit Dialogen in Spielreihenfolge.
 * Sonderfall: Kehrt der Spieler in einen Ort zurück, bekommt der Ort eine neue Überschrift. Der
 * Text eines Questschritts steht nur beim ersten Dialog, der zu ihm gehört.
 */
function aktAlsText(n, akt) {
  const teile = [`## ${akt.titel}`];
  let ort = null;
  let schritt = null;
  for (const d of akt.dialoge) {
    if (n.ort(d.karte) !== ort) {
      ort = n.ort(d.karte);
      teile.push(`### ${ort}`);
    }
    const jetzt = d.bezug ? `${d.bezug.quest}:${d.bezug.schritt}` : null;
    teile.push(...dialogAlsText(n, d, jetzt !== schritt));
    schritt = jetzt;
  }
  return teile.join("\n\n");
}

module.exports = { namen, aktAlsText, woerter, zeileAlsText, folgeAlsText };
