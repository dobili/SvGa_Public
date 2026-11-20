/**
 * Maia ist Pflicht für das Abenteuer: „Spiel laden“ lädt Maia mit, als Teil des Spiels.
 *
 * Warum (Wunsch des Autors, 18.11.2026): Die Gegner im Spiel sollen so menschlich spielen wie die
 * Bots der App, und das leisten erst Maia zusammen mit Fehlerprofilen und Stilen. In der App bleibt
 * Maia freiwillig (Einstellungen, MaiaWahl.tsx); wer das Spiel lädt, bekommt es dazu. Ist Maia
 * schon da (vorher in der App geladen), wird nichts doppelt geladen.
 * Seit dem 20.11.2026 (Auftrag „Größe und Startzeit“) im Hintergrund: Vorher wartete der erste
 * Start auf alle 92 MB Maia; gedrosselt auf Mobilfunk mit 10 Mbit/s kam die Welt erst nach 95 s,
 * davon 73 s nur für Maia. Jetzt startet das Spiel nach dem Spielpaket; Maia lädt danach mit den
 * Geräuschen des Akts (paket/aktton.ts, ladeTonImHintergrund), und erst dann meldet das Spiel
 * „vollständig“. Eine Partie vorher spielt der Bot ohne Maia (useMaiaBereit in dienste.ts), die
 * nächste mit.
 * Abhängigkeiten: app/maiapaket.ts (Laden, Prüfen, Größe), paket/paketlader.ts (Spielpaket),
 * schnittstelle/paket.ts (Paketzustand).
 * Sonderfälle: Ohne Cache Storage meldet maiaGeladen „nein“; dann scheitert schon das Spielpaket
 * mit eigenem Fehler. Ohne Netz und ohne Maia startet ein vorhandenes Spiel trotzdem, nur ohne Maia
 * (Empfehlung umgesetzt, 18.11.2026: niemand soll vor einem gesperrten Spiel stehen); mit Netz
 * lädt es im Hintergrund weiter.
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
 * Eingaben: Zustand des Spielpakets allein, Maia-Zugriff. Ausgabe: „vorhanden“ bleibt vorhanden
 * (fehlt Maia, lädt es im Hintergrund nach); fehlt das Spielpaket, zählt die Größe Maia mit, wenn
 * es noch fehlt, denn es kommt beim ersten Start dazu.
 * Beispiel: Spielpaket fehlt (17 MB), Maia fehlt (96 MB) → { art: "fehlt", bytes: 113 MB }.
 * Eine neue Version auf dem Server („veraltet“) gilt mit Netz als „fehlt“ mit `neuerStand`: Die
 * Ansicht lädt sie dann gleich, der Spielstand bleibt; ohne Netz spielt man die alte Fassung weiter.
 */
export async function mitMaiaPflicht(
  spiel: Paketzustand,
  maia: Maiazugriff = MAIA_DER_APP,
): Promise<Paketzustand> {
  if (spiel.art === "veraltet") return maia.online() ? { art: "fehlt", neuerStand: true } : spiel;
  if (spiel.art !== "fehlt") return spiel;
  if (await maia.geladen()) return spiel;
  const maiaBytes = await maia.groesse();
  if (maiaBytes === undefined || spiel.bytes === undefined) return { art: "fehlt" };
  return { art: "fehlt", bytes: spiel.bytes + maiaBytes };
}

/** Der laufende Ladevorgang von Maia, damit es nicht doppelt lädt. */
let maiaVorgang: Promise<boolean> | null = null;

/**
 * Lädt Maia im Hintergrund, falls es fehlt und Netz da ist (einmal zugleich).
 * Ausgabe: true, wenn Maia danach auf dem Gerät liegt. Netzfehler ergeben false; Geladenes bleibt
 * im Cache, der nächste Aufruf macht weiter.
 */
export function ladeMaiaImHintergrund(
  fortschritt: Ladefortschritt,
  maia: Maiazugriff = MAIA_DER_APP,
): Promise<boolean> {
  maiaVorgang ??= (async () => {
    if (await maia.geladen()) return true;
    if (!maia.online()) return false;
    try {
      await maia.lade(fortschritt);
      await maia.melde();
      return true;
    } catch (fehler: unknown) {
      console.warn("Maia nicht nachgeladen", fehler);
      return false;
    }
  })().finally(() => {
    maiaVorgang = null;
  });
  return maiaVorgang;
}
