/*
 * Karteneditor – Deckkraft in Stufen (Editor 1.5, Wunsch des Autors, 16.11.2026: Transparenz).
 *
 * Warum: Der Autor macht Bilder halb durchsichtig (Lichtkegel, Schatten, Glas). Die Szene
 * speichert das im Objektfeld `deckkraft` mit den Stufen 25, 50, 75 und 100 Prozent; bei 100 fehlt
 * das Feld. Nur das Bild wird durchsichtig, Kollision und Tiefe bleiben (wie
 * pipeline/abenteuer/objektform.py und die App, oberwelt/moebel.ts mit setAlpha).
 * Inhalt: Lesen des Werts (zeichnen.js zeichnet damit), Knöpfe im Bedienfeld für die ganze Auswahl.
 */
"use strict";

(function (KE) {
  const STUFEN = [25, 50, 75, 100];
  const VOLL = 100;
  const el = (...a) => KE.el(...a);

  /** Die Deckkraft eines Eintrags in Prozent; ohne Feld oder ungültig 100. */
  KE.deckkraftVon = (e) => (e && STUFEN.includes(e.deckkraft) ? e.deckkraft : VOLL);

  const objekte = () => KE.ausgewaehlt().filter((t) => t.liste === "objekte");

  /** Setzt die Deckkraft für alle ausgewählten Bilder (ein Schritt; 100 entfernt das Feld). */
  KE.setzeDeckkraft = function (wert) {
    const auswahl = objekte();
    if (!auswahl.length || !STUFEN.includes(wert)) return;
    KE.schritt(`Deckkraft ${wert} %`, [KE.zustand.datei], () => {
      for (const t of auswahl) {
        if (wert === VOLL) delete t.eintrag.deckkraft;
        else t.eintrag.deckkraft = wert;
      }
    });
  };

  /** Bereich „Deckkraft“ im Bedienfeld: vier Knöpfe, der aktuelle Wert des ersten Bildes leuchtet. */
  KE.deckkraftfeld = function (ziel) {
    const auswahl = objekte();
    if (!auswahl.length) return;
    const jetzt = KE.deckkraftVon(auswahl[0].eintrag);
    const reihe = el("div", "knopfreihe deckkraftfeld");
    reihe.append(el("span", "", "Deckkraft"));
    for (const wert of STUFEN) {
      const k = el("button", `deckkraft-${wert}` + (wert === jetzt ? " an" : ""), `${wert} %`);
      k.title = wert === VOLL ? "Voll deckend (Standard)" : `${wert} % deckend, Kollision bleibt`;
      k.addEventListener("click", () => KE.setzeDeckkraft(wert));
      reihe.append(k);
    }
    ziel.append(reihe);
  };
})(window.KE);
