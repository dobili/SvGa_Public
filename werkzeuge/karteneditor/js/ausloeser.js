/*
 * Karteneditor – Übergänge und Auslöser anlegen: „Übergang hier“ setzt eine Kopie eines
 * bestehenden Auslösers der Karte („wie Übergang X“) auf die nächste angeklickte Kachel.
 * Duplizieren (Strg+D) und Löschen (Entf) eines Auslösers stehen in markierungen.js.
 *
 * Warum: Der Autor baut Treppenabgänge selbst (Wunsch des Autors, 16.11.2026) und setzt den
 * Übergang dann auf die Lochkachel. Typ und Ziel eines Übergangs stehen in orte.json unter seinem
 * Namen (pipeline/abenteuer/uebergaenge.py); ein Auslöser gleichen Namens auf einer weiteren
 * Kachel verbreitert ihn. Darum kopiert der Editor einen bestehenden statt einen neuen zu erfinden.
 */
"use strict";

(function (KE) {
  const K = 16;
  const el = (...a) => KE.el(...a);

  /** Die verschiedenen Auslöser der Karte als Vorlagen (je Name und Eigenschaften einmal). */
  function vorlagen(szene) {
    const gesehen = new Map();
    for (const a of szene.ausloeser || []) {
      const schluessel = JSON.stringify([a.name, a.eigenschaften || null, !!a.auf_moebel]);
      if (!gesehen.has(schluessel)) gesehen.set(schluessel, a);
    }
    return [...gesehen.values()];
  }

  /** Startet „Übergang hier“: Der nächste Klick in die Karte setzt die Kopie der Vorlage. */
  KE.uebergangHier = function (name) {
    KE.zustand.uebergangVorlage = name;
    KE.zustand.kollisionUid = null;
    KE.meldeAenderung(
      `Kachel anklicken: dort entsteht ein Auslöser wie „${name}“ (Esc bricht ab).`,
    );
  };

  /** Klick in die Karte im Modus „Übergang hier“. */
  KE.setzeUebergang = function (px, py) {
    const z = KE.zustand;
    const szene = KE.szene();
    const vorlage = vorlagen(szene).find((a) => a.name === z.uebergangVorlage);
    z.uebergangVorlage = null;
    if (!vorlage) return KE.meldeAenderung();
    const neu = { ...KE.kopie(vorlage), feld: [Math.floor(px / K), Math.floor(py / K)] };
    neu._uid = KE.neueUid();
    KE.schritt("Übergang hier", [z.datei], () => {
      szene.ausloeser.push(neu);
      z.auswahl = new Set([neu._uid]);
    });
  };

  /** Bedienfeld „Übergang hier“ (in panel.js eingehängt). */
  KE.uebergangsfeld = function (ziel) {
    const szene = KE.szene();
    const liste = vorlagen(szene);
    if (!liste.length) return;
    const box = el("div", "uebergangsfeld");
    box.append(el("div", "zwischentitel", "Übergang oder Auslöser anlegen"));
    const wahl = el("select");
    wahl.id = "uebergangsvorlage";
    for (const a of liste) {
      const wohin = a.eigenschaften ? ` → ${Object.values(a.eigenschaften).join(", ")}` : "";
      wahl.append(Object.assign(el("option", "", `wie „${a.name}“${wohin}`), { value: a.name }));
    }
    const gewaehlt = KE.ausgewaehlt().find((t) => t.liste === "ausloeser");
    if (gewaehlt) wahl.value = gewaehlt.eintrag.name;
    const knopf = el("button", "uebergangHier", "Übergang hier");
    knopf.title = "Danach eine Kachel anklicken; Strg+D vervielfältigt, Entf löscht";
    knopf.addEventListener("click", () => KE.uebergangHier(wahl.value));
    knopf.classList.toggle("an", !!KE.zustand.uebergangVorlage);
    const reihe = el("div", "knopfreihe");
    reihe.append(wahl, knopf);
    box.append(reihe);
    ziel.append(box);
  };
})(window.KE);
