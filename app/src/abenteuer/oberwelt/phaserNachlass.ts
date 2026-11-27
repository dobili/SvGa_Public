/**
 * Räumt auf, was Phaser beim Beenden eines Spiels im Dokument zurücklässt.
 *
 * Warum: Bis zum 26.11.2026 startete jede Karte ein eigenes Phaser-Spiel; seitdem gibt es eines je
 * Sitzung in der Oberwelt (oberweltspiel.ts), das nach dem Verlassen und einer Ruhezeit endet und
 * beim nächsten Besuch neu startet. Der Baustein bleibt dafür nötig. Phaser 4 hängt beim Start
 * (Game.start → VisibilityHandler) einen namenlosen Hörer „visibilitychange“ an das Dokument und
 * setzt window.onblur/onfocus; beim Beenden (game.destroy) nimmt es beides nicht zurück. Die
 * Ausdauerprüfung (tests/e2e/abenteuer-ausdauer.spec.ts, 19.11.2026) fand so nach 28 Kartenwechseln
 * 28 tote Hörer, die je ein beendetes Spiel festhalten und beim Weglegen des Handys alle feuern.
 * Wie: Phaser meldet READY unmittelbar vor Game.start, im selben Takt. Ab READY merkt sich dieser
 * Baustein bis zum Ende des Takts jeden Hörer „visibilitychange“, den jemand an das Dokument hängt,
 * und nimmt ihn bei DESTROY wieder ab; window.onblur/onfocus setzt er zurück, wenn sie noch die des
 * Spiels sind.
 * Abhängigkeiten: keine (die Namen der Phaser-Ereignisse stehen unten, damit der Baustein ohne
 * Browser testbar bleibt).
 */

/** Phaser.Core.Events.READY und .DESTROY (phaser/src/core/events). */
const BEREIT = "ready";
const ENDE = "destroy";

/** Der kleinste Teil eines Phaser-Spiels, den das Aufräumen braucht (für Tests ersetzbar). */
export interface Spielereignisse {
  readonly events: {
    once(name: string, fn: () => void): unknown;
  };
}

/** Was vom Fenster gebraucht wird: die beiden Felder, die Phaser setzt. */
export interface Fensterfokus {
  onblur: unknown;
  onfocus: unknown;
}

/** Ein angehängter Hörer, wie ihn addEventListener bekam. */
interface Hoerer {
  readonly art: string;
  readonly fn: EventListenerOrEventListenerObject;
  readonly optionen: boolean | AddEventListenerOptions | undefined;
}

const SICHTBARKEIT = /visibilitychange$/;

/**
 * Merkt sich ab READY bis zum Ende des laufenden Takts die Sichtbarkeitshörer des Spiels und gibt
 * sie bei DESTROY frei. Beispiel: Kartenwechsel von mapleFalls.aussen nach riverton.aussen: Der
 * Hörer des alten Spiels verschwindet, nur der des neuen bleibt.
 * Sonderfall: Hängt im selben Takt jemand anderes einen Sichtbarkeitshörer an, gehört er auch zum
 * Spiel (in der App startet in diesem Takt nur Phaser).
 */
export function raeumePhaserNachlassAuf(
  spiel: Spielereignisse,
  dokument: Pick<Document, "addEventListener" | "removeEventListener"> = document,
  fenster: Fensterfokus = window,
): void {
  const gemerkt: Hoerer[] = [];
  let blur: unknown = null;
  let focus: unknown = null;
  spiel.events.once(BEREIT, () => {
    const vorher = dokument.addEventListener;
    const eigen = Object.prototype.hasOwnProperty.call(dokument, "addEventListener");
    const echt = vorher.bind(dokument);
    dokument.addEventListener = ((
      art: string,
      fn: EventListenerOrEventListenerObject,
      optionen?: boolean | AddEventListenerOptions,
    ) => {
      if (SICHTBARKEIT.test(art)) gemerkt.push({ art, fn, optionen });
      echt(art, fn, optionen);
    }) as typeof dokument.addEventListener;
    // Game.start läuft nach READY im selben Takt; danach gilt wieder das echte addEventListener.
    queueMicrotask(() => {
      // Im Browser gehört addEventListener dem Prototyp: das eigene Feld löschen genügt.
      if (eigen) dokument.addEventListener = vorher;
      else delete (dokument as { addEventListener?: unknown }).addEventListener;
      blur = fenster.onblur;
      focus = fenster.onfocus;
    });
  });
  spiel.events.once(ENDE, () => {
    for (const h of gemerkt.splice(0)) dokument.removeEventListener(h.art, h.fn, h.optionen);
    if (blur && fenster.onblur === blur) fenster.onblur = null;
    if (focus && fenster.onfocus === focus) fenster.onfocus = null;
  });
}
