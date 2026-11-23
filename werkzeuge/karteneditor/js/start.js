/*
 * Karteneditor – Start: Daten aus daten.js laden, Knöpfe verbinden, Fenstergröße verfolgen und
 * die zuletzt bearbeitete Karte öffnen.
 */
"use strict";

(function (KE) {
  const LETZTE_KARTE = "karteneditor-letzte-karte";
  /** Knöpfe „Figuren“ und „Markierungen“ (Editor 1.9): ihr Zustand bleibt im Browser gemerkt. */
  const ANSICHTSSCHALTER = "karteneditor-ansicht";

  /** Merkt „Figuren“ und „Markierungen“ (aufgerufen aus KE.schalte, panel.js). */
  KE.merkeAnsichtsschalter = function () {
    const { figuren, markierungen } = KE.zustand.schalter;
    try {
      localStorage.setItem(ANSICHTSSCHALTER, JSON.stringify({ figuren, markierungen }));
    } catch (fehler) {
      console.warn("localStorage nicht beschreibbar", fehler);
    }
  };

  /** Liest den gemerkten Zustand der beiden Knöpfe; ohne Eintrag bleibt die Vorgabe. */
  function ladeAnsichtsschalter() {
    try {
      const gemerkt = JSON.parse(localStorage.getItem(ANSICHTSSCHALTER) || "{}");
      for (const name of ["figuren", "markierungen"]) {
        if (typeof gemerkt[name] === "boolean") KE.zustand.schalter[name] = gemerkt[name];
      }
    } catch (fehler) {
      console.warn("Ansicht nicht lesbar", fehler);
    }
  }

  function groesse() {
    const canvas = document.getElementById("leinwand");
    const rahmen = canvas.parentElement.getBoundingClientRect();
    canvas.width = Math.max(100, Math.floor(rahmen.width));
    canvas.height = Math.max(100, Math.floor(rahmen.height));
    KE.zeichne();
  }

  function verbindeKnoepfe() {
    const klick = (id, tu) => document.getElementById(id).addEventListener("click", tu);
    for (const k of document.querySelectorAll("[data-schalter]")) {
      k.addEventListener("click", () => KE.schalte(k.dataset.schalter));
    }
    klick("zurueck", () => KE.rueckgaengig());
    klick("vor", () => KE.wiederholen());
    klick("zoomrein", () => KE.zoome(1.25));
    klick("zoomraus", () => KE.zoome(0.8));
    klick("einpassen", () => KE.einpassen());
    klick("herunterladen", () => KE.herunterladen());
    klick("laden", () => document.getElementById("ladedatei").click());
    document.getElementById("ladedatei").addEventListener("change", (e) => {
      const datei = e.target.files && e.target.files[0];
      if (datei) KE.ladeAenderungsdatei(datei);
      e.target.value = "";
    });
    klick("hilfeknopf", () => KE.hilfe(true));
    klick("hilfezu", () => KE.hilfe(false));
    klick("verwerfen", () => {
      if (
        confirm(
          "Alle Änderungen in allen Karten verwerfen? Das lässt sich nicht rückgängig machen.",
        )
      ) {
        KE.allesVerwerfen();
        KE.zeichneKartenliste();
      }
    });
    document.getElementById("kartensuche").addEventListener("input", () => KE.zeichneKartenliste());
    document.getElementById("bibsuche").addEventListener("input", () => KE.zeichneBibliothek());
    document.getElementById("bibumgebung").addEventListener("change", () => KE.zeichneBibliothek());
    document.getElementById("pinselzeichen").addEventListener("change", (e) => {
      KE.zustand.pinselZeichen = e.target.value;
    });
  }

  function start() {
    if (!window.EDITOR_DATEN) {
      document.body.textContent =
        "daten.js fehlt: Bitte das ganze Paket (Ordner editor) herunterladen und index.html darin öffnen.";
      return;
    }
    KE.ladeDaten(window.EDITOR_DATEN);
    ladeAnsichtsschalter();
    KE.ladeBilder(window.EDITOR_DATEN, () => KE.zeichne());
    verbindeKnoepfe();
    KE.bindeLeinwand(document.getElementById("leinwand"));
    KE.bindeTastatur();
    KE.bindePinsel(); // Kollisionspinsel (pinsel.js)
    window.addEventListener("resize", groesse);
    document.getElementById("version").textContent =
      `Editor ${KE.VERSION} · Paket vom ${window.EDITOR_DATEN.erstellt.slice(0, 10)}`;
    groesse();
    KE.zeichneKartenliste();
    KE.zeichneBibliothek();
    let letzte = null;
    try {
      letzte = localStorage.getItem(LETZTE_KARTE);
    } catch (fehler) {
      console.warn("localStorage nicht lesbar", fehler);
    }
    const erste = KE.zustand.original[letzte] ? letzte : KE.zustand.daten.szenen[0]?.datei;
    if (erste) KE.oeffne(erste);
    const oeffne = KE.oeffne;
    KE.oeffne = function (datei) {
      oeffne(datei);
      try {
        localStorage.setItem(LETZTE_KARTE, datei);
      } catch (fehler) {
        console.warn("localStorage nicht beschreibbar", fehler);
      }
    };
    const geaendert = KE.geaenderteDateien().length;
    KE.meldeAenderung(
      geaendert ? `Zwischenstand geladen: ${geaendert} geänderte Karte(n).` : "Bereit. Hilfe mit ?",
    );
  }

  window.addEventListener("DOMContentLoaded", start);
})(window.KE);
