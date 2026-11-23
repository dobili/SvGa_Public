/*
 * Karteneditor – Zustand einer Figur oder eines Tiers wählen (Editor 1.9, Wunsch des Autors,
 * 23.11.2026: „Im Map-Editor bei den Figuren und Tieren zwischen den verschiedenen States wechseln,
 * die gerade verwendet werden … damit ich kleine Ungereimtheiten in der Darstellung selbst im
 * Editor ändern kann.“).
 *
 * Eine Figur trägt optional `zustand` (stehen, sitzstuhl, sitzboden, liegt) und `standbild`
 * (Kennung eines weiteren Standbilds aus PixelLab), ein Statist dieselben unter `eigenschaften`, ein
 * Tier `eigenschaften.zustand` (stehen, sitzen, schlafen, grasen, schwimmen). Leer heißt Regel
 * (Sitzmöbel, Verhalten, Tagesablauf); „Zurück auf Standard“ entfernt beides
 * (pipeline/abenteuer/figurzustand.py, App: oberwelt/figurzustand.ts).
 * Vorschau: Das Paket bringt je Bogen die Bilder der Zustände und Standbilder mit
 * (pipeline/abenteuer/editorzustaende.py: personenzustaende, tierzustaende); die Wahl wirkt sofort
 * im Bild, mit Sitzlage und feinem Versatz (sitzen.js).
 */
"use strict";

(function (KE) {
  const MENSCH = [
    ["stehen", "Stehen"],
    ["sitzstuhl", "Stuhl"],
    ["sitzboden", "Boden"],
    ["liegt", "Liegen"],
  ];
  const TIER = [
    ["stehen", "Stehen"],
    ["sitzen", "Sitzen"],
    ["schlafen", "Schlafen"],
    ["grasen", "Grasen"],
    ["schwimmen", "Schwimmen"],
  ];
  const REIHENFOLGE = ["rechts", "oben", "links", "unten"];
  const el = (...a) => KE.el(...a);

  const istTier = (liste, e) => liste === "belebung" && e.typ === "tier";
  const istPerson = (liste, e) =>
    liste === "figuren" || (liste === "belebung" && e.typ === "statist");
  /** Die Angaben: bei Figuren der Eintrag selbst, sonst die Eigenschaften. */
  const angaben = (liste, e) => (liste === "figuren" ? e : e.eigenschaften || {});

  /** Zustand und Standbild einer Markierung (null ohne Angabe). */
  KE.zustandVon = function (liste, e) {
    const a = angaben(liste, e);
    return { zustand: a.zustand || null, standbild: a.standbild || null };
  };

  /** Bilder der Zustände des Bogens einer Person (editorzustaende.personenzustaende), sonst {}. */
  function personenbilder(liste, e) {
    const z = KE.zustand;
    const bogen = z.nachDatei[z.datei]?.personen?.[KE.personenschluessel(liste, e)];
    return z.daten.personenzustaende?.[bogen] || {};
  }

  /** Bilder der Zustände eines Tiers (editorzustaende.tierzustaende), sonst {}. */
  function tierbilder(e) {
    const z = KE.zustand;
    const art = z.nachDatei[z.datei]?.tierarten?.[e.name];
    return z.daten.tierzustaende?.[art] || {};
  }

  /**
   * Das Bild, das die Wahl zeigt, oder null (dann zeichnet blick.js wie bisher): { url, sitzbild,
   * kippen }. Liegen ohne Liegebild kippt das Standbild wie die App.
   */
  KE.zustandsbild = function (liste, e) {
    const { zustand, standbild } = KE.zustandVon(liste, e);
    if (istTier(liste, e)) {
      const bilder = tierbilder(e);
      const regel = e.eigenschaften?.verhalten;
      const url = bilder[zustand] || bilder[regel] || bilder.stehen;
      return url ? { url, sitzbild: false, kippen: false } : null;
    }
    const bilder = personenbilder(liste, e);
    const i = REIHENFOLGE.indexOf(KE.blickVon(liste, e));
    if (zustand === "liegt") {
      if (bilder.liegt) return { url: bilder.liegt[0], sitzbild: true, kippen: false };
      return { url: null, sitzbild: false, kippen: true };
    }
    if (zustand === "sitzstuhl" || zustand === "sitzboden") {
      const url = bilder[zustand]?.[i];
      if (url) return { url, sitzbild: true, kippen: false };
    }
    const eigenes = (bilder.standbilder || []).find((s) => s.kennung === standbild);
    if (eigenes && zustand !== "sitzstuhl" && zustand !== "sitzboden") {
      return { url: eigenes.bilder[i], sitzbild: false, kippen: false };
    }
    return null;
  };

  /** Setzt Zustand oder Standbild der Auswahl (ein Schritt); null entfernt die Angabe. */
  KE.setzeZustand = function (feld, wert) {
    const t = KE.ausgewaehlt()[0];
    if (!t) return;
    KE.schritt(wert ? `${feld} ${wert}` : `${feld}: Standard`, [KE.zustand.datei], () => {
      const a = t.liste === "figuren" ? t.eintrag : (t.eintrag.eigenschaften ??= {});
      if (wert) a[feld] = wert;
      else delete a[feld];
    });
  };

  /** Zurück auf Standard: Zustand und Standbild weg (ein Schritt). */
  KE.zustandZurueck = function () {
    const t = KE.ausgewaehlt()[0];
    if (!t) return;
    KE.schritt("Zustand: Standard", [KE.zustand.datei], () => {
      const a = t.liste === "figuren" ? t.eintrag : t.eintrag.eigenschaften || {};
      delete a.zustand;
      delete a.standbild;
    });
  };

  /** Ein Knopf mit Vorschaubildchen (oder nur Text) und Titel. */
  function knopf(klasse, text, url, an, titel, tu) {
    const k = el("button", `zustandsknopf ${klasse}` + (an ? " an" : ""));
    if (url) {
      const bild = el("img");
      bild.src = url;
      bild.alt = "";
      k.append(bild);
    }
    k.append(el("span", "", text));
    k.title = titel;
    k.addEventListener("click", tu);
    return k;
  }

  /** Bereich „Zustand“ im Bedienfeld: nur bei genau einer Person oder einem Tier. */
  KE.zustandsfeld = function (ziel) {
    const auswahl = KE.ausgewaehlt();
    if (auswahl.length !== 1) return;
    const { liste, eintrag } = auswahl[0];
    if (!istPerson(liste, eintrag) && !istTier(liste, eintrag)) return;
    const { zustand, standbild } = KE.zustandVon(liste, eintrag);
    const bereich = el("div", "zustandsfeld");
    bereich.append(el("div", "titel", "Zustand an dieser Stelle"));
    const reihe = el("div", "knopfreihe zustandsreihe");
    const i = REIHENFOLGE.indexOf(KE.blickVon(liste, eintrag));
    const tier = istTier(liste, eintrag);
    const bilder = tier ? tierbilder(eintrag) : personenbilder(liste, eintrag);
    for (const [wert, text] of tier ? TIER : MENSCH) {
      if (tier && Object.keys(bilder).length && !bilder[wert]) continue; // Art kennt ihn nicht
      const url = tier ? bilder[wert] : wert === "liegt" ? bilder.liegt?.[0] : bilder[wert]?.[i];
      const titel = `Zustand „${wert}“ an dieser Stelle (statt der Regel)`;
      reihe.append(
        knopf(`zustand-${wert}`, text, url, zustand === wert, titel, () => KE.setzeZustand("zustand", wert)),
      );
    }
    bereich.append(reihe);
    if (!tier && bilder.standbilder?.length) {
      const zweite = el("div", "knopfreihe standbildreihe");
      for (const s of bilder.standbilder) {
        const an = s.standard ? !standbild : standbild === s.kennung;
        const tu = () => KE.setzeZustand("standbild", s.standard ? null : s.kennung);
        zweite.append(knopf(`standbild-${s.kennung}`, s.name || s.kennung, s.bilder[i], an, s.kennung, tu));
      }
      bereich.append(zweite);
    }
    const zurueck = el("button", "zustand-zurueck", "Zurück auf Standard");
    zurueck.title = "Zustand und Standbild entfernen: wieder die Regel (Sitzmöbel, Verhalten, Tagesablauf)";
    zurueck.disabled = !zustand && !standbild;
    zurueck.addEventListener("click", () => KE.zustandZurueck());
    bereich.append(zurueck);
    ziel.append(bereich);
  };
})(window.KE);
