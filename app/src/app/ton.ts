/**
 * Töne beim Ziehen: ein kurzes Klacken für einen Zug, ein kräftigeres für einen Schlag, dazu ein
 * Klang für Schach, Matt und Remis und ein Warnton, wenn eine Figur angetippt wird, die nicht
 * ziehen darf (Wunsch des Autors).
 *
 * Rolle im Gesamtbild: Pflichtenheft 4 „Einstellungen: … Ton“. Die Töne werden im Browser
 * erzeugt (Web Audio: gefiltertes Rauschen mit schnell abklingender Lautstärke), es gibt also
 * keine Tondateien und keine Lizenzfragen; sie klingen offline wie online. Standard ist „aus“
 * (Einstellungen).
 * iPhone und iPad spielen Töne erst nach einer Berührung: Deshalb weckt der erste Tipp auf der
 * Seite den Tonerzeuger (entsperreTon, in App.tsx angemeldet).
 * Abhängigkeiten: keine (Browser-Schnittstelle AudioContext).
 */

export type Zugton = "zug" | "schlag";
/**
 * Klänge aus Sinustönen: Schach (ein Ton), Matt (drei fallende), Remis (zwei gleiche), Warnung
 * (tief), Feier (steigender Dur-Dreiklang bis zur Oktave, seit 0.2.144 für die Freischaltung einer
 * Gruppe, Wunsch des Autors 25.10.2026: „einen schönen Ton dazu“), Sieg (kurz steigend, nach einer
 * gewonnenen Partie).
 */
export type Klangton = "schach" | "matt" | "remis" | "warnung" | "feier" | "sieg";
export type Ton = Zugton | Klangton;

/** Klang je Art: Mittenfrequenz des Filters (Hz), Dauer (s), Lautstärke (0 bis 1). */
const KLANG: Readonly<Record<Zugton, { frequenz: number; dauer: number; lautstaerke: number }>> = {
  zug: { frequenz: 1800, dauer: 0.06, lautstaerke: 0.5 },
  schlag: { frequenz: 900, dauer: 0.11, lautstaerke: 0.8 },
};
/** Tonfolgen je Klang: Frequenzen (Hz) nacheinander, Dauer je Ton (s), Lautstärke. */
const TONFOLGE: Readonly<
  Record<Klangton, { frequenzen: readonly number[]; dauer: number; lautstaerke: number }>
> = {
  schach: { frequenzen: [880], dauer: 0.16, lautstaerke: 0.35 },
  matt: { frequenzen: [784, 659, 523], dauer: 0.18, lautstaerke: 0.4 },
  remis: { frequenzen: [587, 587], dauer: 0.16, lautstaerke: 0.3 },
  warnung: { frequenzen: [220], dauer: 0.12, lautstaerke: 0.3 },
  sieg: { frequenzen: [659, 784, 1047], dauer: 0.12, lautstaerke: 0.25 },
  feier: { frequenzen: [523, 659, 784, 1047, 784, 1047], dauer: 0.14, lautstaerke: 0.3 },
};
/** Ein Zug und sein Klang (Schach, Matt) folgen aufeinander: so lange wartet der Klang (s). */
const KLANG_VERSATZ = 0.08;
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

/**
 * Spielt einen Klang aus Sinustönen (Schach, Matt, Remis, Warnung), kurz nach einem Zugton.
 *
 * Eingabe: die Art. Beispiel: 4. Dxf7#: erst das Klacken des Schlags, dann drei fallende Töne.
 * Sonderfall: Ohne Web Audio oder vor der ersten Berührung bleibt es still.
 */
export function spieleKlang(art: Klangton): void {
  const ctx = holeErzeuger();
  if (!ctx || ctx.state !== "running") return;
  const { frequenzen, dauer, lautstaerke } = TONFOLGE[art];
  frequenzen.forEach((frequenz, i) => {
    const beginn = ctx.currentTime + KLANG_VERSATZ + i * dauer;
    const quelle = ctx.createOscillator();
    quelle.type = "sine";
    quelle.frequency.value = frequenz;
    const regler = ctx.createGain();
    regler.gain.setValueAtTime(lautstaerke, beginn);
    regler.gain.exponentialRampToValueAtTime(STILLE, beginn + dauer);
    quelle.connect(regler).connect(ctx.destination);
    quelle.start(beginn);
    quelle.stop(beginn + dauer);
  });
}

/** Spielt einen Ton beliebiger Art: Zugtöne als Klacken, Klänge als Tonfolge. */
export function spieleTon(art: Ton): void {
  if (art === "zug" || art === "schlag") spieleZugton(art);
  else spieleKlang(art);
}

/** Grundton der Kombo (Hz, e''), kurz und leise; je Halbton höher um den Faktor 2^(1/12). */
const KOMBO_GRUNDTON = 659;
const KOMBO_DAUER = 0.12;
const KOMBO_LAUTSTAERKE = 0.22;
const HALBTOENE_JE_OKTAVE = 12;

/**
 * Spielt den Ton der Kombo (Gamifizierung P10): ein kurzer Sinuston, je richtiger Antwort in
 * Folge einen Halbton höher (training/kombo.ts, komboHalbtoene).
 *
 * Eingabe: Halbtöne über dem Grundton. Beispiel: dritte richtige Antwort in Folge → 0 (659 Hz),
 * fünfte → 2 (etwa 740 Hz). Sonderfall: Ohne Web Audio oder vor der ersten Berührung bleibt es
 * still.
 */
export function spieleKomboton(halbtoene: number): void {
  const ctx = holeErzeuger();
  if (!ctx || ctx.state !== "running") return;
  const beginn = ctx.currentTime + KLANG_VERSATZ;
  const quelle = ctx.createOscillator();
  quelle.type = "sine";
  quelle.frequency.value = KOMBO_GRUNDTON * 2 ** (halbtoene / HALBTOENE_JE_OKTAVE);
  const regler = ctx.createGain();
  regler.gain.setValueAtTime(KOMBO_LAUTSTAERKE, beginn);
  regler.gain.exponentialRampToValueAtTime(STILLE, beginn + KOMBO_DAUER);
  quelle.connect(regler).connect(ctx.destination);
  quelle.start(beginn);
  quelle.stop(beginn + KOMBO_DAUER);
}
