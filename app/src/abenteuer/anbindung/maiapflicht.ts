/**
 * Maia ist Pflicht für das Abenteuer: Das Spielpaket gilt erst als vorhanden, wenn auch das
 * Maia-Paket auf dem Gerät ist, und „Spiel laden“ lädt Maia mit.
 *
 * Warum (Wunsch des Autors, 18.11.2026): Die Gegner im Spiel sollen so menschlich spielen wie die
 * Bots der App, und das leisten erst Maia zusammen mit Fehlerprofilen und Stilen. In der App bleibt
 * Maia freiwillig (Einstellungen, MaiaWahl.tsx); wer das Spiel lädt, bekommt es dazu. Ist Maia
 * schon da (vorher in der App geladen), wird nichts doppelt geladen.
 * Abhängigkeiten: app/maiapaket.ts (Laden, Prüfen, Größe), paket/paketlader.ts (Spielpaket),
 * schnittstelle/paket.ts (Paketzustand).
 * Sonderfälle: Ohne Cache Storage meldet maiaGeladen „nein“; dann scheitert schon das Spielpaket
 * mit eigenem Fehler. Ohne Netz und ohne Maia startet ein vorhandenes Spiel trotzdem, nur ohne Maia
 * (Empfehlung umgesetzt, 18.11.2026: niemand soll vor einem gesperrten Spiel stehen); mit Netz
 * bietet die Startkarte das Laden wieder an.
 */
import {
  ladeMaia,
  maiaGeladen,
  maiaverzeichnis,
  paketBytes,
  pruefeMaia,
  type Ladefortschritt,
} from "../../app/maiapaket";
import type { Paketzustand } from "../schnittstelle/paket";

/** Hilfsfunktionen, die Tests ersetzen können (Standard: das echte Maia-Paket der App). */
export interface Maiazugriff {
  readonly geladen: () => Promise<boolean>;
  readonly groesse: () => Promise<number | undefined>;
  readonly lade: (fortschritt: Ladefortschritt) => Promise<void>;
  readonly melde: () => Promise<unknown>;
  /** Ist das Gerät gerade online? */
  readonly online: () => boolean;
}

/** Der echte Zugriff auf das Maia-Paket der App. */
export const MAIA_DER_APP: Maiazugriff = {
  geladen: () => maiaGeladen().catch(() => false),
  groesse: () => maiaverzeichnis().then(paketBytes, () => undefined),
  lade: ladeMaia,
  melde: pruefeMaia,
  online: () => typeof navigator === "undefined" || navigator.onLine,
};

/**
 * Zustand des Spielpakets mit Maia als Teil davon.
 * Eingaben: Zustand des Spielpakets allein, Maia-Zugriff. Ausgabe: derselbe Zustand, wenn Maia
 * da ist; sonst „fehlt“ mit der Größe, die noch zu laden ist (Spielpaket, falls es fehlt, plus Maia).
 * Beispiel: Spielpaket vorhanden, Maia fehlt (96 MB) → { art: "fehlt", bytes: 96 MB }; dasselbe
 * ohne Netz → „vorhanden“ (das Spiel läuft dann ohne Maia). Eine neue Version auf dem Server
 * („veraltet“) gilt mit Netz als „fehlt“ mit `neuerStand`: Die Ansicht lädt sie dann gleich, der
 * Spielstand bleibt; ohne Netz spielt man die alte Fassung weiter.
 */
export async function mitMaiaPflicht(
  spiel: Paketzustand,
  maia: Maiazugriff = MAIA_DER_APP,
): Promise<Paketzustand> {
  if (spiel.art === "veraltet") return maia.online() ? { art: "fehlt", neuerStand: true } : spiel;
  if (spiel.art !== "vorhanden" && spiel.art !== "fehlt") return spiel;
  if (await maia.geladen()) return spiel;
  if (spiel.art === "vorhanden" && !maia.online()) return spiel;
  const maiaBytes = await maia.groesse();
  const spielBytes = spiel.art === "fehlt" ? spiel.bytes : 0;
  if (maiaBytes === undefined || spielBytes === undefined) return { art: "fehlt" };
  return { art: "fehlt", bytes: spielBytes + maiaBytes };
}

/**
 * Lädt das Spielpaket und danach Maia (nur, wenn es fehlt), mit einem gemeinsamen Fortschritt.
 * Eingaben: Lader des Spielpakets, Fortschritt, Maia-Zugriff. Wirft bei Netzfehlern; Geladenes
 * bleibt in beiden Caches für den nächsten Versuch.
 */
export async function ladeSpielMitMaia(
  ladeSpiel: (fortschritt: Ladefortschritt) => Promise<void>,
  fortschritt: Ladefortschritt,
  maia: Maiazugriff = MAIA_DER_APP,
): Promise<void> {
  const fehltMaia = !(await maia.geladen());
  let spiel = { geladen: 0, gesamt: 0 };
  let teilMaia = { geladen: 0, gesamt: fehltMaia ? ((await maia.groesse()) ?? 0) : 0 };
  const melde = () =>
    fortschritt(spiel.geladen + teilMaia.geladen, Math.max(1, spiel.gesamt + teilMaia.gesamt));
  await ladeSpiel((geladen, gesamt) => {
    spiel = { geladen, gesamt };
    melde();
  });
  if (fehltMaia) {
    await maia.lade((geladen, gesamt) => {
      teilMaia = { geladen, gesamt };
      melde();
    });
  }
  await maia.melde();
}
