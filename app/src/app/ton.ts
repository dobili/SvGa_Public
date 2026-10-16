/**
 * Töne beim Ziehen: ein kurzes Klacken für einen Zug, ein kräftigeres für einen Schlag.
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Einstellungen: … Ton“. Seit 0.2.33 (Frage des Autors nach
 * den versprochenen Tönen). Die Töne werden im Browser erzeugt (Web Audio: gefiltertes Rauschen
 * mit schnell abklingender Lautstärke), es gibt also keine Tondateien und keine Lizenzfragen; sie
 * klingen offline wie online. Standard ist „aus“ (Einstellungen).
 * iPhone und iPad spielen Töne erst nach einer Berührung: Deshalb weckt der erste Tipp auf der
 * Seite den Tonerzeuger (entsperreTon, in App.tsx angemeldet).
 * Abhängigkeiten: keine (Browser-Schnittstelle AudioContext).
 */

export type Zugton = "zug" | "schlag";

/** Klang je Art: Mittenfrequenz des Filters (Hz), Dauer (s), Lautstärke (0 bis 1). */
const KLANG: Readonly<Record<Zugton, { frequenz: number; dauer: number; lautstaerke: number }>> = {
  zug: { frequenz: 1800, dauer: 0.06, lautstaerke: 0.5 },
  schlag: { frequenz: 900, dauer: 0.11, lautstaerke: 0.8 },
};
/** Güte des Bandpasses: höher klingt holziger, niedriger rauschiger. */
const FILTERGUETE = 3;
/** Lautstärke, auf die der Ton abklingt (exponentiell darf nicht bis 0). */
const STILLE = 0.001;

let erzeuger: AudioContext | null = null;

function holeErzeuger(): AudioContext | null {
  if (erzeuger) return erzeuger;
  if (typeof window === "undefined" || typeof window.AudioContext !== "function") return null;
  erzeuger = new window.AudioContext();
  return erzeuger;
}

/**
 * Weckt den Tonerzeuger; aufzurufen bei einer Berührung des Lesers (Vorgabe von Safari).
 * Sonderfall: Ohne Web Audio (alte Browser, Tests) geschieht nichts.
 */
export function entsperreTon(): void {
  const ctx = holeErzeuger();
  if (ctx && ctx.state === "suspended") {
    ctx.resume().catch((fehler: unknown) => {
      // Kein Ton ist kein Fehler für den Leser; für die Fehlersuche in der Konsole vermerken.
      console.warn("Ton nicht verfügbar:", fehler);
    });
  }
}

/** Ein Rauschpuffer der gegebenen Länge (weißes Rauschen, ein Kanal). */
function rauschen(ctx: AudioContext, dauer: number): AudioBuffer {
  const puffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dauer), ctx.sampleRate);
  const werte = puffer.getChannelData(0);
  for (let i = 0; i < werte.length; i++) werte[i] = Math.random() * 2 - 1;
  return puffer;
}

/**
 * Spielt den Ton zu einem Zug.
 *
 * Eingabe: „zug“ oder „schlag“. Beispiel: Abb. 1.26, Ziehen Sf3–g5 klackt leise; ein Schlag
 * klackt tiefer und lauter. Sonderfall: Ohne Web Audio oder vor der ersten Berührung bleibt es
 * still.
 */
export function spieleZugton(art: Zugton): void {
  const ctx = holeErzeuger();
  if (!ctx || ctx.state !== "running") return;
  const { frequenz, dauer, lautstaerke } = KLANG[art];
  const quelle = ctx.createBufferSource();
  quelle.buffer = rauschen(ctx, dauer);
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = frequenz;
  filter.Q.value = FILTERGUETE;
  const lautstaerkeRegler = ctx.createGain();
  const jetzt = ctx.currentTime;
  lautstaerkeRegler.gain.setValueAtTime(lautstaerke, jetzt);
  lautstaerkeRegler.gain.exponentialRampToValueAtTime(STILLE, jetzt + dauer);
  quelle.connect(filter).connect(lautstaerkeRegler).connect(ctx.destination);
  quelle.start(jetzt);
  quelle.stop(jetzt + dauer);
}
