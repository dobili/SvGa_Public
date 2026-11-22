/*
 * Karteneditor – Blickrichtung stehender Figuren und Statisten (Editor 1.7, Rückmeldung R008).
 *
 * Warum: Stehende Personen schauten im Spiel immer nach unten, auch neben ihrem Tresen oder ihrem
 * Gesprächspartner (R008). Seit dem 16.11.2026 trägt eine Figur der Szene `blick` (oben, unten,
 * links, rechts), ein Statist `eigenschaften.blick` (App: oberwelt/sitzrichtung.ts; Prüfung:
 * python -m pipeline.abenteuer.blickrichtung). Der Autor stellt die Richtung hier für die Auswahl
 * ein, auch für mehrere Personen mit Strg+Klick; „Vorgabe“ entfernt die Angabe (dann unten).
 * Sitzende behalten ihre Sitzrichtung (`sitzt`), für sie gibt es hier nichts einzustellen.
 * Vorschau: Das Paket bringt je Person die vier Standbilder mit (pipeline/abenteuer/editorpersonen.py);
 * gezeichnet wird das Bild der Richtung, ohne Bild ein Pfeil im Kreis der Markierung.
 */
"use strict";

(function (KE) {
  /** Reihenfolge der Standbilder im Paket, wie in der App (figurbilder.ts): rechts, oben, links, unten. */
  const REIHENFOLGE = ["rechts", "oben", "links", "unten"];
  const KNOEPFE = [
    ["oben", "↑"],
    ["unten", "↓"],
    ["links", "←"],
    ["rechts", "→"],
  ];
  const VORGABE = "unten";
  const PFEIL = { oben: [0, -1], unten: [0, 1], links: [-1, 0], rechts: [1, 0] };
  const el = (...a) => KE.el(...a);
  const bilder = {}; // data-URL → HTMLImageElement

  /** Die Angaben einer Person: bei Figuren der Eintrag selbst, bei Statisten die Eigenschaften. */
  const angaben = (liste, e) => (liste === "figuren" ? e : e.eigenschaften || {});

  /** Ist der Eintrag eine Person, deren Blick sich einstellen lässt (stehend, kein Tier)? */
  function stehendePerson(liste, e) {
    if (liste === "belebung" && e.typ !== "statist") return false;
    return (liste === "figuren" || liste === "belebung") && !angaben(liste, e).sitzt;
  }

  /** Blickrichtung einer Person (gesetzt oder Vorgabe unten); Sitzende: ihre Sitzrichtung. */
  KE.blickVon = function (liste, e) {
    const a = angaben(liste, e);
    const sitzt = a.sitzt === true || a.sitzt === "ja" ? VORGABE : a.sitzt;
    if (REIHENFOLGE.includes(sitzt)) return sitzt;
    return REIHENFOLGE.includes(a.blick) ? a.blick : VORGABE;
  };

  const personen = () => KE.ausgewaehlt().filter((t) => stehendePerson(t.liste, t.eintrag));

  /** Setzt die Blickrichtung aller ausgewählten stehenden Personen (ein Schritt); null = Vorgabe. */
  KE.setzePersonenblick = function (richtung) {
    const auswahl = personen();
    if (!auswahl.length || (richtung !== null && !REIHENFOLGE.includes(richtung))) return;
    KE.schritt(richtung ? `Blick ${richtung}` : "Blick: Vorgabe", [KE.zustand.datei], () => {
      for (const t of auswahl) {
        if (t.liste === "figuren") {
          if (richtung) t.eintrag.blick = richtung;
          else delete t.eintrag.blick;
        } else if (richtung) (t.eintrag.eigenschaften ??= {}).blick = richtung;
        else if (t.eintrag.eigenschaften) delete t.eintrag.eigenschaften.blick;
      }
    });
  };

  /** Bereich „Blick“ im Bedienfeld: vier Richtungen und Vorgabe; die Richtung der ersten leuchtet. */
  KE.blickfeld = function (ziel) {
    const auswahl = personen();
    if (!auswahl.length) return;
    const erste = auswahl[0];
    const gesetzt = angaben(erste.liste, erste.eintrag).blick;
    const reihe = el("div", "knopfreihe blickfeld");
    reihe.append(el("span", "", "Blick"));
    for (const [richtung, zeichen] of KNOEPFE) {
      const k = el("button", `blick-${richtung}` + (richtung === gesetzt ? " an" : ""), zeichen);
      k.title = `Schaut nach ${richtung} (R008)`;
      k.addEventListener("click", () => KE.setzePersonenblick(richtung));
      reihe.append(k);
    }
    const vorgabe = el("button", "blick-vorgabe" + (gesetzt ? "" : " an"), "Vorgabe");
    vorgabe.title = "Keine Angabe: schaut nach unten";
    vorgabe.addEventListener("click", () => KE.setzePersonenblick(null));
    reihe.append(vorgabe);
    ziel.append(reihe);
  };

  /** Schlüssel einer Person im Paket (wie editorpersonen.personenschluessel). */
  function schluessel(m) {
    if (m.liste === "figuren") return `f:${m.eintrag.name}`;
    return `b:${m.eintrag.name}|${m.eintrag.eigenschaften?.bild || ""}`;
  }

  /** Sitzt die Person (Figur `sitzt`, Statist `eigenschaften.sitzt`)? */
  const sitzt = (m) =>
    !!(m.liste === "figuren" ? m.eintrag.sitzt : m.eintrag.eigenschaften?.sitzt);

  /**
   * Das Bild einer Markierung in ihrer Blickrichtung: sitzend das Sitzbild, wenn das Paket eins hat
   * (personensitzbilder, Editor 1.8), sonst das Standbild; null ohne Bogen im Paket.
   */
  function standbild(m, alsSitzbild = false) {
    const z = KE.zustand;
    const bogen = z.nachDatei[z.datei]?.personen?.[schluessel(m)];
    const quelle = alsSitzbild ? z.daten.personensitzbilder : z.daten.personenbilder;
    const url = quelle?.[bogen]?.[REIHENFOLGE.indexOf(KE.blickVon(m.liste, m.eintrag))];
    if (!url) return null;
    if (!bilder[url]) {
      bilder[url] = new Image();
      bilder[url].onload = () => KE.zeichne();
      bilder[url].src = url;
    }
    return bilder[url].complete && bilder[url].naturalWidth ? bilder[url] : null;
  }

  /**
   * Zeichnet eine Person als Standbild in Blickrichtung, die Füße unten mittig auf ihrer Kachel
   * (wie kartenbild.py). Ausgabe: true, wenn gezeichnet; false für Auslöser, Tiere und Personen ohne
   * Bild, dann zeichnet zeichnen.js den Kreis und hier kommt der Pfeil dazu (zeichnePfeil).
   */
  KE.zeichnePerson = function (ctx, m, k) {
    if (m.liste !== "figuren" && !(m.liste === "belebung" && m.eintrag.typ === "statist"))
      return false;
    const sitzbild = sitzt(m) ? standbild(m, true) : null;
    const b = sitzbild || standbild(m);
    if (!b) return false;
    // Sitzende rücken wie in der App auf ihr Sitzmöbel (sitzen.js); der feine Versatz steckt in m.
    const { dx, dy } = KE.sitzverschiebung(m, b, !!sitzbild);
    ctx.drawImage(b, m.x + (k - b.naturalWidth) / 2 + dx, m.y + k - b.naturalHeight + dy);
    return true;
  };

  /** Pfeil in Blickrichtung im Kreis einer Person ohne Bild. */
  KE.zeichnePfeil = function (ctx, m, k) {
    if (m.liste !== "figuren" && !(m.liste === "belebung" && m.eintrag.typ === "statist")) return;
    const [dx, dy] = PFEIL[KE.blickVon(m.liste, m.eintrag)];
    const mx = m.x + k / 2;
    const my = m.y + k / 2;
    const r = k / 2 - 3;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(mx - dx * r * 0.4, my - dy * r * 0.4);
    ctx.lineTo(mx + dx * r, my + dy * r);
    ctx.lineTo(mx + dx * r * 0.3 - dy * r * 0.5, my + dy * r * 0.3 + dx * r * 0.5);
    ctx.moveTo(mx + dx * r, my + dy * r);
    ctx.lineTo(mx + dx * r * 0.3 + dy * r * 0.5, my + dy * r * 0.3 - dx * r * 0.5);
    ctx.stroke();
  };
})(window.KE);
