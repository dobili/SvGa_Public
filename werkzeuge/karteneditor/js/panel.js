/*
 * Karteneditor – Bedienfelder: Eigenschaften der Auswahl (Lage, Drehen, Spiegeln, Maßstab,
 * Ebene, Duplizieren, Löschen, Notiz; Kollision und Übergänge aus kollision.js und ausloeser.js),
 * Hinweis auf Zustandsfassungen, Schalter der Ansicht,
 * Auswahlliste bei übereinanderliegenden Bildern, Statuszeile und Tastenkürzel-Hilfe.
 */
"use strict";

(function (KE) {
  const K = 16;
  const el = (...a) => KE.el(...a);

  /** Statuszeile unten; fehler färbt rot. */
  KE.status = function (text, fehler = false) {
    const s = document.getElementById("status");
    s.textContent = text;
    s.classList.toggle("fehler", fehler);
  };

  KE.zeigeKoordinaten = function (x, y) {
    document.getElementById("koordinaten").textContent = `(${x}, ${y})`;
  };

  /** Schaltet einen Schalter der Ansicht um und zeigt den Stand an den Knöpfen. */
  KE.schalte = function (name, wert) {
    const s = KE.zustand.schalter;
    s[name] = wert === undefined ? !s[name] : wert;
    if (name === "pinsel" && s.pinsel) KE.zustand.kpinsel = null; // Bodenpinsel statt Kollisionspinsel
    // Was nicht mehr anwählbar oder sichtbar ist, fällt aus der Auswahl.
    if ((name === "umgebungSperren" || name === "nurUmgebung") && s[name] && KE.szene()) {
      const stuecke = KE.platziere(KE.szene());
      const weg =
        name === "umgebungSperren"
          ? (st) => KE.gesperrteUmgebung(st, stuecke) // Bodenkacheln auf Möbeln bleiben (geometrie.js)
          : (st) => !st.umgebung;
      for (const st of stuecke) if (weg(st)) KE.zustand.auswahl.delete(st.uid);
      if (name === "nurUmgebung")
        for (const m of KE.markierungen(KE.szene())) KE.zustand.auswahl.delete(m.uid);
    }
    KE.meldeAenderung();
  };

  function zeigeSchalter() {
    for (const knopf of document.querySelectorAll("[data-schalter]")) {
      knopf.classList.toggle("an", !!KE.zustand.schalter[knopf.dataset.schalter]);
    }
    document.getElementById("pinselwahl").hidden = !KE.zustand.schalter.pinsel;
    KE.zeigePinselwahl(); // Kollisionspinsel (pinsel.js)
  }

  /** Füllt die Auswahl des Pinsels mit den Zeichen der Szene (Boden, Wand, Wasser, Sonderböden). */
  function fuellePinsel() {
    const szene = KE.szene();
    const wahl = document.getElementById("pinselzeichen");
    if (!szene) return;
    const optionen = [
      [".", `. ${szene.boden || "Boden"}`],
      ["#", `# ${szene.wandart || "Wand"}`],
      ["~", "~ Wasser"],
      ...Object.entries(szene.boeden || {}).map(([z, n]) => [z, `${z} ${n}`]),
    ];
    const vorher = KE.zustand.pinselZeichen;
    wahl.replaceChildren(
      ...optionen.map(([w, t]) => Object.assign(el("option", "", t), { value: w })),
    );
    wahl.value = optionen.some(([w]) => w === vorher) ? vorher : ".";
    KE.zustand.pinselZeichen = wahl.value;
  }

  function knopf(text, titel, tu, klasse = "") {
    const k = el("button", klasse, text);
    k.title = titel;
    k.addEventListener("click", tu);
    return k;
  }

  function lagetext(e) {
    if (e.auf !== undefined) return `auf „${e.auf}“, versatz (${(e.versatz || [0, 0]).join(", ")})`;
    const v = e.versatz ? ` + (${e.versatz.join(", ")}) px` : "";
    return `(${e.feld.join(", ")})${v}`;
  }

  function einzelheiten(ziel, t) {
    const e = t.eintrag;
    if (t.liste !== "objekte") {
      ziel.append(el("div", "titel", `${e.name}`), el("div", "", `${t.liste}: ${lagetext(e)}`));
      return;
    }
    const m = KE.zustand.daten.moebel[e.moebel] || { name: e.moebel, kurz: "fehlt im Katalog" };
    const stueck = KE.platziere(KE.szene()).find((s) => s.uid === e._uid);
    ziel.append(el("div", "titel", m.name), el("div", "kennung", e.moebel));
    if (m.kurz) ziel.append(el("div", "kurz", m.kurz));
    ziel.append(el("div", "", `Lage: ${lagetext(e)}`));
    const form = [];
    if (e.drehung) form.push(`gedreht ${e.drehung}°`);
    if (e.spiegeln) form.push("gespiegelt");
    if (e.massstab) form.push(`${Math.round(e.massstab * 100)} %`);
    if (form.length) ziel.append(el("div", "", form.join(", ")));
    const ebene = e.ebene ? (e.ebene > 0 ? `+${e.ebene}` : `${e.ebene}`) : "0";
    if (stueck) ziel.append(el("div", "ebenenanzeige", `Ebene ${ebene} (Tiefe ${stueck.tiefe})`));
  }

  function objektnotiz(ziel, uid) {
    const z = KE.zustand;
    const notizen = (z.notizen[z.datei] ??= { karte: "", objekte: {} });
    const feld = el("textarea", "notiz");
    feld.placeholder = "Notiz zu diesem Objekt (warum?)";
    feld.value = notizen.objekte[uid] || "";
    feld.addEventListener("input", () => {
      notizen.objekte[uid] = feld.value;
      KE.sichere();
    });
    ziel.append(feld);
  }

  function werkzeuge(ziel, nurMarken) {
    const pfeile = el("div", "pfeile");
    pfeile.append(
      knopf("←", "1 Pixel nach links (Umschalt: 1 Kachel)", (e) =>
        KE.verschiebe(e.shiftKey ? -K : -1, 0),
      ),
      knopf("↑", "1 Pixel nach oben", (e) => KE.verschiebe(0, e.shiftKey ? -K : -1)),
      knopf("↓", "1 Pixel nach unten", (e) => KE.verschiebe(0, e.shiftKey ? K : 1)),
      knopf("→", "1 Pixel nach rechts", (e) => KE.verschiebe(e.shiftKey ? K : 1, 0)),
    );
    ziel.append(pfeile);
    if (nurMarken) {
      // Auslöser, Figuren, Belebung: Kopie rechts daneben, Löschen mit Rückfrage (markierungen.js).
      const reihe = el("div", "knopfreihe");
      reihe.append(
        knopf(
          "Duplizieren",
          "Strg+D: Kopie eine Kachel rechts daneben",
          () => KE.dupliziere(),
          "duplizieren",
        ),
        knopf(
          "Löschen",
          "Entf (Figuren und Belebung mit Rückfrage)",
          () => KE.loesche(),
          "loeschen",
        ),
      );
      return ziel.append(reihe);
    }
    const masse = el("input");
    masse.type = "number";
    masse.min = "50";
    masse.max = "300";
    masse.step = "5";
    masse.id = "massstab";
    const erstes = KE.ausgewaehlt().find((t) => t.liste === "objekte");
    masse.value = String(Math.round(Number(erstes?.eintrag.massstab ?? 1) * 100));
    masse.addEventListener("change", () => KE.skaliere(Number(masse.value) / 100));
    const reihen = [
      [
        knopf("⟲ 90°", "Gegen den Uhrzeigersinn drehen (Umschalt+R)", () => KE.drehe(-1)),
        knopf("⟳ 90°", "Im Uhrzeigersinn drehen (R)", () => KE.drehe(1), "drehen"),
        knopf("⇋ Spiegeln", "Waagrecht spiegeln (H)", () => KE.spiegele(), "spiegeln"),
      ],
      [
        knopf("−", "Kleiner (25 %)", () => KE.skaliere(-0.25, true)),
        masse,
        el("span", "", "%"),
        knopf("+", "Größer (25 %)", () => KE.skaliere(0.25, true)),
      ],
      [
        knopf("⇊", "Ganz nach hinten (Umschalt+Bild ab)", () => KE.ebene("ganzHinten")),
        knopf("↓ hinten", "Nach hinten (Bild ab)", () => KE.ebene("hinten"), "hinten"),
        knopf("vorn ↑", "Nach vorn (Bild auf)", () => KE.ebene("vorn"), "vorn"),
        knopf("⇈", "Ganz nach vorn (Umschalt+Bild auf)", () => KE.ebene("ganzVorn")),
      ],
      [
        knopf("Duplizieren", "Strg+D", () => KE.dupliziere(), "duplizieren"),
        knopf("Löschen", "Entf", () => KE.loesche(), "loeschen"),
      ],
    ];
    for (const r of reihen) {
      const reihe = el("div", "knopfreihe");
      reihe.append(...r);
      ziel.append(reihe);
    }
  }

  /** Hinweis und Knopf, wenn die Karte Zustandsfassungen hat. */
  function fassungen(ziel) {
    const z = KE.zustand;
    const geschwister = z.nachDatei[z.datei].geschwister;
    if (!geschwister.length) return;
    const box = el("div", "fassungshinweis");
    box.append(el("div", "", `Diese Karte hat Zustandsfassungen: ${geschwister.join(", ")}.`));
    const k = knopf(
      "Auswahl auf Fassungen übertragen",
      "Lage und Form der Auswahl dort übernehmen, dazu die Kacheln des Kollisionspinsels",
      () => {
        const { objekte, kacheln } = KE.uebertrage();
        const pinsel = kacheln ? ` und ${kacheln} Pinselkachel(n)` : "";
        KE.status(
          `${objekte} Objekt(e)${pinsel} auf ${geschwister.length} Fassung(en) übertragen.`,
        );
      },
    );
    k.disabled = !KE.ausgewaehlt().some((t) => t.liste === "objekte") && !KE.pinselGeaendert();
    box.append(k);
    ziel.append(box);
  }

  function kartennotiz(ziel) {
    const z = KE.zustand;
    const notizen = (z.notizen[z.datei] ??= { karte: "", objekte: {} });
    const feld = el("textarea", "notiz");
    feld.id = "kartennotiz";
    feld.placeholder = "Notiz zu den Änderungen dieser Karte (warum?)";
    feld.value = notizen.karte;
    feld.addEventListener("input", () => {
      notizen.karte = feld.value;
      KE.sichere();
    });
    ziel.append(el("div", "zwischentitel", "Notiz zur Karte"), feld);
  }

  /** Baut das Eigenschaften-Feld rechts neu. */
  KE.zeichnePanel = function () {
    const ziel = document.getElementById("eigenschaften");
    ziel.replaceChildren();
    const z = KE.zustand;
    if (!z.datei) return ziel.append(el("div", "leer", "Links eine Karte wählen."));
    const auswahl = KE.ausgewaehlt();
    if (!auswahl.length) ziel.append(el("div", "leer", "Nichts ausgewählt. Klick auf ein Bild."));
    else if (auswahl.length === 1) einzelheiten(ziel, auswahl[0]);
    else ziel.append(el("div", "titel", `${auswahl.length} ausgewählt`));
    if (auswahl.length)
      werkzeuge(
        ziel,
        auswahl.every((t) => t.liste !== "objekte"),
      );
    KE.kollisionsfeld(ziel); // Sperrt / Durchgehbar, Kollision bearbeiten (kollision.js)
    KE.pinselfeld(ziel); // Kollisionspinsel: Zahl der Kacheln, Grund (pinsel.js)
    if (auswahl.length === 1 && auswahl[0].liste === "objekte")
      objektnotiz(ziel, auswahl[0].eintrag._uid);
    KE.uebergangsfeld(ziel); // Übergang hier (ausloeser.js)
    fassungen(ziel);
    kartennotiz(ziel);
  };

  /** Kleine Liste mit Vorschau und Name, wenn mehrere Bilder unter dem Klick liegen. */
  KE.zeigeListe = function (treffer, sx, sy, strg) {
    const liste = document.getElementById("trefferliste");
    liste.replaceChildren(el("div", "zwischentitel", "Hier liegen übereinander:"));
    for (const t of treffer) {
      const zeile = el("button", "trefferzeile");
      const name = t.markierung ? `${t.art}: ${t.name}` : KE.zustand.daten.moebel[t.kennung]?.name;
      if (!t.markierung) zeile.append(KE.vorschau(t.kennung, 28));
      zeile.append(el("span", "", name || t.kennung));
      if (KE.zustand.auswahl.has(t.uid)) zeile.classList.add("aktiv");
      zeile.addEventListener("mousedown", (e) => e.stopPropagation());
      zeile.addEventListener("click", () => {
        if (strg) KE.zustand.auswahl.add(t.uid);
        else KE.zustand.auswahl = new Set([t.uid]);
        KE.schliesseListe();
        KE.meldeAenderung();
      });
      liste.append(zeile);
    }
    liste.style.left = sx + 12 + "px";
    liste.style.top = sy + 12 + "px";
    liste.hidden = false;
  };

  KE.schliesseListe = () => (document.getElementById("trefferliste").hidden = true);

  KE.hilfe = (an) => (document.getElementById("hilfe").hidden = !an);

  /** Alles nach einer Änderung neu zeichnen (Karte, Felder, Knöpfe). */
  KE.meldeAenderung = function (text) {
    zeigeSchalter();
    fuellePinsel();
    KE.zeichne();
    KE.zeichnePanel();
    const zahl = KE.geaenderteDateien().length;
    document.getElementById("herunterladen").textContent = `Änderungen herunterladen (${zahl})`;
    document.getElementById("zurueck").disabled = !KE.zustand.verlauf.length;
    document.getElementById("vor").disabled = !KE.zustand.zukunft.length;
    const knopfAktiv = document.querySelector(".kartenknopf.aktiv");
    if (knopfAktiv && KE.zustand.datei) {
      const markiert = !!knopfAktiv.querySelector(".geaendert");
      if (markiert !== KE.istGeaendert(KE.zustand.datei)) KE.zeichneKartenliste();
    }
    if (text) KE.status(text);
  };
})(window.KE);
