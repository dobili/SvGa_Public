/*
 * Karteneditor – Änderungen laden: eine früher heruntergeladene Änderungsdatei
 * (karteneditor-aenderungen-….json, Format in export.js) wieder öffnen und weiterbearbeiten.
 *
 * Warum: Der Autor fragte (16.11.2026), ob er Änderungen aus einer älteren Editorfassung in der
 * neuen weiterbearbeiten kann. Der Zwischenstand im Browser überlebt das meist, aber nicht, wenn er
 * den Browser wechselt oder die Daten löscht. Mit der Datei geht es immer.
 *
 * Eingabe: das gelesene JSON. Ausgabe: Die Szenen stehen als bearbeitet im Editor, mit denselben
 * Zuordnungen zum Original wie beim Herunterladen (Rücklauf und Bericht bleiben richtig).
 * Sonderfälle: Karten, die es im Paket nicht mehr gibt, werden übersprungen und gemeldet; hat sich
 * das Original seit der Datei geändert, lädt der Editor trotzdem und meldet die Karte, denn dann
 * überschreibt der eigene Stand die neuere Fassung.
 */
"use strict";

(function (KE) {
  const BUCHSTABEN = { objekte: "o", ausloeser: "a", figuren: "f", belebung: "b" };

  /** Vergibt die uids nach der Zuordnung der Datei (Index im Original oder neu). */
  function uidsNachDatei(szene, eintrag) {
    const zuordnungen = { objekte: eintrag.zuordnung || [], ...(eintrag.markierungen || {}) };
    for (const [liste, buchstabe] of Object.entries(BUCHSTABEN)) {
      const zu = zuordnungen[liste];
      (szene[liste] || []).forEach((o, i) => {
        const index = zu ? zu[i] : i; // vor 1.1 ohne Markierungen: Reihenfolge wie im Original
        o._uid = index === null || index === undefined ? KE.neueUid() : buchstabe + index;
      });
    }
    return szene;
  }

  /** Notizen der Datei (Karte und je Objekt) in den Zustand. */
  function notizenNachDatei(szene, eintrag) {
    const objekte = {};
    for (const n of eintrag.objektnotizen || []) {
      const o = (szene.objekte || [])[n.index];
      if (o) objekte[o._uid] = n.notiz;
    }
    return { karte: eintrag.notiz || "", objekte };
  }

  /** Übernimmt eine Änderungsdatei; gibt [geladen, fehlend, geaendertesOriginal] zurück. */
  KE.ladeAenderungen = function (daten) {
    if (!daten || daten.format !== KE.FORMAT || !Array.isArray(daten.szenen)) {
      throw new Error("Das ist keine Änderungsdatei des Karteneditors.");
    }
    const z = KE.zustand;
    const geladen = [];
    const fehlend = [];
    const neuer = [];
    for (const eintrag of daten.szenen) {
      if (!z.original[eintrag.datei]) {
        fehlend.push(eintrag.datei);
        continue;
      }
      const vorher = JSON.stringify(KE.ohneUids(z.original[eintrag.datei]));
      if (eintrag.vorher && JSON.stringify(eintrag.vorher) !== vorher) neuer.push(eintrag.datei);
      const szene = uidsNachDatei(KE.kopie(eintrag.nachher), eintrag);
      z.bearbeitet[eintrag.datei] = szene;
      z.notizen[eintrag.datei] = notizenNachDatei(szene, eintrag);
      geladen.push(eintrag.datei);
    }
    z.verlauf = [];
    z.zukunft = [];
    z.auswahl.clear();
    KE.sichere();
    return [geladen, fehlend, neuer];
  };

  /** Liest die gewählte Datei und meldet das Ergebnis in der Statuszeile. */
  KE.ladeAenderungsdatei = function (datei) {
    const leser = new FileReader();
    leser.onload = () => {
      try {
        const [geladen, fehlend, neuer] = KE.ladeAenderungen(JSON.parse(leser.result));
        let text = `${geladen.length} Karte(n) aus ${datei.name} geladen.`;
        if (fehlend.length) text += ` Nicht im Paket: ${fehlend.join(", ")}.`;
        if (neuer.length)
          text += ` Inzwischen anders im Paket (dein Stand gilt): ${neuer.join(", ")}.`;
        KE.meldeAenderung(text);
        KE.zeichneKartenliste();
        KE.status(text, fehlend.length > 0 || neuer.length > 0);
      } catch (fehler) {
        KE.status("Datei nicht lesbar: " + fehler.message, true);
      }
    };
    leser.onerror = () => KE.status("Datei nicht lesbar.", true);
    leser.readAsText(datei);
  };
})(window.KE);
