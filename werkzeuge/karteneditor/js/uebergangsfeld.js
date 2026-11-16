/*
 * Karteneditor – Bedienfeld „Übergänge“ rechts (ab 1.4, in panel.js eingehängt):
 * 1. Ausgewählter Übergang: Ziel mit „Zum Ziel“, Ziel ändern, Durchgangsrichtung, Ankunftsfeld
 *    (automatisch oder fest, mit Blick) und „Übergang entfernen“.
 * 2. „Neuer Übergang“: Art, Zielkarte (Suche, nach Orten gruppiert), Zielauslöser oder „neuen
 *    Gegenauslöser anlegen“, Name (Vorschlag aus Art und Zielkarte), Durchgang; dann „Setzen“.
 * 3. „Übergang hier“: Kopie eines Auslösers der Karte (wie bis 1.3).
 *
 * Warum: Wünsche des Autors vom 16.11.2026 (Übergänge zu beliebigen Karten, Ziele und Ankunft
 * sehen). Das Feld wird nach jeder Änderung neu gebaut; was der Autor in „Neuer Übergang“ eingibt,
 * steht deshalb in zustand.neuForm. Die Arbeit selbst machen ausloeser.js und uebergaenge.js.
 */
"use strict";

(function (KE) {
  const el = (...a) => KE.el(...a);
  const ARTEN = ["tuer", "treppe", "weg", "luke", "leiter", "steg"];
  const RICHTUNGEN = ["oben", "unten", "links", "rechts"];
  const NAME_MUSTER = /^[A-Za-z][A-Za-z0-9]*$/;

  function knopf(text, klasse, tu, titel = "") {
    const k = el("button", klasse, text);
    k.title = titel;
    k.addEventListener("click", tu);
    return k;
  }

  function auswahlliste(id, optionen, wert, aendern) {
    const s = el("select");
    if (id) s.id = id;
    for (const [w, t] of optionen) s.append(Object.assign(el("option", "", t), { value: w }));
    s.value = wert;
    s.addEventListener("change", () => aendern(s.value));
    return s;
  }

  /** Füllt eine Kartenauswahl mit allen Karten des Pakets, gruppiert nach Ort, gefiltert. */
  function fuelleKarten(wahl, suche, wert) {
    const gruppen = new Map();
    const wort = suche.trim().toLowerCase();
    for (const k of KE.zustand.daten.karten || []) {
      const text = `${k.ortsname} ${k.kartenname} ${k.kennung}`.toLowerCase();
      if (wort && !text.includes(wort) && k.kennung !== wert) continue;
      if (!gruppen.has(k.ortsname)) gruppen.set(k.ortsname, el("optgroup"));
      const g = gruppen.get(k.ortsname);
      g.label = k.ortsname;
      g.append(
        Object.assign(el("option", "", `${k.kartenname} (${k.kennung})`), { value: k.kennung }),
      );
    }
    wahl.replaceChildren(
      Object.assign(el("option", "", "– Zielkarte wählen –"), { value: "" }),
      ...gruppen.values(),
    );
    wahl.value = wert;
  }

  /** Auswahl des Zielauslösers einer Karte; `neu` bietet „neuen Gegenauslöser anlegen“ an. */
  function zielausloeser(id, kennung, wert, neu, aendern) {
    const optionen = neu ? [["", "＋ neuen Gegenauslöser anlegen"]] : [];
    for (const n of KE.ausloesernamen(KE.grunddatei(kennung))) {
      const ziel = KE.regel(kennung, n)?.ziel;
      optionen.push([n, ziel ? `${n} (→ ${KE.kartenname(ziel.karte)})` : n]);
    }
    return auswahlliste(id, optionen, wert, aendern);
  }

  /** Zeile mit Beschriftung. */
  function zeile(text, ...inhalt) {
    const r = el("div", "knopfreihe");
    r.append(el("span", "beschriftung", text), ...inhalt);
    return r;
  }

  /** Ankunft des Übergangs als Text. Beispiel: „Ankunft (5, 10), Blick oben, fest“. */
  function ankunftstext(an) {
    if (!an) return "Ankunft: –";
    const art = an.festgelegt ? "fest" : "automatisch";
    const fehler = an.fehler ? ` – ${an.fehler}!` : "";
    return `Ankunft (${an.x}, ${an.y}), Blick ${an.richtung}, ${art}${fehler}`;
  }

  /** Teil 1: der ausgewählte Übergang (alle ausgewählten Auslöser tragen denselben Namen). */
  function gewaehlterUebergang(box, felder) {
    const name = felder[0].eintrag.name;
    const szene = KE.szene();
    const regel = KE.regel(szene.karte, name);
    const istUebergang = regel?.art === "uebergang";
    box.append(el("div", "titel", `${istUebergang ? "Übergang" : "Auslöser"} „${name}“`));
    const werte = new Set(felder.map((t) => t.eintrag.eigenschaften?.durchgang || ""));
    const durchgang = auswahlliste(
      "durchgangswahl",
      [["", "– von selbst –"], ...RICHTUNGEN.map((r) => [r, r])],
      werte.size === 1 ? [...werte][0] : "",
      (w) => KE.setzeDurchgang(w),
    );
    box.append(zeile("Durchgang:", durchgang));
    if (regel && !istUebergang) return;
    if (istUebergang) {
      const z = regel.ziel || {};
      box.append(
        el("div", "zielanzeige", `Ziel: ${KE.kartenname(z.karte)} (${z.karte}) · ${z.ausloeser}`),
      );
      const an = KE.ankunftsort(szene, name);
      const text = el("div", an?.fehler ? "grundhinweis" : "kurz", ankunftstext(an));
      text.id = "ankunftsanzeige";
      box.append(text);
      const blick = auswahlliste(
        "blickwahl",
        [["", "– vom Durchgang weg –"], ...RICHTUNGEN.map((r) => [r, r])],
        felder[0].eintrag.eigenschaften?.blick || "",
        (w) => KE.setzeBlick(name, w),
      );
      box.append(zeile("Blick:", blick));
      const reihe = el("div", "knopfreihe");
      reihe.append(
        knopf(
          "Zum Ziel",
          "zumZiel",
          () => KE.zumZiel(name),
          "Zielkarte öffnen, Gegenauslöser wählen",
        ),
        knopf("Ankunft festlegen", "ankunftFestlegen", () =>
          KE.starteSetzen({ art: "ankunft", name }),
        ),
      );
      if (an?.festgelegt)
        reihe.append(knopf("Automatisch", "ankunftAutomatisch", () => KE.ankunftAutomatisch(name)));
      box.append(reihe);
    }
    zielAendern(box, name, regel);
    box.append(
      knopf("Übergang entfernen", "uebergangEntfernen", () => {
        if (confirm(`Alle Felder von „${name}“ auf dieser Karte und sein Ziel entfernen?`))
          KE.entferneUebergang(name);
      }),
    );
  }

  /** Ziel eines Übergangs ändern (oder einem Auslöser ohne Definition eins geben). */
  function zielAendern(box, name, regel) {
    const z = KE.zustand;
    if (!z.zielForm || z.zielForm.fuer !== name)
      z.zielForm = {
        fuer: name,
        karte: regel?.ziel?.karte || "",
        ausloeser: regel?.ziel?.ausloeser || "",
        rueckweg: false,
      };
    const f = z.zielForm;
    const teil = el("details", "zielform");
    teil.open = !!f.offen;
    teil.addEventListener("toggle", () => (f.offen = teil.open));
    teil.append(el("summary", "", regel ? "Ziel ändern" : "Ziel festlegen"));
    const karten = el("select");
    karten.id = "zielkartenwahl";
    fuelleKarten(karten, "", f.karte);
    karten.addEventListener(
      "change",
      () => ((f.karte = karten.value), (f.ausloeser = ""), KE.zeichnePanel()),
    );
    const ausloeser = zielausloeser(
      "zielausloeserwahl",
      f.karte,
      f.ausloeser,
      false,
      (w) => (f.ausloeser = w),
    );
    if (!f.ausloeser) f.ausloeser = ausloeser.value;
    const rueck = Object.assign(el("input"), {
      type: "checkbox",
      checked: f.rueckweg,
      id: "zielrueckweg",
    });
    rueck.addEventListener("change", () => (f.rueckweg = rueck.checked));
    const label = el("label", "", " Rückweg von dort hierher umstellen");
    label.prepend(rueck);
    const los = knopf("Ziel übernehmen", "zielUebernehmen", () =>
      KE.aendereZiel(name, { karte: f.karte, ausloeser: f.ausloeser }, f.rueckweg),
    );
    los.disabled = !f.karte || !f.ausloeser;
    teil.append(karten, ausloeser, label, los);
    box.append(teil);
  }

  /** Teil 2: „Neuer Übergang“ mit allen Angaben, dann „Setzen“. */
  function neuerUebergang(box) {
    const z = KE.zustand;
    const f = (z.neuForm ??= {
      offen: false,
      art: "tuer",
      suche: "",
      zielkarte: "",
      zielausloeser: "",
      durchgang: "",
    });
    const teil = el("details", "neuform");
    teil.open = !!f.offen;
    teil.addEventListener("toggle", () => (f.offen = teil.open));
    const kopf = el("summary", "neuerUebergang", "Neuer Übergang");
    // Gleich beim Klick merken: „toggle“ kommt erst später, und ein Neuzeichnen des Felds dazwischen
    // (etwa durch die nächste Eingabe) klappte es sonst wieder zu.
    kopf.addEventListener("click", () => (f.offen = !teil.open));
    teil.append(kopf);
    const szene = KE.szene();
    const zieldatei = KE.grunddatei(f.zielkarte);
    if (!f.nameGetippt)
      f.name = f.zielkarte ? KE.namensvorschlag(f.art, f.zielkarte, szene.karte, z.datei) : "";
    if (!f.gegenGetippt)
      f.gegen = f.zielkarte ? KE.namensvorschlag(f.art, szene.karte, f.zielkarte, zieldatei) : "";
    const art = auswahlliste(
      "neuart",
      ARTEN.map((a) => [a, a]),
      f.art,
      (w) => ((f.art = w), KE.zeichnePanel()),
    );
    const suche = Object.assign(el("input"), {
      type: "search",
      id: "zielsuche",
      placeholder: "Karte suchen …",
      value: f.suche,
    });
    const karten = el("select");
    karten.id = "neuzielkarte";
    fuelleKarten(karten, f.suche, f.zielkarte);
    suche.addEventListener(
      "input",
      () => ((f.suche = suche.value), fuelleKarten(karten, f.suche, f.zielkarte)),
    );
    karten.addEventListener(
      "change",
      () => ((f.zielkarte = karten.value), (f.zielausloeser = ""), KE.zeichnePanel()),
    );
    const ziel = zielausloeser("neuzielausloeser", f.zielkarte, f.zielausloeser, true, (w) => {
      f.zielausloeser = w;
      KE.zeichnePanel();
    });
    const eingabe = (id, wert, getippt) => {
      const e = Object.assign(el("input"), { id, value: wert });
      e.addEventListener(
        "input",
        () => ((f[getippt[0]] = e.value), (f[getippt[1]] = true), pruefen()),
      );
      return e;
    };
    const name = eingabe("neuname", f.name, ["name", "nameGetippt"]);
    const gegen = eingabe("neugegenname", f.gegen, ["gegen", "gegenGetippt"]);
    const durchgang = auswahlliste(
      "neudurchgang",
      [["", "– von selbst –"], ...RICHTUNGEN.map((r) => [r, r])],
      f.durchgang,
      (w) => (f.durchgang = w),
    );
    const rueck = Object.assign(el("input"), {
      type: "checkbox",
      checked: !!f.rueckweg,
      id: "neurueckweg",
    });
    rueck.addEventListener("change", () => (f.rueckweg = rueck.checked));
    const rueckLabel = el("label", "", " Rückweg von dort hierher umstellen");
    rueckLabel.prepend(rueck);
    const hinweis = el("div", "grundhinweis");
    const setzen = knopf("Setzen", "neuSetzen", () =>
      KE.starteSetzen({
        art: "neu",
        name: f.name,
        zielkarte: f.zielkarte,
        zielausloeser: f.zielausloeser,
        gegen: f.zielausloeser ? null : f.gegen,
        durchgang: f.durchgang || null,
        rueckweg: !!f.rueckweg,
      }),
    );
    function pruefen() {
      const fehler = !f.zielkarte
        ? "Zielkarte wählen."
        : !NAME_MUSTER.test(f.name)
          ? "Name: Buchstaben und Ziffern, vorn ein Buchstabe."
          : KE.ausloesernamen(z.datei).includes(f.name)
            ? `„${f.name}“ gibt es hier schon (für mehr Felder: Strg+D).`
            : !f.zielausloeser && !NAME_MUSTER.test(f.gegen || "")
              ? "Name des Gegenauslösers fehlt."
              : "";
      hinweis.textContent = fehler;
      setzen.disabled = !!fehler;
    }
    pruefen();
    teil.append(zeile("Art:", art), suche, karten, zeile("Ziel:", ziel), zeile("Name:", name));
    if (!f.zielausloeser) teil.append(zeile("Gegenauslöser:", gegen));
    else teil.append(rueckLabel);
    teil.append(zeile("Durchgang:", durchgang), hinweis, setzen);
    box.append(teil);
  }

  /** Teil 3: „Übergang hier“ wie bis 1.3. */
  function uebergangHier(box) {
    const liste = KE.ausloeservorlagen(KE.szene());
    if (!liste.length) return;
    const wahl = el("select");
    wahl.id = "uebergangsvorlage";
    for (const a of liste) {
      const wohin = a.eigenschaften ? ` → ${Object.values(a.eigenschaften).join(", ")}` : "";
      wahl.append(Object.assign(el("option", "", `wie „${a.name}“${wohin}`), { value: a.name }));
    }
    const gewaehlt = KE.ausgewaehlt().find((t) => t.liste === "ausloeser");
    if (gewaehlt) wahl.value = gewaehlt.eintrag.name;
    const k = knopf(
      "Übergang hier",
      "uebergangHier",
      () => KE.uebergangHier(wahl.value),
      "Danach eine Kachel anklicken; Strg+D vervielfältigt, Entf löscht",
    );
    k.classList.toggle("an", !!KE.zustand.uebergangVorlage);
    const reihe = el("div", "knopfreihe");
    reihe.append(wahl, k);
    box.append(el("div", "zwischentitel", "Kopie eines Auslösers"), reihe);
  }

  /** Das ganze Feld „Übergänge“ (panel.js). */
  KE.uebergangsfeld = function (ziel) {
    const box = el("div", "uebergangsfeld");
    box.append(el("div", "zwischentitel", "Übergänge"));
    const felder = KE.ausgewaehlt();
    if (
      felder.length &&
      felder.every((t) => t.liste === "ausloeser" && t.eintrag.name === felder[0].eintrag.name)
    )
      gewaehlterUebergang(box, felder);
    neuerUebergang(box);
    uebergangHier(box);
    ziel.append(box);
  };
})(window.KE);
