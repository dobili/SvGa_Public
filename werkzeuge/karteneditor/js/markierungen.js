/*
 * Karteneditor – Markierungen kopieren und löschen: Auslöser, Figuren und Belebung (Statisten,
 * Tiere). Strg+D legt eine Kopie eine Kachel rechts daneben an, Entf löscht; Figuren und Belebung
 * nur nach einer Rückfrage (seit Editor 1.2).
 *
 * Warum: Bis 1.1 waren Figuren und Belebung vor Entf geschützt, weil sie zur Handlung gehören
 * (Dialoge in orte.json, Quests). Der Autor will sie aber auch entfernen und vervielfältigen können
 * (Auftrag des Hauptchats, 16.11.2026). Die Rückfrage nennt den Dialog der Figur; der Rücklauf
 * (pipeline/abenteuer/editorfiguren.py) warnt, wenn ein Ink-Knoten oder eine Quest sie braucht.
 */
"use strict";

(function (KE) {
  const LISTEN = ["ausloeser", "figuren", "belebung"];
  const NAMEN = { ausloeser: "Auslöser", figuren: "Figur", belebung: "Belebung" };
  const ANZEIGE_HOECHSTENS = 6;

  /** Die ausgewählten Markierungen der aktuellen Szene (Einträge mit liste, index, eintrag). */
  KE.markierungenAusgewaehlt = () => KE.ausgewaehlt().filter((t) => LISTEN.includes(t.liste));

  /** Ein Feld als Text („12,7“) um dx Kacheln nach rechts; anderes bleibt, wie es ist. */
  function feldtextPlus(text, dx) {
    const teile = String(text).split(",").map(Number);
    if (teile.length !== 2 || !teile.every(Number.isFinite)) return text;
    return `${teile[0] + dx},${teile[1]}`;
  }

  /**
   * Kopien der Markierungen eine Kachel rechts daneben (ein Übergang über zwei Kacheln, ein
   * zweiter Statist). Bei Belebung wandert der Laufweg (von, bis) mit. Ausgabe: neue uids.
   * Aufruf nur innerhalb von KE.schritt (bearbeiten.js, KE.dupliziere).
   */
  KE.kopiereMarkierungen = function (szene, auswahl) {
    const neu = [];
    for (const t of auswahl) {
      const kopie = KE.kopie(t.eintrag);
      kopie.feld = [t.eintrag.feld[0] + 1, t.eintrag.feld[1]];
      kopie._uid = KE.neueUid();
      const eig = kopie.eigenschaften;
      if (t.liste === "belebung" && eig)
        for (const k of ["von", "bis"]) if (k in eig) eig[k] = feldtextPlus(eig[k], 1);
      (szene[t.liste] ??= []).push(kopie);
      neu.push(kopie._uid);
    }
    return neu;
  };

  /** Entfernt alle Markierungen mit einer uid aus „weg“ (innerhalb von KE.schritt). */
  KE.entferneMarkierungen = function (szene, weg) {
    for (const liste of LISTEN)
      if (szene[liste]) szene[liste] = szene[liste].filter((e) => !weg.has(e._uid));
  };

  /**
   * Rückfrage vor dem Löschen von Figuren und Belebung. Nennt Namen und, wenn orte.json einen
   * Dialog kennt (Paket: figurangaben), den Ink-Knoten. Ausgabe: true, wenn gelöscht werden darf.
   * Beispiel: „Figur ambrose (Dialog maple-falls-dachboden.ambrose) wirklich löschen?“
   */
  KE.frageLoeschen = function (auswahl) {
    const handlung = auswahl.filter((t) => t.liste !== "ausloeser");
    if (!handlung.length) return true;
    const angaben = KE.zustand.nachDatei[KE.zustand.datei]?.figurangaben || {};
    const zeilen = handlung.slice(0, ANZEIGE_HOECHSTENS).map((t) => {
      const dialog = t.liste === "figuren" ? angaben[t.eintrag.name]?.dialog : null;
      return `${NAMEN[t.liste]} ${t.eintrag.name}${dialog ? ` (Dialog ${dialog})` : ""}`;
    });
    if (handlung.length > ANZEIGE_HOECHSTENS)
      zeilen.push(`… und ${handlung.length - ANZEIGE_HOECHSTENS} weitere`);
    return confirm(
      `${zeilen.join("\n")}\n\nWirklich löschen? Figuren und Statisten gehören zur Handlung ` +
        "(Gespräche, Quests). Der Rücklauf warnt, wenn ein Gespräch sie braucht. Strg+Z holt sie zurück.",
    );
  };
})(window.KE);
