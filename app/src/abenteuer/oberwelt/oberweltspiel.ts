/**
 * Das eine Phaser-Spiel der Oberwelt: einmal je Sitzung gestartet, je Karte nur die Szene neu,
 * beim Verlassen der Oberwelt schlafen gelegt und erst nach einer Ruhezeit beendet.
 *
 * Rolle im Gesamtbild: Hülle um oberwelt/szene.ts für useWeltladen.ts. Ändert sich die Größe des
 * Elements (Gerät gedreht, docs/spiel/30, Abschnitt 3), wächst das Spiel mit, und die Kamera
 * bekommt neue Grenzen; der Held bleibt, wo er ist.
 * Warum ein Spiel für alle Karten (Wunsch des Autors, 26.11.2026): Bis dahin baute jeder
 * Kartenwechsel ein neues Phaser-Spiel auf, mit neuem WebGL-Kontext, neu dekodierten Bildern für
 * dieselben Figuren und Kacheln und einem Takt, der erst anlaufen musste (zeitbasis.ts). Jetzt
 * bleiben Kontext, Takt und Texturen (texturspeicher.ts mit Obergrenze); nur die Szene wechselt.
 * Ablauf: `zeigeKarte` hängt die Leinwand in den Rahmen und startet die Szene der Karte,
 * `raeumeKarteAb` entfernt sie samt allem, was an ihr hängt (Phaser zerstört Eingaben, Kamera,
 * Schichten, Zeitgeber und Hörer der Szene mit ihr), `legeSchlafen` hält das Spiel an, wenn die
 * Oberwelt den Bildschirm verlässt (Partie, Besprechung, Startkarte), `beendeOberwelt` zerstört es.
 * Abhängigkeiten: phaser, szene.ts, zeitbasis.ts (Takt), texturanbindung.ts, phaserNachlass.ts.
 */
import Phaser from "phaser";
import { FIGURFAKTOR } from "./figurbilder";
import { raeumePhaserNachlassAuf } from "./phaserNachlass";
import { Oberweltszene, type Szenendaten } from "./szene";
import { legeSpeicherAn } from "./texturanbindung";
import type { Texturspeicher } from "./texturspeicher";
import { ZEITBASIS } from "./zeitbasis";

/** Schlüssel der Szene (szeneVon sucht sie darunter). */
const SZENE = "oberwelt";
/** Schlüssel der Tiled-Karte im Zwischenspeicher des Spiels (szene.ts, create). */
const KARTENSCHLUESSEL = "karte";
/**
 * So lange schläft das Spiel nach dem Verlassen der Oberwelt, bevor es beendet wird. Eine Partie
 * dauert meist unter einer Viertelstunde; wer länger weg ist, bekommt beim Zurückkommen ein neues
 * Spiel (wie vor dem 26.11.2026 bei jedem Kartenwechsel), und der Grafikspeicher ist frei.
 */
const RUHEZEIT_MS = 15 * 60 * 1000;
/** Attribute, mit denen die Schichten der Szene ihren Stand an die Leinwand schreiben. */
const DATENATTRIBUT = /^data-/;

/** Was zur laufenden Sitzung gehört. */
interface Sitzung {
  readonly spiel: Phaser.Game;
  readonly speicher: Texturspeicher;
  /** Der Rahmen, in dem die Leinwand gerade hängt; null, solange das Spiel schläft. */
  element: HTMLElement | null;
  beobachter: ResizeObserver | null;
  ruhe: ReturnType<typeof setTimeout> | null;
  /** Wartet auf den Start des Spiels (erste Karte): die zuletzt gewünschte Szene. */
  wartet: (() => void) | null;
  /** Gestartete Szenen, für Prüfungen an der Leinwand (data-szene). */
  szenen: number;
}

let sitzung: Sitzung | null = null;

/**
 * Spielgröße zu einem Element: seine Fläche in Bildschirmpixeln (CSS), mindestens ein Pixel. Das
 * Bild hat volle Auflösung, damit Kartenpixel (×3) und Figurenpixel (×2) beide ganzzahlig auf dem
 * Schirm landen; vergrößert wird mit der Kamera (Variante B, weltmassstab.ts).
 */
function spielgroesse(element: HTMLElement): { breite: number; hoehe: number } {
  return {
    breite: Math.max(1, Math.floor(element.clientWidth)),
    hoehe: Math.max(1, Math.floor(element.clientHeight)),
  };
}

/**
 * Passt Spiel und Kamera an die neue Größe des Elements an. Beispiel: Drehen von 390 × 844 auf
 * 844 × 390 → Bild 844 × 390, bei ZOOM 3 sichtbar 281⅓ × 130 Kartenpixel, Kameragrenzen neu.
 * Sonderfall: Läuft die Szene noch nicht, genügt die neue Spielgröße (create rechnet die Grenzen).
 */
function passeAn(spiel: Phaser.Game, element: HTMLElement): void {
  const { breite, hoehe } = spielgroesse(element);
  if (breite === spiel.scale.width && hoehe === spiel.scale.height) return;
  spiel.scale.resize(breite, hoehe);
  const szene = szeneVon(spiel);
  if (!szene?.sys.isActive()) return;
  szene.cameras.main.setSize(breite, hoehe);
  // Grenzen und Versatz über den Knöpfen neu (kameraregie.ts), etwa beim Drehen ins Hochformat.
  szene.passeKameraAn();
}

/**
 * Führt eine Änderung an den Szenen aus, wenn Phaser nicht gerade selbst die Szenen bearbeitet
 * (ein Rückruf aus dem Takt): dann gleich danach, als Mikrotask. Reihenfolge bleibt erhalten.
 */
function ausserhalbDesTakts(spiel: Phaser.Game, aenderung: () => void): void {
  if (spiel.scene.isProcessing) queueMicrotask(aenderung);
  else aenderung();
}

/** Startet das Spiel ohne Szene; die erste Szene kommt mit READY (`wartet`). */
function baueSitzung(element: HTMLElement): Sitzung {
  const { breite, hoehe } = spielgroesse(element);
  const spiel = new Phaser.Game({
    type: Phaser.AUTO,
    parent: element,
    width: breite,
    height: hoehe,
    pixelArt: true,
    backgroundColor: "#1a1612",
    physics: { default: "arcade", arcade: { debug: false } },
    // Echte Zeit ab dem ersten Bild, ohne Zeitlupe nach dem Kartenwechsel (zeitbasis.ts).
    fps: ZEITBASIS,
    // Die App regelt Ton und Blattstapel selbst; Phaser soll keine Tastatur-Scrolls abfangen.
    input: { keyboard: { capture: [] } },
    audio: { noAudio: true },
  });
  const neu: Sitzung = {
    spiel,
    speicher: legeSpeicherAn(spiel),
    element,
    beobachter: null,
    ruhe: null,
    wartet: null,
    szenen: 0,
  };
  // Phaser lässt beim Beenden einen Sichtbarkeitshörer am Dokument zurück.
  raeumePhaserNachlassAuf(spiel);
  spiel.events.once(Phaser.Core.Events.READY, () => {
    // Inzwischen eingeschlafen (Oberwelt sofort wieder verlassen): Leinwand nicht zeigen, Takt
    // gleich nach seinem Start (Game.start, im selben Takt) wieder anhalten.
    if (!neu.element) {
      spiel.canvas?.remove();
      queueMicrotask(() => spiel.loop.sleep());
    } else if (spiel.canvas && spiel.canvas.parentElement !== neu.element) {
      neu.element.appendChild(spiel.canvas);
      (spiel.scale as { parent: HTMLElement }).parent = neu.element;
    }
    const erste = neu.wartet;
    neu.wartet = null;
    erste?.();
  });
  return neu;
}

/** Hängt die Leinwand in den Rahmen (nach dem Schlaf oder beim neuen Rahmen), weckt den Takt. */
function haengeAn(s: Sitzung, element: HTMLElement): void {
  if (s.ruhe) clearTimeout(s.ruhe);
  s.ruhe = null;
  const { spiel } = s;
  if (s.element !== element) {
    s.beobachter?.disconnect();
    s.beobachter = null;
    s.element = element;
    // Drehen des Geräts: Das Spiel folgt der Größe des Elements (ohne Beobachter in alten
    // Browsern bleibt die Größe vom Start).
    if (typeof ResizeObserver !== "undefined") {
      s.beobachter = new ResizeObserver(() => {
        if (spiel.isBooted) passeAn(spiel, element);
      });
      s.beobachter.observe(element);
    }
  }
  if (!spiel.isBooted) return; // die Leinwand kommt mit READY (baueSitzung)
  if (spiel.canvas && spiel.canvas.parentElement !== element) element.appendChild(spiel.canvas);
  // Phaser misst Eltern und Leinwand für die Zeigerkoordinaten; nach dem Umhängen neu.
  (spiel.scale as { parent: HTMLElement }).parent = element;
  passeAn(spiel, element);
  spiel.scale.refresh();
}

/**
 * Weckt den Takt nach dem Abbau oder dem Schlaf; die Pause zählt nicht als Zeit der Welt.
 * Sonderfall: Vor Game.start (erste Karte, im READY) startet Phaser den Takt selbst.
 */
function wecke(spiel: Phaser.Game): void {
  if (!spiel.isRunning || spiel.loop.running) return;
  spiel.loop.wake();
  spiel.loop.resetDelta();
}

/** Entfernt die Szene, was die Schichten an die Leinwand schrieben, und die Karte im Speicher. */
function entferneSzene(s: Sitzung): void {
  const { spiel } = s;
  if (spiel.scene.getScene(SZENE)) spiel.scene.remove(SZENE);
  const leinwand = spiel.canvas as HTMLCanvasElement | undefined;
  for (const name of leinwand?.getAttributeNames() ?? []) {
    if (DATENATTRIBUT.test(name) && name !== "data-szene") leinwand?.removeAttribute(name);
  }
  if (spiel.cache.tilemap.exists(KARTENSCHLUESSEL)) spiel.cache.tilemap.remove(KARTENSCHLUESSEL);
  s.speicher.raeumeAuf();
}

/** Zahl der Hörer an den Ereignisquellen des Spiels (für die Prüfung auf Lecks, data-diagnose). */
function hoererzahl(spiel: Phaser.Game): number {
  const quellen: Phaser.Events.EventEmitter[] = [
    spiel.events,
    spiel.scale,
    spiel.textures,
    spiel.anims,
    spiel.registry.events,
    spiel.input.events,
  ];
  let zahl = 0;
  for (const q of quellen) for (const name of q.eventNames()) zahl += q.listenerCount(name);
  return zahl;
}

/** Kennzahlen des Spiels nach dem Aufbau einer Szene, an der Leinwand für die Prüfungen. */
function schreibeDiagnose(s: Sitzung): void {
  const { spiel } = s;
  const stand = s.speicher.stand();
  const diagnose = {
    szene: s.szenen,
    szenen: spiel.scene.scenes.length,
    hoerer: hoererzahl(spiel),
    animationen: spiel.anims.toJSON().anims.length,
    ...stand,
  };
  spiel.canvas?.setAttribute("data-diagnose", JSON.stringify(diagnose));
}

/** Startet die Szene einer Karte (die vorige ist dann schon weg, sonst geht sie hier). */
function starteSzene(s: Sitzung, daten: Szenendaten): void {
  ausserhalbDesTakts(s.spiel, () => {
    if (sitzung !== s || !s.element) return; // inzwischen beendet oder eingeschlafen
    if (s.spiel.scene.getScene(SZENE)) entferneSzene(s);
    // Faktor der Figuren dieser Karte (innen größer, weltmassstab.ts); figurbilder.ts liest ihn.
    s.spiel.registry.set(FIGURFAKTOR, daten.figurfaktor ?? 1);
    wecke(s.spiel);
    s.speicher.neueKarte();
    s.szenen += 1;
    s.spiel.canvas?.setAttribute("data-szene", String(s.szenen));
    const szene = new Oberweltszene(daten);
    // Erst anmelden, dann starten: Liegt alles schon im Texturspeicher, läuft create sofort.
    s.spiel.scene.add(SZENE, szene, false);
    szene.events.once(Phaser.Scenes.Events.CREATE, () => schreibeDiagnose(s));
    s.spiel.scene.start(SZENE);
  });
}

/**
 * Zeigt eine Karte im Element: beim ersten Mal startet das Spiel, danach nur eine neue Szene.
 * `vorStart` meldet Hörer am Spiel an, bevor die Szene startet.
 * Beispiel: Kartenwechsel mapleFalls.aussen → mapleFalls.wohnzimmer: gleiche Leinwand, gleicher
 * WebGL-Kontext, die Bögen von Held und Mama bleiben geladen.
 */
export function zeigeKarte(
  element: HTMLElement,
  daten: Szenendaten,
  vorStart: (spiel: Phaser.Game) => void = () => undefined,
): Phaser.Game {
  const s = sitzung ?? baueSitzung(element);
  sitzung = s;
  haengeAn(s, element);
  // Hörer am Spiel vor dem Start: Liegt alles im Texturspeicher, läuft create sofort.
  vorStart(s.spiel);
  const los = () => starteSzene(s, daten);
  if (s.spiel.isRunning) los();
  else s.wartet = los; // nur die zuletzt gewünschte Karte zählt
  return s.spiel;
}

/**
 * Baut die Karte ab (Kartenwechsel, Neuaufbau nach dem Warten, Verlassen): Szene weg, Leinwand
 * aus dem Rahmen, bis die nächste Karte geladen ist (sonst stünde das letzte Bild der alten Karte
 * still da), Takt angehalten.
 */
export function raeumeKarteAb(spiel: Phaser.Game): void {
  const s = sitzung;
  if (!s || s.spiel !== spiel) return;
  s.wartet = null;
  ausserhalbDesTakts(spiel, () => {
    try {
      entferneSzene(s);
      spiel.canvas?.remove();
      spiel.loop.sleep();
    } catch (fehler) {
      console.warn("Oberwelt: Karte konnte nicht sauber abgebaut werden:", fehler);
    }
  });
}

/**
 * Die Oberwelt verlässt den Bildschirm (Partie, Besprechung, Startkarte): Das Spiel schläft und
 * wird nach RUHEZEIT_MS beendet, wenn bis dahin keine Karte mehr kommt.
 */
export function legeSchlafen(): void {
  const s = sitzung;
  if (!s) return;
  s.wartet = null;
  s.beobachter?.disconnect();
  s.beobachter = null;
  s.element = null;
  if (s.ruhe) clearTimeout(s.ruhe);
  s.ruhe = setTimeout(beendeOberwelt, RUHEZEIT_MS);
}

/**
 * Beendet das Spiel sauber: Läuft Phaser noch hoch, erst nach dem Start zerstören; ein Fehler
 * dabei darf die App nicht abstürzen lassen.
 */
export function beendeOberwelt(): void {
  const s = sitzung;
  if (!s) return;
  sitzung = null;
  if (s.ruhe) clearTimeout(s.ruhe);
  s.beobachter?.disconnect();
  const { spiel } = s;
  const zerstoere = () => {
    try {
      // Phaser entfernt die Leinwand erst beim nächsten Bildaufbau; in einem gedrosselten Tab
      // (WebKit im Hintergrund) standen so kurz zwei Leinwände nebeneinander.
      spiel.canvas?.remove();
      spiel.destroy(true);
    } catch (fehler) {
      console.warn("Oberwelt konnte nicht sauber beendet werden:", fehler);
    }
  };
  if (spiel.isRunning) zerstoere();
  else spiel.events.once(Phaser.Core.Events.READY, () => queueMicrotask(zerstoere));
}

/** Die laufende Szene eines Spiels (nach dem Start). */
export function szeneVon(spiel: Phaser.Game): Oberweltszene | null {
  const szene = spiel.scene.getScene(SZENE);
  return szene instanceof Oberweltszene ? szene : null;
}
