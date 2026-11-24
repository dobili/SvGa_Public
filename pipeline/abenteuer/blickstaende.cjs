// Blickstände: ein Stand der Gesamtsimulation je Blickpunkt (inhalte/abenteuer/ambrose_blickpunkte.json),
// genommen in dem Augenblick, in dem die Simulation die Karte des Blickpunkts betritt und er fällig
// ist (Ambrose da und wach, `wann` erfüllt, kein Eingangsdialog). Für die Blickprobe im Browser
// (app/tests/durchlauf/blickprobe.spec.ts), die jeden Blickpunkt einzeln abläuft.
//
// Warum: Ein Blickpunkt löst nur aus, wenn der Stand passt; ein Aktbeginn passt für viele Karten
// nicht (Ambrose noch nicht wach, im Tiefpunkt, `wann` noch falsch). Die Simulation spielt mit
// ihren eigenen Regeln bis dorthin; hier wird kein Wert von Hand gesetzt. Der Haken läuft vor dem
// Abspielen der Blickpunkte (gesamtsimulation-blickpunkte.cjs), so ist `<knoten>_gesehen` noch
// nicht gesetzt.
//
// Aufruf aus dem Hauptordner:
//   node pipeline/abenteuer/blickstaende.cjs --ziel ORDNER [--startwert 1] [--sekunden 300]
// Ausgabe: ORDNER/<knoten>.json in der Form von aktstand.cjs, dazu ORDNER/liste.json mit allen
// Blickpunkten und dem Namen ihres Stands (oder null, wenn die Simulation nie hinkam).
"use strict";
const fs = require("fs");
const path = require("path");
const {
  ladeWelt,
  neuerStand,
  nachBetreten,
} = require("./gesamtsimulation-regeln.cjs");
const { erkunde } = require("./gesamtsimulation.cjs");
const {
  faelligeBlickpunkte,
  ladeBlickpunkte,
} = require("./gesamtsimulation-blickpunkte.cjs");

/** Liest --name wert aus der Befehlszeile. */
function wert(liste, name, vorgabe) {
  const i = liste.indexOf(name);
  return i >= 0 && liste[i + 1] !== undefined ? liste[i + 1] : vorgabe;
}

/** Der Stand in der Form von aktstand.cjs (tiefe Kopie, damit die Simulation ihn nicht ändert). */
function standAus(st) {
  return JSON.parse(
    JSON.stringify({
      vars: st.vars,
      besitz: [...st.besitz],
      karten: st.karten,
      muenzen: st.muenzen,
      staende: st.staende,
      karte: st.karte,
      besucht: [...st.besucht],
      runden: st.runden,
      partien: st.partien,
    }),
  );
}

function hauptprogramm(liste) {
  const ziel = wert(liste, "--ziel", "");
  if (!ziel) {
    console.error(
      "Aufruf: node pipeline/abenteuer/blickstaende.cjs --ziel ORDNER",
    );
    process.exitCode = 1;
    return;
  }
  fs.mkdirSync(ziel, { recursive: true });
  const welt = ladeWelt();
  const genommen = new Map();
  // Nach dem Eingangsdialog und vor dem Haken der Blickpunkte: Er setzt `<knoten>_gesehen`.
  const nimm = (w, st, karte) => {
    for (const p of faelligeBlickpunkte(w, st, karte)) {
      if (genommen.has(p.knoten)) continue;
      genommen.set(p.knoten, true);
      fs.writeFileSync(
        path.join(ziel, `${p.knoten}.json`),
        JSON.stringify(standAus(st)),
      );
    }
  };
  const vorBlick = nachBetreten.findIndex((f) => f.name === "blickpunkte");
  nachBetreten.splice(vorBlick < 0 ? nachBetreten.length : vorBlick, 0, nimm);
  const st = neuerStand(Number(wert(liste, "--startwert", "1")));
  const frist = Date.now() + Number(wert(liste, "--sekunden", "300")) * 1000;
  // Nach jedem Schritt noch einmal: Beim ersten Betreten sperrt oft der Eingangsdialog; die App
  // spielt die Stelle danach im Vorbeigehen, die Simulation nur beim nächsten Betreten.
  erkunde(welt, st, frist, 0, (s) => {
    nimm(welt, s, s.karte);
    return false;
  });
  const punkte = ladeBlickpunkte().map((p) => ({
    ...p,
    stand: genommen.has(p.knoten) ? p.knoten : null,
  }));
  fs.writeFileSync(
    path.join(ziel, "liste.json"),
    JSON.stringify(punkte, null, 1),
  );
  const ohne = punkte.filter((p) => !p.stand).map((p) => p.knoten);
  console.log(
    `${punkte.length - ohne.length} von ${punkte.length} Blickpunkten mit Stand → ${ziel}`,
  );
  if (ohne.length) console.log(`Nie fällig: ${ohne.join(", ")}`);
}

if (require.main === module) hauptprogramm(process.argv.slice(2));
